// Enhetstester för Lekstaden: pengar och växel, prisjakten, recept, färgblandning, odling,
// bondgården, skolan, biblioteket, hemligheter, sortimentet och migrering av sparad lekdata.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRng } from '../../src/core/rng.js';
import { CURRICULUM } from '../../src/core/curriculum.js';
import {
  playApp, SCENES, ITEMS, itemById, SHOP_CATS, shopItems, withArticle, COINS, MONEY, payCoins, changeAllowed, fewestCoins,
  payState, changeBack, changeOptions, goalProgress, priceQuiz, QUIZ_MAX_PRICE, capEarn, DAILY_CAPS,
  PLANTS, GROW_MINUTES, canGrow, growTick, plantStage, INGREDIENTS, RECIPES, matchRecipe, bookRecipes,
  BASE_COLORS, MIXES, mixColors, TOOLS, PATIENTS, FARM_ANIMALS, FARM_FOODS, FARM_PRODUCTS, farmReaction, productReady,
  farmQuestion, FARM_MINUTES, BEACH_ITEMS, inSea, pantryInfo, WORDS, SCHOOL_SUBJECTS, schoolTask, BOOKS, booksForLevel,
  SECRETS, SECRET_TRIGGERS, SECRET_COUNT, secretIds, SLOTS, newCharacter, emptyPlay, normalizePlay, PLAY_VERSION, GARDEN_POTS,
} from '../../src/apps/play.js';

const VIEW_SRC = readFileSync(new URL('../../src/ui/views/play.js', import.meta.url), 'utf8');
const LEVELS = [0, 1, 2, 3, 4];
const SEEDS = Array.from({ length: 60 }, (_, i) => i * 7919 + 13);
const sum = (l) => l.reduce((a, b) => a + b, 0);

/* ---------------- Platser ---------------- */
test('varje plats har en vy, unikt id och en scen med hemligheter', () => {
  const ids = SCENES.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length, 'dubbla plats-id');
  assert.ok(SCENES.length >= 10, 'minst tio platser');
  for (const id of ['school', 'library', 'farm', 'beach']) assert.ok(ids.includes(id), `platsen ${id} saknas`);
  const dispatch = /\(\{([^}]+)\}\)\[id\]\(\)/.exec(VIEW_SRC);
  assert.ok(dispatch, 'hittar inte vy-tabellen i views/play.js');
  const mapped = dispatch[1].split(',').map((x) => x.trim());
  for (const s of SCENES) {
    assert.ok(s.name && s.icon && s.blurb && /^#[0-9a-f]{6}$/i.test(s.color), `${s.id}: namn/ikon/färg`);
    assert.ok(mapped.includes(s.id), `${s.id} saknas i vy-tabellen`);
    assert.match(VIEW_SRC, new RegExp(`function ${s.id}\\(\\)`), `${s.id} saknar vyfunktion`);
    // Platser med hemligheter måste rita en scen där hemligheterna kan visas.
    if (SECRETS[s.id]?.length) assert.match(VIEW_SRC, new RegExp(`makeStage\\('${s.id}'`), `${s.id} ritar ingen scen för sina hemligheter`);
  }
});

test('appen har giltiga läroplanskoder', () => {
  assert.equal(playApp.id, 'play');
  for (const m of playApp.modules) for (const id of m.lgr) assert.ok(CURRICULUM[id], `okänd läroplanskod ${id}`);
});

