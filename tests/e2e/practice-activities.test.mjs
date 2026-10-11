import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { chromium } from 'playwright-core';
import { APPS } from '../../src/apps/registry.js';
import { GLYPHS } from '../../src/apps/letters.js';
const executablePath = [process.env.CHROME_PATH, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/chromium'].filter(Boolean).find(existsSync);

async function setup(viewport) {
  const browser=await chromium.launch({executablePath});
  const page=await browser.newPage({viewport});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(new URL('../../dist/index.html',import.meta.url).href);
  await page.evaluate(()=>{const k=window.kidsos.kos,p=k.createProfile({name:'Skrivvän',age:10});p.settings.layout='tablet';p.settings.readAloud='off';p.settings.reducedMotion=true;p.settings.quietFeedback=true;k.login(p.id);window.kidsos.openApp('write','letter-practice');});
  return {browser,page,errors};
}

test('stylus: repeated upper/lower writing, palm filtering, progressive guides and persistence', {timeout:90000}, async()=>{
  const {browser,page,errors}=await setup({width:768,height:1024});
  try {
    const count=ch=>page.evaluate(ch=>window.kidsos.kos.profile.counters[`writing:${ch}`]||0,ch);
    await page.getByRole('button',{name:'✒️ Endast penna på skrivytan',exact:true}).click();
    const canvas=page.locator('.trace-ink');
    // A touch or mouse alone must not produce accepted ink in pen-only mode.
    const rect=await canvas.boundingBox();
    await page.mouse.move(rect.x+rect.width*.5,rect.y+rect.height*.12);await page.mouse.down();
    await page.mouse.move(rect.x+rect.width*.18,rect.y+rect.height*.82);await page.mouse.up();
    await page.getByRole('button',{name:'Klar ✓',exact:true}).click();
    assert.equal(await count('A'),0);
    const cdp=await page.context().newCDPSession(page);
    async function write(ch) {
      await canvas.scrollIntoViewIfNeeded();
      const r=await canvas.boundingBox();
      for (const stroke of GLYPHS[ch]) {
        const [x,y]=stroke[0];
        await cdp.send('Input.dispatchMouseEvent',{type:'mousePressed',x:r.x+x*r.width,y:r.y+y*r.height,button:'left',clickCount:1,pointerType:'pen'});
        await canvas.evaluate(el=>el.dispatchEvent(new PointerEvent('pointerdown',{pointerId:77,pointerType:'touch',clientX:10,clientY:10,bubbles:true})));
        for (const [px,py] of stroke.slice(1)) await cdp.send('Input.dispatchMouseEvent',{type:'mouseMoved',x:r.x+px*r.width,y:r.y+py*r.height,buttons:1,pointerType:'pen'});
        const [ex,ey]=stroke.at(-1);
        await cdp.send('Input.dispatchMouseEvent',{type:'mouseReleased',x:r.x+ex*r.width,y:r.y+ey*r.height,button:'left',clickCount:1,pointerType:'pen'});
      }
      await page.waitForTimeout(360);
      await page.getByRole('button',{name:'Klar ✓',exact:true}).click();
      await page.waitForTimeout(360);
    }
    for(let i=1;i<=8;i++) {
      await write('A');
      if(await count('A')!==i) await page.screenshot({path:'/private/tmp/kids-writing-failure.png'});
      assert.equal(await count('A'),i,await page.locator('.trace-msg').innerText());
      assert.equal(await page.locator('.trace-chip').filter({hasText:/^A$/}).getAttribute('class').then(s=>s.includes('done')),i>=8);
      if(i<8) {
        await page.getByRole('button',{name:'Skriv igen ➜',exact:true}).click();
        if(i===3) assert.ok(await page.locator('.tmpl.faded').count()>0);
        if(i===6) assert.equal(await page.locator('.trace-guide .tmpl').count(),0);
      }
    }
    await page.getByRole('button',{name:'Nästa bokstav ➜',exact:true}).click();
    assert.match(await page.locator('.writing-progress').innerText(),/Liten bokstav a: 0 av 8/);
    await write('a');assert.equal(await count('a'),1);
    await page.reload();
    await page.evaluate(()=>window.kidsos.openApp('write','letter-practice'));
    await page.waitForFunction(()=>document.querySelector('.writing-progress')?.textContent.includes('Liten bokstav a'));
    assert.match(await page.locator('.writing-progress').innerText(),/Liten bokstav a: 1 av 8/);
    assert.equal(await page.getByRole('button',{name:'✒️ Endast penna på skrivytan',exact:true}).getAttribute('aria-pressed'),'true');
    await page.getByRole('combobox',{name:'Skrivningar per bokstavsform'}).selectOption('10');
    await page.locator('.trace-chip').filter({hasText:/^A$/}).click();
    assert.match(await page.locator('.writing-progress').innerText(),/8 av 10/);
    assert.equal(await page.locator('.trace-chip').filter({hasText:/^A$/}).getAttribute('class').then(s=>s.includes('done')),false);
    await page.screenshot({path:'/private/tmp/kids-writing-practice.png'});
    assert.deepEqual(errors,[]);
  } finally {await browser.close();}
});

test('all new activities render and accept answers at every age level on mobile; drawing briefs preserve ink', {timeout:90000}, async()=>{
  const {browser,page,errors}=await setup({width:390,height:844});
  try {
    for(const app of APPS) {
      const mod=app.modules.find(m=>['shopping-practice','spelling-practice','loop-machine','activity-practice'].includes(m.id));
      if(!mod)continue;
      for(const level of [0,2,4]) {
        await page.evaluate(({id,mod,level})=>{window.kidsos.kos.profile.levelOverride[id]=level;window.kidsos.openApp(id,mod);},{id:app.id,mod:mod.id,level});
        const q=await page.evaluate(()=>{const q=window.kidsos.q;return {type:q.type,answer:q.answer,word:q.word};});
        if(q.type==='choice') await page.evaluate(answer=>[...document.querySelectorAll('.choice')].find(b=>b.dataset.id===answer).click(),q.answer);
        else if(q.type==='numpad') {for(const ch of String(q.answer)){await page.locator('.np-key').filter({hasText:new RegExp(`^${ch}$`)}).click();await page.waitForTimeout(140);}await page.locator('.np-key.ok').click();}
        else if(q.type==='build') {
          assert.equal(await page.locator('.spelling-word').isVisible(),false);
          await page.getByRole('button',{name:'Visa ordet som stöd',exact:true}).click();
          assert.equal(await page.locator('.spelling-word').innerText(),q.word);
          for(const ch of q.word)await page.locator('.build-tile:not(.used)').filter({hasText:new RegExp(`^${ch}$`)}).first().click();
        }
        assert.ok(await page.locator('.q-stage.done').count(),`${app.id}/${level}`);
        assert.equal(await page.locator('.win-content').evaluate(el=>el.scrollWidth-el.clientWidth<=2),true,`${app.id}/${level} overflow`);
      }
    }
    await page.evaluate(()=>window.kidsos.openApp('draw','drawing-missions'));
    assert.equal(await page.locator('.draw-prompt').isVisible(),false);
    const canvas=page.locator('.draw-canvas');const r=await canvas.boundingBox();
    await page.mouse.move(r.x+30,r.y+30);await page.mouse.down();await page.mouse.move(r.x+90,r.y+60,{steps:10});await page.mouse.up();
    const ink=()=>canvas.evaluate(el=>el.toDataURL());const before=await ink();
    const title=await page.locator('.drawing-brief h2').innerText();
    await page.getByRole('button',{name:'Byt uppdrag',exact:true}).click();
    assert.notEqual(await page.locator('.drawing-brief h2').innerText(),title);
    assert.equal(await ink(),before);
    await page.screenshot({path:'/private/tmp/kids-drawing-mission-mobile.png'});
    assert.deepEqual(errors,[]);
  } finally {await browser.close();}
});
