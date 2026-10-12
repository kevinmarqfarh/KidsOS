// NO-innehåll (Vetenskap + Biologi): livscykler, unika id:n, nivåanpassning och läroplanskoder.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRng } from '../../src/core/rng.js';
import { CURRICULUM } from '../../src/core/curriculum.js';
import NO_LGR from '../../src/core/lgr/no.js';
import * as sci from '../../src/apps/science.js';
import * as bio from '../../src/apps/biology.js';

const { scienceApp } = sci;
const { biologyApp } = bio;

// Rätt ordning skriven för hand – generatorn får aldrig avvika från naturen.
const EXPECTED_CYCLES = {
  groda: ['rom', 'yngel', 'yngelben', 'groda'],
  fjaril: ['agg', 'larv', 'puppa', 'fjaril'],
  blomma: ['fro', 'grodd', 'planta', 'blomma'],
  fagel: ['agg', 'klacks', 'unge', 'vuxen'],
  manniska: ['bebis', 'barn', 'vuxen', 'aldre'],
  appeltrad: ['karna', 'ungt', 'blom', 'apple'],
  nyckelpiga: ['agg', 'larv', 'puppa', 'vuxen'],
  maskros: ['fro', 'grodd', 'blad', 'blomma'],
  mygga: ['agg', 'larv', 'puppa', 'vuxen'],
  lax: ['rom', 'yngel', 'ung', 'vuxen'],
};
const EXPECTED_FULL = {
  groda: ['rom', 'yngel', 'yngelben', 'svans', 'groda'],
  manniska: ['bebis', 'barn', 'skolbarn', 'vuxen', 'aldre'],
  appeltrad: ['karna', 'grodd', 'ungt', 'blom', 'apple'],
  maskros: ['fro', 'grodd', 'blad', 'blomma', 'boll'],
};

test('livscyklerna står i rätt ordning', () => {
  assert.deepEqual(bio.LIFECYCLES.map((l) => l.id).sort(), Object.keys(EXPECTED_CYCLES).sort());
  for (const lc of bio.LIFECYCLES) {
    assert.deepEqual(lc.stages.map((s) => s.id), EXPECTED_CYCLES[lc.id], lc.id);
    if (lc.full) {
      assert.deepEqual(lc.full.map((s) => s.id), EXPECTED_FULL[lc.id], `${lc.id} (lång)`);
      // Den långa ordningen innehåller grundstegen i samma ordning.
      const sub = lc.full.map((s) => s.id).filter((id) => lc.stages.some((s) => s.id === id));
      assert.deepEqual(sub, lc.stages.map((s) => s.id).filter((id) => sub.includes(id)), `${lc.id}: delsekvens`);
    }
    assert.ok(lc.fact && lc.name && Number.isInteger(lc.lv));
  }
  assert.ok(bio.LIFECYCLES.filter((l) => l.lv === 0).length >= 3, 'nivå 0 behöver minst tre livscykler');
});

test('livscykelfrågan ger rätt svarsordning på alla nivåer', () => {
  for (let level = 0; level <= 4; level++) {
    for (let s = 0; s < 200; s++) {
      const q = bio.genLifecycle(level, createRng(s * 31 + level));
      if (q.type !== 'order') continue;
      const lc = bio.LIFECYCLES.find((l) => q.prompt.includes(`växer ${l.name}?`));
      assert.ok(lc, q.prompt);
      assert.ok(lc.lv <= level, `${lc.id} för svår för nivå ${level}`);
      const base = level >= 4 && lc.full ? lc.full : lc.stages;
      const expected = level === 0 ? [base[0].id, base[1].id, base[3].id] : base.map((x) => x.id);
      assert.deepEqual(q.answerOrder, expected, `${lc.id} nivå ${level}`);
    }
  }
});

test('forskarens steg och vattnets former kommer i rätt ordning', () => {
  for (let level = 0; level <= 4; level++) {
    const steps = sci.methodSteps(level);
    assert.equal(steps[0], 'fraga');
    assert.ok(steps.indexOf('gissa') < steps.indexOf('testa'));
    if (steps.includes('forklara')) assert.equal(steps.at(-1), 'forklara');
  }
  for (let s = 0; s < 300; s++) {
    const q = sci.genWaterForms(3, createRng(s));
    if (q.type !== 'order') continue;
    if (q.answerOrder.includes('isbit') && q.answerOrder.includes('anga')) assert.deepEqual(q.answerOrder, ['isbit', 'vatten', 'anga']);
    if (q.answerOrder.includes('moln')) assert.deepEqual(q.answerOrder, ['hav', 'avdunstar', 'moln', 'regn']);
  }
});

