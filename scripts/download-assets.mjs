import fs from 'node:fs/promises';
import path from 'node:path';

const ASSETS = [
  // Cover & Backgrounds
  { url: 'https://storage.googleapis.com/stateless-swalapatra-com/2022/11/e7c44832-background.jpeg', dest: 'public/images/cover-bg.jpeg' },
  { url: 'https://storage.googleapis.com/stateless-swalapatra-com/2023/02/3baab5b7-mx4_3022.jpg', dest: 'public/images/cover-photo.jpg' },
  { url: 'https://storage.googleapis.com/stateless-swalapatra-com/2023/02/4ec499af-cvr.jpg', dest: 'public/images/hero-cvr.jpg' },
  { url: 'https://storage.googleapis.com/stateless-swalapatra-com/2023/02/80eed4f5-bg.jpg', dest: 'public/images/event-bg.jpg' },
  { url: 'https://storage.googleapis.com/stateless-swalapatra-com/2023/02/0778ba20-bg4.jpg', dest: 'public/images/footer-banner-bg.jpg' },
  { url: 'https://storage.googleapis.com/stateless-swalapatra-com/2022/12/602df806-bg-pattern.png', dest: 'public/images/bg-pattern.png' },
  { url: 'https://storage.googleapis.com/stateless-swalapatra-com/2023/02/39b71df7-tum.jpg', dest: 'public/images/og-thumb.jpg' },

  // Ornaments & Logos
  { url: 'https://storage.googleapis.com/stateless-swalapatra-com/2022/11/db822cc5-flower.png', dest: 'public/images/flower-ornament.png' },
  { url: 'https://storage.googleapis.com/stateless-swalapatra-com/2022/12/345dfe2b-leaves-gold-divider-ptsd9ydbcwhhbb2jkonn21n0w8vtqyp4vffp5pvtba.png', dest: 'public/images/leaves-gold-divider.png' },
  { url: 'https://storage.googleapis.com/stateless-swalapatra-com/2022/12/e4e9f1f8-logo3-300x300.png', dest: 'public/images/couple-monogram.png' },
  { url: 'https://storage.googleapis.com/stateless-swalapatra-com/2022/11/d621945d-logo-undangan-online-bali-small.png', dest: 'public/images/logo-undangan-bali.png' },
  { url: 'https://storage.googleapis.com/stateless-swalapatra-com/2022/06/94293a23-cropped-logo-aws-bali-com-192x192.png', dest: 'public/seo/favicon-192.png' },
  { url: 'https://storage.googleapis.com/stateless-swalapatra-com/2022/06/94293a23-cropped-logo-aws-bali-com-32x32.png', dest: 'public/seo/favicon-32.png' },

  // Couple Portraits
  { url: 'https://storage.googleapis.com/stateless-swalapatra-com/2023/02/f8e8bcc2-mx4_2823.jpg', dest: 'public/images/groom.jpg' },
  { url: 'https://storage.googleapis.com/stateless-swalapatra-com/2023/02/b063d7f7-mx4_2807.jpg', dest: 'public/images/bride.jpg' },

  // Gallery 1 (6 photos)
  { url: 'https://storage.googleapis.com/stateless-swalapatra-com/2023/02/08b3e501-mx4_3276-copy.jpg', dest: 'public/images/gallery/g1-1.jpg' },
  { url: 'https://storage.googleapis.com/stateless-swalapatra-com/2023/02/836bc4e5-mx4_3261.jpg', dest: 'public/images/gallery/g1-2.jpg' },
  { url: 'https://storage.googleapis.com/stateless-swalapatra-com/2023/02/2a49d380-mx4_3143.jpg', dest: 'public/images/gallery/g1-3.jpg' },
  { url: 'https://storage.googleapis.com/stateless-swalapatra-com/2023/02/0899fb48-mx4_3022.jpg', dest: 'public/images/gallery/g1-4.jpg' },
  { url: 'https://storage.googleapis.com/stateless-swalapatra-com/2023/02/9a4474d9-mx4_2980.jpg', dest: 'public/images/gallery/g1-5.jpg' },
  { url: 'https://storage.googleapis.com/stateless-swalapatra-com/2023/02/42c29673-mx4_2814.jpg', dest: 'public/images/gallery/g1-6.jpg' },

  // Gallery 2 (6 photos)
  { url: 'https://storage.googleapis.com/stateless-swalapatra-com/2023/02/d6bb5714-che04350.jpg', dest: 'public/images/gallery/g2-1.jpg' },
  { url: 'https://storage.googleapis.com/stateless-swalapatra-com/2023/02/074245a6-che04229.jpg', dest: 'public/images/gallery/g2-2.jpg' },
  { url: 'https://storage.googleapis.com/stateless-swalapatra-com/2023/02/43a35adf-che04170.jpg', dest: 'public/images/gallery/g2-3.jpg' },
  { url: 'https://storage.googleapis.com/stateless-swalapatra-com/2023/02/a96f123b-che04151.jpg', dest: 'public/images/gallery/g2-4.jpg' },
  { url: 'https://storage.googleapis.com/stateless-swalapatra-com/2023/02/c474cf9d-che04109.jpg', dest: 'public/images/gallery/g2-5.jpg' },
  { url: 'https://storage.googleapis.com/stateless-swalapatra-com/2023/02/6def249d-bg.jpg', dest: 'public/images/gallery/g2-6.jpg' },

  // Gallery 3 (4 photos)
  { url: 'https://storage.googleapis.com/stateless-swalapatra-com/2023/02/0787ef57-igo04635-edit.jpg', dest: 'public/images/gallery/g3-1.jpg' },
  { url: 'https://storage.googleapis.com/stateless-swalapatra-com/2023/02/d4300ae0-igo04545-edit.jpg', dest: 'public/images/gallery/g3-2.jpg' },
  { url: 'https://storage.googleapis.com/stateless-swalapatra-com/2023/02/8a15967a-bg2.jpg', dest: 'public/images/gallery/g3-3.jpg' },
  { url: 'https://storage.googleapis.com/stateless-swalapatra-com/2023/02/0c0c4100-igo04741-edit.jpg', dest: 'public/images/gallery/g3-4.jpg' },

  // Gallery 4 (4 photos)
  { url: 'https://storage.googleapis.com/stateless-swalapatra-com/2023/02/7c51e05c-bg3.jpg', dest: 'public/images/gallery/g4-1.jpg' },
  { url: 'https://storage.googleapis.com/stateless-swalapatra-com/2023/02/5f059b44-igo03112-edit.jpg', dest: 'public/images/gallery/g4-2.jpg' },
  { url: 'https://storage.googleapis.com/stateless-swalapatra-com/2023/02/bdf6f5ef-igo03267-edit.jpg', dest: 'public/images/gallery/g4-3.jpg' },
  { url: 'https://storage.googleapis.com/stateless-swalapatra-com/2023/02/1034c6dc-igo04000-edit.jpg', dest: 'public/images/gallery/g4-4.jpg' },

  // Background Music MP3
  { url: "https://myevent.id/master/music/Jason%20Mraz%20-%20Let's%20See%20What%20the%20Night%20Can%20Do%20(Official%20Lyric%20Video)%20(128%20kbps).mp3", dest: 'public/audio/song.mp3' }
];

async function downloadItem({ url, dest }) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.writeFile(dest, buf);
    console.log(`✓ ${dest} (${(buf.length / 1024).toFixed(1)} KB)`);
    return { dest, ok: true, size: buf.length };
  } catch (err) {
    console.error(`✗ ${dest}: ${err.message}`);
    return { dest, ok: false, error: err.message };
  }
}

async function main() {
  const results = [];
  for (let i = 0; i < ASSETS.length; i += 4) {
    const batch = ASSETS.slice(i, i + 4);
    const r = await Promise.all(batch.map(downloadItem));
    results.push(...r);
  }
  const okCount = results.filter(r => r.ok).length;
  console.log(`\nDownloaded ${okCount}/${ASSETS.length} assets.`);
}

main();
