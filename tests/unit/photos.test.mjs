import { test } from 'node:test';
import assert from 'node:assert/strict';
import { IMAGES, CREDITS } from '../../src/generated/images.js';
import { photoFigure, photoImage, photoCredits } from '../../src/ui/photos.js';
import { SPECIES, genSpecies } from '../../src/apps/biology.js';

test('fotografier bäddas in med källor och licenser', () => {
  assert.ok(Object.keys(IMAGES).length >= 4);
  for (const [key, data] of Object.entries(IMAGES)) {
    assert.match(data, /^data:image\/webp;base64,/, key);
    const c = CREDITS[key];
    assert.ok(c && c.a && c.l && c.u, `kredit saknas för ${key}`);
  }
});

test('artfrågan visar fotografiet utan att skriva ut svaret', () => {
  const target = SPECIES.find((s) => s.id === 'ekorre');
  const rng = { chance: () => false, pick: () => target, sample: (xs) => xs.slice(0, 2), shuffle: (xs) => xs };
  const question = genSpecies(0, rng);
  assert.equal(question.answer, 'ekorre');
  if (IMAGES.ekorre) assert.match(question.visual, /data:image\/webp;base64,/);
  assert.ok(!question.visual.includes('alt="ekorre"'));
  assert.equal(photoFigure('saknas'), '');
});

test('kompatibilitetslagret photos.js använder img.js och gamla id:n', () => {
  if (IMAGES.sun) assert.match(photoFigure('solen', 'Solen'), /<figure class="photo-figure"><img class="photo learning-photo"/);
  if (IMAGES.mercury) assert.match(photoImage('merkurius', 'Merkurius', true), /learning-photo compact/);
  assert.equal(photoImage('finns-inte'), '');
  assert.match(photoCredits(), /<details class="photo-credits">/);
});
