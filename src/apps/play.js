// Lekstaden – en öppen lekvärld (inspirerad av hur "digitala leksaker" fungerar:
// inga poäng, inga fel, figurer som reagerar, saker att dra runt och hemligheter att hitta).
// Lärandet är inbyggt: man betalar med mynt (räkna pengar, växel, jämföra priser), läser recept
// och berättelser, tar hand om djur (biologi), blandar färger, odlar (livscykler) och löser
// små uppgifter på skoltavlan. Mynt tjänas främst genom att lära sig i de andra apparna –
// inga riktiga köp. Allt här är ren logik/data (testas i tests/unit/play.test.mjs).
import { numberOptions } from '../core/rng.js';

export const SCENES = [
  { id: 'house', name: 'Mitt hus', icon: '🏠', color: '#f97316', blurb: 'Inred ditt rum och lek med figurerna.' },
  { id: 'market', name: 'Marknaden', icon: '🏪', color: '#eab308', blurb: 'Köp saker – betala med rätt antal mynt.' },
  { id: 'kitchen', name: 'Köket', icon: '🍳', color: '#ef4444', blurb: 'Laga mat efter recept – eller hitta på eget!' },
  { id: 'school', name: 'Skolan', icon: '🏫', color: '#2563eb', blurb: 'Lös små uppgifter på tavlan.' },
  { id: 'library', name: 'Biblioteket', icon: '📚', color: '#7c3aed', blurb: 'Läs och lyssna på korta berättelser.' },
  { id: 'farm', name: 'Bondgården', icon: '🐄', color: '#65a30d', blurb: 'Ge djuren rätt mat och samla ägg.' },
  { id: 'beach', name: 'Stranden', icon: '🏖️', color: '#0ea5e9', blurb: 'Flyter eller sjunker? Testa i havet!' },
  { id: 'vet', name: 'Djurkliniken', icon: '🏥', color: '#06b6d4', blurb: 'Hjälp djuren att må bra.' },
  { id: 'lab', name: 'Färglabbet', icon: '🧪', color: '#a855f7', blurb: 'Blanda färger och upptäck nya.' },
  { id: 'garden', name: 'Trädgården', icon: '🌻', color: '#22c55e', blurb: 'Plantera frön, vattna och se dem växa.' },
  { id: 'wardrobe', name: 'Frisören', icon: '💇', color: '#ec4899', blurb: 'Skapa figurer och klä ut dem.' },
];

// Butikens sortiment. price = mynt. start = finns från början. dream = drömköp (dyrt sparmål).
// g = genus för obestämd artikel ('en'/'ett', '' för plural/massord), d = bestämd form.
export const ITEMS = [
  // möbler & saker till huset
  { id: 'bed', e: '🛏️', n: 'säng', g: 'en', d: 'sängen', cat: 'hem', price: 5, start: true, rest: 'sleep' },
  { id: 'lamp', e: '💡', n: 'lampa', g: 'en', d: 'lampan', cat: 'hem', price: 3, start: true, tap: 'light' },
  { id: 'plant', e: '🪴', n: 'krukväxt', g: 'en', d: 'krukväxten', cat: 'hem', price: 4, start: true },
  { id: 'teddy', e: '🧸', n: 'nalle', g: 'en', d: 'nallen', cat: 'hem', price: 6 },
  { id: 'books', e: '📚', n: 'bokhylla', g: 'en', d: 'bokhyllan', cat: 'hem', price: 8, tap: 'book' },
  { id: 'frame', e: '🖼️', n: 'tavla', g: 'en', d: 'tavlan', cat: 'hem', price: 8 },
  { id: 'sofa', e: '🛋️', n: 'soffa', g: 'en', d: 'soffan', cat: 'hem', price: 12, rest: 'sleep' },
  { id: 'tv', e: '📺', n: 'tv', g: 'en', d: 'tv:n', cat: 'hem', price: 15, tap: 'tv' },
  { id: 'piano', e: '🎹', n: 'piano', g: 'ett', d: 'pianot', cat: 'hem', price: 18, tap: 'piano' },
  { id: 'aquarium', e: '🐠', n: 'akvarium', g: 'ett', d: 'akvariet', cat: 'hem', price: 16 },
  { id: 'globe', e: '🌍', n: 'jordglob', g: 'en', d: 'jordgloben', cat: 'hem', price: 10, tap: 'globe' },
  { id: 'telescope', e: '🔭', n: 'teleskop', g: 'ett', d: 'teleskopet', cat: 'hem', price: 20, tap: 'star' },
  { id: 'computer', e: '💻', n: 'dator', g: 'en', d: 'datorn', cat: 'hem', price: 22, tap: 'fact' },
  { id: 'disco', e: '🪩', n: 'discokula', g: 'en', d: 'discokulan', cat: 'hem', price: 14, tap: 'disco' },
  { id: 'chair', e: '🪑', n: 'stol', g: 'en', d: 'stolen', cat: 'hem', price: 4, rest: 'sit' },
  { id: 'mirror', e: '🪞', n: 'spegel', g: 'en', d: 'spegeln', cat: 'hem', price: 7, tap: 'mirror' },
  { id: 'clock', e: '🕰️', n: 'klocka', g: 'en', d: 'klockan', cat: 'hem', price: 9, tap: 'clock' },
  { id: 'puzzle', e: '🧩', n: 'pussel', g: 'ett', d: 'pusslet', cat: 'hem', price: 6 },
  { id: 'drum', e: '🥁', n: 'trumma', g: 'en', d: 'trumman', cat: 'hem', price: 10, tap: 'drum' },
  { id: 'guitar', e: '🎸', n: 'gitarr', g: 'en', d: 'gitarren', cat: 'hem', price: 14, tap: 'piano' },
  { id: 'cake', e: '🎂', n: 'tårta', g: 'en', d: 'tårtan', cat: 'hem', price: 8, food: true },
  { id: 'bath', e: '🛁', n: 'badkar', g: 'ett', d: 'badkaret', cat: 'hem', price: 16, rest: 'bath' },
  { id: 'tent', e: '⛺', n: 'tält', g: 'ett', d: 'tältet', cat: 'hem', price: 18, rest: 'sleep' },
  { id: 'slide', e: '🛝', n: 'rutschkana', g: 'en', d: 'rutschkanan', cat: 'hem', price: 25, rest: 'slide' },
  // drömköp till huset (sparmål)
  { id: 'carousel', e: '🎠', n: 'karusell', g: 'en', d: 'karusellen', cat: 'hem', price: 60, dream: true, tap: 'spin' },
  { id: 'castle', e: '🏰', n: 'slott', g: 'ett', d: 'slottet', cat: 'hem', price: 80, dream: true, tap: 'castle' },
  { id: 'rocket', e: '🚀', n: 'raket', g: 'en', d: 'raketen', cat: 'hem', price: 100, dream: true, tap: 'rocket' },
  { id: 'ferris', e: '🎡', n: 'pariserhjul', g: 'ett', d: 'pariserhjulet', cat: 'hem', price: 120, dream: true, tap: 'spin' },
  // kläder & accessoarer (sätts på figurer)
  { id: 'tophat', e: '🎩', n: 'hög hatt', g: 'en', d: 'den höga hatten', cat: 'kläder', price: 6, slot: 'head' },
  { id: 'cap', e: '🧢', n: 'keps', g: 'en', d: 'kepsen', cat: 'kläder', price: 5, slot: 'head' },
  { id: 'crown', e: '👑', n: 'krona', g: 'en', d: 'kronan', cat: 'kläder', price: 15, slot: 'head' },
  { id: 'bow', e: '🎀', n: 'rosett', g: 'en', d: 'rosetten', cat: 'kläder', price: 4, slot: 'head' },
  { id: 'glasses', e: '👓', n: 'glasögon', g: '', d: 'glasögonen', cat: 'kläder', price: 6, slot: 'face' },
  { id: 'sunglasses', e: '🕶️', n: 'solglasögon', g: '', d: 'solglasögonen', cat: 'kläder', price: 8, slot: 'face' },
  { id: 'scarf', e: '🧣', n: 'halsduk', g: 'en', d: 'halsduken', cat: 'kläder', price: 5, slot: 'neck' },
  { id: 'medal', e: '🏅', n: 'medalj', g: 'en', d: 'medaljen', cat: 'kläder', price: 9, slot: 'neck' },
  { id: 'bag', e: '🎒', n: 'ryggsäck', g: 'en', d: 'ryggsäcken', cat: 'kläder', price: 7, slot: 'hand' },
  { id: 'balloon', e: '🎈', n: 'ballong', g: 'en', d: 'ballongen', cat: 'kläder', price: 3, slot: 'hand' },
  { id: 'sunhat', e: '👒', n: 'solhatt', g: 'en', d: 'solhatten', cat: 'kläder', price: 5, slot: 'head' },
  { id: 'headphones', e: '🎧', n: 'hörlurar', g: '', d: 'hörlurarna', cat: 'kläder', price: 9, slot: 'head' },
  { id: 'gradcap', e: '🎓', n: 'studentmössa', g: 'en', d: 'studentmössan', cat: 'kläder', price: 10, slot: 'head' },
  { id: 'mask', e: '🤿', n: 'cyklop', g: 'ett', d: 'cyklopet', cat: 'kläder', price: 8, slot: 'face' },
  { id: 'necklace', e: '📿', n: 'halsband', g: 'ett', d: 'halsbandet', cat: 'kläder', price: 7, slot: 'neck' },
  { id: 'mittens', e: '🧤', n: 'vantar', g: '', d: 'vantarna', cat: 'kläder', price: 4, slot: 'hand' },
  { id: 'umbrella', e: '☂️', n: 'paraply', g: 'ett', d: 'paraplyet', cat: 'kläder', price: 6, slot: 'hand' },
  { id: 'wand', e: '🪄', n: 'trollstav', g: 'en', d: 'trollstaven', cat: 'kläder', price: 12, slot: 'hand' },
  { id: 'wings', e: '🪽', n: 'vingar', g: '', d: 'vingarna', cat: 'kläder', price: 45, slot: 'back', dream: true },
  // husdjur
  { id: 'cat', e: '🐈', n: 'katt', g: 'en', d: 'katten', cat: 'djur', price: 20, tap: 'pet', sound: 'Mjau!' },
  { id: 'dog', e: '🐕', n: 'hund', g: 'en', d: 'hunden', cat: 'djur', price: 22, tap: 'pet', sound: 'Voff!' },
  { id: 'rabbit', e: '🐇', n: 'kanin', g: 'en', d: 'kaninen', cat: 'djur', price: 15, tap: 'pet', sound: 'Kaniner säger nästan inget – men de stampar med bakbenen!' },
  { id: 'hamster', e: '🐹', n: 'hamster', g: 'en', d: 'hamstern', cat: 'djur', price: 12, tap: 'pet', sound: 'Pip pip!' },
  { id: 'parrot', e: '🦜', n: 'papegoja', g: 'en', d: 'papegojan', cat: 'djur', price: 18, tap: 'pet', sound: 'Hej hej! Papegojor kan härma ljud.' },
  { id: 'turtle', e: '🐢', n: 'sköldpadda', g: 'en', d: 'sköldpaddan', cat: 'djur', price: 14, tap: 'pet', sound: 'Sköldpaddor kan bli över 100 år gamla.' },
  { id: 'mouse', e: '🐁', n: 'mus', g: 'en', d: 'musen', cat: 'djur', price: 8, tap: 'pet', sound: 'Pip! Möss känner sig fram i mörkret med sina morrhår.' },
  { id: 'budgie', e: '🐦', n: 'undulat', g: 'en', d: 'undulaten', cat: 'djur', price: 10, tap: 'pet', sound: 'Kvitter! Vilda undulater lever i stora flockar i Australien.' },
  { id: 'pony', e: '🐴', n: 'ponny', g: 'en', d: 'ponnyn', cat: 'djur', price: 70, dream: true, tap: 'pet', sound: 'Gnägg! En ponny är en liten häst som är högst ungefär 148 centimeter över manken.' },
  { id: 'unicorn', e: '🦄', n: 'enhörning', g: 'en', d: 'enhörningen', cat: 'djur', price: 150, dream: true, tap: 'pet', sound: 'Enhörningar finns bara i sagor – men i Lekstaden finns allt du kan drömma om!' },
  // frön till trädgården
  { id: 'seed-carrot', e: '🥕', n: 'morotsfrön', g: '', d: 'morotsfröna', cat: 'frön', price: 2, grows: 'carrot' },
  { id: 'seed-tomato', e: '🍅', n: 'tomatfrön', g: '', d: 'tomatfröna', cat: 'frön', price: 3, grows: 'tomato' },
  { id: 'seed-sunflower', e: '🌻', n: 'solrosfrön', g: '', d: 'solrosfröna', cat: 'frön', price: 3, grows: 'sunflower' },
  { id: 'seed-strawberry', e: '🍓', n: 'jordgubbsplanta', g: 'en', d: 'jordgubbsplantan', cat: 'frön', price: 4, grows: 'strawberry' },
  { id: 'seed-pumpkin', e: '🎃', n: 'pumpafrön', g: '', d: 'pumpafröna', cat: 'frön', price: 5, grows: 'pumpkin' },
  { id: 'seed-potato', e: '🥔', n: 'sättpotatis', g: '', d: 'sättpotatisen', cat: 'frön', price: 3, grows: 'potato' },
  { id: 'seed-peas', e: '🫛', n: 'ärtfrön', g: '', d: 'ärtfröna', cat: 'frön', price: 2, grows: 'peas' },
  { id: 'seed-corn', e: '🌽', n: 'majsfrön', g: '', d: 'majsfröna', cat: 'frön', price: 3, grows: 'corn' },
  { id: 'seed-tulip', e: '🌷', n: 'tulpanlökar', g: '', d: 'tulpanlökarna', cat: 'frön', price: 4, grows: 'tulip' },
  { id: 'seed-melon', e: '🍉', n: 'melonfrön', g: '', d: 'melonfröna', cat: 'frön', price: 8, grows: 'melon' },
];
export const itemById = (id) => ITEMS.find((i) => i.id === id);
export const SHOP_CATS = [
  { id: 'hem', n: 'Till huset', e: '🛋️' },
  { id: 'kläder', n: 'Kläder', e: '👑' },
  { id: 'djur', n: 'Husdjur', e: '🐾' },
  { id: 'frön', n: 'Frön', e: '🌱' },
  { id: 'dröm', n: 'Drömköp', e: '✨' },
];
/** Varorna i en butikskategori. Drömköpen visas bara under "Drömköp". */
export function shopItems(cat) {
  return cat === 'dröm' ? ITEMS.filter((i) => i.dream) : ITEMS.filter((i) => i.cat === cat && !i.dream);
}
/** "en säng", "ett piano", "glasögon". */
export const withArticle = (it) => (it.g ? `${it.g} ${it.n}` : it.n);
const cap1 = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/* ---------- Pengar ---------- */
// Svenska mynt (kronor) – och sedlarna 20, 50 och 100 för de stora köpen.
export const COINS = [1, 2, 5, 10];
export const MONEY = [1, 2, 5, 10, 20, 50, 100];
export function coinsForLevel(level) {
  if (level <= 0) return [1];
  if (level === 1) return [1, 5];
  if (level === 2) return [1, 2, 5];
  return [1, 2, 5, 10];
}
/** Mynt och sedlar barnet får betala med, beroende på nivå och pris (stora köp får större valörer). */
export function payCoins(level, price) {
  if (level <= 0) return price > 10 ? [1, 10] : [1];
  if (level === 1) return price > 20 ? [1, 5, 10] : [1, 5];
  if (level === 2) return price > 30 ? [1, 2, 5, 10, 20] : [1, 2, 5, 10];
  return MONEY;
}
/** Från nivå 3 (åk 2) får man betala med för mycket och räkna ut växeln. */
export const changeAllowed = (level) => level >= 3;

