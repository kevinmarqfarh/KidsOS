import { test } from 'node:test';
import assert from 'node:assert/strict';
import { QUESTION_PHOTOS, photosForQuestion } from '../../src/apps/question-photos.js';
import { ACTIVITY_BANKS } from '../../src/apps/practice-activities.js';
import { PHOTO_LEARNING, PHOTO_DETAILS } from '../../src/apps/photo-learning.js';
import { IMAGES, CREDITS } from '../../src/generated/images.js';

test('photo support points to real questions, images and credits without inserting the answer into captions',()=>{
 let count=0;
 for(const [app,questions] of Object.entries(QUESTION_PHOTOS)) for(const [prompt,photos] of Object.entries(questions)) {
  const row=ACTIVITY_BANKS[app].find(row=>row[1]===prompt);
  assert.ok(row,`${app}/${prompt}`);count++;
  for(const item of photos) {
   assert.ok(IMAGES[item.key]&&CREDITS[item.key]);
   assert.ok(item.title);
   assert.notEqual(item.title,row[2]);
   assert.deepEqual(photosForQuestion(app,'activity-practice',prompt),photos);
   assert.deepEqual(photosForQuestion(app,'unrelated-module',prompt),[]);
  }
 }
 assert.ok(count>=30);
 assert.deepEqual(photosForQuestion('science','activity-practice','En ny fråga utan vald bild'),[]);
});

test('comparison photos are different motifs and all resolve to captions and licenses',()=>{
 const pairs=Object.values(PHOTO_LEARNING).flat().filter(item=>item.compareKey);
 assert.ok(pairs.length>=12);
 for(const item of pairs) {
  assert.notEqual(item.key,item.compareKey);
  assert.ok(PHOTO_DETAILS[item.compareKey]&&IMAGES[item.compareKey]&&CREDITS[item.compareKey]);
 }
 for(const key of ['course-roots','course-condensation','course-fallen-leaves']) assert.ok(IMAGES[key]&&CREDITS[key]);
});
