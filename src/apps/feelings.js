// Känslor & jag – sociala berättelser, känsloigenkänning (ansikten och situationer),
// kroppens signaler (interoception), verktygslåda och rörelsepauser.
// Gjord för autismstödet men öppen för alla barn. Innehållet är åldersadekvat – bara strukturen stöder.
// Forskning och evidensstyrka: docs/ANPASSAT-LAGE.md.
import { photo, hasPhoto } from '../ui/img.js';

/* =====================================================================================
 * Sociala berättelser (Carol Gray, Social Stories 10.3)
 * - Rubrik, inledning, mitten och avslutning. Första person ("jag"), aldrig "du".
 * - Två sorters meningar: beskrivande ('d') och högst EN vägledande ('c', "Jag kan …").
 *   Beskrivande meningar ska vara minst tre gånger så många som vägledande.
 * - Positivt, tålmodigt och bokstavligt korrekt: "ofta", "ibland" i stället för "alltid"/"aldrig".
 * - Minst hälften av berättelserna lyfter något barnet är bra på (praise: true).
 * - {interest} byts mot barnets favoritintresse (t.ex. "rymden").
 * ===================================================================================== */
export const SOCIAL_STORIES = [
  {
    id: 'screen-end', icon: '⏳', title: 'När skärmtiden tar slut', praise: true,
    pages: [
      { pic: '📱', lines: [['d', 'Jag använder KidsOS för att lära mig nya saker.'], ['d', 'Jag är bra på att lära mig saker på skärmen.'], ['d', 'Mina föräldrar bestämmer hur länge skärmen får vara på varje dag. Det kallas skärmtid.']] },
      { pic: '⏳', lines: [['d', 'En cirkel visar hur mycket skärmtid som är kvar.'], ['d', 'Cirkeln blir mindre och mindre.'], ['d', 'När det är två minuter kvar visar KidsOS det.']] },
      { pic: '✅', lines: [['d', 'När tiden är slut står det: Skärmtiden är slut för i dag.'], ['d', 'Allt jag har gjort är sparat. Stjärnorna och troféerna finns kvar i morgon.']] },
      { pic: '🧱', lines: [['d', 'Sen visar KidsOS vad jag kan göra i stället, till exempel bygga eller rita.'], ['d', 'Många barn tycker att det är tråkigt när något roligt tar slut. Det är okej att känna så.']] },
      { pic: '👋', lines: [['c', 'Jag kan trycka på Hej då och gå vidare till nästa sak.'], ['d', 'I morgon kan jag fortsätta där jag slutade.']] },
    ],
  },
  {
    id: 'wrong', icon: '💡', title: 'När jag svarar fel', praise: true,
    pages: [
      { pic: '🧠', lines: [['d', 'Alla som lär sig något nytt svarar fel ibland. Vuxna och forskare också.'], ['d', 'Ett fel svar visar vad hjärnan behöver öva mer på.']] },
      { pic: '💡', lines: [['d', 'I KidsOS står det: Prova en gång till.'], ['d', 'Det finns ofta en ledtråd som hjälper mig att tänka.']] },
      { pic: '🔍', lines: [['d', 'Jag är bra på att tänka noga och lägga märke till detaljer.'], ['d', 'Jag tycker om att förstå hur saker fungerar.']] },
      { pic: '🌬️', lines: [['d', 'Ibland känner jag mig arg eller ledsen när det blir fel. Känslan går över efter en stund.'], ['c', 'Jag kan andas ut långsamt, läsa ledtråden och prova igen.']] },
      { pic: '🌱', lines: [['d', 'Varje gång jag övar blir hjärnan lite starkare.']] },
    ],
  },
  {
    id: 'change', icon: '🔀', title: 'När något ändras',
    pages: [
      { pic: '🗓️', lines: [['d', 'Varje dag har en plan. Planen visar vad som händer först och vad som händer sen.']] },
      { pic: '🌧️', lines: [['d', 'Ibland ändras planen. Någon kan vara sjuk, det kan regna eller något tar längre tid än vi trodde.']] },
      { pic: '🫀', lines: [['d', 'När planen ändras kan det kännas konstigt eller jobbigt i kroppen.'], ['d', 'Det är vanligt. Många känner så.']] },
      { pic: '🗺️', lines: [['d', 'Vuxna försöker berätta om ändringar så tidigt som de kan.'], ['d', 'De kan visa den nya planen med bilder.']] },
      { pic: '🏁', lines: [['d', 'Den nya planen har också ett slut. Efter den kommer något som jag känner igen.'], ['c', 'Jag kan fråga: Vad händer nu, och vad händer sen?']] },
    ],
  },
  {
    id: 'wait', icon: '⏱️', title: 'Att vänta på min tur',
    pages: [
      { pic: '🛝', lines: [['d', 'Ibland vill flera personer göra samma sak samtidigt, till exempel åka rutschkana eller prata med läraren.']] },
      { pic: '🔁', lines: [['d', 'Då turas vi om. Först gör en person, sen gör nästa person.']] },
      { pic: '⏱️', lines: [['d', 'Att vänta kan kännas långt. En timer kan visa hur länge det är kvar.']] },
      { pic: '💭', lines: [['d', 'Medan jag väntar kan jag tänka på {interest}, räkna tyst eller titta på något runt mig.']] },
      { pic: '🙌', lines: [['d', 'När det är min tur väntar de andra på mig.'], ['c', 'Jag kan säga: Säg till när det är min tur.']] },
    ],
  },
  {
    id: 'loud', icon: '🔊', title: 'När det är högljutt', praise: true,
    pages: [
      { pic: '🏫', lines: [['d', 'Vissa platser är högljudda, till exempel matsalen, idrottshallen eller ett kalas.']] },
      { pic: '👂', lines: [['d', 'Mina öron hör ljud mycket tydligt. Jag märker ljud som andra inte lägger märke till.'], ['d', 'Det är en sorts styrka.']] },
      { pic: '😣', lines: [['d', 'När ljudet blir för starkt kan det kännas obehagligt eller göra ont i öronen.']] },
      { pic: '🎧', lines: [['d', 'Hörselkåpor, ett tystare ställe en stund eller att hålla för öronen brukar hjälpa.'], ['d', 'Vuxna vill veta när ljudet är för starkt, så att de kan hjälpa till.']] },
      { pic: '🙋', lines: [['c', 'Jag kan säga: Det är för högt för mig.']] },
    ],
  },
  {
    id: 'help', icon: '🙋', title: 'Att be om hjälp', praise: true,
    pages: [
      { pic: '🧑‍🚀', lines: [['d', 'Alla behöver hjälp ibland. Lärare, föräldrar och astronauter också.']] },
      { pic: '🧩', lines: [['d', 'Att be om hjälp är ett smart sätt att lösa ett problem.']] },
      { pic: '📝', lines: [['d', 'Jag kan behöva hjälp när en uppgift är svår, när jag inte vet vad jag ska göra eller när jag mår dåligt.']] },
      { pic: '💬', lines: [['d', 'Vuxna hemma och i skolan tycker om när barn säger till. Då vet de vad de kan göra.'], ['d', 'Det är modigt att säga till.']] },
      { pic: '⏳', lines: [['d', 'Om den vuxna är upptagen kan det dröja en liten stund.'], ['c', 'Jag kan säga: Jag behöver hjälp. Eller visa hjälpkortet.']] },
    ],
  },
  {
    id: 'switch', icon: '🔄', title: 'Att byta aktivitet', praise: true,
    pages: [
      { pic: '🗓️', lines: [['d', 'En dag består av många aktiviteter. Matte, rast, lunch och läsning är några av dem.']] },
      { pic: '🔄', lines: [['d', 'När en aktivitet slutar börjar en ny. Det kallas ett byte.']] },
      { pic: '🎯', lines: [['d', 'Jag är bra på att fokusera länge på det jag gör.'], ['d', 'Därför kan det vara svårt att sluta mitt i något jag tycker om.']] },
      { pic: '⏳', lines: [['d', 'Ett schema visar vad som kommer sen. En timer visar hur länge det är kvar.']] },
      { pic: '📦', lines: [['d', 'Det jag höll på med finns kvar. Ofta kan jag fortsätta en annan gång.'], ['c', 'Jag kan titta på schemat och gå till nästa sak.']] },
    ],
  },
  {
    id: 'angry', icon: '🌋', title: 'När jag blir arg',
    pages: [
      { pic: '😠', lines: [['d', 'Arg är en känsla. Alla människor blir arga ibland.']] },
      { pic: '🫀', lines: [['d', 'När jag blir arg kan hjärtat slå fort, ansiktet bli varmt och händerna knytas.'], ['d', 'Kroppen säger att något känns fel eller orättvist.']] },
      { pic: '🌿', lines: [['d', 'Det är okej att vara arg. Kroppen behöver en paus för att lugna sig.']] },
      { pic: '🙏', lines: [['d', 'Att andas ut långsamt, trycka händerna mot varandra eller gå till en lugn plats gör ofta att ilskan blir mindre.']] },
      { pic: '💬', lines: [['c', 'Jag kan säga: Jag är arg och behöver en paus.'], ['d', 'Efter pausen brukar det gå lättare att prata om det som hände.']] },
    ],
  },
  {
    id: 'substitute', icon: '🧑‍🏫', title: 'När vi har en vikarie',
    pages: [
      { pic: '🏫', lines: [['d', 'Ibland är min vanliga lärare borta. Då kommer en vikarie.']] },
      { pic: '🧑‍🏫', lines: [['d', 'En vikarie är en lärare som hoppar in en dag eller några dagar.']] },
      { pic: '🗓️', lines: [['d', 'Vikarien kan göra en del saker på ett annat sätt. Schemat brukar vara ungefär som vanligt.']] },
      { pic: '🤝', lines: [['d', 'Vikarien vill att dagen ska bli bra för alla barn.'], ['d', 'Min vanliga lärare kommer tillbaka när hen kan.']] },
      { pic: '💬', lines: [['c', 'Jag kan berätta för vikarien vad som brukar hjälpa mig.']] },
    ],
  },
  {
    id: 'interest', icon: '⭐', title: 'Det jag kan mycket om', praise: true,
    pages: [
      { pic: '⭐', lines: [['d', 'Mitt favoritämne är {interest}. Jag kan väldigt mycket om det.']] },
      { pic: '🔬', lines: [['d', 'Att kunna mycket om något är en styrka. Många forskare och uppfinnare började med ett stort intresse.']] },
      { pic: '👫', lines: [['d', 'Andra människor har också favoritämnen. Deras ämnen kan vara annorlunda än mitt.']] },
      { pic: '💬', lines: [['d', 'När jag berättar om mitt ämne blir jag glad. När jag lyssnar på någon annan blir den personen glad.'], ['d', 'Ett samtal blir ofta bra när båda får prata om det de tycker om.']] },
      { pic: '❓', lines: [['c', 'Jag kan berätta lite och sen fråga den andra vad hen tycker om.']] },
    ],
  },
  {
    id: 'lose', icon: '🎲', title: 'När jag förlorar i ett spel',
    pages: [
      { pic: '🎲', lines: [['d', 'I spel vinner ibland en person och ibland en annan.']] },
      { pic: '😣', lines: [['d', 'Att förlora kan kännas tråkigt. Kroppen kan bli spänd.']] },
      { pic: '🃏', lines: [['d', 'Spel är spännande för att ingen vet hur det slutar.'], ['d', 'Den som förlorar kan vinna en annan gång.']] },
      { pic: '🤝', lines: [['d', 'Kompisar tycker om att spela med någon som säger Bra spelat.'], ['c', 'Jag kan säga Bra spelat och sen andas ut.']] },
    ],
  },
];