/** Minsta antal mynt för att betala exakt (girig algoritm fungerar för svenska valörer). */
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
const sumOf = (list) => list.reduce((a, b) => a + b, 0);

/**
 * Läget vid kassan när barnet lagt mynten `put` för en vara som kostar `price`.
 * status: 'short' (fattas), 'exact' (precis), 'change' (för mycket men varje mynt behövs → växel),
 * 'over' (ett mynt för mycket – ta bort ett).
 */
export function payState(put, price, { allowChange = false } = {}) {
  const sum = sumOf(put);
  if (sum < price) return { sum, status: 'short', missing: price - sum, change: 0 };
  if (sum === price) return { sum, status: 'exact', missing: 0, change: 0 };
  const allNeeded = put.every((c) => sum - c < price);
  if (allowChange && allNeeded) return { sum, status: 'change', missing: 0, change: sum - price };
  return { sum, status: 'over', missing: 0, change: sum - price };
}
/** Växel tillbaka, eller null om man betalat för lite. */
export const changeBack = (paid, price) => (paid >= price ? paid - price : null);
/** Svarsalternativ för "Hur mycket får du tillbaka?". */
export function changeOptions(change, rng, count = 3) {
  return numberOptions(rng, change, count, { min: 1, spread: change >= 10 ? 10 : 3 });
}
/** Hur långt man kommit mot ett sparmål. */
export function goalProgress(coins, price) {
  const have = Math.max(0, Math.min(coins || 0, price));
  return { have, left: price - have, pct: price ? Math.round((have / price) * 100) : 100, done: have >= price };
}

/** Prisjakten: jämför priser. Ger en fråga anpassad efter nivå 0–4. */
export const QUIZ_MAX_PRICE = [10, 20, 30, 60, 200];
export function priceQuiz(level, rng, items = ITEMS) {
  const lvl = Math.max(0, Math.min(4, level));
  const pool = items.filter((i) => i.price <= QUIZ_MAX_PRICE[lvl]);
  const n = [2, 2, 3, 3, 4][lvl] + (lvl === 1 && rng.chance(0.5) ? 1 : 0);
  const pick = [];
  for (const it of rng.shuffle(pool)) {
    if (!pick.some((x) => x.price === it.price)) pick.push(it);
    if (pick.length === n) break;
  }
  const byPrice = [...pick].sort((a, b) => a.price - b.price);
  const lo = byPrice[0];
  const hi = byPrice[byPrice.length - 1];
  const kinds = lvl <= 1 ? ['cheap'] : lvl === 2 ? ['cheap', 'dear'] : lvl === 3 ? ['cheap', 'dear', 'diff'] : ['dear', 'diff', 'sum', 'afford'];
  const kind = rng.pick(kinds);
  const parts = byPrice.map((i) => `${i.d} kostar ${i.price}`);
  const list = cap1(parts.length > 1 ? `${parts.slice(0, -1).join(', ')} och ${parts[parts.length - 1]}` : parts[0]);
  if (kind === 'cheap' || kind === 'dear') {
    const ans = kind === 'cheap' ? lo : hi;
    const word = kind === 'cheap' ? 'billigast' : 'dyrast';
    return {
      kind: 'pick',
      ask: kind,
      items: pick,
      options: pick.map((i) => i.id),
      answer: ans.id,
      text: `Vilken är ${word}?`,
      say: lvl === 0 ? `Vilken kostar ${kind === 'cheap' ? 'minst' : 'mest'}? Räkna prickarna.` : `Vilken är ${word}?`,
      explain: `${list}. ${ans.price} är ${kind === 'cheap' ? 'minst' : 'mest'}, så ${ans.d} är ${word}.`,
    };
  }
  const [a, b] = [hi, lo];
  if (kind === 'diff') {
    const ans = a.price - b.price;
    return {
      kind: 'num',
      ask: kind,
      items: [a, b],
      options: numberOptions(rng, ans, 3, { min: 1, spread: ans > 10 ? 5 : 2 }),
      answer: ans,
      text: `Hur mycket dyrare är ${a.d} än ${b.d}?`,
      say: `Hur många mynt dyrare är ${a.d} än ${b.d}?`,
      explain: `${a.price} − ${b.price} = ${ans}. ${cap1(a.d)} kostar ${ans} mynt mer.`,
    };
  }
  if (kind === 'sum') {
    const ans = a.price + b.price;
    return {
      kind: 'num',
      ask: kind,
      items: [a, b],
      options: numberOptions(rng, ans, 3, { min: 1, spread: 10 }),
      answer: ans,
      text: `Vad kostar ${a.d} och ${b.d} tillsammans?`,
      say: `Vad kostar ${a.d} och ${b.d} tillsammans?`,
      explain: `${a.price} + ${b.price} = ${ans}.`,
    };
  }
  // afford: man har en summa – vilken är det dyraste man har råd med?
  const affordable = byPrice.slice(0, -1);
  const target = affordable[affordable.length - 1];
  const budget = target.price + rng.int(0, Math.max(0, hi.price - target.price - 1));
  return {
    kind: 'pick',
    ask: kind,
    items: pick,
    options: pick.map((i) => i.id),
    answer: target.id,
    budget,
    text: `Du har ${budget} mynt. Vilken är den dyraste sak du har råd med?`,
    say: `Du har ${budget} mynt. Vilken är den dyraste sak du har råd med?`,
    explain: `${list}. ${cap1(target.d)} kostar ${target.price}, och ${target.price} är inte mer än ${budget}. ${cap1(hi.d)} kostar ${hi.price} – det räcker inte.`,
  };
}

