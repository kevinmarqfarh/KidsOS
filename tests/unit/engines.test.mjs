import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRng } from '../../src/core/rng.js';
import { genAddSub, genTimes, genTenPairs, genDoubleHalf, genNeighbors, genPlaceValue, genClock, minutesForLevel } from '../../src/apps/math.js';
import { timeToSwedish, digitalTime, clockSvg, baseTen, hourWord } from '../../src/ui/visuals.js';
import { ROBOT_LEVELS, parseProgram, programToString, runProgram, blockCount, shortestPath, parseLevel, turtleSegments, shapeSignature, TURTLE_CHALLENGES, genPredict, expand } from '../../src/apps/code.js';
import { GLYPHS, UPPER, LOWER, DIGITS, scoreTrace, layoutWord, resample, strokeHints } from '../../src/apps/letters.js';
import { slideDistance, seesawTorque, SEESAW_MISSIONS, SEESAW_ANIMALS, SURFACES, FLOAT_ITEMS, MAGNET_ITEMS } from '../../src/apps/science.js';
import { moonPhaseName, moonIllumination, GBG_DAYLIGHT, PLANETS, CONSTELLATIONS, seasonForMonth } from '../../src/apps/space.js';
import { ALPHABET, LETTERS, STORIES, RHYMES, SYLLABLES } from '../../src/apps/svenska.js';
import { SPECIES, LIFECYCLES } from '../../src/apps/biology.js';
import { WONDERS, wonderOfTheDay } from '../../src/apps/wonder.js';
import { TROPHIES, awardTrophies, nextTrophy, trophyProgress } from '../../src/core/trophies.js';
import { newProfile, addToSet, bump } from '../../src/core/model.js';
import { loadState, saveState, exportBackup, importBackup, saveDrawing, loadDrawings, MAX_DRAWINGS, isPersistent } from '../../src/core/storage.js';

const evalArith = (expr) => {
  const e = expr.replace(/×/g, '*').replace(/÷/g, '/');
  assert.match(e, /^[\d\s+\-*/]+$/);
  return Function(`return (${e})`)();
};

test('matte: plus/minus, gånger/delat stämmer räknemässigt', () => {
  for (let lvl = 0; lvl <= 4; lvl++) for (let s = 0; s < 300; s++) {
    const q = genAddSub(lvl, createRng(s));
    const m = /^(.+) = (\d+)\.$/.exec(q.explain);
    assert.ok(m, q.explain);
    assert.equal(evalArith(m[1]), Number(m[2]));
    assert.equal(Number(q.answer), Number(m[2]));
    const t = genTimes(lvl, createRng(s));
    const tm = /^(\d+) (×|÷) (\d+) = (\d+)/.exec(t.explain);
    assert.equal(evalArith(`${tm[1]} ${tm[2]} ${tm[3]}`), Number(tm[4]));
    assert.equal(t.answer, Number(tm[4]));
  }
});

test('matte: plus/minus håller sig inom talområdet för små barn', () => {
  for (let s = 0; s < 300; s++) {
    const q0 = genAddSub(0, createRng(s));
    assert.ok(Number(q0.answer) <= 5, `nivå 0 ska vara inom 5: ${q0.explain}`);
    const q1 = genAddSub(1, createRng(s));
    assert.ok(Number(q1.answer) <= 10);
  }
});

test('matte: tiokompisar, dubbelt/hälften, talföljder, positionssystem', () => {
  for (let lvl = 0; lvl <= 4; lvl++) for (let s = 0; s < 200; s++) {
    const t = genTenPairs(lvl, createRng(s));
    const m = /(\d+) \+ (\d+) = (\d+)/.exec(t.explain) || /(\d+) och (\d+) är kompisar – tillsammans blir de (\d+)/.exec(t.explain);
    assert.equal(Number(m[1]) + Number(m[2]), Number(m[3]));
    assert.equal(Number(t.answer), Number(m[2]));
    const d = genDoubleHalf(lvl, createRng(s));
    assert.ok(Number.isInteger(Number(d.answer)));
    const n = genNeighbors(lvl, createRng(s));
    assert.ok(Number(n.answer) >= 0);
    if (lvl >= 2) {
      const pv = genPlaceValue(lvl, createRng(s));
      assert.ok(pv.answer >= 0 && pv.answer <= 999);
    }
  }
});

