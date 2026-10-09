// Världen (SO): världsdelar, djur i världen, kända platser, Sverigekartan, väderstreck,
// förr i tiden, högtider och barnens rättigheter. Många frågor använder riktiga foton.
import { photo } from '../ui/img.js';

export const CONTINENTS = [
  { id: 'europa', name: 'Europa', color: '#3d8bfd', fact: 'Sverige ligger i Europa. Europa är en av de minsta världsdelarna men här bor väldigt många människor.' },
  { id: 'asien', name: 'Asien', color: '#f59e0b', fact: 'Asien är den största världsdelen. Här finns världens högsta berg, Mount Everest, och flest människor.' },
  { id: 'afrika', name: 'Afrika', color: '#ef4444', fact: 'I Afrika finns världens största öken, Sahara, och djur som lejon, elefanter och giraffer.' },
  { id: 'nordamerika', name: 'Nordamerika', color: '#22c55e', fact: 'Nordamerika sträcker sig från isiga Grönland och Kanada ner till varma Mexiko.' },
  { id: 'sydamerika', name: 'Sydamerika', color: '#a855f7', fact: 'I Sydamerika finns Amazonas regnskog och den långa bergskedjan Anderna.' },
  { id: 'oceanien', name: 'Oceanien', color: '#ec4899', fact: 'Oceanien är Australien och tusentals öar i Stilla havet. Där bor kängurur och koalor.' },
  { id: 'antarktis', name: 'Antarktis', color: '#94a3b8', fact: 'Antarktis är täckt av is och är den kallaste platsen på jorden. Där bor pingviner – men inga människor året runt.' },
];
export const ARKTIS = { id: 'arktis', name: 'Arktis (Nordpolen)', fact: 'Arktis är det isiga havet runt Nordpolen.' };

export const WORLD_ANIMALS = [
  { id: 'lejon', def: 'lejonet', name: 'Lejon', e: '🦁', home: 'afrika', fact: 'Lejon lever i grupper som kallas flockar. Det är oftast honorna som jagar.' },
  { id: 'elefant', def: 'den afrikanska elefanten', name: 'Afrikansk elefant', e: '🐘', home: 'afrika', fact: 'Den afrikanska elefanten är det största landdjuret. Den kan dricka över 100 liter vatten om dagen.' },
  { id: 'kanguru', def: 'kängurun', name: 'Känguru', e: '🦘', home: 'oceanien', fact: 'Kängurun bär sin unge i en pung på magen och kan hoppa fortare än en bil i stan.' },
  { id: 'koala', def: 'koalan', name: 'Koala', e: '🐨', home: 'oceanien', fact: 'Koalan äter nästan bara eukalyptusblad och sover upp till 20 timmar om dygnet.' },
  { id: 'panda', def: 'jättepandan', name: 'Jättepanda', e: '🐼', home: 'asien', fact: 'Jättepandan bor i bergsskogar i Kina och äter bambu nästan hela dagen.' },
  { id: 'tiger', def: 'tigern', name: 'Tiger', e: '🐯', home: 'asien', fact: 'Tigern är det största kattdjuret. Ingen tiger har exakt samma ränder som en annan.' },
  { id: 'kejsarpingvin', def: 'kejsarpingvinen', name: 'Kejsarpingvin', e: '🐧', home: 'antarktis', fact: 'Kejsarpingvinens pappa håller ägget varmt på fötterna i två månader mitt i vintern.' },
  { id: 'lama', def: 'laman', name: 'Lama', e: '🦙', home: 'sydamerika', fact: 'Laman lever i Anderna. Den kan bära packning uppe i bergen.' },
  { id: 'jaguar', def: 'jaguaren', name: 'Jaguar', e: '🐆', home: 'sydamerika', fact: 'Jaguaren lever i regnskogen och är – till skillnad från de flesta katter – bra på att simma.' },
  { id: 'bison', def: 'bisonoxen', name: 'Bisonoxe', e: '🦬', home: 'nordamerika', fact: 'Bisonoxen är Nordamerikas tyngsta landdjur. Förr vandrade miljontals över prärien.' },
  { id: 'ren', def: 'renen', name: 'Ren', e: '🦌', home: 'europa', fact: 'Renen lever i norra Sverige. Både hanar och honor har horn.' },
  { id: 'isbjorn', def: 'isbjörnen', name: 'Isbjörn', e: '🐻‍❄️', home: 'arktis', fact: 'Isbjörnen lever på isen runt Nordpolen. Pälsen ser vit ut men huden under är svart.' },
];

