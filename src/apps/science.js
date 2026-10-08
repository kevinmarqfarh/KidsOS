// Vetenskap-appen: experiment med arbetsgången Fråga → Gissa → Testa → Förklara.

export const FLOAT_ITEMS = [
  { id: 'apple', e: '🍎', n: 'äpplet', floats: true, why: 'Äpplet flyter eftersom det har mycket luft inuti – ungefär en fjärdedel av äpplet är luft.' },
  { id: 'stone', e: '🪨', n: 'stenen', floats: false, why: 'Stenen är tung för sin storlek. Den är tätare än vatten och sjunker.' },
  { id: 'wood', e: '🪵', n: 'träbiten', floats: true, why: 'Trä är lättare än lika mycket vatten. Därför flyter båtar av trä.' },
  { id: 'key', e: '🔑', n: 'nyckeln', floats: false, why: 'Nyckeln är av metall. Metall är mycket tätare än vatten.' },
  { id: 'duck', e: '🦆', n: 'badankan', floats: true, why: 'Badankan är ihålig och full av luft, så den flyter.' },
  { id: 'coin', e: '🪙', n: 'myntet', floats: false, why: 'Ett mynt är litet men tätt och tungt för sin storlek. Det sjunker.' },
  { id: 'sponge', e: '🧽', n: 'tvättsvampen', floats: true, why: 'Svampen har massor av små hål med luft. Den flyter – tills den suger upp mycket vatten.' },
  { id: 'ice', e: '🧊', n: 'isbiten', floats: true, why: 'Is är lite lättare än vatten. Därför flyter isbitar och isberg!' },
  { id: 'spoon', e: '🥄', n: 'skeden', floats: false, why: 'Skeden är av metall och sjunker.' },
  { id: 'egg', e: '🥚', n: 'ägget', floats: false, why: 'Ett färskt ägg sjunker i vanligt vatten. Men häller man i mycket salt flyter det! Saltvatten bär mer.' },
  { id: 'orange', e: '🍊', n: 'apelsinen', floats: true, why: 'Apelsinen flyter tack vare skalet som är fullt av små luftbubblor. Utan skal sjunker den!' },
  { id: 'ball', e: '🏐', n: 'bollen', floats: true, why: 'Bollen är fylld med luft och flyter, fast den är stor.' },
];

const FOIL = '<svg viewBox="0 0 60 60" class="mini"><path d="M10 34 L18 14 L32 18 L44 10 L52 26 L48 44 L34 52 L18 48 Z" fill="#d9dde6" stroke="#8d96a8" stroke-width="2"/><path d="M18 14 L26 30 L44 10 M26 30 L48 44 M26 30 L18 48 M26 30 L10 34" stroke="#a8b0c0" stroke-width="1.5" fill="none"/></svg>';

export const MAGNET_ITEMS = [
  { id: 'clip', e: '📎', n: 'gemet', magnetic: true, why: 'Gem är gjorda av stål (järn). Järn dras till magneter.' },
  { id: 'nail', e: '🔩', n: 'skruven', magnetic: true, why: 'Skruven är av stål, som innehåller järn.' },
  { id: 'can', e: '🥫', n: 'konservburken', magnetic: true, why: 'Konservburkar är oftast gjorda av stål.' },
  { id: 'pin', e: '🧷', n: 'säkerhetsnålen', magnetic: true, why: 'Säkerhetsnålen är av stål.' },
  { id: 'pencil', e: '✏️', n: 'pennan', magnetic: false, why: 'Pennan är av trä och grafit. De dras inte till magneter.' },
  { id: 'apple', e: '🍎', n: 'äpplet', magnetic: false, why: 'Frukt är inte magnetisk.' },
  { id: 'glass', e: '🥛', n: 'glaset', magnetic: false, why: 'Glas är inte magnetiskt.' },
  { id: 'foil', e: FOIL, n: 'aluminiumfolien', magnetic: false, why: 'Överraskning! Aluminium är en metall men dras INTE till magneter. Bara vissa metaller, som järn, är magnetiska.' },
  { id: 'ring', e: '💍', n: 'guldringen', magnetic: false, why: 'Guld är en metall som inte är magnetisk.' },
  { id: 'teddy', e: '🧸', n: 'nallen', magnetic: false, why: 'Tyg och stoppning är inte magnetiskt.' },
];

