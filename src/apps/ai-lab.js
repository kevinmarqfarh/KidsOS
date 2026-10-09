// This transparent nearest-neighbour model uses human-supplied features, not image recognition.
export const AI_FEATURES = ['Har fjädrar', 'Har päls', 'Kan flyga', 'Aktiv på natten'];
export const AI_TRAINING = [
  { id: 'ekorre', name: 'Ekorre', label: 'däggdjur', features: [0, 1, 0, 0] },
  { id: 'uggla', name: 'Uggla', label: 'fågel', features: [1, 0, 1, 1] },
  { id: 'orn', name: 'Örn', label: 'fågel', features: [1, 0, 1, 0] },
  { id: 'igelkott', name: 'Igelkott', label: 'däggdjur', features: [0, 1, 0, 1] },
];
export const AI_TESTING = [
  { id: 'grasand', name: 'Gräsand', label: 'fågel', features: [1, 0, 1, 0] },
  { id: 'varg', name: 'Varg', label: 'däggdjur', features: [0, 1, 0, 1] },
];
export function featureDistance(a, b) {
  return a.reduce((sum, v, i) => sum + (v - b[i]) ** 2, 0);
}
export function classifyAnimal(training, features) {
  if (!training.length) return { label: null, nearest: [], distance: null };
  const distances = training.map((example) => ({ ...example, distance: featureDistance(example.features, features) }));
  const distance = Math.min(...distances.map((example) => example.distance));
  const nearest = distances.filter((example) => example.distance === distance);
  const labels = new Set(nearest.map((example) => example.label));
  return { label: labels.size === 1 ? nearest[0].label : null, nearest, distance };
}
