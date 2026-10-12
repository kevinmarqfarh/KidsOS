import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { parseHTML } from 'linkedom';
import { newProfile, emptyState, currentLevel, appStat } from '../../src/core/model.js';
import { activityWait, setActivityPaused } from '../../src/core/activity.js';

const dom = parseHTML('<!doctype html><html><body><main id="fixture"></main><aside id="overlays"></aside></body></html>');
for (const name of ['window', 'document', 'Node', 'Element', 'DocumentFragment', 'Event', 'CustomEvent', 'HTMLElement']) globalThis[name] = dom[name] || dom.window[name];
let frames = [];
globalThis.requestAnimationFrame = callback => { frames.push(callback); return frames.length; };
globalThis.cancelAnimationFrame = () => {};
window.matchMedia = () => ({matches:false});
window.kidsos = {};
const { h, onTap } = await import('../../src/ui/dom.js');
const { kos } = await import('../../src/ui/kos.js');
const { runQuiz } = await import('../../src/ui/quiz.js');
const { mountApp } = await import('../../src/ui/apphost.js');
const { mountShell } = await import('../../src/ui/shell.js');
const { waterView } = await import('../../src/ui/views/science.js');
let spoken = [];
window.speechSynthesis = { getVoices:()=>[], cancel(){}, speak(utterance){spoken.push(utterance.text);utterance.onend?.();} };
globalThis.SpeechSynthesisUtterance = class { constructor(text){this.text=text;} };
const el = () => document.querySelector('#fixture');
const overlays = () => document.querySelector('#overlays');
const key = (node, value) => { const event = new Event('keydown', {bubbles:true,cancelable:true});event.key=value;node.dispatchEvent(event); };
const clickNamed = (root, name) => { const button=[...root.querySelectorAll('button')].find(node=>node.textContent===name);assert.ok(button,`knappen ${name} finns`);button.click(); };
const delay = ms => new Promise(resolve=>setTimeout(resolve,ms));
const app = {id:'test',name:'Test',color:'#3d8bfd'};
const choiceModule = {id:'choice',name:'Välj',gen:()=>({type:'choice',prompt:'Vilken sak hör hit?',options:[{id:'a',label:'A'},{id:'b',label:'B'}],answer:'a',hint:'Titta på den första saken.',explain:'A hör hit.'})};

beforeEach(() => {
  setActivityPaused(false);
  el().replaceChildren();overlays().replaceChildren();frames=[];spoken=[];
  const p=newProfile({name:'Test',age:5});p.settings.readAloud='off';p.settings.sound=false;p.settings.quietFeedback=true;p.settings.celebrationEffects=false;p.settings.roundLength=3;
  kos.state={...emptyState(),profiles:[p],activeId:p.id};kos.overlayRoot=overlays();kos.applySettings();
});

test('tal Av spärrar även direkta läsanrop och force; manuellt läge tillåter läsknappen', async()=>{
  await kos.say('Fel', {force:true});await kos.read('Fråga',{force:true});await kos.autoSay('Automatiskt');
  assert.deepEqual(spoken,[]);
  kos.profile.settings.readAloud='manual';kos.applySettings();
  await kos.say('Fel');await kos.read('Fråga');await kos.autoSay('Automatiskt');
  assert.deepEqual(spoken,['Fråga']);
  kos.paused=true;await kos.read('Under paus');assert.deepEqual(spoken,['Fråga']);kos.paused=false;
});

test('plan, hjälp före felsvar, paus och avslut bevarar redan intjänade belöningar',()=>{
  const p=kos.profile;p.settings.previewRounds=true;
  let exited=0;const cleanup=runQuiz(el(),{app,module:choiceModule,onExit:()=>exited++});
  assert.ok(el().querySelector('.quiz-plan'));assert.equal(el().querySelector('.q-prompt'),null);
  clickNamed(el(),'Starta rundan');clickNamed(el(),'Hjälp');
  assert.equal(el().querySelector('.q-help-panel').hidden,false);
  assert.equal(appStat(p,'test').wrong,0);assert.equal(p.stars,0);
  el().querySelector('.choice[data-id="a"]').click();assert.equal(p.stars,1);
  clickNamed(el(),'Paus');assert.equal(kos.paused,true);assert.ok(overlays().querySelector('dialog[open]'));
  clickNamed(overlays(),'Avsluta rundan');assert.equal(exited,1);assert.equal(p.stars,1);assert.equal(kos.paused,false);
  assert.equal(appStat(p,'test').rounds,0);cleanup();
});

