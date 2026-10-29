Voces.dots = function (el, rate, label) {
  el.replaceChildren(
    ...Array.from({ length: 100 }, (_, i) => {
      const s = document.createElement("span");
      s.className = "dot" + (i < Math.round(rate) ? " on" : "");
      s.setAttribute("aria-hidden", "true");
      s.style.setProperty("--i", i);
      return s;
    }),
  );
  el.setAttribute(
    "aria-label",
    `${label}: ${Voces.fmt(rate)} %. ${Math.round(rate)} puntos iluminados de 100; representación redondeada.`,
  );
};
Voces.initVisuals = function (data) {
  const $ = (id) => document.getElementById(id),
    V = Voces;
  function setYear(y) {
    const d = V.year(data, y);
    $("yearButtons")
      .querySelectorAll("button")
      .forEach((b) => {
        const active = Number(b.dataset.year) === d.year;
        b.classList.toggle("active", active);
        b.setAttribute("aria-pressed", active);
      });
    V.dots($("dotGrid"), d.participation, `Participación nacional ${d.year}`);
    $("statKind").textContent = `ELECCIÓN ${d.kind.toUpperCase()} · ${d.year}`;
    $("participationValue").textContent = V.fmt(d.participation);
    $("participationStory").textContent =
      `Aproximadamente ${Math.round(d.participation)} de cada 100 registros con voto/no voto definido corresponden a participación. La tasa publicada es ${V.fmt(d.participation)} %; los puntos se redondean, el número conserva el decimal de la fuente.`;
    $("splitYes").textContent = V.fmt(d.participation) + " %";
    $("splitNo").textContent = V.fmt(V.complement(d.participation)) + " %";
    $("yearEvidence").innerHTML = V.evidence(d);
  }
  data.years.forEach((d) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "year-btn";
    b.dataset.year = d.year;
    b.textContent = d.year;
    b.onclick = () => setYear(d.year);
    $("yearButtons").append(b);
  });
  setYear(2024);
  function updateComparison() {
    if (Number($("compareFrom").value) > Number($("compareTo").value)) {
      const earlier = $("compareTo").value;
      $("compareTo").value = $("compareFrom").value;
      $("compareFrom").value = earlier;
    }
    const a = V.year(data, $("compareFrom").value),
      b = V.year(data, $("compareTo").value);
    $("compareSummary").textContent = V.compareText(a, b);
    $("compareBars")
      .querySelectorAll("button")
      .forEach((el) => {
        el.setAttribute("aria-pressed", Number(el.dataset.year) === b.year);
        const role=Number(el.dataset.year)===a.year&&a.year===b.year?'Origen y destino':Number(el.dataset.year)===a.year?'Origen':Number(el.dataset.year)===b.year?'Destino':'Contexto';
        el.querySelector('.history-role').textContent=role;
      });
  }
  function kind(k) {
    for (const id of ["presBtn", "midBtn"]) {
      const on = (id === "presBtn") === (k === "presidencial");
      $(id).classList.toggle("is-active", on);
      $(id).setAttribute("aria-pressed", on);
    }
    const group = data.years.filter((d) => d.kind === k);
    for (const id of ["compareFrom", "compareTo"])
      $(id).replaceChildren(
        ...group.map((d) => new Option(String(d.year), d.year)),
      );
    $("compareFrom").value = group[1].year;
    $("compareTo").value = group[2].year;
    $("compareBars").replaceChildren(
      ...group.map((d) => {
        const b = document.createElement("button");
        b.className = "history-bar";
        b.type = "button";
        b.dataset.year = d.year;
        b.setAttribute(
          "aria-label",
          `${d.year}, ${V.fmt(d.participation)} %. Usar como destino de comparación.`,
        );
        b.innerHTML = `<span class="history-year">${d.year}<small class="history-role"></small></span><span class="history-track"><span style="width:${d.participation}%"></span></span><strong>${V.fmt(d.participation)} %</strong>`;
        b.onclick = () => {
          $("compareTo").value = d.year;
          updateComparison();
        };
        return b;
      }),
    );
    updateComparison();
  }
  $("presBtn").onclick = () => kind("presidencial");
  $("midBtn").onclick = () => kind("intermedia");
  $("compareFrom").onchange = updateComparison;
  $("compareTo").onchange = updateComparison;
  kind("presidencial");
  const states = [...data.states_2024].sort((a, b) =>
    a.name.localeCompare(b.name, "es"),
  );
  $("stateSelect").replaceChildren(
    ...states.map((d) => new Option(d.name, d.name)),
  );
  function state(name) {
    const d = states.find((s) => s.name === name),
      national = V.year(data, 2024),
      diff = V.delta(national.participation, d.participation);
    $("stateSelect").value = name;
    $("stateValue").textContent = V.fmt(d.participation) + " %";
    $("stateName").textContent = name;
    $("statePercent").textContent = V.fmt(d.participation) + " %";
    $("stateFill").style.width = d.participation + "%";
    $("nationalPercent").textContent = V.fmt(national.participation) + " %";
    $("nationalFill").style.width = national.participation + "%";
    $("stateComparison").textContent =
      `En 2024: ${V.pp(diff)} respecto de la tasa nacional. ${diff === 0 ? "Coinciden a la precisión publicada." : ""} Esta diferencia no define a sus habitantes ni demuestra sus motivos.`;
    $("stateEvidence").innerHTML = V.evidence(d);
    const focusedName = document.activeElement?.dataset.state;
    $("stateRankings").replaceChildren(
      ...states.map((s) => {
        const b = document.createElement("button");
        b.type = "button";
        b.dataset.state = s.name;
        b.className = "ranking-row" + (s.name === name ? " selected" : "");
        b.setAttribute("aria-pressed", s.name === name);
        b.innerHTML = `<span>${s.name}</span><span class="small-bar"><span style="width:${s.participation}%"></span></span><strong>${V.fmt(s.participation)} %</strong>`;
        b.onclick = () => state(s.name);
        return b;
      }),
    );
    if (focusedName) {
      Array.from($("stateRankings").children)
        .find((b) => b.dataset.state === focusedName)
        ?.focus({ preventScroll: true });
    }
    $('stateSearch').dispatchEvent(new Event('input'));
  }
  state("Veracruz");
  $("stateSelect").onchange = (e) => state(e.target.value);
  $('stateSearch').addEventListener('input',()=>{
    const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    const query=normalize($('stateSearch').value.trim());let visible=0;
    for(const button of $('stateRankings').children){button.hidden=!normalize(button.dataset.state).includes(query);if(!button.hidden)visible++;}
    $('stateSearchStatus').textContent=visible?`${visible} entidades disponibles en esta selección.`:'No hay coincidencias. Prueba el nombre de una entidad federativa; no se incluyen municipios.';
  });
  $('stateShare').onclick=()=>{
    $('cardType').value='state';$('cardType').dispatchEvent(new Event('change'));
    $('cardState').value=$('stateSelect').value;$('cardState').dispatchEvent(new Event('change'));
    $('compartir').scrollIntoView({behavior:'instant'});$('cardFormat').focus({preventScroll:true});
  };
  return { setYear, kind, state };
};