test('svenska tidsuttryck', () => {
  assert.equal(timeToSwedish(3, 0), 'klockan tre');
  assert.equal(timeToSwedish(3, 30), 'halv fyra');
  assert.equal(timeToSwedish(2, 45), 'kvart i tre');
  assert.equal(timeToSwedish(2, 15), 'kvart över två');
  assert.equal(timeToSwedish(12, 30), 'halv ett');
  assert.equal(timeToSwedish(11, 55), 'fem i tolv');
  assert.equal(timeToSwedish(9, 25), 'fem i halv tio');
  assert.equal(timeToSwedish(9, 35), 'fem över halv tio');
  assert.equal(digitalTime(7, 5), '07:05');
  assert.equal(hourWord(12), 'tolv');
  assert.equal(hourWord(13), 'ett');
});

test('klockan: visarnas vinklar och nivåernas minutsteg', () => {
  const svg = clockSvg(3, 30);
  assert.match(svg, /rotate\(105 110 110\)/, 'timvisaren mitt mellan 3 och 4');
  assert.match(svg, /rotate\(180 110 110\)/, 'minutvisaren på 6');
  assert.deepEqual(minutesForLevel(0), [0]);
  assert.deepEqual(minutesForLevel(1), [0, 30]);
  for (let lvl = 0; lvl <= 4; lvl++) for (let s = 0; s < 100; s++) {
    const q = genClock(lvl, createRng(s));
    if (q.type === 'choice') assert.equal(new Set(q.options.map((o) => o.label)).size, q.options.length, 'olika tider ska ha olika text');
  }
});

