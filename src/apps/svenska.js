// Svenska-appen: språklig medvetenhet (rim, stavelser, ljud), bokstäver,
// läsning, ordbyggen, meningar och berättelser med läsförståelse.

export const ALPHABET = [
  { l: 'A', word: 'apa', e: '🐒' },
  { l: 'B', word: 'banan', e: '🍌' },
  { l: 'C', word: 'citron', e: '🍋', rare: true },
  { l: 'D', word: 'delfin', e: '🐬' },
  { l: 'E', word: 'elefant', e: '🐘' },
  { l: 'F', word: 'fisk', e: '🐟' },
  { l: 'G', word: 'gris', e: '🐷' },
  { l: 'H', word: 'hus', e: '🏠' },
  { l: 'I', word: 'igelkott', e: '🦔' },
  { l: 'J', word: 'jordgubbe', e: '🍓' },
  { l: 'K', word: 'katt', e: '🐱' },
  { l: 'L', word: 'lejon', e: '🦁' },
  { l: 'M', word: 'måne', e: '🌙' },
  { l: 'N', word: 'nyckel', e: '🔑' },
  { l: 'O', word: 'orm', e: '🐍' },
  { l: 'P', word: 'päron', e: '🍐' },
  { l: 'Q', word: 'quiz', e: '❓', rare: true },
  { l: 'R', word: 'raket', e: '🚀' },
  { l: 'S', word: 'sol', e: '☀️' },
  { l: 'T', word: 'tåg', e: '🚂' },
  { l: 'U', word: 'uggla', e: '🦉' },
  { l: 'V', word: 'val', e: '🐳' },
  { l: 'W', word: 'wok', e: '🥘', rare: true },
  { l: 'X', word: 'xylofon', e: '🎼', rare: true },
  { l: 'Y', word: 'yxa', e: '🪓' },
  { l: 'Z', word: 'zebra', e: '🦓', rare: true },
  { l: 'Å', word: 'åska', e: '⛈️' },
  { l: 'Ä', word: 'äpple', e: '🍎' },
  { l: 'Ö', word: 'öga', e: '👁️' },
];
export const LETTERS = ALPHABET.map((a) => a.l);
const COMMON = ALPHABET.filter((a) => !a.rare);

// Ordbank med bilder, sorterad efter längd (för ordbygge och läsning).
export const WORDS = [
  { w: 'ko', e: '🐄' }, { w: 'is', e: '🧊' }, { w: 'ost', e: '🧀' }, { w: 'sol', e: '☀️' }, { w: 'bil', e: '🚗' },
  { w: 'mus', e: '🐭' }, { w: 'hus', e: '🏠' }, { w: 'båt', e: '⛵' }, { w: 'får', e: '🐑' }, { w: 'bok', e: '📖' },
  { w: 'tåg', e: '🚂' }, { w: 'ägg', e: '🥚' }, { w: 'sko', e: '👟' }, { w: 'lök', e: '🧅' }, { w: 'ris', e: '🍚' },
  { w: 'ben', e: '🦴' }, { w: 'sax', e: '✂️' }, { w: 'apa', e: '🐒' }, { w: 'orm', e: '🐍' }, { w: 'uggla', e: '🦉' },
  { w: 'katt', e: '🐱' }, { w: 'hund', e: '🐶' }, { w: 'fisk', e: '🐟' }, { w: 'häst', e: '🐴' }, { w: 'måne', e: '🌙' },
  { w: 'boll', e: '⚽' }, { w: 'keps', e: '🧢' }, { w: 'kaka', e: '🍪' }, { w: 'hatt', e: '🎩' }, { w: 'ring', e: '💍' },
  { w: 'gris', e: '🐷' }, { w: 'glass', e: '🍦' }, { w: 'banan', e: '🍌' }, { w: 'tomat', e: '🍅' }, { w: 'morot', e: '🥕' },
  { w: 'groda', e: '🐸' }, { w: 'raket', e: '🚀' }, { w: 'robot', e: '🤖' }, { w: 'drake', e: '🐉' }, { w: 'krona', e: '👑' },
  { w: 'lampa', e: '💡' }, { w: 'päron', e: '🍐' }, { w: 'nyckel', e: '🔑' }, { w: 'pingvin', e: '🐧' }, { w: 'cykel', e: '🚲' },
  { w: 'snigel', e: '🐌' }, { w: 'paraply', e: '☂️' }, { w: 'ananas', e: '🍍' }, { w: 'giraff', e: '🦒' }, { w: 'fjäril', e: '🦋' },
];

