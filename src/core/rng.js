// Seedad slumpgenerator (mulberry32) så att frågor kan återskapas i tester.
export function createRng(seed = Date.now()) {
  let a = (seed >>> 0) || 1;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const rng = {
    next,
    /** heltal i [min, max] inklusive */
    int(min, max) {
      return min + Math.floor(next() * (max - min + 1));
    },
    pick(list) {
      return list[Math.floor(next() * list.length)];
    },
    shuffle(list) {
      const arr = list.slice();
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    },
    /** n unika element ur listan */
    sample(list, n) {
      return rng.shuffle(list).slice(0, Math.min(n, list.length));
    },
    chance(p) {
      return next() < p;
    },
  };
  return rng;
}

/** Bygger svarsalternativ: rätt svar + unika distraktorer, blandade. */
export function numberOptions(rng, answer, count = 3, { min = 0, max = Infinity, spread = 3 } = {}) {
  const set = new Set([answer]);
  let guard = 0;
  while (set.size < count && guard++ < 200) {
    const delta = rng.int(1, spread) * (rng.chance(0.5) ? 1 : -1);
    const v = answer + delta;
    if (v >= min && v <= max) set.add(v);
  }
  // fyll på deterministiskt om intervallet var för smalt
  let k = 1;
  while (set.size < count && k < 1000) {
    if (answer + k <= max) set.add(answer + k);
    if (set.size < count && answer - k >= min) set.add(answer - k);
    k++;
  }
  return rng.shuffle([...set]);
}
