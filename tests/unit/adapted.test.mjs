import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeAdaptedPrefs, normalizeAdaptedSettings, defaultAdaptedPrefs, isAdapted, adaptedPrefs, sessionLength,
  reduceOptions, adaptQuestion, errorlessNext, adaptedSfx, praiseFor, PRAISE, firstThenText, interestFor, rewardFor,
  INTERESTS, REWARDS, ADAPTED_DEFAULTS, ADAPTED_QUESTION_CHOICES, ADAPTED_OPTION_CHOICES, rewardCount,
  PREFS_VERSION, SUPPORT_LEVELS, presetFor, supportFor, remainingCue, tasksLeft, leftLabel, scheduleSteps,
  FEELINGS, feelingResponse, breathPhase, BREATH, softRetryText,
} from '../../src/core/adapted.js';
import { newProfile, normalizeProfile, normalizeState } from '../../src/core/model.js';
import { createRng } from '../../src/core/rng.js';
import { APPS } from '../../src/apps/registry.js';

const opts = (n) => Array.from({ length: n }, (_, i) => ({ id: `o${i}`, label: String(i) }));

test('anpassat läge: standardvärden och normalisering av trasiga värden', () => {
  assert.deepEqual(normalizeAdaptedPrefs(undefined), defaultAdaptedPrefs());
  assert.deepEqual(normalizeAdaptedPrefs('skräp'), { ...ADAPTED_DEFAULTS });
  const n = normalizeAdaptedPrefs({ questions: 99, options: 1, sound: 'ja', focus: false, interest: 'okänt', reward: 'stars' });
  assert.equal(n.questions, 10);
  assert.equal(n.options, 2);
  assert.equal(n.sound, true, 'icke-boolesk ljudinställning ger standard');
  assert.equal(n.focus, false);
  assert.equal(n.interest, 'animals');
  assert.equal(n.reward, 'stars');
  assert.equal(normalizeAdaptedPrefs({ questions: 1 }).questions, 3);
  assert.equal(normalizeAdaptedPrefs({ options: 0 }).options, 0, '0 = som vanligt');
  assert.equal(normalizeAdaptedPrefs({ options: '' }).options, 0, 'utan IF: som vanligt');
  for (const q of ADAPTED_QUESTION_CHOICES) assert.equal(normalizeAdaptedPrefs({ v: PREFS_VERSION, questions: q }).questions, q);
  for (const o of ADAPTED_OPTION_CHOICES) assert.equal(normalizeAdaptedPrefs({ v: PREFS_VERSION, options: o }).options, o);
  for (const k of ['sound', 'motion', 'calm', 'focus', 'checkin', 'warnings', 'hideStreak']) {
    assert.equal(typeof normalizeAdaptedPrefs({})[k], 'boolean', k);
    assert.equal(normalizeAdaptedPrefs({ v: 2, [k]: false })[k], false, k);
  }
  assert.equal(normalizeAdaptedPrefs({ errorMode: 'skräp' }).errorMode, 'retry');
  assert.equal(normalizeAdaptedPrefs({ support: 9 }).support, 2);
});

test('anpassat läge: bara true slår på läget', () => {
  assert.equal(normalizeAdaptedSettings({ adapted: 'true' }).adapted, false);
  assert.equal(normalizeAdaptedSettings({ adapted: 1 }).adapted, false);
  assert.equal(normalizeAdaptedSettings({ adapted: true }).adapted, true);
  assert.equal(normalizeAdaptedSettings(null).adapted, false);
});

test('profiler: nya profiler har läget av, kan skapas med läget på', () => {
  const p = newProfile({ name: 'A', age: 7 });
  assert.equal(p.settings.adapted, false);
  assert.deepEqual(p.settings.adaptedPrefs, defaultAdaptedPrefs());
  const q = newProfile({ name: 'B', ageBand: '6-7', adapted: true, adaptedPrefs: { interest: 'space', questions: 4 } });
  assert.equal(q.settings.adapted, true);
  assert.equal(q.settings.adaptedPrefs.interest, 'space');
  assert.equal(q.settings.adaptedPrefs.questions, 4);
  assert.equal(isAdapted(q), true);
  assert.equal(isAdapted(p), false);
  assert.equal(isAdapted(null), false);
});

