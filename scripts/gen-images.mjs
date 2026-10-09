// Bäddar in bilderna i assets/img som data-URI:er så att KidsOS fungerar som en enda fil, även offline.
import { readFileSync, readdirSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
export function generateImages() {
  const dir = join(root, 'assets/img');
  const credits = existsSync(join(root, 'assets/credits.json')) ? JSON.parse(readFileSync(join(root, 'assets/credits.json'), 'utf8')) : {};
  const files = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.webp')) : [];
  const out = {};
  let bytes = 0;
  for (const f of files.sort()) {
    const key = f.replace(/\.webp$/, '');
    if (!credits[key]) continue; // bara bilder med känd licens
    const buf = readFileSync(join(dir, f));
    bytes += buf.length;
    out[key] = `data:image/webp;base64,${buf.toString('base64')}`;
  }
  const slim = Object.fromEntries(Object.entries(credits).filter(([k]) => out[k]).map(([k, c]) => [k, { a: c.author, l: c.license, u: c.source, g: c.group }]));
  mkdirSync(join(root, 'src/generated'), { recursive: true });
  writeFileSync(join(root, 'src/generated/images.js'), `// GENERERAD av scripts/gen-images.mjs – ändra inte för hand.\nexport const IMAGES = ${JSON.stringify(out)};\nexport const CREDITS = ${JSON.stringify(slim)};\n`);
  return { count: Object.keys(out).length, kb: Math.round(bytes / 1024) };
}
if (import.meta.url === `file://${process.argv[1]}`) console.log(generateImages());
