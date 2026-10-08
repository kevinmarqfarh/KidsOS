// Vetenskap – experimentvyer. Arbetsgång: Fråga → Gissa → Testa → Förklara → Dokumentera.
import { h, clear, onTap, wait } from '../dom.js';
import { FLOAT_ITEMS, MAGNET_ITEMS, SURFACES, slideDistance, seesawTorque, SEESAW_ANIMALS, SEESAW_MISSIONS } from '../../apps/science.js';
import { hasInSet } from '../../core/model.js';
import { createRng } from '../../core/rng.js';

/* ---------- gemensamma byggstenar ---------- */
function missionList(missions) {
  const el = h('ol.missions');
  const items = missions.map((m) => h('li.mission', h('span.m-check', '○'), h('span', m)));
  el.append(...items);
  const done = new Set();
  return {
    el,
    complete(i) {
      if (done.has(i)) return false;
      done.add(i);
      items[i].classList.add('done');
      items[i].querySelector('.m-check').textContent = '✓';
      return true;
    },
    get count() {
      return done.size;
    },
    total: missions.length,
  };
}

function finishExperiment(kos, app, id, stars = 3) {
  const p = kos.profile;
  const first = !hasInSet(p, 'experiments', id);
  kos.reward({ app: app.id, stars: first ? stars : 1, set: 'experiments', item: id });
  kos.sfx('fanfare');
  kos.confetti(100);
  return first;
}

function stepsBar(active) {
  const steps = ['Fråga', 'Gissa', 'Testa', 'Förklara'];
  return h('div.sci-steps', steps.map((s, i) => h('span.sci-step', { class: i === active ? 'on' : i < active ? 'past' : '' }, `${i + 1}. ${s}`)));
}

/* ---------- Gissa-och-testa (flyter/sjunker, magnet) ---------- */
function predictTest(el, cfg) {
  const { kos, app, level, id, items, question, options, outcome, scene, animate, why, intro, conclusion } = cfg;
  const rng = createRng(Date.now());
  const list = rng.sample(items, level === 0 ? 6 : Math.min(items.length, 8));
  let i = 0;
  const log = [];
  let alive = true;
  const stage = h('div.sci-stage');
  const panel = h('div.sci-panel');
  const top = h('div.sci-top');
  el.append(h('div.sci', top, stage, panel));
  stage.appendChild(scene.el);

  function ask() {
    if (!alive) return;
    if (i >= list.length) return summary();
    const it = list[i];
    scene.reset(it);
    clear(top).append(stepsBar(1), h('p.sci-q', h('span.sci-item-pic', { html: it.e }), question(it)));
    clear(panel).append(
      h(
        'div.choices.n2.sci-guess',
        options.map((o) =>
          onTap(h('button.choice', { type: 'button' }, h('span.choice-label', o.label)), async () => {
            await test(it, o.id);
          }),
        ),
      ),
    );
    kos.autoSay(question(it).replace(/[?]/, '') + '? Vad tror du?');
  }

  async function test(it, guess) {
    clear(top).append(stepsBar(2), h('p.sci-q', h('span.sci-item-pic', { html: it.e }), 'Nu testar vi!'));
    clear(panel);
    const result = outcome(it);
    await animate(it, result);
    if (!alive) return;
    const right = guess === result;
    log.push({ it, guess, result });
    if (right) {
      kos.reward({ counter: 'predictions', stars: 1, silent: false });
      kos.sfx('correct');
    } else kos.sfx('pop');
    const resLabel = options.find((o) => o.id === result).label;
    clear(top).append(stepsBar(3), h('p.sci-q', h('span.sci-item-pic', { html: it.e }), `${resLabel}!`));
    const nextBtn = onTap(h('button.btn.btn-primary.btn-next', { type: 'button' }, i + 1 >= list.length ? 'Se resultat 📋' : 'Nästa sak ➜'), () => {
      i++;
      ask();
    });
    clear(panel).append(h('div.fb', { class: right ? 'fb-ok' : 'fb-learn' }, h('span.fb-icon', right ? '🎯' : '🧠'), h('div.fb-text', h('b', right ? 'Du gissade rätt! ' : 'Intressant – det blev tvärtom! '), why(it)), nextBtn));
    kos.autoSay(`${right ? 'Du gissade rätt!' : 'Det blev tvärtom!'} ${why(it)}`);
  }

  function summary() {
    const correct = log.filter((l) => l.guess === l.result).length;
    const first = finishExperiment(kos, app, id);
    clear(top).append(stepsBar(3), h('h3', '📋 Mitt protokoll'));
    const table = h(
      'table.protocol',
      h('thead', h('tr', h('th', 'Sak'), h('th', 'Jag gissade'), h('th', 'Det blev'), h('th', ''))),
      h(
        'tbody',
        log.map((l) =>
          h('tr', h('td', { html: `${l.it.e} ${l.it.n}` }), h('td', options.find((o) => o.id === l.guess).label), h('td', options.find((o) => o.id === l.result).label), h('td', l.guess === l.result ? '✅' : '🔄')),
        ),
      ),
    );
    clear(stage).append(table);
    clear(panel).append(
      h('div.fb.fb-ok', h('span.fb-icon', '🔬'), h('div.fb-text', h('b', `Du gissade rätt ${correct} av ${log.length} gånger. `), conclusion, first ? ' Experimentet är klart – nytt i forskarboken!' : '')),
      h('div.row-actions', onTap(h('button.btn.btn-primary', { type: 'button' }, '🔁 Gör om'), () => predictTest(clear(el), cfg))),
    );
    kos.autoSay(`Bra forskat! ${conclusion}`);
  }

  clear(top).append(stepsBar(0), h('p.sci-q', intro));
  clear(panel).append(onTap(h('button.btn.btn-primary.btn-xl', { type: 'button' }, 'Starta experimentet ▶'), ask));
  kos.autoSay(intro);
  return () => {
    alive = false;
  };
}