test('profiler: äldre sparade profiler utan fälten migreras bakåtkompatibelt', () => {
  const old = { id: 'x', name: 'Gammal', age: 6, stars: 3, settings: { readAloud: 'on', hiddenApps: [] } };
  const n = normalizeProfile(old);
  assert.equal(n.settings.adapted, false);
  assert.deepEqual(n.settings.adaptedPrefs, defaultAdaptedPrefs());
  assert.equal(n.settings.readAloud, 'on', 'andra inställningar behålls');
  const on = normalizeProfile({ ...old, settings: { adapted: true, adaptedPrefs: { options: 2, sound: false } } });
  assert.equal(on.settings.adapted, true);
  assert.equal(on.settings.adaptedPrefs.options, 2, 'ett aktivt val (högst 2) behålls vid migrering');
  assert.equal(on.settings.adaptedPrefs.sound, false);
  assert.equal(on.settings.adaptedPrefs.questions, 5);
  const st = normalizeState({ profiles: [old, { ...old, id: 'y', settings: { adapted: true } }] });
  assert.deepEqual(st.profiles.map((p) => p.settings.adapted), [false, true]);
});

test('passlängd: anpassat läge ger förälderns val, annars ordinarie', () => {
  const p = newProfile({ name: 'A', age: 9 });
  assert.equal(sessionLength(p, 8), 8);
  p.settings.adapted = true;
  assert.equal(sessionLength(p, 8), 5);
  p.settings.adaptedPrefs.questions = 3;
  assert.equal(sessionLength(p, 8), 3);
  p.settings.adaptedPrefs = 'trasig';
  assert.equal(sessionLength(p, 8), 5);
  assert.deepEqual(adaptedPrefs(p), defaultAdaptedPrefs());
});

test('färre alternativ: rätt svar finns alltid kvar och ordningen bevaras', () => {
  const o = opts(5);
  for (const ans of o.map((x) => x.id)) {
    for (const max of [2, 3, 4]) {
      const r = reduceOptions(o, ans, max);
      assert.equal(r.length, max);
      assert.ok(r.some((x) => x.id === ans), `rätt svar ${ans} kvar vid max ${max}`);
      const idx = r.map((x) => o.indexOf(x));
      assert.deepEqual(idx, [...idx].sort((a, b) => a - b), 'ursprunglig ordning');
    }
  }
  assert.equal(reduceOptions(o, 'o0', 0).length, 5, '0 = som vanligt');
  assert.equal(reduceOptions(o, 'o0', 9).length, 5);
  assert.equal(reduceOptions(o, 'saknas', 2).length, 5, 'okänt svar rörs inte');
  assert.equal(o.length, 5, 'muterar inte indata');
});

test('adaptQuestion: bara flervalsfrågor får färre alternativ', () => {
  const q = { type: 'choice', prompt: 'X', options: opts(4), answer: 'o3' };
  const a = adaptQuestion(q, { options: 2 });
  assert.equal(a.options.length, 2);
  assert.ok(a.options.some((x) => x.id === 'o3'));
  assert.equal(q.options.length, 4, 'originalet orört');
  assert.equal(a.adapted, true);
  const num = { type: 'numpad', prompt: 'Y', answer: 4 };
  assert.deepEqual({ ...adaptQuestion(num, { options: 2 }), adapted: undefined }, { ...num, adapted: undefined });
});

test('adaptQuestion på riktiga generatorer: rätt svar finns alltid bland alternativen', () => {
  const rng = createRng(7);
  let checked = 0;
  for (const app of APPS) {
    for (const mod of app.modules.filter((m) => m.gen)) {
      for (const level of [0, 1, 2]) {
        let q;
        try { q = mod.gen(level, rng, { found: {} }); } catch { continue; }
        if (!q || q.type !== 'choice' || !Array.isArray(q.options)) continue;
        for (const max of [2, 3]) {
          const a = adaptQuestion(q, { options: max });
          assert.ok(a.options.length <= Math.max(max, 0) || a.options.length === q.options.length);
          if (q.options.some((o) => o.id === q.answer)) assert.ok(a.options.some((o) => o.id === q.answer), `${app.id}/${mod.id}`);
        }
        checked++;
      }
    }
  }
  assert.ok(checked > 10, `kontrollerade ${checked} frågor`);
});

test('felfri inlärning: göra om en gång, sedan lugnt visa svaret', () => {
  assert.equal(errorlessNext(0), 'redo');
  assert.equal(errorlessNext(1), 'reveal');
  assert.equal(errorlessNext(5), 'reveal');
  assert.equal(errorlessNext(undefined), 'redo');
});

