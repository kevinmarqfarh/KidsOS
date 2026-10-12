// Autismstöd (tidigare "Anpassat läge") – ren logik (ingen DOM, ingen lagring) så att den kan enhetstestas.
// Utgångspunkt: autism nivå 2 enligt DSM-5 UTAN intellektuell funktionsnedsättning (IF). Läget sänker
// därför inte den kognitiva nivån – svårigheten följer ålder och den adaptiva nivån som vanligt.
// I stället anpassas struktur, förutsägbarhet, övergångar, sensorik och motivation.
// Om föräldern anger att barnet också har IF slås färre svarsalternativ och felfri inlärning på.
// Bakgrund och källor: docs/ANPASSAT-LAGE.md.

/** Version av föräldrainställningarna. Saknas den är det ett äldre "Anpassat läge" som migreras. */
export const PREFS_VERSION = 2;

/** Antal frågor per pass som föräldern kan välja. */
export const ADAPTED_QUESTION_CHOICES = [3, 4, 5, 6, 8];
/** Max antal svarsalternativ. 0 = som vanligt (ingen minskning) – standard utan IF. */
export const ADAPTED_OPTION_CHOICES = [0, 3, 2];

/** Stödnivåer enligt DSM-5 (svensk översättning inom parentes). Nivån styr bara förinställningar. */
export const SUPPORT_LEVELS = [
  { id: 1, label: 'Nivå 1', title: 'Behöver stöd', hint: 'Lite mer struktur och förvarning räcker oftast.' },
  { id: 2, label: 'Nivå 2', title: 'Behöver omfattande stöd', hint: 'Ofta kallat måttligt stöd. Tydligt schema, förvarning före övergångar, känslokoll och lugn-hörna.' },
  { id: 3, label: 'Nivå 3', title: 'Behöver mycket omfattande stöd', hint: 'Kortare pass och mest struktur.' },
];

/** Hur ett fel hanteras: 'retry' = mjukt "prova igen" med ledtråd, 'errorless' = felfri inlärning (visa rätt och gör om). */
export const ERROR_MODES = ['retry', 'errorless'];

/**
 * Specialintressen – tema och motivation. Ikonen blir barnets pollett (token) och "kompis" i återkopplingen.
 * Allt är generiskt (inga varumärken). `cheer` är en kort temafras som ingår i det förutsägbara berömmet.
 */
export const INTERESTS = [
  { id: 'animals', label: 'Djur', icon: '🐶', cheer: 'Voff, rätt!', items: [['🐶', 'en hund'], ['🐱', 'en katt'], ['🐰', 'en kanin'], ['🐸', 'en groda'], ['🐼', 'en panda'], ['🐘', 'en elefant']] },
  { id: 'space', label: 'Rymden', icon: '🚀', cheer: 'Raketfart!', items: [['🚀', 'en raket'], ['🌙', 'en måne'], ['⭐', 'en stjärna'], ['🪐', 'en planet'], ['☀️', 'en sol'], ['👩‍🚀', 'en astronaut']] },
  { id: 'vehicles', label: 'Fordon', icon: '🚗', cheer: 'Full fart!', items: [['🚗', 'en bil'], ['🚌', 'en buss'], ['🚂', 'ett tåg'], ['🚒', 'en brandbil'], ['🚜', 'en traktor'], ['✈️', 'ett flygplan']] },
  { id: 'dinos', label: 'Dinosaurier', icon: '🦖', cheer: 'Dinobra!', items: [['🦖', 'en dinosaurie'], ['🦕', 'en långhals'], ['🥚', 'ett ägg'], ['🌴', 'en palm'], ['🦴', 'ett ben'], ['👣', 'fotspår']] },
  { id: 'blocks', label: 'Byggblock', icon: '🧱', cheer: 'Bra byggt!', items: [['🧱', 'en kloss'], ['⛏️', 'en hacka'], ['💎', 'en diamant'], ['🌳', 'ett träd'], ['🏠', 'ett hus'], ['🪵', 'en planka']] },
  { id: 'ocean', label: 'Havet', icon: '🐠', cheer: 'Plask, rätt!', items: [['🐠', 'en fisk'], ['🐙', 'en bläckfisk'], ['🐳', 'en val'], ['🐢', 'en sköldpadda'], ['🦀', 'en krabba'], ['🐬', 'en delfin']] },
  { id: 'music', label: 'Musik', icon: '🎵', cheer: 'Snyggt spelat!', items: [['🥁', 'en trumma'], ['🎸', 'en gitarr'], ['🎹', 'ett piano'], ['🎺', 'en trumpet'], ['🎻', 'en fiol'], ['🎵', 'en ton']] },
];

