// Världen (SO): kartmatematik, data och generatorer.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRng } from '../../src/core/rng.js';
import { CURRICULUM } from '../../src/core/curriculum.js';
import {
  worldApp, CONTINENTS, OCEANS, OUTLINES, WORLD_ANIMALS, PLACES, COUNTRIES, SWEDISH_CITIES, SWEDISH_NATURE, SWEDEN_PLACES,
  SWEDEN_BOUNDS, SWEDEN_OUTLINE, HOLIDAYS, TIMELINE, ERAS, DIRECTIONS, PAST_LIFE, RULE_CASES, TRAFFIC, TRUE_FALSE,
  projectSweden, bearing8, bearingDeg, isClearBearing, clearTargets, inCountry, atPlace, worldMapSvg, swedenSvg, swedenMapHtml, mapProj, MAP_W, MAP_H,
} from '../../src/apps/world.js';

const city = (id) => SWEDEN_PLACES.find((p) => p.id === id);
const GENS = worldApp.modules.filter((m) => m.gen);

/* ---------- Väderstreck ---------- */
test('bearing8: alla åtta väderstreck nära ekvatorn', () => {
  const o = { lat: 0, lon: 0 };
  const cases = [[[1, 0], 'norr'], [[1, 1], 'nordost'], [[0, 1], 'öster'], [[-1, 1], 'sydost'], [[-1, 0], 'söder'], [[-1, -1], 'sydväst'], [[0, -1], 'väster'], [[1, -1], 'nordväst']];
  for (const [[lat, lon], dir] of cases) assert.equal(bearing8(o, { lat, lon }), dir, `${lat},${lon}`);
});

test('bearing8: kända svenska städer', () => {
  assert.equal(bearing8(city('malmo'), city('kiruna')), 'norr');
  assert.equal(bearing8(city('kiruna'), city('malmo')), 'söder');
  assert.equal(bearing8(city('goteborg'), city('visby')), 'öster');
  assert.equal(bearing8(city('goteborg'), city('stockholm')), 'nordost');
  assert.equal(bearing8(city('stockholm'), city('goteborg')), 'sydväst');
  assert.equal(bearing8(city('stockholm'), city('ostersund')), 'nordväst');
  assert.equal(bearing8(city('umea'), city('jonkoping')), 'sydväst');
});

test('bearingDeg är symmetrisk (motsatt riktning = +180°)', () => {
  for (const [a, b] of [['goteborg', 'kiruna'], ['malmo', 'umea'], ['visby', 'karlstad']]) {
    const d = (bearingDeg(city(b), city(a)) - bearingDeg(city(a), city(b)) + 360) % 360;
    assert.ok(Math.abs(d - 180) < 1, `${a}–${b}: ${d}`);
  }
});

test('clearTargets ger bara tydliga riktningar och tillräckligt många mål', () => {
  for (const from of SWEDISH_CITIES) {
    for (const t of clearTargets(from)) {
      assert.ok(isClearBearing(from, t));
      const off = Math.abs((bearingDeg(from, t) % 45) - 22.5);
      assert.ok(off >= 10, `${from.id}→${t.id} ligger nära gränsen mellan två väderstreck`);
    }
  }
  assert.ok(clearTargets(city('goteborg'), SWEDISH_CITIES).length >= 6, 'Sverigekartans väderstrecksläge behöver minst sex mål från Göteborg');
});

