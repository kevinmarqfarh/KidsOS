import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculate, countWords, tokenize, canAppend, formatNumber, speakExpr } from '../../src/ui/system-logic.js';
import {
  newProfile, normalizeProfile, normalizeState, addStars, addCoins, spendCoins, layoutFor, ageBand,
  recordRound, recordAnswer, learningSummary, relativeDay, markActive, addToSet,
} from '../../src/core/model.js';
import { saveState, exportBackup, importBackup, saveJSON, loadJSON, saveDrawing, loadDrawings, deleteDrawingsFor } from '../../src/core/storage.js';

/* ---------------- Miniräknaren ---------------- */
test('calculate: prioritet mellan räknesätten', () => {
  assert.equal(calculate('2+3×4'), 14);
  assert.equal(calculate('2*3+4'), 10);
  assert.equal(calculate('10−4−3'), 3); // vänsterassociativt
  assert.equal(calculate('100÷10÷5'), 2);
  assert.equal(calculate('8-2*3'), 2);
  assert.equal(calculate('7'), 7);
});

test('calculate: parenteser', () => {
  assert.equal(calculate('(2+3)×4'), 20);
  assert.equal(calculate('2×(3+(4−1))'), 12);
  assert.equal(calculate('((5))'), 5);
  assert.throws(() => calculate('(2+3'), /fel/);
  assert.throws(() => calculate('2+3)'), /fel/);
  assert.throws(() => calculate('()'), /fel/);
});

test('calculate: decimalkomma, negativa tal och avrundning', () => {
  assert.equal(calculate('1,5+1,5'), 3);
  assert.equal(calculate('0.1+0.2'), 0.3);
  assert.equal(calculate('5,'), 5);
  assert.equal(calculate('−3+5'), 2);
  assert.equal(calculate('2×−3'), -6);
  assert.equal(calculate('10÷3'), 3.333333);
  assert.equal(Object.is(calculate('0×−1'), -0), false);
});

test('calculate: division med noll ger eget fel', () => {
  assert.throws(() => calculate('8÷0'), /noll/);
  assert.throws(() => calculate('1/(2−2)'), /noll/);
});

test('calculate: tomt och ogiltiga uttryck', () => {
  assert.equal(calculate(''), null);
  assert.equal(calculate('   '), null);
  for (const bad of ['+', '2+', '×2', '2××3', '1..2', '1,2,3', '2 3', '2a3', 'abc', '1e5', '0x10', '∞']) {
    assert.throws(() => calculate(bad), /fel/, bad);
  }
  assert.throws(() => calculate('1+'.repeat(150) + '1'), /fel/); // för långt
  assert.throws(() => calculate('('.repeat(60) + '1' + ')'.repeat(60)), /fel/); // för djupt
});

test('calculate: kan inte köra godtycklig JavaScript', () => {
  globalThis.__pwned = false;
  const attacks = [
    'globalThis.__pwned=true',
    '(()=>{globalThis.__pwned=true})()',
    'constructor.constructor("globalThis.__pwned=true")()',
    '1;globalThis.__pwned=true',
    '[]+{}',
    'alert(1)',
    '2+3;process.exit(1)',
  ];
  for (const a of attacks) assert.throws(() => calculate(a), /fel/, a);
  assert.equal(globalThis.__pwned, false);
  // Inga "konstiga" värden tar sig igenom
  assert.throws(() => tokenize('Infinity'));
  assert.throws(() => tokenize('NaN'));
  delete globalThis.__pwned;
});

test('miniräknarens tangenthjälp', () => {
  assert.equal(canAppend('1,5', ','), false);
  assert.equal(canAppend('1,5+2', ','), true);
  assert.equal(canAppend('', '+'), false);
  assert.equal(canAppend('', '−'), true);
  assert.equal(canAppend('5+', '×'), false);
  assert.equal(canAppend('5×', '−'), true);
  assert.equal(canAppend('5−', '−'), false);
  assert.equal(canAppend('5,', '+'), false);
  assert.equal(formatNumber(-2.5), '−2,5');
  assert.equal(speakExpr('3+4×2−1÷1'), '3 plus 4 gånger 2 minus 1 delat med 1');
  // Ett svar som förs vidare (t.ex. "−2,5") går att räkna vidare på
  assert.equal(calculate(`${formatNumber(-2.5)}+1`), -1.5);
});

