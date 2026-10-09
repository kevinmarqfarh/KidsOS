// Kör efter att fotografier eller credits.json uppdaterats.
import { readFileSync, writeFileSync } from 'node:fs';
const root = new URL('../', import.meta.url);
const credits = JSON.parse(readFileSync(new URL('src/assets/photos/credits.json', root), 'utf8'));
const photos = Object.fromEntries(Object.entries(credits).map(([id, item]) => {
  const mime = item.path.endsWith('.png') ? 'png' : item.path.endsWith('.webp') ? 'webp' : 'jpeg';
  return [id, { ...item, data: `data:image/${mime};base64,${readFileSync(new URL(item.path, root)).toString('base64')}` }];
}));
writeFileSync(new URL('src/assets/photos/catalog.js', root), `// Inbäddade referensbilder och källor. Se credits.json.\nexport const PHOTOS = ${JSON.stringify(photos)};\n`);
