import fs from 'node:fs/promises';

async function main() {
  const raw = JSON.parse(await fs.readFile('docs/research/extracted-data.json', 'utf-8'));
  const list = raw.mainData.renderedComments || [];

  const filtered = list
    .filter((c) => {
      const lower = (c.text + ' ' + c.author).toLowerCase();
      if (lower.includes('pharma') || lower.includes('drugstore') || lower.includes('bgguhhj')) {
        return false;
      }
      return c.author && c.text;
    })
    .map((c, idx) => {
      const lower = c.text.toLowerCase();
      const cannotAttend =
        lower.includes('berhalangan') ||
        lower.includes('tan preside hadir') ||
        lower.includes('tidak bisa hadir') ||
        lower.includes('belum bisa hadir');
      return {
        id: 1000 - idx,
        author: c.author,
        message: c.text,
        attendance: cannotAttend ? 'Tidak hadir' : 'Hadir',
        date: new Date().toISOString(),
        relativeTime: c.time || '2 tahun lalu',
      };
    });

  await fs.mkdir('src/data', { recursive: true });
  await fs.writeFile('src/data/comments.json', JSON.stringify(filtered, null, 2), 'utf-8');
  console.log(`✓ Prepared ${filtered.length} clean guestbook wishes in src/data/comments.json`);
}

main();
