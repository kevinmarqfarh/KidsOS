// Rymden-appen: solsystemet, planeter, månen, dag/natt, årstider, stjärnbilder.
import { photo, hasPhoto } from '../ui/img.js';

export const SUN = {
  id: 'solen',
  img: 'sun', name: 'Solen', color: '#ffc93c',
  facts: [
    'Solen är en stjärna – ett gigantiskt klot av het gas.',
    'Ungefär 1,3 miljoner jordklot skulle få plats i solen.',
    'Solljuset tar ungefär 8 minuter att resa till jorden.',
  ],
};

// size = diameter jämfört med jorden, au = medelavstånd i astronomiska enheter.
export const PLANETS = [
  { id: 'merkurius', img: 'mercury', name: 'Merkurius', color: '#b5a99a', size: 0.38, au: 0.39, year: '88 dagar', moons: '0', facts: ['Merkurius är närmast solen och minst av alla planeter.', 'Ett år på Merkurius är bara 88 dagar långt.', 'Merkurius har ingen måne och nästan ingen luft.'] },
  { id: 'venus', img: 'venus', name: 'Venus', color: '#f2c879', size: 0.95, au: 0.72, year: '225 dagar', moons: '0', facts: ['Venus är den hetaste planeten – varmare än en pizzaugn!', 'Venus snurrar åt andra hållet jämfört med jorden.', 'Venus lyser så starkt att den kallas aftonstjärnan, fast den är en planet.'] },
  { id: 'jorden', img: 'earth', name: 'Jorden', color: '#3d8bfd', size: 1, au: 1, year: '365 dagar', moons: '1', facts: ['Jorden är den enda planeten där vi vet att det finns liv.', 'Ungefär sju tiondelar av jordens yta är täckt av vatten.', 'Jorden har en måne – Månen.'] },
  { id: 'mars', img: 'mars', name: 'Mars', color: '#e2603b', size: 0.53, au: 1.52, year: '687 dagar', moons: '2', facts: ['Mars kallas den röda planeten eftersom marken är full av rost.', 'Där finns Olympus Mons, den största vulkanen i hela solsystemet.', 'Robotbilar kör omkring på Mars och undersöker marken.'] },
  { id: 'jupiter', img: 'jupiter', name: 'Jupiter', color: '#d9a066', size: 11.2, au: 5.2, year: '12 år', moons: 'över 100', facts: ['Jupiter är störst – över 1 000 jordklot skulle få plats i den.', 'Den röda fläcken på Jupiter är en storm som är större än hela jorden.', 'Jupiter är en gasjätte – man kan inte stå på den.'] },
  { id: 'saturnus', img: 'saturn', name: 'Saturnus', color: '#e8d08a', size: 9.45, au: 9.58, year: '29 år', moons: 'nästan 300', facts: ['Saturnus har vackra ringar av is och sten.', 'Saturnus är så lätt för sin storlek att den skulle flyta i ett jättestort badkar.', 'Saturnus har flest kända månar av alla planeter – nästan 300 stycken!'] },
  { id: 'uranus', img: 'uranus', name: 'Uranus', color: '#8fd8e0', size: 4.0, au: 19.2, year: '84 år', moons: '29', facts: ['Uranus ligger på sidan och rullar runt solen.', 'Uranus är en blågrön isjätte.', 'Det är väldigt kallt på Uranus, under minus 200 grader.'] },
  { id: 'neptunus', img: 'neptune', name: 'Neptunus', color: '#4b6cf0', size: 3.88, au: 30.1, year: '165 år', moons: '16', facts: ['Neptunus är längst bort från solen.', 'På Neptunus blåser de starkaste vindarna i solsystemet.', 'Ett år på Neptunus är 165 jordår långt.'] },
];