export const RECYCLE_BINS = [
  { id: 'papper', label: 'Papper', html: '📦' },
  { id: 'plast', label: 'Plast', html: '🧴' },
  { id: 'metall', label: 'Metall', html: '🥫' },
  { id: 'glas', label: 'Glas', html: '🫙' },
  { id: 'mat', label: 'Matavfall', html: '🍌' },
  { id: 'pant', label: 'Pant', html: '♻️' },
];
export const RECYCLE_ITEMS = [
  { id: 'mjolk', e: '🥛', n: 'mjölkpaket', bin: 'papper' },
  { id: 'tidning', e: '📰', n: 'tidning', bin: 'papper' },
  { id: 'kartong', e: '📦', n: 'kartong', bin: 'papper' },
  { id: 'banan', e: '🍌', n: 'bananskal', bin: 'mat' },
  { id: 'agg', e: '🥚', n: 'äggskal', bin: 'mat' },
  { id: 'apple', e: '🍏', n: 'skrutt', bin: 'mat' },
  { id: 'syltburk', e: '🫙', n: 'syltburk', bin: 'glas' },
  { id: 'vinflaska', e: '🍾', n: 'glasflaska', bin: 'glas' },
  { id: 'konserv', e: '🥫', n: 'konservburk', bin: 'metall' },
  { id: 'lock', e: '🔘', n: 'metallock', bin: 'metall' },
  { id: 'pase', e: '🛍️', n: 'plastpåse', bin: 'plast' },
  { id: 'schampo', e: '🧴', n: 'schampoflaska', bin: 'plast' },
  { id: 'burk', e: '🥤', n: 'läskburk med pant', bin: 'pant' },
  { id: 'pet', e: '🍼', n: 'PET-flaska med pant', bin: 'pant' },
];
export function genRecycle(level, rng) {
  const bins = level === 0 ? rng.sample(RECYCLE_BINS.filter((b) => b.id !== 'pant'), 2) : level === 1 ? rng.sample(RECYCLE_BINS, 3) : rng.sample(RECYCLE_BINS, 4);
  const items = rng.sample(RECYCLE_ITEMS.filter((i) => bins.some((b) => b.id === i.bin)), level === 0 ? 4 : 6);
  return {
    type: 'sort',
    prompt: 'Källsortera skräpet! Var ska det slängas?',
    bins,
    items: items.map((i) => ({ id: i.id, html: `<span class="pic sm">${i.e}</span><span class="lbl">${i.n}</span>`, bin: i.bin, say: i.n })),
    hint: 'Vad är saken gjord av? Papper, plast, metall eller glas? Är det mat?',
    explain: 'När vi sorterar kan materialet återvinnas och bli nya saker. Burkar och flaskor med pant lämnar man tillbaka i affären och får pengar.',
  };
}

// Friktionstal (förenklade) för rutschkanan.
export const SURFACES = [
  { id: 'is', n: 'Is', e: '🧊', mu: 0.03, color: '#d4f1ff' },
  { id: 'plast', n: 'Plast', e: '🛝', mu: 0.12, color: '#ff9f1c' },
  { id: 'tra', n: 'Trä', e: '🪵', mu: 0.3, color: '#c58b4f' },
  { id: 'matta', n: 'Matta', e: '🧶', mu: 0.5, color: '#b06bff' },
  { id: 'sand', n: 'Sandpapper', e: '🟫', mu: 0.75, color: '#c9a27a' },
];

