import { createAppFullscreenControl, exitAppFullscreen } from './fullscreen.js';
import { wallpaperButton } from './wallpapers.js';
// OS-skalet: låsskärm, profiler, hemskärm, docka, appfönster, föräldraspärr och paus.
import { h, clear, onTap,  $, openDialog, isolateModal } from './dom.js';
import { kos } from './kos.js';
import { APPS, appById, moduleById } from '../apps/registry.js';
import { AVATARS, PROFILE_COLORS, WALLPAPERS, LEVELS, AGE_BANDS, ageBandFor, profileAgeLabel } from '../core/age.js';
import { rankFor } from '../core/progress.js';
import { nextTrophy, TROPHIES } from '../core/trophies.js';
import { wonderOfTheDay } from '../apps/wonder.js';
import { addBonusMinutes, minutesLeftToday, dateKey, touchDay, applyAgeBand } from '../core/model.js';
import { isPersistent } from '../core/storage.js';
import { mountApp, appMeta } from './apphost.js';
import { shellApi } from './system.js';
import { createDesktop } from './desktop.js';
import { layoutFor } from '../core/model.js';
import { tickerSpan } from './fx.js';
import { INTERESTS, adaptedPrefs as readAdaptedPrefs, presetFor as adaptedPreset } from '../core/adapted.js';
import { installAdapted, adaptedHomeSection, adaptedTimeChip, adaptedLimit } from './adapted-home.js';
/** Autismstöd: det som ändras när föräldern anger om barnet också har IF (svarsalternativ och felhantering). */
const adaptedIfPatch = (support, intellectual) => { const pr = adaptedPreset(support, intellectual); return { intellectual: pr.intellectual, options: pr.options, errorMode: pr.errorMode }; };

let osEl;
let screenEl;
let windowEl;
let statusEl;
let tabletApp = null;
let tabletFullscreen = null;
let desktop = null;
let current = { screen: 'lock' };

export function mountShell(root) {
  statusEl = h('header.statusbar');
  screenEl = h('main.screen');
  windowEl = h('section.window', { 'aria-hidden': 'true', inert: true });
  const overlays = h('div.overlays');
  const deskEl = h('div.desktop-root', { hidden: true });
  osEl = h('div.os', statusEl, screenEl, windowEl, deskEl, overlays);
  kos.overlayRoot = overlays;
  clear(root).appendChild(osEl);
  Object.assign(shellApi, { parentGate, profileWizard, showLock, goHome, modal, confirmSwitch });
  desktop = createDesktop(deskEl, { osEl, confirmSwitch, showLock, modal });
  installAdapted({ goHome, openApp, closeWindow, showLock, parentGate }); // Autismstöd: dagens plan, förvarning, avslutning
  const subscriptions = [
    kos.on('stars', renderStatus),
    kos.on('tick', renderStatus),
    kos.on('limit', showLimit),
    kos.on('limit-warning', showLimitWarning),
    kos.on('profile', () => document.querySelectorAll('.time-warning').forEach(node => node.remove())),
  ];
  const statusTimer = setInterval(renderStatus, 30000);
  if (kos.profile) goHome();
  else showLock();
  return () => {
    clearInterval(statusTimer);
    subscriptions.forEach(unsubscribe => unsubscribe());
    closeWindow(true);
    desktop?.destroy();
  };
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
      kos.adapted ? adaptedTimeChip(p) : Number.isFinite(left) ? h('span.sb-chip.sb-timeleft', { title: 'Tid kvar i dag' }, `⏳ ${Math.ceil(left)} min`) : null,
      p.streak?.count > 1 ? h('span.sb-chip', { title: 'Dagar i rad' }, `🔥 ${p.streak.count}`) : null,
      h('span.sb-chip.sb-stars', { title: 'Stjärnor' }, '⭐ ', tickerSpan(`sb-stars:${p.id}`, p.stars)),
    ),
  );
}