export const RHYMES = [
  [{ w: 'hus', e: '🏠' }, { w: 'mus', e: '🐭' }],
  [{ w: 'katt', e: '🐱' }, { w: 'hatt', e: '🎩' }],
  [{ w: 'ko', e: '🐄' }, { w: 'sko', e: '👟' }],
  [{ w: 'sol', e: '☀️' }, { w: 'stol', e: '🪑' }],
  [{ w: 'nyckel', e: '🔑' }, { w: 'cykel', e: '🚲' }],
  [{ w: 'orm', e: '🐍' }, { w: 'storm', e: '🌪️' }],
  [{ w: 'tåg', e: '🚂' }, { w: 'våg', e: '🌊' }],
  [{ w: 'boll', e: '⚽' }, { w: 'noll', e: '0️⃣' }],
  [{ w: 'gris', e: '🐷' }, { w: 'ris', e: '🍚' }],
  [{ w: 'bil', e: '🚗' }, { w: 'pil', e: '➡️' }],
  [{ w: 'bok', e: '📖' }, { w: 'krok', e: '🪝' }],
  [{ w: 'båt', e: '⛵' }, { w: 'gråt', e: '😢' }],
];

export const SYLLABLES = [
  { w: 'ko', e: '🐄', s: ['ko'] },
  { w: 'sol', e: '☀️', s: ['sol'] },
  { w: 'hus', e: '🏠', s: ['hus'] },
  { w: 'katt', e: '🐱', s: ['katt'] },
  { w: 'apa', e: '🐒', s: ['a', 'pa'] },
  { w: 'banan', e: '🍌', s: ['ba', 'nan'] },
  { w: 'uggla', e: '🦉', s: ['ugg', 'la'] },
  { w: 'tomat', e: '🍅', s: ['to', 'mat'] },
  { w: 'giraff', e: '🦒', s: ['gi', 'raff'] },
  { w: 'fjäril', e: '🦋', s: ['fjä', 'ril'] },
  { w: 'fotboll', e: '⚽', s: ['fot', 'boll'] },
  { w: 'pingvin', e: '🐧', s: ['ping', 'vin'] },
  { w: 'elefant', e: '🐘', s: ['e', 'le', 'fant'] },
  { w: 'krokodil', e: '🐊', s: ['kro', 'ko', 'dil'] },
  { w: 'paraply', e: '☂️', s: ['pa', 'ra', 'ply'] },
  { w: 'ananas', e: '🍍', s: ['a', 'na', 'nas'] },
  { w: 'snögubbe', e: '⛄', s: ['snö', 'gub', 'be'] },
  { w: 'sköldpadda', e: '🐢', s: ['sköld', 'pad', 'da'] },
  { w: 'nyckelpiga', e: '🐞', s: ['nyck', 'el', 'pi', 'ga'] },
  { w: 'helikopter', e: '🚁', s: ['he', 'li', 'kop', 'ter'] },
];

export const OPPOSITES = [
  ['stor', 'liten'], ['varm', 'kall'], ['glad', 'ledsen'], ['snabb', 'långsam'], ['ljus', 'mörk'],
  ['upp', 'ner'], ['full', 'tom'], ['gammal', 'ny'], ['våt', 'torr'], ['tung', 'lätt'],
  ['öppen', 'stängd'], ['lång', 'kort'], ['hård', 'mjuk'], ['dag', 'natt'], ['först', 'sist'],
];
export const SYNONYMS = [
  ['glad', 'lycklig'], ['stor', 'enorm'], ['snabb', 'kvick'], ['prata', 'tala'], ['titta', 'se'],
  ['arg', 'sur'], ['rädd', 'skrämd'], ['liten', 'pytte'], ['vacker', 'fin'], ['börja', 'starta'],
  ['sluta', 'avsluta'], ['springa', 'rusa'], ['smart', 'klok'], ['tyst', 'ljudlös'],
];

