/* Desgloses nacionales por edad; nunca se cruzan con la selección estatal. */
Voces.initContrasts = function (data) {
  const $ = (id) => document.getElementById(id),
    V = Voces,
    groups = data.age_2024,
    base = V.year(data, 2024).participation;
  const select = $("ageSelect");
  select.replaceChildren(
    ...groups.map((d) => new Option(d.age_group, d.age_group)),
  );
  function setAge(label) {
    const d = groups.find((d) => d.age_group === label);
    select.value = label;
    $("ageValue").textContent = V.fmt(d.participation) + " %";
    $("ageName").textContent = d.age_group;
    $("ageComparison").textContent =
      `${V.pp(V.delta(base, d.participation))} frente a la tasa nacional de ${V.fmt(base)} %. Es una diferencia entre tasas agregadas; no describe la decisión de cada persona.`;
    $("ageEvidence").innerHTML = V.evidence(d);
    for (const b of $("ageBars").children) {
      const active = b.dataset.group === label;
      b.setAttribute("aria-pressed", active);
      b.classList.toggle("selected", active);
    }
    $("ageShare").onclick = () => {
      $("cardType").value = "age";
      $("cardType").dispatchEvent(new Event("change"));
      $("cardAge").value = label;
      $("cardAge").dispatchEvent(new Event("change"));
      $("compartir").scrollIntoView({ behavior: "instant" });
      $("cardFormat").focus({ preventScroll: true });
    };
  }
  $("ageBars").replaceChildren(
    ...groups.map((d) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "age-row";
      b.dataset.group = d.age_group;
      b.setAttribute(
        "aria-label",
        `${d.age_group}: ${V.fmt(d.participation)} por ciento. Seleccionar grupo.`,
      );
      const label = document.createElement("span");
      label.textContent = d.age_group;
      const track = document.createElement("span");
      track.className = "age-track";
      track.setAttribute("aria-hidden", "true");
      const fill = document.createElement("span");
      fill.style.width = d.participation + "%";
      track.append(fill);
      const value = document.createElement("strong");
      value.textContent = V.fmt(d.participation) + " %";
      b.append(label, track, value);
      b.onclick = () => setAge(d.age_group);
      return b;
    }),
  );
  select.onchange = () => setAge(select.value);
  setAge(groups[0].age_group);
  function view(kind) {
    const age = kind === "age";
    $("territoryView").hidden = age;
    $("ageView").hidden = !age;
    for (const id of ["viewStates", "viewAges"]) {
      const on = (id === "viewAges") === age;
      $(id).setAttribute("aria-pressed", on);
      $(id).classList.toggle("is-active", on);
    }
    $("contrastContext").textContent = age
      ? "Grupos de edad · México · elección presidencial 2024. Son datos nacionales; no representan específicamente la entidad seleccionada."
      : "32 entidades verificadas · elección presidencial 2024";
  }
  $("viewStates").onclick = () => view("states");
  $("viewAges").onclick = () => view("age");
  view("states");
  const explanations = {
    yes: "Sí votaron: registros con participación identificada. Están en el numerador y también en el total de registros con resultado definido.",
    no: "No votaron: registros con no participación identificada. Forman parte del denominador; no se suman al numerador.",
    unknown:
      "No especificados: el registro no permite determinar la participación. No se cuentan como abstención ni se incluyen en el denominador de esta tasa.",
  };
  for (const b of document.querySelectorAll("[data-denominator]"))
    b.onclick = () => {
      for (const other of document.querySelectorAll("[data-denominator]"))
        other.setAttribute("aria-pressed", other === b);
      $("denominatorExplanation").textContent =
        explanations[b.dataset.denominator];
    };
  return { view, setAge };
};
