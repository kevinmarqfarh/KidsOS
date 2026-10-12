import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { chromium } from 'playwright-core';
const executablePath=[process.env.CHROME_PATH,'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome','/usr/bin/chromium'].filter(Boolean).find(existsSync);

test('quiz photographs remain supplementary, answers work offline, reference changes preserve drawings', {timeout:60000},async()=>{
 const browser=await chromium.launch({executablePath});
 try {
  const page=await browser.newPage({viewport:{width:390,height:844}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.context().setOffline(true);
  await page.goto(new URL('../../dist/index.html',import.meta.url).href);
  await page.evaluate(()=>{const k=window.kidsos.kos,p=k.createProfile({name:'Bildstöd',age:7});p.settings.layout='tablet';p.settings.readAloud='off';p.settings.reducedMotion=true;p.settings.quietFeedback=true;k.login(p.id);});
  for(const app of ['science','biology','space','world','ai','wonder']) {
   let found=false;
   for(let i=0;i<20;i++) {
    await page.evaluate(app=>{window.kidsos.kos.profile.levelOverride[app]=0;window.kidsos.openApp(app,'activity-practice');},app);
    if(await page.locator('.question-photo-support').count()){found=true;break;}
   }
   assert.equal(found,true,app);
   await page.locator('.question-photo-support img').evaluateAll(els=>Promise.all(els.map(el=>el.decode())));
   const q=await page.evaluate(()=>({prompt:window.kidsos.q.prompt,answer:window.kidsos.q.answer}));
   assert.equal(await page.locator('.q-prompt-text').innerText(),q.prompt);
   assert.equal(await page.locator('.win-content').evaluate(el=>el.scrollWidth-el.clientWidth<=2),true);
   await page.evaluate(answer=>[...document.querySelectorAll('.choice')].find(b=>b.dataset.id===answer).click(),q.answer);
   assert.equal(await page.locator('.q-stage.done').count(),1);
  }
  await page.screenshot({path:'/private/tmp/kids-question-photo-mobile.png'});
  await page.evaluate(()=>{window.kidsos.kos.profile.levelOverride.draw=4;window.kidsos.openApp('draw','drawing-missions');});
  await page.getByRole('button',{name:'Byt uppdrag',exact:true}).click();
  await page.locator('.drawing-reference > summary').click();
  await page.locator('.drawing-reference img').evaluate(el=>el.decode());
  const canvas=page.locator('.draw-canvas');
  await canvas.scrollIntoViewIfNeeded();const r=await canvas.boundingBox();
  const blank=await canvas.evaluate(el=>el.toDataURL());
  await page.mouse.move(r.x+20,r.y+20);await page.mouse.down();await page.mouse.move(r.x+70,r.y+50,{steps:10});await page.mouse.up();
  const ink=await canvas.evaluate(el=>el.toDataURL());
  assert.notEqual(ink,blank);
  await page.waitForTimeout(360);
  await page.getByRole('button',{name:'Byt uppdrag',exact:true}).click();
  assert.equal(await canvas.evaluate(el=>el.toDataURL()),ink);
  assert.deepEqual(errors,[]);
 } finally {await browser.close();}
});
