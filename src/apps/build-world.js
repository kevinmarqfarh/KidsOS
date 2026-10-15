// Byggvärlden: egen, lokal byggleksak. Alla operationer är rena; profilens
// mynt hanteras av värden, aldrig här. Inga nätverk, timer eller förlustvillkor.
export const WORLD_SIZE = 10;
export const MAX_HEIGHT = 4;
export const MAX_BLOCKS = 200;
export const WORLD_VERSION = 1;
const MAX_STOCK = 999;
export const BLOCKS = [
  { id: 'stone', name: 'Stenblock', icon: '🧱', color: '#94a3b8', price: 5, solid: true, stackable: true, start: 40 },
  { id: 'wood', name: 'Träblock', icon: '🪵', color: '#b77942', price: 5, solid: true, stackable: true, start: 24 },
  { id: 'glass', name: 'Glasblock', icon: '🪟', color: '#7dd3fc', price: 10, solid: true, stackable: true, start: 12 },
  { id: 'roof', name: 'Tak', icon: '🏠', color: '#f87171', price: 10, solid: true, stackable: false, start: 12 },
  { id: 'flower', name: 'Blomma', icon: '🌻', color: '#facc15', price: 5, solid: false, stackable: false, start: 12 },
  { id: 'path', name: 'Stig', icon: '🟫', color: '#d6b88b', price: 5, solid: false, stackable: false, start: 20 },
  { id: 'tree', name: 'Träd', icon: '🌳', color: '#4ade80', price: 15, solid: true, stackable: false, start: 2 },
  { id: 'lamp', name: 'Lykta', icon: '💡', color: '#fde68a', price: 20, solid: true, stackable: false, start: 1 },
  { id: 'bench', name: 'Bänk', icon: '🪑', color: '#a16207', price: 25, solid: true, stackable: false, start: 1 },
  { id: 'pond', name: 'Liten damm', icon: '💧', color: '#38bdf8', price: 40, solid: true, stackable: false, start: 1 },
].map(Object.freeze);
Object.freeze(BLOCKS);
export const blockById = (id) => BLOCKS.find((b) => b.id === id);
const coord = (n) => Number.isInteger(n) && n >= 0 && n < WORLD_SIZE;
const rotationValue = (n) => Number.isInteger(n) ? ((n % 4) + 4) % 4 : 0;
const inventoryCount = (n) => Number.isFinite(n) ? Math.min(MAX_STOCK, Math.max(0, Math.floor(n))) : 0;
export function emptyWorld() {
  return { version: WORLD_VERSION, blocks: [], inventory: Object.fromEntries(BLOCKS.map((b) => [b.id, b.start])), avatar: { x: 4, y: 8, direction: 'north' } };
}
export function cellBlocks(world, x, y) {
  return world.blocks.filter((b) => b.x === x && b.y === y).sort((a, b) => a.z - b.z);
}
function blocked(world, x, y) { return cellBlocks(world, x, y).some((b) => blockById(b.type)?.solid); }
export function normalizeWorld(raw) {
  if (!raw || raw.version !== WORLD_VERSION || typeof raw !== 'object') return emptyWorld();
  const state = { version: WORLD_VERSION, blocks: [], inventory: Object.fromEntries(BLOCKS.map((b) => [b.id, inventoryCount(raw.inventory?.[b.id])])), avatar: { x: 4, y: 8, direction: 'north' } };
  // Bounded even for malformed backups. Sorted levels let us reject floating blocks.
  const candidates = (Array.isArray(raw.blocks) ? raw.blocks.slice(0, MAX_BLOCKS * 4) : []).filter((b) => b && coord(b.x) && coord(b.y) && Number.isInteger(b.z) && b.z >= 0 && b.z < MAX_HEIGHT && blockById(b.type)).sort((a, b) => a.z - b.z);
  for (const b of candidates) {
    if (state.blocks.length >= MAX_BLOCKS) break;
    const stack = cellBlocks(state, b.x, b.y);
    if (b.z !== stack.length || (stack.length && !blockById(stack.at(-1).type).stackable)) continue;
    state.blocks.push({ x: b.x, y: b.y, z: b.z, type: b.type, rotation: rotationValue(b.rotation) });
  }
  const a = raw.avatar;
  if (a && coord(a.x) && coord(a.y)) state.avatar = { x: a.x, y: a.y, direction: ['north', 'east', 'south', 'west'].includes(a.direction) ? a.direction : 'north' };
  if (blocked(state, state.avatar.x, state.avatar.y)) {
    let free;
    for (let y = 0; y < WORLD_SIZE && !free; y++) for (let x = 0; x < WORLD_SIZE; x++) if (!blocked(state, x, y)) { free = { x, y }; break; }
    // Always retain a walkable spawn, including a corrupt fully filled backup.
    if (!free) { free = { x: 4, y: 8 }; for (const b of cellBlocks(state, 4, 8)) state.inventory[b.type] = inventoryCount(state.inventory[b.type] + 1); state.blocks = state.blocks.filter((b) => b.x !== 4 || b.y !== 8); }
    Object.assign(state.avatar, free);
  }
  return state;
}
const fail = (state, reason, message) => ({ ok: false, state, reason, message, cost: 0 });
const success = (state, message, cost = 0) => ({ ok: true, state, reason: '', message, cost });
export function placeBlock(world, x, y, type, rotation = 0) {
  const item = blockById(type);
  if (!coord(x) || !coord(y) || !item) return fail(world, 'invalid', 'Välj en ruta i världen och en byggdel.');
  if (!world.inventory[type]) return fail(world, 'stock', 'Den byggdelen är slut. Ta bort en byggdel för att använda den igen.');
  if (world.blocks.length >= MAX_BLOCKS) return fail(world, 'limit', 'Världen har plats för 200 byggdelar. Ta bort något för att bygga vidare.');
  const stack = cellBlocks(world, x, y);
  if (stack.length >= MAX_HEIGHT) return fail(world, 'height', 'Här är det redan fyra byggdelar högt.');
  if (stack.length && !blockById(stack.at(-1).type).stackable) return fail(world, 'support', 'Den översta delen går inte att bygga på.');
  if (item.solid && world.avatar.x === x && world.avatar.y === y) return fail(world, 'avatar', 'Flytta figuren först, så kan du bygga här.');
  return success({ ...world, inventory: { ...world.inventory, [type]: world.inventory[type] - 1 }, blocks: [...world.blocks, { x, y, z: stack.length, type, rotation: rotationValue(rotation) }] }, `${item.name} är på plats.`);
}
export function removeBlock(world, x, y) {
  const top = cellBlocks(world, x, y).at(-1);
  if (!top) return fail(world, 'empty', 'Här finns ingen byggdel att ta bort.');
  if (world.inventory[top.type] >= MAX_STOCK) return fail(world, 'stock-limit', 'Lagret är fullt för den byggdelen.');
  return success({ ...world, inventory: { ...world.inventory, [top.type]: world.inventory[top.type] + 1 }, blocks: world.blocks.filter((b) => b !== top) }, 'Byggdelen finns i lagret igen.');
}
export function rotateBlock(world, x, y) {
  const top = cellBlocks(world, x, y).at(-1);
  if (!top) return fail(world, 'empty', 'Välj en byggdel att vrida.');
  return success({ ...world, blocks: world.blocks.map((b) => b === top ? { ...b, rotation: (b.rotation + 1) % 4 } : b) }, 'Byggdelen har vridits ett kvarts varv.');
}
export function moveAvatar(world, dx, dy) {
  if (!Number.isInteger(dx) || !Number.isInteger(dy) || Math.abs(dx) + Math.abs(dy) !== 1) return fail(world, 'direction', 'Gå en ruta åt gången.');
  const x = world.avatar.x + dx, y = world.avatar.y + dy;
  if (!coord(x) || !coord(y)) return fail(world, 'edge', 'Här slutar världen. Välj ett annat håll.');
  if (blocked(world, x, y)) return fail(world, 'blocked', 'En byggdel står i vägen. Gå runt den eller ta bort den.');
  return success({ ...world, avatar: { x, y, direction: dx > 0 ? 'east' : dx < 0 ? 'west' : dy > 0 ? 'south' : 'north' } }, 'Figuren gick en ruta.');
}
// A quote plus a proposed inventory. Caller checks kos.spend(cost) BEFORE using state.
export function purchaseBlock(world, type, quantity = 1) {
  const item = blockById(type);
  if (!item || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) return fail(world, 'invalid', 'Välj mellan en och tjugo byggdelar.');
  if (world.inventory[type] + quantity > MAX_STOCK) return fail(world, 'stock-limit', 'Lagret har inte plats för fler av den byggdelen.');
  return success({ ...world, inventory: { ...world.inventory, [type]: world.inventory[type] + quantity } }, `${quantity} ${item.name.toLowerCase()} till lagret.`, item.price * quantity);
}
export const MISSIONS = Object.freeze([
  { id: 'first', title: 'Min första plats', description: 'Placera sex valfria byggdelar.', target: 6 },
  { id: 'tower', title: 'Bygg på höjden', description: 'Bygg ett torn som är tre byggdelar högt.', target: 3 },
  { id: 'garden', title: 'En blommande trädgård', description: 'Placera fyra blommor.', target: 4 },
  { id: 'trail', title: 'En sammanhängande stig', description: 'Lägg fyra stigrutor som sitter ihop sida vid sida.', target: 4 },
  { id: 'village', title: 'Två små hus', description: 'Bygg två tak med minst ett block under varje tak.', target: 2 },
  { id: 'materials', title: 'Blanda material', description: 'Bygg med sten, trä och glas.', target: 3 },
].map(Object.freeze));
function longestTrail(world) {
  const remaining = new Set(world.blocks.filter((b) => b.type === 'path' && b.z === 0).map((b) => `${b.x},${b.y}`));
  let longest = 0;
  while (remaining.size) {
    const queue = [remaining.values().next().value]; remaining.delete(queue[0]);
    for (let i = 0; i < queue.length; i++) {
      const [x, y] = queue[i].split(',').map(Number);
      for (const key of [`${x + 1},${y}`, `${x - 1},${y}`, `${x},${y + 1}`, `${x},${y - 1}`]) if (remaining.delete(key)) queue.push(key);
    }
    longest = Math.max(longest, queue.length);
  }
  return longest;
}
export function missionProgress(world) {
  const values = {
    first: world.blocks.length,
    tower: Math.max(0, ...world.blocks.map((b) => b.z + 1)),
    garden: world.blocks.filter((b) => b.type === 'flower').length,
    trail: longestTrail(world),
    village: world.blocks.filter((b) => b.type === 'roof' && b.z > 0).length,
    materials: new Set(world.blocks.filter((b) => ['stone', 'wood', 'glass'].includes(b.type)).map((b) => b.type)).size,
  };
  return MISSIONS.map((m) => ({ ...m, current: Math.min(m.target, values[m.id]), done: values[m.id] >= m.target }));
}

