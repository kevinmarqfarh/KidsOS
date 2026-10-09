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
 * stage = steg i progressionen (0–4), se ROBOT_STAGES. Banorna ligger i stigande stage.
 * bug = ett program med ett fel som barnet ska hitta och rätta ("debugga").
 * OBS: id får inte ändras – sparade framsteg lagras per id.
 */
export const ROBOT_STAGES = [
  { stage: 0, icon: '👶', name: 'Första stegen', desc: 'Ett eller två pilsteg' },
  { stage: 1, icon: '➡️', name: 'Pilar', desc: 'Korta program och hinder' },
  { stage: 2, icon: '🧩', name: 'Sekvenser', desc: 'Långa program, stjärnor och sväng & kör' },
  { stage: 3, icon: '🔁', name: 'Loopar', desc: 'Upprepa samma steg' },
  { stage: 4, icon: '🐞', name: 'Buggjakt', desc: 'Hitta felet i programmet och rätta det' },
];

export const ROBOT_LEVELS = [
  { id: 1, stage: 0, title: 'Första steget', mode: 'abs', map: ['S.G'], maxBlocks: 4, teach: 'Tryck på pilarna för att bygga ett program. Tryck sedan på ▶ Kör!', solution: 'R R' },
  { id: 2, stage: 0, title: 'Ner till blomman', mode: 'abs', map: ['S', '.', 'G'], maxBlocks: 4, teach: 'Roboten kan gå neråt också. Tryck på pilen ner två gånger.', solution: 'D D' },
  { id: 3, stage: 1, title: 'Runt hörnet', mode: 'abs', map: ['S..', '..G'], maxBlocks: 5, teach: 'Blanda pilarna!', solution: 'R R D' },
  { id: 4, stage: 1, title: 'Stenen i vägen', mode: 'abs', map: ['S#G', '...'], maxBlocks: 6, teach: 'Roboten kan inte gå genom stenar. Gå runt!', solution: 'D R R U' },
  { id: 5, stage: 2, title: 'Samla stjärnan', mode: 'abs', map: ['S.*', '#..', 'G..'], maxBlocks: 8, teach: 'Samla alla stjärnor innan du går till målet.', solution: 'R R D D L L' },
  { id: 6, stage: 2, title: 'Två stjärnor', mode: 'abs', map: ['S.#G', '*...', '..*.'], maxBlocks: 9, teach: 'Planera vägen innan du bygger.', solution: 'D R R D R U U' },
  { id: 7, stage: 2, title: 'Labyrinten', mode: 'abs', map: ['S.#..', '#.#.#', '..#..', '.##.#', '....G'], maxBlocks: 12, teach: 'Följ den öppna vägen genom labyrinten.', solution: 'R D D L D D R R R R' },
  { id: 8, stage: 2, title: 'Vid sjön', mode: 'abs', map: ['S.~..', '..~.*', '.....', '~~~.G'], maxBlocks: 11, teach: 'Roboten kan inte simma – akta vattnet!', solution: 'D D R R R R U D D' },
  { id: 9, stage: 2, title: 'Framåt!', mode: 'rel', map: ['S...G'], maxBlocks: 6, teach: 'Nu är det nya block! 👣 betyder framåt – dit roboten tittar.', solution: 'F F F F' },
  { id: 10, stage: 2, title: 'Sväng höger', mode: 'rel', map: ['S.#', '#.#', '#.G'], maxBlocks: 8, teach: '↷ svänger roboten åt höger – den står kvar men tittar åt ett nytt håll.', solution: 'F H F F V F' },
  { id: 11, stage: 2, title: 'Sväng vänster', mode: 'rel', map: ['..G', '.#.', 'S..'], maxBlocks: 7, teach: '↶ svänger åt vänster. Tänk dig att du är roboten!', solution: 'F F V F F' },
  { id: 12, stage: 2, title: 'Stjärnjakt', mode: 'rel', map: ['S.*', '#..', 'G.*'], maxBlocks: 10, teach: 'Samla båda stjärnorna.', solution: 'F F H F F H F F' },
  { id: 13, stage: 2, title: 'Vänd om', mode: 'rel', map: ['G..S'], maxBlocks: 7, start: 'E', teach: 'Roboten tittar åt fel håll. Hur vänder man sig om?', solution: 'V V F F F' },
  { id: 14, stage: 3, title: 'Upprepa!', mode: 'abs', loops: true, map: ['S......G'], maxBlocks: 2, teach: 'Nytt block: 🔁 Upprepa. Lägg en pil i loopen och välj hur många gånger. Bara 2 block får plats!', solution: '7(R)' },
  { id: 15, stage: 3, title: 'Trappan', mode: 'abs', loops: true, map: ['S...', '....', '....', '...G'], maxBlocks: 3, teach: 'En trappa är samma steg om och om igen: höger, ner …', solution: '3(R D)' },
  { id: 16, stage: 3, title: 'Stjärnhörnet', mode: 'abs', loops: true, map: ['S****', '....*', '....*', '....G'], maxBlocks: 4, teach: 'Använd två loopar.', solution: '4(R) 3(D)' },
  { id: 17, stage: 3, title: 'Sicksack', mode: 'abs', loops: true, map: ['S.###', '#..##', '##..#', '###.G'], maxBlocks: 4, teach: 'Hitta mönstret i vägen.', solution: '3(R D) R' },
  { id: 18, stage: 3, title: 'Rundan', mode: 'rel', loops: true, map: ['S..*', 'G##.', '.##.', '*...'], maxBlocks: 8, teach: 'Gå runt stenarna. Vilka steg upprepas?', solution: '3(F F F H) F F' },
  { id: 19, stage: 3, title: 'Långa vägen', mode: 'rel', loops: true, map: ['S.....', '#####.', '......', '.#####', 'G.....'], maxBlocks: 12, teach: 'Långa raka sträckor? Använd loopar!', solution: '5(F) H 2(F) H 5(F) V 2(F)' },
  { id: 20, stage: 3, title: 'Mästarprovet', mode: 'abs', loops: true, map: ['S*.*.*.', '######.', 'G*.*.*.'], maxBlocks: 6, teach: 'Samla alla sex stjärnor med bara sex block!', solution: '6(R) 2(D) 6(L)' },
  { id: 21, stage: 3, title: 'Snedtrappan', mode: 'rel', loops: true, map: ['S.###', '#..##', '##..#', '###..', '####G'], maxBlocks: 5, teach: 'Framåt, sväng, framåt, sväng tillbaka … Vilka fyra block upprepas?', solution: '4(F H F V)' },
  { id: 22, stage: 3, title: 'Upp i tornet', mode: 'abs', loops: true, map: ['G', '*', '.', '*', '.', '*', 'S'], maxBlocks: 2, teach: 'Klättra hela vägen upp och samla stjärnorna. Bara 2 block!', solution: '6(U)' },
  { id: 23, stage: 4, title: 'Buggjakt', mode: 'abs', map: ['S..', '..G'], maxBlocks: 3, bug: 'R R U', teach: 'Programmet har en bugg – ett fel! Kör det och se vad som händer. Tryck på ett block för att byta riktning.', solution: 'R R D' },
  { id: 24, stage: 4, title: 'Fel sväng', mode: 'rel', map: ['S.#', '#.#', '#.G'], maxBlocks: 6, bug: 'F V F F V F', teach: 'Roboten svänger åt fel håll någonstans. Hitta buggen och byt blocket!', solution: 'F H F F V F' },
  { id: 25, stage: 4, title: 'Stjärnbuggen', mode: 'abs', map: ['S*.', '#.*', 'G..'], maxBlocks: 6, bug: 'R R D D L U', teach: 'Roboten tar stjärnorna men kommer inte fram. Vilket block är fel?', solution: 'R R D D L L' },
  { id: 26, stage: 4, title: 'Vattenbuggen', mode: 'abs', map: ['S.~', '..~', '~.G'], maxBlocks: 4, bug: 'R D R R', teach: 'Plask! Följ programmet med fingret och hitta steget som går ut i vattnet.', solution: 'R D D R' },
  { id: 27, stage: 4, title: 'Loopbuggen', mode: 'abs', loops: true, map: ['S.....', '.....G'], maxBlocks: 3, bug: '4(R) D', teach: 'Loopen går för få varv. Tryck på siffran i loopen för att ändra den!', solution: '5(R) D' },
  { id: 28, stage: 4, title: 'Trappbuggen', mode: 'abs', loops: true, map: ['S....', '.....', '.....', '....G'], maxBlocks: 4, bug: '3(R D) L', teach: 'Trappan är rätt, men sista steget är fel. Debugga!', solution: '3(R D) R' },
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

/* ---------- Lösare: hittar ett program med så få block som möjligt ---------- */
/**
 * Dijkstra över robotens lägen (position, riktning, insamlade stjärnor) där varje
 * kant är ett block i redigeraren: ett kommando (1 block) eller en loop utan
 * nästling (1 + kroppens längd). Returnerar { program, blocks } eller null.
 * Följer exakt runProgram: vinst så fort roboten står på målet med alla stjärnor.
 */
export function solveLevel(level, { loops = !!level.loops, maxBody = 4, maxN = 9, maxCost = 30 } = {}) {
  const L = parseLevel(level);
  const cmds = L.mode === 'rel' ? ['F', 'V', 'H'] : ['U', 'D', 'L', 'R'];
  const starIdx = new Map(L.stars.map((s, i) => [`${s.x},${s.y}`, i]));
  const full = (1 << L.stars.length) - 1;
  const keyOf = (st) => `${st.x},${st.y},${L.mode === 'rel' ? st.dir : '-'},${st.m}`;
  // ett primitivt steg: returnerar nytt läge, 'win' eller null (krock/vatten/utanför)
  const step = (st, c) => {
    if (c === 'V') return { ...st, dir: TURN_L[st.dir] };
    if (c === 'H') return { ...st, dir: TURN_R[st.dir] };
    const d = c === 'F' ? st.dir : ABS[c];
    const nx = st.x + DIRS[d][0];
    const ny = st.y + DIRS[d][1];
    if (nx < 0 || ny < 0 || nx >= L.w || ny >= L.h || L.blocked.has(`${nx},${ny}`)) return null;
    const si = starIdx.get(`${nx},${ny}`);
    const m = si === undefined ? st.m : st.m | (1 << si);
    const out = { x: nx, y: ny, dir: c === 'F' ? st.dir : d, m };
    if (nx === L.goal.x && ny === L.goal.y && m === full) out.win = true;
    return out;
  };
  const bodies = [];
  if (loops) {
    let layer = [[]];
    for (let len = 1; len <= maxBody; len++) {
      layer = layer.flatMap((b) => cmds.map((c) => [...b, c]));
      bodies.push(...layer);
    }
  }
  const start = { x: L.start.x, y: L.start.y, dir: L.dir, m: 0 };
  const buckets = Array.from({ length: maxCost + 1 }, () => []);
  const best = new Map([[keyOf(start), 0]]);
  buckets[0].push({ st: start, prog: [] });
  let found = null;
  for (let cost = 0; cost <= maxCost; cost++) {
    if (found && found.blocks <= cost) return found;
    for (const { st, prog } of buckets[cost]) {
      if (best.get(keyOf(st)) < cost) continue;
      const push = (ns, item, c) => {
        if (c > maxCost) return;
        if (ns.win) {
          if (!found || c < found.blocks) found = { program: [...prog, item], blocks: c };
          return;
        }
        const k = keyOf(ns);
        if (best.has(k) && best.get(k) <= c) return;
        best.set(k, c);
        buckets[c].push({ st: ns, prog: [...prog, item] });
      };
      {
        for (const c of cmds) {
          const ns = step(st, c);
          if (ns) push(ns, { cmd: c }, cost + 1);
        }
        for (const body of bodies) {
          let cur = st;
          let ok = true;
          for (let n = 1; n <= maxN && ok; n++) {
            for (const c of body) {
              cur = step(cur, c);
              if (!cur) {
                ok = false;
                break;
              }
              if (cur.win) break;
            }
            if (!ok) break;
            if (n >= 2) push(cur, { cmd: 'loop', n, body: body.map((c) => ({ cmd: c })) }, cost + 1 + body.length);
            if (cur.win) break;
          }
        }
      }
    }
  }
  return found;
}

/* ---------- Gemensamt: rutnät som SVG och kodrader ---------- */
const CELL = 64;
function gridSvg({ w, h, robot, goal, rocks = [], hits = false, dir = null }) {
  let g = '';
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      const attrs = hits ? `class="hit cell" data-hit="${i},${j}"` : 'class="cell"';
      g += `<rect ${attrs} x="${i * CELL + 4}" y="${j * CELL + 4}" width="${CELL - 6}" height="${CELL - 6}" rx="10" fill="#eef4ff" stroke="#c4d3f0" stroke-width="2"/>`;
    }
  }
  const emoji = (x, y, e) => `<text x="${x * CELL + 33}" y="${y * CELL + 46}" text-anchor="middle" font-size="34" pointer-events="none">${e}</text>`;
  for (const r of rocks) g += emoji(r.x, r.y, '🪨');
  if (goal) g += emoji(goal.x, goal.y, '🏁');
  g += emoji(robot.x, robot.y, '🤖');
  if (dir) {
    const [dx, dy] = DIRS[dir];
    g += `<text x="${robot.x * CELL + 33 + dx * 24}" y="${robot.y * CELL + 42 + dy * 24}" text-anchor="middle" font-size="18" fill="#ff7a2f" font-weight="900" pointer-events="none">●</text>`;
  }
  return `<svg class="predict-grid" viewBox="0 0 ${w * CELL + 6} ${h * CELL + 6}">${g}</svg>`;
}
const chip = (c, n) => (n ? `<span class="code-chip n"><span class="chip-n">${n}</span>${CMD_INFO[c].label}</span>` : `<span class="code-chip">${CMD_INFO[c].label}</span>`);
/** Kodrad som HTML – loopar visas som 🔁 n× [ … ]. */
export function codeHtml(prog) {
  return `<div class="code-line">${prog.map((p) => (p.cmd === 'loop' ? `<span class="code-loop">🔁 ${p.n}× ${p.body.map((b) => chip(b.cmd)).join('')}</span>` : chip(p.cmd))).join('')}</div>`;
}
/** Programmet i ord, för uppläsning. */
export function codeSay(prog) {
  return prog.map((p) => (p.cmd === 'loop' ? `upprepa ${p.n} gånger: ${p.body.map((b) => CMD_INFO[b.cmd].name).join(', ')}` : CMD_INFO[p.cmd].name)).join(', ');
}