test('ljud: inga fel- eller fanfarljud, inget alls när ljudet är av', () => {
  assert.equal(adaptedSfx('wrong', {}), null);
  assert.equal(adaptedSfx('fanfare', {}), 'star');
  assert.equal(adaptedSfx('correct', {}), 'correct');
  assert.equal(adaptedSfx('pop', { sound: false }), null);
  assert.equal(adaptedSfx('correct', { sound: false }), null);
});

test('beröm och först–sen-text är korta och förutsägbara', () => {
  for (let i = 0; i < 12; i++) assert.ok(PRAISE.includes(praiseFor(i)));
  assert.equal(praiseFor(0), praiseFor(PRAISE.length));
  assert.ok(PRAISE.every((p) => p.split(' ').length <= 3));
  assert.deepEqual(firstThenText(5, { reward: 'bubbles' }), { first: 'Först 5 uppgifter', then: 'Sen bubblor' });
  assert.equal(firstThenText(1, {}).first, 'Först 1 uppgift');
});

test('intressen och belöningar har giltiga data', () => {
  assert.equal(interestFor('nope').id, 'animals');
  assert.equal(interestFor({ interest: 'ocean' }).id, 'ocean');
  assert.equal(rewardFor('nope').id, 'bubbles');
  for (const i of INTERESTS) {
    assert.ok(i.items.length >= 5, i.id);
    for (const [emoji, name] of i.items) {
      assert.ok(emoji && name);
      assert.match(name, /^(en |ett )?[a-zåäö]+$/);
    }
  }
  assert.equal(new Set(INTERESTS.map((i) => i.id)).size, INTERESTS.length);
  assert.equal(new Set(REWARDS.map((r) => r.id)).size, REWARDS.length);
  for (const r of REWARDS) assert.ok(rewardCount(r.id) >= 5 && rewardCount(r.id) <= 12);
});

test('autismstöd: standard är nivå 2 utan IF – svårighet och antal alternativ som vanligt', () => {
  const d = defaultAdaptedPrefs();
  assert.equal(d.support, 2);
  assert.equal(d.intellectual, false);
  assert.equal(d.options, 0, 'inga färre alternativ utan IF');
  assert.equal(d.errorMode, 'retry');
  assert.equal(d.checkin, true);
  assert.equal(d.warnings, true);
  assert.equal(d.hideStreak, true);
  assert.equal(d.v, PREFS_VERSION);
  const q = { type: 'choice', prompt: 'X', options: opts(5), answer: 'o4' };
  assert.equal(adaptQuestion(q, d).options.length, 5, 'utan IF rörs alternativen inte');
  assert.equal(adaptQuestion(q, {}).options.length, 5);
});

test('autismstöd: äldre inställningar (anpassat läge för IF) migreras till nya standardval', () => {
  const old = normalizeAdaptedPrefs({ questions: 5, options: 3, sound: true, focus: true, interest: 'space', reward: 'stars' });
  assert.equal(old.options, 0, 'det gamla standardvärdet 3 blir "som vanligt"');
  assert.equal(old.interest, 'space');
  assert.equal(old.reward, 'stars');
  assert.equal(old.v, PREFS_VERSION);
  assert.equal(normalizeAdaptedPrefs({ options: 2 }).options, 2, 'aktivt val behålls');
  assert.equal(normalizeAdaptedPrefs({ v: 2, options: 3 }).options, 3, 'nytt val 3 behålls');
  const again = normalizeAdaptedPrefs(normalizeAdaptedPrefs({ options: 3 }));
  assert.equal(again.options, 0, 'normalisering är stabil');
  const n = normalizeProfile({ id: 'k', name: 'K', age: 7, settings: { adapted: true, adaptedPrefs: { questions: 5, options: 3, sound: true, focus: true, interest: 'animals', reward: 'bubbles' } } });
  assert.equal(n.settings.adapted, true);
  assert.equal(n.settings.adaptedPrefs.options, 0);
  assert.equal(n.settings.adaptedPrefs.support, 2);
});