// Originala små byggskisser. De drar bara material som redan finns i lagret.
// Hela skissen placeras eller ingenting; inga befintliga byggen skrivs över.
export const BUILD_PLANS = Object.freeze([
  { id: 'park', name: 'Minipark', icon: '🌳', description: 'En stig mellan blommor, med träd och en bänk.', parts: [
    ...[0, 1, 2].map((y) => ({ x: 1, y, z: 0, type: 'path' })),
    ...[0, 2].flatMap((x) => [0, 2].map((y) => ({ x, y, z: 0, type: 'flower' }))),
    { x: 0, y: 1, z: 0, type: 'tree' }, { x: 2, y: 1, z: 0, type: 'bench', rotation: 3 },
  ] },
  { id: 'house', name: 'Lilla huset', icon: '🏡', description: 'Fyra pelare med tak och en fri gång genom mitten.', parts: [
    ...[0, 2].flatMap((x) => [0, 2].flatMap((y) => [
      { x, y, z: 0, type: 'wood' }, { x, y, z: 1, type: 'glass' }, { x, y, z: 2, type: 'roof' },
    ])),
    ...[0, 1, 2].map((y) => ({ x: 1, y, z: 0, type: 'path' })),
  ] },
  { id: 'space', name: 'Stjärnstationen', icon: '🚀', description: 'Två observationstorn, en lysande mötesplats och en fri stig.', parts: [
    ...[0, 2].flatMap((x) => [{ x, y: 0, z: 0, type: 'stone' }, { x, y: 0, z: 1, type: 'glass' }, { x, y: 0, z: 2, type: 'glass' }]),
    { x: 1, y: 0, z: 0, type: 'lamp' },
    ...[1, 2, 3].map((y) => ({ x: 1, y, z: 0, type: 'path' })),
    { x: 0, y: 3, z: 0, type: 'flower' }, { x: 2, y: 3, z: 0, type: 'flower' },
  ] },
].map((plan) => Object.freeze({ ...plan, parts: Object.freeze(plan.parts.map(Object.freeze)) })));