/** Belöningar som är sensoriskt trevliga men förutsägbara. */
export const REWARDS = [
  { id: 'bubbles', label: 'Bubblor', icon: '🫧', say: 'Tryck på bubblorna.' },
  { id: 'stars', label: 'Stjärnhimmel', icon: '✨', say: 'Tryck på himlen. Då tänds en stjärna.' },
  { id: 'friends', label: 'Mina favoriter', icon: '🎁', say: 'Tryck. Då kommer en ny.' },
];

/** Känslokort för "Hur mår du?" (känsloreglering med bildstöd). */
export const FEELINGS = [
  { id: 'good', icon: '😊', label: 'Bra' },
  { id: 'ok', icon: '😐', label: 'Okej' },
  { id: 'worried', icon: '😟', label: 'Orolig' },
  { id: 'tired', icon: '🥱', label: 'Trött' },
  { id: 'angry', icon: '😠', label: 'Arg' },
];

/** Förinställningar per stödnivå och IF. Används när föräldern byter nivå – finjusteringar kan göras efteråt. */
export function presetFor(support = 2, intellectual = false) {
  const s = [1, 2, 3].includes(Number(support)) ? Number(support) : 2;
  const base = {
    1: { questions: 6, focus: false, checkin: false, warnings: true },
    2: { questions: 5, focus: true, checkin: true, warnings: true },
    3: { questions: 4, focus: true, checkin: true, warnings: true },
  }[s];
  const id = intellectual === true;
  return {
    ...base,
    support: s,
    intellectual: id,
    // Utan IF: samma antal alternativ som alla andra (kognitiv nivå enligt ålder).
    options: id ? (s === 3 ? 2 : 3) : 0,
    errorMode: id ? 'errorless' : 'retry',
  };
}

export const ADAPTED_DEFAULTS = Object.freeze({
  v: PREFS_VERSION,
  ...presetFor(2, false),
  sound: true, // mjuka ljudeffekter (uppläsningen styrs separat)
  motion: true, // mjuka, långsamma animationer
  calm: true, // dämpade färger
  hideStreak: true, // ingen "dagar i rad"-flamma (undviker streak-stress)
  interest: 'animals',
  reward: 'bubbles',
});

export function defaultAdaptedPrefs() {
  return { ...ADAPTED_DEFAULTS };
}

const bool = (v, fallback) => (typeof v === 'boolean' ? v : fallback);

/**
 * Lagar/migrerar föräldrarnas finjusteringar. Okända eller trasiga värden ersätts med standard.
 * Äldre inställningar (utan `v`) kom från läget för autism + IF, där 3 alternativ var standard.
 * Det gamla standardvärdet byts därför mot det nya (som vanligt) – aktiva val (2 eller "som vanligt") behålls.
 */
export function normalizeAdaptedPrefs(raw) {
  const r = raw && typeof raw === 'object' ? raw : {};
  const legacy = Object.keys(r).length > 0 && r.v !== PREFS_VERSION;
  const intellectual = r.intellectual === true;
  const support = [1, 2, 3].includes(Number(r.support)) ? Number(r.support) : 2;
  const out = { ...defaultAdaptedPrefs(), ...presetFor(support, intellectual) };
  const q = Math.round(Number(r.questions));
  if (r.questions !== undefined && r.questions !== null && r.questions !== '' && Number.isFinite(q)) out.questions = Math.max(3, Math.min(10, q));
  if (r.options !== undefined && r.options !== null && r.options !== '' && !(legacy && Number(r.options) === 3)) {
    const o = Math.round(Number(r.options));
    if (o === 0) out.options = 0;
    else if (Number.isFinite(o)) out.options = Math.max(2, Math.min(4, o));
  }
  if (ERROR_MODES.includes(r.errorMode)) out.errorMode = r.errorMode;
  for (const k of ['sound', 'motion', 'calm', 'focus', 'checkin', 'warnings', 'hideStreak']) out[k] = bool(r[k], out[k]);
  if (INTERESTS.some((i) => i.id === r.interest)) out.interest = r.interest;
  if (REWARDS.some((i) => i.id === r.reward)) out.reward = r.reward;
  out.v = PREFS_VERSION;
  return out;
}

/** Normaliserar de två profilfälten (bakåtkompatibelt: saknas de blir läget av). */
export function normalizeAdaptedSettings(settings) {
  const s = settings && typeof settings === 'object' ? settings : {};
  return { adapted: s.adapted === true, adaptedPrefs: normalizeAdaptedPrefs(s.adaptedPrefs) };
}

export function isAdapted(profile) {
  return profile?.settings?.adapted === true;
}