/* ---------------- Låsskärm / välj profil ---------------- */
export function showLock() {
  closeWindow(true);
  desktop?.hide();
  current = { screen: 'lock' };
  screenEl.classList.remove('home-screen');
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
    const modes = h('div.seg', { 'aria-label': `Skärmläge för ${p.name}` }, ['desktop', 'tablet'].map(mode => onTap(h('button.seg-btn', { type: 'button', 'aria-label': `${mode === 'desktop' ? 'PC' : 'Tablet'} för ${p.name}`, 'aria-pressed': String(layoutFor(p) === mode), class: layoutFor(p) === mode ? 'on' : '' }, mode === 'desktop' ? '💻 PC' : '📱 Tablet'), () => {
      p.settings.layout = mode;
      kos.saveNow();
      showLock();
    })));
    return h('div.profile-choice', b, modes);
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
  // Anpassat läge väljs av föräldern (bakom föräldraspärren), se core/adapted.js.
  const adaptedData = { on: edit?.settings?.adapted === true, interest: readAdaptedPrefs(edit).interest, intellectual: readAdaptedPrefs(edit).intellectual };
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
  const listen = onTap(h('button.btn.btn-ghost.wizard-listen', { type: 'button' }, '🔊 Lyssna'), () => kos.read(approved ? ['Skriv ditt namn eller ditt smeknamn. Tryck sedan på Nästa.', 'Välj en figur som du tycker om. Tryck sedan på Nästa.', 'Välj din färg och din bakgrund. Tryck sedan på Skapa eller Spara.'][step] : 'En vuxen väljer ditt åldersintervall och godkänner. Sedan kan du välja själv.'));
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
    clear(stage).append(cards, adaptedChoice(), h('p.wizard-parent-note', 'Svårigheten växer när barnet övar. Uppläsning och nivåer kan justeras i inställningarna.'));
    if (edit) stage.append(h('p.wizard-parent-note', 'Om du ändrar åldersintervall ställs övningarnas nivåer om till intervallets startnivå. Stjärnor, samlingar och tidigare resultat sparas. Egna nivåval återställs då.'));
  }
  /** Växlare för anpassat läge + val av favoritintresse (används som belöning och tema). */
  function adaptedChoice() {
    const sw = onTap(h('button.toggle', { type: 'button', role: 'switch', id: 'adapted-toggle', 'aria-checked': String(adaptedData.on), 'aria-labelledby': 'adapted-title', class: adaptedData.on ? 'on' : '' }, h('i')), () => { adaptedData.on = !adaptedData.on; renderParent(); });
    return h(
      'div.adapted-choice',
      { class: adaptedData.on ? 'on' : '' },
      h('div.adapted-choice-head', h('span.adapted-choice-icon', { 'aria-hidden': 'true' }, '🧩'), h('div', h('b#adapted-title', 'Autismstöd'), h('small', 'Visuellt schema, förvarning före övergångar, pollett-tavla med barnets intresse, ”Hur mår du?”, paus med andningscirkel och lugnare sinnesintryck. Svårigheten följer ålder som vanligt.')), sw),
      adaptedData.on
        ? h('div.adapted-choice-more', h('span', 'Barnets favoritintresse:'), h('div.adapted-interests', INTERESTS.map((it) => pickButton('button.pick.adapted-interest', `${it.icon} ${it.label}`, adaptedData.interest === it.id, () => { adaptedData.interest = it.id; renderParent(); }))), h('span', 'Har barnet också en intellektuell funktionsnedsättning?'), h('div.adapted-interests', [['no', 'Nej'], ['yes', 'Ja']].map(([v, label]) => pickButton('button.pick.adapted-interest', label, adaptedData.intellectual === (v === 'yes'), () => { adaptedData.intellectual = v === 'yes'; renderParent(); }))), h('small', 'Stödnivå (standard nivå 2), ljud, animationer och färger ställs in under Inställningar → Föräldrar. Läget ersätter inte råd från habiliteringen.'))
        : null,
    );
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
      profile.settings.adapted = adaptedData.on;
      const prevPrefs = readAdaptedPrefs(profile);
      profile.settings.adaptedPrefs = { ...prevPrefs, interest: adaptedData.interest, ...(prevPrefs.intellectual !== adaptedData.intellectual ? adaptedIfPatch(prevPrefs.support, adaptedData.intellectual) : {}) };
      kos.saveNow();
      kos.applySettings();
    } else kos.createProfile({ ...data, age: band().age, name: data.name.trim(), adapted: adaptedData.on, adaptedPrefs: { v: 2, interest: adaptedData.interest, ...adaptedIfPatch(2, adaptedData.intellectual) } });
    kos.sfx('fanfare');
    sheet.close();
    if (onDone) onDone(); else showLock();
  }, { guardMs: 0 });
  renderParent();
}

