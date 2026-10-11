import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { chromium } from 'playwright-core';
const executablePath = [process.env.CHROME_PATH, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/chromium'].filter(Boolean).find(existsSync);

test('profile layout choices persist, lessons navigate to practice, columns fit mobile', async () => {
  const browser = await chromium.launch({ executablePath });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(new URL('../../dist/index.html', import.meta.url).href);
    await page.evaluate(() => {
      const k = window.kidsos.kos;
      k.createProfile({ name: 'Liten', age: 5 });
      k.createProfile({ name: 'Stor', age: 10 });
      k.state.profiles.forEach(p => { p.settings.readAloud = 'off'; p.settings.reducedMotion = true; p.settings.quietFeedback = true; });
      k.saveNow();
    });
    await page.reload();
    await page.getByRole('button', { name: 'PC för Liten', exact: true }).click();
    await page.getByRole('button', { name: 'Tablet för Stor', exact: true }).click();
    await page.reload();
    assert.equal(await page.getByRole('button', { name: 'PC för Liten', exact: true }).getAttribute('aria-pressed'), 'true');
    assert.equal(await page.getByRole('button', { name: 'Tablet för Stor', exact: true }).getAttribute('aria-pressed'), 'true');
    await page.locator('.who-bubble').filter({ hasText: 'Stor' }).click();
    for (const id of ['math','svenska','write','science','biology','space','world','ai','code','draw','wonder','play']) {
      await page.evaluate(id => window.kidsos.openApp(id, 'discover-course'), id);
      assert.equal(await page.locator('.course-lesson').count(), 2);
      await page.locator('.course-next').click();
      await page.waitForTimeout(360);
      await page.locator('.course-next').click();
      await page.locator('.course-practice').click();
      assert.equal(await page.locator('.course').count(), 0);
    }
    await page.evaluate(() => window.kidsos.openApp('math', 'column'));
    await page.waitForTimeout(500);
    await page.locator('.column-note').last().fill('1');
    assert.equal(await page.locator('.column-note').last().inputValue(), '1');
    const overflow = await page.locator('.column-work').evaluate(el => { const r=el.getBoundingClientRect(); return r.right > innerWidth + 1 || r.left < -1; });
    await page.screenshot({ path: '/private/tmp/kids-column-mobile.png' });
    assert.equal(overflow, false, await page.locator('.column-work').evaluate(el => JSON.stringify({left:el.getBoundingClientRect().left,right:el.getBoundingClientRect().right,width:innerWidth})));
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.evaluate(() => window.kidsos.openApp('science', 'discover-course'));
    await page.screenshot({ path: '/private/tmp/kids-course-wide.png' });
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
});
