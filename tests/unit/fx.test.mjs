import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  motionMode, easeOutCubic, tickerValue, tickerSteps, tickerDuration, progressPercent, ringDash,
  levelProgress, segmentWords, wordsOf, wordIndexAt, isSpokenWord, wordTimings, sparkleParticles, staggerDelay,
} from '../../src/ui/fx-logic.js';

test('motionMode: reducerad rörelse vinner, anpassat läge ger lugnt', () => {
  assert.equal(motionMode({}), 'full');
  assert.equal(motionMode({ reduced: true, adapted: 'on' }), 'none');
  assert.equal(motionMode({ adapted: 'on' }), 'calm');
  assert.equal(motionMode({ adapted: 'autism' }), 'calm');
  assert.equal(motionMode({ adapted: 'off' }), 'full');
  assert.equal(motionMode({ adapted: '' }), 'full');
});

test('easeOutCubic: 0→0, 1→1, monotont, klampat', () => {
  assert.equal(easeOutCubic(0), 0);
  assert.equal(easeOutCubic(1), 1);
  assert.equal(easeOutCubic(-1), 0);
  assert.equal(easeOutCubic(2), 1);
  let prev = -1;
  for (let i = 0; i <= 20; i++) {
    const v = easeOutCubic(i / 20);
    assert.ok(v >= prev);
    prev = v;
  }
});

test('tickerValue: heltal, start och mål exakt, aldrig förbi målet', () => {
  assert.equal(tickerValue(3, 10, 0), 3);
  assert.equal(tickerValue(3, 10, 1), 10);
  assert.equal(tickerValue(3, 10, 5), 10);
  for (let i = 0; i <= 50; i++) {
    const up = tickerValue(0, 7, i / 50);
    assert.ok(Number.isInteger(up) && up >= 0 && up <= 7);
    const down = tickerValue(20, 5, i / 50);
    assert.ok(Number.isInteger(down) && down <= 20 && down >= 5);
  }
});

test('tickerSteps: räknar uppåt utan att hoppa bakåt och slutar på målet', () => {
  const s = tickerSteps(40, 45, 60);
  assert.equal(s[0], 40);
  assert.equal(s[s.length - 1], 45);
  for (let i = 1; i < s.length; i++) assert.ok(s[i] > s[i - 1]);
  // Små steg (som +1 stjärna) ska visa varje tal så barnet ser uppräkningen.
  assert.deepEqual(tickerSteps(4, 6, 30), [4, 5, 6]);
  const down = tickerSteps(10, 7, 30);
  assert.deepEqual(down, [10, 9, 8, 7]);
});

test('tickerDuration: 0 vid ingen ändring, längre för större steg, max 1,2 s', () => {
  assert.equal(tickerDuration(5, 5), 0);
  assert.ok(tickerDuration(0, 1) < tickerDuration(0, 50));
  assert.ok(tickerDuration(0, 100000) <= 1200);
});

test('progressPercent: andel i procent, klampad och tålig', () => {
  assert.equal(progressPercent(0, 8), 0);
  assert.equal(progressPercent(4, 8), 50);
  assert.equal(progressPercent(8, 8), 100);
  assert.equal(progressPercent(1, 3), 33);
  assert.equal(progressPercent(2, 3), 67);
  assert.equal(progressPercent(12, 8), 100);
  assert.equal(progressPercent(-2, 8), 0);
  assert.equal(progressPercent(3, 0), 0);
  assert.equal(progressPercent('x', 5), 0);
});

test('ringDash: helt tom = omkretsen, full = 0', () => {
  const r = 20;
  const c = 2 * Math.PI * r;
  assert.ok(Math.abs(ringDash(0, r).offset - c) < 1e-9);
  assert.ok(Math.abs(ringDash(100, r).offset) < 1e-9);
  assert.ok(Math.abs(ringDash(25, r).offset - c * 0.75) < 1e-9);
  assert.ok(Math.abs(ringDash(150, r).offset) < 1e-9);
});