/** Byter {interest} mot barnets intresse ("rymden", "djur" …). */
export function storyText(text, interestLabel = 'djur') {
  return String(text).replace(/\{interest\}/g, String(interestLabel).toLowerCase());
}

/** Gray-kriterier som går att kontrollera automatiskt (används av testerna och kan visas för föräldern). */
export function storyStats(story) {
  const lines = story.pages.flatMap((p) => p.lines);
  const d = lines.filter((l) => l[0] === 'd').length;
  const c = lines.filter((l) => l[0] === 'c').length;
  return { descriptive: d, coaching: c, ratio: c ? d / c : Infinity, pages: story.pages.length };
}

/* =====================================================================================
 * Känslor: ord, ansiktsdrag och kroppssignaler. Illustrerade ansikten (SVG) är standard;
 * riktiga foton (Wikimedia Commons, nycklar "kansla-…") visas när de finns.
 * ===================================================================================== */
export const EMOTIONS = [
  { id: 'glad', label: 'glad', icon: '😊', level: 0, cue: 'Mungiporna går upp och kinderna åker upp mot ögonen.' },
  { id: 'ledsen', label: 'ledsen', icon: '😢', level: 0, cue: 'Mungiporna går ner och ögonbrynen lyfts på mitten.' },
  { id: 'arg', label: 'arg', icon: '😠', level: 0, cue: 'Ögonbrynen dras ner och ihop, och munnen blir spänd.' },
  { id: 'radd', label: 'rädd', icon: '😨', level: 0, cue: 'Ögonen blir stora, ögonbrynen åker upp och munnen öppnas.' },
  { id: 'forvanad', label: 'förvånad', icon: '😮', level: 1, cue: 'Ögonbrynen åker högt upp och munnen blir rund som ett O.' },
  { id: 'trott', label: 'trött', icon: '🥱', level: 1, cue: 'Ögonlocken blir tunga och halvstängda.' },
  { id: 'acklad', label: 'äcklad', icon: '🤢', level: 2, cue: 'Näsan rynkas och överläppen dras upp.' },
  { id: 'lugn', label: 'lugn', icon: '😌', level: 2, cue: 'Ansiktet är mjukt, ögonen är lugna och munnen ler lite.' },
  { id: 'orolig', label: 'orolig', icon: '😟', level: 2, cue: 'Ögonbrynen lyfts på mitten och munnen blir rak eller lite sned.' },
  { id: 'stolt', label: 'stolt', icon: '🏅', level: 3, cue: 'Hakan lyfts lite och munnen ler med stängda läppar.' },
];
export const emotionById = (id) => EMOTIONS.find((e) => e.id === id);
const EMO_AT = (level) => EMOTIONS.filter((e) => e.level <= level);

