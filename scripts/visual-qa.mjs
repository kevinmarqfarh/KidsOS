// Visuell QA: öppnar varje app och modul, tar skärmbilder och kontrollerar kontrast,
// genomskinlighet, klippt text, överlappande knappar, små tryckytor och osynliga SVG-streck.
//
//   node scripts/build.mjs --legacy-sim
//   node scripts/visual-qa.mjs --build=legacy --vp=ipadP --age=5 [--apps=write,math] [--shots] [--out=/tmp/claude-0/qa-visuell]
//   node scripts/visual-qa.mjs --themes [--build=legacy] [--out=…]   (alla bakgrunder + nattläge, hemskärm + några appar)
//
// Resultat: <out>/<build>-<vp>-<age>.json (fynd per modul) och skärmbilder som JPEG när --shots anges.
import { chromium } from 'playwright-core';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { APPS } from '../src/apps/registry.js';
import { WALLPAPERS } from '../src/core/age.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const arg = (name, def) => {
  const hit = process.argv.find((a) => a === `--${name}` || a.startsWith(`--${name}=`));
  if (!hit) return def;
  return hit.includes('=') ? hit.split('=').slice(1).join('=') : true;
};
const BUILD = arg('build', 'index');
const VP = arg('vp', 'ipadP');
const AGE = Number(arg('age', 5));
const OUT = arg('out', '/tmp/claude-0/qa-visuell');
const SHOTS = !!arg('shots', false);
const ONLY = arg('apps', '') ? String(arg('apps')).split(',') : null;
const ONLY_MODS = arg('mods', '') ? String(arg('mods')).split(',') : null;
const THEMES = !!arg('themes', false);
const VIEWPORTS = {
  ipadP: { viewport: { width: 768, height: 1024 }, isMobile: true, hasTouch: true },
  ipadL: { viewport: { width: 1024, height: 768 }, isMobile: true, hasTouch: true },
  phone: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
};
const executablePath = ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome', '/usr/bin/chromium'].find(existsSync);
const file = join(root, 'dist', BUILD === 'legacy' ? 'legacy-sim.html' : 'index.html');
mkdirSync(OUT, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const AGE_BAND = { 5: '4-5', 7: '6-7', 9: '8-9' };

/* ---------- i sidan: samla element och mått ---------- */
function collect() {
  const vw = innerWidth;
  const vh = innerHeight;
  const out = { text: [], issues: [] };
  const parse = (c) => {
    const m = c.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
    return [p[0], p[1], p[2], p[3] ?? 1];
  };
  const path = (el) => {
    const parts = [];
    for (let n = el; n && n !== document.body && parts.length < 4; n = n.parentElement) {
      const cls = [...n.classList].filter((c) => !/^(on|in|open|active|done|wp-|is-)/.test(c)).slice(0, 2).join('.');
      parts.unshift(n.tagName.toLowerCase() + (cls ? '.' + cls : ''));
    }
    return parts.join(' > ');
  };
  const visible = (el, r) => {
    if (r.width < 2 || r.height < 2) return false;
    if (r.right <= 0 || r.bottom <= 0 || r.left >= vw || r.top >= vh) return false;
    if (el.closest('[hidden], .sr-only, .visually-hidden, [aria-hidden="true"].sr')) return false;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') return false;
    // täckt av något annat? (t.ex. ett fönster ovanpå) – kontrollera mittpunkten
    const cx = Math.min(vw - 1, Math.max(0, r.left + r.width / 2));
    const cy = Math.min(vh - 1, Math.max(0, r.top + r.height / 2));
    const top = document.elementFromPoint(cx, cy);
    if (top && !el.contains(top) && !top.contains(el)) {
      // tillåt överlägg som inte tar emot tryck men ändå syns ovanpå (t.ex. dekor) – räknas som täckt
      return 'covered';
    }
    return true;
  };
  const opacityOf = (el) => {
    let o = 1;
    for (let n = el; n; n = n.parentElement) o *= Number(getComputedStyle(n).opacity);
    return o;
  };
  const onlySymbols = (t) => !/[\p{L}\p{N}]/u.test(t);
  const all = document.querySelectorAll('body *');
  const interactive = [];
  for (const el of all) {
    if (el.closest('svg') && el.tagName.toLowerCase() !== 'svg') continue;
    const tag = el.tagName.toLowerCase();
    if (['script', 'style', 'noscript', 'template', 'option'].includes(tag)) continue;
    const r = el.getBoundingClientRect();
    const isBtn = el.matches('button, [role="button"], a[href], input:not([type="hidden"]), select, [role="tab"], [role="radio"], [role="checkbox"], [role="switch"]');
    let ownText = '';
    for (const n of el.childNodes) if (n.nodeType === 3) ownText += n.textContent;
    ownText = ownText.replace(/\s+/g, ' ').trim();
    if (!isBtn && !ownText) continue;
    const vis = visible(el, r);
    if (!vis || vis === 'covered') continue;
    if (el.closest('[inert]') && !el.closest('dialog[open]')) continue;
    const cs = getComputedStyle(el);
    const op = opacityOf(el);
    const disabled = el.matches(':disabled, [aria-disabled="true"]');
    const id = path(el);
    if (isBtn) {
      interactive.push({ el, r, id, disabled });
      const tiny = r.width < 44 || r.height < 44;
      if (tiny && !el.matches('input[type="range"]')) out.issues.push({ kind: 'tryckyta', id, detail: `${Math.round(r.width)}×${Math.round(r.height)}`, text: (el.innerText || el.getAttribute('aria-label') || '').trim().slice(0, 30) });
      if (op < 0.6 && !disabled) out.issues.push({ kind: 'opacity', id, detail: op.toFixed(2), text: (el.innerText || el.getAttribute('aria-label') || '').trim().slice(0, 30) });
    }
    if (ownText) {
      if (op < 0.6 && !disabled && !isBtn) out.issues.push({ kind: 'opacity', id, detail: op.toFixed(2), text: ownText.slice(0, 30) });
      // klippt text
      const clips = (el.scrollWidth > el.clientWidth + 2 || el.scrollHeight > el.clientHeight + 4) && el.clientWidth > 0;
      if (clips && cs.textOverflow !== 'ellipsis' && /hidden|clip/.test(cs.overflowX + cs.overflowY) && !/auto|scroll/.test(cs.overflowX + cs.overflowY)) out.issues.push({ kind: 'klippt', id, detail: `${el.scrollWidth}/${el.clientWidth} × ${el.scrollHeight}/${el.clientHeight}`, text: ownText.slice(0, 40) });
      if (!onlySymbols(ownText)) {
        const range = document.createRange();
        const rects = [];
        for (const n of el.childNodes)
          if (n.nodeType === 3 && n.textContent.trim()) {
            range.selectNodeContents(n);
            for (const rr of range.getClientRects()) if (rr.width > 1 && rr.height > 1) rects.push([Math.max(0, rr.left), Math.max(0, rr.top), Math.min(vw, rr.right), Math.min(vh, rr.bottom)]);
          }
        const color = parse(cs.webkitTextFillColor && cs.webkitTextFillColor !== cs.color && !/rgba\(0, 0, 0, 0\)/.test(cs.webkitTextFillColor) ? cs.webkitTextFillColor : cs.color);
        const shadow = cs.textShadow !== 'none' ? parse(cs.textShadow) : null;
        const stroke = parseFloat(cs.webkitTextStrokeWidth) > 0 ? parse(cs.webkitTextStrokeColor) : null;
        const size = parseFloat(cs.fontSize);
        const bold = Number(cs.fontWeight) >= 700;
        if (rects.length) out.text.push({ id, text: ownText.slice(0, 40), color, opacity: op, shadow, stroke, large: size >= 24 || (bold && size >= 18.66), rects: rects.slice(0, 6), disabled });
      }
    }
  }
  // överlapp mellan knappar
  for (let i = 0; i < interactive.length; i++)
    for (let j = i + 1; j < interactive.length; j++) {
      const a = interactive[i];
      const b = interactive[j];
      if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
      // ett fönster som ligger ovanpå skrivbordsikoner är inget överlapp i layouten
      const layer = (el) => el.closest('.dwin, .window, dialog, .sheet, .taskbar, .desk-icons');
      if (layer(a.el) !== layer(b.el)) continue;
      const w = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left);
      const h = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top);
      if (w > 4 && h > 4) out.issues.push({ kind: 'overlapp', id: `${a.id}  ⟷  ${b.id}`, detail: `${Math.round(w)}×${Math.round(h)}` });
    }
  // SVG-streck/fyllning som blir osynliga
  for (const s of document.querySelectorAll('svg path, svg line, svg polyline, svg polygon, svg circle, svg ellipse, svg rect, svg text')) {
    const r = s.getBoundingClientRect();
    if (r.width < 2 && r.height < 2) continue;
    if (r.right <= 0 || r.bottom <= 0 || r.left >= vw || r.top >= vh) continue;
    if (s.closest('defs, clipPath, mask, symbol, [hidden]')) continue;
    const cs = getComputedStyle(s);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    const st = parse(cs.stroke) || [0, 0, 0, 0];
    const fi = parse(cs.fill) || [0, 0, 0, 0];
    const noStroke = cs.stroke === 'none' || st[3] === 0 || parseFloat(cs.strokeWidth) === 0 || Number(cs.strokeOpacity) === 0;
    const noFill = (cs.fill === 'none' || fi[3] === 0 || Number(cs.fillOpacity) === 0) && !/^url\(/.test(cs.fill);
    // genomskinlig cirkel bredvid synligt innehåll i samma <g> = avsiktlig tryckyta
    const hitZone = s.parentElement?.tagName.toLowerCase() === 'g' && s.parentElement.children.length > 1;
    if (noStroke && noFill && !hitZone && Number(cs.opacity) > 0 && cs.pointerEvents !== 'all' && !s.matches('[class*="hit"], [class*="target"]')) out.issues.push({ kind: 'svg-osynlig', id: path(s.closest('svg')) + ' ' + s.tagName + (s.getAttribute('class') ? '.' + s.getAttribute('class').split(' ')[0] : ''), detail: `stroke=${cs.stroke} fill=${cs.fill}` });
  }
  // fokusram på programmatiskt fokuserat element
  const a = document.activeElement;
  if (a && a !== document.body) {
    const cs = getComputedStyle(a);
    if (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) out.issues.push({ kind: 'fokusram', id: path(a), detail: `${cs.outlineWidth} ${cs.outlineStyle} ${cs.outlineColor}`, text: (a.innerText || '').trim().slice(0, 30) });
  }
  return out;
}

