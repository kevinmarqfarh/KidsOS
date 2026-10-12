// Svenska-appen: språklig medvetenhet (rim, stavelser, ljud), bokstäver,
// läsning, ordbyggen, meningar, ordkunskap, grammatik, stavning och
// berättelser med läsförståelse.
//
// Allt innehåll är kontrollerat för korrekt svenska (en/ett, bestämd form,
// plural). Emojierna ska entydigt avbilda ordet så att en 5-åring förstår.
// Se tests/unit/svenska.test.mjs för automatiska kontroller av listorna.
import { photo, hasPhoto } from '../ui/img.js';
import { photoKeyForEmoji } from '../core/emoji-photos.js';

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
export const ABC = 'abcdefghijklmnopqrstuvwxyzåäö';

/** Jämför två ord i svensk alfabetisk ordning (… x y z å ä ö). */
export function svCompare(a, b) {
  const x = a.toLowerCase();
  const y = b.toLowerCase();
  for (let i = 0; i < Math.min(x.length, y.length); i++) {
    const d = ABC.indexOf(x[i]) - ABC.indexOf(y[i]);
    if (d) return d;
  }
  return x.length - y.length;
}

// Ordbank med bilder (för ordbygge, läsning och ABC-ordning).
// Bara gemener a–ö. Emojin ska visa precis det ordet.
export const WORDS = [
  // 2–3 bokstäver
  { w: 'ko', e: '🐄' }, { w: 'is', e: '🧊' }, { w: 'bi', e: '🐝' }, { w: 'ost', e: '🧀' }, { w: 'sol', e: '☀️' },
  { w: 'bil', e: '🚗' }, { w: 'mus', e: '🐭' }, { w: 'hus', e: '🏠' }, { w: 'båt', e: '⛵' }, { w: 'får', e: '🐑' },
  { w: 'bok', e: '📖' }, { w: 'tåg', e: '🚂' }, { w: 'ägg', e: '🥚' }, { w: 'sko', e: '👟' }, { w: 'lök', e: '🧅' },
  { w: 'ris', e: '🍚' }, { w: 'ben', e: '🦴' }, { w: 'sax', e: '✂️' }, { w: 'apa', e: '🐒' }, { w: 'orm', e: '🐍' },
  { w: 'fot', e: '🦶' }, { w: 'get', e: '🐐' }, { w: 'räv', e: '🦊' }, { w: 'mun', e: '👄' }, { w: 'öra', e: '👂' },
  { w: 'öga', e: '👁️' }, { w: 'val', e: '🐳' },
  // 4 bokstäver
  { w: 'katt', e: '🐱' }, { w: 'hund', e: '🐶' }, { w: 'fisk', e: '🐟' }, { w: 'häst', e: '🐴' }, { w: 'måne', e: '🌙' },
  { w: 'boll', e: '⚽' }, { w: 'keps', e: '🧢' }, { w: 'kaka', e: '🍪' }, { w: 'hatt', e: '🎩' }, { w: 'ring', e: '💍' },
  { w: 'gris', e: '🐷' }, { w: 'tand', e: '🦷' }, { w: 'hand', e: '✋' }, { w: 'moln', e: '☁️' }, { w: 'träd', e: '🌳' },
  { w: 'tält', e: '⛺' }, { w: 'säng', e: '🛏️' }, { w: 'sked', e: '🥄' }, { w: 'buss', e: '🚌' }, { w: 'ljus', e: '🕯️' },
  { w: 'brev', e: '✉️' }, { w: 'bröd', e: '🍞' }, { w: 'berg', e: '⛰️' }, { w: 'näsa', e: '👃' }, { w: 'korv', e: '🌭' },
  { w: 'myra', e: '🐜' },
  // 5 bokstäver
  { w: 'glass', e: '🍦' }, { w: 'banan', e: '🍌' }, { w: 'tomat', e: '🍅' }, { w: 'morot', e: '🥕' }, { w: 'groda', e: '🐸' },
  { w: 'raket', e: '🚀' }, { w: 'robot', e: '🤖' }, { w: 'drake', e: '🐉' }, { w: 'krona', e: '👑' }, { w: 'lampa', e: '💡' },
  { w: 'päron', e: '🍐' }, { w: 'cykel', e: '🚲' }, { w: 'uggla', e: '🦉' }, { w: 'björn', e: '🐻' }, { w: 'kanin', e: '🐰' },
  { w: 'tiger', e: '🐯' }, { w: 'lejon', e: '🦁' }, { w: 'zebra', e: '🦓' }, { w: 'äpple', e: '🍎' }, { w: 'gurka', e: '🥒' },
  { w: 'pizza', e: '🍕' }, { w: 'tårta', e: '🎂' }, { w: 'paket', e: '🎁' }, { w: 'slott', e: '🏰' },
  // 6+ bokstäver
  { w: 'nyckel', e: '🔑' }, { w: 'pingvin', e: '🐧' }, { w: 'snigel', e: '🐌' }, { w: 'paraply', e: '☂️' }, { w: 'ananas', e: '🍍' },
  { w: 'giraff', e: '🦒' }, { w: 'fjäril', e: '🦋' }, { w: 'blomma', e: '🌸' }, { w: 'solros', e: '🌻' }, { w: 'kaktus', e: '🌵' },
  { w: 'gitarr', e: '🎸' }, { w: 'trumma', e: '🥁' }, { w: 'traktor', e: '🚜' }, { w: 'ballong', e: '🎈' }, { w: 'stjärna', e: '⭐' },
  { w: 'hjärta', e: '❤️' }, { w: 'potatis', e: '🥔' }, { w: 'krokodil', e: '🐊' }, { w: 'kamera', e: '📷' }, { w: 'flygplan', e: '✈️' },
  { w: 'snögubbe', e: '⛄' }, { w: 'ekorre', e: '🐿️' }, { w: 'bläckfisk', e: '🐙' }, { w: 'citron', e: '🍋' }, { w: 'elefant', e: '🐘' },
];

/*
 * Stava ord: nivåindelade ordlistor (lyssna på ordet → bygg eller skriv det).
 *   Nivå 0: 2–3 bokstäver, korta vardagsord (ko, is, sol).
 *   Nivå 1: ljudenliga ord – varje bokstav har sitt vanliga ljud, ingen dubbelteckning.
 *   Nivå 2: 4–7 bokstäver med ng/nk, gn, sj-, tj- och j-ljud och mjukt k/g.
 *   Nivå 3: dubbelteckning och ck (kort vokal före).
 *   Nivå 4: långa och sammansatta ord.
 * Format "ord emoji". Bara gemener a–ö, varje ord och varje emoji förekommer en gång
 * (kontrolleras i tests/unit/svenska.test.mjs). Fotonyckeln kommer från emojins foto (src/core/emoji-photos.js).
 */
const SPELL_RAW = [
  // Nivå 0
  'ko 🐄|is 🧊|bi 🐝|te 🍵|fe 🧚|sol ☀️|bil 🚗|mus 🐭|hus 🏠|båt ⛵|får 🐑|bok 📖|tåg 🚂|sko 👟|lök 🧅|ris 🍚|ben 🦴|sax ✂️|apa 🐒|orm 🐍|fot 🦶|räv 🦊|mun 👄|öra 👂|öga 👁️|val 🐳|ost 🧀|säl 🦭|mål 🥅|ros 🌹|nöt 🌰|ägg 🥚|ufo 🛸|lås 🔒|nål 🪡|ved 🪵|tre 3️⃣|sex 6️⃣|nio 9️⃣|tio 🔟|röd 🔴|blå 🔵|gul 🟡|vit ⚪|pil ➡️|rep 🪢|bro 🌉|arm 💪|löv 🍁|såg 🪚',
  // Nivå 1
  'kaka 🍪|lama 🦙|gris 🐷|fisk 🐟|hund 🐶|tand 🦷|hand ✋|moln ☁️|träd 🌳|tält ⛺|brev ✉️|bröd 🍞|korv 🌭|sten 🪨|krok 🪝|stol 🪑|gran 🌲|palm 🌴|kran 🏗️|oliv 🫒|majs 🌽|pumpa 🎃|melon 🍈|druva 🍇|kokos 🥥|panda 🐼|koala 🐨|haj 🦈|groda 🐸|ödla 🦎|mask 🪱|tomte 🎅|drake 🐉|prins 🤴|krona 👑|fiol 🎻|lampa 💡|tvål 🧼|krita 🖍️|karta 🗺️|moped 🛵|kanot 🛶|polis 👮|pirat 🏴‍☠️|pilot 👨‍✈️|radio 📻|piano 🎹|tomat 🍅|banan 🍌|robot 🤖|raket 🚀|kanin 🐰|morot 🥕|tiger 🐯|lejon 🦁|päron 🍐|paket 🎁|kamel 🐫|måne 🌙|näsa 👃|myra 🐜|häst 🐴|örn 🦅|svan 🦢|bäver 🦫|tårta 🎂|smör 🧈|pasta 🍝|salt 🧂|gurka 🥒|bebis 👶|åska ⛈️|mobil 📱|dator 💻|komet ☄️|planet 🪐|godis 🍬|ananas 🍍|paprika 🫑|nudlar 🍜|björn 🐻|linjal 📏|svamp 🍄|pokal 🏆|skål 🥣|yxa 🪓',
  // Nivå 2
  'ring 💍|säng 🛏️|tunga 👅|honung 🍯|ängel 👼|munk 🍩|bank 🏦|ankare ⚓|pingvin 🐧|känguru 🦘|sju 7️⃣|sked 🥄|skjorta 👔|stjärna ⭐|skidor 🎿|choklad 🍫|sjuk 🤒|tjej 👧|tjur 🐂|kyrka ⛪|kälke 🛷|körsbär 🍒|get 🐐|hjärta ❤️|hjälm ⛑️|ljus 🕯️|berg ⛰️|apelsin 🍊|vulkan 🌋|kaktus 🌵|tulpan 🌷|pensel 🖌️|halsduk 🧣|strumpa 🧦|stövel 👢|sandal 👡|diamant 💎|mynt 🪙|traktor 🚜|delfin 🐬|hamster 🐹|kamera 📷|avokado 🥑|trumpet 🎺|medalj 🏅|magnet 🧲|regn 🌧️|skola 🏫|kedja ⛓️|pengar 💰|elefant 🐘|fjäril 🦋|paraply ☂️|potatis 🥔|cykel 🚲|citron 🍋|mjölk 🥛|pojke 👦|tärning 🎲|tidning 📰|kalender 📅|pingis 🏓|solros 🌻|blixt ⚡|jorden 🌍|plåster 🩹|mormor 👵|morfar 👴|snigel 🐌|zebra 🦓',
  // Nivå 3
  'katt 🐱|hatt 🎩|boll ⚽|glass 🍦|buss 🚌|mamma 👩|pappa 👨|trumma 🥁|flagga 🚩|uggla 🦉|skepp 🚢|äpple 🍎|ekorre 🐿️|blomma 🌸|nyckel 🔑|kyckling 🐥|tupp 🐓|klocka ⏰|jacka 🧥|soffa 🛋️|penna 🖊️|sallad 🥗|kaffe ☕|pizza 🍕|giraff 🦒|gitarr 🎸|ballong 🎈|dörr 🚪|skägg 🧔|vatten 💧|snäcka 🐚|krabba 🦀|hummer 🦞|gorilla 🦍|bläckfisk 🐙|dimma 🌫️|pussel 🧩|tablett 💊|nalle 🧸|puss 💋|hammare 🔨|tallrik 🍽️|muffins 🧁|klubba 🍭|jordgubbe 🍓|broccoli 🥦|hiss 🛗|tass 🐾|stopp 🛑|tumme 👍|slott 🏰|ryggsäck 🎒|tennis 🎾|igelkott 🦔|konfetti 🎊|batteri 🔋|satellit 🛰️|kompass 🧭|palett 🎨',
  // Nivå 4
  'snögubbe ⛄|pannkaka 🥞|flygplan ✈️|helikopter 🚁|krokodil 🐊|sköldpadda 🐢|nyckelpiga 🐞|papegoja 🦜|flamingo 🦩|enhörning 🦄|regnbåge 🌈|motorcykel 🏍️|hamburgare 🍔|fyrverkeri 🎆|polisbil 🚓|ambulans 🚑|brandbil 🚒|mikrofon 🎤|vattenmelon 🍉|snöflinga ❄️|astronaut 🧑‍🚀|prinsessa 👸|sjöjungfru 🧜‍♀️|trollkarl 🧙|dinosaurie 🦕|trafikljus 🚦|teleskop 🔭|mikroskop 🔬|glasögon 👓|smörgås 🥪|jordnöt 🥜|vitlök 🧄|blåbär 🫐|julgran 🎄|skalbagge 🪲|fladdermus 🦇|tvättbjörn 🦝|isbjörn 🐻‍❄️|kundvagn 🛒|sparkcykel 🛴|skridsko ⛸️|termometer 🌡️|tandborste 🪥|basketboll 🏀|stjärnfall 🌠|fallskärm 🪂|brevlåda 📫|ficklampa 🔦|häftstift 📌|badkar 🛁',
];
// Ord utan meningsfullt foto (färger och tal) får ingen fotonyckel, även om emojin skulle vara mappad.
const NO_PHOTO = new Set(['tre', 'sex', 'nio', 'tio', 'sju', 'röd', 'blå', 'gul', 'vit', 'sjuk', 'pil']);
const spellPhoto = (w, e) => (NO_PHOTO.has(w) ? null : photoKeyForEmoji(e));
export const SPELL_WORDS = SPELL_RAW.flatMap((row, lvl) =>
  row.split('|').map((pair) => {
    const i = pair.indexOf(' ');
    const w = pair.slice(0, i);
    const e = pair.slice(i + 1);
    const photoKey = spellPhoto(w, e);
    return { w, e, lvl, ...(photoKey ? { photo: photoKey } : {}) };
  }),
);
export const spellWordsForLevel = (level) => SPELL_WORDS.filter((x) => x.lvl === Math.max(0, Math.min(4, level)));

/** Förklarar det kluriga i ett ords stavning (för explain/hint). Tom sträng om ordet är ljudenligt. */
export function spellTip(w) {
  if (w.includes('ck')) return 'ck är ett dubbelt k. Vokalen före är kort.';
  const dbl = w.match(/([bcdfgklmnprstvz])\1/);
  if (dbl) return `Vokalen före ${dbl[0]} är kort – därför skriver vi dubbelt ${dbl[1]}.`;
  if (/stj|skj|sj|ch|sk[eiyäö]/.test(w)) return 'Sj-ljudet kan stavas sj, sk, skj, stj eller ch.';
  if (/tj|^k[eiyäö]|^kj/.test(w)) return 'Tj-ljudet kan stavas tj eller k – k före e, i, y, ä och ö låter ofta tj.';
  if (/^hj|^lj|^g[eiyäö]|rg$|lj/.test(w)) return 'J-ljudet kan stavas j, g, hj och lj.';
  if (/gn/.test(w)) return 'gn låter som ngn, men vi skriver bara g och n.';
  if (/ng/.test(w)) return 'ng är ett ljud, men vi skriver två bokstäver: n och g.';
  if (/nk/.test(w)) return 'Före k låter n som ng, men vi skriver bara n.';
  return '';
}