/* ---------- Sverigekartan ---------- */
test('projectSweden: kända städer hamnar rätt på kartan', () => {
  const p = (id) => projectSweden(city(id).lat, city(id).lon);
  assert.ok(p('goteborg').x < 0.15, 'Göteborg ligger långt västerut');
  assert.ok(p('stockholm').x > 0.5 && p('stockholm').x < 0.6, 'Stockholm');
  assert.ok(p('kiruna').y < 0.15, 'Kiruna högt upp');
  assert.ok(p('malmo').y > 0.9 && p('smygehuk').y > 0.95, 'Skåne längst ner');
  assert.ok(p('treriksroset').y < 0.05);
  assert.ok(p('lulea').x > p('umea').x, 'Luleå ligger öster om Umeå');
  // Hörnen
  assert.deepEqual(projectSweden(SWEDEN_BOUNDS.top, SWEDEN_BOUNDS.left), { x: 0, y: 0 });
  const br = projectSweden(SWEDEN_BOUNDS.bottom, SWEDEN_BOUNDS.right);
  assert.ok(Math.abs(br.x - 1) < 1e-9 && Math.abs(br.y - 1) < 1e-9);
});

// Punkt i polygon (ray casting) och avstånd till kant i grader.
function inside([x, y], poly) {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}
function edgeDist([x, y], poly) {
  let best = Infinity;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [ax, ay] = poly[j];
    const [bx, by] = poly[i];
    const t = Math.max(0, Math.min(1, ((x - ax) * (bx - ax) + (y - ay) * (by - ay)) / ((bx - ax) ** 2 + (by - ay) ** 2 || 1)));
    best = Math.min(best, Math.hypot(x - (ax + t * (bx - ax)), y - (ay + t * (by - ay))));
  }
  return best;
}

test('alla svenska platser ligger inom kartgränserna och på (eller vid) den ritade Sverigekartan', () => {
  for (const p of SWEDEN_PLACES) {
    const q = projectSweden(p.lat, p.lon);
    assert.ok(q.x > 0.02 && q.x < 0.98 && q.y > 0.01 && q.y < 0.99, `${p.id} utanför kartan: ${q.x}, ${q.y}`);
    const pt = [p.lon, p.lat];
    const shapes = [...SWEDEN_OUTLINE.land, ...SWEDEN_OUTLINE.lakes];
    const ok = shapes.some((s) => inside(pt, s) || edgeDist(pt, s) < 0.3);
    assert.ok(ok, `${p.id} hamnar utanför den ritade kartan`);
  }
  for (const poly of [...SWEDEN_OUTLINE.land, ...SWEDEN_OUTLINE.lakes]) {
    for (const [lon, lat] of poly) assert.ok(lat <= SWEDEN_BOUNDS.top && lat >= SWEDEN_BOUNDS.bottom && lon >= SWEDEN_BOUNDS.left && lon <= SWEDEN_BOUNDS.right);
  }
});

test('sjöar på Sverigekartan ligger i rätt sjöpolygon', () => {
  const lakeOf = { vanern: 0, vattern: 1, malaren: 2 };
  for (const [id, i] of Object.entries(lakeOf)) assert.ok(inside([city(id).lon, city(id).lat], SWEDEN_OUTLINE.lakes[i]), id);
});

test('ritad Sverigekarta och minikarta ger giltig markup utan undefined/NaN', () => {
  const svg = swedenSvg();
  assert.match(svg, /^<svg[^>]+viewBox="0 0 \d+ 1000"/);
  assert.ok(!/undefined|NaN/.test(svg));
  const mini = swedenMapHtml([city('kiruna'), city('malmo')], { labels: true });
  assert.ok(mini.includes('smap-pin') && mini.includes('Kiruna') && !/undefined|NaN/.test(mini));
});

/* ---------- Världskartan ---------- */
test('världskartan: varje världsdel och hav har kontur/träffyta inom kartan', () => {
  for (const c of CONTINENTS) assert.ok(OUTLINES[c.id]?.length, c.id);
  const svg = worldMapSvg(null, { oceans: true });
  for (const x of [...CONTINENTS, ...OCEANS]) assert.ok(svg.includes(`data-hit="${x.id}"`), x.id);
  const noCont = worldMapSvg(null, { oceans: true, contHits: false });
  for (const c of CONTINENTS) assert.ok(!noCont.includes(`data-hit="${c.id}"`), `${c.id} ska inte vara tryckbar i havsfrågor`);
  for (const o of OCEANS) for (const [lon, lat, rx, ry] of o.spots) {
    const [x, y] = mapProj([lon, lat]);
    assert.ok(x - rx >= 0 && x + rx <= MAP_W && y - ry >= 0 && y + ry <= MAP_H, `${o.id} sticker utanför kartan`);
  }
});