test('sortering kan slutföras med Enter och mellanslag utan pointer-händelser',()=>{
  const mod={id:'sort',gen:()=>({type:'sort',prompt:'Sortera sakerna.',items:[{id:'one',say:'Första saken',html:'<span>1</span>',bin:'a'},{id:'two',say:'Andra saken',html:'<span>2</span>',bin:'b'}],bins:[{id:'a',label:'Korg A',html:''},{id:'b',label:'Korg B',html:''}],hint:'Välj en sak och sedan en korg.',explain:'Sakerna är sorterade.'})};
  const cleanup=runQuiz(el(),{app,module:mod});
  const one=el().querySelector('[data-id="one"]');assert.equal(one.getAttribute('aria-label'),'Första saken');
  key(one,'Enter');assert.equal(one.getAttribute('aria-pressed'),'true');
  key(el().querySelector('[data-bin="a"]'),' ');
  assert.ok(one.classList.contains('placed'));assert.equal(one.getAttribute('aria-disabled'),'true');
  key(el().querySelector('[data-id="two"]'),' ');key(el().querySelector('[data-bin="b"]'),'Enter');
  assert.ok(el().querySelector('.btn-next'));assert.equal(kos.profile.stars,1);cleanup();
});

test('gemensam paus håller en pågående väntan och släpper den först efter fortsatt aktivitet', async()=>{
  let completed=false;const work=activityWait(50).then(()=>completed=true);
  setActivityPaused(true);await delay(70);assert.equal(completed,false);
  setActivityPaused(false);await work;assert.equal(completed,true);
});

test('nivån förblir densamma inom vald runda trots adaptiv uppflyttning',()=>{
  const p=kos.profile;p.settings.steadyRounds=true;appStat(p,'test').runUp=4;
  const cleanup=runQuiz(el(),{app,module:choiceModule});
  const level=window.kidsos.q.level;el().querySelector('[data-id="a"]').click();
  assert.equal(currentLevel(p,'test'),level+1);el().querySelector('.btn-next').click();
  assert.equal(window.kidsos.q.level,level);cleanup();
});

test('utforskande vyer har hjälp och paus och städar pausen vid navigation',()=>{
  const host={content:el(),setHead(){},close(){}};
  const instance=mountApp(host,'ai','course');
  assert.ok(el().querySelector('.activity-support'));
  clickNamed(el().querySelector('.activity-support'),'Paus');assert.equal(kos.paused,true);
  instance.navigate('meaning');assert.equal(kos.paused,false);assert.equal(overlays().querySelector('dialog'),null);
  assert.ok(el().querySelector('.quiz'));instance.destroy();
});

test('vattenanimationen är statisk med mindre rörelse och står still under paus',()=>{
  const arcs=[];
  const context=new Proxy({}, {get(target,name){if(name==='arc')return(...args)=>arcs.push(args);return target[name]||(()=>{});},set(target,name,value){target[name]=value;return true;}});
  const create=document.createElement.bind(document);
  document.createElement=name=>{const node=create(name);if(name==='canvas')node.getContext=()=>context;return node;};
  try {
    kos.profile.settings.reducedMotion=true;kos.applySettings();
    const cleanup=waterView(el(),{kos,app});const first=JSON.stringify(arcs);arcs.length=0;
    frames.shift()();assert.equal(JSON.stringify(arcs),first);arcs.length=0;
    kos.paused=true;frames.shift()();assert.equal(arcs.length,0);kos.paused=false;cleanup();
  } finally {document.createElement=create;}
});

test('skärmtidsvarning och paus bevarar uppgiften, och föräldern kan öppna spärren',()=>{
  kos.profile.settings.layout='tablet';
  const cleanup=mountShell(el());
  window.kidsos.openApp=undefined;
  const activity=h('div.saved-activity','Min pågående uppgift');el().querySelector('.screen').append(activity);
  kos.emit('limit-warning',{minutes:1});assert.ok(el().querySelector('.time-warning'));
  kos.emit('limit');assert.equal(kos.paused,true);assert.equal(activity.isConnected,true);
  const limit=document.querySelector('.limit-screen');assert.ok(limit?.hasAttribute('open'));
  clickNamed(limit,'🔒 Vuxen: +15 min');assert.ok(limit.querySelector('.gate'));
  clickNamed(limit.querySelector('.sheet'),'Avbryt');assert.equal(kos.paused,true);
  // Fixture ends here; the parent gate is tested structurally, not as browser focus behaviour.
  clickNamed(limit,'👋 Byt användare');assert.equal(kos.paused,false);cleanup?.();
});