/* ---------- Följ koden (förutsäg var roboten hamnar) ---------- */
/**
 * Nivå 0: 2 pilar på 3×3. Nivå 1: 3 pilar. Nivå 2: 4 pilar på 4×4.
 * Nivå 3: en loop (🔁) med ett block + ett extra steg. Nivå 4: loop med två block på 5×5.
 */
export function genPredict(level, rng) {
  const size = level <= 1 ? 3 : level <= 3 ? 4 : 5;
  for (let attempt = 0; attempt < 200; attempt++) {
    const pick = () => rng.pick(['U', 'D', 'L', 'R']);
    let prog;
    if (level <= 2) prog = Array.from({ length: level + 2 }, () => ({ cmd: pick() }));
    else if (level === 3) {
      const loop = { cmd: 'loop', n: rng.int(2, 3), body: [{ cmd: pick() }] };
      prog = rng.chance(0.5) ? [loop, { cmd: pick() }] : [{ cmd: pick() }, loop];
    } else {
      const a = pick();
      let b = pick();
      while (b === a || ABS[b] === TURN_R[TURN_R[ABS[a]]]) b = pick();
      prog = [{ cmd: 'loop', n: 2, body: [{ cmd: a }, { cmd: b }] }, { cmd: pick() }];
      if (rng.chance(0.5)) prog.reverse();
    }
    const sx = rng.int(0, size - 1);
    const sy = rng.int(0, size - 1);
    let x = sx;
    let y = sy;
    let ok = true;
    for (const c of expand(prog)) {
      const [dx, dy] = DIRS[ABS[c]];
      x += dx;
      y += dy;
      if (x < 0 || y < 0 || x >= size || y >= size) {
        ok = false;
        break;
      }
    }
    if (!ok || (x === sx && y === sy)) continue;
    const hasLoop = prog.some((p) => p.cmd === 'loop');
    return {
      type: 'tap',
      prompt: hasLoop ? 'Följ koden! 🔁 betyder upprepa. Var hamnar roboten?' : 'Följ koden! Var hamnar roboten? Tryck på rutan.',
      say: `Följ koden: ${codeSay(prog)}. Var hamnar roboten? Tryck på rutan.`,
      visual: `${codeHtml(prog)}${gridSvg({ w: size, h: size, robot: { x: sx, y: sy }, hits: true })}`,
      answer: `${x},${y}`,
      hint: hasLoop ? 'Gör det som står i loopen så många gånger som siffran säger. Flytta fingret en ruta i taget.' : 'Flytta fingret en ruta i taget, precis som koden säger.',
      explain: `Roboten tar ${expand(prog).length} steg: ${expand(prog).map((c) => CMD_INFO[c].label).join(' ')}. ${hasLoop ? 'En loop sparar block – man skriver stegen en gång och upprepar dem.' : 'Datorer följer instruktioner exakt i ordning, ett steg i taget.'}`,
    };
  }
  return genPredict(Math.max(0, level - 1), rng);
}