/* ---------- i hjälpsidan: kontrast mot skärmbildens pixlar ---------- */
async function contrastInPage({ png, items, dpr }) {
  const img = new Image();
  img.src = 'data:image/png;base64,' + png;
  await img.decode();
  const c = document.createElement('canvas');
  c.width = img.width;
  c.height = img.height;
  const g = c.getContext('2d', { willReadFrequently: true });
  g.drawImage(img, 0, 0);
  const data = g.getImageData(0, 0, c.width, c.height).data;
  const lin = (v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  const L = (p) => 0.2126 * lin(p[0]) + 0.7152 * lin(p[1]) + 0.0722 * lin(p[2]);
  const ratio = (a, b) => {
    const x = L(a);
    const y = L(b);
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
  };
  const res = [];
  for (const it of items) {
    if (!it.color) continue;
    const samples = [];
    for (const [x0, y0, x1, y1] of it.rects) {
      const nx = 6;
      const ny = 4;
      for (let i = 0; i < nx; i++)
        for (let j = 0; j < ny; j++) {
          const x = Math.floor((x0 + ((i + 0.5) / nx) * (x1 - x0)) * dpr);
          const y = Math.floor((y0 + ((j + 0.5) / ny) * (y1 - y0)) * dpr);
          if (x < 0 || y < 0 || x >= c.width || y >= c.height) continue;
          const k = (y * c.width + x) * 4;
          samples.push([data[k], data[k + 1], data[k + 2]]);
        }
    }
    if (!samples.length) continue;
    const ratios = samples
      .map((bg) => {
        const a = it.color[3] * it.opacity;
        const fg = [0, 1, 2].map((i) => it.color[i] * a + bg[i] * (1 - a));
        let r = ratio(fg, bg);
        // en tydlig kontur/skugga gör texten läsbar även på svår bakgrund
        for (const extra of [it.shadow, it.stroke]) if (extra && extra[3] > 0.5) r = Math.max(r, Math.min(ratio(fg, extra), 4.5));
        return r;
      })
      .sort((a, b) => a - b);
    const p20 = ratios[Math.floor(ratios.length * 0.2)];
    const need = it.large ? 3 : 4.5;
    if (p20 < need) {
      const bg = samples[Math.floor(samples.length / 2)];
      res.push({ kind: 'kontrast', id: it.id, text: it.text, detail: `${p20.toFixed(2)}:1 (krav ${need}) text=rgba(${it.color.map((v) => Math.round(v * 100) / 100).join(',')})·op${it.opacity.toFixed(2)} bg≈rgb(${bg.join(',')})`, ratio: p20, disabled: it.disabled });
    }
  }
  return res;
}

const HIDE_TEXT = `*,*::before,*::after{color:transparent!important;-webkit-text-fill-color:transparent!important;text-shadow:none!important;-webkit-text-stroke:0!important;caret-color:transparent!important;transition:none!important;animation-play-state:paused!important}`;

async function main() {
  const browser = await chromium.launch({ executablePath });
  const dev = VIEWPORTS[VP];
  const ctx = await browser.newContext({ ...dev, deviceScaleFactor: 1, locale: 'sv-SE', reducedMotion: 'reduce' });
  await ctx.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
  const page = await ctx.newPage();
  const helper = await ctx.newPage();
  await helper.setContent('<canvas></canvas>');
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('file://' + file);
  await page.waitForFunction(() => window.kidsos?.kos);

  async function login({ age, wallpaper = 'sky', theme = 'day' }) {
    await page.evaluate(
      ({ age, band, wallpaper, theme }) => {
        const k = window.kidsos.kos;
        const p = k.createProfile({ name: 'Testbarn', age, ageBand: band, wallpaper });
        p.settings.readAloud = 'off';
        p.settings.showAllModules = true;
        p.settings.sound = false;
        k.state.settings.theme = theme;
        k.login(p.id);
        k.applySettings();
        window.kidsos.goHome();
      },
      { age, band: AGE_BAND[age], wallpaper, theme },
    );
    await sleep(400);
  }

  async function closeAll() {
    await page.evaluate(() => {
      document.querySelectorAll('dialog[open] .sheet-actions button, .sheet .btn-ghost').forEach(() => {});
      document.querySelectorAll('.dwin-btn.close').forEach((b) => b.click());
      document.querySelectorAll('dialog[open]').forEach((d) => d.close?.());
      document.querySelectorAll('.sheet').forEach((s) => s.remove());
    });
    await sleep(250);
    await page.evaluate(() => window.kidsos.goHome());
  }

  /** Väntar tills öppningsanimationer (fönster, ord som tonas in …) är klara – annars mäts halvgenomskinliga mellanlägen. */
  async function settle() {
    await page.evaluate(async () => {
      const finite = () => document.getAnimations().filter((a) => a.playState === 'running' && Number.isFinite(a.effect?.getComputedTiming?.().endTime));
      const deadline = performance.now() + 4000;
      // skrivbordsfönster får klassen .opening i två bildrutor innan övergången startar
      while (document.querySelector('.dwin.opening, .window.closing, .dwin.closing') && performance.now() < deadline) await new Promise((r) => setTimeout(r, 50));
      while (finite().length && performance.now() < deadline) await Promise.race([Promise.all(finite().map((a) => a.finished.catch(() => {}))), new Promise((r) => setTimeout(r, 300))]);
    });
    await sleep(120);
  }

  async function check(label) {
    await page.evaluate(() => document.querySelectorAll('style[data-qa-hide]').forEach((s) => s.remove()));
    await settle();
    const found = await page.evaluate(collect);
    if (SHOTS) await page.screenshot({ path: join(OUT, 'shots', `${BUILD}-${VP}-${AGE}`, `${label}.jpg`), type: 'jpeg', quality: 60 });
    // Samma vy utan text: ger den verkliga bakgrunden bakom varje text (gradienter, bilder, genomskinliga lager).
    await page.evaluate((css) => {
      const s = document.createElement('style');
      s.dataset.qaHide = '';
      s.textContent = css;
      document.head.appendChild(s);
    }, HIDE_TEXT);
    await sleep(30);
    const clean = await page.screenshot({ type: 'png' });
    await page.evaluate(() => document.querySelectorAll('style[data-qa-hide]').forEach((s) => s.remove()));
    const contrast = await helper.evaluate(contrastInPage, { png: clean.toString('base64'), items: found.text, dpr: 1 });
    return [...found.issues, ...contrast];
  }

  const results = [];
  if (SHOTS) mkdirSync(join(OUT, 'shots', `${BUILD}-${VP}-${AGE}`), { recursive: true });

  if (THEMES) {
    const sample = [['home'], ['write', 'upper'], ['math', 'count'], ['svenska', 'letterpic'], ['space', 'solar']];
    for (const theme of ['day', 'night'])
      for (const wp of WALLPAPERS) {
        await login({ age: AGE, wallpaper: wp.id, theme });
        for (const [appId, modId] of sample) {
          if (appId !== 'home') await page.evaluate(([a, m]) => window.kidsos.openApp(a, m), [appId, modId]);
          await sleep(700);
          const label = `${theme}-${wp.id}-${appId}${modId ? '-' + modId : ''}`;
          results.push({ label, issues: await check(label) });
          await closeAll();
        }
        await page.evaluate(() => {
          const k = window.kidsos.kos;
          k.logout();
        });
      }
  } else {
    await login({ age: AGE });
    const targets = [];
    if (!ONLY || ONLY.includes('home')) targets.push(['home', null]);
    for (const app of APPS) {
      if (ONLY && !ONLY.includes(app.id)) continue;
      for (const m of app.modules) if (!ONLY_MODS || ONLY_MODS.includes(m.id)) targets.push([app.id, m.id]);
    }
    for (const extra of ['trophies', 'settings']) if (!ONLY || ONLY.includes(extra)) targets.push([extra, null]);
    for (const [appId, modId] of targets) {
      const label = `${appId}${modId ? '-' + modId : ''}`;
      try {
        if (appId !== 'home') await page.evaluate(([a, m]) => window.kidsos.openApp(a, m), [appId, modId]);
        await sleep(650);
        results.push({ label, issues: await check(label) });
      } catch (e) {
        results.push({ label, error: String(e.message).slice(0, 200) });
      }
      await closeAll();
    }
  }
  const name = THEMES ? `themes-${BUILD}-${VP}-${AGE}` : `${BUILD}-${VP}-${AGE}`;
  writeFileSync(join(OUT, `${name}.json`), JSON.stringify({ build: BUILD, vp: VP, age: AGE, errors, results }, null, 1));
  const n = results.reduce((s, r) => s + (r.issues?.length || 0), 0);
  console.log(`${name}: ${results.length} vyer, ${n} fynd, ${errors.length} sidfel`);
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
