import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs/promises';

const BASE_URL = process.env.QA_URL || 'http://localhost:3000/?to=Krisna';
const OUT_DIR = path.join(process.cwd(), 'docs', 'design-references');

async function runQa() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true });

  const consoleErrors = [];

  // 1. Desktop QA (1440x900)
  const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await desktopContext.newPage();
  page.on('pageerror', (err) => consoleErrors.push(`PageError: ${err.message}`));
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(`ConsoleError: ${msg.text()}`);
  });

  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1000);

  // Verify State 1: Cover Modal & Guest Name "Krisna"
  const guestNameText = await page.locator('.namatamu').textContent();
  console.log('Desktop Cover Guest Name:', guestNameText?.trim());
  await page.screenshot({ path: path.join(OUT_DIR, 'qa-01-cover-desktop.png') });

  // Click "Buka Undangan" -> State 2: Main Invitation
  await page.getByRole('button', { name: /Buka Undangan/i }).click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUT_DIR, 'qa-02-hero-desktop.png') });

  // Scroll smoothly through the entire page to trigger all IntersectionObserver animations & lazy images
  const totalHeight = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y <= totalHeight; y += 500) {
    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
    await page.waitForTimeout(180);
  }
  await page.waitForTimeout(600);

  // Capture specific sections for side-by-side comparison
  await page.locator('[data-id="63145f74"]').scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(OUT_DIR, 'qa-03-couple-desktop.png') });

  await page.locator('[data-id="7b9b6c41"]').scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(OUT_DIR, 'qa-04-event-desktop.png') });

  await page.locator('[data-id="guestbook"]').scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(OUT_DIR, 'qa-05-guestbook-desktop.png') });

  await page.locator('[data-id="558cf85"]').scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(OUT_DIR, 'qa-06-share-moment-desktop.png') });

  await page.locator('[data-id="couple-banner"]').scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(OUT_DIR, 'qa-07-banner-footer-desktop.png') });

  // Test Lightbox click & close
  await page.locator('[data-id="gallery-part-1"] button').first().scrollIntoViewIfNeeded();
  await page.locator('[data-id="gallery-part-1"] button').first().click();
  await page.waitForTimeout(350);
  await page.screenshot({ path: path.join(OUT_DIR, 'qa-08-lightbox-desktop.png') });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(250);

  // 2. Mobile QA (390x844)
  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mPage = await mobileContext.newPage();
  await mPage.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await mPage.evaluate(() => document.fonts.ready);
  await mPage.waitForTimeout(800);
  await mPage.screenshot({ path: path.join(OUT_DIR, 'qa-01-cover-mobile.png') });

  await mPage.getByRole('button', { name: /Buka Undangan/i }).click();
  await mPage.waitForTimeout(800);
  await mPage.screenshot({ path: path.join(OUT_DIR, 'qa-02-hero-mobile.png') });

  const mTotalHeight = await mPage.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y <= mTotalHeight; y += 500) {
    await mPage.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
    await mPage.waitForTimeout(150);
  }
  await mPage.evaluate(() => window.scrollTo(0, 0));
  await mPage.waitForTimeout(400);

  // Check horizontal overflow on mobile
  const hasOverflow = await mPage.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth
  );
  console.log('Mobile Horizontal Overflow:', hasOverflow);
  console.log('Console/Page Errors Count:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.log('Errors:', consoleErrors);
  }

  await browser.close();
}

runQa().catch((err) => {
  console.error(err);
  process.exit(1);
});