/* ---------- Hitta buggen (felsökning) ---------- */
function randomWalk(rng, w, h, steps, rocks) {
  const sx = rng.int(0, w - 1);
  const sy = rng.int(0, h - 1);
  const seen = new Set([`${sx},${sy}`]);
  const prog = [];
  let x = sx;
  let y = sy;
  for (let i = 0; i < steps; i++) {
    const opts = ['U', 'D', 'L', 'R'].filter((c) => {
      const [dx, dy] = DIRS[ABS[c]];
      const nx = x + dx;
      const ny = y + dy;
      return nx >= 0 && ny >= 0 && nx < w && ny < h && !seen.has(`${nx},${ny}`) && !rocks.has(`${nx},${ny}`);
    });
    if (!opts.length) return null;
    const c = rng.pick(opts);
    x += DIRS[ABS[c]][0];
    y += DIRS[ABS[c]][1];
    seen.add(`${x},${y}`);
    prog.push(c);
  }
  return { start: { x: sx, y: sy }, goal: { x, y }, prog, seen };
}
function mapFrom({ w, h, start, goal, rocks }) {
  const rows = [];
  for (let y = 0; y < h; y++) {
    let r = '';
    for (let x = 0; x < w; x++) r += start.x === x && start.y === y ? 'S' : goal.x === x && goal.y === y ? 'G' : rocks.has(`${x},${y}`) ? '#' : '.';
    rows.push(r);
  }
  return { mode: 'abs', map: rows };
}

