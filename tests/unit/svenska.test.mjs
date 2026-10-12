// Svenska och Skriv ABC: ordlistor för stavning, repetitionsserier och spårdata.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  SPELL_WORDS, spellWordsForLevel, genSpellWord, spellTip, trickyLetters, RHYME_GROUPS, RHYMES, svenskaApp, ALPHABET, LETTERS,
} from '../../src/apps/svenska.js';
import {
  GLYPHS, UPPER, LOWER, LETTER_INFO, letterSpeech, REPEAT_CHOICES, DEFAULT_REPEAT, normalizeRepeat, newSeries, seriesAdvance,
  seriesLeft, supportFor, seriesKey, praiseFor, writeApp, layoutWord,
} from '../../src/apps/letters.js';
import { createRng } from '../../src/core/rng.js';
import { photoKeyForEmoji } from '../../src/core/emoji-photos.js';

const ONLY_SV = /^[a-zåäö]+$/;
const DOUBLE = /([a-zåäö])\1|ck/;

test('stavningsorden: minst 250, bara a–ö, unika ord och unika bilder', () => {
  assert.ok(SPELL_WORDS.length >= 250, `bara ${SPELL_WORDS.length} ord`);
  for (const x of SPELL_WORDS) {
    assert.match(x.w, ONLY_SV, `${x.w} innehåller annat än a–ö`);
    assert.ok(x.e && x.e.trim(), `${x.w} saknar emoji`);
    assert.ok(!/[a-zåäö]/i.test(x.e), `${x.w}: emojin innehåller bokstäver`);
    // Fotot hämtas via emoji→foto-mappningen (samma bild som ordet har i resten av appen).
    if (x.photo) assert.equal(x.photo, photoKeyForEmoji(x.e), `${x.w}: fel fotonyckel`);
  }
  assert.equal(new Set(SPELL_WORDS.map((x) => x.w)).size, SPELL_WORDS.length, 'dubbla ord');
  const seen = new Map();
  for (const x of SPELL_WORDS) {
    assert.ok(!seen.has(x.e), `${x.w} och ${seen.get(x.e)} har samma bild ${x.e}`);
    seen.set(x.e, x.w);
  }
});

test('stavningsorden är nivåindelade', () => {
  for (let l = 0; l <= 4; l++) assert.ok(spellWordsForLevel(l).length >= 40, `nivå ${l} har för få ord`);
  for (const x of spellWordsForLevel(0)) assert.ok(x.w.length >= 2 && x.w.length <= 3, `nivå 0: ${x.w}`);
  for (const x of spellWordsForLevel(1)) {
    assert.ok(x.w.length >= 3 && x.w.length <= 7, `nivå 1: ${x.w}`);
    assert.ok(!DOUBLE.test(x.w), `nivå 1 ska vara utan dubbelteckning: ${x.w}`);
    assert.ok(!/ng|nk|gn|sj|tj|stj|skj|ch|hj|lj|sk[eiyäö]|^[kg][eiyäö]/.test(x.w), `nivå 1 ska vara ljudenligt: ${x.w}`);
  }
  const lvl2Tricky = spellWordsForLevel(2).filter((x) => spellTip(x.w)).length;
  assert.ok(lvl2Tricky >= 35, 'nivå 2 ska mest ha ng, sj, tj och j-ljud');
  for (const x of spellWordsForLevel(3)) assert.ok(DOUBLE.test(x.w), `nivå 3 ska ha dubbelteckning eller ck: ${x.w}`);
  for (const x of spellWordsForLevel(4)) assert.ok(x.w.length >= 6, `nivå 4 ska ha långa ord: ${x.w}`);
  // Nivåerna ska inte skifta i fel riktning: nivå 4 har längre ord i snitt än nivå 0.
  const avg = (l) => spellWordsForLevel(l).reduce((s, x) => s + x.w.length, 0) / spellWordsForLevel(l).length;
  assert.ok(avg(0) < avg(1) && avg(1) < avg(4));
});

test('stavningstips förklarar rätt regel', () => {
  assert.match(spellTip('katt'), /dubbelt t/);
  assert.match(spellTip('kyckling'), /ck/);
  assert.match(spellTip('sked'), /Sj-ljudet/);
  assert.match(spellTip('stjärna'), /Sj-ljudet/);
  assert.match(spellTip('kyrka'), /Tj-ljudet/);
  assert.match(spellTip('hjärta'), /J-ljudet/);
  assert.match(spellTip('ring'), /ng/);
  assert.match(spellTip('regn'), /gn/);
  assert.equal(spellTip('sol'), '');
  assert.equal(spellTip('banan'), '');
  assert.ok(trickyLetters('stjärna').includes('j'));
});

