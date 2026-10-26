const fs = require("fs"),
  path = require("path"),
  assert = require("assert/strict");
const { chromium, browserOptions, baseURL, axePath } = require("./runtime.cjs");
const root = path.resolve(__dirname, ".."),
  out = path.join(root, "evidencia"),
  V = require("../public/js/core.js"),
  data = require("../public/data/ccpc_resumen.json");
const expected = [
  56.8, 48.4, 47.3, 52, 56.1, 60.2, 64.1, 67.2, 69.5, 73, 76.5, 75.5, 71.4,
  63.6, 51.4, 36.7, 23.8, 18.5,
];
const results = [],
  errors = [];
let browser;
const pass = (name, detail) =>
  results.push({ prueba: name, estado: "VERIFICADO", detalle: detail });
(async () => {
  assert.deepEqual(
    data.age_2024.map((d) => d.participation),
    expected,
  );
  assert.equal(data.age_2024[0].age_group, "18–19 años");
  assert.equal(data.age_2024[17].age_group, "100 años o más");
  for (const mutate of [
    (d) => d.age_2024.pop(),
    (d) => (d.age_2024[0].participation = 101),
    (d) => (d.age_2024[0].source_title = ""),
    (d) => (d.age_2024[0].source_page = 0),
    (d) => (d.age_2024[1].age_group = d.age_2024[0].age_group),
    (d) => (d.states_2024 = []),
  ]) {
    const bad = structuredClone(data);
    mutate(bad);
    assert.throws(() => V.validate(bad));
  }
  pass(
    "Serie por edad y errores",
    "18 valores cotejados con gráfica 5; seis variantes inválidas rechazadas",
  );
  browser = await chromium.launch(browserOptions);
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  const p = await context.newPage();
  p.on("pageerror", (e) => errors.push(e.message));
  await p.goto(baseURL + "/public/");
  await p.waitForFunction(
    () => document.documentElement.dataset.ready === "true",
  );
  await p.evaluate(() => document.fonts.ready);
  assert.equal(
    await p.locator("#ageView").evaluate((el) => el.closest("section").id),
    "territorio",
  );
  await p.locator('[data-denominator="unknown"]').click();
  assert.match(
    await p.locator("#denominatorExplanation").textContent(),
    /No se cuentan como abstención/,
  );
  await p.locator('[data-denominator="no"]').click();
  assert.match(
    await p.locator("#denominatorExplanation").textContent(),
    /denominador/,
  );
  await p.locator('[data-denominator="yes"]').click();
  assert.match(
    await p.locator("#denominatorExplanation").textContent(),
    /numerador/,
  );
  pass("Denominador", "Tres explicaciones y selección exclusivas");
  await p.locator("#viewAges").click();
  assert.equal(await p.locator("#territoryView").isVisible(), false);
  assert.equal(await p.locator("#ageBars button").count(), 18);
  for (let i = 0; i < 18; i++) {
    await p.locator("#ageBars button").nth(i).click();
    assert.equal(
      await p.locator("#ageValue").textContent(),
      V.fmt(expected[i]) + " %",
    );
    assert.equal(
      await p.locator("#ageSelect").inputValue(),
      data.age_2024[i].age_group,
    );
    assert.equal(await p.locator("#ageBars [aria-pressed=true]").count(), 1);
    assert.match(
      await p.locator("#ageEvidence").textContent(),
      /Estudio de Participación Ciudadana 2024/,
    );
    assert.match(
      await p.locator("#ageEvidence a").getAttribute("href"),
      /#page=18$/,
    );
  }
  await p.locator("#ageSelect").selectOption("25–29 años");
  assert.match(await p.locator("#ageComparison").textContent(), /-12,4 pp/);
  pass(
    "Contrastes por edad",
    "18 selecciones; cambio de vista; fuente del estudio y comparación −12,4 pp",
  );
  await p.locator("#ageShare").click();
  assert.equal(await p.locator("#cardType").inputValue(), "age");
  assert.equal(await p.locator("#cardAge").inputValue(), "25–29 años");
  assert.equal(await p.locator("#cardYear").inputValue(), "2024");
  assert.equal(await p.locator("#cardYear").isDisabled(), true);
  assert.match(await p.locator("#accessibleText").inputValue(), /47,3/);
  assert.match(
    await p.locator("#accessibleText").inputValue(),
    /Estudio de Participación Ciudadana 2024/,
  );
  await p.locator("#cardAge").selectOption("100 años o más");
  for (const [format, w, h] of [
    ["horizontal", 1200, 630],
    ["vertical", 1080, 1350],
    ["story", 1080, 1920],
  ]) {
    await p.locator("#cardFormat").selectOption(format);
    const [dl] = await Promise.all([
      p.waitForEvent("download"),
      p.locator("#downloadCard").click(),
    ]);
    const file = path.join(out, `edad-${format}.png`);
    await dl.saveAs(file);
    const b = fs.readFileSync(file);
    assert.equal(b.readUInt32BE(16), w);
    assert.equal(b.readUInt32BE(20), h);
  }
  await p.locator("#cardType").selectOption("participation");
  assert.equal(await p.locator("#cardYear").isDisabled(), false);
  assert.equal(await p.locator("#cardAgeField").isVisible(), false);
  pass(
    "Tarjetas por edad",
    "Transferencia del grupo al generador, cita correcta y tres PNG reales",
  );
  const cases = [
    [0, 100, "+100,0 pp"],
    [100, 0, "-100,0 pp"],
    [54.7, 64.7, "+10,0 pp"],
    [59.7, 59.7, "0,0 pp"],
  ];
  for (const [a, b, difference] of cases) {
    await p.locator("#scenarioSliderA").fill(String(a));
    await p.locator("#scenarioSlider").fill(String(b));
    assert.equal(
      await p.locator("#scenarioOutputA").textContent(),
      V.fmt(a) + " %",
    );
    assert.equal(
      await p.locator("#scenarioOutput").textContent(),
      V.fmt(b) + " %",
    );
    assert.ok(
      (await p.locator("#scenarioDifference").textContent()).includes(
        difference,
      ),
    );
  }
  await p.locator("#resetScenario").click();
  assert.equal(await p.locator("#scenarioSliderA").inputValue(), "59.7");
  assert.equal(await p.locator("#scenarioSlider").inputValue(), "59.7");
  await p.locator("#exampleScenario").click();
  assert.equal(await p.locator("#scenarioSliderA").inputValue(), "54.7");
  assert.equal(await p.locator("#scenarioSlider").inputValue(), "64.7");
  pass(
    "Escenarios A/B",
    "Extremos, orden inverso, igualdad, reinicio y ejemplo ±5 pp",
  );
  for (const width of [320, 375, 768, 1440]) {
    await p.setViewportSize({ width, height: 1000 });
    assert.ok(
      await p.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
    );
    await p.locator("#ageSelect").selectOption("25–29 años");
    if (width === 375 || width === 1440) {
      await p
        .locator("#territorio")
        .screenshot({ path: path.join(out, `edades-${width}.png`) });
      await p
        .locator("#escenarios")
        .screenshot({ path: path.join(out, `escenarios-${width}.png`) });
    }
  }
  pass(
    "Adaptación de nuevas vistas",
    "Sin desbordamiento en cuatro anchos; capturas móvil/escritorio",
  );
  await p.setViewportSize({ width: 1440, height: 1000 });
  await p.addScriptTag({ path: axePath });
  const accessibility = [];
  for (const state of ["ages", "evidence-and-cards"]) {
    if (state === "evidence-and-cards") {
      await p
        .locator("#ageEvidence")
        .evaluate((el) => (el.parentElement.open = true));
      await p.locator("#cardType").selectOption("age");
    }
    const r = await p.evaluate(() =>
      axe.run(document, {
        runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
      }),
    );
    accessibility.push({
      state,
      violations: r.violations,
      incomplete: r.incomplete.map((i) => ({
        id: i.id,
        nodes: i.nodes.map((n) => n.target),
      })),
      passes: r.passes.length,
    });
  }
  fs.writeFileSync(
    path.join(out, "accesibilidad-mejoras.json"),
    JSON.stringify(accessibility, null, 2),
  );
  for (const a of accessibility)
    assert.deepEqual(
      a.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
      [],
    );
  pass(
    "Accesibilidad automática",
    "Cero infracciones en dos estados de las nuevas vistas; no es certificación WCAG",
  );
  await context.setOffline(true);
  const offline = await context.newPage();
  await offline.goto(
    "file:///" + path.join(root, "100_VOCES_ABRIR.html").replace(/\\/g, "/"),
  );
  await offline.locator("#viewAges").click();
  await offline.locator("#ageSelect").selectOption("65–69 años");
  assert.equal(await offline.locator("#ageValue").textContent(), "76,5 %");
  await offline.locator("#scenarioSliderA").fill("0");
  await offline.locator("#scenarioSlider").fill("100");
  assert.match(
    await offline.locator("#scenarioDifference").textContent(),
    /\+100,0 pp/,
  );
  pass("Archivo autónomo", "Edades y escenarios A/B funcionan sin red");
  assert.deepEqual(errors, []);
  pass("Consola", "Sin errores JavaScript");
})()
  .catch((e) => {
    results.push({ prueba: "Ejecución", estado: "FALLÓ", detalle: e.stack });
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    fs.writeFileSync(
      path.join(out, "pruebas-mejoras.json"),
      JSON.stringify(
        { fecha: new Date().toISOString(), resultados: results },
        null,
        2,
      ),
    );
    console.log(JSON.stringify(results, null, 2));
    await browser?.close();
  });
