import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { APPS } from '../../src/apps/registry.js';
import { DISCOVERY_LESSONS } from '../../src/apps/discovery-lessons.js';
import { PHOTO_LEARNING, PHOTO_CURRICULUM, PHOTO_DETAILS, LESSON_PHOTOS, NATIVE_LESSON_PHOTOS } from '../../src/apps/photo-learning.js';
import { CURRICULUM } from '../../src/core/curriculum.js';
import { IMAGES, CREDITS } from '../../src/generated/images.js';

test('12 photo collections have 108 complete observations, licensed images and valid practice routes',()=>{
  assert.equal(Object.keys(PHOTO_LEARNING).length,12);
  assert.equal(Object.values(PHOTO_LEARNING).flat().length,108);
  for(const [id,items] of Object.entries(PHOTO_LEARNING)) {
    const app=APPS.find(app=>app.id===id);
    assert.ok(app.modules.some(m=>m.id==='photo-explore'&&m.view==='photoExplore'));
    assert.equal(new Set(items.map(i=>i.key)).size,9);
    for(const item of items) {
      assert.ok(IMAGES[item.key],`${id}/${item.key}`);
      assert.ok(item.title&&item.question.endsWith('?')&&item.detail.length>30);
      assert.ok(app.modules.some(m=>m.id===item.practice),`${id}/${item.practice}`);
      assert.match(CREDITS[item.key].u,/^https:\/\/commons.wikimedia.org\/wiki\/File:/);
      assert.match(CREDITS[item.key].l,/CC|Public domain/i);
      if(item.compareKey) assert.ok(IMAGES[item.compareKey]&&PHOTO_DETAILS[item.compareKey]);
    }
    for(const lgr of PHOTO_CURRICULUM[id])assert.ok(CURRICULUM[lgr]);
  }
});

test('all discovery lessons have photographs for both steps and native course photos resolve',()=>{
  for(const lessons of Object.values(DISCOVERY_LESSONS))for(const lesson of lessons) {
    assert.equal(LESSON_PHOTOS[lesson.id].length,lesson.steps.length);
    for(const key of LESSON_PHOTOS[lesson.id]) assert.ok(IMAGES[key]&&PHOTO_DETAILS[key],`${lesson.id}/${key}`);
  }
  for(const mapping of Object.values(NATIVE_LESSON_PHOTOS))for(const key of Object.values(mapping))assert.ok(IMAGES[key]&&PHOTO_DETAILS[key],key);
});

test('six new scene files have full credit metadata and illustrated oak and ISS are replaced',()=>{
  const catalog=JSON.parse(readFileSync(new URL('../../assets/image-catalog.json',import.meta.url)));
  const credits=JSON.parse(readFileSync(new URL('../../assets/credits.json',import.meta.url)));
  for(const key of ['course-autumn','course-winter','course-spring','course-sprouts','course-oak','course-shadow']) {
    assert.ok(IMAGES[key]);assert.ok(credits[key].author&&credits[key].source&&credits[key].license);
    assert.ok(catalog['course-scenes'][key].startsWith('File:'));
    if(credits[key].license!=='Public domain')assert.ok(CREDITS[key].lu);
  }
  assert.equal(credits.ek.file,credits['course-oak'].file);
  assert.equal(catalog.species.ek,catalog['course-scenes']['course-oak']);
  assert.equal(credits.iss.file,'File:International Space Station after undocking of STS-132.jpg');
});