export function floatView(el, ctx) {
  const tank = h('div.tank', h('div.tank-water', h('div.tank-wave')), h('div.tank-item'));
  const itemEl = tank.querySelector('.tank-item');
  const scene = {
    el: tank,
    reset(it) {
      itemEl.className = 'tank-item';
      itemEl.innerHTML = it.e;
    },
  };
  return predictTest(el, {
    ...ctx,
    id: 'float',
    items: FLOAT_ITEMS,
    intro: 'Fråga: Vilka saker flyter och vilka sjunker i vatten? Gissa först – sen testar vi!',
    question: (it) => `Flyter eller sjunker ${it.n}?`,
    options: [
      { id: 'flyter', label: '🛟 Flyter' },
      { id: 'sjunker', label: '⚓ Sjunker' },
    ],
    outcome: (it) => (it.floats ? 'flyter' : 'sjunker'),
    scene,
    async animate(it, res) {
      ctx.kos.sfx('whoosh');
      itemEl.classList.add('drop');
      await wait(650);
      itemEl.classList.add(res === 'flyter' ? 'floating' : 'sinking');
      ctx.kos.sfx(res === 'flyter' ? 'pop' : 'boom');
      await wait(1100);
    },
    why: (it) => it.why,
    conclusion: 'Saker som är lätta för sin storlek – ofta med luft inuti – flyter. Tunga, täta saker sjunker. Det handlar inte bara om hur stor saken är!',
  });
}

export function magnetView(el, ctx) {
  const area = h('div.magnet-area', h('div.magnet', h('span', '🧲')), h('div.magnet-item'));
  const mag = area.querySelector('.magnet');
  const itemEl = area.querySelector('.magnet-item');
  const scene = {
    el: area,
    reset(it) {
      mag.className = 'magnet';
      itemEl.className = 'magnet-item';
      itemEl.innerHTML = it.e;
    },
  };
  return predictTest(el, {
    ...ctx,
    id: 'magnet',
    items: MAGNET_ITEMS,
    intro: 'Fråga: Vilka saker dras till en magnet? Gissa först – sen testar vi!',
    question: (it) => `Fastnar ${it.n} på magneten?`,
    options: [
      { id: 'ja', label: '🧲 Ja, fastnar' },
      { id: 'nej', label: '🙅 Nej' },
    ],
    outcome: (it) => (it.magnetic ? 'ja' : 'nej'),
    scene,
    async animate(it, res) {
      mag.classList.add('lower');
      await wait(700);
      if (res === 'ja') {
        itemEl.classList.add('stick');
        ctx.kos.sfx('pop');
      } else itemEl.classList.add('wiggle');
      await wait(500);
      mag.classList.add('lift');
      await wait(800);
    },
    why: (it) => it.why,
    conclusion: 'Magneter drar till sig saker av järn och stål. Andra material – som trä, plast, glas, guld och aluminium – fastnar inte.',
  });
}

