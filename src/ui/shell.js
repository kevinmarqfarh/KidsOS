import { wallpaperButton } from './wallpapers.js';
// OS-skalet: låsskärm, profiler, hemskärm, docka, appfönster, föräldraspärr och paus.
import { h, clear, onTap, $ } from './dom.js';
import { kos } from './kos.js';
import { APPS, appById, moduleById } from '../apps/registry.js';
import { AVATARS, PROFILE_COLORS, WALLPAPERS, LEVELS, AGE_BANDS, ageBandFor, profileAgeLabel } from '../core/age.js';
import { rankFor } from '../core/progress.js';
import { nextTrophy, TROPHIES } from '../core/trophies.js';
import { wonderOfTheDay } from '../apps/wonder.js';
import { moduleStat, addBonusMinutes, minutesLeftToday, dateKey, touchDay, applyAgeBand } from '../core/model.js';
import { runQuiz, effectiveLevel } from './quiz.js';
import { VIEWS } from './views/index.js';
import { renderTrophyRoom } from './trophyroom.js';
import { renderSettings } from './settings.js';
import { isPersistent } from '../core/storage.js';

let osEl;
let screenEl;
let windowEl;
let statusEl;
let cleanup = null;
let current = { screen: 'lock' };

export function mountShell(root) {
  statusEl = h('header.statusbar');
  screenEl = h('main.screen');
  windowEl = h('section.window', { 'aria-hidden': 'true' });
  const overlays = h('div.overlays');
  osEl = h('div.os', statusEl, screenEl, windowEl, overlays);
  kos.overlayRoot = overlays;
  clear(root).appendChild(osEl);
  kos.on('stars', renderStatus);
  kos.on('tick', renderStatus);
  kos.on('limit', showLimit);
  setInterval(renderStatus, 30000);
  if (kos.profile) goHome();
  else showLock();
}

function setWallpaper() {
  const p = kos.profile;
  osEl.className = `os wp-${p?.wallpaper || 'sky'}`;
}

/* ---------------- Statusrad ---------------- */
function renderStatus() {
  const p = kos.profile;
  const now = new Date();
  const time = now.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
  clear(statusEl);
  if (!p) {
    statusEl.append(h('span.sb-left', ''), h('span.sb-time', time), h('span.sb-right', ''));
    return;
  }
  const left = minutesLeftToday(p);
  const who = h('button.sb-who', { type: 'button', 'aria-label': 'Byt användare' }, h('span.sb-avatar', { style: { background: p.color } }, p.avatar), h('span.sb-name', p.name));
  onTap(who, () => confirmSwitch());
  statusEl.append(
    who,
    h('span.sb-time', time),
    h(
      'span.sb-right',
      Number.isFinite(left) ? h('span.sb-chip.sb-timeleft', { title: 'Tid kvar i dag' }, `⏳ ${Math.ceil(left)} min`) : null,
      p.streak?.count > 1 ? h('span.sb-chip', { title: 'Dagar i rad' }, `🔥 ${p.streak.count}`) : null,
      h('span.sb-chip.sb-stars', { title: 'Stjärnor' }, `⭐ ${p.stars}`),
    ),
  );
}