/* ---------- Dagliga tak för mynt som tjänas i Lekstaden ---------- */
// Mynt ska främst tjänas genom att lära sig i apparna. Små belöningar i Lekstaden har ett tak per dag.
export const DAILY_CAPS = { school: 8, library: 10, quiz: 6, change: 4, sell: 10, farm: 4, beach: 4, vet: 12 };
/** Ger så många av `want` mynt som får plats under dagens tak för `key`. Uppdaterar st.earned. */
export function capEarn(st, key, want, day, caps = DAILY_CAPS) {
  if (!st.earned || st.earned.day !== day) st.earned = { day, n: {} };
  const used = st.earned.n[key] || 0;
  const cap = caps[key] ?? Infinity;
  const give = Math.max(0, Math.min(want, cap - used));
  st.earned.n[key] = used + give;
  return give;
}

/* ---------- Trädgården ---------- */
export const PLANTS = {
  carrot: { n: 'morot', stages: ['🟤', '🌱', '🌿', '🥕'], harvest: 'carrot', fact: 'Moroten är en rot. Det vi äter växer under jorden!' },
  tomato: { n: 'tomat', stages: ['🟤', '🌱', '🌿', '🍅'], harvest: 'tomato', fact: 'Tomaten är egentligen en frukt eftersom den har frön inuti.' },
  sunflower: { n: 'solros', stages: ['🟤', '🌱', '🌿', '🌻'], harvest: 'sunseeds', fact: 'Solrosen vänder sig mot solen när den är ung. Den kan bli högre än en vuxen!' },
  strawberry: { n: 'jordgubbe', stages: ['🟤', '🌱', '☘️', '🍓'], harvest: 'strawberry', fact: 'Jordgubben har sina frön på utsidan – ungefär 200 stycken!' },
  pumpkin: { n: 'pumpa', stages: ['🟤', '🌱', '🌿', '🎃'], harvest: 'pumpkin', fact: 'Pumpor växer på långa revor längs marken och kan bli jättestora.' },
  potato: { n: 'potatis', stages: ['🟤', '🌱', '🌿', '🥔'], harvest: 'potato', fact: 'Potatisen är en knöl som växer under jorden. Man sätter en potatis i jorden och får många nya!' },
  peas: { n: 'ärt', stages: ['🟤', '🌱', '🌿', '🫛'], harvest: 'peas', fact: 'Ärtorna växer i en balja, som en liten grön ficka med flera ärtor i.' },
  corn: { n: 'majs', stages: ['🟤', '🌱', '🌾', '🌽'], harvest: 'corn', fact: 'Majs är faktiskt ett slags gräs! En majskolv har hundratals korn.' },
  tulip: { n: 'tulpan', stages: ['🟤', '🌱', '🌿', '🌷'], harvest: 'tulip', fact: 'Tulpaner växer upp ur en lök. Lökarna sätts i jorden på hösten och blommar på våren.' },
  melon: { n: 'vattenmelon', stages: ['🟤', '🌱', '🌿', '🍉'], harvest: 'melon', fact: 'En vattenmelon består till över 90 procent av vatten – därför är den så saftig!' },
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
  { id: 'potato', e: '🥔', n: 'potatis', unit: 'st', grown: true },
  { id: 'peas', e: '🫛', n: 'ärtor', unit: 'dl', grown: true },
  { id: 'corn', e: '🌽', n: 'majs', unit: 'st', grown: true },
];
// loose: hemliga recept som hittas genom att experimentera – rätt ingredienser räcker, mängden spelar ingen roll.
export const RECIPES = [
  { id: 'pancakes', n: 'Pannkakor', e: '🥞', needs: { flour: 2, egg: 3, milk: 6 }, minLevel: 1, fact: 'Pannkakor är en klassisk svensk torsdagsmat – med ärtsoppa först!' },
  { id: 'sandwich', n: 'Smörgås', e: '🥪', needs: { bread: 1, butter: 1, cheese: 1, cucumber: 2 }, minLevel: 0, fact: 'Ordet smörgås kommer från smörklumpar som flöt upp när man kärnade smör – de såg ut som små gäss!' },
  { id: 'fruitsalad', n: 'Fruktsallad', e: '🥗', needs: { banana: 1, apple: 2, strawberry: 5 }, minLevel: 0, fact: 'Frukt ger vitaminer och energi. Ät gärna frukt varje dag.' },
  { id: 'smoothie', n: 'Smoothie', e: '🥤', needs: { banana: 2, strawberry: 4, milk: 2 }, minLevel: 1, fact: 'En smoothie är frukt som har mixats till en dryck.' },
  { id: 'cake', n: 'Kladdkaka', e: '🍰', needs: { butter: 3, sugar: 2, egg: 2, flour: 1, cocoa: 4 }, minLevel: 2, sweet: true, fact: 'Kladdkaka är en svensk uppfinning – kladdig i mitten!' },
  { id: 'soup', n: 'Pumpasoppa', e: '🍲', needs: { pumpkin: 1, carrot: 2, milk: 3 }, minLevel: 2, fact: 'Soppa av grönsaker från trädgården – från frö till tallrik!' },
  { id: 'waffles', n: 'Våfflor', e: '🧇', needs: { flour: 2, egg: 1, milk: 3, butter: 2 }, minLevel: 1, fact: 'Våffeldagen firas den 25 mars. Namnet kommer från Vårfrudagen – det lät nästan som våffeldagen!' },
  { id: 'pizza', n: 'Pizza', e: '🍕', needs: { flour: 2, tomato: 2, cheese: 2 }, minLevel: 1, fact: 'Pizzan kommer från staden Neapel i Italien.' },
  { id: 'mash', n: 'Potatismos', e: '🥣', needs: { potato: 3, milk: 2, butter: 1 }, minLevel: 1, fact: 'Potatis kom till Sverige från Sydamerika för ungefär 300 år sedan.' },
  { id: 'popcorn', n: 'Popcorn', e: '🍿', needs: { corn: 1, butter: 1 }, minLevel: 0, fact: 'Popcorn poppar för att vattnet inne i kornet blir till ånga och spränger skalet. Pop!' },
  { id: 'peasoup', n: 'Ärtsoppa', e: '🫕', needs: { peas: 4, carrot: 1 }, minLevel: 2, fact: 'Ärtor är fulla av protein, som musklerna behöver för att växa.' },
  // hemliga recept (står inte i receptboken)
  { id: 'icecream', n: 'Jordgubbsglass', e: '🍨', needs: { milk: 1, sugar: 1, strawberry: 1 }, loose: true, secret: true, sweet: true, fact: 'Glass görs av mjölk eller grädde som fryses medan man rör om, så att det blir krämigt.' },
  { id: 'bananapancakes', n: 'Bananplättar', e: '🫓', needs: { banana: 1, egg: 1 }, loose: true, secret: true, fact: 'Bara banan och ägg – två ingredienser blir små plättar!' },
  { id: 'monstersandwich', n: 'Monstermacka', e: '👾', needs: { bread: 1, banana: 1, cheese: 1 }, loose: true, secret: true, fact: 'Banan och ost på en macka? Konstigt – men någon tycker säkert att det är gott!' },
];
/** Jämför skålens innehåll med ett recept. Exakta recept först, sedan de hemliga (lösa). */
export function matchRecipe(bowl) {
  const keys = Object.keys(bowl).filter((k) => bowl[k] > 0);
  const same = (r) => {
    const need = Object.keys(r.needs);
    return need.length === keys.length && need.every((k) => (r.loose ? bowl[k] > 0 : bowl[k] === r.needs[k]));
  };
  return RECIPES.find((r) => !r.loose && same(r)) || RECIPES.find((r) => r.loose && same(r)) || null;
}
/** Recept som visas i receptboken för en viss nivå. */
export const bookRecipes = (level) => RECIPES.filter((r) => !r.secret && r.minLevel <= level + 1);

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
  { needs: ['red', 'yellow', 'white'], n: 'persika', hex: '#fdba74' },
  { needs: ['yellow', 'blue', 'white'], n: 'mintgrön', hex: '#86efac' },
  { needs: ['red', 'blue', 'white'], n: 'ljuslila', hex: '#c4b5fd' },
  { needs: ['yellow', 'black'], n: 'olivgrön', hex: '#4d5b1f' },
  { needs: ['yellow', 'blue', 'black'], n: 'mörkgrön', hex: '#14532d' },
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