/* ---------------- Sortimentet ---------------- */
test('alla föremål har id, namn, bild, heltalspris, kategori och rätt grammatik', () => {
  const catIds = SHOP_CATS.map((c) => c.id);
  const ids = new Set();
  for (const it of ITEMS) {
    assert.ok(!ids.has(it.id), `dubbelt id ${it.id}`);
    ids.add(it.id);
    assert.ok(it.e && it.n && it.d, `${it.id}: bild, namn och bestämd form`);
    assert.ok(Number.isInteger(it.price) && it.price > 0, `${it.id}: pris`);
    assert.ok(catIds.includes(it.cat) && it.cat !== 'dröm', `${it.id}: kategori ${it.cat}`);
    assert.ok(['en', 'ett', ''].includes(it.g), `${it.id}: genus ${it.g}`);
    assert.equal(itemById(it.id), it);
    if (it.slot) assert.ok(SLOTS.includes(it.slot), `${it.id}: plats på kroppen`);
    if (it.grows) assert.ok(PLANTS[it.grows], `${it.id}: växer till okänd växt`);
    if (it.cat === 'frön') assert.ok(it.grows, `${it.id}: frö utan växt`);
    if (it.cat === 'kläder') assert.ok(it.slot, `${it.id}: kläder utan plats`);
    if (it.tap === 'pet') assert.ok(it.sound, `${it.id}: husdjur utan ljud`);
    if (it.dream) assert.ok(it.price >= 40, `${it.id}: drömköp ska vara ett sparmål`);
  }
  assert.equal(withArticle(itemById('piano')), 'ett piano');
  assert.equal(withArticle(itemById('bed')), 'en säng');
  assert.equal(withArticle(itemById('glasses')), 'glasögon');
});

test('varje föremål finns i exakt en butikshylla och varje hylla har varor', () => {
  for (const c of SHOP_CATS) assert.ok(shopItems(c.id).length > 0, `tom hylla ${c.id}`);
  for (const it of ITEMS) {
    const shelves = SHOP_CATS.filter((c) => shopItems(c.id).includes(it));
    assert.equal(shelves.length, 1, `${it.id} finns på ${shelves.length} hyllor`);
  }
  assert.ok(shopItems('dröm').length >= 5, 'minst fem drömköp');
  assert.ok(ITEMS.filter((i) => i.start).length >= 3, 'startsaker');
});

/* ---------------- Pengar och växel ---------------- */
test('fewestCoins betalar exakt med så få mynt som möjligt', () => {
  assert.deepEqual(fewestCoins(18), [10, 5, 2, 1]);
  assert.deepEqual(fewestCoins(0), []);
  assert.deepEqual(fewestCoins(87, MONEY), [50, 20, 10, 5, 2]);
  assert.equal(fewestCoins(3, [2]), null);
  for (let n = 1; n <= 200; n++) assert.equal(sum(fewestCoins(n, MONEY)), n);
});

test('varje vara går att betala exakt med mynten på varje nivå', () => {
  for (const lvl of LEVELS) {
    for (const it of ITEMS) {
      const coins = payCoins(lvl, it.price);
      const pay = fewestCoins(it.price, coins);
      assert.ok(pay, `nivå ${lvl}: ${it.id} (${it.price}) går inte att betala med ${coins}`);
      // Nivå 0 ska aldrig behöva fler än 15 mynt (prickar/staplar).
      if (lvl === 0) assert.ok(pay.length <= 15 + 9, `nivå 0: ${it.id} kräver ${pay.length} mynt`);
    }
  }
  assert.deepEqual(payCoins(0, 5), [1]);
  assert.ok(payCoins(4, 5).includes(100));
});

test('växel tillåts från nivå 3 (åk 2)', () => {
  assert.deepEqual(LEVELS.map(changeAllowed), [false, false, false, true, true]);
});

test('payState: fattas, precis, växel och onödigt mynt', () => {
  assert.deepEqual(payState([5, 1], 8), { sum: 6, status: 'short', missing: 2, change: 0 });
  assert.equal(payState([5, 2, 1], 8).status, 'exact');
  // 10 för något som kostar 7: varje mynt behövs → växel 3 (bara om växel är tillåten)
  assert.deepEqual(payState([10], 7, { allowChange: true }), { sum: 10, status: 'change', missing: 0, change: 3 });
  assert.equal(payState([10], 7).status, 'over');
  // 10 + 5 för 7: femman är onödig → ta bort ett mynt
  assert.equal(payState([10, 5], 7, { allowChange: true }).status, 'over');
  assert.equal(payState([20, 2], 21, { allowChange: true }).status, 'change');
  assert.equal(payState([], 3).status, 'short');
});

