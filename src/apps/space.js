// Rymden-appen: solsystemet, planeter, månen, dag/natt, årstider, stjärnbilder.

export const SUN = {
  id: 'solen', name: 'Solen', color: '#ffc93c',
  facts: [
    'Solen är en stjärna – ett gigantiskt klot av het gas.',
    'Ungefär 1,3 miljoner jordklot skulle få plats i solen.',
    'Solljuset tar ungefär 8 minuter att resa till jorden.',
  ],
};

// size = diameter jämfört med jorden, au = medelavstånd i astronomiska enheter.
export const PLANETS = [
  { id: 'merkurius', name: 'Merkurius', color: '#b5a99a', size: 0.38, au: 0.39, year: '88 dagar', moons: '0', facts: ['Merkurius är närmast solen och minst av alla planeter.', 'Ett år på Merkurius är bara 88 dagar långt.', 'Merkurius har ingen måne och nästan ingen luft.'] },
  { id: 'venus', name: 'Venus', color: '#f2c879', size: 0.95, au: 0.72, year: '225 dagar', moons: '0', facts: ['Venus är den hetaste planeten – varmare än en pizzaugn!', 'Venus snurrar åt andra hållet jämfört med jorden.', 'Venus lyser så starkt att den kallas aftonstjärnan, fast den är en planet.'] },
  { id: 'jorden', name: 'Jorden', color: '#3d8bfd', size: 1, au: 1, year: '365 dagar', moons: '1', facts: ['Jorden är den enda planeten där vi vet att det finns liv.', 'Ungefär sju tiondelar av jordens yta är täckt av vatten.', 'Jorden har en måne – Månen.'] },
  { id: 'mars', name: 'Mars', color: '#e2603b', size: 0.53, au: 1.52, year: '687 dagar', moons: '2', facts: ['Mars kallas den röda planeten eftersom marken är full av rost.', 'Där finns Olympus Mons, den största vulkanen i hela solsystemet.', 'Robotbilar kör omkring på Mars och undersöker marken.'] },
  { id: 'jupiter', name: 'Jupiter', color: '#d9a066', size: 11.2, au: 5.2, year: '12 år', moons: 'nästan 100', facts: ['Jupiter är störst – över 1 000 jordklot skulle få plats i den.', 'Den röda fläcken på Jupiter är en storm som är större än hela jorden.', 'Jupiter är en gasjätte – man kan inte stå på den.'] },
  { id: 'saturnus', name: 'Saturnus', color: '#e8d08a', size: 9.45, au: 9.58, year: '29 år', moons: 'flest av alla planeter', facts: ['Saturnus har vackra ringar av is och sten.', 'Saturnus är så lätt för sin storlek att den skulle flyta i ett jättestort badkar.', 'Saturnus har flest kända månar av alla planeter.'] },
  { id: 'uranus', name: 'Uranus', color: '#8fd8e0', size: 4.0, au: 19.2, year: '84 år', moons: 'ungefär 30', facts: ['Uranus ligger på sidan och rullar runt solen.', 'Uranus är en blågrön isjätte.', 'Det är väldigt kallt på Uranus, under minus 200 grader.'] },
  { id: 'neptunus', name: 'Neptunus', color: '#4b6cf0', size: 3.88, au: 30.1, year: '165 år', moons: 'ungefär 16', facts: ['Neptunus är längst bort från solen.', 'På Neptunus blåser de starkaste vindarna i solsystemet.', 'Ett år på Neptunus är 165 jordår långt.'] },
];

export const MNEMONIC = 'Mamma Vet Jag Måste Jobba Sent Under Natten';