export const PLACES = [
  { id: 'eiffel', name: 'Eiffeltornet', country: 'Frankrike', flag: '🇫🇷', cont: 'europa', fact: 'Eiffeltornet i Paris byggdes 1889 och är över 300 meter högt.' },
  { id: 'colosseum', name: 'Colosseum', country: 'Italien', flag: '🇮🇹', cont: 'europa', fact: 'Colosseum i Rom är nästan 2 000 år gammalt. Där tittade romarna på skådespel.' },
  { id: 'sagrada', name: 'Sagrada Família', country: 'Spanien', flag: '🇪🇸', cont: 'europa', fact: 'Kyrkan i Barcelona har byggts i över 140 år och är fortfarande inte helt färdig.' },
  { id: 'vasa', name: 'Regalskeppet Vasa', country: 'Sverige', flag: '🇸🇪', cont: 'europa', fact: 'Vasa sjönk i Stockholm 1628 på sin första resa och bärgades 333 år senare.' },
  { id: 'pyramider', name: 'Pyramiderna i Giza', country: 'Egypten', flag: '🇪🇬', cont: 'afrika', fact: 'Pyramiderna byggdes för cirka 4 500 år sedan som gravar åt kungar, faraoner.' },
  { id: 'kilimanjaro', name: 'Kilimanjaro', country: 'Tanzania', flag: '🇹🇿', cont: 'afrika', fact: 'Kilimanjaro är Afrikas högsta berg. Det har snö på toppen fast det ligger nära ekvatorn.' },
  { id: 'muren', name: 'Kinesiska muren', country: 'Kina', flag: '🇨🇳', cont: 'asien', fact: 'Kinesiska muren är tusentals kilometer lång och byggdes för att skydda landet.' },
  { id: 'tajmahal', name: 'Taj Mahal', country: 'Indien', flag: '🇮🇳', cont: 'asien', fact: 'Taj Mahal är byggt av vit marmor och glittrar olika i morgon- och kvällsljus.' },
  { id: 'persepolis', name: 'Persepolis', country: 'Iran', flag: '🇮🇷', cont: 'asien', fact: 'Persepolis var en praktfull huvudstad i det gamla Persien för cirka 2 500 år sedan.' },
  { id: 'everest', name: 'Mount Everest', country: 'Nepal och Kina', flag: '🏔️', cont: 'asien', fact: 'Mount Everest är världens högsta berg – nästan 8 850 meter högt.' },
  { id: 'frihetsgudinnan', name: 'Frihetsgudinnan', country: 'USA', flag: '🇺🇸', cont: 'nordamerika', fact: 'Frihetsgudinnan i New York var en gåva från Frankrike och invigdes 1886.' },
  { id: 'machupicchu', name: 'Machu Picchu', country: 'Peru', flag: '🇵🇪', cont: 'sydamerika', fact: 'Machu Picchu är en inkastad högt uppe i Anderna, byggd på 1400-talet.' },
  { id: 'moai', name: 'Moai-statyerna', country: 'Chile (Påskön)', flag: '🇨🇱', cont: 'sydamerika', fact: 'På Påskön, som tillhör Chile, står hundratals stora stenhuvuden som kallas moai.' },
  { id: 'sydneyopera', name: 'Operahuset i Sydney', country: 'Australien', flag: '🇦🇺', cont: 'oceanien', fact: 'Taket på operahuset i Sydney ser ut som segel på ett skepp.' },
];

