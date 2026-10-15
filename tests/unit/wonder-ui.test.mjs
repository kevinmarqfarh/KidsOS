import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { parseHTML } from 'linkedom';
import { newProfile } from '../../src/core/model.js';
import { WONDERS, wonderAnswer, wonderApp } from '../../src/apps/wonder.js';

const dom = parseHTML('<!doctype html><html><body><main></main></body></html>');
for (const name of ['window', 'document', 'Node', 'Element', 'DocumentFragment', 'Event', 'CustomEvent', 'HTMLElement']) globalThis[name] = dom[name] || dom.window[name];
window.matchMedia = () => ({ matches: false });
const { wonderView } = await import('../../src/ui/views/misc.js');
const el = document.querySelector('main');
let spoken, rewards, kos;
beforeEach(() => {
  el.replaceChildren(); spoken = []; rewards = [];
  kos = { profile: newProfile({name:'Test',age:5}), autoSay(){}, stopSpeaking(){}, say(text){ spoken.push(text); }, reward(value){rewards.push(value);} };
});

test('Undra: läsknappen använder samma åldersanpassade svar som kortet', () => {
  const w = WONDERS.find(w => w.simple && w.simple !== w.a && (w.minLevel ?? 0) === 0);
  wonderView(el, {kos, app:wonderApp, level:0, opts:{focus:w.id}});
  el.querySelector('.btn-xl').click();
  const answer = `${wonderAnswer(w,0)} Fundera vidare: ${w.think}`;
  assert.equal(el.querySelector('.wonder-answer p').textContent, wonderAnswer(w,0));
  el.querySelector('[aria-label="läs upp frågan"]').click();
  assert.deepEqual(spoken, [answer, answer]);
  assert.equal(rewards.length,1);
});

test('Undra: Visste du-kort är en riktig knapp som öppnar sin fråga', () => {
  wonderView(el, {kos, app:wonderApp, level:0});
  const fact = el.querySelector('.wonder-fact');
  assert.equal(fact.tagName,'BUTTON');
  assert.equal(fact.type,'button');
  assert.match(fact.getAttribute('aria-label'), /Öppna frågan/);
  const factText = fact.querySelector('.wf-text').textContent;
  const w = WONDERS.find(w => w.tf?.[0] === factText);
  assert.ok((w.minLevel ?? 0) <= 0);
  fact.click();
  assert.ok(el.querySelector('.wonder-card-big h2').textContent.startsWith(w.q));
});

test('Undra: att vända samma kort igen ger aldrig dubbla belöningar', () => {
  wonderView(el, {kos, app:wonderApp, level:0, opts:{focus:WONDERS[0].id}});
  const card = el.querySelector('.fx-flip');
  card.click(); card.click(); card.click();
  assert.equal(rewards.length,1);
});
