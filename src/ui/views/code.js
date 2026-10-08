// Programmering: Robotbanan och Rita med kod (sköldpadda).
import { h, clear, onTap, wait } from '../dom.js';
import { ROBOT_LEVELS, parseLevel, runProgram, blockCount, CMD_INFO, TURTLE_CHALLENGES, turtleSegments, shapeSignature, parseProgram, DIRS } from '../../apps/code.js';
import { hasInSet, setSize } from '../../core/model.js';

/* ---------- Gemensam blockredigerare ---------- */
function programEditor({ cmds, loops, maxBlocks, onChange }) {
  const program = [];
  let target = program; // lista där nya block hamnar
  let uid = 0;
  const strip = h('div.prog-strip');
  const counter = h('span.prog-count');
  const palette = h('div.prog-palette');
  const exitLoop = h('button.btn.btn-ghost.btn-sm', { type: 'button', hidden: true }, '⤴ Klar med loopen');

  const total = () => blockCount(program);
  const render = () => {
    clear(strip);
    if (!program.length) strip.appendChild(h('span.prog-empty', 'Tryck på blocken nedanför för att bygga ditt program'));
    const renderList = (list, parentEl) => {
      list.forEach((b, i) => {
        if (b.cmd === 'loop') {
          const countBtn = h('button.loop-n', { type: 'button', 'aria-label': 'antal varv' }, `${b.n}×`);
          onTap(countBtn, () => {
            b.n = b.n >= 9 ? 2 : b.n + 1;
            render();
          });
          const body = h('div.loop-body', { class: target === b.body ? 'active' : '' });
          const loopEl = h('div.prog-block.loop', { dataset: { ref: b.ref } }, h('span.loop-head', '🔁', countBtn), body, h('button.blk-x', { type: 'button', 'aria-label': 'ta bort' }, '×'));
          onTap(body, (e) => {
            if (e.target !== body) return;
            target = b.body;
            exitLoop.hidden = false;
            render();
          });
          onTap(loopEl.querySelector('.blk-x'), () => {
            list.splice(i, 1);
            if (target === b.body) {
              target = program;
              exitLoop.hidden = true;
            }
            render();
          });
          if (!b.body.length) body.appendChild(h('span.loop-hint', 'lägg block här'));
          renderList(b.body, body);
          parentEl.appendChild(loopEl);
        } else {
          const el = h('button.prog-block', { type: 'button', dataset: { ref: b.ref }, 'aria-label': CMD_INFO[b.cmd].name }, CMD_INFO[b.cmd].label, h('span.blk-x', '×'));
          onTap(el, () => {
            list.splice(i, 1);
            render();
          });
          parentEl.appendChild(el);
        }
      });
    };
    renderList(program, strip);
    counter.textContent = `${total()} / ${maxBlocks} block`;
    counter.classList.toggle('full', total() >= maxBlocks);
    onChange?.();
  };
  const add = (cmd) => {
    if (total() >= maxBlocks) {
      counter.classList.add('wrong-shake');
      setTimeout(() => counter.classList.remove('wrong-shake'), 500);
      return false;
    }
    if (cmd === 'loop') {
      if (target !== program) return false; // inga loopar i loopar för de minsta
      const b = { cmd: 'loop', n: 3, body: [], ref: `b${uid++}` };
      program.push(b);
      target = b.body;
      exitLoop.hidden = false;
    } else target.push({ cmd, ref: `b${uid++}` });
    render();
    return true;
  };
  for (const c of cmds) {
    const b = h('button.pal-btn', { type: 'button', 'aria-label': CMD_INFO[c].name }, h('span', CMD_INFO[c].label), h('small', CMD_INFO[c].name));
    onTap(b, () => add(c) && navigator.vibrate?.(8), { guardMs: 150 });
    palette.appendChild(b);
  }
  if (loops) {
    const b = h('button.pal-btn.pal-loop', { type: 'button' }, h('span', '🔁'), h('small', 'upprepa'));
    onTap(b, () => add('loop'), { guardMs: 150 });
    palette.appendChild(b);
  }
  onTap(exitLoop, () => {
    target = program;
    exitLoop.hidden = true;
    render();
  });
  render();
  return {
    el: h('div.prog-editor', h('div.prog-head', h('b', 'Mitt program'), counter, exitLoop), strip, palette),
    program,
    clear() {
      program.length = 0;
      target = program;
      exitLoop.hidden = true;
      render();
    },
    highlight(ref) {
      strip.querySelectorAll('.prog-block.run').forEach((n) => n.classList.remove('run'));
      if (ref) strip.querySelector(`[data-ref="${ref}"]`)?.classList.add('run');
    },
    setMax(m) {
      maxBlocks = m;
      render();
    },
  };
}

