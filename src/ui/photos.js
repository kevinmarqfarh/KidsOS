// Kompatibilitetslager för det gamla fotosystemet (src/assets/photos). Alla bilder ligger nu i
// assets/img och bäddas in via src/ui/img.js – använd hellre photo/hasPhoto/creditLine direkt.
import { photo, hasPhoto, photoCredit, creditLine, allCredits } from './img.js';
import { esc } from './visuals.js';

// Gamla id:n som fick nya nycklar när systemen slogs ihop.
const ALIAS = { solen: 'sun', merkurius: 'mercury', neptunus: 'neptune' };
export const photoKey = (id) => ALIAS[id] || id;

export function photoImage(id, alt = 'Fotografi av en art', compact = false) {
  const key = photoKey(id);
  if (!hasPhoto(key)) return '';
  return photo(key, { alt, cls: `learning-photo${compact ? ' compact' : ''}` });
}

export function photoFigure(id, alt = 'Fotografi av en art') {
  const key = photoKey(id);
  if (!hasPhoto(key)) return '';
  const c = photoCredit(key) || {};
  const src = c.u ? `<a href="${esc(c.u)}" target="_blank" rel="noopener noreferrer">Wikimedia Commons</a> · ` : '';
  return `<figure class="photo-figure">${photoImage(id, alt)}<figcaption>${esc(creditLine(key))}<details><summary>Bildkälla och licens</summary>${src}${esc(c.l || '')}<span> Bilden visas i mindre storlek.</span></details></figcaption></figure>`;
}

export function photoCredits() {
  const rows = Object.entries(allCredits())
    .map(([, c]) => `<p>${esc(String(c.a || 'Okänd').replace(/^Foto:\s*/i, ''))} · ${c.u ? `<a href="${esc(c.u)}" target="_blank" rel="noopener noreferrer">källa</a>` : 'Wikimedia Commons'} · ${esc(c.l || '')}</p>`)
    .join('');
  return `<details class="photo-credits"><summary>Bildkällor</summary>${rows}<p>Bilderna visas i mindre storlek.</p></details>`;
}
