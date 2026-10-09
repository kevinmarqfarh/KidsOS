// Lekstaden – en öppen lekvärld (inspirerad av hur "digitala leksaker" fungerar:
// inga poäng, inga fel, figurer som reagerar, saker att dra runt och hemligheter att hitta).
// Lärandet är inbyggt: man betalar med mynt (räkna pengar), läser recept och mäter,
// tar hand om djur (biologi), blandar färger och odlar (livscykler).
// Mynt tjänas bara genom att lära sig i de andra apparna – inga riktiga köp.

export const SCENES = [
  { id: 'house', name: 'Mitt hus', icon: '🏠', color: '#f97316', blurb: 'Inred ditt rum och lek med figurerna.' },
  { id: 'market', name: 'Marknaden', icon: '🏪', color: '#eab308', blurb: 'Köp saker – betala med rätt antal mynt.' },
  { id: 'kitchen', name: 'Köket', icon: '🍳', color: '#ef4444', blurb: 'Laga mat efter recept – eller hitta på eget!' },
  { id: 'vet', name: 'Djurkliniken', icon: '🏥', color: '#06b6d4', blurb: 'Hjälp djuren att må bra.' },
  { id: 'lab', name: 'Färglabbet', icon: '🧪', color: '#a855f7', blurb: 'Blanda färger och upptäck nya.' },
  { id: 'garden', name: 'Trädgården', icon: '🌻', color: '#22c55e', blurb: 'Plantera frön, vattna och se dem växa.' },
  { id: 'wardrobe', name: 'Frisören', icon: '💇', color: '#ec4899', blurb: 'Skapa figurer och klä ut dem.' },
];

