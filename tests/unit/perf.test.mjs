// Prestanda: lata bilder i webbläsarbygget och lätt grafikläge för äldre iPads (docs/PRESTANDA.md).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { browserImages } from '../../scripts/gen-images.mjs';
import { prefersLiteFx, safariVersion } from '../../src/core/perf-mode.js';

const OUT = { ekorre: 'data:image/webp;base64,QUJD', 'obj-apple': 'data:image/webp;base64,REVG' };
const SLIM = { ekorre: { a: 'X', l: 'CC0' }, 'obj-apple': { a: 'Y', l: 'CC0' } };

async function load(mode) {
  const { module, html } = browserImages(OUT, SLIM, mode);
  // Minimal "document": blocken ur HTML:en, uppslag per id.
  const blocks = {};
  for (const [, id, text] of html.matchAll(/<script type="application\/json" id="([^"]+)">([^<]*)<\/script>/g)) blocks[id] = text;
  const reads = [];
  globalThis.document = { getElementById: (id) => (id in blocks ? (reads.push(id), { textContent: blocks[id] }) : null) };
  const mod = await import(`data:text/javascript;base64,${Buffer.from(module).toString('base64')}`);
  return { mod, reads, html }; // globalThis.document tas bort i slutet av testet
}

for (const mode of ['perkey', 'json', 'slice']) {
  test(`lata bilder (${mode}): samma API som node-varianten, avkodas först vid uppslag`, async () => {
    const { mod, reads, html } = await load(mode);
    assert.ok(!/QUJD|REVG/.test(mod.IMAGES.toString()));
    assert.deepEqual(Object.keys(mod.IMAGES).sort(), Object.keys(OUT).sort());
    assert.ok('ekorre' in mod.IMAGES);
    assert.equal(reads.length, 0, 'nyckelkontroll ska inte läsa någon bild');
    assert.equal(mod.IMAGES.ekorre, OUT.ekorre);
    assert.equal(mod.IMAGES['obj-apple'], OUT['obj-apple']);
    assert.equal(mod.IMAGES.ekorre, OUT.ekorre);
    assert.ok(reads.length >= 1 && reads.length <= 2, 'varje bild läses högst en gång');
    assert.deepEqual(mod.CREDITS, SLIM);
    mod.IMAGES.ekorre = 'data:image/webp;base64,AAAA';
    assert.equal(mod.IMAGES.ekorre, 'data:image/webp;base64,AAAA');
    assert.ok(!html.includes('data:image'), 'blocken innehåller bara base64');
    delete globalThis.document;
  });
}

test('lätt grafikläge: gamla iPads, få kärnor och "Minska genomskinlighet"', () => {
  const ipad15 = 'Mozilla/5.0 (iPad; CPU OS 15_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Mobile/15E148 Safari/604.1';
  const ipad161 = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15';
  const ipad17 = 'Mozilla/5.0 (iPad; CPU OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1';
  const chrome = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36';
  assert.deepEqual(safariVersion(ipad15), [15, 7]);
  assert.deepEqual(safariVersion(ipad161), [16, 1]);
  assert.equal(safariVersion(chrome), null);
  assert.equal(prefersLiteFx({ ua: ipad15, cores: 6 }), true);
  assert.equal(prefersLiteFx({ ua: ipad161, cores: 8 }), true);
  assert.equal(prefersLiteFx({ ua: ipad17, cores: 6 }), false);
  assert.equal(prefersLiteFx({ ua: chrome, cores: 8, memory: 8 }), false);
  assert.equal(prefersLiteFx({ ua: chrome, cores: 2 }), true);
  assert.equal(prefersLiteFx({ ua: chrome, cores: 8, memory: 2 }), true);
  assert.equal(prefersLiteFx({ ua: ipad17, cores: 6, reducedTransparency: true }), true);
  assert.equal(prefersLiteFx({ ua: ipad15, search: '?fx=full' }), false);
  assert.equal(prefersLiteFx({ ua: chrome, cores: 8, search: '?fx=lite' }), true);
});