/* ---------------- Låsskärm / välj profil ---------------- */
export function showLock() {
  closeWindow(true);
  current = { screen: 'lock' };
  osEl.className = 'os wp-sky lockmode';
  renderStatus();
  const now = new Date();
  const date = now.toLocaleDateString('sv-SE', { weekday: 'long', day: 'numeric', month: 'long' });
  const profiles = kos.state.profiles;
  const bubbles = profiles.map((p) => {
    const b = h('button.who-bubble', { type: 'button', style: { '--c': p.color } }, h('span.who-avatar', p.avatar), h('span.who-name', p.name), h('span.who-age', profileAgeLabel(p)));
    onTap(b, () => {
      kos.sfx('whoosh');
      kos.login(p.id);
      kos.say(`Hej ${p.name}!`);
      goHome();
    });
    return b;
  });
  const add = h('button.who-bubble.who-add', { type: 'button' }, h('span.who-avatar', '＋'), h('span.who-name', 'Ny profil'));
  onTap(add, () => parentGate(() => profileWizard()));
  const empty = !profiles.length;
  clear(screenEl).append(
    h(
      'div.lock',
      h('div.lock-clock', now.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })),
      h('div.lock-date', date),
      h('div.lock-logo', h('span.logo-mark', 'K'), h('span', 'KidsOS')),
      empty
        ? h(
            'div.welcome',
            h('h1', 'Välkommen till KidsOS!'),
            h('p', 'Ett lärande operativsystem för nyfikna barn. En vuxen godkänner åldersintervallet. Sedan väljer barnet sitt namn, sin figur och sin bakgrund. Innehållet anpassas och växer med barnet.'),
            onTap(h('button.btn.btn-primary.btn-xl', { type: 'button' }, '✨ Skapa första profilen'), () => parentGate(() => profileWizard({ first: true }))),
            h('button.btn.btn-ghost', { type: 'button', onClick: () => parentGate(quickFamily) }, '👨‍👧‍👦 Snabbstart: tre exempelprofiler'),
          )
        : h('div.who', h('h1.who-title', 'Vem är det som lär sig i dag?'), h('div.who-list', bubbles, add)),
      !isPersistent() ? h('p.lock-note', '⚠️ Den här webbläsaren sparar inte data (privat läge?). Framsteg försvinner när fliken stängs.') : null,
    ),
  );
}

function quickFamily() {
  const kids = [
    { name: 'Lilla', age: 5, avatar: '🐰', color: '#ff5fa2', wallpaper: 'candy' },
    { name: 'Mellan', age: 7, avatar: '🦊', color: '#ff9f1c', wallpaper: 'forest' },
    { name: 'Stora', age: 9, avatar: '🦉', color: '#3d8bfd', wallpaper: 'space' },
  ];
  kids.forEach((k) => kos.createProfile(k));
  kos.toast('Tre profiler skapade! Byt namn under Inställningar → Föräldrar.', { icon: '👨‍👧‍👦', ms: 4500 });
  showLock();
}

function confirmSwitch() {
  const sheet = modal(
    h('div.sheet-body', h('h2', 'Byta användare?'), h('p', 'Dina stjärnor och troféer är sparade.')),
    [
      ['Stanna', 'ghost', () => true],
      [
        'Byt 👋',
        'primary',
        () => {
          kos.logout();
          showLock();
          return true;
        },
      ],
    ],
  );
  return sheet;
}