test('levelProgress: rätt i rad mot nästa nivå', () => {
  assert.deepEqual(levelProgress({ level: 1, runUp: 3 }), { level: 1, run: 3, need: 5, atMax: false });
  assert.deepEqual(levelProgress({ level: 4, runUp: 2 }), { level: 4, run: 2, need: 5, atMax: true });
  assert.deepEqual(levelProgress(null), { level: 0, run: 0, need: 5, atMax: false });
  assert.equal(levelProgress({ level: 9, runUp: 99 }).level, 4);
  assert.equal(levelProgress({ level: 0, runUp: 99 }).run, 5);
});

test('segmentWords: ord och mellanrum med positioner, skiljetecken hänger kvar', () => {
  const t = 'Katten sov. Sedan  åt den!';
  const seg = segmentWords(t);
  assert.equal(seg.map((x) => x.text).join(''), t, 'segmenten bygger upp texten exakt');
  const words = seg.filter((x) => x.word);
  assert.deepEqual(words.map((w) => w.text), ['Katten', 'sov.', 'Sedan', 'åt', 'den!']);
  assert.deepEqual(words.map((w) => w.index), [0, 1, 2, 3, 4]);
  for (const w of words) assert.equal(t.slice(w.start, w.end), w.text);
  assert.deepEqual(segmentWords(''), []);
  assert.deepEqual(wordsOf('  hej  ').map((w) => w.text), ['hej']);
});

test('wordIndexAt: teckenindex från talsyntesen ger rätt ord', () => {
  const t = 'Det var en gång en räv.';
  assert.equal(wordIndexAt(t, 0), 0);
  assert.equal(wordIndexAt(t, 4), 1); // "var"
  assert.equal(wordIndexAt(t, 8), 2); // "en"
  assert.equal(wordIndexAt(t, 19), 5); // "räv."
  assert.equal(wordIndexAt(t, 999), 5);
  assert.equal(wordIndexAt('', 0), -1);
});

test('isSpokenWord: emoji läses inte upp', () => {
  assert.equal(isSpokenWord('hej'), true);
  assert.equal(isSpokenWord('7'), true);
  assert.equal(isSpokenWord('🦊'), false);
  assert.equal(isSpokenWord('–'), false);
});

test('wordTimings: stigande tider, längre ord tar längre tid, långsammare tal tar längre tid', () => {
  const words = ['Jag', 'heter', 'Alva.', 'Hej'];
  const t = wordTimings(words, { rate: 1 });
  assert.equal(t.length, 4);
  assert.equal(t[0], 0);
  for (let i = 1; i < t.length; i++) assert.ok(t[i] > t[i - 1]);
  const short = wordTimings(['ö', 'x'], { rate: 1 })[1];
  const long = wordTimings(['elefanterna', 'x'], { rate: 1 })[1];
  assert.ok(long > short);
  const slow = wordTimings(words, { rate: 0.6 });
  assert.ok(slow[3] > t[3]);
  // Paus efter punkt
  const a = wordTimings(['hej', 'då'], { rate: 1 })[1];
  const b = wordTimings(['hej.', 'då'], { rate: 1 })[1];
  assert.ok(b > a);
});

test('sparkleParticles: antal, deterministiskt med egen rng, inom rimligt avstånd', () => {
  let seed = 1;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const a = sparkleParticles(12, rnd);
  seed = 1;
  const b = sparkleParticles(12, rnd);
  assert.equal(a.length, 12);
  assert.deepEqual(a, b);
  for (const p of a) {
    const d = Math.hypot(p.dx, p.dy);
    assert.ok(d >= 35 && d <= 95, `avstånd ${d}`);
    assert.ok(p.size >= 10 && p.size <= 24);
  }
  assert.equal(sparkleParticles(500).length, 40);
  assert.equal(sparkleParticles(-3).length, 0);
});

test('staggerDelay: jämnt steg med tak', () => {
  assert.equal(staggerDelay(0), 0);
  assert.equal(staggerDelay(3, { step: 50 }), 150);
  assert.equal(staggerDelay(100, { step: 50, cap: 900 }), 900);
  assert.equal(staggerDelay(-1), 0);
});
