import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BLOCKS, MISSIONS, WORLD_SIZE, MAX_HEIGHT, MAX_BLOCKS, emptyWorld, normalizeWorld, placeBlock, removeBlock, rotateBlock, moveAvatar, purchaseBlock, missionProgress, cellBlocks } from '../../src/apps/build-world.js';
const place = (w, x, y, type) => { const r = placeBlock(w, x, y, type); assert.ok(r.ok, r.message); return r.state; };

test('Byggvärlden är gratis från start med tydliga priser och alla byggmaterial', () => {
  const w = emptyWorld();
  assert.equal(WORLD_SIZE, 10); assert.equal(MAX_HEIGHT, 4);
  assert.equal(new Set(BLOCKS.map((b) => b.id)).size, BLOCKS.length);
  assert.ok(Object.values(w.inventory).reduce((a, b) => a + b, 0) >= 120);
  for (const b of BLOCKS) { assert.ok(b.price >= 5 && b.price <= 40); assert.ok(w.inventory[b.id] > 0); }
  assert.equal(MISSIONS.length, 6);
  w.inventory.stone = 0; assert.equal(emptyWorld().inventory.stone, 40);
});
test('placering, rotation och borttagning är rena och återför byggdelen', () => {
  const initial = emptyWorld(), saved = JSON.stringify(initial);
  let w = place(initial, 1, 1, 'wood'); w = place(w, 1, 1, 'glass');
  assert.equal(JSON.stringify(initial), saved); assert.equal(cellBlocks(w, 1, 1).length, 2);
  const rotated = rotateBlock(w, 1, 1).state;
  assert.equal(rotated.blocks[1].rotation, 1); assert.equal(w.blocks[1].rotation, 0);
  const removed = removeBlock(rotated, 1, 1).state;
  assert.equal(removed.inventory.glass, initial.inventory.glass); assert.equal(removed.blocks.length, 1);
  assert.equal(removeBlock(removed, 9, 9).reason, 'empty');
  for (let i = 0; i < 4; i++) w = rotateBlock(w, 1, 1).state;
  assert.equal(w.blocks[1].rotation, 0);
});
test('gränser, saknat lager, maxhöjd, stöd och spelarens ruta skyddas', () => {
  let w = emptyWorld();
  for (const n of [-1, 10, 0.5, NaN, Infinity, '1']) assert.equal(placeBlock(w, n, 0, 'stone').ok, false);
  assert.equal(placeBlock(w, 1, 1, '__proto__').ok, false);
  assert.equal(placeBlock(w, 4, 8, 'stone').reason, 'avatar');
  assert.ok(placeBlock(w, 4, 8, 'path').ok);
  for (let i = 0; i < MAX_HEIGHT; i++) w = place(w, 1, 1, 'stone');
  assert.equal(placeBlock(w, 1, 1, 'stone').reason, 'height');
  w = place(w, 2, 2, 'flower'); assert.equal(placeBlock(w, 2, 2, 'wood').reason, 'support');
  assert.equal(placeBlock({ ...w, inventory: { ...w.inventory, wood: 0 } }, 3, 3, 'wood').reason, 'stock');
  assert.equal(placeBlock({ ...w, blocks: Array.from({ length: MAX_BLOCKS }, () => ({ x: 0, y: 0, z: 0, type: 'stone' })) }, 3, 3, 'stone').reason, 'limit');
});
test('figuren går på stigar och blommor men inte genom fasta delar eller utanför världen', () => {
  let w = emptyWorld(); w = place(w, 4, 7, 'path'); w = place(w, 4, 6, 'flower'); w = place(w, 5, 6, 'wood');
  w = moveAvatar(w, 0, -1).state; w = moveAvatar(w, 0, -1).state;
  assert.deepEqual(w.avatar, { x: 4, y: 6, direction: 'north' });
  assert.equal(moveAvatar(w, 1, 0).reason, 'blocked');
  assert.equal(moveAvatar(w, 1, 1).reason, 'direction'); assert.equal(moveAvatar(w, 0, 0).ok, false);
  assert.equal(moveAvatar({ ...w, avatar: { x: 0, y: 0, direction: 'north' } }, -1, 0).reason, 'edge');
});
test('köp ger en offert och nytt lager utan att röra mynt eller originaldata', () => {
  const w = emptyWorld(), before = JSON.stringify(w), r = purchaseBlock(w, 'pond', 2);
  assert.equal(r.ok, true); assert.equal(r.cost, 80); assert.equal(r.state.inventory.pond, w.inventory.pond + 2);
  assert.equal(JSON.stringify(w), before); assert.equal('coins' in r.state, false);
  for (const q of [0, -1, 1.5, 21, Infinity, NaN, '2']) assert.equal(purchaseBlock(w, 'stone', q).ok, false);
  assert.equal(purchaseBlock(w, 'fake').ok, false);
  assert.equal(purchaseBlock({ ...w, inventory: { ...w.inventory, stone: 999 } }, 'stone').reason, 'stock-limit');
});
test('sparad värld kan serialiseras och valideras utan att fylla på förbrukat lager', () => {
  let w = place(emptyWorld(), 1, 1, 'wood'); w = rotateBlock(w, 1, 1).state;
  assert.deepEqual(normalizeWorld(JSON.parse(JSON.stringify(w))), w);
  assert.equal(normalizeWorld({ version: 1, inventory: { stone: 0 } }).inventory.stone, 0);
  assert.deepEqual(normalizeWorld(null), emptyWorld()); assert.deepEqual(normalizeWorld({ version: 999 }), emptyWorld());
  const dirty = normalizeWorld({ version: 1, inventory: { stone: Infinity, wood: -3, glass: 5.8, roof: 5000 }, avatar: { x: -1, y: 2 }, blocks: [
    { x: 0, y: 0, z: 0, type: 'wood', rotation: -1 }, { x: 0, y: 0, z: 0, type: 'stone' }, { x: 1, y: 0, z: 3, type: 'stone' }, { x: 0, y: 0, z: 1, type: 'roof' }, { x: 0, y: 0, z: 2, type: 'glass' }, { x: 10, y: 0, z: 0, type: 'glass' }, { x: 1, y: 1, z: 0, type: 'unknown' },
  ] });
  assert.equal(dirty.blocks.length, 2); assert.equal(dirty.blocks[0].rotation, 3);
  assert.equal(dirty.inventory.stone, 0); assert.equal(dirty.inventory.wood, 0); assert.equal(dirty.inventory.glass, 5); assert.equal(dirty.inventory.roof, 999);
});
test('korrupt sparning kan inte stänga in figurens start eller överskrida blockgräns', () => {
  const blocks = []; for (let y = 0; y < 10; y++) for (let x = 0; x < 10; x++) for (let z = 0; z < 4; z++) blocks.push({ x, y, z, type: 'stone' });
  const w = normalizeWorld({ version: 1, blocks, inventory: {}, avatar: { x: 4, y: 8, direction: 'bad' } });
  assert.ok(w.blocks.length <= MAX_BLOCKS); assert.equal(cellBlocks(w, w.avatar.x, w.avatar.y).length, 0);
  assert.deepEqual(normalizeWorld(w), w);
});
test('alla sex mål kan byggas samtidigt med enbart gratis startsats', () => {
  let w = emptyWorld();
  for (let z = 0; z < 3; z++) w = place(w, 0, 0, 'stone');
  for (let x = 1; x <= 4; x++) w = place(w, x, 0, 'flower');
  for (let x = 1; x <= 4; x++) w = place(w, x, 1, 'path');
  for (let x = 1; x <= 2; x++) { w = place(w, x, 2, 'wood'); w = place(w, x, 2, 'roof'); }
  w = place(w, 3, 2, 'glass');
  assert.ok(missionProgress(w).every((m) => m.done));
  assert.ok(Object.values(w.inventory).every((n) => n >= 0));
  w = removeBlock(w, 2, 2).state; assert.equal(missionProgress(w).find((m) => m.id === 'village').done, false);
});
test('stig kräver sammanhängande sidor och räknar inte diagonaler eller upphöjda delar', () => {
  let w = emptyWorld(); for (let n = 0; n < 4; n++) w = place(w, n, n, 'path');
  assert.equal(missionProgress(w).find((m) => m.id === 'trail').current, 1);
  w = place(w, 5, 5, 'stone'); w = place(w, 5, 5, 'path');
  assert.equal(missionProgress(w).find((m) => m.id === 'trail').current, 1);
});