/* ---------------- Profilguide ---------------- */
export function profileWizard({ first = false, edit = null, onDone } = {}) {
  const initialBand = ageBandFor(edit || { age: 7 });
  const data = { name: edit?.name || '', ageBand: initialBand.id, avatar: edit?.avatar || '🦊', color: edit?.color || PROFILE_COLORS[5], wallpaper: edit?.wallpaper || 'sky' };
  let approved = false;
  let submitted = false;
  let step = 0;
  const body = h('div.wizard');
  const stage = h('div.wizard-stage');
  const heading = h('h2', first ? 'Din första profil' : edit ? 'Din profil' : 'Ny profil');
  const progress = h('p.wizard-progress', { 'aria-live': 'polite' });
  const back = onTap(h('button.btn.btn-ghost', { type: 'button' }, '← Tillbaka'), () => { if (step > 0) { step--; renderChild(); } });
  const next = h('button.btn.btn-primary.wizard-next', { type: 'button' });
  const cancel = onTap(h('button.btn.btn-ghost', { type: 'button' }, 'Avbryt'), () => sheet.close());
  const listen = onTap(h('button.btn.btn-ghost.wizard-listen', { type: 'button' }, '🔊 Lyssna'), () => kos.say(approved ? ['Skriv ditt namn eller ditt smeknamn. Tryck sedan på Nästa.', 'Välj en figur som du tycker om. Tryck sedan på Nästa.', 'Välj din färg och din bakgrund. Tryck sedan på Skapa eller Spara.'][step] : 'En vuxen väljer ditt åldersintervall och godkänner. Sedan kan du välja själv.'));
  body.append(heading, progress, listen, stage, h('div.wizard-actions', cancel, back, next));
  const sheet = modal(body, [], { wide: true });
  const nameInput = h('input.text-input#profile-name', { type: 'text', maxlength: '16', placeholder: 'Skriv ditt namn', value: data.name, autocomplete: 'off', autocapitalize: 'words' });
  const band = () => AGE_BANDS.find(item => item.id === data.ageBand);
  nameInput.addEventListener('input', () => { data.name = nameInput.value; });
  function renderParent() {
    heading.textContent = 'Föräldern väljer först';
    progress.textContent = 'Välj åldersintervall och godkänn. Sedan kan barnet göra resten själv.';
    back.hidden = true;
    next.textContent = 'Godkänn och låt barnet fortsätta →';
    const cards = h('div.age-band-grid', AGE_BANDS.map(item => onTap(h('button.age-band-card', { type: 'button', class: data.ageBand === item.id ? 'on' : '', 'aria-pressed': String(data.ageBand === item.id), dataset: { band: item.id } }, h('span.age-band-icon', item.icon), h('b', item.label), h('strong', item.title), h('p', item.support), h('small', item.content)), () => { data.ageBand = item.id; renderParent(); })));
    clear(stage).append(cards, h('p.wizard-parent-note', 'Svårigheten växer när barnet övar. Uppläsning och nivåer kan justeras i inställningarna.'));
    if (edit) stage.append(h('p.wizard-parent-note', 'Om du ändrar åldersintervall ställs övningarnas nivåer om till intervallets startnivå. Stjärnor, samlingar och tidigare resultat sparas. Egna nivåval återställs då.'));
  }
  function pickButton(tag, text, selected, fn, attrs = {}) {
    return onTap(h(tag, { type: 'button', class: selected ? 'on' : '', 'aria-pressed': String(selected), ...attrs }, text), fn);
  }
  function renderChild() {
    heading.textContent = ['Vad heter du?', 'Välj din kompis', 'Gör profilen till din'][step];
    progress.textContent = `Steg ${step + 1} av 3 · ${band().label} · Godkänt av en vuxen ✓`;
    back.hidden = step === 0;
    next.textContent = step === 2 ? (edit ? 'Spara' : 'Skapa ✨') : 'Nästa →';
    clear(stage).append(h('div.wiz-preview', h('span.who-avatar', { style: { background: data.color } }, data.avatar), h('div', h('b', data.name.trim() || 'Din profil'), h('small', band().title))));
    if (step === 0) stage.append(h('label.field', h('span', 'Mitt namn'), nameInput), h('p.muted', 'Du kan använda ett förnamn eller ett smeknamn.'));
    if (step === 1) stage.append(h('div.pick-grid.avatars', AVATARS.map(avatar => pickButton('button.pick.pick-av', avatar, data.avatar === avatar, () => { data.avatar = avatar; renderChild(); }))));
    if (step === 2) stage.append(h('div.field', h('span', 'Min färg'), h('div.pick-row.colors', PROFILE_COLORS.map((color, i) => pickButton('button.pick.pick-col', '', data.color === color, () => { data.color = color; renderChild(); }, { style: { background: color }, 'aria-label': `Färg ${i + 1}` })))), h('div.field', h('span', 'Min bakgrund'), h('div.wallpaper-grid', WALLPAPERS.map(w => wallpaperButton(w, data.wallpaper === w.id, () => { data.wallpaper = w.id; renderChild(); })))));
  }
  onTap(next, () => {
    if (submitted) return;
    next.disabled = true;
    setTimeout(() => { if (!submitted) next.disabled = false; }, 150);
    if (!approved) { approved = true; renderChild(); return; }
    if (step === 0 && !data.name.trim()) { nameInput.focus(); nameInput.setCustomValidity('Skriv ett namn eller smeknamn.'); nameInput.reportValidity(); nameInput.addEventListener('input', () => nameInput.setCustomValidity(''), { once: true }); return; }
    if (step < 2) { step++; renderChild(); return; }
    submitted = true;
    if (edit) {
      const profile = kos.state.profiles.find(item => item.id === edit.id);
      if (!profile.ageBand || data.ageBand !== initialBand.id) applyAgeBand(profile, data.ageBand);
      Object.assign(profile, { name: data.name.trim().slice(0, 16), avatar: data.avatar, color: data.color, wallpaper: data.wallpaper });
      kos.saveNow();
      kos.applySettings();
    } else kos.createProfile({ ...data, age: band().age, name: data.name.trim() });
    kos.sfx('fanfare');
    sheet.close();
    if (onDone) onDone(); else showLock();
  }, { guardMs: 0 });
  renderParent();
}

