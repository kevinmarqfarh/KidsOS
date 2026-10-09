import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PHOTOS } from '../../src/assets/photos/catalog.js';
import { photoFigure } from '../../src/ui/photos.js';
import { SPECIES, genSpecies } from '../../src/apps/biology.js';

test('fotografier bäddas in med källor och licenser', () => {
  assert.ok(Object.keys(PHOTOS).length >= 4);
  for (const photo of Object.values(PHOTOS)) {
    assert.match(photo.data, /^data:image\/(jpeg|png|webp);base64,/);
    assert.ok(photo.artist && photo.license && photo.source);
  }
});

test('artfrågan visar fotografiet utan att skriva ut svaret', () => {
  const target = SPECIES.find(s => s.id === 'ekorre');
  const rng = { chance: () => false, pick: () => target, sample: xs => xs.slice(0, 2), shuffle: xs => xs };
  const question = genSpecies(0, rng);
  assert.equal(question.answer, 'ekorre');
  assert.match(question.visual, /data:image\/jpeg;base64,/);
  assert.match(question.visual, /alt="Fotografi av en art"/);
  assert.ok(!question.visual.includes('alt="ekorre"'));
  assert.equal(photoFigure('saknas'), '');
});
