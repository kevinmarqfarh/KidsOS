// Genererar docs/LARANDE.md direkt från appregistret så att dokumentationen alltid stämmer med koden.
import { writeFileSync } from 'node:fs';
import { APPS } from '../src/apps/registry.js';
import { CURRICULUM } from '../src/core/curriculum.js';
import { LEVELS } from '../src/core/age.js';
import { TROPHIES, CATEGORIES } from '../src/core/trophies.js';
import { ROBOT_LEVELS } from '../src/apps/code.js';
import { STORIES } from '../src/apps/svenska.js';
import { SPECIES } from '../src/apps/biology.js';
import { WONDERS } from '../src/apps/wonder.js';

const kind = (m) => (m.gen ? 'Frågerunda' : 'Interaktiv');
let md = `# Lärinnehåll och läroplanskoppling

> Den här filen genereras av \`npm run docs\` från koden. Ändra inte för hand.

## Nivåer

KidsOS har fem nivåer. Startnivån sätts av barnets ålder och anpassas sedan automatiskt: fem rätt i rad på första försöket ger nästa nivå, tre missar i rad ger en lättare.

| Nivå | Namn | Motsvarar | Startar vid ålder |
|---|---|---|---|
${LEVELS.map((l, i) => `| ${l.emoji} ${l.short} | ${l.name} | ${l.school} | ${['4–5', '6–7', '8', '9', '10+'][i]} år |`).join('\n')}

**Dina barn:** 5-åringen startar på Nivå 1 (allt fungerar med uppläsning och bilder), 7-åringen på Nivå 2 och 9-åringen på Nivå 4.

## Översikt

| App | Moduler | Frågerundor | Interaktiva vyer |
|---|---|---|---|
${APPS.map((a) => `| ${a.icon} ${a.name} | ${a.modules.length} | ${a.modules.filter((m) => m.gen).length} | ${a.modules.filter((m) => m.view).length} |`).join('\n')}
| **Totalt** | **${APPS.reduce((s, a) => s + a.modules.length, 0)}** | **${APPS.reduce((s, a) => s + a.modules.filter((m) => m.gen).length, 0)}** | **${APPS.reduce((s, a) => s + a.modules.filter((m) => m.view).length, 0)}** |

Dessutom: ${ROBOT_LEVELS.length} robotbanor, ${STORIES.length} berättelser med läsförståelsefrågor, ${SPECIES.length} artkort, ${WONDERS.length} Undra-frågor och ${TROPHIES.length} troféer.

`;
for (const a of APPS) {
  md += `## ${a.icon} ${a.name} – ${a.tagline}\n\n| Modul | Från nivå | Typ | Läroplanen (Lgr22) |\n|---|---|---|---|\n`;
  for (const m of a.modules) {
    const lgr = (m.lgr || []).map((id) => `*${CURRICULUM[id].area}:* ${CURRICULUM[id].text}`).join('<br>');
    md += `| ${m.icon} ${m.name} | ${LEVELS[m.minLevel ?? 0].short}${m.maxLevel !== undefined ? ` (max ${LEVELS[m.maxLevel].short})` : ''} | ${kind(m)} | ${lgr} |\n`;
  }
  md += '\n';
}
md += `## Troféer\n\n`;
for (const c of CATEGORIES) {
  md += `**${c.icon} ${c.name}:** ${TROPHIES.filter((t) => t.cat === c.id).map((t) => `${t.icon} ${t.name} (${t.desc.replace(/\.$/, '')})`).join(' · ')}\n\n`;
}
md += `## Läroplanscitat som används\n\n| Kod | Ämne | Område | Citat |\n|---|---|---|---|\n${Object.entries(CURRICULUM).map(([id, c]) => `| \`${id}\` | ${c.subject} | ${c.area} | ${c.text} |`).join('\n')}\n`;
writeFileSync(new URL('../docs/LARANDE.md', import.meta.url), md);
console.log('✓ docs/LARANDE.md');
