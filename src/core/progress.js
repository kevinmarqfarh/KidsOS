// Upptäckarnivåer baserade på totalt antal stjärnor.
export const RANKS = [
  { min: 0, title: 'Nyfiken nybörjare', emoji: '🥚' },
  { min: 10, title: 'Frågeställare', emoji: '🐣' },
  { min: 30, title: 'Upptäckare', emoji: '🔎' },
  { min: 60, title: 'Utforskare', emoji: '🧭' },
  { min: 100, title: 'Forskare', emoji: '🔬' },
  { min: 160, title: 'Uppfinnare', emoji: '💡' },
  { min: 240, title: 'Professor', emoji: '🎓' },
  { min: 340, title: 'Kunskapskapten', emoji: '⛵' },
  { min: 460, title: 'Stjärnhjärna', emoji: '🌟' },
  { min: 600, title: 'Universumets mästare', emoji: '🪐' },
];

export function rankFor(stars) {
  let idx = 0;
  for (let i = 0; i < RANKS.length; i++) if (stars >= RANKS[i].min) idx = i;
  const rank = RANKS[idx];
  const next = RANKS[idx + 1] || null;
  const progress = next ? (stars - rank.min) / (next.min - rank.min) : 1;
  return { index: idx, ...rank, next, progress: Math.max(0, Math.min(1, progress)), toNext: next ? next.min - stars : 0 };
}
