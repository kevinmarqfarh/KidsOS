// Enhetstester för Rymden: bildquiz med varierande mängd foton, frågebankernas
// kvalitet, tidslinjer, tidszoner och nivåanpassning.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRng } from '../../src/core/rng.js';
import { IMAGES } from '../../src/generated/images.js';
import {
  spaceApp, PLANETS, SPACE_PHOTOS, SPACE_QUIZ, genSpacePhoto, uniqueBy,
  PLANET_PIC_QUIZ, PLANET_FACTS, MISSION_PIC_QUIZ, MISSION_FACTS, SPACE_EVENTS, SKY_PIC_QUIZ, SKY_FACTS,
  TIME_ZONES, TIME_FACTS, SKY_STORIES, planetMath, genTime, genMissions, CONSTELLATIONS,
} from '../../src/apps/space.js';

const CATALOG = JSON.parse(readFileSync(new URL('../../assets/image-catalog.json', import.meta.url), 'utf8'));
const SPACE_KEYS = Object.keys(CATALOG.space);

/** Kör fn med exakt de angivna foto-nycklarna "nedladdade", och återställ sedan. */
function withPhotos(keys, fn) {
  const saved = { ...IMAGES };
  for (const k of Object.keys(IMAGES)) delete IMAGES[k];
  for (const k of keys) IMAGES[k] = saved[k] || 'data:image/webp;base64,AAAA';
  try {
    fn();
  } finally {
    for (const k of Object.keys(IMAGES)) delete IMAGES[k];
    Object.assign(IMAGES, saved);
  }
}

function checkChoice(q, ctx) {
  if (q.type !== 'choice') return;
  const ids = q.options.map((o) => o.id);
  assert.equal(new Set(ids).size, ids.length, `${ctx}: dubbla id ${ids}`);
  const labels = q.options.map((o) => o.label ?? o.html);
  assert.equal(new Set(labels).size, labels.length, `${ctx}: dubbla etiketter ${labels}`);
  assert.ok(ids.includes(q.answer), `${ctx}: svaret saknas`);
}

test('SPACE_PHOTOS har unika nycklar och titlar', () => {
  const keys = SPACE_PHOTOS.map((s) => s.key);
  assert.equal(new Set(keys).size, keys.length, keys.join(','));
  const titles = SPACE_PHOTOS.map((s) => s.title);
  assert.equal(new Set(titles).size, titles.length, titles.join(','));
});

test('uniqueBy behåller första förekomsten', () => {
  assert.deepEqual(uniqueBy([{ k: 1, v: 'a' }, { k: 1, v: 'b' }, { k: 2, v: 'c' }], (x) => x.k).map((x) => x.v), ['a', 'c']);
});

test('bildquizet ger unika alternativ med inga, alla och slumpade foton', () => {
  const sets = [[], SPACE_KEYS, ['sun', 'earth', 'moon'], ['earth', 'mars', 'saturn'], ['sun', 'earth', 'iss', 'mercury', 'venus', 'mars']];
  const r = createRng(99);
  for (let i = 0; i < 25; i++) sets.push(SPACE_KEYS.filter(() => r.chance(0.5)));
  sets.forEach((keys, si) => withPhotos(keys, () => {
    for (let level = 0; level <= 4; level++) {
      for (let s = 0; s < 80; s++) {
        const q = genSpacePhoto(level, createRng(s * 31 + level * 7 + si));
        checkChoice(q, `foton#${si} nivå ${level} frö ${s}`);
        if (q.visual) assert.ok(q.visual.includes('<img'), 'bild saknas trots att frågan visar en bild');
      }
    }
  }));
});

test('med alla foton dyker både planeter och andra rymdbilder upp', () => {
  withPhotos(SPACE_KEYS, () => {
    const prompts = new Set();
    for (let s = 0; s < 200; s++) prompts.add(genSpacePhoto(3, createRng(s)).prompt);
    assert.ok(prompts.has('Vad ser du på bilden?') && prompts.has('Vilken planet är det här?'), [...prompts].join(' | '));
  });
});

