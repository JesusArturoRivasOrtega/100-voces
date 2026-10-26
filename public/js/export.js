Voces.initExport = function (data) {
  const $ = (id) => document.getElementById(id),
    V = Voces,
    canvas = $("shareCanvas"),
    ctx = canvas.getContext("2d");
  const formats = {
    horizontal: [1200, 630],
    vertical: [1080, 1350],
    story: [1080, 1920],
  };
  $("cardYear").replaceChildren(
    ...[...data.years]
      .reverse()
      .map((d) => new Option(`${d.year} · ${d.kind}`, d.year)),
  );
  $("cardState").replaceChildren(
    ...[...data.states_2024]
      .sort((a, b) => a.name.localeCompare(b.name, "es"))
      .map((d) => new Option(d.name, d.name)),
  );
  $("cardState").value = "Veracruz";
  $("cardAge").replaceChildren(
    ...data.age_2024.map((d) => new Option(d.age_group, d.age_group)),
  );
  function selection() {
    const type = $("cardType").value;
    const d =
      type === "state"
        ? data.states_2024.find((s) => s.name === $("cardState").value)
        : type === "age"
          ? data.age_2024.find((s) => s.age_group === $("cardAge").value)
          : V.year(data, $("cardYear").value);
    return {
      d,
      type,
      value:
        type === "complement" ? V.complement(d.participation) : d.participation,
      label: type === "complement" ? "NO PARTICIPACIÓN" : "PARTICIPACIÓN",
      scope:
        type === "state"
          ? d.name
          : type === "age"
            ? d.scope
            : "México · nacional",
    };
  }
  function description() {
    const { d, type, value, label, scope } = selection();
    return `100 VOCES — ${label.toLowerCase()} en ${scope}, ${d.year}, elección ${d.kind}: ${V.fmt(value)} %. ${Math.round(value)} de 100 puntos representan esta tasa de forma redondeada. ${type === "complement" ? "Complemento calculado: 100 menos la tasa publicada. " : ""}Denominador CCPC: registros con sí votaron o no votaron; excluye no especificados. ${V.contexts[$("cardAudience").value]} Fuente: INE, ${d.source_title}, p. ${d.source_page}. ${d.source} Revisión: ${d.reviewed_at}; ${d.verification}. Proyecto independiente, sin aval institucional. No permite inferir causas ni motivos individuales.`;
  }
  function lines(
    text,
    x,
    y,
    width,
    size,
    lineHeight,
    color = "#fff",
    weight = "500",
    family = '"DM Sans", Arial',
  ) {
    ctx.font = `${weight} ${size}px ${family}`;
    ctx.fillStyle = color;
    let line = "",
      row = 0;
    for (const word of text.split(" ")) {
      const trial = line ? line + " " + word : word;
      if (ctx.measureText(trial).width > width && line) {
        ctx.fillText(line, x, y + row * lineHeight);
        row++;
        line = word;
      } else line = trial;
    }
    if (line) {
      ctx.fillText(line, x, y + row * lineHeight);
      row++;
    }
    return y + row * lineHeight;
  }
  function draw() {
    const type = $("cardType").value,
      isState = type === "state",
      isAge = type === "age";
    $("cardStateField").hidden = !isState;
    $("cardAgeField").hidden = !isAge;
    if (isState || isAge) $("cardYear").value = "2024";
    $("cardYear").disabled = isState || isAge;
    const { d, value, label, scope } = selection(),
      [w, h] = formats[$("cardFormat").value],
      horizontal = w > h;
    canvas.width = w;
    canvas.height = h;
    ctx.fillStyle = "#12142b";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#ee5d9c";
    ctx.fillRect(0, 0, w, 12);
    const margin = horizontal ? 60 : 72,
      content = w - margin * 2;
    lines(
      "100 VOCES",
      margin,
      82,
      content,
      30,
      40,
      "#baf5d1",
      "800",
      "Manrope, Arial",
    );
    lines(
      "ASÍ PARTICIPA MÉXICO  /  " + d.year,
      margin,
      133,
      content,
      21,
      28,
      "#d9c4ff",
      "700",
    );
    const numY = horizontal ? 278 : 340,
      numSize = horizontal ? 136 : 190;
    lines(
      V.fmt(value) + " %",
      margin - 5,
      numY,
      content,
      numSize,
      numSize,
      "#f9f7f2",
      "800",
      "Manrope, Arial",
    );
    const labelY = numY + 55;
    lines(
      label + " · " + d.kind.toUpperCase(),
      margin,
      labelY,
      horizontal ? 660 : content,
      horizontal ? 23 : 28,
      38,
      "#f8bbd7",
      "700",
    );
    lines(
      scope,
      margin,
      labelY + 42,
      horizontal ? 650 : content,
      horizontal ? 23 : 30,
      38,
      "#d9c4ff",
      "600",
    );
    let gx, gy, step, r;
    if (horizontal) {
      gx = 824;
      gy = 148;
      step = 28;
      r = 8.5;
    } else {
      step = h > 1500 ? 55 : 43;
      r = step * 0.29;
      gx = (w - 9 * step) / 2;
      gy = h > 1500 ? 600 : 530;
    }
    for (let i = 0; i < 100; i++) {
      ctx.beginPath();
      ctx.arc(
        gx + (i % 10) * step,
        gy + Math.floor(i / 10) * step,
        r,
        0,
        Math.PI * 2,
      );
      ctx.fillStyle = i < Math.round(value) ? "#ee5d9c" : "#626278";
      ctx.fill();
    }
    const noteY = horizontal ? 455 : gy + 9 * step + 65;
    if (!horizontal)
      lines(
        "100 puntos · representación redondeada",
        margin,
        noteY,
        content,
        24,
        32,
        "#d9c4ff",
      );
    const questionY = horizontal ? 419 : noteY + 85;
    lines(
      V.contexts[$("cardAudience").value],
      margin,
      questionY,
      horizontal ? 670 : content,
      horizontal ? 26 : 36,
      horizontal ? 34 : 47,
      "#fff",
      "600",
    );
    const footY = horizontal ? 521 : h - 210;
    ctx.strokeStyle = "#626278";
    ctx.beginPath();
    ctx.moveTo(margin, footY);
    ctx.lineTo(w - margin, footY);
    ctx.stroke();
    lines(
      `Fuente: INE · ${d.source_short} · p. ${d.source_page}`,
      margin,
      footY + 32,
      content,
      horizontal ? 20 : 25,
      31,
      "#f9f7f2",
    );
    lines(
      "Registros con voto/no voto definido; excluye no especificados.",
      margin,
      footY + 61,
      content,
      horizontal ? 18 : 23,
      29,
      "#d9c4ff",
    );
    lines(
      type === "complement"
        ? "Complemento de la tasa publicada · 100 − participación."
        : "Tasa publicada a un decimal · Los puntos son una aproximación.",
      margin,
      footY + 88,
      content,
      horizontal ? 17 : 22,
      28,
      "#d9c4ff",
    );
    if (!horizontal)
      lines(
        "Proyecto independiente · Sin aval institucional del INE",
        margin,
        h - 55,
        content,
        22,
        28,
        "#baf5d1",
      );
    else lines("Proyecto independiente", 850, 483, 290, 18, 24, "#baf5d1");
    const text = description();
    $("accessibleText").value = text;
    canvas.setAttribute("aria-label", text);
    $("canvasCaption").textContent =
      `Vista previa · ${w} × ${h} px · PNG con fuente`;
  }
  for (const id of [
    "cardYear",
    "cardType",
    "cardState",
    "cardAge",
    "cardAudience",
    "cardFormat",
  ])
    $(id).onchange = () => {
      draw();
      $("shareStatus").textContent = "Vista previa actualizada.";
    };
  $("downloadCard").onclick = async () => {
    const b = $("downloadCard");
    b.disabled = true;
    $("shareStatus").textContent = "Preparando imagen…";
    try {
      await document.fonts.ready;
      draw();
      const blob = await new Promise((resolve, reject) =>
        canvas.toBlob(
          (b) =>
            b
              ? resolve(b)
              : reject(Error("El navegador no pudo crear la imagen.")),
          "image/png",
        ),
      );
      const url = URL.createObjectURL(blob),
        a = document.createElement("a");
      a.href = url;
      a.download = `100VOCES-${$("cardYear").value}-${$("cardType").value}-${$("cardFormat").value}.png`;
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 30000);
      $("shareStatus").textContent =
        "PNG generado. El navegador gestiona la descarga.";
    } catch (e) {
      $("shareStatus").textContent = "No se pudo exportar: " + e.message;
    } finally {
      b.disabled = false;
    }
  };
  $("copyText").onclick = async () => {
    try {
      if (!navigator.clipboard) throw Error("Sin acceso al portapapeles");
      await navigator.clipboard.writeText(description());
      $("shareStatus").textContent =
        "Descripción accesible con fuente copiada.";
    } catch {
      $("accessibleText").focus();
      $("accessibleText").select();
      $("shareStatus").textContent =
        "Copia automática no disponible. El texto quedó seleccionado: pulsa Ctrl+C o usa Copiar.";
    }
  };
  draw();
  document.fonts.ready.then(draw);
  return { draw, description };
};