const SKIN = ['#f5d0b5', '#e0ac85', '#c68b5e', '#8d5a3b', '#f1c27d'];
const HAIR = ['#3b2a20', '#6b4423', '#1f1a17', '#b5651d', '#2d2420'];

/** Ansiktsdrag per känsla: ögonbryn (lutning, höjd), ögon, mun. */
const FACE = {
  glad: { brow: [0, -2], eyes: 'smile', mouth: 'M38 78 Q60 100 82 78' },
  ledsen: { brow: [-12, 0], eyes: 'down', mouth: 'M42 90 Q60 76 78 90', tear: true },
  arg: { brow: [16, 4], eyes: 'narrow', mouth: 'M44 88 Q60 82 76 88' },
  radd: { brow: [-10, -8], eyes: 'wide', mouth: 'M46 86 Q60 78 74 86 Q60 100 46 86' },
  forvanad: { brow: [0, -10], eyes: 'wide', mouth: 'O' },
  trott: { brow: [-4, 0], eyes: 'half', mouth: 'M50 86 Q60 92 70 86' },
  acklad: { brow: [10, 2], eyes: 'narrow', mouth: 'M44 86 L52 82 L60 86 L68 82 L76 86', nose: true },
  lugn: { brow: [0, -2], eyes: 'closed', mouth: 'M46 82 Q60 90 74 82' },
  orolig: { brow: [-10, -4], eyes: 'open', mouth: 'M46 86 Q53 82 60 86 Q67 90 74 86' },
  stolt: { brow: [4, -2], eyes: 'smile', mouth: 'M44 82 Q60 92 76 82', chin: true },
};