// Rimgrupper. `r` är rimdelen (från den betonade vokalen) som alla ord slutar på.
export const RHYME_GROUPS = [
  { r: 'us', w: [{ w: 'hus', e: '🏠' }, { w: 'mus', e: '🐭' }, { w: 'ljus', e: '🕯️' }] },
  { r: 'att', w: [{ w: 'katt', e: '🐱' }, { w: 'hatt', e: '🎩' }, { w: 'natt', e: '🌃' }] },
  { r: 'ko', w: [{ w: 'ko', e: '🐄' }, { w: 'sko', e: '👟' }] },
  { r: 'ol', w: [{ w: 'sol', e: '☀️' }, { w: 'stol', e: '🪑' }] },
  { r: 'kel', w: [{ w: 'nyckel', e: '🔑' }, { w: 'cykel', e: '🚲' }] },
  { r: 'åg', w: [{ w: 'tåg', e: '🚂' }, { w: 'våg', e: '🌊' }] },
  { r: 'oll', w: [{ w: 'boll', e: '⚽' }, { w: 'noll', e: '0️⃣' }] },
  { r: 'is', w: [{ w: 'gris', e: '🐷' }, { w: 'ris', e: '🍚' }, { w: 'is', e: '🧊' }] },
  { r: 'il', w: [{ w: 'bil', e: '🚗' }, { w: 'pil', e: '➡️' }] },
  { r: 'ok', w: [{ w: 'bok', e: '📖' }, { w: 'krok', e: '🪝' }] },
  { r: 'åt', w: [{ w: 'båt', e: '⛵' }, { w: 'gråt', e: '😢' }] },
  { r: 'and', w: [{ w: 'tand', e: '🦷' }, { w: 'hand', e: '✋' }] },
  { r: 'öd', w: [{ w: 'bröd', e: '🍞' }, { w: 'röd', e: '🔴' }] },
  { r: 'ärna', w: [{ w: 'stjärna', e: '⭐' }, { w: 'hjärna', e: '🧠' }] },
  { r: 'yra', w: [{ w: 'myra', e: '🐜' }, { w: 'fyra', e: '4️⃣' }] },
  { r: 'åtta', w: [{ w: 'åtta', e: '8️⃣' }, { w: 'råtta', e: '🐀' }] },
  { r: 'io', w: [{ w: 'nio', e: '9️⃣' }, { w: 'tio', e: '🔟' }] },
  { r: 'å', w: [{ w: 'två', e: '2️⃣' }, { w: 'blå', e: '🔵' }] },
  { r: 'ägg', w: [{ w: 'ägg', e: '🥚' }, { w: 'skägg', e: '🧔' }] },
  { r: 'uss', w: [{ w: 'buss', e: '🚌' }, { w: 'puss', e: '💋' }] },
  { r: 'ål', w: [{ w: 'mål', e: '🥅' }, { w: 'skål', e: '🥣' }] },
];
/**
 * Bakåtkompatibelt: enkla rimpar (de två första orden i varje grupp) där slutet
 * också ser likadant ut i skrift (minst två lika slutbokstäver). Rim som två/blå
 * låter lika men skrivs olika och används bara i RHYME_GROUPS (genRhyme).
 */
export const RHYMES = RHYME_GROUPS.map((g) => g.w.slice(0, 2)).filter(([a, b]) => a.w.slice(-2) === b.w.slice(-2));

// Stavelser: s = ordet uppdelat i stavelser (talstavelser, så som man klappar).
export const SYLLABLES = [
  // 1 stavelse
  { w: 'ko', e: '🐄', s: ['ko'] }, { w: 'sol', e: '☀️', s: ['sol'] }, { w: 'hus', e: '🏠', s: ['hus'] },
  { w: 'katt', e: '🐱', s: ['katt'] }, { w: 'bil', e: '🚗', s: ['bil'] }, { w: 'hund', e: '🐶', s: ['hund'] },
  { w: 'fisk', e: '🐟', s: ['fisk'] }, { w: 'boll', e: '⚽', s: ['boll'] }, { w: 'häst', e: '🐴', s: ['häst'] },
  { w: 'glass', e: '🍦', s: ['glass'] }, { w: 'mus', e: '🐭', s: ['mus'] }, { w: 'tåg', e: '🚂', s: ['tåg'] },
  { w: 'båt', e: '⛵', s: ['båt'] }, { w: 'bok', e: '📖', s: ['bok'] }, { w: 'tand', e: '🦷', s: ['tand'] },
  { w: 'säng', e: '🛏️', s: ['säng'] }, { w: 'björn', e: '🐻', s: ['björn'] }, { w: 'räv', e: '🦊', s: ['räv'] },
  { w: 'moln', e: '☁️', s: ['moln'] }, { w: 'träd', e: '🌳', s: ['träd'] }, { w: 'ljus', e: '🕯️', s: ['ljus'] },
  { w: 'bi', e: '🐝', s: ['bi'] }, { w: 'korv', e: '🌭', s: ['korv'] },
  // 2 stavelser
  { w: 'apa', e: '🐒', s: ['a', 'pa'] }, { w: 'banan', e: '🍌', s: ['ba', 'nan'] }, { w: 'uggla', e: '🦉', s: ['ugg', 'la'] },
  { w: 'tomat', e: '🍅', s: ['to', 'mat'] }, { w: 'giraff', e: '🦒', s: ['gi', 'raff'] }, { w: 'fjäril', e: '🦋', s: ['fjä', 'ril'] },
  { w: 'fotboll', e: '⚽', s: ['fot', 'boll'] }, { w: 'pingvin', e: '🐧', s: ['ping', 'vin'] }, { w: 'kanin', e: '🐰', s: ['ka', 'nin'] },
  { w: 'morot', e: '🥕', s: ['mo', 'rot'] }, { w: 'robot', e: '🤖', s: ['ro', 'bot'] }, { w: 'raket', e: '🚀', s: ['ra', 'ket'] },
  { w: 'päron', e: '🍐', s: ['pä', 'ron'] }, { w: 'äpple', e: '🍎', s: ['äpp', 'le'] }, { w: 'lejon', e: '🦁', s: ['le', 'jon'] },
  { w: 'tiger', e: '🐯', s: ['ti', 'ger'] }, { w: 'zebra', e: '🦓', s: ['ze', 'bra'] }, { w: 'groda', e: '🐸', s: ['gro', 'da'] },
  { w: 'måne', e: '🌙', s: ['må', 'ne'] }, { w: 'hjärta', e: '❤️', s: ['hjär', 'ta'] }, { w: 'stjärna', e: '⭐', s: ['stjär', 'na'] },
  { w: 'ballong', e: '🎈', s: ['bal', 'long'] }, { w: 'kaka', e: '🍪', s: ['ka', 'ka'] }, { w: 'pizza', e: '🍕', s: ['piz', 'za'] },
  { w: 'tårta', e: '🎂', s: ['tår', 'ta'] }, { w: 'kaktus', e: '🌵', s: ['kak', 'tus'] }, { w: 'trumma', e: '🥁', s: ['trum', 'ma'] },
  { w: 'gitarr', e: '🎸', s: ['gi', 'tarr'] }, { w: 'cykel', e: '🚲', s: ['cy', 'kel'] }, { w: 'gurka', e: '🥒', s: ['gur', 'ka'] },
  { w: 'blomma', e: '🌸', s: ['blom', 'ma'] }, { w: 'flygplan', e: '✈️', s: ['flyg', 'plan'] }, { w: 'traktor', e: '🚜', s: ['trak', 'tor'] },
  { w: 'myra', e: '🐜', s: ['my', 'ra'] }, { w: 'öga', e: '👁️', s: ['ö', 'ga'] }, { w: 'näsa', e: '👃', s: ['nä', 'sa'] },
  { w: 'kyckling', e: '🐥', s: ['kyck', 'ling'] }, { w: 'solros', e: '🌻', s: ['sol', 'ros'] }, { w: 'fiol', e: '🎻', s: ['fi', 'ol'] },
  { w: 'bläckfisk', e: '🐙', s: ['bläck', 'fisk'] },
  // 3 stavelser
  { w: 'elefant', e: '🐘', s: ['e', 'le', 'fant'] }, { w: 'krokodil', e: '🐊', s: ['kro', 'ko', 'dil'] },
  { w: 'paraply', e: '☂️', s: ['pa', 'ra', 'ply'] }, { w: 'ananas', e: '🍍', s: ['a', 'na', 'nas'] },
  { w: 'snögubbe', e: '⛄', s: ['snö', 'gub', 'be'] }, { w: 'sköldpadda', e: '🐢', s: ['sköld', 'pad', 'da'] },
  { w: 'kamera', e: '📷', s: ['ka', 'me', 'ra'] }, { w: 'potatis', e: '🥔', s: ['po', 'ta', 'tis'] },
  { w: 'jordgubbe', e: '🍓', s: ['jord', 'gub', 'be'] }, { w: 'enhörning', e: '🦄', s: ['en', 'hör', 'ning'] },
  { w: 'polisbil', e: '🚓', s: ['po', 'lis', 'bil'] }, { w: 'ambulans', e: '🚑', s: ['am', 'bu', 'lans'] },
  { w: 'apelsin', e: '🍊', s: ['a', 'pel', 'sin'] }, { w: 'känguru', e: '🦘', s: ['kän', 'gu', 'ru'] },
  { w: 'gorilla', e: '🦍', s: ['go', 'ril', 'la'] }, { w: 'flamingo', e: '🦩', s: ['fla', 'min', 'go'] },
  { w: 'mikrofon', e: '🎤', s: ['mik', 'ro', 'fon'] }, { w: 'regnbåge', e: '🌈', s: ['regn', 'bå', 'ge'] },
  { w: 'pannkaka', e: '🥞', s: ['pann', 'ka', 'ka'] }, { w: 'snöflinga', e: '❄️', s: ['snö', 'flin', 'ga'] },
  { w: 'ekorre', e: '🐿️', s: ['e', 'kor', 're'] }, { w: 'piano', e: '🎹', s: ['pi', 'a', 'no'] },
  // 4 stavelser
  { w: 'nyckelpiga', e: '🐞', s: ['nyck', 'el', 'pi', 'ga'] }, { w: 'helikopter', e: '🚁', s: ['he', 'li', 'kop', 'ter'] },
  { w: 'vattenmelon', e: '🍉', s: ['vat', 'ten', 'me', 'lon'] }, { w: 'papegoja', e: '🦜', s: ['pa', 'pe', 'go', 'ja'] },
  { w: 'motorcykel', e: '🏍️', s: ['mo', 'tor', 'cy', 'kel'] }, { w: 'hamburgare', e: '🍔', s: ['ham', 'bur', 'ga', 're'] },
  { w: 'fyrverkeri', e: '🎆', s: ['fyr', 'ver', 'ke', 'ri'] }, { w: 'chokladkaka', e: '🍫', s: ['cho', 'klad', 'ka', 'ka'] },
];

// Motsatsord. lvl = lägsta nivå där paret används. Varje ord förekommer bara en gång.
export const OPPOSITES = [
  { p: ['stor', 'liten'], lvl: 0 }, { p: ['varm', 'kall'], lvl: 0 }, { p: ['glad', 'ledsen'], lvl: 0 },
  { p: ['upp', 'ner'], lvl: 0 }, { p: ['full', 'tom'], lvl: 0 }, { p: ['dag', 'natt'], lvl: 0 },
  { p: ['lång', 'kort'], lvl: 0 }, { p: ['ja', 'nej'], lvl: 0 }, { p: ['inne', 'ute'], lvl: 0 },
  { p: ['snabb', 'långsam'], lvl: 2 }, { p: ['ljus', 'mörk'], lvl: 2 }, { p: ['gammal', 'ung'], lvl: 2 },
  { p: ['våt', 'torr'], lvl: 2 }, { p: ['tung', 'lätt'], lvl: 2 }, { p: ['öppen', 'stängd'], lvl: 2 },
  { p: ['hård', 'mjuk'], lvl: 2 }, { p: ['först', 'sist'], lvl: 2 }, { p: ['hög', 'låg'], lvl: 2 },
  { p: ['svart', 'vit'], lvl: 2 }, { p: ['under', 'över'], lvl: 2 }, { p: ['vänster', 'höger'], lvl: 2 },
  { p: ['tjock', 'smal'], lvl: 3 }, { p: ['ren', 'smutsig'], lvl: 3 }, { p: ['många', 'få'], lvl: 3 },
  { p: ['vinna', 'förlora'], lvl: 3 }, { p: ['gråta', 'skratta'], lvl: 3 }, { p: ['ge', 'ta'], lvl: 3 },
  { p: ['sova', 'vakna'], lvl: 3 }, { p: ['stark', 'svag'], lvl: 3 }, { p: ['frisk', 'sjuk'], lvl: 3 },
  { p: ['framför', 'bakom'], lvl: 3 }, { p: ['sur', 'söt'], lvl: 3 }, { p: ['början', 'slut'], lvl: 3 },
  { p: ['köpa', 'sälja'], lvl: 4 }, { p: ['rik', 'fattig'], lvl: 4 }, { p: ['modig', 'feg'], lvl: 4 },
  { p: ['tidig', 'sen'], lvl: 4 }, { p: ['rak', 'krokig'], lvl: 4 }, { p: ['vild', 'tam'], lvl: 4 },
  { p: ['fråga', 'svara'], lvl: 4 }, { p: ['minnas', 'glömma'], lvl: 4 }, { p: ['tillåten', 'förbjuden'], lvl: 4 },
];

// Synonymer (ord som betyder ungefär samma sak). Varje ord förekommer bara en gång.
export const SYNONYMS = [
  { p: ['glad', 'lycklig'], lvl: 0 }, { p: ['prata', 'tala'], lvl: 0 }, { p: ['titta', 'se'], lvl: 0 },
  { p: ['arg', 'sur'], lvl: 0 }, { p: ['rädd', 'skrämd'], lvl: 0 }, { p: ['börja', 'starta'], lvl: 0 },
  { p: ['springa', 'rusa'], lvl: 0 }, { p: ['smart', 'klok'], lvl: 0 }, { p: ['trött', 'sömnig'], lvl: 0 },
  { p: ['vän', 'kompis'], lvl: 0 }, { p: ['vacker', 'fin'], lvl: 0 }, { p: ['kasta', 'slänga'], lvl: 0 },
  { p: ['stor', 'enorm'], lvl: 4 }, { p: ['snabb', 'kvick'], lvl: 4 }, { p: ['tyst', 'ljudlös'], lvl: 4 },
  { p: ['ledsen', 'sorgsen'], lvl: 4 }, { p: ['sluta', 'avsluta'], lvl: 4 }, { p: ['gömma', 'dölja'], lvl: 4 },
  { p: ['laga', 'reparera'], lvl: 4 }, { p: ['jobba', 'arbeta'], lvl: 4 }, { p: ['skrika', 'vråla'], lvl: 4 },
  { p: ['blöt', 'fuktig'], lvl: 4 }, { p: ['konstig', 'märklig'], lvl: 4 },
];