test('autismstöd: förinställningar per stödnivå och IF', () => {
  assert.equal(SUPPORT_LEVELS.length, 3);
  assert.equal(supportFor(2).title, 'Behöver omfattande stöd');
  assert.equal(supportFor('x').id, 2);
  const noIf = presetFor(2, false);
  assert.equal(noIf.options, 0);
  assert.equal(noIf.errorMode, 'retry');
  const withIf = presetFor(2, true);
  assert.equal(withIf.options, 3);
  assert.equal(withIf.errorMode, 'errorless');
  assert.equal(presetFor(3, true).options, 2);
  assert.ok(presetFor(1).questions > presetFor(3).questions, 'nivå 3 har kortare pass');
  assert.equal(presetFor(1).checkin, false);
  const ifPrefs = normalizeAdaptedPrefs({ v: 2, intellectual: true });
  assert.equal(ifPrefs.options, 3);
  assert.equal(ifPrefs.errorMode, 'errorless');
  const q = { type: 'choice', prompt: 'X', options: opts(5), answer: 'o4' };
  assert.equal(adaptQuestion(q, ifPrefs).options.length, 3);
});

test('förvarning: "2 kvar" och "Sista!" – förutsägbart och valbart', () => {
  assert.equal(tasksLeft(0, 5), 5);
  assert.equal(tasksLeft(4, 5), 1);
  assert.equal(tasksLeft(5, 5), 0);
  assert.equal(leftLabel(0, 5), '5 kvar');
  assert.equal(leftLabel(4, 5), 'Sista!');
  assert.equal(leftLabel(5, 5), 'Klart!');
  const p = defaultAdaptedPrefs();
  assert.equal(remainingCue(0, 5, p), null);
  assert.equal(remainingCue(2, 5, p), null);
  assert.equal(remainingCue(3, 5, p).say, 'Två uppgifter kvar.');
  assert.match(remainingCue(4, 5, p).say, /^Sista uppgiften! Sen bubblor\.$/);
  assert.equal(remainingCue(3, 5, { ...p, warnings: false }), null, 'kan stängas av');
  assert.equal(remainingCue(1, 2, p), null, 'för korta pass får ingen extra förvarning');
});

test('visuellt schema: samma steg i samma ordning, med eller utan "Hur mår du?"', () => {
  const s = scheduleSteps(5, { v: 2, interest: 'space', reward: 'bubbles' });
  assert.deepEqual(s.map((x) => x.id), ['checkin', 'tasks', 'reward', 'done']);
  assert.equal(s[1].icon, '🚀');
  assert.equal(s[1].label, '5 uppgifter');
  assert.equal(s[2].label, 'Bubblor');
  assert.deepEqual(scheduleSteps(1, { v: 2, checkin: false }).map((x) => x.id), ['tasks', 'reward', 'done']);
  assert.equal(scheduleSteps(1, { v: 2, checkin: false })[0].label, '1 uppgift');
  assert.equal(scheduleSteps(3, { reward: 'friends', interest: 'dinos' })[2].icon, '🦖');
});

test('känslokort: oro, trötthet och ilska erbjuder lugn stund – aldrig ett krav', () => {
  assert.ok(FEELINGS.length >= 4);
  assert.equal(new Set(FEELINGS.map((f) => f.id)).size, FEELINGS.length);
  assert.equal(feelingResponse('good').calm, false);
  assert.equal(feelingResponse('ok').calm, false);
  for (const id of ['worried', 'tired', 'angry']) {
    const r = feelingResponse(id);
    assert.equal(r.calm, true, id);
    assert.match(r.say, /Vill du andas/);
  }
  assert.equal(feelingResponse('okänd').calm, false);
});

test('andningscirkel: in 4 s, ut 6 s, fem andetag och sedan klart', () => {
  assert.equal(breathPhase(0).phase, 'in');
  assert.equal(breathPhase(0).size, 0);
  assert.equal(breathPhase(BREATH.inMs - 1).phase, 'in');
  assert.equal(breathPhase(BREATH.inMs).phase, 'out');
  assert.ok(Math.abs(breathPhase(BREATH.inMs).size - 1) < 1e-9);
  assert.ok(breathPhase(BREATH.inMs + BREATH.outMs - 1).size < 0.01);
  assert.ok(BREATH.outMs > BREATH.inMs, 'längre utandning');
  assert.equal(breathPhase((BREATH.inMs + BREATH.outMs) * BREATH.rounds).phase, 'done');
  for (let t = 0; t < (BREATH.inMs + BREATH.outMs) * BREATH.rounds; t += 250) {
    const b = breathPhase(t);
    assert.ok(b.size >= 0 && b.size <= 1, `storlek inom 0–1 vid ${t}`);
  }
});