/** Nivå 0–1: 2–3 pilar, ett fel. Nivå 2–4: längre program, stenar och loopbuggar. */
export function genDebug(level, rng) {
  if (level >= 3 && rng.chance(0.4)) return genLoopBug(level, rng);
  const size = level <= 1 ? 3 : 4;
  const steps = [2, 3, 4, 5, 6][level];
  for (let attempt = 0; attempt < 300; attempt++) {
    const rocks = new Set();
    const nRocks = level <= 1 ? 0 : level === 2 ? 1 : 2;
    while (rocks.size < nRocks) rocks.add(`${rng.int(0, size - 1)},${rng.int(0, size - 1)}`);
    const walk = randomWalk(rng, size, size, steps, rocks);
    if (!walk) continue;
    if ([...rocks].some((r) => walk.seen.has(r))) continue;
    const L = mapFrom({ w: size, h: size, start: walk.start, goal: walk.goal, rocks });
    const b = rng.int(0, steps - 1);
    const wrong = rng.pick(['U', 'D', 'L', 'R'].filter((c) => c !== walk.prog[b]));
    const buggy = walk.prog.slice();
    buggy[b] = wrong;
    const wins = (cmds) => runProgram(L, cmds.map((c) => ({ cmd: c }))).result === 'win';
    if (wins(buggy)) continue;
    // bara ett block ska kunna rättas: inget annat block får laga programmet
    let unique = true;
    for (let j = 0; j < steps && unique; j++) {
      if (j === b) continue;
      for (const c of ['U', 'D', 'L', 'R']) {
        const t = buggy.slice();
        t[j] = c;
        if (wins(t)) unique = false;
      }
    }
    if (!unique) continue;
    const rockList = [...rocks].map((k) => ({ x: +k.split(',')[0], y: +k.split(',')[1] }));
    const res = runProgram(L, buggy.map((c) => ({ cmd: c })));
    const what = { crash: 'krockar roboten med en sten', outside: 'försöker roboten gå utanför banan', 'not-there': 'kommer roboten inte fram till flaggan' }[res.result] || 'går roboten fel';
    return {
      type: 'choice',
      prompt: 'Hitta buggen! Roboten ska till flaggan 🏁. Vilket block är fel?',
      say: `Hitta buggen! Roboten ska gå till flaggan, men programmet har ett fel. Programmet är: ${buggy.map((c) => CMD_INFO[c].name).join(', ')}. Vilket block är fel?`,
      visual: `<div class="code-line">${buggy.map((c, i) => chip(c, i + 1)).join('')}</div>${gridSvg({ w: size, h: size, robot: walk.start, goal: walk.goal, rocks: rockList })}`,
      options: buggy.map((c, i) => ({ id: String(i), html: `<span class="dbg-opt"><span class="chip-n">${i + 1}</span>${CMD_INFO[c].label}</span>`, say: `block ${i + 1}, ${CMD_INFO[c].name}` })),
      answer: String(b),
      meta: { level: L, buggy, fix: walk.prog[b] },
      noSpeakVisual: true,
      hint: 'Följ programmet med fingret, ett block i taget. Var går det fel första gången?',
      explain: `Med buggen ${what}. Block ${b + 1} ska vara ${CMD_INFO[walk.prog[b]].label} (${CMD_INFO[walk.prog[b]].name}), inte ${CMD_INFO[wrong].label}. Att leta upp och rätta fel i ett program kallas att debugga.`,
    };
  }
  return genDebug(Math.max(0, level - 1), rng);
}