test('tiobasmaterial ritar rätt antal delar', () => {
  const s = baseTen(234);
  assert.equal((s.match(/#ffc93c/g) || []).length, 2);
  assert.equal((s.match(/#3fb67a/g) || []).length, 3);
  assert.equal((s.match(/#ff6b5b/g) || []).length, 4);
});

test('robotbanor: alla facit vinner inom blockgränsen', () => {
  for (const L of ROBOT_LEVELS) {
    const p = parseProgram(L.solution);
    assert.equal(runProgram(L, p).result, 'win', `bana ${L.id}`);
    assert.ok(blockCount(p) <= L.maxBlocks, `bana ${L.id} facit för långt`);
    const sp = shortestPath(L);
    assert.ok(sp, `bana ${L.id} ska vara lösbar`);
  }
});

test('robotbanor: loopbanor kräver verkligen loopar', () => {
  for (const L of ROBOT_LEVELS.filter((x) => x.loops)) {
    const sp = shortestPath(L);
    assert.ok(sp.length > L.maxBlocks, `bana ${L.id} går att lösa utan loop inom ${L.maxBlocks} block`);
  }
});

test('robotbanor: id i följd och unika titlar', () => {
  ROBOT_LEVELS.forEach((L, i) => assert.equal(L.id, i + 1));
  assert.equal(new Set(ROBOT_LEVELS.map((l) => l.title)).size, ROBOT_LEVELS.length);
});

test('robotmotorn upptäcker krock, vatten och kanten', () => {
  const L = { mode: 'abs', map: ['S#G', '~..'] };
  assert.equal(runProgram(L, parseProgram('R')).result, 'crash');
  assert.equal(runProgram(L, parseProgram('D')).result, 'water');
  assert.equal(runProgram(L, parseProgram('U')).result, 'outside');
  assert.equal(runProgram(L, parseProgram('')).result, 'not-there');
  const S = { mode: 'abs', map: ['S*G'] };
  assert.equal(runProgram(S, parseProgram('R R')).result, 'win');
  const S2 = { mode: 'abs', map: ['*SG'] };
  assert.equal(runProgram(S2, parseProgram('R')).result, 'missing-stars');
});

test('programspråket: tolka, skriva ut och expandera loopar', () => {
  const p = parseProgram('R 3(F H) 2(D 2(L))');
  assert.equal(programToString(p), 'R 3(F H) 2(D 2(L))');
  assert.equal(blockCount(p), 1 + 3 + 4);
  assert.deepEqual(expand(p), ['R', 'F', 'H', 'F', 'H', 'F', 'H', 'D', 'L', 'L', 'D', 'L', 'L']);
  assert.equal(expand(parseProgram('9(9(9(R)))')).length, 500, 'skydd mot oändligt långa program');
});

test('rita med kod: formen känns igen oavsett vridning och startpunkt', () => {
  const square = shapeSignature(turtleSegments(parseProgram('4(F F H)')).segs);
  const squareLeft = shapeSignature(turtleSegments(parseProgram('4(F F V)')).segs);
  assert.equal(square, squareLeft);
  const line = shapeSignature(turtleSegments(parseProgram('F F F')).segs);
  const lineTurned = shapeSignature(turtleSegments(parseProgram('H F F F')).segs);
  assert.equal(line, lineTurned);
  assert.notEqual(square, line);
  for (const c of TURTLE_CHALLENGES.filter((x) => x.solution)) assert.ok(blockCount(parseProgram(c.solution)) <= c.maxBlocks, c.id);
});

test('följ koden: svaret är dit roboten faktiskt går', () => {
  for (let lvl = 0; lvl <= 4; lvl++) for (let s = 0; s < 100; s++) {
    const q = genPredict(lvl, createRng(s));
    assert.ok(q.visual.includes(`data-hit="${q.answer}"`));
  }
});

test('bokstäver: alla tecken finns och ligger inom rutan', () => {
  for (const ch of [...UPPER, ...LOWER, ...DIGITS]) {
    const g = GLYPHS[ch];
    assert.ok(g && g.length, `saknar ${ch}`);
    for (const s of g) for (const [x, y] of s) {
      assert.ok(x >= 0 && x <= 1 && y >= 0 && y <= 1, `${ch} utanför rutan (${x.toFixed(2)},${y.toFixed(2)})`);
    }
    assert.equal(strokeHints(g).length, g.length);
  }
  assert.equal(UPPER.length, 29);
  assert.equal(LOWER.length, 29);
});

test('spårning: mallen själv får tre stjärnor, klotter underkänns', () => {
  const rng = createRng(3);
  for (const ch of [...UPPER, ...LOWER, ...DIGITS]) {
    const g = GLYPHS[ch];
    const perfect = scoreTrace(g, g, 1);
    assert.equal(perfect.pass, true, ch);
    assert.equal(perfect.stars, 3, ch);
    // lite darrig hand ska fortfarande godkännas
    const wobbly = g.map((s) => s.map(([x, y]) => [x + (rng.next() - 0.5) * 0.03, y + (rng.next() - 0.5) * 0.03]));
    assert.equal(scoreTrace(g, wobbly, 1).pass, true, `${ch} darrig`);
    // en annan bokstav ska inte godkännas
  }
  assert.equal(scoreTrace(GLYPHS.O, GLYPHS.I, 1).pass, false, 'I godkänns inte som O');
  assert.equal(scoreTrace(GLYPHS.A, GLYPHS.V, 1).pass, false, 'V godkänns inte som A');
  const scribble = [Array.from({ length: 80 }, () => [rng.next(), rng.next()])];
  assert.equal(scoreTrace(GLYPHS.B, scribble, 0).pass, false, 'klotter');
  const shifted = GLYPHS.L.map((s) => s.map(([x, y]) => [x + 0.3, y]));
  assert.equal(scoreTrace(GLYPHS.L, shifted, 3).pass, false, 'förskjuten');
  assert.equal(scoreTrace(GLYPHS.L, [], 0).pass, false, 'tomt');
  // halva bokstaven räcker inte
  assert.equal(scoreTrace(GLYPHS.H, [GLYPHS.H[0]], 0).pass, false, 'bara ett streck av H');
});

test('ord och namn läggs ut efter varandra', () => {
  const w = layoutWord('Ella');
  assert.equal(w.chars.length, 4);
  assert.ok(w.width > 1.4 && w.width < 4);
  for (let i = 1; i < w.chars.length; i++) assert.ok(w.chars[i].x0 > w.chars[i - 1].x1, 'tecken överlappar');
  assert.equal(layoutWord('Zoé').chars.map((c) => c.ch).join(''), 'Zoe');
  assert.equal(layoutWord('Anna-Lisa').chars.length, 8, 'bindestreck hoppas över');
  assert.ok(resample([[0, 0], [1, 0]]).length >= 50);
});

test('fysik: friktion och gungbräda', () => {
  const d = SURFACES.map((s) => slideDistance(3, s.mu, 0.25, 30));
  for (let i = 1; i < d.length; i++) {
    const a = d[i - 1].stuck ? 0 : d[i - 1].ground;
    const b = d[i].stuck ? 0 : d[i].ground;
    assert.ok(a >= b, 'mer friktion ska ge kortare sträcka');
  }
  assert.equal(slideDistance(3, 0.75, 0.25, 20).stuck, true, 'sandpapper i flack backe fastnar');
  assert.equal(slideDistance(3, 0.03, 0.25, 45).stuck, false);
  assert.ok(slideDistance(3, 0.03, 0.25, 30).ground > 8, 'is ska kunna nå över 8 m (uppdraget)');
  assert.equal(seesawTorque([{ w: 2, d: 2 }], [{ w: 1, d: 4 }]), 0);
  assert.ok(seesawTorque([{ w: 4, d: 1 }], [{ w: 1, d: 1 }]) < 0);
});

test('gungbrädans uppdrag går alla att lösa', () => {
  const opts = [];
  for (const a of SEESAW_ANIMALS) for (let d = 1; d <= 4; d++) opts.push({ ...a, d });
  const solvable = (check) => {
    // prova alla kombinationer med upp till 2 djur per sida
    const sides = [[]];
    for (const o of opts) sides.push([o]);
    for (let i = 0; i < opts.length; i++) for (let j = i + 1; j < opts.length; j++) if (opts[i].d !== opts[j].d) sides.push([opts[i], opts[j]]);
    for (const L of sides) for (const R of sides) if (check(L, R)) return true;
    return false;
  };
  SEESAW_MISSIONS.forEach((m, i) => assert.ok(solvable(m.check), `uppdrag ${i + 1}`));
});

test('experimentdata är fullständig', () => {
  assert.ok(FLOAT_ITEMS.some((i) => i.floats) && FLOAT_ITEMS.some((i) => !i.floats));
  assert.ok(MAGNET_ITEMS.some((i) => i.magnetic) && MAGNET_ITEMS.some((i) => !i.magnetic));
  [...FLOAT_ITEMS, ...MAGNET_ITEMS].forEach((i) => assert.ok(i.why.length > 20, i.id));
});

test('rymden: månfaser, dagsljus och planeter', () => {
  assert.equal(moonPhaseName(0), 'nymåne');
  assert.equal(moonPhaseName(180), 'fullmåne');
  assert.equal(moonPhaseName(90), 'växande halvmåne');
  assert.equal(moonPhaseName(270), 'avtagande halvmåne');
  assert.equal(moonPhaseName(-10), 'nymåne');
  assert.ok(Math.abs(moonIllumination(0)) < 1e-9);
  assert.ok(Math.abs(moonIllumination(180) - 1) < 1e-9);
  assert.equal(GBG_DAYLIGHT.length, 12);
  assert.equal(Math.max(...GBG_DAYLIGHT), GBG_DAYLIGHT[5], 'längsta dagen i juni');
  assert.equal(Math.min(...GBG_DAYLIGHT), GBG_DAYLIGHT[11], 'kortaste i december');
  assert.equal(seasonForMonth(5), 'sommar');
  assert.equal(seasonForMonth(0), 'vinter');
  assert.deepEqual(PLANETS.map((p) => p.name), ['Merkurius', 'Venus', 'Jorden', 'Mars', 'Jupiter', 'Saturnus', 'Uranus', 'Neptunus']);
  for (let i = 1; i < PLANETS.length; i++) assert.ok(PLANETS[i].au > PLANETS[i - 1].au);
  for (const c of CONSTELLATIONS) c.order.forEach((i) => assert.ok(c.stars[i], `${c.id} stjärna ${i}`));
});

test('svenska: alfabetet, berättelser och ordlistor', () => {
  assert.equal(LETTERS.join(''), 'ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ');
  ALPHABET.forEach((a) => assert.equal(a.word[0].toUpperCase(), a.l, `${a.word} börjar inte på ${a.l}`));
  STORIES.forEach((s) => s.questions.forEach((q) => assert.ok(q.o.includes(q.a), `${s.id}: ${q.q}`)));
  RHYMES.forEach(([a, b]) => assert.equal(a.w.slice(-2), b.w.slice(-2), `${a.w}/${b.w} rimmar inte`));
  SYLLABLES.forEach((s) => assert.equal(s.s.join(''), s.w, `stavelserna i ${s.w}`));
});

test('biologi & undra: data är komplett', () => {
  assert.equal(new Set(SPECIES.map((s) => s.id)).size, SPECIES.length);
  LIFECYCLES.forEach((l) => assert.ok(l.stages.length === 4 && l.fact));
  assert.equal(new Set(WONDERS.map((w) => w.id)).size, WONDERS.length);
  assert.ok(WONDERS.length >= 30);
  const a = wonderOfTheDay(new Date(2026, 9, 8));
  const b = wonderOfTheDay(new Date(2026, 9, 8, 22));
  const c = wonderOfTheDay(new Date(2026, 9, 9));
  assert.equal(a.id, b.id, 'samma fråga hela dagen');
  assert.notEqual(a.id, c.id, 'ny fråga nästa dag');
});

test('troféer delas ut en gång och nästa trofé föreslås', () => {
  const p = newProfile({ name: 'A', age: 7 });
  assert.equal(awardTrophies(p).length, 0);
  bump(p, 'rounds');
  const won = awardTrophies(p);
  assert.deepEqual(won.map((t) => t.id), ['first-round']);
  assert.equal(awardTrophies(p).length, 0, 'inte två gånger');
  addToSet(p, 'planets', 'mars');
  const n = nextTrophy(p);
  assert.ok(n && n.pr.ratio > 0);
  assert.equal(new Set(TROPHIES.map((t) => t.id)).size, TROPHIES.length);
  TROPHIES.forEach((t) => assert.equal(trophyProgress(newProfile({ name: 'B', age: 5 }), t).value, 0, `${t.id} ska börja på noll`));
});

test('lagring fungerar även utan localStorage (minnesläge) och säkerhetskopia går fram och tillbaka', () => {
  assert.equal(isPersistent(), false);
  const s = loadState();
  s.profiles.push(newProfile({ name: 'Test', age: 7 }));
  saveState(s);
  assert.equal(loadState().profiles[0].name, 'Test');
  const pid = s.profiles[0].id;
  for (let i = 0; i < MAX_DRAWINGS + 5; i++) saveDrawing(pid, `data:image/jpeg;base64,${i}`);
  assert.equal(loadDrawings(pid).length, MAX_DRAWINGS);
  const text = exportBackup(s);
  const restored = importBackup(text);
  assert.equal(restored.profiles[0].name, 'Test');
  assert.throws(() => importBackup('{"nej":1}'));
});