/** Hur långt en kälke glider ut på marken efter backen (förenklad fysik). */
export function slideDistance(heightM, muSlope, muGround = 0.25, angleDeg = 30) {
  const a = (angleDeg * Math.PI) / 180;
  // Energi längs backen: m g h - μ m g cos(a) * (h / sin a)
  const lossFactor = muSlope / Math.tan(a);
  const energyAtBottom = heightM * (1 - lossFactor); // i meter "höjd"
  if (energyAtBottom <= 0) return { stuck: true, ground: 0, slopeFraction: Math.max(0, Math.min(1, 1 / Math.max(lossFactor, 1e-6))) };
  return { stuck: false, ground: energyAtBottom / muGround, slopeFraction: 1 };
}

/** Gungbräda: vridmoment (vikt × avstånd). Positiv = lutar åt höger. */
export function seesawTorque(left, right) {
  const t = (arr) => arr.reduce((s, x) => s + x.w * x.d, 0);
  return t(right) - t(left);
}

export const SEESAW_ANIMALS = [
  { id: 'mus', e: '🐭', n: 'musen', w: 1 },
  { id: 'katt', e: '🐱', n: 'katten', w: 2 },
  { id: 'hund', e: '🐶', n: 'hunden', w: 3 },
  { id: 'gris', e: '🐷', n: 'grisen', w: 4 },
];

export const SEESAW_MISSIONS = [
  { text: 'Sätt katten på ena sidan och en annan katt på andra sidan – lika långt ut. Blir det jämvikt?', check: (L, R) => L.length === 1 && R.length === 1 && L[0].w === R[0].w && L[0].d === R[0].d },
  { text: 'Få gungbrädan i jämvikt med musen och katten. Tips: den lätta ska sitta längre ut!', check: (L, R) => [...L, ...R].length === 2 && new Set([...L, ...R].map((x) => x.w)).size === 2 && [...L, ...R].every((x) => x.w <= 2) && L.length === 1 && seesawTorque(L, R) === 0 },
  { text: 'Kan grisen balansera mot hunden + musen?', check: (L, R) => seesawTorque(L, R) === 0 && [...L, ...R].length === 3 && [...L, ...R].some((x) => x.w === 4) },
  { text: 'Fri lek! Få jämvikt med minst fyra djur.', check: (L, R) => seesawTorque(L, R) === 0 && L.length + R.length >= 4 },
];

export const scienceApp = {
  id: 'science',
  name: 'Vetenskap',
  icon: '🔬',
  color: '#13a3a0',
  tagline: 'Experimentera och undersök',
  modules: [
    { id: 'float', name: 'Flyter eller sjunker?', icon: '🛁', minLevel: 0, view: 'float', lgr: ['no-material', 'no-metod'] },
    { id: 'magnet', name: 'Magneten', icon: '🧲', minLevel: 0, view: 'magnet', lgr: ['no-material', 'no-metod'] },
    { id: 'recycle', name: 'Källsortera', icon: '♻️', minLevel: 0, gen: genRecycle, lgr: ['no-sortera'] },
    { id: 'shadow', name: 'Ljus & skugga', icon: '🔦', minLevel: 0, view: 'shadow', lgr: ['no-ljus'] },
    { id: 'water', name: 'Vattnets former', icon: '💧', minLevel: 1, view: 'water', lgr: ['no-vatten'] },
    { id: 'seesaw', name: 'Gungbrädan', icon: '⚖️', minLevel: 1, view: 'seesaw', lgr: ['no-balans'] },
    { id: 'slide', name: 'Rutschkanan', icon: '🛝', minLevel: 2, view: 'slide', lgr: ['no-friktion'] },
    { id: 'mix', name: 'Blanda & separera', icon: '🧪', minLevel: 2, view: 'mix', lgr: ['no-blandning', 'no-metod'] },
  ],
};

export const EXPERIMENT_IDS = scienceApp.modules.filter((m) => m.view).map((m) => m.id);
