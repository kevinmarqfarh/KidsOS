// Bäddar in bilderna i assets/img som data-URI:er så att KidsOS fungerar som en enda fil, även offline.
import { readFileSync, readdirSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { creditsDoc } from './credits-doc.mjs';

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
  const slim = Object.fromEntries(Object.entries(credits).filter(([k]) => out[k]).map(([k, c]) => [k, { a: c.author, l: c.license, lu: c.licenseUrl, u: c.source, g: c.group }]));
  mkdirSync(join(root, 'src/generated'), { recursive: true });
  // Node-varianten (enhetstester): allt som vanliga strängar.
  writeFileSync(join(root, 'src/generated/images.js'), `// GENERERAD av scripts/gen-images.mjs – ändra inte för hand.\nexport const IMAGES = ${JSON.stringify(out)};\nexport const CREDITS = ${JSON.stringify(slim)};\n`);
  // Webbläsarvarianten (bygget byter till den): bilderna ligger INTE i JS-bundeln utan i
  // datablock i HTML:en och avkodas först när en nyckel efterfrågas. Se browserImages().
  const { module, html } = browserImages(out, slim, process.env.KIDSOS_IMG_MODE || 'perkey');
  writeFileSync(join(root, 'src/generated/images.browser.js'), module);
  creditsDoc();
  return { count: Object.keys(out).length, kb: Math.round(bytes / 1024), html };
}

/**
 * Lata bilder för webbläsaren. `IMAGES` behåller formen { nyckel: dataUri } men varje värde är en
 * getter som läser datablocket först vid behov och sedan sparar strängen. Nycklarna finns direkt,
 * så `key in IMAGES`/Object.keys fungerar utan att någon bild avkodas.
 *   perkey – ett <script type="application/json" id="kimg-<nyckel>"> per bild (läses med getElementById)
 *   json   – ett gemensamt <script type="application/json" id="kidsos-images">, JSON.parse vid första behov
 *   slice  – samma gemensamma block, men varje bild klipps ut med förberäknade positioner (ingen JSON.parse)
 */
export function browserImages(out, slim, mode) {
  const PREFIX = 'data:image/webp;base64,';
  const keys = Object.keys(out);
  const b64 = (k) => out[k].slice(PREFIX.length);
  const head = `// GENERERAD av scripts/gen-images.mjs (läge: ${mode}) – ändra inte för hand.
export const CREDITS = ${JSON.stringify(slim)};
const P = '${PREFIX}';
export const IMAGES = {};
function def(k, read) {
  Object.defineProperty(IMAGES, k, {
    enumerable: true, configurable: true,
    get() { const v = read(k); Object.defineProperty(IMAGES, k, { value: v, enumerable: true, configurable: true, writable: true }); return v; },
    set(v) { Object.defineProperty(IMAGES, k, { value: v, enumerable: true, configurable: true, writable: true }); },
  });
}
`;
  if (mode === 'perkey') {
    const ids = keys.map((k, i) => [k, i.toString(36)]);
    const module = `${head}const ID = ${JSON.stringify(Object.fromEntries(ids))};
function read(k) { const el = typeof document !== 'undefined' && document.getElementById('kimg-' + ID[k]); return el ? P + el.textContent : ''; }
for (const k in ID) def(k, read);
`;
    const html = ids.map(([k, id]) => `<script type="application/json" id="kimg-${id}">${b64(k)}</script>`).join('');
    return { module, html };
  }
  const json = JSON.stringify(Object.fromEntries(keys.map((k) => [k, b64(k)])));
  const html = `<script type="application/json" id="kidsos-images">${json}</script>`;
  if (mode === 'json') {
    const module = `${head}let all = null;
function read(k) { if (!all) { const el = typeof document !== 'undefined' && document.getElementById('kidsos-images'); all = el ? JSON.parse(el.textContent) : {}; } return all[k] ? P + all[k] : ''; }
for (const k of ${JSON.stringify(keys)}) def(k, read);
`;
    return { module, html };
  }
  // slice: positioner inom blockets text (ASCII, så tecken = byte).
  const index = {};
  for (const k of keys) {
    const at = json.indexOf(`${JSON.stringify(k)}:"`) + JSON.stringify(k).length + 2;
    index[k] = [at, b64(k).length];
  }
  const module = `${head}const AT = ${JSON.stringify(index)};
let text = null;
function read(k) { if (text === null) { const el = typeof document !== 'undefined' && document.getElementById('kidsos-images'); text = el ? el.textContent : ''; } const [s, n] = AT[k]; return text ? P + text.substr(s, n) : ''; }
for (const k in AT) def(k, read);
`;
  return { module, html };
}
if (import.meta.url === `file://${process.argv[1]}`) console.log(generateImages());