export const SENTENCES = [
  'Katten sover i solen.',
  'Jag har en röd boll.',
  'Hunden springer fort.',
  'Vi äter glass på sommaren.',
  'Månen lyser på natten.',
  'Min syster läser en bok.',
  'Fågeln bygger ett bo.',
  'Det regnar ute i dag.',
  'Ekorren samlar nötter.',
  'Raketen flyger till månen.',
  'Vi cyklar till skolan.',
  'Morfar odlar tomater.',
];

export const PUNCTUATION = [
  { s: 'Vad heter du', p: '?' },
  { s: 'Hur gammal är du', p: '?' },
  { s: 'Var bor du', p: '?' },
  { s: 'Vilken dag är det i dag', p: '?' },
  { s: 'Jag tycker om äpplen', p: '.' },
  { s: 'Solen skiner', p: '.' },
  { s: 'Vi går till parken', p: '.' },
  { s: 'Hunden heter Sixten', p: '.' },
  { s: 'Akta dig', p: '!' },
  { s: 'Vad roligt det här är', p: '!' },
  { s: 'Hjälp', p: '!' },
  { s: 'Grattis på födelsedagen', p: '!' },
];

export const STORIES = [
  {
    id: 'myran', title: 'Mira och myran', e: '🐜', level: 1,
    text: [
      'Mira är ute i skogen.',
      'Hon ser en liten myra.',
      'Myran bär ett stort barr.',
      'Barret är mycket längre än myran!',
      'Myran slutar inte.',
      'Den bär barret hela vägen hem till stacken.',
      '– Vad stark du är! säger Mira.',
    ],
    questions: [
      { q: 'Var är Mira?', a: 'i skogen', o: ['i skogen', 'på stranden', 'i skolan'] },
      { q: 'Vad bär myran?', a: 'ett barr', o: ['ett barr', 'ett äpple', 'en sten'] },
      { q: 'Vad tycker Mira om myran?', a: 'att den är stark', o: ['att den är stark', 'att den är långsam', 'att den är rädd'] },
    ],
  },
  {
    id: 'regn', title: 'Leo och regnet', e: '🌧️', level: 1,
    text: [
      'Det regnar.',
      'Leo är ledsen.',
      'Han vill gå ut och leka.',
      'Mamma ger honom stövlar och regnjacka.',
      'Nu hoppar Leo i vattenpölar.',
      'Plask, plask!',
      'Leo är glad igen.',
    ],
    questions: [
      { q: 'Varför är Leo ledsen i början?', a: 'det regnar och han vill ut', o: ['det regnar och han vill ut', 'han är hungrig', 'han har tappat sin boll'] },
      { q: 'Vad får Leo av mamma?', a: 'stövlar och regnjacka', o: ['stövlar och regnjacka', 'en glass', 'en bok'] },
      { q: 'Hur känner sig Leo i slutet?', a: 'glad', o: ['glad', 'arg', 'trött'] },
    ],
  },
  {
    id: 'pip', title: 'Roboten Pip', e: '🤖', level: 2,
    text: [
      'Pip är en liten robot som bor i ett klassrum.',
      'Varje kväll, när alla barn har gått hem, vaknar Pip.',
      'En kväll hittar Pip en penna på golvet.',
      'Pip vill hjälpa till. Men vems penna är det?',
      'På pennan står det ett namn: SARA.',
      'Pip rullar till Saras bänk och lägger pennan där.',
      'På morgonen blir Sara jätteglad.',
      '– Någon har hittat min penna! ropar hon.',
      'Pip blinkar lite med sin lampa, men säger ingenting.',
    ],
    questions: [
      { q: 'När vaknar Pip?', a: 'på kvällen', o: ['på kvällen', 'på morgonen', 'mitt på dagen'] },
      { q: 'Hur visste Pip vems pennan var?', a: 'namnet stod på pennan', o: ['namnet stod på pennan', 'Pip gissade', 'läraren sa det'] },
      { q: 'Vad gör Pip när Sara blir glad?', a: 'blinkar med lampan', o: ['blinkar med lampan', 'sjunger en sång', 'pratar med Sara'] },
    ],
  },
  {
    id: 'ekorre', title: 'Ekorren som glömde', e: '🐿️', level: 2,
    text: [
      'Det var höst, och ekorren Ella samlade nötter.',
      'Hon grävde ner dem på massor av ställen i skogen.',
      'När vintern kom var Ella hungrig.',
      'Men var hade hon gömt alla nötter?',
      'Några hittade hon, men många glömde hon bort.',
      'På våren hände något fantastiskt.',
      'Där Ella hade gömt nötter växte små hasselbuskar upp!',
      'Ekorrens glömska blev till nya buskar i skogen.',
    ],
    questions: [
      { q: 'När samlade Ella nötter?', a: 'på hösten', o: ['på hösten', 'på sommaren', 'på våren'] },
      { q: 'När var Ella hungrig?', a: 'på vintern', o: ['på vintern', 'på sommaren', 'på hösten'] },
      { q: 'Vad hände med nötterna hon glömde?', a: 'de blev nya buskar', o: ['de blev nya buskar', 'fåglarna åt upp dem', 'de blev till stenar'] },
    ],
  },
  {
    id: 'manresan', title: 'Månresan', e: '🚀', level: 3,
    text: [
      'Tove och hennes lillebror Sam byggde en raket av en stor kartong.',
      'De målade den silvrig och ritade runda fönster med svart penna.',
      '– Tio, nio, åtta … räknade Tove ända ner till noll.',
      'Sam tryckte på startknappen, som egentligen var en flaskkork.',
      'I fantasin susade de förbi molnen och ut i rymden.',
      'Där var det alldeles svart och fullt av stjärnor.',
      'De landade på månen och hoppade jättehögt, för på månen drar tyngdkraften mycket svagare än på jorden.',
      'Plötsligt ropade pappa: – Middag!',
      'Raketen fick landa snabbt i vardagsrummet.',
      '– Vi åker tillbaka i morgon, viskade Sam.',
    ],
    questions: [
      { q: 'Vad var raketen gjord av?', a: 'kartong', o: ['kartong', 'metall', 'trä'] },
      { q: 'Varför kunde de hoppa så högt på månen?', a: 'tyngdkraften är svagare där', o: ['tyngdkraften är svagare där', 'de hade fjädrar i skorna', 'månen är mjuk'] },
      { q: 'Varför åkte de hem igen?', a: 'pappa ropade att det var middag', o: ['pappa ropade att det var middag', 'raketen gick sönder', 'det blev natt'] },
    ],
  },
  {
    id: 'maskros', title: 'Maskrosen i asfalten', e: '🌼', level: 3,
    text: [
      'Utanför Omars skola fanns bara grå asfalt.',
      'En dag såg Omar en liten maskros som växte i en spricka.',
      '– Hur kan en blomma växa här? undrade han.',
      'Fröken förklarade att maskrosens frö hade flugit dit med vinden, som en pytteliten fallskärm.',
      'I sprickan fanns lite jord och regnvatten. Det räckte!',
      'Omar och hans klass bestämde sig för att hjälpa naturen.',
      'De planterade blommor i stora lådor och byggde ett insektshotell.',
      'Snart surrade bin och humlor runt skolgården.',
      '– Vår grå skolgård har blivit grön, sa Omar stolt.',
    ],
    questions: [
      { q: 'Hur kom maskrosfröet till sprickan?', a: 'med vinden', o: ['med vinden', 'någon planterade det', 'en mask bar dit det'] },
      { q: 'Vad behövde maskrosen för att växa?', a: 'jord och vatten', o: ['jord och vatten', 'sand och is', 'ingenting alls'] },
      { q: 'Vad byggde klassen åt insekterna?', a: 'ett insektshotell', o: ['ett insektshotell', 'ett fågelbo', 'en damm'] },
    ],
  },
];