test('mjuk återkoppling och temaberöm: aldrig "fel", korta fraser med intresset', () => {
  const s = softRetryText('Räkna en gång till.');
  assert.equal(s.title, 'Prova en gång till.');
  assert.match(s.say, /Räkna en gång till\./);
  assert.equal(softRetryText('').say, 'Prova en gång till.');
  for (const t of [s.title, s.say, softRetryText().say]) assert.doesNotMatch(t, /\bfel\b/i);
  for (const it of INTERESTS) {
    assert.ok(it.cheer && it.cheer.split(' ').length <= 3, it.id);
    const seen = new Set(Array.from({ length: 6 }, (_, i) => praiseFor(i, { interest: it.id })));
    assert.ok(seen.has(it.cheer), `${it.id}: temafrasen ingår`);
    assert.equal(praiseFor(0, { interest: it.id }), praiseFor(6, { interest: it.id }), 'förutsägbar ordning');
  }
  assert.ok(INTERESTS.some((i) => i.id === 'blocks'), 'byggblock finns som generiskt intresse');
});

/* ===================== Runda 2: tema, dagens plan, skärmtid, rörelsepauser, logg ===================== */
import {
  themeQuestion, NEUTRAL_COUNTERS, THEME_COUNTERS, DEFAULT_PLAN, normalizePlan, movePlanStep, PLAN_SPECIAL, PLAN_MAX,
  AFTER_ACTIVITIES, afterFor, screenTimer, shouldWarnScreen, screenWarnText, endingSteps, SCREEN_WARN_MIN, LIMIT_GRACE_MS,
  BRAIN_BREAKS, breakChoices, countWord,
} from '../../src/core/adapted.js';
import {
  emptyLog, normalizeLog, logEvent, planProgress, currentPlanIndex, markPlanStep, summarizeLog, logPatterns, lastDays,
  pruneLog, toggleTool, LOG_KEEP_DAYS, loadLog, saveLog,
} from '../../src/core/adapted-log.js';
import { emojiGroup } from '../../src/ui/visuals.js';
import { appById } from '../../src/apps/registry.js';

test('runda 2: nya standardval och normalisering (tema, pauser, förvarning, plan, sen)', () => {
  const d = defaultAdaptedPrefs();
  assert.equal(d.themeTasks, true);
  assert.equal(d.breaks, true);
  assert.equal(d.screenWarn, true);
  assert.deepEqual(d.plan, [...DEFAULT_PLAN]);
  assert.equal(d.after, 'build');
  d.plan.push('x');
  assert.deepEqual(defaultAdaptedPrefs().plan, [...DEFAULT_PLAN], 'standardplanen delas inte mellan profiler');
  for (const k of ['themeTasks', 'breaks', 'screenWarn']) assert.equal(normalizeAdaptedPrefs({ v: 2, [k]: false })[k], false, k);
  assert.equal(normalizeAdaptedPrefs({ after: 'okänd' }).after, 'build');
  assert.equal(normalizeAdaptedPrefs({ after: 'book' }).after, 'book');
  assert.deepEqual(normalizeAdaptedPrefs({ plan: ['math', 'math', 'BAD id', 7, 'move'] }).plan, ['math', 'move']);
  assert.deepEqual(normalizeAdaptedPrefs({ plan: 'trasig' }).plan, [...DEFAULT_PLAN]);
  const old = normalizeProfile({ id: 'o', name: 'O', age: 7, settings: { adapted: true, adaptedPrefs: { v: 2, interest: 'space' } } });
  assert.equal(old.settings.adaptedPrefs.themeTasks, true, 'sparade profiler får de nya valen');
  assert.deepEqual(old.settings.adaptedPrefs.plan, [...DEFAULT_PLAN]);
});

test('dagens plan: högst PLAN_MAX steg, föräldern flyttar steg upp och ner', () => {
  assert.equal(normalizePlan(Array.from({ length: 12 }, (_, i) => `app${i}`)).length, PLAN_MAX);
  assert.deepEqual(movePlanStep(['a1', 'b1', 'c1'], 0, 1), ['b1', 'a1', 'c1']);
  assert.deepEqual(movePlanStep(['a1', 'b1', 'c1'], 2, -1), ['a1', 'c1', 'b1']);
  assert.deepEqual(movePlanStep(['a1', 'b1'], 0, -1), ['a1', 'b1'], 'kan inte flytta utanför');
  for (const s of PLAN_SPECIAL) {
    const app = appById(s.app);
    assert.ok(app && app.modules.some((m) => m.id === s.module), `${s.id} pekar på en modul som finns`);
  }
  for (const id of DEFAULT_PLAN) assert.ok(appById(id) || PLAN_SPECIAL.some((s) => s.id === id), id);
});