/* ---------- Bondgården ---------- */
// diet: 'växtätare' | 'allätare' | 'köttätare'. likes = maten djuret vill ha.
// ph = nyckel till ett riktigt foto (src/ui/img.js, samma nycklar som emoji-photos.js). Saknas fotot visas emojin.
export const FARM_FOODS = [
  { id: 'grass', ph: 'ho', e: '🌿', n: 'gräs och hö' },
  { id: 'grain', ph: 'obj-wheat', e: '🌾', n: 'säd' },
  { id: 'corn', ph: 'obj-corn', e: '🌽', n: 'majs' },
  { id: 'carrot', ph: 'obj-carrot', e: '🥕', n: 'morot' },
  { id: 'apple', ph: 'obj-apple', e: '🍎', n: 'äpple' },
  { id: 'lettuce', ph: 'sallat', e: '🥬', n: 'sallad' },
  { id: 'worm', ph: 'daggmask', e: '🪱', n: 'mask' },
  { id: 'fish', ph: 'obj-fish', e: '🐟', n: 'fisk' },
  { id: 'milk', ph: 'obj-milk', e: '🥛', n: 'mjölk' },
];
export const FARM_ANIMALS = [
  { id: 'cow', ph: 'obj-cow', e: '🐄', n: 'kon', sound: 'Muu!', diet: 'växtätare', likes: ['grass', 'grain', 'corn'], no: ['worm', 'fish'], product: 'milk', fact: 'Kon är en idisslare: hon tuggar maten en gång till efteråt. Magen har fyra delar.' },
  { id: 'horse', ph: 'obj-horse', e: '🐎', n: 'hästen', sound: 'Gnägg!', diet: 'växtätare', likes: ['grass', 'grain', 'carrot', 'apple'], no: ['worm', 'fish'], fact: 'Hästen kan slumra stående, men för att sova djupt lägger den sig ner.' },
  { id: 'sheep', ph: 'obj-sheep', e: '🐑', n: 'fåret', sound: 'Bää!', diet: 'växtätare', likes: ['grass', 'grain'], no: ['worm', 'fish'], product: 'wool', fact: 'Fårets ull växer hela tiden. Den klipps en eller två gånger om året och blir till garn.' },
  { id: 'goat', ph: 'obj-goat', e: '🐐', n: 'geten', sound: 'Mää!', diet: 'växtätare', likes: ['grass', 'grain', 'carrot', 'apple', 'lettuce'], no: ['worm', 'fish'], fact: 'Getter är duktiga på att klättra och äter gärna löv och kvistar.' },
  { id: 'pig', ph: 'obj-pig', e: '🐖', n: 'grisen', sound: 'Nöff nöff!', diet: 'allätare', likes: ['grain', 'corn', 'apple', 'carrot', 'lettuce', 'worm'], no: [], fact: 'Grisar kan inte svettas så bra. Därför rullar de sig i lera för att svalka sig.' },
  { id: 'hen', ph: 'obj-chicken', e: '🐔', n: 'hönan', sound: 'Kackel kackel!', diet: 'allätare', likes: ['grain', 'corn', 'worm', 'lettuce'], no: [], product: 'egg', fact: 'En värphöna kan lägga nästan ett ägg varje dag.' },
  { id: 'duck', ph: 'grasand', e: '🦆', n: 'ankan', sound: 'Kvack!', diet: 'allätare', likes: ['grain', 'lettuce', 'worm'], no: [], fact: 'Ankans fjädrar har ett fett som gör dem vattentäta. Därför blir den inte blöt!' },
  { id: 'rabbit', ph: 'obj-rabbit', e: '🐇', n: 'kaninen', sound: 'Nam nam!', diet: 'växtätare', likes: ['grass', 'carrot', 'lettuce'], no: ['worm', 'fish'], fact: 'Kaninens tänder växer hela livet. Hö och gräs sliter ner dem.' },
  { id: 'cat', ph: 'obj-cat', e: '🐈', n: 'katten', sound: 'Mjau!', diet: 'köttätare', likes: ['fish'], no: ['grain', 'corn', 'carrot', 'apple', 'lettuce', 'milk'], fact: 'På gården jagar katter möss.' },
];
export const FARM_PRODUCTS = {
  milk: { e: '🥛', n: 'mjölk' },
  egg: { e: '🥚', n: 'ägg' },
  wool: { e: '🧶', n: 'ull' },
};
// Djur som säkert INTE ger oss produkten (getter och får kan också mjölkas, ankor lägger också ägg).
const PRODUCT_WRONG = {
  milk: ['hen', 'duck', 'pig', 'rabbit', 'cat'],
  egg: ['cow', 'horse', 'sheep', 'goat', 'pig', 'rabbit', 'cat'],
  wool: ['cow', 'horse', 'hen', 'duck', 'pig', 'cat'],
};
export const FARM_MINUTES = 10; // ett djur ger en ny produkt högst var tionde minut
export const DIETS = [
  { id: 'växtätare', e: '🌿', text: 'äter bara växter' },
  { id: 'allätare', e: '🍽️', text: 'äter både växter och djur' },
  { id: 'köttätare', e: '🍖', text: 'äter andra djur' },
];
const SPECIAL_NO = {
  'cat:milk': 'Många vuxna katter mår dåligt av mjölk. Ge katten vatten i stället!',
};
/** Hur reagerar djuret på maten? */
export function farmReaction(animalId, foodId) {
  const a = FARM_ANIMALS.find((x) => x.id === animalId);
  const f = FARM_FOODS.find((x) => x.id === foodId);
  if (!a || !f) return { ok: false, text: 'Hmm?' };
  if (a.likes.includes(foodId)) return { ok: true, text: `${a.sound} Mums, ${f.n}!` };
  const special = SPECIAL_NO[`${animalId}:${foodId}`];
  const likes = a.likes.map((id) => FARM_FOODS.find((x) => x.id === id).n);
  const list = likes.length > 1 ? `${likes.slice(0, -1).join(', ')} eller ${likes[likes.length - 1]}` : likes[0];
  if (special) return { ok: false, no: true, text: special };
  // Säkert fel mat → "nej tack". Annars (allätare) → mjukt svar: inte favoriten.
  if (a.no.includes(foodId)) return { ok: false, no: true, text: `Nej tack! ${cap1(a.n)} är ${a.diet} och vill hellre ha ${list}.` };
  return { ok: false, no: false, text: `Hmm … det är inte min favoritmat. ${cap1(a.n)} vill helst ha ${list}.` };
}
/** Kan djuret ge en produkt nu (ägg, mjölk, ull)? */
export function productReady(animal, lastAt, now = Date.now()) {
  return !!animal?.product && (!lastAt || now - lastAt >= FARM_MINUTES * 60000);
}
/** Bondens fråga – åldersanpassad biologi-fråga om djuren. */
export function farmQuestion(level, rng) {
  const lvl = Math.max(0, Math.min(4, level));
  const animals = FARM_ANIMALS;
  const kinds = lvl <= 1 ? ['product', 'eats'] : lvl === 2 ? ['eats', 'product', 'noteats'] : ['diet', 'noteats', 'eats'];
  const kind = rng.pick(kinds);
  const nOpt = lvl === 0 ? 2 : 3;
  if (kind === 'product') {
    const prods = Object.keys(FARM_PRODUCTS);
    const pid = rng.pick(prods);
    const ans = animals.find((a) => a.product === pid);
    const wrong = rng.sample(animals.filter((a) => PRODUCT_WRONG[pid].includes(a.id)), nOpt - 1);
    const pr = FARM_PRODUCTS[pid];
    return { kind, text: `Vem ger oss ${pr.n} ${pr.e}?`, say: `Vilket djur ger oss ${pr.n}?`, options: rng.shuffle([ans, ...wrong]).map((a) => ({ id: a.id, e: a.e, label: a.n })), answer: ans.id, explain: `Det är ${ans.n}. ${ans.fact}` };
  }
  if (kind === 'eats' || kind === 'noteats') {
    const a = rng.pick(animals.filter((x) => x.no.length > 0));
    const yes = FARM_FOODS.filter((f) => a.likes.includes(f.id));
    const no = FARM_FOODS.filter((f) => a.no.includes(f.id));
    if (kind === 'eats') {
      const ans = rng.pick(yes);
      const opts = rng.shuffle([ans, ...rng.sample(no, nOpt - 1)]);
      return { kind, text: `Vad vill ${a.n} ${a.e} äta?`, say: `Vad vill ${a.n} äta?`, options: opts.map((f) => ({ id: f.id, e: f.e, label: f.n })), answer: ans.id, explain: `${cap1(a.n)} är ${a.diet}. ${a.fact}` };
    }
    const ans = rng.pick(no);
    const opts = rng.shuffle([ans, ...rng.sample(yes, Math.min(yes.length, nOpt - 1))]);
    return { kind, text: `Vad vill ${a.n} ${a.e} INTE äta?`, say: `Vilken mat vill ${a.n} inte äta?`, options: opts.map((f) => ({ id: f.id, e: f.e, label: f.n })), answer: ans.id, explain: farmReaction(a.id, ans.id).text.replace(/^Nej tack! /, '') };
  }
  const a = rng.pick(animals);
  const d = DIETS.find((x) => x.id === a.diet);
  return { kind, text: `Är ${a.n} ${a.e} växtätare, allätare eller köttätare?`, say: `Är ${a.n} växtätare, allätare eller köttätare?`, options: DIETS.map((x) => ({ id: x.id, e: x.e, label: x.id })), answer: a.diet, explain: `${cap1(a.n)} är ${a.diet} – den ${d.text}.` };
}