// Butikens sortiment. price = mynt. start = finns från början.
export const ITEMS = [
  // möbler & saker till huset
  { id: 'bed', e: '🛏️', n: 'säng', cat: 'hem', price: 5, start: true },
  { id: 'lamp', e: '💡', n: 'lampa', cat: 'hem', price: 3, start: true, tap: 'light' },
  { id: 'plant', e: '🪴', n: 'krukväxt', cat: 'hem', price: 4, start: true },
  { id: 'teddy', e: '🧸', n: 'nalle', cat: 'hem', price: 6 },
  { id: 'books', e: '📚', n: 'bokhylla', cat: 'hem', price: 8, tap: 'book' },
  { id: 'frame', e: '🖼️', n: 'tavla', cat: 'hem', price: 8 },
  { id: 'sofa', e: '🛋️', n: 'soffa', cat: 'hem', price: 12 },
  { id: 'tv', e: '📺', n: 'tv', cat: 'hem', price: 15, tap: 'tv' },
  { id: 'piano', e: '🎹', n: 'piano', cat: 'hem', price: 18, tap: 'piano' },
  { id: 'aquarium', e: '🐠', n: 'akvarium', cat: 'hem', price: 16 },
  { id: 'globe', e: '🌍', n: 'jordglob', cat: 'hem', price: 10, tap: 'globe' },
  { id: 'telescope', e: '🔭', n: 'teleskop', cat: 'hem', price: 20, tap: 'star' },
  { id: 'computer', e: '💻', n: 'dator', cat: 'hem', price: 22, tap: 'fact' },
  { id: 'disco', e: '🪩', n: 'discokula', cat: 'hem', price: 14, tap: 'disco' },
  // kläder & accessoarer (sätts på figurer)
  { id: 'tophat', e: '🎩', n: 'hög hatt', cat: 'kläder', price: 6, slot: 'head' },
  { id: 'cap', e: '🧢', n: 'keps', cat: 'kläder', price: 5, slot: 'head' },
  { id: 'crown', e: '👑', n: 'krona', cat: 'kläder', price: 15, slot: 'head' },
  { id: 'bow', e: '🎀', n: 'rosett', cat: 'kläder', price: 4, slot: 'head' },
  { id: 'glasses', e: '👓', n: 'glasögon', cat: 'kläder', price: 6, slot: 'face' },
  { id: 'sunglasses', e: '🕶️', n: 'solglasögon', cat: 'kläder', price: 8, slot: 'face' },
  { id: 'scarf', e: '🧣', n: 'halsduk', cat: 'kläder', price: 5, slot: 'neck' },
  { id: 'medal', e: '🏅', n: 'medalj', cat: 'kläder', price: 9, slot: 'neck' },
  { id: 'bag', e: '🎒', n: 'ryggsäck', cat: 'kläder', price: 7, slot: 'hand' },
  { id: 'balloon', e: '🎈', n: 'ballong', cat: 'kläder', price: 3, slot: 'hand' },
  // husdjur
  { id: 'cat', e: '🐈', n: 'katt', cat: 'djur', price: 20, tap: 'pet', sound: 'Mjau!' },
  { id: 'dog', e: '🐕', n: 'hund', cat: 'djur', price: 22, tap: 'pet', sound: 'Voff!' },
  { id: 'rabbit', e: '🐇', n: 'kanin', cat: 'djur', price: 15, tap: 'pet', sound: 'Kaniner säger nästan inget – men de stampar med bakbenen!' },
  { id: 'hamster', e: '🐹', n: 'hamster', cat: 'djur', price: 12, tap: 'pet', sound: 'Pip pip!' },
  { id: 'parrot', e: '🦜', n: 'papegoja', cat: 'djur', price: 18, tap: 'pet', sound: 'Hej hej! Papegojor kan härma ljud.' },
  { id: 'turtle', e: '🐢', n: 'sköldpadda', cat: 'djur', price: 14, tap: 'pet', sound: 'Sköldpaddor kan bli över 100 år gamla.' },
  // frön till trädgården
  { id: 'seed-carrot', e: '🥕', n: 'morotsfrön', cat: 'frön', price: 2, grows: 'carrot' },
  { id: 'seed-tomato', e: '🍅', n: 'tomatfrön', cat: 'frön', price: 3, grows: 'tomato' },
  { id: 'seed-sunflower', e: '🌻', n: 'solrosfrön', cat: 'frön', price: 3, grows: 'sunflower' },
  { id: 'seed-strawberry', e: '🍓', n: 'jordgubbsplanta', cat: 'frön', price: 4, grows: 'strawberry' },
  { id: 'seed-pumpkin', e: '🎃', n: 'pumpafrön', cat: 'frön', price: 5, grows: 'pumpkin' },
];
export const itemById = (id) => ITEMS.find((i) => i.id === id);
export const SHOP_CATS = [
  { id: 'hem', n: 'Till huset', e: '🛋️' },
  { id: 'kläder', n: 'Kläder', e: '👑' },
  { id: 'djur', n: 'Husdjur', e: '🐾' },
  { id: 'frön', n: 'Frön', e: '🌱' },
];

// Svenska mynt (kronor).
export const COINS = [1, 2, 5, 10];
export function coinsForLevel(level) {
  if (level <= 0) return [1];
  if (level === 1) return [1, 5];
  if (level === 2) return [1, 2, 5];
  return [1, 2, 5, 10];
}
/** Minsta antal mynt för att betala exakt (girig algoritm fungerar för 1,2,5,10). */
export function fewestCoins(amount, coins = COINS) {
  const out = [];
  let left = amount;
  for (const c of [...coins].sort((a, b) => b - a)) {
    while (left >= c) {
      out.push(c);
      left -= c;
    }
  }
  return left === 0 ? out : null;
}

/* ---------- Trädgården ---------- */
export const PLANTS = {
  carrot: { n: 'morot', stages: ['🟤', '🌱', '🌿', '🥕'], harvest: 'carrot', fact: 'Moroten är en rot. Det vi äter växer under jorden!' },
  tomato: { n: 'tomat', stages: ['🟤', '🌱', '🌿', '🍅'], harvest: 'tomato', fact: 'Tomaten är egentligen en frukt eftersom den har frön inuti.' },
  sunflower: { n: 'solros', stages: ['🟤', '🌱', '🌿', '🌻'], harvest: 'sunseeds', fact: 'Solrosen vänder sig mot solen när den är ung. Den kan bli högre än en vuxen!' },
  strawberry: { n: 'jordgubbe', stages: ['🟤', '🌱', '☘️', '🍓'], harvest: 'strawberry', fact: 'Jordgubben har sina frön på utsidan – ungefär 200 stycken!' },
  pumpkin: { n: 'pumpa', stages: ['🟤', '🌱', '🌿', '🎃'], harvest: 'pumpkin', fact: 'Pumpor växer på långa revor längs marken och kan bli jättestora.' },
};
export const GROW_MINUTES = 3; // minuter mellan stegen (riktig tid – man får vänta och vattna)