/* ---------- Ljus & skugga ---------- */
export function shadowView(el, { kos, app }) {
  const missions = missionList(['Gör skuggan riktigt lång', 'Gör skuggan riktigt kort', 'Få skuggan att peka åt vänster', 'Få skuggan att peka åt höger']);
  const svgWrap = h('div.shadow-scene');
  const info = h('div.sci-readout');
  let angle = 60; // 0 = vänster horisont, 180 = höger horisont
  el.append(h('div.sci', h('div.sci-top', stepsBar(2), h('p.sci-q', '🔦 Dra solen över himlen. Vad händer med skuggan?')), svgWrap, info, missions.el));
  const W = 400;
  const H = 260;
  const groundY = 210;
  const x0 = 200;
  const treeH = 90;
  function render() {
    const a = (angle * Math.PI) / 180;
    const sx = x0 - Math.cos(a) * 170;
    const sy = groundY - Math.sin(a) * 170;
    const elev = Math.min(angle, 180 - angle); // höjd över horisonten
    const len = Math.min(320, treeH / Math.tan((Math.max(elev, 4) * Math.PI) / 180));
    const dir = angle < 90 ? 1 : -1; // ljus från vänster → skugga åt höger
    const tip = x0 + dir * len;
    const sky = elev < 15 ? '#ffb38a' : elev < 35 ? '#ffe3a3' : '#bfe3ff';
    svgWrap.innerHTML = `<svg viewBox="0 0 ${W} ${H}" class="shadow-svg">
      <rect width="${W}" height="${groundY}" fill="${sky}"/>
      <rect y="${groundY}" width="${W}" height="${H - groundY}" fill="#8fd18a"/>
      <polygon points="${x0 - 8},${groundY} ${x0 + 8},${groundY} ${tip},${groundY + 6} ${tip},${groundY - 4}" fill="rgba(20,30,50,.45)"/>
      <rect x="${x0 - 7}" y="${groundY - 50}" width="14" height="50" fill="#8b5a2b"/>
      <circle cx="${x0}" cy="${groundY - 70}" r="34" fill="#2fae66"/>
      <path d="M30,${groundY} A170,170 0 0 1 370,${groundY}" fill="none" stroke="rgba(255,255,255,.7)" stroke-width="2" stroke-dasharray="5 6"/>
      <g class="sun-handle" transform="translate(${sx} ${sy})"><circle r="30" fill="#ffd23f" opacity=".35"/><circle r="20" fill="#ffc400"/><text y="7" text-anchor="middle" font-size="20">☀️</text></g>
    </svg>`;
    const time = angle < 50 ? 'morgon 🌅' : angle > 130 ? 'kväll 🌇' : 'mitt på dagen 🕛';
    info.innerHTML = `<b>Solen står ${elev < 20 ? 'lågt' : elev < 55 ? 'halvhögt' : 'högt'}</b> – det är ${time}. Skuggan är <b>${len > treeH * 2 ? 'lång' : len < treeH * 0.6 ? 'kort' : 'mellanlång'}</b> och pekar åt <b>${dir > 0 ? 'höger' : 'vänster'}</b>.`;
    return { len, dir };
  }
  function check(r) {
    const done = [r.len > treeH * 2.5, r.len < treeH * 0.45, r.dir < 0, r.dir > 0];
    done.forEach((ok, i) => {
      if (ok && missions.complete(i)) {
        kos.sfx('correct');
        kos.reward({ stars: 1 });
      }
    });
    if (missions.count === missions.total && !el.dataset.done) {
      el.dataset.done = '1';
      finishExperiment(kos, app, 'shadow');
      const exp = 'Skuggan bildas där ljuset stoppas. När solen står lågt – på morgonen och kvällen – blir skuggorna långa. Mitt på dagen står solen högt och skuggorna blir korta. Skuggan pekar alltid bort från ljuset.';
      el.querySelector('.sci').appendChild(h('div.fb.fb-ok', h('span.fb-icon', '💡'), h('div.fb-text', h('b', 'Förklaring: '), exp)));
      kos.say(exp);
    }
  }
  let drag = false;
  const move = (e) => {
    const svg = svgWrap.querySelector('svg');
    const r = svg.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    const py = ((e.clientY - r.top) / r.height) * H;
    let a = (Math.atan2(groundY - py, x0 - px) * 180) / Math.PI;
    a = Math.max(5, Math.min(175, a));
    angle = a;
    check(render());
  };
  svgWrap.addEventListener('pointerdown', (e) => {
    drag = true;
    svgWrap.setPointerCapture?.(e.pointerId);
    move(e);
  });
  svgWrap.addEventListener('pointermove', (e) => drag && move(e));
  svgWrap.addEventListener('pointerup', () => (drag = false));
  svgWrap.addEventListener('pointercancel', () => (drag = false));
  render();
  kos.autoSay('Dra solen över himlen. Titta på trädets skugga. Klara alla uppdrag!');
}