// Platser i Sverige med lat/lon (används på Sverigekartan).
export const SWEDISH_CITIES = [
  { id: 'goteborg', name: 'Göteborg', lat: 57.71, lon: 11.97, fact: 'Göteborg är Sveriges näst största stad och har en stor hamn vid Västerhavet.' },
  { id: 'stockholm', name: 'Stockholm', lat: 59.33, lon: 18.07, fact: 'Stockholm är Sveriges huvudstad och ligger på fjorton öar.' },
  { id: 'malmo', name: 'Malmö', lat: 55.6, lon: 13.0, fact: 'Från Malmö går Öresundsbron till Köpenhamn i Danmark.' },
  { id: 'kiruna', name: 'Kiruna', lat: 67.86, lon: 20.23, fact: 'I Kiruna går solen inte ner på sommaren – och inte upp mitt i vintern.' },
  { id: 'uppsala', name: 'Uppsala', lat: 59.86, lon: 17.64, fact: 'Uppsala har Nordens äldsta universitet, från 1477.' },
  { id: 'umea', name: 'Umeå', lat: 63.83, lon: 20.26, fact: 'Umeå kallas björkarnas stad.' },
  { id: 'visby', name: 'Visby', lat: 57.64, lon: 18.29, fact: 'Visby på Gotland har en ringmur från medeltiden.' },
  { id: 'helsingborg', name: 'Helsingborg', lat: 56.05, lon: 12.69, fact: 'Helsingborg ligger där Öresund är som smalast – bara 4 km till Danmark.' },
];

// Kartans gränser (Wikipedias kartdata för "Sweden location map").
export const SWEDEN_BOUNDS = { top: 69.5, bottom: 55.1, left: 10.4, right: 24.6 };
export function projectSweden(lat, lon, b = SWEDEN_BOUNDS) {
  return { x: (lon - b.left) / (b.right - b.left), y: (b.top - lat) / (b.top - b.bottom) };
}

/** Väderstreck från punkt A till punkt B (åtta riktningar). */
export function bearing8(from, to) {
  const dy = to.lat - from.lat;
  const dx = (to.lon - from.lon) * Math.cos(((from.lat + to.lat) / 2) * (Math.PI / 180));
  const deg = ((Math.atan2(dx, dy) * 180) / Math.PI + 360) % 360;
  const names = ['norr', 'nordost', 'öster', 'sydost', 'söder', 'sydväst', 'väster', 'nordväst'];
  return names[Math.round(deg / 45) % 8];
}

export const ERAS = [
  { id: 'sten', name: 'Stenåldern', img: 'flintyxa', e: '🪨', when: 'för 10 000 år sedan', fact: 'Människorna jagade, fiskade och gjorde verktyg av sten, ben och trä.' },
  { id: 'brons', name: 'Bronsåldern', img: 'hallristning', e: '🗿', when: 'för 3 500 år sedan', fact: 'Man gjorde saker av brons och ristade bilder i berget – som hällristningarna i Tanum i Bohuslän.' },
  { id: 'jarn', name: 'Järnåldern och vikingatiden', img: 'vikingaskepp', e: '⛵', when: 'för 1 200 år sedan', fact: 'Vikingarna seglade långt i sina skepp, handlade och skrev med runor.' },
  { id: 'medel', name: 'Medeltiden', img: 'visby', e: '🏰', when: 'för 700 år sedan', fact: 'Man byggde borgar, kyrkor och stadsmurar – som ringmuren i Visby.' },
  { id: 'anga', name: '1800-talet', img: 'angmaskin', e: '🚂', when: 'för 150 år sedan', fact: 'Ångloken kom och man kunde resa snabbt med tåg för första gången.' },
  { id: 'nu', name: 'I dag', img: null, e: '📱', when: 'nu', fact: 'Vi har datorer, mobiler och flygplan – och du lever just nu!' },
];

export const TIME_ITEMS = [
  { id: 'dino', e: '🦕', n: 'dinosaurier', bin: 'dati' },
  { id: 'hast', e: '🐴', n: 'häst och vagn', bin: 'dati' },
  { id: 'runa', e: '🪨', n: 'runsten', bin: 'dati' },
  { id: 'mobil', e: '📱', n: 'mobiltelefon', bin: 'nu' },
  { id: 'skola', e: '🏫', n: 'din skola', bin: 'nu' },
  { id: 'cykel', e: '🚲', n: 'du cyklar', bin: 'nu' },
  { id: 'vuxen', e: '🧑', n: 'när du är vuxen', bin: 'fram' },
  { id: 'mars', e: '🚀', n: 'människor på Mars', bin: 'fram' },
  { id: 'imorgon', e: '📅', n: 'i morgon', bin: 'fram' },
];