/* ---------------- Anteckningar ---------------- */
test('countWords räknar svenska ord', () => {
  assert.equal(countWords(''), 0);
  assert.equal(countWords(null), 0);
  assert.equal(countWords('   '), 0);
  assert.equal(countWords('Hej på dig'), 3);
  assert.equal(countWords('Åsa åt ärter, ölet var öppet!'), 6);
  assert.equal(countWords('Jag är 7 år.\nMin katt heter Måns.'), 8);
  assert.equal(countWords('— … !!! ?'), 0);
  assert.equal(countWords('glass-strut'), 2);
});

/* ---------------- Myntekonomi ---------------- */
test('addStars ger lika många mynt, minus ger inga mynt', () => {
  const p = newProfile({ name: 'A', age: 7 });
  assert.equal(p.coins, 0);
  addStars(p, 3);
  assert.equal(p.stars, 3);
  assert.equal(p.coins, 3);
  addStars(p, -1);
  assert.equal(p.stars, 2);
  assert.equal(p.coins, 3);
  addStars(p, -10);
  assert.equal(p.stars, 0);
  // en runda ger bonusstjärnor och därmed mynt
  const before = p.coins;
  const { bonus } = recordRound(p, 'math', 'add', { correctFirst: 5, total: 5 });
  assert.equal(p.coins, before + bonus);
});

test('spendCoins nekar vid för lite och drar annars av', () => {
  const p = newProfile({ name: 'B', age: 9 });
  addCoins(p, 5);
  assert.equal(spendCoins(p, 6), false);
  assert.equal(p.coins, 5);
  assert.equal(spendCoins(p, 5), true);
  assert.equal(p.coins, 0);
  assert.equal(spendCoins(p, 1), false);
  assert.equal(addCoins(p, -3), 0); // aldrig negativt
});

test('migrering av v1-profil utan mynt ger coins = stars', () => {
  const old = { id: 'p1', name: 'Gammal', age: 9, stars: 42, stats: {}, counters: {} };
  const p = normalizeProfile(old);
  assert.equal(p.coins, 42);
  assert.deepEqual(p.activity, {});
  // Profil som redan har mynt behåller dem (även 0)
  assert.equal(normalizeProfile({ ...old, coins: 0 }).coins, 0);
  assert.equal(normalizeProfile({ ...old, coins: 7 }).coins, 7);
  assert.equal(normalizeProfile({ ...old, coins: 'trasig' }).coins, 0);
  const s = normalizeState({ profiles: [old] });
  assert.equal(s.profiles[0].coins, 42);
});

/* ---------------- Layout och åldersband ---------------- */
test('layoutFor följer ålder men kan styras av föräldern', () => {
  assert.equal(layoutFor(newProfile({ name: 'a', age: 5 })), 'tablet');
  assert.equal(layoutFor(newProfile({ name: 'a', age: 7 })), 'tablet');
  assert.equal(layoutFor(newProfile({ name: 'a', age: 8 })), 'desktop');
  assert.equal(layoutFor(newProfile({ name: 'a', age: 9 })), 'desktop');
  const small = newProfile({ name: 'a', age: 5 });
  small.settings.layout = 'desktop';
  assert.equal(layoutFor(small), 'desktop');
  const big = newProfile({ name: 'a', age: 9 });
  big.settings.layout = 'tablet';
  assert.equal(layoutFor(big), 'tablet');
  big.settings.layout = 'konstig';
  assert.equal(layoutFor(big), 'desktop');
  assert.equal(layoutFor(null), 'tablet');
});

test('ageBand', () => {
  assert.equal(ageBand(4), 'small');
  assert.equal(ageBand(5), 'small');
  assert.equal(ageBand(6), 'mid');
  assert.equal(ageBand(7), 'mid');
  assert.equal(ageBand(8), 'big');
  assert.equal(ageBand(9), 'big');
  assert.equal(ageBand('9'), 'big');
  assert.equal(ageBand(undefined), 'small');
});