/* ---------------- Hemskärm ---------------- */
export function isDesktop() {
  return !!kos.profile && layoutFor(kos.profile) === 'desktop';
}

export function goHome() {
  const p = kos.profile;
  if (!p) return showLock();
  if (isDesktop()) {
    closeWindow(true);
    current = { screen: 'desktop' };
    osEl.className = `os desktop-mode wp-${p.wallpaper || 'sky'}`;
    desktop.show();
    return;
  }
  desktop.hide();
  closeWindow();
  current = { screen: 'home' };
  screenEl.classList.add('home-screen');
  setWallpaper();
  renderStatus();
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
  onTap(trophyCard, () => openApp('trophies', null, trophyCard));

  const dock = h('nav.dock', { 'aria-label': 'Genvägar' });
  const dockItems = [
    ['🏡', 'Lekstaden', () => openApp('play', 'studio')],
    ['🏆', 'Troféer', () => openApp('trophies')],
    ['⚙️', 'Inställningar', () => openApp('settings')],
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
        h('button.wallet-chip', { type: 'button', onClick: () => openApp('play') }, h('span', '🪙'), h('b', tickerSpan(`home-coins:${p.id}`, p.coins || 0)), h('small', 'mynt')),
        h('div.rank', h('span.rank-emoji', rank.emoji), h('div.rank-text', h('b', rank.title), h('span.rank-bar', h('i', { style: { width: `${Math.round(rank.progress * 100)}%` } })), h('small', rank.next ? `${rank.toNext} ⭐ till ${rank.next.title}` : 'Högsta titeln!'))),
      ),
      kos.adapted ? adaptedHomeSection() : null,
      h('div.home-cards', wonderCard, trophyCard),
      grid,
      dock,
    ),
  );
  const homeHeading = screenEl.querySelector('.home h1');
  homeHeading?.setAttribute('tabindex', '-1');
  homeHeading?.focus({ preventScroll: true });
  if (kos.shouldAutoSpeak() && !goHome.spoken) {
    goHome.spoken = true;
    kos.autoSay(`${greet} ${p.name}! Vad vill du upptäcka i dag?`);
  }
}

/* ---------------- Appfönster (surfplatte-läget) ---------------- */
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
  screenEl.setAttribute('inert', '');
  screenEl.setAttribute('aria-hidden', 'true');
  windowEl.removeAttribute('inert');
  windowEl.setAttribute('aria-hidden', 'false');
  windowEl.classList.add('open');
  osEl.classList.add('app-open');
}