/** Loopen går fel antal varv: hur många varv behövs? Bara ett svar fungerar. */
function genLoopBug(level, rng) {
  for (let attempt = 0; attempt < 200; attempt++) {
    const two = level >= 4 && rng.chance(0.6);
    const n = rng.int(2, two ? 4 : 5);
    const body = two ? [{ cmd: 'R' }, { cmd: 'D' }] : [{ cmd: 'R' }];
    const extra = two ? rng.pick(['R', 'D']) : 'D';
    const w = n + 2 + (two && extra === 'R' ? 1 : 0);
    const h = two ? n + 2 : 3;
    const goal = { x: n * (two ? 1 : 1) + (extra === 'R' ? 1 : 0), y: (two ? n : 0) + (extra === 'D' ? 1 : 0) };
    const L = mapFrom({ w, h, start: { x: 0, y: 0 }, goal, rocks: new Set() });
    const prog = (k) => [{ cmd: 'loop', n: k, body }, { cmd: extra }];
    if (runProgram(L, prog(n)).result !== 'win') continue;
    const wrong = rng.pick([n - 1, n + 1].filter((k) => k >= 2 && k <= 9));
    const other = rng.pick([2, 3, 4, 5, 6, 7].filter((k) => k !== n && k !== wrong && runProgram(L, prog(k)).result !== 'win'));
    if (!wrong || !other || runProgram(L, prog(wrong)).result === 'win') continue;
    const shown = prog(wrong);
    return {
      type: 'choice',
      prompt: `Loopbuggen! Loopen går ${wrong} varv och roboten hamnar fel. Hur många varv ska det vara?`,
      say: `Loopbuggen! Programmet är: ${codeSay(shown)}. Loopen går ${wrong} varv och roboten hamnar fel. Hur många varv ska loopen gå?`,
      visual: `${codeHtml(shown)}${gridSvg({ w, h, robot: { x: 0, y: 0 }, goal })}`,
      options: rng.shuffle([n, wrong, other]).map((k) => ({ id: String(k), label: `🔁 ${k}×`, say: `${k} varv` })),
      answer: String(n),
      meta: { level: L, body: body.map((x) => x.cmd), extra },
      noSpeakVisual: true,
      hint: `Räkna hur många ${two ? 'trappsteg' : 'steg åt höger'} roboten behöver innan sista blocket.`,
      explain: `Loopen ska gå ${n} varv. Sedan tar ${CMD_INFO[extra].label} roboten till flaggan. Att ändra en siffra kan vara allt som behövs för att laga en bugg!`,
    };
  }
  return genDebug(2, rng);
}

/* ---------- Om, loopar och funktioner ---------- */
export const IF_RULES = [
  { id: 'regn', rule: 'OM det regnar SÅ tar du paraply, ANNARS tar du keps.', yes: ['🌧️', 'Det regnar.'], no: ['☀️', 'Solen skiner.'], then: ['☂️', 'paraply'], else: ['🧢', 'keps'] },
  { id: 'lampa', rule: 'Gatlampan är programmerad: OM det är mörkt SÅ lyser lampan, ANNARS är den släckt.', yes: ['🌙', 'Det är mörkt ute.'], no: ['🌞', 'Det är ljust ute.'], then: ['💡', 'lampan lyser'], else: ['🌑', 'lampan är släckt'] },
  { id: 'dammsugare', rule: 'Robotdammsugaren: OM det är en vägg framför SÅ svänger den, ANNARS kör den framåt.', yes: ['🧱', 'Det är en vägg framför.'], no: ['🟩', 'Golvet framför är fritt.'], then: ['↩️', 'svänger'], else: ['⬆️', 'kör framåt'] },
  { id: 'dorr', rule: 'Den automatiska dörren: OM någon står framför SÅ öppnas den, ANNARS är den stängd.', yes: ['🧍', 'Någon står framför dörren.'], no: ['🫥', 'Ingen står framför dörren.'], then: ['🚪', 'dörren öppnas'], else: ['🧱', 'dörren är stängd'] },
  { id: 'kallt', rule: 'OM det är minusgrader SÅ tar du vantar, ANNARS går du utan vantar.', yes: ['🥶', 'Det är minus fem grader.'], no: ['😎', 'Det är plus tjugo grader.'], then: ['🧤', 'vantar'], else: ['👐', 'inga vantar'] },
  { id: 'gubbe', rule: 'OM gubben lyser röd SÅ stannar du, ANNARS går du över.', yes: ['🔴', 'Gubben lyser röd.'], no: ['🟢', 'Gubben lyser grön.'], then: ['✋', 'stanna'], else: ['🚶', 'gå över'] },
  { id: 'vattna', rule: 'Vattningsroboten: OM jorden är torr SÅ vattnar den, ANNARS väntar den.', yes: ['🏜️', 'Jorden är torr.'], no: ['💧', 'Jorden är blöt.'], then: ['🚿', 'vattnar'], else: ['⏳', 'väntar'] },
];
const ACTIONS = [
  { e: '👏', n: 'klapp', art: 'en', pl: 'klappar', verb: 'klappar du' },
  { e: '🦶', n: 'stamp', art: 'en', pl: 'stampar', verb: 'stampar du' },
  { e: '🦘', n: 'hopp', art: 'ett', pl: 'hopp', verb: 'hoppar du' },
  { e: '🔔', n: 'pling', art: 'ett', pl: 'pling', verb: 'plingar klockan' },
];
/** "en klapp", "ett hopp", "3 klappar" */
const cnt = (a, k) => (k === 1 ? `${a.art} ${a.n}` : `${k} ${a.pl}`);
const pics = (e, k) => `<span class="logic-big">${e.repeat(k)}</span>`;
const loopHtml = (n, inner) => `<span class="code-loop">🔁 ${n}× ${inner}</span>`;
const seqHtml = (items) => items.map((a) => `<span class="code-chip">${a.e}</span>`).join('');

function genIf(level, rng) {
  const r = rng.pick(IF_RULES);
  const cond = rng.chance(0.5);
  const now = cond ? r.yes : r.no;
  const right = cond ? r.then : r.else;
  const opts = [r.then, r.else];
  if (level >= 2) {
    const other = rng.pick(IF_RULES.filter((x) => x.id !== r.id));
    opts.push(rng.pick([other.then, other.else]));
  }
  return {
    type: 'choice',
    prompt: `${r.rule} ${now[1]} Vad händer?`,
    say: `${r.rule} Nu är det så här: ${now[1]} Vad händer?`,
    visual: `<div class="logic-card"><div class="logic-rule">${r.rule.replace(/\b(OM|SÅ|ANNARS)\b/g, '<b>$1</b>')}</div><div class="logic-now">${now[0]} ${now[1]}</div></div>`,
    options: rng.shuffle(opts).map((o) => ({ id: o[1], html: `<span class="pic">${o[0]}</span><span class="lbl">${o[1]}</span>`, say: o[1] })),
    answer: right[1],
    noSpeakVisual: true,
    hint: `Är det sant att ${now[1].replace(/\.$/, '').toLowerCase()}? Titta på regeln igen.`,
    explain: `${now[1]} Då ${cond ? 'stämmer villkoret, så det som står efter SÅ händer' : 'stämmer inte villkoret, så det som står efter ANNARS händer'}: ${right[0]} ${right[1]}. Program använder OM–SÅ–ANNARS hela tiden.`,
  };
}