const pictureOpt = (x) => ({ id: x.w, html: `<span class="pic">${x.e}</span>`, say: x.w });
const letterOpt = (l) => ({ id: l, label: l, say: l });

/* ---------- Bokstavsljud: vilken bild börjar på bokstaven? ---------- */
export function genLetterPic(level, rng) {
  const pool = level === 0 ? COMMON.slice(0, 14) : COMMON;
  const target = rng.pick(pool);
  const others = rng.sample(COMMON.filter((a) => a.l !== target.l), level === 0 ? 2 : 3);
  return {
    type: 'choice',
    prompt: `Vilken bild börjar på ${target.l}?`,
    say: `Vilken bild börjar på bokstaven ${target.l}?`,
    visual: `<div class="big-letter">${target.l}<small>${target.l.toLowerCase()}</small></div>`,
    options: rng.shuffle([target, ...others].map((a) => ({ id: a.l, html: `<span class="pic">${a.e}</span>`, say: a.word }))),
    answer: target.l,
    hint: 'Säg orden högt och lyssna på första ljudet.',
    explain: `${target.l} som i ${target.word}.`,
    collect: { set: 'lettersHeard', item: target.l },
  };
}

/* ---------- Första ljudet: vilken bokstav börjar ordet på? ---------- */
export function genFirstSound(level, rng) {
  const pool = level <= 1 ? COMMON : ALPHABET;
  const target = rng.pick(pool);
  const confusable = { B: ['D', 'P'], D: ['B', 'T'], P: ['B', 'T'], M: ['N'], N: ['M'], E: ['Ä', 'I'], Ä: ['E', 'Å'], Å: ['O', 'Ä'], O: ['Å', 'U'], U: ['O', 'Y'], Y: ['U', 'I'], I: ['E', 'Y'], G: ['K', 'J'], K: ['G', 'T'], S: ['F', 'Z'], F: ['V', 'S'], V: ['F', 'W'] };
  let others = level >= 2 && confusable[target.l] ? confusable[target.l].slice(0, 2) : [];
  const rest = rng.shuffle(LETTERS.filter((l) => l !== target.l && !others.includes(l)));
  while (others.length < 2) others.push(rest.pop());
  return {
    type: 'choice',
    prompt: `Vilken bokstav börjar ${target.word} på?`,
    visual: `<div class="pic-big">${target.e}</div>`,
    options: rng.shuffle([target.l, ...others].map(letterOpt)),
    answer: target.l,
    hint: `Säg ${target.word} långsamt. Vilket ljud hör du först?`,
    explain: `${target.word} börjar på ${target.l}.`,
    collect: { set: 'lettersHeard', item: target.l },
  };
}