/* ---------------- Hemskärm ---------------- */
export function goHome() {
  closeWindow();
  current = { screen: 'home' };
  setWallpaper();
  renderStatus();
  const p = kos.profile;
  if (!p) return showLock();
  touchDay(p, dateKey(), 0);
  const rank = rankFor(p.stars);
  const hour = new Date().getHours();
  const greet = hour < 10 ? 'God morgon' : hour < 18 ? 'Hej' : 'God kväll';
  const w = wonderOfTheDay(new Date(), kos.level('wonder'), p.settings.showAllModules);
  const nt = nextTrophy(p);
  const trophyCount = Object.keys(p.trophies).length;

  const hidden = new Set(p.settings.hiddenApps || []);
  const grid = h('div.app-grid');
  APPS.filter((a) => !hidden.has(a.id)).forEach((app, i) => {
    const icon = h(
      'button.app-icon',
      { type: 'button', style: { '--app': app.color, '--i': i }, dataset: { app: app.id }, 'aria-label': app.name },
      h('span.app-glyph', h('span', app.icon)),
      h('span.app-name', app.name),
    );
    onTap(icon, () => {
      kos.sfx('pop');
      openApp(app.id, null, icon);
    });
    grid.appendChild(icon);
  });

  const wonderCard = h(
    'button.home-card.wonder-card',
    { type: 'button' },
    h('span.hc-kicker', 'Dagens fråga'),
    h('span.hc-emoji', w.e),
    h('span.hc-title', w.q),
  );
  onTap(wonderCard, () => openApp('wonder', 'cards', wonderCard, { focus: w.id }));

  const trophyCard = h(
    'button.home-card.trophy-card',
    { type: 'button' },
    h('span.hc-kicker', nt ? 'Nästan där!' : 'Troféer'),
    h('span.hc-emoji', nt ? nt.t.icon : '🏆'),
    h('span.hc-title', nt ? nt.t.name : `${trophyCount} av ${TROPHIES.length}`),
    nt ? h('span.hc-bar', h('i', { style: { width: `${Math.round(nt.pr.ratio * 100)}%` } })) : null,
    nt ? h('span.hc-sub', `${nt.pr.value} / ${nt.pr.target} · ${nt.t.desc}`) : null,
  );
  onTap(trophyCard, () => openSystem('trophies', trophyCard));

  const dock = h('nav.dock');
  const dockItems = [
    ['🏆', 'Troféer', () => openSystem('trophies')],
    ['⚙️', 'Inställningar', () => openSystem('settings')],
    ['👋', 'Byt', () => confirmSwitch()],
  ];
  for (const [ic, label, fn] of dockItems) {
    const b = h('button.dock-item', { type: 'button', 'aria-label': label }, h('span.dock-icon', ic), h('span.dock-label', label));
    onTap(b, () => {
      kos.sfx('pop');
      fn();
    });
    dock.appendChild(b);
  }

  clear(screenEl).append(
    h(
      'div.home',
      h(
        'div.home-head',
        h('div.home-hello', h('h1', `${greet} ${p.name}!`), h('p', 'Vad vill du upptäcka i dag?')),
        h('div.rank', h('span.rank-emoji', rank.emoji), h('div.rank-text', h('b', rank.title), h('span.rank-bar', h('i', { style: { width: `${Math.round(rank.progress * 100)}%` } })), h('small', rank.next ? `${rank.toNext} ⭐ till ${rank.next.title}` : 'Högsta titeln!'))),
      ),
      h('div.home-cards', wonderCard, trophyCard),
      grid,
      dock,
    ),
  );
  if (kos.shouldAutoSpeak() && !goHome.spoken) {
    goHome.spoken = true;
    kos.autoSay(`${greet} ${p.name}! Vad vill du upptäcka i dag?`);
  }
}