test('årstidsordningen följer året', () => {
  const next = { var: 'sommar', sommar: 'host', host: 'vinter', vinter: 'var' };
  for (let s = 0; s < 300; s++) {
    const q = bio.genSeasons(2, createRng(s));
    if (q.type !== 'order') continue;
    for (let i = 0; i < 3; i++) assert.equal(q.answerOrder[i + 1], next[q.answerOrder[i]]);
  }
});

test('näringskedjor: en kedja har unika led och börjar med något som inte äter andra', () => {
  for (const c of bio.FOOD_CHAINS) {
    const ids = c.chain.map((x) => x.id);
    assert.equal(new Set(ids).size, ids.length, ids.join());
    assert.ok(c.chain.length >= 2);
  }
  const producers = new Set(bio.FOOD_CHAINS.map((c) => c.chain[0].id));
  for (const c of bio.FOOD_CHAINS) c.chain.slice(1).forEach((x) => assert.ok(!producers.has(x.id), `${x.id} kan inte vara både växt och djur`));
});

const uniq = (list, key = (x) => x.id) => {
  const ids = list.map(key);
  return new Set(ids).size === ids.length;
};

test('unika id:n i alla NO-listor', () => {
  const lists = {
    SPECIES: bio.SPECIES, BABIES: bio.BABIES, SEASON_ITEMS: bio.SEASON_ITEMS, PLANT_ITEMS: bio.PLANT_ITEMS, ALLEMAN_ITEMS: bio.ALLEMAN_ITEMS,
    HEALTH_ITEMS: bio.HEALTH_ITEMS, RECYCLE_ITEMS: sci.RECYCLE_ITEMS, MATERIAL_ITEMS: sci.MATERIAL_ITEMS, WATER_ITEMS: sci.WATER_ITEMS,
    DISSOLVE_ITEMS: sci.DISSOLVE_ITEMS, LIGHT_ITEMS: sci.LIGHT_ITEMS, SOUND_ITEMS: sci.SOUND_ITEMS, PUSH_ITEMS: sci.PUSH_ITEMS, LIFECYCLES: bio.LIFECYCLES,
  };
  for (const [name, list] of Object.entries(lists)) assert.ok(uniq(list), name);
  assert.ok(uniq(bio.SPECIES, (s) => s.n), 'artnamn');
  bio.LIFECYCLES.forEach((l) => assert.ok(uniq(l.stages) && (!l.full || uniq(l.full)), l.id));
  assert.ok(uniq(scienceApp.modules) && uniq(biologyApp.modules));
});

test('faktarader: rätt svar finns, alternativ är unika och nivåerna täcks', () => {
  const banks = {
    MATERIAL_FACTS: sci.MATERIAL_FACTS, WATER_FACTS: sci.WATER_FACTS, MIX_FACTS: sci.MIX_FACTS, LIGHT_FACTS: sci.LIGHT_FACTS, SOUND_FACTS: sci.SOUND_FACTS,
    FORCE_FACTS: sci.FORCE_FACTS, METHOD_TOOLS: sci.METHOD_TOOLS, RECYCLE_FACTS: sci.RECYCLE_FACTS, SEASON_FACTS: bio.SEASON_FACTS, NATURE_FACTS: bio.NATURE_FACTS,
    PLANT_FACTS: bio.PLANT_FACTS, ALLEMAN_FACTS: bio.ALLEMAN_FACTS, HEALTH: bio.HEALTH, FOOD_FACTS: bio.FOOD_FACTS, LIFECYCLE_FACTS: bio.LIFECYCLE_FACTS,
  };
  for (const [name, rows] of Object.entries(banks)) {
    const qs = rows.map((r) => r.q);
    assert.equal(new Set(qs).size, qs.length, `${name}: dubbla frågor`);
    for (const r of rows) {
      assert.ok(r.o.length >= 2 && r.ex && Number.isInteger(r.lv), `${name}: ${r.q}`);
      const labels = r.o.map((o) => (Array.isArray(o) ? o[1] : o));
      assert.equal(new Set(labels).size, labels.length, `${name}: ${r.q}`);
      if (r.lv === 0) assert.ok(r.o.every(Array.isArray), `${name}: nivå 0 ska ha bildsvar (${r.q})`);
    }
  }
  for (const s of bio.SPECIES) assert.ok(s.fact && s.g && s.e, s.id);
});

