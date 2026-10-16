// Riktiga foton (Wikimedia Commons / NASA). Faller tillbaka till emoji om en bild saknas.
import { IMAGES, CREDITS } from '../generated/images.js';
import { photoKeyForEmoji, PHOTO_ALT, emojiKey } from '../core/emoji-photos.js';

// Finns-kontrollen läser inte bilden: i webbläsaren är IMAGES lat (scripts/gen-images.mjs) och
// varje uppslag av IMAGES[key] avkodar bilden ur HTML:ens datablock.
const own = Object.prototype.hasOwnProperty;
const has = (key) => typeof key === 'string' && own.call(IMAGES, key);
export const hasPhoto = (key) => has(key);
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

// ---------------------------------------------------------------------------
// Emoji → foto. Konkreta föremål/djur/mat visas som riktiga foton (rund-avrundad
// miniatyr) så att barnen ser vad ordet betyder. Saknas fotot visas emoji som förut.

const escAttr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** Fotonyckel för ett emoji om fotot finns inbäddat, annars null. */
export function emojiPhotoKey(emoji) {
  const key = photoKeyForEmoji(emoji);
  return key && has(key) ? key : null;
}

/** `<span class="pic photo-pic">` med foto om emojit är mappat och fotot finns, annars `<span class="pic">emoji</span>`. */
export function pic(emoji, { cls = '', alt } = {}) {
  const key = emojiPhotoKey(emoji);
  const c = cls ? ` ${cls}` : '';
  if (!key) return `<span class="pic${c}">${emoji}</span>`;
  const a = alt ?? PHOTO_ALT[key] ?? '';
  return `<span class="pic photo-pic${c}" data-emoji="${escAttr(emojiKey(emoji))}"><img class="photo" src="${IMAGES[key]}" alt="${escAttr(a)}" draggable="false" loading="lazy" decoding="async"></span>`;
}

// Element vars text (ett ensamt emoji) byts mot foto. .eg-item = räknegrupper.
export const PHOTOIZE_SELECTOR = '.pic, .pic-big, .sci-item-pic, .tank-item, .magnet-item, .trace-pic, .reader-pic, .mp-story-pic, .wq-e, .rt-e, .eg-item';
// Räknegrupper med fler än så här många bilder behåller emoji: många foton blir rörigt och tungt.
export const MAX_PHOTO_GROUP = 10;
const SKIP = '.no-photo, .flag, [data-nophoto], .photo-pic';

function photoizeEl(el) {
  if (el.closest(SKIP) || el.querySelector('img, svg')) return false;
  if (el.classList.contains('eg-item')) {
    const g = el.closest('.emoji-group');
    if (g && g.querySelectorAll('.eg-item').length > MAX_PHOTO_GROUP) return false;
  }
  for (const node of el.childNodes) {
    if (node.nodeType !== 3 || !node.nodeValue.trim()) continue;
    const key = emojiPhotoKey(node.nodeValue);
    if (!key) return false; // första texten är inte ett ensamt mappat emoji (t.ex. "🍎🍎" eller ord)
    const doc = el.ownerDocument;
    const span = doc.createElement('span');
    span.className = 'photo-pic';
    span.dataset.emoji = emojiKey(node.nodeValue);
    const img = doc.createElement('img');
    img.className = 'photo';
    img.src = IMAGES[key];
    img.alt = PHOTO_ALT[key] || '';
    img.draggable = false;
    img.loading = 'lazy';
    img.decoding = 'async';
    span.appendChild(img);
    node.replaceWith(span);
    el.classList.add('has-photo-pic');
    return true;
  }
  return false;
}

/** Byter mappade emoji mot foton i alla bildelement under root. Returnerar antal ersatta. */
export function photoize(root) {
  if (!root || !root.querySelectorAll) return 0;
  let n = 0;
  if (root.matches?.(PHOTOIZE_SELECTOR) && photoizeEl(root)) n++;
  root.querySelectorAll(PHOTOIZE_SELECTOR).forEach((el) => {
    if (photoizeEl(el)) n++;
  });
  return n;
}

/** Kör photoize nu och på allt som läggs till senare (frågor, svarsalternativ, vyer). Returnerar en stoppfunktion. */
export function autoPhotoize(root) {
  if (!root || typeof MutationObserver === 'undefined') return () => {};
  photoize(root);
  const mo = new MutationObserver((list) => {
    for (const m of list) {
      for (const node of m.addedNodes) {
        if (node.nodeType === 1) photoize(node);
        // innerHTML = '🍎' lägger bara till en textnod – fotografera då föräldern.
        else if (node.nodeType === 3 && node.parentElement?.matches?.(PHOTOIZE_SELECTOR)) photoize(node.parentElement);
      }
    }
  });
  mo.observe(root, { childList: true, subtree: true });
  return () => mo.disconnect();
}
