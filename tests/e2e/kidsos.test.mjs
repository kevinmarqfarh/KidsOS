import { STORIES } from '../../src/apps/svenska.js';
// End-to-end-tester av den byggda appen (dist/index.html) i Chromium med pekskärm.
// Kör: npm run build && npm run test:e2e
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { chromium } from 'playwright-core';
import { GLYPHS } from '../../src/apps/letters.js';
import { APPS } from '../../src/apps/registry.js';
const APP_COUNT = APPS.length;

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const APP_URL = `file://${join(root, 'dist', 'index.html')}`;
const SHOTS = join(root, 'docs', 'screenshots');
mkdirSync(SHOTS, { recursive: true });

const CHROME_CANDIDATES = [process.env.CHROME_PATH, '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/chromium', '/usr/bin/google-chrome'].filter(Boolean);
const executablePath = CHROME_CANDIDATES.find((p) => existsSync(p));

const IPAD = { viewport: { width: 768, height: 1024 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true };
const IPAD_LAND = { viewport: { width: 1024, height: 768 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true };
const PHONE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true };

let browser;
before(async () => {
  browser = await chromium.launch({ executablePath });
});
after(async () => {
  await browser?.close();
});

async function open(device = IPAD) {
  const ctx = await browser.newContext({ ...device, locale: 'sv-SE' });
  // Snabbare tester: inga Google-typsnitt behövs.
  await ctx.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && !/ERR_FAILED|net::/.test(m.text()) && errors.push(m.text()));
  await page.goto(APP_URL);
  await page.waitForSelector('.lock');
  return { page, ctx, errors };
}

async function family(page, index) {
  await page.getByText('Snabbstart').click();
  await approveGate(page);
  await page.waitForSelector('.who-bubble');
  await page.evaluate(() => window.kidsos.kos.state.profiles.forEach(profile => { profile.settings.layout = 'tablet'; }));
  await page.locator('.who-bubble').nth(index).click();
  try {
    await page.waitForSelector('.home', { timeout: 8000 });
  } catch (e) {
    await page.screenshot({ path: join(SHOTS, '..', 'fel-login.png') });
    const html = await page.evaluate(() => document.querySelector('.screen')?.className + ' ' + document.querySelector('.screen')?.innerText.slice(0, 200));
    throw new Error(`Kom inte till hemskärmen: ${html}`);
  }
}

async function openModule(page, appId, modId) {
  await page.evaluate(([a, m]) => window.kidsos.openApp(a, m), [appId, modId]);
  await page.waitForTimeout(450);
}

/** Svarar rätt på aktuell fråga utifrån testkroken window.kidsos.q. */
async function answerCurrent(page) {
  const q = await page.evaluate(() => {
    const q = window.kidsos.q;
    return { type: q.type, answer: q.answer, answerOrder: q.answerOrder, items: q.items?.map((i) => ({ id: i.id, bin: i.bin })), word: q.word, target: q.target, step: q.step };
  });
  switch (q.type) {
    case 'choice':
      await page.evaluate((id) => [...document.querySelectorAll('.choice')].find((b) => b.dataset.id === String(id)).click(), q.answer);
      break;
    case 'numpad':
      for (const d of String(q.answer)) {
        await page.locator('.np-key', { hasText: new RegExp(`^${d}$`) }).click();
        await page.waitForTimeout(140);
      }
      await page.locator('.np-key.ok').click();
      break;
    case 'order': {
      for (const id of q.answerOrder) {
        const idx = q.items.findIndex((i) => i.id === id);
        await page.locator('.order-item').nth(idx).click();
      }
      break;
    }
    case 'sort':
      for (const it of q.items) {
        await page.locator(`.sort-item[data-id="${it.id}"]`).click();
        await page.locator(`.sort-bin[data-bin="${it.bin}"]`).click();
      }
      break;
    case 'build':
      for (const ch of q.word) await page.locator('.build-tile:not(.used)', { hasText: new RegExp(`^${ch}$`) }).first().click();
      break;
    case 'tapcount':
      for (let i = 0; i < q.answer; i++) {
        await page.locator('.drum').click();
        await page.waitForTimeout(170);
      }
      await page.getByRole('button', { name: 'Klar ✓' }).click();
      break;
    case 'tap':
      await page.locator(`[data-hit="${q.answer}"]`).first().click({ force: true });
      break;
    case 'clock': {
      const steps = ((q.target.h % 12) * 60 + q.target.m) / q.step;
      const plus = page.getByRole('button', { name: new RegExp(`^\\+${q.step} min`) });
      for (let i = 0; i < steps; i++) {
        await plus.click();
        await page.waitForTimeout(110);
      }
      await page.getByRole('button', { name: 'Klar ✓' }).click();
      break;
    }
    default:
      throw new Error(`okänd typ ${q.type}`);
  }
  return q.type;
}

async function playRound(page) {
  const types = new Set();
  for (let i = 0; i < 12; i++) {
    if (await page.locator('.summary').isVisible()) break;
    await page.waitForSelector('.q-prompt');
    const type = await answerCurrent(page);
    types.add(type);
    try {
      await page.locator('.btn-next').click({ timeout: 5000 });
    } catch (e) {
      const info = await page.evaluate(() => ({ prompt: window.kidsos.q.prompt, type: window.kidsos.q.type, answer: window.kidsos.q.answer }));
      await page.screenshot({ path: join(SHOTS, '..', 'fel.png') });
      throw new Error(`Frågan gick inte att avsluta: ${JSON.stringify(info)}`);
    }
    await page.waitForTimeout(120);
  }
  await page.waitForSelector('.summary');
  return types;
}

const state = (page) => page.evaluate(() => window.kidsos.kos.state);

async function typeGate(page, digits) {
  for (const d of String(digits)) {
    await page.locator('.gate .np-key', { hasText: new RegExp(`^${d}$`) }).click();
    await page.waitForTimeout(100);
  }
}

async function approveGate(page) {
  const prompt = await page.locator('.gate p').innerText();
  const [, a, b] = /(\d+) × (\d+)/.exec(prompt);
  await typeGate(page, Number(a) * Number(b));
  await page.locator('.gate .np-key.ok').click();
}