test('alla NO-generatorer ger giltiga frågor på alla nivåer, och nivå 0 har högst tre alternativ', () => {
  for (const app of [scienceApp, biologyApp]) {
    for (const m of app.modules.filter((x) => x.gen)) {
      for (let level = 0; level <= 4; level++) {
        for (let s = 0; s < 150; s++) {
          const q = m.gen(level, createRng(s * 104729 + level * 13 + 7), { found: {} });
          const ctx = `${app.id}/${m.id} nivå ${level} frö ${s}`;
          assert.ok(q && q.prompt && !/undefined|NaN|null/.test(`${q.prompt} ${q.say || ''} ${q.hint || ''} ${q.explain || ''}`), ctx);
          if (q.type === 'choice') {
            assert.ok(q.options.some((o) => o.id === q.answer), ctx);
            assert.equal(new Set(q.options.map((o) => o.id)).size, q.options.length, ctx);
            if (level === 0 && ['science', 'biology'].includes(app.id) && !['investigate', 'forces', 'resources'].includes(m.id)) assert.ok(q.options.length <= 3, `${ctx}: för många alternativ`);
          } else if (q.type === 'sort') {
            assert.ok(q.items.length >= 2 && q.items.every((i) => q.bins.some((b) => b.id === i.bin)), ctx);
            assert.equal(new Set(q.items.map((i) => i.id)).size, q.items.length, ctx);
          } else if (q.type === 'order') {
            assert.deepEqual([...q.answerOrder].sort(), q.items.map((i) => i.id).sort(), ctx);
          }
        }
      }
    }
  }
});

test('nya läroplanskoder finns i curriculum och används', () => {
  for (const [id, c] of Object.entries(NO_LGR)) {
    assert.ok(CURRICULUM[id], id);
    assert.ok(c.subject && c.area && c.text.endsWith('.'), id);
  }
  const used = new Set([...scienceApp.modules, ...biologyApp.modules].flatMap((m) => m.lgr));
  for (const id of Object.keys(NO_LGR)) assert.ok(used.has(id), `${id} används inte`);
});

test('artgåtor avslöjar inte namnet och gåtfrågor samlar artkort', () => {
  for (const s of bio.SPECIES.filter((x) => x.riddle)) {
    const word = new RegExp(`(^|[^a-zåäö])${s.n}([^a-zåäö]|$)`, 'i');
    assert.ok(!word.test(s.riddle), `${s.id}: gåtan avslöjar namnet`);
  }
  let riddles = 0;
  for (let i = 0; i < 300; i++) {
    const q = bio.genSpecies(3, createRng(i), { found: {} });
    if (q.prompt.startsWith('Gåta')) {
      riddles++;
      assert.equal(q.collect.item, q.answer);
    }
  }
  assert.ok(riddles > 30);
});

test('djurungar: rätt unge och inga tvetydiga alternativ', () => {
  for (let level = 0; level <= 4; level++) {
    for (let s = 0; s < 200; s++) {
      const q = bio.genBabies(level, createRng(s + level * 1000));
      const ans = bio.BABIES.find((b) => b.id === q.answer);
      if (ans) {
        // Mamma-frågor: inget fel alternativ får ha samma unge.
        const babies = q.options.map((o) => bio.BABIES.find((b) => b.id === o.id).baby);
        assert.equal(babies.filter((b) => b === ans.baby).length, 1, q.prompt);
      } else {
        assert.match(q.answer, /^(en|ett) /);
      }
    }
  }
  const art = Object.fromEntries(bio.BABIES.map((b) => [b.baby, b.art]));
  assert.equal(art['föl'], 'ett');
  assert.equal(art['kalv'], 'en');
  assert.equal(art['lamm'], 'ett');
  assert.equal(art['kid'], 'ett');
});

test('allemansrätten och källsorteringen sorterar rätt', () => {
  const okay = bio.ALLEMAN_ITEMS.filter((i) => i.bin === 'ok').map((i) => i.id);
  assert.ok(okay.includes('blabar') && okay.includes('talta'));
  const not = bio.ALLEMAN_ITEMS.filter((i) => i.bin === 'inte').map((i) => i.id);
  assert.ok(not.includes('grenar') && not.includes('fagelagg') && not.includes('skrapa'));
  const bin = Object.fromEntries(sci.RECYCLE_ITEMS.map((i) => [i.id, i.bin]));
  assert.equal(bin.mjolk, 'papper');
  assert.equal(bin.batteri, 'batteri');
  assert.equal(bin.burk, 'pant');
});
