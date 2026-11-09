// Loads the extension in real Chromium against a fake results page.
// Run: NODE_PATH=$(mise where playwright)/node_modules node test.js
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { chromium } = require('playwright');

const organic = (id, title) => `<div id="${id}"><a href="https://example.com"><h3>${title}</h3></a></div>`;

// The overview shares a wrapper with #rso, which arrives later, as when streaming.
const streamed = `<body><div id="center_col"><div id="wrap">
  <div id="aio"><div><h1>AI OverviewGenerating</h1><p>slop</p></div></div>
</div></div>
<script>setTimeout(() => {
  document.getElementById('wrap').insertAdjacentHTML('beforeend',
    '<div id="rso">' + ${JSON.stringify(organic('r1', 'Real result'))} + '</div>');
}, 100)</script></body>`;

const inResults = `<body><div id="center_col"><div id="rso">
  <div id="aio"><div><div role="heading">AI Overview</div><p>slop</p></div></div>
  ${organic('r1', 'AI Overview tips')}
  <div id="paa"><div role="heading">AI Overview explained</div></div>
</div></div></body>`;

const noOverview = `<body><div id="center_col"><div id="rso">${organic('r1', 'Real result')}</div></div></body>`;

(async () => {
  const dir = __dirname;
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'classic-search-'));
  const ctx = await chromium.launchPersistentContext(profile, {
    executablePath: '/usr/bin/chromium',
    headless: false,
    args: ['--headless=new', `--disable-extensions-except=${dir}`, `--load-extension=${dir}`],
  });
  let html;
  await ctx.route('https://www.google.com/search*', (r) =>
    r.fulfill({ contentType: 'text/html', body: html }));
  const page = await ctx.newPage();
  const open = async (body) => {
    html = body;
    await page.goto('https://www.google.com/search?q=x');
    await page.waitForTimeout(300);
  };

  try {
    await open(streamed);
    assert.equal(await page.isVisible('#aio'), false, 'streamed overview hidden');
    assert.equal(await page.isVisible('#r1'), true, 'late results stay visible');

    await open(inResults);
    assert.equal(await page.isVisible('#aio'), false, 'overview in #rso hidden');
    assert.equal(await page.isVisible('#r1'), true, 'organic title mentioning AI Overview stays');
    assert.equal(await page.isVisible('#paa'), true, 'longer heading stays');

    await open(noOverview);
    assert.equal(await page.isVisible('#r1'), true, 'page without overview untouched');
    console.log('ok');
  } finally {
    await ctx.close();
    fs.rmSync(profile, { recursive: true, force: true });
  }
})().catch((e) => { console.error(e); process.exit(1); });