/* ---------- Stranden: flyter eller sjunker ---------- */
export const BEACH_ITEMS = [
  { id: 'ball', e: '🏐', n: 'badbollen', floats: true, why: 'Badbollen är full av luft. Luft är mycket lättare än vatten, så den flyter.' },
  { id: 'shell', e: '🐚', n: 'snäckan', floats: false, why: 'Snäckan är gjord av kalk, som är tyngre än vatten. Den sjunker till botten.' },
  { id: 'stone', e: '🪨', n: 'stenen', floats: false, why: 'Stenen är tung för sin storlek. Den sjunker.' },
  { id: 'wood', e: '🪵', n: 'pinnen', floats: true, why: 'Trä är lättare än lika mycket vatten. Därför flyter pinnen.' },
  { id: 'feather', e: '🪶', n: 'fjädern', floats: true, why: 'Fjädern är mycket lätt och har luft mellan sina små strån. Den flyter.' },
  { id: 'coconut', e: '🥥', n: 'kokosnöten', floats: true, why: 'Kokosnöten flyter! Den kan driva över hela hav och gro på en ny strand.' },
  { id: 'anchor', e: '⚓', n: 'ankaret', floats: false, why: 'Ankaret är av järn och sjunker – det är meningen! Det håller båten kvar.' },
  { id: 'key', e: '🔑', n: 'nyckeln', floats: false, why: 'Nyckeln är av metall, och metallen är tyngre än vatten.' },
  { id: 'grape', e: '🍇', n: 'vindruvan', floats: false, why: 'Vindruvan är lite tyngre än lika mycket vatten. Den sjunker sakta.' },
  { id: 'boat', e: '⛵', n: 'leksaksbåten', floats: true, why: 'Båten är formad som ett skal med luft inuti. Då flyter den.' },
  { id: 'duck', e: '🦆', n: 'badankan', floats: true, why: 'Badankan är ihålig och full av luft.' },
  { id: 'egg', e: '🥚', n: 'ägget', floats: false, why: 'Ägget sjunker. Det behövs väldigt mycket salt i vattnet för att ett ägg ska flyta.' },
  { id: 'coin', e: '🪙', n: 'myntet', floats: false, why: 'Myntet är litet men tätt och tungt för sin storlek.' },
  { id: 'sponge', e: '🧽', n: 'tvättsvampen', floats: true, why: 'Svampen har massor av små hål med luft.' },
];

/** Ligger punkten (procent av scenen) i havet? Strandkanten går snett från (40 %, 40 %) till (50 %, 100 %). */
export function inSea(x, y) {
  return y > 42 && x > 40 + (y - 40) / 6;
}

/** Namn och bild för saker i förrådet (skörd, ägg, mjölk, ull). */
const PANTRY_EXTRA = { sunseeds: { e: '🌻', n: 'solrosfrön' }, tulip: { e: '🌷', n: 'tulpaner' }, melon: { e: '🍉', n: 'vattenmelon' } };
export function pantryInfo(id) {
  const ing = INGREDIENTS.find((i) => i.id === id);
  if (ing) return { e: ing.e, n: ing.n };
  return FARM_PRODUCTS[id] || PANTRY_EXTRA[id] || null;
}

/* ---------- Skolan: små uppgifter på tavlan ---------- */
// Ord med bild, genus och plural (för bokstäver, ordbilder, en/ett och plural).
export const WORDS = [
  { w: 'sol', e: '☀️', g: 'en', pl: 'solar' },
  { w: 'katt', e: '🐈', g: 'en', pl: 'katter' },
  { w: 'hus', e: '🏠', g: 'ett', pl: 'hus' },
  { w: 'bil', e: '🚗', g: 'en', pl: 'bilar' },
  { w: 'mus', e: '🐭', g: 'en', pl: 'möss' },
  { w: 'fisk', e: '🐟', g: 'en', pl: 'fiskar' },
  { w: 'ko', e: '🐄', g: 'en', pl: 'kor' },
  { w: 'boll', e: '⚽', g: 'en', pl: 'bollar' },
  { w: 'äpple', e: '🍎', g: 'ett', pl: 'äpplen' },
  { w: 'orm', e: '🐍', g: 'en', pl: 'ormar' },
  { w: 'tåg', e: '🚂', g: 'ett', pl: 'tåg' },
  { w: 'nyckel', e: '🔑', g: 'en', pl: 'nycklar' },
  { w: 'lampa', e: '💡', g: 'en', pl: 'lampor' },
  { w: 'get', e: '🐐', g: 'en', pl: 'getter' },
  { w: 'ros', e: '🌹', g: 'en', pl: 'rosor' },
  { w: 'uggla', e: '🦉', g: 'en', pl: 'ugglor' },
  { w: 'banan', e: '🍌', g: 'en', pl: 'bananer' },
  { w: 'hatt', e: '🎩', g: 'en', pl: 'hattar' },
  { w: 'måne', e: '🌙', g: 'en', pl: 'månar' },
  { w: 'stjärna', e: '⭐', g: 'en', pl: 'stjärnor' },
  { w: 'räv', e: '🦊', g: 'en', pl: 'rävar' },
  { w: 'gris', e: '🐖', g: 'en', pl: 'grisar' },
  { w: 'apa', e: '🐒', g: 'en', pl: 'apor' },
  { w: 'båt', e: '⛵', g: 'en', pl: 'båtar' },
  { w: 'ägg', e: '🥚', g: 'ett', pl: 'ägg' },
  { w: 'hund', e: '🐕', g: 'en', pl: 'hundar' },
  { w: 'tomat', e: '🍅', g: 'en', pl: 'tomater' },
  { w: 'cykel', e: '🚲', g: 'en', pl: 'cyklar' },
  { w: 'moln', e: '☁️', g: 'ett', pl: 'moln' },
  { w: 'träd', e: '🌳', g: 'ett', pl: 'träd' },
  { w: 'lejon', e: '🦁', g: 'ett', pl: 'lejon' },
  { w: 'får', e: '🐑', g: 'ett', pl: 'får' },
  { w: 'hjärta', e: '❤️', g: 'ett', pl: 'hjärtan' },
  { w: 'paraply', e: '☂️', g: 'ett', pl: 'paraplyer' },
  { w: 'flygplan', e: '✈️', g: 'ett', pl: 'flygplan' },
  { w: 'elefant', e: '🐘', g: 'en', pl: 'elefanter' },
  { w: 'pingvin', e: '🐧', g: 'en', pl: 'pingviner' },
  { w: 'jordgubbe', e: '🍓', g: 'en', pl: 'jordgubbar' },
];
export const SHAPES = [
  { id: 'circle', n: 'cirkel', corners: 0, minLevel: 0 },
  { id: 'triangle', n: 'triangel', corners: 3, minLevel: 0 },
  { id: 'square', n: 'kvadrat', corners: 4, minLevel: 0 },
  { id: 'rect', n: 'rektangel', corners: 4, minLevel: 1 },
  { id: 'pentagon', n: 'femhörning', corners: 5, minLevel: 3 },
  { id: 'hexagon', n: 'sexhörning', corners: 6, minLevel: 3 },
];
export const SOLIDS = [
  { id: 'sphere', n: 'klot', g: 'ett', e: '⚽', thing: 'en fotboll' },
  { id: 'cylinder', n: 'cylinder', g: 'en', e: '🥫', thing: 'en burk' },
  { id: 'cone', n: 'kon', g: 'en', e: '🍦', thing: 'en glasstrut' },
  { id: 'cuboid', n: 'rätblock', g: 'ett', e: '📦', thing: 'en kartong' },
];
export const UNITS = [
  { q: '1 meter är lika med hur många centimeter?', a: 100, wrong: [10, 1000], explain: '1 meter = 100 centimeter. "Centi" betyder hundradel.' },
  { q: '2 meter är lika med hur många centimeter?', a: 200, wrong: [20, 102], explain: '1 meter = 100 cm, så 2 meter = 200 cm.' },
  { q: '1 kilogram är lika med hur många gram?', a: 1000, wrong: [10, 100], explain: '1 kilogram = 1000 gram. "Kilo" betyder tusen.' },
  { q: '1 liter är lika med hur många deciliter?', a: 10, wrong: [100, 5], explain: '1 liter = 10 deciliter. "Deci" betyder tiondel.' },
  { q: '1 timme är lika med hur många minuter?', a: 60, wrong: [100, 30], explain: 'En timme har 60 minuter.' },
  { q: '1 minut är lika med hur många sekunder?', a: 60, wrong: [100, 10], explain: 'En minut har 60 sekunder.' },
  { q: '1 vecka är lika med hur många dagar?', a: 7, wrong: [5, 10], explain: 'En vecka har 7 dagar: måndag till söndag.' },
  { q: '1 decimeter är lika med hur många centimeter?', a: 10, wrong: [100, 5], explain: '1 decimeter = 10 centimeter.' },
  { q: 'Ett halvt kilo är lika med hur många gram?', a: 500, wrong: [50, 100], explain: '1 kilo = 1000 gram. Hälften av 1000 är 500.' },
  { q: 'En halv liter är lika med hur många deciliter?', a: 5, wrong: [50, 2], explain: '1 liter = 10 dl. Hälften av 10 är 5.' },
];
export const SCHOOL_SUBJECTS = [
  { id: 'math', n: 'Räkna', e: '🔢' },
  { id: 'words', n: 'Ord', e: '🔤' },
  { id: 'shapes', n: 'Former', e: '🔺' },
  { id: 'measure', n: 'Mäta', e: '📏' },
];
const opt = (value, label = String(value), extra = {}) => ({ value, label, ...extra });

