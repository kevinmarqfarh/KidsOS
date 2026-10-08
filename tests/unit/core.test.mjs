import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRng, numberOptions } from '../../src/core/rng.js';
import {
  newProfile, normalizeState, recordAnswer, recordRound, roundRating, touchDay, isOverDailyLimit,
  addBonusMinutes, minutesLeftToday, currentLevel, appStat, addToSet, setSize, ADAPT_UP_AFTER, ADAPT_DOWN_AFTER,
} from '../../src/core/model.js';
import { startLevelForAge, schoolLabelForAge, roundLength, clampLevel } from '../../src/core/age.js';
import { rankFor, RANKS } from '../../src/core/progress.js';
import { cleanForSpeech } from '../../src/core/speech.js';

test('rng är deterministisk med samma frö', () => {
  const a = createRng(42);
  const b = createRng(42);
  for (let i = 0; i < 50; i++) assert.equal(a.next(), b.next());
  const r = createRng(1);
  for (let i = 0; i < 500; i++) {
    const v = r.int(3, 7);
    assert.ok(v >= 3 && v <= 7 && Number.isInteger(v));
  }
});

test('numberOptions innehåller svaret, är unika och håller sig i intervallet', () => {
  const r = createRng(7);
  for (let i = 0; i < 300; i++) {
    const ans = r.int(0, 20);
    const opts = numberOptions(r, ans, 3, { min: 0, max: 20, spread: 2 });
    assert.equal(opts.length, 3);
    assert.ok(opts.includes(ans));
    assert.equal(new Set(opts).size, 3);
    opts.forEach((o) => assert.ok(o >= 0 && o <= 20));
  }
  // smalt intervall: 0..2 med 3 alternativ
  const o = numberOptions(r, 0, 3, { min: 0, max: 2 });
  assert.deepEqual([...o].sort(), [0, 1, 2]);
});

test('åldrar ger rätt startnivå och skolform', () => {
  assert.equal(startLevelForAge(5), 0);
  assert.equal(startLevelForAge(7), 1);
  assert.equal(startLevelForAge(9), 3);
  assert.equal(startLevelForAge(11), 4);
  assert.equal(schoolLabelForAge(5), 'Förskola');
  assert.equal(schoolLabelForAge(6), 'Förskoleklass');
  assert.equal(schoolLabelForAge(9), 'Årskurs 3');
  assert.equal(roundLength(5), 5);
  assert.equal(roundLength(9), 8);
  assert.equal(clampLevel(9), 4);
  assert.equal(clampLevel(-3), 0);
});

test('ny profil har rimliga standardvärden och namn trimmas', () => {
  const p = newProfile({ name: '  Ellen  ', age: 7 });
  assert.equal(p.name, 'Ellen');
  assert.equal(p.settings.readAloud, 'auto');
  assert.equal(currentLevel(p, 'math'), 1);
  const q = newProfile({ name: '', age: 99 });
  assert.equal(q.name, 'Kompis');
  assert.equal(q.age, 12);
});

test('adaptiv nivå: upp efter fem rätt i rad, ned efter tre missar', () => {
  const p = newProfile({ name: 'A', age: 7 });
  const start = currentLevel(p, 'math');
  let change;
  for (let i = 0; i < ADAPT_UP_AFTER; i++) change = recordAnswer(p, 'math', { firstTry: true });
  assert.equal(change, 'up');
  assert.equal(currentLevel(p, 'math'), start + 1);
  for (let i = 0; i < ADAPT_DOWN_AFTER; i++) change = recordAnswer(p, 'math', { firstTry: false });
  assert.equal(change, 'down');
  assert.equal(currentLevel(p, 'math'), start);
  // en miss bryter rätt-i-rad
  for (let i = 0; i < ADAPT_UP_AFTER - 1; i++) recordAnswer(p, 'math', { firstTry: true });
  recordAnswer(p, 'math', { firstTry: false });
  recordAnswer(p, 'math', { firstTry: true });
  assert.equal(currentLevel(p, 'math'), start);
});

test('låst nivå (förälder) anpassas inte', () => {
  const p = newProfile({ name: 'A', age: 9 });
  p.levelOverride.math = 1;
  for (let i = 0; i < 20; i++) recordAnswer(p, 'math', { firstTry: true });
  assert.equal(currentLevel(p, 'math'), 1);
  assert.equal(appStat(p, 'math').level, 3);
});