/* ---------------- Appfönster ---------------- */
function windowFrame({ title, icon, color, onBack, levelChip = true, appId }) {
  const home = h('button.win-home', { type: 'button', 'aria-label': 'Hem' }, h('span', '⌂'), h('small', 'Hem'));
  onTap(home, () => {
    kos.sfx('whoosh');
    goHome();
  });
  const back = onBack ? onTap(h('button.win-back', { type: 'button', 'aria-label': 'Tillbaka' }, '‹'), onBack) : null;
  const lvl = appId && levelChip ? kos.levelInfo(appId) : null;
  const header = h(
    'div.win-head',
    home,
    back,
    h('div.win-title', h('span.win-icon', icon), h('span', title)),
    lvl ? h('span.level-chip', { title: lvl.school }, `${lvl.emoji} ${lvl.short}`) : h('span'),
  );
  const content = h('div.win-content');
  clear(windowEl).append(header, content);
  windowEl.style.setProperty('--app', color);
  return content;
}

function animateOpen(fromEl) {
  windowEl.classList.remove('closing');
  if (fromEl) {
    const r = fromEl.getBoundingClientRect();
    windowEl.style.setProperty('--ox', `${r.left + r.width / 2}px`);
    windowEl.style.setProperty('--oy', `${r.top + r.height / 2}px`);
  } else {
    windowEl.style.setProperty('--ox', '50%');
    windowEl.style.setProperty('--oy', '50%');
  }
  windowEl.setAttribute('aria-hidden', 'false');
  windowEl.classList.add('open');
  osEl.classList.add('app-open');
}

export function closeWindow(instant) {
  if (cleanup) {
    try {
      cleanup();
    } catch {}
    cleanup = null;
  }
  kos.stopSpeaking();
  if (!windowEl) return;
  windowEl.setAttribute('aria-hidden', 'true');
  osEl?.classList.remove('app-open');
  if (instant) {
    windowEl.classList.remove('open', 'closing');
    clear(windowEl);
    return;
  }
  if (windowEl.classList.contains('open')) {
    windowEl.classList.add('closing');
    windowEl.classList.remove('open');
    setTimeout(() => {
      if (!windowEl.classList.contains('open')) {
        windowEl.classList.remove('closing');
        clear(windowEl);
      }
    }, 260);
  }
}

export function openApp(appId, moduleId, fromEl, opts = {}) {
  const app = appById(appId);
  if (!app) return;
  if (cleanup) {
    try {
      cleanup();
    } catch {}
    cleanup = null;
  }
  current = { screen: 'app', appId, moduleId };
  // Appar med bara en modul öppnas direkt.
  if (!moduleId && app.modules.length === 1) moduleId = app.modules[0].id;
  if (!moduleId) {
    renderHub(app);
  } else {
    renderModule(app, moduleById(app, moduleId), opts);
  }
  if (!windowEl.classList.contains('open')) animateOpen(fromEl);
}

