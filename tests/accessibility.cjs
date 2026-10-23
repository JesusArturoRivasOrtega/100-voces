const fs = require("fs"),
  path = require("path"),
  assert = require("assert/strict");
const { chromium, browserOptions, baseURL, axePath } = require("./runtime.cjs");
(async () => {
  const b = await chromium.launch(browserOptions);
  try {
    const p = await b.newPage({
      viewport: { width: 1440, height: 1000 },
      reducedMotion: "reduce",
    });
    await p.goto(baseURL + "/dist/");
    await p.waitForFunction(
      () => document.documentElement.dataset.ready === "true",
    );
    await p.evaluate(() => document.fonts.ready);
    await p.addScriptTag({ path: axePath });
    const states = [];
    for (const state of ["initial", "expanded", "resources", "mobile-menu"]) {
      if (state === "expanded") {
        await p
          .locator("#yearEvidence")
          .evaluate((el) => (el.parentElement.open = true));
        await p
          .locator("#stateEvidence")
          .evaluate((el) => (el.parentElement.open = true));
        await p.locator("#quizAnswers button").nth(1).click();
      }
      if (state === "resources")
        await p.locator(".carousel-preview").evaluate((el) => (el.open = true));
      if (state === "mobile-menu") {
        await p.setViewportSize({ width: 375, height: 812 });
        await p.locator("#menuToggle").click();
      }
      const r = await p.evaluate(() =>
        axe.run(document, {
          runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
        }),
      );
      states.push({
        state,
        violations: r.violations,
        incomplete: r.incomplete,
        passes: r.passes.length,
      });
    }
    fs.writeFileSync(
      path.join(__dirname, "../evidencia/accesibilidad.json"),
      JSON.stringify({ fecha: new Date().toISOString(), states }, null, 2),
    );
    for (const s of states) {
      console.log(s.state, s.violations.length + " infracciones");
      assert.deepEqual(
        s.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => n.target),
        })),
        [],
      );
    }
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