/* ---------- Rimma ---------- */
export function genRhyme(level, rng) {
  const pair = rng.pick(RHYMES);
  const [a, b] = rng.shuffle(pair);
  const others = rng.sample(RHYMES.filter((p) => p !== pair).flat(), level === 0 ? 1 : 2);
  const useText = level >= 2;
  return {
    type: 'choice',
    prompt: `Vad rimmar på ${a.w}?`,
    visual: `<div class="pic-big">${a.e}${useText ? `<div class="word">${a.w}</div>` : ''}</div>`,
    options: rng.shuffle([b, ...others]).map((x) => (useText ? { id: x.w, html: `<span class="pic sm">${x.e}</span><span>${x.w}</span>`, say: x.w } : pictureOpt(x))),
    answer: b.w,
    hint: 'Ord som rimmar slutar likadant – som hus och mus.',
    explain: `${a.w} och ${b.w} rimmar!`,
  };
}

/* ---------- Klappa stavelser ---------- */
export function genSyllables(level, rng) {
  const pool = level === 0 ? SYLLABLES.filter((s) => s.s.length <= 3) : SYLLABLES;
  const item = rng.pick(pool);
  return {
    type: 'tapcount',
    prompt: `Klappa ${item.w}! Tryck på trumman en gång för varje stavelse.`,
    say: `Klappa ordet ${item.w}. Tryck på trumman en gång för varje stavelse.`,
    visual: `<div class="pic-big">${item.e}${level >= 1 ? `<div class="word">${item.w}</div>` : ''}</div>`,
    answer: item.s.length,
    max: 6,
    sayWord: item.w,
    hint: `Säg ordet långsamt: ${item.s.join(' – ')}.`,
    explain: `${item.s.join(' – ')}. Det är ${item.s.length} stavelse${item.s.length > 1 ? 'r' : ''}.`,
  };
}

