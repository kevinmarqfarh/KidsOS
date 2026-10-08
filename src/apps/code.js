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
      explain: `Roboten hamnar ${steps} steg bort, på den markerade rutan.`,
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
    hint: 'Behöver saken el och gör den saker av sig själv i en viss ordning?',
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

export const codeApp = {
  id: 'code',
  name: 'Kod',
  icon: '🤖',
  color: '#ff7a2f',
  tagline: 'Styr roboten med programmering',
  modules: [
    { id: 'robot', name: 'Robotbanan', icon: '🤖', minLevel: 0, view: 'robot', lgr: ['ma-instr', 'tk-styr'] },
    { id: 'predict', name: 'Följ koden', icon: '👣', minLevel: 0, gen: genPredict, lgr: ['ma-instr'] },
    { id: 'everyday', name: 'Program i vardagen', icon: '🏠', minLevel: 0, gen: genEveryday, lgr: ['tk-prog', 'ma-instr'] },
    { id: 'turtle', name: 'Rita med kod', icon: '🐢', minLevel: 2, view: 'turtle', lgr: ['ma-instr', 'ma-geo', 'ma-monster'] },
  ],
};