export function applyBuildPlan(world, id, anchorX = 1, anchorY = 1) {
  const plan = BUILD_PLANS.find((p) => p.id === id);
  if (!plan || !coord(anchorX) || !coord(anchorY)) return fail(world, 'invalid', 'Välj en byggskiss och en ruta inne på ön.');
  // Check the complete footprint first, including all levels of occupied cells.
  const cells = new Set(plan.parts.map((p) => `${anchorX + p.x},${anchorY + p.y}`));
  for (const key of cells) {
    const [x, y] = key.split(',').map(Number);
    if (!coord(x) || !coord(y)) return fail(world, 'edge', 'Hela byggskissen behöver få plats på ön. Välj en annan startplats.');
    if (cellBlocks(world, x, y).length) return fail(world, 'occupied', 'En ruta i byggskissen är upptagen. Välj en tom plats; ditt bygge finns kvar.');
  }
  let state = world;
  for (const p of [...plan.parts].sort((a, b) => a.z - b.z)) {
    const result = placeBlock(state, anchorX + p.x, anchorY + p.y, p.type, p.rotation);
    if (!result.ok) return fail(world, result.reason, `Byggskissen placerades inte. ${result.message}`);
    state = result.state;
  }
  return success(state, `${plan.name} är byggd med material från ditt lager. Du kan ändra, ta bort eller ångra den.`);
}
