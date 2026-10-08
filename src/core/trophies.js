// Troféer. Varje trofé har ett mål och en funktion som räknar fram barnets värde.
// Troféer går aldrig att förlora – inga straff, bara framsteg.
import { count, setSize } from './model.js';
import { UPPER, LOWER, DIGITS } from '../apps/letters.js';
import { SPECIES } from '../apps/biology.js';
import { PLANETS, CONSTELLATIONS } from '../apps/space.js';
import { ROBOT_LEVELS, TURTLE_CHALLENGES } from '../apps/code.js';
import { EXPERIMENT_IDS } from '../apps/science.js';
import { STORIES } from '../apps/svenska.js';
import { WONDERS } from '../apps/wonder.js';

export const LEARNING_APPS = ['math', 'svenska', 'write', 'science', 'biology', 'space', 'code', 'draw', 'wonder'];

const rounds = (app, mod) => (p) => count(p, mod ? `rounds:${app}:${mod}` : `rounds:${app}`);
const perfect = (app, mod) => (p) => count(p, `perfect:${app}:${mod}`);
const sz = (key) => (p) => setSize(p, key);

export const CATEGORIES = [
  { id: 'start', name: 'Äventyret', icon: '🧭' },
  { id: 'math', name: 'Matte', icon: '🔢' },
  { id: 'svenska', name: 'Svenska', icon: '📖' },
  { id: 'write', name: 'Skriva', icon: '✏️' },
  { id: 'science', name: 'Vetenskap', icon: '🔬' },
  { id: 'biology', name: 'Biologi', icon: '🌿' },
  { id: 'space', name: 'Rymden', icon: '🚀' },
  { id: 'code', name: 'Kod', icon: '🤖' },
  { id: 'create', name: 'Skapa & undra', icon: '🎨' },
];

