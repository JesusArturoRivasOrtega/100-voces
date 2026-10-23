(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  Voces.initNavigation();
  try {
    const data = Voces.validate(window.VOCES_DATA),
      visuals = Voces.initVisuals(data),
      learning = Voces.initLearning();
    Voces.initScenarios(data);
    Voces.initExport(data);
    const contrasts = Voces.initContrasts(data);
    $("loadStatus").hidden = true;
    $("participationStory").setAttribute("aria-live", "polite");
    $("stateComparison").setAttribute("aria-live", "polite");
    const sections = [
      "historia",
      "tiempo",
      "territorio",
      "aprender",
      "escenarios",
      "compartir",
    ];
    const quick = [
      "60 puntos ilustran 59,7 %. Explora quiénes entran en el denominador: los no especificados quedan fuera.",
      "Compara elecciones del mismo tipo: de 2018 a 2024, −2,7 puntos porcentuales. La diferencia no explica sus causas.",
      "El grupo de 25–29 años registra 47,3 % en México. Es una tasa nacional, independiente de la vista por entidad.",
      "Siete preguntas para practicar. Puedes responder una ahora y completar las demás a tu ritmo.",
      "A: 54,7 %. B: 64,7 %. Los separan 10 pp. Ambos son supuestos, no pronósticos.",
      "Descarga una tarjeta con su descripción accesible. En Recursos tienes el kit, cinco láminas y el video.",
    ];
    const jury = [
      "0:00–0:30 · Explica 59,7 %, los puntos redondeados y el denominador. Activa «No especificados».",
      "0:30–1:00 · Muestra 2018→2024: −2,7 pp. Distingue una diferencia observada de una explicación causal.",
      "1:00–1:25 · Muestra 25–29 años: 47,3 % nacional. Compara con 59,7 %; no es un cruce por entidad.",
      "1:25–1:50 · Responde un reactivo y muestra su explicación. Hay siete ideas, sin cuentas ni registro de respuestas.",
      "1:50–2:15 · Compara A 54,7 % y B 64,7 % con el observado: −5 y +5 pp. No son efectos estimados de campañas.",
      "2:15–2:55 · Descarga una tarjeta por edad y muestra Recursos: kit, carrusel y video. El piloto está preparado, aún sin resultados.",
    ];
    let tourAt = 0,
      mode = "quick",
      returnFocus = null;
    function showTour() {
      $("tourTitle").textContent =
        (mode === "quick"
          ? "Ruta breve · tiempo orientativo"
          : "Presentación · 3 min") +
        " · " +
        (tourAt + 1) +
        " / 6";
      $("tourText").textContent = (mode === "quick" ? quick : jury)[tourAt];
      $("tourBack").disabled = tourAt === 0;
      $("tourNext").textContent =
        tourAt === 5 ? "Terminar recorrido" : "Siguiente →";
      $(sections[tourAt]).scrollIntoView({
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        block: "start",
      });
    }
    function closeTour() {
      $("tour").hidden = true;
      document.body.classList.remove("tour-active");
      returnFocus?.focus({ preventScroll: true });
    }
    function begin(m, button) {
      mode = m;
      tourAt = 0;
      returnFocus = button;
      visuals.setYear(2024);
      visuals.kind("presidencial");
      visuals.state("Veracruz");
      contrasts.view("age");
      contrasts.setAge("25–29 años");
      learning.reset();
      document.querySelector('[data-denominator="yes"]').click();
      $("exampleScenario").click();
      for (const [id, value] of [
        ["cardType", "age"],
        ["cardAge", "25–29 años"],
        ["cardAudience", "aula"],
        ["cardFormat", "horizontal"],
      ]) {
        $(id).value = value;
        $(id).dispatchEvent(new Event("change"));
      }
      document
        .querySelectorAll("main details")
        .forEach((d) => (d.open = false));
      $("tour").hidden = false;
      document.body.classList.add("tour-active");
      showTour();
      $("tourNext").focus({ preventScroll: true });
    }
    $("quickMode").onclick = (e) => begin("quick", e.currentTarget);
    $("juryMode").onclick = (e) => begin("jury", e.currentTarget);
    $("tourNext").onclick = () => {
      if (tourAt === 5) closeTour();
      else {
        tourAt++;
        showTour();
      }
    };
    $("tourBack").onclick = () => {
      if (tourAt > 0) {
        tourAt--;
        showTour();
      }
    };
    $("tourClose").onclick = closeTour;
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !$("tour").hidden) closeTour();
    });
    $("printLesson").onclick = () => window.print();
    document.documentElement.dataset.ready = "true";
  } catch (err) {
    $("loadStatus").hidden = false;
    $("loadStatus").textContent =
      "Datos no disponibles: " +
      err.message +
      " Revisa el archivo de datos y vuelve a cargar la página.";
    document
      .querySelectorAll("main button,main select,main input")
      .forEach((el) => (el.disabled = true));
    document
      .querySelectorAll(
        "#participationValue,#splitYes,#splitNo,#stateValue,#statePercent,#ageValue,#scenarioBase,#scenarioOutput,#scenarioOutputA",
      )
      .forEach((el) => (el.textContent = "No disponible"));
    document.documentElement.dataset.ready = "error";
    console.error(err);
  }
})();