test('första start: föräldern skapar en profil med guiden', async () => {
  const { page, ctx, errors } = await open();
  await page.screenshot({ path: join(SHOTS, 'ipad-valkommen.png') });
  await page.getByText('Skapa första profilen').click();
  await approveGate(page);
  await page.locator('.age-band-card[data-band="6-7"]').click();
  await page.getByRole('button', { name: 'Godkänn och låt barnet fortsätta →' }).click();
  await page.fill('#profile-name', 'Testbarn');
  await page.getByRole('button', { name: 'Nästa →', exact: true }).click();
  await page.locator('.pick-av').nth(3).click();
  await page.getByRole('button', { name: 'Nästa →', exact: true }).click();
  await page.screenshot({ path: join(SHOTS, 'ipad-profilguide.png') });
  await page.getByRole('button', { name: 'Skapa ✨' }).click();
  await page.locator('.who-bubble', { hasText: 'Testbarn' }).click();
  await page.waitForSelector('.home');
  assert.equal(await page.locator('.app-icon').count(), APP_COUNT); // alla appar i registret, inkl. Byggvärlden och Känslor & jag
  assert.match(await page.locator('.home-hello h1').innerText(), /Testbarn/);
  const s = await state(page);
  assert.equal(s.profiles[0].age, 7);
  assert.deepEqual(errors, []);
  await ctx.close();
});

test('en hel matterunda med rätt svar ger tre stjärnor, stjärnor och troféer', async () => {
  const { page, ctx, errors } = await open();
  await family(page, 1); // 7 år
  await page.screenshot({ path: join(SHOTS, 'ipad-hemskarm.png') });
  await page.click('.app-icon[data-app="math"]');
  await page.waitForSelector('.mod-tile');
  await page.screenshot({ path: join(SHOTS, 'ipad-matte-hubb.png') });
  await page.click('.mod-tile[data-mod="count"]');
  await page.waitForSelector('.q-prompt');
  await page.screenshot({ path: join(SHOTS, 'ipad-fraga.png') });
  await playRound(page);
  await page.screenshot({ path: join(SHOTS, 'ipad-runda-klar.png') });
  assert.equal(await page.locator('.sum-star.on').count(), 3);
  const p = (await state(page)).profiles[1];
  assert.ok(p.stars >= 8, `förväntade minst 8 stjärnor, fick ${p.stars}`);
  assert.ok(p.trophies['first-round'], 'trofén Första stjärnan');
  assert.ok(p.trophies['perfect-1'], 'trofén Fullträff');
  assert.equal(p.stats.math.modules.count.best, 3);
  assert.match(await page.locator('.sb-stars').innerText(), /⭐ \d+/);
  assert.deepEqual(errors, []);
  await ctx.close();
});

test('fel svar ger ett tips och räknas som ett nytt försök – aldrig straff', async () => {
  const { page, ctx, errors } = await open();
  await family(page, 1);
  await openModule(page, 'svenska', 'rhyme');
  const wrongId = await page.evaluate(() => window.kidsos.q.options.find((o) => o.id !== window.kidsos.q.answer).id);
  const starsBefore = (await state(page)).profiles[1].stars;
  await page.evaluate((id) => [...document.querySelectorAll('.choice')].find((b) => b.dataset.id === id).click(), wrongId);
  await page.waitForSelector('.fb-try');
  assert.match(await page.locator('.fb-try').innerText(), /Nästan/);
  await answerCurrent(page);
  await page.waitForSelector('.fb-ok');
  assert.match(await page.locator('.fb-ok').innerText(), /Bra kämpat/);
  const p = (await state(page)).profiles[1];
  assert.equal(p.stars, starsBefore, 'inga stjärnor dras av');
  assert.equal(p.counters.retries, 1);
  assert.deepEqual(errors, []);
  await ctx.close();
});

test('alla frågetyper går att besvara med pekskärm (9-åring)', async () => {
  const { page, ctx, errors } = await open();
  await family(page, 2); // 9 år
  const seen = new Set();
  const modules = [
    ['math', 'addsub'],
    ['math', 'clock'],
    ['svenska', 'syllables'],
    ['svenska', 'build'],
    ['svenska', 'sentence'],
    ['biology', 'lifecycle'],
    ['biology', 'seasons'],
    ['biology', 'bodytap'],
    ['science', 'recycle'],
    ['code', 'predict'],
    ['space', 'order'],
  ];
  for (const [a, m] of modules) {
    await openModule(page, a, m);
    (await playRound(page)).forEach((t) => seen.add(t));
  }
  for (const t of ['choice', 'numpad', 'order', 'sort', 'build', 'tapcount', 'tap']) assert.ok(seen.has(t), `frågetypen ${t} testades inte`);
  const p = (await state(page)).profiles[2];
  assert.ok(p.counters.rounds >= modules.length);
  assert.ok(Object.keys(p.trophies).length >= 2);
  assert.deepEqual(errors, []);
  await ctx.close();
});

