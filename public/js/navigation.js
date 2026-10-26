Voces.initNavigation = function () {
  const button = document.getElementById("menuToggle"),
    menu = document.getElementById("chapterMenu");
  const header = document.querySelector(".nav-wrap");
  function close(restore = false) {
    menu.hidden = true;
    button.setAttribute("aria-expanded", "false");
    if (restore) button.focus();
  }
  button.onclick = () => {
    const open = button.getAttribute("aria-expanded") !== "true";
    menu.hidden = !open;
    button.setAttribute("aria-expanded", String(open));
  };
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !menu.hidden) {
      close(true);
      e.preventDefault();
    }
  });
  document.addEventListener("click", (e) => {
    if (!header.contains(e.target)) close();
  });
  for (const link of menu.querySelectorAll("a"))
    link.addEventListener("click", () => {
      close();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        target.tabIndex = -1;
        requestAnimationFrame(() => {
          target.focus({ preventScroll: true });
          target.scrollIntoView({ block: "start", behavior: "instant" });
        });
      }
    });
  matchMedia("(min-width:901px)").addEventListener("change", (e) => {
    if (e.matches) close();
  });
  const labels = {
    inicio: "Inicio · Explora a tu ritmo",
    historia: "01 / Entender el dato",
    tiempo: "02 / Comparar elecciones",
    territorio: "03 / Entidades y edades",
    aprender: "04 / Practicar",
    escenarios: "05 / Escenarios A/B",
    compartir: "06 / Crear una tarjeta",
    "en-vivo": "07 / Sala en vivo",
    lente: "08 / Lente Ciudadana",
    metodo: "Actividad · 15 minutos",
    recursos: "Materiales para llevar",
    fuentes: "Fuentes y metodología",
  };
  const sections = Object.keys(labels).map((id) => document.getElementById(id));
  let queued = false;
  function current() {
    queued = false;
    let active = sections[0];
    for (const section of sections)
      if (section.getBoundingClientRect().top <= 180) active = section;
    document.getElementById("currentChapter").textContent = labels[active.id];
    for (const a of document.querySelectorAll(".chapter-menu a,.nav-links a")) {
      if (a.getAttribute("href") === "#" + active.id)
        a.setAttribute("aria-current", "location");
      else a.removeAttribute("aria-current");
    }
  }
  window.addEventListener(
    "scroll",
    () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(current);
      }
    },
    { passive: true },
  );
  current();
};