export const SPACE_QUIZ = [
  { q: 'Vilken planet bor vi på?', a: 'Jorden', o: ['Jorden', 'Mars', 'Venus'], lvl: 0, ex: 'Vi bor på Jorden, den tredje planeten från solen.' },
  { q: 'Vad är solen?', a: 'en stjärna', o: ['en stjärna', 'en planet', 'en måne'], lvl: 0, ex: 'Solen är en stjärna. Den är närmast oss av alla stjärnor.' },
  { q: 'Vilken planet kallas den röda planeten?', a: 'Mars', o: ['Mars', 'Jupiter', 'Neptunus'], lvl: 0, ex: 'Mars är röd för att marken innehåller mycket rost.' },
  { q: 'Vilken planet har stora, fina ringar?', a: 'Saturnus', o: ['Saturnus', 'Merkurius', 'Jorden'], lvl: 0, ex: 'Saturnus ringar består av is och sten.' },
  { q: 'Vilken planet är störst?', a: 'Jupiter', o: ['Jupiter', 'Jorden', 'Mars'], lvl: 1, ex: 'Jupiter är störst – över 1 000 jordklot får plats i den.' },
  { q: 'Varför lyser månen?', a: 'solljus studsar på den', o: ['solljus studsar på den', 'den har lampor', 'den brinner'], lvl: 1, ex: 'Månen lyser inte själv. Solens ljus studsar mot den, ungefär som mot en spegel.' },
  { q: 'Hur lång tid tar det för jorden att snurra ett varv runt sig själv?', a: 'ett dygn', o: ['ett dygn', 'ett år', 'en timme'], lvl: 1, ex: 'Ett varv runt sig själv tar ett dygn – det ger dag och natt.' },
  { q: 'Hur lång tid tar det för jorden att åka ett varv runt solen?', a: 'ett år', o: ['ett år', 'ett dygn', 'en månad'], lvl: 2, ex: 'Ett varv runt solen tar ungefär 365 dagar – ett år.' },
  { q: 'Vilken planet är närmast solen?', a: 'Merkurius', o: ['Merkurius', 'Venus', 'Neptunus'], lvl: 1, ex: 'Merkurius är närmast solen.' },
  { q: 'Vem var först att gå på månen?', a: 'Neil Armstrong', o: ['Neil Armstrong', 'Pippi Långstrump', 'Isaac Newton'], lvl: 2, ex: 'Neil Armstrong gick på månen år 1969.' },
  { q: 'Varför svävar astronauterna i rymdstationen?', a: 'de faller runt jorden hela tiden', o: ['de faller runt jorden hela tiden', 'de har magneter', 'det finns ingen luft'], lvl: 3, ex: 'Rymdstationen faller runt jorden i hög fart, och allt i den faller lika fort – därför svävar man.' },
  { q: 'Vad heter stjärnan som visar var norr är?', a: 'Polstjärnan', o: ['Polstjärnan', 'Solen', 'Sirius'], lvl: 2, ex: 'Polstjärnan står nästan still på himlen och pekar mot norr.' },
  { q: 'Varför är det sommar i Sverige?', a: 'jordaxeln lutar mot solen', o: ['jordaxeln lutar mot solen', 'jorden är närmare solen', 'solen brinner mer'], lvl: 3, ex: 'Jordaxeln lutar. På sommaren lutar vår del av jorden mot solen så att solen står högt och dagarna blir långa.' },
  { q: 'Vilken planet ligger på sidan och rullar runt solen?', a: 'Uranus', o: ['Uranus', 'Mars', 'Venus'], lvl: 3, ex: 'Uranus lutar nästan 98 grader – den rullar fram!' },
  { q: 'Vad är ett ljusår?', a: 'hur långt ljuset färdas på ett år', o: ['hur långt ljuset färdas på ett år', 'ett år med mycket sol', 'en lampa i rymden'], lvl: 4, ex: 'Ljuset färdas ungefär 9 500 miljarder kilometer på ett år!' },
  { q: 'Vad heter månens fas när hela månen lyser?', a: 'fullmåne', o: ['fullmåne', 'nymåne', 'halvmåne'], lvl: 1, ex: 'Vid fullmåne ser vi hela den solbelysta sidan av månen.' },
];

export function genPlanetOrder(level, rng) {
  const count = level <= 1 ? 4 : 8;
  const planets = PLANETS.slice(0, count);
  return {
    type: 'order',
    prompt: count === 4 ? 'Tryck på de fyra planeterna närmast solen – i ordning från solen och utåt!' : 'Tryck på planeterna i ordning – från solen och utåt!',
    items: rng.shuffle(planets).map((p) => ({ id: p.id, html: `<span class="planet-dot" style="--c:${p.color};--s:${Math.max(26, Math.min(64, 26 + p.size * 4))}px"></span><span class="lbl">${p.name}</span>`, say: p.name })),
    answerOrder: planets.map((p) => p.id),
    hint: `Minnesramsa: ${MNEMONIC}.`,
    explain: `${planets.map((p) => p.name).join(', ')}.`,
  };
}

export function genSpaceQuiz(level, rng) {
  const pool = SPACE_QUIZ.filter((q) => q.lvl <= level);
  const item = rng.pick(pool);
  return {
    type: 'choice', prompt: item.q, options: rng.shuffle(item.o).map((o) => ({ id: o, label: o })), answer: item.a,
    hint: 'Tänk efter – du kan också utforska i Solsystemet.', explain: item.ex,
  };
}

