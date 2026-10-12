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

/* ======================================================================
 * Träna en klassificerare – fotolabbet.
 * Barnet sorterar riktiga foton i två grupper (träningsdata). En
 * närmaste-granne-modell jämför ett nytt foto med alla exempel och lånar
 * gruppen från de exempel som liknar mest (flest lika ledtrådar). Vid lika
 * många röster svarar modellen ärligt "vet inte".
 * Ledtrådarna (färg, form, storlek …) har människor skrivit in för varje
 * bild. En riktig bild-AI räknar själv fram mönster ur bildens pixlar, men
 * idén är densamma: jämför med märkta exempel. Idén bygger på aktiviteter som
 * Teachable Machine, Code.org AI for Oceans och Day of AI (MIT RAICA).
 * Allt är rena funktioner så att testerna kan köra dem.
 * ==================================================================== */

const COLORS = {
  röd: { label: 'röd', icon: '🔴' }, grön: { label: 'grön', icon: '🟢' }, gul: { label: 'gul', icon: '🟡' },
  orange: { label: 'orange', icon: '🟠' }, brun: { label: 'brun', icon: '🟤' }, lila: { label: 'lila', icon: '🟣' },
  blå: { label: 'blå', icon: '🔵' }, vit: { label: 'vit', icon: '⚪' }, grå: { label: 'grå', icon: '🩶' },
  svartvit: { label: 'svart och vit', icon: '🐼' }, flerfärgad: { label: 'många färger', icon: '🌈' }, rosa: { label: 'rosa', icon: '🩷' },
};

