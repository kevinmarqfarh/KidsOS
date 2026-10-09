import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SCIENCE_SCENARIOS, genScienceScenario, scienceApp } from '../../src/apps/science.js';

test('science enrichment covers every age band with distinct evidence questions', () => {
  assert.equal(Object.values(SCIENCE_SCENARIOS).flat().length, 30);
  const prompts = Object.values(SCIENCE_SCENARIOS).flat().map(row => row[1]);
  assert.equal(new Set(prompts).size, prompts.length);
  for (const [topic, rows] of Object.entries(SCIENCE_SCENARIOS)) {
    assert.ok(scienceApp.modules.some(module => module.id === topic && typeof module.gen === 'function'));
    for (let level = 0; level <= 4; level++) {
      const band = level === 3 ? 2 : level;
      const expected = rows.filter(([min]) => (min === 3 ? 2 : min) === band);
      assert.ok(expected.length >= 2, `${topic}: age band ${band} needs breadth`);
      const seen = new Set();
      for (let index = 0; index < expected.length; index++) {
        const rng = { pick: options => options[index % options.length], shuffle: options => [...options].reverse() };
        const exercise = genScienceScenario(topic, level, rng);
        seen.add(exercise.prompt);
        assert.ok(expected.some(row => row[1] === exercise.prompt), 'content must match the current age band');
        assert.equal(exercise.type, 'choice');
        assert.equal(exercise.options.filter(option => option.id === exercise.answer).length, 1);
        assert.equal(new Set(exercise.options.map(option => option.id)).size, exercise.options.length);
        assert.ok(exercise.hint && exercise.explain);
      }
      assert.equal(seen.size, expected.length);
    }
  }
});