export function adaptedPrefs(profile) {
  return normalizeAdaptedPrefs(profile?.settings?.adaptedPrefs);
}

export function interestFor(prefsOrId) {
  const id = typeof prefsOrId === 'string' ? prefsOrId : prefsOrId?.interest;
  return INTERESTS.find((i) => i.id === id) || INTERESTS[0];
}

export function rewardFor(prefsOrId) {
  const id = typeof prefsOrId === 'string' ? prefsOrId : prefsOrId?.reward;
  return REWARDS.find((r) => r.id === id) || REWARDS[0];
}

export function supportFor(prefsOrId) {
  const id = typeof prefsOrId === 'object' && prefsOrId ? prefsOrId.support : prefsOrId;
  return SUPPORT_LEVELS.find((s) => s.id === Number(id)) || SUPPORT_LEVELS[1];
}

/** Antal frågor i ett pass. Utan läget gäller ordinarie längd. */
export function sessionLength(profile, normalLength) {
  if (!isAdapted(profile)) return normalLength;
  return adaptedPrefs(profile).questions;
}

/**
 * Behåller rätt svar och de första (max − 1) felaktiga alternativen i ursprunglig ordning.
 * max = 0 eller fler än som finns → oförändrat. Muterar inte indata.
 */
export function reduceOptions(options, answerId, max) {
  if (!Array.isArray(options)) return options;
  const m = Number(max) || 0;
  if (!m || options.length <= m) return options.slice();
  const answerIdx = options.findIndex((o) => o?.id === answerId);
  if (answerIdx < 0) return options.slice(); // okänd struktur – rör inte
  let keepWrong = Math.max(1, m - 1);
  return options.filter((o, i) => {
    if (i === answerIdx) return true;
    if (keepWrong > 0) {
      keepWrong--;
      return true;
    }
    return false;
  });
}

/**
 * Anpassar en genererad fråga. Svårighetsnivån rörs aldrig. Bara om föräldern valt "högst N alternativ"
 * (standard vid IF) blir flervalsfrågor kortare. Returnerar en ny fråga.
 */
export function adaptQuestion(q, prefs) {
  if (!q || typeof q !== 'object') return q;
  const p = normalizeAdaptedPrefs(prefs);
  const out = { ...q, adapted: true };
  if (p.options && q.type === 'choice' && Array.isArray(q.options) && !q.multi) {
    out.options = reduceOptions(q.options, q.answer, p.options);
  }
  return out;
}

/**
 * Felfri inlärning (läget 'errorless'): vad händer efter ett fel?
 * Första felet → visa rätt svar tydligt och gör om frågan (med markering på rätt svar).
 * Om det blir fel även då → visa svaret lugnt och gå vidare (aldrig en lång felspiral).
 */
export function errorlessNext(redoCount) {
  return (Number(redoCount) || 0) < 1 ? 'redo' : 'reveal';
}

/** Mjuk text vid fel i läget 'retry'. Aldrig "fel" – bara en lugn uppmaning och ev. ledtråd. */
export function softRetryText(hint) {
  const h = typeof hint === 'string' && hint.trim() ? hint.trim() : '';
  return { title: 'Prova en gång till.', text: h, say: h ? `Prova en gång till. ${h}` : 'Prova en gång till.' };
}

/** Ljud: inga skarpa fel- eller fanfarljud, bara mjuka bekräftelser. Inget alls när ljudet är av. */
const SOFT_SFX = { wrong: null, boom: null, whoosh: null, fanfare: 'star', trophy: 'star' };
export function adaptedSfx(name, prefs) {
  const p = normalizeAdaptedPrefs(prefs);
  if (!p.sound) return null;
  if (Object.prototype.hasOwnProperty.call(SOFT_SFX, name)) return SOFT_SFX[name];
  return name;
}

/** Korta, konkreta och alltid positiva fraser i fast ordning (förutsägbart). Intressets fras ingår. */
export const PRAISE = ['Bra!', 'Rätt!', 'Snyggt!', 'Ja, rätt!', 'Bra jobbat!'];
export function praiseFor(index, prefs) {
  const list = prefs ? [...PRAISE.slice(0, 2), interestFor(prefs).cheer, ...PRAISE.slice(2)] : PRAISE;
  const i = Math.abs(Math.round(Number(index) || 0)) % list.length;
  return list[i];
}

/** Text för först–sen-remsan. */
export function firstThenText(total, prefs) {
  const reward = rewardFor(prefs);
  const n = Math.max(1, Number(total) || 1);
  return { first: `Först ${n} ${n === 1 ? 'uppgift' : 'uppgifter'}`, then: `Sen ${reward.label.toLowerCase()}` };
}

