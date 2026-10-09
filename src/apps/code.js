// Programmering: robotbana (pilar, sväng & kör, loopar), följ koden, rita med kod,
// och programmerade saker i vardagen (Lgr22 teknik & matematik/algebra).

export const DIRS = { N: [0, -1], E: [1, 0], S: [0, 1], W: [-1, 0] };
const TURN_R = { N: 'E', E: 'S', S: 'W', W: 'N' };
const TURN_L = { N: 'W', W: 'S', S: 'E', E: 'N' };
const ABS = { U: 'N', R: 'E', D: 'S', L: 'W' };

export const CMD_INFO = {
  U: { label: '⬆️', name: 'upp', mode: 'abs' },
  R: { label: '➡️', name: 'höger', mode: 'abs' },
  D: { label: '⬇️', name: 'ner', mode: 'abs' },
  L: { label: '⬅️', name: 'vänster', mode: 'abs' },
  F: { label: '👣', name: 'framåt', mode: 'rel' },
  V: { label: '↶', name: 'sväng vänster', mode: 'rel' },
  H: { label: '↷', name: 'sväng höger', mode: 'rel' },
};

/**
 * Banor. Tecken: S start, G mål, * stjärna (samla alla), # sten, ~ vatten, . väg.
 * mode 'abs' = pilar (upp/ner/vänster/höger), 'rel' = framåt + sväng.
 * solution är ett facit i DSL:en (används av testerna).
 */
export const ROBOT_LEVELS = [
  { id: 1, title: 'Första steget', mode: 'abs', map: ['S.G'], maxBlocks: 4, teach: 'Tryck på pilarna för att bygga ett program. Tryck sedan på ▶ Kör!', solution: 'R R' },
  { id: 2, title: 'Ner till blomman', mode: 'abs', map: ['S', '.', '.', 'G'], maxBlocks: 5, teach: 'Roboten kan gå neråt också.', solution: 'D D D' },
  { id: 3, title: 'Runt hörnet', mode: 'abs', map: ['S..', '..G'], maxBlocks: 5, teach: 'Blanda pilarna!', solution: 'R R D' },
  { id: 4, title: 'Stenen i vägen', mode: 'abs', map: ['S#G', '...'], maxBlocks: 6, teach: 'Roboten kan inte gå genom stenar. Gå runt!', solution: 'D R R U' },
  { id: 5, title: 'Samla stjärnan', mode: 'abs', map: ['S.*', '#..', 'G..'], maxBlocks: 8, teach: 'Samla alla stjärnor innan du går till målet.', solution: 'R R D D L L' },
  { id: 6, title: 'Två stjärnor', mode: 'abs', map: ['S.#G', '*...', '..*.'], maxBlocks: 9, teach: 'Planera vägen innan du bygger.', solution: 'D R R D R U U' },
  { id: 7, title: 'Labyrinten', mode: 'abs', map: ['S.#..', '#.#.#', '..#..', '.##.#', '....G'], maxBlocks: 12, teach: 'Följ den öppna vägen genom labyrinten.', solution: 'R D D L D D R R R R' },
  { id: 8, title: 'Vid sjön', mode: 'abs', map: ['S.~..', '..~.*', '.....', '~~~.G'], maxBlocks: 11, teach: 'Roboten kan inte simma – akta vattnet!', solution: 'D D R R R R U D D' },
  { id: 9, title: 'Framåt!', mode: 'rel', map: ['S...G'], maxBlocks: 6, teach: 'Nu är det nya block! 👣 betyder framåt – dit roboten tittar.', solution: 'F F F F' },
  { id: 10, title: 'Sväng höger', mode: 'rel', map: ['S.#', '#.#', '#.G'], maxBlocks: 8, teach: '↷ svänger roboten åt höger – den står kvar men tittar åt ett nytt håll.', solution: 'F H F F V F' },
  { id: 11, title: 'Sväng vänster', mode: 'rel', map: ['..G', '.#.', 'S..'], maxBlocks: 7, teach: '↶ svänger åt vänster. Tänk dig att du är roboten!', solution: 'F F V F F' },
  { id: 12, title: 'Stjärnjakt', mode: 'rel', map: ['S.*', '#..', 'G.*'], maxBlocks: 10, teach: 'Samla båda stjärnorna.', solution: 'F F H F F H F F' },
  { id: 13, title: 'Vänd om', mode: 'rel', map: ['G..S'], maxBlocks: 7, start: 'E', teach: 'Roboten tittar åt fel håll. Hur vänder man sig om?', solution: 'V V F F F' },
  { id: 14, title: 'Upprepa!', mode: 'abs', loops: true, map: ['S......G'], maxBlocks: 2, teach: 'Nytt block: 🔁 Upprepa. Lägg en pil i loopen och välj hur många gånger. Bara 2 block får plats!', solution: '7(R)' },
  { id: 15, title: 'Trappan', mode: 'abs', loops: true, map: ['S...', '....', '....', '...G'], maxBlocks: 3, teach: 'En trappa är samma steg om och om igen: höger, ner …', solution: '3(R D)' },
  { id: 16, title: 'Stjärnhörnet', mode: 'abs', loops: true, map: ['S****', '....*', '....*', '....G'], maxBlocks: 4, teach: 'Använd två loopar.', solution: '4(R) 3(D)' },
  { id: 17, title: 'Sicksack', mode: 'abs', loops: true, map: ['S.###', '#..##', '##..#', '###.G'], maxBlocks: 4, teach: 'Hitta mönstret i vägen.', solution: '3(R D) R' },
  { id: 18, title: 'Rundan', mode: 'rel', loops: true, map: ['S..*', 'G##.', '.##.', '*...'], maxBlocks: 8, teach: 'Gå runt stenarna. Vilka steg upprepas?', solution: '3(F F F H) F F' },
  { id: 19, title: 'Långa vägen', mode: 'rel', loops: true, map: ['S.....', '#####.', '......', '.#####', 'G.....'], maxBlocks: 12, teach: 'Långa raka sträckor? Använd loopar!', solution: '5(F) H 2(F) H 5(F) V 2(F)' },
  { id: 20, title: 'Mästarprovet', mode: 'abs', loops: true, map: ['S*.*.*.', '######.', 'G*.*.*.'], maxBlocks: 6, teach: 'Samla alla sex stjärnor med bara sex block!', solution: '6(R) 2(D) 6(L)' },
];