export const HOLIDAYS = [
  { id: 'julgran', name: 'Jul', tradition: 'kristendomen', fact: 'Julen firas till minne av Jesus födelse. I Sverige firar vi på julafton den 24 december.' },
  { id: 'pasagg', name: 'Påsk', tradition: 'kristendomen', fact: 'Påsken är kristendomens viktigaste högtid. I Sverige målar vi ägg och klär ut oss till påskkärringar.' },
  { id: 'menora', name: 'Chanukka', tradition: 'judendomen', fact: 'Under chanukka tänds ett nytt ljus i ljusstaken varje kväll i åtta dagar.' },
  { id: 'eid', name: 'Eid al-fitr', tradition: 'islam', fact: 'Eid al-fitr firas när fastemånaden ramadan är slut – med fest, nya kläder och god mat.' },
  { id: 'nowruz', name: 'Nowruz', tradition: 'persiskt nyår', fact: 'Nowruz betyder "ny dag" och firas vid vårdagjämningen i Iran och många andra länder – med ett dukat bord med sju saker.' },
  { id: 'lucia', name: 'Lucia', tradition: 'svensk tradition', fact: 'Den 13 december sjunger lucia och hennes följe med ljus i håret i den mörka vintern.' },
  { id: 'midsommar', name: 'Midsommar', tradition: 'svensk tradition', fact: 'På midsommar dansar vi runt midsommarstången när dagarna är som längst.' },
];

export const RIGHTS = [
  { right: 'att gå i skolan', silly: ['att aldrig borsta tänderna', 'att bestämma över vuxna'], fact: 'Alla barn har rätt till utbildning (barnkonventionen artikel 28).' },
  { right: 'att leka och vila', silly: ['att äta godis varje dag', 'att ha en egen häst'], fact: 'Alla barn har rätt till lek, vila och fritid (artikel 31).' },
  { right: 'att säga vad de tycker', silly: ['att alltid få sin vilja igenom', 'att slippa städa'], fact: 'Barn har rätt att säga sin åsikt, och vuxna ska lyssna (artikel 12).' },
  { right: 'att få vård när de är sjuka', silly: ['att få en ny mobil varje år', 'att aldrig gå och lägga sig'], fact: 'Alla barn har rätt till sjukvård och att må bra (artikel 24).' },
  { right: 'att vara trygga och skyddas från våld', silly: ['att få vara uppe hela natten', 'att bara äta glass'], fact: 'Alla barn har rätt att skyddas mot våld (artikel 19).' },
  { right: 'att behandlas lika, oavsett var de kommer ifrån', silly: ['att vinna alla tävlingar', 'att få bestämma i skolan'], fact: 'Alla barn är lika mycket värda (artikel 2). Barnkonventionen är svensk lag sedan 2020.' },
];

const contName = (id) => (id === 'arktis' ? ARKTIS.name : CONTINENTS.find((c) => c.id === id).name);
const pic = (key, alt, e) => photo(key, { alt, cls: 'qphoto', fallback: `<span class="pic-big">${e || '🖼️'}</span>` });

/* ---------- Djur i världen ---------- */
export function genWorldAnimals(level, rng) {
  const a = rng.pick(WORLD_ANIMALS);
  if (level === 0) {
    // De yngsta: välj rätt djur bland tre foton.
    const others = rng.sample(WORLD_ANIMALS.filter((x) => x.id !== a.id), 2);
    return {
      type: 'choice', prompt: `Var är ${a.name.toLowerCase()}?`, wide: true,
      options: rng.shuffle([a, ...others]).map((x) => ({ id: x.id, html: photo(x.id, { alt: '', cls: 'ophoto', fallback: `<span class="pic">${x.e}</span>` }), say: '' })),
      answer: a.id, hint: `Leta efter ${a.e}`, explain: a.fact, collect: { set: 'places', item: a.id },
    };
  }
  const regions = [...CONTINENTS.map((c) => c.id), 'arktis'];
  const wrong = rng.sample(regions.filter((r) => r !== a.home), level <= 1 ? 2 : 3);
  return {
    type: 'choice', prompt: `Var i världen bor ${a.def} i det vilda?`,
    visual: pic(a.id, a.name, a.e),
    options: rng.shuffle([a.home, ...wrong]).map((r) => ({ id: r, label: contName(r) })),
    answer: a.home, hint: 'Tänk på klimatet: varmt, kallt, regnskog eller öken?', explain: a.fact, collect: { set: 'places', item: a.id },
  };
}