/** En uppgift på skoltavlan. Returnerar { subject, text, say, show?, options:[{value,label,…}], answer, explain }. */
export function schoolTask(level, rng, subject = rng.pick(SCHOOL_SUBJECTS).id) {
  const lvl = Math.max(0, Math.min(4, level));
  const nOpt = lvl === 0 ? 2 : 3;
  const nums = (ans, o = {}) => numberOptions(rng, ans, nOpt, { min: 0, ...o }).map((v) => opt(v));
  if (subject === 'math') {
    if (lvl === 0) {
      const n = rng.int(1, 5);
      const e = rng.pick(['🍎', '⭐', '🐟', '🎈', '🐞']);
      return { subject, text: 'Hur många?', show: e.repeat(n), say: 'Hur många är det? Räkna!', options: nums(n, { min: 1, max: 6 }), answer: n, explain: `Det är ${n}.` };
    }
    if (lvl === 1) {
      const a = rng.int(1, 6);
      const b = rng.int(1, 4);
      if (rng.chance(0.5)) return { subject, text: `${a} + ${b} = ?`, show: '🍎'.repeat(a) + ' + ' + '🍎'.repeat(b), say: `Vad är ${a} plus ${b}?`, options: nums(a + b, { max: 10 }), answer: a + b, explain: `${a} + ${b} = ${a + b}.` };
      const big = a + b;
      return { subject, text: `${big} − ${b} = ?`, say: `Vad är ${big} minus ${b}?`, options: nums(a, { max: 10 }), answer: a, explain: `${big} − ${b} = ${a}.` };
    }
    if (lvl === 2) {
      const a = rng.int(3, 12);
      const b = rng.int(2, 8);
      if (rng.chance(0.5)) return { subject, text: `${a} + ${b} = ?`, say: `Vad är ${a} plus ${b}?`, options: nums(a + b, { max: 20 }), answer: a + b, explain: `${a} + ${b} = ${a + b}.` };
      return { subject, text: `${a + b} − ${b} = ?`, say: `Vad är ${a + b} minus ${b}?`, options: nums(a, { max: 20 }), answer: a, explain: `${a + b} − ${b} = ${a}.` };
    }
    if (lvl === 3) {
      const k = rng.int(0, 2);
      if (k === 0) {
        const a = rng.int(2, 9) * 10;
        const b = rng.int(1, 9);
        return { subject, text: `${a} + ${b} = ?`, say: `Vad är ${a} plus ${b}?`, options: nums(a + b, { spread: 10 }), answer: a + b, explain: `${a} + ${b} = ${a + b}. Tiotalen och entalen läggs ihop var för sig.` };
      }
      if (k === 1) {
        const a = rng.int(5, 25);
        return { subject, text: `Dubbelt så mycket som ${a} = ?`, say: `Vad är dubbelt så mycket som ${a}?`, options: nums(a * 2, { spread: 4 }), answer: a * 2, explain: `${a} + ${a} = ${a * 2}.` };
      }
      const a = rng.int(25, 60);
      const b = rng.int(11, 24);
      return { subject, text: `${a} − ${b} = ?`, say: `Vad är ${a} minus ${b}?`, options: nums(a - b, { spread: 10 }), answer: a - b, explain: `${a} − ${b} = ${a - b}.` };
    }
    const a = rng.int(2, 10);
    const b = rng.int(2, 10);
    if (rng.chance(0.6)) return { subject, text: `${a} × ${b} = ?`, say: `Vad är ${a} gånger ${b}?`, options: nums(a * b, { spread: Math.max(a, b) }), answer: a * b, explain: `${a} × ${b} = ${a * b}. Det är ${b} grupper med ${a} i varje.` };
    return { subject, text: `${a * b} ÷ ${a} = ?`, say: `Vad är ${a * b} delat med ${a}?`, options: nums(b, { min: 1 }), answer: b, explain: `${a * b} ÷ ${a} = ${b}, eftersom ${a} × ${b} = ${a * b}.` };
  }
  if (subject === 'words') {
    const pool = WORDS;
    if (lvl === 0) {
      const [w, other] = rng.sample(pool.filter((x) => !'åäö'.includes(x.w[0])), 2);
      const pickOther = other.w[0] === w.w[0] ? pool.find((x) => x.w[0] !== w.w[0]) : other;
      const L = w.w[0].toUpperCase();
      return { subject, text: `Vilken bild börjar på ${L}?`, show: L, say: `Vilken bild börjar på bokstaven ${L}?`, options: rng.shuffle([opt(w.w, w.e, { pic: true }), opt(pickOther.w, pickOther.e, { pic: true })]), answer: w.w, explain: `${cap1(w.w)} börjar på ${L}.` };
    }
    if (lvl === 1) {
      const w = rng.pick(pool);
      const L = w.w[0].toUpperCase();
      const letters = new Set([L]);
      const abc = 'ABDEFGHIJKLMNOPRSTUVÅÄÖ';
      while (letters.size < nOpt) letters.add(abc[rng.int(0, abc.length - 1)]);
      return { subject, text: 'Vilken bokstav börjar ordet på?', show: w.e, say: `Vilken bokstav börjar ${w.w} på?`, options: rng.shuffle([...letters]).map((l) => opt(l)), answer: L, explain: `${cap1(w.w)} börjar på ${L}.` };
    }
    if (lvl === 2) {
      const [w, ...rest] = rng.sample(pool, 3);
      return { subject, text: 'Vilket ord passar till bilden?', show: w.e, say: 'Vilket ord passar till bilden? Läs orden.', options: rng.shuffle([w, ...rest]).map((x) => opt(x.w)), answer: w.w, explain: `Bilden visar ${w.g} ${w.w}.` };
    }
    if (lvl === 3) {
      const w = rng.pick(pool);
      if (rng.chance(0.5)) return { subject, text: `___ ${w.w}`, show: w.e, say: `Heter det en ${w.w} eller ett ${w.w}?`, options: [opt('en'), opt('ett')], answer: w.g, explain: `Det heter ${w.g} ${w.w}.` };
      return pluralTask(w, rng, subject);
    }
    if (rng.chance(0.5)) return pluralTask(rng.pick(pool), rng, subject);
    const words = rng.sample(pool, 3);
    const first = [...words].sort((a, b) => a.w.localeCompare(b.w, 'sv'))[0];
    return { subject, text: 'Vilket ord kommer först i alfabetet?', say: 'Vilket ord kommer först i alfabetet?', options: words.map((x) => opt(x.w)), answer: first.w, explain: `${cap1(first.w)} kommer först, ${firstLetterExplain(words, first)}` };
  }
  if (subject === 'shapes') {
    const shapes = SHAPES.filter((s) => s.minLevel <= lvl);
    if (lvl <= 1) {
      const [s, ...rest] = rng.sample(shapes, nOpt);
      return { subject, text: `Vilken är en ${s.n}?`, say: `Vilken form är en ${s.n}?`, options: rng.shuffle([s, ...rest]).map((x) => opt(x.id, x.n, { shape: x.id })), answer: s.id, explain: shapeExplain(s) };
    }
    if (lvl === 4 && rng.chance(0.5)) {
      const [s, ...rest] = rng.sample(SOLIDS, 3);
      return { subject, text: `Vilken form har ${s.thing}?`, show: s.e, say: `Vilken form har ${s.thing}?`, options: rng.shuffle([s, ...rest]).map((x) => opt(x.id, x.n)), answer: s.id, explain: `${cap1(s.thing)} har formen av ${s.g} ${s.n}.` };
    }
    const s = rng.pick(shapes.filter((x) => x.corners > 0));
    return { subject, text: `Hur många hörn har en ${s.n}?`, show: { shape: s.id }, say: `Hur många hörn har en ${s.n}?`, options: nums(s.corners, { min: 2, max: 8 }), answer: s.corners, explain: shapeExplain(s) };
  }
  // measure
  if (lvl <= 1) {
    const lens = rng.sample([2, 3, 4, 5, 6, 7, 8, 9], nOpt);
    const longest = lvl === 0 || rng.chance(0.5);
    const ans = longest ? Math.max(...lens) : Math.min(...lens);
    return { subject, text: longest ? 'Vilken är längst?' : 'Vilken är kortast?', say: longest ? 'Vilken pinne är längst?' : 'Vilken pinne är kortast?', options: lens.map((l) => opt(l, '', { bar: l })), answer: ans, explain: longest ? 'Den längsta pinnen sticker ut längst.' : 'Den kortaste pinnen är minst lång.' };
  }
  if (lvl === 2 || (lvl === 3 && rng.chance(0.5))) {
    const len = rng.int(2, 10);
    return { subject, text: 'Hur lång är pennan?', show: { ruler: len }, say: 'Hur många centimeter lång är pennan? Titta på linjalen.', options: nums(len, { min: 1, max: 12 }).map((o) => ({ ...o, label: `${o.value} cm` })), answer: len, explain: `Pennan börjar vid 0 och slutar vid ${len}. Den är ${len} cm lång.` };
  }
  if (lvl === 3) {
    const sets = [
      ['🐘', 'elefanten', '🐈', 'katten', '🐁', 'musen'],
      ['🚌', 'bussen', '🚲', 'cykeln', '🛴', 'sparkcykeln'],
      ['🍉', 'vattenmelonen', '🍎', 'äpplet', '🍓', 'jordgubben'],
    ];
    const s = rng.pick(sets);
    const items = [0, 1, 2].map((i) => ({ e: s[i * 2], n: s[i * 2 + 1], rank: i }));
    const heavy = rng.chance(0.5);
    const ans = heavy ? items[0] : items[2];
    return { subject, text: heavy ? 'Vilken är tyngst?' : 'Vilken är lättast?', say: heavy ? 'Vilken väger mest?' : 'Vilken väger minst?', options: rng.shuffle(items).map((x) => opt(x.n, x.e, { pic: true })), answer: ans.n, explain: `${cap1(ans.n)} väger ${heavy ? 'mest' : 'minst'}. Massa mäter man i gram och kilogram.` };
  }
  const u = rng.pick(UNITS);
  return { subject, text: u.q, say: u.q, options: rng.shuffle([u.a, ...u.wrong]).map((v) => opt(v)), answer: u.a, explain: u.explain };
}
function pluralTask(w, rng, subject) {
  const stem = w.w.replace(/[ae]$/, '');
  const cands = new Set([w.pl]);
  for (const suf of ['ar', 'er', 'or', 'n', 's']) {
    const v = (suf === 'n' ? w.w : stem) + suf;
    if (v !== w.pl) cands.add(v);
    if (cands.size >= 3) break;
  }
  const wrong = [...cands].filter((x) => x !== w.pl).slice(0, 2);
  return { subject, text: `${w.g} ${w.w} – två ___`, show: `${w.e} ${w.e}`, say: `${w.g} ${w.w}. Hur säger man när det är två?`, options: rng.shuffle([w.pl, ...wrong]).map((x) => opt(x)), answer: w.pl, explain: `${cap1(w.g)} ${w.w}, två ${w.pl}.` };
}
function firstLetterExplain(words, first) {
  const others = words.filter((x) => x !== first);
  const sameStart = others.some((o) => o.w[0] === first.w[0]);
  return sameStart ? 'eftersom man jämför bokstav för bokstav tills orden skiljer sig.' : `eftersom ${first.w[0].toUpperCase()} kommer före ${others.map((o) => o.w[0].toUpperCase()).join(' och ')} i alfabetet.`;
}
function shapeExplain(s) {
  if (s.id === 'circle') return 'En cirkel är rund och har inga hörn.';
  if (s.id === 'square') return 'En kvadrat har fyra lika långa sidor och fyra hörn.';
  if (s.id === 'rect') return 'En rektangel har fyra hörn. Två sidor är långa och två är korta.';
  return `En ${s.n} har ${s.corners} hörn och ${s.corners} sidor.`;
}
/** Skolan ger 1 mynt för var tredje rätt löst uppgift. */
export const SCHOOL_PER_COIN = 3;