/* ---------- Stor & liten bokstav ---------- */
export function genCase(level, rng) {
  const l = rng.pick(level === 0 ? COMMON.slice(0, 16).map((a) => a.l) : LETTERS);
  const lower = l.toLowerCase();
  const tricky = { B: ['d', 'p', 'q'], D: ['b', 'p', 'q'], P: ['q', 'b', 'd'], Q: ['p', 'g', 'b'], N: ['m', 'u', 'h'], M: ['n', 'w'], U: ['n', 'v'], A: ['ä', 'å', 'o'], O: ['ö', 'å', 'a'], Å: ['ä', 'a'], Ä: ['å', 'a'] };
  let others = level >= 1 && tricky[l] ? tricky[l].slice(0, 2) : [];
  const rest = rng.shuffle(LETTERS.map((x) => x.toLowerCase()).filter((x) => x !== lower && !others.includes(x)));
  while (others.length < 2) others.push(rest.pop());
  const reverse = level >= 1 && rng.chance(0.5);
  if (reverse) {
    return {
      type: 'choice', prompt: `Vilken stor bokstav hör ihop med ${lower}?`, say: `Vilken versal hör ihop med den lilla bokstaven ${l}?`,
      visual: `<div class="big-letter">${lower}</div>`,
      options: rng.shuffle([l, ...others.map((x) => x.toUpperCase())]).map(letterOpt), answer: l,
      hint: 'Versaler är stora bokstäver. Gemener är små.', explain: `${l} och ${lower} är samma bokstav.`,
    };
  }
  return {
    type: 'choice', prompt: `Hitta lilla ${l}!`, say: `Hitta den lilla bokstaven ${l}.`,
    visual: `<div class="big-letter">${l}</div>`,
    options: rng.shuffle([lower, ...others]).map((x) => ({ id: x, label: x, say: '' })), answer: lower,
    hint: 'Akta dig för b, d, p och q – de är lätta att blanda ihop!', explain: `${l} och ${lower} är samma bokstav.`,
  };
}

/* ---------- Bygg ordet ---------- */
export function wordsForLevel(level) {
  if (level <= 0) return WORDS.filter((w) => w.w.length <= 3);
  if (level === 1) return WORDS.filter((w) => w.w.length <= 4);
  if (level === 2) return WORDS.filter((w) => w.w.length >= 4 && w.w.length <= 5);
  return WORDS.filter((w) => w.w.length >= 5);
}
export function genBuild(level, rng) {
  const item = rng.pick(wordsForLevel(level));
  const letters = item.w.toUpperCase().split('');
  const extra = level >= 2 ? rng.sample(LETTERS.filter((l) => !letters.includes(l)), 2) : [];
  return {
    type: 'build',
    prompt: 'Bygg ordet!',
    say: `Bygg ordet ${item.w}.`,
    visual: `<div class="pic-big">${item.e}</div>`,
    word: item.w.toUpperCase(),
    tiles: rng.shuffle([...letters, ...extra]),
    sayWord: item.w,
    hint: `Lyssna på ljuden: ${item.w.split('').join(' – ')}.`,
    explain: `${item.w.toUpperCase()} – ${item.w}.`,
  };
}