function genIfTwo(rng) {
  const [a, b] = rng.sample(IF_RULES.filter((r) => ['regn', 'kallt', 'lampa'].includes(r.id)), 2);
  const ca = rng.chance(0.5);
  const cb = rng.chance(0.5);
  const combo = (x, y) => ({ id: `${x[1]}+${y[1]}`, html: `<span class="pic">${x[0]}${y[0]}</span><span class="lbl">${x[1]} och ${y[1]}</span>`, say: `${x[1]} och ${y[1]}` });
  const all = [combo(a.then, b.then), combo(a.then, b.else), combo(a.else, b.then), combo(a.else, b.else)];
  const right = combo(ca ? a.then : a.else, cb ? b.then : b.else);
  const nowA = ca ? a.yes : a.no;
  const nowB = cb ? b.yes : b.no;
  return {
    type: 'choice',
    prompt: `Två regler! ${a.rule} ${b.rule} ${nowA[1]} ${nowB[1]} Vad blir det?`,
    say: `Två regler. Ett: ${a.rule} Två: ${b.rule} Nu är det så här: ${nowA[1]} ${nowB[1]} Vad blir det?`,
    visual: `<div class="logic-card"><div class="logic-rule">1. ${a.rule.replace(/\b(OM|SÅ|ANNARS)\b/g, '<b>$1</b>')}</div><div class="logic-rule">2. ${b.rule.replace(/\b(OM|SÅ|ANNARS)\b/g, '<b>$1</b>')}</div><div class="logic-now">${nowA[0]} ${nowA[1]} ${nowB[0]} ${nowB[1]}</div></div>`,
    options: rng.shuffle(all),
    answer: right.id,
    noSpeakVisual: true,
    wide: true,
    hint: 'Ta en regel i taget. Vad säger regel 1? Vad säger regel 2?',
    explain: `Regel 1 ger ${right.say.split(' och ')[0]} och regel 2 ger ${right.say.split(' och ')[1]}. Ett program kan ha många villkor – datorn kollar dem ett i taget.`,
  };
}

function genLoopCount(level, rng) {
  const a = rng.pick(ACTIONS);
  if (level <= 1) {
    const n = rng.int(2, 3);
    const opts = level === 0 ? [n, n === 2 ? 3 : 2] : [1, 2, 3, 4].filter((k) => k !== n).slice(0, 2).concat(n);
    return {
      type: 'choice',
      prompt: `🔁 Upprepa ${n} gånger: ${a.e}. Hur blir det?`,
      say: `Upprepa ${n} gånger: ${a.art} ${a.n}. Hur många gånger ${a.verb}?`,
      visual: `<div class="logic-card"><div class="code-line">${loopHtml(n, `<span class="code-chip">${a.e}</span>`)}</div></div>`,
      options: rng.shuffle(opts).map((k) => ({ id: String(k), html: pics(a.e, k), say: `${k}` })),
      answer: String(n),
      noSpeakVisual: true,
      hint: 'Siffran i loopen säger hur många gånger man gör det som står i den.',
      explain: `Loopen gör ${a.e} ${n} gånger: ${a.e.repeat(n)}. En loop upprepar samma sak – då behöver man inte skriva den många gånger.`,
    };
  }
  if (level === 2) {
    const n = rng.int(2, 4);
    const k = rng.int(1, 2);
    const body = Array.from({ length: k }, () => a);
    return {
      type: 'numpad',
      prompt: `🔁 Upprepa ${n} gånger: ${a.e.repeat(k)}. Hur många gånger ${a.verb}?`,
      say: `Upprepa ${n} gånger: ${k === 1 ? `${a.art} ${a.n}` : `två ${a.pl}`}. Hur många gånger ${a.verb}?`,
      visual: `<div class="logic-card"><div class="code-line">${loopHtml(n, seqHtml(body))}</div></div>`,
      answer: n * k,
      hint: `Varje varv blir det ${cnt(a, k)}. Räkna varv för varv.`,
      explain: `${n} varv × ${k} = ${n * k}. ${Array.from({ length: n }, () => a.e.repeat(k)).join(' | ')}`,
    };
  }
  // nivå 3–4: blandade block, nästlade loopar (4)
  const b = rng.pick(ACTIONS.filter((x) => x !== a));
  if (level >= 4 && rng.chance(0.5)) {
    const outer = rng.int(2, 3);
    const inner = rng.int(2, 3);
    const askA = rng.chance(0.5);
    const ans = askA ? outer * inner : outer;
    return {
      type: 'numpad',
      prompt: `En loop i en loop! Hur många gånger ${(askA ? a : b).verb}?`,
      say: `Upprepa ${outer} gånger: först upprepa ${inner} gånger ${a.art} ${a.n}, sedan ${b.art} ${b.n}. Hur många gånger ${(askA ? a : b).verb}?`,
      visual: `<div class="logic-card"><div class="code-line">${loopHtml(outer, `${loopHtml(inner, `<span class="code-chip">${a.e}</span>`)}<span class="code-chip">${b.e}</span>`)}</div></div>`,
      answer: ans,
      hint: 'Börja med den inre loopen: vad blir det på ett varv i den yttre loopen?',
      explain: `Ett varv i den yttre loopen ger ${a.e.repeat(inner)}${b.e}. Det händer ${outer} gånger, så det blir ${cnt(a, outer * inner)} och ${cnt(b, outer)}.`,
    };
  }
  const n = rng.int(2, level >= 4 ? 5 : 4);
  const body = rng.shuffle([a, a, b]).slice(0, rng.int(2, 3));
  if (!body.includes(a)) body.push(a);
  const per = body.filter((x) => x === a).length;
  return {
    type: 'numpad',
    prompt: `🔁 Upprepa ${n} gånger: ${body.map((x) => x.e).join(' ')}. Hur många gånger ${a.verb}?`,
    say: `Upprepa ${n} gånger: ${body.map((x) => x.n).join(', ')}. Hur många gånger ${a.verb}?`,
    visual: `<div class="logic-card"><div class="code-line">${loopHtml(n, seqHtml(body))}</div></div>`,
    answer: n * per,
    hint: `Räkna bara ${a.e} i loopen och gånga med antalet varv.`,
    explain: `Varje varv har ${cnt(a, per)}. ${n} varv × ${per} = ${n * per}.`,
  };
}