/* ---------- Kända platser ---------- */
export function genPlaces(level, rng) {
  const pl = rng.pick(PLACES);
  if (level === 0) {
    const others = rng.sample(PLACES.filter((x) => x.id !== pl.id), 2);
    return {
      type: 'choice', prompt: `Var är ${pl.name}?`, wide: true,
      options: rng.shuffle([pl, ...others]).map((x) => ({ id: x.id, html: photo(x.id, { alt: '', cls: 'ophoto', fallback: `<span class="pic">${x.flag}</span>` }), say: '' })),
      answer: pl.id, hint: pl.fact, explain: pl.fact, collect: { set: 'places', item: pl.id },
    };
  }
  if (level === 1 || rng.chance(0.4)) {
    const others = rng.sample(PLACES.filter((x) => x.id !== pl.id), 2);
    return {
      type: 'choice', prompt: 'Vad heter platsen på bilden?', visual: pic(pl.id, pl.name, pl.flag),
      options: rng.shuffle([pl, ...others]).map((x) => ({ id: x.id, label: x.name })), answer: pl.id,
      hint: `Den finns i ${pl.country}.`, explain: pl.fact, collect: { set: 'places', item: pl.id },
    };
  }
  const others = rng.sample([...new Map(PLACES.filter((x) => x.country !== pl.country).map((x) => [x.country, x])).values()], level >= 3 ? 3 : 2);
  return {
    type: 'choice', prompt: `I vilket land finns ${pl.name}?`, visual: pic(pl.id, pl.name, pl.flag),
    options: rng.shuffle([pl, ...others]).map((x) => ({ id: x.country, label: `${x.flag} ${x.country}`, say: x.country })), answer: pl.country,
    hint: `Det ligger i ${contName(pl.cont)}.`, explain: pl.fact, collect: { set: 'places', item: pl.id },
  };
}