test('Stava ord: lyssna och bygg ordet på alla nivåer', () => {
  for (let level = 0; level <= 4; level++) {
    const seen = new Set();
    for (let s = 1; s <= 300; s++) {
      const q = genSpellWord(level, createRng(s * 31 + level));
      assert.equal(q.type, 'build');
      assert.equal(q.word, level <= 1 ? q.sayWord.toUpperCase() : q.sayWord, 'versaler för de yngsta, gemener sedan');
      const tiles = [...q.tiles];
      for (const ch of q.word) {
        const i = tiles.indexOf(ch);
        assert.ok(i >= 0, `nivå ${level}: ${ch} saknas för ${q.word}`);
        tiles.splice(i, 1);
      }
      assert.equal(tiles.length, [0, 1, 2, 2, 3][level], `nivå ${level}: fel antal extrabrickor för ${q.word}`);
      tiles.forEach((t) => assert.equal(t, level <= 1 ? t.toUpperCase() : t.toLowerCase()));
      assert.ok(q.say.includes(q.sayWord), 'ordet läses upp');
      assert.ok(!q.prompt.includes(q.sayWord), 'ordet står inte i uppgiften');
      // Fotonas base64-data kan av en slump innehålla t.ex. "NaN" – kontrollera bara texten runt omkring.
      assert.ok(!/undefined|null|NaN/.test(q.explain + q.hint + String(q.visual).replace(/data:[^"]+/g, '')));
      seen.add(q.sayWord);
    }
    assert.ok(seen.size >= 30, `nivå ${level}: för lite variation (${seen.size})`);
  }
  const mod = svenskaApp.modules.find((m) => m.id === 'build');
  assert.equal(mod.name, 'Stava ord');
  assert.equal(mod.minLevel, 0);
});

test('rimgrupperna: alla ord slutar på rimdelen och rimparen ser lika ut', () => {
  for (const g of RHYME_GROUPS) {
    assert.ok(g.w.length >= 2, g.r);
    for (const x of g.w) assert.ok(x.w.endsWith(g.r), `${x.w} slutar inte på -${g.r}`);
  }
  assert.ok(RHYMES.length >= RHYME_GROUPS.length - 3);
});

test('alla bokstäver har spårdata, namn och ljud', () => {
  assert.deepEqual(UPPER, LETTERS);
  for (const ch of [...UPPER, ...LOWER]) {
    assert.ok(GLYPHS[ch] && GLYPHS[ch].length >= 1, `${ch} saknar spårdata`);
    for (const st of GLYPHS[ch]) {
      assert.ok(st.length >= 2, `${ch}: för kort drag`);
      for (const [x, y] of st) assert.ok(x >= -0.05 && x <= 1.05 && y >= 0 && y <= 1, `${ch}: punkt utanför rutan`);
    }
  }
  for (const a of ALPHABET) {
    assert.ok(LETTER_INFO[a.l]?.name, `${a.l} saknar namn`);
    const s = letterSpeech(a.l, a.word);
    assert.ok(s.startsWith(`${a.l}.`) && s.includes(LETTER_INFO[a.l].name) && s.includes(a.word), s);
  }
  assert.match(letterSpeech('m', 'måne'), /Den låter mmm, som i måne\./);
  assert.match(letterSpeech('B', 'banan'), /Lyssna på början av banan\./);
  // Varje stavningsord går att skriva bokstav för bokstav och som helt ord.
  for (const x of SPELL_WORDS) {
    for (const ch of x.w) assert.ok(GLYPHS[ch] && GLYPHS[ch.toUpperCase()], `${x.w}: ${ch} saknar spårdata`);
    assert.equal(layoutWord(x.w).chars.length, x.w.length);
  }
});

test('repetitionsserien räknas rätt (ren logik)', () => {
  assert.deepEqual(REPEAT_CHOICES, [5, 10]);
  assert.equal(DEFAULT_REPEAT, 5);
  assert.equal(normalizeRepeat(10), 10);
  assert.equal(normalizeRepeat('10'), 10);
  assert.equal(normalizeRepeat(7), 5);
  assert.equal(normalizeRepeat(undefined), 5);

  let s = newSeries(5);
  assert.deepEqual([s.done, s.target, s.complete], [0, 5, false]);
  s = seriesAdvance(s, false);
  assert.equal(s.done, 0, 'misslyckade försök räknas inte');
  assert.equal(s.tries, 1);
  const before = s;
  for (let i = 1; i <= 4; i++) {
    s = seriesAdvance(s, true);
    assert.equal(s.done, i);
    assert.equal(seriesLeft(s), 5 - i);
    assert.equal(s.complete, false);
  }
  assert.equal(before.done, 0, 'muterar inte den gamla serien');
  s = seriesAdvance(s, true);
  assert.equal(s.complete, true);
  assert.equal(seriesLeft(s), 0);
  assert.equal(seriesAdvance(s, true), s, 'en klar serie ändras inte');

  let ten = newSeries(10);
  for (let i = 0; i < 9; i++) ten = seriesAdvance(ten, true);
  assert.equal(ten.complete, false);
  assert.equal(seriesAdvance(ten, true).complete, true);

  assert.equal(seriesKey('upper', 'A'), 'writeSeries:upper:A');
  assert.equal(praiseFor(4, 5), 'Precis så! En gång kvar!');
  assert.match(praiseFor(1, 10), /9 kvar/);
  assert.equal(praiseFor(5, 5), 'Klart! 5 av 5!');
});

test('stödet minskar gradvis genom serien (fading)', () => {
  const rank = { full: 2, dotted: 1, faint: 0 };
  for (const n of REPEAT_CHOICES) {
    const stages = Array.from({ length: n }, (_, i) => supportFor(i, n));
    assert.equal(stages[0].stage, 'full');
    assert.ok(stages[0].startDots && stages[0].arrows, 'första gången: startpunkt och pil');
    assert.equal(stages[n - 1].stage, 'faint', 'sista gången: svag mall');
    assert.ok(!stages[n - 1].startDots);
    for (let i = 1; i < n; i++) assert.ok(rank[stages[i].stage] <= rank[stages[i - 1].stage], 'stödet ökar aldrig igen');
    assert.ok(stages.some((x) => x.stage === 'dotted'), 'ett mellansteg med prickad mall');
  }
  assert.equal(supportFor(0, 1).stage, 'full');
  assert.deepEqual(Array.from({ length: 5 }, (_, i) => supportFor(i, 5).stage), ['full', 'full', 'dotted', 'dotted', 'faint']);
});

test('Skriv ABC har steget Stava ord', () => {
  const spell = writeApp.modules.find((m) => m.id === 'spell');
  assert.ok(spell && spell.view === 'trace' && spell.set === 'spell');
  assert.equal(spell.minLevel, 0);
});