function eyeSvg(x, kind) {
  const y = 56;
  switch (kind) {
    case 'smile': return `<path d="M${x - 7} ${y + 2} Q${x} ${y - 6} ${x + 7} ${y + 2}" fill="none" stroke="#2a1d16" stroke-width="3.4" stroke-linecap="round"/>`;
    case 'closed': return `<path d="M${x - 7} ${y} Q${x} ${y + 6} ${x + 7} ${y}" fill="none" stroke="#2a1d16" stroke-width="3.4" stroke-linecap="round"/>`;
    case 'half': return `<ellipse cx="${x}" cy="${y + 1}" rx="7" ry="5" fill="#fff"/><circle cx="${x}" cy="${y + 2}" r="3.4" fill="#2a1d16"/><path d="M${x - 8} ${y} L${x + 8} ${y}" stroke="#2a1d16" stroke-width="3.4" stroke-linecap="round"/><path d="M${x - 8} ${y - 1} Q${x} ${y - 8} ${x + 8} ${y - 1} Z" fill="currentColor"/>`;
    case 'narrow': return `<ellipse cx="${x}" cy="${y}" rx="7" ry="3.2" fill="#fff"/><circle cx="${x}" cy="${y}" r="3" fill="#2a1d16"/>`;
    case 'wide': return `<ellipse cx="${x}" cy="${y}" rx="8" ry="8.5" fill="#fff" stroke="#2a1d16" stroke-width="1.2"/><circle cx="${x}" cy="${y}" r="3.6" fill="#2a1d16"/>`;
    case 'down': return `<ellipse cx="${x}" cy="${y}" rx="6.5" ry="5.5" fill="#fff"/><circle cx="${x}" cy="${y + 2}" r="3.4" fill="#2a1d16"/>`;
    default: return `<ellipse cx="${x}" cy="${y}" rx="7" ry="6" fill="#fff"/><circle cx="${x}" cy="${y}" r="3.6" fill="#2a1d16"/>`;
  }
}

function browSvg(x, side, [tilt, lift]) {
  // tilt > 0: inre änden ner (arg). tilt < 0: inre änden upp (ledsen/rädd/orolig).
  const y = 42 + lift;
  const inner = side === 'l' ? x + 9 : x - 9;
  const outer = side === 'l' ? x - 9 : x + 9;
  const dy = tilt / 3;
  return `<path d="M${outer} ${y - dy / 2} L${inner} ${y + dy}" stroke="#2a1d16" stroke-width="4" stroke-linecap="round"/>`;
}

/**
 * Illustrerat ansikte (SVG) med tydliga ansiktsdrag för en känsla. Neutralt och realistiskt
 * tecknat – inte en emoji. `variant` väljer hudton och hårfärg (mångfald, förutsägbart).
 */