const FUNC_NAMES = [
  { e: '💃', n: 'Dansa' },
  { e: '🎉', n: 'Fira' },
  { e: '🐸', n: 'Grodan' },
  { e: '🤸', n: 'Gympa' },
];
function genFunction(level, rng) {
  const f = rng.pick(FUNC_NAMES);
  const [a, b] = rng.sample(ACTIONS, 2);
  const def = rng.shuffle([a, a, b]).slice(0, level >= 4 ? 3 : rng.int(2, 3));
  if (!def.includes(a)) def.push(a);
  const perF = def.filter((x) => x === a).length;
  const calls = rng.int(2, 3);
  const extraA = rng.int(0, 1);
  const prog = [...Array.from({ length: calls }, () => 'F'), ...Array.from({ length: extraA }, () => 'a')];
  const order = rng.shuffle(prog);
  const ans = calls * perF + extraA;
  const progHtml = order.map((x) => (x === 'F' ? `<span class="code-chip">${f.e} ${f.n}</span>` : `<span class="code-chip">${a.e}</span>`)).join('');
  return {
    type: 'numpad',
    prompt: `Funktionen ${f.e} ${f.n} = ${def.map((x) => x.e).join(' ')}. Programmet: ${order.map((x) => (x === 'F' ? f.n : a.e)).join(', ')}. Hur många gånger ${a.verb}?`,
    say: `En funktion är ett namn på några steg. Funktionen ${f.n} betyder: ${def.map((x) => x.n).join(', ')}. Programmet är: ${order.map((x) => (x === 'F' ? f.n : a.n)).join(', ')}. Hur många gånger ${a.verb}?`,
    visual: `<div class="logic-card"><div><span class="func-def">${f.e} <b>${f.n}</b> = ${seqHtml(def)}</span></div><div class="code-line">${progHtml}</div></div>`,
    answer: ans,
    hint: `Byt ut varje ${f.n} mot stegen i funktionen. Räkna sedan ${a.e}.`,
    explain: `${f.n} har ${cnt(a, perF)} och används ${calls} gånger: ${calls} × ${perF} = ${calls * perF}${extraA ? `, plus ${a.art} ${a.n} till = ${ans}` : ''}. En funktion gör att man kan återanvända steg – precis som ett recept man redan kan.`,
  };
}

/** Nivå 0–1: OM–SÅ–ANNARS och små loopar med bildsvar. 2: loopar med siffror. 3: funktioner. 4: nästlat och två villkor. */
export function genLogic(level, rng) {
  if (level <= 1) return rng.chance(0.5) ? genIf(level, rng) : genLoopCount(level, rng);
  if (level === 2) return rng.chance(0.5) ? genIf(level, rng) : genLoopCount(level, rng);
  if (level === 3) return rng.pick([genIf, genLoopCount, genFunction])(level, rng);
  const k = rng.int(0, 3);
  if (k === 0) return genIfTwo(rng);
  if (k === 1) return genLoopCount(level, rng);
  return genFunction(level, rng);
}

/* ---------- Programmerade saker och algoritmer i vardagen ---------- */
export const PROGRAMMED_THINGS = [
  { id: 'tvatt', e: '🫧', n: 'tvättmaskin', bin: 'ja' },
  { id: 'mikro', e: '♨️', n: 'mikrovågsugn', bin: 'ja' },
  { id: 'trafikljus', e: '🚦', n: 'trafikljus', bin: 'ja' },
  { id: 'robotdammsugare', e: '🤖', n: 'robotdammsugare', bin: 'ja' },
  { id: 'mobil', e: '📱', n: 'mobiltelefon', bin: 'ja' },
  { id: 'hiss', e: '🛗', n: 'hiss', bin: 'ja' },
  { id: 'dator', e: '💻', n: 'dator', bin: 'ja' },
  { id: 'spel', e: '🎮', n: 'tv-spel', bin: 'ja' },
  { id: 'sax', e: '✂️', n: 'sax', bin: 'nej' },
  { id: 'penna', e: '✏️', n: 'penna', bin: 'nej' },
  { id: 'sked', e: '🥄', n: 'sked', bin: 'nej' },
  { id: 'cykel', e: '🚲', n: 'cykel', bin: 'nej' },
  { id: 'bok', e: '📕', n: 'bok', bin: 'nej' },
  { id: 'boll', e: '⚽', n: 'boll', bin: 'nej' },
  { id: 'nalle', e: '🧸', n: 'nalle', bin: 'nej' },
];
/** Algoritmer i vardagen. Stegen har en enda rimlig ordning (ingen ordning får vara tvetydig). */
export const MACHINE_SEQUENCES = [
  { name: 'tandborstningen', steps: ['🪥 Ta fram tandborsten', '🧴 Kläm ut tandkräm', '😁 Borsta tänderna i två minuter', '💦 Spotta ut', '🚰 Skölj tandborsten', '🗄️ Ställ tillbaka tandborsten'] },
  { name: 'handtvätten', steps: ['🚰 Blöt händerna', '🧼 Ta tvål', '👐 Gnugga händerna länge', '💦 Skölj bort tvålen', '🧻 Torka händerna'] },
  { name: 'mackan', steps: ['🍞 Ta fram en brödskiva', '🧈 Bred på smör', '🧀 Lägg på ost', '🥒 Lägg gurka på osten', '😋 Ät upp mackan'] },
  { name: 'tvättmaskinen', steps: ['👕 Lägg in tvätten', '🧴 Häll i tvättmedel', '💧 Maskinen fyller på vatten', '🫧 Maskinen tvättar', '🚿 Maskinen sköljer', '🌀 Maskinen centrifugerar'] },
  { name: 'trafikljuset (börja med rött)', steps: ['🔴 Rött – stå still', '🔴🟡 Rött och gult – gör dig redo', '🟢 Grönt – kör', '🟡 Gult – snart rött'] },
  { name: 'fröet som ska planteras', steps: ['🪴 Fyll krukan med jord', '👆 Gör ett hål i jorden', '🌰 Lägg fröet i hålet', '🤲 Täck fröet med jord', '💧 Vattna', '🌱 Vänta tills det gror'] },
  { name: 'mikrovågsugnen', steps: ['🍲 Ställ in maten', '🚪 Stäng luckan', '⏲️ Välj tid', '▶️ Tryck på start', '🔔 Vänta tills det plingar', '🧤 Ta ut maten försiktigt'] },
  { name: 'bullbaket', steps: ['🥣 Blanda degen', '⏳ Låt degen jäsa', '🥯 Forma bullarna', '🔥 Grädda dem i ugnen', '😋 Låt dem svalna och ät'] },
];

