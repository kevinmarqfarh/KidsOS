import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
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

test('alla inbäddade fotografier matchar bildfilerna och licensförteckningen', () => {
  const credits = JSON.parse(readFileSync(new URL('../../src/assets/photos/credits.json', import.meta.url), 'utf8'));
  assert.deepEqual(Object.keys(PHOTOS).sort(), Object.keys(credits).sort());
  for (const [id, credit] of Object.entries(credits)) {
    const actual = readFileSync(new URL(`../../${credit.path}`, import.meta.url));
    const embedded = Buffer.from(PHOTOS[id].data.split(',')[1], 'base64');
    assert.deepEqual(embedded, actual, `${id}: inbäddningen är inaktuell`);
    for (const field of ['artist', 'license', 'licenseUrl', 'source']) assert.equal(PHOTOS[id][field], credit[field]);
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