test('nivån går aldrig utanför 0–4', () => {
  const p = newProfile({ name: 'A', age: 5 });
  for (let i = 0; i < 30; i++) recordAnswer(p, 'math', { firstTry: false });
  assert.equal(currentLevel(p, 'math'), 0);
  for (let i = 0; i < 60; i++) recordAnswer(p, 'math', { firstTry: true });
  assert.equal(currentLevel(p, 'math'), 4);
});

test('rundbetyg och bonusstjärnor', () => {
  assert.equal(roundRating(8, 8), 3);
  assert.equal(roundRating(5, 8), 2);
  assert.equal(roundRating(2, 8), 1);
  assert.equal(roundRating(0, 0), 1);
  const p = newProfile({ name: 'A', age: 7 });
  const r1 = recordRound(p, 'math', 'count', { correctFirst: 6, total: 6 });
  assert.equal(r1.rating, 3);
  assert.equal(r1.bonus, 2);
  assert.equal(p.stars, 2);
  assert.equal(p.counters.perfect, 1);
  const r2 = recordRound(p, 'math', 'count', { correctFirst: 1, total: 6 });
  assert.equal(r2.rating, 1);
  assert.equal(p.stats.math.modules.count.best, 3, 'bästa betyget sparas');
  assert.equal(setSize(p, 'appsTried'), 1);
});

test('dagar i rad räknas rätt', () => {
  const p = newProfile({ name: 'A', age: 7 });
  touchDay(p, '2026-10-01');
  touchDay(p, '2026-10-01', 30);
  assert.equal(p.streak.count, 1);
  touchDay(p, '2026-10-02');
  touchDay(p, '2026-10-03');
  assert.equal(p.streak.count, 3);
  assert.equal(p.streak.best, 3);
  touchDay(p, '2026-10-06'); // lucka
  assert.equal(p.streak.count, 1);
  assert.equal(p.streak.best, 3);
  // över månadsskifte
  touchDay(p, '2026-10-31');
  touchDay(p, '2026-11-01');
  assert.equal(p.streak.count, 2);
  assert.equal(p.days['2026-10-01'], 30);
});

test('skärmtid: gräns och extraminuter', () => {
  const p = newProfile({ name: 'A', age: 7 });
  const day = '2026-10-08';
  assert.equal(isOverDailyLimit(p, day), false);
  p.settings.dailyLimitMin = 20;
  touchDay(p, day, 19 * 60);
  assert.equal(isOverDailyLimit(p, day), false);
  assert.equal(Math.round(minutesLeftToday(p, day)), 1);
  touchDay(p, day, 120);
  assert.equal(isOverDailyLimit(p, day), true);
  addBonusMinutes(p, 15, day);
  assert.equal(isOverDailyLimit(p, day), false);
  assert.equal(isOverDailyLimit(p, '2026-10-09'), false, 'ny dag – ny tid');
});

test('normalizeState lagar trasig data', () => {
  const s = normalizeState({ profiles: [{ name: 'X', age: 6, stats: null }], activeId: 'finns-ej' });
  assert.equal(s.profiles.length, 1);
  assert.deepEqual(s.profiles[0].stats, {});
  assert.equal(s.activeId, null);
  assert.equal(normalizeState('skräp').profiles.length, 0);
});

test('samlingar räknar unika saker', () => {
  const p = newProfile({ name: 'A', age: 7 });
  assert.equal(addToSet(p, 'planets', 'mars'), true);
  assert.equal(addToSet(p, 'planets', 'mars'), false);
  assert.equal(setSize(p, 'planets'), 1);
});

test('titlar efter stjärnor', () => {
  assert.equal(rankFor(0).title, RANKS[0].title);
  const r = rankFor(45);
  assert.equal(r.title, 'Upptäckare');
  assert.equal(r.next.title, 'Utforskare');
  assert.ok(r.progress > 0 && r.progress < 1);
  assert.equal(rankFor(10000).next, null);
});

test('uppläsningstext rensas från emoji och symboler', () => {
  assert.equal(cleanForSpeech('Hur många 🍎 ser du?'), 'Hur många ser du?');
  assert.equal(cleanForSpeech('3 × 4'), '3 gånger 4');
  assert.equal(cleanForSpeech('7 - 2 = ?'), '7 minus 2 är lika med vad?');
  assert.equal(cleanForSpeech('2 + 2'), '2 plus 2');
});
