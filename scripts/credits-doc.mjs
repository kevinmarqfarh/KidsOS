// Skriver docs/BILDKALLOR.md med upphov och licens för alla foton i assets/credits.json.
// Kör: node scripts/credits-doc.mjs   (körs även automatiskt av gen-images.mjs)
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const GROUPS = { space: 'Rymden', species: 'Arter (Biologi)', world: 'Världen', wonder: 'Undra', objects: 'Föremål, djur och mat (ersätter emoji)' };
const one = (s) => String(s || '').replace(/\s+/g, ' ').replace(/\|/g, '\\|').trim();

export function creditsDoc() {
  const credits = existsSync(join(root, 'assets/credits.json')) ? JSON.parse(readFileSync(join(root, 'assets/credits.json'), 'utf8')) : {};
  const keys = Object.keys(credits).filter((k) => existsSync(join(root, 'assets/img', `${k}.webp`)));
  const groups = {};
  for (const k of keys.sort()) (groups[credits[k].group || 'övrigt'] ||= []).push(k);
  const out = [
    '# Bildkällor',
    '',
    '<!-- GENERERAD av scripts/credits-doc.mjs från assets/credits.json – ändra inte för hand. -->',
    '',
    `KidsOS innehåller ${keys.length} foton från Wikimedia Commons (inklusive NASA). Alla har fria licenser: public domain, CC0, CC BY eller CC BY-SA.`,
    'Bilderna är förminskade och omkodade till WebP men i övrigt oförändrade. Följ länken för original, fullständig licens och upphov.',
    '',
  ];
  for (const [g, list] of Object.entries(groups).sort(([a], [b]) => Object.keys(GROUPS).indexOf(a) - Object.keys(GROUPS).indexOf(b))) {
    out.push(`## ${GROUPS[g] || g} (${list.length})`, '', '| Nyckel | Fil | Upphov | Licens |', '|---|---|---|---|');
    for (const k of list) {
      const c = credits[k];
      const file = one(c.file).replace(/^File:/, '');
      const lic = c.licenseUrl ? `[${one(c.license)}](${c.licenseUrl})` : one(c.license);
      out.push(`| ${k} | [${file}](${c.source}) | ${one(c.author).slice(0, 140)} | ${lic} |`);
    }
    out.push('');
  }
  writeFileSync(join(root, 'docs/BILDKALLOR.md'), out.join('\n'));
  return keys.length;
}
if (import.meta.url === `file://${process.argv[1]}`) console.log(`docs/BILDKALLOR.md: ${creditsDoc()} foton`);
