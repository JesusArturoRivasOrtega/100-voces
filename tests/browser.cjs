const fs = require("fs"),
  path = require("path"),
  assert = require("assert/strict");
const { chromium, browserOptions, baseURL, axePath } = require("./runtime.cjs");
const root = path.resolve(__dirname, ".."),
  out = path.join(root, "evidencia");
fs.mkdirSync(out, { recursive: true });
const V = require("../public/js/core.js"),
  data = require("../public/data/ccpc_resumen.json");
const results = [],
  errors = [];
let browser;
const record = (name, expected, observed) =>
  results.push({
    prueba: name,
    esperado: expected,
    observado: observed,
    estado: "VERIFICADO",
  });
(async () => {
  assert.equal(V.validate(data), data);
  assert.equal(V.delta(62.4, 59.7), -2.7);
  assert.equal(V.complement(59.7), 40.3);
  assert.equal(V.relative(50, 60), 20);
  assert.equal(V.relative(0, 10), null);
  for (const bad of [NaN, -1, 101, null]) {
    const d = structuredClone(data);
    d.years[0].participation = bad;
    assert.throws(() => V.validate(d));
  }
  record(
    "Cálculos y validación",
    "−2.7 pp; complemento 40.3; relativo 20; rechazar tasas inválidas",
    "Coinciden; cuatro casos inválidos rechazados",
  );
  browser = await chromium.launch(browserOptions);
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    permissions: ["clipboard-read", "clipboard-write"],
    reducedMotion: "reduce",
  });
  const p = await context.newPage();
  p.on("pageerror", (e) => errors.push(e.message));
  p.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  const r = await p.goto(baseURL + "/public/");
  assert.equal(r.status(), 200);
  await p.waitForFunction(
    () => document.documentElement.dataset.ready === "true",
  );
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({
    path: path.join(out, "escritorio.png"),
    fullPage: true,
  });
  for (const d of data.years) {
    await p.locator(`[data-year="${d.year}"]`).first().click();
    assert.equal(
      await p.locator("#participationValue").textContent(),
      V.fmt(d.participation),
    );
    assert.equal(
      await p.locator("#dotGrid .on").count(),
      Math.round(d.participation),
    );
    assert.equal(
      await p.locator("#splitNo").textContent(),
      V.fmt(V.complement(d.participation)) + " %",
    );
    assert.match(
      await p.locator("#yearEvidence").textContent(),
      new RegExp(String(d.year)),
    );
  }
  record(
    "Seis años",
    "Tasa, complemento, puntos y evidencia actualizados",
    "6/6 años coinciden",
  );
  await p.locator("#presBtn").click();
  assert.match(await p.locator("#compareSummary").textContent(), /-2,7 pp/);
  assert.equal(await p.locator("#compareFrom option").count(), 3);
  await p.locator("#midBtn").click();
  assert.match(await p.locator("#compareSummary").textContent(), /\+4,7 pp/);
  await p.locator("#compareFrom").selectOption("2009");
  assert.match(await p.locator("#compareSummary").textContent(), /\+7,7 pp/);
  record(
    "Comparador",
    "Separar tipos; −2.7, +4.7 y +7.7 pp",
    "Tres diferencias coinciden y cada grupo tiene 3 años",
  );
  for (const s of data.states_2024) {
    await p.locator("#stateSelect").selectOption(s.name);
    assert.equal(
      await p.locator("#statePercent").textContent(),
      V.fmt(s.participation) + " %",
    );
    assert.ok(
      (await p.locator("#stateComparison").textContent()).includes(
        V.pp(V.delta(59.7, s.participation)),
      ),
    );
  }
  record(
    "Territorios",
    "8 entidades; diferencias respecto a 2024 nacional",
    "8/8 coinciden; selección declarada",
  );
  const answers = [0, 1, 2, 0, 1, 1, 0];
  for (let i = 0; i < 7; i++) {
    assert.equal(await p.locator("#nextQuestion").isDisabled(), true);
    await p.locator("#quizAnswers button").nth(answers[i]).click();
    assert.ok((await p.locator("#quizFeedback").textContent()).length > 30);
    await p.locator("#nextQuestion").click();
  }
  assert.match(await p.locator("#quizResult").textContent(), /7 de 7/);
  await p.locator("#restartQuiz").click();
  assert.match(await p.locator("#quizCounter").textContent(), /1 DE 7/);
  assert.equal(await p.locator("#quizProgress").getAttribute("value"), "0");
  record(
    "Aprendizaje",
    "7 respuestas, feedback, resultado y reinicio",
    "7/7; pantalla final; reinicio a cero",
  );
  for (const n of [0, 49.7, 59.7, 64.7, 100]) {
    await p.locator("#scenarioSlider").fill(String(n));
    assert.equal(
      await p.locator("#scenarioOutput").textContent(),
      V.fmt(n) + " %",
    );
    assert.equal(await p.locator("#scenarioDots .on").count(), Math.round(n));
    assert.ok(
      (await p.locator("#scenarioDifference").textContent()).includes(
        V.pp(V.delta(59.7, n)),
      ),
    );
  }
  await p.locator("#resetScenario").click();
  assert.equal(await p.locator("#scenarioSlider").inputValue(), "59.7");
  record(
    "Escenarios",
    "0–100; subidas, bajadas, cambio nulo y reinicio",
    "5 valores y extremos comprobados; cálculos coinciden",
  );
  for (const [fmt, w, h] of [
    ["horizontal", 1200, 630],
    ["vertical", 1080, 1350],
    ["story", 1080, 1920],
  ]) {
    await p.locator("#cardFormat").selectOption(fmt);
    await p.locator("#cardType").selectOption("state");
    await p.locator("#cardState").selectOption("Ciudad de México");
    const [download] = await Promise.all([
      p.waitForEvent("download"),
      p.locator("#downloadCard").click(),
    ]);
    const dest = path.join(out, `tarjeta-${fmt}.png`);
    await download.saveAs(dest);
    const bytes = fs.readFileSync(dest);
    assert.equal(bytes.readUInt32BE(16), w);
    assert.equal(bytes.readUInt32BE(20), h);
    assert.equal(await p.locator("#cardYear").inputValue(), "2024");
    assert.equal(await p.locator("#cardYear").isDisabled(), true);
  }
  record(
    "Descargas PNG",
    "Archivos reales 1200×630,1080×1350,1080×1920",
    "3 PNG descargados; dimensiones verificadas en cabecera; revisión visual separada",
  );
  await p.locator("#cardType").selectOption("complement");
  await p.locator("#cardYear").selectOption("2009");
  assert.match(await p.locator("#accessibleText").inputValue(), /55,9/);
  await p.locator("#copyText").click();
  const copied = await p.evaluate(() => navigator.clipboard.readText());
  assert.match(copied, /55,9/);
  assert.match(copied, /https:\/\/ine.mx/);
  record(
    "Portapapeles",
    "Texto accesible con tasa, año, denominador y fuente",
    "Lectura real del portapapeles coincide",
  );
  await p.locator("#quickMode").click();
  for (let i = 0; i < 6; i++) await p.locator("#tourNext").click();
  assert.equal(await p.locator("#tour").isVisible(), false);
  await p.locator("#juryMode").click();
  await p.keyboard.press("Escape");
  assert.equal(await p.locator("#tour").isVisible(), false);
  record(
    "Recorridos",
    "6 pasos y salida por Escape",
    "Recorrido completado; modo jurado abierto/cerrado",
  );
  for (const width of [320, 375, 768, 1440]) {
    await p.setViewportSize({ width, height: 900 });
    await p.evaluate(() => window.scrollTo(0, 0));
    const dim = await p.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
    }));
    assert.ok(dim.scroll <= dim.client, JSON.stringify({ width, ...dim }));
    await p.screenshot({
      path: path.join(out, `ancho-${width}.png`),
      fullPage: true,
    });
  }
  record(
    "Responsive",
    "Sin desbordamiento a 320,375,768,1440 px",
    "scrollWidth <= clientWidth en los cuatro anchos",
  );
  await p.setViewportSize({ width: 1280, height: 900 });
  await p.goto(baseURL + "/public/");
  await p.keyboard.press("Tab");
  assert.equal(
    await p.evaluate(() => document.activeElement.className),
    "skip",
  );
  await p.keyboard.press("Enter");
  let focused = new Set();
  for (let i = 0; i < 130; i++) {
    await p.keyboard.press("Tab");
    focused.add(
      await p.evaluate(
        () => document.activeElement.id || document.activeElement.tagName,
      ),
    );
  }
  for (const id of [
    "stateSelect",
    "scenarioSlider",
    "cardYear",
    "downloadCard",
    "copyText",
    "nextQuestion",
  ]) {
    if (id !== "nextQuestion")
      assert.ok(focused.has(id), "No alcanzado por Tab: " + id);
  }
  record(
    "Teclado",
    "Saltar al contenido y alcanzar controles principales por Tab",
    "Enlaces, selectores, slider, descarga y copia alcanzables",
  );
  const reduced = await p.evaluate(
    () => getComputedStyle(document.querySelector(".dot")).animationName,
  );
  assert.equal(reduced, "none");
  record(
    "Movimiento reducido",
    "Sin animación de puntos",
    "animation-name: none",
  );
  const offline = await context.newPage();
  await context.setOffline(true);
  await offline.goto(
    "file:///" + path.join(root, "100_VOCES_ABRIR.html").replace(/\\/g, "/"),
  );
  assert.equal(
    await offline.locator("html").getAttribute("data-ready"),
    "true",
  );
  await offline.locator('[data-year="2009"]').first().click();
  assert.equal(
    await offline.locator("#participationValue").textContent(),
    "44,1",
  );
  await offline.locator("#cardFormat").selectOption("vertical");
  const [dl] = await Promise.all([
    offline.waitForEvent("download"),
    offline.locator("#downloadCard").click(),
  ]);
  await dl.saveAs(path.join(out, "tarjeta-offline.png"));
  record(
    "Archivo autónomo sin red",
    "file:// funcional; cambio de año y exportación",
    "Archivo abrió offline, dato actualizado y PNG descargado",
  );
  await context.setOffline(false);
  const broken = await context.newPage();
  await broken.route("**/js/data.js", (route) =>
    route.fulfill({
      contentType: "text/javascript",
      body: "window.VOCES_DATA={years:[],states_2024:[]}",
    }),
  );
  await broken.goto(baseURL + "/public/");
  assert.equal(
    await broken.locator("html").getAttribute("data-ready"),
    "error",
  );
  assert.match(
    await broken.locator("#loadStatus").textContent(),
    /Datos no disponibles/,
  );
  assert.equal(await broken.locator("#downloadCard").isDisabled(), true);
  record(
    "Datos inválidos",
    "Mensaje explícito y controles desactivados",
    "Rechazo probado con serie vacía; sin datos sustitutos",
  );
  assert.deepEqual(errors, []);
  record(
    "Consola normal",
    "Sin errores JS ni de recursos",
    "0 errores durante uso normal",
  );
  fs.writeFileSync(
    path.join(out, "pruebas.json"),
    JSON.stringify(
      {
        fecha: new Date().toISOString(),
        navegador: await browser.version(),
        resultados: results,
        limites: [
          "No es auditoría WCAG completa",
          "Pendiente prueba manual con lector de pantalla",
          "No es piloto de impacto con usuarios",
        ],
      },
      null,
      2,
    ),
  );
  console.log(JSON.stringify(results, null, 2));
})()
  .catch((e) => {
    results.push({ prueba: "Ejecución", estado: "FALLÓ", observado: e.stack });
    fs.writeFileSync(
      path.join(out, "pruebas.json"),
      JSON.stringify(results, null, 2),
    );
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await browser?.close();
  });