test('alla frågebanker: svaret finns bland unika alternativ och nivån är 0–4', () => {
  const banks = { PLANET_FACTS, MISSION_FACTS, SKY_FACTS, TIME_FACTS, SPACE_QUIZ };
  for (const [name, bank] of Object.entries(banks)) {
    assert.ok(bank.length >= 10, `${name} har för få frågor`);
    for (const q of bank) {
      assert.ok(q.o.includes(q.a), `${name}: "${q.q}" saknar svaret bland alternativen`);
      assert.equal(new Set(q.o).size, q.o.length, `${name}: "${q.q}" har dubbla alternativ`);
      assert.ok(q.lvl >= 0 && q.lvl <= 4, `${name}: "${q.q}" har ogiltig nivå`);
      assert.ok(q.ex && q.ex.length > 20, `${name}: "${q.q}" saknar förklaring som lär ut något`);
    }
    const qs = bank.map((q) => q.q);
    assert.equal(new Set(qs).size, qs.length, `${name}: samma fråga finns två gånger`);
  }
});

test('bildfrågor och stjärnsagor: emoji-alternativ med svar och högst tre val', () => {
  for (const bank of [PLANET_PIC_QUIZ, MISSION_PIC_QUIZ, SKY_PIC_QUIZ, SKY_STORIES]) {
    for (const item of bank) {
      const ids = item.opts.map((o) => o[0]);
      assert.ok(ids.includes(item.a), `"${item.q}" saknar svaret`);
      assert.equal(new Set(ids).size, ids.length, `"${item.q}" har dubbla id`);
      assert.ok(item.opts.length >= 2 && item.opts.length <= 3, `"${item.q}" ska ha 2–3 val`);
      item.opts.forEach(([, e, label]) => assert.ok(e && label, `"${item.q}" har ett val utan bild eller text`));
    }
  }
  assert.ok(SKY_STORIES.filter((s) => s.kind === 'kultur').length >= 8, 'för få berättelser från olika kulturer');
  assert.ok(SKY_STORIES.filter((s) => s.kind === 'gammal').length >= 6, 'för få berättelser om äldre tiders forskare');
});

test('nya moduler: nivå 0 har bildsvar som läses upp, med högst tre val', () => {
  const ids = ['planetfacts', 'missions', 'nightsky', 'timezones', 'skystories'];
  for (const id of ids) {
    const mod = spaceApp.modules.find((m) => m.id === id);
    assert.ok(mod && mod.gen, `modulen ${id} saknas`);
    for (let s = 0; s < 150; s++) {
      const q = mod.gen(0, createRng(s), { found: {} });
      if (q.type === 'choice') {
        assert.ok(q.options.length <= 3, `${id}: för många val på nivå 0`);
        q.options.forEach((o) => assert.ok(o.html && o.say, `${id}: val utan bild/uppläsning på nivå 0`));
        assert.ok(q.say, `${id}: frågan läses inte upp`);
      } else {
        assert.equal(q.type, 'sort', `${id}: oväntad frågetyp ${q.type} på nivå 0`);
        assert.ok(q.items.length <= 4, `${id}: för många saker att sortera på nivå 0`);
      }
    }
  }
});