export const TRAINER_SETS = [
  {
    id: 'djur',
    title: 'Fågel eller däggdjur?',
    icon: '🐦',
    minLevel: 0,
    intro: 'Lär datorn att skilja fåglar från däggdjur. Sortera fotona i två grupper. Testa sedan på djur som datorn aldrig har sett.',
    classes: [
      { id: 'fågel', label: 'Fågel', icon: '🐦', a: 'en fågel', pl: 'fåglar' },
      { id: 'däggdjur', label: 'Däggdjur', icon: '🐾', a: 'ett däggdjur', pl: 'däggdjur' },
    ],
    // Ledtrådar om hur djuret ser ut på fotot – som en bild-AI "ser" färger och former.
    features: [
      { id: 'kropp', label: 'Kroppen', values: { fjädrar: { label: 'fjädrar', icon: '🪶' }, päls: { label: 'päls', icon: '🧶' }, taggar: { label: 'taggar', icon: '🌵' } } },
      { id: 'farg', label: 'Färgen', values: COLORS },
      { id: 'storlek', label: 'Storleken', values: { liten: { label: 'liten', icon: '🤏' }, mellan: { label: 'mellanstor', icon: '✋' }, stor: { label: 'stor', icon: '🙌' } } },
      { id: 'plats', label: 'På bilden', values: { luft: { label: 'i luften', icon: '☁️' }, vatten: { label: 'vid vatten', icon: '💧' }, mark: { label: 'på marken', icon: '🌱' }, snö: { label: 'i snö', icon: '❄️' } } },
    ],
    items: [
      // fåglar
      { id: 'uggla', e: '🦉', name: 'uggla', cls: 'fågel', f: { kropp: 'fjädrar', farg: 'brun', storlek: 'mellan', plats: 'mark' } },
      { id: 'svan', e: '🦢', name: 'svan', cls: 'fågel', f: { kropp: 'fjädrar', farg: 'vit', storlek: 'stor', plats: 'vatten' } },
      { id: 'sparv', e: '🐦', name: 'gråsparv', cls: 'fågel', f: { kropp: 'fjädrar', farg: 'brun', storlek: 'liten', plats: 'mark' } },
      { id: 'hona', e: '🐔', name: 'höna', cls: 'fågel', f: { kropp: 'fjädrar', farg: 'brun', storlek: 'mellan', plats: 'mark' } },
      { id: 'papegoja', e: '🦜', name: 'papegoja', cls: 'fågel', f: { kropp: 'fjädrar', farg: 'flerfärgad', storlek: 'mellan', plats: 'mark' } },
      { id: 'orn', e: '🦅', name: 'havsörn', cls: 'fågel', f: { kropp: 'fjädrar', farg: 'brun', storlek: 'stor', plats: 'luft' } },
      { id: 'grasand', e: '🦆', name: 'gräsand', cls: 'fågel', f: { kropp: 'fjädrar', farg: 'brun', storlek: 'mellan', plats: 'vatten' } },
      { id: 'tupp', e: '🐓', name: 'tupp', cls: 'fågel', f: { kropp: 'fjädrar', farg: 'flerfärgad', storlek: 'mellan', plats: 'mark' } },
      { id: 'pingvin', e: '🐧', name: 'pingvin', cls: 'fågel', f: { kropp: 'fjädrar', farg: 'svartvit', storlek: 'mellan', plats: 'snö' } },
      // däggdjur
      { id: 'katt', e: '🐱', name: 'katt', cls: 'däggdjur', f: { kropp: 'päls', farg: 'vit', storlek: 'mellan', plats: 'mark' } },
      { id: 'ekorre', e: '🐿️', name: 'ekorre', cls: 'däggdjur', f: { kropp: 'päls', farg: 'brun', storlek: 'liten', plats: 'mark' } },
      { id: 'hund', e: '🐶', name: 'hund', cls: 'däggdjur', f: { kropp: 'päls', farg: 'vit', storlek: 'mellan', plats: 'mark' } },
      { id: 'ko', e: '🐄', name: 'ko', cls: 'däggdjur', f: { kropp: 'päls', farg: 'brun', storlek: 'stor', plats: 'mark' } },
      { id: 'rav', e: '🦊', name: 'räv', cls: 'däggdjur', f: { kropp: 'päls', farg: 'orange', storlek: 'mellan', plats: 'snö' } },
      { id: 'kanin', e: '🐰', name: 'kanin', cls: 'däggdjur', f: { kropp: 'päls', farg: 'vit', storlek: 'liten', plats: 'mark' } },
      { id: 'varg', e: '🐺', name: 'varg', cls: 'däggdjur', f: { kropp: 'päls', farg: 'grå', storlek: 'stor', plats: 'snö' } },
      { id: 'bjorn', e: '🐻', name: 'björn', cls: 'däggdjur', f: { kropp: 'päls', farg: 'brun', storlek: 'stor', plats: 'mark' } },
      { id: 'fladdermus', e: '🦇', name: 'fladdermus', cls: 'däggdjur', f: { kropp: 'päls', farg: 'brun', storlek: 'liten', plats: 'luft' } },
      { id: 'sal', e: '🦭', name: 'säl', cls: 'däggdjur', f: { kropp: 'päls', farg: 'grå', storlek: 'stor', plats: 'vatten' } },
      { id: 'igelkott', e: '🦔', name: 'igelkott', cls: 'däggdjur', f: { kropp: 'taggar', farg: 'brun', storlek: 'liten', plats: 'mark' } },
      { id: 'mus', e: '🐭', name: 'mus', cls: 'däggdjur', f: { kropp: 'päls', farg: 'grå', storlek: 'liten', plats: 'mark' } },
      { id: 'hare', e: '🐇', name: 'skogshare', cls: 'däggdjur', photo: 'hare', f: { kropp: 'päls', farg: 'grå', storlek: 'mellan', plats: 'mark' } },
      { id: 'radjur', e: '🦌', name: 'rådjur', cls: 'däggdjur', f: { kropp: 'päls', farg: 'brun', storlek: 'stor', plats: 'mark' } },
    ],
    // Exempel som barnet får sortera (i den här ordningen) och testdjur som aldrig ingår i träningen.
    // Träningen kommer i omgångar om fyra. Testerna i tests/unit/ai.test.mjs kontrollerar att
    // modellen blir bättre för varje omgång när etiketterna är rätt.
    train: ['svan', 'mus', 'rav', 'hona', 'grasand', 'kanin', 'katt', 'sparv', 'uggla', 'hare', 'radjur', 'papegoja'],
    test: ['pingvin', 'fladdermus', 'sal', 'orn', 'ko', 'bjorn'],
    lesson: 'Fladdermusen flyger som en fågel men är ett däggdjur: den har päls och ungarna dricker mjölk. Pingvinen kan inte flyga men är en fågel med fjädrar. Vilka ledtrådar avslöjar gruppen bäst?',
  },
  {
    id: 'mat',
    title: 'Frukt eller grönsak?',
    icon: '🍎',
    minLevel: 1,
    intro: 'Lär datorn att skilja frukt från grönsaker – som vi säger i köket. Den får bara veta hur maten ser ut. Räcker det?',
    classes: [
      { id: 'frukt', label: 'Frukt', icon: '🍎', a: 'en frukt', pl: 'frukter' },
      { id: 'grönsak', label: 'Grönsak', icon: '🥕', a: 'en grönsak', pl: 'grönsaker' },
    ],
    features: [
      { id: 'farg', label: 'Färgen', values: COLORS },
      { id: 'form', label: 'Formen', values: { rund: { label: 'rund', icon: '⚫' }, avlång: { label: 'avlång', icon: '➖' } } },
      { id: 'storlek', label: 'Storleken', values: { liten: { label: 'liten', icon: '🤏' }, mellan: { label: 'mellanstor', icon: '✋' }, stor: { label: 'stor', icon: '🙌' } } },
      { id: 'yta', label: 'Ytan', values: { slät: { label: 'slät och blank', icon: '✨' }, knottrig: { label: 'knottrig', icon: '🌳' }, blad: { label: 'blad', icon: '🍃' } } },
    ],
    items: [
      { id: 'apple', e: '🍎', name: 'rött äpple', cls: 'frukt', f: { farg: 'röd', form: 'rund', storlek: 'mellan', yta: 'slät' } },
      { id: 'gapple', e: '🍏', name: 'grönt äpple', cls: 'frukt', f: { farg: 'grön', form: 'rund', storlek: 'mellan', yta: 'slät' } },
      { id: 'banan', e: '🍌', name: 'banan', cls: 'frukt', f: { farg: 'gul', form: 'avlång', storlek: 'mellan', yta: 'slät' } },
      { id: 'apelsin', e: '🍊', name: 'apelsin', cls: 'frukt', f: { farg: 'orange', form: 'rund', storlek: 'mellan', yta: 'knottrig' } },
      { id: 'paron', e: '🍐', name: 'päron', cls: 'frukt', f: { farg: 'grön', form: 'rund', storlek: 'mellan', yta: 'slät' } },
      { id: 'jordgubbe', e: '🍓', name: 'jordgubbe', cls: 'frukt', f: { farg: 'röd', form: 'rund', storlek: 'liten', yta: 'knottrig' } },
      { id: 'korsbar', e: '🍒', name: 'körsbär', cls: 'frukt', f: { farg: 'röd', form: 'rund', storlek: 'liten', yta: 'slät' } },
      { id: 'vindruvor', e: '🍇', name: 'vindruvor', pl: true, cls: 'frukt', f: { farg: 'lila', form: 'rund', storlek: 'liten', yta: 'slät' } },
      { id: 'citron', e: '🍋', name: 'citron', cls: 'frukt', f: { farg: 'gul', form: 'rund', storlek: 'mellan', yta: 'knottrig' } },
      { id: 'melon', e: '🍉', name: 'vattenmelon', cls: 'frukt', f: { farg: 'grön', form: 'rund', storlek: 'stor', yta: 'slät' } },
      { id: 'blabar', e: '🫐', name: 'blåbär', cls: 'frukt', f: { farg: 'blå', form: 'rund', storlek: 'liten', yta: 'slät' } },
      { id: 'morot', e: '🥕', name: 'morot', cls: 'grönsak', f: { farg: 'orange', form: 'avlång', storlek: 'mellan', yta: 'blad' } },
      { id: 'gurka', e: '🥒', name: 'gurka', cls: 'grönsak', f: { farg: 'grön', form: 'avlång', storlek: 'mellan', yta: 'knottrig' } },
      { id: 'potatis', e: '🥔', name: 'potatis', cls: 'grönsak', f: { farg: 'brun', form: 'rund', storlek: 'mellan', yta: 'knottrig' } },
      { id: 'artor', e: '🫛', name: 'ärtor', pl: true, cls: 'grönsak', f: { farg: 'grön', form: 'avlång', storlek: 'liten', yta: 'blad' } },
      { id: 'tomat', e: '🍅', name: 'tomat', cls: 'grönsak', f: { farg: 'röd', form: 'rund', storlek: 'mellan', yta: 'slät' } },
      { id: 'broccoli', e: '🥦', name: 'broccoli', cls: 'grönsak', f: { farg: 'grön', form: 'rund', storlek: 'mellan', yta: 'knottrig' } },
      { id: 'majs', e: '🌽', name: 'majs', cls: 'grönsak', f: { farg: 'gul', form: 'avlång', storlek: 'mellan', yta: 'blad' } },
      { id: 'aubergine', e: '🍆', name: 'aubergine', cls: 'grönsak', f: { farg: 'lila', form: 'avlång', storlek: 'mellan', yta: 'slät' } },
      { id: 'sallad', e: '🥬', name: 'sallad', cls: 'grönsak', f: { farg: 'grön', form: 'rund', storlek: 'stor', yta: 'blad' } },
      { id: 'vitlok', e: '🧄', name: 'vitlök', cls: 'grönsak', f: { farg: 'vit', form: 'rund', storlek: 'liten', yta: 'knottrig' } },
    ],
    train: ['apple', 'sallad', 'apelsin', 'vitlok', 'potatis', 'jordgubbe', 'korsbar', 'gurka', 'melon', 'majs', 'tomat', 'aubergine'],
    test: ['gapple', 'broccoli', 'blabar', 'artor', 'vindruvor', 'morot'],
    lesson: 'Utseendet räcker inte alltid. Tomaten ser ut som ett rött äpple! I köket kallar vi tomat för grönsak, men en botaniker kallar den en frukt eftersom den har frön. Etiketterna bestämmer människor – och datorn lär sig de etiketter vi ger den.',
  },
];