test('tema i uppgifterna: räkneobjekt blir intressets objekt – antal och svar oförändrade', () => {
  const q = { type: 'choice', prompt: 'Hur många äpplen ser du?', visual: emojiGroup('🍎', 7), options: [{ id: '7', label: '7' }, { id: '6', label: '6' }], answer: '7', explain: 'Det är 7.' };
  const t = themeQuestion(q, { interest: 'space' });
  assert.equal(t.prompt, 'Hur många raketer ser du?');
  assert.equal((t.visual.match(/🚀/g) || []).length, 7);
  assert.ok(!t.visual.includes('🍎'));
  assert.equal(t.answer, '7');
  assert.deepEqual(t.options, q.options);
  assert.equal(q.prompt, 'Hur många äpplen ser du?', 'originalet orört');
  // Grupper och "flest"
  const g = themeQuestion({ ...q, prompt: 'Två grupper med 3 äpplen i varje. Hur många äpplen är det?' }, { interest: 'vehicles' });
  assert.equal(g.prompt, 'Två grupper med 3 tåg i varje. Hur många tåg är det?');
  // Bildsvar (jämför)
  const c = themeQuestion({ type: 'choice', prompt: 'Var finns det flest bilar?', options: [{ id: 'a', html: emojiGroup('🚗', 3) }, { id: 'b', html: emojiGroup('🚗', 5) }], answer: 'b' }, { interest: 'dinos' });
  assert.equal(c.prompt, 'Var finns det flest ägg?');
  assert.ok(c.options.every((o) => !o.html.includes('🚗')));
});

test('tema i uppgifterna: rör aldrig textuppgifter, blandade bilder eller avstängt tema', () => {
  const eat = { type: 'numpad', prompt: 'Ebba har 5 äpplen till fikat. Hon äter upp 2. Hur många äpplen har hon kvar?', visual: emojiGroup('🍎', 5), answer: 3 };
  assert.equal(themeQuestion(eat, { interest: 'space' }), eat, 'ordet "äpplen" i en berättelse');
  const mixed = { type: 'choice', prompt: 'Hur många ser du?', visual: emojiGroup('🍎', 2) + emojiGroup('🍓', 2), options: [{ id: '4', label: '4' }, { id: '3', label: '3' }], answer: '4' };
  assert.equal(themeQuestion(mixed, { interest: 'space' }), mixed);
  const other = { type: 'choice', prompt: 'Hur många barn ser du?', visual: emojiGroup('🧒', 3), options: [{ id: '3', label: '3' }, { id: '2', label: '2' }], answer: '3' };
  assert.equal(themeQuestion(other, { interest: 'space' }), other, 'bara neutrala räkneobjekt');
  const elsewhere = { type: 'choice', prompt: 'Hur många äpplen ser du?', visual: emojiGroup('🍎', 3) + '<b>🍎</b>', options: [{ id: '3', label: '3' }, { id: '1', label: '1' }], answer: '3' };
  assert.equal(themeQuestion(elsewhere, { interest: 'space' }), elsewhere, 'objektet finns även utanför räknegruppen');
  const q = { type: 'choice', prompt: 'Hur många äpplen ser du?', visual: emojiGroup('🍎', 3), options: [{ id: '3', label: '3' }, { id: '2', label: '2' }], answer: '3' };
  assert.ok(!adaptQuestion(q, { v: 2, themeTasks: false, interest: 'space' }).themed, 'föräldern kan stänga av');
  assert.ok(adaptQuestion(q, { v: 2, interest: 'space' }).themed);
});