export function closeWindow(instant) {
  tabletFullscreen?.destroy();
  tabletFullscreen = null;
  if (tabletApp) {
    tabletApp.destroy();
    tabletApp = null;
  }
  kos.stopSpeaking();
  if (!windowEl) return;
  windowEl.setAttribute('aria-hidden', 'true');
  windowEl.setAttribute('inert', '');
  screenEl?.removeAttribute('inert');
  screenEl?.removeAttribute('aria-hidden');
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

/** Ett helskärmsfönster för surfplatte-läget. */
function tabletHost(meta) {
  tabletFullscreen?.destroy();
  tabletFullscreen = appById(meta.id) && meta.id !== 'play' ? createAppFullscreenControl(windowEl, osEl) : null;
  const home = h('button.win-home', { type: 'button', 'aria-label': 'Hem' }, h('span', '⌂'), h('small', 'Hem'));
  onTap(home, () => {
    kos.sfx('whoosh');
    goHome();
  });
  const backSlot = h('span.back-slot');
  const title = h('div.win-title', { tabindex: '-1' });
  const lvlSlot = h('span');
  const header = h('div.win-head', home, backSlot, title, lvlSlot, tabletFullscreen?.button);
  const content = h('div.win-content');
  clear(windowEl).append(header, content);
  windowEl.style.setProperty('--app', meta.color);
  return {
    content,
    setHead({ title: t, icon, back, levelAppId }) {
      clear(title).append(h('span.win-icon', icon), h('span', t));
      clear(backSlot);
      if (back) backSlot.appendChild(onTap(h('button.win-back', { type: 'button', 'aria-label': 'Tillbaka' }, '‹'), back));
      clear(lvlSlot);
      const lvl = levelAppId ? kos.levelInfo(levelAppId) : null;
      if (lvl) lvlSlot.appendChild(h('span.level-chip', { title: lvl.school }, `${lvl.emoji} ${lvl.short}`));
      content.scrollTop = 0;
      title.focus({ preventScroll: true });
    },
    close: () => goHome(),
    openApp: (a, m) => openApp(a, m),
    reload: () => openApp(meta.id),
  };
}

export function openApp(appId, moduleId, fromEl, opts = {}) {
  exitAppFullscreen();
  const meta = appMeta(appId);
  if (!meta) return;
  if (isDesktop()) {
    current = { screen: 'desktop', appId };
    desktop.open(appId, moduleId, opts, fromEl);
    return;
  }
  if (tabletApp) {
    tabletApp.destroy();
    tabletApp = null;
  }
  current = { screen: 'app', appId, moduleId };
  const host = tabletHost(meta);
  tabletApp = mountApp(host, appId, moduleId, opts);
  if (!windowEl.classList.contains('open')) animateOpen(fromEl);
  windowEl.querySelector('.win-title')?.focus({ preventScroll: true });
}

/* ---------------- Modal ---------------- */
export function modal(body, actions = [], { wide = false, dismissable = true } = {}) {
  const layer = document.querySelector('dialog.limit-screen[open]') || kos.overlayRoot;
  const previous = document.activeElement;
  let closed = false;
  const controls = () => [...panel.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])')].filter(node => !node.closest('[hidden]'));
  const isTop = () => !closed && [...document.querySelectorAll('.sheet')].filter(node => !node.hasAttribute('inert')).at(-1) === sheet;
  const keydown = event => {
    if (!isTop()) return;
    if (event.key === 'Escape' && dismissable) { event.preventDefault(); event.stopImmediatePropagation(); close(); }
    else if (event.key === 'Tab') {
      const items = controls();
      const index = items.indexOf(document.activeElement);
      if (index < 0 || (event.shiftKey ? index === 0 : index === items.length - 1)) {
        event.preventDefault(); (event.shiftKey ? items.at(-1) : items[0])?.focus();
      }
    }
  };
  const focusin = event => { if (isTop() && !panel.contains(event.target)) (controls()[0] || panel).focus(); };
  const close = () => {
    if (closed) return;
    closed = true;
    document.removeEventListener('keydown', keydown, true);
    document.removeEventListener('focusin', focusin);
    sheet.setAttribute('inert', '');
    restoreBackground();
    sheet.classList.remove('in');
    if (previous?.isConnected) previous.focus?.({ preventScroll: true });
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
  const panel = h('div.sheet-panel', { class: wide ? 'wide' : '', role: 'dialog', 'aria-modal': 'true', tabindex: '-1' }, body, actions.length ? actionsRow : null);
  const sheet = h('div.sheet', panel);
  if (dismissable) sheet.addEventListener('click', (e) => e.target === sheet && close());
  layer.appendChild(sheet);
  const restoreBackground = isolateModal(sheet);
  const heading = panel.querySelector('h1, h2, h3');
  if (heading) panel.setAttribute('aria-label', heading.textContent);
  document.addEventListener('keydown', keydown, true);
  document.addEventListener('focusin', focusin);
  (controls()[0] || panel).focus();
  requestAnimationFrame(() => { if (!closed) sheet.classList.add('in'); });
  return { close, panel };
}

/* ---------------- Föräldraspärr ---------------- */
export function parentGate(onOk) {
  const pin = kos.state.settings.pin;
  let entry = '';
  let accepted = false;
  let a;
  let b;
  if (!pin) {
    a = 6 + Math.floor(Math.random() * 4);
    b = 6 + Math.floor(Math.random() * 4);
  }
  const display = h('div.pin-display', { 'aria-hidden': 'true' });
  const code = h('input.text-input', { type: pin ? 'password' : 'text', inputmode: 'numeric', maxlength: '4', autocomplete: 'off', 'aria-label': pin ? 'Föräldrakod' : 'Svar på frågan' });
  const error = h('div.gate-error', { role: 'alert' });
  code.addEventListener('input', () => {
    entry = code.value.replace(/\D/g, '').slice(0, 4);
    code.value = entry; code.removeAttribute('aria-invalid'); error.textContent = ''; render();
  });
  const render = () => {
    code.value = entry;
    clear(display);
    if (pin) for (let i = 0; i < 4; i++) display.appendChild(h('span.pin-dot', { class: i < entry.length ? 'on' : '' }));
    else display.appendChild(h('span.pin-val', entry || ' '));
  };
  const keys = h('div.numpad.small');
  let m;
  const press = (k) => {
    if (accepted) return;
    if (k === '⌫') entry = entry.slice(0, -1);
    else if (k === 'OK') return submit();
    else if (entry.length < 4) entry += k;
    render();
    if (pin && entry.length === 4) submit();
  };
  const submit = () => {
    const ok = pin ? entry === pin : Number(entry) === a * b;
    if (ok) {
      accepted = true;
      m.close();
      onOk();
    } else {
      display.classList.add('wrong-shake');
      setTimeout(() => display.classList.remove('wrong-shake'), 500);
      entry = '';
      code.setAttribute('aria-invalid', 'true');
      error.textContent = pin ? 'Koden stämmer inte. Försök igen.' : 'Svaret stämmer inte. Försök igen.';
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
    h('div.gate', h('h2', '🔒 För vuxna'), h('p', pin ? 'Skriv föräldrakoden.' : `Vad blir ${a} × ${b}?`), pin ? null : h('small.muted', 'Tips: välj en egen fyrsiffrig kod under Inställningar → Föräldrar.'), code, display, error, keys),
    [['Avbryt', 'ghost', () => true]],
  );
  m.panel.addEventListener('keydown', event => {
    if (event.target === code && event.key !== 'Enter') return;
    if (event.key === 'Enter' && event.target.closest?.('button')?.textContent === 'Avbryt') return;
    if (/^[0-9]$/.test(event.key) || event.key === 'Backspace' || event.key === 'Enter') {
      event.preventDefault();
      if (!event.repeat) press(event.key === 'Backspace' ? '⌫' : event.key === 'Enter' ? 'OK' : event.key);
    }
  });
}

/* ---------------- Skärmtid ---------------- */
function showLimitWarning({ minutes }) {
  const content = document.querySelector('.dwin.active .win-content') || document.querySelector('.window.open .win-content') || screenEl;
  const message = `Om ungefär ${minutes} ${minutes === 1 ? 'minut' : 'minuter'} är skärmtiden slut. Avsluta det du håller på med. Aktiviteten finns kvar om en vuxen ger mer tid.`;
  let warning = content.querySelector('.time-warning');
  if (!warning) {
    warning = h('aside.time-warning', { role: 'status' });
    content.prepend(warning);
  }
  warning.textContent = message;
}

function showLimit() {
  if (kos.adapted) return adaptedLimit(); // Autismstöd: gör klart passet, sen lugn avslutning (adapted-home.js)
  if (document.querySelector('.limit-screen')) return;
  document.querySelectorAll('.time-warning').forEach(node => node.remove());
  kos.paused = true;
  const p = kos.profile;
  const ideas = ['🌳 Gå ut och leta efter något som har ändrat sig sedan i går', '📚 Läs en bok eller titta i en tidning', '🖍️ Rita på riktigt papper', '🧱 Bygg något med klossar', '💬 Berätta för någon vad du har lärt dig i dag'];
  const el = h(
    'dialog.limit-screen', { 'aria-label': 'Skärmtiden är slut' },
    h('div.limit-card', h('div.limit-emoji', '🌙'), h('h1', `Bra jobbat i dag, ${p?.name || ''}!`), h('p', 'Skärmtiden för i dag är slut. Dags för en paus – hjärnan behöver vila för att minnas allt du lärt dig.'), h('ul.limit-ideas', ideas.map((i) => h('li', i)))),
    h(
      'div.limit-actions',
      onTap(h('button.btn.btn-ghost', { type: 'button' }, '👋 Byt användare'), () => {
        closeLimit();
        kos.paused = false;
        kos.logout();
        showLock();
      }),
      onTap(h('button.btn.btn-primary', { type: 'button' }, '🔒 Vuxen: +15 min'), () =>
        parentGate(() => {
          addBonusMinutes(p, 15);
          kos.saveNow();
          kos.paused = false;
          closeLimit();
          kos.emit('tick');
        }),
      ),
    ),
  );
  el.addEventListener('cancel', event => event.preventDefault());
  const closeLimit = openDialog(el, kos.overlayRoot);
}

export function currentScreen() {
  return current;
}

export { $, APPS };
