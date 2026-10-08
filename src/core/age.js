// Åldersband och svårighetsnivåer.
// Nivå 0–4 används av alla appar:
//   0 = förskola (4–5 år, förläsare – allt ska gå att göra med ljud + bild)
//   1 = förskoleklass/åk 1 (6–7 år, knäcker läskoden, talområde 0–20)
//   2 = åk 2 (8 år, läser korta texter, talområde 0–100)
//   3 = åk 3 (9 år, läser självständigt, talområde 0–1000, multiplikation)
//   4 = åk 4+ (10+ år, utmaning)

export const MAX_LEVEL = 4;

export const LEVELS = [
  { level: 0, short: 'Nivå 1', name: 'Knopp', school: 'Förskola', emoji: '🌱' },
  { level: 1, short: 'Nivå 2', name: 'Groddar', school: 'Förskoleklass–åk 1', emoji: '🌿' },
  { level: 2, short: 'Nivå 3', name: 'Planta', school: 'Åk 2', emoji: '🪴' },
  { level: 3, short: 'Nivå 4', name: 'Träd', school: 'Åk 3', emoji: '🌳' },
  { level: 4, short: 'Nivå 5', name: 'Skog', school: 'Åk 4+', emoji: '🌲' },
];

export function startLevelForAge(age) {
  const a = Number(age) || 0;
  if (a <= 5) return 0;
  if (a <= 7) return 1;
  if (a === 8) return 2;
  if (a === 9) return 3;
  return 4;
}

/** Ungefärlig skolform i Sverige för en viss ålder (höstterminen). */
export function schoolLabelForAge(age) {
  const a = Number(age) || 0;
  if (a <= 5) return 'Förskola';
  if (a === 6) return 'Förskoleklass';
  if (a <= 15) return `Årskurs ${a - 6}`;
  return 'Gymnasiet';
}

/** Kan barnet förväntas läsa själv? Styr automatisk uppläsning. */
export function isPreReader(age) {
  return (Number(age) || 0) <= 6;
}

export function clampLevel(l) {
  return Math.max(0, Math.min(MAX_LEVEL, Math.round(Number(l) || 0)));
}

/** Hur många frågor en runda har – kortare för yngre. */
export function roundLength(age) {
  const a = Number(age) || 0;
  if (a <= 5) return 5;
  if (a <= 7) return 6;
  return 8;
}

export const AVATARS = ['🦊', '🐼', '🦁', '🐸', '🐙', '🦄', '🐯', '🐨', '🐧', '🦉', '🐢', '🐳', '🦖', '🐝', '🐞', '🐰', '🐶', '🐱', '🦋', '🐬'];
export const PROFILE_COLORS = ['#ff6b5b', '#ff9f1c', '#ffc93c', '#3fb67a', '#19b5b0', '#4aa8ff', '#6b6bff', '#b06bff', '#ff5fa2'];
export const WALLPAPERS = [
  { id: 'sky', name: 'Himmel', emoji: '☁️' },
  { id: 'forest', name: 'Skog', emoji: '🌲' },
  { id: 'ocean', name: 'Hav', emoji: '🌊' },
  { id: 'space', name: 'Rymd', emoji: '🌌' },
  { id: 'candy', name: 'Godis', emoji: '🍭' },
];