test('changeBack och changeOptions', () => {
  assert.equal(changeBack(20, 13), 7);
  assert.equal(changeBack(10, 10), 0);
  assert.equal(changeBack(5, 8), null);
  for (const seed of SEEDS) {
    const rng = createRng(seed);
    const change = rng.int(1, 60);
    const opts = changeOptions(change, rng);
    assert.equal(opts.length, 3);
    assert.ok(opts.includes(change));
    assert.equal(new Set(opts).size, 3);
    assert.ok(opts.every((v) => Number.isInteger(v) && v >= 1));
  }
});

test('sparmål: framsteg mot priset', () => {
  assert.deepEqual(goalProgress(30, 120), { have: 30, left: 90, pct: 25, done: false });
  assert.deepEqual(goalProgress(150, 120), { have: 120, left: 0, pct: 100, done: true });
  assert.deepEqual(goalProgress(undefined, 10), { have: 0, left: 10, pct: 0, done: false });
});

test('prisjakten: rätt svar, rimliga priser och nivåanpassade frågor', () => {
  const kindsAt = LEVELS.map(() => new Set());
  for (const lvl of LEVELS) {
    for (const seed of SEEDS) {
      const q = priceQuiz(lvl, createRng(seed + lvl));
      kindsAt[lvl].add(q.ask);
      assert.ok(q.text && q.say && q.explain, 'text/say/explain');
      q.items.forEach((it) => assert.ok(it.price <= QUIZ_MAX_PRICE[lvl], `nivå ${lvl}: för dyrt (${it.price})`));
      assert.equal(new Set(q.items.map((i) => i.price)).size, q.items.length, 'samma pris två gånger');
      if (lvl === 0) assert.equal(q.items.length, 2, 'nivå 0 jämför två saker');
      if (q.kind === 'pick') {
        assert.ok(q.options.includes(q.answer));
        const prices = q.items.map((i) => i.price);
        const ans = itemById(q.answer);
        if (q.ask === 'cheap') assert.equal(ans.price, Math.min(...prices));
        if (q.ask === 'dear') assert.equal(ans.price, Math.max(...prices));
        if (q.ask === 'afford') {
          assert.ok(ans.price <= q.budget);
          assert.ok(q.items.every((i) => i.price > q.budget || i.price <= ans.price), 'det finns en dyrare sak man har råd med');
        }
      } else {
        assert.ok(q.options.includes(q.answer) && new Set(q.options).size === q.options.length);
        const [a, b] = q.items;
        assert.equal(q.answer, q.ask === 'diff' ? a.price - b.price : a.price + b.price);
      }
    }
  }
  assert.deepEqual([...kindsAt[0]], ['cheap'], 'nivå 0: bara "vilken är billigast?"');
  assert.ok(kindsAt[4].has('afford') && kindsAt[4].has('sum'), 'nivå 4 ska vara utmanande');
});

test('dagligt tak för mynt i Lekstaden', () => {
  const st = emptyPlay();
  assert.equal(capEarn(st, 'quiz', 4, '2026-10-09'), 4);
  assert.equal(capEarn(st, 'quiz', 4, '2026-10-09'), DAILY_CAPS.quiz - 4);
  assert.equal(capEarn(st, 'quiz', 1, '2026-10-09'), 0);
  assert.equal(capEarn(st, 'quiz', 1, '2026-10-10'), 1, 'nytt tak nästa dag');
  assert.equal(capEarn(st, 'okänd', 50, '2026-10-10'), 50, 'utan tak');
});

/* ---------------- Köket ---------------- */
test('recept: ingredienser finns, exakta recept matchar bara exakt mängd', () => {
  const ingIds = new Set(INGREDIENTS.map((i) => i.id));
  const ids = new Set();
  for (const r of RECIPES) {
    assert.ok(!ids.has(r.id), `dubbelt recept ${r.id}`);
    ids.add(r.id);
    assert.ok(r.n && r.e && r.fact, `${r.id}: namn, bild, fakta`);
    for (const [k, n] of Object.entries(r.needs)) {
      assert.ok(ingIds.has(k), `${r.id}: okänd ingrediens ${k}`);
      assert.ok(Number.isInteger(n) && n > 0 && n <= 6, `${r.id}: rimlig mängd ${k}`);
    }
    assert.equal(matchRecipe({ ...r.needs }), r, `${r.id} matchar inte sitt eget recept`);
    if (!r.loose) {
      const k = Object.keys(r.needs)[0];
      const more = { ...r.needs, [k]: r.needs[k] + 1 };
      assert.notEqual(matchRecipe(more), r, `${r.id} matchar fel mängd`);
    }
  }
  assert.equal(matchRecipe({}), null);
  assert.equal(matchRecipe({ flour: 1 }), null);
});