export function parseLevel(level) {
  const h = level.map.length;
  const w = Math.max(...level.map.map((r) => r.length));
  let start = null;
  let goal = null;
  const stars = [];
  const blocked = new Set();
  const water = new Set();
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const c = level.map[y][x] || '#';
      if (c === 'S') start = { x, y };
      else if (c === 'G') goal = { x, y };
      else if (c === '*') stars.push({ x, y });
      else if (c === '#') blocked.add(`${x},${y}`);
      else if (c === '~') {
        blocked.add(`${x},${y}`);
        water.add(`${x},${y}`);
      }
    }
  }
  return { w, h, start, goal, stars, blocked, water, mode: level.mode, dir: level.start || 'E' };
}

/** Tolkar DSL: "R R 3(F H) D" → [{cmd:'R'},{cmd:'R'},{cmd:'loop',n:3,body:[…]},…] */
export function parseProgram(src) {
  let i = 0;
  const s = src.replace(/\s+/g, ' ').trim();
  function list(until) {
    const out = [];
    while (i < s.length && s[i] !== until) {
      if (s[i] === ' ') {
        i++;
        continue;
      }
      const m = /^(\d+)\(/.exec(s.slice(i));
      if (m) {
        i += m[0].length;
        const body = list(')');
        i++; // ')'
        out.push({ cmd: 'loop', n: Number(m[1]), body });
      } else {
        out.push({ cmd: s[i] });
        i++;
      }
    }
    return out;
  }
  return list(null);
}

export function programToString(prog) {
  return prog.map((p) => (p.cmd === 'loop' ? `${p.n}(${programToString(p.body)})` : p.cmd)).join(' ');
}

export function blockCount(prog) {
  return prog.reduce((n, p) => n + 1 + (p.cmd === 'loop' ? blockCount(p.body) : 0), 0);
}

export function expand(prog, limit = 500) {
  const out = [];
  const walk = (list) => {
    for (const p of list) {
      if (out.length >= limit) return;
      if (p.cmd === 'loop') for (let k = 0; k < p.n; k++) walk(p.body);
      else out.push(p.cmd);
    }
  };
  walk(prog);
  return out;
}

/**
 * Kör ett program steg för steg. Returnerar alla steg (för animation) och resultat:
 * 'win' | 'crash' | 'water' | 'outside' | 'missing-stars' | 'not-there'.
 */
export function runProgram(level, prog) {
  const L = typeof level.map === 'object' && !level.w ? parseLevel(level) : level;
  let { x, y } = L.start;
  let dir = L.dir;
  const got = new Set();
  const steps = [{ x, y, dir, cmd: null, event: 'start' }];
  const cmds = expand(prog);
  for (const c of cmds) {
    if (c === 'V') {
      dir = TURN_L[dir];
      steps.push({ x, y, dir, cmd: c, event: 'turn' });
      continue;
    }
    if (c === 'H') {
      dir = TURN_R[dir];
      steps.push({ x, y, dir, cmd: c, event: 'turn' });
      continue;
    }
    const d = c === 'F' ? dir : ABS[c];
    if (!d) continue;
    if (c !== 'F') dir = d;
    const nx = x + DIRS[d][0];
    const ny = y + DIRS[d][1];
    const key = `${nx},${ny}`;
    if (nx < 0 || ny < 0 || nx >= L.w || ny >= L.h) {
      steps.push({ x, y, dir, cmd: c, event: 'outside' });
      return { steps, result: 'outside', stars: got.size };
    }
    if (L.water.has(key)) {
      steps.push({ x, y, dir, cmd: c, event: 'water', tx: nx, ty: ny });
      return { steps, result: 'water', stars: got.size };
    }
    if (L.blocked.has(key)) {
      steps.push({ x, y, dir, cmd: c, event: 'crash', tx: nx, ty: ny });
      return { steps, result: 'crash', stars: got.size };
    }
    x = nx;
    y = ny;
    let event = 'move';
    if (L.stars.some((s) => s.x === x && s.y === y) && !got.has(key)) {
      got.add(key);
      event = 'star';
    }
    steps.push({ x, y, dir, cmd: c, event });
    if (L.goal.x === x && L.goal.y === y && got.size === L.stars.length) {
      steps.push({ x, y, dir, cmd: null, event: 'win' });
      return { steps, result: 'win', stars: got.size };
    }
  }
  const atGoal = L.goal.x === x && L.goal.y === y;
  return { steps, result: atGoal ? 'missing-stars' : 'not-there', stars: got.size };
}

/** Kortaste lösningen (antal primitiva steg) med BFS – används i tester och för tips. */
export function shortestPath(level) {
  const L = parseLevel(level);
  const starKeys = L.stars.map((s) => `${s.x},${s.y}`);
  const full = (1 << starKeys.length) - 1;
  const actions = L.mode === 'rel' ? ['F', 'V', 'H'] : ['U', 'D', 'L', 'R'];
  const startDir = L.dir;
  const key = (x, y, d, m) => `${x},${y},${d},${m}`;
  const q = [[L.start.x, L.start.y, startDir, 0, '']];
  const seen = new Set([key(L.start.x, L.start.y, L.mode === 'rel' ? startDir : '-', 0)]);
  while (q.length) {
    const [x, y, d, mask, path] = q.shift();
    if (x === L.goal.x && y === L.goal.y && mask === full) return path.trim().split(' ').filter(Boolean);
    for (const a of actions) {
      let nx = x;
      let ny = y;
      let nd = d;
      if (a === 'V') nd = TURN_L[d];
      else if (a === 'H') nd = TURN_R[d];
      else {
        const dd = a === 'F' ? d : ABS[a];
        nx += DIRS[dd][0];
        ny += DIRS[dd][1];
        if (nx < 0 || ny < 0 || nx >= L.w || ny >= L.h || L.blocked.has(`${nx},${ny}`)) continue;
      }
      let nm = mask;
      const si = starKeys.indexOf(`${nx},${ny}`);
      if (si >= 0) nm |= 1 << si;
      const k = key(nx, ny, L.mode === 'rel' ? nd : '-', nm);
      if (seen.has(k)) continue;
      seen.add(k);
      q.push([nx, ny, nd, nm, `${path} ${a}`]);
    }
  }
  return null;
}

/* ---------- Följ koden (förutsäg var roboten hamnar) ---------- */
export function genPredict(level, rng) {
  const size = level <= 1 ? 3 : 4;
  const steps = level <= 0 ? 2 : level === 1 ? 3 : level === 2 ? 4 : 5;
  for (let attempt = 0; attempt < 100; attempt++) {
    const sx = rng.int(0, size - 1);
    const sy = rng.int(0, size - 1);
    let x = sx;
    let y = sy;
    const prog = [];
    let ok = true;
    for (let i = 0; i < steps; i++) {
      const c = rng.pick(['U', 'D', 'L', 'R']);
      const [dx, dy] = DIRS[ABS[c]];
      if (x + dx < 0 || y + dy < 0 || x + dx >= size || y + dy >= size) {
        ok = false;
        break;
      }
      x += dx;
      y += dy;
      prog.push(c);
    }
    if (!ok || (x === sx && y === sy)) continue;
    const cell = 64;
    let grid = '';
    for (let j = 0; j < size; j++) {
      for (let i = 0; i < size; i++) {
        grid += `<rect class="hit cell" data-hit="${i},${j}" x="${i * cell + 4}" y="${j * cell + 4}" width="${cell - 6}" height="${cell - 6}" rx="10" fill="#eef4ff" stroke="#c4d3f0" stroke-width="2"/>`;
      }
    }
    grid += `<text x="${sx * cell + 33}" y="${sy * cell + 46}" text-anchor="middle" font-size="34" pointer-events="none">🤖</text>`;
    const W = size * cell + 6;
    const code = prog.map((c) => `<span class="code-chip">${CMD_INFO[c].label}</span>`).join('');
    return {
      type: 'tap',
      prompt: 'Följ koden! Var hamnar roboten? Tryck på rutan.',
      say: `Följ koden: ${prog.map((c) => CMD_INFO[c].name).join(', ')}. Var hamnar roboten? Tryck på rutan.`,
      visual: `<div class="code-line">${code}</div><svg class="predict-grid" viewBox="0 0 ${W} ${W}">${grid}</svg>`,
      answer: `${x},${y}`,
      hint: 'Flytta fingret en ruta i taget, precis som koden säger.',
      explain: `Roboten gör ${steps} förflyttningar och hamnar på den markerade rutan.`,
    };
  }
  return genPredict(Math.max(0, level - 1), rng);
}

/* ---------- Programmerade saker ---------- */
export const PROGRAMMED_THINGS = [
  { id: 'tvatt', e: '🫧', n: 'tvättmaskin', bin: 'ja' },
  { id: 'mikro', e: '♨️', n: 'mikrovågsugn', bin: 'ja' },
  { id: 'trafikljus', e: '🚦', n: 'trafikljus', bin: 'ja' },
  { id: 'robotdammsugare', e: '🤖', n: 'robotdammsugare', bin: 'ja' },
  { id: 'mobil', e: '📱', n: 'mobiltelefon', bin: 'ja' },
  { id: 'hiss', e: '🛗', n: 'hiss', bin: 'ja' },
  { id: 'sax', e: '✂️', n: 'sax', bin: 'nej' },
  { id: 'penna', e: '✏️', n: 'penna', bin: 'nej' },
  { id: 'sked', e: '🥄', n: 'sked', bin: 'nej' },
  { id: 'cykel', e: '🚲', n: 'cykel', bin: 'nej' },
  { id: 'bok', e: '📕', n: 'bok', bin: 'nej' },
  { id: 'boll', e: '⚽', n: 'boll', bin: 'nej' },
];
export const MACHINE_SEQUENCES = [
  { name: 'tvättmaskinen', steps: ['Fyll på vatten 💧', 'Tvätta 🫧', 'Skölj 🚿', 'Centrifugera 🌀'] },
  { name: 'trafikljuset', steps: ['Rött – stanna 🔴', 'Gult – gör dig redo 🟡', 'Grönt – kör 🟢', 'Gult – snart rött 🟡'] },
  { name: 'tandborstningen', steps: ['Ta tandborsten 🪥', 'Klämma ut tandkräm', 'Borsta två minuter ⏱️', 'Spotta och skölj'] },
  { name: 'mackan', steps: ['Ta fram en brödskiva 🍞', 'Bred på smör 🧈', 'Lägg på ost 🧀', 'Ät! 😋'] },
];
export function genEveryday(level, rng) {
  if (level >= 1 && rng.chance(0.5)) {
    const seq = rng.pick(MACHINE_SEQUENCES);
    return {
      type: 'order',
      prompt: `Ett program är steg i rätt ordning. Ordna stegen för ${seq.name}!`,
      items: rng.shuffle(seq.steps.map((s, i) => ({ id: String(i), label: s, say: s }))),
      answerOrder: seq.steps.map((_, i) => String(i)),
      hint: 'Vad måste hända först?',
      explain: 'En dator gör exakt det programmet säger – i exakt den ordningen. Därför måste instruktionerna vara tydliga!',
    };
  }
  const items = rng.sample(PROGRAMMED_THINGS, level === 0 ? 4 : 6);
  return {
    type: 'sort',
    prompt: 'Vilka saker styrs av ett datorprogram?',
    bins: [
      { id: 'ja', label: 'Har ett program', html: '💻' },
      { id: 'nej', label: 'Inget program', html: '🙅' },
    ],
    items: items.map((i) => ({ id: i.id, html: `<span class="pic sm">${i.e}</span><span class="lbl">${i.n}</span>`, bin: i.bin, say: i.n })),
    hint: 'Följer saken sparade instruktioner? El ensam betyder inte att något har ett datorprogram.',
    explain: 'Tvättmaskiner, trafikljus och mobiler har små datorer inuti som följer program som människor har skrivit.',
  };
}

/* ---------- Rita med kod (sköldpaddsgrafik) ---------- */
export function turtleSegments(prog, start = { x: 0, y: 0, dir: 'N' }) {
  let { x, y, dir } = start;
  const segs = [];
  const path = [{ x, y }];
  for (const c of expand(prog, 400)) {
    if (c === 'V') dir = TURN_L[dir];
    else if (c === 'H') dir = TURN_R[dir];
    else if (c === 'F') {
      const nx = x + DIRS[dir][0];
      const ny = y + DIRS[dir][1];
      segs.push([x, y, nx, ny]);
      x = nx;
      y = ny;
      path.push({ x, y });
    }
  }
  return { segs, end: { x, y, dir }, path };
}

/** Normaliserar en mängd streck så att form – inte position eller vridning – jämförs. */
export function shapeSignature(segs) {
  const variants = [];
  const tfs = [
    (x, y) => [x, y], (x, y) => [-y, x], (x, y) => [-x, -y], (x, y) => [y, -x],
    (x, y) => [-x, y], (x, y) => [y, x], (x, y) => [x, -y], (x, y) => [-y, -x],
  ];
  for (const tf of tfs) {
    const t = segs.map(([a, b, c, d]) => {
      const [x1, y1] = tf(a, b);
      const [x2, y2] = tf(c, d);
      return x1 < x2 || (x1 === x2 && y1 <= y2) ? [x1, y1, x2, y2] : [x2, y2, x1, y1];
    });
    const minX = Math.min(...t.map((s) => Math.min(s[0], s[2])));
    const minY = Math.min(...t.map((s) => Math.min(s[1], s[3])));
    const keys = [...new Set(t.map(([a, b, c, d]) => `${a - minX},${b - minY},${c - minX},${d - minY}`))].sort();
    variants.push(keys.join('|'));
  }
  return variants.sort()[0] || '';
}

export const TURTLE_CHALLENGES = [
  { id: 'line', title: 'Ett streck', goal: 'Rita ett rakt streck som är 3 steg långt.', solution: 'F F F', maxBlocks: 4 },
  { id: 'corner', title: 'Ett hörn', goal: 'Rita ett hörn: 2 steg, sväng, 2 steg.', solution: 'F F H F F', maxBlocks: 6 },
  { id: 'square', title: 'En kvadrat', goal: 'Rita en kvadrat där varje sida är 2 steg. Tips: använd 🔁!', solution: '4(F F H)', maxBlocks: 5, loops: true },
  { id: 'stairs', title: 'En trappa', goal: 'Rita en trappa med tre trappsteg.', solution: '3(F H F V)', maxBlocks: 6, loops: true },
  { id: 'rect', title: 'En rektangel', goal: 'Rita en rektangel: 3 steg lång och 1 steg bred.', solution: '2(F F F H F H)', maxBlocks: 8, loops: true },
  { id: 'bigsquare', title: 'Stor kvadrat', goal: 'Rita en kvadrat med sidan 4 – med så få block som möjligt.', solution: '4(4(F) H)', maxBlocks: 5, loops: true },
  { id: 'free', title: 'Fritt ritande', goal: 'Rita vad du vill! Kan du rita ett hus, en orm eller din första bokstav?', solution: null, maxBlocks: 40, loops: true },
];

/* ---------- Kodkurs: förstå, pröva, förklara ---------- */
// Exempel använder läsbar låtsaskod, inte ett särskilt programmeringsspråk.
export const CODING_LESSONS = [
  { id: 'algorithms', moduleId: 'algorithms', title: 'Tydliga steg', minLevel: 0, steps: [
    { title: 'Vad är kod?', text: 'Kod är instruktioner som en dator kan följa. Människor bestämmer vad programmet ska göra.', example: 'En knapp kan ha instruktionen: spela en ton.' },
    { title: 'Ordningen spelar roll', text: 'En algoritm är en metod med tydliga steg för att lösa en uppgift. Du kan beskriva den med ord, bilder eller kod.', example: 'Ta en brödskiva → bred smör → lägg på ost.' },
    { title: 'Var exakt', text: 'När du skriver vanlig kod behöver instruktionerna vara tydliga. Berätta hur långt och åt vilket håll roboten ska gå.', example: 'Gå två rutor åt höger är tydligare än gå dit.' },
  ], takeaway: 'Jag kan dela en uppgift i tydliga steg och lägga dem i rätt ordning.' },
  { id: 'debugging', moduleId: 'debugging', title: 'Hitta och laga fel', minLevel: 0, steps: [
    { title: 'Fel är ledtrådar', text: 'Ett programfel kallas ibland bugg. Felsökning betyder att ta reda på varför resultatet blev fel.', example: 'Roboten går tre rutor men målet ligger två rutor bort.' },
    { title: 'Testa ett steg i taget', text: 'Först gissar du vad som ska hända. Kör sedan långsamt och jämför varje steg med planen.', example: 'Efter första pilen ska roboten stå i rutan bredvid starten.' },
    { title: 'Ändra och testa igen', text: 'Ändra det steg som verkar fel. Testa både det gamla exemplet och ett nytt så du ser att lösningen fungerar.', example: 'Ta bort den extra pilen och kör igen.' },
  ], takeaway: 'Jag kan förutsäga, testa, hitta felet och pröva en förbättring.' },
  { id: 'loops', moduleId: 'loops', title: 'Upprepa med loopar', minLevel: 1, steps: [
    { title: 'Samma sak flera gånger', text: 'En loop upprepar instruktioner. Du väljer vilka steg som ska upprepas och hur många gånger.', example: 'Upprepa 3 gånger: gå framåt. Det ger tre steg.' },
    { title: 'Hela paketet upprepas', text: 'Alla steg inuti loopen görs i ordning vid varje varv.', example: 'Upprepa 2 gånger: klappa, stampa. Resultat: klappa, stampa, klappa, stampa.' },
    { title: 'Planera stoppet', text: 'En loop behöver en tydlig regel för när den slutar. Annars kan den fortsätta utan att uppgiften blir klar.', example: 'Upprepa 4 gånger är en tydlig stoppregel.' },
  ], takeaway: 'Jag kan känna igen upprepningar och räkna vad en loop gör.' },
  { id: 'conditions', moduleId: 'conditions', title: 'Om något händer', minLevel: 2, steps: [
    { title: 'Välj med en regel', text: 'Ett villkor är en fråga som programmet kontrollerar. Svaret avgör vilket steg som körs.', example: 'Om det regnar: ta paraply. Annars: lämna paraplyet.' },
    { title: 'Kontrollera rätt sak', text: 'Programmet behöver information för att kontrollera villkoret, till exempel en knapp eller en sensor.', example: 'En dörr kan öppnas om en sensor märker någon framför den.' },
    { title: 'Testa båda vägarna', text: 'Prova när villkoret stämmer och när det inte stämmer.', example: 'Testa dörren både med och utan någon framför sensorn.' },
  ], takeaway: 'Jag kan följa en om–annars-regel och testa båda fallen.' },
  { id: 'variables', moduleId: 'variables', title: 'Kom ihåg ett värde', minLevel: 3, steps: [
    { title: 'Ett namn för information', text: 'En variabel har ett namn och sparar ett värde som programmet kan använda. Värdet kan ändras.', example: 'poäng = 0' },
    { title: 'Uppdatera värdet', text: 'När en spelare får en stjärna kan programmet öka poängen. Det gamla värdet används för att räkna ut det nya.', example: 'poäng = poäng + 1. Om poäng var 2 blir den 3.' },
    { title: 'Följ förändringen', text: 'Skriv upp värdet efter varje instruktion. Då ser du hur programmet minns saker.', example: 'liv = 3 → förlora ett liv → liv = 2.' },
  ], takeaway: 'Jag kan följa hur ett sparat värde ändras under ett program.' },
  { id: 'events', moduleId: 'events', title: 'Händelser och funktioner', minLevel: 4, steps: [
    { title: 'Något startar koden', text: 'En händelse kan vara ett knapptryck, en timer eller att två saker krockar i ett spel. Programmet kan reagera på händelsen.', example: 'När hoppknappen trycks: låt figuren hoppa.' },
    { title: 'Ge ett paket steg ett namn', text: 'En funktion är ett namngivet paket instruktioner. Att anropa funktionen betyder att köra dess steg.', example: 'hälsa: vinka, säg hej. Anropa hälsa när någon kommer.' },
    { title: 'Bygg och prova', text: 'Dela ett stort program i mindre delar. Testa varje del och sedan hur delarna fungerar tillsammans.', example: 'Testa hoppet för sig. Testa sedan hoppet när knappen trycks.' },
  ], takeaway: 'Jag kan beskriva vad som startar kod och hur funktioner återanvänder steg.' },
];

const question = (minLevel, prompt, options, answer, hint, explain) => ({ minLevel, prompt, options, answer, hint, explain });
export const CODING_QUESTIONS = {
  algorithms: [
    question(0, 'Du ska ta på skor. Vad gör du först?', ['Ta på strumpor', 'Knyt skorna', 'Gå ut'], 0, 'Vad ska sitta under skorna?', 'Strumporna behöver vara på innan skorna. Ordningen gör instruktionen användbar.'),
    question(0, 'Vilken instruktion är tydligast för roboten?', ['Gå lite', 'Gå två rutor åt höger', 'Gå dit borta'], 1, 'Roboten behöver antal och riktning.', 'Två rutor åt höger berättar både hur långt och åt vilket håll.'),
    question(1, 'Roboten ska flytta två rutor höger och en ner. Vilket program passar?', ['Höger, höger, ner', 'Höger, ner, ner', 'Ner, vänster, vänster'], 0, 'Räkna pilarna åt varje håll.', 'Två högerpilar och en nerpil ger den önskade förflyttningen.'),
    question(2, 'Vad är en algoritm?', ['En metod med tydliga steg', 'Bara en sorts robot', 'Ett fel i datorn'], 0, 'Tänk på en instruktion för att lösa en uppgift.', 'En algoritm beskriver en metod. Den kan skrivas som ord, bilder eller kod.'),
    question(3, 'Två olika program når samma mål. Vad kan du jämföra?', ['Hur många steg de behöver', 'Vilket som har finast namn', 'Om datorn tycker om det'], 0, 'Båda fungerar. Vilken egenskap går att mäta?', 'Antalet steg hjälper dig jämföra hur mycket arbete programmen gör.'),
  ],
  debugging: [
    question(0, 'Roboten går åt vänster men målet är åt höger. Vad ändrar du?', ['Pilen till höger', 'Målets färg', 'Robotens namn'], 0, 'Vilken instruktion styr rörelsen?', 'En högerpil ändrar rörelsen åt rätt håll. Färg och namn ändrar inte steget.'),
    question(0, 'Programmet fungerar inte som du tänkte. Vad är en bra början?', ['Kör ett steg i taget', 'Tryck snabbare', 'Ge upp direkt'], 0, 'Försök se var planen och resultatet skiljer sig.', 'När du testar ett steg i taget kan du hitta den första platsen där något blir fel.'),
    question(1, 'Målet är tre rutor bort. Programmet går två rutor. Vad saknas?', ['Ett steg framåt', 'Två steg bakåt', 'Ett nytt mål'], 0, 'Jämför tre steg med två.', 'Ett extra steg framåt gör två steg till tre.'),
    question(2, 'Du har lagat en bugg. Vad gör du sedan?', ['Testar programmet igen', 'Vet att allt alltid fungerar', 'Tar bort alla instruktioner'], 0, 'En ändring kan påverka fler steg.', 'Testa igen för att se att felet är löst och att andra delar fortfarande fungerar.'),
    question(4, 'Du ändrar fem saker samtidigt. Varför blir felsökningen svårare?', ['Du vet inte vilken ändring som hjälpte', 'Datorn blir ledsen', 'Fler ändringar fungerar alltid bättre'], 0, 'Hur kan du koppla ändringen till resultatet?', 'En liten ändring i taget gör det lättare att förstå vad som orsakade förbättringen.'),
  ],
  loops: [
    question(1, 'Upprepa 3 gånger: klappa. Hur många klappar blir det?', ['3', '1', '6'], 0, 'Varje varv ger en klapp.', 'Tre varv med en klapp i varje ger tre klappar.'),
    question(1, 'Vilket program betyder höger, höger, höger, höger?', ['Upprepa 4 gånger: höger', 'Upprepa 2 gånger: höger', 'Höger, vänster'], 0, 'Räkna de fyra likadana stegen.', 'En loop kan skriva fyra likadana steg som en instruktion med antal fyra.'),
    question(2, 'Upprepa 2 gånger: klappa, stampa. Vad händer?', ['Klappa, stampa, klappa, stampa', 'Klappa, klappa, stampa, stampa', 'Klappa, stampa'], 0, 'Hela paketet körs vid varje varv.', 'Först görs klappa och stampa. Sedan görs båda igen i samma ordning.'),
    question(3, 'Upprepa 3 gånger: gå 2 steg. Hur många steg totalt?', ['6', '5', '3'], 0, 'Lägg ihop 2 + 2 + 2.', 'Tre varv med två steg i varje ger sex steg.'),
    question(4, 'En loop säger: fortsätt tills poäng är 5. Poäng ändras aldrig från 0. Vad kan hända?', ['Loopen fortsätter utan att nå stoppet', 'Poäng blir automatiskt 5', 'Loopen kör alltid exakt 5 varv'], 0, 'Kan stoppvillkoret bli sant?', 'Om poäng förblir 0 blir villkoret poäng är 5 aldrig sant. Programmet behöver kunna nå stoppet.'),
  ],
  conditions: [
    question(2, 'Om det regnar: ta paraply. Annars: ta keps. Det regnar. Vad väljs?', ['Paraply', 'Keps', 'Båda alltid'], 0, 'Kontrollera om-regeln.', 'Villkoret det regnar stämmer, så programmet väljer paraply.'),
    question(2, 'Om dörren är låst: använd nyckel. Annars: öppna. Dörren är olåst. Vad händer?', ['Öppna', 'Använd nyckel', 'Lås dörren'], 0, 'Villkoret är inte uppfyllt. Följ annars.', 'Eftersom dörren inte är låst körs annars-steget: öppna.'),
    question(3, 'Om poäng är större än 10: visa medalj. Poäng är 10. Visas medaljen?', ['Nej', 'Ja', 'Alltid'], 0, 'Större än betyder inte lika med.', '10 är lika med 10, men inte större än 10. Medaljen visas därför inte.'),
    question(3, 'Om liv är 0: avsluta spelet. Liv är 1. Vad vet vi?', ['Avsluta-regeln körs inte', 'Spelet avslutas', 'Liv blir automatiskt 0'], 0, 'Jämför värdet 1 med villkoret 0.', 'Liv är inte 0, så just den här regeln avslutar inte spelet.'),
    question(4, 'Du testar en om–annars-regel. Vilka fall behöver du prova?', ['Både när villkoret stämmer och inte stämmer', 'Bara när det stämmer', 'Bara när du vinner'], 0, 'Det finns två möjliga vägar.', 'Båda grenarna behöver testas, eftersom ett fel kan finnas i bara en av dem.'),
  ],
  variables: [
    question(3, 'poäng börjar på 0. Du får en stjärna och ökar poäng med 1. Vad är poäng nu?', ['1', '0', '2'], 0, 'Börja på 0 och lägg till 1.', 'Variabeln poäng ändras från 0 till 1.'),
    question(3, 'liv = 3. Du förlorar ett liv. Vilket värde sparas?', ['2', '3', '4'], 0, 'Ta bort 1 från 3.', 'Det nya sparade värdet blir 2. Programmet kan använda det vid nästa steg.'),
    question(3, 'Vad passar att spara i en variabel i ett spel?', ['Antalet poäng', 'Datorns känslor', 'En instruktion som aldrig kan ändras'], 0, 'Vad behöver spelet komma ihåg?', 'Poäng är information som spelet behöver spara och uppdatera.'),
    question(4, 'antal = 2. Sedan antal = antal + 3. Vad blir antal?', ['5', '3', '2'], 0, 'Använd det gamla värdet 2 när du räknar.', 'Det gamla värdet 2 plus 3 blir 5, som sparas som det nya värdet.'),
    question(4, 'poäng = 2. Upprepa 3 gånger: öka poäng med 1. Vad blir poäng?', ['5', '3', '6'], 0, 'Följ värdena: 2 → 3 → 4 → …', 'Poäng börjar på 2 och ökar tre gånger. Slutvärdet är 5.'),
  ],
  events: [
    question(4, 'När hoppknappen trycks: hoppa. Vad är händelsen?', ['Knappen trycks', 'Figuren hoppar', 'Figurens färg'], 0, 'Vad startar instruktionen?', 'Knapptrycket är händelsen. Hoppet är det programmet gör som svar.'),
    question(4, 'Funktionen hälsa betyder: vinka, säg hej. Du anropar hälsa. Vad händer?', ['Vinka och säg hej', 'Bara namnet visas', 'Ingenting kan hända'], 0, 'Att anropa betyder att köra paketets steg.', 'Anropet kör de två instruktionerna i funktionen hälsa.'),
    question(4, 'Samma tre steg behövs på fyra ställen. Vad hjälper dig återanvända dem?', ['En funktion med de tre stegen', 'Fyra olika stavningar', 'Att ta bort alla steg'], 0, 'Ge paketet ett namn och kör det flera gånger.', 'En funktion samlar stegen så att samma paket kan anropas på flera ställen.'),
    question(4, 'När en timer ringer: spela en ton. Timern har inte ringt. Körs tonen av den regeln?', ['Nej', 'Ja, hela tiden', 'Ja, när skärmen blir blå'], 0, 'Vilken händelse måste först inträffa?', 'Den här regeln väntar på timerhändelsen. Den startar inte tonen innan dess.'),
    question(4, 'Funktionen dubbel tar ett tal och ger talet + talet. Vad ger dubbel med talet 3?', ['6', '3', '9'], 0, 'Räkna 3 + 3.', 'En funktion kan använda information den får. Här ger 3 + 3 resultatet 6.'),
  ],
};

export function genCoding(topic, level, rng) {
  const questions = CODING_QUESTIONS[topic];
  const effectiveLevel = Math.max(level, Math.min(...questions.map((item) => item.minLevel)));
  const eligible = questions.filter((item) => item.minLevel <= effectiveLevel);
  // Prefer the newest concepts without hiding earlier foundations.
  const newest = eligible.filter((item) => item.minLevel === Math.max(...eligible.map((item) => item.minLevel)));
  const item = rng.pick(rng.chance(0.7) ? newest : eligible);
  return {
    type: 'choice', prompt: item.prompt, say: item.prompt,
    options: rng.shuffle(item.options.map((label, i) => ({ id: String(i), label, say: label }))),
    answer: String(item.answer), hint: item.hint, explain: item.explain,
  };
}

export const codeApp = {
  id: 'code',
  name: 'Kodning',
  icon: '🤖',
  color: '#ff7a2f',
  tagline: 'Förstå kod, lös problem och skapa själv',
  modules: [
    { id: 'course', name: 'Kodkursen', icon: '📖', minLevel: 0, view: 'course', lgr: ['ma-instr', 'tk-prog'] },
    ...CODING_LESSONS.map((lesson) => ({ id: lesson.id, name: lesson.title, icon: { algorithms: '🧩', debugging: '🔎', loops: '🔁', conditions: '🚦', variables: '📦', events: '⚡' }[lesson.id], minLevel: lesson.minLevel, gen: (level, rng) => genCoding(lesson.id, level, rng), lgr: ['ma-instr', 'tk-prog'] })),
    { id: 'robot', name: 'Robotbanan', icon: '🤖', minLevel: 0, view: 'robot', lgr: ['ma-instr', 'tk-styr'] },
    { id: 'predict', name: 'Följ koden', icon: '👣', minLevel: 0, gen: genPredict, lgr: ['ma-instr'] },
    { id: 'everyday', name: 'Program i vardagen', icon: '🏠', minLevel: 0, gen: genEveryday, lgr: ['tk-prog', 'ma-instr'] },
    { id: 'turtle', name: 'Rita med kod', icon: '🐢', minLevel: 2, view: 'turtle', lgr: ['ma-instr', 'ma-geo', 'ma-monster'] },
  ],
};