test('klockan: barnet kan ställa in tiden genom att dra i visaren', async () => {
  const { page, ctx, errors } = await open();
  await family(page, 2);
  // hitta en "ställ klockan"-fråga
  for (let tries = 0; tries < 30; tries++) {
    await openModule(page, 'math', 'clock');
    if ((await page.evaluate(() => window.kidsos.q.type)) === 'clock') break;
  }
  assert.equal(await page.evaluate(() => window.kidsos.q.type), 'clock');
  const box = await page.locator('.clock-set svg').boundingBox();
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;
  // dra minutvisaren från 12 till 3 (kvart över)
  await page.mouse.move(cx, cy - box.height * 0.35);
  await page.mouse.down();
  for (let a = 0; a <= 90; a += 10) {
    const r = (a * Math.PI) / 180;
    await page.mouse.move(cx + Math.sin(r) * box.width * 0.35, cy - Math.cos(r) * box.height * 0.35);
  }
  await page.mouse.up();
  const rot = await page.locator('.clock-set .hand-m').getAttribute('transform');
  assert.match(rot, /rotate\(90 /, `minutvisaren ska peka på 3, fick ${rot}`);
  assert.deepEqual(errors, []);
  await ctx.close();
});

test('robotbanan: bygg ett program med pilar och kör det', async () => {
  const { page, ctx, errors } = await open();
  await family(page, 0); // 5 år
  await openModule(page, 'code', 'robot');
  await page.locator('.level-btn').first().click();
  await page.waitForSelector('.robot-board');
  await page.locator('.pal-btn[aria-label="höger"]').click();
  await page.waitForTimeout(170);
  await page.locator('.pal-btn[aria-label="höger"]').click();
  await page.screenshot({ path: join(SHOTS, 'ipad-robotbana.png') });
  await page.getByRole('button', { name: '▶ Kör' }).click();
  await page.waitForSelector('.robot-status.ok', { timeout: 8000 });
  const p = (await state(page)).profiles[0];
  assert.ok(p.sets.robotLevels['1']);
  // nästa bana öppnas
  await page.getByRole('button', { name: 'Nästa bana ➜' }).click();
  await page.waitForSelector('.robot-title');
  assert.match(await page.locator('.robot-title').innerText(), /Bana 2/);
  assert.deepEqual(errors, []);
  await ctx.close();
});

test('robotbanan: loopblocket fungerar', async () => {
  const { page, ctx, errors } = await open();
  await family(page, 2);
  await page.evaluate(() => {
    const p = window.kidsos.kos.profile;
    for (let i = 1; i <= 13; i++) p.sets.robotLevels = { ...(p.sets.robotLevels || {}), [i]: 1 };
  });
  await openModule(page, 'code', 'robot');
  await page.locator('.level-btn').nth(13).click(); // bana 14: 7(R)
  await page.locator('.pal-loop').click();
  await page.locator('.pal-btn[aria-label="höger"]').click();
  for (let i = 0; i < 4; i++) {
    await page.locator('.loop-n').click(); // 3 → 7
    await page.waitForTimeout(370);
  }
  assert.match(await page.locator('.loop-n').innerText(), /7×/);
  await page.getByRole('button', { name: '▶ Kör' }).click();
  await page.waitForSelector('.robot-status.ok', { timeout: 12000 });
  const p = (await state(page)).profiles[2];
  assert.equal(p.counters.loopWins, 1);
  assert.deepEqual(errors, []);
  await ctx.close();
});

test('skriv ABC: att spåra bokstaven A med fingret godkänns, klotter underkänns', async () => {
  const { page, ctx, errors } = await open();
  await family(page, 1);
  await openModule(page, 'write', 'upper');
  await page.waitForTimeout(300);
  const box = await page.locator('.trace-ink').boundingBox();
  // klotter först
  await page.mouse.move(box.x + 10, box.y + 10);
  await page.mouse.down();
  for (let i = 0; i < 40; i++) await page.mouse.move(box.x + ((i * 97) % box.width), box.y + ((i * 53) % box.height));
  await page.mouse.up();
  await page.getByRole('button', { name: 'Klar ✓' }).click();
  await page.waitForSelector('.trace-msg.try');
  await page.getByRole('button', { name: '🧽 Sudda' }).click();
  // spåra A längs mallen (mät om – meddelandet kan ha flyttat skrivytan)
  await page.locator('.trace-ink').scrollIntoViewIfNeeded();
  const b2 = await page.locator('.trace-ink').boundingBox();
  Object.assign(box, b2);
  const unit = box.height;
  for (const stroke of GLYPHS.A) {
    await page.mouse.move(box.x + stroke[0][0] * box.width, box.y + stroke[0][1] * unit);
    await page.mouse.down();
    for (const [x, y] of stroke) await page.mouse.move(box.x + x * box.width, box.y + y * unit);
    await page.mouse.up();
  }
  await page.screenshot({ path: join(SHOTS, 'ipad-skriv-abc.png') });
  await page.getByRole('button', { name: 'Klar ✓' }).click();
  await page.waitForSelector('.trace-msg.ok', { timeout: 5000 }).catch(async (e) => { throw new Error('trace-msg: ' + (await page.locator('.trace-msg').innerText()) + ' class=' + (await page.locator('.trace-msg').getAttribute('class'))); });
  const p = (await state(page)).profiles[1];
  assert.ok(p.sets['traced:upper'].A);
  assert.ok(p.trophies['trace-1']);
  assert.deepEqual(errors, []);
  await ctx.close();
});

test('vetenskap: gissa och testa flyter/sjunker hela vägen till protokollet', async () => {
  const { page, ctx, errors } = await open();
  await family(page, 0);
  await openModule(page, 'science', 'float');
  await page.getByRole('button', { name: 'Starta experimentet ▶' }).click();
  for (let i = 0; i < 12; i++) {
    if (await page.locator('.protocol').isVisible()) break;
    await page.getByRole('button', { name: '🛟 Flyter' }).click();
    await page.waitForSelector('.btn-next', { timeout: 4000 });
    if (i === 1) await page.screenshot({ path: join(SHOTS, 'ipad-vetenskap.png') });
    await page.locator('.btn-next').click();
  }
  await page.waitForSelector('.protocol');
  const p = (await state(page)).profiles[0];
  assert.ok(p.sets.experiments.float);
  assert.deepEqual(errors, []);
  await ctx.close();
});

test('rymden, biologi och undra: interaktiva vyer ger samlingar', async () => {
  const { page, ctx, errors } = await open();
  await family(page, 2);
  await page.route(/^https?:/, route => route.abort());
  await openModule(page, 'space', 'solar');
  await page.locator('.body[data-id="mars"]').click({ force: true });
  await page.waitForSelector('.pi-card');
  await page.waitForFunction(() => { const img = document.querySelector('.pi-photo img'); return img?.complete && img.naturalWidth > 0; });
  await page.screenshot({ path: join(SHOTS, 'ipad-solsystemet.png') });
  await openModule(page, 'biology', 'bodyexplore');
  await page.locator('[data-hit="hand"]').click({ force: true });
  await page.waitForSelector('.pi-card');
  await openModule(page, 'wonder', 'cards');
  await page.locator('.wonder-tile').first().click();
  await page.getByRole('button', { name: '💡 Visa svaret' }).click();
  await page.waitForSelector('.wonder-answer:not([hidden])');
  const p = (await state(page)).profiles[2];
  assert.ok(p.sets.planets.mars && p.sets.bodyParts.hand && Object.keys(p.sets.wonders).length === 1);
  assert.deepEqual(errors, []);
  await ctx.close();
});

test('föräldraspärr, rapport mot Lgr22 och skärmtid', async () => {
  const { page, ctx, errors } = await open();
  await family(page, 1);
  await page.locator('.dock-item', { hasText: 'Inställningar' }).click();
  await page.getByRole('button', { name: '🔒 Föräldrainställningar' }).click();
  const text = await page.locator('.gate p').innerText();
  const [, a, b] = /(\d+) × (\d+)/.exec(text);
  await typeGate(page, Number(a) * Number(b));
  await page.locator('.gate .np-key.ok').click();
  await page.waitForSelector('.settings.parent');
  assert.match(await page.locator('.settings.parent').innerText(), /Läroplanen/);
  await page.screenshot({ path: join(SHOTS, 'ipad-foraldrar.png'), fullPage: true });
  await page.locator('.seg-btn', { hasText: '15 min' }).click();
  let p = (await state(page)).profiles[1];
  assert.equal(p.settings.dailyLimitMin, 15);
  // simulera att tiden har gått ut
  await page.evaluate(() => {
    const k = window.kidsos.kos;
    const d = new Date();
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    k.profile.days[key] = 16 * 60;
    k.tick();
  });
  await page.waitForSelector('.limit-screen');
  await page.screenshot({ path: join(SHOTS, 'ipad-paus.png') });
  await page.getByRole('button', { name: '🔒 Vuxen: +15 min' }).click();
  const t2 = await page.locator('.gate p').innerText();
  const [, c, d2] = /(\d+) × (\d+)/.exec(t2);
  await typeGate(page, Number(c) * Number(d2));
  await page.locator('.gate .np-key.ok').click();
  await page.waitForSelector('.limit-screen', { state: 'detached' });
  p = (await state(page)).profiles[1];
  assert.equal(p.limitBonus.min, 15);
  assert.deepEqual(errors, []);
  await ctx.close();
});

test('föräldrakod (PIN) ersätter räknefrågan', async () => {
  const { page, ctx } = await open();
  await family(page, 0);
  await page.evaluate(() => {
    window.kidsos.kos.state.settings.pin = '2468';
  });
  await page.locator('.dock-item', { hasText: 'Inställningar' }).click();
  await page.getByRole('button', { name: '🔒 Föräldrainställningar' }).click();
  await typeGate(page, '1111');
  assert.equal(await page.locator('.settings.parent').count(), 0, 'fel kod släpper inte in');
  await page.waitForTimeout(500);
  await typeGate(page, '2468');
  await page.waitForSelector('.settings.parent');
  await ctx.close();
});

test('tryckytor är minst 44 punkter (Apples riktlinje) – de flesta långt större', async () => {
  const { page, ctx } = await open();
  await family(page, 1);
  const audit = async (label) => {
    const small = await page.evaluate(() =>
      [...document.querySelectorAll('button, [role="button"]')]
        .filter((b) => b.offsetParent !== null && !b.classList.contains('blk-x') && !b.closest('.sheet'))
        .map((b) => ({ r: b.getBoundingClientRect(), t: (b.innerText || b.getAttribute('aria-label') || b.className).slice(0, 30) }))
        .filter(({ r }) => r.width > 0 && Math.min(r.width, r.height) < 44)
        .map(({ r, t }) => `${t} ${Math.round(r.width)}×${Math.round(r.height)}`),
    );
    assert.deepEqual(small, [], `för små tryckytor på ${label}`);
  };
  await audit('hemskärmen');
  for (const [a, m] of [[null, null], ['math', 'count'], ['svenska', 'letterpic'], ['code', 'robot'], ['science', 'seesaw'], ['draw', 'canvas'], ['write', 'upper']]) {
    if (a) await openModule(page, a, m);
    else {
      await page.click('.app-icon[data-app="math"]');
      await page.waitForTimeout(400);
    }
    await audit(`${a}/${m}`);
  }
  await ctx.close();
});

test('ingen sidledsscroll på mobil och iPad – i någon modul', async () => {
  for (const [name, device, idx] of [['mobil', PHONE, 2], ['ipad-liggande', IPAD_LAND, 2]]) {
    const { page, ctx, errors } = await open(device);
    await family(page, idx);
    await page.screenshot({ path: join(SHOTS, `${name}-hemskarm.png`) });
    const mods = await page.evaluate(() => {
      const out = [];
      document.querySelectorAll('.app-icon').forEach((i) => out.push(i.dataset.app));
      return out;
    });
    const overflow = [];
    for (const appId of mods) {
      const ids = await page.evaluate((a) => window.kidsos.kos && (window.__apps || null), appId);
      void ids;
      await page.evaluate((a) => window.kidsos.openApp(a), appId);
      await page.waitForTimeout(350);
      const modIds = await page.$$eval('.mod-tile', (els) => els.map((e) => e.dataset.mod));
      for (const m of modIds.length ? modIds : [null]) {
        if (m) await openModule(page, appId, m);
        const o = await page.evaluate(() => {
          const c = document.querySelector('.win-content');
          const doc = document.scrollingElement;
          return { win: c ? c.scrollWidth - c.clientWidth : 0, doc: doc.scrollWidth - window.innerWidth };
        });
        if (o.win > 2 || o.doc > 2) overflow.push(`${appId}/${m}: ${JSON.stringify(o)}`);
      }
    }
    if (name === 'mobil') {
      await openModule(page, 'math', 'compare');
      await page.screenshot({ path: join(SHOTS, 'mobil-fraga.png') });
    } else {
      await openModule(page, 'math', 'clock');
      await page.screenshot({ path: join(SHOTS, 'ipad-liggande-fraga.png') });
    }
    assert.deepEqual(overflow, [], `${name}: innehåll bredare än skärmen`);
    assert.deepEqual(errors, []);
    await ctx.close();
  }
});

test('framsteg sparas mellan sessioner och nattläget går att slå på', async () => {
  const { page, ctx } = await open();
  await family(page, 2);
  await page.evaluate(() => {
    window.kidsos.kos.profile.stars = 42;
    window.kidsos.kos.state.settings.theme = 'night';
    window.kidsos.kos.applySettings();
    window.kidsos.kos.saveNow();
  });
  await page.reload();
  await page.waitForSelector('.home');
  assert.match(await page.locator('.sb-stars').innerText(), /42/);
  assert.equal(await page.evaluate(() => document.documentElement.dataset.ostheme), 'night');
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  assert.equal(bg, 'rgb(22, 26, 51)');
  await page.screenshot({ path: join(SHOTS, 'ipad-nattlage.png') });
  await page.locator('.dock-item', { hasText: 'Troféer' }).click();
  await page.waitForSelector('.troom');
  await page.screenshot({ path: join(SHOTS, 'ipad-trofeer.png') });
  await ctx.close();
});

test('artfotografier fungerar offline på mobil', async () => {
  const { page, ctx, errors } = await open(PHONE);
  await family(page, 1);
  await page.route(/^https?:/, route => route.abort());
  for (let attempt = 0; attempt < 20; attempt++) {
    await openModule(page, 'biology', 'species');
    if (await page.locator('.q-visual .learning-photo').count()) break;
  }
  await page.waitForFunction(() => {
    const img = document.querySelector('.q-visual .learning-photo');
    return img?.complete && img.naturalWidth > 0;
  });
  assert.ok(await page.locator('.q-visual .learning-photo').evaluate(img => img.getBoundingClientRect().right <= innerWidth));
  await page.screenshot({ path: join(SHOTS, 'mobil-artfoto.png') });
  assert.deepEqual(errors, []);
  await ctx.close();
});

test('AI och Kodning: läs lektioner, öva och spara framsteg på mobil', async () => {
  const { page, ctx, errors } = await open(PHONE);
  await family(page, 0);
  await page.route(/^https?:/, route => route.abort());
  for (const appId of ['ai', 'code']) {
    await openModule(page, appId, 'course');
    await page.locator('.course-lesson:not(:disabled)').first().click();
    while ((await page.locator('.course-next').innerText()).includes('Nästa del')) await page.locator('.course-next').click();
    await page.locator('.course-next').click();
    assert.ok(await page.locator('.course-lesson').first().innerText().then(text => text.includes('Läst')));
    assert.equal(await page.locator('.course-stage').evaluate(el => el.getBoundingClientRect().right <= innerWidth), true);
    if (appId === 'ai') await page.screenshot({ path: join(SHOTS, 'mobil-ai-kurs.png') });
    await page.locator('.course-practice').click();
    await page.waitForSelector('.q-prompt');
    await answerCurrent(page);
    await page.waitForSelector('.fb-ok');
    await openModule(page, appId, 'course');
    assert.ok(await page.locator('.course-lesson').first().innerText().then(text => text.includes('Läst')));
  }
  await page.screenshot({ path: join(SHOTS, 'mobil-kodkurs.png') });
  assert.ok(await page.locator('.course-lesson:disabled').count() >= 1);
  assert.deepEqual(errors, []);
  await ctx.close();
});

test('AI-labbet visar hur träningsdata påverkar nya svar utan internet', async () => {
  const { page, ctx, errors } = await open();
  await family(page, 1);
  await page.route(/^https?:/, route => route.abort());
  await openModule(page, 'ai', 'lab');
  await page.waitForFunction(() => [...document.querySelectorAll('.ai-photo img')].every(img => img.complete && img.naturalWidth > 0));
  const cards = page.locator('.ai-animal');
  await cards.nth(0).getByRole('button', { name: '🐾 Däggdjur', exact: true }).click();
  await page.getByRole('button', { name: 'Testa på två nya djur →', exact: true }).click();
  assert.match(await page.locator('.ai-lab').innerText(), /1 av 2 testdjurs svar stämde/);
  await page.getByRole('button', { name: '← Rätta etiketter eller lägg till exempel', exact: true }).click();
  for (const [index, label] of [[1, '🐦 Fågel'], [2, '🐦 Fågel'], [3, '🐾 Däggdjur']]) await page.locator('.ai-animal').nth(index).getByRole('button', { name: label, exact: true }).click();
  assert.match(await page.locator('.ai-training-count').innerText(), /4 exempel/);
  await page.getByRole('button', { name: 'Testa på två nya djur →', exact: true }).click();
  assert.match(await page.locator('.ai-lab').innerText(), /2 av 2 testdjurs svar stämde/);
  await page.screenshot({ path: join(SHOTS, 'ipad-ai-labb.png') });
  await page.getByRole('button', { name: 'Kontrollera etiketter och prova olika exempel', exact: true }).click();
  assert.ok((await state(page)).profiles[1].sets.aiLab.classify);
  const stars = (await state(page)).profiles[1].stars;
  await page.getByRole('button', { name: 'Kontrollera etiketter och prova olika exempel', exact: true }).click();
  assert.equal((await state(page)).profiles[1].stars, stars);
  assert.deepEqual(errors, []);
  await ctx.close();
});

test('profilguide: föräldern väljer intervall, barnet väljer själv och bakgrunder förhandsvisas', async () => {
  const { page, ctx, errors } = await open(PHONE);
  for (const [i, band] of ['4-5', '6-7', '8-9', '10-12'].entries()) {
    if (i === 0) await page.getByText('Skapa första profilen').click();
    else await page.locator('.who-add').click();
    assert.equal(await page.locator('#profile-name').count(), 0);
    await approveGate(page);
    assert.equal(await page.locator('#profile-name').count(), 0);
    assert.equal((await state(page)).profiles.length, i);
    await page.locator(`.age-band-card[data-band="${band}"]`).click();
    if (i === 0) await page.screenshot({ path: join(SHOTS, 'mobil-aldersintervall.png') });
    await page.getByRole('button', { name: 'Godkänn och låt barnet fortsätta →' }).click();
    assert.equal(await page.locator('.age-band-card').count(), 0);
    await page.fill('#profile-name', `Barn${i}`);
    await page.getByRole('button', { name: 'Nästa →', exact: true }).click();
    await page.locator('.pick-av').nth(i).click();
    await page.getByRole('button', { name: 'Nästa →', exact: true }).click();
    await page.locator('.pick-wp[data-wallpaper="space"]').click();
    assert.equal(await page.locator('.pick-wp[data-wallpaper="space"]').getAttribute('aria-pressed'), 'true');
    assert.equal(await page.locator('.wizard').evaluate(el => el.scrollWidth <= el.clientWidth + 2), true);
    if (i === 0) await page.screenshot({ path: join(SHOTS, 'mobil-profil-bakgrunder.png') });
    await page.getByRole('button', { name: 'Skapa ✨', exact: true }).click();
    await page.waitForSelector(`.who-bubble:has-text("Barn${i}")`);
    const p = (await state(page)).profiles[i];
    assert.equal(p.ageBand, band);
    assert.equal(p.wallpaper, 'space');
  }
  await page.reload();
  await page.waitForSelector('.lock');
  assert.deepEqual((await state(page)).profiles.map(p => p.ageBand), ['4-5', '6-7', '8-9', '10-12']);
  assert.deepEqual(errors, []);
  await ctx.close();
});


test('nya övningar fungerar inom alla åldersintervall på mobil', async () => {
  const { page, ctx, errors } = await open(PHONE);
  await family(page, 2);
  await page.route(/^https?:/, route => route.abort());
  const modules = [['math', 'everyday', 0], ['math', 'sharing', 2], ['svenska', 'contextwords', 0], ['svenska', 'textclues', 0], ['science', 'investigate', 0], ['science', 'forces', 0], ['science', 'resources', 0]];
  for (const level of [0, 1, 2, 4]) {
    await page.evaluate(level => { window.kidsos.kos.profile.levelOverride = { math: level, svenska: level, science: level }; }, level);
    for (const [app, mod, min] of modules) {
      if (level < min) continue;
      await openModule(page, app, mod);
      assert.equal(await page.evaluate(() => window.kidsos.q.level), level);
      await answerCurrent(page);
      await page.waitForSelector('.fb-ok');
      assert.equal(await page.locator('.win-content').evaluate(el => el.scrollWidth <= el.clientWidth + 2), true);
      if (app === 'science' && mod === 'investigate' && level === 4) await page.screenshot({ path: join(SHOTS, 'mobil-vetenskap-resonemang.png') });
    }
  }
  assert.deepEqual(errors, []);
  await ctx.close();
});

test('nya berättelser visar textstöd och förklaringar innan nästa fråga', async () => {
  const { page, ctx, errors } = await open();
  await family(page, 0);
  for (const storyId of ['bollhjalp', 'ryktet-om-parken']) {
    const story = STORIES.find(item => item.id === storyId);
    await page.evaluate(level => { window.kidsos.kos.profile.levelOverride.svenska = level; }, story.level);
    await openModule(page, 'svenska', 'stories');
    await page.locator('.story-card').filter({ hasText: story.title }).click();
    await page.getByRole('button', { name: 'Jag har läst klart ➜', exact: true }).click();
    for (const question of story.questions) {
      await page.locator('.story-evidence summary').click();
      assert.ok((await page.locator('.story-evidence').innerText()).includes(story.text[0]));
      await page.getByRole('button', { name: question.a, exact: true }).click();
      await page.waitForSelector('.story-feedback .fb-ok');
      assert.match(await page.locator('.story-feedback').innerText(), /I berättelsen står det/);
      if (storyId === 'ryktet-om-parken') await page.screenshot({ path: join(SHOTS, 'ipad-lasforstaelse.png') });
      await page.locator('.story-next').click();
    }
    await page.waitForSelector('.summary');
    assert.ok((await state(page)).profiles[0].sets.stories[storyId]);
  }
  assert.deepEqual(errors, []);
  await ctx.close();
});

test('Undra anpassar svar och tillgängliga frågor efter barnets nivå', async () => {
  const { page, ctx, errors } = await open(PHONE);
  await family(page, 0);
  for (const level of [0, 4]) {
    await page.evaluate(level => { window.kidsos.kos.profile.levelOverride.wonder = level; }, level);
    await openModule(page, 'wonder', 'cards');
    assert.equal(await page.locator('.wonder-tile').filter({ hasText: 'Varför faller inte en satellit rakt ner?' }).count(), level === 0 ? 0 : 1);
    await page.locator('.wonder-tile').filter({ hasText: 'Varför blinkar stjärnor?' }).click();
    await page.getByRole('button', { name: '💡 Visa svaret', exact: true }).click();
    const text = await page.locator('.wonder-answer').innerText();
    assert.equal(text.includes('Nära horisonten'), level === 4);
    assert.equal(await page.locator('.win-content').evaluate(el => el.scrollWidth <= el.clientWidth + 2), true);
  }
  assert.deepEqual(errors, []);
  await ctx.close();
});

test('sammanslagning: datorläge behåller kurser, Världen och Lekstaden', async () => {
  const { page, ctx, errors } = await open();
  await family(page, 2);
  await page.evaluate(() => { window.kidsos.kos.profile.settings.layout = 'desktop'; window.kidsos.goHome(); });
  await page.waitForSelector('.desktop-root:not([hidden]) .desk-icons');
  assert.ok(await page.locator('.desk-icon[data-app="ai"]').count());
  assert.ok(await page.locator('.desk-icon[data-app="world"]').count());
  await openModule(page, 'ai', 'course');
  await page.locator('.course-lesson:not(:disabled)').first().click();
  while ((await page.locator('.course-next').innerText()).includes('Nästa del')) await page.locator('.course-next').click();
  await page.locator('.course-next').click();
  await page.locator('.course-practice').click();
  await page.waitForSelector('.q-prompt');
  await answerCurrent(page);
  await page.waitForSelector('.fb-ok');
  await openModule(page, 'world', 'compass');
  await page.waitForSelector('.q-prompt');
  await openModule(page, 'play', 'town');
  await page.waitForSelector('.town');
  await page.screenshot({ path: join(SHOTS, 'ipad-sammanslaget-skrivbord.png') });
  assert.deepEqual(errors, []);
  await ctx.close();
});

test('Lekstaden: kursrundor ger mynt som låser upp köp, rum och sparade föremål', async () => {
  const { page, ctx, errors } = await open(PHONE);
  await family(page, 1);
  const nav = await page.locator('.dock-item').allTextContents();
  assert.ok(nav.findIndex(text => text.includes('Lekstaden')) < nav.findIndex(text => text.includes('Troféer')));
  await page.locator('.dock').getByRole('button', { name: 'Lekstaden', exact: true }).click();
  await page.waitForSelector('.studio-stage');
  await page.getByRole('button', { name: 'Upptäck', exact: true }).click();
  const pack = page.locator('.studio-shop-card[data-asset="science-pack"]');
  assert.equal(await pack.getByRole('button', { name: 'Köp', exact: true }).count(), 0);
  await pack.getByRole('button', { name: 'Öva och lås upp', exact: true }).click();
  await page.waitForSelector('.q-prompt');
  await playRound(page);
  assert.match(await page.locator('.learn-play-reward').innerText(), /spelmynt/);
  assert.ok((await state(page)).profiles[1].stats.science.modules.investigate.rounds >= 1);
  const before = (await state(page)).profiles[1].coins;
  assert.ok(before >= 14);
  await page.getByRole('button', { name: '🏡 Till Skaparstudion', exact: true }).click();
  await page.waitForSelector('.studio-stage');
  await page.getByRole('button', { name: 'Upptäck', exact: true }).click();
  await page.locator('.studio-shop-card[data-asset="science-pack"]').getByRole('button', { name: 'Köp', exact: true }).click();
  assert.equal((await state(page)).profiles[1].coins, before - 14);
  assert.equal(await page.locator('.studio-shop-card[data-asset="science-pack"]').getByRole('button', { name: 'Köp', exact: true }).count(), 0);
  await page.getByRole('button', { name: 'Inred', exact: true }).click();
  await page.getByRole('button', { name: 'Lek', exact: true }).click();
  await page.getByRole('button', { name: 'Placera Mikroskop', exact: true }).click();
  const stage = page.locator('.studio-stage');
  const box = await stage.boundingBox();
  await stage.click({ position: { x: box.width * .35, y: box.height * .8 } });
  assert.ok(await page.evaluate(() => JSON.parse(window.render_game_to_text()).room.props.some(item => item.itemId === 'microscope')));
  await page.screenshot({ path: join(SHOTS, 'mobil-skaparstudio.png') });
  await page.getByRole('button', { name: 'Upptäck', exact: true }).click();
  const room = page.locator('.studio-shop-card[data-kind="room"][data-asset="science"]');
  // Modulens frågebank per åldersband är liten (två scenarier), så en övningsrunda kan bli
  // två frågor och ge färre mynt än som saknas. Barnet övar då igen tills Köp dyker upp.
  for (let round = 0; round < 4 && await room.getByRole('button', { name: 'Köp', exact: true }).count() === 0; round++) {
    await room.getByRole('button', { name: 'Öva för fler mynt', exact: true }).click();
    await page.waitForSelector('.q-prompt');
    await playRound(page);
    await page.getByRole('button', { name: '🏡 Till Skaparstudion', exact: true }).click();
    await page.getByRole('button', { name: 'Upptäck', exact: true }).click();
  }
  await room.getByRole('button', { name: 'Köp', exact: true }).click();
  assert.equal(await page.getByRole('button', { name: 'Upptäckarlabbet', exact: true }).count(), 1);
  await page.getByRole('button', { name: 'Rum', exact: true }).click();
  await page.getByLabel('Rummets namn', { exact: true }).fill('Sagas labb');
  await page.getByLabel('Rummets namn', { exact: true }).blur();
  const activeId = (await state(page)).activeId;
  await page.reload();
  await page.waitForSelector('.home');
  await page.locator('.dock').getByRole('button', { name: 'Lekstaden', exact: true }).click();
  const saved = await page.evaluate(() => JSON.parse(window.render_game_to_text()));
  assert.equal(saved.room.name, 'Sagas labb');
  await page.getByRole('button', { name: 'Mitt mysrum', exact: true }).click();
  assert.ok(await page.evaluate(() => JSON.parse(window.render_game_to_text()).room.props.some(item => item.itemId === 'microscope')));
  assert.equal((await state(page)).activeId, activeId);
  assert.deepEqual(errors, []);
  await ctx.close();
});

test('sifferskrivning avbryter köat tal och startar inte rösten under ritandet', async () => {
  const { page, ctx, errors } = await open(PHONE);
  await family(page, 0);
  await page.evaluate(() => {
    window.__traceSpeech = [];
    window.__tracePending = null;
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: {
      getVoices: () => [], addEventListener() {},
      speak(utterance) { window.__traceSpeech.push(utterance.text); window.__tracePending = utterance.text; },
      cancel() { window.__tracePending = null; },
    } });
  });
  await openModule(page, 'write', 'digits');
  assert.deepEqual(await page.evaluate(() => window.__traceSpeech.map((t) => t.split('.')[0] + '.')), ['Siffran 0.']);
  const canvas = page.locator('.trace-ink');
  let box = await canvas.boundingBox();
  for (let stroke = 0; stroke < 3; stroke++) {
    await page.mouse.move(box.x + box.width * .35, box.y + box.height * .3);
    await page.mouse.down();
    assert.equal(await page.evaluate(() => window.__tracePending), null);
    await page.mouse.move(box.x + box.width * .6, box.y + box.height * .7, { steps: 12 });
    await page.mouse.up();
  }
  await page.setViewportSize({ width: 400, height: 844 });
  assert.deepEqual(await page.evaluate(() => window.__traceSpeech.map((t) => t.split('.')[0] + '.')), ['Siffran 0.']);
  await page.locator('.trace-chip').filter({ hasText: /^2$/ }).click();
  assert.deepEqual(await page.evaluate(() => window.__traceSpeech.map((t) => t.split('.')[0] + '.')), ['Siffran 0.', 'Siffran 2.']);
  box = await canvas.boundingBox();
  await page.mouse.move(box.x + box.width * .4, box.y + box.height * .4);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * .6, box.y + box.height * .6, { steps: 10 });
  await page.mouse.up();
  assert.equal(await page.evaluate(() => window.__tracePending), null);
  assert.deepEqual(await page.evaluate(() => window.__traceSpeech.map((t) => t.split('.')[0] + '.')), ['Siffran 0.', 'Siffran 2.']);
  assert.deepEqual(errors, []);
  await ctx.close();
});