/* ---------- Väderstreck ---------- */
export const COMPASS = [
  { id: 'norr', short: 'N', deg: 0 }, { id: 'öster', short: 'Ö', deg: 90 }, { id: 'söder', short: 'S', deg: 180 }, { id: 'väster', short: 'V', deg: 270 },
  { id: 'nordost', short: 'NO', deg: 45 }, { id: 'sydost', short: 'SO', deg: 135 }, { id: 'sydväst', short: 'SV', deg: 225 }, { id: 'nordväst', short: 'NV', deg: 315 },
];
export function compassSvg(deg, { labels = true } = {}) {
  const lab = labels ? COMPASS.slice(0, 4).map((c) => {
    const a = ((c.deg - 90) * Math.PI) / 180;
    return `<text x="${100 + Math.cos(a) * 82}" y="${100 + Math.sin(a) * 82 + 8}" text-anchor="middle" font-size="22" font-weight="800" fill="#1f2a44" font-family="var(--font-display)">${c.short}</text>`;
  }).join('') : '';
  return `<svg class="compass" viewBox="0 0 200 200" role="img" aria-label="kompass"><circle cx="100" cy="100" r="96" fill="#fff" stroke="#1f2a44" stroke-width="4"/>
    <polygon points="100,22 112,100 100,178 88,100" fill="#e5e7eb"/><polygon points="22,100 100,88 178,100 100,112" fill="#e5e7eb"/>${lab}
    <g transform="rotate(${deg} 100 100)"><polygon points="100,30 114,104 100,96 86,104" fill="#ef4444"/><polygon points="100,170 114,104 100,112 86,104" fill="#94a3b8"/></g><circle cx="100" cy="100" r="7" fill="#1f2a44"/></svg>`;
}
export function genCompass(level, rng) {
  if (level >= 2 && rng.chance(0.5)) {
    const from = SWEDISH_CITIES[0];
    const to = rng.pick(SWEDISH_CITIES.filter((c) => c.id !== 'goteborg' && c.id !== 'helsingborg'));
    const ans = bearing8(from, to);
    const opts = rng.shuffle([ans, ...rng.sample(COMPASS.map((c) => c.id).filter((c) => c !== ans), 2)]);
    return {
      type: 'choice', prompt: `Du är i Göteborg. Åt vilket håll ligger ${to.name}?`, visual: photo('sverigekarta', { alt: 'Sverigekarta', cls: 'qphoto map' }) || compassSvg(0),
      options: opts.map((o) => ({ id: o, label: o })), answer: ans, hint: 'Norr är uppåt på kartan.', explain: `${to.name} ligger åt ${ans} från Göteborg. ${to.fact}`,
    };
  }
  if (rng.chance(0.3)) {
    const facts = [
      { q: 'Åt vilket håll går solen upp?', a: 'öster', ex: 'Solen går upp i öster och ner i väster.' },
      { q: 'Åt vilket håll går solen ner?', a: 'väster', ex: 'Solen går ner i väster.' },
      { q: 'Vilket väderstreck är uppåt på en karta?', a: 'norr', ex: 'På kartor är norr nästan alltid uppåt.' },
      { q: 'Åt vilket håll pekar en kompassnål?', a: 'norr', ex: 'Kompassnålen är en magnet som pekar mot norr.' },
    ];
    const f = rng.pick(facts);
    return { type: 'choice', prompt: f.q, visual: compassSvg(0), options: rng.shuffle(['norr', 'söder', 'öster', 'väster']).map((o) => ({ id: o, label: o })), answer: f.a, hint: 'Kom ihåg: Norr, Öster, Söder, Väster – medsols.', explain: f.ex };
  }
  const pool = level <= 1 ? COMPASS.slice(0, 4) : COMPASS;
  const c = rng.pick(pool);
  const opts = rng.shuffle([c, ...rng.sample(pool.filter((x) => x !== c), level <= 1 ? 2 : 3)]);
  return {
    type: 'choice', prompt: 'Åt vilket väderstreck pekar den röda pilen?', visual: compassSvg(c.deg),
    options: opts.map((o) => ({ id: o.id, label: o.id })), answer: c.id, hint: 'N betyder norr. Gå medsols: norr, öster, söder, väster.', explain: `Pilen pekar mot ${c.id}.`,
  };
}

/* ---------- Förr i tiden ---------- */
export function genHistory(level, rng) {
  if (level <= 1 && rng.chance(0.5)) {
    const bins = [{ id: 'dati', label: 'Dåtid', html: '⏪' }, { id: 'nu', label: 'Nutid', html: '⏺️' }, { id: 'fram', label: 'Framtid', html: '⏩' }];
    const items = rng.sample(TIME_ITEMS, level === 0 ? 4 : 6);
    return {
      type: 'sort', prompt: 'Hände det förr, händer det nu eller i framtiden?', bins,
      items: items.map((i) => ({ id: i.id, html: `<span class="pic sm">${i.e}</span><span class="lbl">${i.n}</span>`, bin: i.bin, say: i.n })),
      hint: 'Dåtid är det som redan har hänt. Framtid är det som inte har hänt än.', explain: 'Dåtid, nutid och framtid – så kan vi prata om tid.',
    };
  }
  if (rng.chance(0.5)) {
    const eras = level <= 2 ? [ERAS[0], ERAS[2], ERAS[5]] : rng.sample(ERAS, 4).sort((a, b) => ERAS.indexOf(a) - ERAS.indexOf(b));
    return {
      type: 'order', prompt: 'Gör en tidslinje! Tryck från det äldsta till det nyaste.',
      items: rng.shuffle(eras).map((e) => ({ id: e.id, html: `${e.img ? photo(e.img, { alt: '', cls: 'tphoto', fallback: `<span class="pic sm">${e.e}</span>` }) : `<span class="pic sm">${e.e}</span>`}<span class="lbl">${e.name}</span>`, say: e.name })),
      answer: undefined, answerOrder: eras.map((e) => e.id), joiner: '→', hint: 'Stenåldern var allra först – för väldigt länge sedan.', explain: eras.map((e) => `${e.name}: ${e.when}`).join('. ') + '.',
    };
  }
  const era = rng.pick(ERAS.slice(0, 5));
  const others = rng.sample(ERAS.filter((e) => e !== era), 2);
  return {
    type: 'choice', prompt: 'Vilken tid kommer bilden från?', visual: era.img ? pic(era.img, era.name, era.e) : `<span class="pic-big">${era.e}</span>`,
    options: rng.shuffle([era, ...others]).map((e) => ({ id: e.id, label: e.name })), answer: era.id, hint: era.fact, explain: `${era.name} – ${era.when}. ${era.fact}`,
  };
}