/* ---------- Vattnets former ---------- */
export function waterView(el, { kos, app }) {
  const missions = missionList(['Smält isen (smältning)', 'Koka vattnet (kokning)', 'Lägg på det kalla locket när det ångar (kondensering)', 'Frys vattnet igen (stelning)']);
  const canvas = h('canvas.water-canvas');
  const temp = h('input#water-temp.slider', { type: 'range', min: '-20', max: '120', value: '-10', step: '1', 'aria-label': 'temperatur' });
  const label = h('div.water-label');
  const lidBtn = h('button.btn.btn-ghost', { type: 'button' }, '🧊 Kallt lock');
  el.append(h('div.sci', h('div.sci-top', stepsBar(2), h('p.sci-q', '💧 Dra i termometern. Vad händer med vattnet?')), canvas, h('div.thermo', h('span', '❄️'), temp, h('span', '🔥')), label, h('div.row-actions', lidBtn), missions.el));
  let t = -10;
  let melted = false;
  let lid = 0;
  let alive = true;
  const N = 60;
  const parts = Array.from({ length: N }, (_, i) => ({ gx: i % 10, gy: Math.floor(i / 10), x: 0, y: 0, vx: 0, vy: 0 }));
  let W = 300;
  let H = 220;
  function size() {
    W = Math.floor(Math.min(el.clientWidth - 24, 520));
    H = Math.floor(W * 0.62);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    canvas.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
    parts.forEach((p) => {
      p.x = W / 2 - 90 + p.gx * 20;
      p.y = H - 130 + p.gy * 20;
    });
  }
  const state = () => (t <= 0 ? 'is' : t >= 100 ? 'ånga' : 'vatten');
  function step() {
    if (!alive) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, W, H);
    // kastrull
    ctx.fillStyle = '#9aa7bd';
    ctx.fillRect(W / 2 - 120, H - 20, 240, 12);
    ctx.strokeStyle = '#6b7a99';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 115, 60);
    ctx.lineTo(W / 2 - 115, H - 20);
    ctx.lineTo(W / 2 + 115, H - 20);
    ctx.lineTo(W / 2 + 115, 60);
    ctx.stroke();
    if (lid > 0) {
      ctx.fillStyle = '#c9e7ff';
      ctx.fillRect(W / 2 - 125, 50, 250, 10);
      for (let i = 0; i < 9; i++) {
        ctx.beginPath();
        ctx.fillStyle = '#4aa8ff';
        ctx.arc(W / 2 - 100 + i * 25, 66 + ((lid * 3 + i * 7) % 14), 4, 0, Math.PI * 2);
        ctx.fill();
      }
      lid++;
    }
    const s = state();
    const energy = Math.max(0.2, (t + 25) / 40);
    for (const p of parts) {
      if (s === 'is') {
        const hx = W / 2 - 90 + p.gx * 20;
        const hy = H - 130 + p.gy * 20;
        p.x += (hx - p.x) * 0.2 + (Math.random() - 0.5) * energy;
        p.y += (hy - p.y) * 0.2 + (Math.random() - 0.5) * energy;
      } else if (s === 'vatten') {
        p.vx += (Math.random() - 0.5) * energy * 0.6;
        p.vy += (Math.random() - 0.5) * energy * 0.6 + 0.25;
        p.vx *= 0.9;
        p.vy *= 0.9;
        p.x += p.vx;
        p.y += p.vy;
        p.x = Math.max(W / 2 - 108, Math.min(W / 2 + 108, p.x));
        p.y = Math.max(H - 95, Math.min(H - 28, p.y));
      } else {
        p.vx += (Math.random() - 0.5) * energy;
        p.vy += (Math.random() - 0.5) * energy - 0.15;
        p.vx *= 0.95;
        p.vy *= 0.95;
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < (lid ? 70 : 10)) p.vy = Math.abs(p.vy);
        p.x = Math.max(10, Math.min(W - 10, p.x));
        p.y = Math.min(H - 28, p.y);
      }
      ctx.beginPath();
      ctx.fillStyle = s === 'is' ? '#a8dcff' : s === 'vatten' ? '#3d8bfd' : 'rgba(160,180,210,.7)';
      ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(step);
  }
  function update() {
    const prev = state();
    t = Number(temp.value);
    const s = state();
    const names = { is: 'Fast form – is ❄️', vatten: 'Flytande form – vatten 💧', ånga: 'Gasform – vattenånga ☁️' };
    label.innerHTML = `<b>${t} °C</b> · ${names[s]}`;
    if (prev !== s) {
      kos.sfx('pop');
      if (prev === 'is' && s === 'vatten') {
        melted = true;
        if (missions.complete(0)) kos.reward({ stars: 1 });
        kos.say('Smältning! Isen blir till vatten vid noll grader.');
      } else if (s === 'ånga') {
        if (missions.complete(1)) kos.reward({ stars: 1 });
        kos.say('Kokning! Vid hundra grader blir vattnet till ånga.');
      } else if (s === 'is' && melted) {
        if (missions.complete(3)) kos.reward({ stars: 1 });
        kos.say('Stelning! Vattnet fryser till is igen.');
      }
      if (s !== 'ånga') lid = 0;
      maybeDone();
    }
  }
  onTap(lidBtn, () => {
    if (state() !== 'ånga') {
      kos.say('Värm vattnet tills det ångar först!');
      return;
    }
    lid = 1;
    if (missions.complete(2)) kos.reward({ stars: 1 });
    kos.say('Kondensering! Ångan blir till vattendroppar när den träffar det kalla locket. Så bildas också moln och dagg.');
    maybeDone();
  });
  function maybeDone() {
    if (missions.count === missions.total && !el.dataset.done) {
      el.dataset.done = '1';
      finishExperiment(kos, app, 'water');
      el.querySelector('.sci').appendChild(h('div.fb.fb-ok', h('span.fb-icon', '💡'), h('div.fb-text', h('b', 'Vattnets kretslopp: '), 'Vatten finns i tre former: fast (is), flytande (vatten) och gas (ånga). Solen värmer haven så att vatten avdunstar, ångan kondenserar till moln och faller som regn eller snö.')));
    }
  }
  temp.addEventListener('input', update);
  size();
  update();
  step();
  kos.autoSay('Dra i termometern. Gör is till vatten och vatten till ånga!');
  return () => {
    alive = false;
  };
}