/* ---------- Biblioteket: korta berättelser ---------- */
// lvl = lägsta nivå. Varje sida har en bild och en mening. Frågan kollar läsförståelsen.
export const BOOKS = [
  { id: 'katt-sol', title: 'Katten och solen', e: '🐈', lvl: 0, pages: [['🐈💤', 'Katten sover.'], ['☀️', 'Solen kommer fram.'], ['😺', 'Katten blir varm och glad.']], q: { text: 'Vem sov?', options: [['katten', '🐈'], ['hunden', '🐕']], answer: 'katten', explain: 'Det var katten som sov i solen.' } },
  { id: 'anka', title: 'Ankan badar', e: '🦆', lvl: 0, pages: [['🦆', 'Här är en liten anka.'], ['💦', 'Ankan hoppar i vattnet. Plask!'], ['🦆🦆', 'Ankan simmar till sin mamma.']], q: { text: 'Vart hoppade ankan?', options: [['i vattnet', '💧'], ['i trädet', '🌳']], answer: 'i vattnet', explain: 'Ankan hoppade i vattnet – plask!' } },
  { id: 'ballong', title: 'Den röda ballongen', e: '🎈', lvl: 0, pages: [['🎈', 'Mio har en röd ballong.'], ['🌬️', 'Vinden tar ballongen!'], ['🌳', 'Ballongen fastnar i ett träd. Pappa hämtar den.']], q: { text: 'Vilken färg hade ballongen?', options: [['röd', '🔴'], ['blå', '🔵'], ['gul', '🟡']], answer: 'röd', explain: 'Mio hade en röd ballong.' } },
  { id: 'snogubbe', title: 'Snögubben', e: '☃️', lvl: 1, pages: [['❄️', 'Det har snöat hela natten.'], ['☃️', 'Ella och Leo bygger en snögubbe.'], ['🥕', 'Han får en morot till näsa och två stenar till ögon.'], ['🌷', 'På våren smälter snögubben. Kvar ligger moroten!']], q: { text: 'Vad fick snögubben till näsa?', options: [['en morot', '🥕'], ['en banan', '🍌'], ['ett äpple', '🍎']], answer: 'en morot', explain: 'Snögubben fick en morot till näsa.' } },
  { id: 'myran', title: 'Myran Mo', e: '🐜', lvl: 1, pages: [['🐜', 'Myran Mo bär ett barr.'], ['🌲', 'Barret är mycket längre än Mo.'], ['💪', 'Mo är liten men stark.'], ['🏠', 'Hon bär barret hem till stacken.']], q: { text: 'Vad bar Mo?', options: [['ett barr', '🌲'], ['ett äpple', '🍎'], ['en sten', '🪨']], answer: 'ett barr', explain: 'Mo bar ett barr. Myror kan bära saker som är mycket tyngre än de själva.' } },
  { id: 'regnet', title: 'Regnet', e: '🌧️', lvl: 1, pages: [['🌧️', 'Det regnar. Alba tar på sig stövlar.'], ['💧', 'Hon hoppar i en stor vattenpöl.'], ['🪱', 'Plask! Det skvätter på en mask.'], ['😊', 'Masken tycker om regn.']], q: { text: 'Vad hade Alba på fötterna?', options: [['stövlar', '👢'], ['sandaler', '🩴'], ['strumpor', '🧦']], answer: 'stövlar', explain: 'Alba tog på sig stövlar för att det regnade.' } },
  { id: 'hamstern', title: 'Hamstern som rymde', e: '🐹', lvl: 2, pages: [['🐹', 'Sixten har en hamster som heter Pigg.'], ['😮', 'En morgon är buren tom!'], ['🛏️', 'Sixten letar under sängen och i garderoben.'], ['🥿', 'Till slut hittar han Pigg i en toffel. Han sover gott.'], ['🔒', 'Sedan stänger Sixten buren noga.']], q: { text: 'Var hittade Sixten hamstern?', options: [['i en toffel', '🥿'], ['under sängen', '🛏️'], ['i kylskåpet', '🧊']], answer: 'i en toffel', explain: 'Pigg sov i en toffel. Sixten letade under sängen först, men där var han inte.' } },
  { id: 'fyren', title: 'Fyren', e: '🗼', lvl: 2, pages: [['🌊', 'Långt ute vid havet står en fyr.'], ['🌙', 'När det blir mörkt börjar fyren att lysa.'], ['💡', 'Ljuset visar båtarna var de farliga klipporna finns.'], ['⛵', 'Då kan båtarna segla hem utan att krocka.']], q: { text: 'Varför lyser fyren?', options: [['för att visa båtarna vägen', '⛵'], ['för att den är rädd för mörkret', '😨'], ['för att väcka fåglarna', '🐦']], answer: 'för att visa båtarna vägen', explain: 'Fyrens ljus varnar båtarna för klipporna.' } },
  { id: 'froet', title: 'Fröet', e: '🌱', lvl: 2, pages: [['🌰', 'Noor sätter ett litet frö i en kruka.'], ['💧', 'Hon vattnar och ställer krukan i solen.'], ['🌱', 'Efter en vecka kommer ett grönt skott.'], ['🌻', 'Snart är det en stor solros!']], q: { text: 'Vad behöver fröet för att växa?', options: [['vatten och ljus', '💧'], ['mörker och kyla', '🌑'], ['godis', '🍬']], answer: 'vatten och ljus', explain: 'Växter behöver vatten, ljus och näring för att växa.' } },
  { id: 'ekorren', title: 'Ekorren som glömde', e: '🐿️', lvl: 3, pages: [['🍂', 'På hösten samlar ekorren Kurre nötter och kottar.'], ['🌲', 'Han gömmer dem på många ställen i skogen.'], ['❄️', 'På vintern hittar han inte alla sina gömmor.'], ['🌳', 'Nötterna som blir kvar kan gro på våren. Så hjälper Kurre till att plantera nya träd!']], q: { text: 'Hur hjälper ekorren skogen?', options: [['Glömda nötter kan bli nya träd.', '🌳'], ['Han klipper gräset.', '✂️'], ['Han vattnar träden.', '💧']], answer: 'Glömda nötter kan bli nya träd.', explain: 'Nötterna som ekorren glömmer kan gro och bli nya träd.' } },
  { id: 'manen', title: 'Resan till månen', e: '🚀', lvl: 3, pages: [['😴', 'Vera drömmer att hon är astronaut.'], ['🚀', 'Raketen dånar och lyfter mot rymden.'], ['🌕', 'På månen är allt grått och tyst. Det finns ingen luft att andas.'], ['🦘', 'Vera hoppar jättehögt, för på månen väger man mycket mindre.'], ['🛏️', 'Sedan vaknar hon i sin säng. Vilken dröm!']], q: { text: 'Varför kunde Vera hoppa så högt?', options: [['Man väger mindre på månen.', '🌕'], ['Hon hade fjäderskor.', '👟'], ['Det blåste mycket.', '🌬️']], answer: 'Man väger mindre på månen.', explain: 'Månen drar mycket svagare än jorden. Där väger man bara ungefär en sjättedel så mycket.' } },
  { id: 'vikingen', title: 'Vikingabarnet Tove', e: '⛵', lvl: 4, pages: [['🏘️', 'För mer än tusen år sedan bodde Tove i en by vid havet.'], ['🐑', 'Hennes familj hade får, kor och en liten åker.'], ['🔥', 'På vintern satt de vid elden i långhuset och berättade sagor.'], ['⛵', 'På sommaren seglade pappa i väg med skeppet för att handla.'], ['📿', 'Han kom hem med glaspärlor och silver.']], q: { text: 'Var bodde Toves familj på vintern?', options: [['i ett långhus', '🏠'], ['i ett slott', '🏰'], ['i ett tält', '⛺']], answer: 'i ett långhus', explain: 'Vikingarna bodde i långhus med en eld i mitten.' } },
  { id: 'bina', title: 'Bina i ängen', e: '🐝', lvl: 4, pages: [['🌼', 'I ängen surrar bina från blomma till blomma.'], ['🍯', 'De samlar nektar som de gör honung av.'], ['🐝', 'När ett bi landar fastnar gult pollen på dess håriga kropp.'], ['🌸', 'Pollenet följer med till nästa blomma. Då kan blomman bilda frön och frukt.'], ['🍎', 'Utan bin skulle vi få mycket färre äpplen och jordgubbar.']], q: { text: 'Vad gör bina av nektarn?', options: [['honung', '🍯'], ['vax till ljus', '🕯️'], ['pollen', '🌼']], answer: 'honung', explain: 'Bina gör honung av nektarn från blommorna.' } },
  { id: 'droppen', title: 'Droppens resa', e: '💧', lvl: 4, pages: [['🏞️', 'En vattendroppe ligger i en sjö.'], ['☀️', 'Solen värmer, och droppen avdunstar och blir till vattenånga.'], ['☁️', 'Högt upp är det kallt. Ångan blir till små droppar som bildar ett moln.'], ['🌧️', 'Molnet blir tungt och droppen faller ner som regn.'], ['🔁', 'Den rinner i en bäck tillbaka till sjön – och resan börjar om.']], q: { text: 'Vad händer när solen värmer vattnet?', options: [['Det avdunstar.', '☁️'], ['Det fryser.', '🧊'], ['Det blir sand.', '🏖️']], answer: 'Det avdunstar.', explain: 'Värme får vatten att avdunsta och bli vattenånga. Det kallas vattnets kretslopp.' } },
];
/** Böcker som passar nivån (alla upp till en nivå över). */
export const booksForLevel = (level) => BOOKS.filter((b) => b.lvl <= level + 1);
export const BOOK_COINS = 2;

