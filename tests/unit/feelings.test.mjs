// Känslor & jag: sociala berättelser (Gray-kriterier), känsloigenkänning, kroppens signaler och verktygslådan.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  feelingsApp, SOCIAL_STORIES, storyText, storyStats, EMOTIONS, emotionById, faceSvg, emotionVisual, genFaces,
  SITUATIONS, THINKING, SCALES, genSituations, BODY_SIGNALS, genSignals, BODY_PARTS, MAP_FEELINGS, CALM_TOOLS,
} from '../../src/apps/feelings.js';
import { appById } from '../../src/apps/registry.js';
import { createRng } from '../../src/core/rng.js';
import { VIEWS_LIST } from './_views.mjs';
import { INTERESTS, PLAN_SPECIAL } from '../../src/core/adapted.js';

const allText = (s) => [s.title, ...s.pages.flatMap((p) => p.lines.map((l) => l[1]))].join(' ');

test('Känslor & jag är registrerad med vyer som finns', () => {
  assert.equal(appById('feelings'), feelingsApp);
  for (const m of feelingsApp.modules.filter((x) => x.view)) assert.ok(VIEWS_LIST.includes(m.view), m.view);
  for (const s of PLAN_SPECIAL) assert.ok(feelingsApp.modules.some((m) => m.id === s.module), s.id);
});

test('sociala berättelser: 8–12 stycken med inledning, mitten och avslutning och en bild per sida', () => {
  assert.ok(SOCIAL_STORIES.length >= 8 && SOCIAL_STORIES.length <= 12);
  assert.equal(new Set(SOCIAL_STORIES.map((s) => s.id)).size, SOCIAL_STORIES.length);
  for (const s of SOCIAL_STORIES) {
    assert.ok(s.title && s.icon, s.id);
    assert.ok(s.pages.length >= 3 && s.pages.length <= 6, `${s.id}: 3–6 sidor`);
    for (const p of s.pages) {
      assert.ok(p.pic, `${s.id}: bild på varje sida`);
      assert.ok(p.lines.length >= 1 && p.lines.length <= 3, `${s.id}: korta sidor`);
      for (const [kind, t] of p.lines) {
        assert.ok(['d', 'c'].includes(kind));
        assert.match(t, /[.?!:]$/, `${s.id}: hel mening – ${t}`);
        assert.ok(t.split(' ').length <= 24, `${s.id}: för lång mening – ${t}`);
      }
    }
  }
  for (const want of ['screen-end', 'wrong', 'change', 'wait', 'loud', 'help', 'switch']) assert.ok(SOCIAL_STORIES.some((s) => s.id === want), want);
});

test('sociala berättelser följer Grays kriterier (10.3) som går att kontrollera', () => {
  let praised = 0;
  for (const s of SOCIAL_STORIES) {
    const st = storyStats(s);
    assert.ok(st.coaching <= 1, `${s.id}: högst en vägledande mening`);
    assert.ok(st.descriptive >= 3 * Math.max(1, st.coaching), `${s.id}: minst tre beskrivande per vägledande`);
    const text = allText(s);
    assert.doesNotMatch(text, /\b(du|dig|din|ditt|dina)\b/i, `${s.id}: ingen andra person`);
    assert.doesNotMatch(text, /\b(alltid|aldrig|måste|förbjudet|dumt|stygg)\b/i, `${s.id}: bokstavligt korrekt och positivt`);
    assert.match(text, /\b[Jj]ag\b/, `${s.id}: första person`);
    const coach = s.pages.flatMap((p) => p.lines).find((l) => l[0] === 'c');
    if (coach) assert.match(coach[1], /^Jag kan /, `${s.id}: vägledningen är ett val ("Jag kan …")`);
    if (s.praise) praised++;
  }
  assert.ok(praised * 2 >= SOCIAL_STORIES.length, `minst hälften lyfter barnets styrkor (${praised})`);
});

test('sociala berättelser: intresset fogas in med rätt form', () => {
  const s = SOCIAL_STORIES.find((x) => x.id === 'interest');
  const line = s.pages[0].lines[0][1];
  for (const it of INTERESTS) {
    const t = storyText(line, it.label);
    assert.ok(!t.includes('{'), it.id);
    assert.ok(t.includes(it.label.toLowerCase()));
  }
  assert.equal(storyText('Om {interest} och {interest}.', 'Rymden'), 'Om rymden och rymden.');
});