/* ---------- Gungbrädan ---------- */
export function seesawView(el, { kos, app, level }) {
  let mi = 0;
  const left = [];
  const right = [];
  let selected = SEESAW_ANIMALS[1];
  const missionEl = h('div.teach');
  const scene = h('div.seesaw-scene');
  const palette = h('div.chip-row');
  const readout = h('div.sci-readout');
  el.append(h('div.sci', h('div.sci-top', stepsBar(2)), missionEl, palette, scene, readout, h('div.row-actions', onTap(h('button.btn.btn-ghost', { type: 'button' }, '↺ Töm'), () => {
    left.length = 0;
    right.length = 0;
    render();
  }))));
  function renderPalette() {
    clear(palette);
    for (const a of SEESAW_ANIMALS) {
      const b = h('button.chip-btn.animal', { type: 'button', class: selected === a ? 'on' : '' }, `${a.e} ${a.w} kg`);
      onTap(b, () => {
        selected = a;
        renderPalette();
        kos.say(`${a.n}, ${a.w} kilo. Tryck på en plats på gungbrädan.`);
      });
      palette.appendChild(b);
    }
  }
  function render() {
    const torque = seesawTorque(left, right);
    const tilt = Math.max(-14, Math.min(14, torque * 2));
    const seats = [];
    for (const side of ['L', 'R'])
      for (let d = 1; d <= 4; d++) {
        const arr = side === 'L' ? left : right;
        const occ = arr.find((x) => x.d === d);
        const x = 200 + (side === 'L' ? -1 : 1) * d * 40;
        seats.push(`<g class="seat" data-side="${side}" data-d="${d}"><rect x="${x - 19}" y="88" width="38" height="44" rx="8" fill="${occ ? 'rgba(255,255,255,.0)' : 'rgba(255,255,255,.55)'}" stroke="rgba(31,42,68,.25)" stroke-dasharray="${occ ? '0' : '4 3'}"/><text x="${x}" y="122" text-anchor="middle" font-size="30">${occ ? occ.e : ''}</text><text x="${x}" y="152" text-anchor="middle" font-size="11" fill="#56627d">${d}</text></g>`);
      }
    scene.innerHTML = `<svg viewBox="0 0 400 200" class="seesaw-svg">
      <polygon points="200,140 175,190 225,190" fill="#6b7a99"/>
      <g transform="rotate(${tilt} 200 140)"><rect x="28" y="132" width="344" height="12" rx="6" fill="#c58b4f"/>${seats.join('')}</g>
      <rect x="0" y="190" width="400" height="10" fill="#8fd18a"/></svg>`;
    scene.querySelectorAll('.seat').forEach((g) =>
      g.addEventListener('click', () => {
        const side = g.dataset.side;
        const d = Number(g.dataset.d);
        const arr = side === 'L' ? left : right;
        const idx = arr.findIndex((x) => x.d === d);
        if (idx >= 0) arr.splice(idx, 1);
        else arr.push({ ...selected, d });
        kos.sfx('pop');
        render();
        check();
      }),
    );
    const sum = (arr) => arr.reduce((s, x) => s + x.w * x.d, 0);
    const bal = torque === 0 && left.length + right.length > 0;
    readout.innerHTML = level >= 2
      ? `Vänster: ${left.map((x) => `${x.w}×${x.d}`).join(' + ') || '0'} = <b>${sum(left)}</b> · Höger: ${right.map((x) => `${x.w}×${x.d}`).join(' + ') || '0'} = <b>${sum(right)}</b> ${bal ? '⚖️ <b>Jämvikt!</b>' : ''}`
      : bal ? '⚖️ <b>Jämvikt!</b> Gungbrädan är rak.' : torque > 0 ? 'Gungbrädan lutar åt höger.' : torque < 0 ? 'Gungbrädan lutar åt vänster.' : 'Sätt djur på gungbrädan.';
  }
  function showMission() {
    if (mi >= SEESAW_MISSIONS.length) {
      clear(missionEl).append(h('span.teach-icon', '🏆'), h('span', 'Alla uppdrag klara! Lek fritt.'));
      return;
    }
    clear(missionEl).append(h('span.teach-icon', `${mi + 1}/${SEESAW_MISSIONS.length}`), h('span', SEESAW_MISSIONS[mi].text));
    kos.autoSay(SEESAW_MISSIONS[mi].text);
  }
  function check() {
    if (mi < SEESAW_MISSIONS.length && SEESAW_MISSIONS[mi].check(left, right)) {
      kos.sfx('correct');
      kos.reward({ stars: 1 });
      mi++;
      if (mi === SEESAW_MISSIONS.length) {
        finishExperiment(kos, app, 'seesaw');
        const exp = 'Ett tungt djur nära mitten kan balansera ett lätt djur långt ut. Det som räknas är vikt gånger avstånd. Mitten där gungbrädan vilar kallas vridpunkt – och tyngdpunkten måste hamna precis över den för jämvikt.';
        el.querySelector('.sci').appendChild(h('div.fb.fb-ok', h('span.fb-icon', '💡'), h('div.fb-text', h('b', 'Förklaring: '), exp)));
        kos.say(exp);
      }
      setTimeout(showMission, 900);
    }
  }
  renderPalette();
  render();
  showMission();
}

