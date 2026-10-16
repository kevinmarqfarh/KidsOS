import {test} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {chromium} from 'playwright-core';
const executablePath=['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome','/usr/bin/chromium'].find(existsSync);
async function setup(layout='tablet') {
 const browser=await chromium.launch({executablePath});
 const page=await browser.newPage({viewport:{width:1024,height:768}});
 await page.route(/fonts\.(googleapis|gstatic)\.com/,route=>route.abort());
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto(new URL('../../dist/index.html',import.meta.url).href);
 await page.evaluate(layout=>{const k=window.kidsos.kos,p=k.createProfile({name:'Test',ageBand:'4-5'});p.settings.layout=layout;p.settings.readAloud='off';k.login(p.id);window.kidsos.goHome();},layout);
 return {browser,page,errors};
}

test('course fullscreen preserves question and overlays in tablet and desktop',async()=>{
 for(const layout of ['tablet','desktop']) {
  const {browser,page,errors}=await setup(layout);
  try {
   if(layout==='desktop')await page.evaluate(()=>window.kidsos.openApp('play','studio'));
   await page.evaluate(()=>window.kidsos.openApp('ai','meaning'));
   const prompt=await page.locator('.q-prompt-text').innerText();
   await page.getByRole('button',{name:'Helskärm',exact:true}).click();
   await page.waitForFunction(()=>document.fullscreenElement?.classList.contains('os'));
   assert.equal(await page.locator('.app-fullscreen').evaluate(el=>Math.abs(el.getBoundingClientRect().width-innerWidth)<2),true);
   assert.equal(await page.locator('.q-prompt-text').innerText(),prompt);
   assert.equal(await page.evaluate(()=>document.fullscreenElement.contains(window.kidsos.kos.overlayRoot)),true);
   if(layout==='desktop'){await page.keyboard.press('f');assert.equal(await page.evaluate(()=>document.fullscreenElement?.classList.contains('os')),true);}
   await page.keyboard.press('Escape');
   await page.waitForFunction(()=>document.fullscreenElement===null);
   assert.equal(await page.locator('.app-fullscreen').count(),0);
   assert.equal(await page.locator('.q-prompt-text').innerText(),prompt);
   assert.deepEqual(errors,[]);
  } finally {await browser.close();}
 }
});

test('fallback fullscreen preserves ink and exits when leaving course',async()=>{
 const {browser,page,errors}=await setup();
 try {
  await page.evaluate(()=>{document.querySelector('.os').requestFullscreen=undefined;window.kidsos.openApp('write','digits');});
  await page.waitForSelector('.trace-ink');
  const canvas=page.locator('.trace-ink');let box=await canvas.boundingBox();
  await page.mouse.move(box.x+box.width*.3,box.y+box.height*.3);await page.mouse.down();await page.mouse.move(box.x+box.width*.6,box.y+box.height*.6,{steps:12});await page.mouse.up();
  const ink=()=>page.locator('.trace-ink').evaluate(canvas=>canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data.some((value,index)=>index%4===3&&value>0));
  assert.equal(await ink(),true);
  await page.getByRole('button',{name:'Helskärm',exact:true}).click();
  assert.equal(await page.locator('.app-fullscreen').count(),1);
  assert.equal(await ink(),true);
  await page.getByRole('button',{name:'Hem',exact:true}).click();
  assert.equal(await page.locator('.app-fullscreen').count(),0);
  assert.equal(await page.locator('.os.app-focus-mode').count(),0);
  assert.deepEqual(errors,[]);
 } finally {await browser.close();}
});

test('closing replay round cancels delayed answer speech',async()=>{
 const {browser,page,errors}=await setup();
 try {
  await page.evaluate(()=>window.kidsos.openApp('ai','meaning'));
  // Rundan kan bli kortare än fem frågor när nivåns frågebank är liten (inga dubbletter).
  for(let i=0;i<8&&!(await page.locator('.summary').count());i++) {
   await page.evaluate(()=>{const q=window.kidsos.q;[...document.querySelectorAll('.choice')].find(button=>button.dataset.id===q.answer).click();});
   await page.locator('.btn-next').click();
  }
  await page.waitForSelector('.summary');
  await page.evaluate(()=>{window.__speechCalls=[];window.__speechPending=[];window.kidsos.kos.shouldAutoSpeak=()=>true;window.kidsos.kos.autoSay=text=>{window.__speechCalls.push(text);return new Promise(resolve=>window.__speechPending.push(resolve));};});
  await page.getByRole('button',{name:'🔁 En gång till',exact:true}).click();
  await page.waitForSelector('.q-prompt');
  await page.evaluate(()=>window.kidsos.goHome());
  const before=await page.evaluate(()=>window.__speechCalls.length);
  await page.evaluate(async()=>{for(const resolve of window.__speechPending.splice(0))resolve();await Promise.resolve();});
  assert.equal(await page.evaluate(()=>window.__speechCalls.length),before);
  assert.deepEqual(errors,[]);
 } finally {await browser.close();}
});