const NUM_WORDS = ['noll', 'en', 'två', 'tre', 'fyra', 'fem', 'sex', 'sju', 'åtta', 'nio', 'tio'];

/**
 * Hur många uppgifter som är kvar när uppgift nr `index` (0-baserat) visas – den aktuella räknas med.
 * Används för den visuella "kvar"-klockan (som en Time Timer, men räknad i uppgifter i stället för minuter).
 */
export function tasksLeft(index, total) {
  const t = Math.max(1, Number(total) || 1);
  const i = Math.max(0, Math.min(t, Math.round(Number(index) || 0)));
  return t - i;
}

/**
 * Förvarning före slutet/övergången: "Två uppgifter kvar." och "Sista uppgiften!".
 * Returnerar null när inget ska sägas (eller om föräldern stängt av förvarningar).
 */
export function remainingCue(index, total, prefs) {
  const p = normalizeAdaptedPrefs(prefs);
  if (!p.warnings) return null;
  const t = Math.max(1, Number(total) || 1);
  if (t < 3) return null; // för korta pass – remsan räcker
  const left = tasksLeft(index, t);
  if (left === 2) return { left, text: '2 kvar', say: 'Två uppgifter kvar.' };
  if (left === 1) return { left, text: 'Sista!', say: `Sista uppgiften! Sen ${rewardFor(p).label.toLowerCase()}.` };
  return null;
}

/** Kort etikett till "kvar"-klockan: "3 kvar", "Sista!", "Klart!". */
export function leftLabel(index, total) {
  const left = tasksLeft(index, total);
  if (left <= 0) return 'Klart!';
  if (left === 1) return 'Sista!';
  return `${left} kvar`;
}

export function numberWord(n) {
  return NUM_WORDS[n] ?? String(n);
}

/**
 * Visuellt schema för passet: vad händer nu → sen → sist. `current` är steget som pågår.
 * Stegen är alltid desamma och i samma ordning (förutsägbart).
 */
export function scheduleSteps(total, prefs) {
  const p = normalizeAdaptedPrefs(prefs);
  const reward = rewardFor(p);
  const interest = interestFor(p);
  const n = Math.max(1, Number(total) || 1);
  const steps = [];
  if (p.checkin) steps.push({ id: 'checkin', icon: '🙂', label: 'Hur mår du?' });
  steps.push({ id: 'tasks', icon: interest.icon, label: `${n} ${n === 1 ? 'uppgift' : 'uppgifter'}` });
  steps.push({ id: 'reward', icon: reward.id === 'friends' ? interest.icon : reward.icon, label: reward.label });
  steps.push({ id: 'done', icon: '🏁', label: 'Klart' });
  return steps;
}

/** Vad svaret på "Hur mår du?" leder till. Aldrig ett krav – barnet kan alltid börja direkt. */
export function feelingResponse(id) {
  const f = FEELINGS.find((x) => x.id === id);
  if (!f) return { calm: false, say: 'Då börjar vi.' };
  if (id === 'good') return { calm: false, say: 'Vad bra! Då börjar vi.' };
  if (id === 'ok') return { calm: false, say: 'Okej. Då börjar vi lugnt.' };
  return { calm: true, say: `Du känner dig ${f.label.toLowerCase()}. Tack för att du berättar. Vill du andas en stund först?` };
}

/**
 * Andningscirkel i lugn-hörnan: in 4 sekunder, ut 6 sekunder (längre utandning lugnar).
 * Returnerar fas och hur stor cirkeln ska vara (0–1) vid tiden `ms`.
 */
export const BREATH = Object.freeze({ inMs: 4000, outMs: 6000, rounds: 5 });
export function breathPhase(ms) {
  const cycle = BREATH.inMs + BREATH.outMs;
  const t = Math.max(0, Number(ms) || 0);
  const round = Math.floor(t / cycle);
  const within = t % cycle;
  if (round >= BREATH.rounds) return { phase: 'done', size: 0, round: BREATH.rounds, text: 'Bra andat!' };
  if (within < BREATH.inMs) return { phase: 'in', size: within / BREATH.inMs, round, text: 'Andas in …' };
  return { phase: 'out', size: 1 - (within - BREATH.inMs) / BREATH.outMs, round, text: 'Andas ut …' };
}

/** Hur många belöningsobjekt (bubblor/stjärnor) – få och lagom, förutsägbart. */
export function rewardCount(rewardId) {
  if (rewardId === 'stars') return 10;
  if (rewardId === 'friends') return INTERESTS[0].items.length;
  return 8;
}