function renderHub(app) {
  const p = kos.profile;
  const content = windowFrame({ title: app.name, icon: app.icon, color: app.color, appId: app.id });
  const level = kos.level(app.id);
  const showAll = p.settings.showAllModules;
  const tiles = app.modules.map((m, i) => {
    const locked = !showAll && level < (m.minLevel ?? 0);
    const st = moduleStat(p, app.id, m.id);
    const easy = m.maxLevel !== undefined && level > m.maxLevel + 1;
    const stars = h('span.mod-stars', [1, 2, 3].map((k) => h('i', { class: k <= st.best ? 'on' : '' }, '★')));
    const b = h(
      'button.mod-tile',
      { type: 'button', class: locked ? 'locked' : '', style: { '--i': i }, dataset: { mod: m.id } },
      h('span.mod-icon', m.icon),
      h('span.mod-name', m.name),
      locked ? h('span.mod-lock', `🔒 ${LEVELS[m.minLevel].short}`) : m.gen ? stars : h('span.mod-kind', '▶ Utforska'),
      easy && !locked ? h('span.mod-tag', 'Lätt') : null,
    );
    onTap(b, () => {
      if (locked) {
        kos.sfx('wrong');
        kos.say(`${m.name} låses upp när du når ${LEVELS[m.minLevel].short}. Fortsätt öva så kommer du dit!`);
        b.classList.add('wrong-shake');
        setTimeout(() => b.classList.remove('wrong-shake'), 500);
        return;
      }
      kos.sfx('pop');
      openApp(app.id, m.id);
    });
    return b;
  });
  content.append(h('div.hub', h('p.hub-tag', app.tagline), h('div.mod-grid', tiles)));
  kos.autoSay(`${app.name}. ${app.tagline}. Vad vill du göra?`);
}

function renderModule(app, mod, opts = {}) {
  const single = app.modules.length === 1;
  const content = windowFrame({
    title: single ? app.name : mod.name,
    icon: single ? app.icon : mod.icon,
    color: app.color,
    appId: app.id,
    levelChip: !!mod.gen || ['robot', 'trace', 'stories'].includes(mod.view),
    onBack: single ? null : () => openApp(app.id, null),
  });
  const back = () => (single ? goHome() : openApp(app.id, null));
  if (mod.gen) {
    cleanup = runQuiz(content, { app, module: mod, onExit: back });
  } else if (mod.view && VIEWS[mod.view]) {
    cleanup = VIEWS[mod.view](content, { kos, app, module: mod, level: effectiveLevel(app, mod), back, opts }) || null;
  } else {
    content.append(h('p', 'Kommer snart!'));
  }
}

function openSystem(which, fromEl) {
  if (cleanup) {
    try {
      cleanup();
    } catch {}
    cleanup = null;
  }
  current = { screen: 'system', which };
  if (which === 'trophies') {
    const content = windowFrame({ title: 'Troféer', icon: '🏆', color: '#e3a008', levelChip: false });
    cleanup = renderTrophyRoom(content, { openApp });
  } else if (which === 'settings') {
    const content = windowFrame({ title: 'Inställningar', icon: '⚙️', color: '#64748b', levelChip: false });
    cleanup = renderSettings(content, { parentGate, profileWizard, showLock, goHome, modal, refresh: () => openSystem('settings') });
  }
  if (!windowEl.classList.contains('open')) animateOpen(fromEl);
}

/* ---------------- Modal ---------------- */
export function modal(body, actions = [], { wide = false, dismissable = true } = {}) {
  const layer = kos.overlayRoot;
  const close = () => {
    sheet.classList.remove('in');
    setTimeout(() => sheet.remove(), 220);
  };
  const actionsRow = h(
    'div.sheet-actions',
    actions.map(([label, kind, fn]) => {
      const b = h(`button.btn.btn-${kind}`, { type: 'button' }, label);
      onTap(b, () => {
        if (fn() !== false) close();
      });
      return b;
    }),
  );
  const panel = h('div.sheet-panel', { class: wide ? 'wide' : '', role: 'dialog', 'aria-modal': 'true' }, body, actions.length ? actionsRow : null);
  const sheet = h('div.sheet', panel);
  if (dismissable) sheet.addEventListener('click', (e) => e.target === sheet && close());
  layer.appendChild(sheet);
  requestAnimationFrame(() => sheet.classList.add('in'));
  return { close, panel };
}