export function faceSvg(emotionId, variant = 0, { size = 'm' } = {}) {
  const f = FACE[emotionId] || FACE.glad;
  const v = Math.abs(Math.round(Number(variant) || 0));
  const skin = SKIN[v % SKIN.length];
  const hair = HAIR[(v + 2) % HAIR.length];
  const tilt = f.chin ? -6 : 0;
  const mouth = f.mouth === 'O' ? '<ellipse cx="60" cy="86" rx="7" ry="9" fill="#5a2a22"/>' : `<path d="${f.mouth}" fill="${f.mouth.includes('Z') || emotionId === 'radd' ? '#5a2a22' : 'none'}" stroke="#5a2a22" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>`;
  const label = emotionById(emotionId)?.label || '';
  return `<svg class="face-svg face-${size}" viewBox="0 0 120 120" role="img" aria-label="Ett ansikte som ser ${label} ut" style="color:${skin}">`
    + `<g transform="rotate(${tilt} 60 62)">`
    + `<path d="M14 58 Q16 12 60 12 Q104 12 106 58 Q96 30 60 30 Q24 30 14 58 Z" fill="${hair}"/>`
    + `<ellipse cx="14" cy="64" rx="6" ry="9" fill="${skin}"/><ellipse cx="106" cy="64" rx="6" ry="9" fill="${skin}"/>`
    + `<ellipse cx="60" cy="64" rx="44" ry="48" fill="${skin}"/>`
    + `<path d="M18 50 Q24 24 60 24 Q96 24 102 50 Q90 34 60 34 Q30 34 18 50 Z" fill="${hair}"/>`
    + browSvg(42, 'l', f.brow) + browSvg(78, 'r', f.brow)
    + eyeSvg(42, f.eyes) + eyeSvg(78, f.eyes)
    + `<path d="M60 62 Q56 72 60 74" fill="none" stroke="#2a1d16" stroke-opacity=".35" stroke-width="2.4" stroke-linecap="round"/>`
    + (f.nose ? '<path d="M53 66 Q56 63 59 66 M61 66 Q64 63 67 66" fill="none" stroke="#2a1d16" stroke-opacity=".55" stroke-width="2"/>' : '')
    + (f.tear ? '<path d="M80 64 Q77 71 80 74 Q83 71 80 64 Z" fill="#62b6ff"/>' : '')
    + (emotionId === 'glad' || emotionId === 'stolt' ? '<ellipse cx="34" cy="74" rx="7" ry="4" fill="#ff8a80" opacity=".35"/><ellipse cx="86" cy="74" rx="7" ry="4" fill="#ff8a80" opacity=".35"/>' : '')
    + mouth
    + '</g></svg>';
}

/** Fotonyckel för en känsla (riktigt fotografi från Wikimedia Commons). */
export const emotionPhotoKey = (id) => `kansla-${id}`;

/** Bild för en känsla: riktigt foto om det finns och `real` är sant, annars ett illustrerat ansikte. */
export function emotionVisual(id, { variant = 0, real = true, size = 'm' } = {}) {
  const key = emotionPhotoKey(id);
  if (real && hasPhoto(key)) return `<span class="face-photo face-${size}">${photo(key, { alt: `Ett fotografi av en person som ser ${emotionById(id)?.label || ''} ut`, cls: 'face-img' })}</span>`;
  return faceSvg(id, variant, { size });
}

const optWord = (e) => ({ id: e.id, html: `<span class="fe-opt"><span class="fe-emoji" aria-hidden="true">${e.icon}</span><b>${e.label}</b></span>`, say: e.label });

/** Läsa ansikten: från "vilken känsla?" (nivå 0) till "vilket ansikte?" och ansiktsdrag (nivå 2–4). */
export function genFaces(level, rng) {
  const pool = EMO_AT(Math.min(level + (level >= 3 ? 1 : 0), 3));
  const target = rng.pick(pool);
  const variant = rng.int(0, 9);
  const n = level === 0 ? 3 : level <= 2 ? 3 : 4;
  const others = rng.sample(pool.filter((e) => e.id !== target.id), Math.min(n - 1, pool.length - 1));
  const opts = rng.shuffle([target, ...others]);
  if (level >= 2 && rng.chance(0.5)) {
    // Omvänt: vilket ansikte visar känslan? (svaren är ansikten)
    return {
      type: 'choice',
      prompt: `Vilket ansikte ser ${target.label} ut?`,
      say: `Vilket ansikte ser ${target.label} ut? Titta på ögonbrynen, ögonen och munnen.`,
      options: opts.map((e, i) => ({ id: e.id, html: faceSvg(e.id, variant + i, { size: 's' }), say: 'det här ansiktet' })),
      answer: target.id,
      wide: true,
      noSpeakVisual: true,
      hint: target.cue,
      explain: `${target.label[0].toUpperCase()}${target.label.slice(1)}: ${target.cue[0].toLowerCase()}${target.cue.slice(1)}`,
    };
  }
  const real = level === 0 ? false : level === 1 ? rng.chance(0.5) : true; // tecknat först, sedan riktiga foton (generalisering)
  return {
    type: 'choice',
    prompt: 'Hur känner sig personen, tror du?',
    say: 'Titta på ansiktet. Hur känner sig personen, tror du?',
    visual: `<div class="fe-face">${emotionVisual(target.id, { variant, real })}</div>`,
    options: opts.map(optWord),
    answer: target.id,
    hint: level <= 1 ? 'Titta på munnen och ögonbrynen.' : 'Titta på ögonbrynen, ögonen och munnen. Vad gör de?',
    explain: `Personen ser ${target.label} ut. ${target.cue}`,
  };
}

