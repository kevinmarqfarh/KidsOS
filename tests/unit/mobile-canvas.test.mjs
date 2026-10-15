import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseHTML } from 'linkedom';
import { newProfile } from '../../src/core/model.js';

const dom = parseHTML('<html><body><main></main></body></html>');
for (const key of ['window', 'document', 'Node', 'Element', 'DocumentFragment', 'Event', 'HTMLElement']) globalThis[key] = dom[key] || dom.window[key];
let frames = [];
globalThis.requestAnimationFrame = fn => (frames.push(fn), frames.length);
globalThis.cancelAnimationFrame = () => {};
globalThis.getComputedStyle = () => ({getPropertyValue: () => '#fff'});
window.innerHeight = 800;
window.devicePixelRatio = 1;
window.matchMedia = () => ({matches: true});
let copies = 0;
const contexts = new WeakMap();
const prototype = Object.getPrototypeOf(document.createElement('canvas'));
prototype.getContext = function () {
  if (!contexts.has(this)) {
    const state = { ink: false, clearRect(){this.ink=false;}, fillRect(){}, drawImage(source){this.ink=contexts.get(source)?.ink || false; copies++;}, stroke(){this.ink=true;} };
    contexts.set(this, new Proxy(state, {get:(target,key) => key in target ? target[key] : () => {}}));
  }
  return contexts.get(this);
};
prototype.toDataURL = () => 'data:image/png;base64,';
const { drawView } = await import('../../src/ui/views/misc.js');
const { robotView, turtleView } = await import('../../src/ui/views/code.js');
const { traceView } = await import('../../src/ui/views/trace.js');
function fixture() {
  const el = document.querySelector('main');el.replaceChildren();frames=[];
  let width = 420;
  Object.defineProperty(el, 'clientWidth', {get:()=>width, configurable:true});
  const profile = newProfile({name:'Test',age:7});profile.settings.showAllModules=true;
  const kos = {profile, autoSay(){}, say(){}, read(){}, save(){}, stopSpeaking(){}, level:()=>1, sfx(){}};
  return {el,kos,app:{id:'test'},level:1,resize(w){width=w;window.dispatchEvent(new Event('resize'));},flush(){const pending=frames;frames=[];pending.forEach(fn=>fn());}};
}
test('drawing preserves pixels synchronously across rapid rotations and stops resizing after cleanup', () => {
  const f=fixture();const destroy=drawView(f.el,f);f.flush();
  const canvas=f.el.querySelector('canvas');canvas.getContext('2d').ink=true;copies=0;
  f.resize(300);assert.equal(canvas.style.width,'292px');assert.equal(canvas.getContext('2d').ink,true);
  f.resize(420);assert.equal(canvas.getContext('2d').ink,true);assert.equal(copies,4);
  destroy();f.resize(300);assert.equal(canvas.style.width,'412px');
});
test('robot resizes the current board without replacing the child’s program', () => {
  const f=fixture();const destroy=robotView(f.el,f);
  f.el.querySelector('.level-btn').click();f.el.querySelector('.pal-btn').click();
  const editor=f.el.querySelector('.prog-editor');const before=f.el.querySelector('.robot-board').style.getPropertyValue('--cell');
  f.resize(280);assert.equal(f.el.querySelector('.prog-editor'),editor);assert.equal(editor.querySelectorAll('.prog-block').length,1);
  assert.notEqual(f.el.querySelector('.robot-board').style.getPropertyValue('--cell'),before);destroy();
});
test('turtle rotation retains program, canvas pixels and the chosen challenge', () => {
  const f=fixture();const destroy=turtleView(f.el,f);f.flush();
  f.el.querySelector('.pal-btn').click();const editor=f.el.querySelector('.prog-editor');const title=f.el.querySelector('.teach').textContent;
  const canvas=f.el.querySelector('canvas');canvas.getContext('2d').ink=true;
  f.resize(280);assert.equal(canvas.style.width,'256px');assert.equal(canvas.getContext('2d').ink,true);
  assert.equal(f.el.querySelector('.prog-editor'),editor);assert.equal(editor.querySelectorAll('.prog-block').length,1);assert.equal(f.el.querySelector('.teach').textContent,title);destroy();
});
test('tracing fits a narrow pane and keeps normalized ink while rotating', () => {
  const f=fixture();f.resize(210);const destroy=traceView(f.el,{...f,module:{set:'upper'}});f.flush();
  const canvas=f.el.querySelector('canvas');assert.ok(Number.parseInt(canvas.style.width)<=202);
  const point=(type,x,y)=>{const event=new Event(type,{cancelable:true});Object.assign(event,{pointerId:1,pointerType:'pen',button:0,clientX:x,clientY:y});canvas.dispatchEvent(event);};
  point('pointerdown',30,30);point('pointermove',40,40);
  assert.equal(canvas.getContext('2d').ink,true);
  f.resize(320);assert.ok(Number.parseInt(canvas.style.width)<=312);assert.equal(canvas.getContext('2d').ink,true);
  destroy();
});
