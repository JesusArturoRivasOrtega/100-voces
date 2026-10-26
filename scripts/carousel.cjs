const fs = require("fs"),
  path = require("path");
const { chromium, browserOptions, baseURL } = require("../tests/runtime.cjs");
const out = path.join(__dirname, "../public/recursos/carrusel");
fs.mkdirSync(out, { recursive: true });
const slides = [
  {
    title: "Una cifra. Cien puntos.",
    number: "59,7 %",
    intro: "Participación nacional CCPC · 2024",
    body: "Aproximadamente 60 puntos se iluminan. El dibujo redondea; la tasa conserva el decimal publicado.",
    source: "INE · Manual CCPC 2009–2024 · p. 21",
    type: "dots",
  },
  {
    title: "El total importa.",
    number: "¿Quiénes cuentan?",
    intro: "El denominador de la tasa CCPC",
    body: "Los registros no especificados quedan fuera del cálculo. No se cuentan como abstención.",
    source: "INE · Manual CCPC 2009–2024 · pp. 17–18",
    type: "formula",
  },
  {
    title: "Compara con contexto.",
    number: "−2,7 pp",
    intro: "Presidenciales · 2018 → 2024",
    body: "62,4 % → 59,7 %. El cambio relativo es aproximadamente −4,3 %. Las dos unidades expresan cosas distintas.",
    source: "INE · Manual CCPC 2009–2024 · p. 21",
    type: "bars",
  },
  {
    title: "Una diferencia abre una pregunta.",
    number: "47,3 %",
    intro: "México · Grupo de 25–29 años · 2024",
    body: "Son −12,4 pp frente al 59,7 % nacional. La tasa no explica los motivos de cada persona ni corresponde a una entidad elegida.",
    source: "INE · Estudio de Participación 2024 · p. 18 / Manual CCPC · p. 21",
    type: "age",
  },
  {
    title: "Comparte una explicación.",
    number: "Con la fuente a la vista.",
    intro: "Cinco preguntas antes de publicar",
    body: "Un dato ayuda a conversar cuando reconocemos su alcance. ¿Qué sabemos y qué información nos falta?",
    source: "100 VOCES · Guía de lectura basada en fuentes INE",
    type: "check",
  },
];
(async () => {
  const b = await chromium.launch(browserOptions);
  try {
    const p = await b.newPage();
    await p.goto(baseURL + "/public/");
    await p.evaluate(() => document.fonts.ready);
    for (let i = 0; i < slides.length; i++) {
      const data = await p.evaluate(
        ({ s, i }) => {
          const c = document.createElement("canvas");
          c.width = 1080;
          c.height = 1350;
          const x = c.getContext("2d");
          x.fillStyle = "#12142b";
          x.fillRect(0, 0, 1080, 1350);
          x.fillStyle = "#ee5d9c";
          x.fillRect(0, 0, 1080, 12);
          function text(
            t,
            left,
            top,
            max,
            size = 32,
            color = "#f9f7f2",
            bold = false,
          ) {
            x.font =
              (bold ? "800 " : "500 ") +
              size +
              "px " +
              (bold ? "Manrope" : '"DM Sans"');
            x.fillStyle = color;
            let line = "",
              y = top;
            for (const word of t.split(" ")) {
              const next = line ? line + " " + word : word;
              if (x.measureText(next).width > max && line) {
                x.fillText(line, left, y);
                y += size * 1.3;
                line = word;
              } else line = next;
            }
            if (line) {
              x.fillText(line, left, y);
              y += size * 1.3;
            }
            return y;
          }
          text("100 VOCES", 66, 80, 700, 28, "#baf5d1", true);
          text(
            String(i + 1).padStart(2, "0") + " / 05",
            865,
            80,
            170,
            24,
            "#d9c4ff",
          );
          const end = text(s.title, 66, 177, 940, 62, "#f9f7f2", true);
          text(s.intro, 66, end + 22, 940, 25, "#d9c4ff");
          text(
            s.number,
            62,
            510,
            950,
            s.type === "formula" || s.type === "check" ? 54 : 142,
            "#f8bbd7",
            true,
          );
          if (s.type === "dots") {
            for (let j = 0; j < 100; j++) {
              x.beginPath();
              x.arc(
                294 + (j % 10) * 55,
                550 + Math.floor(j / 10) * 38,
                12,
                0,
                Math.PI * 2,
              );
              x.fillStyle = j < 60 ? "#ee5d9c" : "#626278";
              x.fill();
            }
          } else if (s.type === "formula") {
            text("Sí votaron", 180, 625, 720, 55, "#baf5d1", true);
            x.strokeStyle = "#d9c4ff";
            x.lineWidth = 3;
            x.beginPath();
            x.moveTo(95, 660);
            x.lineTo(985, 660);
            x.stroke();
            text("Sí votaron + No votaron", 95, 733, 890, 49, "#f9f7f2", true);
            text("× 100", 430, 835, 250, 48, "#d9c4ff", true);
          } else if (s.type === "bars" || s.type === "age") {
            const rows =
              s.type === "bars"
                ? [
                    ["2018", 62.4],
                    ["2024", 59.7],
                  ]
                : [
                    ["Nacional", 59.7],
                    ["25–29 años", 47.3],
                  ];
            rows.forEach(([label, value], n) => {
              const y = 580 + n * 150;
              text(label, 66, y, 300, 30, "#d9c4ff", true);
              x.fillStyle = "#39394c";
              x.fillRect(66, y + 25, 800, 40);
              x.fillStyle = n ? "#ee5d9c" : "#baf5d1";
              x.fillRect(66, y + 25, (800 * value) / 100, 40);
              text(
                String(value).replace(".", ",") + " %",
                885,
                y + 55,
                180,
                30,
              );
            });
            text("Escala común: 0 a 100 %", 66, 873, 900, 25, "#d9c4ff");
          } else {
            [
              "1. ¿Qué cifra y año estoy mostrando?",
              "2. ¿Qué incluye el denominador?",
              "3. ¿La comparación tiene contexto?",
              "4. ¿Puedo localizar la fuente?",
              "5. ¿Qué no permite concluir el dato?",
            ].forEach((line, n) =>
              text(
                line,
                66,
                565 + n * 69,
                950,
                32,
                n % 2 ? "#d9c4ff" : "#baf5d1",
                true,
              ),
            );
          }
          const bottom = text(s.body, 66, 985, 950, 32);
          if (bottom > 1160)
            throw Error("Texto excede el espacio de lámina " + (i + 1));
          x.strokeStyle = "#626278";
          x.lineWidth = 1;
          x.beginPath();
          x.moveTo(66, 1170);
          x.lineTo(1014, 1170);
          x.stroke();
          text(s.source, 66, 1210, 950, 22, "#d9c4ff");
          text(
            "Proyecto independiente · Sin aval institucional del INE",
            66,
            1300,
            950,
            21,
            "#baf5d1",
          );
          return c.toDataURL("image/png").split(",")[1];
        },
        { s: slides[i], i },
      );
      fs.writeFileSync(
        path.join(out, String(i + 1).padStart(2, "0") + ".png"),
        Buffer.from(data, "base64"),
      );
    }
    const text =
      "# 100 VOCES · Carrusel de cinco láminas\n\nVersión 1.1.0. Formato: 1080 × 1350 px. No hay campaña ni resultados de alcance reportados.\n\n" +
      slides
        .map(
          (s, i) =>
            "## " +
            (i + 1) +
            ". " +
            s.title +
            "\n\n" +
            s.number +
            " — " +
            s.intro +
            ". " +
            s.body +
            "\n\nTexto alternativo: " +
            s.title +
            " " +
            s.number +
            ". " +
            s.intro +
            ". " +
            s.body +
            "\n\nFuente: " +
            s.source +
            "\n",
        )
        .join("\n") +
      "\nFuentes completas:\n- https://ine.mx/wp-content/uploads/2025/06/Manual-Conteos-Censales-2009-2024.pdf\n- https://repositoriodocumental.ine.mx/xmlui/bitstream/handle/123456789/186643/Deceyec-Estudio-Participaci%C3%B3n-ciudadada-2024.pdf\n\nAntes de difundir, comprobar el acceso al enlace del proyecto. No usar un QR a un destino privado.\n";
    fs.writeFileSync(path.join(out, "textos.md"), text);
    console.log("Cinco PNG y textos accesibles generados.");
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
