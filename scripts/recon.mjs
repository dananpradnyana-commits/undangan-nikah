import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const TARGET_URL = 'https://awsbali.com/dewadhar_gekcantik/?to=Krisna';
const REF_DIR = 'docs/design-references';
const RES_DIR = 'docs/research';

async function main() {
  await fs.mkdir(REF_DIR, { recursive: true });
  await fs.mkdir(path.join(RES_DIR, 'components'), { recursive: true });

  const browser = await chromium.launch({ headless: true });

  // 1. Desktop Reconnaissance (1440x900)
  const desktopCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await desktopCtx.newPage();
  console.log('Opening target URL (Desktop 1440x900)...');
  await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3500);

  // Screenshot State 1: Cover Modal (Halaman Awal)
  await page.screenshot({ path: `${REF_DIR}/01-cover-desktop.png` });
  console.log('✓ Captured 01-cover-desktop.png');

  // Extract State 1 Cover Computed Styles
  const coverStyles = await page.evaluate(() => {
    const pick = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const cs = getComputedStyle(el);
      return {
        text: el.textContent?.trim(),
        fontFamily: cs.fontFamily,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        lineHeight: cs.lineHeight,
        letterSpacing: cs.letterSpacing,
        color: cs.color,
        backgroundColor: cs.backgroundColor,
        backgroundImage: cs.backgroundImage,
        backgroundPosition: cs.backgroundPosition,
        backgroundSize: cs.backgroundSize,
        padding: cs.padding,
        margin: cs.margin,
        borderRadius: cs.borderRadius,
        border: cs.border,
        boxShadow: cs.boxShadow,
        width: cs.width,
        height: cs.height,
        opacity: cs.opacity,
      };
    };
    return {
      modalx: pick('.modalx'),
      overlayy: pick('.overlayy'),
      infoModalx: pick('.info_modalx'),
      coverImg: pick('.info_modalx .elementor-image img'),
      dear: pick('.wdp-dear'),
      name: pick('.wdp-name'),
      disclaimer: pick('.wdp-text'),
      openBtn: pick('#wdp-button-wrapper button'),
    };
  });

  // Click "Buka Undangan" to transition to State 2 (Halaman Isi Undangan)
  console.log('Clicking "Buka Undangan"...');
  await page.click('#wdp-button-wrapper button');
  await page.waitForTimeout(1200);

  // Slowly scroll down to trigger ALL IntersectionObservers / Elementor animations / CommentKit AJAX
  const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y <= scrollHeight + 1200; y += 450) {
    await page.evaluate((pos) => window.scrollTo({ top: pos, behavior: 'instant' }), y);
    await page.waitForTimeout(350);
  }
  await page.waitForTimeout(2500);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(800);

  // Screenshot full State 2 Desktop
  await page.screenshot({ path: `${REF_DIR}/02-main-full-desktop.png`, fullPage: true });
  console.log('✓ Captured 02-main-full-desktop.png');

  // Screenshot individual sections
  const sections = [
    { id: '24c321b3', name: 'section-01-hero' },
    { id: '66ae2908', name: 'section-02-quote' },
    { id: '63145f74', name: 'section-03-couple' },
    { id: '7b9b6c41', name: 'section-04-event' },
    { id: '14b6a9b0', name: 'section-05-gallery-1' },
    { id: '751d187e', name: 'section-06-guestbook' },
    { id: '0339355', name: 'section-07-gallery-2' },
    { id: '558cf85', name: 'section-08-share-moment' },
    { id: '52d63dfb', name: 'section-09-gallery-3' },
    { id: '1d6ffa83', name: 'section-10-matur-suksma' },
    { id: '38238e0a', name: 'section-11-couple-banner' },
    { id: '5d7a33c3', name: 'section-12-footer' },
  ];

  for (const s of sections) {
    const loc = page.locator(`section[data-id="${s.id}"]`);
    if (await loc.count() > 0) {
      await loc.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await loc.screenshot({ path: `${REF_DIR}/${s.name}-desktop.png` }).catch(() => {});
    }
  }

  // Extract section styles + rendered WeddingPress comments (including attendance badges!)
  const mainData = await page.evaluate(() => {
    const pick = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const cs = getComputedStyle(el);
      return {
        text: el.textContent?.trim()?.slice(0, 200),
        fontFamily: cs.fontFamily,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        fontStyle: cs.fontStyle,
        lineHeight: cs.lineHeight,
        letterSpacing: cs.letterSpacing,
        color: cs.color,
        backgroundColor: cs.backgroundColor,
        backgroundImage: cs.backgroundImage,
        padding: cs.padding,
        margin: cs.margin,
        borderRadius: cs.borderRadius,
        border: cs.border,
        boxShadow: cs.boxShadow,
        textShadow: cs.textShadow,
      };
    };

    const renderedComments = [...document.querySelectorAll('#wdp-container-comment-21643 li.wdp-item-comment')].map(li => {
      const author = li.querySelector('.wdp-commenter-name')?.textContent?.trim() || '';
      const badge = li.querySelector('.wdp-confirm')?.textContent?.trim() || '';
      const time = li.querySelector('.wdp-comment-time')?.textContent?.trim() || '';
      const text = li.querySelector('.wdp-comment-text')?.textContent?.trim() || '';
      return { author, badge, time, text };
    });

    return {
      heroTitle: pick('.elementor-element-3fef832 .elementor-heading-title'),
      heroNames: pick('.elementor-element-967ea54 .elementor-heading-title'),
      saveTheDate: pick('.elementor-element-6a7b9a3a .elementor-heading-title'),
      countdownDigits: pick('.wpkoi-elements-countdown-digits'),
      countdownLabel: pick('.wpkoi-elements-countdown-label'),
      quoteCard: pick('.elementor-element-7325ffb0 > .elementor-element-populated'),
      coupleCard: pick('.elementor-element-70e863d5 > .elementor-element-populated'),
      groomPhoto: pick('.elementor-element-1493312d img'),
      groomNick: pick('.elementor-element-6420e486 .elementor-heading-title'),
      groomFull: pick('.elementor-element-82a540d .elementor-heading-title'),
      groomParents: pick('.elementor-element-7fa67176 .elementor-heading-title'),
      eventTitle: pick('.elementor-element-3954ae92 .elementor-heading-title'),
      viewMapBtn: pick('.elementor-element-49573709 .elementor-button'),
      audioWidget: pick('#audio-container .elementor-icon'),
      renderedCommentsCount: renderedComments.length,
      renderedComments,
    };
  });

  await desktopCtx.close();

  // 2. Mobile Reconnaissance (390x844)
  const mobileCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const mPage = await mobileCtx.newPage();
  console.log('Opening target URL (Mobile 390x844)...');
  await mPage.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await mPage.waitForTimeout(3000);
  await mPage.screenshot({ path: `${REF_DIR}/01-cover-mobile.png` });
  console.log('✓ Captured 01-cover-mobile.png');

  await mPage.click('#wdp-button-wrapper button');
  await mPage.waitForTimeout(1000);
  const mScrollHeight = await mPage.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y <= mScrollHeight + 1200; y += 450) {
    await mPage.evaluate((pos) => window.scrollTo({ top: pos, behavior: 'instant' }), y);
    await mPage.waitForTimeout(300);
  }
  await mPage.waitForTimeout(1500);
  await mPage.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await mPage.waitForTimeout(500);
  await mPage.screenshot({ path: `${REF_DIR}/02-main-full-mobile.png`, fullPage: true });
  console.log('✓ Captured 02-main-full-mobile.png');

  await mobileCtx.close();
  await browser.close();

  await fs.writeFile(
    `${RES_DIR}/extracted-data.json`,
    JSON.stringify({ coverStyles, mainData }, null, 2),
    'utf-8'
  );
  console.log(`✓ Saved ${RES_DIR}/extracted-data.json (${mainData.renderedCommentsCount} live WeddingPress comments extracted!)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