/* ---------- Situationer: vad kan personen känna? (och vad tänker hen?) ---------- */
export const SITUATIONS = [
  { lv: 1, text: 'Leo har längtat efter sitt kalas hela veckan. Nu ringer det på dörren och gästerna kommer.', answer: 'glad', wrong: ['arg', 'trott'], why: 'Han har längtat, och nu händer det han väntat på.' },
  { lv: 1, text: 'Mira har byggt ett högt torn av klossar. En kompis råkar stöta till det och tornet rasar.', answer: 'ledsen', wrong: ['stolt', 'lugn'], why: 'Något hon gjort med omsorg gick sönder. Det var en olycka, men det känns ändå tråkigt.' },
  { lv: 1, text: 'Ali sitter ensam i rummet. Plötsligt hörs en hög smäll från köket.', answer: 'radd', wrong: ['trott', 'stolt'], why: 'Ett plötsligt högt ljud kan få kroppen att bli rädd innan man vet vad det är.' },
  { lv: 1, text: 'Noor har sovit dåligt i natt. På morgonsamlingen gäspar hon och blundar.', answer: 'trott', wrong: ['arg', 'stolt'], why: 'Gäspningar och tunga ögon är tecken på att kroppen behöver sova.' },
  { lv: 1, text: 'Hugo kommer hem från skolan. När han öppnar dörren hoppar hela familjen fram och ropar: Grattis på födelsedagen!', answer: 'forvanad', wrong: ['trott', 'arg'], why: 'Han visste inte om det i förväg. Något oväntat gör oss förvånade.' },
  { lv: 2, text: 'Elias har stått länge i kön till rutschkanan. Någon tränger sig före.', answer: 'arg', wrong: ['glad', 'trott'], why: 'Att någon tränger sig före känns orättvist. Orättvisa gör ofta folk arga.' },
  { lv: 2, text: 'Ella öppnar matlådan. Maten har blivit gammal och luktar konstigt.', answer: 'acklad', wrong: ['stolt', 'lugn'], why: 'Gammal mat som luktar illa gör att man känner sig äcklad. Det skyddar kroppen från att äta den.' },
  { lv: 2, text: 'Klassen ska åka på utflykt i morgon. Olivia vet inte hur det ser ut där eller vad de ska göra.', answer: 'orolig', wrong: ['stolt', 'arg'], why: 'När man inte vet vad som ska hända kan man bli orolig. En plan med bilder kan hjälpa.' },
  { lv: 2, text: 'Isak ligger i hängmattan och lyssnar på fåglarna. Han har ingenting som han måste göra.', answer: 'lugn', wrong: ['arg', 'radd'], why: 'Ingen stress och mjuka ljud gör kroppen lugn.' },
  { lv: 3, text: 'Sara har övat på att cykla i två veckor. I dag cyklar hon hela vägen till skolan själv.', answer: 'stolt', wrong: ['ledsen', 'radd'], why: 'Hon har övat länge och klarat något svårt. Då känner man sig stolt.' },
  { lv: 3, text: 'Lukas frågar om han får vara med i leken på rasten. De andra säger nej.', answer: 'ledsen', wrong: ['stolt', 'lugn'], why: 'Att inte få vara med gör de flesta ledsna. En vuxen kan hjälpa till att hitta en lek.' },
  { lv: 3, text: 'Det har kommit en ny elev i klassen. Hen står ensam vid dörren och tittar ner i golvet.', answer: 'orolig', wrong: ['arg', 'stolt'], why: 'Allt är nytt för hen. Att titta ner och stå ensam kan vara tecken på att man är osäker eller orolig.' },
];

/** Tankar: vad tror personen? (falsk föreställning – nivå 4). */
export const THINKING = [
  { text: 'Vera lägger sin bok i väskan och går ut. Medan hon är ute flyttar pappa boken till hyllan. Vera kommer in igen. Var letar hon först?', answer: 'I väskan', wrong: ['På hyllan', 'Under sängen'], why: 'Vera såg inte att boken flyttades. Hon tror att den ligger där hon lade den.' },
  { text: 'Omar gömmer en kaka i den blå burken. När han går flyttar hans syster kakan till den röda burken. Var tror Omar att kakan är?', answer: 'I den blå burken', wrong: ['I den röda burken', 'Ingenstans'], why: 'Omar vet inte att kakan flyttades. Det vi inte sett vet vi inte.' },
  { text: 'Tilda har ont i magen men ler när fröken frågar hur det är. Vad känner Tilda inuti?', answer: 'Hon mår dåligt', wrong: ['Hon är glad', 'Hon är arg på fröken'], why: 'Ansiktet visar inte alltid hur man mår inuti. Därför är det bra att säga det med ord.' },
  { text: 'Ahmed ska flytta till en ny stad. Han ser fram emot sitt nya rum, men han kommer att sakna sina kompisar. Vad känner han?', answer: 'Både glad och ledsen', wrong: ['Bara glad', 'Bara arg'], why: 'Man kan känna två saker samtidigt. Det kallas blandade känslor.' },
];

/** Känslors styrka (som en skala 1–3). Ordnas från svagast till starkast. */
export const SCALES = [
  ['lite irriterad', 'arg', 'rasande'],
  ['orolig', 'rädd', 'livrädd'],
  ['nöjd', 'glad', 'överlycklig'],
  ['lite trött', 'trött', 'helt slut'],
];