test('känslor: unika, med ansiktsdrag, och illustrerade ansikten utan skräp', () => {
  assert.equal(new Set(EMOTIONS.map((e) => e.id)).size, EMOTIONS.length);
  for (const e of EMOTIONS) {
    assert.ok(e.cue.length > 15, e.id);
    for (let v = 0; v < 6; v++) {
      const svg = faceSvg(e.id, v);
      assert.match(svg, /^<svg class="face-svg/);
      assert.ok(svg.includes(`ser ${e.label} ut`), 'beskrivande aria-label');
      assert.doesNotMatch(svg, /undefined|NaN/);
    }
    assert.match(emotionVisual(e.id, { real: false }), /^<svg/);
  }
  assert.ok(EMOTIONS.filter((e) => e.level === 0).length >= 4, 'grundkänslorna först');
});

test('läsa ansikten: tecknat först (nivå 0), grundkänslor, rätt svar finns och förklaringen lär ut ansiktsdrag', () => {
  for (let s = 0; s < 80; s++) {
    const q = genFaces(0, createRng(s));
    assert.equal(q.options.length, 3);
    assert.ok(q.options.every((o) => emotionById(o.id).level === 0));
    assert.match(q.visual, /face-svg/, 'nivå 0 visar illustrerade ansikten');
    assert.ok(q.explain.includes(emotionById(q.answer).cue));
  }
  let reverse = 0;
  for (let s = 0; s < 80; s++) {
    const q = genFaces(3, createRng(s));
    assert.equal(q.options.length, 4);
    assert.ok(q.options.some((o) => o.id === q.answer));
    if (q.prompt.startsWith('Vilket ansikte')) {
      reverse++;
      assert.ok(q.options.every((o) => o.html.startsWith('<svg')));
    }
  }
  assert.ok(reverse > 10, 'omvända frågor (välj ansiktet) på högre nivåer');
});

test('situationer, tankar och känslornas styrka: entydiga svar', () => {
  for (const s of SITUATIONS) {
    for (const id of [s.answer, ...s.wrong]) assert.ok(emotionById(id), `${id} finns`);
    assert.ok(!s.wrong.includes(s.answer));
    assert.ok(s.why.length > 20);
  }
  for (const t of THINKING) assert.ok(!t.wrong.includes(t.answer) && t.why);
  for (const sc of SCALES) assert.equal(new Set(sc).size, 3);
  const types = new Set();
  for (let level = 0; level <= 4; level++) for (let s = 0; s < 60; s++) types.add(`${level}:${genSituations(level, createRng(s)).type}`);
  assert.ok(types.has('3:order') && types.has('1:choice'));
});

test('kroppens signaler: behov först (nivå 0), känslor i kroppen senare, försiktiga formuleringar', () => {
  for (let s = 0; s < 60; s++) {
    const q = genSignals(0, createRng(s));
    const pool = BODY_SIGNALS.filter((b) => b.lv === 0).map((b) => b.means);
    assert.ok(q.options.every((o) => pool.includes(o.label)), 'nivå 0: hunger, törst, trötthet, toalett');
  }
  for (const b of BODY_SIGNALS.filter((x) => x.lv >= 2 && /arg|nervös|ledsen/.test(x.means))) assert.match(b.means, /kanske/, 'känslor tolkas försiktigt');
  assert.ok(BODY_SIGNALS.some((b) => /intryck/.test(b.means)), 'sensorisk överbelastning finns med');
});

test('kroppskarta och verktygslåda: giltiga data', () => {
  assert.equal(new Set(BODY_PARTS.map((b) => b.id)).size, BODY_PARTS.length);
  for (const b of BODY_PARTS) assert.ok(b.x >= 0 && b.x <= 100 && b.y >= 0 && b.y <= 100);
  for (const id of MAP_FEELINGS) assert.ok(emotionById(id));
  assert.equal(new Set(CALM_TOOLS.map((t) => t.id)).size, CALM_TOOLS.length);
  for (const t of CALM_TOOLS) assert.ok(/^[a-z-]{2,20}$/.test(t.id) && t.text.length > 10);
  for (const want of ['breathe', 'help', 'quiet', 'move']) assert.ok(CALM_TOOLS.some((t) => t.id === want), want);
});