test('havens tryckytor täcker inte världsdelarnas mittpunkter', () => {
  for (const o of OCEANS) for (const [lon, lat, rx, ry] of o.spots) {
    for (const c of CONTINENTS) for (const poly of OUTLINES[c.id]) {
      const cx = poly.reduce((s, p) => s + p[0], 0) / poly.length;
      const cy = poly.reduce((s, p) => s + p[1], 0) / poly.length;
      if (!inside([cx, cy], poly)) continue;
      const d = ((cx - lon) / rx) ** 2 + ((cy - lat) / ry) ** 2;
      assert.ok(d > 1, `${o.id} täcker mitten av ${c.id}`);
    }
  }
});

/* ---------- Data ---------- */
test('unika id:n i alla listor', () => {
  const lists = { CONTINENTS, OCEANS, WORLD_ANIMALS, PLACES, COUNTRIES, SWEDEN_PLACES, HOLIDAYS, TIMELINE, ERAS };
  for (const [name, list] of Object.entries(lists)) {
    const ids = list.map((x) => x.id);
    assert.equal(new Set(ids).size, ids.length, `${name} har dubbla id:n`);
  }
  const flags = COUNTRIES.map((c) => c.flag);
  assert.equal(new Set(flags).size, flags.length, 'dubbla flaggor');
  const caps = COUNTRIES.filter((c) => c.capital).map((c) => c.capital);
  assert.equal(new Set(caps).size, caps.length, 'dubbla huvudstäder');
});

test('referenser pekar på data som finns', () => {
  const regions = new Set([...CONTINENTS.map((c) => c.id), 'arktis']);
  for (const a of WORLD_ANIMALS) {
    assert.ok(regions.has(a.home), a.id);
    for (const r of a.not || []) assert.ok(regions.has(r) && r !== a.home, `${a.id}: not ${r}`);
  }
  for (const p of PLACES) assert.ok(CONTINENTS.some((c) => c.id === p.cont) && p.e && p.in, p.id);
  for (const c of COUNTRIES) assert.ok(c.cont === null || CONTINENTS.some((x) => x.id === c.cont), c.id);
  for (const c of SWEDISH_CITIES) {
    if (c.lake) assert.ok(SWEDISH_NATURE.some((n) => n.id === c.lake), `${c.id}: sjön ${c.lake}`);
    assert.ok(['Götaland', 'Svealand', 'Norrland'].includes(c.landsdel), c.id);
  }
  for (const m of worldApp.modules) for (const id of m.lgr) assert.ok(CURRICULUM[id], `${m.id}: ${id}`);
});

test('grammatik: rätt preposition för länder och platser', () => {
  const c = (id) => COUNTRIES.find((x) => x.id === id);
  assert.equal(inCountry(c('norge')), 'i Norge');
  assert.equal(inCountry(c('island')), 'på Island');
  assert.equal(atPlace(city('gotland')), 'på Gotland');
  assert.equal(atPlace(city('oland')), 'på Öland');
  assert.equal(atPlace(city('malmo')), 'i Malmö');
  assert.equal(atPlace(city('vanern')), 'i Vänern');
  assert.equal(atPlace(city('treriksroset')), 'vid Treriksröset');
});

test('rimliga fakta: Sverige från norr till söder och de största platserna', () => {
  const north = SWEDEN_PLACES.reduce((a, b) => (b.lat > a.lat ? b : a));
  const south = SWEDEN_PLACES.reduce((a, b) => (b.lat < a.lat ? b : a));
  assert.equal(north.id, 'treriksroset');
  assert.equal(south.id, 'smygehuk');
  // ≈ 1 570 km fågelvägen
  const km = 111.2 * Math.hypot(north.lat - south.lat, (north.lon - south.lon) * Math.cos((62 * Math.PI) / 180));
  assert.ok(km > 1500 && km < 1650, `${km} km`);
  for (let i = 1; i < TIMELINE.length; i++) assert.ok(TIMELINE[i].y > TIMELINE[i - 1].y, 'tidslinjen ska vara sorterad');
});