// Bygg meningen. Bara första ordet har stor bokstav och inget ord förekommer två gånger,
// så att det bara finns en rätt ordning. lvl = nivån meningen passar.
export const SENTENCES = [
  { s: 'Katten sover gott.', e: '🐱💤', lvl: 1 },
  { s: 'Hunden äter ett ben.', e: '🐶🦴', lvl: 1 },
  { s: 'Jag läser en bok.', e: '📖', lvl: 1 },
  { s: 'Fisken simmar fort.', e: '🐟', lvl: 1 },
  { s: 'Pappa bakar bröd.', e: '🍞', lvl: 1 },
  { s: 'Solen är varm.', e: '☀️', lvl: 1 },
  { s: 'Vi spelar fotboll.', e: '⚽', lvl: 1 },
  { s: 'Fågeln sjunger glatt.', e: '🐦🎵', lvl: 1 },
  { s: 'Bilen är röd.', e: '🚗', lvl: 1 },
  { s: 'Grodan hoppar högt.', e: '🐸', lvl: 1 },
  { s: 'Jag har en hund.', e: '🐶', lvl: 1 },
  { s: 'Det snöar ute.', e: '❄️', lvl: 1 },
  { s: 'Fågeln bygger ett bo.', e: '🐦', lvl: 2 },
  { s: 'Katten sover i solen.', e: '🐱☀️', lvl: 2 },
  { s: 'Hunden springer i parken.', e: '🐶🌳', lvl: 2 },
  { s: 'Min syster läser en bok.', e: '👧📖', lvl: 2 },
  { s: 'Ekorren samlar nötter.', e: '🐿️🌰', lvl: 2 },
  { s: 'Vi cyklar till skolan.', e: '🚲🏫', lvl: 2 },
  { s: 'Snögubben har en morot.', e: '⛄🥕', lvl: 2 },
  { s: 'Månen lyser på natten.', e: '🌙', lvl: 2 },
  { s: 'Mormor stickar en röd mössa.', e: '🧶', lvl: 3 },
  { s: 'Den lilla grodan hoppar i dammen.', e: '🐸💦', lvl: 3 },
  { s: 'Pappa lagar mat i köket.', e: '🍳', lvl: 3 },
  { s: 'Min bror har en blå cykel.', e: '🚲', lvl: 3 },
  { s: 'Raketen flyger upp mot månen.', e: '🚀🌙', lvl: 3 },
  { s: 'Vi äter pannkakor med sylt.', e: '🥞', lvl: 3 },
  { s: 'Morfar odlar tomater i växthuset.', e: '🍅', lvl: 3 },
  { s: 'Ugglan sover hela dagen.', e: '🦉', lvl: 3 },
  { s: 'Vad ska vi äta till middag?', e: '🍽️', lvl: 4 },
  { s: 'Var har du lagt min mössa?', e: '🧢', lvl: 4 },
  { s: 'Kan du hjälpa mig med läxan?', e: '📝', lvl: 4 },
  { s: 'Varför har zebran randig päls?', e: '🦓', lvl: 4 },
  { s: 'Den gamla ugglan bor i ett ihåligt träd.', e: '🦉🌳', lvl: 4 },
  { s: 'Efter skolan går jag till biblioteket.', e: '📚', lvl: 4 },
  { s: 'Min kompis har fått en liten kattunge.', e: '🐈', lvl: 4 },
  { s: 'När vi kom hem var det mörkt ute.', e: '🌃', lvl: 4 },
];

export const PUNCTUATION = [
  { s: 'Vad heter du', p: '?' },
  { s: 'Hur gammal är du', p: '?' },
  { s: 'Var bor du', p: '?' },
  { s: 'Vilken dag är det i dag', p: '?' },
  { s: 'Vill du leka med mig', p: '?' },
  { s: 'Hur många ben har en spindel', p: '?' },
  { s: 'Får jag låna din penna', p: '?' },
  { s: 'Jag tycker om äpplen', p: '.' },
  { s: 'Solen skiner', p: '.' },
  { s: 'Vi går till parken', p: '.' },
  { s: 'Hunden heter Sixten', p: '.' },
  { s: 'Katten sover på soffan', p: '.' },
  { s: 'I morgon ska vi bada', p: '.' },
  { s: 'Min mössa är grön', p: '.' },
  { s: 'Akta dig', p: '!' },
  { s: 'Vad roligt det här är', p: '!' },
  { s: 'Hjälp', p: '!' },
  { s: 'Grattis på födelsedagen', p: '!' },
  { s: 'Stopp', p: '!' },
  { s: 'Vilken fin teckning', p: '!' },
];

// Substantiv med böjningar: genus, bestämd form, plural, bestämd plural.
// irr = oregelbunden plural (omljud eller ovanlig ändelse).
export const NOUNS = [
  { g: 'en', w: 'katt', def: 'katten', pl: 'katter', pld: 'katterna', e: '🐱' },
  { g: 'en', w: 'hund', def: 'hunden', pl: 'hundar', pld: 'hundarna', e: '🐶' },
  { g: 'en', w: 'bil', def: 'bilen', pl: 'bilar', pld: 'bilarna', e: '🚗' },
  { g: 'en', w: 'boll', def: 'bollen', pl: 'bollar', pld: 'bollarna', e: '⚽' },
  { g: 'en', w: 'fisk', def: 'fisken', pl: 'fiskar', pld: 'fiskarna', e: '🐟' },
  { g: 'en', w: 'banan', def: 'bananen', pl: 'bananer', pld: 'bananerna', e: '🍌' },
  { g: 'en', w: 'bok', def: 'boken', pl: 'böcker', pld: 'böckerna', e: '📖', irr: true },
  { g: 'en', w: 'mus', def: 'musen', pl: 'möss', pld: 'mössen', e: '🐭', irr: true },
  { g: 'en', w: 'ko', def: 'kon', pl: 'kor', pld: 'korna', e: '🐄' },
  { g: 'en', w: 'gris', def: 'grisen', pl: 'grisar', pld: 'grisarna', e: '🐷' },
  { g: 'en', w: 'häst', def: 'hästen', pl: 'hästar', pld: 'hästarna', e: '🐴' },
  { g: 'en', w: 'stol', def: 'stolen', pl: 'stolar', pld: 'stolarna', e: '🪑' },
  { g: 'en', w: 'sko', def: 'skon', pl: 'skor', pld: 'skorna', e: '👟' },
  { g: 'en', w: 'nyckel', def: 'nyckeln', pl: 'nycklar', pld: 'nycklarna', e: '🔑' },
  { g: 'en', w: 'cykel', def: 'cykeln', pl: 'cyklar', pld: 'cyklarna', e: '🚲' },
  { g: 'en', w: 'groda', def: 'grodan', pl: 'grodor', pld: 'grodorna', e: '🐸' },
  { g: 'en', w: 'uggla', def: 'ugglan', pl: 'ugglor', pld: 'ugglorna', e: '🦉' },
  { g: 'en', w: 'blomma', def: 'blomman', pl: 'blommor', pld: 'blommorna', e: '🌸' },
  { g: 'en', w: 'kaka', def: 'kakan', pl: 'kakor', pld: 'kakorna', e: '🍪' },
  { g: 'en', w: 'lampa', def: 'lampan', pl: 'lampor', pld: 'lamporna', e: '💡' },
  { g: 'en', w: 'tomat', def: 'tomaten', pl: 'tomater', pld: 'tomaterna', e: '🍅' },
  { g: 'en', w: 'morot', def: 'moroten', pl: 'morötter', pld: 'morötterna', e: '🥕', irr: true },
  { g: 'en', w: 'båt', def: 'båten', pl: 'båtar', pld: 'båtarna', e: '⛵' },
  { g: 'en', w: 'raket', def: 'raketen', pl: 'raketer', pld: 'raketerna', e: '🚀' },
  { g: 'en', w: 'giraff', def: 'giraffen', pl: 'giraffer', pld: 'girafferna', e: '🦒' },
  { g: 'en', w: 'apa', def: 'apan', pl: 'apor', pld: 'aporna', e: '🐒' },
  { g: 'en', w: 'tand', def: 'tanden', pl: 'tänder', pld: 'tänderna', e: '🦷', irr: true },
  { g: 'en', w: 'hand', def: 'handen', pl: 'händer', pld: 'händerna', e: '✋', irr: true },
  { g: 'en', w: 'fot', def: 'foten', pl: 'fötter', pld: 'fötterna', e: '🦶', irr: true },
  { g: 'en', w: 'glass', def: 'glassen', pl: 'glassar', pld: 'glassarna', e: '🍦' },
  { g: 'en', w: 'stjärna', def: 'stjärnan', pl: 'stjärnor', pld: 'stjärnorna', e: '⭐' },
  { g: 'en', w: 'säng', def: 'sängen', pl: 'sängar', pld: 'sängarna', e: '🛏️' },
  { g: 'en', w: 'sked', def: 'skeden', pl: 'skedar', pld: 'skedarna', e: '🥄' },
  { g: 'en', w: 'gurka', def: 'gurkan', pl: 'gurkor', pld: 'gurkorna', e: '🥒' },
  { g: 'en', w: 'orm', def: 'ormen', pl: 'ormar', pld: 'ormarna', e: '🐍' },
  { g: 'en', w: 'snigel', def: 'snigeln', pl: 'sniglar', pld: 'sniglarna', e: '🐌' },
  { g: 'en', w: 'drake', def: 'draken', pl: 'drakar', pld: 'drakarna', e: '🐉' },
  { g: 'en', w: 'krona', def: 'kronan', pl: 'kronor', pld: 'kronorna', e: '👑' },
  { g: 'en', w: 'robot', def: 'roboten', pl: 'robotar', pld: 'robotarna', e: '🤖' },
  { g: 'en', w: 'buss', def: 'bussen', pl: 'bussar', pld: 'bussarna', e: '🚌' },
  { g: 'en', w: 'björn', def: 'björnen', pl: 'björnar', pld: 'björnarna', e: '🐻' },
  { g: 'en', w: 'räv', def: 'räven', pl: 'rävar', pld: 'rävarna', e: '🦊' },
  { g: 'en', w: 'get', def: 'geten', pl: 'getter', pld: 'getterna', e: '🐐' },
  { g: 'en', w: 'myra', def: 'myran', pl: 'myror', pld: 'myrorna', e: '🐜' },
  { g: 'ett', w: 'hus', def: 'huset', pl: 'hus', pld: 'husen', e: '🏠' },
  { g: 'ett', w: 'äpple', def: 'äpplet', pl: 'äpplen', pld: 'äpplena', e: '🍎' },
  { g: 'ett', w: 'ägg', def: 'ägget', pl: 'ägg', pld: 'äggen', e: '🥚' },
  { g: 'ett', w: 'tåg', def: 'tåget', pl: 'tåg', pld: 'tågen', e: '🚂' },
  { g: 'ett', w: 'får', def: 'fåret', pl: 'får', pld: 'fåren', e: '🐑' },
  { g: 'ett', w: 'öga', def: 'ögat', pl: 'ögon', pld: 'ögonen', e: '👁️', irr: true },
  { g: 'ett', w: 'öra', def: 'örat', pl: 'öron', pld: 'öronen', e: '👂', irr: true },
  { g: 'ett', w: 'lejon', def: 'lejonet', pl: 'lejon', pld: 'lejonen', e: '🦁' },
  { g: 'ett', w: 'päron', def: 'päronet', pl: 'päron', pld: 'päronen', e: '🍐' },
  { g: 'ett', w: 'träd', def: 'trädet', pl: 'träd', pld: 'träden', e: '🌳' },
  { g: 'ett', w: 'moln', def: 'molnet', pl: 'moln', pld: 'molnen', e: '☁️' },
  { g: 'ett', w: 'paraply', def: 'paraplyet', pl: 'paraplyer', pld: 'paraplyerna', e: '☂️' },
  { g: 'ett', w: 'flygplan', def: 'flygplanet', pl: 'flygplan', pld: 'flygplanen', e: '✈️' },
  { g: 'ett', w: 'bi', def: 'biet', pl: 'bin', pld: 'bina', e: '🐝' },
  { g: 'ett', w: 'tält', def: 'tältet', pl: 'tält', pld: 'tälten', e: '⛺' },
  { g: 'ett', w: 'hjärta', def: 'hjärtat', pl: 'hjärtan', pld: 'hjärtana', e: '❤️', irr: true },
  { g: 'ett', w: 'ben', def: 'benet', pl: 'ben', pld: 'benen', e: '🦴' },
  { g: 'ett', w: 'ljus', def: 'ljuset', pl: 'ljus', pld: 'ljusen', e: '🕯️' },
  { g: 'ett', w: 'brev', def: 'brevet', pl: 'brev', pld: 'breven', e: '✉️' },
  { g: 'ett', w: 'slott', def: 'slottet', pl: 'slott', pld: 'slotten', e: '🏰' },
  { g: 'ett', w: 'bröd', def: 'brödet', pl: 'bröd', pld: 'bröden', e: '🍞' },
  { g: 'ett', w: 'berg', def: 'berget', pl: 'berg', pld: 'bergen', e: '⛰️' },
  { g: 'ett', w: 'paket', def: 'paketet', pl: 'paket', pld: 'paketen', e: '🎁' },
  { g: 'ett', w: 'piano', def: 'pianot', pl: 'pianon', pld: 'pianona', e: '🎹' },
  { g: 'ett', w: 'barn', def: 'barnet', pl: 'barn', pld: 'barnen', e: '🧒' },
];
// Former som faktiskt finns som alternativ böjning och därför aldrig får bli felaktiga distraktorer.
const ALT_FORMS = new Set(['paraplyn']);

// Ordklasser (åk 3 / nivå 3–4). Välj ord som bara kan tillhöra en ordklass.
export const WORD_CLASSES = {
  subst: ['katt', 'bok', 'skola', 'boll', 'träd', 'mamma', 'stol', 'glass', 'sko', 'bil', 'lärare', 'kompis', 'fönster', 'äpple', 'hund', 'säng', 'fotboll', 'cykel', 'blomma', 'häst'],
  verb: ['springer', 'hoppar', 'äter', 'sover', 'läser', 'simmar', 'sjunger', 'ritar', 'skrattar', 'leker', 'skriver', 'bygger', 'klättrar', 'gråter', 'flyger', 'kastar', 'tittar', 'dansar', 'målar'],
  adj: ['glad', 'stor', 'liten', 'röd', 'snabb', 'mjuk', 'varm', 'kall', 'ledsen', 'grön', 'rolig', 'trött', 'hungrig', 'blöt', 'vacker', 'stark', 'tyst', 'gul', 'tung', 'arg'],
};
export const CLASS_INFO = {
  subst: { label: 'Substantiv', html: '📦', tip: 'Substantiv är namn på saker, djur och personer. Du kan sätta en eller ett framför: en katt.' },
  verb: { label: 'Verb', html: '🏃', tip: 'Verb är något man gör. Du kan sätta jag framför: jag springer.' },
  adj: { label: 'Adjektiv', html: '🎨', tip: 'Adjektiv beskriver hur något är. Du kan sätta det mellan en och ett substantiv: en glad katt.' },
};