/* ---------- Högtider ---------- */
export function genHolidays(level, rng) {
  const ho = rng.pick(HOLIDAYS);
  if (level >= 2 && rng.chance(0.5)) {
    const trads = [...new Set(HOLIDAYS.map((x) => x.tradition))];
    return {
      type: 'choice', prompt: `${ho.name} – vilken tradition eller religion hör högtiden till?`, visual: pic(ho.id, ho.name, '🎉'),
      options: rng.shuffle([ho.tradition, ...rng.sample(trads.filter((t) => t !== ho.tradition), 2)]).map((t) => ({ id: t, label: t })), answer: ho.tradition,
      hint: 'Fundera på vem som firar högtiden.', explain: ho.fact,
    };
  }
  const others = rng.sample(HOLIDAYS.filter((x) => x !== ho), 2);
  return {
    type: 'choice', prompt: 'Vilken högtid visar bilden?', visual: pic(ho.id, ho.name, '🎉'),
    options: rng.shuffle([ho, ...others]).map((x) => ({ id: x.id, label: x.name })), answer: ho.id, hint: 'Titta på detaljerna i bilden.', explain: ho.fact,
  };
}

/* ---------- Barnens rättigheter ---------- */
export function genRights(level, rng) {
  const r = rng.pick(RIGHTS);
  return {
    type: 'choice', prompt: 'Vilken rättighet har alla barn i hela världen?', visual: '<span class="pic-big">🧒🌍</span>',
    options: rng.shuffle([r.right, ...r.silly]).map((t) => ({ id: t, label: `Rätt ${t}` })), answer: r.right,
    hint: 'Barnkonventionen handlar om sådant som alla barn behöver för att må bra.', explain: r.fact,
  };
}

/* ---------- Bildquiz om rymden (används även av Rymden) ---------- */
export const worldApp = {
  id: 'world',
  name: 'Världen',
  icon: '🌍',
  color: '#0f9d8a',
  tagline: 'Länder, kartor, djur och förr i tiden',
  modules: [
    { id: 'continents', name: 'Världsdelar', icon: '🗺️', minLevel: 0, view: 'continents', lgr: ['so-karta', 'so-varlden'], photo: () => photo('worldmap', { cls: 'tile-photo' }) },
    { id: 'animals', name: 'Djur i världen', icon: '🦁', minLevel: 0, gen: genWorldAnimals, lgr: ['so-varlden', 'no-arter'], photo: () => photo('lejon', { cls: 'tile-photo' }) },
    { id: 'places', name: 'Kända platser', icon: '🗼', minLevel: 0, gen: genPlaces, lgr: ['so-platser'], photo: () => photo('eiffel', { cls: 'tile-photo' }) },
    { id: 'sweden', name: 'Sverigekartan', icon: '🇸🇪', minLevel: 1, view: 'sweden', lgr: ['so-karta', 'so-platser'], photo: () => photo('sverigekarta', { cls: 'tile-photo map' }) },
    { id: 'compass', name: 'Väderstreck', icon: '🧭', minLevel: 1, gen: genCompass, lgr: ['so-karta'] },
    { id: 'history', name: 'Förr i tiden', icon: '⏳', minLevel: 0, gen: genHistory, lgr: ['so-tid', 'so-forntid'], photo: () => photo('vikingaskepp', { cls: 'tile-photo' }) },
    { id: 'holidays', name: 'Högtider', icon: '🎉', minLevel: 1, gen: genHolidays, lgr: ['so-hogtid'], photo: () => photo('lucia', { cls: 'tile-photo' }) },
    { id: 'rights', name: 'Barnens rättigheter', icon: '🤝', minLevel: 1, gen: genRights, lgr: ['so-rattigheter'] },
  ],
};
