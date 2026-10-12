import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { chromium } from 'playwright-core';
import { APPS } from '../../src/apps/registry.js';
import { GLYPHS } from '../../src/apps/letters.js';
import { tmpdir } from 'node:os';
const tmpShot = (name) => `${tmpdir()}/${name}`;
const executablePath = [process.env.CHROME_PATH, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/chromium'].filter(Boolean).find(existsSync);

async function setup(viewport) {
  const browser=await chromium.launch({executablePath});
  const page=await browser.newPage({viewport});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(new URL('../../dist/index.html',import.meta.url).href);
  await page.evaluate(()=>{const k=window.kidsos.kos,p=k.createProfile({name:'Skrivvän',age:10});p.settings.layout='tablet';p.settings.readAloud='off';p.settings.reducedMotion=true;p.settings.quietFeedback=true;k.login(p.id);window.kidsos.openApp('write','letter-practice');});
  return {browser,page,errors};
}

test('stylus: serier om 5 eller 10 för stor och liten bokstav, handflatefilter, avtagande mall och sparat läge', {timeout:120000}, async()=>{
  const {browser,page,errors}=await setup({width:768,height:1024});
  try {
    const series=ch=>page.evaluate(ch=>window.kidsos.kos.profile.counters[`writeSeries:pairs:${ch}`]||0,ch);
    const doneDots=()=>page.locator('.rep-dot.done').count();
    await page.getByRole('button',{name:'5 gånger',exact:true}).click();
    await page.getByRole('button',{name:'👀 Spåra',exact:true}).click();
    await page.getByRole('button',{name:'✒️ Endast penna',exact:true}).click();
    const canvas=page.locator('.trace-ink');
    // Ett finger eller en mus får inte rita när bara pennan gäller (handflatan vilar på skärmen).
    const rect=await canvas.boundingBox();
    await page.mouse.move(rect.x+rect.width*.5,rect.y+rect.height*.12);await page.mouse.down();
    await page.mouse.move(rect.x+rect.width*.18,rect.y+rect.height*.82);await page.mouse.up();
    await page.getByRole('button',{name:'Klar ✓',exact:true}).click();
    assert.equal(await doneDots(),0);
    const cdp=await page.context().newCDPSession(page);
    async function write(ch) {
      await canvas.scrollIntoViewIfNeeded();
      const r=await canvas.boundingBox();
      for (const stroke of GLYPHS[ch]) {
        const [x,y]=stroke[0];
        await cdp.send('Input.dispatchMouseEvent',{type:'mousePressed',x:r.x+x*r.width,y:r.y+y*r.height,button:'left',clickCount:1,pointerType:'pen'});
        // en samtidig handflata (touch) ska ignoreras
        await canvas.evaluate(el=>el.dispatchEvent(new PointerEvent('pointerdown',{pointerId:77,pointerType:'touch',clientX:10,clientY:10,bubbles:true})));
        for (const [px,py] of stroke.slice(1)) await cdp.send('Input.dispatchMouseEvent',{type:'mouseMoved',x:r.x+px*r.width,y:r.y+py*r.height,buttons:1,pointerType:'pen'});
        const [ex,ey]=stroke.at(-1);
        await cdp.send('Input.dispatchMouseEvent',{type:'mouseReleased',x:r.x+ex*r.width,y:r.y+ey*r.height,button:'left',clickCount:1,pointerType:'pen'});
      }
      await page.waitForTimeout(200);
      await page.getByRole('button',{name:'Klar ✓',exact:true}).click();
      await page.waitForTimeout(1150); // kort paus mellan två gånger i en serie
    }
    for(let i=1;i<=5;i++) {
      await write('A');
      assert.equal(await doneDots(),i,await page.locator('.trace-msg').innerText());
      // stödet minskar: tydlig mall → prickad → svag
      if(i===2) assert.ok(await page.locator('.trace-guide .tmpl.dashed').count()>0,'prickad mall efter två gånger');
      if(i===4) assert.ok(await page.locator('.trace-guide .tmpl.faint').count()>0,'svag mall mot slutet');
    }
    assert.equal(await series('A'),1);
    assert.match(await page.locator('.trace-msg').innerText(),/Hela serien klar/);
    await page.getByRole('button',{name:'Nästa bokstav ➜',exact:true}).click();
    assert.equal(await page.locator('.trace-chip.on').innerText(),'a');
    await page.reload();
    await page.evaluate(()=>window.kidsos.openApp('write','letter-practice'));
    await page.waitForSelector('.rep-bar');
    assert.equal(await page.getByRole('button',{name:'✒️ Endast penna',exact:true}).getAttribute('aria-pressed'),'true');
    assert.equal(await page.getByRole('button',{name:'5 gånger',exact:true}).getAttribute('aria-pressed'),'true');
    await page.getByRole('button',{name:'10 gånger',exact:true}).click();
    assert.equal(await page.locator('.rep-dot').count(),10);
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
    await page.screenshot({path:tmpShot('kids-drawing-mission-mobile.png')});
    assert.deepEqual(errors,[]);
  } finally {await browser.close();}
});