/* ---------- Rutschkanan (friktion) ---------- */
export function slideView(el, { kos, app }) {
  const missions = missionList(['Prova alla fem underlag', 'Få kälken att åka längre än 8 meter', 'Hitta ett underlag där kälken fastnar i backen']);
  let surface = SURFACES[1];
  let steep = 30;
  const tried = new Set();
  const results = [];
  const scene = h('div.slide-scene');
  const chips = h('div.chip-row');
  const steepRow = h('div.chip-row');
  const log = h('table.protocol', h('thead', h('tr', h('th', 'Underlag'), h('th', 'Backe'), h('th', 'Sträcka'))), h('tbody'));
  const goBtn = h('button.btn.btn-primary.btn-run', { type: 'button' }, '🛷 Åk!');
  el.append(h('div.sci', h('div.sci-top', stepsBar(2), h('p.sci-q', 'Vilket underlag är halast? Välj underlag och backe – och åk!')), chips, steepRow, scene, h('div.row-actions', goBtn), missions.el, log));
  function renderChips() {
    clear(chips);
    for (const s of SURFACES) chips.appendChild(onTap(h('button.chip-btn', { type: 'button', class: s === surface ? 'on' : '' }, `${s.e} ${s.n}`), () => {
      surface = s;
      renderChips();
      draw(0, null);
    }));
    clear(steepRow);
    for (const [a, n] of [[20, 'Flack'], [30, 'Mellan'], [45, 'Brant']]) steepRow.appendChild(onTap(h('button.chip-btn', { type: 'button', class: a === steep ? 'on' : '' }, `${n} backe`), () => {
      steep = a;
      renderChips();
      draw(0, null);
    }));
  }
  const W = 420;
  const H = 220;
  const hill = 3; // meter höjd
  function draw(progress, res) {
    const a = (steep * Math.PI) / 180;
    const hx = 30 + 120 / Math.tan(a) * 0.8;
    const top = [30, 40];
    const bottom = [Math.min(220, hx + 30), 170];
    const groundEnd = W - 10;
    const scale = 22; // px per meter på marken
    let sx;
    let sy;
    if (!res) {
      sx = top[0] + 10;
      sy = top[1] - 6;
    } else if (res.stuck) {
      const f = Math.min(progress, 1) * res.slopeFraction * 0.5;
      sx = top[0] + (bottom[0] - top[0]) * f;
      sy = top[1] + (bottom[1] - top[1]) * f - 6;
    } else {
      const total = 1 + res.ground;
      const along = progress * total;
      if (along <= 1) {
        sx = top[0] + (bottom[0] - top[0]) * along;
        sy = top[1] + (bottom[1] - top[1]) * along - 6;
      } else {
        sx = Math.min(groundEnd - 10, bottom[0] + (along - 1) * scale);
        sy = bottom[1] - 6;
      }
    }
    let ticks = '';
    for (let m = 0; m <= 14; m += 2) ticks += `<line x1="${bottom[0] + m * scale}" y1="172" x2="${bottom[0] + m * scale}" y2="180" stroke="#56627d"/><text x="${bottom[0] + m * scale}" y="194" font-size="10" text-anchor="middle" fill="#56627d">${m} m</text>`;
    scene.innerHTML = `<svg viewBox="0 0 ${W} ${H}" class="slide-svg"><rect width="${W}" height="${H}" fill="#dff1ff"/>
      <polygon points="${top[0]},${top[1]} ${bottom[0]},${bottom[1]} ${top[0]},${bottom[1]}" fill="${surface.color}" stroke="#56627d" stroke-width="2"/>
      <rect x="0" y="170" width="${W}" height="${H - 170}" fill="#eef6ff"/><line x1="0" y1="170" x2="${W}" y2="170" stroke="#56627d" stroke-width="2"/>${ticks}
      <text x="${sx}" y="${sy}" font-size="28" text-anchor="middle">🛷</text></svg>`;
  }
  onTap(goBtn, async () => {
    goBtn.disabled = true;
    const res = slideDistance(hill, surface.mu, 0.25, steep);
    kos.sfx('whoosh');
    const start = performance.now();
    const dur = 1600;
    await new Promise((resolve) => {
      const tick = (now) => {
        const pgr = Math.min(1, (now - start) / dur);
        draw(1 - (1 - pgr) ** 2, res);
        if (pgr < 1) requestAnimationFrame(tick);
        else resolve();
      };
      requestAnimationFrame(tick);
    });
    goBtn.disabled = false;
    const dist = res.stuck ? 0 : Math.min(14, res.ground);
    results.push({ s: surface, steep, dist, stuck: res.stuck });
    log.querySelector('tbody').prepend(h('tr', h('td', `${surface.e} ${surface.n}`), h('td', `${steep}°`), h('td', res.stuck ? 'fastnade' : `${dist.toFixed(1)} m`)));
    tried.add(surface.id);
    if (tried.size === SURFACES.length && missions.complete(0)) kos.reward({ stars: 1 });
    if (dist > 8 && missions.complete(1)) kos.reward({ stars: 1 });
    if (res.stuck && missions.complete(2)) kos.reward({ stars: 1 });
    kos.say(res.stuck ? `Kälken fastnade på ${surface.n.toLowerCase()}! Mycket friktion.` : `${dist.toFixed(0)} meter!`);
    if (missions.count === missions.total && !el.dataset.done) {
      el.dataset.done = '1';
      finishExperiment(kos, app, 'slide');
      const exp = 'Tyngdkraften drar kälken nedför backen. Friktion är en kraft som bromsar när två ytor gnids mot varandra. Is har lite friktion – därför är den hal. Sandpapper har mycket friktion. En brantare backe gör att tyngdkraften vinner lättare över friktionen.';
      el.querySelector('.sci').appendChild(h('div.fb.fb-ok', h('span.fb-icon', '💡'), h('div.fb-text', h('b', 'Förklaring: '), exp)));
      kos.say(exp);
    }
  });
  renderChips();
  draw(0, null);
  kos.autoSay('Vilket underlag är halast? Välj underlag och backe och tryck på åk.');
}

