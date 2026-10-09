// Lekstaden – öppen lekvärld med inbyggt lärande.
import { h, clear, onTap } from '../dom.js';
import { loadJSON, saveJSON } from '../../core/storage.js';
import { spendCoins, addCoins, addToSet, dateKey } from '../../core/model.js';
import {
  SCENES, ITEMS, itemById, SHOP_CATS, shopItems, withArticle, payCoins, changeAllowed, payState, changeOptions, goalProgress, priceQuiz,
  MONEY, fewestCoins, PLANTS, GROW_MINUTES, growTick, capEarn, pantryInfo,
  INGREDIENTS, RECIPES, matchRecipe, bookRecipes, BASE_COLORS, MIXES, mixColors, TOOLS, PATIENTS, SECRETS, SECRET_TRIGGERS,
  FARM_ANIMALS, FARM_FOODS, FARM_PRODUCTS, farmReaction, productReady, farmQuestion, BEACH_ITEMS, inSea,
  SCHOOL_SUBJECTS, schoolTask, SCHOOL_PER_COIN, BOOKS, booksForLevel, BOOK_COINS,
  SKIN, HAIR_COLORS, HAIR_STYLES, CLOTH_COLORS, newCharacter, normalizePlay,
} from '../../apps/play.js';
import { timeToSwedish } from '../visuals.js';
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
  return `<svg class="char-svg" viewBox="0 0 100 160" aria-hidden="true">${em(itemById(w.back)?.e, 50, 92, 64)}${behind}
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
  school: () => `<svg viewBox="0 0 400 300" preserveAspectRatio="none"><rect width="400" height="300" fill="#fef3c7"/><rect y="215" width="400" height="85" fill="#d6a76c"/>
    <rect x="70" y="20" width="260" height="150" rx="8" fill="#14532d" stroke="#a16207" stroke-width="10"/><rect x="150" y="170" width="100" height="8" fill="#a16207"/><rect x="160" y="166" width="20" height="5" rx="2" fill="#fff"/>
    <circle cx="370" cy="40" r="20" fill="#fff" stroke="#334155" stroke-width="4"/><line x1="370" y1="40" x2="370" y2="28" stroke="#334155" stroke-width="3"/><line x1="370" y1="40" x2="379" y2="44" stroke="#334155" stroke-width="3"/>
    ${[40, 160, 280].map((x) => `<rect x="${x}" y="236" width="80" height="12" rx="3" fill="#92400e"/><rect x="${x + 8}" y="248" width="6" height="40" fill="#78350f"/><rect x="${x + 66}" y="248" width="6" height="40" fill="#78350f"/>`).join('')}</svg>`,
  library: () => `<svg viewBox="0 0 400 300" preserveAspectRatio="none"><rect width="400" height="300" fill="#ede9fe"/><rect y="225" width="400" height="75" fill="#a78bfa" opacity=".5"/>
    ${[0, 1, 2].map((r) => `<rect x="20" y="${30 + r * 62}" width="360" height="8" fill="#7c2d12"/>${Array.from({ length: 22 }, (_, i) => `<rect x="${26 + i * 16}" y="${30 + r * 62 - 40 + ((i * 7 + r * 3) % 9)}" width="13" height="${40 - ((i * 7 + r * 3) % 9)}" rx="2" fill="${['#ef4444', '#3b82f6', '#22c55e', '#facc15', '#a855f7', '#f97316'][(i + r) % 6]}"/>`).join('')}`).join('')}
    <ellipse cx="200" cy="270" rx="130" ry="20" fill="#c4b5fd"/></svg>`,
  farm: () => `<svg viewBox="0 0 400 300" preserveAspectRatio="none"><rect width="400" height="300" fill="#bfdbfe"/><circle cx="60" cy="40" r="22" fill="#fde047"/>
    <path d="M0 120 Q120 90 240 118 T400 110 V300 H0Z" fill="#86efac"/><rect y="150" width="400" height="150" fill="#4ade80"/>
    <rect x="290" y="50" width="90" height="90" fill="#dc2626"/><path d="M280 55 L335 15 L390 55Z" fill="#991b1b"/><rect x="318" y="90" width="34" height="50" fill="#fef3c7"/><path d="M318 90 L352 140 M352 90 L318 140" stroke="#dc2626" stroke-width="4"/>
    ${Array.from({ length: 9 }, (_, i) => `<rect x="${8 + i * 30}" y="128" width="7" height="32" fill="#fef3c7"/>`).join('')}<rect x="4" y="136" width="270" height="6" fill="#fef3c7"/><rect x="4" y="150" width="270" height="6" fill="#fef3c7"/>
    <ellipse cx="200" cy="262" rx="60" ry="14" fill="#7c4a1e" opacity=".55"/></svg>`,
  beach: () => `<svg viewBox="0 0 400 300" preserveAspectRatio="none"><rect width="400" height="130" fill="#7dd3fc"/><circle cx="320" cy="40" r="24" fill="#fde047"/><ellipse cx="90" cy="45" rx="30" ry="10" fill="#fff"/>
    <rect y="120" width="400" height="180" fill="#fde68a"/>
    <path d="M160 126 L400 126 L400 300 L200 300Z" fill="#0ea5e9"/><path d="M200 300 L400 300 L400 220 Q300 230 240 300Z" fill="#0369a1" opacity=".55"/>
    <path d="M160 126 Q170 140 166 150 Q178 170 174 186 Q186 210 182 230 Q196 260 200 300" stroke="#fff" stroke-width="4" fill="none" opacity=".7"/>
    ${[0, 1, 2, 3].map((i) => `<path d="M${230 + i * 40} ${150 + i * 6} q10 -6 20 0" stroke="#e0f2fe" stroke-width="3" fill="none"/>`).join('')}</svg>`,
  wardrobe: () => `<svg viewBox="0 0 400 300" preserveAspectRatio="none"><rect width="400" height="300" fill="#fce7f3"/><rect y="230" width="400" height="70" fill="#f9a8d4"/><rect x="290" y="30" width="90" height="140" rx="10" fill="#fff" stroke="#f472b6" stroke-width="5"/><ellipse cx="335" cy="100" rx="30" ry="50" fill="#e0f2fe"/></svg>`,
};

const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1);

/* ---------------- Vyn ---------------- */
export function playView(el, { kos }) {
  const p = kos.profile;
  const key = `play.${p.id}`;
  const st = normalizePlay(loadJSON(key, {}));
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
  const capWarned = new Set();
  /** Ge mynt. Med capKey räknas de mot dagens tak för den sortens lek. Returnerar antal givna mynt. */
  function earn(n, why, capKey) {
    if (capKey) {
      n = capEarn(st, capKey, n, dateKey());
      save();
      if (!n) {
        if (!capWarned.has(capKey)) {
          capWarned.add(capKey);
          kos.toast('Dagens mynt här är slut. Lär dig något i de andra apparna för fler mynt!', { icon: '🪙', ms: 3200 });
        }
        return 0;
      }
    }
    addCoins(p, n);
    kos.save();
    kos.sfx('star');
    kos.toast(`+${n} 🪙 ${why}`, { icon: '🪙', ms: 2200 });
    refreshWallet();
    return n;
  }
  function refreshWallet() {
    const w = bar.querySelector('.wallet');
    if (w) clear(w).append(h('span.coin', '🪙'), h('b', String(p.coins || 0)));
  }
  /** Sparmålet som en liten banderoll (eller null). */
  function goalBanner() {
    const it = st.goal && itemById(st.goal);
    if (!it) return null;
    const g = goalProgress(p.coins || 0, it.price);
    const text = g.done ? `Du har råd med ${withArticle(it)} nu! Gå till Marknaden.` : `Sparmål: ${withArticle(it)}. Du har ${g.have} av ${it.price}. Det fattas ${g.left}.`;
    const b = h('button.goal-banner', { type: 'button', class: g.done ? 'done' : '' }, h('span.gb-e', it.e), h('span.gb-text', h('b', g.done ? '🎉 Klart!' : '🎯 Sparmål'), h('span.gb-bar', h('i', { style: { width: `${g.pct}%` } })), h('small', `${g.have} / ${it.price} 🪙`)));
    return onTap(b, () => kos.say(text));
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
      goalBanner() || h('span'),
      map,
      h('div.town-info', h('span', `🔍 Hemligheter: ${found}`), h('span', `🧪 Färger: ${Object.keys(st.colors).length}/${MIXES.length}`), h('span', `🍳 Recept: ${Object.keys(st.recipes).length}/${RECIPES.length}`), h('span', `📚 Böcker: ${Object.keys(st.books).length}/${BOOKS.length}`), h('span', `🏫 Uppgifter: ${st.school.solved}`), h('span', `🏥 Patienter: ${st.patients}`)),
      h('p.muted.town-tip', '🪙 Mynt tjänar du genom att lära dig i de andra apparna – varje stjärna ger ett mynt.'),
    );
    kos.autoSay('Välkommen till Lekstaden! Vart vill du gå?');
  }

  function showScene(id) {
    clearTimers();
    const s = SCENES.find((x) => x.id === id);
    topbar(`${s.icon} ${s.name}`);
    clear(body);
    ({ house, market, kitchen, school, library, farm, beach, vet, lab, garden, wardrobe })[id]();
  }

  /* ----- Scen-motor: fritt placerbara saker ----- */
  function makeStage(sceneId, bgSvg) {
    const stage = h('div.stage', { dataset: { scene: sceneId } }, h('div.stage-bg', { html: bgSvg }));
    const ro = new ResizeObserver(() => stage.style.setProperty('--u', `${stage.clientWidth / 100}px`));
    ro.observe(stage);
    // hemligheter
    (SECRETS[sceneId] || []).forEach((sec, i) => {
      const sid = `${sceneId}-${i}`;
      const cls = [st.secrets[sid] ? 'found' : '', sec.when ? `needs-${sec.when}` : ''].filter(Boolean).join(' ');
      const spot = h('button.secret', { type: 'button', style: { left: `${sec.x}%`, top: `${sec.y}%` }, 'aria-label': 'hemlighet', class: cls }, st.secrets[sid] ? sec.e : '');
      onTap(spot, () => {
        if (st.secrets[sid]) {
          bubble(stage, sec.e, { speak: false, ms: 900 });
          return;
        }
        if (sec.when === 'dark' && !stage.classList.contains('dark')) {
          bubble(stage, `🤫 ${SECRET_TRIGGERS.dark.hint}`, { ms: 1600 });
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
          // lägg sig i sängen, bada, sitta eller åka rutschkana?
          const spot = hitAt(stage, q, '.prop[data-rest]');
          const rest = spot?.dataset.rest;
          node.classList.remove('sliding');
          if (rest === 'sleep') {
            node.innerHTML = charSvg(c, 'sleep');
            bubble(node, 'Zzz … God natt!', { ms: 1800 });
          } else if (rest === 'bath') {
            node.innerHTML = charSvg(c, 'yum');
            kos.sfx('whoosh');
            bubble(node, 'Plask! Vad skönt med ett bad.', { ms: 1800 });
          } else if (rest === 'slide') {
            node.innerHTML = charSvg(c, 'yum');
            node.classList.add('sliding');
            kos.sfx('whoosh');
            bubble(node, 'Wiii!', { ms: 1400 });
            setTimeout(() => node.classList.remove('sliding'), 1100);
          } else if (rest === 'sit') {
            node.innerHTML = charSvg(c);
            bubble(node, 'Skönt att sitta en stund.', { ms: 1600 });
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
      const data = { item: pl.item, uid: pl.uid };
      if (it.rest) data.rest = it.rest;
      const node = h('div.prop', { style: { left: `${pl.x}%`, top: `${pl.y}%` }, dataset: data, class: it.dream ? 'dream' : '' }, it.e);
      draggable(node, stage, {
        onDrop: (q) => {
          const ch = it.food && hitAt(stage, q, '.char');
          if (ch) feed(ch, { n: it.n, healthy: false });
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
      case 'mirror':
        bubble(node, '🪞 I en spegel blir allt omvänt – höger ser ut som vänster!', { ms: 4000 });
        break;
      case 'clock': {
        const d = new Date();
        let hh = d.getHours();
        let mm = Math.round(d.getMinutes() / 5) * 5;
        if (mm === 60) {
          mm = 0;
          hh++;
        }
        const exact = mm === d.getMinutes();
        bubble(node, `🕰️ Klockan är ${exact ? '' : 'ungefär '}${timeToSwedish(hh, mm).replace(/^klockan /, '')}.`, { ms: 4000 });
        break;
      }
      case 'drum':
        try {
          sfx.boom();
        } catch {}
        node.classList.add('jump');
        setTimeout(() => node.classList.remove('jump'), 600);
        bubble(node, 'Bom bom!', { speak: false, ms: 900 });
        break;
      case 'spin':
        node.classList.add('spin');
        kos.sfx('fanfare');
        setTimeout(() => node.classList.remove('spin'), 1300);
        bubble(node, 'Snurr snurr!', { speak: false, ms: 1200 });
        break;
      case 'castle':
        bubble(node, '🏰 Välkommen till slottet! Riktiga slott byggdes med tjocka stenmurar för att vara starka.', { ms: 5000 });
        break;
      case 'rocket': {
        node.classList.add('launch');
        kos.sfx('whoosh');
        setTimeout(() => node.classList.remove('launch'), 1800);
        const pl = rng.pick(PLANETS);
        bubble(stage, `🚀 Vi flyger till ${pl.name}! ${pl.facts[0]}`, { ms: 6000 });
        break;
      }
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
  /** Pris som prickar (nivå 0): tiotal som staplar, ental som prickar. */
  function priceDots(price) {
    const tens = Math.floor(price / 10);
    const ones = price % 10;
    return h('div.price-dots', [...Array.from({ length: tens }, () => h('i.ten')), ...Array.from({ length: ones }, () => h('i'))]);
  }
  function market() {
    let cat = SHOP_CATS[0].id;
    const wrap = h('div.market');
    body.append(h('div.stage-strip', { html: BG.market() }), wrap);
    function render() {
      clear(wrap);
      wrap.append(
        goalBanner() || h('span'),
        h('div.chip-row', SHOP_CATS.map((c) => onTap(h('button.chip-btn', { type: 'button', class: c.id === cat ? 'on' : '' }, `${c.e} ${c.n}`), () => {
          cat = c.id;
          render();
        }))),
        h('div.row-actions.left', onTap(h('button.btn.btn-ghost.big-touch', { type: 'button' }, '🔎 Prisjakten'), () => quiz())),
      );
      if (cat === 'dröm') wrap.appendChild(h('p.dream-tip', '✨ Drömköp är dyra. Välj ett sparmål och lär dig i apparna – varje stjärna ger ett mynt!'));
      const grid = h('div.shop-grid');
      shopItems(cat).forEach((it) => {
        const have = st.inv[it.id] || 0;
        const card = h('button.shop-item', { type: 'button', class: [(p.coins || 0) < it.price ? 'poor' : '', it.dream ? 'dream' : '', st.goal === it.id ? 'goal' : ''].filter(Boolean).join(' ') }, h('span.si-e', it.e), h('span.si-n', it.n), h('span.price', `${it.price} 🪙`), have ? h('small.have', `Har ${have}`) : null, st.goal === it.id ? h('small.goal-tag', '🎯 Sparmål') : null);
        onTap(card, () => buy(it));
        grid.appendChild(card);
      });
      wrap.appendChild(grid);
      const harvest = Object.entries(st.pantry).filter(([k, n]) => n > 0 && pantryInfo(k));
      if (harvest.length) {
        wrap.append(h('h4', '🧺 Sälj från trädgården och bondgården (1 🪙 st)'), h('div.chip-row', harvest.map(([k, n]) => {
          const info = pantryInfo(k);
          return onTap(h('button.chip-btn', { type: 'button' }, `${info.e} ${info.n} × ${n}`), () => {
            if (!earn(1, `Sålde ${info.n}`, 'sell')) {
              kos.say('Marknaden har köpt nog för i dag. Kom tillbaka i morgon!');
              return;
            }
            st.pantry[k]--;
            save();
            render();
          });
        })));
      }
    }
    function buy(it) {
      if ((p.coins || 0) < it.price) {
        notEnough(it);
        return;
      }
      pay(it, () => {
        st.inv[it.id] = (st.inv[it.id] || 0) + 1;
        st.bought++;
        if (st.goal === it.id) st.goal = null;
        addToSet(p, 'playBought', it.id);
        if (it.dream) addToSet(p, 'playDreams', it.id);
        save();
        kos.sfx('fanfare');
        kos.confetti(it.dream ? 120 : 50);
        kos.say(`Tack för köpet! Du köpte ${withArticle(it)}.`);
        render();
      });
    }
    function notEnough(it) {
      const g = goalProgress(p.coins || 0, it.price);
      const dlg = h(
        'div.pay',
        h('div.pay-head', h('span.si-e', it.e), h('div', h('b', it.n), h('div.price.big', `${it.price} 🪙`))),
        h('p.big-text', `Du har ${g.have} mynt. Det fattas ${g.left}.`),
        h('div.goal-bar', h('i', { style: { width: `${g.pct}%` } })),
        h('p.muted', 'Mynt tjänar du genom att lära dig i apparna – varje stjärna ger ett mynt.'),
        h('div.row-actions', onTap(h('button.btn.btn-ghost', { type: 'button' }, 'Stäng'), () => dlg.remove()), st.goal === it.id ? null : onTap(h('button.btn.btn-primary', { type: 'button' }, '🎯 Spara till den!'), () => {
          st.goal = it.id;
          save();
          kos.sfx('pop');
          kos.say(`Nu sparar du till ${withArticle(it)}. Det fattas ${g.left} mynt.`);
          dlg.remove();
          render();
        })),
      );
      el.querySelector('.play').appendChild(dlg);
      kos.say(`${cap(withArticle(it))} kostar ${it.price} mynt. Du har ${g.have}. Det fattas ${g.left}.`);
    }
    function pay(it, done) {
      const coins = payCoins(level, it.price);
      const allowChange = changeAllowed(level);
      let put = [];
      const sumEl = h('div.pay-sum');
      const counter = h('div.pay-counter');
      const msg = h('p.pay-msg');
      const payBtn = h('button.btn.btn-primary.big-touch', { type: 'button', disabled: true }, 'Betala ✓');
      const state = () => payState(put, it.price, { allowChange });
      const render2 = () => {
        const s = state();
        clear(counter).append(...put.map((c, i) => onTap(h('button.coin-chip', { type: 'button', class: `v${c}${c >= 20 ? ' note' : ''}` }, String(c)), () => {
          put.splice(i, 1);
          render2();
        })));
        sumEl.textContent = `${s.sum} av ${it.price} 🪙`;
        payBtn.disabled = !(s.status === 'exact' || s.status === 'change');
        msg.textContent = {
          short: `Det fattas ${s.missing}.`,
          exact: 'Precis rätt!',
          change: `Du lägger ${s.sum}. Då får du växel tillbaka!`,
          over: allowChange ? 'Ett mynt är onödigt. Ta bort det!' : 'Det blev för mycket! Ta bort ett mynt.',
        }[s.status];
        msg.className = `pay-msg ${s.status === 'over' ? 'try' : s.status === 'short' ? '' : 'ok'}`;
      };
      const dlg = h(
        'div.pay',
        h('div.pay-head', h('span.si-e', it.e), h('div', h('b', `${it.n}`), h('div.price.big', `${it.price} 🪙`))),
        level === 0 ? priceDots(it.price) : null,
        h('p', level === 0 ? (it.price > 10 ? 'Lägg en tia för varje stapel och en etta för varje prick!' : 'Lägg ett mynt för varje prick!') : allowChange ? 'Betala exakt – eller med en större sedel och få växel tillbaka.' : 'Lägg mynt på disken tills det blir rätt summa.'),
        counter,
        sumEl,
        msg,
        h('div.coin-row', coins.map((c) => onTap(h('button.coin-chip.big', { type: 'button', class: `v${c}${c >= 20 ? ' note' : ''}` }, String(c)), () => {
          const s = state();
          if (allowChange && s.sum >= it.price) {
            msg.textContent = 'Det räcker redan!';
            return;
          }
          if (allowChange && s.sum + c > Math.max(p.coins || 0, it.price)) {
            msg.textContent = 'Så mycket pengar har du inte. Prova mindre mynt!';
            return;
          }
          if (s.sum >= it.price + 10) return;
          put.push(c);
          kos.sfx('click');
          render2();
        }, { guardMs: 80 }))),
        h('div.row-actions', onTap(h('button.btn.btn-ghost', { type: 'button' }, 'Avbryt'), () => dlg.remove()), payBtn),
      );
      onTap(payBtn, () => {
        const s = state();
        if (s.status === 'change') return askChange(s);
        if (s.status !== 'exact' || !spendCoins(p, it.price)) return;
        const best = fewestCoins(it.price, coins);
        const efficient = best && put.length === best.length && level >= 2;
        kos.save();
        dlg.remove();
        done();
        if (efficient) earn(1, 'Smart! Så få mynt som möjligt.', 'change');
        else refreshWallet();
      });
      function askChange(s) {
        const rng = createRng(Date.now());
        let tries = 0;
        clear(dlg).append(
          h('div.pay-head', h('span.si-e', it.e), h('div', h('b', it.n), h('div.price.big', `${it.price} 🪙`))),
          h('p.big-text', `Du betalar ${s.sum}. ${cap(it.d)} kostar ${it.price}.`),
          h('p.big-text', h('b', 'Hur mycket får du tillbaka?')),
          h('div.answer-row', changeOptions(s.change, rng).map((v) => {
            const b = h('button.answer-btn', { type: 'button' }, String(v));
            return onTap(b, () => {
              if (v !== s.change) {
                tries++;
                b.disabled = true;
                b.classList.add('wrong');
                kos.sfx('wrong');
                kos.say(`Inte riktigt. Räkna upp från ${it.price} till ${s.sum}.`);
                return;
              }
              if (!spendCoins(p, it.price)) return;
              kos.save();
              kos.sfx('correct');
              const back = fewestCoins(s.change, MONEY) || [];
              clear(dlg).append(
                h('p.big-text', h('b', `Rätt! ${s.sum} − ${it.price} = ${s.change}.`)),
                h('p', 'Här är din växel:'),
                h('div.coin-row', back.map((c) => h('span.coin-chip', { class: `v${c}${c >= 20 ? ' note' : ''}` }, String(c)))),
                h('div.row-actions', onTap(h('button.btn.btn-primary.big-touch', { type: 'button' }, 'Tack! ✓'), () => {
                  dlg.remove();
                  done();
                  if (!tries) earn(1, 'Rätt växel!', 'change');
                  else refreshWallet();
                })),
              );
              kos.say(`Rätt! Du får ${s.change} tillbaka.`);
            });
          })),
          h('div.row-actions', onTap(h('button.btn.btn-ghost', { type: 'button' }, 'Avbryt'), () => dlg.remove())),
        );
        kos.say(`Du betalar ${s.sum}. Det kostar ${it.price}. Hur mycket får du tillbaka?`);
      }
      el.querySelector('.play').appendChild(dlg);
      render2();
      kos.say(`${cap(withArticle(it))} kostar ${it.price} mynt. ${level === 0 ? 'Lägg ett mynt för varje prick.' : 'Lägg rätt summa på disken.'}`);
    }
    /** Prisjakten – jämför priser. */
    function quiz() {
      const rng = createRng(Date.now());
      const dlg = h('div.pay');
      el.querySelector('.play').appendChild(dlg);
      function next() {
        const q = priceQuiz(level, rng);
        let tries = 0;
        const answered = (ok, b) => {
          if (!ok) {
            tries++;
            b.disabled = true;
            b.classList.add('wrong');
            kos.sfx('wrong');
            kos.say(q.ask === 'cheap' ? 'Inte den. Titta på priserna – vilket tal är minst?' : q.ask === 'dear' ? 'Inte den. Vilket tal är störst?' : 'Inte riktigt. Prova igen!');
            return;
          }
          kos.sfx('correct');
          st.quiz.right++;
          addToSet(p, 'playQuiz', `${q.ask}`);
          save();
          if (!tries) earn(1, 'Prisjägare!', 'quiz');
          clear(feedback).append(h('p.pay-msg.ok', q.explain), onTap(h('button.btn.btn-primary.big-touch', { type: 'button' }, 'Nästa ➜'), next));
          kos.say(q.explain);
        };
        const feedback = h('div');
        const itemCard = (it, asButton) => {
          const inner = [h('span.si-e', it.e), h('span.si-n', it.n), level === 0 ? priceDots(it.price) : null, h('span.price', `${it.price} 🪙`)];
          if (!asButton) return h('div.shop-item.static', inner);
          const b = h('button.shop-item', { type: 'button' }, inner);
          return onTap(b, () => answered(it.id === q.answer, b));
        };
        clear(dlg).append(
          h('h3', '🔎 Prisjakten'),
          h('p.big-text', h('b', q.text)),
          h('div.shop-grid', q.items.map((it) => itemCard(it, q.kind === 'pick'))),
          q.kind === 'num' ? h('div.answer-row', q.options.map((v) => {
            const b = h('button.answer-btn', { type: 'button' }, String(v));
            return onTap(b, () => answered(v === q.answer, b));
          })) : null,
          feedback,
          h('div.row-actions', onTap(h('button.btn.btn-ghost', { type: 'button' }, 'Stäng'), () => dlg.remove())),
        );
        kos.say(q.say);
      }
      next();
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
      const dish = r ? { e: r.e, n: r.n.toLowerCase(), healthy: !r.sweet } : { e: '🫕', n: 'mystisk sörja', healthy: true };
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
        bubble(bowlEl, `${r.secret && first ? '🤫 Hemligt recept! ' : ''}${r.e} ${r.n}! ${r.fact}`, { ms: 5000 });
        if (first) earn(r.secret ? 4 : 3, `${r.secret ? 'Hemligt' : 'Nytt'} recept: ${r.n}`);
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
      const list = bookRecipes(level);
      const secretsFound = RECIPES.filter((r) => r.secret && st.recipes[r.id]);
      const secretsLeft = RECIPES.filter((r) => r.secret).length - secretsFound.length;
      const dlg = h(
        'div.pay',
        h('h3', '📖 Receptbok'),
        h('div.recipe-list', list.map((r) => onTap(h('button.shop-item', { type: 'button' }, h('span.si-e', r.e), h('span.si-n', r.n), st.recipes[r.id] ? h('small.have', '✓ lagat') : null), () => {
          recipe = r;
          dlg.remove();
          renderRecipe();
          kos.say(`${r.n}. Du behöver ${recipeText(r)}.`);
        }))),
        h('p.muted', secretsLeft ? `🤫 Det finns ${secretsLeft} hemliga recept till. Experimentera i skålen!` : '🤫 Du har hittat alla hemliga recept!'),
        secretsFound.length ? h('div.chip-row', secretsFound.map((r) => h('span.chip-btn.static.done', `${r.e} ${r.n}`))) : null,
        h('div.row-actions', onTap(h('button.btn.btn-ghost', { type: 'button' }, 'Stäng'), () => dlg.remove())),
      );
      el.querySelector('.play').appendChild(dlg);
    }
    renderShelf();
    renderBowl();
    kos.autoSay('Köket! Välj ett recept i receptboken, eller hitta på något eget.');
  }

  /** Dra en kopia från en bricka in i scenen. Utan rörelse räknas det som ett tryck. */
  function ghostDrag(e, stage, content, { onDrop, onTap: tap }) {
    e.preventDefault();
    const start = { x: e.clientX, y: e.clientY };
    let ghost = null;
    const move = (ev) => {
      if (!ghost && Math.hypot(ev.clientX - start.x, ev.clientY - start.y) < 10) return;
      if (!ghost) {
        ghost = h('div.prop.lift.ghost', content);
        stage.appendChild(ghost);
      }
      const q = pct(stage, ev);
      ghost.style.left = `${q.x}%`;
      ghost.style.top = `${q.y}%`;
    };
    const up = (ev) => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      if (!ghost) return tap?.();
      ghost.remove();
      const r = stage.getBoundingClientRect();
      if (ev.clientY > r.bottom || ev.clientY < r.top || ev.clientX < r.left || ev.clientX > r.right) return;
      onDrop?.(pct(stage, ev));
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  }

  /* ---------- Små bilder för skoltavlan ---------- */
  function shapeSvg(id, size = 70) {
    const c = '#fde68a';
    const sw = 'stroke="#fff" stroke-width="4"';
    const poly = (n) => Array.from({ length: n }, (_, i) => {
      const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
      return `${50 + 40 * Math.cos(a)},${52 + 40 * Math.sin(a)}`;
    }).join(' ');
    const inner = {
      circle: `<circle cx="50" cy="50" r="40" fill="${c}" ${sw}/>`,
      triangle: `<polygon points="50,8 92,90 8,90" fill="${c}" ${sw}/>`,
      square: `<rect x="12" y="12" width="76" height="76" fill="${c}" ${sw}/>`,
      rect: `<rect x="4" y="26" width="92" height="48" fill="${c}" ${sw}/>`,
      pentagon: `<polygon points="${poly(5)}" fill="${c}" ${sw}/>`,
      hexagon: `<polygon points="${poly(6)}" fill="${c}" ${sw}/>`,
    }[id] || '';
    return `<svg viewBox="0 0 100 100" width="${size}" height="${size}" aria-hidden="true">${inner}</svg>`;
  }
  function rulerSvg(len) {
    const u = 30;
    const ticks = Array.from({ length: 13 }, (_, i) => `<line x1="${10 + i * u}" y1="70" x2="${10 + i * u}" y2="${i % 5 === 0 ? 50 : 58}" stroke="#1f2937" stroke-width="2"/><text x="${10 + i * u}" y="90" font-size="14" text-anchor="middle" fill="#1f2937">${i}</text>`).join('');
    return `<svg viewBox="0 0 390 100" class="ruler" aria-hidden="true"><rect x="10" y="12" width="${len * u - 12}" height="22" rx="4" fill="#facc15"/><polygon points="${10 + len * u - 12},12 ${10 + len * u},23 ${10 + len * u - 12},34" fill="#f5c6a0"/><rect x="10" y="12" width="14" height="22" fill="#f472b6"/><rect x="2" y="44" width="386" height="54" rx="6" fill="#fef3c7" stroke="#a16207" stroke-width="2"/>${ticks}</svg>`;
  }

  /* ======================= Skolan ======================= */
  function school() {
    const stage = makeStage('school', BG.school());
    const board = h('div.board');
    stage.appendChild(board);
    placeChars(stage, 'school', [{ x: 20, y: 74 }, { x: 50, y: 74 }, { x: 80, y: 74 }]);
    const bell = h('div.prop.bell', { style: { left: '92%', top: '30%' } }, '🔔');
    draggable(bell, stage, {
      onTap: () => {
        kos.sfx('fanfare');
        stage.querySelectorAll('.char').forEach((n, i) => setTimeout(() => {
          n.classList.add('hop');
          setTimeout(() => n.classList.remove('hop'), 600);
        }, i * 120));
        bubble(stage, '🔔 Rast! Alla ut och leka!', { ms: 2000 });
      },
    });
    stage.appendChild(bell);
    let subject = 'mix';
    const chips = h('div.chip-row');
    const opts = h('div.answer-row.school-opts');
    const stars = h('div.chalk-stars');
    body.append(chips, stage, opts, stars);
    let task;
    let tries = 0;
    function renderChips() {
      clear(chips).append(...[{ id: 'mix', n: 'Blandat', e: '🎲' }, ...SCHOOL_SUBJECTS].map((sb) => onTap(h('button.chip-btn', { type: 'button', class: subject === sb.id ? 'on' : '' }, `${sb.e} ${sb.n}`), () => {
        subject = sb.id;
        renderChips();
        next();
      })));
    }
    function renderStars() {
      const n = st.school.streak % SCHOOL_PER_COIN;
      clear(stars).append(h('span', 'Nästa mynt: '), ...Array.from({ length: SCHOOL_PER_COIN }, (_, i) => h('span.cs', { class: i < n ? 'on' : '' }, i < n ? '⭐' : '☆')), h('small.muted', ` Lösta uppgifter: ${st.school.solved}`));
    }
    function showVisual(show) {
      if (!show) return null;
      if (typeof show === 'string') return h('div.board-show', show);
      if (show.shape) return h('div.board-show', { html: shapeSvg(show.shape, 110) });
      if (show.ruler) return h('div.board-show.wide', { html: rulerSvg(show.ruler) });
      return null;
    }
    function optContent(o) {
      if (o.shape) return h('span', { html: shapeSvg(o.shape) });
      if (o.bar) return h('span.stick', { style: { width: `${o.bar * 10}%` } });
      if (o.pic) return h('span.pic', o.label);
      return h('span', o.label);
    }
    function next() {
      const rng = createRng(Date.now());
      task = schoolTask(level, rng, subject === 'mix' ? undefined : subject);
      tries = 0;
      clear(board).append(h('div.board-text', task.text), showVisual(task.show) || h('span'));
      clear(opts).append(...task.options.map((o) => {
        const b = h('button.answer-btn', { type: 'button', class: o.bar ? 'bar-btn' : o.pic || o.shape ? 'pic-btn' : '' }, optContent(o));
        return onTap(b, () => answer(o, b));
      }));
      kos.say(task.say);
    }
    function answer(o, b) {
      if (o.value !== task.answer) {
        tries++;
        b.disabled = true;
        b.classList.add('wrong');
        kos.sfx('wrong');
        bubble(board, 'Nästan! Prova igen.', { ms: 1400 });
        return;
      }
      kos.sfx('correct');
      b.classList.add('right');
      st.school.solved++;
      addToSet(p, 'playSchool', task.subject);
      if (!tries) {
        st.school.streak++;
        if (st.school.streak % SCHOOL_PER_COIN === 0) earn(1, 'Duktigt i skolan!', 'school');
      }
      save();
      renderStars();
      opts.querySelectorAll('button').forEach((x) => (x.disabled = true));
      clear(board).append(h('div.board-text.small', `✔ ${task.explain}`));
      kos.say(task.explain);
      setTimeout(() => alive && board.isConnected && next(), 3200);
    }
    renderChips();
    renderStars();
    next();
  }

  /* ======================= Biblioteket ======================= */
  function library() {
    const stage = makeStage('library', BG.library());
    placeChars(stage, 'library', [{ x: 30, y: 82 }, { x: 70, y: 82 }]);
    const shelf = h('div.book-shelf');
    body.append(stage, h('p.tray-title', '📚 Välj en bok att läsa'), shelf);
    function renderShelf() {
      clear(shelf);
      booksForLevel(level).forEach((b) => shelf.appendChild(onTap(h('button.book-btn', { type: 'button', class: st.books[b.id] ? 'read' : '' }, h('span.bk-e', b.e), h('span.bk-t', b.title), st.books[b.id] ? h('small.have', '✓ läst') : h('small', '📖 ny')), () => openBook(b))));
    }
    function openBook(b) {
      let page = 0;
      const dlg = h('div.pay.reader');
      el.querySelector('.play').appendChild(dlg);
      const close = () => dlg.remove();
      function words(text) {
        return h('p.reader-text', text.split(' ').map((w) => onTap(h('span.word', { tabindex: '0' }, w), () => kos.say(w.replace(/[.,!?–]/g, '')), { guardMs: 150 })).flatMap((n, i) => (i ? [' ', n] : [n])));
      }
      function renderPage() {
        const [e, text] = b.pages[page];
        clear(dlg).append(
          h('div.reader-head', h('b', `${b.e} ${b.title}`), h('small', `${page + 1} / ${b.pages.length}`)),
          h('div.reader-pic', e),
          words(text),
          h('div.row-actions',
            onTap(h('button.btn.btn-ghost.big-touch', { type: 'button', 'aria-label': 'stäng' }, '✕'), close),
            onTap(h('button.btn.btn-ghost.big-touch', { type: 'button', disabled: page === 0 }, '◀'), () => {
              page = Math.max(0, page - 1);
              renderPage();
            }),
            onTap(h('button.btn.btn-ghost.big-touch', { type: 'button' }, '🔊 Läs upp'), () => kos.say(text)),
            onTap(h('button.btn.btn-primary.big-touch', { type: 'button' }, page < b.pages.length - 1 ? '▶' : 'Klar ✓'), () => {
              if (page < b.pages.length - 1) {
                page++;
                renderPage();
              } else question();
            })),
          h('p.muted.reader-tip', 'Tryck på ett ord för att höra det.'),
        );
        if (level <= 1 || kos.shouldAutoSpeak()) kos.say(text);
      }
      function question() {
        let tries = 0;
        clear(dlg).append(
          h('div.reader-head', h('b', `${b.e} ${b.title}`)),
          h('p.big-text', h('b', b.q.text)),
          h('div.answer-row', b.q.options.map(([label, e]) => {
            const btn = h('button.answer-btn.book-ans', { type: 'button' }, h('span.pic', e), h('span', label));
            return onTap(btn, () => {
              if (label !== b.q.answer) {
                tries++;
                btn.disabled = true;
                btn.classList.add('wrong');
                kos.sfx('wrong');
                kos.say('Inte riktigt. Vill du titta i boken igen?');
                return;
              }
              kos.sfx('correct');
              const first = !st.books[b.id];
              st.books[b.id] = 1;
              addToSet(p, 'playBooks', b.id);
              save();
              clear(dlg).append(
                h('div.reader-pic', '🌟'),
                h('p.big-text', h('b', 'Rätt!'), ` ${b.q.explain}`),
                h('div.row-actions', onTap(h('button.btn.btn-ghost.big-touch', { type: 'button' }, '📖 Läs igen'), () => {
                  page = 0;
                  renderPage();
                }), onTap(h('button.btn.btn-primary.big-touch', { type: 'button' }, 'Till hyllan'), () => {
                  close();
                  renderShelf();
                })),
              );
              kos.say(`Rätt! ${b.q.explain}`);
              if (first) earn(tries ? 1 : BOOK_COINS, `Du läste ${b.title}!`, 'library');
            });
          })),
          h('div.row-actions', onTap(h('button.btn.btn-ghost.big-touch', { type: 'button' }, '◀ Tillbaka till boken'), () => {
            page = 0;
            renderPage();
          })),
        );
        kos.say(`${b.q.text} ${b.q.options.map(([l]) => l).join(', eller ')}?`);
      }
      renderPage();
    }
    renderShelf();
    kos.autoSay('Biblioteket! Välj en bok. Tryck på ett ord för att höra det.');
  }

  /* ======================= Bondgården ======================= */
  function farm() {
    const stage = makeStage('farm', BG.farm());
    const spots = [[14, 58], [34, 52], [54, 58], [76, 60], [20, 82], [42, 80], [64, 84], [86, 82], [8, 34]];
    const animalEls = {};
    FARM_ANIMALS.forEach((a, i) => {
      const [x, y] = spots[i % spots.length];
      const node = h('div.prop.animal', { style: { left: `${x}%`, top: `${y}%` }, dataset: { id: a.id }, 'aria-label': a.n }, a.e);
      draggable(node, stage, { onTap: () => tapAnimal(a, node) });
      stage.appendChild(node);
      animalEls[a.id] = node;
    });
    let selected = null;
    const tray = h('div.tray');
    const info = h('p.pay-msg');
    body.append(stage, info, h('p.tray-title', '🧺 Dra maten till ett djur – eller tryck på maten och sedan på djuret'), tray, h('div.row-actions.left', onTap(h('button.btn.btn-ghost.big-touch', { type: 'button' }, '🧑‍🌾 Bondens fråga'), () => question())));
    function renderTray() {
      clear(tray);
      FARM_FOODS.forEach((f) => {
        const b = h('button.tray-item', { type: 'button', class: selected === f.id ? 'sel' : '', 'aria-label': f.n }, f.e);
        b.addEventListener('pointerdown', (e) => ghostDrag(e, stage, f.e, {
          onDrop: (q) => {
            const hit = hitAt(stage, q, '.animal');
            if (hit) give(FARM_ANIMALS.find((a) => a.id === hit.dataset.id), f, hit);
          },
          onTap: () => {
            selected = selected === f.id ? null : f.id;
            renderTray();
            kos.say(f.n);
          },
        }));
        tray.appendChild(b);
      });
    }
    function tapAnimal(a, node) {
      if (selected) return give(a, FARM_FOODS.find((f) => f.id === selected), node);
      node.classList.add('jump');
      setTimeout(() => node.classList.remove('jump'), 600);
      bubble(node, `${a.sound} ${a.fact}`, { ms: 5000 });
    }
    function give(a, f, node) {
      const r = farmReaction(a.id, f.id);
      if (r.ok) {
        node.classList.add('jump');
        setTimeout(() => node.classList.remove('jump'), 600);
        kos.sfx('correct');
        bubble(node, r.text, { ms: 2400 });
        st.farm.fed[a.id] = (st.farm.fed[a.id] || 0) + 1;
        if (addToSet(p, 'playFarm', a.id)) earn(1, `Du gav ${a.n} rätt mat!`, 'farm');
        if (productReady(a, st.farm.lastProduct[a.id])) dropProduct(a, node);
        info.textContent = `${a.e} ${a.n.charAt(0).toUpperCase() + a.n.slice(1)} är ${a.diet}.`;
      } else {
        node.classList.add('shake');
        setTimeout(() => node.classList.remove('shake'), 500);
        if (r.no) kos.sfx('wrong');
        bubble(node, r.text, { ms: 3600 });
      }
      save();
    }
    function dropProduct(a, node) {
      st.farm.lastProduct[a.id] = Date.now();
      const pr = FARM_PRODUCTS[a.product];
      const x = Math.min(95, parseFloat(node.style.left) + 8);
      const y = Math.min(93, parseFloat(node.style.top) + 6);
      const prod = h('button.prop.product', { type: 'button', style: { left: `${x}%`, top: `${y}%` }, 'aria-label': pr.n }, pr.e);
      onTap(prod, () => {
        prod.remove();
        st.pantry[a.product] = (st.pantry[a.product] || 0) + 1;
        kos.sfx('pop');
        kos.toast(`${pr.e} Du samlade ${pr.n}! Sälj på Marknaden.`, { icon: pr.e, ms: 2200 });
        save();
      });
      stage.appendChild(prod);
    }
    function question() {
      const rng = createRng(Date.now());
      const q = farmQuestion(level, rng);
      let tries = 0;
      const dlg = h('div.pay');
      clear(dlg).append(
        h('h3', '🧑‍🌾 Bondens fråga'),
        h('p.big-text', h('b', q.text)),
        h('div.answer-row', q.options.map((o) => {
          const b = h('button.answer-btn.book-ans', { type: 'button' }, h('span.pic', o.e), h('span', o.label));
          return onTap(b, () => {
            if (o.id !== q.answer) {
              tries++;
              b.disabled = true;
              b.classList.add('wrong');
              kos.sfx('wrong');
              kos.say('Inte riktigt. Prova igen!');
              return;
            }
            kos.sfx('correct');
            dlg.querySelectorAll('.answer-btn').forEach((x) => (x.disabled = true));
            b.classList.add('right');
            dlg.insertBefore(h('p.pay-msg.ok', q.explain), dlg.lastChild);
            kos.say(q.explain);
            if (!tries) earn(1, 'Rätt svar, bonde!', 'farm');
          });
        })),
        h('div.row-actions', onTap(h('button.btn.btn-ghost', { type: 'button' }, 'Stäng'), () => dlg.remove()), onTap(h('button.btn.btn-primary.big-touch', { type: 'button' }, 'Ny fråga ➜'), () => {
          dlg.remove();
          question();
        })),
      );
      el.querySelector('.play').appendChild(dlg);
      kos.say(q.say);
    }
    renderTray();
    kos.autoSay('Bondgården! Vad vill djuren äta? Dra maten till dem.');
  }

  /* ======================= Stranden ======================= */
  function beach() {
    const stage = makeStage('beach', BG.beach());
    placeChars(stage, 'beach', [{ x: 14, y: 66 }, { x: 28, y: 76 }]);
    let castle = 0;
    const sand = h('button.prop.sandcastle', { type: 'button', style: { left: '22%', top: '88%' }, 'aria-label': 'sandslott' });
    const drawCastle = () => {
      sand.innerHTML = castle ? `<svg viewBox="0 0 120 80" aria-hidden="true"><rect x="10" y="50" width="100" height="28" fill="#d6a85a"/>${Array.from({ length: castle }, (_, i) => `<rect x="${12 + i * 26}" y="${22 - (i % 2) * 8}" width="18" height="${30 + (i % 2) * 8}" fill="#e9c27a"/><polygon points="${12 + i * 26},${22 - (i % 2) * 8} ${21 + i * 26},${8 - (i % 2) * 8} ${30 + i * 26},${22 - (i % 2) * 8}" fill="#ef4444"/>`).join('')}</svg>` : '🪣';
    };
    drawCastle();
    onTap(sand, () => {
      if (castle >= 4) {
        castle = 0;
        kos.sfx('whoosh');
        bubble(stage, '🌊 En våg sköljde bort sandslottet! Bygg ett nytt.', { ms: 2600 });
      } else {
        castle++;
        kos.sfx('pop');
        if (castle === 4) bubble(sand, 'Ett helt sandslott! 🏰', { ms: 1800 });
      }
      drawCastle();
    });
    stage.appendChild(sand);
    let guess = null;
    const tray = h('div.tray');
    const info = h('p.pay-msg');
    const guessRow = h('div.answer-row.guess-row');
    const tested = () => BEACH_ITEMS.filter((b) => st.beach[b.id]).length;
    body.append(stage, info, level >= 1 ? guessRow : h('span'), h('p.tray-title', '🌊 Dra en sak ut i havet – flyter den eller sjunker den?'), tray);
    function renderGuess() {
      clear(guessRow).append(h('span.set-label', 'Jag gissar:'), ...[['float', '🛟 Flyter'], ['sink', '⚓ Sjunker']].map(([id, label]) => onTap(h('button.answer-btn', { type: 'button', class: guess === id ? 'on' : '' }, label), () => {
        guess = guess === id ? null : id;
        renderGuess();
        kos.say(guess ? `Du gissar att den ${guess === 'float' ? 'flyter' : 'sjunker'}.` : 'Ingen gissning.');
      })));
    }
    function renderTray() {
      clear(tray);
      BEACH_ITEMS.forEach((it) => {
        const b = h('button.tray-item', { type: 'button', class: st.beach[it.id] ? 'done' : '', 'aria-label': it.n }, it.e);
        b.addEventListener('pointerdown', (e) => ghostDrag(e, stage, it.e, {
          onDrop: (q) => drop(it, q),
          onTap: () => drop(it, { x: 70, y: 60 }),
        }));
        tray.appendChild(b);
      });
      tray.appendChild(h('small.muted', ` Testat: ${tested()}/${BEACH_ITEMS.length}`));
    }
    function drop(it, q) {
      stage.querySelector(`.floaty[data-id="${it.id}"]`)?.remove();
      const node = h('div.prop.floaty', { style: { left: `${q.x}%`, top: `${q.y}%` }, dataset: { id: it.id } }, it.e);
      stage.appendChild(node);
      if (!inSea(q.x, q.y)) {
        kos.sfx('pop');
        bubble(node, 'Den ligger på sanden. Dra den ut i vattnet!', { ms: 1800 });
        return;
      }
      kos.sfx('whoosh');
      requestAnimationFrame(() => {
        node.style.top = it.floats ? '47%' : '91%';
        node.style.left = `${Math.max(q.x, 52)}%`;
        node.classList.add(it.floats ? 'floating' : 'sunk');
      });
      const right = guess && (guess === 'float') === it.floats;
      const first = !st.beach[it.id];
      st.beach[it.id] = 1;
      addToSet(p, 'playBeach', it.id);
      info.textContent = `${it.e} ${it.n.charAt(0).toUpperCase() + it.n.slice(1)} ${it.floats ? 'flyter' : 'sjunker'}! ${it.why}`;
      kos.say(`${it.n} ${it.floats ? 'flyter' : 'sjunker'}! ${it.why}`);
      if (guess) {
        setTimeout(() => bubble(stage, right ? '🎉 Du gissade rätt!' : '🤔 Oj! Det trodde du inte. Nu vet du!', { speak: false, ms: 2000 }), 900);
        if (right && first) earn(1, 'Bra gissat!', 'beach');
      }
      guess = null;
      if (level >= 1) renderGuess();
      save();
      renderTray();
    }
    if (level >= 1) renderGuess();
    renderTray();
    kos.autoSay('Stranden! Dra saker ut i havet. Flyter de eller sjunker de? Gissa först!');
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
          earn(coins, 'Du hjälpte ett djur!', 'vet');
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