test('tre originala byggskisser är gratis att bygga med startlagret och bevarar gångvägar', async () => {
  const { BUILD_PLANS, applyBuildPlan } = await import('../../src/apps/build-world.js');
  assert.equal(BUILD_PLANS.length, 3); assert.equal(new Set(BUILD_PLANS.map((p) => p.id)).size, 3);
  for (const plan of BUILD_PLANS) {
    const initial = emptyWorld(), before = JSON.stringify(initial), result = applyBuildPlan(initial, plan.id);
    assert.ok(result.ok, `${plan.id}: ${result.message}`); assert.equal(result.cost, 0);
    assert.equal(JSON.stringify(initial), before); assert.equal(result.state.blocks.length, plan.parts.length);
    for (const b of BLOCKS) assert.equal(result.state.inventory[b.id], initial.inventory[b.id] - plan.parts.filter((p) => p.type === b.id).length);
    assert.deepEqual(normalizeWorld(result.state), result.state);
    // Every plan leaves the central approach at its southern edge walkable.
    let w = { ...result.state, avatar: { x: 2, y: 5, direction: 'north' } };
    w = moveAvatar(w, 0, -1).state; assert.equal(w.avatar.y, 4);
  }
});
test('byggskisser är atomiska vid brist, kant, upptagen ruta, avatar eller blockgräns', async () => {
  const { applyBuildPlan } = await import('../../src/apps/build-world.js');
  const initial = emptyWorld();
  const occupied = place(initial, 2, 2, 'flower');
  const scarce = { ...initial, inventory: { ...initial.inventory, roof: 0 } };
  const avatar = { ...initial, avatar: { x: 1, y: 1, direction: 'north' } };
  const full = { ...initial, blocks: Array.from({ length: MAX_BLOCKS - 1 }, () => ({ x: 9, y: 9, z: 0, type: 'stone' })) };
  for (const [world, id, x, y, reason] of [[initial, 'unknown', 1, 1, 'invalid'], [initial, 'park', 8, 8, 'edge'], [occupied, 'park', 1, 1, 'occupied'], [scarce, 'house', 1, 1, 'stock'], [avatar, 'house', 1, 1, 'avatar'], [full, 'park', 1, 1, 'limit']]) {
    const before = JSON.stringify(world), result = applyBuildPlan(world, id, x, y);
    assert.equal(result.ok, false); assert.equal(result.reason, reason); assert.equal(result.state, world); assert.equal(JSON.stringify(world), before);
  }
  const built = applyBuildPlan(initial, 'park'); assert.equal(applyBuildPlan(built.state, 'park').reason, 'occupied');
});
