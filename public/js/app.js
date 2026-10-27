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
    const jurySections=['historia','tiempo','territorio','aprender','lente','compartir','en-vivo'];
    jury.splice(4,2,
      '1:35–2:00 · En Lente, prueba «¿Porcentaje o puntos?», confirma el contexto y contrasta. −2,7 % debe distinguirse de −2,7 pp.',
      '2:00–2:25 · Descarga una tarjeta con descripción y fuente. El resumen del recorrido registra acciones, no aprendizaje demostrado.',
      '2:25–2:55 · Abre la demostración local, añade respuestas ficticias y revela evidencia. Las salas compartidas requieren servidor y permisos de acceso.');
    jury[0]='0:00–0:25 · Explica 59,7 %, los puntos redondeados y quién entra en el denominador.';
    jury[1]='0:25–0:50 · Muestra 2018→2024: −2,7 pp. El tercer año es contexto; la diferencia no prueba causas.';
    jury[2]='0:50–1:10 · Distingue una entidad de 25–29 años: 47,3 % nacional. No hay cruce edad por entidad.';
    jury[3]='1:10–1:35 · Responde un reactivo y muestra su explicación. El cierre recomienda conceptos por repasar.';
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
        " / " + (mode==='quick'?sections.length:jurySections.length);
      $("tourText").textContent = (mode === "quick" ? quick : jury)[tourAt];
      $("tourBack").disabled = tourAt === 0;
      $("tourNext").textContent =
        tourAt === (mode==='quick'?sections.length:jurySections.length)-1 ? "Terminar recorrido" : "Siguiente →";
      $((mode==='quick'?sections:jurySections)[tourAt]).scrollIntoView({
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
      document.body.classList.add("tour-active");
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
        ["cardMessage", "question"],
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
      if (tourAt === (mode==='quick'?sections.length:jurySections.length)-1) closeTour();
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
