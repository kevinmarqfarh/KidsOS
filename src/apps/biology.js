import { photo } from '../ui/img.js';

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

export function genBodyTap(level, rng) {
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
];
export function genSenses(level, rng) {
  const [q, ans] = rng.pick(SENSE_QUESTIONS);
  const opts = level === 0 ? rng.sample(SENSES.filter((s) => s.id !== ans), 2).concat(SENSES.find((s) => s.id === ans)) : SENSES;
  return {
    type: 'choice',
    prompt: `${q}. Vilket sinne använder du?`,
    options: rng.shuffle(opts).map((s) => ({ id: s.id, html: `<span class="pic sm">${s.e}</span><span>${s.name}</span>`, say: s.name })),
    answer: ans,
    hint: 'Vilken del av kroppen använder du?',
    explain: `Du använder ${SENSES.find((s) => s.id === ans).name}.`,
  };
}

/* ---------- Livscykler ---------- */
const svgIcon = (body) => `<svg viewBox="0 0 60 60" class="mini">${body}</svg>`;
const ICONS = {
  rom: svgIcon('<g fill="#cfe9ff" stroke="#5a8fb8" stroke-width="1.5">' + [[20, 22], [32, 18], [42, 26], [26, 34], [38, 38], [18, 42], [30, 46]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7"/><circle cx="${x}" cy="${y}" r="2.5" fill="#23324a"/>`).join('') + '</g>'),
  yngel: svgIcon('<ellipse cx="24" cy="30" rx="12" ry="9" fill="#3d4b2a"/><path d="M34 30 Q46 22 52 30 Q46 38 34 30" fill="#6b7a4a"/><circle cx="20" cy="28" r="2" fill="#fff"/>'),
  yngelben: svgIcon('<ellipse cx="26" cy="28" rx="13" ry="10" fill="#4b6b2a"/><path d="M38 28 Q48 22 54 28 Q48 34 38 28" fill="#6b8a4a"/><path d="M22 36 l-6 10 M30 37 l4 10" stroke="#4b6b2a" stroke-width="4" stroke-linecap="round"/><circle cx="21" cy="25" r="2" fill="#fff"/>'),
  puppa: svgIcon('<line x1="30" y1="4" x2="30" y2="12" stroke="#6b4a2a" stroke-width="3"/><path d="M30 12 Q44 24 38 44 Q30 56 22 44 Q16 24 30 12Z" fill="#9bc46a" stroke="#5c7a3a" stroke-width="2"/><path d="M24 26 h12 M23 34 h14 M25 42 h10" stroke="#5c7a3a" stroke-width="1.5"/>'),
  frö: svgIcon('<ellipse cx="30" cy="34" rx="10" ry="14" fill="#a0703c" stroke="#6b4a2a" stroke-width="2"/><path d="M30 22 v24" stroke="#6b4a2a" stroke-width="1.5"/><rect x="6" y="48" width="48" height="8" rx="3" fill="#7a5532"/>'),
  aggblad: svgIcon('<path d="M8 40 Q30 6 54 22 Q40 52 8 40Z" fill="#5cb85c"/><g fill="#fff6c8" stroke="#c8a800"><circle cx="28" cy="32" r="3"/><circle cx="36" cy="28" r="3"/><circle cx="32" cy="38" r="3"/></g>'),
};
export const LIFECYCLES = [
  { id: 'groda', name: 'grodan', stages: [{ id: 'rom', label: 'romkorn', html: ICONS.rom }, { id: 'yngel', label: 'grodyngel', html: ICONS.yngel }, { id: 'yngelben', label: 'grodyngel med ben', html: ICONS.yngelben }, { id: 'groda', label: 'groda', html: '<span class="pic">🐸</span>' }], fact: 'Grodan lägger rom i vattnet. Grodynglet andas med gälar, får ben och blir till slut en groda som kan hoppa upp på land.' },
  { id: 'fjaril', name: 'fjärilen', stages: [{ id: 'agg', label: 'ägg på ett blad', html: ICONS.aggblad }, { id: 'larv', label: 'larv', html: '<span class="pic">🐛</span>' }, { id: 'puppa', label: 'puppa', html: ICONS.puppa }, { id: 'fjaril', label: 'fjäril', html: '<span class="pic">🦋</span>' }], fact: 'Larven äter och växer, gör en puppa och inne i puppan förvandlas den till en fjäril. Det kallas förvandling.' },
  { id: 'blomma', name: 'solrosen', stages: [{ id: 'fro', label: 'frö', html: ICONS.frö }, { id: 'grodd', label: 'grodd', html: '<span class="pic">🌱</span>' }, { id: 'planta', label: 'planta', html: '<span class="pic">🌿</span>' }, { id: 'blomma', label: 'blomma', html: '<span class="pic">🌻</span>' }], fact: 'Fröet gror i jorden när det får vatten och värme. Blomman gör nya frön – och så börjar det om!' },
  { id: 'fagel', name: 'fågeln', stages: [{ id: 'agg', label: 'ägg', html: '<span class="pic">🥚</span>' }, { id: 'klacks', label: 'kläcks', html: '<span class="pic">🐣</span>' }, { id: 'unge', label: 'fågelunge', html: '<span class="pic">🐥</span>' }, { id: 'vuxen', label: 'vuxen fågel', html: '<span class="pic">🐓</span>' }], fact: 'Fågelungen växer inne i ägget, kläcks och matas tills den kan klara sig själv.' },
  { id: 'manniska', name: 'människan', stages: [{ id: 'bebis', label: 'bebis', html: '<span class="pic">👶</span>' }, { id: 'barn', label: 'barn', html: '<span class="pic">🧒</span>' }, { id: 'vuxen', label: 'vuxen', html: '<span class="pic">🧑</span>' }, { id: 'aldre', label: 'äldre', html: '<span class="pic">🧓</span>' }], fact: 'Människor växer långsamt. Det tar ungefär 18 år att bli vuxen!' },
];
export function genLifecycle(level, rng) {
  const lc = rng.pick(level === 0 ? LIFECYCLES.filter((l) => ['fagel', 'manniska', 'blomma'].includes(l.id)) : LIFECYCLES);
  const n = level === 0 ? 3 : 4;
  const stages = n === 3 ? [lc.stages[0], lc.stages[1], lc.stages[3]] : lc.stages;
  return {
    type: 'order',
    prompt: `Hur växer ${lc.name}? Tryck i rätt ordning – från början till slut.`,
    items: rng.shuffle(stages).map((s) => ({ id: s.id, html: `${s.html}<span class="lbl">${s.label}</span>`, say: s.label })),
    answerOrder: stages.map((s) => s.id),
    hint: 'Vad kommer allra först? Ett ägg, ett frö eller en bebis?',
    explain: lc.fact,
  };
}

/* ---------- Näringskedjor ---------- */
export const FOOD_CHAINS = [
  [{ id: 'gras', e: '🌿', n: 'gräs' }, { id: 'hare', e: '🐇', n: 'hare' }, { id: 'rav', e: '🦊', n: 'räv' }],
  [{ id: 'blad', e: '🍃', n: 'blad' }, { id: 'larv', e: '🐛', n: 'larv' }, { id: 'fagel', e: '🐦', n: 'blåmes' }, { id: 'hok', e: '🦅', n: 'hök' }],
  [{ id: 'alger', e: '🌊', n: 'alger' }, { id: 'fisk', e: '🐟', n: 'fisk' }, { id: 'sal', e: '🦭', n: 'säl' }],
  [{ id: 'ekollon', e: '🌰', n: 'ekollon' }, { id: 'mus', e: '🐭', n: 'mus' }, { id: 'uggla', e: '🦉', n: 'uggla' }],
  [{ id: 'blabar', e: '🫐', n: 'blåbär' }, { id: 'bjorn', e: '🐻', n: 'björn' }],
  [{ id: 'blomma', e: '🌼', n: 'blomma' }, { id: 'fluga', e: '🪰', n: 'fluga' }, { id: 'groda', e: '🐸', n: 'groda' }, { id: 'snok', e: '🐍', n: 'snok' }],
];
export function genFoodChain(level, rng) {
  const pool = FOOD_CHAINS.filter((c) => (level <= 1 ? c.length <= 3 : true));
  const chain = rng.pick(pool);
  if (level <= 1 && rng.chance(0.5)) {
    const i = rng.int(1, chain.length - 1);
    const eater = chain[i];
    const food = chain[i - 1];
    const others = rng.sample(FOOD_CHAINS.flat().filter((x) => x.id !== food.id && x.id !== eater.id), 2);
    return {
      type: 'choice', prompt: `Vad äter en ${eater.n}? ${eater.e}`, say: `Vad äter en ${eater.n}?`,
      options: rng.shuffle([food, ...others]).map((x) => ({ id: x.id, html: `<span class="pic sm">${x.e}</span><span>${x.n}</span>`, say: x.n })),
      answer: food.id, hint: 'Tänk på vad djuret behöver för att få energi.', explain: `En ${eater.n} äter ${food.n}.`,
    };
  }
  return {
    type: 'order',
    prompt: 'Bygg en näringskedja! Börja med växten som får energi från solen ☀️.',
    items: rng.shuffle(chain).map((x) => ({ id: x.id, html: `<span class="pic sm">${x.e}</span><span class="lbl">${x.n}</span>`, say: x.n })),
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
  { id: 'bad', e: '🏊', n: 'bada i sjön', bin: 'sommar' },
  { id: 'jordgubbe', e: '🍓', n: 'jordgubbar', bin: 'sommar' },
  { id: 'midsommar', e: '💐', n: 'midsommar', bin: 'sommar' },
  { id: 'lov', e: '🍁', n: 'löven blir röda', bin: 'host' },
  { id: 'svamp', e: '🍄', n: 'svampar i skogen', bin: 'host' },
  { id: 'applen', e: '🍎', n: 'plocka äpplen', bin: 'host' },
  { id: 'knopp', e: '🌱', n: 'knoppar spricker', bin: 'var' },
  { id: 'sippa', e: '🌸', n: 'vitsippor', bin: 'var' },
  { id: 'faglar', e: '🐦', n: 'flyttfåglar kommer tillbaka', bin: 'var' },
];
export const SEASON_FACTS = [
  { q: 'Vad gör igelkotten på vintern?', a: 'sover i ide', o: ['sover i ide', 'flyger söderut', 'bygger snögubbar'], ex: 'Igelkotten går i ide – den sover nästan hela vintern i ett bo av löv.' },
  { q: 'Varför flyger svalorna söderut på hösten?', a: 'det finns inga insekter att äta här på vintern', o: ['det finns inga insekter att äta här på vintern', 'de vill bada', 'de är rädda för snö'], ex: 'Svalor äter insekter. På vintern finns inga flygande insekter i Sverige, så de flyttar till Afrika.' },
  { q: 'Varför fäller björken sina löv på hösten?', a: 'för att klara vintern', o: ['för att klara vintern', 'för att löven är trötta', 'för att vinden blåser bort dem'], ex: 'Löven skulle frysa sönder. Trädet sparar på vatten och energi och får nya löv på våren.' },
  { q: 'Vad gör haren för att gömma sig i snön?', a: 'den får vit päls', o: ['den får vit päls', 'den gräver ner sig', 'den flyttar till stan'], ex: 'Skogsharen byter till vit vinterpäls så att den syns sämre i snön.' },
  { q: 'När är dagarna som längst i Sverige?', a: 'på sommaren', o: ['på sommaren', 'på vintern', 'på hösten'], ex: 'Runt midsommar är det ljust nästan hela dygnet – i norra Sverige går solen inte ens ner!' },
  { q: 'Vad gör björnen på vintern?', a: 'sover i ett ide', o: ['sover i ett ide', 'fiskar i havet', 'flyttar till Afrika'], ex: 'Björnen sover vintersömn i ett ide. På våren vaknar den jättehungrig.' },
];
export function genSeasons(level, rng) {
  if (level >= 1 && rng.chance(0.45)) {
    const f = rng.pick(SEASON_FACTS);
    return {
      type: 'choice', prompt: f.q, options: rng.shuffle(f.o).map((o) => ({ id: o, label: o })), answer: f.a,
      hint: 'Tänk på hur det är ute på vintern – kallt, mörkt och lite mat.', explain: f.ex,
    };
  }
  const bins = level === 0 ? rng.sample(SEASON_BINS, 2) : SEASON_BINS;
  const items = rng.sample(SEASON_ITEMS.filter((i) => bins.some((b) => b.id === i.bin)), level === 0 ? 4 : 6);
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
  { id: 'kraldjur', label: 'Kräldjur', html: '🦎', fact: 'Kräldjur har torr, fjällig hud och lägger ägg.' },
];
export const ANIMALS = [
  { id: 'ko', e: '🐄', n: 'ko', g: 'daggdjur' }, { id: 'hund', e: '🐕', n: 'hund', g: 'daggdjur' }, { id: 'val', e: '🐋', n: 'val', g: 'daggdjur', tricky: true },
  { id: 'fladdermus', e: '🦇', n: 'fladdermus', g: 'daggdjur', tricky: true }, { id: 'ekorre', e: '🐿️', n: 'ekorre', g: 'daggdjur' },
  { id: 'pingvin', e: '🐧', n: 'pingvin', g: 'faglar', tricky: true }, { id: 'uggla', e: '🦉', n: 'uggla', g: 'faglar' }, { id: 'anka', e: '🦆', n: 'anka', g: 'faglar' },
  { id: 'haj', e: '🦈', n: 'haj', g: 'fiskar' }, { id: 'fisk', e: '🐠', n: 'clownfisk', g: 'fiskar' }, { id: 'abborre', e: '🐟', n: 'abborre', g: 'fiskar' },
  { id: 'bi', e: '🐝', n: 'bi', g: 'insekter' }, { id: 'nyckelpiga', e: '🐞', n: 'nyckelpiga', g: 'insekter' }, { id: 'myra', e: '🐜', n: 'myra', g: 'insekter' }, { id: 'fjaril', e: '🦋', n: 'fjäril', g: 'insekter' },
  { id: 'groda', e: '🐸', n: 'groda', g: 'groddjur' }, { id: 'salamander', e: '🦎', n: 'salamander', g: 'groddjur', tricky: true },
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
    items: items.map((a) => ({ id: a.id, html: `<span class="pic sm">${a.e}</span><span class="lbl">${a.n}</span>`, bin: a.g, say: a.n })),
    hint: bins.map((b) => b.fact).join(' '),
    explain: bins.map((b) => b.fact).join(' '),
  };
}

/* ---------- Svenska arter (samlarkort) ---------- */
export const SPECIES = [
  { id: 'ekorre', n: 'ekorre', e: '🐿️', g: 'Däggdjur', fact: 'Ekorren gömmer nötter och kottar till vintern. Den kan hoppa flera meter mellan träden.' },
  { id: 'igelkott', n: 'igelkott', e: '🦔', g: 'Däggdjur', fact: 'Igelkotten har ungefär 6 000 taggar och går i ide på vintern.' },
  { id: 'rav', n: 'räv', e: '🦊', g: 'Däggdjur', fact: 'Räven har jättebra hörsel – den kan höra en mus under snön.' },
  { id: 'hare', n: 'skogshare', e: '🐇', g: 'Däggdjur', fact: 'Skogsharen blir vit på vintern så att den syns sämre i snön.' },
  { id: 'gravling', n: 'grävling', e: '🦡', g: 'Däggdjur', fact: 'Grävlingen bor i ett gryt under jorden och är vaken på natten.' },
  { id: 'bjorn', n: 'brunbjörn', e: '🐻', g: 'Däggdjur', fact: 'Björnen sover vintersömn i ett ide. Ungarna föds mitt i vintern.' },
  { id: 'varg', n: 'varg', e: '🐺', g: 'Däggdjur', fact: 'Vargar lever i flockar och kan höras yla på långt håll.' },
  { id: 'radjur', n: 'rådjur', e: '🦌', g: 'Däggdjur', fact: 'Rådjurskiden har vita prickar som gör att de syns sämre i skogen.' },
  { id: 'sal', n: 'säl', e: '🦭', g: 'Däggdjur', fact: 'Sälen är ett däggdjur som lever i havet. Den kan hålla andan länge när den dyker.' },
  { id: 'uggla', n: 'kattuggla', e: '🦉', g: 'Fåglar', fact: 'Ugglan jagar på natten och kan vrida huvudet nästan ett helt varv.' },
  { id: 'svan', n: 'knölsvan', e: '🦢', g: 'Fåglar', fact: 'Svanen är en av Sveriges största fåglar och har en knöl på näbben.' },
  { id: 'grasand', n: 'gräsand', e: '🦆', g: 'Fåglar', fact: 'Gräsandshanen har grönt glänsande huvud. Honan är brunspräcklig.' },
  { id: 'orn', n: 'havsörn', e: '🦅', g: 'Fåglar', fact: 'Havsörnen är Sveriges största rovfågel. Vingarna är över två meter breda!' },
  { id: 'nyckelpiga', n: 'nyckelpiga', e: '🐞', g: 'Insekter', fact: 'Nyckelpigan äter bladlöss och hjälper därför trädgården.' },
  { id: 'humla', n: 'humla', e: '🐝', g: 'Insekter', fact: 'Humlor pollinerar blommor och kan flyga även när det är kallt.' },
  { id: 'citronfjaril', n: 'citronfjäril', e: '🦋', g: 'Insekter', fact: 'Citronfjärilen är ofta den första fjärilen man ser på våren.' },
  { id: 'myra', n: 'stackmyra', e: '🐜', g: 'Insekter', fact: 'Stackmyror bygger stora stackar av barr – där kan det bo hundratusentals myror.' },
  { id: 'snigel', n: 'snigel', e: '🐌', g: 'Blötdjur', fact: 'Snigeln bär sitt hus på ryggen och glider fram på slem.' },
  { id: 'daggmask', n: 'daggmask', e: '🪱', g: 'Maskar', fact: 'Daggmasken gör jorden bra för växter genom att gräva gångar och äta döda löv.' },
  { id: 'spindel', n: 'korsspindel', e: '🕷️', g: 'Spindeldjur', fact: 'Spindlar är inga insekter – de har åtta ben! Korsspindeln spinner fina hjulnät.' },
  { id: 'blabar', n: 'blåbär', e: '🫐', g: 'Växter', fact: 'Blåbär växer i skogen och mognar i juli och augusti.' },
  { id: 'flugsvamp', n: 'röd flugsvamp', e: '🍄', g: 'Svampar', fact: 'Röd flugsvamp är vacker men GIFTIG. Plocka aldrig svamp utan en vuxen!' },
  { id: 'gran', n: 'gran', e: '🌲', g: 'Växter', fact: 'Granen är ett barrträd som är grönt hela året. Kottarna hänger nedåt.' },
  { id: 'ek', n: 'ek', e: '🌳', g: 'Växter', fact: 'Eken kan bli över 1 000 år gammal. Dess frukter heter ekollon.' },
  { id: 'maskros', n: 'maskros', e: '🌼', g: 'Växter', fact: 'Maskrosens frön har små fallskärmar och sprids med vinden.' },
];
export function genSpecies(level, rng, ctx = {}) {
  // Prioritera arter som barnet inte har samlat än.
  const found = ctx.found || {};
  const unseen = SPECIES.filter((s) => !found[s.id]);
  const target = unseen.length && rng.chance(0.7) ? rng.pick(unseen) : rng.pick(SPECIES);
  const others = rng.sample(SPECIES.filter((s) => s.id !== target.id), level === 0 ? 2 : 3);
  return {
    type: 'choice',
    prompt: 'Vad heter den här arten?',
    visual: photo(target.id, { alt: '', cls: 'qphoto', fallback: `<div class="pic-big">${target.e}</div>` }),
    options: rng.shuffle([target, ...others]).map((s) => ({ id: s.id, label: s.n })),
    answer: target.id,
    hint: `Det är ${target.g.toLowerCase()}.`,
    explain: target.fact,
    collect: { set: 'species', item: target.id, label: `Nytt artkort: ${target.n}!` },
  };
}

/* ---------- Må bra ---------- */
export const HEALTH = [
  { q: 'Hur länge behöver ett barn i skolåldern sova varje natt?', a: '9–12 timmar', o: ['9–12 timmar', '3–4 timmar', '20 timmar'], ex: 'Barn mellan 6 och 12 år behöver ungefär 9–12 timmars sömn. När du sover växer kroppen och hjärnan sparar det du lärt dig.' },
  { q: 'Varför ska man tvätta händerna innan man äter?', a: 'för att få bort bakterier', o: ['för att få bort bakterier', 'för att händerna ska bli varma', 'för att det luktar gott'], ex: 'Med tvål och vatten tvättar du bort bakterier och virus så att du inte blir sjuk.' },
  { q: 'Hur länge ska du borsta tänderna?', a: 'två minuter', o: ['två minuter', 'fem sekunder', 'en timme'], ex: 'Borsta två minuter, morgon och kväll, med fluortandkräm.' },
  { q: 'Vad händer i kroppen när du rör på dig?', a: 'hjärtat och musklerna blir starkare', o: ['hjärtat och musklerna blir starkare', 'du blir mer trött för alltid', 'ingenting'], ex: 'Rörelse gör hjärtat, musklerna och skelettet starka – och man blir ofta glad av det!' },
  { q: 'Vilken mat ger mycket energi och vitaminer?', a: 'frukt och grönsaker', o: ['frukt och grönsaker', 'godis', 'läsk'], ex: 'Frukt och grönsaker har vitaminer och fibrer. Godis är okej ibland, men ger kort energi.' },
  { q: 'Vad kan du göra om en kompis är ledsen?', a: 'fråga hur kompisen mår', o: ['fråga hur kompisen mår', 'gå därifrån', 'skratta'], ex: 'Att vara en bra vän och ha vänner är viktigt för att må bra.' },
  { q: 'Vad dricker kroppen bäst när man är törstig?', a: 'vatten', o: ['vatten', 'saft', 'läsk'], ex: 'Vatten är det bästa för kroppen – och det kommer gratis ur kranen i Sverige!' },
  { q: 'Varför är det bra att lägga bort skärmen en stund före sängen?', a: 'man somnar lättare', o: ['man somnar lättare', 'skärmen blir trött', 'det blir mörkare ute'], ex: 'Starkt ljus från skärmar kan göra det svårare att somna.' },
];
export function genHealth(level, rng) {
  const item = rng.pick(HEALTH);
  return {
    type: 'choice', prompt: item.q, options: rng.shuffle(item.o).map((o) => ({ id: o, label: o })), answer: item.a,
    hint: 'Vad mår kroppen bäst av?', explain: item.ex,
  };
}

export const biologyApp = {
  id: 'biology',
  name: 'Biologi',
  icon: '🌿',
  color: '#2fae66',
  tagline: 'Kroppen, djuren och naturen',
  modules: [
    { id: 'bodyexplore', name: 'Utforska kroppen', icon: '🧍', minLevel: 0, view: 'body', lgr: ['no-kropp'] },
    { id: 'bodytap', name: 'Var är …?', icon: '👆', minLevel: 0, gen: genBodyTap, lgr: ['no-kropp'] },
    { id: 'senses', name: 'Sinnena', icon: '👃', minLevel: 0, gen: genSenses, lgr: ['no-sinnen'] },
    { id: 'seasons', name: 'Årstider', icon: '🍂', minLevel: 0, gen: genSeasons, lgr: ['no-arstid', 'no-livscykel'] },
    { id: 'lifecycle', name: 'Livscykler', icon: '🐛', minLevel: 0, gen: genLifecycle, lgr: ['no-livscykel'] },
    { id: 'species', name: 'Artkort', icon: '🃏', minLevel: 0, gen: genSpecies, lgr: ['no-arter'], photo: () => photo('ekorre', { cls: 'tile-photo' }) },
    { id: 'groups', name: 'Djurgrupper', icon: '🐾', minLevel: 1, gen: genAnimalGroups, lgr: ['no-arter'] },
    { id: 'foodchain', name: 'Näringskedjor', icon: '🦊', minLevel: 1, gen: genFoodChain, lgr: ['no-kedja'] },
    { id: 'health', name: 'Må bra', icon: '💪', minLevel: 1, gen: genHealth, lgr: ['no-halsa'] },
  ],
};