/**
 * Skev träningsdata: alla frukter i träningen är röda och alla grönsaker gröna.
 * Modellen lär sig då "röd = frukt, grön = grönsak" – och gör fel på gröna
 * frukter. Barnet rättar genom att lägga till varierade exempel.
 */
export const BIAS_CHALLENGE = {
  set: 'mat',
  skewed: { apple: 'frukt', jordgubbe: 'frukt', korsbar: 'frukt', gurka: 'grönsak', artor: 'grönsak', sallad: 'grönsak', broccoli: 'grönsak' },
  test: ['gapple', 'paron', 'blabar', 'vindruvor', 'aubergine', 'vitlok'],
  fixes: ['melon', 'citron', 'apelsin', 'majs', 'morot', 'potatis'],
};

export const trainerSet = (id) => TRAINER_SETS.find((s) => s.id === id);
export const trainerItem = (set, id) => set.items.find((it) => it.id === id);

/** Antal ledtrådar som skiljer två exempel åt (bara bland de ledtrådar som används). */
export function clueDistance(a, b, features) {
  return features.reduce((n, f) => n + (a[f] === b[f] ? 0 : 1), 0);
}

/**
 * Närmaste granne: hitta exemplen med minst avstånd. De röstar; flest röster vinner.
 * examples: [{ id, f, label }] (label = barnets etikett). features: lista med ledtråds-id.
 * Returnerar { label | null, nearest, distance, votes }.
 */