export function genSituations(level, rng) {
  if (level >= 3 && rng.chance(0.3)) {
    const sc = rng.pick(SCALES);
    return {
      type: 'order',
      prompt: 'Ordna känslorna från svagast till starkast.',
      say: `Ordna känslorna från svagast till starkast: ${sc.join(', ')}.`,
      items: rng.shuffle(sc.map((w, i) => ({ id: `s${i}`, label: w, say: w }))),
      answerOrder: sc.map((_, i) => `s${i}`),
      hint: 'Tänk dig en termometer. Vilken känsla är minst varm, och vilken kokar?',
      explain: `${sc.join(' → ')}. Känslor kan vara svaga eller starka. Det hjälper att veta hur stark en känsla är.`,
    };
  }
  if (level >= 4 && rng.chance(0.5)) {
    const t = rng.pick(THINKING);
    const opts = rng.shuffle([t.answer, ...t.wrong]).map((w, i) => ({ id: `t${i}`, label: w, say: w }));
    return {
      type: 'choice',
      prompt: t.text,
      options: opts,
      answer: opts.find((o) => o.label === t.answer).id,
      hint: 'Vad har personen sett och inte sett?',
      explain: t.why,
    };
  }
  const pool = SITUATIONS.filter((s) => s.lv <= Math.max(1, level));
  const s = rng.pick(pool);
  const opts = rng.shuffle([s.answer, ...s.wrong].map((id) => emotionById(id))).map(optWord);
  return {
    type: 'choice',
    prompt: s.text,
    say: `${s.text} Hur kan det kännas?`,
    options: opts,
    answer: s.answer,
    hint: 'Tänk dig att det hände dig. Hur skulle det kännas?',
    explain: `${emotionById(s.answer).label[0].toUpperCase()}${emotionById(s.answer).label.slice(1)}. ${s.why}`,
  };
}

/* =====================================================================================
 * Kroppens signaler (interoception): vad säger kroppen? Nivå 0–1: behov (hunger, törst,
 * trötthet, toalett, kyla, värme). Nivå 2+: känslor som märks i kroppen. Svaren formuleras
 * försiktigt ("kanske"), eftersom det kan kännas olika för olika personer.
 * ===================================================================================== */
export const BODY_SIGNALS = [
  { lv: 0, icon: '🍽️', signal: 'Magen kurrar och känns tom.', means: 'Jag är hungrig.', fix: 'Äta något.' },
  { lv: 0, icon: '💧', signal: 'Munnen känns torr och klibbig.', means: 'Jag är törstig.', fix: 'Dricka vatten.' },
  { lv: 0, icon: '😴', signal: 'Ögonen känns tunga och jag gäspar.', means: 'Jag är trött.', fix: 'Vila eller sova.' },
  { lv: 0, icon: '🚽', signal: 'Det trycker längst ner i magen.', means: 'Jag behöver gå på toaletten.', fix: 'Gå på toaletten.' },
  { lv: 1, icon: '🥶', signal: 'Jag huttrar och får gåshud.', means: 'Jag fryser.', fix: 'Ta på en tröja.' },
  { lv: 1, icon: '🥵', signal: 'Jag svettas och kinderna blir röda.', means: 'Jag är varm.', fix: 'Ta av en tröja och dricka vatten.' },
  { lv: 2, icon: '🌋', signal: 'Hjärtat slår fort, ansiktet blir varmt och händerna knyts.', means: 'Jag är kanske arg.', fix: 'Andas ut långsamt och ta en paus.' },
  { lv: 2, icon: '🦋', signal: 'Det pirrar i magen och hjärtat slår fort, fast jag sitter still.', means: 'Jag är kanske nervös.', fix: 'Fråga vad som ska hända och andas lugnt.' },
  { lv: 2, icon: '🌧️', signal: 'Det känns tungt i bröstet och det svider i ögonen.', means: 'Jag är kanske ledsen.', fix: 'Berätta för någon och få tröst.' },
  { lv: 3, icon: '🌿', signal: 'Kroppen känns mjuk och andningen är långsam.', means: 'Jag är lugn.', fix: 'Fortsätta med det jag gör.' },
  { lv: 3, icon: '🔋', signal: 'Det surrar i huvudet och allt ljud känns för starkt.', means: 'Jag har fått för mycket intryck.', fix: 'Gå till en tyst plats en stund.' },
  { lv: 3, icon: '⚡', signal: 'Benen vill röra sig hela tiden och det är svårt att sitta still.', means: 'Kroppen behöver röra sig.', fix: 'Ta en rörelsepaus.' },
];