/* ---------- Månens faser ---------- */
// angle 0 = nymåne (månen mellan jorden och solen), 180 = fullmåne.
export function moonPhaseName(angleDeg) {
  const a = ((angleDeg % 360) + 360) % 360;
  if (a < 22.5 || a >= 337.5) return 'nymåne';
  if (a < 67.5) return 'växande skära';
  if (a < 112.5) return 'växande halvmåne';
  if (a < 157.5) return 'växande (nästan full)';
  if (a < 202.5) return 'fullmåne';
  if (a < 247.5) return 'avtagande (nästan full)';
  if (a < 292.5) return 'avtagande halvmåne';
  return 'avtagande skära';
}
/** Andel av månskivan som är belyst sett från jorden (0–1). */
export function moonIllumination(angleDeg) {
  return (1 - Math.cos((angleDeg * Math.PI) / 180)) / 2;
}

/* ---------- Stjärnbilder ---------- */
export const CONSTELLATIONS = [
  {
    id: 'karlavagnen', name: 'Karlavagnen', also: 'en del av Stora björnen',
    stars: [[84, 42], [69, 31], [55, 33], [41, 37], [41, 54], [22, 50], [20, 31]],
    order: [0, 1, 2, 3, 4, 5, 6, 3],
    story: 'Karlavagnen ser ut som en vagn med ett långt handtag. Följer du de två stjärnorna längst fram i vagnen uppåt hittar du Polstjärnan, som visar var norr är. Förr i tiden hittade sjömän hem med hjälp av den.',
  },
  {
    id: 'kassiopeja', name: 'Kassiopeja', also: 'drottningen',
    stars: [[14, 36], [31, 62], [50, 42], [68, 64], [86, 38]],
    order: [0, 1, 2, 3, 4],
    story: 'Kassiopeja ser ut som ett W eller ett M. I en gammal grekisk saga var Kassiopeja en drottning som skröt om hur vacker hon var. Den syns hela året från Sverige.',
  },
  {
    id: 'orion', name: 'Orion', also: 'jägaren',
    stars: [[30, 18], [70, 22], [42, 50], [50, 48], [58, 46], [34, 82], [72, 80]],
    order: [0, 2, 3, 4, 1, 0, 2, 5, 6, 4],
    story: 'Orion är en jägare i grekiska sagor. Tre stjärnor på rad bildar Orions bälte. Den röda stjärnan Betelgeuse är en jättestjärna – mycket större än solen. Orion syns bäst på vinterkvällar.',
  },
  {
    id: 'lillabjornen', name: 'Lilla björnen', also: 'med Polstjärnan',
    stars: [[18, 18], [30, 30], [42, 40], [54, 50], [60, 68], [80, 70], [76, 50]],
    order: [0, 1, 2, 3, 4, 5, 6, 3],
    story: 'Den första stjärnan i Lilla björnens svans är Polstjärnan. Medan jorden snurrar ser det ut som att alla stjärnor går runt Polstjärnan – den står nästan helt still.',
  },
];

/* ---------- Dagsljus i Göteborg ---------- */
// Ungefärliga dagslängder (timmar) i Göteborg per månad, mitten av månaden.
export const GBG_DAYLIGHT = [7.2, 9.0, 11.5, 14.2, 16.6, 18.0, 17.4, 15.3, 12.7, 10.0, 7.7, 6.5];
export const MONTHS = ['januari', 'februari', 'mars', 'april', 'maj', 'juni', 'juli', 'augusti', 'september', 'oktober', 'november', 'december'];

export function seasonForMonth(m) {
  if (m === 11 || m <= 1) return 'vinter';
  if (m <= 4) return 'vår';
  if (m <= 7) return 'sommar';
  return 'höst';
}

export const spaceApp = {
  id: 'space',
  name: 'Rymden',
  icon: '🚀',
  color: '#3b3f9e',
  tagline: 'Planeter, månen och stjärnor',
  modules: [
    { id: 'solar', name: 'Solsystemet', icon: '🪐', minLevel: 0, view: 'solar', lgr: ['no-himmel'] },
    { id: 'rocket', name: 'Raketen', icon: '🚀', minLevel: 0, view: 'rocket', lgr: ['ma-tal'] },
    { id: 'quiz', name: 'Rymdquiz', icon: '❓', minLevel: 0, gen: genSpaceQuiz, lgr: ['no-himmel'] },
    { id: 'daynight', name: 'Dag & natt', icon: '🌗', minLevel: 0, view: 'daynight', lgr: ['no-himmel'] },
    { id: 'moon', name: 'Månens faser', icon: '🌙', minLevel: 1, view: 'moon', lgr: ['no-himmel'] },
    { id: 'order', name: 'Planetordning', icon: '🔢', minLevel: 1, gen: genPlanetOrder, lgr: ['no-himmel'] },
    { id: 'stars', name: 'Stjärnbilder', icon: '✨', minLevel: 1, view: 'stars', lgr: ['no-himmel', 'no-berattelse'] },
    { id: 'seasons', name: 'Varför årstider?', icon: '🌍', minLevel: 2, view: 'orbit', lgr: ['no-himmel', 'no-arstid'] },
  ],
};