test('Mitt stöd: profilval, manuell uppläsning, paus och förutsägbar runda', async () => {
  const { page, ctx, errors } = await open(PHONE);
  try {
    await family(page, 0);
    await page.evaluate(() => {
      const kos = window.kidsos.kos;
      Object.assign(kos.profile.settings, { sound: false, reducedMotion: true, celebrationEffects: false, readAloud: 'manual', roundLength: 3, steadyRounds: true });
      kos.profile.stats.math = { level: 0, rounds: 0, correct: 0, wrong: 0, runUp: 4, runDown: 0, modules: {} };
      kos.applySettings();
      kos.saveNow();
      window.spokenTexts = [];
      window.speechSynthesis.speak = utterance => { window.spokenTexts.push(utterance.text); utterance.onend?.(); };
    });
    await openModule(page, 'math', 'count');
    assert.equal(await page.locator('.q-dot').count(), 3);
    assert.match(await page.locator('.q-status').innerText(), /fråga 1 av 3/);
    assert.equal(await page.evaluate(() => window.spokenTexts.length), 0);
    await page.locator('.q-speak').click();
    assert.equal(await page.evaluate(() => window.spokenTexts.length), 1);
    const question = await page.evaluate(() => JSON.stringify(window.kidsos.q));
    await page.locator('.quiz-pause').click();
    assert.equal(await page.evaluate(() => window.kidsos.kos.paused), true);
    assert.equal(await page.locator('dialog').evaluate(el => el.open), true);
    await page.evaluate(() => { window.kidsos.kos.sfx('fanfare'); window.kidsos.kos.say('oväntat'); });
    await page.getByRole('button', { name: 'Fortsätt', exact: true }).click();
    assert.equal(await page.evaluate(() => window.kidsos.kos.paused), false);
    assert.equal(await page.evaluate(() => JSON.stringify(window.kidsos.q)), question);
    assert.equal(await page.evaluate(() => window.spokenTexts.length), 1);
    for (let i = 0; i < 3; i++) {
      assert.equal(await page.evaluate(() => window.kidsos.q.level), 0);
      await answerCurrent(page);
      await page.locator('.btn-next').click();
    }
    await page.waitForSelector('.summary');
    assert.equal(await page.locator('.confetti, .fly-star').count(), 0);
    assert.equal(await page.locator('.sum-star.on').first().evaluate(el => getComputedStyle(el).animationName), 'none');
    assert.equal(await page.evaluate(() => window.kidsos.kos.profile.stats.math.level), 1);
    await page.evaluate(() => {
      const kos = window.kidsos.kos;
      kos.login(kos.state.profiles[1].id);
    });
    assert.equal(await page.evaluate(() => document.documentElement.dataset.reducedMotion), 'false');
    assert.equal(await page.evaluate(() => window.kidsos.kos.profile.settings.roundLength), 0);
    assert.deepEqual(errors, []);
  } finally { await ctx.close(); }
});

