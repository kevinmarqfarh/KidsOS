import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newProfile, normalizeState } from '../../src/core/model.js';

test('äldre profiler ärver enhetens ljudval och behåller framsteg', () => {
  const state = normalizeState({ settings: { sound: false }, profiles: [{ id: 'old', name: 'A', age: 7, stars: 12, settings: { readAloud: 'off' } }], activeId: 'old' });
  const p = state.profiles[0];
  assert.equal(p.settings.sound, null);
  assert.equal(state.settings.sound, false);
  assert.equal(p.settings.readAloud, 'off');
  assert.equal(p.stars, 12);
  assert.equal(p.settings.roundLength, 0);
  assert.equal(p.settings.celebrationEffects, true);
});

test('stödval följer rätt profil vid lagring och återställning', () => {
  const a = newProfile({ name: 'A', age: 5 });
  const b = newProfile({ name: 'B', age: 9 });
  Object.assign(a.settings, { sound: false, readAloud: 'manual', reducedMotion: true, celebrationEffects: false, roundLength: 3, steadyRounds: true, previewRounds: true, quietFeedback: true });
  const restored = normalizeState(JSON.parse(JSON.stringify({ profiles: [a, b], activeId: a.id })));
  assert.deepEqual(restored.profiles[0].settings, a.settings);
  assert.deepEqual(restored.profiles[1].settings, b.settings);
});

test('ogiltiga stödval i en säkerhetskopia får säkra standardvärden', () => {
  const state = normalizeState({ profiles: [{ settings: { sound: 'false', roundLength: -3, reducedMotion: 'false', celebrationEffects: null, steadyRounds: 'yes' } }] });
  const settings = state.profiles[0].settings;
  assert.equal(settings.sound, null);
  assert.equal(settings.roundLength, 0);
  assert.equal(settings.reducedMotion, false);
  assert.equal(settings.celebrationEffects, true);
  assert.equal(settings.steadyRounds, false);
});
