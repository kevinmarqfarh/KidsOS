// Egenskapstest: genererar tusentals frågor i alla moduler och nivåer
// och kontrollerar att varje fråga är giltig och går att lösa.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { APPS } from '../../src/apps/registry.js';
import { createRng } from '../../src/core/rng.js';
import { CURRICULUM } from '../../src/core/curriculum.js';
import { VIEWS_LIST } from './_views.mjs';

const SEEDS = 120;
const BAD_TEXT = /undefined|NaN|\[object|null/;

function validate(q, ctx) {
  assert.ok(q && typeof q === 'object', `${ctx}: ingen fråga`);
  assert.ok(typeof q.prompt === 'string' && q.prompt.trim().length > 3, `${ctx}: tom prompt`);
  for (const k of ['prompt', 'say', 'hint', 'explain']) if (q[k]) assert.ok(!BAD_TEXT.test(q[k]), `${ctx}: ${k} innehåller skräp: ${q[k]}`);
  if (q.visual) assert.ok(!/undefined|NaN/.test(q.visual), `${ctx}: visual innehåller undefined/NaN`);
  switch (q.type) {
    case 'choice': {
      assert.ok(Array.isArray(q.options) && q.options.length >= 2, `${ctx}: för få alternativ`);
      const ids = q.options.map((o) => o.id);
      assert.equal(new Set(ids).size, ids.length, `${ctx}: dubbla alternativ ${ids}`);
      assert.ok(ids.includes(q.answer), `${ctx}: svaret ${q.answer} finns inte bland ${ids}`);
      q.options.forEach((o) => assert.ok(o.label !== undefined || o.html, `${ctx}: alternativ utan innehåll`));
      break;
    }
    case 'numpad':
      assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 10000, `${ctx}: ogiltigt numeriskt svar ${q.answer}`);
      break;
    case 'order': {
      const ids = q.items.map((i) => i.id).sort();
      assert.deepEqual([...q.answerOrder].sort(), ids, `${ctx}: ordningen matchar inte objekten`);
      assert.equal(new Set(ids).size, ids.length, `${ctx}: dubbla objekt`);
      break;
    }
    case 'sort': {
      const bins = new Set(q.bins.map((b) => b.id));
      assert.ok(q.items.length >= 2, `${ctx}: för få objekt att sortera`);
      q.items.forEach((i) => assert.ok(bins.has(i.bin), `${ctx}: ${i.id} hör till okänd låda ${i.bin}`));
      assert.equal(new Set(q.items.map((i) => i.id)).size, q.items.length, `${ctx}: dubbla objekt`);
      break;
    }
    case 'build': {
      const tiles = [...q.tiles];
      for (const ch of q.word) {
        const i = tiles.indexOf(ch);
        assert.ok(i >= 0, `${ctx}: bokstaven ${ch} saknas för ${q.word}`);
        tiles.splice(i, 1);
      }
      break;
    }
    case 'tapcount':
      assert.ok(q.answer >= 1 && q.answer <= (q.max || 6), `${ctx}: orimligt antal stavelser`);
      break;
    case 'tap':
      assert.ok(q.visual.includes(`data-hit="${q.answer}"`), `${ctx}: träffytan ${q.answer} finns inte i bilden`);
      break;
    case 'clock':
      assert.ok(q.target.h >= 1 && q.target.h <= 12 && q.target.m % (q.step || 15) === 0, `${ctx}: klockmålet kan inte ställas in med steget`);
      break;
    default:
      assert.fail(`${ctx}: okänd frågetyp ${q.type}`);
  }
}

for (const app of APPS) {
  for (const mod of app.modules.filter((m) => m.gen)) {
    test(`${app.name} › ${mod.name}: giltiga frågor på alla nivåer`, () => {
      for (let level = 0; level <= 4; level++) {
        for (let s = 0; s < SEEDS; s++) {
          const q = mod.gen(level, createRng(s * 7919 + level), { found: {} });
          validate(q, `${app.id}/${mod.id} nivå ${level} frö ${s}`);
        }
      }
    });
  }
}

test('varje modul har läroplanskoppling som finns', () => {
  for (const app of APPS) for (const m of app.modules) {
    assert.ok(m.lgr && m.lgr.length, `${app.id}/${m.id} saknar läroplanskoppling`);
    m.lgr.forEach((id) => assert.ok(CURRICULUM[id], `${app.id}/${m.id}: okänd läroplanskod ${id}`));
  }
});

test('varje vy-modul har en implementerad vy', () => {
  for (const app of APPS) for (const m of app.modules.filter((x) => x.view)) assert.ok(VIEWS_LIST.includes(m.view), `${app.id}/${m.id}: vyn ${m.view} saknas`);
});

test('modul-id:n är unika inom varje app och alla appar har ikon och färg', () => {
  for (const app of APPS) {
    const ids = app.modules.map((m) => m.id);
    assert.equal(new Set(ids).size, ids.length, app.id);
    assert.ok(app.icon && /^#[0-9a-f]{6}$/i.test(app.color), app.id);
  }
  assert.equal(new Set(APPS.map((a) => a.id)).size, APPS.length);
});

test('det finns något att göra på varje nivå i varje lärapp', () => {
  for (const app of APPS) for (let lvl = 0; lvl <= 4; lvl++) assert.ok(app.modules.some((m) => (m.minLevel ?? 0) <= lvl), `${app.id} nivå ${lvl}`);
});
