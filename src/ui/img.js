// Riktiga foton (Wikimedia Commons / NASA). Faller tillbaka till emoji om en bild saknas.
import { IMAGES, CREDITS } from '../generated/images.js';

export const hasPhoto = (key) => !!IMAGES[key];
export const photoUrl = (key) => IMAGES[key] || '';
export const photoCredit = (key) => CREDITS[key] || null;
export const allCredits = () => CREDITS;

/** HTML för ett foto, eller reservinnehållet om bilden saknas. */
export function photo(key, { alt = '', cls = '', fallback = '' } = {}) {
  const src = IMAGES[key];
  if (!src) return fallback;
  const esc = (s) => String(s).replace(/"/g, '&quot;');
  return `<img class="photo ${cls}" src="${src}" alt="${esc(alt)}" draggable="false" loading="lazy" decoding="async">`;
}

/** Kort upphovsrad, t.ex. "Foto: NASA · Public domain". */
export function creditLine(key) {
  const c = CREDITS[key];
  if (!c) return '';
  const who = c.a && c.a !== 'okänd' ? c.a.replace(/^Foto:\s*/i, '') : 'Wikimedia Commons';
  return `Foto: ${who} · ${c.l}`;
}