test('nya moduler: varierat innehåll och svårare frågor på högre nivå', () => {
  for (const id of ['planetfacts', 'missions', 'nightsky', 'timezones', 'skystories']) {
    const mod = spaceApp.modules.find((m) => m.id === id);
    for (let level = 0; level <= 4; level++) {
      const prompts = new Set();
      for (let s = 0; s < 60; s++) {
        const q = mod.gen(level, createRng(s * 13 + level), { found: {} });
        prompts.add(`${q.prompt}|${q.answer ?? (q.answerOrder || q.items?.map((i) => i.id) || []).join()}`);
      }
      assert.ok(prompts.size >= (level === 0 ? 3 : 8), `${id} nivå ${level}: bara ${prompts.size} olika frågor`);
    }
  }
  const lvl4 = new Set();
  for (let s = 0; s < 300; s++) lvl4.add(spaceApp.modules.find((m) => m.id === 'planetfacts').gen(4, createRng(s)).type);
  assert.ok(lvl4.has('numpad') && lvl4.has('sort') && lvl4.has('choice'), [...lvl4].join(','));
});

test('rymdtidslinjen: årtalen är unika och ordningen följer åren', () => {
  const years = SPACE_EVENTS.map((e) => e.year);
  assert.equal(new Set(years).size, years.length);
  for (let s = 0; s < 100; s++) {
    const q = genMissions(4, createRng(s));
    if (q.type !== 'order') continue;
    const order = q.answerOrder.map((id) => SPACE_EVENTS.find((e) => e.id === id).year);
    assert.deepEqual(order, [...order].sort((a, b) => a - b));
    q.items.forEach((it) => assert.ok(!/\d{4}/.test(it.html), 'årtalet avslöjas i objektet'));
  }
});

test('tidszoner: svaret stämmer med skillnaden och ligger mellan 1 och 23', () => {
  let seen = 0;
  for (const level of [3, 4]) {
    for (let s = 0; s < 400; s++) {
      const q = genTime(level, createRng(s));
      const m = q.prompt.match(/^Klockan är (\d+) i Sverige på vintern\. I (.+?) är klockan (\d+) timmar? (mer|mindre)/);
      if (!m) continue;
      seen++;
      const [, h, city, d, dir] = m;
      const z = TIME_ZONES.find((x) => x.city === city);
      assert.equal(Math.abs(z.diff), Number(d));
      assert.equal(z.diff > 0, dir === 'mer');
      const ans = Number(h) + z.diff;
      assert.ok(ans >= 1 && ans <= 23);
      assert.equal(String(q.answer), String(ans));
      if (level === 3) assert.ok(Math.abs(z.diff) <= 3, 'nivå 3 ska bara ha små tidsskillnader');
    }
  }
  assert.ok(seen > 50, 'för få tidszonsfrågor');
});

test('planeträkning: heltalssvar som stämmer', () => {
  for (let s = 0; s < 200; s++) {
    const m = planetMath(createRng(s));
    assert.ok(Number.isInteger(m.answer) && m.answer > 0 && m.answer < 10000, m.prompt);
    assert.ok(m.explain.includes(String(m.answer)), `förklaringen visar inte svaret: ${m.explain}`);
  }
});

test('planetdata: ordning, storlek och fakta stämmer', () => {
  assert.deepEqual(PLANETS.map((p) => p.name), ['Merkurius', 'Venus', 'Jorden', 'Mars', 'Jupiter', 'Saturnus', 'Uranus', 'Neptunus']);
  for (let i = 1; i < PLANETS.length; i++) assert.ok(PLANETS[i].au > PLANETS[i - 1].au, 'avstånden ska öka utåt');
  const bySize = [...PLANETS].sort((a, b) => b.size - a.size).map((p) => p.id);
  assert.equal(bySize[0], 'jupiter');
  assert.equal(bySize[bySize.length - 1], 'merkurius');
  assert.equal(PLANETS.find((p) => p.id === 'mars').moons, '2');
  assert.equal(PLANETS.find((p) => p.id === 'neptunus').moons, '16');
});

test('stjärnbilder: varje bild har en berättelse från en annan kultur', () => {
  for (const c of CONSTELLATIONS) {
    assert.ok(c.culture && c.culture.length > 30, `${c.id} saknar kulturberättelse`);
    c.order.forEach((i) => assert.ok(c.stars[i], `${c.id}: ordningen pekar på en stjärna som saknas`));
  }
});