/* ---------------- Föräldravyn ---------------- */
test('learningSummary visar bara använda appar, senast först', () => {
  const apps = [{ id: 'math', name: 'Matte', icon: '➕' }, { id: 'svenska', name: 'Svenska', icon: '🔤' }, { id: 'art', name: 'Rita', icon: '🎨' }];
  const p = newProfile({ name: 'C', age: 7 });
  assert.deepEqual(learningSummary(p, apps), []);
  recordAnswer(p, 'math', { firstTry: true });
  recordAnswer(p, 'math', { firstTry: true });
  markActive(p, 'math', new Date('2026-01-01T10:00:00Z'));
  addToSet(p, 'appsTried', 'art'); // en vy-app utan frågor
  const rows = learningSummary(p, apps);
  assert.deepEqual(rows.map((r) => r.appId), ['art', 'math']);
  const math = rows.find((r) => r.appId === 'math');
  assert.equal(math.correct, 2);
  assert.equal(typeof math.level, 'number');
  assert.equal(rows.find((r) => r.appId === 'art').level, null);
  assert.equal(p.stats.art, undefined, 'sammanfattningen får inte skapa statistik');
});

test('relativeDay', () => {
  const now = new Date(2026, 9, 9, 12);
  assert.equal(relativeDay(new Date(2026, 9, 9, 8).toISOString(), now), 'i dag');
  assert.equal(relativeDay(new Date(2026, 9, 8, 8).toISOString(), now), 'i går');
  assert.equal(relativeDay(new Date(2026, 9, 6, 8).toISOString(), now), 'för 3 dagar sedan');
  assert.equal(relativeDay(null, now), '–');
  assert.equal(relativeDay('skräp', now), '–');
});

/* ---------------- Säkerhetskopia ---------------- */
test('säkerhetskopian tar med anteckningar, Lekstaden och teckningar per profil', () => {
  const s = normalizeState({});
  const a = newProfile({ name: 'Ada', age: 9 });
  const b = newProfile({ name: 'Bo', age: 5 });
  s.profiles.push(a, b);
  saveState(s);
  saveJSON(`notes.${a.id}`, [{ id: 'n1', title: 'Hej', text: 'Hej på dig', at: '2026-10-01T10:00:00Z', counted: 0 }]);
  saveJSON(`play.${b.id}`, { houses: 3, colors: { red: 1 } });
  saveDrawing(a.id, 'data:image/jpeg;base64,AAAA');
  const text = exportBackup(s);
  const data = JSON.parse(text);
  assert.equal(data.kidsos, 1);
  assert.equal(data.notes[a.id][0].text, 'Hej på dig');
  assert.deepEqual(data.play[b.id], { houses: 3, colors: { red: 1 } });
  assert.equal(data.notes[b.id], undefined);

  // Radera allt per profil och återställ
  deleteDrawingsFor(a.id);
  deleteDrawingsFor(b.id);
  assert.equal(loadJSON(`notes.${a.id}`, null), null);
  const restored = importBackup(text);
  assert.deepEqual(restored.profiles.map((p) => p.name), ['Ada', 'Bo']);
  assert.equal(loadJSON(`notes.${a.id}`, null)[0].title, 'Hej');
  assert.deepEqual(loadJSON(`play.${b.id}`, null), { houses: 3, colors: { red: 1 } });
  assert.equal(loadDrawings(a.id).length, 1);
});

test('gamla säkerhetskopior (utan anteckningar) fungerar och lämnar befintlig data orörd', () => {
  const p = newProfile({ name: 'Gammal', age: 7 });
  saveJSON(`notes.${p.id}`, [{ id: 'keep', text: 'finns kvar' }]);
  const oldBackup = JSON.stringify({ kidsos: 1, exportedAt: '2025-01-01T00:00:00Z', state: { profiles: [{ ...p, coins: undefined }] }, drawings: { [p.id]: [] } });
  const st = importBackup(oldBackup);
  assert.equal(st.profiles[0].name, 'Gammal');
  assert.equal(loadJSON(`notes.${p.id}`, null)[0].id, 'keep');
});

test('importBackup ignorerar fel typer och okända profiler', () => {
  const p = newProfile({ name: 'X', age: 7 });
  const text = JSON.stringify({
    kidsos: 1,
    state: { profiles: [p] },
    notes: { [p.id]: 'inte en lista', främling: [{ id: 'z' }] },
    play: { [p.id]: [1, 2, 3] },
    drawings: { främling: [{ data: 'x' }] },
  });
  importBackup(text);
  assert.equal(loadJSON(`notes.${p.id}`, null), null);
  assert.equal(loadJSON(`play.${p.id}`, null), null);
  assert.equal(loadJSON('notes.främling', null), null);
  assert.equal(loadDrawings('främling').length, 0);
  assert.throws(() => importBackup('inte json'), /säkerhetskopia/);
  assert.throws(() => importBackup('{"kidsos":2,"state":{}}'), /säkerhetskopia/);
});