/** Expanderar program och behåller referens till blocket för markering under körning. */
function expandRefs(prog, out = []) {
  for (const p of prog) {
    if (p.cmd === 'loop') for (let k = 0; k < p.n; k++) expandRefs(p.body, out);
    else out.push(p.ref);
  }
  return out;
}

/* ---------- Robotbanan ---------- */
export function robotView(el, { kos, app, level }) {
  const p = kos.profile;
  let running = false;
  let alive = true;

  function showMenu() {
    clear(el);
    const done = setSize(p, 'robotLevels');
    const grid = h('div.level-grid');
    ROBOT_LEVELS.forEach((L, i) => {
      const isDone = hasInSet(p, 'robotLevels', L.id);
      const open = L.id <= done + 2 || isDone || p.settings.showAllModules;
      const chapter = L.loops ? '🔁' : L.mode === 'rel' ? '↷' : '➡️';
      const b = h('button.level-btn', { type: 'button', class: `${isDone ? 'done' : ''} ${open ? '' : 'locked'}`, style: { '--i': i } }, h('span.lv-n', String(L.id)), h('span.lv-ch', chapter), h('span.lv-t', L.title), isDone ? h('span.lv-ok', '✓') : open ? null : h('span.lv-lock', '🔒'));
      onTap(b, () => {
        if (!open) {
          kos.say('Klara banorna innan först!');
          return;
        }
        play(L);
      });
      grid.appendChild(b);
    });
    el.append(
      h(
        'div.robot-menu',
        h('div.chapter-legend', h('span', '➡️ Pilar'), h('span', '↷ Sväng & kör'), h('span', '🔁 Loopar')),
        h('p.muted', `${done} av ${ROBOT_LEVELS.length} banor klara. Ett program är instruktioner i rätt ordning – precis som ett recept.`),
        grid,
      ),
    );
    kos.autoSay('Välj en bana. Bygg ett program som tar roboten till flaggan.');
  }

  function play(L) {
    clear(el);
    const parsed = parseLevel(L);
    const cell = Math.floor(Math.min((el.clientWidth - 24) / parsed.w, (window.innerHeight * 0.4) / parsed.h, 92));
    const board = h('div.robot-board', { style: { '--cols': parsed.w, '--rows': parsed.h, '--cell': `${cell}px` } });
    for (let y = 0; y < parsed.h; y++)
      for (let x = 0; x < parsed.w; x++) {
        const c = L.map[y][x] || '#';
        const kind = { '#': 'rock', '~': 'water', '*': 'star', G: 'goal' }[c] || 'path';
        board.appendChild(h('div.rb-cell', { class: kind, dataset: { x, y } }, { rock: '🪨', water: '🌊', star: '⭐', goal: '🏁' }[kind] || ''));
      }
    const robot = h('div.rb-robot', h('span.rb-face', '🤖'), h('span.rb-dir', '▸'));
    board.appendChild(robot);
    const place = (x, y, dir) => {
      robot.style.transform = `translate(${x * cell}px, ${y * cell}px)`;
      robot.querySelector('.rb-dir').style.transform = `rotate(${{ E: 0, S: 90, W: 180, N: 270 }[dir]}deg)`;
    };
    place(parsed.start.x, parsed.start.y, parsed.dir);

    const cmds = L.mode === 'rel' ? ['F', 'V', 'H'] : ['U', 'R', 'D', 'L'];
    const editor = programEditor({ cmds, loops: !!L.loops, maxBlocks: L.maxBlocks });
    const status = h('div.robot-status', { 'aria-live': 'polite' });
    const runBtn = h('button.btn.btn-primary.btn-run', { type: 'button' }, '▶ Kör');
    const resetBtn = h('button.btn.btn-ghost', { type: 'button' }, '↺ Rensa');
    const menuBtn = h('button.btn.btn-ghost', { type: 'button' }, '☰ Banor');
    const teach = h('div.teach', h('span.teach-icon', '💡'), h('span', L.teach));
    const speak = onTap(h('button.icon-btn', { type: 'button', 'aria-label': 'läs upp' }, '🔊'), () => kos.say(L.teach));
    el.append(
      h(
        'div.robot',
        h('div.robot-top', h('h3.robot-title', `Bana ${L.id}: ${L.title}`), speak),
        teach,
        h('div.robot-play', h('div.board-wrap', board), h('div.robot-side', editor.el, status, h('div.row-actions', menuBtn, resetBtn, runBtn))),
      ),
    );
    kos.autoSay(L.teach);

    onTap(menuBtn, () => !running && showMenu());
    onTap(resetBtn, () => {
      if (running) return;
      editor.clear();
      place(parsed.start.x, parsed.start.y, parsed.dir);
      board.querySelectorAll('.rb-cell.star').forEach((c) => (c.textContent = '⭐'));
      status.textContent = '';
    });
    onTap(runBtn, async () => {
      if (running || !editor.program.length) {
        if (!editor.program.length) kos.say('Bygg ett program först!');
        return;
      }
      running = true;
      runBtn.disabled = true;
      status.textContent = '';
      board.querySelectorAll('.rb-cell.star').forEach((c) => (c.textContent = '⭐'));
      robot.classList.remove('crash', 'win');
      const res = runProgram(parsed, editor.program);
      const refs = expandRefs(editor.program);
      let k = 0;
      for (const st of res.steps) {
        if (!alive) return;
        if (st.cmd) editor.highlight(refs[k++]);
        place(st.x, st.y, st.dir);
        if (st.event === 'star') {
          board.querySelector(`.rb-cell[data-x="${st.x}"][data-y="${st.y}"]`).textContent = '✨';
          kos.sfx('star');
        } else if (st.event === 'move' || st.event === 'turn') kos.sfx('click');
        if (st.event === 'crash' || st.event === 'water' || st.event === 'outside') {
          robot.classList.add('crash');
          kos.sfx('boom');
        }
        await wait(st.event === 'start' ? 200 : 420);
      }
      editor.highlight(null);
      running = false;
      runBtn.disabled = false;
      const msgs = {
        crash: 'Aj! Roboten krockade med en sten. Ändra programmet och försök igen!',
        water: 'Plask! Roboten kan inte simma. Hitta en annan väg!',
        outside: 'Hoppsan – roboten försökte gå utanför banan.',
        'missing-stars': 'Roboten kom fram, men har inte samlat alla stjärnor!',
        'not-there': 'Roboten kom inte ända fram. Lägg till fler steg!',
      };
      if (res.result === 'win') {
        robot.classList.add('win');
        const first = !hasInSet(p, 'robotLevels', L.id);
        const usesLoop = editor.program.some((b) => b.cmd === 'loop');
        kos.reward({ app: app.id, stars: first ? 3 : 1, set: 'robotLevels', item: L.id });
        if (usesLoop) kos.reward({ counter: 'loopWins', silent: true });
        kos.sfx('fanfare');
        kos.confetti(90);
        status.className = 'robot-status ok';
        status.textContent = `🎉 Det fungerade! Programmet hade ${blockCount(editor.program)} block.`;
        kos.say('Det fungerade! Bra programmerat!');
        const nextL = ROBOT_LEVELS.find((x) => x.id === L.id + 1);
        if (nextL) {
          const nb = onTap(h('button.btn.btn-primary', { type: 'button' }, `Nästa bana ➜`), () => play(nextL));
          status.appendChild(h('div', nb));
        }
      } else {
        kos.retry();
        status.className = 'robot-status try';
        status.textContent = `🔧 ${msgs[res.result]} (Att hitta fel kallas att debugga!)`;
        kos.say(msgs[res.result]);
        setTimeout(() => {
          if (alive && !running) {
            robot.classList.remove('crash');
            place(parsed.start.x, parsed.start.y, parsed.dir);
          }
        }, 1400);
      }
    });
  }

  showMenu();
  return () => {
    alive = false;
  };
}

