import { photo, hasPhoto } from '../ui/img.js';
import { photoFigure, photoImage } from '../ui/photos.js';
import { levelPick, rowChoice, sortTask, np } from './science.js';

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const pic = (e, cls = 'pic sm') => `<span class="${cls}">${e}</span>`;
/** Ja/nej- eller textfråga med fasta alternativ (första = rätt om inget annat anges). */
function textChoice(rng, item, extra = {}) {
  return {
    type: 'choice',
    prompt: item.q,
    options: rng.shuffle(item.o).map((o) => ({ id: o, label: o })),
    answer: item.a,
    hint: item.hint || extra.hint || 'Tänk efter – vad vet du om det här?',
    explain: item.ex,
    ...extra.more,
  };
}

// Biologi-appen: kroppen, sinnen, livscykler, näringskedjor, årstider, djurgrupper,
// svenska arter (samlarkort) och hälsa.

/* ---------- Kroppen ---------- */
// Positioner i SVG-kroppen (viewBox 0 0 300 520). r = träffradie.
export const BODY_PARTS = [
  { id: 'huvud', name: 'huvudet', x: 150, y: 46, r: 30, fn: 'I huvudet sitter hjärnan som tänker och styr hela kroppen.', minLevel: 0 },
  { id: 'oga', name: 'ögat', x: 130, y: 80, r: 14, fn: 'Med ögonen ser du – det är synsinnet.', minLevel: 0 },
  { id: 'ora', name: 'örat', x: 96, y: 86, r: 15, fn: 'Med öronen hör du – det är hörselsinnet.', minLevel: 0 },
  { id: 'nasa', name: 'näsan', x: 150, y: 98, r: 12, fn: 'Med näsan känner du dofter och andas in luft.', minLevel: 0 },
  { id: 'mun', name: 'munnen', x: 150, y: 118, r: 13, fn: 'I munnen tuggar tänderna maten och tungan känner smak.', minLevel: 0 },
  { id: 'hals', name: 'halsen', x: 150, y: 146, r: 13, fn: 'Genom halsen går luft till lungorna och mat till magen.', minLevel: 1 },
  { id: 'axel', name: 'axeln', x: 202, y: 168, r: 15, fn: 'Axeln är en led som gör att du kan snurra med armen.', minLevel: 1 },
  { id: 'arm', name: 'armen', x: 222, y: 208, r: 16, fn: 'Armarna kan lyfta, bära och kramas.', minLevel: 0 },
  { id: 'armbage', name: 'armbågen', x: 230, y: 250, r: 14, fn: 'Armbågen är en led så att armen kan böjas.', minLevel: 1 },
  { id: 'hand', name: 'handen', x: 238, y: 306, r: 20, fn: 'Med händerna känner du saker – det är känselsinnet. Du har fem fingrar på varje hand.', minLevel: 0 },
  { id: 'mage', name: 'magen', x: 150, y: 262, r: 26, fn: 'I magen finns magsäcken och tarmarna som tar hand om maten.', minLevel: 0 },
  { id: 'ben', name: 'benet', x: 128, y: 350, r: 18, fn: 'Benen bär hela kroppen när du går, springer och hoppar.', minLevel: 0 },
  { id: 'kna', name: 'knät', x: 128, y: 400, r: 15, fn: 'Knät är en led som gör att benet kan böjas.', minLevel: 0 },
  { id: 'fot', name: 'foten', x: 122, y: 486, r: 20, fn: 'Fötterna håller balansen när du står och går.', minLevel: 0 },
];
export const ORGANS = [
  { id: 'hjarna', name: 'hjärnan', x: 150, y: 50, r: 24, fn: 'Hjärnan tänker, minns och skickar signaler genom nerverna till hela kroppen.', minLevel: 2 },
  { id: 'lungor', name: 'lungorna', x: 124, y: 200, r: 22, fn: 'Lungorna tar in syre från luften när du andas. Du har två lungor.', minLevel: 2 },
  { id: 'hjarta', name: 'hjärtat', x: 166, y: 204, r: 15, fn: 'Hjärtat är en muskel som pumpar runt blodet i hela kroppen – hela livet!', minLevel: 2 },
  { id: 'magsack', name: 'magsäcken', x: 168, y: 248, r: 16, fn: 'Magsäcken blandar maten med magsaft och börjar bryta ner den.', minLevel: 2 },
  { id: 'tarmar', name: 'tarmarna', x: 150, y: 286, r: 20, fn: 'I tarmarna tar kroppen upp näringen från maten. Tunntarmen är flera meter lång!', minLevel: 3 },
  { id: 'skelett', name: 'skelettet', x: 172, y: 400, r: 16, fn: 'Skelettet är kroppens ram av ben. En vuxen har ungefär 206 ben.', minLevel: 3 },
];

export function bodySvg({ organs = false, highlight = null } = {}) {
  const skin = '#ffd3b0';
  const shirt = '#4aa8ff';
  const pants = '#3d4b7a';
  let s = `<svg class="body-svg" viewBox="0 0 300 520" role="img" aria-label="kropp">
  <g class="body-base">
    <rect x="132" y="128" width="36" height="32" rx="10" fill="${skin}"/>
    <path d="M96 168 Q150 140 204 168 L212 300 L88 300 Z" fill="${shirt}"/>
    <path d="M100 172 Q78 230 70 300" stroke="${shirt}" stroke-width="30" stroke-linecap="round" fill="none"/>
    <path d="M200 172 Q222 230 230 300" stroke="${shirt}" stroke-width="30" stroke-linecap="round" fill="none"/>
    <circle cx="66" cy="312" r="17" fill="${skin}"/><circle cx="234" cy="312" r="17" fill="${skin}"/>
    <path d="M92 296 L208 296 L200 340 L100 340 Z" fill="${pants}"/>
    <rect x="104" y="320" width="40" height="150" rx="16" fill="${pants}"/>
    <rect x="156" y="320" width="40" height="150" rx="16" fill="${pants}"/>
    <ellipse cx="120" cy="488" rx="30" ry="15" fill="#ff6b5b"/><ellipse cx="180" cy="488" rx="30" ry="15" fill="#ff6b5b"/>
    <circle cx="150" cy="80" r="56" fill="${skin}"/>
    <path d="M94 74 Q100 20 150 22 Q204 20 206 74 Q190 44 150 46 Q112 44 94 74 Z" fill="#7a4a2a"/>
    <ellipse cx="94" cy="86" rx="9" ry="14" fill="${skin}"/><ellipse cx="206" cy="86" rx="9" ry="14" fill="${skin}"/>
    <circle cx="130" cy="80" r="7" fill="#23324a"/><circle cx="170" cy="80" r="7" fill="#23324a"/>
    <circle cx="132" cy="78" r="2" fill="#fff"/><circle cx="172" cy="78" r="2" fill="#fff"/>
    <path d="M146 92 Q150 104 156 98" stroke="#c98a63" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M136 114 Q150 126 164 114" stroke="#c0392b" stroke-width="4" fill="none" stroke-linecap="round"/>
    <circle cx="118" cy="104" r="7" fill="#ff9b9b" opacity=".5"/><circle cx="182" cy="104" r="7" fill="#ff9b9b" opacity=".5"/>
  </g>`;
  if (organs) {
    s += `<g class="organs" opacity=".92">
      <path d="M118 46 Q120 26 150 26 Q182 26 184 48 Q186 66 150 70 Q114 68 118 46Z" fill="#f7a8c4" stroke="#c45d86" stroke-width="2"/>
      <path d="M128 38 q8 6 0 12 M146 32 q8 8 0 16 M164 36 q8 8 0 14" stroke="#c45d86" stroke-width="2" fill="none"/>
      <ellipse cx="128" cy="204" rx="20" ry="32" fill="#ff9fa8" stroke="#c4495a" stroke-width="2"/>
      <ellipse cx="174" cy="204" rx="18" ry="30" fill="#ff9fa8" stroke="#c4495a" stroke-width="2"/>
      <path d="M166 196 q-12 -14 -18 2 q0 12 18 24 q18 -12 18 -24 q-6 -16 -18 -2Z" fill="#e0283c"/>
      <path d="M152 236 q24 -8 30 10 q4 20 -22 22 q-14 0 -8 -14Z" fill="#f5b041" stroke="#b9770e" stroke-width="2"/>
      <path d="M126 270 q24 -8 48 0 q8 10 -6 14 q-18 4 -36 0 q-14 4 -12 12 q6 10 30 8 q20 -2 22 6" fill="none" stroke="#e59866" stroke-width="9" stroke-linecap="round"/>
      <g stroke="#f4f1e8" stroke-width="6" stroke-linecap="round"><line x1="176" y1="330" x2="176" y2="460"/><line x1="124" y1="330" x2="124" y2="460"/></g>
      <g fill="#f4f1e8"><circle cx="176" cy="400" r="7"/><circle cx="124" cy="400" r="7"/></g>
    </g>`;
  }
  const parts = organs ? ORGANS : BODY_PARTS;
  for (const p of parts) {
    s += `<circle class="hit${highlight === p.id ? ' hl' : ''}" data-hit="${p.id}" cx="${p.x}" cy="${p.y}" r="${Math.max(p.r, 18)}" fill="transparent"/>`;
  }
  s += '</svg>';
  return s;
}

// Organ och skelett: översiktlig funktion (Lgr22: "Några av människans organ, deras namn och översiktliga funktion").
export const ORGAN_QUIZ = [
  { lv: 2, q: 'Vilket organ pumpar runt blodet i kroppen?', a: 'hjärtat', o: ['hjärtat', 'lungorna', 'magsäcken'], ex: 'Hjärtat är en stark muskel som pumpar blodet runt i hela kroppen. Blodet bär med sig syre och näring.' },
  { lv: 2, q: 'Vilket organ tar in syre när du andas?', a: 'lungorna', o: ['lungorna', 'hjärtat', 'tarmarna'], ex: 'När du andas in fylls lungorna med luft. Syret går över till blodet.' },
  { lv: 2, q: 'Vilket organ tänker, minns och styr kroppen?', a: 'hjärnan', o: ['hjärnan', 'magsäcken', 'lungorna'], ex: 'Hjärnan skickar signaler genom nerverna till hela kroppen – också när du sover.' },
  { lv: 2, q: 'Var blandas maten med magsaft?', a: 'i magsäcken', o: ['i magsäcken', 'i lungorna', 'i hjärtat'], ex: 'I magsäcken blandas maten med magsaft och börjar brytas ner.' },
  { lv: 3, q: 'Var tar kroppen upp näringen från maten?', a: 'i tarmarna', o: ['i tarmarna', 'i hjärnan', 'i lungorna'], ex: 'Tunntarmen tar upp näringen och skickar den vidare med blodet. Tunntarmen är flera meter lång!' },
  { lv: 3, q: 'Vad skyddar hjärnan?', a: 'skallen', o: ['skallen', 'revbenen', 'knäskålen'], ex: 'Skallen är som en hård hjälm av ben runt hjärnan.' },
  { lv: 3, q: 'Vad skyddar hjärtat och lungorna?', a: 'revbenen', o: ['revbenen', 'skallen', 'tårna'], ex: 'Revbenen bildar en bur – bröstkorgen – runt hjärtat och lungorna.' },
  { lv: 3, q: 'Vad händer med hjärtat när du springer?', a: 'det slår snabbare', o: ['det slår snabbare', 'det stannar', 'det slår långsammare'], ex: 'Musklerna behöver mer syre när du springer, så hjärtat pumpar snabbare. Känn efter på pulsen!' },
  { lv: 3, q: 'Hur kan du känna att hjärtat slår?', a: 'känna pulsen på handleden', o: ['känna pulsen på handleden', 'titta i spegeln', 'lyssna på magen'], ex: 'Lägg två fingrar på insidan av handleden eller på halsen – där känner du pulsen, hjärtats slag.' },
  { lv: 4, q: 'Ungefär hur många ben har en vuxen människa?', a: 'ungefär 206', o: ['ungefär 206', 'ungefär 26', 'ungefär 2 000'], ex: 'En vuxen har ungefär 206 ben. En bebis har fler, men en del växer ihop när man växer.' },
  { lv: 4, q: 'Vilket är kroppens största organ?', a: 'huden', o: ['huden', 'hjärtat', 'hjärnan'], ex: 'Huden täcker hela kroppen. Den skyddar mot bakterier, känner värme och beröring och hjälper oss att hålla rätt temperatur.' },
  { lv: 4, q: 'Hur kan musklerna röra på kroppen?', a: 'de drar i skelettets ben', o: ['de drar i skelettets ben', 'de blåser upp sig med luft', 'de blir varma'], ex: 'Musklerna sitter fast i skelettet. När en muskel drar ihop sig drar den i benet så att du rör dig.' },
  { lv: 3, q: 'Hur många mjölktänder har ett barn?', a: '20', o: ['20', '10', '32'], ex: 'Barn har 20 mjölktänder. De byts ut mot permanenta tänder – en vuxen har upp till 32 tänder.' },
  { lv: 4, q: 'Vad gör blodet i kroppen?', a: 'transporterar syre och näring', o: ['transporterar syre och näring', 'tänker åt hjärnan', 'gör skelettet hårt'], ex: 'Hjärtat pumpar blodet runt i kroppen. Blodet hämtar syre i lungorna och näring från tarmarna och lämnar dem överallt i kroppen.' },
  { lv: 4, q: 'Var sitter kroppens minsta ben?', a: 'i örat', o: ['i örat', 'i lilltån', 'i näsan'], ex: 'Stigbygeln inne i örat är kroppens minsta ben – mindre än ett riskorn! Den hjälper dig att höra.' },
];