test('hemliga recept hittas med vilken mängd som helst och syns inte i receptboken', () => {
  const secret = RECIPES.filter((r) => r.secret);
  assert.ok(secret.length >= 3);
  for (const r of secret) {
    assert.ok(r.loose);
    const doubled = Object.fromEntries(Object.keys(r.needs).map((k) => [k, 3]));
    assert.equal(matchRecipe(doubled), r);
    LEVELS.forEach((l) => assert.ok(!bookRecipes(l).includes(r)));
  }
  LEVELS.forEach((l) => assert.ok(bookRecipes(l).length >= 3, `nivå ${l}: för få recept i boken`));
});

test('odlade ingredienser går att odla eller få från bondgården', () => {
  const harvests = new Set(Object.values(PLANTS).map((p) => p.harvest));
  for (const ing of INGREDIENTS.filter((i) => i.grown)) assert.ok(harvests.has(ing.id), `${ing.id} går inte att odla`);
  for (const p of Object.values(PLANTS)) assert.ok(pantryInfo(p.harvest), `skörden ${p.harvest} saknar namn/bild`);
  for (const k of Object.keys(FARM_PRODUCTS)) assert.ok(pantryInfo(k), `produkten ${k} saknar namn/bild`);
});

/* ---------------- Färglabbet ---------------- */
test('färgblandning: ordningen spelar ingen roll, dubbla droppar räknas en gång', () => {
  const base = new Set(BASE_COLORS.map((c) => c.id));
  const keys = new Set();
  for (const m of MIXES) {
    m.needs.forEach((c) => assert.ok(base.has(c), `${m.n}: okänd grundfärg ${c}`));
    const key = [...m.needs].sort().join('+');
    assert.ok(!keys.has(key), `två blandningar ger ${key}`);
    keys.add(key);
    assert.match(m.hex, /^#[0-9a-f]{6}$/i);
    assert.equal(mixColors([...m.needs].reverse()), m);
    assert.equal(mixColors([...m.needs, m.needs[0]]), m);
  }
  assert.equal(mixColors(['red', 'yellow']).n, 'orange');
  assert.equal(mixColors(['blue', 'yellow']).n, 'grön');
  assert.equal(mixColors(['blue', 'red']).n, 'lila');
  assert.equal(mixColors(['red']), null);
  assert.equal(mixColors([]), null);
  // Alla blandningar ska gå att göra med högst fyra droppar (vyn tömmer kolven efter fyra).
  assert.ok(MIXES.every((m) => m.needs.length <= 4));
});

/* ---------------- Trädgården ---------------- */
test('odling: frö → grodd → planta → skörd, bara med vatten och väntan', () => {
  const pot = { plant: 'carrot', stage: 0, watered: false, wateredAt: 0 };
  let now = 1_000_000;
  assert.equal(plantStage(pot, now), 0);
  assert.equal(growTick(pot, now + GROW_MINUTES * 60000), false, 'växer inte utan vatten');
  for (let step = 1; step <= 3; step++) {
    pot.watered = true;
    pot.wateredAt = now;
    assert.equal(canGrow(pot, now + 1000), false, 'växer inte direkt');
    assert.equal(growTick(pot, now + GROW_MINUTES * 60000 - 1), false);
    assert.equal(growTick(pot, now + GROW_MINUTES * 60000), true);
    assert.equal(pot.stage, step);
    assert.equal(pot.watered, false, 'behöver nytt vatten');
    now += GROW_MINUTES * 60000;
  }
  pot.watered = true;
  pot.wateredAt = now;
  assert.equal(growTick(pot, now + 10 * GROW_MINUTES * 60000), false, 'växer inte förbi skörd');
  assert.equal(plantStage(pot), 3);
  assert.equal(plantStage({ plant: null }), -1);
  for (const [id, p] of Object.entries(PLANTS)) {
    assert.equal(p.stages.length, 4, `${id}: fyra steg`);
    assert.ok(p.n && p.fact, `${id}: namn och fakta`);
    assert.ok(ITEMS.some((i) => i.grows === id), `${id}: går inte att köpa frön`);
  }
});

/* ---------------- Bondgården ---------------- */
test('bondgården: djuren gillar rätt mat och säger nej till fel mat', () => {
  const foods = new Set(FARM_FOODS.map((f) => f.id));
  for (const a of FARM_ANIMALS) {
    assert.ok(a.n && a.e && a.sound && a.fact && a.ph, `${a.id}: data`);
    assert.ok(['växtätare', 'allätare', 'köttätare'].includes(a.diet));
    [...a.likes, ...a.no].forEach((f) => assert.ok(foods.has(f), `${a.id}: okänd mat ${f}`));
    assert.ok(!a.likes.some((f) => a.no.includes(f)), `${a.id}: gillar och ogillar samma mat`);
    for (const f of a.likes) assert.equal(farmReaction(a.id, f).ok, true);
    for (const f of a.no) {
      const r = farmReaction(a.id, f);
      assert.equal(r.ok, false);
      assert.equal(r.no, true);
      assert.ok(r.text.length > 10);
    }
    if (a.diet === 'växtätare') assert.ok(a.no.includes('worm') && a.no.includes('fish'), `${a.id}: växtätare äter inte djur`);
    if (a.product) assert.ok(FARM_PRODUCTS[a.product]);
  }
  FARM_FOODS.forEach((f) => assert.ok(f.ph && f.e && f.n));
  assert.equal(farmReaction('cat', 'milk').ok, false);
  assert.equal(farmReaction('nope', 'grass').ok, false);
});

test('bondgården: produkter (ägg, mjölk, ull) kommer högst var tionde minut', () => {
  const hen = FARM_ANIMALS.find((a) => a.id === 'hen');
  const horse = FARM_ANIMALS.find((a) => a.id === 'horse');
  assert.equal(productReady(hen, 0, 5), true);
  assert.equal(productReady(hen, 1000, 1000 + FARM_MINUTES * 60000 - 1), false);
  assert.equal(productReady(hen, 1000, 1000 + FARM_MINUTES * 60000), true);
  assert.equal(productReady(horse, 0), false);
});

test('bondens fråga: rätt svar finns, alternativen är unika och nivåanpassade', () => {
  for (const lvl of LEVELS) {
    for (const seed of SEEDS) {
      const q = farmQuestion(lvl, createRng(seed * 3 + lvl));
      const ids = q.options.map((o) => o.id);
      assert.ok(ids.includes(q.answer), `nivå ${lvl}: ${q.text}`);
      assert.equal(new Set(ids).size, ids.length, `dubbla alternativ: ${q.text}`);
      assert.ok(q.text && q.say && q.explain);
      if (lvl === 0) assert.ok(q.options.length <= 3, 'nivå 0: få alternativ');
      if (lvl <= 1) assert.notEqual(q.kind, 'diet', 'växtätare/allätare är för svårt för de minsta');
      q.options.forEach((o) => assert.ok(o.e && o.label));
      if (q.kind === 'eats' || q.kind === 'noteats') {
        const a = FARM_ANIMALS.find((x) => q.text.includes(` ${x.n} ${x.e}`));
        assert.ok(a, q.text);
        for (const o of q.options) assert.equal(farmReaction(a.id, o.id).ok, (o.id === q.answer) === (q.kind === 'eats'), `${q.text} ${o.id}`);
      }
    }
  }
});

/* ---------------- Stranden och kliniken ---------------- */
test('stranden: både saker som flyter och som sjunker, och havet går att träffa', () => {
  assert.ok(BEACH_ITEMS.some((b) => b.floats) && BEACH_ITEMS.some((b) => !b.floats));
  BEACH_ITEMS.forEach((b) => assert.ok(b.why.length > 20 && b.e && b.n, b.id));
  assert.equal(new Set(BEACH_ITEMS.map((b) => b.id)).size, BEACH_ITEMS.length);
  assert.equal(inSea(70, 60), true, 'tryck-släppet (70, 60) ska hamna i havet');
  assert.equal(inSea(10, 80), false);
  assert.equal(inSea(70, 20), false, 'himlen är inte hav');
});

test('djurkliniken: varje behandling går att göra med verktygen', () => {
  const tools = new Set(TOOLS.map((t) => t.id));
  PATIENTS.forEach((p) => {
    assert.ok(p.steps.length >= 1 && p.steps.every((s) => tools.has(s)), p.n);
    assert.ok(p.fact && p.problem);
  });
});

/* ---------------- Skolan ---------------- */
test('skolans tavla: varje ämne och nivå ger en lösbar uppgift', () => {
  for (const sub of SCHOOL_SUBJECTS) {
    for (const lvl of LEVELS) {
      for (const seed of SEEDS) {
        const t = schoolTask(lvl, createRng(seed + lvl * 101), sub.id);
        const vals = t.options.map((o) => o.value);
        assert.equal(t.subject, sub.id);
        assert.ok(vals.includes(t.answer), `${sub.id}/${lvl}: svaret saknas i ${JSON.stringify(vals)} (${t.text})`);
        assert.equal(new Set(vals).size, vals.length, `${sub.id}/${lvl}: dubbla alternativ ${JSON.stringify(vals)}`);
        assert.ok(t.text && t.say && t.explain, `${sub.id}/${lvl}: text/say/explain`);
        assert.ok(t.options.length >= 2 && t.options.length <= 3);
        if (lvl === 0) assert.equal(t.options.length, 2, `${sub.id}: nivå 0 har två alternativ`);
        if (typeof t.answer === 'number') assert.ok(t.answer >= 0 && Number.isFinite(t.answer));
      }
    }
  }
});

test('skolans räkning stämmer', () => {
  for (const lvl of LEVELS) {
    for (const seed of SEEDS) {
      const t = schoolTask(lvl, createRng(seed), 'math');
      const m = /^(\d+) ([+−×÷]) (\d+) = \?$/.exec(t.text);
      if (!m) continue;
      const [a, op, b] = [Number(m[1]), m[2], Number(m[3])];
      const want = { '+': a + b, '−': a - b, '×': a * b, '÷': a / b }[op];
      assert.equal(t.answer, want, t.text);
    }
  }
});

test('ordlistan: varje ord har bild, genus och plural', () => {
  for (const w of WORDS) {
    assert.ok(w.w && w.e && w.pl, w.w);
    assert.ok(['en', 'ett'].includes(w.g), w.w);
  }
  assert.equal(new Set(WORDS.map((w) => w.w)).size, WORDS.length);
});

/* ---------------- Biblioteket ---------------- */
test('biblioteket: böckerna har sidor och en fråga med rätt svar bland alternativen', () => {
  for (const b of BOOKS) {
    assert.ok(b.title && b.e && b.pages.length >= 3, b.id);
    b.pages.forEach(([e, text]) => assert.ok(e && /[.!?]$/.test(text), `${b.id}: sidan "${text}"`));
    const labels = b.q.options.map(([l]) => l);
    assert.ok(labels.includes(b.q.answer), `${b.id}: svaret saknas`);
    assert.equal(new Set(labels).size, labels.length);
    assert.ok(b.q.explain && b.q.text.endsWith('?'));
    if (b.lvl === 0) b.pages.forEach(([, text]) => assert.ok(text.split(' ').length <= 8, `${b.id}: för lång mening för förläsare`));
  }
  LEVELS.forEach((l) => assert.ok(booksForLevel(l).length >= 3, `nivå ${l}: för få böcker`));
});

/* ---------------- Hemligheter ---------------- */
test('varje hemlighet går att hitta', () => {
  const sceneIds = new Set(SCENES.map((s) => s.id));
  let n = 0;
  for (const [scene, list] of Object.entries(SECRETS)) {
    assert.ok(sceneIds.has(scene), `hemligheter i okänd plats ${scene}`);
    list.forEach((s, i) => {
      n++;
      assert.ok(s.e, `${scene}-${i}: bild`);
      assert.ok(s.x >= 3 && s.x <= 97 && s.y >= 3 && s.y <= 97, `${scene}-${i}: utanför scenen (${s.x}, ${s.y})`);
      if (s.when) {
        const trig = SECRET_TRIGGERS[s.when];
        assert.ok(trig, `${scene}-${i}: okänt villkor ${s.when}`);
        assert.equal(trig.scene, scene, `${scene}-${i}: villkoret gäller en annan plats`);
        const it = itemById(trig.item);
        assert.ok(it && it.start, `${scene}-${i}: saken som behövs (${trig.item}) måste finnas från början`);
        assert.ok(emptyPlay().placed[scene].some((pl) => pl.item === trig.item), `${scene}-${i}: ${trig.item} står inte i rummet från början`);
        assert.ok(trig.hint);
      }
      // inte ovanpå en annan hemlighet
      list.forEach((o, j) => {
        if (j > i) assert.ok(Math.hypot(o.x - s.x, o.y - s.y) >= 8, `${scene}-${i} och ${scene}-${j} ligger för nära`);
      });
    });
  }
  assert.equal(n, SECRET_COUNT);
  assert.equal(secretIds().length, SECRET_COUNT);
  assert.equal(new Set(secretIds()).size, SECRET_COUNT);
  // Varje plats med scen har minst två hemligheter
  for (const s of SCENES) assert.ok((SECRETS[s.id] || []).length >= 2, `${s.id}: för få hemligheter`);
});

/* ---------------- Figurer ---------------- */
test('nya figurer har alla fält', () => {
  const c = newCharacter(createRng(5).next);
  for (const k of ['id', 'name', 'skin', 'hair', 'hairColor', 'shirt', 'pants']) assert.ok(c[k], k);
  assert.deepEqual(c.wear, {});
});

/* ---------------- Sparad lekdata ---------------- */
// Så här såg sparad lekdata ut i version 1 (före Skolan, Biblioteket, Bondgården och Stranden).
const V1 = {
  v: 1,
  inv: { bed: 1, lamp: 1, plant: 1, teddy: 2, crown: 1, 'seed-carrot': 3, cat: 1 },
  placed: { house: [{ uid: 'p1', item: 'bed', x: 22, y: 70 }, { uid: 'u1', item: 'teddy', x: 40, y: 80 }] },
  chars: [{ id: 'c1', name: 'Mio', skin: '#ffe0c7', hair: 'kort', hairColor: '#2b1d14', shirt: '#3d8bfd', pants: '#ef4444', wear: { head: 'crown' } }],
  charPos: { house: { c1: { x: 40, y: 70 } } },
  garden: [{ plant: 'carrot', stage: 2, watered: true, wateredAt: 1700000000000 }, { plant: null, stage: 0, watered: false, wateredAt: 0 }],
  pantry: { carrot: 2, tomato: 1 },
  colors: { orange: '#f97316', grön: '#22c55e' },
  recipes: { pancakes: 2 },
  secrets: { 'house-0': 1, 'garden-2': 1 },
  patients: 7,
  bought: 4,
};

test('migrering: version 1 behålls och får nya fält', () => {
  const st = normalizePlay(JSON.parse(JSON.stringify(V1)));
  assert.equal(st.v, PLAY_VERSION);
  assert.equal(st.inv.teddy, 2);
  assert.equal(st.inv['seed-carrot'], 3);
  assert.equal(st.placed.house.length, 2);
  assert.equal(st.chars[0].name, 'Mio');
  assert.equal(st.chars[0].wear.head, 'crown');
  assert.deepEqual(st.charPos.house.c1, { x: 40, y: 70 });
  assert.equal(st.garden.length, GARDEN_POTS, 'krukorna fylls på');
  assert.equal(st.garden[0].stage, 2);
  assert.equal(st.garden[0].watered, true);
  assert.deepEqual(st.pantry, { carrot: 2, tomato: 1 });
  assert.deepEqual(st.colors, { orange: '#f97316', grön: '#22c55e' });
  assert.deepEqual(st.recipes, { pancakes: 2 });
  assert.deepEqual(st.secrets, { 'house-0': 1, 'garden-2': 1 });
  assert.equal(st.patients, 7);
  assert.equal(st.bought, 4);
  // nya fält i v2
  assert.deepEqual(st.school, { solved: 0, streak: 0 });
  assert.deepEqual(st.farm, { lastProduct: {}, fed: {} });
  assert.deepEqual(st.books, {});
  assert.deepEqual(st.beach, {});
  assert.equal(st.goal, null);
  assert.deepEqual(st.quiz, { right: 0 });
});

test('migrering: tom, trasig eller okänd data blir ett giltigt läge', () => {
  for (const raw of [undefined, null, 'skräp', 42, [], {}, { houses: 3, colors: { red: 1 } }]) {
    const st = normalizePlay(raw);
    assert.deepEqual(Object.keys(st).sort(), Object.keys(emptyPlay()).sort(), JSON.stringify(raw));
    assert.equal(st.garden.length, GARDEN_POTS);
    assert.ok(st.inv.bed, 'startsakerna finns');
  }
  const st = normalizePlay({
    inv: { bed: 'två', lamp: -3, ghost: 5, sofa: 2.7 },
    placed: { house: [{ item: 'unicorn-xl', x: 1, y: 1 }, { item: 'sofa', x: 500, y: -20 }, 'skräp'] },
    chars: [{ name: 'Utan id' }, { id: 7, name: 'Ett mycket mycket långt namn', hair: 'rakat', wear: { head: 'nope', face: 'glasses', tail: 'crown' } }],
    charPos: { house: { c1: 'skräp', c2: { x: 'a', y: 200 } } },
    garden: [{ plant: 'banan', stage: 9 }, { plant: 'tomato', stage: 9, watered: 'ja' }, 'x'],
    pantry: { carrot: -1, ufo: 3, egg: 2 },
    colors: { orange: 1, okänd: '#123456' },
    recipes: { pancakes: 1, gift: 3 },
    secrets: { 'house-0': 1, 'house-99': 1, 'mars-0': 1 },
    patients: 'många',
    school: { solved: -4, streak: 'x' },
    goal: 'unicorn',
    earned: { day: '2026-10-09', n: { quiz: 3, sell: 'x' } },
  });
  assert.deepEqual(st.inv, { sofa: 2 });
  assert.deepEqual(st.placed.house.map((p) => p.item), ['sofa']);
  assert.ok(st.placed.house[0].x <= 97 && st.placed.house[0].y >= 5);
  assert.equal(st.chars.length, 1);
  assert.equal(st.chars[0].id, '7');
  assert.ok(st.chars[0].name.length <= 12);
  assert.ok(['kort', 'lockigt', 'tofsar', 'långt', 'flint', 'tuppkam'].includes(st.chars[0].hair));
  assert.deepEqual(st.chars[0].wear, { face: 'glasses' });
  assert.deepEqual(st.charPos.house, { c2: { x: 50, y: 95 } });
  assert.equal(st.garden[0].plant, null);
  assert.equal(st.garden[1].stage, 3);
  assert.deepEqual(st.pantry, { egg: 2 });
  assert.deepEqual(st.colors, { orange: '#f97316' });
  assert.deepEqual(st.recipes, { pancakes: 1 });
  assert.deepEqual(st.secrets, { 'house-0': 1 });
  assert.equal(st.patients, 0);
  assert.deepEqual(st.school, { solved: 0, streak: 0 });
  assert.equal(st.goal, 'unicorn');
  assert.deepEqual(st.earned, { day: '2026-10-09', n: { quiz: 3 } });
});

test('migrering är idempotent och tål JSON', () => {
  const once = normalizePlay(JSON.parse(JSON.stringify(V1)));
  const twice = normalizePlay(JSON.parse(JSON.stringify(once)));
  assert.deepEqual(twice, once);
  const fresh = emptyPlay();
  assert.deepEqual(normalizePlay(JSON.parse(JSON.stringify(fresh))), fresh);
});

test('mynten är svenska valörer', () => {
  assert.deepEqual(COINS, [1, 2, 5, 10]);
  assert.deepEqual(MONEY, [1, 2, 5, 10, 20, 50, 100]);
});