/* ---------- Hemligheter ---------- */
// Lägg ALLTID nya hemligheter sist i listan – id:t är `${scen}-${index}` och sparas.
// when: 'dark' = syns bara när lampan är släckt i huset.
export const SECRETS = {
  house: [{ x: 9, y: 86, e: '🐭' }, { x: 92, y: 20, e: '🕷️' }, { x: 50, y: 6, e: '⭐' }, { x: 72, y: 10, e: '🌟', when: 'dark' }, { x: 93, y: 74, e: '🗝️' }],
  market: [{ x: 6, y: 90, e: '🪙' }, { x: 94, y: 12, e: '🐦' }, { x: 50, y: 4, e: '🐝' }],
  kitchen: [{ x: 90, y: 88, e: '🐜' }, { x: 8, y: 14, e: '🍪' }, { x: 62, y: 18, e: '🧁' }],
  school: [{ x: 94, y: 92, e: '✏️' }, { x: 5, y: 10, e: '🍎' }, { x: 50, y: 95, e: '📎' }],
  library: [{ x: 6, y: 92, e: '🐛' }, { x: 94, y: 8, e: '📜' }, { x: 50, y: 95, e: '🗺️' }],
  farm: [{ x: 4, y: 92, e: '🐣' }, { x: 95, y: 6, e: '🌈' }, { x: 60, y: 30, e: '🐸' }],
  beach: [{ x: 6, y: 45, e: '🦀' }, { x: 94, y: 94, e: '🐚' }, { x: 50, y: 6, e: '🪁' }, { x: 30, y: 96, e: '⭐' }],
  vet: [{ x: 94, y: 88, e: '🐾' }, { x: 6, y: 12, e: '🦴' }, { x: 30, y: 94, e: '🐁' }],
  lab: [{ x: 50, y: 92, e: '🦠' }, { x: 92, y: 10, e: '🔮' }, { x: 8, y: 60, e: '🧲' }],
  garden: [{ x: 31, y: 93, e: '🐛' }, { x: 94, y: 8, e: '🦋' }, { x: 50, y: 95, e: '🪱' }, { x: 32, y: 34, e: '🐞' }],
  wardrobe: [{ x: 92, y: 90, e: '🧦' }, { x: 8, y: 10, e: '💎' }],
};
/** Villkor för hemligheter: vad måste man göra för att de ska synas? (måste gå att uppfylla) */
export const SECRET_TRIGGERS = { dark: { scene: 'house', item: 'lamp', hint: 'Släck lampan!' } };
export const SECRET_COUNT = Object.values(SECRETS).reduce((s, l) => s + l.length, 0);
/** Alla hemlighets-id:n (`scen-index`). */
export const secretIds = () => Object.entries(SECRETS).flatMap(([k, l]) => l.map((_, i) => `${k}-${i}`));

/* ---------- Figurer ---------- */
export const SKIN = ['#ffe0c7', '#f5c6a0', '#e0a77a', '#c68a5b', '#8d5a3b', '#5c3a24'];
export const HAIR_COLORS = ['#2b1d14', '#6b4226', '#c68642', '#f2d16b', '#e2553d', '#8b5cf6', '#ec4899', '#e5e7eb'];
export const HAIR_STYLES = ['kort', 'lockigt', 'tofsar', 'långt', 'flint', 'tuppkam'];
export const CLOTH_COLORS = ['#3d8bfd', '#ef4444', '#22c55e', '#facc15', '#a855f7', '#ec4899', '#f97316', '#1f2937'];
export const NAMES = ['Mio', 'Ella', 'Noor', 'Sixten', 'Alba', 'Leo', 'Ines', 'Arvid', 'Sami', 'Vera', 'Omid', 'Lova'];
export const SLOTS = ['head', 'face', 'neck', 'hand', 'back'];

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

/* ---------- Sparat läge ---------- */
export const PLAY_VERSION = 2;
export const GARDEN_POTS = 6;
const emptyPot = () => ({ plant: null, stage: 0, watered: false, wateredAt: 0 });

/** Lekstadens sparade läge (per profil). */
export function emptyPlay() {
  const inv = {};
  ITEMS.filter((i) => i.start).forEach((i) => (inv[i.id] = 1));
  return {
    v: PLAY_VERSION,
    inv,
    placed: { house: [{ uid: 'p1', item: 'bed', x: 22, y: 70 }, { uid: 'p2', item: 'lamp', x: 78, y: 58 }, { uid: 'p3', item: 'plant', x: 88, y: 76 }] },
    chars: [],
    charPos: {},
    garden: Array.from({ length: GARDEN_POTS }, emptyPot),
    pantry: {},
    colors: {},
    recipes: {},
    secrets: {},
    patients: 0,
    bought: 0,
    // v2
    farm: { lastProduct: {}, fed: {} },
    school: { solved: 0, streak: 0 },
    books: {},
    beach: {},
    quiz: { right: 0 },
    goal: null,
    earned: { day: '', n: {} },
  };
}

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const num = (v, d = 0) => (Number.isFinite(Number(v)) && v !== null && v !== '' ? Number(v) : d);
const countMap = (v) => {
  const out = {};
  if (isObj(v)) for (const [k, n] of Object.entries(v)) if (num(n) > 0) out[k] = Math.floor(num(n));
  return out;
};
const clampPct = (v, lo, hi, d) => Math.max(lo, Math.min(hi, num(v, d)));

/**
 * Gör om sparad lekdata (vilken version som helst, även trasig) till aktuellt format.
 * Bakåtkompatibelt: allt som fanns i v1 behålls; nya fält får standardvärden; okända saker rensas bort.
 */
export function normalizePlay(raw) {
  const st = emptyPlay();
  if (!isObj(raw)) return st;
  if (isObj(raw.inv)) st.inv = { ...countMap(raw.inv) };
  for (const id of Object.keys(st.inv)) if (!itemById(id)) delete st.inv[id];
  if (isObj(raw.placed)) {
    st.placed = {};
    for (const [scene, list] of Object.entries(raw.placed)) {
      if (!Array.isArray(list)) continue;
      st.placed[scene] = list
        .filter((pl) => isObj(pl) && itemById(pl.item))
        .map((pl, i) => ({ uid: String(pl.uid || `m${i}`), item: pl.item, x: clampPct(pl.x, 3, 97, 50), y: clampPct(pl.y, 5, 95, 70) }));
    }
  }
  if (Array.isArray(raw.chars)) {
    st.chars = raw.chars.filter((c) => isObj(c) && c.id).map((c) => {
      const base = newCharacter(() => 0);
      const wear = {};
      if (isObj(c.wear)) for (const s of SLOTS) if (c.wear[s] && itemById(c.wear[s])) wear[s] = c.wear[s];
      return { ...base, ...c, id: String(c.id), name: String(c.name || base.name).slice(0, 12), hair: HAIR_STYLES.includes(c.hair) ? c.hair : base.hair, wear };
    });
  }
  if (isObj(raw.charPos)) {
    for (const [scene, map] of Object.entries(raw.charPos)) {
      if (!isObj(map)) continue;
      st.charPos[scene] = {};
      for (const [cid, pos] of Object.entries(map)) if (isObj(pos)) st.charPos[scene][cid] = { x: clampPct(pos.x, 3, 97, 50), y: clampPct(pos.y, 5, 95, 70) };
    }
  }
  if (Array.isArray(raw.garden)) {
    const g = raw.garden.map((p) => (isObj(p) && PLANTS[p.plant] ? { plant: p.plant, stage: Math.max(0, Math.min(3, Math.floor(num(p.stage)))), watered: !!p.watered, wateredAt: num(p.wateredAt) } : emptyPot()));
    while (g.length < GARDEN_POTS) g.push(emptyPot());
    st.garden = g;
  }
  st.pantry = countMap(raw.pantry);
  for (const id of Object.keys(st.pantry)) if (!pantryInfo(id)) delete st.pantry[id];
  // Färgerna läses också av Rita (namn → hex). Bara kända blandningar behålls.
  if (isObj(raw.colors)) for (const m of MIXES) if (raw.colors[m.n]) st.colors[m.n] = m.hex;
  st.recipes = countMap(raw.recipes);
  for (const id of Object.keys(st.recipes)) if (!RECIPES.some((r) => r.id === id)) delete st.recipes[id];
  if (isObj(raw.secrets)) {
    const known = new Set(secretIds());
    for (const id of Object.keys(raw.secrets)) if (known.has(id) && raw.secrets[id]) st.secrets[id] = 1;
  }
  st.patients = Math.max(0, Math.floor(num(raw.patients)));
  st.bought = Math.max(0, Math.floor(num(raw.bought)));
  if (isObj(raw.farm)) st.farm = { lastProduct: isObj(raw.farm.lastProduct) ? { ...raw.farm.lastProduct } : {}, fed: countMap(raw.farm.fed) };
  if (isObj(raw.school)) st.school = { solved: Math.max(0, Math.floor(num(raw.school.solved))), streak: Math.max(0, Math.floor(num(raw.school.streak))) };
  if (isObj(raw.books)) for (const b of BOOKS) if (raw.books[b.id]) st.books[b.id] = 1;
  if (isObj(raw.beach)) for (const b of BEACH_ITEMS) if (raw.beach[b.id]) st.beach[b.id] = 1;
  if (isObj(raw.quiz)) st.quiz = { right: Math.max(0, Math.floor(num(raw.quiz.right))) };
  st.goal = typeof raw.goal === 'string' && itemById(raw.goal) ? raw.goal : null;
  if (isObj(raw.earned) && typeof raw.earned.day === 'string') st.earned = { day: raw.earned.day, n: countMap(raw.earned.n) };
  st.v = PLAY_VERSION;
  return st;
}

export const playApp = {
  id: 'play',
  name: 'Lekstaden',
  icon: '🏡',
  color: '#f97316',
  tagline: 'Lek, bygg och upptäck',
  modules: [{ id: 'studio', name: 'Skaparstudion', icon: '🎨', minLevel: 0, view: 'studio', lgr: ['bi-skapa', 'sv-text', 'ma-tal'] }, { id: 'town', name: 'Lekstaden', icon: '🏡', minLevel: 0, view: 'play', lgr: ['ma-tal', 'ma-rakna', 'ma-metod', 'ma-geo', 'ma-mat', 'no-livscykel', 'no-arter', 'no-kedja', 'no-material', 'sv-avkoda', 'pl-berattande', 'pl-sakprosa', 'bi-skapa'] }],
};