test('frågebankerna har nivåintervall och förklaringar', () => {
  for (const [name, bank] of Object.entries({ PAST_LIFE, RULE_CASES, TRAFFIC, TRUE_FALSE })) {
    for (const x of bank) {
      assert.ok((x.min ?? 0) <= (x.max ?? 4), `${name}: ${x.q || x.s}`);
      assert.ok((x.ex || '').length > 15, `${name}: förklaring saknas för ${x.q || x.s}`);
    }
    for (let lvl = 0; lvl <= 4; lvl++) {
      if (name === 'TRUE_FALSE' || name === 'TRAFFIC' || name === 'RULE_CASES' || name === 'PAST_LIFE') {
        assert.ok(bank.some((x) => (x.min ?? 0) <= lvl && lvl <= (x.max ?? 4)), `${name} saknar frågor på nivå ${lvl}`);
      }
    }
  }
  for (const x of PAST_LIFE.filter((p) => (p.min ?? 0) === 0)) assert.ok(Array.isArray(x.a) && x.w.every(Array.isArray), `nivå 0 kräver bildsvar: ${x.q}`);
  for (const x of RULE_CASES.filter((p) => (p.min ?? 0) === 0)) assert.ok(Array.isArray(x.a) && x.w.every(Array.isArray), `nivå 0 kräver bildsvar: ${x.q}`);
  for (const x of TRAFFIC.filter((p) => (p.min ?? 0) === 0)) assert.ok(Array.isArray(x.a) && x.w.every(Array.isArray), `nivå 0 kräver bildsvar: ${x.q}`);
});

/* ---------- Generatorer ---------- */
const SEEDS = 200;
function each(fn) {
  for (const m of GENS) for (let level = 0; level <= 4; level++) for (let s = 0; s < SEEDS; s++) fn(m, level, m.gen(level, createRng(s * 104729 + level * 31 + 7), { found: {} }), s);
}

test('generatorer: giltiga svar och lärande förklaringar på alla nivåer', () => {
  each((m, level, q, s) => {
    const ctx = `${m.id} nivå ${level} frö ${s}`;
    assert.ok(q.prompt && q.explain && q.explain.length > 10, `${ctx}: förklaring saknas`);
    assert.ok(!/undefined|NaN|\bnull\b/.test(`${q.prompt} ${q.say || ''} ${q.hint || ''} ${q.explain}`), `${ctx}: skräptext`);
    if (q.type === 'choice') {
      const ids = q.options.map((o) => o.id);
      assert.ok(ids.includes(q.answer), `${ctx}: svaret saknas`);
      assert.equal(new Set(ids).size, ids.length, `${ctx}: dubbla alternativ`);
      const labels = q.options.map((o) => o.label).filter(Boolean);
      assert.equal(new Set(labels).size, labels.length, `${ctx}: dubbla etiketter ${labels}`);
    }
    if (q.type === 'tap') assert.ok(q.visual.includes(`data-hit="${q.answer}"`), ctx);
  });
});

test('nivå 0: bildsvar och högst tre alternativ (förläsare)', () => {
  for (const m of GENS.filter((x) => (x.minLevel ?? 0) === 0)) {
    for (let s = 0; s < SEEDS; s++) {
      const q = m.gen(0, createRng(s * 7 + 3), { found: {} });
      const ctx = `${m.id} frö ${s}`;
      if (q.type === 'choice') {
        assert.ok(q.options.length <= 3, `${ctx}: ${q.options.length} alternativ`);
        const pictures = q.options.every((o) => o.html);
        const numbers = q.options.every((o) => /^\d+ kr$/.test(o.label || ''));
        assert.ok(pictures || numbers, `${ctx}: nivå 0 behöver bildsvar (${q.prompt})`);
      } else assert.ok(['sort', 'order', 'tap'].includes(q.type), `${ctx}: ${q.type}`);
      if (q.type === 'sort') assert.ok(q.items.length <= 4, `${ctx}: för många saker att sortera`);
    }
  }
});

