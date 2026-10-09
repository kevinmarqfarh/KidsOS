import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AGE_BANDS, profileAgeLabel, roundLength, startLevelForProfile } from '../../src/core/age.js';
import { newProfile, normalizeProfile, currentLevel, applyAgeBand, appStat } from '../../src/core/model.js';

test('intervall styr startnivå och rundlängd för nya profiler', () => {
  assert.deepEqual(AGE_BANDS.map(item => item.id), ['4-5', '6-7', '8-9', '10-12']);
  for (const band of AGE_BANDS) {
    const profile = newProfile({ name: 'Test', ageBand: band.id });
    assert.equal(profileAgeLabel(profile), band.label);
    assert.equal(currentLevel(profile, 'ai'), band.level);
    assert.equal(startLevelForProfile(profile), band.level);
    assert.equal(roundLength(profile.age), band.level === 0 ? 5 : band.level === 1 ? 6 : 8);
  }
  // Profiler som redan har framsteg ändrar inte nivå när appen uppdateras.
  assert.equal(currentLevel(newProfile({ age: 9 }), 'code'), 3);
});

test('byte av intervall anpassar befintliga övningar utan att ta bort framsteg', () => {
  const profile = newProfile({ age: 9 });
  const stat = appStat(profile, 'math');
  stat.rounds = 4; stat.runUp = 3; stat.modules.count = { rounds: 2, best: 3 };
  profile.stars = 50; profile.sets.species = { ekorre: true }; profile.levelOverride.math = 4;
  assert.equal(applyAgeBand(profile, '4-5'), true);
  assert.equal(currentLevel(profile, 'math'), 0);
  assert.equal(currentLevel(profile, 'ai'), 0);
  assert.equal(profile.stars, 50);
  assert.equal(profile.sets.species.ekorre, true);
  assert.equal(profile.stats.math.modules.count.best, 3);
  assert.equal(profile.stats.math.rounds, 4);
  assert.equal(stat.runUp, 0);
  assert.equal(applyAgeBand(profile, 'saknas'), false);
});

test('sparade intervall normaliseras konsekvent och äldre profiler fungerar', () => {
  const p = normalizeProfile({ name: 'Test', age: 5, ageBand: '10-12' });
  assert.equal(p.age, 10);
  assert.equal(currentLevel(p, 'math'), 4);
  const old = normalizeProfile({ age: 9, ageBand: 'fel' });
  assert.equal(old.ageBand, undefined);
  assert.equal(currentLevel(old, 'math'), 3);
});
