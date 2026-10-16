// Regressionstester från den funktionella buggjakten (okt 2026). Kör: npm run build && node --test tests/e2e/qa-functional.test.mjs
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { chromium } from 'playwright-core';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const APP_URL = `file://${join(root, 'dist', 'index.html')}`;
const executablePath = [process.env.CHROME_PATH, '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/chromium', '/usr/bin/google-chrome'].filter(Boolean).find((p) => existsSync(p));
const TABLET = { viewport: { width: 768, height: 1024 }, isMobile: true, hasTouch: true };
const DESKTOP = { viewport: { width: 1280, height: 800 } };

let browser;
before(async () => { browser = await chromium.launch({ executablePath }); });
after(async () => { await browser?.close(); });

async function open(device = TABLET) {
  const ctx = await browser.newContext({ ...device, locale: 'sv-SE' });
  await ctx.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && !/ERR_FAILED|net::/.test(m.text()) && errors.push(m.text()));
  await page.goto(APP_URL);
  await page.waitForSelector('.lock');
  return { ctx, page, errors };
}

async function login(page, { age = 7, layout = 'tablet', adapted = false, settings = {} } = {}) {
  return page.evaluate(([age, layout, adapted, settings]) => {
    const k = window.kidsos.kos;
    const p = k.createProfile({ name: `Test${age}`, age, adapted });
    Object.assign(p.settings, { layout, readAloud: 'off' }, settings);
    k.login(p.id);
    window.kidsos.goHome();
    return p.id;
  }, [age, layout, adapted, settings]);
}

async function approveGate(page) {
  const [, a, b] = /(\d+) × (\d+)/.exec(await page.locator('.gate p').innerText());
  for (const d of String(Number(a) * Number(b))) await page.locator('.gate .np-key', { hasText: new RegExp(`^${d}$`) }).click();
  await page.locator('.gate .np-key.ok').click();
}

test('skärmtiden: gränsen visas direkt när en profil som redan är slut loggar in igen', async () => {
  const { ctx, page, errors } = await open();
  await login(page, { settings: { dailyLimitMin: 1 } });
  await page.evaluate(() => { const p = window.kidsos.kos.profile; p.days[Object.keys(p.days)[0]] = 90; window.kidsos.kos.tick(); });
  await page.waitForSelector('.limit-screen');
  await page.getByRole('button', { name: '👋 Byt användare' }).click();
  await page.locator('.who-bubble').first().click();
  // Tidigare kom gränsen först vid nästa tick (upp till 10 s) – barnet kunde spela vidare.
  await page.waitForSelector('.limit-screen', { timeout: 2000 });
  assert.equal(await page.evaluate(() => window.kidsos.kos.paused), true);
  assert.deepEqual(errors, []);
  await ctx.close();
});

test('säkerhetskopia: återställning loggar ut och använder kopians tema direkt', async () => {
  const { ctx, page, errors } = await open();
  const id = await login(page);
  await page.evaluate(() => window.kidsos.openApp('settings'));
  await page.getByRole('button', { name: '🔒 Föräldrainställningar' }).click();
  await approveGate(page);
  await page.getByRole('button', { name: '📤 Skapa säkerhetskopia' }).click();
  const backup = await page.locator('#backup-out').inputValue();
  assert.ok(backup.includes(id));
  await page.getByRole('button', { name: '🌙 Natt' }).click();
  assert.equal(await page.evaluate(() => document.documentElement.dataset.ostheme), 'night');
  await page.fill('#backup-in', backup);
  await page.getByRole('button', { name: '📥 Återställ från text' }).click();
  await page.waitForSelector('.who-bubble');
  assert.equal(await page.evaluate(() => document.documentElement.dataset.ostheme), 'day');
  // Ingen profil får vara aktiv bakom låsskärmen (då räknas skärmtid).
  assert.equal(await page.evaluate(() => window.kidsos.kos.state.activeId), null);
  assert.deepEqual(errors, []);
  await ctx.close();
});