// Sammansatta ord: a + b = w (med bild för varje del).
export const COMPOUNDS = [
  { a: 'snö', ae: '❄️', b: 'gubbe', be: '👴', w: 'snögubbe' },
  { a: 'sol', ae: '☀️', b: 'ros', be: '🌹', w: 'solros' },
  { a: 'fot', ae: '🦶', b: 'boll', be: '⚽', w: 'fotboll' },
  { a: 'hand', ae: '✋', b: 'boll', be: '⚽', w: 'handboll' },
  { a: 'brand', ae: '🔥', b: 'bil', be: '🚗', w: 'brandbil' },
  { a: 'polis', ae: '👮', b: 'bil', be: '🚗', w: 'polisbil' },
  { a: 'glass', ae: '🍦', b: 'bil', be: '🚗', w: 'glassbil' },
  { a: 'regn', ae: '🌧️', b: 'båge', be: '🏹', w: 'regnbåge' },
  { a: 'regn', ae: '🌧️', b: 'jacka', be: '🧥', w: 'regnjacka' },
  { a: 'is', ae: '🧊', b: 'björn', be: '🐻', w: 'isbjörn' },
  { a: 'snö', ae: '❄️', b: 'boll', be: '⚽', w: 'snöboll' },
  { a: 'sol', ae: '☀️', b: 'hatt', be: '🎩', w: 'solhatt' },
  { a: 'sol', ae: '☀️', b: 'stol', be: '🪑', w: 'solstol' },
  { a: 'sol', ae: '☀️', b: 'glasögon', be: '👓', w: 'solglasögon' },
  { a: 'nyckel', ae: '🔑', b: 'ring', be: '💍', w: 'nyckelring' },
  { a: 'ägg', ae: '🥚', b: 'kopp', be: '☕', w: 'äggkopp' },
  { a: 'hus', ae: '🏠', b: 'båt', be: '⛵', w: 'husbåt' },
  { a: 'jul', ae: '🎅', b: 'gran', be: '🌲', w: 'julgran' },
  { a: 'mjölk', ae: '🥛', b: 'tand', be: '🦷', w: 'mjölktand' },
  { a: 'tand', ae: '🦷', b: 'läkare', be: '👩‍⚕️', w: 'tandläkare' },
  { a: 'brand', ae: '🔥', b: 'man', be: '👨', w: 'brandman' },
  { a: 'katt', ae: '🐱', b: 'unge', be: '👶', w: 'kattunge' },
  { a: 'häst', ae: '🐴', b: 'sko', be: '👟', w: 'hästsko' },
];
// Ord som INTE är sammansatta (distraktorer).
export const SIMPLE_WORDS = ['banan', 'tomat', 'lampa', 'raket', 'robot', 'groda', 'giraff', 'cykel', 'nyckel', 'fjäril', 'uggla', 'krona', 'kanin', 'tiger', 'zebra', 'gurka', 'pizza', 'tårta', 'gitarr', 'trumma', 'ballong', 'citron', 'potatis', 'kamera'];
// Sammansättningar där första ordet ändras (fogeform).
export const COMPOUND_FORMS = [
  { a: 'skola', b: 'gård', w: 'skolgård', wrong: ['skolagård', 'gårdskola'], why: 'a:et i skola försvinner' },
  { a: 'kaka', b: 'burk', w: 'kakburk', wrong: ['kakaburk', 'burkkaka'], why: 'a:et i kaka försvinner' },
  { a: 'blomma', b: 'kruka', w: 'blomkruka', wrong: ['blommakruka', 'blommkruka'], why: 'blomma blir blom' },
  { a: 'äpple', b: 'träd', w: 'äppelträd', wrong: ['äppleträd', 'trädäpple'], why: 'äpple blir äppel' },
  { a: 'saga', b: 'bok', w: 'sagobok', wrong: ['sagabok', 'boksaga'], why: 'a:et i saga blir o' },
  { a: 'panna', b: 'kaka', w: 'pannkaka', wrong: ['pannakaka', 'pankaka'], why: 'a:et i panna försvinner' },
  { a: 'flicka', b: 'rum', w: 'flickrum', wrong: ['flickarum', 'rumflicka'], why: 'a:et i flicka försvinner' },
  { a: 'pojke', b: 'rum', w: 'pojkrum', wrong: ['pojkerum', 'rumpojke'], why: 'e:et i pojke försvinner' },
  { a: 'måne', b: 'sken', w: 'månsken', wrong: ['månesken', 'skenmåne'], why: 'e:et i måne försvinner' },
  { a: 'kväll', b: 'mat', w: 'kvällsmat', wrong: ['kvällmat', 'matkväll'], why: 'vi lägger till ett s i fogen' },
  { a: 'dag', b: 'ljus', w: 'dagsljus', wrong: ['dagljus', 'ljusdag'], why: 'vi lägger till ett s i fogen' },
];

// Stavning. short = kort vokal (dubbelteckning), annars lång vokal (enkel konsonant).
export const SPELL_DOUBLE = [
  { w: 'katt', e: '🐱', wrong: 'kat', short: true },
  { w: 'boll', e: '⚽', wrong: 'bol', short: true },
  { w: 'mamma', e: '👩', wrong: 'mama', short: true },
  { w: 'pappa', e: '👨', wrong: 'papa', short: true },
  { w: 'trumma', e: '🥁', wrong: 'truma', short: true },
  { w: 'flagga', e: '🚩', wrong: 'flaga', short: true },
  { w: 'uggla', e: '🦉', wrong: 'ugla', short: true },
  { w: 'skepp', e: '🚢', wrong: 'skep', short: true },
  { w: 'äpple', e: '🍎', wrong: 'äple', short: true },
  { w: 'ekorre', e: '🐿️', wrong: 'ekore', short: true },
  { w: 'blomma', e: '🌸', wrong: 'bloma', short: true },
  { w: 'snögubbe', e: '⛄', wrong: 'snögube', short: true },
  { w: 'nyckel', e: '🔑', wrong: 'nykel', short: true },
  { w: 'kyckling', e: '🐥', wrong: 'kykling', short: true },
  { w: 'sol', e: '☀️', wrong: 'soll', short: false },
  { w: 'bil', e: '🚗', wrong: 'bill', short: false },
  { w: 'hus', e: '🏠', wrong: 'huss', short: false },
  { w: 'mus', e: '🐭', wrong: 'muss', short: false },
  { w: 'tåg', e: '🚂', wrong: 'tågg', short: false },
  { w: 'ros', e: '🌹', wrong: 'ross', short: false },
  { w: 'båt', e: '⛵', wrong: 'bått', short: false },
  { w: 'gris', e: '🐷', wrong: 'griss', short: false },
  { w: 'tomat', e: '🍅', wrong: 'tommat', short: false },
  { w: 'banan', e: '🍌', wrong: 'bannan', short: false },
  { w: 'robot', e: '🤖', wrong: 'robbot', short: false },
];
// sj-ljud, tj-ljud och j-ljud.
export const SPELL_SOUNDS = [
  { w: 'skjorta', e: '👔', wrong: ['sjorta', 'schorta'], kind: 'sj' },
  { w: 'stjärna', e: '⭐', wrong: ['sjärna', 'skjärna'], kind: 'sj' },
  { w: 'sked', e: '🥄', wrong: ['sjed', 'skjed'], kind: 'sj' },
  { w: 'skepp', e: '🚢', wrong: ['sjepp', 'schepp'], kind: 'sj' },
  { w: 'skidor', e: '🎿', wrong: ['sjidor', 'skjidor'], kind: 'sj' },
  { w: 'sju', e: '7️⃣', wrong: ['skju', 'stju'], kind: 'sj' },
  { w: 'sköldpadda', e: '🐢', wrong: ['sjöldpadda', 'skjöldpadda'], kind: 'sj' },
  { w: 'choklad', e: '🍫', wrong: ['sjoklad', 'skjoklad'], kind: 'sj' },
  { w: 'skägg', e: '🧔', wrong: ['sjägg', 'skjägg'], kind: 'sj' },
  { w: 'tjej', e: '👧', wrong: ['kjej', 'chej'], kind: 'tj' },
  { w: 'kyckling', e: '🐥', wrong: ['tjyckling', 'chyckling'], kind: 'tj' },
  { w: 'kyrka', e: '⛪', wrong: ['tjyrka', 'chyrka'], kind: 'tj' },
  { w: 'kälke', e: '🛷', wrong: ['tjälke', 'kjälke'], kind: 'tj' },
  { w: 'körsbär', e: '🍒', wrong: ['tjörsbär', 'chörsbär'], kind: 'tj' },
  { w: 'känguru', e: '🦘', wrong: ['tjänguru', 'chänguru'], kind: 'tj' },
  { w: 'tjur', e: '🐂', wrong: ['kjur', 'chur'], kind: 'tj' },
  { w: 'hjärta', e: '❤️', wrong: ['järta', 'gjärta'], kind: 'j' },
  { w: 'ljus', e: '🕯️', wrong: ['gjus', 'hjus'], kind: 'j' },
  { w: 'get', e: '🐐', wrong: ['gjet', 'hjet'], kind: 'j' },
  { w: 'jordgubbe', e: '🍓', wrong: ['gjordgubbe', 'hjordgubbe'], kind: 'j' },
];
const SOUND_RULE = {
  sj: 'Sj-ljudet kan stavas på många sätt: sj, sk, skj, stj och ch.',
  tj: 'Tj-ljudet kan stavas tj eller k – k före e, i, y, ä och ö låter ofta som tj.',
  j: 'J-ljudet kan stavas j, g, hj, lj, dj och gj.',
};
// Vanliga ord i meningar (nivå 4). ___ markerar luckan.
export const SPELL_COMMON = [
  { w: 'och', s: 'Katten ___ hunden leker.', wrong: ['ock', 'åch'] },
  { w: 'också', s: 'Jag vill ___ följa med.', wrong: ['ocksa', 'okså'] },
  { w: 'någon', s: 'Är det ___ hemma?', wrong: ['nogon', 'nången'] },
  { w: 'något', s: 'Vill du ha ___ att dricka?', wrong: ['nogot', 'nåkot'] },
  { w: 'mig', s: 'Kan du hjälpa ___?', wrong: ['mi', 'mieg'] },
  { w: 'dig', s: 'Jag tycker om ___.', wrong: ['di', 'dieg'] },
  { w: 'själv', s: 'Jag klarar det ___!', wrong: ['sjelv', 'självv'] },
  { w: 'tjugo', s: 'Jag har ___ kronor.', wrong: ['kjugo', 'schugo'] },
  { w: 'alltid', s: 'Hon kommer ___ i tid.', wrong: ['altid', 'allti'] },
  { w: 'kanske', s: 'Det regnar ___ i morgon.', wrong: ['kansje', 'kanschke'] },
  { w: 'varför', s: 'Vet du ___ himlen är blå?', wrong: ['varfår', 'varrför'] },
  { w: 'sedan', s: 'Först äter vi, ___ leker vi.', wrong: ['sedann', 'seddan'] },
  { w: 'kompis', s: 'Min bästa ___ heter Alva.', wrong: ['kompiss', 'kommpis'] },
  { w: 'tycker', s: 'Jag ___ om glass.', wrong: ['tyker', 'tyckker'] },
  { w: 'säger', s: 'Vad ___ du?', wrong: ['sejer', 'sägger'] },
  { w: 'gärna', s: 'Jag vill ___ spela.', wrong: ['järna', 'gerna'] },
  { w: 'hjälpa', s: 'Kan du ___ mig?', wrong: ['jälpa', 'hjelpa'] },
  { w: 'eftersom', s: 'Jag tar jacka ___ det är kallt.', wrong: ['eftersomm', 'efftersom'] },
  { w: 'tillsammans', s: 'Vi leker ___.', wrong: ['tilsammans', 'tillsamans'] },
  { w: 'mycket', s: 'Tack så ___!', wrong: ['myket', 'mycet'] },
  { w: 'vilken', s: 'Vet du ___ dag det är?', wrong: ['villken', 'vilcken'] },
  { w: 'skola', s: 'Vi går till ___ varje dag.', wrong: ['skolla', 'sckola'] },
];

// Namn (egennamn) och vanliga ord för stor/liten bokstav på nivå 3–4.
export const PROPER_NOUNS = ['Sverige', 'Norge', 'Göteborg', 'Stockholm', 'Malmö', 'Kiruna', 'Gotland', 'Öland', 'Vättern', 'Sara', 'Omar', 'Elsa', 'Leo', 'Alva', 'Noa'];
export const LOWER_NOUNS = ['måndag', 'fredag', 'januari', 'juli', 'stol', 'katt', 'skola', 'svensk', 'sommar', 'jul', 'hund', 'stad'];

