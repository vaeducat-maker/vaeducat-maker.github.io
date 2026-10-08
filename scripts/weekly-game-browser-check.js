#!/usr/bin/env node
'use strict';

// EDUKASS weekly production smoke checks. This script never changes game source
// or the progress of real users: each scenario uses an isolated browser context.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const URL = 'https://edukass.ee/games/korrutamine-test/';
const REPORT_DIR = path.resolve('artifacts/game-health');
fs.mkdirSync(REPORT_DIR, { recursive: true });
const results = [];
const failures = [];

function readable(error) {
  return error && error.stack ? error.stack : String(error);
}

async function checkProfile(browser, profile, completeMission) {
  const context = await browser.newContext({
    viewport: profile.viewport,
    deviceScaleFactor: 1,
    isMobile: profile.mobile,
    hasTouch: profile.mobile,
    serviceWorkers: 'block',
  });
  // Our monitoring must not pollute the real site's visitor statistics.
  await context.route(/^https:\/\/plausible\.io\//, route => route.abort());
  await context.addInitScript(() => {
    localStorage.setItem('edukass-opening-seen-v28', 'true');
    localStorage.setItem('edukass-sound-enabled', 'false');
  });
  const page = await context.newPage();
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  try {
    const response = await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 45000 });
    assert(response && response.status() === 200, 'Production game did not respond with HTTP 200.');
    await page.waitForFunction(
      () => window.__EDUKASS_TEST__ && typeof window.__EDUKASS_TEST__.getState === 'function',
      null, { timeout: 20000 }
    );

    const configuration = await page.evaluate(() => ({
      missions: window.__EDUKASS_TEST__.LEVELS.length,
      chapters: new Set(window.__EDUKASS_TEST__.LEVELS.map(level => level.chapterId)).size,
      buttons: document.querySelectorAll('#levelGrid [data-level]').length,
    }));
    assert.deepEqual(configuration, { missions: 252, chapters: 16, buttons: 252 });

    // Click the real start button. Continue in a clean browser session.
    await page.locator('#introPlayButton').click({ timeout: 8000 });
    await page.locator('#introScreen').waitFor({ state: 'hidden', timeout: 10000 });

    // The pre-existing game test hook starts the mission without changing game code.
    await page.evaluate(() => window.__EDUKASS_TEST__.startLevel(1));
    await page.waitForFunction(() => {
      const s = window.__EDUKASS_TEST__.getState();
      return s.roundActive && s.currentLevel === 1 && s.currentQuestion?.answer !== undefined;
    });
    assert(await page.locator('#battleScreen').isVisible(), 'Mission 1 is not visible.');

    const first = await page.evaluate(() => {
      const s = window.__EDUKASS_TEST__.getState();
      return { mode: window.__EDUKASS_TEST__.LEVELS[0].mode, answer: s.currentQuestion.answer };
    });
    // Actually interact with the visible answer controls in Chromium.
    if (first.mode === 'choice') {
      await page.locator('#choiceGrid button[data-choice="' + first.answer + '"]').click();
    } else {
      await page.keyboard.type(String(first.answer));
    }
    await page.waitForFunction(() => window.__EDUKASS_TEST__.getState().correct === 1);
    assert.equal(pageErrors.length, 0, 'JavaScript errors: ' + pageErrors.join(' | '));

    if (completeMission) {
      // Finish the real 15-question game loop in the browser (not 252 manual plays).
      for (let correct = 2; correct <= 15; correct++) {
        await page.waitForFunction(previous => {
          const s = window.__EDUKASS_TEST__.getState();
          return s.roundActive && s.correct === previous
            && document.querySelector('#answerDisplay').textContent.trim() === '?';
        }, correct - 1, { timeout: 15000 });
        await page.evaluate(() => window.__EDUKASS_TEST__.answerCorrect());
        await page.waitForFunction(target => window.__EDUKASS_TEST__.getState().correct === target,
          correct, { timeout: 15000 });
      }
      await page.locator('#resultScreen').waitFor({ state: 'visible', timeout: 15000 });
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.__EDUKASS_TEST__?.getState, null, { timeout: 20000 });
      const progress = await page.evaluate(() => window.__EDUKASS_TEST__.getState().progress);
      assert(progress.completedLevels.includes(1), 'Completed mission 1 was not saved.');
      assert(progress.unlockedLevel >= 2, 'Mission 2 was not unlocked after reload.');
      assert.equal(pageErrors.length, 0, 'JavaScript errors: ' + pageErrors.join(' | '));
    }

    results.push('PASS — ' + profile.name + ': live page, 252 missions, start and correct answer'
      + (completeMission ? ', full mission, unlock and persistent save' : ''));
    console.log(results[results.length - 1]);
  } catch (error) {
    const message = 'FAIL — ' + profile.name + ': ' + readable(error);
    failures.push(message);
    console.error(message);
    try {
      await page.screenshot({
        path: path.join(REPORT_DIR, profile.name + '-failure.png'),
        fullPage: true, timeout: 10000,
      });
    } catch (screenshotError) {
      console.error('Screenshot unavailable:', String(screenshotError));
    }
  } finally {
    await context.close();
  }
}

(async () => {
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    await checkProfile(browser, { name: 'desktop', viewport: { width: 1440, height: 900 }, mobile: false }, true);
    await checkProfile(browser, { name: 'mobile', viewport: { width: 390, height: 844 }, mobile: true }, false);
  } catch (error) {
    failures.push('FAIL — browser setup: ' + readable(error));
    console.error(failures[failures.length - 1]);
  } finally {
    if (browser) await browser.close();
    const lines = [
      '# EDUKASS: weekly production browser check',
      '',
      '- URL: ' + URL,
      '- Checked at: ' + new Date().toISOString(),
      '- Status: ' + (failures.length ? 'FAILED' : 'PASSED'),
      '',
      '## Results',
      ...results.map(line => '- ' + line),
      ...failures.map(line => '- ' + line),
      '',
      'Checks use separate browser sessions and block Plausible tracking.',
      'This is a technical smoke test, not a complete visual/pedagogical certification.',
      '',
    ];
    fs.writeFileSync(path.join(REPORT_DIR, 'report.md'), lines.join('\n'));
    if (failures.length) process.exitCode = 1;
  }
})().catch(error => {
  console.error(readable(error));
  process.exitCode = 1;
});