/** Växtens steg 0–3 utifrån när den vattnades. Varje steg kräver vatten och väntan. */
export function plantStage(pot, now = Date.now()) {
  if (!pot || !pot.plant) return -1;
  return Math.min(3, pot.stage || 0);
}
export function canGrow(pot, now = Date.now()) {
  return !!pot?.plant && pot.stage < 3 && pot.watered && now - pot.wateredAt >= GROW_MINUTES * 60000;
}
export function growTick(pot, now = Date.now()) {
  if (canGrow(pot, now)) {
    pot.stage++;
    pot.watered = false;
    return true;
  }
  return false;
}

/* ---------- Köket ---------- */
export const INGREDIENTS = [
  { id: 'flour', e: '🌾', n: 'mjöl', unit: 'dl' },
  { id: 'egg', e: '🥚', n: 'ägg', unit: 'st' },
  { id: 'milk', e: '🥛', n: 'mjölk', unit: 'dl' },
  { id: 'butter', e: '🧈', n: 'smör', unit: 'msk' },
  { id: 'sugar', e: '🍬', n: 'socker', unit: 'dl' },
  { id: 'bread', e: '🍞', n: 'bröd', unit: 'skivor' },
  { id: 'cheese', e: '🧀', n: 'ost', unit: 'skivor' },
  { id: 'cucumber', e: '🥒', n: 'gurka', unit: 'skivor' },
  { id: 'banana', e: '🍌', n: 'banan', unit: 'st' },
  { id: 'apple', e: '🍎', n: 'äpple', unit: 'st' },
  { id: 'strawberry', e: '🍓', n: 'jordgubbar', unit: 'st' },
  { id: 'carrot', e: '🥕', n: 'morot', unit: 'st', grown: true },
  { id: 'tomato', e: '🍅', n: 'tomat', unit: 'st', grown: true },
  { id: 'pumpkin', e: '🎃', n: 'pumpa', unit: 'st', grown: true },
  { id: 'cocoa', e: '🍫', n: 'kakao', unit: 'msk' },
];
export const RECIPES = [
  { id: 'pancakes', n: 'Pannkakor', e: '🥞', needs: { flour: 2, egg: 3, milk: 6 }, minLevel: 1, fact: 'Pannkakor är en klassisk svensk torsdagsmat – med ärtsoppa först!' },
  { id: 'sandwich', n: 'Smörgås', e: '🥪', needs: { bread: 1, butter: 1, cheese: 1, cucumber: 2 }, minLevel: 0, fact: 'Ordet smörgås kommer från smörklumpar som flöt upp när man kärnade smör – de såg ut som små gäss!' },
  { id: 'fruitsalad', n: 'Fruktsallad', e: '🥗', needs: { banana: 1, apple: 2, strawberry: 5 }, minLevel: 0, fact: 'Frukt ger vitaminer och energi. Ät gärna frukt varje dag.' },
  { id: 'smoothie', n: 'Smoothie', e: '🥤', needs: { banana: 2, strawberry: 4, milk: 2 }, minLevel: 1, fact: 'En smoothie är frukt som har mixats till en dryck.' },
  { id: 'cake', n: 'Kladdkaka', e: '🍰', needs: { butter: 3, sugar: 2, egg: 2, flour: 1, cocoa: 4 }, minLevel: 2, fact: 'Kladdkaka är en svensk uppfinning – kladdig i mitten!' },
  { id: 'soup', n: 'Pumpasoppa', e: '🍲', needs: { pumpkin: 1, carrot: 2, milk: 3 }, minLevel: 2, fact: 'Soppa av grönsaker från trädgården – från frö till tallrik!' },
];
/** Jämför skålens innehåll med ett recept. */
export function matchRecipe(bowl) {
  const keys = Object.keys(bowl).filter((k) => bowl[k] > 0);
  for (const r of RECIPES) {
    const need = Object.keys(r.needs);
    if (need.length === keys.length && need.every((k) => bowl[k] === r.needs[k])) return r;
  }
  return null;
}

