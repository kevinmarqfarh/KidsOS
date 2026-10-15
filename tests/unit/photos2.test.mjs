// Fotobiblioteket för föremål: emoji → foto (src/core/emoji-photos.js, src/ui/img.js).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { EMOJI_PHOTOS, PHOTO_ALT, emojiKey, photoKeyForEmoji } from '../../src/core/emoji-photos.js';
import { IMAGES, CREDITS } from '../../src/generated/images.js';
import { pic, emojiPhotoKey, photoize, MAX_PHOTO_GROUP } from '../../src/ui/img.js';

const root = new URL('../../', import.meta.url);
const catalog = JSON.parse(readFileSync(new URL('assets/image-catalog.json', root), 'utf8'));
const credits = JSON.parse(readFileSync(new URL('assets/credits.json', root), 'utf8'));
const catalogKeys = new Set(Object.values(catalog).flatMap((g) => Object.keys(g)));
const FREE = /public domain|^pd\b|cc0|cc[ -]by|^no restrictions$|^attribution$/i; // "No restrictions" = Flickr Commons utan kända upphovsrättsliga begränsningar

test('varje mappat emoji pekar på en nyckel i bildkatalogen', () => {
  assert.ok(Object.keys(EMOJI_PHOTOS).length >= 150);
  for (const [e, key] of Object.entries(EMOJI_PHOTOS)) {
    assert.ok(catalogKeys.has(key), `${e} → ${key} saknas i image-catalog.json`);
    assert.ok(!e.includes('️'), `${e}: nycklar ska vara utan U+FE0F`);
    assert.ok(PHOTO_ALT[key], `alt-text saknas för ${key}`);
  }
});

test('gruppen objects har specifika Commons-filer och obj-nycklar', () => {
  const objs = Object.entries(catalog.objects || {});
  assert.ok(objs.length >= 150, `bara ${objs.length} föremål`);
  for (const [k, v] of objs) {
    assert.match(k, /^obj-[a-z0-9-]+$/);
    assert.match(v, /^File:/, `${k} ska peka på en specifik fil`);
  }
});

test('abstrakta symboler mappas inte (siffror, pilar, ansikten, flaggor, färgcirklar)', () => {
  const banned = /[\u{1F1E6}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{2190}-\u{21FF}\u{27A1}\u{2B05}-\u{2B07}\u{1F534}-\u{1F535}\u{1F7E0}-\u{1F7EB}\u{2753}\u{2705}\u{274C}\u{2795}\u{1F51F}\u{1F522}]/u;
  for (const e of Object.keys(EMOJI_PHOTOS)) assert.ok(!banned.test(e) && !/[0-9#*]/.test(e), `${e} ska inte bli foto`);
});

test('alla inbäddade bilder har krediter med fri licens', () => {
  for (const key of Object.keys(IMAGES)) {
    const c = CREDITS[key];
    assert.ok(c, `kredit saknas: ${key}`);
    assert.match(c.l, FREE, `${key}: ${c.l}`);
    assert.match(c.u, /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/, key);
  }
  for (const [key, c] of Object.entries(credits)) assert.match(c.license, FREE, `${key}: ${c.license}`);
});

test('pic faller tillbaka till emoji och ger foto när det finns', () => {
  assert.equal(pic('🔁'), '<span class="pic">🔁</span>');
  assert.equal(pic('🔁', { cls: 'sm' }), '<span class="pic sm">🔁</span>');
  const missing = Object.entries(EMOJI_PHOTOS).find(([, k]) => !IMAGES[k]);
  if (missing) assert.equal(pic(missing[0]), `<span class="pic">${missing[0]}</span>`);
  const present = Object.entries(EMOJI_PHOTOS).find(([, k]) => IMAGES[k]);
  if (present) {
    const [e, k] = present;
    const html = pic(e, { cls: 'sm' });
    assert.match(html, /^<span class="pic photo-pic sm" data-emoji="[^"]+"><img class="photo" src="data:image\/webp;base64,/);
    assert.ok(html.includes(`alt="${PHOTO_ALT[k]}"`));
    assert.match(html, /loading="lazy" decoding="async"/);
    assert.ok(pic(e, { alt: 'x"y' }).includes('alt="x&quot;y"'));
    assert.equal(emojiPhotoKey(`${e}️`), k);
  }
  assert.equal(photoKeyForEmoji('ingen'), null);
  assert.equal(emojiKey(' ☂️ '), '☂');
  assert.equal(photoize(null), 0);
  assert.ok(MAX_PHOTO_GROUP >= 5);
});

test('photoize byter ensamma emoji i bildelement mot foton (minimal DOM)', () => {
  const present = Object.entries(EMOJI_PHOTOS).find(([, k]) => IMAGES[k]);
  if (!present) return;
  const [e] = present;
  // Liten DOM-attrapp som räcker för photoize.
  const mk = (cls, text, parent = null) => {
    const el = {
      nodeType: 1, classList: { _s: new Set(cls.split(' ')), contains(c) { return this._s.has(c); }, add(c) { this._s.add(c); } },
      parent, childNodes: [], ownerDocument: doc,
      closest(sel) { for (let n = this; n; n = n.parent) if (sel.split(',').some((s) => s.trim().startsWith('.') && n.classList?.contains(s.trim().slice(1)))) return n; return null; },
      querySelector() { return null; }, querySelectorAll() { return []; }, matches: () => true,
    };
    if (text != null) el.childNodes.push({ nodeType: 3, nodeValue: text, replaceWith(n) { el.childNodes[0] = n; } });
    return el;
  };
  const doc = { createElement: (t) => ({ tagName: t, dataset: {}, children: [], appendChild(c) { this.children.push(c); } }) };
  const a = mk('pic sm', e);
  assert.equal(photoize(a), 1);
  assert.equal(a.childNodes[0].className, 'photo-pic');
  assert.match(a.childNodes[0].children[0].src, /^data:image\/webp/);
  assert.equal(photoize(mk('pic', `${e}${e}`)), 0, 'två emoji behålls');
  assert.equal(photoize(mk('pic no-photo', e)), 0, 'no-photo respekteras');
  assert.equal(photoize(mk('pic', '🔁')), 0);
});
