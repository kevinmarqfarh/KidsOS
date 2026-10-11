// Anpassat läge – ren logik (ingen DOM, ingen lagring) så att den kan enhetstestas.
// Stöd för barn med autism och/eller intellektuell funktionsnedsättning:
// korta pass, färre alternativ, förutsägbar struktur, felfri inlärning och valbar favoritbelöning.
// Bakgrund och källor: docs/ANPASSAT-LAGE.md.

/** Antal frågor per pass som föräldern kan välja. */
export const ADAPTED_QUESTION_CHOICES = [3, 4, 5, 6, 8];
/** Max antal svarsalternativ. 0 = som vanligt (ingen minskning). */
export const ADAPTED_OPTION_CHOICES = [2, 3, 0];

/** Specialintressen som används som tema och motivation (belöningen "sen"). */
export const INTERESTS = [
  { id: 'animals', label: 'Djur', icon: '🐶', items: [['🐶', 'en hund'], ['🐱', 'en katt'], ['🐰', 'en kanin'], ['🐸', 'en groda'], ['🐼', 'en panda'], ['🐘', 'en elefant']] },
  { id: 'space', label: 'Rymden', icon: '🚀', items: [['🚀', 'en raket'], ['🌙', 'en måne'], ['⭐', 'en stjärna'], ['🪐', 'en planet'], ['☀️', 'en sol'], ['👩‍🚀', 'en astronaut']] },
  { id: 'vehicles', label: 'Fordon', icon: '🚗', items: [['🚗', 'en bil'], ['🚌', 'en buss'], ['🚂', 'ett tåg'], ['🚒', 'en brandbil'], ['🚜', 'en traktor'], ['✈️', 'ett flygplan']] },
  { id: 'dinos', label: 'Dinosaurier', icon: '🦖', items: [['🦖', 'en dinosaurie'], ['🦕', 'en långhals'], ['🥚', 'ett ägg'], ['🌴', 'en palm'], ['🦴', 'ett ben'], ['👣', 'fotspår']] },
  { id: 'ocean', label: 'Havet', icon: '🐠', items: [['🐠', 'en fisk'], ['🐙', 'en bläckfisk'], ['🐳', 'en val'], ['🐢', 'en sköldpadda'], ['🦀', 'en krabba'], ['🐬', 'en delfin']] },
  { id: 'music', label: 'Musik', icon: '🎵', items: [['🥁', 'en trumma'], ['🎸', 'en gitarr'], ['🎹', 'ett piano'], ['🎺', 'en trumpet'], ['🎻', 'en fiol'], ['🎵', 'en ton']] },
];

/** Belöningar som är sensoriskt trevliga men förutsägbara. */
export const REWARDS = [
  { id: 'bubbles', label: 'Bubblor', icon: '🫧', say: 'Tryck på bubblorna.' },
  { id: 'stars', label: 'Stjärnhimmel', icon: '✨', say: 'Tryck på himlen. Då tänds en stjärna.' },
  { id: 'friends', label: 'Mina favoriter', icon: '🎁', say: 'Tryck. Då kommer en ny.' },
];

export const ADAPTED_DEFAULTS = Object.freeze({
  questions: 5,
  options: 3,
  sound: true,
  focus: true,
  interest: 'animals',
  reward: 'bubbles',
});

export function defaultAdaptedPrefs() {
  return { ...ADAPTED_DEFAULTS };
}

/** Lagar/migrerar föräldrarnas finjusteringar. Okända eller trasiga värden ersätts med standard. */
export function normalizeAdaptedPrefs(raw) {
  const r = raw && typeof raw === 'object' ? raw : {};
  const out = defaultAdaptedPrefs();
  const q = Math.round(Number(r.questions));
  if (Number.isFinite(q)) out.questions = Math.max(3, Math.min(10, q));
  if (r.options !== undefined && r.options !== null && r.options !== '') {
    const o = Math.round(Number(r.options));
    if (o === 0) out.options = 0;
    else if (Number.isFinite(o)) out.options = Math.max(2, Math.min(4, o));
  }
  if (typeof r.sound === 'boolean') out.sound = r.sound;
  if (typeof r.focus === 'boolean') out.focus = r.focus;
  if (INTERESTS.some((i) => i.id === r.interest)) out.interest = r.interest;
  if (REWARDS.some((i) => i.id === r.reward)) out.reward = r.reward;
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

/** Antal frågor i ett pass. Utan anpassat läge gäller ordinarie längd. */
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

/** Anpassar en genererad fråga: färre alternativ för flervalsfrågor. Returnerar en ny fråga. */
export function adaptQuestion(q, prefs) {
  if (!q || typeof q !== 'object') return q;
  const p = normalizeAdaptedPrefs(prefs);
  const out = { ...q, adapted: true };
  if (q.type === 'choice' && Array.isArray(q.options) && !q.multi) {
    out.options = reduceOptions(q.options, q.answer, p.options);
  }
  return out;
}

/**
 * Felfri inlärning: vad händer efter ett fel?
 * Första felet → visa rätt svar tydligt och gör om frågan (med markering på rätt svar).
 * Om det blir fel även då → visa svaret lugnt och gå vidare (aldrig en lång felspiral).
 */
export function errorlessNext(redoCount) {
  return (Number(redoCount) || 0) < 1 ? 'redo' : 'reveal';
}

/** Ljud i anpassat läge: inga skarpa fel- eller fanfarljud, bara mjuka bekräftelser. */
const SOFT_SFX = { wrong: null, boom: null, whoosh: null, fanfare: 'star', trophy: 'star' };
export function adaptedSfx(name, prefs) {
  const p = normalizeAdaptedPrefs(prefs);
  if (!p.sound) return null;
  if (Object.prototype.hasOwnProperty.call(SOFT_SFX, name)) return SOFT_SFX[name];
  return name;
}

/** Korta, konkreta och alltid positiva fraser. Väljs i tur och ordning (förutsägbart). */
export const PRAISE = ['Bra!', 'Rätt!', 'Snyggt!', 'Ja, rätt!', 'Bra jobbat!'];
export function praiseFor(index) {
  const i = Math.abs(Math.round(Number(index) || 0)) % PRAISE.length;
  return PRAISE[i];
}

/** Text för först–sen-remsan. */
export function firstThenText(total, prefs) {
  const reward = rewardFor(prefs);
  const n = Math.max(1, Number(total) || 1);
  return { first: `Först ${n} ${n === 1 ? 'uppgift' : 'uppgifter'}`, then: `Sen ${reward.label.toLowerCase()}` };
}

/** Hur många belöningsobjekt (bubblor/stjärnor) – få och lagom, förutsägbart. */
export function rewardCount(rewardId) {
  if (rewardId === 'stars') return 10;
  if (rewardId === 'friends') return INTERESTS[0].items.length;
  return 8;
}