/* ---------- Färglabbet ---------- */
export const BASE_COLORS = [
  { id: 'red', n: 'röd', hex: '#ef4444' },
  { id: 'yellow', n: 'gul', hex: '#facc15' },
  { id: 'blue', n: 'blå', hex: '#3b82f6' },
  { id: 'white', n: 'vit', hex: '#ffffff' },
  { id: 'black', n: 'svart', hex: '#1f2937' },
];
export const MIXES = [
  { needs: ['red', 'yellow'], n: 'orange', hex: '#f97316' },
  { needs: ['yellow', 'blue'], n: 'grön', hex: '#22c55e' },
  { needs: ['red', 'blue'], n: 'lila', hex: '#9333ea' },
  { needs: ['red', 'white'], n: 'rosa', hex: '#f9a8d4' },
  { needs: ['blue', 'white'], n: 'ljusblå', hex: '#93c5fd' },
  { needs: ['black', 'white'], n: 'grå', hex: '#9ca3af' },
  { needs: ['red', 'yellow', 'blue'], n: 'brun', hex: '#7c4a1e' },
  { needs: ['yellow', 'white'], n: 'ljusgul', hex: '#fef08a' },
  { needs: ['red', 'black'], n: 'mörkröd', hex: '#7f1d1d' },
  { needs: ['blue', 'black'], n: 'marinblå', hex: '#1e3a8a' },
];
export function mixColors(drops) {
  const set = [...new Set(drops)].sort().join('+');
  return MIXES.find((m) => [...m.needs].sort().join('+') === set) || null;
}

/* ---------- Djurkliniken ---------- */
export const TOOLS = [
  { id: 'bandage', e: '🩹', n: 'plåster' },
  { id: 'thermo', e: '🌡️', n: 'termometer' },
  { id: 'medicine', e: '💊', n: 'medicin' },
  { id: 'brush', e: '🪥', n: 'borste' },
  { id: 'water', e: '💧', n: 'vatten' },
  { id: 'carrot', e: '🥕', n: 'morot' },
  { id: 'fish', e: '🐟', n: 'fisk' },
  { id: 'seeds', e: '🌻', n: 'fröer' },
  { id: 'hay', e: '🌾', n: 'hö' },
  { id: 'bone', e: '🦴', n: 'tuggben' },
];
export const PATIENTS = [
  { animal: '🐇', n: 'kaninen', problem: 'är hungrig', steps: ['carrot'], fact: 'Kaniner äter hö, gräs och grönsaker. Hö ska de ha varje dag för att tänderna växer hela livet!' },
  { animal: '🐇', n: 'kaninen', problem: 'är hungrig på riktig kaninmat', steps: ['hay'], fact: 'Hö är kaninens viktigaste mat – den sliter ner tänderna som växer hela tiden.' },
  { animal: '🐈', n: 'katten', problem: 'är hungrig', steps: ['fish'], fact: 'Katter är rovdjur och behöver mat med kött eller fisk.' },
  { animal: '🐕', n: 'hunden', problem: 'har ont i tassen', steps: ['bandage'], fact: 'Hundar trampar ibland på vassa saker. Ett plåster eller bandage skyddar såret medan det läker.' },
  { animal: '🐕', n: 'hunden', problem: 'har tråkigt och vill tugga', steps: ['bone'], fact: 'Hundar behöver tugga – det är bra för tänderna och de blir lugna.' },
  { animal: '🦜', n: 'papegojan', problem: 'är hungrig', steps: ['seeds'], fact: 'Papegojor äter fröer, nötter och frukt.' },
  { animal: '🐎', n: 'hästen', problem: 'är törstig', steps: ['water'], fact: 'En häst kan dricka 30 liter vatten om dagen – det är tre hinkar!' },
  { animal: '🐈', n: 'katten', problem: 'känner sig varm och sjuk', steps: ['thermo', 'medicine'], fact: 'Först mäter man om djuret har feber. Sedan kan veterinären ge rätt medicin.' },
  { animal: '🐹', n: 'hamstern', problem: 'har tovig päls', steps: ['brush'], fact: 'Långhåriga hamstrar behöver borstas ibland.' },
  { animal: '🐕', n: 'hunden', problem: 'har feber', steps: ['thermo', 'medicine', 'water'], fact: 'Ett sjukt djur behöver medicin, vila och mycket vatten – precis som vi!' },
];