test('nivå 4 är svårare än nivå 1 (fler alternativ i snitt)', () => {
  const avg = (lvl) => {
    let n = 0;
    let k = 0;
    for (const m of GENS) for (let s = 0; s < 60; s++) {
      const q = m.gen(lvl, createRng(s + 11), { found: {} });
      if (q.type === 'choice') {
        n += q.options.length;
        k++;
      }
    }
    return n / k;
  };
  assert.ok(avg(4) > avg(1), `${avg(4)} vs ${avg(1)}`);
});

test('Sverigequiz och väderstreck: svaren stämmer med koordinaterna', () => {
  const sq = worldApp.modules.find((m) => m.id === 'swedenquiz');
  const cp = worldApp.modules.find((m) => m.id === 'compass');
  for (let level = 0; level <= 4; level++) for (let s = 0; s < SEEDS; s++) {
    const q = sq.gen(level, createRng(s * 13 + level), { found: {} });
    if (/längst (norrut|söderut)/.test(q.prompt)) {
      const [a, b] = q.options.map((o) => city(o.id));
      const ans = city(q.answer);
      const other = ans === a ? b : a;
      assert.ok(q.prompt.includes('norrut') ? ans.lat > other.lat : ans.lat < other.lat, q.prompt);
    }
    if (q.type === 'order') {
      const lats = q.answerOrder.map((id) => city(id).lat);
      for (let i = 1; i < lats.length; i++) assert.ok(lats[i] < lats[i - 1], 'norr till söder');
    }
    const c = cp.gen(level, createRng(s * 17 + level), { found: {} });
    assert.ok(DIRECTIONS.includes(c.answer), c.answer);
    const m = c.prompt.match(/^Du är (?:i|på|vid) (.+)\. Åt vilket håll ligger (.+)\?$/);
    if (m) {
      const from = SWEDEN_PLACES.find((p) => p.name === m[1]);
      const to = SWEDEN_PLACES.find((p) => p.name === m[2]);
      assert.equal(bearing8(from, to), c.answer, c.prompt);
      assert.ok(isClearBearing(from, to), `otydlig riktning: ${c.prompt}`);
    }
  }
});

test('tidslinjer: svarsordningen är kronologisk', () => {
  const hist = worldApp.modules.find((m) => m.id === 'history');
  const year = Object.fromEntries(TIMELINE.map((t) => [t.id, t.y]));
  const eraIdx = Object.fromEntries(ERAS.map((e, i) => [e.id, i]));
  for (let level = 0; level <= 4; level++) for (let s = 0; s < SEEDS; s++) {
    const q = hist.gen(level, createRng(s * 19 + level), { found: {} });
    if (q.type !== 'order') continue;
    const vals = q.answerOrder.map((id) => year[id] ?? eraIdx[id]);
    for (let i = 1; i < vals.length; i++) assert.ok(vals[i] > vals[i - 1], q.answerOrder.join(','));
  }
});

test('djur: fel alternativ är aldrig en plats där djuret också lever', () => {
  const an = worldApp.modules.find((m) => m.id === 'animals');
  for (let level = 1; level <= 4; level++) for (let s = 0; s < SEEDS; s++) {
    const q = an.gen(level, createRng(s * 23 + level), { found: {} });
    const a = WORLD_ANIMALS.find((x) => q.prompt.includes(x.def));
    assert.ok(a, q.prompt);
    for (const o of q.options) assert.ok(!(a.not || []).includes(o.id), `${a.id}: ${o.id}`);
  }
});