/** Behåller första förekomsten av varje nyckel (t.ex. jorden finns både som "Blue Marble" och som planet). */
export function uniqueBy(list, keyFn) {
  const seen = new Set();
  return list.filter((x) => {
    const k = keyFn(x);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

// Riktiga rymdfoton (NASA m.fl.) – visas i galleriet, Utforskaren och bildquizet.
// Varje nyckel finns bara en gång, annars kan bildquizet få dubbla svarsalternativ.
export const SPACE_PHOTOS = uniqueBy([
  { key: 'sun', file: 'solen', title: 'Solen', fact: 'Solen fotograferad av en satellit. De ljusa fläckarna är heta utbrott.' },
  { key: 'earth', file: 'jorden-blue-marble', title: 'Jorden från rymden', fact: 'Bilden kallas "The Blue Marble" och togs av astronauterna i Apollo 17 år 1972.' },
  { key: 'moon', file: 'fullmanen', title: 'Fullmånen', fact: 'De mörka fläckarna på månen är stora slätter av stelnad lava.' },
  { key: 'earthrise', file: 'jorduppgang', title: 'Jorden går upp bakom månen', fact: 'Astronauterna i Apollo 8 såg jorden "gå upp" över månens horisont år 1968.' },
  { key: 'astronaut', file: 'astronaut-pa-manen', title: 'Astronaut på månen', fact: 'Buzz Aldrin var den andra människan på månen, år 1969.' },
  { key: 'saturnv', file: 'saturn-v', title: 'Saturn V-raketen', fact: 'Saturn V var raketen som tog människor till månen. Den var 110 meter hög!' },
  { key: 'iss', file: 'rymdstationen', title: 'Den internationella rymdstationen', fact: 'Rymdstationen åker runt jorden ungefär 16 gånger per dygn. Astronauter bor där.' },
  { key: 'rover', file: 'perseverance', title: 'Robotbilen Perseverance på Mars', fact: 'Perseverance letar efter spår av liv på Mars och hade en liten helikopter med sig.' },
  { key: 'milkyway', file: 'vintergatan', title: 'Vintergatan', fact: 'Vintergatan är vår galax – miljarder stjärnor. Vår sol är en av dem.' },
  { key: 'pillars', file: 'skapelsens-pelare', title: 'Skapelsens pelare', fact: 'Moln av gas och stoft där nya stjärnor föds, fotograferat av ett rymdteleskop.' },
  { key: 'eclipse', file: 'solformorkelse', title: 'Solförmörkelse', fact: 'När månen hamnar precis framför solen blir det mörkt mitt på dagen.' },
  { key: 'bigdipper', file: 'karlavagnen', title: 'Karlavagnen', fact: 'Karlavagnen syns på himlen över Sverige hela året.' },
  { key: 'orion', file: 'orion', title: 'Orion', fact: 'Stjärnbilden Orion ser ut som en jägare med ett bälte av tre stjärnor.' },
  ...PLANETS.map((p) => ({ key: p.img, file: p.id, title: p.name, fact: p.facts[0] })),
], (s) => s.key);

// Foton som kan dyka upp i "Vad ser du på bilden?" – svårare motiv kräver högre nivå.
const PHOTO_QUIZ_KEYS = [
  ['moon', 2], ['sun', 2], ['earth', 2], ['iss', 2], ['astronaut', 2], ['rover', 2], ['saturnv', 2], ['milkyway', 3],
  ['eclipse', 3], ['earthrise', 3], ['bigdipper', 4], ['orion', 4], ['pillars', 4],
];

/** Bildquiz: känn igen planeter och rymdföremål på riktiga foton. Fungerar med vilken mängd foton som helst. */
export function genSpacePhoto(level, rng) {
  const pool = uniqueBy(PLANETS.filter((p) => hasPhoto(p.img)), (p) => p.img);
  if (pool.length < 3) return genSpaceQuiz(level, rng);
  if (level >= 2 && rng.chance(0.35)) {
    const allowed = new Set(PHOTO_QUIZ_KEYS.filter(([, lv]) => lv <= level).map(([k]) => k));
    // unika både på nyckel och titel så att två alternativ aldrig ser likadana ut
    const extra = uniqueBy(uniqueBy(SPACE_PHOTOS.filter((s) => allowed.has(s.key) && hasPhoto(s.key)), (s) => s.key), (s) => s.title);
    if (extra.length >= 3) {
      const t = rng.pick(extra);
      const others = rng.sample(extra.filter((x) => x.key !== t.key), 2);
      return {
        type: 'choice', prompt: 'Vad ser du på bilden?', visual: photo(t.key, { alt: '', cls: 'qphoto' }),
        options: rng.shuffle([t, ...others]).map((x) => ({ id: x.key, label: x.title })), answer: t.key,
        hint: 'Titta noga på färgerna och formen.', explain: t.fact,
      };
    }
  }
  const easy = pool.filter((p) => ['jorden', 'mars', 'saturnus', 'jupiter'].includes(p.id));
  const pl = rng.pick(level <= 0 && easy.length ? easy : pool);
  const others = rng.sample(pool.filter((x) => x.id !== pl.id), level <= 1 ? 2 : 3);
  return {
    type: 'choice', prompt: 'Vilken planet är det här?', say: 'Vilken planet är det här?', visual: photo(pl.img, { alt: '', cls: 'qphoto round' }),
    options: rng.shuffle([pl, ...others]).map((x) => ({ id: x.id, label: x.name })), answer: pl.id,
    hint: pl.id === 'saturnus' ? 'Titta på ringarna!' : pl.id === 'mars' ? 'Den är röd.' : `Ledtråd: ${pl.facts[0]}`, explain: pl.facts[0], collect: { set: 'planets', item: pl.id },
  };
}

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
  { q: 'Vad heter månens fas när hela månen lyser?', a: 'fullmåne', o: ['fullmåne', 'nymåne', 'halvmåne'], lvl: 1, ex: 'Vid fullmåne ser vi hela den solbelysta sidan av månen.', img: 'moon-full' },
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
    ...(item.img && hasPhoto(item.img) ? { visual: photo(item.img, { alt: '', cls: 'qphoto round' }) } : {}),
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

/** SVG-väg för den belysta delen av månen. a: 0 = nymåne, 180 = fullmåne. Växande = belyst till höger (norra halvklotet). */
export function moonPhasePath(a, R = 50, cx = 60, cy = 60) {
  const ang = ((a % 360) + 360) % 360;
  const k = Math.cos((ang * Math.PI) / 180); // 1 vid nymåne, -1 vid fullmåne
  const rx = Math.abs(k) * R;
  const waxing = ang <= 180;
  const top = `${cx} ${cy - R}`;
  const bot = `${cx} ${cy + R}`;
  const sideSweep = waxing ? 1 : 0; // halvcirkel på den belysta sidan
  const termSweep = waxing ? (k > 0 ? 0 : 1) : k > 0 ? 1 : 0; // terminatorn buktar mot ljuset vid skära, bort vid nästan full
  return `M ${top} A ${R} ${R} 0 0 ${sideSweep} ${bot} A ${rx} ${R} 0 0 ${termSweep} ${top} Z`;
}

/**
 * Månens åtta faser med riktiga foton (StephenGA m.fl., Wikimedia Commons). Alla foton är tagna från
 * norra halvklotet och beskurna så att hela måndisken ligger i mitten: växande måne är ljus på HÖGER sida,
 * avtagande på VÄNSTER. Nymånen syns nästan inte – där visas fullmånefotot nästan helt mörkt.
 * `angle` är mitten av fasens intervall i moonPhaseName, `short` används i quiz för de yngsta.
 */
export const MOON_PHASES = [
  { id: 'ny', name: 'nymåne', short: 'nymåne', angle: 0, key: 'moon-full', dark: true, lit: 'ingen' },
  { id: 'vskara', name: 'växande skära', short: 'skära', angle: 45, key: 'moon-waxing-crescent', lit: 'höger' },
  { id: 'vhalv', name: 'växande halvmåne', short: 'halvmåne', angle: 90, key: 'moon-first-quarter', lit: 'höger' },
  { id: 'vfull', name: 'växande (nästan full)', short: 'nästan full', angle: 135, key: 'moon-waxing-gibbous', lit: 'höger' },
  { id: 'full', name: 'fullmåne', short: 'fullmåne', angle: 180, key: 'moon-full', lit: 'hela' },
  { id: 'afull', name: 'avtagande (nästan full)', short: 'nästan full', angle: 225, key: 'moon-waning-gibbous', lit: 'vänster' },
  { id: 'ahalv', name: 'avtagande halvmåne', short: 'halvmåne', angle: 270, key: 'moon-last-quarter', lit: 'vänster' },
  { id: 'askara', name: 'avtagande skära', short: 'skära', angle: 315, key: 'moon-waning-crescent', lit: 'vänster' },
];
/** Fasen (ur MOON_PHASES) för en vinkel. */
export const moonPhaseFor = (angleDeg) => MOON_PHASES.find((p) => p.name === moonPhaseName(angleDeg));

/** Bild av en månfas: riktigt foto om det finns, annars en ritad måne. */
export function moonPhaseImage(ph, cls = '') {
  if (hasPhoto(ph.key)) return `<span class="moon-photo${ph.dark ? ' is-new' : ''} ${cls}">${photo(ph.key, { alt: ph.dark ? 'Nymåne – månen syns nästan inte' : `Foto av månen: ${ph.name}` })}</span>`;
  return `<svg viewBox="0 0 120 120" class="moon-drawn ${cls}" role="img" aria-label="${ph.name}"><circle cx="60" cy="60" r="50" fill="#22284d"/><path d="${moonPhasePath(ph.angle)}" fill="#f2efe4"/></svg>`;
}

const MOON_FACT = {
  ny: 'Vid nymåne står månen mellan jorden och solen. Den belysta sidan är vänd bort från oss, så vi ser nästan ingenting.',
  vskara: 'En smal skära som är ljus på höger sida. Den syns på kvällen strax efter att solen har gått ner.',
  vhalv: 'Halva månen är ljus – den högra halvan. Månen har gått en fjärdedel av varvet runt jorden.',
  vfull: 'Nästan hela månen lyser, och den blir större för varje kväll. Om några dagar är det fullmåne.',
  full: 'Vid fullmåne står jorden mellan solen och månen. Vi ser hela den belysta sidan.',
  afull: 'Nu krymper det ljusa. Det är den högra kanten som har blivit mörk.',
  ahalv: 'Den vänstra halvan är ljus. Den här halvmånen syns bäst tidigt på morgonen.',
  askara: 'En smal skära som är ljus på vänster sida. Snart är det nymåne igen.',
};

/** Quiz med riktiga månfoton: känn igen fasen, växande eller avtagande, och lägg faserna i ordning. */
export function genMoonPhase(level, rng) {
  const lv = Math.max(1, level);
  const visible = MOON_PHASES.filter((p) => !p.dark);
  if (lv >= 3 && rng.chance(0.35)) {
    const waxing = MOON_PHASES.slice(1, 5);
    const seq = lv >= 4 && rng.chance(0.5) ? MOON_PHASES.slice(4, 8) : waxing;
    const growing = seq === waxing;
    return {
      type: 'order',
      prompt: growing ? 'Månen växer! Lägg bilderna i ordning – från smal skära till fullmåne.' : 'Månen krymper! Lägg bilderna i ordning – från fullmåne till smal skära.',
      items: rng.shuffle(seq).map((p) => ({ id: p.id, html: `${moonPhaseImage(p, 'sm')}<span class="lbl">${p.short}</span>`, say: p.name })),
      answerOrder: seq.map((p) => p.id),
      hint: growing ? 'Den ljusa delen växer från höger. Börja med den smalaste.' : 'Den ljusa delen krymper. Börja med den runda.',
      explain: 'Det tar ungefär 29 och en halv dag från en nymåne till nästa. Halvvägs är det fullmåne.',
    };
  }
  if (lv >= 2 && rng.chance(0.45)) {
    const p = rng.pick(visible.filter((x) => x.id !== 'full'));
    const growing = p.lit === 'höger';
    return {
      type: 'choice',
      prompt: 'Växer månen eller krymper den? Titta på vilken sida som är ljus.',
      say: 'Växer månen eller krymper den? Titta på vilken sida som är ljus.',
      visual: moonPhaseImage(p, 'qmoon'),
      options: [{ id: 'vaxande', label: 'växande – den blir större' }, { id: 'avtagande', label: 'avtagande – den blir mindre' }],
      answer: growing ? 'vaxande' : 'avtagande',
      hint: 'Här i Sverige är en växande måne ljus på höger sida.',
      explain: `Det här är ${p.name}. ${MOON_FACT[p.id]}`,
    };
  }
  // Nivå 1: fullmåne, halvmåne eller skära? Högre nivåer: hela namnet.
  if (lv <= 1) {
    const kinds = ['fullmåne', 'halvmåne', 'skära'];
    const kind = rng.pick(kinds);
    const p = rng.pick(visible.filter((x) => x.short === kind));
    return {
      type: 'choice', prompt: 'Hur ser månen ut på bilden?', say: 'Hur ser månen ut på bilden? Fullmåne, halvmåne eller skära?',
      visual: moonPhaseImage(p, 'qmoon'),
      options: rng.shuffle(kinds).map((k) => ({ id: k, label: k })), answer: kind,
      hint: 'Är hela månen ljus, halva eller bara en smal bit?',
      explain: MOON_FACT[p.id],
    };
  }
  const p = rng.pick(visible);
  // Nivå 2: alternativen har olika form. Från nivå 3 kan samma form åt andra hållet vara med (växande/avtagande halvmåne).
  const pool = visible.filter((x) => x.id !== p.id && (lv >= 3 || x.short !== p.short));
  const twin = lv >= 3 ? pool.find((x) => x.short === p.short) : null;
  const others = twin ? [twin, ...rng.sample(pool.filter((x) => x !== twin), lv >= 4 ? 2 : 1)] : rng.sample(pool, lv >= 4 ? 3 : 2);
  return {
    type: 'choice', prompt: 'Vilken fas har månen på bilden?', say: 'Vilken fas har månen på bilden?',
    visual: moonPhaseImage(p, 'qmoon'),
    options: rng.shuffle([p, ...others]).map((x) => ({ id: x.id, label: x.name })), answer: p.id,
    hint: 'Hur mycket är ljust? Och är det höger eller vänster sida?',
    explain: MOON_FACT[p.id],
  };
}

/* ---------- Stjärnbilder ---------- */
export const CONSTELLATIONS = [
  {
    id: 'karlavagnen', name: 'Karlavagnen', also: 'en del av Stora björnen',
    stars: [[84, 42], [69, 31], [55, 33], [41, 37], [41, 54], [22, 50], [20, 31]],
    order: [0, 1, 2, 3, 4, 5, 6, 3],
    story: 'Karlavagnen ser ut som en vagn med ett långt handtag. Följer du de två stjärnorna längst fram i vagnen uppåt hittar du Polstjärnan, som visar var norr är. Förr i tiden hittade sjömän hem med hjälp av den.',
    culture: 'I England kallas Karlavagnen Plogen och i USA Stora sleven. I gamla Kina tittade man åt vilket håll handtaget pekade på kvällen – då visste man vilken årstid det var.',
  },
  {
    id: 'kassiopeja', name: 'Kassiopeja', also: 'drottningen',
    stars: [[14, 36], [31, 62], [50, 42], [68, 64], [86, 38]],
    order: [0, 1, 2, 3, 4],
    story: 'Kassiopeja ser ut som ett W eller ett M. I en gammal grekisk saga var Kassiopeja en drottning som skröt om hur vacker hon var. Den syns hela året från Sverige.',
    culture: 'Samerna i norra Sverige såg Kassiopeja som hornen på den stora älgen Sarvva, som jagas över himlen av jägaren Fávdna – den ljusa stjärnan Arcturus.',
  },
  {
    id: 'orion', name: 'Orion', also: 'jägaren',
    stars: [[30, 18], [70, 22], [42, 50], [50, 48], [58, 46], [34, 82], [72, 80]],
    order: [0, 2, 3, 4, 1, 0, 2, 5, 6, 4],
    story: 'Orion är en jägare i grekiska sagor. Tre stjärnor på rad bildar Orions bälte. Den röda stjärnan Betelgeuse är en jättestjärna – mycket större än solen. Orion syns bäst på vinterkvällar.',
    culture: 'I Norden kallades Orions bälte för Friggerocken, efter gudinnan Friggs slända. I Chile och resten av Sydamerika heter de tre stjärnorna Las Tres Marías – de tre Mariorna.',
  },
  {
    id: 'lillabjornen', name: 'Lilla björnen', also: 'med Polstjärnan',
    stars: [[18, 18], [30, 30], [42, 40], [54, 50], [60, 68], [80, 70], [76, 50]],
    order: [0, 1, 2, 3, 4, 5, 6, 3],
    story: 'Den första stjärnan i Lilla björnens svans är Polstjärnan. Medan jorden snurrar ser det ut som att alla stjärnor går runt Polstjärnan – den står nästan helt still.',
    culture: 'Samerna berättade att Polstjärnan är som en stolpe som håller himlen på plats. Alla andra stjärnor vandrar runt den.',
  },
  {
    id: 'sjustjarnan', name: 'Sjustjärnan', also: 'en klunga unga stjärnor',
    stars: [[78, 52], [82, 42], [60, 50], [52, 64], [34, 56], [38, 34], [46, 44]],
    order: [5, 6, 4, 3, 2, 0, 1],
    story: 'Sjustjärnan är en liten klunga av unga stjärnor. De flesta ser sex eller sju stjärnor, men med kikare syns många fler – det finns hundratals. Den syns bäst på höst- och vinterkvällar.',
    culture: 'I Nya Zeeland heter Sjustjärnan Matariki. När den syns på morgonhimlen i juni eller juli firar maorierna nyår. I Japan heter den Subaru.',
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

/* =====================================================================
   Fördjupning (Lgr22: himlakropparnas rörelser, månens faser, stjärnbilder,
   årstider, berättelser om äldre tiders naturvetenskap).
   Fakta kontrollerade mot NASA, ESA och Wikipedia (oktober 2026).
   ===================================================================== */

const pic = (e, label) => `<span class="pic sm">${e}</span><span>${label}</span>`;
const dot = (p, s = 34) => `<span class="planet-dot" style="--c:${p.color};--s:${s}px"></span>`;
const planetById = (id) => PLANETS.find((p) => p.id === id);

/** Bildfråga för förläsare: [id, emoji, etikett] – allt läses upp. */
function picQuestion(item, rng, hint) {
  return {
    type: 'choice', prompt: item.q, say: item.say || item.q,
    options: rng.shuffle(item.opts).map(([id, e, label]) => ({ id, html: pic(e, label), say: label })),
    answer: item.a, hint: item.hint || hint, explain: item.ex,
  };
}

/** Textfråga ur en bank: { q, a, o, ex }. */
function textQuestion(item, rng, hint) {
  return {
    type: 'choice', prompt: item.q, options: rng.shuffle(item.o).map((o) => ({ id: o, label: o })), answer: item.a,
    hint: item.hint || hint, explain: item.ex,
  };
}

/** Välj en fråga ur banken: helst från just den här nivån, annars från lägre nivåer. */
function pickLeveled(bank, level, rng) {
  const exact = bank.filter((q) => q.lvl === level);
  const lower = bank.filter((q) => q.lvl <= level);
  return exact.length && rng.chance(0.6) ? rng.pick(exact) : rng.pick(lower.length ? lower : bank);
}

/* ---------- Planetfakta ---------- */
export const PLANET_PIC_QUIZ = [
  { q: 'Vad lyser och värmer oss på dagen?', a: 'sol', opts: [['sol', '☀️', 'Solen'], ['mane', '🌙', 'Månen'], ['jord', '🌍', 'Jorden']], ex: 'Solen lyser och värmer oss. Den är en stjärna!' },
  { q: 'Vilken planet bor vi på?', a: 'jord', opts: [['jord', '🌍', 'Jorden'], ['sat', '🪐', 'Saturnus'], ['mane', '🌙', 'Månen']], ex: 'Vi bor på Jorden. Den har hav, land och luft att andas.' },
  { q: 'Vilken planet har stora ringar runt sig?', a: 'sat', opts: [['sat', '🪐', 'Saturnus'], ['jord', '🌍', 'Jorden'], ['mane', '🌙', 'Månen']], ex: 'Saturnus har stora ringar av is och sten.' },
  { q: 'Vilken är störst?', a: 'sol', opts: [['sol', '☀️', 'Solen'], ['jord', '🌍', 'Jorden'], ['mane', '🌙', 'Månen']], ex: 'Solen är jättestor – mer än en miljon jordklot skulle få plats i den!' },
  { q: 'Vilken är minst?', a: 'mane', opts: [['mane', '🌙', 'Månen'], ['jord', '🌍', 'Jorden'], ['sol', '☀️', 'Solen']], ex: 'Månen är mindre än jorden. Fyra månar på rad är ungefär lika breda som jorden.' },
  { q: 'Vad ser vi på himlen på natten, som ser ut att ändra form?', a: 'mane', opts: [['mane', '🌙', 'Månen'], ['sol', '☀️', 'Solen'], ['moln', '🌈', 'Regnbågen']], ex: 'Månen ser olika ut olika nätter: ibland rund, ibland som en banan.' },
  { q: 'Vad tittar man på stjärnor med?', a: 'tub', opts: [['tub', '🔭', 'ett teleskop'], ['hammare', '🔨', 'en hammare'], ['sked', '🥄', 'en sked']], ex: 'Med ett teleskop kan man se saker som är jättelångt bort.' },
  { q: 'Vad har en lång lysande svans och åker runt solen?', a: 'komet', opts: [['komet', '☄️', 'en komet'], ['jord', '🌍', 'Jorden'], ['mane', '🌙', 'Månen']], ex: 'En komet är en klump av is och damm. Nära solen får den en lång, lysande svans.' },
];

export const PLANET_FACTS = [
  { lvl: 1, q: 'Hur många planeter finns det i vårt solsystem?', a: '8', o: ['8', '5', '12'], ex: 'Åtta planeter: Merkurius, Venus, Jorden, Mars, Jupiter, Saturnus, Uranus och Neptunus.' },
  { lvl: 1, q: 'Vad är en planet?', a: 'ett stort klot som åker runt en stjärna', o: ['ett stort klot som åker runt en stjärna', 'en stjärna som blinkar', 'ett moln i rymden'], ex: 'En planet är ett stort klot som åker runt en stjärna. Jorden åker runt solen.' },
  { lvl: 1, q: 'Vad åker runt jorden?', a: 'Månen', o: ['Månen', 'Solen', 'Mars'], ex: 'Månen åker runt jorden. Ett varv tar ungefär en månad.' },
  { lvl: 1, q: 'Vad är solen?', a: 'en stjärna', o: ['en stjärna', 'en planet', 'ett moln'], ex: 'Solen är en stjärna – ett jättestort, hett klot av gas. Den är den stjärna som är närmast oss.' },
  { lvl: 1, q: 'Vilken planet är längst bort från solen?', a: 'Neptunus', o: ['Neptunus', 'Jorden', 'Merkurius'], ex: 'Neptunus är planet nummer åtta, längst ut. Där är det mörkt och iskallt.' },
  { lvl: 1, q: 'Vad finns det mest av på jordens yta?', a: 'vatten', o: ['vatten', 'sand', 'skog'], ex: 'Ungefär sju tiondelar av jordens yta är hav. Därför ser jorden blå ut från rymden.' },
  { lvl: 1, q: 'Vad är solen gjord av?', a: 'het gas', o: ['het gas', 'sten', 'is'], ex: 'Solen är ett jättestort klot av het gas. Längst in är det många miljoner grader varmt.' },
  { lvl: 2, q: 'Hur många månar har Mars?', a: '2', o: ['2', '0', '10'], ex: 'Mars har två små månar, Phobos och Deimos. De ser ut som potatisar!' },
  { lvl: 2, q: 'Vilka två planeter har inga månar alls?', a: 'Merkurius och Venus', o: ['Merkurius och Venus', 'Jorden och Mars', 'Jupiter och Saturnus'], ex: 'Merkurius och Venus, de två planeterna närmast solen, har inga månar.' },
  { lvl: 2, q: 'Vilken planet är hetast?', a: 'Venus', o: ['Venus', 'Merkurius', 'Mars'], ex: 'Venus är hetast, över 400 grader! Dess tjocka moln håller kvar värmen som ett täcke – fast Merkurius är närmare solen.' },
  { lvl: 2, q: 'Vilken planet har flest månar?', a: 'Saturnus', o: ['Saturnus', 'Mars', 'Venus'], ex: 'Saturnus har nästan 300 kända månar – fler än någon annan planet. Forskarna hittar fortfarande nya.' },
  { lvl: 2, q: 'Vilken planet kallas jordens tvilling för att den är nästan lika stor?', a: 'Venus', o: ['Venus', 'Jupiter', 'Neptunus'], ex: 'Venus är nästan lika stor som jorden, men där är det glödhett och man kan inte andas.' },
  { lvl: 3, q: 'Hur många planeter har ringar?', a: '4', o: ['4', '1', '8'], ex: 'Jupiter, Saturnus, Uranus och Neptunus har ringar. Saturnus ringar är störst och lättast att se.' },
  { lvl: 3, q: 'Vad är Saturnus ringar gjorda av?', a: 'is och sten', o: ['is och sten', 'guld', 'moln av vatten'], ex: 'Ringarna består av miljarder bitar av is och sten – från små korn till stora som hus.' },
  { lvl: 3, q: 'Vilken planet har kortast dygn?', a: 'Jupiter', o: ['Jupiter', 'Jorden', 'Venus'], ex: 'Jupiter snurrar ett varv på ungefär 10 timmar – fortast av alla planeter.' },
  { lvl: 3, q: 'På vilken planet är ett dygn längre än ett år?', a: 'Venus', o: ['Venus', 'Mars', 'Jorden'], ex: 'Venus snurrar väldigt långsamt: ett varv runt sig själv tar 243 jorddygn, men ett varv runt solen bara 225.' },
  { lvl: 3, q: 'Var finns solsystemets största vulkan, Olympus Mons?', a: 'på Mars', o: ['på Mars', 'på Jorden', 'på Månen'], ex: 'Olympus Mons på Mars är mer än dubbelt så hög som Mount Everest.' },
  { lvl: 3, q: 'Vad är Jupiters stora röda fläck?', a: 'en jättestorm', o: ['en jättestorm', 'ett hav', 'en vulkan'], ex: 'Den röda fläcken är en storm som har pågått i hundratals år. Den är större än hela jorden.' },
  { lvl: 3, q: 'Vad kallas Pluto i dag?', a: 'en dvärgplanet', o: ['en dvärgplanet', 'en stjärna', 'en komet'], ex: 'Pluto räknades förr som planet nummer nio. Sedan år 2006 kallas den en dvärgplanet.' },
  { lvl: 4, q: 'Vilken planet har den kallaste luften?', a: 'Uranus', o: ['Uranus', 'Neptunus', 'Mars'], ex: 'Fast Neptunus är längre bort har man mätt upp den kallaste luften på Uranus – ungefär minus 224 grader.' },
  { lvl: 4, q: 'Ungefär hur många jordklot på rad blir lika brett som Jupiter?', a: '11', o: ['11', '2', '100'], ex: 'Jupiter är ungefär 11 gånger så bred som jorden. Men över 1 000 jordklot skulle få plats inuti den!' },
  { lvl: 4, q: 'Ungefär hur många jordklot skulle få plats i solen?', a: '1,3 miljoner', o: ['1,3 miljoner', '100', '1 000'], ex: 'Solen är ungefär 109 gånger så bred som jorden, och 1,3 miljoner jordklot skulle få plats i den.' },
  { lvl: 4, q: 'Vilken är den största månen i solsystemet?', a: 'Ganymedes', o: ['Ganymedes', 'Månen', 'Phobos'], ex: 'Ganymedes åker runt Jupiter. Den är till och med större än planeten Merkurius!' },
  { lvl: 4, q: 'Vilken måne har sjöar – fast inte av vatten?', a: 'Titan', o: ['Titan', 'Månen', 'Deimos'], ex: 'Saturnus måne Titan har sjöar av flytande metan och etan. Där är det runt minus 180 grader.' },
  { lvl: 4, q: 'Vad håller planeterna kvar i sina banor runt solen?', a: 'solens dragningskraft', o: ['solens dragningskraft', 'vinden i rymden', 'osynliga snören'], ex: 'Solen är så tung att dess dragningskraft – gravitationen – håller kvar alla planeter.' },
];

function ratioWords(r) {
  if (r < 1.5) return 'lite bredare än';
  if (r < 2.5) return 'ungefär dubbelt så bred som';
  return `ungefär ${Math.round(r)} gånger så bred som`;
}

/** Räkneuppgifter med planetfakta (nivå 4). Svaren är heltal. */
export function planetMath(rng) {
  const kind = rng.int(0, 4);
  if (kind === 0) {
    const age = rng.pick([6, 8, 10, 12, 14]);
    return { prompt: `Ett år på Mars är ungefär 2 jordår långt. Hur gammal är du i marsår om du är ${age} jordår?`, answer: age / 2, explain: `${age} delat med 2 är ${age / 2}. Ett marsår är 687 dagar – nästan två jordår.` };
  }
  if (kind === 1) {
    const age = rng.int(5, 12);
    return { prompt: `Saturnus tar 29 år på sig att åka ett varv runt solen. Ett barn är ${age} år när Saturnus står på ett ställe. Hur gammalt är barnet när Saturnus är tillbaka där?`, answer: age + 29, explain: `${age} + 29 = ${age + 29}. Saturnus är långt bort och åker långsamt.` };
  }
  if (kind === 2) {
    return { prompt: 'Solljuset tar ungefär 8 minuter att nå jorden. Neptunus är ungefär 30 gånger längre bort. Ungefär hur många minuter tar ljuset till Neptunus?', answer: 240, explain: '30 · 8 = 240 minuter, alltså ungefär 4 timmar.' };
  }
  if (kind === 3) {
    const n = rng.int(2, 4);
    return { prompt: `Ett år på Merkurius är 88 dagar. Hur många dagar är ${n} merkuriusår?`, answer: 88 * n, explain: `${n} · 88 = ${88 * n}. Merkurius åker fortast runt solen.` };
  }
  const n = rng.int(2, 5);
  return { prompt: `Jupiter är ungefär 11 jordklot bred. Hur många jordklot på rad behövs för att bli lika brett som ${n} Jupiter?`, answer: 11 * n, explain: `${n} · 11 = ${11 * n}.` };
}

export function genPlanetFacts(level, rng) {
  if (level <= 0 || (level === 1 && rng.chance(0.3))) return picQuestion(rng.pick(PLANET_PIC_QUIZ), rng, 'Titta på bilderna och tänk efter.');
  const r = rng.next();
  // Storleksjämförelse (bara par som skiljer sig tydligt)
  if (r < 0.25) {
    let a;
    let b;
    do {
      [a, b] = rng.sample(PLANETS, 2);
    } while (Math.max(a.size, b.size) / Math.min(a.size, b.size) < 1.3);
    const big = a.size > b.size ? a : b;
    const small = big === a ? b : a;
    const askBig = level <= 2 || rng.chance(0.5);
    const ans = askBig ? big : small;
    return {
      type: 'choice', prompt: askBig ? 'Vilken planet är störst?' : 'Vilken planet är minst?',
      options: rng.shuffle([a, b]).map((p) => ({ id: p.id, html: `${dot(p)}<span>${p.name}</span>`, say: p.name })), answer: ans.id,
      hint: 'Jätteplaneterna Jupiter, Saturnus, Uranus och Neptunus är mycket större än de andra.',
      explain: `${big.name} är ${ratioWords(big.size / small.size)} ${small.name}.`, collect: { set: 'planets', item: ans.id },
    };
  }
  // Närmast/längst bort från solen
  if (r < 0.4) {
    const three = rng.sample(PLANETS, 3);
    const far = level >= 3 && rng.chance(0.5);
    const ans = three.reduce((m, p) => (far ? (p.au > m.au ? p : m) : p.au < m.au ? p : m));
    return {
      type: 'choice', prompt: far ? 'Vilken av planeterna är längst bort från solen?' : 'Vilken av planeterna är närmast solen?',
      options: rng.shuffle(three).map((p) => ({ id: p.id, html: `${dot(p)}<span>${p.name}</span>`, say: p.name })), answer: ans.id,
      hint: `Minnesramsa: ${MNEMONIC}.`,
      explain: `Ordningen från solen: ${PLANETS.map((p) => p.name).join(', ')}. ${ans.name} är planet nummer ${PLANETS.indexOf(ans) + 1}.`,
    };
  }
  // Sortera: ringar eller inte (nivå 2), stenplanet eller jätteplanet (nivå 3–4)
  if (r < 0.55 && level >= 2) {
    const giant = (p) => p.size > 2;
    if (level === 2) {
      const items = rng.sample(PLANETS, 6);
      if (!items.some(giant)) items[0] = planetById('saturnus');
      if (items.every(giant)) items[0] = planetById('jorden');
      return {
        type: 'sort', prompt: 'Vilka planeter har ringar? Sortera planeterna.',
        bins: [{ id: 'ringar', label: 'Har ringar', html: '🪐' }, { id: 'inga', label: 'Inga ringar', html: '⚪' }],
        items: items.map((p) => ({ id: p.id, html: `${dot(p, 28)}<span class="lbl">${p.name}</span>`, bin: giant(p) ? 'ringar' : 'inga', say: p.name })),
        hint: 'Alla fyra jätteplaneterna har ringar.',
        explain: 'Jupiter, Saturnus, Uranus och Neptunus har ringar. Saturnus ringar är störst – de andras är tunna och mörka.',
      };
    }
    const three = level >= 4;
    const binOf = (p) => (!giant(p) ? 'sten' : three ? (['uranus', 'neptunus'].includes(p.id) ? 'is' : 'gas') : 'jatte');
    const bins = three
      ? [{ id: 'sten', label: 'Stenplanet', html: '🪨' }, { id: 'gas', label: 'Gasjätte', html: '🌫️' }, { id: 'is', label: 'Isjätte', html: '🧊' }]
      : [{ id: 'sten', label: 'Stenplanet', html: '🪨' }, { id: 'jatte', label: 'Jätteplanet', html: '🌫️' }];
    return {
      type: 'sort', prompt: 'Sortera planeterna: vilka har fast mark och vilka är jättar av gas och is?',
      bins,
      items: rng.shuffle(PLANETS).slice(0, three ? 8 : 6).map((p) => ({ id: p.id, html: `${dot(p, 28)}<span class="lbl">${p.name}</span>`, bin: binOf(p), say: p.name })),
      hint: 'De fyra planeterna närmast solen är små och har fast mark.',
      explain: three
        ? 'Merkurius, Venus, Jorden och Mars är stenplaneter. Jupiter och Saturnus är gasjättar. Uranus och Neptunus kallas isjättar – de innehåller mycket is av vatten, ammoniak och metan.'
        : 'Merkurius, Venus, Jorden och Mars är stenplaneter med fast mark. De fyra yttre är jätteplaneter av gas och is – man kan inte stå på dem.',
    };
  }
  if (level >= 4 && r < 0.7) {
    const m = planetMath(rng);
    return { type: 'numpad', prompt: m.prompt, answer: m.answer, hint: 'Räkna steg för steg. Använd gärna papper.', explain: m.explain };
  }
  return textQuestion(pickLeveled(PLANET_FACTS, level, rng), rng, 'Tänk efter – du kan också utforska i Solsystemet.');
}

/* ---------- Rymdfärder och astronauter ---------- */
export const MISSION_PIC_QUIZ = [
  { q: 'Vad åker man till rymden med?', a: 'raket', opts: [['raket', '🚀', 'en raket'], ['cykel', '🚲', 'en cykel'], ['bat', '⛵', 'en segelbåt']], ex: 'En raket är så stark att den kan lyfta ända ut i rymden.' },
  { q: 'Vem reser ut i rymden?', a: 'astronaut', opts: [['astronaut', '🧑‍🚀', 'en astronaut'], ['kock', '🧑‍🍳', 'en kock'], ['bonde', '🧑‍🌾', 'en bonde']], ex: 'En astronaut är en person som reser ut i rymden.' },
  { q: 'Var har astronauter varit och gått?', a: 'mane', opts: [['mane', '🌙', 'på Månen'], ['sol', '☀️', 'på Solen'], ['stjarna', '⭐', 'på en stjärna']], ex: 'Tolv astronauter har gått på månen. Till solen kan ingen åka – den är alldeles för het.' },
  { q: 'Vad har astronauten på sig när hen går ut i rymden?', a: 'drakt', opts: [['drakt', '🧑‍🚀', 'en rymddräkt'], ['bad', '🩱', 'en baddräkt'], ['regn', '🧥', 'en regnjacka']], ex: 'I rymden finns ingen luft. Rymddräkten har luft att andas och skyddar mot kyla och värme.' },
  { q: 'Vad åker runt jorden och hjälper oss med väder och kartor?', a: 'satellit', opts: [['satellit', '🛰️', 'en satellit'], ['ballong', '🎈', 'en ballong'], ['fagel', '🐦', 'en fågel']], ex: 'Satelliter åker runt jorden. De tar bilder av vädret och hjälper kartorna i mobilen.' },
];

export const MISSION_FACTS = [
  { lvl: 1, q: 'Vad heter en person som reser ut i rymden?', a: 'astronaut', o: ['astronaut', 'dykare', 'lokförare'], ex: 'En astronaut reser ut i rymden. Ordet betyder ungefär "stjärnseglare".' },
  { lvl: 1, q: 'Varför har astronauter rymddräkt?', a: 'det finns ingen luft att andas i rymden', o: ['det finns ingen luft att andas i rymden', 'för att se fina ut', 'för att det regnar'], ex: 'I rymden finns ingen luft. Dräkten ger astronauten luft och skyddar mot kyla och värme.' },
  { lvl: 1, q: 'Vad heter rymdstationen där astronauter bor?', a: 'ISS', o: ['ISS', 'Apollo', 'Saturnus'], ex: 'ISS betyder den internationella rymdstationen. Astronauter från många länder bor och jobbar där.' },
  { lvl: 1, q: 'Hur är det att vara i rymdstationen?', a: 'man svävar', o: ['man svävar', 'man blir jättetung', 'man blir blöt'], ex: 'I rymdstationen svävar allt – astronauterna, maten och till och med vattendroppar!' },
  { lvl: 1, q: 'Vad äter astronauter i rymden?', a: 'mat i påsar och burkar', o: ['mat i påsar och burkar', 'bara glass', 'ingenting alls'], ex: 'Maten ligger i påsar och burkar så att inga smulor svävar iväg och fastnar i maskinerna.' },
  { lvl: 1, q: 'Vad gör man innan en raket skjuts upp?', a: 'räknar ner 10, 9, 8 …', o: ['räknar ner 10, 9, 8 …', 'sjunger en sång', 'blåser i en visselpipa'], ex: 'Nedräkningen visar att allt är klart. När man kommit till noll startar motorerna.' },
  { lvl: 2, q: 'Vad hette rymdfärden som först landade människor på månen?', a: 'Apollo 11', o: ['Apollo 11', 'Titanic', 'Vasa'], ex: 'Apollo 11 landade på månen den 20 juli 1969. Neil Armstrong och Buzz Aldrin gick på månen medan Michael Collins väntade i rymdskeppet runt månen.' },
  { lvl: 2, q: 'Vem var den första svensken i rymden?', a: 'Christer Fuglesang', o: ['Christer Fuglesang', 'Astrid Lindgren', 'Carl von Linné'], ex: 'Christer Fuglesang åkte rymdfärjan Discovery till rymdstationen år 2006. Han åkte upp igen år 2009.' },
  { lvl: 2, q: 'Varför finns astronauternas fotspår kvar på månen?', a: 'det blåser aldrig där', o: ['det blåser aldrig där', 'någon målar dem', 'de är gjorda av sten'], ex: 'Månen har ingen luft, så där finns ingen vind eller regn som suddar ut spåren. De kan ligga kvar väldigt länge.' },
  { lvl: 2, q: 'Hur många varv runt jorden åker rymdstationen på ett dygn?', a: 'ungefär 16', o: ['ungefär 16', '1', 'ungefär 1 000'], ex: 'ISS åker runt jorden på ungefär en och en halv timme. Astronauterna ser 16 soluppgångar varje dygn!' },
  { lvl: 3, q: 'Vem var den första människan i rymden?', a: 'Jurij Gagarin', o: ['Jurij Gagarin', 'Neil Armstrong', 'Christer Fuglesang'], ex: 'Jurij Gagarin från Sovjetunionen åkte ett varv runt jorden den 12 april 1961.' },
  { lvl: 3, q: 'Vem var den första kvinnan i rymden?', a: 'Valentina Teresjkova', o: ['Valentina Teresjkova', 'Sally Ride', 'Marie Curie'], ex: 'Valentina Teresjkova åkte ut i rymden år 1963. Sally Ride blev den första amerikanska kvinnan i rymden, år 1983.' },
  { lvl: 3, q: 'Vilken svensk astronaut åkte till rymdstationen år 2024?', a: 'Marcus Wandt', o: ['Marcus Wandt', 'Christer Fuglesang', 'Neil Armstrong'], ex: 'Marcus Wandt åkte till ISS i januari 2024 och var i rymden i ungefär tre veckor. Han gjorde många experiment.' },
  { lvl: 3, q: 'Hur många människor har gått på månen?', a: '12', o: ['12', '1', '100'], ex: 'Tolv astronauter gick på månen mellan åren 1969 och 1972, med rymdfärderna Apollo 11 till Apollo 17.' },
  { lvl: 3, q: 'Vad var Sputnik, som skickades upp år 1957?', a: 'den första satelliten', o: ['den första satelliten', 'den första månbilen', 'en stjärna'], ex: 'Sputnik var en liten metallkula med radio. Den blev den första konstgjorda satelliten runt jorden.' },
  { lvl: 3, q: 'Ungefär hur högt upp åker rymdstationen?', a: 'ungefär 400 km', o: ['ungefär 400 km', 'ungefär 4 km', 'ungefär 400 000 km'], ex: 'ISS åker ungefär 400 km över marken – ungefär lika långt som från Göteborg till Stockholm.' },
  { lvl: 3, q: 'Hur kommer en raket upp?', a: 'den trycker ut het gas nedåt', o: ['den trycker ut het gas nedåt', 'den har vingar som flaxar', 'den dras upp av månen'], ex: 'Raketmotorn sprutar ut het gas nedåt i hög fart. Gasen trycker då raketen uppåt.' },
  { lvl: 4, q: 'Vad hette Marcus Wandts rymdfärd, efter en av Odens korpar?', a: 'Muninn', o: ['Muninn', 'Sleipner', 'Mjölner'], ex: 'Muninn är en av guden Odens två korpar i den nordiska mytologin. Den andra heter Hugin.' },
  { lvl: 4, q: 'Ungefär hur fort åker rymdstationen?', a: '28 000 km/h', o: ['28 000 km/h', '100 km/h', '1 000 km/h'], ex: 'ISS åker ungefär 28 000 km i timmen – mer än 20 gånger fortare än ett flygplan.' },
  { lvl: 4, q: 'Ungefär hur lång tid tog resan från jorden till månen för Apollo 11?', a: 'ungefär 4 dagar', o: ['ungefär 4 dagar', 'ungefär 4 timmar', 'ungefär 4 år'], ex: 'Apollo 11 sköts upp den 16 juli 1969 och landade på månen den 20 juli.' },
  { lvl: 4, q: 'Hur många rymdpromenader gjorde Christer Fuglesang?', a: '5', o: ['5', '1', '50'], ex: 'Christer Fuglesang gjorde fem rymdpromenader utanför rymdstationen, sammanlagt nästan 32 timmar.' },
  { lvl: 4, q: 'Sedan vilket år har det alltid bott människor på rymdstationen?', a: '2000', o: ['2000', '1969', '2024'], ex: 'De första astronauterna flyttade in i november 2000. Sedan dess har ISS aldrig varit tom.' },
  { lvl: 4, q: 'Varför skjuts raketer ofta upp österut?', a: 'jordens snurr ger extra fart', o: ['jordens snurr ger extra fart', 'solen drar i dem', 'det blåser mindre där'], ex: 'Jorden snurrar österut. En raket som åker åt samma håll får jordens fart på köpet.' },
];

// Tidslinje: rymdfärdens historia.
export const SPACE_EVENTS = [
  { id: 'sputnik', year: 1957, e: '🛰️', name: 'Första satelliten, Sputnik' },
  { id: 'gagarin', year: 1961, e: '🧑‍🚀', name: 'Första människan i rymden, Gagarin' },
  { id: 'teresjkova', year: 1963, e: '👩‍🚀', name: 'Första kvinnan i rymden, Teresjkova' },
  { id: 'apollo11', year: 1969, e: '🌙', name: 'Första månlandningen, Apollo 11' },
  { id: 'iss', year: 2000, e: '🏠', name: 'De första flyttar in på ISS' },
  { id: 'fuglesang', year: 2006, e: '🇸🇪', name: 'Första svensken i rymden, Fuglesang' },
  { id: 'wandt', year: 2024, e: '🚀', name: 'Marcus Wandt åker till ISS' },
];

export function genMissions(level, rng) {
  if (level <= 0 || (level === 1 && rng.chance(0.3))) return picQuestion(rng.pick(MISSION_PIC_QUIZ), rng, 'Titta på bilderna och tänk efter.');
  if (level >= 3 && rng.chance(0.25)) {
    const events = rng.sample(SPACE_EVENTS, level >= 4 ? 5 : 4).sort((a, b) => a.year - b.year);
    return {
      type: 'order', prompt: 'Tryck i tidsordning – det som hände först ska vara först!',
      items: rng.shuffle(events).map((ev) => ({ id: ev.id, html: `<span class="pic sm">${ev.e}</span><span class="lbl">${ev.name}</span>`, say: ev.name })),
      answerOrder: events.map((ev) => ev.id),
      hint: 'Den första satelliten kom före de första människorna i rymden.',
      explain: events.map((ev) => `${ev.year}: ${ev.name}`).join('. ') + '.',
    };
  }
  return textQuestion(pickLeveled(MISSION_FACTS, level, rng), rng, 'Tänk på vad du vet om raketer och astronauter.');
}

/* ---------- Natthimlen: stjärnor, Polstjärnan, kometer, stjärnfall, norrsken ---------- */
export const SKY_PIC_QUIZ = [
  { q: 'Vilken bild visar natt?', a: 'natt', opts: [['natt', '🌃', 'natt'], ['dag', '🏙️', 'dag'], ['regn', '🌧️', 'regn']], ex: 'På natten är det mörkt och vi kan se månen och stjärnorna.' },
  { q: 'Vad blinkar på himlen när det är mörkt?', a: 'stjarna', opts: [['stjarna', '⭐', 'stjärnor'], ['sol', '☀️', 'solen'], ['regnbage', '🌈', 'en regnbåge']], ex: 'Stjärnorna är egentligen solar, men de är så långt bort att de ser ut som små prickar.' },
  { q: 'Vad lyser grönt på himlen ibland på vintern?', a: 'norrsken', opts: [['norrsken', '💚', 'norrsken'], ['regnbage', '🌈', 'en regnbåge'], ['sol', '☀️', 'solen']], ex: 'Norrsken är ljus på himlen som oftast är grönt. Man ser det bäst långt norrut, när det är mörkt.' },
  { q: 'Vad heter det när en liten sten lyser upp och susar över himlen?', a: 'stjarnfall', opts: [['stjarnfall', '🌠', 'ett stjärnfall'], ['regn', '🌧️', 'regn'], ['moln', '☁️', 'ett moln']], ex: 'Ett stjärnfall är ett litet stenkorn från rymden som blir glödhett när det susar in i luften.' },
];

export const SKY_FACTS = [
  { lvl: 1, q: 'Varför ser vi inte stjärnorna på dagen?', a: 'solen lyser så starkt', o: ['solen lyser så starkt', 'stjärnorna sover', 'stjärnorna åker bort'], ex: 'Stjärnorna finns kvar på dagen, men solljuset är så starkt att vi inte ser dem.' },
  { lvl: 1, q: 'Är stjärnorna små?', a: 'nej, de är jättestora men långt bort', o: ['nej, de är jättestora men långt bort', 'ja, som små lampor', 'ja, som en boll'], ex: 'Stjärnorna är solar – många är större än vår sol. De ser små ut för att de är så långt bort.' },
  { lvl: 1, q: 'Vilken stjärnbild ser ut som en vagn eller en kastrull?', a: 'Karlavagnen', o: ['Karlavagnen', 'Orion', 'Kassiopeja'], ex: 'Karlavagnen har sju ljusa stjärnor: fyra i vagnen och tre i handtaget.' },
  { lvl: 1, q: 'Vilken färg har norrsken oftast?', a: 'grön', o: ['grön', 'brun', 'svart'], ex: 'Norrsken är oftast grönt. Ibland kan det också vara rött eller lila.' },
  { lvl: 2, q: 'Vad är ett stjärnfall egentligen?', a: 'ett litet stenkorn som glöder i luften', o: ['ett litet stenkorn som glöder i luften', 'en stjärna som ramlar ner', 'en raket'], ex: 'Ett stjärnfall (meteor) är ofta bara ett korn stort som ett sandkorn. Det susar in i luften så fort att det glöder.' },
  { lvl: 2, q: 'Hur många ljusa stjärnor har Karlavagnen?', a: '7', o: ['7', '3', '12'], ex: 'Sju stjärnor: fyra bildar vagnen och tre bildar handtaget.' },
  { lvl: 2, q: 'Vad är en komet?', a: 'en klump av is och damm', o: ['en klump av is och damm', 'en brinnande stjärna', 'en liten planet med ringar'], ex: 'En komet är som en smutsig snöboll. När den kommer nära solen får den en lysande svans.' },
  { lvl: 2, q: 'Var i Sverige ser man norrsken oftast?', a: 'långt norrut, som i Kiruna', o: ['långt norrut, som i Kiruna', 'i Skåne', 'på Gotland'], ex: 'Norrsken syns oftast långt norrut. Ibland, när solen är extra aktiv, kan man se det i hela Sverige.' },
  { lvl: 2, q: 'Vilken är den närmaste stjärnan till jorden?', a: 'Solen', o: ['Solen', 'Polstjärnan', 'Månen'], ex: 'Solen är en stjärna – och den är närmast oss. Månen är ingen stjärna.' },
  { lvl: 2, q: 'Varför ser man fler stjärnor ute på landet än i staden?', a: 'det är mörkare där', o: ['det är mörkare där', 'stjärnorna gillar skogen', 'det är närmare rymden'], ex: 'Gatlampor och hus lyser upp himlen i staden. Där det är mörkt syns många fler stjärnor.' },
  { lvl: 2, q: 'Vilken stjärnbild har ett bälte av tre stjärnor på rad?', a: 'Orion', o: ['Orion', 'Karlavagnen', 'Kassiopeja'], ex: 'Orion ser ut som en jägare. Tre stjärnor på rad är hans bälte. Han syns bäst på vinterkvällar.' },
  { lvl: 3, q: 'Hur kan man hitta Polstjärnan?', a: 'följ de två främre stjärnorna i Karlavagnen', o: ['följ de två främre stjärnorna i Karlavagnen', 'titta rakt mot solen', 'leta efter den rödaste stjärnan'], ex: 'Dra en linje genom de två stjärnorna längst fram i vagnen, ungefär fem gånger avståndet mellan dem. Där lyser Polstjärnan.' },
  { lvl: 3, q: 'Vad heter den kända kometen som kommer tillbaka ungefär vart 76:e år?', a: 'Halleys komet', o: ['Halleys komet', 'Polstjärnan', 'Vintergatan'], ex: 'Halleys komet syntes senast år 1986 och kommer tillbaka år 2061. Hur gammal är du då?' },
  { lvl: 3, q: 'När kan man se extra många stjärnfall i Sverige?', a: 'i mitten av augusti', o: ['i mitten av augusti', 'på midsommarafton', 'aldrig'], ex: 'Runt den 12 augusti passerar jorden ett dammspår efter en komet. Då kommer stjärnfallen Perseiderna.' },
  { lvl: 3, q: 'Varför syns knappt några stjärnor en natt i juni i Sverige?', a: 'det blir aldrig riktigt mörkt', o: ['det blir aldrig riktigt mörkt', 'stjärnorna har semester', 'molnen är tjockare'], ex: 'Runt midsommar går solen bara lite under horisonten, så himlen är ljus hela natten.' },
  { lvl: 3, q: 'Varför är solen så mycket ljusare än de andra stjärnorna?', a: 'den är mycket närmare oss', o: ['den är mycket närmare oss', 'den är den största stjärnan', 'den har mest eld'], ex: 'Solen är en ganska vanlig stjärna. Den ser stor och stark ut för att den är så nära.' },
  { lvl: 3, q: 'Vad är norrsken?', a: 'ljus när partiklar från solen träffar luften', o: ['ljus när partiklar från solen träffar luften', 'solljus som speglas i isen', 'blixtar i molnen'], ex: 'Solen skickar ut små laddade partiklar. Jordens magnetfält leder dem mot polerna, där de får luften att lysa.' },
  { lvl: 4, q: 'Varför står Polstjärnan nästan still på himlen?', a: 'den är nästan rakt över jordens nordpol', o: ['den är nästan rakt över jordens nordpol', 'den är fastspikad', 'den är närmast jorden'], ex: 'Jordaxeln pekar nästan rakt mot Polstjärnan. När jorden snurrar ser alla andra stjärnor ut att gå runt den.' },
  { lvl: 4, q: 'Är Polstjärnan den ljusaste stjärnan på natthimlen?', a: 'nej, Sirius är ljusare', o: ['nej, Sirius är ljusare', 'ja, den är ljusast', 'nej, Månen är ljusast av stjärnorna'], ex: 'Många tror det, men Sirius är ljusast. Polstjärnan är känd för att den visar norr – inte för att den är starkast.' },
  { lvl: 4, q: 'Åt vilket håll pekar en komets svans?', a: 'bort från solen', o: ['bort från solen', 'mot solen', 'alltid bakåt'], ex: 'Solvinden blåser svansen bort från solen. När kometen åker bort från solen kommer svansen först!' },
  { lvl: 4, q: 'Varför ser vi olika stjärnbilder på sommaren och på vintern?', a: 'jorden åker runt solen', o: ['jorden åker runt solen', 'stjärnorna flyttar', 'månen skymmer dem'], ex: 'På natten tittar vi ut från den sida av jorden som är vänd bort från solen. När jorden åker runt solen ser vi åt olika håll i rymden.' },
];

// Lyser själv eller lyser för att solljus studsar på den?
const GLOW_ITEMS = [
  { id: 'solen', e: '☀️', n: 'Solen', bin: 'sjalv' },
  { id: 'polstjarnan', e: '⭐', n: 'Polstjärnan', bin: 'sjalv' },
  { id: 'sirius', e: '✨', n: 'Sirius', bin: 'sjalv' },
  { id: 'manen', e: '🌙', n: 'Månen', bin: 'speglar' },
  { id: 'venus', e: '🟡', n: 'Venus (aftonstjärnan)', bin: 'speglar' },
  { id: 'mars', e: '🔴', n: 'Mars', bin: 'speglar' },
  { id: 'iss', e: '🛰️', n: 'Rymdstationen', bin: 'speglar' },
  { id: 'jupiter', e: '🟠', n: 'Jupiter', bin: 'speglar' },
];

export function genSky(level, rng) {
  if (level <= 0 || (level === 1 && rng.chance(0.3))) return picQuestion(rng.pick(SKY_PIC_QUIZ), rng, 'Titta på bilderna och tänk efter.');
  if (level >= 3 && rng.chance(0.25)) {
    let items = rng.sample(GLOW_ITEMS, 6);
    if (!items.some((i) => i.bin === 'sjalv')) items[0] = GLOW_ITEMS[0];
    if (!items.some((i) => i.bin === 'speglar')) items[0] = GLOW_ITEMS[3];
    items = uniqueBy(items, (i) => i.id);
    return {
      type: 'sort', prompt: 'Lyser den själv, eller lyser den för att solljus studsar på den?',
      bins: [{ id: 'sjalv', label: 'Lyser själv', html: '🔥' }, { id: 'speglar', label: 'Solljus studsar', html: '🪞' }],
      items: items.map((i) => ({ id: i.id, html: `<span class="pic sm">${i.e}</span><span class="lbl">${i.n}</span>`, bin: i.bin, say: i.n })),
      hint: 'Bara stjärnor lyser själva. Solen är en stjärna!',
      explain: 'Stjärnor, som solen, lyser själva. Månen, planeterna och rymdstationen lyser för att solljuset studsar på dem – även Venus, som kallas aftonstjärnan fast den är en planet.',
    };
  }
  return textQuestion(pickLeveled(SKY_FACTS, level, rng), rng, 'Tänk på hur himlen ser ut en mörk kväll.');
}

/* ---------- Dag, natt och tidszoner ---------- */
const DAYNIGHT_ITEMS = [
  { id: 'sol', e: '☀️', n: 'Solen lyser', bin: 'dag' },
  { id: 'stjarnor', e: '⭐', n: 'Stjärnorna syns', bin: 'natt' },
  { id: 'sova', e: '😴', n: 'De flesta sover', bin: 'natt' },
  { id: 'uggla', e: '🦉', n: 'Ugglan jagar', bin: 'natt' },
  { id: 'lunch', e: '🍲', n: 'Vi äter lunch', bin: 'dag' },
  { id: 'fjaril', e: '🦋', n: 'Fjärilar fladdrar', bin: 'dag' },
  { id: 'fladdermus', e: '🦇', n: 'Fladdermöss flyger', bin: 'natt' },
  { id: 'bin', e: '🐝', n: 'Bina samlar nektar', bin: 'dag' },
];

// Skillnad i timmar mot svensk vintertid (normaltid, UTC+1).
export const TIME_ZONES = [
  { city: 'London', diff: -1 }, { city: 'Reykjavik', diff: -1 }, { city: 'Lissabon', diff: -1 },
  { city: 'Helsingfors', diff: 1 }, { city: 'Aten', diff: 1 }, { city: 'Moskva', diff: 2 }, { city: 'Nairobi', diff: 2 },
  { city: 'Dubai', diff: 3 }, { city: 'Bangkok', diff: 6 }, { city: 'Peking', diff: 7 }, { city: 'Tokyo', diff: 8 },
  { city: 'Rio de Janeiro', diff: -4 }, { city: 'New York', diff: -6 }, { city: 'Los Angeles', diff: -9 },
];

export const TIME_FACTS = [
  { lvl: 1, q: 'Varför blir det natt?', a: 'vår sida av jorden vänds bort från solen', o: ['vår sida av jorden vänds bort från solen', 'solen släcks', 'månen ställer sig framför solen'], ex: 'Jorden snurrar. När vår sida vänds bort från solen blir det natt hos oss – och dag på andra sidan.' },
  { lvl: 1, q: 'När det är dag i Sverige, är det dag överallt på jorden?', a: 'nej, på andra sidan är det natt', o: ['nej, på andra sidan är det natt', 'ja, överallt', 'ja, men bara på sommaren'], ex: 'Solen lyser bara på halva jorden åt gången. På andra sidan är det natt.' },
  { lvl: 1, q: 'Hur lång tid tar det för jorden att snurra ett varv runt sig själv?', a: 'ett dygn', o: ['ett dygn', 'en vecka', 'ett år'], ex: 'Ett varv tar ett dygn, alltså 24 timmar. Då hinner det bli både dag och natt.' },
  { lvl: 2, q: 'Åt vilket väderstreck går solen upp?', a: 'öster', o: ['öster', 'väster', 'norr'], ex: 'Jorden snurrar mot öster. Därför ser det ut som att solen går upp i öster och ner i väster.' },
  { lvl: 2, q: 'Åt vilket väderstreck går solen ner?', a: 'väster', o: ['väster', 'öster', 'söder'], ex: 'Solen går ner i väster. I Göteborg går den ner över havet.' },
  { lvl: 2, q: 'När har vi längst dag i Sverige?', a: 'runt midsommar', o: ['runt midsommar', 'runt jul', 'runt påsk'], ex: 'Runt den 21 juni är dagen längst. Då lutar vår del av jorden mest mot solen.' },
  { lvl: 2, q: 'Det är lunch i Sverige. Vad är det då i Australien, på andra sidan jorden?', a: 'kväll eller natt', o: ['kväll eller natt', 'morgon', 'också lunch'], ex: 'Australien ligger nästan på andra sidan jorden. När vi äter lunch är det kväll eller natt där.' },
  { lvl: 2, q: 'Hur många timmar är ett dygn?', a: '24', o: ['24', '12', '100'], ex: 'Ett dygn är 24 timmar – så lång tid tar det för jorden att snurra ett varv.' },
  { lvl: 2, q: 'När är dagen kortast i Sverige?', a: 'runt jul', o: ['runt jul', 'runt midsommar', 'runt påsk'], ex: 'Runt den 21 december är dagen kortast. Då lutar vår del av jorden bort från solen.' },
  { lvl: 2, q: 'Hur blir skuggan när solen står lågt på himlen?', a: 'lång', o: ['lång', 'kort', 'den försvinner'], ex: 'När solen står lågt, på morgonen och kvällen, blir skuggorna långa. Mitt på dagen blir de kortast.' },
  { lvl: 3, q: 'Var står solen mitt på dagen i Sverige?', a: 'i söder', o: ['i söder', 'i norr', 'rakt ovanför huvudet'], ex: 'Sverige ligger norr om ekvatorn, så mitt på dagen står solen i söder. Skuggorna pekar då mot norr.' },
  { lvl: 3, q: 'När är dag och natt ungefär lika långa?', a: 'i mars och september', o: ['i mars och september', 'i juni och december', 'aldrig'], ex: 'Det kallas dagjämning. Då lutar ingen halva av jorden mot solen.' },
  { lvl: 3, q: 'Varför har olika länder olika tid på klockan?', a: 'solen lyser på olika delar av jorden', o: ['solen lyser på olika delar av jorden', 'klockorna går fel', 'länderna bestämmer det för skojs skull'], ex: 'Jorden är indelad i tidszoner så att klockan 12 är ungefär mitt på dagen överallt.' },
  { lvl: 4, q: 'Du flyger från Sverige till New York. Ska du ställa klockan fram eller tillbaka?', a: 'tillbaka', o: ['tillbaka', 'fram', 'ingenting'], ex: 'New York ligger väster om oss. Där har solen inte kommit lika långt, så klockan är 6 timmar mindre.' },
  { lvl: 4, q: 'Varför är det midnattssol i Kiruna på sommaren?', a: 'norra Sverige lutar mot solen hela dygnet', o: ['norra Sverige lutar mot solen hela dygnet', 'solen kommer närmare Kiruna', 'det finns två solar'], ex: 'Jordaxeln lutar. På sommaren lutar norra halvklotet så mycket mot solen att solen inte går ner alls norr om polcirkeln.' },
  { lvl: 4, q: 'Vad kallas tiden på vintern när solen inte går upp alls i Kiruna?', a: 'polarnatt eller mörkertid', o: ['polarnatt eller mörkertid', 'midnattssol', 'dagjämning'], ex: 'Runt jul lutar norra halvklotet bort från solen. Norr om polcirkeln går solen då inte upp alls på några veckor.' },
];

const clockLabel = (h) => `klockan ${h}`;

export function genTime(level, rng) {
  if (level <= 2 && rng.chance(level === 0 ? 0.5 : 0.3)) {
    const n = level === 0 ? 4 : 6;
    let items = rng.sample(DAYNIGHT_ITEMS, n);
    if (items.every((i) => i.bin === items[0].bin)) items[0] = DAYNIGHT_ITEMS.find((i) => i.bin !== items[0].bin && !items.includes(i));
    items = uniqueBy(items, (i) => i.id);
    return {
      type: 'sort', prompt: 'Händer det på dagen eller på natten? Sortera bilderna.',
      bins: [{ id: 'dag', label: 'Dag', html: '☀️' }, { id: 'natt', label: 'Natt', html: '🌙' }],
      items: items.map((i) => ({ id: i.id, html: `<span class="pic sm">${i.e}</span><span class="lbl">${i.n}</span>`, bin: i.bin, say: i.n })),
      hint: 'Är det ljust eller mörkt ute då?',
      explain: 'När vår sida av jorden är vänd mot solen är det dag. När den är vänd bort är det natt.',
    };
  }
  if (level <= 0) {
    return picQuestion(rng.pick([
      { q: 'När sover vi?', a: 'natt', opts: [['natt', '🌙', 'på natten'], ['dag', '☀️', 'på dagen']], ex: 'Vi sover på natten när det är mörkt.' },
      { q: 'Vad snurrar runt, så att det blir dag och natt?', a: 'jord', opts: [['jord', '🌍', 'Jorden'], ['sol', '☀️', 'Solen'], ['stjarna', '⭐', 'en stjärna']], ex: 'Jorden snurrar runt som en snurra. Ett varv tar ett dygn.' },
      { q: 'Vad ser du på himlen mitt på dagen?', a: 'sol', opts: [['sol', '☀️', 'Solen'], ['stjarna', '⭐', 'massor av stjärnor']], ex: 'Mitt på dagen lyser solen. Stjärnorna syns inte då.' },
    ]), rng, 'Är det ljust eller mörkt?');
  }
  // Tidszoner: välj start så att svaret blir mellan 1 och 23
  if (level >= 3 && rng.chance(0.45)) {
    const pool = level === 3 ? TIME_ZONES.filter((z) => Math.abs(z.diff) <= 3) : TIME_ZONES;
    const z = rng.pick(pool);
    let h;
    do h = rng.int(6, 20);
    while (h + z.diff < 1 || h + z.diff > 23);
    const ans = h + z.diff;
    const more = z.diff > 0;
    const prompt = `Klockan är ${h} i Sverige på vintern. I ${z.city} är klockan ${Math.abs(z.diff)} ${Math.abs(z.diff) === 1 ? 'timme' : 'timmar'} ${more ? 'mer' : 'mindre'}. Vad är klockan i ${z.city}?`;
    const explain = `${h} ${more ? '+' : '−'} ${Math.abs(z.diff)} = ${ans}. ${more ? `${z.city} ligger österut, där har solen redan kommit längre.` : `${z.city} ligger västerut, dit har solen inte kommit lika långt än.`}`;
    if (level === 3) {
      const wrong = h - z.diff;
      const opts = uniqueBy([ans, h, wrong >= 0 && wrong <= 23 ? wrong : ans + (more ? 1 : -1)], (x) => x);
      while (opts.length < 3) opts.push(Math.max(...opts) + 1);
      return { type: 'choice', prompt, options: rng.shuffle(opts).map((x) => ({ id: String(x), label: clockLabel(x) })), answer: String(ans), hint: more ? 'Mer betyder att du ska lägga till.' : 'Mindre betyder att du ska dra ifrån.', explain };
    }
    return { type: 'numpad', prompt, answer: ans, hint: more ? 'Lägg till timmarna.' : 'Dra ifrån timmarna.', explain };
  }
  return textQuestion(pickLeveled(TIME_FACTS, level, rng), rng, 'Tänk på hur jorden snurrar runt sig själv.');
}

/* ---------- Stjärnsagor och berättelser om äldre tiders forskare ---------- */
// Berättelsen läses upp; svaret finns i berättelsen eller i det barnet redan vet.
export const SKY_STORIES = [
  { lvl: 1, kind: 'kultur', story: 'Samerna i norra Sverige berättade om en stor jakt på himlen. Ett stort djur av stjärnor springer över himlen, och jägare på skidor följer efter.', q: 'Vilket djur såg samerna på himlen?', a: 'alg', opts: [['alg', '🦌', 'en älg'], ['fisk', '🐟', 'en fisk'], ['katt', '🐈', 'en katt']], ex: 'Älgen Sarvva är gjord av stjärnorna i Kassiopeja och Perseus. Jägaren är den ljusa stjärnan Arcturus.' },
  { lvl: 1, kind: 'kultur', story: 'I gamla Grekland tyckte man att stjärnorna runt Karlavagnen såg ut som ett stort, lurvigt djur. Därför heter stjärnbilden Stora björnen.', q: 'Vilket djur är Karlavagnen en del av?', a: 'bjorn', opts: [['bjorn', '🐻', 'en björn'], ['hast', '🐴', 'en häst'], ['fagel', '🐦', 'en fågel']], ex: 'Karlavagnen är en del av Stora björnen. Bredvid finns Lilla björnen, med Polstjärnan i svansen.' },
  { lvl: 1, kind: 'gammal', story: 'Förr i tiden gav man veckodagarna namn efter himlen och gudarna. Söndag är solens dag och måndag är månens dag.', q: 'Vilken dag har fått sitt namn efter solen?', a: 'sondag', opts: [['sondag', '☀️', 'söndag'], ['mandag', '🌙', 'måndag'], ['fredag', '🌸', 'fredag']], ex: 'Söndag betyder solens dag och måndag månens dag. Tisdag, onsdag och torsdag har fått namn efter de nordiska gudarna Tyr, Oden och Tor.' },
  { lvl: 1, kind: 'kultur', story: 'Titta på fullmånen! I Sverige säger man att det finns en gubbe i månen. I Japan, Kina och Mexiko ser man i stället ett djur med långa öron.', q: 'Vilket djur ser man i månen i Japan?', a: 'kanin', opts: [['kanin', '🐰', 'en kanin'], ['elefant', '🐘', 'en elefant'], ['fisk', '🐟', 'en fisk']], ex: 'De mörka fläckarna på månen är slätter av stelnad lava. Olika folk ser olika figurer i dem.' },
  { lvl: 1, kind: 'kultur', story: 'I gamla Grekland tyckte man att Vintergatan såg ut som en strimma vit dryck som skvätt ut över himlen. Därför heter den Milky Way – mjölkvägen – på engelska.', q: 'Vad tyckte grekerna att Vintergatan liknade?', a: 'mjolk', opts: [['mjolk', '🥛', 'mjölk'], ['choklad', '🍫', 'choklad'], ['eld', '🔥', 'eld']], ex: 'Vintergatan är vår galax. Den vita strimman är miljarder stjärnor som ligger så tätt att de ser ut som ett moln.' },
  { lvl: 1, kind: 'gammal', story: 'Förr i tiden fanns det ingen karta i mobilen. Sjömän som seglade på natten tittade på Polstjärnan för att veta åt vilket håll norr låg.', q: 'Vad tittade sjömännen på för att hitta rätt?', a: 'polstjarnan', opts: [['polstjarnan', '⭐', 'Polstjärnan'], ['regnbage', '🌈', 'regnbågen'], ['moln', '☁️', 'molnen']], ex: 'Polstjärnan står nästan still på himlen, rakt åt norr. Därför är den bra att navigera efter.' },
  { lvl: 1, kind: 'gammal', story: 'För länge sedan fanns det inga klockor. Då tittade man på solen: när den stod som högst på himlen var det mitt på dagen.', q: 'Vad tittade man på för att veta när det var mitt på dagen?', a: 'sol', opts: [['sol', '☀️', 'solen'], ['ko', '🐄', 'korna'], ['regn', '🌧️', 'regnet']], ex: 'Mitt på dagen står solen högst och skuggorna är kortast. Man kan bygga ett solur med en pinne och dess skugga!' },
  { lvl: 1, kind: 'kultur', story: 'Redan för länge sedan firade människor i Norden när solen var uppe som längst och natten var ljus. Den festen firar vi fortfarande i juni.', q: 'Vad heter festen?', a: 'midsommar', opts: [['midsommar', '🌼', 'midsommar'], ['jul', '🎄', 'jul'], ['pask', '🐣', 'påsk']], ex: 'Runt midsommar är dagen längst i Sverige. Längst norrut går solen inte ner alls – det kallas midnattssol.' },
  { lvl: 2, kind: 'kultur', story: 'Samerna berättade att Polstjärnan är som en stolpe som håller himlen på plats. Alla andra stjärnor går runt den.', q: 'Varför tyckte samerna att Polstjärnan var speciell?', a: 'den står still', opts: [['den står still', '📍', 'den står still'], ['den är röd', '🔴', 'den är röd'], ['den syns bara på dagen', '☀️', 'den syns bara på dagen']], ex: 'Polstjärnan står nästan still, eftersom jordaxeln pekar mot den. Därför har människor använt den för att hitta norr.' },
  { lvl: 2, kind: 'kultur', story: 'I Kina och Japan berättar man om vävarflickan och vallpojken. De är två stjärnor, Vega och Altair, och mellan dem flyter en flod av stjärnor – Vintergatan. En gång om året bygger fåglar en bro så att de kan träffas.', q: 'Vad bygger fåglarna?', a: 'bro', opts: [['bro', '🌉', 'en bro'], ['hus', '🏠', 'ett hus'], ['bat', '🚤', 'en båt']], ex: 'Fåglarna är skator. I Japan firas mötet på festen Tanabata den 7 juli, och då skriver man önskningar på papperslappar.' },
  { lvl: 2, kind: 'kultur', story: 'I Chile och andra länder i Sydamerika kallas stjärnorna i Orions bälte för Las Tres Marías – de tre Mariorna.', q: 'Hur många stjärnor finns det i Orions bälte?', a: '3', opts: [['3', '⭐', 'tre'], ['7', '✨', 'sju'], ['1', '🌟', 'en']], ex: 'Orions bälte är tre ljusa stjärnor på rad. De är lätta att hitta på vinterhimlen.' },
  { lvl: 2, kind: 'gammal', story: 'Ordet månad kommer från ordet måne. Förr räknade man tiden med hjälp av månen: från en nymåne till nästa tar det ungefär en månad.', q: 'Vilket ord kommer från ordet måne?', a: 'månad', opts: [['månad', '📅', 'månad'], ['morgon', '🌅', 'morgon'], ['mössa', '🧢', 'mössa']], ex: 'Från nymåne till nymåne tar det ungefär 29 och en halv dag. Det är ungefär en månad.' },
  { lvl: 2, kind: 'gammal', story: 'För länge sedan tittade man på månförmörkelser. Då faller jordens skugga på månen, och skuggan var alltid rund.', q: 'Vad förstod man då om jorden?', a: 'rund', opts: [['rund', '🌍', 'att jorden är rund'], ['platt', '🥞', 'att jorden är platt'], ['fyrkant', '🟥', 'att jorden är fyrkantig']], ex: 'Bara ett klot ger en rund skugga hur det än vänds. Grekiska tänkare förstod detta för över 2 000 år sedan.' },
  { lvl: 3, kind: 'kultur', story: 'Aboriginer i Australien ser en emu på himlen – en stor fågel som inte kan flyga. Men den är inte gjord av stjärnor, utan av de mörka molnen av stoft i Vintergatan.', q: 'Vad är emun på himlen gjord av?', a: 'morka', opts: [['morka', '🌌', 'mörka fläckar i Vintergatan'], ['planeter', '🪐', 'planeter'], ['moln', '☁️', 'vanliga regnmoln']], ex: 'Alla kulturer ser inte bara på stjärnorna. Emun syns bäst från södra halvklotet.' },
  { lvl: 3, kind: 'kultur', story: 'I Norden för länge sedan kallades de tre stjärnorna i Orions bälte för Friggerocken. Det var gudinnan Friggs slända, som man spann ull till garn med.', q: 'Vad såg man i Orions bälte i Norden?', a: 'slanda', opts: [['slanda', '🧶', 'en slända för att spinna garn'], ['svard', '🗡️', 'ett svärd'], ['bat', '⛵', 'en båt']], ex: 'Frigg var en gudinna i den nordiska mytologin. Fredag kan ha fått sitt namn efter henne.' },
  { lvl: 3, kind: 'kultur', story: 'Polynesierna seglade mellan små öar långt ute i Stilla havet, utan kompass och utan kartor. De läste stjärnorna, vågorna och fåglarna.', q: 'Vad använde de för att hitta rätt på natten?', a: 'stjarnor', opts: [['stjarnor', '⭐', 'stjärnorna'], ['mobil', '📱', 'en mobiltelefon'], ['kompass', '🧭', 'en kompass']], ex: 'De lärde sig var olika stjärnor går upp och ner över havet – som en karta på himlen.' },
  { lvl: 3, kind: 'gammal', story: 'Förr trodde många att solen och planeterna åkte runt jorden. För nästan 500 år sedan skrev Nikolaus Kopernikus att det är tvärtom.', q: 'Vad åker runt vad?', a: 'jorden runt solen', opts: [['jorden runt solen', '🌍', 'jorden runt solen'], ['solen runt jorden', '☀️', 'solen runt jorden'], ['månen runt solen', '🌙', 'solen runt månen']], ex: 'Kopernikus bok kom ut år 1543. Det tog lång tid innan alla trodde på honom.' },
  { lvl: 3, kind: 'gammal', story: 'År 1610 riktade Galileo Galilei ett teleskop mot Jupiter. Han såg fyra små ljusprickar som flyttade sig runt planeten, natt efter natt.', q: 'Vad var ljusprickarna?', a: 'manar', opts: [['manar', '🌕', 'månar'], ['flygplan', '✈️', 'flygplan'], ['solar', '☀️', 'solar']], ex: 'Galileo hade upptäckt Jupiters fyra största månar: Io, Europa, Ganymedes och Callisto.' },
  { lvl: 3, kind: 'gammal', story: 'Tycho Brahe byggde ett slott för att titta på stjärnor på ön Ven i Öresund, för över 400 år sedan. Han mätte stjärnornas lägen noggrannare än någon före honom – utan teleskop!', q: 'Var byggde Tycho Brahe sitt observatorium?', a: 'ven', opts: [['ven', '🏝️', 'på ön Ven'], ['mane', '🌙', 'på månen'], ['berg', '🏔️', 'på ett högt berg']], ex: 'Ven tillhörde Danmark då, men i dag är ön svensk. Hans mätningar hjälpte Johannes Kepler att förstå hur planeterna rör sig.' },
  { lvl: 4, kind: 'kultur', story: 'I Nya Zeeland heter Sjustjärnan Matariki. När den syns på morgonhimlen mitt i vintern, i juni eller juli, firar maorierna nyår.', q: 'Vad firar maorierna när Matariki syns?', a: 'nyar', opts: [['nyar', '🎉', 'nyår'], ['jul', '🎄', 'jul'], ['midsommar', '🌼', 'midsommar']], ex: 'Juni är vinter i Nya Zeeland, som ligger på södra halvklotet. Matariki är en helgdag där sedan år 2022.' },
  { lvl: 4, kind: 'kultur', story: 'I gamla Egypten väntade man på att den ljusa stjärnan Sirius skulle synas i gryningen igen. Då visste man att floden Nilen snart skulle svämma över och göra jorden bördig.', q: 'Vad använde egyptierna Sirius till?', a: 'kalender', opts: [['kalender', '📅', 'som en kalender'], ['lampa', '💡', 'som en lampa'], ['karta', '🗺️', 'som en karta till månen']], ex: 'Stjärnhimlen ändras under året. Därför kunde man använda stjärnorna som en kalender.' },
  { lvl: 4, kind: 'kultur', story: 'I gamla Kina tittade man på kvällen åt vilket håll Karlavagnens handtag pekade: åt öster på våren, åt söder på sommaren, åt väster på hösten och åt norr på vintern.', q: 'Vart pekar handtaget på sommaren?', a: 'soder', opts: [['soder', '⬇️', 'söder'], ['norr', '⬆️', 'norr'], ['oster', '➡️', 'öster']], ex: 'Karlavagnen vrider sig runt Polstjärnan under året. Den blev en klocka och kalender på himlen.' },
  { lvl: 4, kind: 'gammal', story: 'För över 2 000 år sedan mätte greken Eratosthenes hur stor jorden är. Han jämförde skuggorna från solen i två olika städer samma dag.', q: 'Vad använde Eratosthenes för att mäta jorden?', a: 'skuggor', opts: [['skuggor', '🌓', 'skuggor'], ['raket', '🚀', 'ett rymdskepp'], ['matt', '📏', 'en jättelång tumstock']], ex: 'Skuggorna var olika långa eftersom jorden är rund. Med lite matematik räknade han ut jordens omkrets ganska rätt.' },
  { lvl: 4, kind: 'gammal', story: 'Anders Celsius var astronom i Uppsala på 1700-talet. Han såg att en kompassnål darrade när det var norrsken. Han gjorde också en temperaturskala.', q: 'Vad heter temperaturskalan vi använder i Sverige?', a: 'celsius', opts: [['celsius', '🌡️', 'Celsius'], ['kilometer', '📏', 'kilometer'], ['kilogram', '⚖️', 'kilogram']], ex: 'Kul fakta: först satte Celsius 100 grader där vatten fryser och 0 där det kokar. Skalan vändes på efter hans död.' },
];

export function genSkyStories(level, rng) {
  const pool = SKY_STORIES.filter((s) => s.lvl <= Math.max(1, level));
  const s = pickLeveled(pool, Math.max(1, level), rng);
  // Nivå 0–1: tre bildsvar. Högre nivåer: samma frågor, men med text.
  if (level <= 1) {
    return { ...picQuestion({ q: `${s.story} ${s.q}`, say: `${s.story} ${s.q}`, a: s.a, opts: s.opts, ex: s.ex }, rng, 'Lyssna på berättelsen igen.') };
  }
  return {
    type: 'choice', prompt: `${s.story} ${s.q}`, options: rng.shuffle(s.opts).map(([id, , label]) => ({ id, label })), answer: s.a,
    hint: 'Läs berättelsen en gång till – svaret finns där.', explain: s.ex,
  };
}

export const spaceApp = {
  id: 'space',
  name: 'Rymden',
  icon: '🚀',
  color: '#3b3f9e',
  tagline: 'Planeter, månen och stjärnor',
  modules: [
    { id: 'solar', name: 'Solsystemet', icon: '🪐', minLevel: 0, view: 'solar', lgr: ['no-himmel'], photo: () => photo('jupiter', { cls: 'tile-photo' }) },
    { id: 'rocket', name: 'Raketen', icon: '🚀', minLevel: 0, view: 'rocket', lgr: ['ma-tal'] },
    { id: 'quiz', name: 'Rymdquiz', icon: '❓', minLevel: 0, gen: genSpaceQuiz, lgr: ['no-himmel'] },
    { id: 'planetfacts', name: 'Planetfakta', icon: '🌎', minLevel: 0, gen: genPlanetFacts, lgr: ['no-himmel'] },
    { id: 'missions', name: 'Rymdfärder', icon: '🧑‍🚀', minLevel: 0, gen: genMissions, lgr: ['no-himmel', 'no-berattelse', 'so-tid'], photo: () => photo('astronaut', { cls: 'tile-photo' }) },
    { id: 'nightsky', name: 'Natthimlen', icon: '🌠', minLevel: 0, gen: genSky, lgr: ['no-himmel'], photo: () => photo('milkyway', { cls: 'tile-photo' }) },
    { id: 'timezones', name: 'Dag, natt & tidszoner', icon: '🕛', minLevel: 0, gen: genTime, lgr: ['no-himmel', 'so-karta', 'ma-tid'] },
    { id: 'skystories', name: 'Stjärnsagor', icon: '📜', minLevel: 1, gen: genSkyStories, lgr: ['no-berattelse', 'no-himmel'] },
    { id: 'photos', name: 'Rymdbilder', icon: '📸', minLevel: 0, gen: genSpacePhoto, lgr: ['no-himmel'], photo: () => photo('saturn', { cls: 'tile-photo' }) },
    { id: 'gallery', name: 'Bildgalleri', icon: '🖼️', minLevel: 0, view: 'gallery', lgr: ['no-himmel', 'no-berattelse'], photo: () => photo('pillars', { cls: 'tile-photo' }) },
    { id: 'daynight', name: 'Dag & natt', icon: '🌗', minLevel: 0, view: 'daynight', lgr: ['no-himmel'] },
    { id: 'moon', name: 'Månens faser', icon: '🌙', minLevel: 1, view: 'moon', lgr: ['no-himmel'], photo: () => photo('moon-first-quarter', { cls: 'tile-photo' }) },
    { id: 'moonquiz', name: 'Månen på foto', icon: '🌓', minLevel: 1, gen: genMoonPhase, lgr: ['no-himmel'], photo: () => photo('moon-waxing-crescent', { cls: 'tile-photo' }) },
    { id: 'order', name: 'Planetordning', icon: '🔢', minLevel: 1, gen: genPlanetOrder, lgr: ['no-himmel'] },
    { id: 'stars', name: 'Stjärnbilder', icon: '✨', minLevel: 1, view: 'stars', lgr: ['no-himmel', 'no-berattelse'] },
    { id: 'seasons', name: 'Varför årstider?', icon: '🌍', minLevel: 2, view: 'orbit', lgr: ['no-himmel', 'no-arstid'] },
  ],
};
