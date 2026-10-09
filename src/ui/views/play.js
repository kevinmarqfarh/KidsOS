// Lekstaden – öppen lekvärld med inbyggt lärande.
import { h, clear, onTap } from '../dom.js';
import { loadJSON, saveJSON } from '../../core/storage.js';
import { spendCoins, addCoins, addToSet, hasInSet } from '../../core/model.js';
import {
  SCENES, ITEMS, itemById, SHOP_CATS, coinsForLevel, fewestCoins, PLANTS, GROW_MINUTES, canGrow, growTick,
  INGREDIENTS, RECIPES, matchRecipe, BASE_COLORS, MIXES, mixColors, TOOLS, PATIENTS, SECRETS,
  SKIN, HAIR_COLORS, HAIR_STYLES, CLOTH_COLORS, newCharacter, emptyPlay,
} from '../../apps/play.js';
import { WONDERS, wonderOfTheDay } from '../../apps/wonder.js';
import { PLACES } from '../../apps/world.js';
import { PLANETS } from '../../apps/space.js';
import { createRng } from '../../core/rng.js';
import { sfx } from '../../core/sound.js';

/* ---------------- Figurer (SVG) ---------------- */
export function charSvg(c, mood = 'happy') {
  const hair = {
    kort: `<path d="M24 42 Q24 16 50 16 Q76 16 76 42 Q70 28 50 28 Q30 28 24 42Z" fill="${c.hairColor}"/>`,
    lockigt: [20, 32, 44, 56, 68, 80].map((x, i) => `<circle cx="${x}" cy="${26 + (i % 2) * 6}" r="11" fill="${c.hairColor}"/>`).join(''),
    tofsar: `<path d="M24 40 Q26 16 50 16 Q74 16 76 40 Q66 26 50 26 Q34 26 24 40Z" fill="${c.hairColor}"/><circle cx="18" cy="40" r="10" fill="${c.hairColor}"/><circle cx="82" cy="40" r="10" fill="${c.hairColor}"/>`,
    långt: `<path d="M22 44 Q20 14 50 14 Q80 14 78 44 L82 92 Q70 84 66 60 Q58 30 50 30 Q42 30 34 60 Q30 84 18 92Z" fill="${c.hairColor}"/>`,
    flint: '',
    tuppkam: `<path d="M38 22 L44 4 L50 20 L56 2 L62 22 Z" fill="${c.hairColor}"/>`,
  }[c.hair] || '';
  const behind = c.hair === 'långt' ? hair : '';
  const front = c.hair === 'långt' ? `<path d="M26 40 Q28 22 50 22 Q72 22 74 40 Q64 30 50 30 Q36 30 26 40Z" fill="${c.hairColor}"/>` : hair;
  const eyes = mood === 'sleep'
    ? '<path d="M36 46 q5 4 10 0 M54 46 q5 4 10 0" stroke="#1f2937" stroke-width="2.5" fill="none" stroke-linecap="round"/>'
    : mood === 'yum' ? '<path d="M36 47 q5 -6 10 0 M54 47 q5 -6 10 0" stroke="#1f2937" stroke-width="2.5" fill="none" stroke-linecap="round"/>'
    : '<circle cx="41" cy="45" r="3.6" fill="#1f2937"/><circle cx="59" cy="45" r="3.6" fill="#1f2937"/><circle cx="42.2" cy="43.8" r="1.2" fill="#fff"/><circle cx="60.2" cy="43.8" r="1.2" fill="#fff"/>';
  const mouth = {
    happy: '<path d="M41 56 Q50 64 59 56" stroke="#7c2d12" stroke-width="2.6" fill="none" stroke-linecap="round"/>',
    eat: '<ellipse cx="50" cy="58" rx="6" ry="7" fill="#7c2d12"/>',
    yum: '<path d="M41 55 Q50 66 59 55Z" fill="#7c2d12"/><ellipse cx="50" cy="60" rx="4" ry="2.4" fill="#f472b6"/>',
    sleep: '<ellipse cx="50" cy="58" rx="3" ry="2" fill="#7c2d12"/>',
    no: '<path d="M42 60 Q50 54 58 60" stroke="#7c2d12" stroke-width="2.6" fill="none" stroke-linecap="round"/>',
  }[mood] || '';
  const w = c.wear || {};
  const em = (e, x, y, s) => (e ? `<text x="${x}" y="${y}" font-size="${s}" text-anchor="middle" dominant-baseline="central">${e}</text>` : '');
  return `<svg class="char-svg" viewBox="0 0 100 160" aria-hidden="true">${behind}
    <rect x="34" y="112" width="13" height="36" rx="6" fill="${c.pants}"/><rect x="53" y="112" width="13" height="36" rx="6" fill="${c.pants}"/>
    <ellipse cx="40" cy="150" rx="11" ry="6" fill="#1f2937"/><ellipse cx="60" cy="150" rx="11" ry="6" fill="#1f2937"/>
    <rect x="16" y="76" width="12" height="34" rx="6" fill="${c.skin}" transform="rotate(14 22 78)"/><rect x="72" y="76" width="12" height="34" rx="6" fill="${c.skin}" transform="rotate(-14 78 78)"/>
    <rect x="27" y="70" width="46" height="48" rx="14" fill="${c.shirt}"/>
    <rect x="44" y="64" width="12" height="10" rx="3" fill="${c.skin}"/>
    <circle cx="50" cy="44" r="25" fill="${c.skin}"/>${front}
    ${eyes}<circle cx="35" cy="54" r="4" fill="#fb7185" opacity=".35"/><circle cx="65" cy="54" r="4" fill="#fb7185" opacity=".35"/>${mouth}
    ${em(itemById(w.neck)?.e, 50, 74, 18)}${em(itemById(w.face)?.e, 50, 45, 24)}${em(itemById(w.head)?.e, 50, 16, 28)}${em(itemById(w.hand)?.e, 88, 104, 22)}
    ${mood === 'sleep' ? '<text x="80" y="18" font-size="16" fill="#3d8bfd" font-weight="800">z z</text>' : ''}</svg>`;
}