test('avbrytning av tal avslutar väntan även om talmotorn aldrig skickar onend',async()=>{
  kos.profile.settings.readAloud='on';kos.applySettings();
  const original=window.speechSynthesis.speak;
  window.speechSynthesis.speak=()=>{};
  try {
    let completed=false;const speaking=kos.read('En lång fråga').then(()=>completed=true);
    assert.equal(completed,false);kos.stopSpeaking();await speaking;assert.equal(completed,true);
  } finally {window.speechSynthesis.speak=original;}
});

test('drag och efterföljande click placerar objektet en gång och väljer inte nästa objekt',()=>{
  const mod={id:'drag',gen:()=>({type:'sort',prompt:'Sortera sakerna.',items:[{id:'one',say:'Första saken',html:'<span>1</span>',bin:'a'},{id:'two',say:'Andra saken',html:'<span>2</span>',bin:'b'}],bins:[{id:'a',label:'Korg A',html:''},{id:'b',label:'Korg B',html:''}],hint:'Välj en sak och en korg.',explain:'Klart.'})};
  const cleanup=runQuiz(el(),{app,module:mod});
  const item=el().querySelector('[data-id="one"]');
  item.getBoundingClientRect=()=>({left:0,top:0,width:40,height:40});
  el().querySelector('[data-bin="a"]').getBoundingClientRect=()=>({left:100,top:100,right:150,bottom:150});
  el().querySelector('[data-bin="b"]').getBoundingClientRect=()=>({left:200,top:100,right:250,bottom:150});
  const pointer=(type,x,y)=>{const event=new Event(type,{bubbles:true});Object.assign(event,{clientX:x,clientY:y,pointerId:1});item.dispatchEvent(event);};
  pointer('pointerdown',10,10);pointer('pointermove',110,110);pointer('pointerup',110,110);item.click();
  assert.equal(el().querySelector('[data-bin="a"] .bin-items').children.length,1);
  assert.equal(el().querySelector('.sort-item.sel'),null);assert.equal(el().querySelector('.drag-ghost'),null);
  assert.equal(kos.profile.stars,0);cleanup();
});

test('studions helskärmsbehållare omfattar pausknappar och överlägg och återställs vid avslut',async()=>{
  const os=h('div.os'),win=h('section.window'),content=h('div.win-content'),layer=h('div.overlays');
  win.append(content);os.append(win,layer);el().append(os);kos.overlayRoot=layer;
  os.requestFullscreen=async()=>{document.fullscreenElement=os;document.dispatchEvent(new Event('fullscreenchange'));};
  document.exitFullscreen=async()=>{document.fullscreenElement=null;document.dispatchEvent(new Event('fullscreenchange'));};
  const instance=mountApp({content,setHead(){},close(){}},'play','studio');
  clickNamed(content,'⛶ Stor spelvy');await Promise.resolve();
  assert.equal(document.fullscreenElement,os);assert.ok(win.classList.contains('app-fullscreen'));
  assert.equal(os.contains(content.querySelector('.activity-support')),true);
  clickNamed(content.querySelector('.activity-support'),'Paus');assert.equal(os.contains(layer.querySelector('dialog')),true);
  key(layer.querySelector('dialog button'),'Escape');
  assert.equal(kos.paused,false);assert.ok(win.classList.contains('app-fullscreen'));
  instance.destroy();
  await Promise.resolve();assert.equal(document.fullscreenElement,null);assert.equal(win.classList.contains('app-fullscreen'),false);
});

test('miniräknaren kan fortsätta med ett negativt resultat och avvisar ogiltiga uttryck',async()=>{
  const {calculate}=await import('../../src/ui/system.js');
  assert.equal(calculate('-3+2'),-1);
  assert.equal(calculate('2×-3'),-6);
  assert.equal(calculate('−3,5+1,5'),-2);
  assert.equal(calculate('2+3×4'),14);
  assert.throws(()=>calculate('1.2.3'));
  assert.throws(()=>calculate('2abc+3'));
  assert.throws(()=>calculate('5÷0'));
});