export function genBodyTap(level, rng) {
  if (level >= 2 && rng.chance(0.35)) {
    return textChoice(rng, rng.pick(ORGAN_QUIZ.filter((x) => x.lv <= level)), { hint: 'Tänk på vad organet gör i kroppen.' });
  }
  const useOrgans = level >= 2 && rng.chance(0.5);
  const pool = (useOrgans ? ORGANS : BODY_PARTS).filter((p) => p.minLevel <= level);
  const target = rng.pick(pool);
  return {
    type: 'tap',
    prompt: `Tryck på ${target.name}!`,
    visual: bodySvg({ organs: useOrgans }),
    answer: target.id,
    hint: target.fn,
    explain: target.fn,
  };
}

/* ---------- Sinnen ---------- */
export const SENSES = [
  { id: 'syn', name: 'synen', e: '👀' },
  { id: 'horsel', name: 'hörseln', e: '👂' },
  { id: 'lukt', name: 'luktsinnet', e: '👃' },
  { id: 'smak', name: 'smaksinnet', e: '👅' },
  { id: 'kansel', name: 'känseln', e: '✋' },
];
export const SENSE_QUESTIONS = [
  ['Du luktar på en blomma 🌹', 'lukt'], ['Du lyssnar på musik 🎵', 'horsel'], ['Du tittar på stjärnorna ✨', 'syn'],
  ['Du smakar på en citron 🍋', 'smak'], ['Du klappar en mjuk katt 🐈', 'kansel'], ['Du hör en fågel sjunga 🐦', 'horsel'],
  ['Du känner att vattnet är kallt 💧', 'kansel'], ['Du ser att trafikljuset är rött 🚦', 'syn'], ['Du känner att det luktar nybakat 🥐', 'lukt'],
  ['Du märker att glassen är söt 🍦', 'smak'], ['Du hör åskan mullra ⛈️', 'horsel'], ['Du känner att stenen är hård 🪨', 'kansel'],
  ['Du hör en bil tuta 🚗', 'horsel'], ['Du känner att teet är för varmt ☕', 'kansel'], ['Du ser en regnbåge 🌈', 'syn'],
  ['Du smakar saltet på popcornen 🍿', 'smak'], ['Det luktar rök från en brasa 🔥', 'lukt'], ['Du känner att kaktusen sticks 🌵', 'kansel'],
  ['Du luktar på en sur strumpa 🧦', 'lukt'], ['Du hör att det knackar på dörren 🚪', 'horsel'], ['Du ser blixten på himlen ⚡', 'syn'],
  ['Du smakar att citronen är sur 🍋', 'smak'], ['Du känner att snön är kall ❄️', 'kansel'], ['Du ser att löven är gula 🍂', 'syn'],
];
export const SENSE_FACTS = [
  { lv: 3, q: 'Varför smakar maten mindre när du är förkyld?', a: 'näsan är täppt – och lukten hjälper smaken', o: ['näsan är täppt – och lukten hjälper smaken', 'tungan har somnat', 'maten blir kall'], ex: 'Mycket av det vi tror är smak är egentligen lukt. Håll för näsan när du äter ett äpple – smakar det lika mycket?' },
  { lv: 3, q: 'Vilka smaker kan tungan känna?', a: 'sött, surt, salt, beskt och umami', o: ['sött, surt, salt, beskt och umami', 'bara sött', 'rött, grönt och blått'], ex: 'Tungan har tusentals smaklökar. Umami är en mustig smak som finns i till exempel buljong och ost.' },
  { lv: 3, q: 'Varför ska man aldrig titta rakt mot solen?', a: 'ljuset är så starkt att det kan skada ögonen', o: ['ljuset är så starkt att det kan skada ögonen', 'solen blir arg', 'man blir trött'], ex: 'Solljuset är så starkt att det kan skada ögat för alltid – även med solglasögon.' },
  { lv: 3, q: 'Varför är det bra att ha två öron?', a: 'man hör varifrån ljudet kommer', o: ['man hör varifrån ljudet kommer', 'det ser fint ut', 'man hör dubbelt så många ord'], ex: 'Ljudet kommer fram till örat som är närmast lite tidigare och lite starkare. Hjärnan räknar ut riktningen!' },
  { lv: 4, q: 'Vad gör pupillen, det svarta hålet i ögat, när det blir mörkt?', a: 'den blir större', o: ['den blir större', 'den blir mindre', 'den blir röd'], ex: 'I mörker blir pupillen större så att mer ljus kommer in. Titta på någons ögon när ni släcker lampan!' },
  { lv: 4, q: 'Vilket sinne varnar dig om något är varmt eller kallt?', a: 'känseln i huden', o: ['känseln i huden', 'hörseln', 'luktsinnet'], ex: 'Huden har små känselkroppar som känner värme, kyla, tryck och smärta.' },
];
export function genSenses(level, rng) {
  if (level >= 3 && rng.chance(0.35)) return textChoice(rng, rng.pick(SENSE_FACTS.filter((x) => x.lv <= level)), { hint: 'Vilken del av kroppen hjälper till?' });
  const [q, ans] = rng.pick(SENSE_QUESTIONS);
  const opts = level === 0 ? rng.sample(SENSES.filter((s) => s.id !== ans), 2).concat(SENSES.find((s) => s.id === ans)) : SENSES;
  return {
    type: 'choice',
    prompt: `${q}. Vilket sinne använder du?`,
    say: `${q.replace(/\s*\S+$/u, '')}. Vilket sinne använder du?`,
    options: rng.shuffle(opts).map((s) => ({ id: s.id, html: `<span class="pic sm">${s.e}</span><span>${s.name}</span>`, say: s.name })),
    answer: ans,
    hint: 'Vilken del av kroppen använder du?',
    explain: `Du använder ${SENSES.find((s) => s.id === ans).name}.`,
  };
}