test('sortering: ett tryck på en sak som redan ligger i lådan lägger den valda saken där', async () => {
  const { ctx, page, errors } = await open();
  await login(page, { age: 5 });
  let checked = false;
  for (let attempt = 0; attempt < 6 && !checked; attempt++) {
    await page.evaluate(() => { window.kidsos.q = null; window.kidsos.openApp('science', 'waterforms'); });
    await page.waitForSelector('.sort-item');
    const items = await page.evaluate(() => window.kidsos.q.items.map((i) => ({ id: i.id, bin: i.bin })));
    const placed = new Set();
    for (const it of items) {
      await page.locator(`.sort-item[data-id="${it.id}"]`).click();
      const inBin = page.locator(`.sort-bin[data-bin="${it.bin}"] .sort-item.placed`);
      if (await inBin.count()) {
        // Tryck mitt på en redan placerad sak i rätt låda.
        const box = await inBin.first().boundingBox();
        await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
        checked = true;
      } else await page.locator(`.sort-bin[data-bin="${it.bin}"] .bin-head`).click();
      assert.equal(await page.locator(`.sort-bin[data-bin="${it.bin}"] .sort-item[data-id="${it.id}"].placed`).count(), 1, `${it.id} hamnade inte i ${it.bin}`);
      placed.add(it.id);
    }
    await page.locator('.btn-next').waitFor();
  }
  assert.ok(checked, 'ingen låda fick två saker – testet prövade inte buggen');
  assert.deepEqual(errors, []);
  await ctx.close();
});

test('autismstöd: andningspausens klocka stannar när barnet går hem mitt i pausen', async () => {
  const { ctx, page, errors } = await open();
  await page.addInitScript(() => {});
  await login(page, { age: 6, adapted: true });
  await page.evaluate(() => {
    const si = window.setInterval, ci = window.clearInterval, live = new Set();
    window.__liveIntervals = live;
    window.setInterval = (f, ms, ...r) => { const id = si(f, ms, ...r); if (ms === 100) live.add(id); return id; };
    window.clearInterval = (id) => { live.delete(id); return ci(id); };
  });
  await page.evaluate(() => window.kidsos.openApp('math', 'count'));
  await page.locator('.ad-pause').click();
  await page.waitForSelector('.ad-pause-screen');
  assert.equal(await page.evaluate(() => window.__liveIntervals.size), 1);
  await page.locator('.win-home').click();
  await page.waitForTimeout(400);
  assert.equal(await page.evaluate(() => window.__liveIntervals.size), 0);
  assert.equal(await page.evaluate(() => window.kidsos.kos.paused), false);
  assert.deepEqual(errors, []);
  await ctx.close();
});

test('dator-läge: ett fönster får tillbaka sin storlek när skärmen blir bred igen', async () => {
  const { ctx, page, errors } = await open(DESKTOP);
  await login(page, { age: 9, layout: 'desktop' });
  await page.evaluate(() => window.kidsos.openApp('draw'));
  const win = page.locator('.dwin[data-app="draw"]');
  await win.waitFor();
  await page.waitForTimeout(300);
  const wide = await win.boundingBox();
  await page.setViewportSize({ width: 720, height: 800 });
  await page.waitForTimeout(500);
  assert.ok((await win.boundingBox()).width <= 720);
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.waitForTimeout(500);
  assert.equal(Math.round((await win.boundingBox()).width), Math.round(wide.width));
  assert.deepEqual(errors, []);
  await ctx.close();
});

test('apphubben visar upplåsta moduler före låsta', async () => {
  const { ctx, page, errors } = await open();
  await login(page, { age: 5 });
  await page.evaluate(() => window.kidsos.openApp('math'));
  await page.waitForSelector('.mod-tile');
  const locked = await page.$$eval('.mod-tile[data-mod]', (els) => els.filter((e) => e.dataset.mod !== 'build-world-link').map((e) => e.classList.contains('locked')));
  assert.ok(locked.includes(true) && locked.includes(false));
  assert.equal(locked.indexOf(true), locked.lastIndexOf(false) + 1, 'en låst modul ligger före en upplåst');
  assert.deepEqual(errors, []);
  await ctx.close();
});

test('tema "Som enheten" i mörkt läge använder nattreglerna (nivåchipet syns)', async () => {
  const { ctx, page, errors } = await open({ ...TABLET, colorScheme: 'dark' });
  await login(page, { age: 6 });
  await page.evaluate(() => { const k = window.kidsos.kos; k.state.settings.theme = 'auto'; k.applySettings(); });
  assert.equal(await page.evaluate(() => document.documentElement.dataset.ostheme), 'night');
  await page.evaluate(() => window.kidsos.openApp('math', 'count'));
  const [ink, bg] = await page.locator('.level-chip').evaluate((el) => [getComputedStyle(el).color, getComputedStyle(el).backgroundColor]);
  // Tidigare: ljus text (#eef2ff) på nästan vit bakgrund.
  assert.equal(ink, 'rgb(31, 42, 68)', `${ink} på ${bg}`);
  await page.emulateMedia({ colorScheme: 'light' });
  await page.waitForFunction(() => document.documentElement.dataset.ostheme === 'day', null, { timeout: 3000 });
  assert.deepEqual(errors, []);
  await ctx.close();
});
