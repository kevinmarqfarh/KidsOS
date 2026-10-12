import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { chromium } from 'playwright-core';
import { PHOTO_LEARNING } from '../../src/apps/photo-learning.js';
const executablePath=[process.env.CHROME_PATH,'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome','/usr/bin/chromium'].filter(Boolean).find(existsSync);

test('all photo cards and lesson photographs load offline without overflow, with independent progress', {timeout:90000},async()=>{
 const browser=await chromium.launch({executablePath});
 try {
  const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.context().setOffline(true);
  await page.goto(new URL('../../dist/index.html',import.meta.url).href);
  await page.evaluate(()=>{const k=window.kidsos.kos,p=k.createProfile({name:'Fotospanare',age:10});p.settings.layout='tablet';p.settings.readAloud='off';p.settings.reducedMotion=true;p.settings.quietFeedback=true;p.settings.showAllModules=true;k.login(p.id);});
  for(const [id,items] of Object.entries(PHOTO_LEARNING)) {
   await page.evaluate(id=>window.kidsos.openApp(id,'photo-explore'),id);
   assert.equal(await page.locator('.photo-explore-card').count(),items.length);
   for(const item of items) {
    await page.locator(`.photo-explore-card[data-photo="${item.key}"]`).click();
    const image=page.locator('.photo-explore-stage .learning-photo-card > img');
    await image.first().scrollIntoViewIfNeeded();
    await image.evaluateAll(els=>Promise.all(els.map(el=>el.decode())));
    assert.ok(await image.evaluateAll(els=>els.every(el=>el.complete&&el.naturalWidth>0)),`${id}/${item.key}`);
    assert.ok(await image.evaluateAll(els=>els.every(el=>el.alt)));
    assert.equal(await page.locator('.win-content').evaluate(el=>el.scrollWidth-el.clientWidth<=2),true,`${id} overflow`);
   }
   await page.getByRole('button',{name:'Upptäck mer',exact:true}).click();
   assert.equal(await page.locator('.photo-insight').isVisible(),true);
   await page.getByRole('button',{name:'Jag har undersökt bilden ✓',exact:true}).click();
   assert.match(await page.locator('.photo-explore-progress').innerText(),/1 av 9/);
   await page.evaluate(id=>window.kidsos.openApp(id,'discover-course'),id);
   await page.waitForSelector('.course-stage .learning-photo-card');
   await page.locator('.course-stage .learning-photo-card > img').evaluate(el=>el.decode());
   await page.locator('.course-next').click();
   await page.locator('.course-stage .learning-photo-card > img').evaluate(el=>el.decode());
  }
  await page.evaluate(()=>window.kidsos.openApp('biology','photo-explore'));
  await page.locator('.photo-explore-card[data-photo="course-oak"]').click();
  await page.locator('.photo-explore-stage').evaluate(el=>el.scrollIntoView({block:'start'}));
  await page.screenshot({path:'/private/tmp/kids-photo-mobile.png'});
  await page.reload();await page.evaluate(()=>window.kidsos.openApp('biology','photo-explore'));
  assert.match(await page.locator('.photo-explore-progress').innerText(),/1 av 9/);
  await page.evaluate(()=>{const k=window.kidsos.kos,p=k.createProfile({name:'Andra barnet',age:10});p.settings.layout='tablet';p.settings.readAloud='off';p.settings.reducedMotion=true;k.login(p.id);window.kidsos.openApp('biology','photo-explore');});
  assert.match(await page.locator('.photo-explore-progress').innerText(),/0 av 9/);
  await page.setViewportSize({width:1280,height:900});
  await page.evaluate(()=>window.kidsos.openApp('science','photo-explore'));
  await page.locator('.photo-explore-card[data-photo="course-shadow"]').click();
  await page.locator('.photo-explore-stage .learning-photo-card > img').evaluate(el=>el.decode());
  await page.screenshot({path:'/private/tmp/kids-photo-wide.png'});
  for(const id of ['ai','code']) {
   await page.evaluate(id=>window.kidsos.openApp(id,'course'),id);
   await page.waitForSelector('.course-stage .learning-photo-card');
   await page.locator('.course-stage .learning-photo-card > img').evaluate(el=>el.decode());
  }
  assert.deepEqual(errors,[]);
 } finally {await browser.close();}
});