/* ---------------- Bakgrunder ---------------- */
const BG = {
  house: (night) => `<svg viewBox="0 0 400 300" preserveAspectRatio="none"><rect width="400" height="210" fill="#fde7c8"/><rect y="210" width="400" height="90" fill="#c08457"/>
    <g opacity=".25">${Array.from({ length: 10 }, (_, i) => `<rect x="${i * 40}" y="210" width="2" height="90" fill="#7c4a1e"/>`).join('')}</g>
    <rect x="150" y="40" width="100" height="80" rx="6" fill="${night ? '#1e293b' : '#bae6fd'}" stroke="#fff" stroke-width="6"/>${night ? '<circle cx="225" cy="62" r="9" fill="#fef9c3"/><circle cx="170" cy="58" r="1.5" fill="#fff"/><circle cx="190" cy="90" r="1.5" fill="#fff"/>' : '<circle cx="225" cy="62" r="12" fill="#fde047"/><ellipse cx="180" cy="95" rx="18" ry="7" fill="#fff"/>'}
    <line x1="200" y1="40" x2="200" y2="120" stroke="#fff" stroke-width="4"/><rect x="330" y="96" width="50" height="114" rx="4" fill="#a16207"/><circle cx="370" cy="155" r="3" fill="#fde047"/>
    <rect x="0" y="204" width="400" height="8" fill="#e7c9a0"/><ellipse cx="200" cy="262" rx="120" ry="22" fill="#fca5a5" opacity=".55"/></svg>`,
  kitchen: () => `<svg viewBox="0 0 400 300" preserveAspectRatio="none"><rect width="400" height="300" fill="#e0f2fe"/>
    ${Array.from({ length: 8 }, (_, r) => Array.from({ length: 10 }, (_, c) => `<rect x="${c * 40}" y="${r * 26}" width="38" height="24" fill="${(r + c) % 2 ? '#f0f9ff' : '#e0f2fe'}"/>`).join('')).join('')}
    <rect y="190" width="400" height="110" fill="#fef3c7"/><rect y="180" width="400" height="16" rx="3" fill="#a16207"/>
    <rect x="20" y="40" width="120" height="60" rx="6" fill="#fff" stroke="#cbd5e1" stroke-width="3"/><rect x="300" y="120" width="80" height="60" rx="6" fill="#475569"/><circle cx="320" cy="135" r="8" fill="#ef4444"/><circle cx="345" cy="135" r="8" fill="#94a3b8"/></svg>`,
  vet: () => `<svg viewBox="0 0 400 300" preserveAspectRatio="none"><rect width="400" height="300" fill="#ecfeff"/><rect y="220" width="400" height="80" fill="#a5f3fc"/>
    <rect x="130" y="150" width="140" height="70" rx="10" fill="#fff" stroke="#67e8f9" stroke-width="4"/><rect x="20" y="30" width="70" height="70" rx="8" fill="#fff"/><path d="M45 50 h20 v10 h10 v20 h-10 v10 h-20 v-10 h-10 v-20 h10z" fill="#ef4444" transform="translate(0 -6) scale(.9) translate(5 0)"/></svg>`,
  lab: () => `<svg viewBox="0 0 400 300" preserveAspectRatio="none"><rect width="400" height="300" fill="#f5f3ff"/><rect y="200" width="400" height="100" fill="#ddd6fe"/><rect y="190" width="400" height="14" fill="#7c3aed" opacity=".6"/>
    ${Array.from({ length: 6 }, (_, i) => `<circle cx="${40 + i * 64}" cy="${40 + (i % 2) * 30}" r="${6 + (i % 3) * 3}" fill="#c4b5fd" opacity=".6"/>`).join('')}</svg>`,
  garden: () => `<svg viewBox="0 0 400 300" preserveAspectRatio="none"><rect width="400" height="300" fill="#bae6fd"/><circle cx="340" cy="50" r="28" fill="#fde047"/><rect y="150" width="400" height="150" fill="#86efac"/>
    <path d="M0 150 Q100 120 200 150 T400 150 V160 H0Z" fill="#4ade80"/>${Array.from({ length: 14 }, (_, i) => `<path d="M${i * 30 + 6} 150 l4 -14 l4 14" fill="#16a34a"/>`).join('')}<rect x="10" y="100" width="380" height="8" fill="#a16207" opacity=".7"/>${Array.from({ length: 12 }, (_, i) => `<rect x="${14 + i * 32}" y="86" width="8" height="40" fill="#a16207" opacity=".7"/>`).join('')}</svg>`,
  market: () => `<svg viewBox="0 0 400 300" preserveAspectRatio="none"><rect width="400" height="300" fill="#fef9c3"/>${Array.from({ length: 10 }, (_, i) => `<path d="M${i * 40} 0 h40 v34 q-20 14 -40 0z" fill="${i % 2 ? '#fde047' : '#f97316'}"/>`).join('')}<rect y="250" width="400" height="50" fill="#fcd34d"/></svg>`,
  wardrobe: () => `<svg viewBox="0 0 400 300" preserveAspectRatio="none"><rect width="400" height="300" fill="#fce7f3"/><rect y="230" width="400" height="70" fill="#f9a8d4"/><rect x="290" y="30" width="90" height="140" rx="10" fill="#fff" stroke="#f472b6" stroke-width="5"/><ellipse cx="335" cy="100" rx="30" ry="50" fill="#e0f2fe"/></svg>`,
};