test('anteckningsbyte under autosparning belönar rätt anteckning',async()=>{
  const {saveJSON,loadJSON}=await import('../../src/core/storage.js');
  const p=kos.profile;const storageKey=`notes.${p.id}`;
  saveJSON(storageKey,[{id:'a',title:'A',text:'',at:new Date().toISOString(),counted:0},{id:'b',title:'B',text:'',at:new Date().toISOString(),counted:0}]);
  const instance=mountApp({content:el(),setHead(){}},'notes');
  const input=el().querySelector('textarea');input.value='ett två tre fyra fem sex sju åtta nio tio';input.dispatchEvent(new Event('input'));
  el().querySelectorAll('.note-item')[1].click();
  await delay(750);
  const saved=loadJSON(storageKey,[]);assert.equal(saved[0].counted,10);assert.equal(saved[1].counted,0);
  assert.equal(p.stars,1);instance.destroy();
});

test('föräldraspärren tar fysisk kodinmatning och godkänner bara en gång',async()=>{
  const {parentGate}=await import('../../src/ui/shell.js');
  kos.state.settings.pin='1234';let approved=0;parentGate(()=>approved++);
  const panel=overlays().querySelector('.sheet-panel');assert.equal(panel.getAttribute('aria-label'),'🔒 För vuxna');
  for(const digit of '1234')key(panel,digit);
  assert.equal(approved,1);key(panel,'Enter');assert.equal(approved,1);
});

test('alla apphubbar och moduler kan öppnas och stängas i DOM-modellen',async()=>{
  const {APPS}=await import('../../src/apps/registry.js');
  const create=document.createElement.bind(document);
  const context=new Proxy({}, {get(target,name){if(name==='measureText')return()=>({width:20});if(name==='getImageData')return()=>({data:new Uint8ClampedArray(4)});return target[name]||(()=>{});},set(target,name,value){target[name]=value;return true;}});
  document.createElement=name=>{const node=create(name);if(name==='canvas'){node.getContext=()=>context;node.toDataURL=()=> 'data:image/png;base64,';}return node;};
  const oldImage=globalThis.Image;globalThis.Image=class {set src(value){this.onload?.();}};
  const oldObserver=globalThis.ResizeObserver;globalThis.ResizeObserver=class {observe(){}disconnect(){}};
  const oldScroll=Element.prototype.scrollIntoView;Element.prototype.scrollIntoView=()=>{};
  const oldRect=Element.prototype.getBoundingClientRect;Element.prototype.getBoundingClientRect=()=>({left:0,top:0,width:800,height:600});
  try {
    for(const app of APPS){
      let instance=mountApp({content:el(),setHead(){},close(){}},app.id);instance.destroy();el().replaceChildren();
      for(const mod of app.modules){
        try {instance=mountApp({content:el(),setHead(){},close(){}},app.id,mod.id);assert.ok(el().childElementCount,`${app.id}/${mod.id}`);instance.destroy();}
        catch(error){throw new Error(`${app.id}/${mod.id}: ${error.message}`,{cause:error});}
        finally{el().replaceChildren();frames=[];}
      }
    }
  } finally {document.createElement=create;globalThis.Image=oldImage;globalThis.ResizeObserver=oldObserver;Element.prototype.getBoundingClientRect=oldRect;Element.prototype.scrollIntoView=oldScroll;}
});

test('titelradens dubbelklick maximerar en gång och kan återställa fönstret',async()=>{
  const {createDesktop}=await import('../../src/ui/desktop.js');
  const oldObserver=globalThis.ResizeObserver;globalThis.ResizeObserver=class {observe(){}disconnect(){}};
  kos.profile.settings.reducedMotion=true;kos.applySettings();
  const os=h('div.os');el().append(os);const root=h('div');os.append(root);
  const desktop=createDesktop(root,{osEl:os,confirmSwitch(){},showLock(){}});
  try {
    desktop.show();const desk=root.querySelector('.desk');Object.defineProperty(desk,'clientWidth',{value:1200});Object.defineProperty(desk,'clientHeight',{value:800});
    desktop.open('calc');const win=root.querySelector('.dwin');const bar=win.querySelector('.dwin-bar');
    const double=()=>{for(let i=0;i<2;i++){const down=new Event('pointerdown',{bubbles:true});down.clientX=20;down.clientY=20;bar.dispatchEvent(down);bar.dispatchEvent(new Event('pointerup',{bubbles:true}));}bar.dispatchEvent(new Event('dblclick',{bubbles:true}));};
    double();assert.equal(win.classList.contains('max'),true);assert.equal(win.querySelector('.dwin-btn.max').getAttribute('aria-label'),'Återställ fönster');
    double();assert.equal(win.classList.contains('max'),false);
  } finally {desktop.destroy();globalThis.ResizeObserver=oldObserver;}
});