export function genEveryday(level, rng) {
  const doSort = level === 0 ? rng.chance(0.5) : level <= 2 ? rng.chance(0.3) : rng.chance(0.15);
  if (doSort) {
    const items = rng.sample(PROGRAMMED_THINGS, level === 0 ? 4 : 6);
    return {
      type: 'sort',
      prompt: 'Vilka saker styrs av ett datorprogram?',
      say: 'Vilka saker styrs av ett datorprogram? Sortera dem.',
      bins: [
        { id: 'ja', label: 'Har ett program', html: '💻' },
        { id: 'nej', label: 'Inget program', html: '🙅' },
      ],
      items: items.map((i) => ({ id: i.id, html: `<span class="pic sm">${i.e}</span><span class="lbl">${i.n}</span>`, bin: i.bin, say: i.n })),
      hint: 'Behöver saken el och gör den saker av sig själv i en viss ordning?',
      explain: 'Tvättmaskiner, trafikljus och mobiler har små datorer inuti som följer program som människor har skrivit.',
    };
  }
  const seq = rng.pick(MACHINE_SEQUENCES);
  if (level >= 2 && rng.chance(0.35) && seq.steps.length >= 5) {
    // Vilket steg saknas? (felsökning av en algoritm)
    const miss = rng.int(1, seq.steps.length - 2);
    const shown = seq.steps.filter((_, i) => i !== miss);
    const others = rng.sample(MACHINE_SEQUENCES.filter((x) => x !== seq).flatMap((x) => x.steps), level >= 4 ? 3 : 2);
    return {
      type: 'choice',
      prompt: `Buggen i ${seq.name}: ett steg saknas! Vilket?`,
      say: `Ett program för ${seq.name}: ${shown.map((s) => s.replace(/^\S+\s/, '')).join(', ')}. Ett steg saknas. Vilket?`,
      visual: `<ol class="logic-rule">${shown.map((s, i) => `${i === miss ? '<li>❓ …</li>' : ''}<li>${s}</li>`).join('')}</ol>`,
      options: rng.shuffle([seq.steps[miss], ...others]).map((s, i) => ({ id: s, label: s, say: s.replace(/^\S+\s/, '') })),
      answer: seq.steps[miss],
      noSpeakVisual: true,
      wide: true,
      hint: 'Läs stegen före och efter frågetecknet. Vad måste hända emellan?',
      explain: `Steget som saknades är "${seq.steps[miss]}". Om ett steg fattas i ett program blir det fel – därför testar programmerare sina program noga.`,
    };
  }
  const n = Math.min(seq.steps.length, [3, 3, 4, 5, 6][level]);
  const idx = rng.sample(seq.steps.map((_, i) => i), n).sort((a, b) => a - b);
  const steps = idx.map((i) => seq.steps[i]);
  return {
    type: 'order',
    prompt: `En algoritm är steg i rätt ordning. Ordna stegen för ${seq.name}!`,
    say: `Ordna stegen för ${seq.name}. Vad kommer först?`,
    items: rng.shuffle(steps.map((s, i) => ({ id: String(i), label: s, say: s.replace(/^\S+\s/, '') }))),
    answerOrder: steps.map((_, i) => String(i)),
    hint: 'Vad måste hända först? Vad kan inte hända förrän något annat är gjort?',
    explain: `Rätt ordning: ${steps.join(' → ')}. En dator gör exakt det programmet säger – i exakt den ordningen. Därför måste instruktionerna vara tydliga!`,
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
  { id: 'bigsquare', title: 'Stor kvadrat', goal: 'Rita en kvadrat med sidan 4 – med så få block som möjligt.', solution: '4(F F F F H)', maxBlocks: 6, loops: true },
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
    { id: 'logic', name: 'Om, loopar & funktioner', icon: '🔀', minLevel: 1, gen: genLogic, lgr: ['ma-instr', 'tk-prog'] },
    { id: 'debug', name: 'Hitta buggen', icon: '🐞', minLevel: 2, gen: genDebug, lgr: ['ma-instr', 'tk-styr'] },
    { id: 'turtle', name: 'Rita med kod', icon: '🐢', minLevel: 2, view: 'turtle', lgr: ['ma-instr', 'ma-geo', 'ma-monster'] },
  ],
};