/* ---------- Rita med kod ---------- */
export function turtleView(el, { kos, app }) {
  const p = kos.profile;
  let alive = true;
  let running = false;
  let ch = TURTLE_CHALLENGES.find((c) => c.solution && !hasInSet(p, 'turtle', c.id)) || TURTLE_CHALLENGES[0];
  const chips = h('div.chip-row');
  const goal = h('div.teach');
  const canvas = h('canvas.turtle-canvas');
  const targetMini = h('div.turtle-target');
  const status = h('div.robot-status', { 'aria-live': 'polite' });
  let editor;
  const editorHolder = h('div');
  const runBtn = h('button.btn.btn-primary.btn-run', { type: 'button' }, '▶ Rita');
  const clearBtn = h('button.btn.btn-ghost', { type: 'button' }, '↺ Rensa');
  el.append(h('div.turtle', chips, goal, h('div.robot-play', h('div.board-wrap', canvas, targetMini), h('div.robot-side', editorHolder, status, h('div.row-actions', clearBtn, runBtn)))));

  const GRID = 9;
  let size = 300;
  function drawBase(ctx) {
    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = getComputedStyle(el).getPropertyValue('--card') || '#fff';
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = 'rgba(100,120,160,.18)';
    ctx.lineWidth = 1;
    const c = size / GRID;
    for (let i = 0; i <= GRID; i++) {
      ctx.beginPath();
      ctx.moveTo(i * c, 0);
      ctx.lineTo(i * c, size);
      ctx.moveTo(0, i * c);
      ctx.lineTo(size, i * c);
      ctx.stroke();
    }
  }
  function setupCanvas() {
    size = Math.floor(Math.min(el.clientWidth - 24, window.innerHeight * 0.42, 460));
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawBase(ctx);
    drawTurtle(ctx, { x: 0, y: 0, dir: 'N' });
  }
  const toPx = (v) => (Math.floor(GRID / 2) + v + 0.5) * (size / GRID);
  function drawTurtle(ctx, t) {
    ctx.save();
    ctx.translate(toPx(t.x), toPx(t.y));
    ctx.rotate({ N: 0, E: Math.PI / 2, S: Math.PI, W: -Math.PI / 2 }[t.dir]);
    ctx.font = `${size / GRID / 1.3}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🐢', 0, 0);
    ctx.restore();
  }
  function renderChips() {
    clear(chips);
    for (const c of TURTLE_CHALLENGES) {
      const b = h('button.chip-btn', { type: 'button', class: `${c === ch ? 'on' : ''} ${hasInSet(p, 'turtle', c.id) ? 'done' : ''}` }, `${hasInSet(p, 'turtle', c.id) ? '✓ ' : ''}${c.title}`);
      onTap(b, () => {
        if (running) return;
        ch = c;
        start();
      });
      chips.appendChild(b);
    }
  }
  function renderTargetMini() {
    clear(targetMini);
    if (!ch.solution) return;
    const { segs } = turtleSegments(parseProgram(ch.solution));
    const xs = segs.flatMap((s) => [s[0], s[2]]);
    const ys = segs.flatMap((s) => [s[1], s[3]]);
    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const w = Math.max(...xs) - minX || 1;
    const hh = Math.max(...ys) - minY || 1;
    const sc = 60 / Math.max(w, hh);
    const lines = segs.map(([a, b, c, d]) => `<line x1="${(a - minX) * sc + 10}" y1="${(b - minY) * sc + 10}" x2="${(c - minX) * sc + 10}" y2="${(d - minY) * sc + 10}"/>`).join('');
    targetMini.innerHTML = `<small>Mål</small><svg viewBox="0 0 ${w * sc + 20} ${hh * sc + 20}">${lines}</svg>`;
  }
  function start() {
    renderChips();
    clear(goal).append(h('span.teach-icon', '🐢'), h('span', ch.goal));
    clear(editorHolder);
    editor = programEditor({ cmds: ['F', 'V', 'H'], loops: true, maxBlocks: ch.maxBlocks });
    editorHolder.appendChild(editor.el);
    status.textContent = '';
    renderTargetMini();
    setupCanvas();
    kos.autoSay(`${ch.goal} Sköldpaddan ritar när den går framåt.`);
  }
  onTap(clearBtn, () => {
    if (running) return;
    editor.clear();
    setupCanvas();
    status.textContent = '';
  });
  onTap(runBtn, async () => {
    if (running || !editor.program.length) return;
    running = true;
    const ctx = canvas.getContext('2d');
    drawBase(ctx);
    const { segs, path } = turtleSegments(editor.program);
    // animera
    let t = { x: 0, y: 0, dir: 'N' };
    const refs = expandRefs(editor.program);
    const cmds = [];
    const walk = (list) => list.forEach((b) => (b.cmd === 'loop' ? Array.from({ length: b.n }, () => walk(b.body)) : cmds.push(b.cmd)));
    walk(editor.program);
    ctx.lineCap = 'round';
    ctx.lineWidth = Math.max(4, size / GRID / 6);
    ctx.strokeStyle = p.color;
    const drawn = [];
    for (let i = 0; i < cmds.length && alive; i++) {
      editor.highlight(refs[i]);
      const c = cmds[i];
      if (c === 'V') t = { ...t, dir: { N: 'W', W: 'S', S: 'E', E: 'N' }[t.dir] };
      else if (c === 'H') t = { ...t, dir: { N: 'E', E: 'S', S: 'W', W: 'N' }[t.dir] };
      else {
        const nt = { ...t, x: t.x + DIRS[t.dir][0], y: t.y + DIRS[t.dir][1] };
        drawn.push([t.x, t.y, nt.x, nt.y]);
        t = nt;
      }
      drawBase(ctx);
      for (const [a, b, c2, d] of drawn) {
        ctx.beginPath();
        ctx.moveTo(toPx(a), toPx(b));
        ctx.lineTo(toPx(c2), toPx(d));
        ctx.stroke();
      }
      drawTurtle(ctx, t);
      kos.sfx('click');
      await wait(260);
    }
    editor.highlight(null);
    running = false;
    void path;
    if (!ch.solution) {
      status.className = 'robot-status ok';
      status.textContent = `🎨 Snyggt! Din teckning har ${segs.length} streck.`;
      kos.reward({ app: app.id, stars: 1 });
      return;
    }
    const want = shapeSignature(turtleSegments(parseProgram(ch.solution)).segs);
    const got = shapeSignature(segs);
    if (want === got) {
      const first = !hasInSet(p, 'turtle', ch.id);
      kos.reward({ app: app.id, stars: first ? 3 : 1, set: 'turtle', item: ch.id });
      kos.sfx('fanfare');
      kos.confetti(80);
      status.className = 'robot-status ok';
      status.textContent = `🎉 Precis rätt form! ${blockCount(editor.program)} block.`;
      kos.say('Precis rätt form!');
      renderChips();
    } else {
      kos.retry();
      status.className = 'robot-status try';
      status.textContent = '🔧 Inte riktigt samma form som målet. Jämför med bilden och ändra programmet!';
      kos.say('Inte riktigt. Jämför med målbilden.');
    }
  });
  requestAnimationFrame(start);
  return () => {
    alive = false;
  };
}
