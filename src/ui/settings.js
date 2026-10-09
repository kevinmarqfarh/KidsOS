// Inställningar: barnets egna val + föräldrapanel (bakom föräldraspärr).
import { h, clear, onTap } from './dom.js';
import { kos } from './kos.js';
import { APPS } from '../apps/registry.js';
import { AVATARS, WALLPAPERS, LEVELS, schoolLabelForAge } from '../core/age.js';
import { appStat, currentLevel, dateKey, secondsToday } from '../core/model.js';
import { curriculumFor, CURRICULUM } from '../core/curriculum.js';
import { exportBackup, importBackup, wipeAll, deleteDrawingsFor, isPersistent } from '../core/storage.js';
import { hasSwedishVoice } from '../core/speech.js';
import { TROPHIES } from '../core/trophies.js';

export function renderSettings(el, { parentGate, profileWizard, showLock, goHome, modal, refresh }) {
  const p = kos.profile;
  const kid = h('section.set-section');
  const parentBtn = h('button.btn.btn-primary.btn-xl', { type: 'button' }, '🔒 Föräldrainställningar');
  el.append(h('div.settings', kid, h('section.set-section.center', h('p.muted', 'Profiler, skärmtid, nivåer, rapport mot läroplanen och säkerhetskopia.'), parentBtn)));
  onTap(parentBtn, () => parentGate(() => renderParent(el)));

  function renderKid() {
    clear(kid).append(
      h('h2', `Mina inställningar`),
      row('Min figur', h('div.pick-grid.avatars', AVATARS.map((a) => onTap(h('button.pick.pick-av', { type: 'button', class: p.avatar === a ? 'on' : '' }, a), () => {
        p.avatar = a;
        kos.saveNow();
        renderKid();
      })))),
      row('Bakgrund', h('div.pick-row', WALLPAPERS.map((w) => onTap(h('button.pick.pick-wp', { type: 'button', class: `${p.wallpaper === w.id ? 'on' : ''} wp-${w.id}` }, h('span', w.emoji), h('small', w.name)), () => {
        p.wallpaper = w.id;
        kos.saveNow();
        renderKid();
      })))),
      row('Uppläsning', seg([['auto', 'Automatisk'], ['on', 'Alltid'], ['off', 'Av']], p.settings.readAloud, (v) => {
        p.settings.readAloud = v;
        kos.applySettings();
        kos.saveNow();
        renderKid();
        if (v !== 'off') kos.say('Nu läser jag högt för dig.');
      })),
      !hasSwedishVoice() ? h('p.muted', 'ℹ️ Ingen svensk röst hittades i den här webbläsaren. På iPad: Inställningar → Hjälpmedel → Uppläst innehåll → Röster → Svenska.') : null,
    );
  }
  renderKid();

  /* ---------------- Föräldrapanel ---------------- */
  function renderParent(root) {
    clear(root);
    let selId = p?.id || kos.state.profiles[0]?.id;
    const wrap = h('div.settings.parent');
    root.append(wrap);
    const render = () => {
      const kidP = kos.state.profiles.find((x) => x.id === selId);
      clear(wrap);
      wrap.append(
        h('h2', '👨‍👩‍👧 Föräldrar'),
        h('div.chip-row', kos.state.profiles.map((x) => onTap(h('button.chip-btn', { type: 'button', class: x.id === selId ? 'on' : '' }, `${x.avatar} ${x.name}`), () => {
          selId = x.id;
          render();
        })), onTap(h('button.chip-btn', { type: 'button' }, '＋ Ny profil'), () => profileWizard({ onDone: () => render() }))),
      );
      if (kidP) {
        wrap.append(reportSection(kidP), profileSection(kidP, render), levelSection(kidP, render), timeSection(kidP, render), appsSection(kidP, render));
      }
      wrap.append(globalSection(render), backupSection(), aboutSection());
    };
    render();
  }

  function profileSection(kp, render) {
    return h(
      'section.set-section',
      h('h3', `Profil: ${kp.name}`),
      h('p.muted', `${kp.age} år · ${schoolLabelForAge(kp.age)} · skapad ${new Date(kp.createdAt).toLocaleDateString('sv-SE')}`),
      h('div.set-row', h('span', 'Utseende'), seg([['auto', `Efter ålder (${kp.age >= 8 ? 'dator' : 'surfplatta'})`], ['tablet', '📱 Surfplatta'], ['desktop', '💻 Dator']], kp.settings.layout || 'auto', (v) => {
        kp.settings.layout = v;
        kos.saveNow();
        render();
        if (kp.id === kos.state.activeId) kos.toast('Det nya utseendet syns när du går tillbaka till startskärmen.', { icon: '💻' });
      })),
      h('p.muted', 'Surfplattan har stora ikoner och ett fönster i taget – bäst för de yngsta. Datorn har skrivbord, fönster som kan flyttas, aktivitetsfält och startmeny – roligt för äldre barn.'),
      h(
        'div.row-actions.left',
        onTap(h('button.btn.btn-ghost', { type: 'button' }, '✏️ Redigera namn, ålder, figur'), () => profileWizard({ edit: kp, onDone: render })),
        onTap(h('button.btn.btn-danger', { type: 'button' }, '🗑️ Ta bort profil'), () =>
          modal(h('div', h('h2', `Ta bort ${kp.name}?`), h('p', 'Alla stjärnor, troféer och teckningar för profilen raderas. Det går inte att ångra.')), [
            ['Avbryt', 'ghost', () => true],
            [
              'Ta bort',
              'danger',
              () => {
                kos.state.profiles = kos.state.profiles.filter((x) => x.id !== kp.id);
                deleteDrawingsFor(kp.id);
                if (kos.state.activeId === kp.id) kos.state.activeId = null;
                kos.saveNow();
                if (!kos.state.activeId) showLock();
                else render();
                return true;
              },
            ],
          ]),
        ),
      ),
    );
  }

  function levelSection(kp, render) {
    const rows = APPS.filter((a) => a.modules.some((m) => m.gen) || ['write', 'code'].includes(a.id)).map((a) => {
      const auto = appStat(kp, a.id).level;
      const ov = kp.levelOverride?.[a.id];
      const sel = h(
        'select.select',
        { 'aria-label': `Nivå för ${a.name}`, id: `lvl-${kp.id}-${a.id}` },
        h('option', { value: '' }, `Automatisk (nu ${LEVELS[auto].short})`),
        LEVELS.map((L) => h('option', { value: String(L.level), selected: ov !== undefined && ov !== null && ov !== '' && Number(ov) === L.level }, `${L.emoji} ${L.short} – ${L.school}`)),
      );
      sel.addEventListener('change', () => {
        if (sel.value === '') delete kp.levelOverride[a.id];
        else kp.levelOverride[a.id] = Number(sel.value);
        kos.saveNow();
      });
      return h('div.set-row', h('span', `${a.icon} ${a.name}`), sel);
    });
    return h(
      'section.set-section',
      h('h3', '🎚️ Svårighetsnivå'),
      h('p.muted', 'Automatisk betyder att KidsOS anpassar nivån: fem rätt i rad på första försöket ger nästa nivå, tre missar i rad ger en lättare. Låser du en nivå sker ingen anpassning.'),
      ...rows,
      h('div.set-row', h('span', 'Visa alla moduler (även låsta)'), toggle(kp.settings.showAllModules, (v) => {
        kp.settings.showAllModules = v;
        kos.saveNow();
      })),
    );
  }

  function timeSection(kp, render) {
    const today = Math.round(secondsToday(kp) / 60);
    const options = [0, 15, 20, 30, 45, 60, 90];
    return h(
      'section.set-section',
      h('h3', '⏳ Skärmtid'),
      h('p.muted', `I dag: ${today} min. När tiden är slut visas en paus-skärm med förslag på aktiviteter utan skärm.`),
      h('div.set-row', h('span', 'Max per dag'), seg(options.map((o) => [String(o), o ? `${o} min` : 'Ingen gräns']), String(kp.settings.dailyLimitMin || 0), (v) => {
        kp.settings.dailyLimitMin = Number(v);
        kos.saveNow();
        render();
      })),
    );
  }

  function appsSection(kp, render) {
    return h(
      'section.set-section',
      h('h3', '📱 Appar på hemskärmen'),
      ...APPS.map((a) =>
        h('div.set-row', h('span', `${a.icon} ${a.name}`), toggle(!kp.settings.hiddenApps.includes(a.id), (on) => {
          const s = new Set(kp.settings.hiddenApps);
          if (on) s.delete(a.id);
          else s.add(a.id);
          kp.settings.hiddenApps = [...s];
          kos.saveNow();
        })),
      ),
    );
  }

  function reportSection(kp) {
    // tid senaste 7 dagarna
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const k = dateKey(d);
      days.push({ label: d.toLocaleDateString('sv-SE', { weekday: 'short' }), min: Math.round((kp.days[k] || 0) / 60) });
    }
    const maxMin = Math.max(10, ...days.map((d) => d.min));
    const chart = h('div.mini-bars', days.map((d) => h('div.mb', h('i', { style: { height: `${(d.min / maxMin) * 100}%` }, title: `${d.min} min` }), h('small', d.label), h('b', d.min ? `${d.min}` : ''))));
    // ämnen
    const subjRows = APPS.map((a) => {
      const st = kp.stats[a.id];
      const rounds = st?.rounds || 0;
      const tot = (st?.correct || 0) + (st?.wrong || 0);
      const acc = tot ? Math.round(((st?.correct || 0) / tot) * 100) : null;
      return h('tr', h('td', `${a.icon} ${a.name}`), h('td', LEVELS[currentLevel(kp, a.id)].short), h('td', String(rounds)), h('td', acc === null ? '–' : `${acc} %`));
    });
    // läroplan
    const practiced = new Set();
    for (const a of APPS) {
      for (const m of a.modules) {
        const st = kp.stats[a.id]?.modules?.[m.id];
        const viaSet = m.view && (kp.sets?.appsTried?.[a.id]);
        if ((st && st.rounds > 0) || (viaSet && moduleTouched(kp, a.id, m))) (m.lgr || []).forEach((id) => practiced.add(id));
      }
    }
    const bySubject = {};
    for (const [id, c] of Object.entries(CURRICULUM)) {
      (bySubject[c.subject] ||= []).push({ id, ...c, done: practiced.has(id) });
    }
    const curr = h(
      'div.curr',
      Object.entries(bySubject).map(([subj, list]) =>
        h('details.curr-subj', h('summary', h('b', subj), h('small', ` ${list.filter((x) => x.done).length}/${list.length} områden övade`)), h('ul', list.map((c) => h('li', { class: c.done ? 'done' : '' }, h('span', c.done ? '✅' : '⬜'), h('div', h('small', c.area), h('span', c.text)))))),
      ),
    );
    return h(
      'section.set-section',
      h('h3', `📊 Rapport för ${kp.name}`),
      h('div.tr-stats', h('div.tr-stat', h('span', '⭐'), h('b', String(kp.stars)), h('small', 'stjärnor')), h('div.tr-stat', h('span', '🏆'), h('b', `${Object.keys(kp.trophies).length}/${TROPHIES.length}`), h('small', 'troféer')), h('div.tr-stat', h('span', '🔥'), h('b', String(kp.streak?.best || 0)), h('small', 'bästa svit'))),
      h('h4', 'Minuter per dag (senaste veckan)'),
      chart,
      h('h4', 'Ämnen'),
      h('div.table-wrap', h('table.protocol', h('thead', h('tr', h('th', 'App'), h('th', 'Nivå'), h('th', 'Rundor'), h('th', 'Rätt direkt'))), h('tbody', subjRows))),
      h('h4', 'Läroplanen (Lgr22, centralt innehåll F–3)'),
      h('p.muted', 'Områden som barnet har övat på i KidsOS. Det här är ett komplement till skolan – inte en bedömning.'),
      curr,
    );
  }

  function moduleTouched(kp, appId, m) {
    const map = { trace: `traced:${m.set}`, robot: 'robotLevels', turtle: 'turtle', solar: 'planets', moon: 'moonPhases', stars: 'constellations', daynight: 'daynight', body: 'bodyParts', stories: 'stories', wonder: 'wonders' };
    if (m.view === 'draw') return (kp.counters?.drawings || 0) > 0;
    if (m.view === 'rocket') return (kp.counters?.rocketLaunch || 0) > 0;
    if (['float', 'magnet', 'shadow', 'water', 'seesaw', 'slide', 'mix'].includes(m.view)) return !!kp.sets?.experiments?.[m.id];
    if (m.set === 'name') return (kp.counters?.tracedName || 0) > 0;
    const key = map[m.view];
    return key ? Object.keys(kp.sets?.[key] || {}).length > 0 : false;
  }

  function globalSection(render) {
    const s = kos.state.settings;
    const pinInput = h('input.text-input#pin-input', { type: 'password', inputmode: 'numeric', maxlength: '4', placeholder: s.pin ? 'Ny kod (4 siffror)' : 'Välj kod (4 siffror)', autocomplete: 'off' });
    return h(
      'section.set-section',
      h('h3', '⚙️ Allmänt'),
      h('div.set-row', h('span', 'Ljudeffekter'), toggle(s.sound, (v) => {
        s.sound = v;
        kos.applySettings();
        kos.saveNow();
      })),
      h('div.set-row', h('span', 'Uppläsningstakt'), seg([['0.78', 'Långsam'], ['0.92', 'Normal'], ['1.05', 'Snabb']], String(s.speechRate), (v) => {
        s.speechRate = Number(v);
        kos.applySettings();
        kos.saveNow();
        kos.say('Så här låter det nu.');
        render();
      })),
      h('div.set-row', h('span', 'Tema'), seg([['day', '☀️ Dag'], ['night', '🌙 Natt'], ['auto', '🌗 Som enheten']], s.theme, (v) => {
        s.theme = v;
        kos.applySettings();
        kos.saveNow();
        render();
      })),
      h('div.set-row', h('span', `Föräldrakod ${s.pin ? '(aktiv)' : '(av – räknefråga används)'}`), h('div.inline', pinInput, onTap(h('button.btn.btn-ghost.btn-sm', { type: 'button' }, 'Spara kod'), () => {
        if (!/^\d{4}$/.test(pinInput.value)) {
          pinInput.classList.add('wrong-shake');
          setTimeout(() => pinInput.classList.remove('wrong-shake'), 500);
          return;
        }
        s.pin = pinInput.value;
        kos.saveNow();
        kos.toast('Föräldrakoden är sparad.', { icon: '🔒' });
        render();
      }), s.pin ? onTap(h('button.btn.btn-ghost.btn-sm', { type: 'button' }, 'Ta bort'), () => {
        s.pin = null;
        kos.saveNow();
        render();
      }) : null)),
    );
  }

  function backupSection() {
    const out = h('textarea.text-area#backup-out', { readonly: true, rows: '3', placeholder: 'Tryck på "Skapa säkerhetskopia".' });
    const inp = h('textarea.text-area#backup-in', { rows: '3', placeholder: 'Klistra in en säkerhetskopia här för att återställa.' });
    const status = h('p.muted', { 'aria-live': 'polite' });
    return h(
      'section.set-section',
      h('h3', '💾 Säkerhetskopia'),
      h('p.muted', isPersistent() ? 'Allt sparas på den här enheten. Kopiera texten och spara den (t.ex. i Anteckningar) för att flytta framsteg till en annan enhet.' : '⚠️ Lagring är inte tillgänglig i den här webbläsaren – gör en säkerhetskopia innan du stänger.'),
      h(
        'div.row-actions.left',
        onTap(h('button.btn.btn-ghost', { type: 'button' }, '📤 Skapa säkerhetskopia'), async () => {
          out.value = exportBackup(kos.state);
          out.select();
          try {
            await navigator.clipboard.writeText(out.value);
            status.textContent = '✅ Kopierad! Klistra in den någonstans säkert.';
          } catch {
            status.textContent = 'Markera texten och kopiera den.';
          }
        }),
      ),
      out,
      inp,
      h(
        'div.row-actions.left',
        onTap(h('button.btn.btn-ghost', { type: 'button' }, '📥 Återställ från text'), () => {
          try {
            kos.state = importBackup(inp.value.trim());
            kos.saveNow();
            status.textContent = '✅ Återställt!';
            setTimeout(showLock, 600);
          } catch (e) {
            status.textContent = `❌ ${e.message || 'Kunde inte läsa säkerhetskopian.'}`;
          }
        }),
        onTap(h('button.btn.btn-danger', { type: 'button' }, '⚠️ Radera allt'), () =>
          modal(h('div', h('h2', 'Radera allt?'), h('p', 'Alla profiler, stjärnor, troféer och teckningar på den här enheten raderas.')), [
            ['Avbryt', 'ghost', () => true],
            [
              'Radera allt',
              'danger',
              () => {
                wipeAll(kos.state);
                kos.state = { ...kos.state, profiles: [], activeId: null };
                kos.saveNow();
                showLock();
                return true;
              },
            ],
          ]),
        ),
      ),
      status,
    );
  }

  function aboutSection() {
    return h(
      'section.set-section',
      h('h3', 'ℹ️ Om KidsOS'),
      h('p', 'KidsOS är byggt kring nyfikenhet, kreativitet och lärande. Innehållet följer Skolverkets läroplan (Lgr22) för förskoleklass och årskurs 1–3, och designen bygger på forskning om hur barn använder pekskärmar: stora tryckytor, ingen tidspress, inga straff och uppläsning för de som inte läser själva än.'),
      h('p.muted', 'Inga annonser. Ingen data lämnar enheten.'),
    );
  }

  return () => {};

  /* ---- små komponenter ---- */
  function row(label, control) {
    return h('div.set-block', h('span.set-label', label), control);
  }
  function seg(options, value, onChange) {
    return h('div.seg.wrap', options.map(([v, label]) => onTap(h('button.seg-btn', { type: 'button', class: String(v) === String(value) ? 'on' : '' }, label), () => onChange(v))));
  }
  function toggle(on, onChange) {
    const b = h('button.toggle', { type: 'button', role: 'switch', 'aria-checked': String(!!on), class: on ? 'on' : '' }, h('i'));
    onTap(b, () => {
      const v = !b.classList.contains('on');
      b.classList.toggle('on', v);
      b.setAttribute('aria-checked', String(v));
      onChange(v);
    });
    return b;
  }
}