test('Mitt stöd går att välja i barnets inställningar och finns kvar efter omstart', async () => {
  const { page, ctx, errors } = await open(PHONE);
  try {
    await family(page, 0);
    await page.evaluate(() => window.kidsos.openApp('settings'));
    await page.getByRole('switch', { name: 'Mindre rörelse', exact: true }).click();
    await page.getByRole('button', { name: '3 frågor', exact: true }).click();
    await page.getByRole('button', { name: 'När jag trycker', exact: true }).click();
    assert.equal(await page.getByRole('switch', { name: 'Mindre rörelse', exact: true }).getAttribute('aria-checked'), 'true');
    await page.reload();
    await page.waitForTimeout(300);
    assert.deepEqual(await page.evaluate(() => {
      const s = window.kidsos.kos.profile.settings;
      return [s.reducedMotion, s.roundLength, s.readAloud];
    }), [true, 3, 'manual']);
    assert.deepEqual(errors, []);
  } finally { await ctx.close(); }
});

test('paus stoppar också fördröjd uppläsning efter återgång och städas vid avslut', async () => {
  const { page, ctx, errors } = await open(PHONE);
  try {
    await family(page, 0);
    await page.evaluate(() => {
      const kos = window.kidsos.kos;
      kos.profile.settings.readAloud = 'on';
      kos.applySettings();
      kos.stopSpeaking();
      window.utterances = [];
      window.speechSynthesis.speak = utterance => window.utterances.push(utterance);
    });
    await openModule(page, 'math', 'compare');
    assert.equal(await page.evaluate(() => window.utterances.length), 1);
    await page.locator('.quiz-pause').click();
    await page.getByRole('button', { name: 'Fortsätt', exact: true }).click();
    await page.evaluate(() => window.utterances[0].onend());
    await page.waitForTimeout(150);
    assert.equal(await page.evaluate(() => window.utterances.length), 1);
    await page.waitForTimeout(250);
    await page.locator('.quiz-pause').click();
    await page.evaluate(() => window.kidsos.goHome());
    assert.equal(await page.locator('.quiz-pause-dialog').count(), 0);
    assert.equal(await page.evaluate(() => window.kidsos.kos.paused), false);
    assert.deepEqual(errors, []);
  } finally { await ctx.close(); }
});