export function classify(examples, f, features) {
  if (!examples.length || !features.length) return { label: null, nearest: [], distance: null, votes: {} };
  const scored = examples.map((ex) => ({ ...ex, distance: clueDistance(ex.f, f, features) }));
  const distance = Math.min(...scored.map((ex) => ex.distance));
  const nearest = scored.filter((ex) => ex.distance === distance);
  const votes = {};
  for (const ex of nearest) votes[ex.label] = (votes[ex.label] || 0) + 1;
  const best = Math.max(...Object.values(votes));
  const winners = Object.keys(votes).filter((k) => votes[k] === best);
  return { label: winners.length === 1 ? winners[0] : null, nearest, distance, votes };
}

/** Bygger träningsexempel ur barnets etiketter: { itemId: label }. */
export function examplesFrom(set, labels) {
  return Object.entries(labels).map(([id, label]) => ({ ...trainerItem(set, id), label }));
}

/** Testar modellen på testobjekten. Returnerar en rad per objekt och antal rätt. */
export function evaluate(set, labels, testIds, features = set.features.map((x) => x.id)) {
  const examples = examplesFrom(set, labels);
  const rows = testIds.map((id) => {
    const item = trainerItem(set, id);
    const res = classify(examples, item.f, features);
    return { item, ...res, correct: res.label === item.cls };
  });
  return { rows, correct: rows.filter((r) => r.correct).length, total: rows.length };
}

/** "Ett päron är en frukt." / "Vindruvor är frukter." */
const NEUTER = new Set(['rött äpple', 'grönt äpple', 'päron', 'blåbär', 'körsbär', 'rådjur']);
const MASS = new Set(['majs']);
export function withArticle(item) {
  if (item.pl || MASS.has(item.name)) return item.name;
  return `${NEUTER.has(item.name) ? 'ett' : 'en'} ${item.name}`;
}
export function factLine(set, item) {
  const c = set.classes.find((x) => x.id === item.cls);
  const name = withArticle(item);
  return `${name[0].toUpperCase()}${name.slice(1)} ${item.pl ? `är ${c.pl}` : `är ${c.a}`}.`;
}

/** Vilka ledtrådar har exemplet och det nya fotot gemensamt? (för förklaringen "därför") */
export function sharedClues(set, a, b, features) {
  return set.features.filter((x) => features.includes(x.id) && a[x.id] === b[x.id]).map((x) => x.values[a[x.id]]?.label || a[x.id]);
}