/* ---------------- Föräldraspärr ---------------- */
export function parentGate(onOk) {
  const pin = kos.state.settings.pin;
  let entry = '';
  let a;
  let b;
  if (!pin) {
    a = 6 + Math.floor(Math.random() * 4);
    b = 6 + Math.floor(Math.random() * 4);
  }
  const display = h('div.pin-display');
  const render = () => {
    clear(display);
    if (pin) for (let i = 0; i < 4; i++) display.appendChild(h('span.pin-dot', { class: i < entry.length ? 'on' : '' }));
    else display.appendChild(h('span.pin-val', entry || ' '));
  };
  const keys = h('div.numpad.small');
  let m;
  const press = (k) => {
    if (k === '⌫') entry = entry.slice(0, -1);
    else if (k === 'OK') return submit();
    else if (entry.length < 4) entry += k;
    render();
    if (pin && entry.length === 4) submit();
  };
  const submit = () => {
    const ok = pin ? entry === pin : Number(entry) === a * b;
    if (ok) {
      m.close();
      onOk();
    } else {
      display.classList.add('wrong-shake');
      setTimeout(() => display.classList.remove('wrong-shake'), 500);
      entry = '';
      render();
    }
  };
  for (const k of ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', 'OK']) {
    const btn = h('button.np-key', { type: 'button', class: k === 'OK' ? 'ok' : '' }, k);
    onTap(btn, () => press(k), { guardMs: 80 });
    keys.appendChild(btn);
  }
  render();
  m = modal(
    h('div.gate', h('h2', '🔒 För vuxna'), h('p', pin ? 'Skriv föräldrakoden.' : `Vad blir ${a} × ${b}?`), pin ? null : h('small.muted', 'Tips: välj en egen fyrsiffrig kod under Inställningar → Föräldrar.'), display, keys),
    [['Avbryt', 'ghost', () => true]],
  );
}

/* ---------------- Skärmtid ---------------- */
function showLimit() {
  if (document.querySelector('.limit-screen')) return;
  closeWindow(true);
  kos.paused = true;
  const p = kos.profile;
  const ideas = ['🌳 Gå ut och leta efter något som har ändrat sig sedan i går', '📚 Läs en bok eller titta i en tidning', '🖍️ Rita på riktigt papper', '🧱 Bygg något med klossar', '💬 Berätta för någon vad du har lärt dig i dag'];
  const el = h(
    'div.limit-screen',
    h('div.limit-card', h('div.limit-emoji', '🌙'), h('h1', `Bra jobbat i dag, ${p?.name || ''}!`), h('p', 'Skärmtiden för i dag är slut. Dags för en paus – hjärnan behöver vila för att minnas allt du lärt dig.'), h('ul.limit-ideas', ideas.map((i) => h('li', i)))),
    h(
      'div.limit-actions',
      onTap(h('button.btn.btn-ghost', { type: 'button' }, '👋 Byt användare'), () => {
        el.remove();
        kos.paused = false;
        kos.logout();
        showLock();
      }),
      onTap(h('button.btn.btn-primary', { type: 'button' }, '🔒 Vuxen: +15 min'), () =>
        parentGate(() => {
          addBonusMinutes(p, 15);
          kos.saveNow();
          kos.paused = false;
          el.remove();
          goHome();
        }),
      ),
    ),
  );
  kos.overlayRoot.appendChild(el);
  kos.say(`Bra jobbat i dag! Skärmtiden är slut. Dags för en paus.`);
}

export function currentScreen() {
  return current;
}

export { $, APPS };