/* ---------------- Vyn ---------------- */
export function playView(el, { kos }) {
  const p = kos.profile;
  const key = `play.${p.id}`;
  const st = Object.assign(emptyPlay(), loadJSON(key, {}) || {});
  if (!st.chars.length) {
    const rng = createRng(Date.now()).next;
    st.chars.push(newCharacter(rng), newCharacter(rng));
  }
  let saveT;
  const save = () => {
    clearTimeout(saveT);
    saveT = setTimeout(() => saveJSON(key, st), 200);
  };
  const level = Math.min(4, Math.max(0, kos.level('math')));
  let alive = true;
  let timers = [];
  const bar = h('div.play-bar');
  const body = h('div.play-body');
  el.append(h('div.play', bar, body));

  function wallet() {
    return h('span.wallet', { title: 'Mina mynt' }, h('span.coin', '🪙'), h('b', String(p.coins || 0)));
  }
  function topbar(title, showMap = true) {
    clear(bar).append(
      showMap ? onTap(h('button.btn.btn-ghost.btn-sm', { type: 'button' }, '🗺️ Kartan'), () => showTown()) : h('span'),
      h('b.play-title', title),
      wallet(),
    );
  }
  function bubble(target, text, { speak = true, ms = 2600 } = {}) {
    const b = h('div.speech', text);
    target.appendChild(b);
    setTimeout(() => b.remove(), ms);
    if (speak) kos.say(text);
  }
  function earn(n, why) {
    addCoins(p, n);
    kos.save();
    kos.sfx('star');
    kos.toast(`+${n} 🪙 ${why}`, { icon: '🪙', ms: 2200 });
    clear(bar.querySelector('.wallet') || h('span')).append(h('span.coin', '🪙'), h('b', String(p.coins)));
  }
  function clearTimers() {
    timers.forEach(clearInterval);
    timers = [];
  }

  /* ----- Stadskartan ----- */
  function showTown() {
    clearTimers();
    topbar('Lekstaden', false);
    clear(body);
    const map = h('div.town');
    SCENES.forEach((s, i) => {
      const b = h('button.town-house', { type: 'button', style: { '--c': s.color, '--i': i } }, h('span.th-roof'), h('span.th-icon', s.icon), h('span.th-name', s.name), h('small', s.blurb));
      onTap(b, () => {
        kos.sfx('pop');
        showScene(s.id);
      });
      map.appendChild(b);
    });
    const found = Object.keys(st.secrets).length;
    body.append(
      map,
      h('div.town-info', h('span', `🔍 Hemligheter: ${found}`), h('span', `🧪 Färger: ${Object.keys(st.colors).length}/${MIXES.length}`), h('span', `🍳 Recept: ${Object.keys(st.recipes).length}/${RECIPES.length}`), h('span', `🏥 Patienter: ${st.patients}`)),
      h('p.muted.town-tip', '🪙 Mynt tjänar du genom att lära dig i de andra apparna – varje stjärna ger ett mynt.'),
    );
    kos.autoSay('Välkommen till Lekstaden! Vart vill du gå?');
  }

  function showScene(id) {
    clearTimers();
    const s = SCENES.find((x) => x.id === id);
    topbar(`${s.icon} ${s.name}`);
    clear(body);
    ({ house, market, kitchen, vet, lab, garden, wardrobe })[id]();
  }

  /* ----- Scen-motor: fritt placerbara saker ----- */
  function makeStage(sceneId, bgSvg) {
    const stage = h('div.stage', { dataset: { scene: sceneId } }, h('div.stage-bg', { html: bgSvg }));
    const ro = new ResizeObserver(() => stage.style.setProperty('--u', `${stage.clientWidth / 100}px`));
    ro.observe(stage);
    // hemligheter
    (SECRETS[sceneId] || []).forEach((sec, i) => {
      const sid = `${sceneId}-${i}`;
      const spot = h('button.secret', { type: 'button', style: { left: `${sec.x}%`, top: `${sec.y}%` }, 'aria-label': 'hemlighet', class: st.secrets[sid] ? 'found' : '' }, st.secrets[sid] ? sec.e : '');
      onTap(spot, () => {
        if (st.secrets[sid]) {
          bubble(stage, sec.e, { speak: false, ms: 900 });
          return;
        }
        st.secrets[sid] = 1;
        spot.textContent = sec.e;
        spot.classList.add('found', 'pop');
        kos.sfx('fanfare');
        addToSet(p, 'playSecrets', sid);
        earn(2, 'Du hittade en hemlighet!');
        save();
      });
      stage.appendChild(spot);
    });
    return stage;
  }
  const pct = (stage, e) => {
    const r = stage.getBoundingClientRect();
    return { x: Math.max(3, Math.min(97, ((e.clientX - r.left) / r.width) * 100)), y: Math.max(5, Math.min(95, ((e.clientY - r.top) / r.height) * 100)) };
  };
  /** Gör en nod dragbar inom scenen. */
  function draggable(node, stage, { onDrop, onTap: tap, onStart }) {
    let start = null;
    let moved = false;
    node.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      start = { x: e.clientX, y: e.clientY };
      moved = false;
      node.setPointerCapture?.(e.pointerId);
      node.classList.add('lift');
      onStart?.();
    });
    node.addEventListener('pointermove', (e) => {
      if (!start) return;
      if (!moved && Math.hypot(e.clientX - start.x, e.clientY - start.y) < 8) return;
      moved = true;
      const q = pct(stage, e);
      node.style.left = `${q.x}%`;
      node.style.top = `${q.y}%`;
    });
    const end = (e) => {
      if (!start) return;
      node.classList.remove('lift');
      const q = pct(stage, e);
      start = null;
      if (moved) onDrop?.(q, e);
      else tap?.(e);
    };
    node.addEventListener('pointerup', end);
    node.addEventListener('pointercancel', end);
  }
  /** Hittar figur/mål nära en punkt. */
  function hitAt(stage, q, selector) {
    let best = null;
    let bd = 12;
    stage.querySelectorAll(selector).forEach((n) => {
      const d = Math.hypot(parseFloat(n.style.left) - q.x, (parseFloat(n.style.top) - q.y) * 0.75);
      if (d < bd) {
        bd = d;
        best = n;
      }
    });
    return best;
  }

  /* ----- Figurer i scenen ----- */
  function placeChars(stage, sceneId, positions) {
    st.charPos[sceneId] = st.charPos[sceneId] || {};
    st.chars.slice(0, 4).forEach((c, i) => {
      const pos = st.charPos[sceneId][c.id] || positions[i] || { x: 30 + i * 14, y: 66 };
      const node = h('div.char', { style: { left: `${pos.x}%`, top: `${pos.y}%` }, dataset: { id: c.id } });
      node.innerHTML = charSvg(c);
      draggable(node, stage, {
        onDrop: (q) => {
          st.charPos[sceneId][c.id] = q;
          // lägg sig i sängen?
          const bed = hitAt(stage, q, '.prop[data-item="bed"], .prop[data-item="sofa"]');
          if (bed) {
            node.innerHTML = charSvg(c, 'sleep');
            bubble(node, 'Zzz … God natt!', { ms: 1800 });
          } else node.innerHTML = charSvg(c);
          save();
        },
        onTap: () => {
          kos.sfx('pop');
          const lines = [`Hej! Jag heter ${c.name}.`, 'Vad ska vi leka?', 'Jag är lite hungrig …', 'Kan du hitta en hemlighet?', 'Jag gillar att lära mig nya saker!'];
          node.innerHTML = charSvg(c, 'yum');
          setTimeout(() => (node.innerHTML = charSvg(c)), 900);
          bubble(node, lines[Math.floor(Math.random() * lines.length)]);
        },
      });
      stage.appendChild(node);
    });
  }
  function feed(charNode, food) {
    const c = st.chars.find((x) => x.id === charNode.dataset.id);
    if (!c) return;
    charNode.innerHTML = charSvg(c, 'eat');
    kos.sfx('pop');
    setTimeout(() => {
      charNode.innerHTML = charSvg(c, 'yum');
      bubble(charNode, food.healthy === false ? 'Mums! Men inte för mycket socker …' : `Mums, ${food.n}!`);
    }, 500);
    setTimeout(() => (charNode.innerHTML = charSvg(c)), 2400);
  }

  /* ======================= Mitt hus ======================= */
  function house() {
    const hour = new Date().getHours();
    const stage = makeStage('house', BG.house(hour < 7 || hour >= 19));
    const placed = (st.placed.house = st.placed.house || []);
    const tray = h('div.tray');
    body.append(stage, h('p.tray-title', '🧺 Mina saker – dra in i rummet'), tray);
    function propNode(pl) {
      const it = itemById(pl.item);
      const node = h('div.prop', { style: { left: `${pl.x}%`, top: `${pl.y}%` }, dataset: { item: pl.item, uid: pl.uid } }, it.e);
      draggable(node, stage, {
        onDrop: (q) => {
          if (q.y > 93) {
            // tillbaka till korgen
            placed.splice(placed.indexOf(pl), 1);
            node.remove();
            renderTray();
          } else Object.assign(pl, q);
          save();
        },
        onTap: () => interact(it, node, stage),
      });
      return node;
    }
    placed.forEach((pl) => stage.appendChild(propNode(pl)));
    placeChars(stage, 'house', [{ x: 40, y: 70 }, { x: 58, y: 72 }]);
    function renderTray() {
      clear(tray);
      const owned = ITEMS.filter((i) => ['hem', 'djur'].includes(i.cat) && (st.inv[i.id] || 0) > placed.filter((x) => x.item === i.id).length);
      if (!owned.length) tray.appendChild(h('span.muted', 'Allt är utställt! Köp fler saker på Marknaden.'));
      owned.forEach((it) => {
        const t = h('button.tray-item', { type: 'button', 'aria-label': it.n }, it.e);
        t.addEventListener('pointerdown', (e) => trayDrag(e, it));
        tray.appendChild(t);
      });
    }
    function trayDrag(e, it) {
      e.preventDefault();
      const pl = { uid: `u${Date.now().toString(36)}`, item: it.id, ...pct(stage, e) };
      const node = propNode(pl);
      node.classList.add('lift');
      stage.appendChild(node);
      const move = (ev) => {
        const q = pct(stage, ev);
        node.style.left = `${q.x}%`;
        node.style.top = `${q.y}%`;
        Object.assign(pl, q);
      };
      const up = (ev) => {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        node.classList.remove('lift');
        const r = stage.getBoundingClientRect();
        if (ev.clientY > r.bottom || ev.clientY < r.top) {
          node.remove();
          return;
        }
        Object.assign(pl, pct(stage, ev));
        node.style.left = `${pl.x}%`;
        node.style.top = `${pl.y}%`;
        placed.push(pl);
        kos.sfx('pop');
        save();
        renderTray();
      };
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
    }
    renderTray();
    kos.autoSay('Ditt hus! Dra in saker från korgen och lek med figurerna.');
  }

  function interact(it, node, stage) {
    const rng = createRng(Date.now());
    kos.sfx('pop');
    switch (it.tap) {
      case 'light':
        stage.classList.toggle('dark');
        bubble(node, stage.classList.contains('dark') ? 'Släckt!' : 'Tänt!', { speak: false, ms: 900 });
        break;
      case 'tv': {
        const w = rng.pick(WONDERS);
        bubble(node, `📺 ${w.q} ${w.a.split('.')[0]}.`, { ms: 6000 });
        break;
      }
      case 'piano': {
        const notes = [['C', 523], ['D', 587], ['E', 659], ['F', 698], ['G', 784], ['A', 880], ['B', 988]];
        const [n, f] = rng.pick(notes);
        try {
          sfx.note(f, 0.5);
        } catch {}
        bubble(node, `🎵 ${n}`, { speak: false, ms: 900 });
        break;
      }
      case 'book':
        bubble(node, '📖 Läs en berättelse i appen Svenska!', { ms: 2600 });
        break;
      case 'globe': {
        const pl = rng.pick(PLACES);
        bubble(node, `${pl.flag} ${pl.name}: ${pl.fact}`, { ms: 6000 });
        break;
      }
      case 'star': {
        const pl = rng.pick(PLANETS);
        bubble(node, `🔭 ${pl.name}: ${pl.facts[0]}`, { ms: 6000 });
        break;
      }
      case 'fact': {
        const w = wonderOfTheDay();
        bubble(node, `💻 Dagens fråga: ${w.q}`, { ms: 4000 });
        break;
      }
      case 'disco':
        stage.classList.add('disco');
        kos.sfx('fanfare');
        setTimeout(() => stage.classList.remove('disco'), 3000);
        break;
      case 'pet':
        node.classList.add('jump');
        setTimeout(() => node.classList.remove('jump'), 600);
        bubble(node, it.sound);
        break;
      default:
        node.classList.add('jump');
        setTimeout(() => node.classList.remove('jump'), 600);
    }
  }

  /* ======================= Marknaden ======================= */
  function market() {
    let cat = SHOP_CATS[0].id;
    const wrap = h('div.market');
    body.append(h('div.stage-strip', { html: BG.market() }), wrap);
    function render() {
      clear(wrap);
      wrap.append(h('div.chip-row', SHOP_CATS.map((c) => onTap(h('button.chip-btn', { type: 'button', class: c.id === cat ? 'on' : '' }, `${c.e} ${c.n}`), () => {
        cat = c.id;
        render();
      }))));
      const grid = h('div.shop-grid');
      ITEMS.filter((i) => i.cat === cat).forEach((it) => {
        const have = st.inv[it.id] || 0;
        const card = h('button.shop-item', { type: 'button', class: (p.coins || 0) < it.price ? 'poor' : '' }, h('span.si-e', it.e), h('span.si-n', it.n), h('span.price', `${it.price} 🪙`), have ? h('small.have', `Har ${have}`) : null);
        onTap(card, () => buy(it));
        grid.appendChild(card);
      });
      wrap.appendChild(grid);
      const harvest = Object.entries(st.pantry).filter(([, n]) => n > 0);
      if (harvest.length) {
        wrap.append(h('h4', '🧺 Sälj från trädgården (1 🪙 st)'), h('div.chip-row', harvest.map(([k, n]) => {
          const ing = INGREDIENTS.find((i) => i.id === k) || { e: '🌻', n: 'solrosfrön' };
          return onTap(h('button.chip-btn', { type: 'button' }, `${ing.e} ${ing.n} × ${n}`), () => {
            st.pantry[k]--;
            earn(1, `Sålde ${ing.n}`);
            save();
            render();
          });
        })));
      }
    }
    function buy(it) {
      if ((p.coins || 0) < it.price) {
        kos.say(`${it.n} kostar ${it.price} mynt. Du har ${p.coins || 0}. Lär dig något nytt i apparna så tjänar du fler mynt!`);
        kos.toast(`Du behöver ${it.price - (p.coins || 0)} mynt till. Spela i Matte, Svenska eller någon annan app!`, { icon: '🪙', ms: 3800 });
        return;
      }
      pay(it, () => {
        st.inv[it.id] = (st.inv[it.id] || 0) + 1;
        st.bought++;
        addToSet(p, 'playBought', it.id);
        save();
        kos.sfx('fanfare');
        kos.confetti(50);
        kos.say(`Tack för köpet! Du köpte ${it.n}.`);
        render();
      });
    }
    function pay(it, done) {
      const coins = coinsForLevel(level);
      let put = [];
      const sumEl = h('div.pay-sum');
      const counter = h('div.pay-counter');
      const msg = h('p.pay-msg');
      const payBtn = h('button.btn.btn-primary', { type: 'button', disabled: true }, 'Betala ✓');
      const sum = () => put.reduce((a, b) => a + b, 0);
      const render2 = () => {
        clear(counter).append(...put.map((c, i) => onTap(h('button.coin-chip', { type: 'button', class: `v${c}` }, String(c)), () => {
          put.splice(i, 1);
          render2();
        })));
        sumEl.textContent = `${sum()} av ${it.price} 🪙`;
        payBtn.disabled = sum() !== it.price;
        msg.textContent = sum() > it.price ? 'Det blev för mycket! Ta bort ett mynt.' : sum() === it.price ? 'Precis rätt!' : `Det fattas ${it.price - sum()}.`;
        msg.className = `pay-msg ${sum() > it.price ? 'try' : sum() === it.price ? 'ok' : ''}`;
      };
      const dlg = h(
        'div.pay',
        h('div.pay-head', h('span.si-e', it.e), h('div', h('b', `${it.n}`), h('div.price.big', `${it.price} 🪙`))),
        level === 0 ? h('div.price-dots', Array.from({ length: it.price }, () => h('i'))) : null,
        h('p', level === 0 ? 'Lägg ett mynt för varje prick!' : 'Lägg mynt på disken tills det blir rätt summa.'),
        counter,
        sumEl,
        msg,
        h('div.coin-row', coins.map((c) => onTap(h('button.coin-chip.big', { type: 'button', class: `v${c}` }, String(c)), () => {
          if (sum() >= it.price + 10) return;
          put.push(c);
          kos.sfx('click');
          render2();
        }, { guardMs: 80 }))),
        h('div.row-actions', onTap(h('button.btn.btn-ghost', { type: 'button' }, 'Avbryt'), () => dlg.remove()), payBtn),
      );
      onTap(payBtn, () => {
        if (sum() !== it.price || !spendCoins(p, it.price)) return;
        const best = fewestCoins(it.price, coins);
        const efficient = best && put.length === best.length && level >= 2;
        kos.save();
        dlg.remove();
        done();
        if (efficient) earn(1, 'Smart! Så få mynt som möjligt.');
        else clear(bar.querySelector('.wallet')).append(h('span.coin', '🪙'), h('b', String(p.coins)));
      });
      el.querySelector('.play').appendChild(dlg);
      render2();
      kos.say(`${it.n} kostar ${it.price} mynt. ${level === 0 ? 'Lägg ett mynt för varje prick.' : 'Lägg rätt summa på disken.'}`);
    }
    render();
    kos.autoSay('Marknaden! Här kan du köpa saker med dina mynt.');
  }

  /* ======================= Köket ======================= */
  function kitchen() {
    const stage = makeStage('kitchen', BG.kitchen());
    const bowl = {};
    const bowlEl = h('div.bowl', h('span.bowl-e', '🥣'), h('div.bowl-list'));
    bowlEl.style.left = '50%';
    bowlEl.style.top = '72%';
    stage.appendChild(bowlEl);
    placeChars(stage, 'kitchen', [{ x: 16, y: 70 }, { x: 84, y: 70 }]);
    let recipe = null;
    const recipeCard = h('div.recipe-card', { hidden: true });
    const shelf = h('div.tray');
    const actions = h('div.row-actions');
    body.append(stage, recipeCard, h('p.tray-title', '🥫 Skafferiet – tryck eller dra till skålen'), shelf, actions);
    const available = () => INGREDIENTS.filter((i) => !i.grown || (st.pantry[i.id] || 0) > 0);
    function renderShelf() {
      clear(shelf);
      available().forEach((ing) => {
        const t = h('button.tray-item', { type: 'button', 'aria-label': ing.n }, ing.e, ing.grown ? h('small.cnt', String(st.pantry[ing.id])) : null);
        onTap(t, () => addIng(ing), { guardMs: 120 });
        shelf.appendChild(t);
      });
    }
    function addIng(ing) {
      if (ing.grown && (bowl[ing.id] || 0) >= (st.pantry[ing.id] || 0)) {
        kos.say(`Du har inga fler ${ing.n}. Odla fler i trädgården!`);
        return;
      }
      bowl[ing.id] = (bowl[ing.id] || 0) + 1;
      kos.sfx('pop');
      if (kos.shouldAutoSpeak()) kos.say(`${bowl[ing.id]} ${ing.unit === 'st' ? '' : ing.unit} ${ing.n}`);
      renderBowl();
    }
    function renderBowl() {
      clear(bowlEl.querySelector('.bowl-list')).append(...Object.entries(bowl).filter(([, n]) => n).map(([k, n]) => h('span', `${INGREDIENTS.find((i) => i.id === k).e}×${n}`)));
      if (recipe) renderRecipe();
    }
    function renderRecipe() {
      recipeCard.hidden = false;
      clear(recipeCard).append(
        h('div.rc-head', h('span', recipe.e), h('b', recipe.n), onTap(h('button.icon-btn', { type: 'button', 'aria-label': 'läs upp' }, '🔊'), () => kos.say(`${recipe.n}. Du behöver ${recipeText(recipe)}.`))),
        h('ul', Object.entries(recipe.needs).map(([k, n]) => {
          const ing = INGREDIENTS.find((i) => i.id === k);
          const have = bowl[k] || 0;
          return h('li', { class: have === n ? 'ok' : have > n ? 'over' : '' }, level <= 0 ? h('span', ing.e.repeat(n)) : h('span', `${n} ${ing.unit === 'st' ? '' : ing.unit} ${ing.n} ${ing.e}`), h('small', ` (${have}/${n})`));
        })),
      );
    }
    const recipeText = (r) => Object.entries(r.needs).map(([k, n]) => {
      const ing = INGREDIENTS.find((i) => i.id === k);
      return `${n} ${ing.unit === 'st' ? '' : ing.unit} ${ing.n}`;
    }).join(', ');
    function cook() {
      if (!Object.keys(bowl).length) {
        bubble(bowlEl, 'Skålen är tom!');
        return;
      }
      const r = matchRecipe(bowl);
      Object.entries(bowl).forEach(([k, n]) => {
        const ing = INGREDIENTS.find((i) => i.id === k);
        if (ing.grown) st.pantry[k] = Math.max(0, (st.pantry[k] || 0) - n);
      });
      Object.keys(bowl).forEach((k) => delete bowl[k]);
      renderBowl();
      renderShelf();
      const dish = r ? { e: r.e, n: r.n.toLowerCase(), healthy: r.id !== 'cake' } : { e: '🫕', n: 'mystisk sörja', healthy: true };
      const node = h('div.prop.dish', { style: { left: `${45 + Math.random() * 10}%`, top: '58%' } }, dish.e);
      draggable(node, stage, {
        onDrop: (q) => {
          const ch = hitAt(stage, q, '.char');
          if (ch) {
            node.remove();
            feed(ch, dish);
          }
        },
        onTap: () => bubble(node, dish.n, { speak: true, ms: 1200 }),
      });
      stage.appendChild(node);
      kos.sfx(r ? 'fanfare' : 'whoosh');
      if (r) {
        const first = !st.recipes[r.id];
        st.recipes[r.id] = (st.recipes[r.id] || 0) + 1;
        addToSet(p, 'playRecipes', r.id);
        bubble(bowlEl, `${r.e} ${r.n}! ${r.fact}`, { ms: 5000 });
        if (first) earn(3, `Nytt recept: ${r.n}`);
        kos.confetti(40);
      } else bubble(bowlEl, 'Hihi – det blev en mystisk sörja! Prova ett recept.', { ms: 3000 });
      save();
    }
    clear(actions).append(
      onTap(h('button.btn.btn-ghost', { type: 'button' }, '📖 Receptbok'), () => openBook()),
      onTap(h('button.btn.btn-ghost', { type: 'button' }, '🗑️ Töm skålen'), () => {
        Object.keys(bowl).forEach((k) => delete bowl[k]);
        renderBowl();
      }),
      onTap(h('button.btn.btn-primary', { type: 'button' }, '🔥 Laga!'), cook),
    );
    function openBook() {
      const list = RECIPES.filter((r) => r.minLevel <= level + 1);
      const dlg = h(
        'div.pay',
        h('h3', '📖 Receptbok'),
        h('div.recipe-list', list.map((r) => onTap(h('button.shop-item', { type: 'button' }, h('span.si-e', r.e), h('span.si-n', r.n), st.recipes[r.id] ? h('small.have', '✓ lagat') : null), () => {
          recipe = r;
          dlg.remove();
          renderRecipe();
          kos.say(`${r.n}. Du behöver ${recipeText(r)}.`);
        }))),
        h('div.row-actions', onTap(h('button.btn.btn-ghost', { type: 'button' }, 'Stäng'), () => dlg.remove())),
      );
      el.querySelector('.play').appendChild(dlg);
    }
    renderShelf();
    renderBowl();
    kos.autoSay('Köket! Välj ett recept i receptboken, eller hitta på något eget.');
  }

  /* ======================= Djurkliniken ======================= */
  function vet() {
    const stage = makeStage('vet', BG.vet());
    const rng = createRng(Date.now());
    const patientEl = h('div.patient', { style: { left: '50%', top: '58%' } });
    stage.appendChild(patientEl);
    const status = h('div.vet-status');
    const tray = h('div.tray');
    body.append(stage, status, h('p.tray-title', '🧰 Verktyg och mat – dra till djuret eller tryck'), tray);
    let pt;
    let stepI;
    function next() {
      pt = rng.pick(PATIENTS);
      stepI = 0;
      patientEl.textContent = pt.animal;
      patientEl.className = 'patient arrive';
      const text = `${pt.n[0].toUpperCase() + pt.n.slice(1)} ${pt.problem}. Kan du hjälpa?`;
      clear(status).append(h('b', `${pt.animal} ${text}`), h('div.steps', pt.steps.map((s, i) => h('span.step', { class: i < stepI ? 'done' : '' }, i < stepI ? TOOLS.find((t) => t.id === s).e : '?'))));
      kos.say(text);
    }
    function use(tool) {
      if (!pt) return;
      if (tool.id === pt.steps[stepI]) {
        stepI++;
        kos.sfx('correct');
        patientEl.classList.remove('shake');
        bubble(patientEl, '❤️', { speak: false, ms: 900 });
        clear(status.querySelector('.steps')).append(...pt.steps.map((s, i) => h('span.step', { class: i < stepI ? 'done' : '' }, i < stepI ? TOOLS.find((t) => t.id === s).e : '?')));
        if (stepI >= pt.steps.length) {
          patientEl.classList.add('happy');
          st.patients++;
          addToSet(p, 'playVet', `${pt.animal}${pt.steps.join()}`);
          const coins = st.patients <= 15 ? 2 : 1;
          earn(coins, 'Du hjälpte ett djur!');
          bubble(stage, `🎉 Tack! ${pt.fact}`, { ms: 6000 });
          save();
          pt = null;
          setTimeout(() => alive && next(), 5000);
        }
      } else {
        patientEl.classList.add('shake');
        setTimeout(() => patientEl.classList.remove('shake'), 500);
        kos.sfx('wrong');
        const hint = stepI === 0 && pt.steps.length > 1 ? 'Nej tack! Kolla först om jag har feber.' : 'Nej tack! Prova något annat.';
        bubble(patientEl, hint);
      }
    }
    TOOLS.forEach((t) => {
      const b = h('button.tray-item', { type: 'button', 'aria-label': t.n }, t.e);
      let start;
      b.addEventListener('pointerdown', (e) => (start = { x: e.clientX, y: e.clientY }));
      b.addEventListener('pointerup', (e) => {
        const r = patientEl.getBoundingClientRect();
        const moved = start && Math.hypot(e.clientX - start.x, e.clientY - start.y) > 10;
        if (!moved || (e.clientX > r.left - 40 && e.clientX < r.right + 40 && e.clientY > r.top - 40 && e.clientY < r.bottom + 40)) use(t);
        start = null;
      });
      tray.appendChild(b);
    });
    next();
  }

  /* ======================= Färglabbet ======================= */
  function lab() {
    const stage = makeStage('lab', BG.lab());
    let drops = [];
    const flask = h('div.flask', { style: { left: '50%', top: '56%' } }, h('div.flask-liquid'), h('span.flask-glass', '⚗️'));
    stage.appendChild(flask);
    const pots = h('div.pots');
    BASE_COLORS.forEach((c) => pots.appendChild(onTap(h('button.pot', { type: 'button', style: { '--c': c.hex }, 'aria-label': c.n }, h('i'), h('small', c.n)), () => drop(c), { guardMs: 150 })));
    const board = h('div.color-board');
    const info = h('p.pay-msg');
    body.append(stage, info, pots, h('div.row-actions', onTap(h('button.btn.btn-ghost', { type: 'button' }, '🫗 Töm kolven'), () => {
      drops = [];
      paint();
    })), h('h4', `🎨 Upptäckta färger`), board);
    function paint() {
      const liq = flask.querySelector('.flask-liquid');
      const m = mixColors(drops);
      const single = drops.length && new Set(drops).size === 1 ? BASE_COLORS.find((c) => c.id === drops[0]).hex : null;
      liq.style.background = m ? m.hex : single || (drops.length ? '#a8a29e' : 'transparent');
      liq.style.height = `${Math.min(80, drops.length * 22)}%`;
      info.textContent = drops.length ? `I kolven: ${drops.map((d) => BASE_COLORS.find((c) => c.id === d).n).join(' + ')}${m ? ` = ${m.n}!` : ''}` : 'Tryck på färgburkarna för att droppa färg i kolven.';
      renderBoard();
    }
    function drop(c) {
      if (drops.length >= 4) drops = [];
      drops.push(c.id);
      kos.sfx('pop');
      const m = mixColors(drops);
      paint();
      if (m) {
        const isNew = !st.colors[m.n];
        st.colors[m.n] = m.hex;
        addToSet(p, 'playColors', m.n);
        kos.say(`${drops.map((d) => BASE_COLORS.find((x) => x.id === d).n).join(' och ')} blir ${m.n}!`);
        if (isNew) {
          kos.sfx('fanfare');
          earn(1, `Ny färg: ${m.n}`);
          bubble(flask, `Ny färg: ${m.n}! Den finns nu i Rita.`, { speak: false, ms: 3000 });
        }
        save();
      }
    }
    function renderBoard() {
      clear(board).append(...MIXES.map((m) => h('div.cb-item', { class: st.colors[m.n] ? 'on' : '' }, h('i', { style: { background: st.colors[m.n] ? m.hex : 'transparent' } }), h('small', st.colors[m.n] ? m.n : '?'))));
    }
    paint();
    kos.autoSay('Färglabbet! Röd, gul och blå är grundfärger. Vad händer om du blandar dem?');
  }

  /* ======================= Trädgården ======================= */
  function garden() {
    const stage = makeStage('garden', BG.garden());
    const potEls = [];
    let selected = null;
    st.garden.forEach((pot, i) => {
      const x = 14 + (i % 3) * 36;
      const y = i < 3 ? 56 : 82;
      const el2 = h('button.plant-pot', { type: 'button', style: { left: `${x}%`, top: `${y}%` }, dataset: { i } }, h('span.pp-plant'), h('span.pp-pot', '🪴'), h('small.pp-info'));
      onTap(el2, () => tapPot(i));
      stage.appendChild(el2);
      potEls.push(el2);
    });
    placeChars(stage, 'garden', [{ x: 88, y: 50 }]);
    const tray = h('div.tray');
    const info = h('p.pay-msg');
    body.append(stage, info, h('p.tray-title', '🌱 Välj något och tryck sedan på en kruka'), tray);
    function renderTray() {
      clear(tray);
      const tools = [{ id: 'water', e: '🚿', n: 'vattenkanna' }, ...ITEMS.filter((i) => i.cat === 'frön' && (st.inv[i.id] || 0) > 0)];
      tools.forEach((t) => {
        const b = h('button.tray-item', { type: 'button', class: selected === t.id ? 'sel' : '', 'aria-label': t.n }, t.e, t.id !== 'water' ? h('small.cnt', String(st.inv[t.id])) : null);
        onTap(b, () => {
          selected = selected === t.id ? null : t.id;
          renderTray();
          kos.say(t.n);
        });
        tray.appendChild(b);
      });
      if (tools.length === 1) tray.appendChild(h('span.muted', 'Köp frön på Marknaden!'));
    }
    function renderPots() {
      const now = Date.now();
      st.garden.forEach((pot, i) => {
        if (growTick(pot, now)) {
          kos.sfx('pop');
          save();
        }
        const el2 = potEls[i];
        const plant = pot.plant ? PLANTS[pot.plant] : null;
        el2.querySelector('.pp-plant').textContent = plant ? plant.stages[pot.stage] : '';
        el2.classList.toggle('ripe', !!plant && pot.stage >= 3);
        let txt = '';
        if (!plant) txt = 'tom';
        else if (pot.stage >= 3) txt = 'Skörda!';
        else if (!pot.watered) txt = '💧 behöver vatten';
        else {
          const left = Math.max(0, GROW_MINUTES * 60000 - (now - pot.wateredAt));
          txt = `växer … ${Math.ceil(left / 60000)} min`;
        }
        el2.querySelector('.pp-info').textContent = txt;
      });
    }
    function tapPot(i) {
      const pot = st.garden[i];
      if (pot.plant && pot.stage >= 3) {
        const plant = PLANTS[pot.plant];
        st.pantry[plant.harvest] = (st.pantry[plant.harvest] || 0) + 2;
        const first = addToSet(p, 'playHarvest', pot.plant);
        Object.assign(pot, { plant: null, stage: 0, watered: false, wateredAt: 0 });
        kos.sfx('fanfare');
        bubble(potEls[i], `Skörd! ${plant.fact}`, { ms: 5000 });
        if (first) earn(2, `Första ${plant.n}skörden!`);
        save();
        renderPots();
        return;
      }
      if (!selected) {
        bubble(potEls[i], pot.plant ? (pot.watered ? 'Den växer – vänta lite!' : 'Jag är törstig!') : 'Välj ett frö först!', { ms: 1800 });
        return;
      }
      if (selected === 'water') {
        if (!pot.plant) return bubble(potEls[i], 'Plantera ett frö först.');
        if (pot.watered) return bubble(potEls[i], 'Jag har redan vatten, tack!');
        pot.watered = true;
        pot.wateredAt = Date.now();
        kos.sfx('whoosh');
        potEls[i].classList.add('watered');
        setTimeout(() => potEls[i].classList.remove('watered'), 800);
        info.textContent = `Växter behöver vatten, ljus och näring för att växa. Kom tillbaka om ${GROW_MINUTES} minuter!`;
      } else {
        if (pot.plant) return bubble(potEls[i], 'Här växer redan något.');
        const seed = itemById(selected);
        if (!(st.inv[seed.id] > 0)) return;
        st.inv[seed.id]--;
        Object.assign(pot, { plant: seed.grows, stage: 0, watered: false, wateredAt: 0 });
        kos.sfx('pop');
        info.textContent = `Du planterade ${PLANTS[seed.grows].n}. Vattna nu! Frö → grodd → planta → skörd.`;
        if (!(st.inv[seed.id] > 0)) selected = null;
        renderTray();
      }
      save();
      renderPots();
    }
    renderTray();
    renderPots();
    timers.push(setInterval(() => alive && renderPots(), 5000));
    kos.autoSay('Trädgården! Plantera frön, vattna dem och vänta. Växterna växer på riktigt medan du gör annat.');
  }

  /* ======================= Frisören / garderoben ======================= */
  function wardrobe() {
    let cur = st.chars[0];
    const preview = h('div.wr-preview');
    const people = h('div.chip-row');
    const opts = h('div.wr-opts');
    body.append(h('div.wardrobe', h('div.wr-left', people, preview), opts));
    function render() {
      clear(people);
      st.chars.forEach((c) => people.appendChild(onTap(h('button.wr-person', { type: 'button', class: c === cur ? 'on' : '', html: charSvg(c) }), () => {
        cur = c;
        render();
      })));
      if (st.chars.length < 8) people.appendChild(onTap(h('button.wr-person.add', { type: 'button' }, '＋'), () => {
        cur = newCharacter();
        st.chars.push(cur);
        save();
        render();
      }));
      preview.innerHTML = charSvg(cur, 'happy');
      const row = (label, items) => h('div.wr-row', h('span.set-label', label), h('div.pick-row', items));
      const swatch = (field, list) => list.map((c) => onTap(h('button.pick.pick-col', { type: 'button', class: cur[field] === c ? 'on' : '', style: { background: c }, 'aria-label': field }), () => set(field, c), { guardMs: 60 }));
      const nameIn = h('input.text-input#char-name', { type: 'text', value: cur.name, maxlength: '12', 'aria-label': 'namn' });
      nameIn.addEventListener('change', () => set('name', nameIn.value.trim() || cur.name, false));
      const clothes = ITEMS.filter((i) => i.slot && (st.inv[i.id] || 0) > 0);
      clear(opts).append(
        row('Namn', [nameIn]),
        row('Hud', swatch('skin', SKIN)),
        row('Frisyr', HAIR_STYLES.map((s) => onTap(h('button.chip-btn', { type: 'button', class: cur.hair === s ? 'on' : '' }, s), () => {
          set('hair', s);
          kos.sfx('pop');
        }))),
        row('Hårfärg', swatch('hairColor', HAIR_COLORS)),
        row('Tröja', swatch('shirt', CLOTH_COLORS)),
        row('Byxor', swatch('pants', CLOTH_COLORS)),
        row('Kläder', clothes.length ? clothes.map((it) => onTap(h('button.pick', { type: 'button', class: cur.wear[it.slot] === it.id ? 'on' : '', 'aria-label': it.n }, it.e), () => {
          cur.wear[it.slot] = cur.wear[it.slot] === it.id ? undefined : it.id;
          kos.sfx('pop');
          save();
          render();
        })) : [h('span.muted', 'Köp kläder och hattar på Marknaden!')]),
        h('div.row-actions.left', onTap(h('button.btn.btn-ghost', { type: 'button' }, '🎲 Slumpa'), () => {
          const n = newCharacter();
          Object.assign(cur, { skin: n.skin, hair: n.hair, hairColor: n.hairColor, shirt: n.shirt, pants: n.pants });
          save();
          render();
        }), st.chars.length > 1 ? onTap(h('button.btn.btn-ghost', { type: 'button' }, '🗑️ Ta bort'), () => {
          st.chars.splice(st.chars.indexOf(cur), 1);
          cur = st.chars[0];
          save();
          render();
        }) : null),
      );
    }
    function set(field, v, rerender = true) {
      cur[field] = v;
      save();
      if (rerender) render();
    }
    render();
    kos.autoSay('Frisören! Skapa figurer och klä ut dem.');
  }

  showTown();
  return () => {
    alive = false;
    clearTimers();
    clearTimeout(saveT);
    saveJSON(key, st);
  };
}