/* ---------- Hemligheter ---------- */
export const SECRETS = {
  house: [{ x: 9, y: 86, e: '🐭' }, { x: 92, y: 20, e: '🕷️' }, { x: 50, y: 6, e: '⭐' }],
  market: [{ x: 6, y: 90, e: '🪙' }, { x: 94, y: 12, e: '🐦' }],
  kitchen: [{ x: 90, y: 88, e: '🐜' }, { x: 8, y: 14, e: '🍪' }],
  vet: [{ x: 94, y: 88, e: '🐾' }, { x: 6, y: 12, e: '🦴' }],
  lab: [{ x: 50, y: 92, e: '🦠' }, { x: 92, y: 10, e: '🔮' }],
  garden: [{ x: 6, y: 92, e: '🐛' }, { x: 94, y: 8, e: '🦋' }, { x: 50, y: 95, e: '🪱' }],
  wardrobe: [{ x: 92, y: 90, e: '🧦' }],
};
export const SECRET_COUNT = Object.values(SECRETS).reduce((s, l) => s + l.length, 0);

/* ---------- Figurer ---------- */
export const SKIN = ['#ffe0c7', '#f5c6a0', '#e0a77a', '#c68a5b', '#8d5a3b', '#5c3a24'];
export const HAIR_COLORS = ['#2b1d14', '#6b4226', '#c68642', '#f2d16b', '#e2553d', '#8b5cf6', '#ec4899', '#e5e7eb'];
export const HAIR_STYLES = ['kort', 'lockigt', 'tofsar', 'långt', 'flint', 'tuppkam'];
export const CLOTH_COLORS = ['#3d8bfd', '#ef4444', '#22c55e', '#facc15', '#a855f7', '#ec4899', '#f97316', '#1f2937'];
export const NAMES = ['Mio', 'Ella', 'Noor', 'Sixten', 'Alba', 'Leo', 'Ines', 'Arvid', 'Sami', 'Vera', 'Omid', 'Lova'];

export function newCharacter(rng = Math.random) {
  const pick = (a) => a[Math.floor(rng() * a.length)];
  return {
    id: `c${Date.now().toString(36)}${Math.floor(rng() * 1e4).toString(36)}`,
    name: pick(NAMES),
    skin: pick(SKIN),
    hair: pick(HAIR_STYLES),
    hairColor: pick(HAIR_COLORS),
    shirt: pick(CLOTH_COLORS),
    pants: pick(CLOTH_COLORS),
    wear: {},
  };
}

/** Lekstadens sparade läge (per profil). */
export function emptyPlay() {
  const inv = {};
  ITEMS.filter((i) => i.start).forEach((i) => (inv[i.id] = 1));
  return {
    v: 1,
    inv,
    placed: { house: [{ uid: 'p1', item: 'bed', x: 22, y: 70 }, { uid: 'p2', item: 'lamp', x: 78, y: 58 }, { uid: 'p3', item: 'plant', x: 88, y: 76 }] },
    chars: [],
    charPos: {},
    garden: Array.from({ length: 6 }, () => ({ plant: null, stage: 0, watered: false, wateredAt: 0 })),
    pantry: {},
    colors: {},
    recipes: {},
    secrets: {},
    patients: 0,
    bought: 0,
  };
}

export const playApp = {
  id: 'play',
  name: 'Lekstaden',
  icon: '🏡',
  color: '#f97316',
  tagline: 'Lek, bygg och upptäck',
  modules: [{ id: 'town', name: 'Lekstaden', icon: '🏡', minLevel: 0, view: 'play', lgr: ['ma-tal', 'ma-rakna', 'no-livscykel', 'no-arter', 'sv-avkoda', 'bi-skapa'] }],
};