test('karta och kropp har namngivna tangentbordsknappar',()=>{
  for(const [appId,modId,selector] of [['world','continents','.cont'],['biology','bodyexplore','[data-hit]']]){
    const instance=mountApp({content:el(),setHead(){},close(){}},appId,modId);
    const node=el().querySelector(selector);
    assert.ok(node,`${appId}/${modId}`);
    assert.equal(node.getAttribute('role'),'button');assert.equal(node.getAttribute('tabindex'),'0');
    assert.ok(node.getAttribute('aria-label'));key(node,'Enter');
    instance.destroy();el().replaceChildren();
  }
});

test('aria-disabled stoppar både klick och tangentbord',()=>{
  let calls=0;const button=onTap(h('div',{role:'button',tabindex:'0','aria-disabled':'true'}),()=>calls++);
  el().append(button);button.click();key(button,'Enter');assert.equal(calls,0);
});

test('skuggexperiment och månfas kan styras med vanliga reglage',()=>{
  for(const [appId,modId] of [['science','shadow'],['space','moon']]){
    const instance=mountApp({content:el(),setHead(){},close(){}},appId,modId);
    const input=el().querySelector('input[type="range"]');assert.ok(input,`${appId}/${modId}`);
    assert.ok(input.getAttribute('aria-label'));input.value=appId==='space'?'180':'90';input.dispatchEvent(new Event('input'));
    assert.ok(input.getAttribute('aria-valuetext'));instance.destroy();el().replaceChildren();
  }
});

test('föräldrakod tillåter inklistrad kod och visar ett läsbart fel',async()=>{
  const {parentGate}=await import('../../src/ui/shell.js');kos.state.settings.pin='1234';let done=0;parentGate(()=>done++);
  const panel=overlays().querySelector('.sheet-panel');const input=panel.querySelector('input');
  input.value='9999';input.dispatchEvent(new Event('input'));key(input,'Enter');
  assert.equal(done,0);assert.equal(input.getAttribute('aria-invalid'),'true');assert.match(panel.querySelector('[role="alert"]').textContent,/stämmer inte/);
  input.value='1234';input.dispatchEvent(new Event('input'));key(input,'Enter');assert.equal(done,1);
});

test('modal bakgrund isoleras och återställs utan att tidigare inert ändras',async()=>{
  const {isolateModal}=await import('../../src/ui/dom.js');
  const root=h('section');const background=h('button', 'Bakgrund');const wasInert=h('aside',{inert:true});const layer=h('div');const modal=h('div');
  root.append(background,wasInert,layer);layer.append(modal);el().append(root);
  const restore=isolateModal(modal);assert.equal(background.hasAttribute('inert'),true);assert.equal(wasInert.hasAttribute('inert'),true);
  restore();assert.equal(background.hasAttribute('inert'),false);assert.equal(wasInert.hasAttribute('inert'),true);
});

test('surfplattefönster isolerar hemskärmen och återställer den vid Hem',async()=>{
  const {openApp,goHome}=await import('../../src/ui/shell.js');kos.profile.settings.layout='tablet';
  const cleanup=mountShell(el());
  try {
    openApp('math');const screen=el().querySelector('.screen');const win=el().querySelector('.window');
    assert.equal(screen.hasAttribute('inert'),true);assert.equal(screen.getAttribute('aria-hidden'),'true');assert.equal(win.hasAttribute('inert'),false);
    goHome();assert.equal(screen.hasAttribute('inert'),false);assert.equal(screen.hasAttribute('aria-hidden'),false);assert.equal(win.hasAttribute('inert'),true);
  } finally {cleanup();}
});