// Korta läsförståelsetexter (vardagsmiljöer). lvl 1 = två korta meningar … lvl 4 = fem meningar.
export const READ_TEXTS = [
  // Nivå 1
  { id: 'sixten', lvl: 1, e: '🐱', text: ['Sixten är en katt.', 'Han sover i solen.'], qs: [
    { q: 'Vad är Sixten?', a: 'en katt', o: ['en katt', 'en hund', 'en fisk'] },
    { q: 'Var sover Sixten?', a: 'i solen', o: ['i solen', 'i en båt', 'i snön'] },
  ] },
  { id: 'apan', lvl: 1, e: '🍌', text: ['Apan äter en banan.', 'Bananen är gul.'], qs: [
    { q: 'Vad äter apan?', a: 'en banan', o: ['en banan', 'en glass', 'ett äpple'] },
    { q: 'Vilken färg har bananen?', a: 'gul', o: ['gul', 'blå', 'röd'] },
  ] },
  { id: 'bollen', lvl: 1, e: '⚽', text: ['Lisa har en boll.', 'Hon sparkar bollen till Ali.'], qs: [
    { q: 'Vad har Lisa?', a: 'en boll', o: ['en boll', 'en katt', 'en bok'] },
    { q: 'Vem får bollen?', a: 'Ali', o: ['Ali', 'Lisa', 'mamma'] },
  ] },
  { id: 'grodan', lvl: 1, e: '🐸', text: ['Grodan sitter på en sten.', 'Hopp! Nu är den i vattnet.'], qs: [
    { q: 'Var sitter grodan först?', a: 'på en sten', o: ['på en sten', 'i ett träd', 'i en bil'] },
    { q: 'Var är grodan sedan?', a: 'i vattnet', o: ['i vattnet', 'på taket', 'i sängen'] },
  ] },
  { id: 'natten', lvl: 1, e: '🌙', text: ['Det är natt.', 'Månen lyser på himlen.'], qs: [
    { q: 'Vad lyser på himlen?', a: 'månen', o: ['månen', 'solen', 'en lampa'] },
    { q: 'Är det dag eller natt?', a: 'natt', o: ['natt', 'dag', 'morgon'] },
  ] },
  { id: 'bilen', lvl: 1, e: '🚗', text: ['Pappa har en röd bil.', 'Vi åker till mormor.'], qs: [
    { q: 'Vilken färg har bilen?', a: 'röd', o: ['röd', 'blå', 'grön'] },
    { q: 'Vart åker de?', a: 'till mormor', o: ['till mormor', 'till skolan', 'till stranden'] },
  ] },
  // Nivå 2
  { id: 'applet', lvl: 2, e: '🍎', text: ['Ali har ett rött äpple.', 'Han ger det till Sara.', 'Sara blir glad.'], qs: [
    { q: 'Vad har Ali?', a: 'ett äpple', o: ['ett äpple', 'en boll', 'en bok'] },
    { q: 'Vem får äpplet?', a: 'Sara', o: ['Sara', 'Ali', 'mamma'] },
    { q: 'Hur känner sig Sara?', a: 'glad', o: ['glad', 'arg', 'trött'] },
  ] },
  { id: 'bus', lvl: 2, e: '🐶', text: ['Hunden heter Bus.', 'Bus tycker om att gräva.', 'I dag hittar han ett ben.'], qs: [
    { q: 'Vad heter hunden?', a: 'Bus', o: ['Bus', 'Sixten', 'Pip'] },
    { q: 'Vad hittar Bus?', a: 'ett ben', o: ['ett ben', 'en sko', 'en boll'] },
  ] },
  { id: 'polen', lvl: 2, e: '🌧️', text: ['Det regnar.', 'Ella tar på sig stövlar.', 'Hon hoppar i en stor pöl.'], qs: [
    { q: 'Vad tar Ella på sig?', a: 'stövlar', o: ['stövlar', 'en mössa', 'vantar'] },
    { q: 'Var hoppar Ella?', a: 'i en pöl', o: ['i en pöl', 'i sängen', 'på en stol'] },
  ] },
  { id: 'bussen', lvl: 2, e: '🚌', text: ['Vi åker buss till skolan.', 'Bussen är gul.', 'Den stannar vid parken.'], qs: [
    { q: 'Vilken färg har bussen?', a: 'gul', o: ['gul', 'röd', 'blå'] },
    { q: 'Vart åker vi?', a: 'till skolan', o: ['till skolan', 'till affären', 'till stranden'] },
    { q: 'Var stannar bussen?', a: 'vid parken', o: ['vid parken', 'vid sjön', 'vid kyrkan'] },
  ] },
  { id: 'glassen', lvl: 2, e: '🍦', text: ['Moa köper en glass.', 'Glassen är kall och god.', 'Hon äter den i solen.'], qs: [
    { q: 'Vad köper Moa?', a: 'en glass', o: ['en glass', 'en kaka', 'en banan'] },
    { q: 'Hur är glassen?', a: 'kall och god', o: ['kall och god', 'varm och sur', 'hård och torr'] },
  ] },
  { id: 'smulan', lvl: 2, e: '📦', text: ['Katten Smulan sover i en låda.', 'Lådan står i köket.', 'Där är det varmt och skönt.'], qs: [
    { q: 'Var sover Smulan?', a: 'i en låda', o: ['i en låda', 'i en säng', 'på taket'] },
    { q: 'Var står lådan?', a: 'i köket', o: ['i köket', 'i bilen', 'i skogen'] },
  ] },
  { id: 'snogubbe', lvl: 2, e: '⛄', text: ['Det har snöat.', 'Omar och Noa bygger en snögubbe.', 'Den får en morot som näsa.'], qs: [
    { q: 'Vad bygger de?', a: 'en snögubbe', o: ['en snögubbe', 'ett hus', 'en båt'] },
    { q: 'Vad blir snögubbens näsa?', a: 'en morot', o: ['en morot', 'en sten', 'en gurka'] },
  ] },
  { id: 'biblioteket', lvl: 2, e: '📚', text: ['Elsa går till biblioteket.', 'Hon lånar en bok om hästar.', 'Hon läser den i sängen.'], qs: [
    { q: 'Vad handlar boken om?', a: 'hästar', o: ['hästar', 'hundar', 'bilar'] },
    { q: 'Var läser Elsa boken?', a: 'i sängen', o: ['i sängen', 'i bilen', 'i skolan'] },
  ] },
  { id: 'liam', lvl: 2, e: '🎂', text: ['Liam fyller sju år.', 'Han får en tårta med ljus.', 'Han blåser ut alla ljusen.'], qs: [
    { q: 'Hur gammal blir Liam?', a: 'sju år', o: ['sju år', 'fem år', 'nio år'] },
    { q: 'Vad gör Liam med ljusen?', a: 'blåser ut dem', o: ['blåser ut dem', 'äter upp dem', 'målar dem'] },
  ] },
  { id: 'anden', lvl: 2, e: '🦆', text: ['En and simmar i sjön.', 'Nils ger den lite bröd.', 'Anden säger kvack.'], qs: [
    { q: 'Var simmar anden?', a: 'i sjön', o: ['i sjön', 'i badkaret', 'i en pöl'] },
    { q: 'Vad ger Nils anden?', a: 'bröd', o: ['bröd', 'glass', 'godis'] },
    { q: 'Vad säger anden?', a: 'kvack', o: ['kvack', 'mjau', 'voff'] },
  ] },
  // Nivå 3
  { id: 'affaren', lvl: 3, e: '🛒', text: ['Mamma och Leo går till affären.', 'De ska köpa mjölk, bröd och bananer.', 'Leo får bära påsen hem.', 'Den är tung, men Leo är stark.'], qs: [
    { q: 'Vad ska de köpa?', a: 'mjölk, bröd och bananer', o: ['mjölk, bröd och bananer', 'godis och saft', 'ost och korv'] },
    { q: 'Hur är påsen?', a: 'tung', o: ['tung', 'lätt', 'tom'] },
    { q: 'Vem bär påsen hem?', a: 'Leo', o: ['Leo', 'mamma', 'pappa'] },
  ] },
  { id: 'badhuset', lvl: 3, e: '🏊', text: ['På lördag åker Sara till badhuset.', 'Hon har simglasögon på sig.', 'Först simmar hon två längder.', 'Sedan hoppar hon från trampolinen.'], qs: [
    { q: 'Vilken dag åker Sara till badhuset?', a: 'på lördag', o: ['på lördag', 'på måndag', 'på onsdag'] },
    { q: 'Vad gör Sara först?', a: 'simmar två längder', o: ['simmar två längder', 'hoppar från trampolinen', 'äter en glass'] },
  ] },
  { id: 'tanden', lvl: 3, e: '🦷', text: ['Nora har en tand som sitter löst.', 'Hon vickar på den hela dagen.', 'Vid middagen lossnar den när hon äter en smörgås.', 'På kvällen lägger hon tanden under kudden.'], qs: [
    { q: 'När lossnar tanden?', a: 'vid middagen', o: ['vid middagen', 'i skolan', 'på morgonen'] },
    { q: 'Var lägger Nora tanden?', a: 'under kudden', o: ['under kudden', 'i en låda', 'i fönstret'] },
  ] },
  { id: 'loven', lvl: 3, e: '🍂', text: ['Det är höst.', 'Löven på träden har blivit gula och röda.', 'Elias krattar ihop dem till en stor hög.', 'Sedan hoppar han rakt ner i högen!'], qs: [
    { q: 'Vilken årstid är det?', a: 'höst', o: ['höst', 'vår', 'sommar'] },
    { q: 'Vad gör Elias innan han hoppar?', a: 'krattar ihop löven', o: ['krattar ihop löven', 'klättrar i trädet', 'målar löven'] },
  ] },
  { id: 'pigg', lvl: 3, e: '🐹', text: ['Klassen har fått ett husdjur.', 'Det är en hamster som heter Pigg.', 'Varje dag får ett barn ge Pigg mat och vatten.', 'På natten springer Pigg i sitt hjul.'], qs: [
    { q: 'Vad för slags djur är Pigg?', a: 'en hamster', o: ['en hamster', 'en kanin', 'en katt'] },
    { q: 'När springer Pigg i hjulet?', a: 'på natten', o: ['på natten', 'på morgonen', 'på rasten'] },
    { q: 'Vem ger Pigg mat?', a: 'ett barn i klassen', o: ['ett barn i klassen', 'rektorn', 'ingen'] },
  ] },
  { id: 'frot', lvl: 3, e: '🌱', text: ['Alva sätter ett frö i en kruka med jord.', 'Hon vattnar fröet och ställer krukan i fönstret.', 'Efter en vecka ser hon ett litet grönt skott.', 'Nu växer det!'], qs: [
    { q: 'Var ställer Alva krukan?', a: 'i fönstret', o: ['i fönstret', 'i garderoben', 'under sängen'] },
    { q: 'Hur länge dröjer det innan något växer?', a: 'en vecka', o: ['en vecka', 'en dag', 'ett år'] },
    { q: 'Vad behöver fröet för att växa?', a: 'jord, vatten och ljus', o: ['jord, vatten och ljus', 'sand och is', 'bara mörker'] },
  ] },
  { id: 'cykeln', lvl: 3, e: '🚲', text: ['Hugo har fått en ny cykel.', 'Den är blå och har en ringklocka.', 'Hugo tar alltid på sig hjälmen innan han cyklar.', 'Pling, pling! säger klockan.'], qs: [
    { q: 'Vilken färg har cykeln?', a: 'blå', o: ['blå', 'röd', 'grön'] },
    { q: 'Vad gör Hugo innan han cyklar?', a: 'tar på sig hjälmen', o: ['tar på sig hjälmen', 'äter frukost', 'ringer mormor'] },
  ] },
  { id: 'sagan', lvl: 3, e: '🌙', text: ['Det är kväll.', 'Ivar har borstat tänderna och tagit på sig pyjamasen.', 'Pappa läser en saga för honom.', 'Innan sagan är slut sover Ivar.'], qs: [
    { q: 'Vem läser sagan?', a: 'pappa', o: ['pappa', 'mamma', 'Ivar'] },
    { q: 'Vad händer innan sagan är slut?', a: 'Ivar somnar', o: ['Ivar somnar', 'boken försvinner', 'pappa somnar'] },
  ] },
  // Nivå 4
  { id: 'lordag', lvl: 4, e: '⏰', text: ['Maja vaknade och tittade på klockan.', '– Åh nej! ropade hon och hoppade ur sängen.', 'Hon klädde på sig på en minut och sprang till bussen.', 'När hon kom fram till skolan var skolgården alldeles tom.', 'Då kom hon på att det var lördag.'], qs: [
    { q: 'Varför hade Maja så bråttom?', a: 'hon trodde att hon var sen till skolan', o: ['hon trodde att hon var sen till skolan', 'hon skulle åka till stranden', 'hon var hungrig'] },
    { q: 'Varför var skolgården tom?', a: 'det var lördag och ingen skola', o: ['det var lördag och ingen skola', 'alla var sjuka', 'det regnade'] },
  ] },
  { id: 'holken', lvl: 4, e: '🐦', text: ['Viktor och morfar hänger upp en fågelholk i björken.', 'Det är tidig vår.', 'Några dagar senare ser Viktor en blåmes flyga in med strån i näbben.', '– Den bygger ett bo! viskar han.', 'Morfar nickar och säger att de måste vara tysta så att fågeln inte blir störd.'], qs: [
    { q: 'Vad bär blåmesen i näbben?', a: 'strån', o: ['strån', 'en mask', 'bröd'] },
    { q: 'Varför ska de vara tysta?', a: 'så att fågeln inte blir störd', o: ['så att fågeln inte blir störd', 'för att morfar sover', 'för att det är natt'] },
    { q: 'Var hänger holken?', a: 'i en björk', o: ['i en björk', 'på huset', 'i en gran'] },
  ] },
  { id: 'pusslet', lvl: 4, e: '🧩', text: ['Ebba och Sam bygger ett pussel med 500 bitar.', 'De har hållit på i tre dagar.', 'Till slut saknas bara en enda bit.', 'De letar under bordet, i soffan och i lådorna.', 'Då ser Ebba att katten ligger och sover på biten.'], qs: [
    { q: 'Hur länge har de byggt på pusslet?', a: 'i tre dagar', o: ['i tre dagar', 'i fem dagar', 'i en timme'] },
    { q: 'Var var den sista biten?', a: 'under katten', o: ['under katten', 'under bordet', 'i soffan'] },
  ] },
  { id: 'sandslottet', lvl: 4, e: '🏖️', text: ['Familjen är på stranden.', 'Oskar bygger ett sandslott nära vattnet.', 'Han gör torn och en vallgrav runt slottet.', 'Men när vågorna blir större fylls vallgraven med vatten.', 'Oskar skrattar och flyttar längre upp på stranden för att bygga ett nytt.'], qs: [
    { q: 'Varför fylldes vallgraven med vatten?', a: 'vågorna blev större', o: ['vågorna blev större', 'det började regna', 'Oskar hällde i vatten'] },
    { q: 'Hur tar Oskar det?', a: 'han skrattar och bygger ett nytt', o: ['han skrattar och bygger ett nytt', 'han blir arg och går hem', 'han gråter'] },
  ] },
  { id: 'bullar', lvl: 4, e: '🥐', text: ['Klass 3B säljer bullar på skolans vårfest.', 'En bulle kostar fem kronor.', 'Ines köper tre bullar.', 'Hon betalar med en tjugolapp och får tillbaka fem kronor.'], qs: [
    { q: 'Hur mycket kostade Ines bullar tillsammans?', a: '15 kronor', o: ['15 kronor', '20 kronor', '5 kronor'] },
    { q: 'Var säljer klassen bullarna?', a: 'på vårfesten', o: ['på vårfesten', 'i affären', 'på biblioteket'] },
  ] },
  { id: 'igelkotten', lvl: 4, e: '🦔', text: ['Igelkotten är ett djur som är vaken på natten.', 'Den äter bland annat sniglar, maskar och skalbaggar.', 'När det blir kallt på hösten bygger den ett bo av löv.', 'Där sover den hela vintern.', 'Det kallas att gå i ide.'], qs: [
    { q: 'När är igelkotten vaken?', a: 'på natten', o: ['på natten', 'på dagen', 'bara på vintern'] },
    { q: 'Vad kallas det när igelkotten sover hela vintern?', a: 'att gå i ide', o: ['att gå i ide', 'att ruva', 'att flytta söderut'] },
    { q: 'Vad är igelkottens bo gjort av?', a: 'löv', o: ['löv', 'sten', 'snö'] },
  ] },
  { id: 'bina', lvl: 4, e: '🐝', text: ['Bin flyger från blomma till blomma och samlar nektar.', 'Av nektarn gör de honung.', 'När bina flyger runt sprider de också pollen mellan blommorna.', 'Det hjälper blommorna att bli frukter och frön.', 'Därför är bin viktiga för både människor och natur.'], qs: [
    { q: 'Vad gör bina av nektarn?', a: 'honung', o: ['honung', 'pollen', 'saft'] },
    { q: 'Varför är bin viktiga?', a: 'de hjälper blommor att bli frukter och frön', o: ['de hjälper blommor att bli frukter och frön', 'de äter upp myggor', 'de gör vattnet rent'] },
  ] },
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
    id: 'kalaset', title: 'Noas kalas', e: '🎈', level: 1,
    text: [
      'I dag har Noa kalas.',
      'Han fyller sex år.',
      'Alla kompisar kommer.',
      'De leker kurragömma i trädgården.',
      'Sedan äter de tårta med jordgubbar.',
      '– Det här är min bästa dag! säger Noa.',
    ],
    questions: [
      { q: 'Hur gammal blir Noa?', a: 'sex år', o: ['sex år', 'fem år', 'sju år'] },
      { q: 'Vad leker de?', a: 'kurragömma', o: ['kurragömma', 'fotboll', 'affär'] },
      { q: 'Vad är det på tårtan?', a: 'jordgubbar', o: ['jordgubbar', 'blåbär', 'bananer'] },
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
  {
    id: 'rymdboken', title: 'Den försvunna boken', e: '🔎', level: 3,
    text: [
      'Alma hade lånat en bok om rymden på biblioteket.',
      'På fredag skulle hon lämna tillbaka den, men boken var borta!',
      'Hon letade i ryggsäcken, under sängen och bakom soffan.',
      '– Har du sett min rymdbok? frågade hon sin lillebror Kim.',
      'Kim tittade ner i golvet och blev röd om kinderna.',
      'Sedan hämtade han boken från sitt eget rum.',
      '– Jag ville bara titta på bilderna av planeterna, sa han tyst.',
      'Alma log. – Vi kan läsa den tillsammans innan vi lämnar tillbaka den.',
    ],
    questions: [
      { q: 'Vad handlade boken om?', a: 'rymden', o: ['rymden', 'dinosaurier', 'hästar'] },
      { q: 'Var var boken?', a: 'i Kims rum', o: ['i Kims rum', 'under sängen', 'i ryggsäcken'] },
      { q: 'Varför blev Kim röd om kinderna?', a: 'han skämdes för att han hade tagit boken', o: ['han skämdes för att han hade tagit boken', 'han var förkyld', 'han hade sprungit'] },
      { q: 'Vad gjorde Alma till slut?', a: 'hon ville läsa boken med Kim', o: ['hon ville läsa boken med Kim', 'hon blev arg på Kim', 'hon gömde boken'] },
    ],
  },
{
  "id": "bollhjalp",
  "title": "Bollen under stolen",
  "e": "⚽",
  "level": 0,
  "text": [
    "Liv har en boll.",
    "Bollen rullar under en stol.",
    "Liv böjer sig ner.",
    "Hon tar fram bollen.",
    "Nu kan hon leka igen."
  ],
  "questions": [
    {
      "q": "Vad har Liv?",
      "a": "en boll",
      "o": [
        "en boll",
        "en bok",
        "en sko"
      ],
      "explain": "I berättelsen står det: Liv har en boll."
    },
    {
      "q": "Var hamnar bollen?",
      "a": "under en stol",
      "o": [
        "under en stol",
        "i en väska",
        "på ett bord"
      ],
      "explain": "I berättelsen står det: Bollen rullar under en stol."
    },
    {
      "q": "Vad gör Liv för att nå bollen?",
      "a": "böjer sig ner",
      "o": [
        "böjer sig ner",
        "hoppar upp",
        "somnar"
      ],
      "explain": "I berättelsen står det: Liv böjer sig ner."
    }
  ]
},
{
  "id": "tva-koppar",
  "title": "Två koppar",
  "e": "☕",
  "level": 0,
  "text": [
    "Bo dukar.",
    "Han ställer fram två koppar.",
    "En kopp är gul.",
    "En kopp är blå.",
    "Bo ger den blå koppen till Kim."
  ],
  "questions": [
    {
      "q": "Hur många koppar finns det?",
      "a": "två",
      "o": [
        "två",
        "en",
        "tre"
      ],
      "explain": "I berättelsen står det: Han ställer fram två koppar."
    },
    {
      "q": "Vilken kopp får Kim?",
      "a": "den blå",
      "o": [
        "den blå",
        "den gula",
        "den röda"
      ],
      "explain": "I berättelsen står det: Bo ger den blå koppen till Kim."
    },
    {
      "q": "Vad gör Bo?",
      "a": "dukar",
      "o": [
        "dukar",
        "badar",
        "cyklar"
      ],
      "explain": "I berättelsen står det: Bo dukar."
    }
  ]
},
{
  "id": "froraden",
  "title": "Fröet i krukan",
  "e": "🌱",
  "level": 1,
  "text": [
    "Nora fyller en kruka med jord.",
    "Hon lägger ner ett frö.",
    "Hon vattnar lite och ställer krukan vid fönstret.",
    "Nora tittar i krukan varje dag.",
    "En morgon ser hon två små gröna blad."
  ],
  "questions": [
    {
      "q": "Vad lägger Nora i jorden?",
      "a": "ett frö",
      "o": [
        "ett frö",
        "en sten",
        "en penna"
      ],
      "explain": "I berättelsen står det: Hon lägger ner ett frö."
    },
    {
      "q": "Var står krukan?",
      "a": "vid fönstret",
      "o": [
        "vid fönstret",
        "i garderoben",
        "under sängen"
      ],
      "explain": "I berättelsen står det: Hon vattnar lite och ställer krukan vid fönstret."
    },
    {
      "q": "Vad ser Nora en morgon?",
      "a": "två gröna blad",
      "o": [
        "två gröna blad",
        "en röd boll",
        "en blå kopp"
      ],
      "explain": "I berättelsen står det: En morgon ser hon två små gröna blad."
    }
  ]
},
{
  "id": "bibliotekskort",
  "title": "Boken som väntade",
  "e": "📚",
  "level": 1,
  "text": [
    "Eli går till biblioteket.",
    "Hen vill läsa om havet.",
    "Boken är redan utlånad.",
    "Bibliotekarien skriver upp Eli i kön.",
    "Nästa vecka får Eli ett meddelande: boken har kommit tillbaka!",
    "Nu får Eli låna den."
  ],
  "questions": [
    {
      "q": "Vad vill Eli läsa om?",
      "a": "havet",
      "o": [
        "havet",
        "rymden",
        "fotboll"
      ],
      "explain": "I berättelsen står det: Hen vill läsa om havet."
    },
    {
      "q": "Varför kan Eli inte låna boken direkt?",
      "a": "någon annan har lånat den",
      "o": [
        "någon annan har lånat den",
        "boken saknar sidor",
        "biblioteket är stängt"
      ],
      "explain": "I berättelsen står det: Boken är redan utlånad."
    },
    {
      "q": "Vad betyder meddelandet nästa vecka?",
      "a": "boken finns att låna",
      "o": [
        "boken finns att låna",
        "boken har försvunnit",
        "Eli behöver köpa boken"
      ],
      "explain": "I berättelsen står det: Nästa vecka får Eli ett meddelande: boken har kommit tillbaka!"
    }
  ]
},
{
  "id": "pappersbron",
  "title": "Bron som böjde sig",
  "e": "🌉",
  "level": 2,
  "text": [
    "Alva vill bygga en bro av papper mellan två böcker.",
    "Det platta papperet böjer sig när hon lägger en leksaksbil på det.",
    "Alva viker ett nytt, likadant papper fram och tillbaka som ett dragspel.",
    "Hon lägger det mellan samma böcker och använder samma bil.",
    "Den vikta bron håller bilen.",
    "Alva ritar båda försöken i sin anteckningsbok."
  ],
  "questions": [
    {
      "q": "Vad ändrar Alva i andra försöket?",
      "a": "papperets form",
      "o": [
        "papperets form",
        "bilens storlek",
        "böckernas avstånd"
      ],
      "explain": "I berättelsen står det: Alva viker ett nytt, likadant papper fram och tillbaka som ett dragspel."
    },
    {
      "q": "Vad händer med den platta bron?",
      "a": "den böjer sig",
      "o": [
        "den böjer sig",
        "den flyger iväg",
        "den blir våt"
      ],
      "explain": "I berättelsen står det: Det platta papperet böjer sig när hon lägger en leksaksbil på det."
    },
    {
      "q": "Varför använder Alva samma bil igen?",
      "a": "för att jämföra broarnas former",
      "o": [
        "för att jämföra broarnas former",
        "för att bilen är snabbast",
        "för att ändra två saker samtidigt"
      ],
      "explain": "I berättelsen står det: Hon lägger det mellan samma böcker och använder samma bil."
    }
  ]
},
{
  "id": "spar-i-snon",
  "title": "Spåren vid grinden",
  "e": "🐾",
  "level": 3,
  "text": [
    "Vid grinden ser Aziz små tasspår i snön.",
    "Han tror först att grannens hund har varit där.",
    "Spåren fortsätter under ett mycket lågt staket.",
    "Aziz vet att den stora hunden inte kan komma under staketet.",
    "Då ser han grannens katt krypa fram på samma ställe.",
    "– Jag behöver fler ledtrådar innan jag bestämmer mig, säger han."
  ],
  "questions": [
    {
      "q": "Vad tror Aziz först?",
      "a": "att hunden gjort spåren",
      "o": [
        "att hunden gjort spåren",
        "att en fågel gjort spåren",
        "att snön är målad"
      ],
      "explain": "I berättelsen står det: Han tror först att grannens hund har varit där."
    },
    {
      "q": "Vilken ledtråd talar emot hunden?",
      "a": "staketet är för lågt för hunden",
      "o": [
        "staketet är för lågt för hunden",
        "hunden har tassar",
        "det är vinter"
      ],
      "explain": "I berättelsen står det: Aziz vet att den stora hunden inte kan komma under staketet."
    },
    {
      "q": "Vad gör Aziz när han får nya ledtrådar?",
      "a": "ändrar sin första tanke",
      "o": [
        "ändrar sin första tanke",
        "slutar titta på spåren",
        "målar över spåren"
      ],
      "explain": "I berättelsen står det: – Jag behöver fler ledtrådar innan jag bestämmer mig, säger han."
    }
  ]
},
{
  "id": "klassens-skylt",
  "title": "Skylten med två betydelser",
  "e": "🪧",
  "level": 4,
  "text": [
    "Klassen ska ordna en bytesdag för böcker.",
    "På skylten skriver de: Ta en bok!",
    "När första besökaren kommer tar hon en bok och går.",
    "Noel blir förvånad: – Vi menade att alla skulle lämna en bok också.",
    "Amina pekar på skylten. Där står inget om att lämna något.",
    "Klassen byter text till: Lämna en bok som du läst. Välj sedan en annan bok att ta hem.",
    "Nästa besökare läser skylten, lämnar sin bok och väljer en ny."
  ],
  "questions": [
    {
      "q": "Varför missförstår den första besökaren?",
      "a": "skylten säger bara att ta en bok",
      "o": [
        "skylten säger bara att ta en bok",
        "hon kan inte läsa",
        "hon har aldrig sett en bok"
      ],
      "explain": "I berättelsen står det: Amina pekar på skylten. Där står inget om att lämna något."
    },
    {
      "q": "Vilken ändring gör skylten tydligare?",
      "a": "båda stegen står i texten",
      "o": [
        "båda stegen står i texten",
        "texten blir hemlig",
        "skylten får bara en bild"
      ],
      "explain": "I berättelsen står det: Klassen byter text till: Lämna en bok som du läst. Välj sedan en annan bok att ta hem."
    },
    {
      "q": "Vilken slutsats stöds av händelserna?",
      "a": "tydliga instruktioner behöver ange viktiga steg",
      "o": [
        "tydliga instruktioner behöver ange viktiga steg",
        "besökaren ville förstöra bytesdagen",
        "alla besökare hade samma bok"
      ],
      "explain": "I berättelsen står det: Nästa besökare läser skylten, lämnar sin bok och väljer en ny."
    }
  ]
},
{
  "id": "ryktet-om-parken",
  "title": "Ryktet om parken",
  "e": "🔎",
  "level": 4,
  "text": [
    "I klassens chatt står det att parken ska stänga för alltid.",
    "Meddelandet saknar avsändare och datum.",
    "Maja går till parkens anslagstavla tillsammans med sin pappa.",
    "På skylten står att lekplatsen är stängd måndag till onsdag för att laga en gunga. Resten av parken är öppen.",
    "Skylten har kommunens namn och dagens datum.",
    "Maja skriver ner vad skylten faktiskt säger.",
    "Hon visar texten för sin pappa innan de delar rättelsen."
  ],
  "questions": [
    {
      "q": "Vad är stängt enligt skylten?",
      "a": "lekplatsen måndag till onsdag",
      "o": [
        "lekplatsen måndag till onsdag",
        "hela parken för alltid",
        "biblioteket i en vecka"
      ],
      "explain": "I berättelsen står det: På skylten står att lekplatsen är stängd måndag till onsdag för att laga en gunga. Resten av parken är öppen."
    },
    {
      "q": "Vilken uppgift saknas i chattmeddelandet?",
      "a": "avsändare och datum",
      "o": [
        "avsändare och datum",
        "ordet parken",
        "ett påstående om stängning"
      ],
      "explain": "I berättelsen står det: Meddelandet saknar avsändare och datum."
    },
    {
      "q": "Varför är skylten bättre stöd för rättelsen?",
      "a": "den anger ansvarig avsändare, datum och vad som stängs",
      "o": [
        "den anger ansvarig avsändare, datum och vad som stängs",
        "den är alltid sann för att den är tryckt",
        "den använder färre bokstäver"
      ],
      "explain": "I berättelsen står det: Skylten har kommunens namn och dagens datum."
    }
  ]
}
];

/* ---------- hjälpare ---------- */
const pictureOpt = (x) => ({ id: x.w, html: `<span class="pic">${x.e}</span>`, say: x.w });
const letterOpt = (l) => ({ id: l, label: l, say: l });
const textOpt = (w) => ({ id: w, label: w, say: w });
const silentOpt = (w) => ({ id: w, label: w, say: '' });
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const VOWELS = 'aeiouyåäö';
const endsVowel = (w) => VOWELS.includes(w[w.length - 1]);
/** Väljer en lista beroende på nivå: helst exakt nivå, ibland en nivå lägre. */
function byLevel(list, level, rng, { min = 1, max = 4, key = 'lvl', down = 0.25 } = {}) {
  const want = Math.max(min, Math.min(max, level));
  const lvl = want > min && rng.chance(down) ? want - 1 : want;
  const pool = list.filter((x) => x[key] === lvl);
  return pool.length ? pool : list.filter((x) => x[key] <= want);
}

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

/* ---------- Första (och sista) ljudet ---------- */
const CONFUSABLE = { B: ['D', 'P'], D: ['B', 'T'], P: ['B', 'T'], M: ['N'], N: ['M'], E: ['Ä', 'I'], Ä: ['E', 'Å'], Å: ['O', 'Ä'], O: ['Å', 'U'], U: ['O', 'Y'], Y: ['U', 'I'], I: ['E', 'Y'], G: ['K', 'J'], K: ['G', 'T'], S: ['F', 'Z'], F: ['V', 'S'], V: ['F', 'W'], T: ['D', 'K'], L: ['R', 'N'], R: ['L'], A: ['Å', 'Ä'] };
function letterChoices(rng, ans, level) {
  const others = level >= 2 && CONFUSABLE[ans] ? CONFUSABLE[ans].slice(0, 2) : [];
  const rest = rng.shuffle(LETTERS.filter((l) => l !== ans && !others.includes(l)));
  while (others.length < 2) others.push(rest.pop());
  return rng.shuffle([ans, ...others]).map(letterOpt);
}
export function genFirstSound(level, rng) {
  if (level >= 3 && rng.chance(0.4)) {
    // Sista ljudet – svårare, kräver att man lyssnar på slutet av ordet.
    const item = rng.pick(WORDS.filter((w) => w.w.length >= 3 && w.w.length <= 6 && w.w.at(-1) !== w.w.at(-2) && !/[rl]g$/.test(w.w)));
    const ans = item.w.at(-1).toUpperCase();
    return {
      type: 'choice',
      prompt: `Vilken bokstav slutar ${item.w} på?`,
      say: `Lyssna på slutet. Vilken bokstav slutar ordet ${item.w} på?`,
      visual: `<div class="pic-big">${item.e}</div>`,
      options: letterChoices(rng, ans, level),
      answer: ans,
      hint: `Säg ${item.w} långsamt och lyssna på det allra sista ljudet.`,
      explain: `${item.w} slutar på ${ans}: ${item.w.split('').join(' – ')}.`,
    };
  }
  const pool = level <= 1 ? COMMON : ALPHABET;
  const target = rng.pick(pool);
  return {
    type: 'choice',
    prompt: `Vilken bokstav börjar ${target.word} på?`,
    visual: `<div class="pic-big">${target.e}</div>`,
    options: letterChoices(rng, target.l, level),
    answer: target.l,
    hint: `Säg ${target.word} långsamt. Vilket ljud hör du först?`,
    explain: `${target.word} börjar på ${target.l}.`,
    collect: { set: 'lettersHeard', item: target.l },
  };
}

/* ---------- Rimma ---------- */
export function genRhyme(level, rng) {
  const useText = level >= 2;
  const toOpt = (x) => (useText ? { id: x.w, html: `<span class="pic sm">${x.e}</span><span>${x.w}</span>`, say: x.w } : pictureOpt(x));
  const group = rng.pick(RHYME_GROUPS);
  const others = RHYME_GROUPS.filter((g) => g !== group).flatMap((g) => g.w);
  if (level >= 3 && rng.chance(0.35)) {
    // Udda ord ut: två ord rimmar, ett gör det inte.
    const [a, b] = rng.sample(group.w, 2);
    const odd = rng.pick(others);
    return {
      type: 'choice',
      prompt: 'Vilket ord rimmar inte?',
      say: 'Två av orden rimmar. Vilket ord rimmar inte?',
      options: rng.shuffle([a, b, odd]).map(toOpt),
      answer: odd.w,
      hint: 'Säg orden högt. Lyssna på hur de slutar.',
      explain: `${a.w} och ${b.w} rimmar – de slutar på -${group.r}. ${cap(odd.w)} rimmar inte.`,
    };
  }
  const [a, b] = rng.sample(group.w, 2);
  const wrong = rng.sample(others, level === 0 ? 1 : 2);
  return {
    type: 'choice',
    prompt: `Vad rimmar på ${a.w}?`,
    visual: `<div class="pic-big">${a.e}${useText ? `<div class="word">${a.w}</div>` : ''}</div>`,
    options: rng.shuffle([b, ...wrong]).map(toOpt),
    answer: b.w,
    hint: 'Ord som rimmar slutar likadant – som hus och mus.',
    explain: `${a.w} och ${b.w} rimmar – båda slutar på -${group.r}.`,
  };
}

/* ---------- Klappa stavelser ---------- */
export function genSyllables(level, rng) {
  const maxS = [2, 3, 4, 4, 4][Math.max(0, Math.min(4, level))];
  const minS = level >= 4 ? 2 : 1;
  const pool = SYLLABLES.filter((s) => s.s.length <= maxS && s.s.length >= minS);
  const item = rng.pick(pool);
  const n = item.s.length;
  return {
    type: 'tapcount',
    prompt: `Klappa ${item.w}! Tryck på trumman en gång för varje stavelse.`,
    say: `Klappa ordet ${item.w}. Tryck på trumman en gång för varje stavelse.`,
    visual: `<div class="pic-big">${item.e}${level >= 1 ? `<div class="word">${item.w}</div>` : ''}</div>`,
    answer: n,
    max: 6,
    sayWord: item.w,
    hint: `Säg ordet långsamt: ${item.s.join(' – ')}.`,
    explain: `${item.s.join(' – ')}. Det är ${['', 'en', 'två', 'tre', 'fyra', 'fem'][n]} stavelse${n > 1 ? 'r' : ''}. Varje stavelse har en vokal.`,
  };
}

/* ---------- Stor & liten bokstav ---------- */
export function genCase(level, rng) {
  if (level >= 3 && rng.chance(0.4)) {
    // Vilket ord ska börja med stor bokstav? (namn – men inte veckodagar och månader)
    const name = rng.pick(PROPER_NOUNS);
    const others = rng.sample(LOWER_NOUNS, 2);
    return {
      type: 'choice',
      prompt: 'Vilket ord ska alltid skrivas med stor bokstav?',
      options: rng.shuffle([name, ...others]).map((w) => ({ id: w, label: w.toLowerCase(), say: w })),
      answer: name,
      hint: 'Namn på personer, länder, städer, öar och sjöar börjar med stor bokstav.',
      explain: `${name} är ett namn och skrivs med stor bokstav. Veckodagar, månader och vanliga ord skrivs med liten bokstav, till exempel ${others[0]}.`,
    };
  }
  const l = rng.pick(level === 0 ? COMMON.slice(0, 16).map((a) => a.l) : LETTERS);
  const lower = l.toLowerCase();
  const tricky = { B: ['d', 'p', 'q'], D: ['b', 'p', 'q'], P: ['q', 'b', 'd'], Q: ['p', 'g', 'b'], N: ['m', 'u', 'h'], M: ['n', 'w'], U: ['n', 'v'], A: ['ä', 'å', 'o'], O: ['ö', 'å', 'a'], Å: ['ä', 'a'], Ä: ['å', 'a'], Ö: ['o', 'ä'], G: ['q', 'j'], H: ['n', 'b'], E: ['a', 'c'], I: ['j', 'l'], J: ['i', 'g'] };
  const others = level >= 1 && tricky[l] ? tricky[l].slice(0, 2) : [];
  const rest = rng.shuffle(LETTERS.map((x) => x.toLowerCase()).filter((x) => x !== lower && !others.includes(x)));
  while (others.length < 2) others.push(rest.pop());
  const reverse = level >= 1 && rng.chance(0.5);
  if (reverse) {
    return {
      type: 'choice', prompt: `Vilken stor bokstav hör ihop med ${lower}?`, say: `Vilken versal hör ihop med den lilla bokstaven ${l}?`,
      visual: `<div class="big-letter">${lower}</div>`,
      options: rng.shuffle([l, ...others.map((x) => x.toUpperCase())]).map(letterOpt), answer: l,
      hint: 'Versaler är stora bokstäver. Gemener är små.', explain: `${l} och ${lower} är samma bokstav. ${l} är en versal och ${lower} är en gemen.`,
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
  if (level === 3) return WORDS.filter((w) => w.w.length >= 5 && w.w.length <= 7);
  return WORDS.filter((w) => w.w.length >= 6);
}
export function genBuild(level, rng) {
  const item = rng.pick(wordsForLevel(level));
  const letters = item.w.toUpperCase().split('');
  const extra = level >= 2 ? rng.sample(LETTERS.filter((l) => !letters.includes(l) && !ALPHABET.find((a) => a.l === l)?.rare), level >= 4 ? 3 : 2) : [];
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

/* ---------- Stava ord: lyssna på ordet och bygg det med bokstavsbrickor ---------- */
const COMMON_LOWER = COMMON.map((a) => a.l.toLowerCase());
/** Bokstäver som lockar till vanliga stavfel i just det här ordet (distraktorer). */
export function trickyLetters(w) {
  const out = [];
  if (/stj|skj|sj|ch|sk[eiyäö]/.test(w)) out.push('j', 'h', 's');
  if (/tj|^k[eiyäö]/.test(w)) out.push('j', 'c');
  if (/^hj|^lj|^g[eiyäö]|rg$/.test(w)) out.push('j', 'g');
  if (/ng|nk|gn/.test(w)) out.push('g', 'n', 'm');
  if (/ck/.test(w)) out.push('k', 'c');
  const dbl = w.match(/([a-zåäö])\1/);
  if (dbl) out.push(dbl[1]);
  return [...new Set(out)];
}
const EXTRA_TILES = [0, 1, 2, 2, 3];
export function genSpellWord(level, rng) {
  const lvl = Math.max(0, Math.min(4, level));
  // Ibland ett lättare ord för att hålla flytet uppe.
  const item = rng.pick(spellWordsForLevel(lvl > 0 && rng.chance(0.2) ? lvl - 1 : lvl));
  const upper = lvl <= 1;
  const cased = upper ? item.w.toUpperCase() : item.w;
  const letters = cased.split('');
  const nExtra = EXTRA_TILES[lvl];
  const extra = [];
  for (const l of rng.shuffle(trickyLetters(item.w))) if (extra.length < nExtra && (!item.w.includes(l) || /([a-zåäö])\1/.test(item.w))) extra.push(l);
  const fill = rng.shuffle(COMMON_LOWER.filter((l) => !item.w.includes(l) && !extra.includes(l)));
  while (extra.length < nExtra) extra.push(fill.pop());
  const tip = spellTip(item.w);
  const pic = item.photo && hasPhoto(item.photo) ? photo(item.photo, { alt: item.w, cls: 'spell-photo' }) : item.e;
  return {
    type: 'build',
    prompt: 'Lyssna och stava ordet!',
    say: `Stava ordet ${item.w}.`,
    visual: `<div class="pic-big spell-pic">${pic}</div>`,
    word: cased,
    tiles: rng.shuffle([...letters, ...extra.map((l) => (upper ? l.toUpperCase() : l))]),
    sayWord: item.w,
    hint: `Säg ordet långsamt och lyssna efter varje ljud: ${item.w.split('').join(' – ')}.`,
    explain: `${cased}: ${letters.join(' – ')}.${tip ? ` ${tip}` : ''}`,
    collect: { set: 'spelledWords', item: item.w },
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
  if (level >= 4 && rng.chance(0.5)) {
    // Samma första bokstav – titta på andra bokstaven.
    const groups = {};
    for (const w of WORDS) (groups[w.w[0]] ||= []).push(w);
    const big = Object.values(groups).filter((g) => g.length >= 4);
    const picks = rng.sample(rng.pick(big).filter((w, i, arr) => arr.findIndex((x) => x.w[1] === w.w[1]) === i), 4);
    if (picks.length >= 3) {
      const sorted = picks.slice().sort((a, b) => svCompare(a.w, b.w));
      return {
        type: 'order',
        prompt: 'Alla ord börjar likadant! Tryck på orden i ABC-ordning.',
        items: rng.shuffle(picks).map((p) => ({ id: p.w, html: `<span class="pic sm">${p.e}</span><span>${p.w}</span>`, say: p.w })),
        answerOrder: sorted.map((p) => p.w),
        hint: 'När första bokstaven är lika tittar du på den andra bokstaven.',
        explain: sorted.map((p) => p.w).join(', ') + '.',
      };
    }
  }
  if (level >= 3 && rng.chance(0.5)) {
    const picks = rng.sample(WORDS.filter((w, i, arr) => arr.findIndex((x) => x.w[0] === w.w[0]) === i), 4);
    const sorted = picks.slice().sort((a, b) => svCompare(a.w, b.w));
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

/* ---------- Meningar: skiljetecken och bygg meningen ---------- */
export function sentenceWords(s) {
  return s.replace(/[.?!]$/, '').split(' ');
}
export function genSentence(level, rng) {
  if (rng.chance(0.35)) {
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
  const item = rng.pick(byLevel(SENTENCES, level, rng, { min: 1, max: 4 }));
  const words = sentenceWords(item.s);
  const end = item.s.at(-1);
  return {
    type: 'order',
    prompt: 'Bygg meningen. Tryck på orden i rätt ordning.',
    say: `Bygg meningen: ${item.s.slice(0, -1)}. Tryck på orden i rätt ordning. Tänk på stor bokstav först!`,
    visual: `<div class="pic-big sm">${item.e}</div>`,
    items: rng.shuffle(words.map((w, i) => ({ id: `${i}`, label: i === words.length - 1 ? `${w}${end}` : w, say: w }))),
    answerOrder: words.map((_, i) => `${i}`),
    joiner: ' ',
    hint: end === '?' ? 'En fråga börjar ofta med ett frågeord och slutar med frågetecken.' : 'En mening börjar med stor bokstav och slutar med punkt.',
    explain: item.s,
  };
}

/* ---------- Ord: motsatser och synonymer ---------- */
export function genWords(level, rng) {
  const opp = level <= 2 || rng.chance(0.55);
  const all = opp ? OPPOSITES : SYNONYMS;
  const pool = all.filter((x) => x.lvl <= level);
  const hardPool = pool.filter((x) => x.lvl >= level - 1);
  const pair = rng.shuffle(rng.pick(hardPool.length >= 4 && rng.chance(0.6) ? hardPool : pool).p);
  const others = rng.sample(all.filter((x) => !x.p.includes(pair[0])).flatMap((x) => x.p).filter((w) => w !== pair[1]), 2);
  return {
    type: 'choice',
    prompt: opp ? `Vad är motsatsen till "${pair[0]}"?` : `Vilket ord betyder ungefär samma sak som "${pair[0]}"?`,
    visual: `<div class="read-word">${pair[0]}</div>`,
    options: rng.shuffle([pair[1], ...others]).map((w) => ({ id: w, label: w })),
    answer: pair[1],
    hint: opp ? 'En motsats betyder det helt omvända.' : 'Synonymer är ord som betyder nästan samma sak.',
    explain: opp ? `${pair[0]} – ${pair[1]}. De är varandras motsatser.` : `${pair[0]} och ${pair[1]} betyder nästan samma sak. De är synonymer.`,
  };
}

/* ---------- En eller ett, bestämd form och plural ---------- */
export function wrongDefinite(n) {
  const enStyle = endsVowel(n.w) ? `${n.w}n` : `${n.w}en`;
  const ettStyle = endsVowel(n.w) ? `${n.w}t` : `${n.w}et`;
  const cands = [n.g === 'en' ? ettStyle : enStyle, n.pl, n.w];
  return [...new Set(cands)].filter((x) => x !== n.def && !ALT_FORMS.has(x));
}
export function wrongPlurals(n) {
  const stem = /[ae]$/.test(n.w) ? n.w.slice(0, -1) : n.w;
  const cands = [`${stem}ar`, `${stem}er`, `${stem}or`, n.w, endsVowel(n.w) ? `${n.w}n` : `${n.w}en`];
  return [...new Set(cands)].filter((x) => x !== n.pl && x !== n.def && x !== n.pld && !ALT_FORMS.has(x));
}
export function genGrammar(level, rng) {
  const modes = level <= 1 ? ['gender'] : level === 2 ? ['gender', 'def', 'def'] : level === 3 ? ['def', 'plural', 'plural'] : ['plural', 'pld', 'irr'];
  const mode = rng.pick(modes);
  const pic = (n) => `<div class="pic-big">${n.e}</div>`;
  if (mode === 'gender') {
    const n = rng.pick(NOUNS);
    return {
      type: 'choice',
      prompt: level <= 1 ? 'Heter det en eller ett?' : `Heter det en ${n.w} eller ett ${n.w}?`,
      say: `Säger man en ${n.w} eller ett ${n.w}?`,
      visual: pic(n),
      options: ['en', 'ett'].map((g) => ({ id: g, label: `${g} ${n.w}`, say: `${g} ${n.w}` })),
      answer: n.g,
      hint: 'Säg båda högt. Vilket låter rätt?',
      explain: `Det heter ${n.g} ${n.w}. När vi pratar om ${n.g === 'en' ? 'den' : 'det'} säger vi ${n.def}.`,
    };
  }
  if (mode === 'def') {
    const n = rng.pick(NOUNS);
    const wrong = rng.sample(wrongDefinite(n), 2);
    return {
      type: 'choice',
      prompt: `Här är ${n.g} ${n.w}. Titta på …`,
      say: `Här är ${n.g} ${n.w}. Titta på … Vilket ord passar?`,
      visual: pic(n),
      options: rng.shuffle([n.def, ...wrong]).map(textOpt),
      answer: n.def,
      hint: n.g === 'en' ? `En-ord får ofta -en eller -n på slutet.` : `Ett-ord får ofta -et eller -t på slutet.`,
      explain: `${cap(n.g)} ${n.w} – ${n.def}. Det kallas bestämd form.`,
    };
  }
  const pool = mode === 'irr' ? NOUNS.filter((n) => n.irr) : NOUNS;
  const n = rng.pick(pool);
  if (mode === 'pld') {
    return {
      type: 'choice',
      prompt: `Här är två ${n.pl}. Titta på …`,
      say: `Här är två ${n.pl}. Titta på … Vilket ord passar?`,
      visual: `<div class="pic-big">${n.e}${n.e}</div>`,
      options: rng.shuffle([n.pld, n.def, n.pl]).map(textOpt),
      answer: n.pld,
      hint: 'Det är flera, och vi vet vilka vi menar.',
      explain: `${cap(n.g)} ${n.w}, ${n.def}, två ${n.pl}, alla ${n.pld}.`,
    };
  }
  const wrong = rng.sample(wrongPlurals(n), 2);
  return {
    type: 'choice',
    prompt: `${cap(n.g)} ${n.w}, två …`,
    say: `${n.g} ${n.w}, två … Vad heter det när det är flera?`,
    visual: `<div class="pic-big">${n.e}${n.e}</div>`,
    options: rng.shuffle([n.pl, ...wrong]).map(textOpt),
    answer: n.pl,
    hint: n.irr ? 'Det här ordet är lite busigt – vokalen kan ändras!' : 'Säg "två" framför och lyssna.',
    explain: `${cap(n.g)} ${n.w} – två ${n.pl}.${n.pl === n.w ? ' Ordet ser likadant ut i plural!' : ''}${n.irr ? ' Det är en oregelbunden plural.' : ''}`,
  };
}

/* ---------- Ordklasser: substantiv, verb, adjektiv ---------- */
export function genWordClass(level, rng) {
  const classes = level >= 4 ? ['subst', 'verb', 'adj'] : rng.chance(0.5) ? ['subst', 'verb'] : ['subst', 'adj'];
  const per = classes.length === 3 ? 2 : 3;
  const items = classes.flatMap((c) => rng.sample(WORD_CLASSES[c], per).map((w) => ({ id: w, bin: c, html: `<span class="wc-word">${w}</span>`, say: w })));
  return {
    type: 'sort',
    prompt: classes.length === 3 ? 'Sortera orden: substantiv, verb eller adjektiv?' : `Sortera orden: ${classes.map((c) => CLASS_INFO[c].label.toLowerCase()).join(' eller ')}?`,
    bins: classes.map((c) => ({ id: c, label: CLASS_INFO[c].label, html: CLASS_INFO[c].html })),
    items: rng.shuffle(items),
    hint: classes.map((c) => CLASS_INFO[c].tip).join(' '),
    explain: classes.map((c) => CLASS_INFO[c].tip).join(' '),
  };
}

/* ---------- Sammansatta ord ---------- */
export function genCompound(level, rng) {
  if (level >= 4 && rng.chance(0.55)) {
    const c = rng.pick(COMPOUND_FORMS);
    return {
      type: 'choice',
      prompt: `Sätt ihop ${c.a} + ${c.b}. Hur stavas det nya ordet?`,
      say: `Sätt ihop ${c.a} och ${c.b}. Hur stavas det nya ordet?`,
      visual: `<div class="compound"><span>${c.a}</span><b>+</b><span>${c.b}</span><b>=</b><span class="blank">?</span></div>`,
      options: rng.shuffle([c.w, ...c.wrong]).map(silentOpt),
      answer: c.w,
      noSpeakVisual: true,
      hint: 'Ibland ändras slutet på det första ordet när två ord sätts ihop.',
      explain: `${c.a} + ${c.b} = ${c.w}. I fogen ${c.why}.`,
    };
  }
  if (level >= 3 && rng.chance(0.5)) {
    const c = rng.pick(COMPOUNDS);
    const simple = rng.sample(SIMPLE_WORDS, 2);
    return {
      type: 'choice',
      prompt: 'Vilket ord är ett sammansatt ord?',
      say: 'Vilket ord är sammansatt av två ord?',
      options: rng.shuffle([c.w, ...simple]).map(textOpt),
      answer: c.w,
      hint: 'Ett sammansatt ord består av två ord som har satts ihop.',
      explain: `${c.w} = ${c.a} + ${c.b}.`,
    };
  }
  const c = rng.pick(COMPOUNDS);
  const other = rng.pick(COMPOUNDS.filter((x) => x.w !== c.w && x.a !== c.a && x.b !== c.b));
  const reversed = `${c.b}${c.a}`;
  return {
    type: 'choice',
    prompt: `${cap(c.a)} + ${c.b} = ?`,
    say: `Sätt ihop ${c.a} och ${c.b}. Vilket ord blir det?`,
    visual: `<div class="compound"><span>${c.ae}<small>${c.a}</small></span><b>+</b><span>${c.be}<small>${c.b}</small></span><b>=</b><span class="blank">?</span></div>`,
    options: rng.shuffle([c.w, reversed, other.w]).map(textOpt),
    answer: c.w,
    hint: 'Det första ordet kommer först i det nya ordet.',
    explain: `${c.a} + ${c.b} = ${c.w}. Två ord blir ett nytt ord!`,
  };
}

/* ---------- Stava rätt ---------- */
export function genSpelling(level, rng) {
  if (level >= 4 && rng.chance(0.65)) {
    const it = rng.pick(SPELL_COMMON);
    const sentence = it.s.replace('___', it.w);
    return {
      type: 'choice',
      prompt: 'Vilket ord är rätt stavat?',
      say: `Vilket ord är rätt stavat? ${sentence}`,
      visual: `<div class="read-word sm">${it.s.replace('___', '<span class="blank">?</span>')}</div>`,
      options: rng.shuffle([it.w, ...it.wrong]).map(silentOpt),
      answer: it.w,
      noSpeakVisual: true,
      hint: 'Titta noga på varje bokstav. Vilket ord har du sett i böcker?',
      explain: `Det stavas ${it.w}: ${sentence}`,
    };
  }
  if (level >= 3) {
    const it = rng.pick(SPELL_SOUNDS);
    return {
      type: 'choice',
      prompt: 'Hur stavas ordet?',
      say: `Hur stavas ${it.w}?`,
      visual: `<div class="pic-big">${it.e}</div>`,
      options: rng.shuffle([it.w, ...it.wrong]).map(silentOpt),
      answer: it.w,
      noSpeakVisual: true,
      hint: SOUND_RULE[it.kind],
      explain: `Det stavas ${it.w}. ${SOUND_RULE[it.kind]}`,
    };
  }
  const it = rng.pick(SPELL_DOUBLE);
  return {
    type: 'choice',
    prompt: 'Hur stavas ordet?',
    say: `Hur stavas ${it.w}?`,
    visual: `<div class="pic-big">${it.e}</div>`,
    options: rng.shuffle([it.w, it.wrong]).map(silentOpt),
    answer: it.w,
    noSpeakVisual: true,
    hint: 'Lyssna på vokalen. Är den kort eller lång?',
    explain: it.short
      ? `${it.w} – vokalen är kort, därför skriver vi dubbel konsonant${it.w.includes('ck') ? ' (ck är ett dubbelt k)' : ''}.`
      : `${it.w} – vokalen är lång, därför blir det bara en konsonant.`,
  };
}

/* ---------- Läs och förstå ---------- */
export function readTextsForLevel(level, rng) {
  return byLevel(READ_TEXTS, level, rng, { min: 1, max: 4, down: 0.25 });
}
export function genReadText(level, rng) {
  const t = rng.pick(readTextsForLevel(level, rng));
  const q = rng.pick(t.qs);
  return {
    type: 'choice',
    prompt: q.q,
    say: `Läs texten. ${q.q}`,
    visual: `<div class="read-text"><span class="rt-e">${t.e}</span><p>${t.text.join(' ')}</p></div>`,
    options: rng.shuffle(q.o).map(silentOpt),
    answer: q.a,
    noSpeakVisual: true,
    hint: 'Läs texten en gång till och leta efter svaret.',
    explain: `Svaret är: ${q.a}.`,
  };
}


// Originala mikrotexter: all information som behövs finns i själva situationen.
export const CONTEXT_WORDS = [
  [
    0,
    "Mio viskar. Rösten är mycket tyst.",
    "Hur låter Mio?",
    "tyst",
    "högt",
    "som en trumma"
  ],
  [
    0,
    "Koppen är tom. Det finns inget vatten i den.",
    "Vad betyder tom?",
    "utan vatten",
    "full med vatten",
    "trasig"
  ],
  [
    0,
    "Bollen är mjuk. Den går att trycka ihop.",
    "Vilken boll är mjuk?",
    "den som går att trycka ihop",
    "den som är hård som sten",
    "den som saknas"
  ],
  [
    1,
    "Lina skyndar sig. Hon går fort för att hinna till bussen.",
    "Vad betyder skyndar sig?",
    "gör något fort",
    "sover länge",
    "står still"
  ],
  [
    1,
    "Ali lånar en bok. Han ska lämna tillbaka den.",
    "Vad betyder lånar här?",
    "får använda en tid",
    "köper för alltid",
    "kastar bort"
  ],
  [
    1,
    "Sam delar päronet i två lika stora bitar.",
    "Vad betyder lika stora?",
    "samma storlek",
    "olika färg",
    "bara en bit"
  ],
  [
    2,
    "Fatima tvekar mellan två spel. Hon har ännu inte bestämt sig.",
    "Vad betyder tvekar?",
    "är osäker på valet",
    "har redan valt",
    "glömmer reglerna"
  ],
  [
    2,
    "Vägen är hal efter regnet. Skorna glider på den.",
    "Vad betyder hal?",
    "lätt att glida på",
    "full av trappor",
    "helt torr"
  ],
  [
    2,
    "Joel beskriver sin cykel: den är grön och har en korg.",
    "Vad gör han när han beskriver?",
    "berättar hur den är",
    "gömmer den",
    "byter bort den"
  ],
  [
    3,
    "Vera jämför två torn. Hon mäter höjden på båda.",
    "Vad betyder jämför här?",
    "undersöker likheter och skillnader",
    "bygger bara ett torn",
    "river båda utan att titta"
  ],
  [
    3,
    "Nils upptäcker ett mönster: röd, blå, röd, blå.",
    "Vad är ett mönster här?",
    "något som upprepas enligt en regel",
    "bara slumpmässiga färger",
    "en färg som saknas"
  ],
  [
    3,
    "När lampan slocknar föreslår Li att de först kontrollerar batteriet.",
    "Vad gör Li när hon föreslår?",
    "ger en idé om nästa steg",
    "säger att allt är klart",
    "lovar att lampan aldrig slocknar"
  ],
  [
    4,
    "Undersökningen omfattar bara klassens elever. Den säger inget om andra skolor.",
    "Vad betyder omfattar här?",
    "inkluderar",
    "utesluter",
    "avbryter"
  ],
  [
    4,
    "Författaren preciserar tiden: inte på kvällen utan klockan 18.",
    "Vad betyder preciserar?",
    "gör uppgiften mer exakt",
    "tar bort tidsuppgiften",
    "byter ämne"
  ],
  [
    4,
    "Resultatet är preliminärt. Gruppen ska kontrollera det igen innan den är färdig.",
    "Vad betyder preliminärt?",
    "ännu inte slutgiltigt",
    "omöjligt att kontrollera",
    "alltid fel"
  ]
];
export const TEXT_CLUES = [
  [
    0,
    "Det regnar. Isa tar ett paraply.",
    "Vad vill Isa hålla borta?",
    "regnet",
    "sin hund",
    "sin bok"
  ],
  [
    0,
    "Olle gäspar och lägger huvudet på kudden.",
    "Vad visar att Olle vill vila?",
    "han lägger huvudet på kudden",
    "han hoppar på ett ben",
    "han springer ut"
  ],
  [
    0,
    "Minas händer är kalla. Hon tar på vantar.",
    "Varför tar Mina vantar?",
    "för att värma händerna",
    "för att äta soppa",
    "för att rita på papper"
  ],
  [
    1,
    "Pelle ska måla. Han täcker bordet med gammalt papper.",
    "Varför täcker han bordet?",
    "för att skydda det från färg",
    "för att göra bordet högre",
    "för att färgen ska ta slut"
  ],
  [
    1,
    "Nora ser att växtens jord är torr. Hon hämtar vattenkannan.",
    "Vad tänker Nora göra?",
    "vattna växten",
    "måla krukan",
    "lägga jord i sängen"
  ],
  [
    1,
    "Kim letar efter sin mössa. På hyllan ligger bara en halsduk.",
    "Vad har Kim ännu inte hittat?",
    "mössan",
    "halsduken",
    "hyllan"
  ],
  [
    2,
    "Ella sätter en lapp på sin matlåda: ELLA. Det finns flera likadana lådor.",
    "Varför skriver hon sitt namn?",
    "för att känna igen sin låda",
    "för att maten ska bli varm",
    "för att alla ska få samma namn"
  ],
  [
    2,
    "Båda skorna är leriga efter promenaden. Theo ställer dem på en bricka vid dörren.",
    "Vilket skäl passar bäst?",
    "att samla leran vid dörren",
    "att skorna ska bli större",
    "att brickan ska flyga"
  ],
  [
    2,
    "Gruppen ska bygga ett torn. En håller plattan, en staplar och en hämtar klossar.",
    "Vad visar texten?",
    "de hjälps åt med olika uppgifter",
    "alla staplar samtidigt",
    "ingen använder klossar"
  ],
  [
    3,
    "På lappen står: Träning torsdag kl. 17. På onsdagen väntar ingen vid planen.",
    "Vad förklarar att ingen är där?",
    "träningen är först nästa dag",
    "träningen börjar på onsdag",
    "planen nämns inte"
  ],
  [
    3,
    "Maja testar två pappersflygplan från samma plats. Hon kastar varje modell tre gånger.",
    "Varför gör hon flera kast?",
    "för att jämföra fler resultat",
    "för att ändra startplatsen",
    "för att slippa mäta"
  ],
  [
    3,
    "Först står det att Leo glömt sin nyckel. Sedan knackar han på och väntar.",
    "Varför knackar Leo?",
    "han kan inte låsa upp med sin nyckel",
    "han har redan öppnat dörren",
    "han vill måla dörren"
  ],
  [
    4,
    "En annons säger att alla gillar spelet. Undersökningen frågade bara fem av tillverkarens anställda.",
    "Vilken invändning stöds av texten?",
    "fem anställda visar inte vad alla tycker",
    "ingen anställd har spelat",
    "spelet saknar regler"
  ],
  [
    4,
    "Bussen kom sent samma dag som det regnade. Texten anger ingen orsak till förseningen.",
    "Vad kan vi säkert säga?",
    "regn och försening inträffade samma dag",
    "regnet orsakade förseningen",
    "bussen är alltid sen"
  ],
  [
    4,
    "Sara säger att uppgiften är enkel. Amir har försökt flera gånger och ber om en ledtråd.",
    "Vilken slutsats stöds bäst?",
    "samma uppgift kan upplevas olika",
    "Amir vill aldrig lära sig",
    "Sara har alltid rätt"
  ]
];

function contextChoice(bank, level, rng, inference) {
  const pool = bank.filter((row) => row[0] === Math.max(0, Math.min(4, level)));
  const [, context, question, answer, ...wrong] = rng.pick(pool);
  return {
    type: 'choice', prompt: `${context} ${question}`, say: `${context} ${question}`,
    options: rng.shuffle([answer, ...wrong]).map((label) => ({ id: label, label, say: label })),
    answer, hint: inference ? 'Lyssna på texten igen. Vilken ledtråd hjälper dig?' : 'Lyssna på hela meningen. Den hjälper dig att förstå ordet.',
    explain: `Svaret är: ${answer}. Ledtråden finns i texten: ${context}`,
  };
}
export function genContextWords(level, rng) { return contextChoice(CONTEXT_WORDS, level, rng, false); }
export function genTextClues(level, rng) { return contextChoice(TEXT_CLUES, level, rng, true); }

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
    { id: 'enett', name: 'En eller ett?', icon: '☝️', minLevel: 1, gen: genGrammar, lgr: ['sv-normer', 'sv-ord'] },
    { id: 'build', name: 'Stava ord', icon: '🔡', minLevel: 0, gen: genSpellWord, lgr: ['sv-skriva', 'sv-ljud', 'sv-normer'] },
    { id: 'readpick', name: 'Läs & välj', icon: '👀', minLevel: 1, gen: genReadPick, lgr: ['sv-avkoda'] },
    { id: 'readtext', name: 'Läs och förstå', icon: '🔍', minLevel: 1, gen: genReadText, lgr: ['sv-avkoda', 'sv-forsta'] },
    { id: 'alphabet', name: 'ABC-ordning', icon: '🔠', minLevel: 1, gen: genAlphabet, lgr: ['sv-alfabet'] },
    { id: 'stories', name: 'Berättelser', icon: '📚', minLevel: 0, view: 'stories', lgr: ['sv-avkoda', 'sv-text', 'fsk-texter'] },
    { id: 'sentence', name: 'Meningar', icon: '✍️', minLevel: 2, gen: genSentence, lgr: ['sv-regler', 'sv-skriva'] },
    { id: 'words', name: 'Ordskatten', icon: '💎', minLevel: 2, gen: genWords, lgr: ['sv-ord', 'sv-nyanser'] },
    { id: 'compound', name: 'Sätt ihop ord', icon: '🔗', minLevel: 2, gen: genCompound, lgr: ['sv-ord', 'sv-avkoda'] },
    { id: 'spelling', name: 'Stava rätt', icon: '🐝', minLevel: 2, gen: genSpelling, lgr: ['sv-normer', 'sv-ljud'] },
    { id: 'wordclass', name: 'Ordklasser', icon: '🗂️', minLevel: 3, gen: genWordClass, lgr: ['sv-normer', 'sv-ord'] },
    { id: 'contextwords', name: 'Ord i vardagen', icon: '💬', minLevel: 0, gen: genContextWords, lgr: ['sv-ord', 'sv-text'] },
    { id: 'textclues', name: 'Textens ledtrådar', icon: '🔎', minLevel: 0, gen: genTextClues, lgr: ['sv-text'] },
  ],
};
