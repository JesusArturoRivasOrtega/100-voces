const fs = require("fs"),
  path = require("path"),
  assert = require("assert/strict");
const { chromium, browserOptions, baseURL } = require("./runtime.cjs");
const root = path.resolve(__dirname, ".."),
  out = path.join(root, "evidencia");
(async () => {
  const browser = await chromium.launch(browserOptions);
  const results = [];
  try {
    const p = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
      reducedMotion: "reduce",
    });
    await p.goto(baseURL + "/public/");
    await p.waitForFunction(
      () => document.documentElement.dataset.ready === "true",
    );
    await p.evaluate(() => document.fonts.ready);
    await p.locator('#stateRankings button[data-state="Yucatán"]').focus();
    await p.keyboard.press("Enter");
    assert.equal(
      await p.evaluate(() => document.activeElement.dataset.state),
      "Yucatán",
    );
    results.push({
      prueba: "Foco territorial",
      estado: "VERIFICADO",
      detalle: "Enter conserva el botón y la entidad seleccionada",
    });
    await p.locator("#scenarioSliderA").fill("0");
    await p.locator("#scenarioSlider").fill("100");
    await p.locator("#quizAnswers button").first().click();
    await p.locator("#juryMode").click();
    assert.equal(await p.locator("#stateSelect").inputValue(), "Veracruz");
    assert.equal(await p.locator("#ageSelect").inputValue(), "25–29 años");
    assert.equal(await p.locator("#scenarioSliderA").inputValue(), "54.7");
    assert.equal(await p.locator("#scenarioSlider").inputValue(), "64.7");
    assert.equal(await p.locator("#quizProgress").getAttribute("value"), "0");
    assert.equal(await p.locator("#cardType").inputValue(), "age");
    await p.keyboard.press("Escape");
    results.push({
      prueba: "Demostración repetible",
      estado: "VERIFICADO",
      detalle: "Entidad, edad, A/B, quiz y tarjeta restablecidos",
    });
    await p.setViewportSize({ width: 375, height: 812 });
    await p.evaluate(() => window.scrollTo(0, 0));
    const hero = await p
      .locator(".hero")
      .evaluate((el) => el.getBoundingClientRect().height);
    assert.ok(hero < 900, "Portada móvil demasiado larga: " + hero);
    await p.screenshot({ path: path.join(out, "portada-movil-final.png") });
    await p.locator("#menuToggle").click();
    assert.equal(
      await p.locator("#menuToggle").getAttribute("aria-expanded"),
      "true",
    );
    await p.locator('#chapterMenu a[href="#territorio"]').click();
    assert.equal(await p.locator("#chapterMenu").isVisible(), false);
    assert.equal(
      await p.evaluate(() => document.activeElement.id),
      "territorio",
    );
    await p.locator("#menuToggle").click();
    await p.keyboard.press("Escape");
    assert.equal(
      await p.evaluate(() => document.activeElement.id),
      "menuToggle",
    );
    results.push({
      prueba: "Navegación móvil",
      estado: "VERIFICADO",
      detalle:
        "Menú, Escape, foco en destino; portada " +
        Math.round(hero) +
        " px a 375×812",
    });
    for (const width of [320, 375, 768, 1440]) {
      await p.setViewportSize({ width, height: 900 });
      await p.locator(".carousel-preview").evaluate((el) => (el.open = true));
      assert.ok(
        await p.evaluate(
          () =>
            document.documentElement.scrollWidth <=
            document.documentElement.clientWidth,
        ),
        "Desborde " + width,
      );
    }
    await p.setViewportSize({ width: 640, height: 900 });
    await p.evaluate(() => (document.documentElement.style.fontSize = "200%"));
    assert.ok(
      await p.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
      "Texto ampliado",
    );
    await p.evaluate(() => (document.documentElement.style.fontSize = ""));
    results.push({
      prueba: "Recursos y texto ampliado",
      estado: "VERIFICADO",
      detalle: "Carrusel sin desborde en 4 anchos; texto base 200% a 640px",
    });
    const urls = await p
      .locator(
        'a[href^="recursos/"],img[src^="recursos/"],source[src^="recursos/"],track[src^="recursos/"]',
      )
      .evaluateAll((els) => [
        ...new Set(
          els.map((el) => el.getAttribute("href") || el.getAttribute("src")),
        ),
      ]);
    for (const url of urls) {
      const r = await p.request.get(baseURL + "/public/" + url);
      assert.equal(r.status(), 200, url);
      assert.ok((await r.body()).length > 0, url);
    }
    results.push({
      prueba: "Recursos descargables",
      estado: "VERIFICADO",
      detalle:
        urls.length + " destinos locales existen y responden con contenido",
    });
    const offline = await browser.newPage();
    await offline.context().setOffline(true);
    await offline.goto(
      "file:///" + path.join(root, "100_VOCES_ABRIR.html").replace(/\\/g, "/"),
    );
    await offline.waitForFunction(
      () => document.documentElement.dataset.ready === "true",
    );
    assert.equal(
      await offline.locator("#quizProgress").getAttribute("max"),
      "7",
    );
    assert.match(
      await offline
        .locator('a[href$="100_VOCES_Kit_Docente.pdf"]')
        .getAttribute("href"),
      /^public\/recursos\//,
    );
    results.push({
      prueba: "Distribución autónoma",
      estado: "VERIFICADO",
      detalle: "Siete preguntas y rutas al kit local correctas sin red",
    });
    await p.setViewportSize({ width: 1440, height: 1000 });
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.screenshot({
      path: path.join(out, "portada-escritorio-final.png"),
    });
    fs.writeFileSync(
      path.join(out, "pruebas-version-1.1.json"),
      JSON.stringify(
        { fecha: new Date().toISOString(), resultados: results },
        null,
        2,
      ),
    );
    console.log(JSON.stringify(results, null, 2));
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