/* ---------- Livscykler ---------- */
const svgIcon = (body) => `<svg viewBox="0 0 60 60" class="mini">${body}</svg>`;
const eggs = (fill, stroke, dot) => '<g fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.5">' + [[20, 22], [32, 18], [42, 26], [26, 34], [38, 38], [18, 42], [30, 46]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7"/>${dot ? `<circle cx="${x}" cy="${y}" r="2.5" fill="${dot}"/>` : ''}`).join('') + '</g>';
const ICONS = {
  rom: svgIcon(eggs('#cfe9ff', '#5a8fb8', '#23324a')),
  laxrom: svgIcon(eggs('#ff9f6b', '#c4562a', '#7a2a10')),
  yngel: svgIcon('<ellipse cx="24" cy="30" rx="12" ry="9" fill="#3d4b2a"/><path d="M34 30 Q46 22 52 30 Q46 38 34 30" fill="#6b7a4a"/><circle cx="20" cy="28" r="2" fill="#fff"/>'),
  yngelben: svgIcon('<ellipse cx="26" cy="28" rx="13" ry="10" fill="#4b6b2a"/><path d="M38 28 Q48 22 54 28 Q48 34 38 28" fill="#6b8a4a"/><path d="M22 36 l-6 10 M30 37 l4 10" stroke="#4b6b2a" stroke-width="4" stroke-linecap="round"/><circle cx="21" cy="25" r="2" fill="#fff"/>'),
  grodunge: svgIcon('<ellipse cx="26" cy="32" rx="12" ry="9" fill="#5c9a3a"/><path d="M37 34 Q46 34 52 40" stroke="#5c9a3a" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M18 38 l-8 8 M30 40 l2 9 M16 28 l-8 -2 M34 26 l6 -6" stroke="#4b7a2a" stroke-width="3.5" stroke-linecap="round"/><circle cx="21" cy="26" r="3" fill="#fff"/><circle cx="21" cy="26" r="1.4" fill="#23324a"/>'),
  puppa: svgIcon('<line x1="30" y1="4" x2="30" y2="12" stroke="#6b4a2a" stroke-width="3"/><path d="M30 12 Q44 24 38 44 Q30 56 22 44 Q16 24 30 12Z" fill="#9bc46a" stroke="#5c7a3a" stroke-width="2"/><path d="M24 26 h12 M23 34 h14 M25 42 h10" stroke="#5c7a3a" stroke-width="1.5"/>'),
  frö: svgIcon('<ellipse cx="30" cy="34" rx="10" ry="14" fill="#a0703c" stroke="#6b4a2a" stroke-width="2"/><path d="M30 22 v24" stroke="#6b4a2a" stroke-width="1.5"/><rect x="6" y="48" width="48" height="8" rx="3" fill="#7a5532"/>'),
  karna: svgIcon('<path d="M30 14 Q42 30 36 44 Q30 52 24 44 Q18 30 30 14Z" fill="#5a3418" stroke="#3a2008" stroke-width="2"/><path d="M28 24 Q26 34 28 42" stroke="#8a5a30" stroke-width="2" fill="none"/>'),
  aggblad: svgIcon('<path d="M8 40 Q30 6 54 22 Q40 52 8 40Z" fill="#5cb85c"/><g fill="#fff6c8" stroke="#c8a800"><circle cx="28" cy="32" r="3"/><circle cx="36" cy="28" r="3"/><circle cx="32" cy="38" r="3"/></g>'),
  npLarv: svgIcon('<path d="M10 34 Q30 20 50 30" stroke="#2c2c3a" stroke-width="12" fill="none" stroke-linecap="round"/><g fill="#ff8c2a"><circle cx="20" cy="27" r="2.5"/><circle cx="30" cy="25" r="2.5"/><circle cx="40" cy="26" r="2.5"/></g><circle cx="50" cy="30" r="5" fill="#2c2c3a"/><path d="M16 38 l-2 6 M26 34 l-1 7 M36 34 l1 7" stroke="#2c2c3a" stroke-width="2"/>'),
  npPuppa: svgIcon('<path d="M8 50 Q30 40 52 50" stroke="#5cb85c" stroke-width="6" fill="none"/><ellipse cx="30" cy="34" rx="12" ry="10" fill="#f39c3a" stroke="#a85a10" stroke-width="2"/><g fill="#2c2c3a"><circle cx="25" cy="31" r="2"/><circle cx="34" cy="30" r="2"/><circle cx="30" cy="38" r="2"/></g>'),
  myggagg: svgIcon('<rect x="4" y="36" width="52" height="20" fill="#9ed0f0"/><g fill="#4a3a2a">' + [12, 18, 24, 30, 36, 42, 48].map((x) => `<ellipse cx="${x}" cy="34" rx="2.6" ry="5"/>`).join('') + '</g>'),
  mygglarv: svgIcon('<rect x="4" y="8" width="52" height="48" fill="#9ed0f0"/><path d="M30 10 v6" stroke="#4a3a2a" stroke-width="3"/><path d="M30 16 Q34 30 28 44" stroke="#4a3a2a" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="28" cy="46" r="4" fill="#4a3a2a"/>'),
  myggpuppa: svgIcon('<rect x="4" y="8" width="52" height="48" fill="#9ed0f0"/><path d="M24 14 Q40 14 38 28 Q36 40 28 44 Q30 34 22 30 Q16 20 24 14Z" fill="#4a3a2a"/><path d="M26 12 l-2 -4 M32 12 l2 -4" stroke="#4a3a2a" stroke-width="2"/>'),
  fallskarm: svgIcon('<g stroke="#9a9a9a" stroke-width="1.2">' + [-40, -20, 0, 20, 40].map((a) => `<line x1="30" y1="34" x2="${30 + Math.round(18 * Math.sin((a * Math.PI) / 180))}" y2="${34 - Math.round(18 * Math.cos((a * Math.PI) / 180))}"/>`).join('') + '</g><path d="M30 34 v10" stroke="#8a6a3a" stroke-width="2"/><ellipse cx="30" cy="48" rx="2.5" ry="5" fill="#8a6a3a"/>'),
  maskrosboll: svgIcon('<path d="M30 58 V32" stroke="#5c9a3a" stroke-width="3"/><circle cx="30" cy="22" r="18" fill="#f4f4f0" stroke="#c8c8c0" stroke-width="1.5"/><circle cx="30" cy="22" r="4" fill="#c8b890"/>'),
};
const P = (e) => `<span class="pic">${e}</span>`;
const st = (id, label, html, ph) => ({ id, label, html, ...(ph ? { ph } : {}) });
/** Bilden för ett livscykelsteg: foto om det finns, annars ikon/emoji. */
export function stageHtml(s) {
  return s.ph && hasPhoto(s.ph) ? `<span class="pic lc-photo">${photo(s.ph, { alt: s.label })}</span>` : s.html;
}
// stages: alltid fyra steg (grundformen). full: valfri längre ordning för nivå 4.
export const LIFECYCLES = [
  {
    id: 'groda', name: 'grodan', lv: 1,
    stages: [st('rom', 'romkorn', ICONS.rom, 'grodrom'), st('yngel', 'grodyngel', ICONS.yngel, 'grodyngel'), st('yngelben', 'grodyngel med ben', ICONS.yngelben), st('groda', 'groda', P('🐸'))],
    full: [st('rom', 'romkorn', ICONS.rom, 'grodrom'), st('yngel', 'grodyngel', ICONS.yngel, 'grodyngel'), st('yngelben', 'grodyngel med bakben', ICONS.yngelben), st('svans', 'liten groda med svans', ICONS.grodunge), st('groda', 'groda', P('🐸'))],
    fact: 'Grodan lägger rom i vattnet. Grodynglet andas med gälar, får bakben och framben, tappar svansen och blir en groda som kan hoppa upp på land.',
  },
  {
    id: 'fjaril', name: 'fjärilen', lv: 0,
    stages: [st('agg', 'ägg på ett blad', ICONS.aggblad, 'fjarilsagg'), st('larv', 'larv', P('🐛')), st('puppa', 'puppa', ICONS.puppa, 'puppa'), st('fjaril', 'fjäril', P('🦋'))],
    fact: 'Larven äter och växer, gör en puppa och inne i puppan förvandlas den till en fjäril. Det kallas fullständig förvandling.',
  },
  {
    id: 'blomma', name: 'solrosen', lv: 0,
    stages: [st('fro', 'frö', ICONS.frö, 'solrosfro'), st('grodd', 'grodd', P('🌱')), st('planta', 'planta', P('🌿')), st('blomma', 'blomma', P('🌻'))],
    fact: 'Fröet gror i jorden när det får vatten och värme. Blomman gör nya frön – och så börjar det om!',
  },
  {
    id: 'fagel', name: 'hönan', lv: 0,
    stages: [st('agg', 'ägg', P('🥚')), st('klacks', 'ägget kläcks', P('🐣')), st('unge', 'kyckling', P('🐥')), st('vuxen', 'höna', P('🐔'))],
    fact: 'Kycklingen växer inne i ägget i ungefär tre veckor. Sen pickar den hål på skalet, kläcks och växer upp till en höna eller tupp.',
  },
  {
    id: 'manniska', name: 'människan', lv: 0,
    stages: [st('bebis', 'bebis', P('👶')), st('barn', 'barn', P('🧒')), st('vuxen', 'vuxen', P('🧑')), st('aldre', 'äldre', P('🧓'))],
    full: [st('bebis', 'bebis', P('👶')), st('barn', 'litet barn', P('🧒')), st('skolbarn', 'skolbarn', P(np('🎒'))), st('vuxen', 'vuxen', P('🧑')), st('aldre', 'äldre', P('🧓'))],
    fact: 'Människor växer långsamt. Det tar ungefär 18 år att bli vuxen!',
  },
  {
    id: 'appeltrad', name: 'äppelträdet', lv: 1,
    stages: [st('karna', 'kärna', ICONS.karna), st('ungt', 'ungt träd', P(np('🌳'))), st('blom', 'blommor på våren', P(np('🌸')), 'appelblom'), st('apple', 'äpple', P('🍎'))],
    full: [st('karna', 'kärna', ICONS.karna), st('grodd', 'grodd', P('🌱')), st('ungt', 'ungt träd', P(np('🌳'))), st('blom', 'blommor på våren', P(np('🌸')), 'appelblom'), st('apple', 'äpple', P('🍎'))],
    fact: 'Äppelträdet blommar på våren. Bina pollinerar blommorna och sen växer äpplen. Inne i äpplet finns kärnor – nya frön!',
  },
  {
    id: 'nyckelpiga', name: 'nyckelpigan', lv: 2,
    stages: [st('agg', 'gula ägg på ett blad', ICONS.aggblad, 'nyckelpigeagg'), st('larv', 'larv', ICONS.npLarv, 'nyckelpigelarv'), st('puppa', 'puppa', ICONS.npPuppa, 'nyckelpigepuppa'), st('vuxen', 'nyckelpiga', P('🐞'))],
    fact: 'Nyckelpigan lägger gula ägg på blad. Larven äter massor av bladlöss, blir en puppa och kryper sen ut som en färdig nyckelpiga.',
  },
  {
    id: 'maskros', name: 'maskrosen', lv: 2,
    stages: [st('fro', 'frö med fallskärm', ICONS.fallskarm), st('grodd', 'grodd', P('🌱')), st('blad', 'gröna blad', P(np('🌿'))), st('blomma', 'gul blomma', P(np('🌼')), 'maskros')],
    full: [st('fro', 'frö med fallskärm', ICONS.fallskarm), st('grodd', 'grodd', P('🌱')), st('blad', 'gröna blad', P(np('🌿'))), st('blomma', 'gul blomma', P(np('🌼')), 'maskros'), st('boll', 'vit maskrosboll med frön', ICONS.maskrosboll, 'maskrosboll')],
    fact: 'Den gula maskrosen blir en vit, luftig boll av frön. Varje frö har en liten fallskärm som vinden bär iväg.',
  },
  {
    id: 'mygga', name: 'myggan', lv: 3,
    stages: [st('agg', 'ägg på vattnet', ICONS.myggagg), st('larv', 'larv i vattnet', ICONS.mygglarv), st('puppa', 'puppa i vattnet', ICONS.myggpuppa), st('vuxen', 'mygga', P(np('🦟')), 'mygga')],
    fact: 'Myggan lägger sina ägg på vatten. Larven och puppan lever i vattnet. Sen flyger den vuxna myggan iväg.',
  },
  {
    id: 'lax', name: 'laxen', lv: 3,
    stages: [st('rom', 'rom i älven', ICONS.laxrom, 'laxrom'), st('yngel', 'litet laxyngel', P(np('🐟'))), st('ung', 'ung lax på väg ut i havet', P(np('🐟'))), st('vuxen', 'stor lax som simmar tillbaka till älven', P(np('🐟')), 'lax')],
    fact: 'Laxen kläcks i en älv och växer upp i havet. Som vuxen simmar den tillbaka uppför älven där den föddes för att lägga rom.',
  },
];
export const LIFECYCLE_FACTS = [
  { lv: 2, q: 'Vad kommer efter larven när en fjäril växer?', o: ['puppa', 'ägg', 'grodyngel', 'frö'], ex: 'Ägg → larv → puppa → fjäril. Inne i puppan byggs larven om till en fjäril.' },
  { lv: 2, q: 'Var lever grodynglet?', o: ['i vatten', 'i ett träd', 'i en myrstack'], ex: 'Grodynglet lever i vatten och andas med gälar, precis som en fisk.' },
  { lv: 3, q: 'Vad behöver ett frö för att gro?', o: ['vatten och värme', 'godis och mörker', 'snö och is'], ex: 'Fröet har egen näring inuti. Med vatten och lagom värme börjar det gro.' },
  { lv: 3, q: 'Vilket djur har ett puppstadium?', o: ['nyckelpigan', 'grodan', 'hönan', 'människan'], ex: 'Fjärilar, nyckelpigor, myggor och bin förvandlas inne i en puppa. Det kallas fullständig förvandling.' },
  { lv: 4, q: 'Varför lägger grodor väldigt många romkorn?', o: ['många ägg och yngel blir mat åt andra djur', 'grodor kan inte räkna', 'romkornen smälter ihop till ett'], ex: 'En groda kan lägga över tusen romkorn. Bara några få blir vuxna grodor – resten äts av fiskar, fåglar och insekter.' },
  { lv: 4, q: 'Hur hittar laxen tillbaka till älven där den föddes?', o: ['med hjälp av luktsinnet', 'den följer båtar', 'den frågar andra fiskar'], ex: 'Forskare tror att laxen bland annat känner igen lukten av vattnet från sin hemälv.' },
  { lv: 4, q: 'Vad händer med grodynglets svans?', o: ['kroppen tar upp den när den blir groda', 'den ramlar av och blir ett nytt yngel', 'den blir till ett bakben'], ex: 'Svansen krymper och kroppen använder näringen i den. Till slut är grodan klar att hoppa upp på land.' },
];
export function genLifecycle(level, rng) {
  if (level >= 2 && rng.chance(level === 2 ? 0.2 : 0.3)) return rowChoice(rng, levelPick(rng, LIFECYCLE_FACTS, level), level, { hint: 'Tänk på vad som händer först och vad som kommer sen.' });
  const pool = LIFECYCLES.filter((l) => l.lv <= level);
  const lc = rng.pick(pool);
  const stages = level === 0 ? [lc.stages[0], lc.stages[1], lc.stages[3]] : level >= 4 && lc.full ? lc.full : lc.stages;
  return {
    type: 'order',
    prompt: `Hur växer ${lc.name}? Tryck i rätt ordning – från början till slut.`,
    items: rng.shuffle(stages).map((s) => ({ id: s.id, html: `${stageHtml(s)}<span class="lbl">${s.label}</span>`, say: s.label })),
    answerOrder: stages.map((s) => s.id),
    joiner: '→',
    hint: 'Vad kommer allra först? Ett ägg, ett frö, rom eller en bebis?',
    explain: lc.fact,
  };
}

/* ---------- Näringskedjor ---------- */
// e: emoji (np() = behåll emoji, fotot skulle visa fel art). Kedjor med lv > nivån visas inte.
const L = (id, e, n) => ({ id, e, n });
export const FOOD_CHAINS = [
  { lv: 1, chain: [L('gras', '🌿', 'gräs'), L('hare', '🐇', 'hare'), L('rav', '🦊', 'räv')] },
  { lv: 1, chain: [L('ekollon', '🌰', 'ekollon'), L('mus', '🐭', 'mus'), L('uggla', '🦉', 'uggla')] },
  { lv: 1, chain: [L('blabar', '🫐', 'blåbär'), L('bjorn', '🐻', 'björn')] },
  { lv: 1, chain: [L('blad', '🍃', 'blad'), L('snigel', '🐌', 'snigel'), L('igelkott', '🦔', 'igelkott')] },
  { lv: 1, chain: [L('alger', '🌊', 'alger'), L('fisk', '🐟', 'fisk'), L('sal', '🦭', 'säl')] },
  { lv: 2, chain: [L('blad', '🍃', 'blad'), L('larv', '🐛', 'larv'), L('fagel', np('🐦'), 'blåmes'), L('hok', np('🦅'), 'sparvhök')] },
  { lv: 2, chain: [L('blomma', '🌼', 'blomma'), L('fluga', '🪰', 'fluga'), L('groda', '🐸', 'groda'), L('snok', np('🐍'), 'snok')] },
  { lv: 2, chain: [L('kottar', '🌲', 'frön i grankottar'), L('ekorre', '🐿️', 'ekorre'), L('duvhok', np('🦅'), 'duvhök')] },
  { lv: 3, chain: [L('kvistar', np('🌿'), 'kvistar och blad'), L('alg', np('🦌'), 'älg'), L('varg', '🐺', 'varg')] },
  { lv: 3, chain: [L('vattenvaxter', np('🌿'), 'vattenväxter'), L('mort', np('🐟'), 'mört'), L('gadda', np('🐟'), 'gädda'), L('fiskgjuse', np('🦅'), 'fiskgjuse')] },
  { lv: 3, chain: [L('gras', '🌾', 'gräs'), L('grashoppa', np('🦗'), 'gräshoppa'), L('groda', '🐸', 'groda'), L('hager', np('🪶'), 'häger')] },
  { lv: 4, chain: [L('vaxtplankton', np('🟢'), 'växtplankton'), L('djurplankton', np('🦐'), 'djurplankton'), L('stromming', np('🐟'), 'strömming'), L('sal', '🦭', 'gråsäl')] },
  { lv: 4, chain: [L('bladlus-vaxt', np('🌹'), 'rosenbuske'), L('bladlus', np('🟩'), 'bladlöss'), L('nyckelpiga', '🐞', 'nyckelpiga'), L('fagel', np('🐦'), 'fågel')] },
];
export const FOOD_FACTS = [
  { lv: 2, q: 'Varifrån får växterna sin energi?', o: ['från solen', 'från räven', 'från stenarna', 'från månen'], ex: 'Växterna fångar solljus med sina gröna blad. Därför börjar nästan alla näringskedjor med en växt.' },
  { lv: 2, q: 'Vilket djur äter både växter och djur?', o: ['björnen', 'haren', 'kon', 'älgen'], ex: 'Björnen äter blåbär, myror, fisk och ibland större djur. Den är en allätare.' },
  { lv: 3, q: 'Vad händer med rävarna om nästan alla harar och möss försvinner?', o: ['rävarna får svårt att hitta mat', 'rävarna blir fler', 'ingenting alls'], ex: 'Alla i näringskedjan hänger ihop. Försvinner maten blir det svårt för den som äter den.' },
  { lv: 3, q: 'Vem är rovdjur?', o: ['räven', 'haren', 'rådjuret', 'kon'], ex: 'Ett rovdjur jagar och äter andra djur. Haren, rådjuret och kon äter växter.' },
  { lv: 4, q: 'Vad kallas de som bryter ner döda växter och djur till ny näring i jorden?', o: ['nedbrytare', 'rovdjur', 'producenter'], ex: 'Daggmaskar, svampar och bakterier är nedbrytare. De gör ny näring av löv och döda djur, så att nya växter kan växa.' },
  { lv: 4, q: 'I kedjan gräs → hare → räv: vem är producent?', o: ['gräset', 'haren', 'räven'], ex: 'Producenten tillverkar sin egen näring med hjälp av solljus. Det gör bara växter.' },
  { lv: 4, q: 'Varför finns det många fler harar än rävar i en skog?', o: ['varje räv behöver äta många harar', 'rävar tycker inte om skogen', 'harar lever i tusen år'], ex: 'Bara en liten del av energin går vidare i varje steg. Därför behövs många djur längre ner i kedjan.' },
];
const chainPic = (x) => photoImage(x.id, x.n, true) || x.e;
export function genFoodChain(level, rng) {
  if (level >= 2 && rng.chance(level === 2 ? 0.2 : 0.35)) return rowChoice(rng, levelPick(rng, FOOD_FACTS, level), level, { hint: 'Tänk på vem som äter vem – och var energin kommer ifrån.' });
  const pool = FOOD_CHAINS.filter((c) => c.lv <= Math.max(1, level) && (level <= 1 ? c.chain.length <= 3 : true)).map((c) => c.chain);
  const chain = rng.pick(pool);
  if (level <= 1 && rng.chance(0.5)) {
    const i = rng.int(1, chain.length - 1);
    const eater = chain[i];
    const food = chain[i - 1];
    // Fel svar som djuret verkligen inte äter: växtätare får rovdjur som alternativ, rovdjur får växter.
    const easy = FOOD_CHAINS.filter((c) => c.lv <= 1).map((c) => c.chain);
    const plants = easy.map((c) => c[0]).filter((x) => x.id !== 'blabar');
    const tops = easy.map((c) => c[c.length - 1]);
    const wrongPool = (i === 1 ? tops : plants).filter((x) => !chain.some((y) => y.id === x.id));
    const others = rng.sample(wrongPool, 2);
    return {
      type: 'choice',
      prompt: `Vad äter en ${eater.n}?`,
      visual: `<div class="pic-big">${chainPic(eater)}</div>`,
      options: rng.shuffle([food, ...others]).map((x) => ({ id: x.id, html: `<span class="pic sm">${chainPic(x)}</span><span>${x.n}</span>`, say: x.n })),
      answer: food.id,
      hint: 'Tänk på vad djuret behöver för att få energi.',
      explain: `En ${eater.n} äter ${food.n}.`,
    };
  }
  return {
    type: 'order',
    prompt: 'Bygg en näringskedja! Börja med växten som får energi från solen.',
    items: rng.shuffle(chain).map((x) => ({ id: x.id, html: `<span class="pic sm">${chainPic(x)}</span><span class="lbl">${x.n}</span>`, say: x.n })),
    answerOrder: chain.map((x) => x.id),
    joiner: '→',
    hint: 'Växterna kommer först. Sen den som äter växten, och sist den som äter djuret.',
    explain: chain.map((x) => x.n).join(' → ') + '. Energin från solen går vidare i kedjan.',
  };
}

/* ---------- Årstider ---------- */
export const SEASON_BINS = [
  { id: 'var', label: 'Vår', html: '🌷' },
  { id: 'sommar', label: 'Sommar', html: '☀️' },
  { id: 'host', label: 'Höst', html: '🍂' },
  { id: 'vinter', label: 'Vinter', html: '❄️' },
];
export const SEASON_ITEMS = [
  { id: 'snogubbe', e: '⛄', n: 'snögubbe', bin: 'vinter' },
  { id: 'skidor', e: '⛷️', n: 'åka skidor', bin: 'vinter' },
  { id: 'lucia', e: '🕯️', n: 'mörkt och levande ljus', bin: 'vinter' },
  { id: 'pulka', e: '🛷', n: 'åka pulka', bin: 'vinter' },
  { id: 'fagelmat', e: np('🐦'), n: 'mata småfåglarna', bin: 'vinter' },
  { id: 'bad', e: '🏊', n: 'bada i sjön', bin: 'sommar' },
  { id: 'jordgubbe', e: '🍓', n: 'jordgubbar', bin: 'sommar' },
  { id: 'midsommar', e: '💐', n: 'midsommar', bin: 'sommar' },
  { id: 'blabar', e: '🫐', n: 'plocka blåbär', bin: 'sommar' },
  { id: 'glass', e: '🍦', n: 'glass i solen', bin: 'sommar' },
  { id: 'lov', e: '🍁', n: 'löven blir röda', bin: 'host' },
  { id: 'svamp', e: np('🍄'), n: 'svampar i skogen', bin: 'host' },
  { id: 'applen', e: '🍎', n: 'plocka äpplen', bin: 'host' },
  { id: 'pumpa', e: '🎃', n: 'pumpor', bin: 'host' },
  { id: 'kratta', e: '🍂', n: 'kratta löv', bin: 'host' },
  { id: 'knopp', e: '🌱', n: 'knoppar spricker', bin: 'var' },
  { id: 'sippa', e: np('🌸'), n: 'vitsippor', bin: 'var' },
  { id: 'faglar', e: np('🐦'), n: 'flyttfåglar kommer tillbaka', bin: 'var' },
  { id: 'lamm', e: '🐑', n: 'lamm på bete', bin: 'var' },
  { id: 'tussilago', e: np('🌼'), n: 'tussilago', bin: 'var' },
];
export const SEASON_FACTS = [
  { lv: 1, q: 'Vad gör igelkotten på vintern?', o: ['sover i ett bo av löv', 'flyger söderut', 'bygger snögubbar'], ex: 'Igelkotten går i dvala – den sover nästan hela vintern i ett bo av löv.' },
  { lv: 1, q: 'Vad gör björnen på vintern?', o: ['sover i ett ide', 'fiskar i havet', 'flyttar till Afrika'], ex: 'Björnen sover vintersömn i ett ide. På våren vaknar den jättehungrig.' },
  { lv: 1, q: 'När är dagarna som längst i Sverige?', o: ['på sommaren', 'på vintern', 'på hösten'], ex: 'Runt midsommar är det ljust nästan hela dygnet – i norra Sverige går solen inte ens ner!' },
  { lv: 1, q: 'Vad gör ekorren på vintern?', o: ['är vaken och äter mat som den har gömt', 'sover hela vintern', 'flyttar till Afrika'], ex: 'Ekorren sover inte i ide. Den får tjock vinterpäls och letar upp kottar och nötter som den gömde på hösten.' },
  { lv: 2, q: 'Varför flyger svalorna söderut på hösten?', o: ['det finns inga flygande insekter att äta här på vintern', 'de vill bada', 'de är rädda för snö'], ex: 'Svalor äter insekter. På vintern finns inga flygande insekter i Sverige, så de flyttar till Afrika.' },
  { lv: 2, q: 'Varför fäller björken sina löv på hösten?', o: ['för att klara vintern', 'för att löven är trötta', 'för att det ska bli fint'], ex: 'Löven skulle frysa sönder. Trädet sparar på vatten och energi och får nya löv på våren.' },
  { lv: 2, q: 'Vad gör skogsharen för att gömma sig i snön?', o: ['den får vit päls', 'den gräver ner sig', 'den flyttar till stan'], ex: 'Skogsharen byter till vit vinterpäls så att den syns sämre i snön.' },
  { lv: 2, q: 'Vilka fåglar stannar i Sverige på vintern?', o: ['talgoxen och blåmesen', 'svalan och göken', 'storken och svalan'], ex: 'Talgoxar och blåmesar är stannfåglar. Svalor och gökar är flyttfåglar som flyger till Afrika.' },
  { lv: 3, q: 'Var är grodorna på vintern?', o: ['de vilar på botten av en damm eller gömda i marken', 'de hoppar runt i snön', 'de flyger till Spanien'], ex: 'Grodor är växelvarma. På vintern vilar de nästan helt stilla tills det blir varmt igen.' },
  { lv: 3, q: 'Varför tappar inte granen alla sina barr på hösten?', o: ['barren tål kyla', 'granen är för lat', 'barren sitter fast med lim'], ex: 'Barren är smala och har ett vaxlager, så de klarar kyla. Granen byter barr lite i taget och är grön hela året.' },
  { lv: 3, q: 'Vilken fågel kommer tillbaka till Sverige på våren och dansar på fälten?', o: ['tranan', 'talgoxen', 'skatan'], ex: 'Tranorna kommer i mars och april. Vid Hornborgasjön kan man se tusentals tranor dansa.' },
  { lv: 4, q: 'Varför är det kallare på vintern?', o: ['solen står lägre och dagarna är kortare', 'solen är längre bort från Sverige', 'snön gör luften kall'], ex: 'På vintern lutar vår del av jorden bort från solen. Solen står lågt, värmer mindre och syns kortare tid varje dag.' },
  { lv: 4, q: 'Vad händer med humlorna på hösten?', o: ['bara nya drottningar överlever och sover i marken', 'alla humlor flyger söderut', 'humlorna bygger ett varmt hus av snö'], ex: 'Arbetarna dör på hösten. De unga drottningarna övervintrar i marken och startar ett nytt bo på våren.' },
  { lv: 4, q: 'Varför har vissa fjärilar, som citronfjärilen, bråttom att flyga på våren?', o: ['de har övervintrat som vuxna och väcks av värmen', 'de har just kläckts ur ett ägg', 'de flyger hem från Afrika'], ex: 'Citronfjärilen övervintrar som vuxen fjäril. Därför är den ofta den första fjärilen man ser.' },
];
const SEASON_ORDER = ['var', 'sommar', 'host', 'vinter'];
const SEASON_DEF = { var: 'våren', sommar: 'sommaren', host: 'hösten', vinter: 'vintern' };
export function genSeasons(level, rng) {
  if (level >= 1 && rng.chance(0.2)) {
    const start = rng.int(0, 3);
    const order = [0, 1, 2, 3].map((k) => SEASON_BINS.find((b) => b.id === SEASON_ORDER[(start + k) % 4]));
    return {
      type: 'order',
      prompt: `Lägg årstiderna i rätt ordning. Börja med ${SEASON_DEF[order[0].id]}!`,
      items: rng.shuffle(order).map((b) => ({ id: b.id, html: `<span class="pic sm">${b.html}</span><span class="lbl">${b.label}</span>`, say: b.label })),
      answerOrder: order.map((b) => b.id),
      joiner: '→',
      hint: 'Efter vintern kommer våren, och efter våren sommaren.',
      explain: 'Vår, sommar, höst och vinter – och sen börjar året om igen.',
    };
  }
  if (level >= 1 && rng.chance(0.45)) return rowChoice(rng, levelPick(rng, SEASON_FACTS, level), level, { hint: 'Tänk på hur det är ute på vintern – kallt, mörkt och lite mat.' });
  const bins = level === 0 ? rng.sample(SEASON_BINS, 2) : SEASON_BINS;
  const items = rng.sample(SEASON_ITEMS.filter((i) => bins.some((b) => b.id === i.bin)), level === 0 ? 4 : level <= 2 ? 6 : 8);
  return {
    type: 'sort',
    prompt: 'Vilken årstid hör bilderna till? Dra eller tryck på en bild och sen på rätt årstid.',
    bins,
    items: items.map((i) => ({ id: i.id, html: `<span class="pic sm">${i.e}</span><span class="lbl">${i.n}</span>`, bin: i.bin, say: i.n })),
    hint: 'Är det kallt eller varmt? Ljust eller mörkt?',
    explain: 'Bra sorterat! Varje årstid har sina tecken i naturen.',
  };
}

/* ---------- Djurgrupper ---------- */
export const ANIMAL_GROUPS = [
  { id: 'daggdjur', label: 'Däggdjur', html: '🐄', fact: 'Däggdjur har päls eller hår och ungarna dricker mjölk.' },
  { id: 'faglar', label: 'Fåglar', html: '🪶', fact: 'Fåglar har fjädrar och näbb och lägger ägg.' },
  { id: 'fiskar', label: 'Fiskar', html: '🐟', fact: 'Fiskar lever i vatten och andas med gälar.' },
  { id: 'insekter', label: 'Insekter', html: '🐝', fact: 'Insekter har sex ben och kroppen är delad i tre delar.' },
  { id: 'groddjur', label: 'Groddjur', html: '🐸', fact: 'Groddjur börjar livet i vatten och kan sen leva på land.' },
  { id: 'kraldjur', label: 'Kräldjur', html: '🦎', fact: 'Kräldjur har torr, fjällig hud. De flesta lägger ägg, men huggormen föder levande ungar.' },
];
export const ANIMALS = [
  { id: 'ko', e: '🐄', n: 'ko', g: 'daggdjur' }, { id: 'hund', e: '🐕', n: 'hund', g: 'daggdjur' }, { id: 'val', e: '🐋', n: 'val', g: 'daggdjur', tricky: true },
  { id: 'fladdermus', e: '🦇', n: 'fladdermus', g: 'daggdjur', tricky: true }, { id: 'ekorre', e: '🐿️', n: 'ekorre', g: 'daggdjur' },
  { id: 'pingvin', e: '🐧', n: 'pingvin', g: 'faglar', tricky: true }, { id: 'uggla', e: '🦉', n: 'uggla', g: 'faglar' }, { id: 'anka', e: '🦆', n: 'anka', g: 'faglar' },
  { id: 'haj', e: '🦈', n: 'haj', g: 'fiskar' }, { id: 'fisk', e: '🐠', n: 'clownfisk', g: 'fiskar' }, { id: 'abborre', e: '🐟', n: 'abborre', g: 'fiskar' },
  { id: 'bi', e: '🐝', n: 'bi', g: 'insekter' }, { id: 'nyckelpiga', e: '🐞', n: 'nyckelpiga', g: 'insekter' }, { id: 'myra', e: '🐜', n: 'myra', g: 'insekter' }, { id: 'fjaril', e: '🦋', n: 'fjäril', g: 'insekter' },
  { id: 'groda', e: '🐸', n: 'groda', g: 'groddjur' }, { id: 'salamander', e: np('🦎'), n: 'salamander', g: 'groddjur', tricky: true },
  { id: 'orm', e: '🐍', n: 'orm', g: 'kraldjur' }, { id: 'skoldpadda', e: '🐢', n: 'sköldpadda', g: 'kraldjur' }, { id: 'krokodil', e: '🐊', n: 'krokodil', g: 'kraldjur' },
];
export function genAnimalGroups(level, rng) {
  const groupIds = level <= 1 ? ['daggdjur', 'faglar', 'fiskar', 'insekter'] : ANIMAL_GROUPS.map((g) => g.id);
  if (level >= 2 && rng.chance(0.4)) {
    const a = rng.pick(ANIMALS.filter((x) => x.tricky));
    const g = ANIMAL_GROUPS.find((x) => x.id === a.g);
    return {
      type: 'choice', prompt: `Klurig! Vilken djurgrupp hör en ${a.n} till? ${a.e}`,
      say: `Vilken djurgrupp hör en ${a.n} till?`,
      options: rng.shuffle(rng.sample(ANIMAL_GROUPS.filter((x) => x.id !== a.g), 2).concat(g)).map((x) => ({ id: x.id, html: `<span class="pic sm">${x.html}</span><span>${x.label}</span>`, say: x.label })),
      answer: a.g, hint: 'Tänk på hur ungarna föds och hur djuret andas.', explain: g.fact,
    };
  }
  const bins = rng.sample(ANIMAL_GROUPS.filter((g) => groupIds.includes(g.id)), level === 0 ? 2 : 3);
  const items = rng.sample(ANIMALS.filter((a) => bins.some((b) => b.id === a.g) && (level >= 2 || !a.tricky)), level === 0 ? 4 : 6);
  return {
    type: 'sort',
    prompt: 'Sortera djuren i rätt grupp!',
    bins: bins.map((b) => ({ id: b.id, label: b.label, html: b.html })),
    items: items.map((a) => ({ id: a.id, html: `<span class="pic sm">${photoImage(a.id, a.n, true) || a.e}</span><span class="lbl">${a.n}</span>`, bin: a.g, say: a.n })),
    hint: bins.map((b) => b.fact).join(' '),
    explain: bins.map((b) => b.fact).join(' '),
  };
}

/* ---------- Svenska arter (samlarkort) ---------- */
// riddle: gåta utan artens namn (används i gåtfrågor). Arter utan eget foto används bara i gåtor och sortering,
// så att barnet aldrig ser ett foto av fel art.
export const SPECIES = [
  { id: 'ekorre', n: 'ekorre', e: '🐿️', g: 'Däggdjur', fact: 'Ekorren gömmer nötter och kottar till vintern. Den kan hoppa flera meter mellan träden.', riddle: 'Jag har en lång, yvig svans och gömmer nötter och kottar till vintern. Vem är jag?' },
  { id: 'igelkott', n: 'igelkott', e: '🦔', g: 'Däggdjur', fact: 'Igelkotten har tusentals taggar och går i dvala på vintern.', riddle: 'Jag har tusentals taggar och rullar ihop mig till en boll när jag blir rädd. Vem är jag?' },
  { id: 'rav', n: 'räv', e: '🦊', g: 'Däggdjur', fact: 'Räven har jättebra hörsel – den kan höra en mus under snön.', riddle: 'Jag är rödbrun med vit spets på svansen och kan höra en mus under snön. Vem är jag?' },
  { id: 'hare', n: 'skogshare', e: '🐇', g: 'Däggdjur', fact: 'Skogsharen blir vit på vintern så att den syns sämre i snön.' },
  { id: 'gravling', n: 'grävling', e: '🦡', g: 'Däggdjur', fact: 'Grävlingen bor i ett gryt under jorden och är vaken på natten.', riddle: 'Jag har svartvita ränder i ansiktet och bor i ett gryt under jorden. Vem är jag?' },
  { id: 'bjorn', n: 'brunbjörn', e: '🐻', g: 'Däggdjur', fact: 'Björnen sover vintersömn i ett ide. Ungarna föds mitt i vintern.' },
  { id: 'varg', n: 'varg', e: '🐺', g: 'Däggdjur', fact: 'Vargar lever i flockar och kan höras yla på långt håll.' },
  { id: 'radjur', n: 'rådjur', e: '🦌', g: 'Däggdjur', fact: 'Rådjurskiden har vita prickar som gör att de syns sämre i skogen.' },
  { id: 'sal', n: 'säl', e: '🦭', g: 'Däggdjur', fact: 'Sälen är ett däggdjur som lever i havet. Den kan hålla andan länge när den dyker.' },
  { id: 'uggla', n: 'kattuggla', e: '🦉', g: 'Fåglar', fact: 'Kattugglan jagar på natten och kan vrida huvudet tre fjärdedels varv.' },
  { id: 'svan', n: 'knölsvan', e: '🦢', g: 'Fåglar', fact: 'Svanen är en av Sveriges största fåglar och har en knöl på näbben.' },
  { id: 'grasand', n: 'gräsand', e: '🦆', g: 'Fåglar', fact: 'Gräsandshanen har grönt glänsande huvud. Honan är brunspräcklig.' },
  { id: 'orn', n: 'havsörn', e: '🦅', g: 'Fåglar', fact: 'Havsörnen är Sveriges största rovfågel. Vingarna är över två meter breda!' },
  { id: 'nyckelpiga', n: 'nyckelpiga', e: '🐞', g: 'Insekter', fact: 'Nyckelpigan äter bladlöss och hjälper därför trädgården.', riddle: 'Jag är röd med svarta prickar och äter bladlöss. Vem är jag?' },
  { id: 'humla', n: 'humla', e: '🐝', g: 'Insekter', fact: 'Humlor pollinerar blommor och kan flyga även när det är kallt.' },
  { id: 'citronfjaril', n: 'citronfjäril', e: '🦋', g: 'Insekter', fact: 'Citronfjärilen är ofta den första fjärilen man ser på våren.' },
  { id: 'myra', n: 'stackmyra', e: '🐜', g: 'Insekter', fact: 'Stackmyror bygger stora stackar av barr – där kan det bo hundratusentals myror.', riddle: 'Vi bygger en stor stack av barr och bor där tillsammans – hundratusentals syskon! Vilka är vi?' },
  { id: 'snigel', n: 'snäcka', e: '🐌', g: 'Blötdjur', fact: 'Snäckan bär sitt skal på ryggen och glider fram på slem. Sniglar har inget synligt skal.' },
  { id: 'daggmask', n: 'daggmask', e: '🪱', g: 'Maskar', fact: 'Daggmasken gör jorden bra för växter genom att gräva gångar och äta döda löv.', riddle: 'Jag har inga ben, gräver gångar i jorden och äter döda löv. Vem är jag?' },
  { id: 'spindel', n: 'korsspindel', e: '🕷️', g: 'Spindeldjur', fact: 'Spindlar är inga insekter – de har åtta ben! Korsspindeln spinner fina hjulnät.', riddle: 'Jag har åtta ben och spinner ett runt nät som ett hjul. Vem är jag?' },
  { id: 'blabar', n: 'blåbär', e: '🫐', g: 'Växter', fact: 'Blåbär växer i skogen och mognar i juli och augusti.' },
  { id: 'flugsvamp', n: 'röd flugsvamp', e: '🍄', g: 'Svampar', fact: 'Röd flugsvamp är vacker men GIFTIG. Plocka aldrig svamp utan en vuxen!', riddle: 'Jag är en svamp med röd hatt och vita prickar. Jag är vacker men giftig. Vem är jag?' },
  { id: 'gran', n: 'gran', e: '🌲', g: 'Växter', fact: 'Granen är ett barrträd som är grönt hela året. Kottarna hänger nedåt.' },
  { id: 'ek', n: 'ek', e: '🌳', g: 'Växter', fact: 'Eken kan bli över 1 000 år gammal. Dess frukter heter ekollon.', riddle: 'Jag är ett stort lövträd och mina frukter heter ekollon. Vem är jag?' },
  { id: 'maskros', n: 'maskros', e: '🌼', g: 'Växter', fact: 'Maskrosens frön har små fallskärmar och sprids med vinden.' },
  // Nya arter (våg 3). Foton efterfrågas i rapporten.
  { id: 'blames', n: 'blåmes', e: np('🐦'), g: 'Fåglar', fact: 'Blåmesen har blå mössa och gul mage. Den stannar i Sverige hela året och äter gärna talg på vintern.', riddle: 'Jag är en liten fågel med blå mössa och gul mage. Jag stannar i Sverige på vintern. Vem är jag?' },
  { id: 'talgoxe', n: 'talgoxe', e: np('🐦'), g: 'Fåglar', fact: 'Talgoxen har svart huvud, vita kinder och en svart rand på den gula magen. Den är vanlig vid fågelbordet.', riddle: 'Jag har svart huvud, vita kinder och en svart slips på min gula mage. Vem är jag?' },
  { id: 'koltrast', n: 'koltrast', e: np('🐦'), g: 'Fåglar', fact: 'Koltrasthanen är helt svart med gul näbb. Honan är brun. Koltrasten sjunger vackert på vårkvällarna.', riddle: 'Jag är en helt svart fågel med gul näbb och sjunger vackert på vårkvällarna. Vem är jag?' },
  { id: 'skata', n: 'skata', e: np('🐦'), g: 'Fåglar', fact: 'Skatan är svartvit med lång stjärt. Den är så klok att den känner igen sig själv i en spegel.', riddle: 'Jag är svartvit, har lång stjärt och känner igen mig själv i en spegel. Vem är jag?' },
  { id: 'rodhake', n: 'rödhake', e: np('🐦'), g: 'Fåglar', fact: 'Rödhaken har orangeröd haka och bröst. Den sjunger ofta i skymningen.', riddle: 'Jag är en liten fågel med orangeröd haka och sjunger ofta i skymningen. Vem är jag?' },
  { id: 'trana', n: 'trana', e: np('🪶'), g: 'Fåglar', fact: 'Tranan är en stor grå fågel med långa ben. På våren dansar tranorna på fälten, till exempel vid Hornborgasjön.', riddle: 'Jag är en stor grå fågel med långa ben. På våren dansar jag på fälten. Vem är jag?' },
  { id: 'gok', n: 'gök', e: np('🐦'), g: 'Fåglar', fact: 'Göken lägger sina ägg i andra fåglars bon. Den ropar ”ko-ko” på våren och flyger till Afrika på hösten.', riddle: 'Jag ropar ”ko-ko” på våren och lägger mina ägg i andra fåglars bon. Vem är jag?' },
  { id: 'alg', n: 'älg', e: np('🦌'), g: 'Däggdjur', fact: 'Älgen är Sveriges största landdjur. Bara hanen har horn, och han fäller dem varje vinter.', riddle: 'Jag är Sveriges största landdjur. Hanen har stora horn som han fäller varje vinter. Vem är jag?' },
  { id: 'ren', n: 'ren', e: np('🦌'), g: 'Däggdjur', fact: 'Renen lever i fjällen i norra Sverige. Både hanar och honor har horn – det är ovanligt bland hjortdjur.', riddle: 'Jag lever i fjällen, och hos mig har både hanar och honor horn. Vem är jag?' },
  { id: 'lodjur', n: 'lodjur', e: np('🐈'), g: 'Däggdjur', fact: 'Lodjuret är Sveriges enda vilda kattdjur. Det har svarta tofsar på öronen.', riddle: 'Jag är Sveriges enda vilda kattdjur och har svarta tofsar på öronen. Vem är jag?' },
  { id: 'mullvad', n: 'mullvad', e: np('🐁'), g: 'Däggdjur', fact: 'Mullvaden gräver gångar under jorden och äter daggmaskar. Den ser dåligt men känner och luktar mycket bra.', riddle: 'Jag gräver gångar under jorden med mina stora framtassar och äter daggmaskar. Vem är jag?' },
  { id: 'fladdermus', n: 'fladdermus', e: np('🦇'), g: 'Däggdjur', fact: 'Fladdermusen är det enda däggdjuret som kan flyga. Den hittar insekter i mörkret med hjälp av ekon.', riddle: 'Jag är ett däggdjur som kan flyga. I mörkret hittar jag insekter med hjälp av ekon. Vem är jag?' },
  { id: 'honungsbi', n: 'honungsbi', e: '🐝', g: 'Insekter', fact: 'Bina samlar nektar och gör honung. Ett bi kan dansa för att visa de andra var blommorna finns.', riddle: 'Jag samlar nektar från blommor och gör honung i en kupa. Vem är jag?' },
  { id: 'trollslanda', n: 'trollslända', e: np('🪰'), g: 'Insekter', fact: 'Trollsländan är en skicklig flygare som kan flyga baklänges. Larven lever i vatten.', riddle: 'Jag har fyra genomskinliga vingar och kan flyga baklänges. Som larv bodde jag i vattnet. Vem är jag?' },
  { id: 'pafageloga', n: 'påfågelöga', e: np('🦋'), g: 'Insekter', fact: 'Påfågelögat är en fjäril med fläckar som liknar stora ögon. De kan skrämma bort fåglar.', riddle: 'Jag är en fjäril med stora fläckar på vingarna som ser ut som ögon. Vem är jag?' },
  { id: 'groda', n: 'vanlig groda', e: '🐸', g: 'Groddjur', fact: 'Den vanliga grodan lägger rom i dammar på våren. Den hoppar långt med sina starka bakben.', riddle: 'Jag lägger rom i dammen på våren och hoppar långt med mina bakben. Vem är jag?' },
  { id: 'padda', n: 'padda', e: np('🐸'), g: 'Groddjur', fact: 'Paddan har torr, knottrig hud och kryper hellre än hoppar. Den äter sniglar och insekter.', riddle: 'Jag har torr, knottrig hud och kryper hellre än hoppar. Jag äter sniglar. Vem är jag?' },
  { id: 'huggorm', n: 'huggorm', e: np('🐍'), g: 'Kräldjur', fact: 'Huggormen har ett sicksackmönster på ryggen och är Sveriges enda giftorm. Den är skygg – gå runt den och låt den vara.', riddle: 'Jag har ett sicksackmönster på ryggen och är Sveriges enda giftorm. Låt mig vara ifred! Vem är jag?' },
  { id: 'snok', n: 'snok', e: np('🐍'), g: 'Kräldjur', fact: 'Snoken har två gula fläckar i nacken och är inte giftig. Den simmar bra och äter grodor.', riddle: 'Jag är en orm med gula fläckar i nacken. Jag är inte giftig och simmar bra. Vem är jag?' },
  { id: 'abborre', n: 'abborre', e: np('🐟'), g: 'Fiskar', fact: 'Abborren har mörka ränder på sidorna och röda fenor. Den är en av Sveriges vanligaste fiskar.', riddle: 'Jag är en fisk med mörka ränder och röda fenor. Jag är en av Sveriges vanligaste fiskar. Vem är jag?' },
  { id: 'gadda', n: 'gädda', e: np('🐟'), g: 'Fiskar', fact: 'Gäddan är en snabb rovfisk som står stilla bland vassen och väntar på byte.', riddle: 'Jag är en lång rovfisk som står stilla i vassen och väntar på byte. Vem är jag?' },
  { id: 'vitsippa', n: 'vitsippa', e: np('🌸'), g: 'Växter', fact: 'Vitsippan blommar i skogen på våren, innan träden har fått löv. Då når solljuset ända ner till marken.', riddle: 'Jag är en vit blomma som täcker skogsbacken på våren innan träden får löv. Vem är jag?' },
  { id: 'blasippa', n: 'blåsippa', e: np('🌸'), g: 'Växter', fact: 'Blåsippan är en av vårens första blommor. Den blommar ofta redan i mars eller april.', riddle: 'Jag är en blå blomma och en av de allra första på våren. Vem är jag?' },
  { id: 'lingon', n: 'lingon', e: np('🍒'), g: 'Växter', fact: 'Lingonen är röda och mognar i augusti och september. Lingonriset är grönt hela året.', riddle: 'Jag är ett rött bär som mognar på hösten. Mitt ris är grönt hela året. Vem är jag?' },
  { id: 'smultron', n: 'smultron', e: np('🍓'), g: 'Växter', fact: 'Smultronet är en liten vild jordgubbe som mognar på sommaren. Man kan trä dem på ett grässtrå.', riddle: 'Jag är ett litet rött bär som växer vilt. Man kan trä mig på ett grässtrå. Vem är jag?' },
  { id: 'bjork', n: 'björk', e: np('🌳'), g: 'Växter', fact: 'Björken har vit bark med svarta fläckar. På våren får den små ljusgröna blad som kallas musöron.', riddle: 'Jag är ett träd med vit bark och svarta fläckar. Mina första små blad kallas musöron. Vem är jag?' },
  { id: 'tall', n: 'tall', e: np('🌲'), g: 'Växter', fact: 'Tallen är ett barrträd med långa barr som sitter två och två. Den klarar torr och sandig mark.', riddle: 'Jag är ett barrträd. Mina långa barr sitter två och två. Vem är jag?' },
  { id: 'kantarell', n: 'kantarell', e: np('🍄'), g: 'Svampar', fact: 'Kantarellen är gul och en omtyckt matsvamp. Plocka bara svamp tillsammans med en vuxen som kan svamp.', riddle: 'Jag är en gul svamp som många tycker är god att äta. Vem är jag?' },
  { id: 'karljohan', n: 'karljohanssvamp', e: np('🍄'), g: 'Svampar', fact: 'Karljohanssvampen har en brun hatt och små rör under hatten i stället för skivor. Den är en god matsvamp.', riddle: 'Jag är en stor svamp med brun hatt och tjock fot. Under hatten har jag små rör. Vem är jag?' },
  { id: 'vitflugsvamp', n: 'vit flugsvamp', e: np('🍄'), g: 'Svampar', fact: 'Vit flugsvamp är en av Sveriges giftigaste svampar. Den kan likna ätliga svampar – plocka aldrig svamp utan en vuxen som kan svamp.', riddle: 'Jag är en helt vit svamp och en av Sveriges giftigaste. Vem är jag?' },
];
const speciesPic = (s) => photoImage(s.id, s.n, true) || np(s.e);
export function genSpecies(level, rng, ctx = {}) {
  // Prioritera arter som barnet inte har samlat än.
  const found = ctx.found || {};
  const riddles = SPECIES.filter((s) => s.riddle);
  if (level >= 1 && rng.chance(level === 1 ? 0.25 : 0.4)) {
    const unseenR = riddles.filter((s) => !found[s.id]);
    const t = unseenR.length && rng.chance(0.7) ? rng.pick(unseenR) : rng.pick(riddles);
    const same = SPECIES.filter((s) => s.id !== t.id && s.g === t.g);
    const other = SPECIES.filter((s) => s.id !== t.id && s.g !== t.g);
    const n = level <= 2 ? 2 : 3;
    const wrong = level >= 3 && same.length >= 2 ? rng.sample(same, n) : rng.sample([...rng.sample(same, 1), ...rng.sample(other, n)], n);
    return {
      type: 'choice',
      prompt: `Gåta: ${t.riddle}`,
      options: rng.shuffle([t, ...wrong]).map((s) => ({ id: s.id, label: s.n })),
      answer: t.id,
      hint: `Det är bland ${t.g.toLowerCase()}.`,
      explain: t.fact,
      collect: { set: 'species', item: t.id, label: `Nytt artkort: ${t.n}!` },
    };
  }
  const pool = SPECIES.filter((s) => hasPhoto(s.id));
  const usable = pool.length >= 4 ? pool : SPECIES;
  const unseen = usable.filter((s) => !found[s.id]);
  const target = unseen.length && rng.chance(0.7) ? rng.pick(unseen) : rng.pick(usable);
  const others = rng.sample(SPECIES.filter((s) => s.id !== target.id && s.n !== target.n), level === 0 ? 2 : 3);
  return {
    type: 'choice',
    prompt: 'Vad heter den här arten?',
    visual: photoFigure(target.id) || photo(target.id, { alt: 'Fotografi av en art', cls: 'qphoto', fallback: `<div class="pic-big">${np(target.e)}</div>` }),
    options: rng.shuffle([target, ...others]).map((s) => ({ id: s.id, label: s.n })),
    answer: target.id,
    hint: `Det är bland ${target.g.toLowerCase()}.`,
    explain: target.fact,
    collect: { set: 'species', item: target.id, label: `Nytt artkort: ${target.n}!` },
  };
}

/* ---------- Djur, växt eller svamp? (gruppera arter) ---------- */
const KINGDOM = (g) => (g === 'Växter' ? 'vaxter' : g === 'Svampar' ? 'svampar' : 'djur');
export const KINGDOM_BINS = [
  { id: 'djur', label: 'Djur', html: '🐾' },
  { id: 'vaxter', label: 'Växter', html: '🌱' },
  { id: 'svampar', label: 'Svampar', html: '🍄' },
];
export const CLASS_BINS = [
  { id: 'Däggdjur', label: 'Däggdjur', html: '🐾' },
  { id: 'Fåglar', label: 'Fåglar', html: '🪶' },
  { id: 'Insekter', label: 'Insekter', html: '🐝' },
  { id: 'Groddjur', label: 'Groddjur', html: '🐸' },
  { id: 'Kräldjur', label: 'Kräldjur', html: '🦎' },
  { id: 'Fiskar', label: 'Fiskar', html: '🐟' },
];
export const NATURE_FACTS = [
  { lv: 1, q: 'Hur många ben har en insekt?', o: ['sex', 'åtta', 'fyra'], ex: 'Alla insekter har sex ben och en kropp i tre delar: huvud, mellankropp och bakkropp.' },
  { lv: 2, q: 'Hur många ben har en spindel?', o: ['åtta', 'sex', 'tio'], ex: 'Spindlar har åtta ben. Därför är de inga insekter – de är spindeldjur.' },
  { lv: 2, q: 'Är en svamp en växt?', o: ['nej, svampar är en egen grupp', 'ja, alltid', 'nej, svampar är djur'], ex: 'Svampar har inga gröna blad och kan inte göra näring av solljus. De är en egen grupp – varken växter eller djur.' },
  { lv: 3, q: 'Vad har alla fåglar?', o: ['fjädrar', 'päls', 'fjäll', 'gälar'], ex: 'Alla fåglar har fjädrar och näbb och lägger ägg. Alla fåglar kan inte flyga, men alla har fjädrar.' },
  { lv: 3, q: 'Vilket djur är ett groddjur?', o: ['grodan', 'ödlan', 'ormen', 'abborren'], ex: 'Groddjur, som grodor, paddor och salamandrar, börjar livet i vatten.' },
  { lv: 4, q: 'Varför är fladdermusen ett däggdjur och inte en fågel?', o: ['den har päls och ungarna dricker mjölk', 'den kan flyga', 'den är vaken på natten'], ex: 'Däggdjur har päls eller hår och ungarna dricker mjölk från sin mamma. Fladdermusen har inga fjädrar.' },
  { lv: 4, q: 'Vilket av de här är ett kräldjur som finns i Sverige?', o: ['huggorm', 'groda', 'salamander', 'padda'], ex: 'Huggorm, snok och ödlor är kräldjur. Grodor, paddor och salamandrar är groddjur.' },
  { lv: 4, q: 'Var finns den största delen av en svamp?', o: ['under marken som tunna trådar', 'i luften', 'inne i trädens löv'], ex: 'Det vi plockar är bara svampens fruktkropp. Den största delen är ett nät av tunna trådar, mycel, i marken.' },
];
export function genNature(level, rng) {
  if (level >= 1 && rng.chance(level === 1 ? 0.2 : 0.3)) return rowChoice(rng, levelPick(rng, NATURE_FACTS, level), level, { hint: 'Tänk på hur kroppen ser ut: ben, fjädrar, päls eller fjäll?' });
  const item = (s, bin) => ({ id: s.id, e: speciesPic(s), n: s.n, bin });
  if (level <= 1) {
    const bins = level === 0 ? KINGDOM_BINS.slice(0, 2) : KINGDOM_BINS;
    return sortTask(rng, {
      bins,
      items: SPECIES.map((s) => item(s, KINGDOM(s.g))),
      nItems: level === 0 ? 4 : 6,
      prompt: 'Är det ett djur, en växt eller en svamp? Sortera!',
      hint: 'Djur kan röra sig själva. Växter har gröna blad. Svampar växer upp ur marken men har inga gröna blad.',
      explain: 'I naturen finns djur, växter och svampar. Svampar är en egen grupp – de är varken växter eller djur.',
    });
  }
  return sortTask(rng, {
    bins: CLASS_BINS,
    items: SPECIES.filter((s) => CLASS_BINS.some((b) => b.id === s.g)).map((s) => item(s, s.g)),
    nBins: level <= 2 ? 3 : 4,
    nItems: level <= 2 ? 6 : 8,
    prompt: 'Svenska djur! Sortera dem i rätt djurgrupp.',
    hint: 'Päls = däggdjur. Fjädrar = fåglar. Sex ben = insekter. Gälar = fiskar.',
    explain: 'Däggdjur har päls, fåglar har fjädrar, insekter har sex ben, fiskar andas med gälar. Groddjur börjar livet i vatten och kräldjur har torr, fjällig hud.',
  });
}

/* ---------- Djurungar ---------- */
// gen: genitiv, def: bestämd form, baby: ungens namn med obestämd artikel.
export const BABIES = [
  { id: 'ko', e: '🐄', gen: 'kons', def: 'kon', baby: 'kalv', bdef: 'kalven', art: 'en', lv: 0 },
  { id: 'hast', e: '🐴', gen: 'hästens', def: 'hästen', baby: 'föl', bdef: 'fölet', art: 'ett', lv: 0 },
  { id: 'far', e: '🐑', gen: 'fårets', def: 'fåret', baby: 'lamm', bdef: 'lammet', art: 'ett', lv: 0 },
  { id: 'katt', e: '🐱', gen: 'kattens', def: 'katten', baby: 'kattunge', bdef: 'kattungen', art: 'en', lv: 0 },
  { id: 'hund', e: '🐶', gen: 'hundens', def: 'hunden', baby: 'valp', bdef: 'valpen', art: 'en', lv: 0 },
  { id: 'hona', e: '🐔', gen: 'hönans', def: 'hönan', baby: 'kyckling', bdef: 'kycklingen', art: 'en', lv: 0 },
  { id: 'groda', e: '🐸', gen: 'grodans', def: 'grodan', baby: 'grodyngel', bdef: 'grodynglet', art: 'ett', lv: 1 },
  { id: 'fjaril', e: '🦋', gen: 'fjärilens', def: 'fjärilen', baby: 'larv', bdef: 'larven', art: 'en', lv: 1 },
  { id: 'kanin', e: '🐰', gen: 'kaninens', def: 'kaninen', baby: 'kaninunge', bdef: 'kaninungen', art: 'en', lv: 1 },
  { id: 'anka', e: '🦆', gen: 'ankans', def: 'ankan', baby: 'ankunge', bdef: 'ankungen', art: 'en', lv: 1 },
  { id: 'gris', e: '🐷', gen: 'grisens', def: 'grisen', baby: 'kulting', bdef: 'kultingen', art: 'en', lv: 2 },
  { id: 'get', e: '🐐', gen: 'getens', def: 'geten', baby: 'killing', bdef: 'killingen', art: 'en', lv: 2 },
  { id: 'bjorn', e: '🐻', gen: 'björnens', def: 'björnen', baby: 'björnunge', bdef: 'björnungen', art: 'en', lv: 2 },
  { id: 'svan', e: '🦢', gen: 'svanens', def: 'svanen', baby: 'svanunge', bdef: 'svanungen', art: 'en', lv: 2 },
  { id: 'radjur', e: '🦌', gen: 'rådjurets', def: 'rådjuret', baby: 'kid', bdef: 'kidet', art: 'ett', lv: 3 },
  { id: 'alg', e: np('🦌'), gen: 'älgens', def: 'älgen', baby: 'kalv', bdef: 'kalven', art: 'en', lv: 3 },
  { id: 'sal', e: '🦭', gen: 'sälens', def: 'sälen', baby: 'kut', bdef: 'kuten', art: 'en', lv: 3 },
  { id: 'rav', e: '🦊', gen: 'rävens', def: 'räven', baby: 'valp', bdef: 'valpen', art: 'en', lv: 3 },
  { id: 'varg', e: '🐺', gen: 'vargens', def: 'vargen', baby: 'valp', bdef: 'valpen', art: 'en', lv: 3 },
  { id: 'fisk', e: '🐟', gen: 'fiskens', def: 'fisken', baby: 'yngel', bdef: 'ynglet', art: 'ett', lv: 3 },
];
const babyPic = (b) => photoImage(b.id, b.def, true) || b.e;
export function genBabies(level, rng) {
  const pool = BABIES.filter((b) => b.lv <= level);
  const near = pool.filter((b) => b.lv >= level - 1);
  const t = near.length && rng.chance(0.7) ? rng.pick(near) : rng.pick(pool);
  const cap = (s) => s[0].toUpperCase() + s.slice(1);
  const n = level <= 1 ? 2 : 3;
  if (level === 0 || (level <= 2 && rng.chance(0.3))) {
    // Bildsvar: vem är mamma till ungen?
    const wrong = rng.sample(pool.filter((b) => b.baby !== t.baby), n);
    return {
      type: 'choice',
      prompt: `Vem är mamma till ${t.bdef}?`,
      options: rng.shuffle([t, ...wrong]).map((b) => ({ id: b.id, html: `<span class="pic sm">${babyPic(b)}</span><span>${b.def}</span>`, say: b.def })),
      answer: t.id,
      hint: `${cap(t.art)} ${t.baby} är en unge. Vilket djur får sådana ungar?`,
      explain: `${cap(t.gen)} unge kallas ${t.baby}.`,
    };
  }
  if (level >= 3 && rng.chance(0.35)) {
    // Omvänt: vilket djurs unge kallas …?
    const wrong = rng.sample(BABIES.filter((b) => b.lv <= level && b.baby !== t.baby), n);
    return {
      type: 'choice',
      prompt: `Vilket djurs unge kallas ${t.baby}?`,
      options: rng.shuffle([t, ...wrong]).map((b) => ({ id: b.id, html: `<span class="pic sm">${babyPic(b)}</span><span>${b.def}</span>`, say: b.def })),
      answer: t.id,
      hint: 'Tänk på djuren i skogen och på bondgården.',
      explain: `${cap(t.gen)} unge heter ${t.art} ${t.baby}.${BABIES.some((b) => b.baby === t.baby && b.id !== t.id) ? ` Fler djur har ungar som heter ${t.baby}: ${BABIES.filter((b) => b.baby === t.baby).map((b) => b.def).join(', ')}.` : ''}`,
    };
  }
  const words = [...new Set(BABIES.filter((b) => b.lv <= Math.max(level, 2)).map((b) => `${b.art} ${b.baby}`))];
  const right = `${t.art} ${t.baby}`;
  const wrong = rng.sample(words.filter((w) => w !== right), n);
  return {
    type: 'choice',
    prompt: `Vad heter ${t.gen} unge?`,
    visual: `<div class="pic-big">${babyPic(t)}</div>`,
    options: rng.shuffle([right, ...wrong]).map((w) => ({ id: w, label: w })),
    answer: right,
    hint: `Tänk på när ${t.def} får ungar på våren.`,
    explain: `${cap(t.gen)} unge heter ${right}.`,
  };
}

/* ---------- Vad behöver en växt? ---------- */
export const PLANT_BINS = [
  { id: 'ja', label: 'Växten behöver det', html: '🌱' },
  { id: 'nej', label: 'Behövs inte', html: '🚫' },
];
export const PLANT_ITEMS = [
  { id: 'ljus', e: np('☀️'), n: 'solljus', bin: 'ja' },
  { id: 'vatten', e: '💧', n: 'vatten', bin: 'ja' },
  { id: 'luft', e: np('🌬️'), n: 'luft', bin: 'ja' },
  { id: 'naring', e: '🪴', n: 'jord med näring', bin: 'ja' },
  { id: 'varme', e: '🌡️', n: 'lagom värme', bin: 'ja' },
  { id: 'godis', e: '🍬', n: 'godis', bin: 'nej' },
  { id: 'nalle', e: '🧸', n: 'en nalle', bin: 'nej' },
  { id: 'tv', e: '📺', n: 'tv', bin: 'nej' },
  { id: 'skor', e: '👟', n: 'skor', bin: 'nej' },
  { id: 'lask', e: '🥤', n: 'läsk', bin: 'nej' },
];
export const PLANT_FACTS = [
  { lv: 0, q: 'Blomman hänger och ser ledsen ut. Vad behöver den?', o: [['💧', 'vatten'], ['🍬', 'godis'], ['🧦', 'en strumpa']], ex: 'Växten har inte fått vatten. Vattna den så reser den sig igen!' },
  { lv: 0, q: 'Var ska krukväxten stå för att må bra?', o: [['🪟', 'vid ett ljust fönster'], ['🗄️', 'i en mörk garderob'], ['🧊', 'i frysen']], ex: 'Växter behöver ljus. I mörker kan de inte göra sin egen näring.' },
  { lv: 1, q: 'Hur tar växten upp vatten?', o: ['genom rötterna', 'genom blommorna', 'genom att dricka med munnen'], ex: 'Rötterna suger upp vatten och näring ur jorden. Sen går vattnet upp genom stjälken till bladen.' },
  { lv: 1, q: 'Vad händer med en växt som inte får vatten?', o: ['den vissnar', 'den växer snabbare', 'den blir blå'], ex: 'Utan vatten blir växten slapp och vissnar till slut.' },
  { lv: 2, q: 'Varför växer krukväxten åt fönstret?', o: ['den växer mot ljuset', 'den vill titta ut', 'den är rädd för rummet'], ex: 'Växter vänder sig och växer mot ljuset. Vrid krukan ibland så växer den rakt.' },
  { lv: 2, q: 'Vad behöver ett frö för att gro?', o: ['vatten och värme', 'starkt solljus och godis', 'is och snö'], ex: 'Fröet har egen näring inuti. Med vatten och lagom värme börjar det gro – ljuset behövs först när de gröna bladen kommer.' },
  { lv: 2, q: 'Varför har blommor färgglada kronblad?', o: ['för att locka till sig insekter', 'för att skrämma bort regnet', 'för att hålla sig varma'], ex: 'Bin och humlor lockas av färger och doft. De flyttar pollen mellan blommorna så att det blir frön.' },
  { lv: 3, q: 'Två likadana bönplantor får lika mycket vatten. Den ena står i ett mörkt skåp. Hur ser den ut efter en vecka?', o: ['blek, lång och tunn', 'grönare och större', 'precis likadan'], ex: 'I mörker sträcker plantan på sig för att hitta ljus. Utan ljus blir den blek och svag.' },
  { lv: 3, q: 'Vad gör de gröna bladen?', o: ['tillverkar näring med hjälp av solljus', 'pratar med andra växter', 'samlar regnvatten till rötterna'], ex: 'Bladen fångar solljus och gör socker av vatten och luft. Det är växtens mat.' },
  { lv: 3, q: 'Hur sprids maskrosens frön?', o: ['med vinden', 'med regnet', 'med snön'], ex: 'Varje frö har en liten fallskärm. Vinden kan bära det långt bort.' },
  { lv: 4, q: 'Vad släpper växterna ut som människor och djur behöver för att andas?', o: ['syre', 'rök', 'koldioxid', 'vattenånga'], ex: 'När växter gör näring av solljus tar de upp koldioxid och släpper ut syre.' },
  { lv: 4, q: 'Du vill testa om ljus påverkar växter. Vilket test är rättvist?', o: ['samma vatten och jord – bara olika ljus', 'olika mycket vatten och olika ljus', 'bara en växt i mörker'], ex: 'Bara det du testar ska vara olika. Annars vet du inte vad som gjorde skillnaden.' },
  { lv: 4, q: 'Varför är bladen gröna?', o: ['de har ett grönt ämne som fångar solljus', 'de är målade av regnet', 'de är omogna'], ex: 'Det gröna ämnet heter klorofyll. På hösten bryts det ner – då syns de gula och röda färgerna.' },
];
export function genPlants(level, rng) {
  if (rng.chance(level === 0 ? 0.4 : 0.6)) return rowChoice(rng, levelPick(rng, PLANT_FACTS, level), level, { hint: 'Tänk på ljus, vatten, luft och näring.' });
  return sortTask(rng, {
    bins: PLANT_BINS,
    items: PLANT_ITEMS,
    nItems: level === 0 ? 4 : level <= 2 ? 6 : 8,
    prompt: 'Vad behöver en växt för att växa?',
    hint: 'En växt behöver det som finns ute i naturen – inte saker från affären.',
    explain: 'En växt behöver ljus, vatten, luft, näring från jorden och lagom värme.',
  });
}

/* ---------- Allemansrätten ---------- */
export const ALLEMAN_BINS = [
  { id: 'ok', label: 'Det får man', html: '✅' },
  { id: 'inte', label: 'Det får man inte', html: '⛔' },
];
export const ALLEMAN_ITEMS = [
  { id: 'blabar', e: '🫐', n: 'plocka blåbär', bin: 'ok' },
  { id: 'svamp', e: np('🍄'), n: 'plocka svamp med en vuxen', bin: 'ok' },
  { id: 'bada', e: '🏊', n: 'bada i sjön', bin: 'ok' },
  { id: 'talta', e: '⛺', n: 'tälta en natt i skogen', bin: 'ok' },
  { id: 'stig', e: np('🥾'), n: 'gå på stigen i skogen', bin: 'ok' },
  { id: 'cykla', e: '🚲', n: 'cykla på en stig', bin: 'ok' },
  { id: 'blommor', e: np('🌼'), n: 'plocka vanliga blommor', bin: 'ok' },
  { id: 'skrapet', e: '🎒', n: 'ta med skräpet hem', bin: 'ok' },
  { id: 'grenar', e: np('🌳'), n: 'bryta grenar från levande träd', bin: 'inte' },
  { id: 'skrapa', e: np('🥤'), n: 'slänga skräp i skogen', bin: 'inte' },
  { id: 'fagelagg', e: '🥚', n: 'ta ägg ur ett fågelbo', bin: 'inte' },
  { id: 'tomt', e: '🏡', n: 'gå in på någons tomt', bin: 'inte' },
  { id: 'storadjur', e: np('🐣'), n: 'störa djur och deras ungar', bin: 'inte' },
  { id: 'elda', e: '🔥', n: 'elda när det är eldningsförbud', bin: 'inte' },
  { id: 'bil', e: '🚗', n: 'köra bil ute i skogen', bin: 'inte' },
];
export const ALLEMAN_FACTS = [
  { lv: 1, q: 'Vad betyder allemansrätten?', o: ['alla får vara i naturen om de är rädda om den', 'man får ta allt man vill ha', 'bara den som äger skogen får gå där'], ex: 'Allemansrätten gör att alla får vara ute i naturen. Kom ihåg: inte störa – inte förstöra!' },
  { lv: 2, q: 'Du hittar ett fågelbo med ägg. Vad gör du?', o: ['tittar på avstånd och låter det vara', 'tar med ett ägg hem', 'flyttar boet till ett bättre ställe'], ex: 'Fågelbon och ungar får man inte störa. Titta försiktigt på avstånd och gå sen vidare.' },
  { lv: 2, q: 'Hur länge får man tälta på samma ställe enligt allemansrätten?', o: ['ungefär ett dygn', 'en hel sommar', 'hur länge som helst'], ex: 'Man får tälta ett dygn, inte för nära någons hus. Vill man stanna längre ska man fråga den som äger marken.' },
  { lv: 3, q: 'Får du bryta kvistar från ett levande träd?', o: ['nej, det skadar trädet', 'ja, alltid', 'ja, om kvistarna är gröna'], ex: 'Levande träd får man inte skada. Torra pinnar som ligger på marken får du ta, till exempel till en lägereld.' },
  { lv: 3, q: 'Vad måste du tänka på innan ni gör upp eld i naturen?', o: ['att det inte är eldningsförbud och att det är säkert', 'att elda direkt på en stor berghäll', 'att elda nära torra träd'], ex: 'Elda bara med en vuxen, när det är tillåtet. Elda inte direkt på berghällar – de kan spricka. Släck ordentligt med vatten.' },
  { lv: 3, q: 'Varför ska hundar hållas extra noga på våren och sommaren?', o: ['vilda djur har små ungar då', 'hundarna blir trötta', 'det blir för varmt i skogen'], ex: 'Från den 1 mars till den 20 augusti ska hundar hållas så att de inte kan springa iväg och störa vilda djur och deras ungar.' },
  { lv: 4, q: 'Vad får du INTE göra enligt allemansrätten?', o: ['plocka fridlysta växter', 'plocka blåbär', 'bada i en sjö', 'gå på en skogsstig'], ex: 'Vissa sällsynta växter är fridlysta, som många orkidéer. De får man inte plocka.' },
  { lv: 4, q: 'Var får du INTE gå när du är ute i naturen?', o: ['på en åker där det växer säd', 'på en äng', 'på en skogsstig', 'på stranden vid en sjö'], ex: 'Odlad mark, som åkrar och nysådda fält, kan skadas. Gå runt!' },
  { lv: 4, q: 'Vad betyder ”inte störa – inte förstöra”?', o: ['vi får vara i naturen om vi är rädda om djur, växter och människor', 'vi får inte vara ute alls', 'vi måste vara helt tysta hela tiden'], ex: 'Allemansrätten är en frihet som kommer med ansvar. Vi tar hand om naturen och visar hänsyn mot dem som bor där.' },
];
export function genAlleman(level, rng) {
  if (level >= 1 && rng.chance(level === 1 ? 0.3 : 0.5)) return rowChoice(rng, levelPick(rng, ALLEMAN_FACTS, level), level, { hint: 'Kom ihåg: inte störa – inte förstöra.' });
  return sortTask(rng, {
    bins: ALLEMAN_BINS,
    items: ALLEMAN_ITEMS,
    nItems: level === 0 ? 4 : level <= 2 ? 6 : 8,
    prompt: 'Allemansrätten: vad får man göra i naturen?',
    hint: 'Skadar det djur eller växter? Stör det någon? Då får man inte.',
    explain: 'Allemansrätten gör att alla får vara i naturen – men vi får inte störa och inte förstöra.',
  });
}

/* ---------- Må bra ---------- */
export const HEALTH_BINS = [
  { id: 'ofta', label: 'Bra varje dag', html: '💪' },
  { id: 'ibland', label: 'Bara ibland', html: '🎉' },
];
export const HEALTH_ITEMS = [
  { id: 'apple', e: '🍎', n: 'äpple', bin: 'ofta' },
  { id: 'morot', e: '🥕', n: 'morot', bin: 'ofta' },
  { id: 'brod', e: '🍞', n: 'bröd', bin: 'ofta' },
  { id: 'mjolk', e: '🥛', n: 'mjölk', bin: 'ofta' },
  { id: 'potatis', e: '🥔', n: 'potatis', bin: 'ofta' },
  { id: 'paron', e: '🍐', n: 'päron', bin: 'ofta' },
  { id: 'vatten', e: '💧', n: 'vatten', bin: 'ofta' },
  { id: 'godis', e: '🍬', n: 'godis', bin: 'ibland' },
  { id: 'glass', e: '🍦', n: 'glass', bin: 'ibland' },
  { id: 'lask', e: '🥤', n: 'läsk', bin: 'ibland' },
  { id: 'tarta', e: '🎂', n: 'tårta', bin: 'ibland' },
  { id: 'munk', e: '🍩', n: 'munk', bin: 'ibland' },
];
export const HEALTH = [
  { lv: 0, q: 'Vad använder du när du borstar tänderna?', o: [['🪥', 'tandborste'], ['🥄', 'sked'], ['✏️', 'penna']], ex: 'Borsta tänderna med tandborste och tandkräm, morgon och kväll.' },
  { lv: 0, q: 'Du är jättetrött på kvällen. Vad behöver kroppen?', o: [['🛏️', 'sova'], ['🍬', 'godis'], ['📺', 'titta på tv']], ex: 'När du sover vilar kroppen och växer. Hjärnan sparar det du har lärt dig.' },
  { lv: 0, q: 'Vad är bäst att dricka när du är törstig?', o: [['💧', 'vatten'], ['🥤', 'läsk'], ['☕', 'kaffe']], ex: 'Vatten är det bästa för kroppen – och det kommer gratis ur kranen i Sverige!' },
  { lv: 0, q: 'Vad ska du ha på huvudet när du cyklar?', o: [['⛑️', 'hjälm'], ['🧢', 'keps'], ['👑', 'krona']], ex: 'Hjälmen skyddar huvudet om du ramlar. Barn under 15 år måste ha hjälm när de cyklar.' },
  { lv: 1, q: 'Hur länge behöver ett barn i skolåldern sova varje natt?', o: ['9–12 timmar', '3–4 timmar', '20 timmar'], ex: 'Barn mellan 6 och 12 år behöver ungefär 9–12 timmars sömn. När du sover växer kroppen och hjärnan sparar det du lärt dig.' },
  { lv: 1, q: 'Varför ska man tvätta händerna innan man äter?', o: ['för att få bort bakterier', 'för att händerna ska bli varma', 'för att det luktar gott'], ex: 'Med tvål och vatten tvättar du bort bakterier och virus så att du inte blir sjuk.' },
  { lv: 1, q: 'Hur länge ska du borsta tänderna?', o: ['två minuter', 'fem sekunder', 'en timme'], ex: 'Borsta två minuter, morgon och kväll, med fluortandkräm.' },
  { lv: 1, q: 'Vad kan du göra om en kompis är ledsen?', o: ['fråga hur kompisen mår', 'gå därifrån', 'skratta'], ex: 'Att vara en bra vän och ha vänner är viktigt för att må bra.' },
  { lv: 1, q: 'Vad är bäst att dricka när man är törstig?', o: ['vatten', 'saft', 'läsk'], ex: 'Vatten är det bästa för kroppen – och det kommer gratis ur kranen i Sverige!' },
  { lv: 2, q: 'Vad händer i kroppen när du rör på dig?', o: ['hjärtat och musklerna blir starkare', 'du blir trött för alltid', 'ingenting'], ex: 'Rörelse gör hjärtat, musklerna och skelettet starka – och man blir ofta glad av det!' },
  { lv: 2, q: 'Vilken mat ger mycket vitaminer och fibrer?', o: ['frukt och grönsaker', 'godis', 'läsk'], ex: 'Frukt och grönsaker har vitaminer och fibrer. Godis är okej ibland, men ger bara kort energi.' },
  { lv: 2, q: 'Hur länge bör barn röra på sig varje dag?', o: ['minst en timme', 'fem minuter', 'aldrig'], ex: 'Barn mår bra av att röra på sig minst en timme varje dag – leka, cykla, springa eller simma.' },
  { lv: 2, q: 'Var ska du nysa om du inte har en näsduk?', o: ['i armvecket', 'i handen', 'rakt ut i luften'], ex: 'Nyser du i armvecket sprids färre bakterier till händer och saker som andra rör vid.' },
  { lv: 3, q: 'Varför är det bra att lägga bort skärmen en stund före sängen?', o: ['man somnar lättare', 'skärmen blir trött', 'det blir mörkare ute'], ex: 'Starkt ljus från skärmar kan göra det svårare att somna.' },
  { lv: 3, q: 'Vad ska ta minst plats på tallriken enligt tallriksmodellen?', o: ['kött, fisk, ägg eller bönor', 'grönsaker', 'potatis, ris eller pasta'], ex: 'Tallriksmodellen: grönsaker tar en stor del, potatis, ris eller pasta en del, och kött, fisk, ägg eller bönor den minsta delen.' },
  { lv: 3, q: 'Varför är det bra att äta frukost?', o: ['kroppen och hjärnan behöver energi efter natten', 'man blir längre direkt', 'då slipper man borsta tänderna'], ex: 'Efter natten har kroppen inte ätit på länge. Frukosten ger energi att leka och lära.' },
  { lv: 3, q: 'Varför har man hjälm när man cyklar?', o: ['den skyddar huvudet och hjärnan', 'den gör att man cyklar fortare', 'den håller håret torrt'], ex: 'I Sverige måste alla under 15 år ha hjälm när de cyklar. Hjälmen tar emot stöten om man ramlar.' },
  { lv: 4, q: 'Vad händer i kroppen när du sover?', o: ['kroppen växer och hjärnan sorterar minnen', 'hjärtat stannar en stund', 'ingenting alls'], ex: 'Under sömnen bildas tillväxthormon och hjärnan sparar det du lärt dig under dagen.' },
  { lv: 4, q: 'Varför ska man skydda huden i stark sol?', o: ['solens UV-strålar kan bränna huden', 'huden blir blå', 'solen gör en trött'], ex: 'Använd kläder, keps, skugga och solkräm. Mitt på dagen är solen starkast.' },
  { lv: 4, q: 'Vad är fibrer bra för?', o: ['att magen och tarmarna mår bra', 'att håret växer fortare', 'att man ser bättre i mörker'], ex: 'Fibrer finns i fullkornsbröd, grönsaker, frukt och bönor. De hjälper magen att fungera.' },
  { lv: 4, q: 'Varför sprids förkylningar lätt i skolan?', o: ['virus följer med händer och nysningar', 'kylan från fönstret smittar', 'man blir sjuk av att läsa'], ex: 'Virus sprids med små droppar och via händer. Tvätta händerna och nys i armvecket!' },
];
export function genHealth(level, rng) {
  if (level <= 1 && rng.chance(level === 0 ? 0.4 : 0.25)) {
    return sortTask(rng, {
      bins: HEALTH_BINS,
      items: HEALTH_ITEMS,
      nItems: level === 0 ? 4 : 6,
      prompt: 'Vad är bra att äta och dricka varje dag – och vad är bara ibland?',
      hint: 'Frukt, grönsaker och vatten är bra varje dag. Sött är för fest.',
      explain: 'Frukt, grönsaker, bröd och vatten ger kroppen energi varje dag. Godis, glass och läsk är gott, men bara ibland.',
    });
  }
  return rowChoice(rng, levelPick(rng, HEALTH, level), level, { hint: 'Vad mår kroppen bäst av?' });
}

export const biologyApp = {
  id: 'biology',
  name: 'Biologi',
  icon: '🌿',
  color: '#2fae66',
  tagline: 'Kroppen, djuren och naturen',
  modules: [
    { id: 'bodyexplore', name: 'Utforska kroppen', icon: '🧍', minLevel: 0, view: 'body', lgr: ['no-kropp', 'no22-organ'] },
    { id: 'bodytap', name: 'Var är …?', icon: '👆', minLevel: 0, gen: genBodyTap, lgr: ['no-kropp', 'no22-organ'] },
    { id: 'senses', name: 'Sinnena', icon: '👃', minLevel: 0, gen: genSenses, lgr: ['no-sinnen', 'no22-sinnen'] },
    { id: 'seasons', name: 'Årstider', icon: '🍂', minLevel: 0, gen: genSeasons, lgr: ['no-arstid', 'no22-arstid'] },
    { id: 'lifecycle', name: 'Livscykler', icon: '🐛', minLevel: 0, gen: genLifecycle, lgr: ['no-livscykel', 'no22-arstid'] },
    { id: 'babies', name: 'Djurungar', icon: '🐣', minLevel: 0, gen: genBabies, lgr: ['no-arter', 'no22-arter'] },
    { id: 'species', name: 'Artkort', icon: '🃏', minLevel: 0, gen: genSpecies, lgr: ['no-arter', 'no22-arter'], photo: () => photo('ekorre', { cls: 'tile-photo' }) },
    { id: 'nature', name: 'Djur, växt eller svamp?', icon: '🍄', minLevel: 0, gen: genNature, lgr: ['no-arter', 'no22-arter'] },
    { id: 'plants', name: 'Vad behöver en växt?', icon: '🌱', minLevel: 0, gen: genPlants, lgr: ['no-livscykel', 'no22-arstid', 'no22-undersokning'] },
    { id: 'alleman', name: 'Allemansrätten', icon: '⛺', minLevel: 0, gen: genAlleman, lgr: ['no22-allemansratt'] },
    { id: 'health', name: 'Må bra', icon: '💪', minLevel: 0, gen: genHealth, lgr: ['no-halsa', 'no22-halsa'] },
    { id: 'groups', name: 'Djurgrupper', icon: '🐾', minLevel: 1, gen: genAnimalGroups, lgr: ['no-arter', 'no22-arter'] },
    { id: 'foodchain', name: 'Näringskedjor', icon: '🦊', minLevel: 1, gen: genFoodChain, lgr: ['no-kedja', 'no22-kedja'] },
  ],
};