test('tema i uppgifterna: alla intressen har räkneobjekt med korrekta plural, och alla matte-frågor förblir giltiga', () => {
  for (const it of INTERESTS) {
    const list = THEME_COUNTERS[it.id];
    assert.ok(list && list.length >= 3, it.id);
    for (const [e, noun] of list) assert.ok(e && /^[a-zåäö]+$/.test(noun), `${it.id}: ${noun}`);
  }
  assert.equal(Object.keys(NEUTRAL_COUNTERS).length, 12);
  const math = APPS.find((a) => a.id === 'math');
  let themed = 0;
  for (const it of INTERESTS) {
    for (const mod of math.modules.filter((m) => m.gen)) {
      for (let level = 0; level <= 4; level++) {
        for (let s = 0; s < 6; s++) {
          const q = mod.gen(level, createRng(s * 101 + level), { found: {} });
          const t = adaptQuestion(q, { v: 2, interest: it.id });
          assert.deepEqual(t.answer, q.answer, `${mod.id}: svaret ändras aldrig`);
          if (Array.isArray(q.options)) assert.deepEqual(t.options.map((o) => o.id), q.options.map((o) => o.id));
          if (t.themed) {
            themed++;
            const count = (html) => (String(html || '').match(/class="eg-item/g) || []).length;
            assert.equal(count(t.visual), count(q.visual), `${mod.id}: lika många objekt`);
            assert.doesNotMatch(t.prompt, /undefined|NaN/);
          }
        }
      }
    }
  }
  assert.ok(themed > 20, `tema används i matten (${themed})`);
});

test('skärmtid: krympande cirkel, förvarning 2 minuter före (en gång) och avslutning med samma steg', () => {
  assert.equal(screenTimer(Infinity, 0).unlimited, true);
  const t = screenTimer(15, 30);
  assert.equal(t.frac, 0.5);
  assert.equal(t.label, '15 min kvar');
  assert.equal(t.warn, false);
  assert.equal(screenTimer(1.2, 30).warn, true);
  assert.equal(screenTimer(1.2, 30).label, '2 min kvar');
  assert.equal(screenTimer(0, 30).over, true);
  assert.equal(screenTimer(0, 30).label, 'Slut');
  assert.ok(screenTimer(50, 30).frac <= 1);
  const p = defaultAdaptedPrefs();
  assert.equal(SCREEN_WARN_MIN, 2);
  assert.equal(shouldWarnScreen(2, p, false), true);
  assert.equal(shouldWarnScreen(2, p, true), false, 'bara en gång');
  assert.equal(shouldWarnScreen(5, p, false), false);
  assert.equal(shouldWarnScreen(0, p, false), false);
  assert.equal(shouldWarnScreen(Infinity, p, false), false);
  assert.equal(shouldWarnScreen(1, { ...p, screenWarn: false }, false), false, 'kan stängas av');
  assert.match(screenWarnText(p).say, /^Två minuter kvar\. .*Sen: bygga med klossar\.$/);
  const steps = endingSteps({ after: 'book' });
  assert.deepEqual(steps.map((s) => s.id), ['done', 'saved', 'breathe', 'next']);
  assert.equal(steps[3].title, 'Sen: Läsa en bok');
  for (const s of steps) assert.doesNotMatch(`${s.title} ${s.say}`, /måste|fel|straff/i, 'ingen skuld eller press');
  assert.ok(LIMIT_GRACE_MS >= 60000 && LIMIT_GRACE_MS <= 5 * 60000);
});

test('"Vad gör jag sen?" och rörelsepauser: giltiga, valbara och förutsägbara', () => {
  assert.equal(new Set(AFTER_ACTIVITIES.map((a) => a.id)).size, AFTER_ACTIVITIES.length);
  assert.ok(AFTER_ACTIVITIES.length >= 6);
  assert.equal(afterFor('nope').id, 'build');
  assert.equal(afterFor({ after: 'bike' }).label, 'Cykla');
  assert.ok(BRAIN_BREAKS.length >= 8);
  assert.equal(new Set(BRAIN_BREAKS.map((b) => b.id)).size, BRAIN_BREAKS.length);
  for (const b of BRAIN_BREAKS) {
    assert.ok(b.count >= 3 && b.count <= 10, b.id);
    assert.ok(['calm', 'energy'].includes(b.kind));
    assert.ok(b.say.length > 10 && !/\bmåste\b/i.test(b.say));
  }
  for (let i = 0; i < 12; i++) {
    const c = breakChoices(i);
    assert.equal(c.length, 3);
    assert.equal(new Set(c.map((b) => b.id)).size, 3, 'tre olika');
    assert.ok(c.some((b) => b.kind === 'energy') && c.some((b) => b.kind === 'calm'), 'både lugnt och piggt');
    assert.deepEqual(breakChoices(i), c, 'samma index ger samma val');
  }
  assert.equal(countWord(1), 'ett');
  assert.equal(countWord(10), 'tio');
});

test('förälderns logg: mående, pauser och pass per dag – trasig data lagas', () => {
  const log = emptyLog();
  logEvent(log, '2026-10-12', 'mood', 'worried', '08:15');
  logEvent(log, '2026-10-12', 'mood', 'okänd');
  logEvent(log, '2026-10-12', 'pause');
  logEvent(log, '2026-10-12', 'break');
  logEvent(log, '2026-10-12', 'pass', 'math');
  logEvent(log, '2026-10-11', 'mood', 'good');
  logEvent(log, 'inte-ett-datum', 'pause');
  assert.deepEqual(log.days['2026-10-12'].moods, [{ id: 'worried', t: '08:15' }]);
  assert.equal(log.days['2026-10-12'].pauses, 1);
  assert.equal(log.days['2026-10-12'].breaks, 1);
  assert.equal(log.days['2026-10-12'].passes, 1);
  assert.equal(Object.keys(log.days).length, 2);
  const rows = summarizeLog(log, '2026-10-12', 7, { '2026-10-12': 1500 });
  assert.equal(rows.length, 7);
  assert.equal(rows[0].day, '2026-10-12');
  assert.equal(rows[0].weekday, 'mån');
  assert.equal(rows[0].minutes, 25);
  assert.deepEqual(rows[1].moods, ['good']);
  const pat = logPatterns(rows);
  assert.ok(pat.some((t) => /Oro, trötthet eller ilska valdes 1 av 7 dagar/.test(t)));
  assert.match(logPatterns(summarizeLog(emptyLog(), '2026-10-12'))[0], /Inga känslokort/);
  assert.deepEqual(lastDays('2026-03-01', 2), ['2026-03-01', '2026-02-28']);
  const n = normalizeLog({ days: { '2026-10-01': { moods: [{ id: 'angry' }, { id: 'x' }], pauses: -4, breaks: 'två' }, skräp: {} }, tools: ['breathe', 'BAD', 'breathe'] });
  assert.deepEqual(Object.keys(n.days), ['2026-10-01']);
  assert.equal(n.days['2026-10-01'].moods.length, 1);
  assert.equal(n.days['2026-10-01'].pauses, 0);
  assert.equal(n.days['2026-10-01'].breaks, 0);
  assert.deepEqual(n.tools, ['breathe']);
  assert.deepEqual(normalizeLog('trasig'), emptyLog());
  const old = { ...emptyLog(), days: { '2026-01-01': { pauses: 1 } } };
  pruneLog(old, '2026-10-12');
  assert.equal(Object.keys(old.days).length, 0, `äldre än ${LOG_KEEP_DAYS} dagar rensas`);
  const t = toggleTool(emptyLog(), 'breathe');
  assert.deepEqual(t.tools, ['breathe']);
  assert.deepEqual(toggleTool(t, 'breathe').tools, []);
  assert.deepEqual(loadLog('p1'), emptyLog(), 'utan localStorage (Node) blir loggen tom');
  assert.equal(saveLog('p1', log), false);
});

test('dagens plan i loggen: steget som är "nu" bockas av först, sedan nästa med samma id', () => {
  const log = emptyLog();
  const plan = ['math', 'move', 'math', 'svenska'];
  assert.deepEqual(planProgress(log, '2026-10-12', plan), [false, false, false, false]);
  assert.equal(currentPlanIndex(log, '2026-10-12', plan), 0);
  assert.equal(markPlanStep(log, '2026-10-12', plan, 'move'), 1, 'ett senare steg kan göras först');
  assert.equal(markPlanStep(log, '2026-10-12', plan, 'math'), 0);
  assert.equal(currentPlanIndex(log, '2026-10-12', plan), 2);
  assert.equal(markPlanStep(log, '2026-10-12', plan, 'math'), 2);
  assert.equal(markPlanStep(log, '2026-10-12', plan, 'math'), -1, 'inga fler mattesteg');
  assert.equal(markPlanStep(log, '2026-10-12', plan, 'svenska'), 3);
  assert.equal(currentPlanIndex(log, '2026-10-12', plan), -1, 'allt klart');
  assert.deepEqual(planProgress(log, '2026-10-13', plan), [false, false, false, false], 'ny dag, ny plan');
});