export function genSignals(level, rng) {
  const pool = BODY_SIGNALS.filter((s) => s.lv <= level);
  const s = rng.pick(pool);
  const others = rng.sample(pool.filter((x) => x !== s), 2);
  if (level >= 2 && rng.chance(0.4)) {
    // Vad kan hjälpa?
    const opts = rng.shuffle([s, ...others]).map((x, i) => ({ id: `f${i}`, label: x.fix, say: x.fix, ok: x === s }));
    return {
      type: 'choice',
      prompt: `${s.signal} Vad kan hjälpa?`,
      options: opts.map(({ ok, ...o }) => o),
      answer: opts.find((o) => o.ok).id,
      visual: `<div class="pic-big sm">${s.icon}</div>`,
      hint: 'Vad säger kroppen först? Vad behöver den då?',
      explain: `${s.means} Det som ofta hjälper: ${s.fix[0].toLowerCase()}${s.fix.slice(1)}`,
    };
  }
  const opts = rng.shuffle([s, ...others]).map((x, i) => ({ id: `m${i}`, label: x.means, say: x.means, ok: x === s }));
  return {
    type: 'choice',
    prompt: `Kroppen säger: ${s.signal[0].toLowerCase()}${s.signal.slice(1)} Vad kan det betyda?`,
    say: `Kroppen säger: ${s.signal} Vad kan det betyda?`,
    options: opts.map(({ ok, ...o }) => o),
    answer: opts.find((o) => o.ok).id,
    visual: `<div class="pic-big sm">${s.icon}</div>`,
    hint: 'Känn efter i din egen kropp. Var brukar det kännas?',
    explain: `${s.means} Det kan kännas olika för olika personer, och det är bra att lära känna sin egen kropp.`,
  };
}

/* ---------- Kroppskartan och verktygslådan (vyer, ingen rätt eller fel) ---------- */
export const BODY_PARTS = [
  { id: 'head', label: 'huvudet', x: 50, y: 11 },
  { id: 'face', label: 'ansiktet', x: 50, y: 19 },
  { id: 'throat', label: 'halsen', x: 50, y: 28 },
  { id: 'chest', label: 'bröstet', x: 50, y: 38 },
  { id: 'belly', label: 'magen', x: 50, y: 52 },
  { id: 'hands', label: 'händerna', x: 17, y: 56 },
  { id: 'legs', label: 'benen', x: 41, y: 80 },
];
export const MAP_FEELINGS = ['glad', 'arg', 'radd', 'ledsen', 'orolig', 'lugn'];

export const CALM_TOOLS = [
  { id: 'breathe', icon: '🌬️', title: 'Andas', text: 'Andas in medan cirkeln växer och ut medan den krymper.' },
  { id: 'help', icon: '🙋', title: 'Be om hjälp', text: 'Visa kortet för en vuxen eller säg: Jag behöver hjälp.' },
  { id: 'quiet', icon: '🤫', title: 'Tyst minut', text: 'En minut utan krav. Cirkeln visar när minuten är slut.' },
  { id: 'move', icon: '🤸', title: 'Röra på mig', text: 'En kort rörelsepaus: hoppa, sträck eller tryck.' },
  { id: 'press', icon: '🙏', title: 'Tryck hårt', text: 'Tryck handflatorna mot varandra och räkna till fem.' },
  { id: 'water', icon: '💧', title: 'Dricka vatten', text: 'Ett glas vatten kan göra kroppen lugnare.' },
  { id: 'ears', icon: '🎧', title: 'Hörselkåpor', text: 'Ta på hörselkåpor eller gå till en tystare plats.' },
  { id: 'count', icon: '🔢', title: 'Räkna baklänges', text: 'Räkna långsamt från tio ner till ett.' },
  { id: 'soft', icon: '🧸', title: 'Något mjukt', text: 'Krama ett gosedjur eller en kudde.' },
];

export const feelingsApp = {
  id: 'feelings',
  name: 'Känslor & jag',
  icon: '💛',
  color: '#e08a2c',
  tagline: 'Berättelser, ansikten, kroppen och det som hjälper',
  modules: [
    { id: 'stories', name: 'Sociala berättelser', icon: '📖', minLevel: 0, view: 'socialStories', lgr: ['sv-text', 'so-livsfragor'] },
    { id: 'faces', name: 'Läsa ansikten', icon: '🙂', minLevel: 0, gen: genFaces, lgr: ['sv-ord', 'no-halsa'] },
    { id: 'situations', name: 'Hur kan det kännas?', icon: '💭', minLevel: 0, gen: genSituations, lgr: ['sv-ord', 'so-livsfragor'] },
    { id: 'signals', name: 'Kroppens signaler', icon: '🫀', minLevel: 0, gen: genSignals, lgr: ['no-kropp', 'no-halsa'] },
    { id: 'bodymap', name: 'Var känns det?', icon: '🧍', minLevel: 0, view: 'bodyMap', lgr: ['no-kropp', 'sv-ord'] },
    { id: 'tools', name: 'Min verktygslåda', icon: '🧰', minLevel: 0, view: 'calmTools', lgr: ['no-halsa'] },
    { id: 'move', name: 'Rörelsepaus', icon: '🤸', minLevel: 0, view: 'moveBreak', lgr: ['no-halsa'] },
  ],
};