/* ---------- Blanda & separera ---------- */
export function mixView(el, { kos, app }) {
  const missions = missionList(['Få tillbaka sanden ur sandvattnet', 'Få tillbaka saltet ur saltvattnet']);
  const glass = h('div.mix-glass', h('div.mix-liquid'), h('div.mix-bits'));
  const panel = h('div.sci-panel');
  const top = h('div.sci-top');
  el.append(h('div.sci', top, h('div.mix-stage', glass), panel, missions.el));
  let mixture = null;
  const liquid = glass.querySelector('.mix-liquid');
  const bits = glass.querySelector('.mix-bits');
  function choose() {
    glass.className = 'mix-glass';
    bits.innerHTML = '';
    clear(top).append(stepsBar(0), h('p.sci-q', 'Vad händer när vi blandar saker i vatten – och kan vi få tillbaka dem?'));
    clear(panel).append(
      h(
        'div.choices.n2',
        onTap(h('button.choice', { type: 'button' }, h('span.choice-label', '🏖️ Sand + vatten')), () => mix('sand')),
        onTap(h('button.choice', { type: 'button' }, h('span.choice-label', '🧂 Salt + vatten')), () => mix('salt')),
      ),
    );
  }
  async function mix(kind) {
    mixture = kind;
    clear(top).append(stepsBar(1), h('p.sci-q', kind === 'sand' ? 'Vi rör ner sand i vattnet…' : 'Vi rör ner salt i vattnet…'));
    clear(panel);
    glass.classList.add('stir', kind);
    bits.innerHTML = kind === 'sand' ? '<i></i>'.repeat(18) : '<i></i>'.repeat(14);
    kos.sfx('whoosh');
    await wait(1600);
    glass.classList.add('mixed');
    clear(top).append(
      stepsBar(1),
      h('p.sci-q', kind === 'sand' ? 'Sanden virvlar runt men löser sig inte – den sjunker till botten. Det är en blandning.' : 'Saltet försvann! Det har löst sig i vattnet. Det kallas en lösning.'),
    );
    clear(panel).append(h('p', 'Hur kan vi få tillbaka det? Gissa:'), h('div.choices.n2', onTap(h('button.choice', { type: 'button' }, h('span.choice-label', '🧻 Filtrera')), () => filter()), onTap(h('button.choice', { type: 'button' }, h('span.choice-label', '🔥 Låta vattnet avdunsta')), () => evaporate())));
    kos.autoSay(kind === 'sand' ? 'Sanden löser sig inte. Hur får vi tillbaka den? Filtrera eller avdunsta?' : 'Saltet löste sig! Hur får vi tillbaka det? Filtrera eller avdunsta?');
  }
  async function filter() {
    clear(top).append(stepsBar(2), h('p.sci-q', 'Vi häller genom ett kaffefilter…'));
    clear(panel);
    glass.classList.add('filtering');
    await wait(1600);
    if (mixture === 'sand') {
      glass.classList.add('separated');
      if (missions.complete(0)) kos.reward({ stars: 2 });
      result('Det fungerade! Sandkornen är för stora för att komma igenom filtrets små hål. Rent vatten rinner igenom.');
    } else {
      result('Hmm! Saltet åkte rakt igenom filtret. När salt löser sig blir det så pyttesmå delar att de passerar filtret. Prova att avdunsta i stället!', true);
    }
  }
  async function evaporate() {
    clear(top).append(stepsBar(2), h('p.sci-q', 'Vi värmer så att vattnet avdunstar…'));
    clear(panel);
    glass.classList.add('evaporating');
    kos.sfx('whoosh');
    await wait(2000);
    glass.classList.add('dry');
    if (mixture === 'salt') {
      if (missions.complete(1)) kos.reward({ stars: 2 });
      result('Det fungerade! Vattnet blev till ånga och försvann, men saltet kan inte avdunsta. Kvar blir saltkristaller. Så utvinns salt ur havsvatten!');
    } else {
      if (missions.complete(0)) kos.reward({ stars: 1 });
      result('Det fungerade också, men tog lång tid! Ett filter är snabbare för sand.');
    }
  }
  function result(text, tryAgain = false) {
    clear(top).append(stepsBar(3), h('p.sci-q', tryAgain ? 'Det gick inte!' : 'Det gick!'));
    const again = onTap(h('button.btn.btn-primary', { type: 'button' }, tryAgain ? '🔁 Testa igen' : '🧪 Nytt experiment'), () => (tryAgain ? mix(mixture) : choose()));
    clear(panel).append(h('div.fb', { class: tryAgain ? 'fb-learn' : 'fb-ok' }, h('span.fb-icon', tryAgain ? '🤔' : '💡'), h('div.fb-text', text), again));
    glass.className = `mix-glass ${mixture} mixed ${tryAgain ? '' : 'done'}`;
    kos.say(text);
    if (missions.count === missions.total && !el.dataset.done) {
      el.dataset.done = '1';
      finishExperiment(kos, app, 'mix');
    }
  }
  choose();
  kos.autoSay('Vad händer när vi blandar saker i vatten? Välj ett experiment.');
}
