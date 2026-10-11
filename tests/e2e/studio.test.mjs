// Studio interaction regression: ownership must survive moving/returning/reopening.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {chromium} from 'playwright-core';
const executablePath=[process.env.CHROME_PATH,'/opt/pw-browsers/chromium-1194/chrome-linux/chrome','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome','/usr/bin/chromium','/usr/bin/google-chrome'].filter(Boolean).find(existsSync);
test('Studio: place, keyboard move, flip, return, persistent characters and real learning navigation',async()=>{
 const browser=await chromium.launch({executablePath});
 try{
  const page=await browser.newPage({viewport:{width:1200,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(new URL('../../dist/index.html',import.meta.url).href);
  await page.evaluate(()=>{const k=window.kidsos.kos,p=k.createProfile({name:'Testvän',age:9});p.settings.layout='tablet';p.settings.readAloud='off';k.login(p.id);window.kidsos.openApp('play','studio');});
  await page.waitForSelector('.studio-stage');
  const snapshot=()=>page.evaluate(()=>JSON.parse(window.render_game_to_text()));
  assert.equal((await snapshot()).room.props.length,3);
  assert.equal(await page.getByRole('button',{name:'Inred',exact:true}).getAttribute('aria-pressed'),'true');
  assert.equal(await page.getByRole('button',{name:'Upptäck',exact:true}).getAttribute('aria-pressed'),'false');
  await page.getByRole('button',{name:'Placera Solstrålesäng',exact:true}).click();
  await page.locator('.studio-stage').click({position:{x:240,y:230}});
  assert.equal((await snapshot()).room.props.length,4);
  await page.getByRole('button',{name:/Solstrålesäng, flytta/}).focus();
  const x=(await snapshot()).room.props.at(-1).x;
  await page.keyboard.press('ArrowRight');
  assert.equal((await snapshot()).room.props.at(-1).x,x+2);
  await page.getByRole('button',{name:'Vänd',exact:true}).click();
  assert.equal((await snapshot()).room.props.at(-1).flipped,true);
  await page.getByRole('button',{name:'Tillbaka till mina saker',exact:true}).click();
  assert.equal((await snapshot()).inventory['sun-bed'],1);
  await page.getByRole('button',{name:'Figurer',exact:true}).click();
  for(let i=0;i<6;i++)await page.getByRole('button',{name:'+ Ny figur',exact:true}).click();
  assert.equal(await page.locator('.studio-character-list button').count(),8);
  await page.evaluate(()=>window.kidsos.openApp('math','count'));
  await page.evaluate(()=>window.kidsos.openApp('play','studio'));
  await page.getByRole('button',{name:'Figurer',exact:true}).click();
  assert.equal(await page.locator('.studio-character-list button').count(),8);
  await page.getByRole('button',{name:'Upptäck',exact:true}).click();
  assert.equal(await page.locator('.studio-shop-card').count(),18);
  await page.locator('.studio-shop-card').first().getByRole('button',{name:'Öva och lås upp'}).click();
  await page.waitForSelector('.q-prompt');
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});

test('Studio: touch drag, fullscreen, character editing and profile separation',{timeout:45000},async()=>{
 const browser=await chromium.launch({executablePath});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(new URL('../../dist/index.html',import.meta.url).href);
  await page.evaluate(()=>{const k=window.kidsos.kos,p=k.createProfile({name:'Första',ageBand:'6-7'});p.settings.layout='tablet';p.settings.readAloud='off';k.login(p.id);window.kidsos.openApp('play','studio');});
  const snapshot=()=>page.evaluate(()=>JSON.parse(window.render_game_to_text()));
  await page.waitForSelector('.studio-stage');
  const sofa=page.getByRole('button',{name:/Molnsoffa, flytta/}),start=(await snapshot()).room.props.find(item=>item.itemId==='cloud-sofa').x;
  const box=await sofa.boundingBox();
  await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width/2+28,box.y+box.height/2+10,{steps:4});await page.mouse.up();
  assert.ok((await snapshot()).room.props.find(item=>item.itemId==='cloud-sofa').x>start);
  await page.getByRole('button',{name:'Stor spelvy',exact:true}).click();
  await page.waitForFunction(()=>document.fullscreenElement!==null);
  await page.keyboard.press('Escape');await page.waitForFunction(()=>document.fullscreenElement===null);
  await page.getByRole('button',{name:'Figurer',exact:true}).click();
  await page.getByLabel('Namn',{exact:true}).fill('Mira');await page.getByLabel('Namn',{exact:true}).blur();
  await page.locator('.studio-customizer select').filter({has:page.locator('option[value=surprised]')}).selectOption('surprised');
  assert.ok(await page.locator('.studio-character-preview svg').count());
  assert.equal(await page.locator('.studio-shell').evaluate(el=>el.scrollWidth<=el.clientWidth+2),true);
  await page.evaluate(()=>{const k=window.kidsos.kos,p=k.createProfile({name:'Andra',ageBand:'4-5'});p.settings.layout='tablet';p.settings.readAloud='off';k.login(p.id);window.kidsos.openApp('play','studio');});
  assert.equal((await snapshot()).room.props.find(item=>item.itemId==='cloud-sofa').x,25);
  await page.getByRole('button',{name:'Figurer',exact:true}).click();
  assert.ok(!(await page.locator('.studio-character-list').innerText()).includes('Mira'));
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});

test('Studio: desktop shortcut order and live learning balance',async()=>{
 const browser=await chromium.launch({executablePath});
 try{
  const page=await browser.newPage({viewport:{width:1200,height:900}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(new URL('../../dist/index.html',import.meta.url).href);
  await page.evaluate(()=>{const k=window.kidsos.kos,p=k.createProfile({name:'Skrivbord',ageBand:'8-9'});p.settings.layout='desktop';p.settings.readAloud='off';k.login(p.id);window.kidsos.goHome();});
  await page.waitForSelector('.tb-pinned');
  assert.deepEqual(await page.locator('.tb-pinned button').allTextContents(),['🏡Lekstaden','🏆Troféer']);
  await page.locator('.tb-pinned button[data-shortcut=play]').click();
  await page.waitForSelector('.studio-stage');
  await page.evaluate(()=>window.kidsos.kos.answer('math',true));
  assert.match(await page.locator('.studio-wallet').innerText(),/1 spelmynt/);
  assert.match(await page.locator('.tb-chip[title=Mynt]').innerText(),/1/);
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});