/* ---------- Läs & välj ---------- */
export function genReadPick(level, rng) {
  const pool = wordsForLevel(Math.max(1, level));
  const item = rng.pick(pool);
  const others = rng.sample(WORDS.filter((w) => w.w !== item.w && w.w[0] === item.w[0]).concat(rng.sample(WORDS.filter((w) => w.w !== item.w), 3)), 2);
  const uniq = [...new Map([item, ...others].map((x) => [x.w, x])).values()];
  while (uniq.length < 3) {
    const x = rng.pick(WORDS);
    if (!uniq.find((u) => u.w === x.w)) uniq.push(x);
  }
  return {
    type: 'choice',
    prompt: 'Läs ordet. Vilken bild passar?',
    visual: `<div class="read-word">${level >= 3 ? item.w : item.w.toUpperCase()}</div>`,
    options: rng.shuffle(uniq.slice(0, 3)).map((x) => ({ id: x.w, html: `<span class="pic">${x.e}</span>`, say: '' })),
    answer: item.w,
    noSpeakVisual: true,
    hint: 'Ljuda bokstav för bokstav och dra ihop ljuden.',
    explain: `Det står ${item.w}.`,
  };
}

/* ---------- Alfabetisk ordning ---------- */
export function genAlphabet(level, rng) {
  if (level >= 3 && rng.chance(0.5)) {
    const picks = rng.sample(WORDS.filter((w, i, arr) => arr.findIndex((x) => x.w[0] === w.w[0]) === i), 4);
    const sorted = picks.slice().sort((a, b) => a.w.localeCompare(b.w, 'sv'));
    return {
      type: 'order',
      prompt: 'Tryck på orden i bokstavsordning (ABC-ordning).',
      items: rng.shuffle(picks).map((p) => ({ id: p.w, html: `<span class="pic sm">${p.e}</span><span>${p.w}</span>`, say: p.w })),
      answerOrder: sorted.map((p) => p.w),
      hint: 'Titta på första bokstaven i varje ord. Kom ihåg: … X Y Z Å Ä Ö.',
      explain: sorted.map((p) => p.w).join(', ') + '.',
    };
  }
  const i = rng.int(0, LETTERS.length - 2);
  const before = level >= 2 && rng.chance(0.4) && i > 0;
  const ans = before ? LETTERS[i - 1] : LETTERS[i + 1];
  const others = rng.sample(LETTERS.filter((l) => l !== ans && l !== LETTERS[i]), 2);
  return {
    type: 'choice',
    prompt: before ? `Vilken bokstav kommer före ${LETTERS[i]}?` : `Vilken bokstav kommer efter ${LETTERS[i]}?`,
    visual: `<div class="alpha-strip">${LETTERS.slice(Math.max(0, i - 3), i).map((l) => `<span class="dim">${level >= 3 ? '·' : l}</span>`).join('')}${before ? '<span class="blank">?</span>' : ''}<span class="cur">${LETTERS[i]}</span>${before ? '' : '<span class="blank">?</span>'}</div>`,
    options: rng.shuffle([ans, ...others]).map(letterOpt),
    answer: ans,
    hint: 'Sjung ABC-sången i huvudet!',
    explain: before ? `${ans} kommer före ${LETTERS[i]}.` : `Efter ${LETTERS[i]} kommer ${ans}.`,
  };
}