export const TROPHIES = [
  // Äventyret
  { id: 'first-round', cat: 'start', icon: '🌟', name: 'Första stjärnan', desc: 'Gör klart din första runda.', target: 1, value: (p) => count(p, 'rounds') },
  { id: 'explorer', cat: 'start', icon: '🗺️', name: 'Upptäcktsresande', desc: 'Prova alla nio appar.', target: LEARNING_APPS.length, value: sz('appsTried') },
  { id: 'stars-50', cat: 'start', icon: '⭐', name: 'Stjärnsamlare', desc: 'Samla 50 stjärnor.', target: 50, value: (p) => p.stars },
  { id: 'stars-200', cat: 'start', icon: '💫', name: 'Stjärnregn', desc: 'Samla 200 stjärnor.', target: 200, value: (p) => p.stars },
  { id: 'stars-500', cat: 'start', icon: '🌠', name: 'Stjärnhimmel', desc: 'Samla 500 stjärnor.', target: 500, value: (p) => p.stars },
  { id: 'perfect-1', cat: 'start', icon: '🎯', name: 'Fullträff', desc: 'Klara en runda med allt rätt på första försöket.', target: 1, value: (p) => count(p, 'perfect') },
  { id: 'perfect-20', cat: 'start', icon: '🏹', name: 'Mästerskytt', desc: 'Klara 20 perfekta rundor.', target: 20, value: (p) => count(p, 'perfect') },
  { id: 'streak-3', cat: 'start', icon: '🔥', name: 'Tre dagar i rad', desc: 'Lär dig något tre dagar i rad.', target: 3, value: (p) => p.streak?.best || 0 },
  { id: 'streak-7', cat: 'start', icon: '🌈', name: 'En hel vecka', desc: 'Lär dig något sju dagar i rad.', target: 7, value: (p) => p.streak?.best || 0 },
  { id: 'rounds-100', cat: 'start', icon: '🏔️', name: 'Bergsbestigare', desc: 'Gör 100 rundor.', target: 100, value: (p) => count(p, 'rounds') },
  { id: 'try-again', cat: 'start', icon: '💪', name: 'Ger aldrig upp', desc: 'Försök igen efter ett fel – 25 gånger. Fel är hur man lär sig!', target: 25, value: (p) => count(p, 'retries') },

  // Matte
  { id: 'math-10', cat: 'math', icon: '🔢', name: 'Räknesnille', desc: 'Gör 10 matterundor.', target: 10, value: rounds('math') },
  { id: 'math-50', cat: 'math', icon: '🧮', name: 'Mattemagiker', desc: 'Gör 50 matterundor.', target: 50, value: rounds('math') },
  { id: 'clock', cat: 'math', icon: '⏰', name: 'Klockkoll', desc: 'Gör 5 rundor med klockan.', target: 5, value: rounds('math', 'clock') },
  { id: 'tenpairs', cat: 'math', icon: '🤝', name: 'Tiokompis', desc: 'Klara Tiokompisar perfekt 3 gånger.', target: 3, value: perfect('math', 'tenpairs') },
  { id: 'times', cat: 'math', icon: '✖️', name: 'Tabellproffs', desc: 'Klara Gånger & delat perfekt 3 gånger.', target: 3, value: perfect('math', 'times') },
  { id: 'shapes', cat: 'math', icon: '🔺', name: 'Formexpert', desc: 'Gör 5 rundor med former.', target: 5, value: rounds('math', 'shapes') },
  { id: 'algebra', cat: 'math', icon: '🐸', name: 'Detektiv', desc: 'Hitta det hemliga talet i 5 rundor.', target: 5, value: rounds('math', 'missing') },

  // Svenska
  { id: 'letters-all', cat: 'svenska', icon: '🔤', name: 'Bokstavskännare', desc: 'Hitta alla 29 bokstävernas ljud.', target: 29, value: sz('lettersHeard') },
  { id: 'rhyme', cat: 'svenska', icon: '🎵', name: 'Rimsmed', desc: 'Gör 5 rimrundor.', target: 5, value: rounds('svenska', 'rhyme') },
  { id: 'syllables', cat: 'svenska', icon: '🥁', name: 'Trumslagare', desc: 'Klappa stavelser i 5 rundor.', target: 5, value: rounds('svenska', 'syllables') },
  { id: 'builder', cat: 'svenska', icon: '🧩', name: 'Ordbyggare', desc: 'Bygg ord i 5 rundor.', target: 5, value: rounds('svenska', 'build') },
  { id: 'reader', cat: 'svenska', icon: '📚', name: 'Bokmal', desc: 'Läs alla berättelser.', target: STORIES.length, value: sz('stories') },
  { id: 'svenska-30', cat: 'svenska', icon: '👑', name: 'Språkkung', desc: 'Gör 30 svenskarundor.', target: 30, value: rounds('svenska') },

  // Skriva
  { id: 'trace-1', cat: 'write', icon: '✏️', name: 'Första bokstaven', desc: 'Skriv din första bokstav.', target: 1, value: (p) => setSize(p, 'traced:upper') + setSize(p, 'traced:lower') },
  { id: 'trace-upper', cat: 'write', icon: '🅰️', name: 'Stora alfabetet', desc: 'Skriv alla 29 stora bokstäver.', target: UPPER.length, value: sz('traced:upper') },
  { id: 'trace-lower', cat: 'write', icon: '🔡', name: 'Lilla alfabetet', desc: 'Skriv alla 29 små bokstäver.', target: LOWER.length, value: sz('traced:lower') },
  { id: 'trace-digits', cat: 'write', icon: '🔟', name: 'Sifferskrivare', desc: 'Skriv alla siffror 0–9.', target: DIGITS.length, value: sz('traced:digits') },
  { id: 'trace-name', cat: 'write', icon: '🙋', name: 'Det är jag!', desc: 'Skriv ditt eget namn.', target: 1, value: (p) => count(p, 'tracedName') },

  // Vetenskap
  { id: 'scientist', cat: 'science', icon: '🔬', name: 'Forskare', desc: 'Gör klart alla experiment.', target: EXPERIMENT_IDS.length, value: sz('experiments') },
  { id: 'hypothesis', cat: 'science', icon: '🤓', name: 'Gissningsgeni', desc: 'Gissa rätt 15 gånger innan du testar.', target: 15, value: (p) => count(p, 'predictions') },
  { id: 'recycler', cat: 'science', icon: '♻️', name: 'Miljöhjälte', desc: 'Källsortera i 5 rundor.', target: 5, value: rounds('science', 'recycle') },

  // Biologi
  { id: 'species-10', cat: 'biology', icon: '🃏', name: 'Artsamlare', desc: 'Samla 10 artkort.', target: 10, value: sz('species') },
  { id: 'species-all', cat: 'biology', icon: '🦉', name: 'Naturkännare', desc: `Samla alla ${SPECIES.length} artkort.`, target: SPECIES.length, value: sz('species') },
  { id: 'body', cat: 'biology', icon: '🫀', name: 'Kroppskoll', desc: 'Upptäck 10 delar av kroppen.', target: 10, value: sz('bodyParts') },
  { id: 'lifecycle', cat: 'biology', icon: '🦋', name: 'Förvandlingen', desc: 'Gör 5 rundor med livscykler.', target: 5, value: rounds('biology', 'lifecycle') },
  { id: 'foodchain', cat: 'biology', icon: '🦊', name: 'Kedjereaktion', desc: 'Gör 3 rundor med näringskedjor.', target: 3, value: rounds('biology', 'foodchain') },

  // Rymden
  { id: 'planets', cat: 'space', icon: '🪐', name: 'Planetturisten', desc: 'Besök alla åtta planeter.', target: PLANETS.length, value: sz('planets') },
  { id: 'launch', cat: 'space', icon: '🚀', name: 'Uppskjutning!', desc: 'Skjut upp en raket.', target: 1, value: (p) => count(p, 'rocketLaunch') },
  { id: 'moon', cat: 'space', icon: '🌕', name: 'Månskådare', desc: 'Hitta nymåne, halvmåne och fullmåne.', target: 3, value: sz('moonPhases') },
  { id: 'constellations', cat: 'space', icon: '✨', name: 'Stjärnskådare', desc: 'Rita alla stjärnbilder.', target: CONSTELLATIONS.length, value: sz('constellations') },
  { id: 'daynight', cat: 'space', icon: '🌍', name: 'Jordsnurrare', desc: 'Gör natt och dag i Göteborg.', target: 2, value: sz('daynight') },

  // Kod
  { id: 'robot-5', cat: 'code', icon: '🤖', name: 'Robotförare', desc: 'Klara 5 robotbanor.', target: 5, value: sz('robotLevels') },
  { id: 'robot-13', cat: 'code', icon: '↩️', name: 'Svängproffs', desc: 'Klara 13 robotbanor.', target: 13, value: sz('robotLevels') },
  { id: 'robot-all', cat: 'code', icon: '🏆', name: 'Kodmästare', desc: 'Klara alla robotbanor.', target: ROBOT_LEVELS.length, value: sz('robotLevels') },
  { id: 'loop', cat: 'code', icon: '🔁', name: 'Loopig', desc: 'Klara en bana med en loop.', target: 1, value: (p) => count(p, 'loopWins') },
  { id: 'turtle', cat: 'code', icon: '🐢', name: 'Kodkonstnär', desc: 'Klara alla ritutmaningar med kod.', target: TURTLE_CHALLENGES.filter((t) => t.solution).length, value: sz('turtle') },

  // Skapa & undra
  { id: 'draw-1', cat: 'create', icon: '🖍️', name: 'Konstnär', desc: 'Spara din första teckning.', target: 1, value: (p) => count(p, 'drawings') },
  { id: 'draw-10', cat: 'create', icon: '🖼️', name: 'Utställning', desc: 'Spara 10 teckningar.', target: 10, value: (p) => count(p, 'drawings') },
  { id: 'symmetry', cat: 'create', icon: '🦋', name: 'Spegelkonstnär', desc: 'Spara en teckning med spegelpenseln.', target: 1, value: (p) => count(p, 'symmetryDrawings') },
  { id: 'wonder-10', cat: 'create', icon: '🤔', name: 'Nyfiken själ', desc: 'Utforska 10 Undra-frågor.', target: 10, value: sz('wonders') },
  { id: 'wonder-all', cat: 'create', icon: '🧠', name: 'Frågornas mästare', desc: 'Utforska alla Undra-frågor.', target: WONDERS.length, value: sz('wonders') },
];

export function trophyProgress(profile, t) {
  const v = Math.min(t.target, Math.max(0, t.value(profile) || 0));
  return { value: v, target: t.target, ratio: v / t.target };
}

/** Delar ut nya troféer. Returnerar listan av nyss vunna troféer. */
export function awardTrophies(profile, now = new Date()) {
  const won = [];
  for (const t of TROPHIES) {
    if (profile.trophies[t.id]) continue;
    if ((t.value(profile) || 0) >= t.target) {
      profile.trophies[t.id] = now.toISOString();
      won.push(t);
    }
  }
  return won;
}

/** Nästa trofé som är närmast att vinnas – visas som inspiration på hemskärmen. */
export function nextTrophy(profile) {
  let best = null;
  for (const t of TROPHIES) {
    if (profile.trophies[t.id]) continue;
    const pr = trophyProgress(profile, t);
    if (pr.ratio > 0 && (!best || pr.ratio > best.pr.ratio)) best = { t, pr };
  }
  return best;
}