/* ---------- Meningar ---------- */
export function genSentence(level, rng) {
  if (rng.chance(0.4)) {
    const item = rng.pick(PUNCTUATION);
    return {
      type: 'choice',
      prompt: 'Vilket tecken ska stå sist i meningen?',
      visual: `<div class="read-word sm">${item.s}<span class="blank">?</span></div>`,
      say: `Vilket tecken ska stå sist? ${item.s}`,
      options: [
        { id: '.', label: '.', say: 'punkt' },
        { id: '?', label: '?', say: 'frågetecken' },
        { id: '!', label: '!', say: 'utropstecken' },
      ],
      answer: item.p,
      hint: 'Är det en fråga? Ett utrop? Eller ett vanligt påstående?',
      explain: { '.': 'Punkt – ett vanligt påstående.', '?': 'Frågetecken – det är en fråga.', '!': 'Utropstecken – ett utrop eller en uppmaning.' }[item.p],
    };
  }
  const s = rng.pick(SENTENCES);
  const words = s.replace('.', '').split(' ');
  return {
    type: 'order',
    prompt: 'Bygg meningen. Tryck på orden i rätt ordning.',
    say: 'Bygg meningen. Tryck på orden i rätt ordning. Tänk på stor bokstav först!',
    items: rng.shuffle(words.map((w, i) => ({ id: `${i}`, label: i === words.length - 1 ? `${w}.` : w, say: w }))),
    answerOrder: words.map((_, i) => `${i}`),
    joiner: ' ',
    hint: 'En mening börjar med stor bokstav och slutar med punkt.',
    explain: s,
  };
}

/* ---------- Ord: motsatser och synonymer ---------- */
export function genWords(level, rng) {
  const opp = level <= 2 || rng.chance(0.6);
  const list = opp ? OPPOSITES : SYNONYMS;
  const pair = rng.shuffle(rng.pick(list));
  const others = rng.sample(list.filter((p) => !p.includes(pair[0])).flat().filter((w) => w !== pair[1]), 2);
  return {
    type: 'choice',
    prompt: opp ? `Vad är motsatsen till "${pair[0]}"?` : `Vilket ord betyder ungefär samma sak som "${pair[0]}"?`,
    visual: `<div class="read-word">${pair[0]}</div>`,
    options: rng.shuffle([pair[1], ...others]).map((w) => ({ id: w, label: w })),
    answer: pair[1],
    hint: opp ? 'En motsats betyder det helt omvända.' : 'Synonymer är ord som betyder nästan samma sak.',
    explain: opp ? `${pair[0]} – ${pair[1]}` : `${pair[0]} och ${pair[1]} betyder nästan samma sak.`,
  };
}

export const svenskaApp = {
  id: 'svenska',
  name: 'Svenska',
  icon: '📖',
  color: '#f2545b',
  tagline: 'Ljud, bokstäver, ord och sagor',
  modules: [
    { id: 'letterpic', name: 'Bokstavsljud', icon: '🔤', minLevel: 0, maxLevel: 2, gen: genLetterPic, lgr: ['sv-ljud', 'sv-fsk'] },
    { id: 'rhyme', name: 'Rimma', icon: '🎵', minLevel: 0, gen: genRhyme, lgr: ['sv-fsk', 'sv-avkoda'] },
    { id: 'syllables', name: 'Klappa stavelser', icon: '🥁', minLevel: 0, gen: genSyllables, lgr: ['sv-avkoda'] },
    { id: 'firstsound', name: 'Första ljudet', icon: '👂', minLevel: 0, gen: genFirstSound, lgr: ['sv-ljud'] },
    { id: 'case', name: 'Stor & liten', icon: '🅰️', minLevel: 0, gen: genCase, lgr: ['sv-regler'] },
    { id: 'build', name: 'Bygg ordet', icon: '🧩', minLevel: 1, gen: genBuild, lgr: ['sv-skriva', 'sv-ljud'] },
    { id: 'readpick', name: 'Läs & välj', icon: '👀', minLevel: 1, gen: genReadPick, lgr: ['sv-avkoda'] },
    { id: 'alphabet', name: 'ABC-ordning', icon: '🔠', minLevel: 1, gen: genAlphabet, lgr: ['sv-alfabet'] },
    { id: 'stories', name: 'Berättelser', icon: '📚', minLevel: 1, view: 'stories', lgr: ['sv-avkoda', 'sv-text'] },
    { id: 'sentence', name: 'Meningar', icon: '✍️', minLevel: 2, gen: genSentence, lgr: ['sv-regler', 'sv-skriva'] },
    { id: 'words', name: 'Ordskatten', icon: '💎', minLevel: 2, gen: genWords, lgr: ['sv-ord'] },
  ],
};
