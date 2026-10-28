/* Contextual help: mouse, keyboard and touch share the same explanation. */
(() => {
  const guides = [
    ['inicio', '#inicio .eyebrow', 'Empieza aquí',
      '100 VOCES convierte tasas de participación electoral en imágenes y actividades para entenderlas. No necesitas saber estadística.',
      ['Pulsa «Comenzar la historia» para explorar los cien puntos.', 'Elige un recorrido de 60 segundos o de 3 minutos para una visita guiada; puedes salir y continuar a tu ritmo.'],
      'Los datos describen participación, no preferencias políticas ni motivos individuales.'],
    ['historia', '#historia .overline', 'Explorar los cien puntos',
      'Cada punto representa aproximadamente una de cada cien partes del total definido por el CCPC. Los puntos coloreados muestran participación.',
      ['Elige un año en los botones sobre el gráfico.', 'Lee la tasa exacta junto a los puntos y abre «Revelar evidencia» para consultar la fuente.'],
      'Los puntos se redondean: 59,7 % se dibuja como 60 puntos, pero la tasa sigue siendo 59,7 %. No son personas identificables.'],
    ['denominador', '.denominator-lab .overline', 'Entender a quiénes se cuenta',
      'El denominador es el total usado para calcular el porcentaje: registros de quienes sí votaron más quienes no votaron.',
      ['Pulsa «Sí votaron», «No votaron» y «No especificados».', 'Lee cómo participa cada grupo en la fórmula que aparece debajo.'],
      'Los registros no especificados quedan fuera de esta tasa. El total no equivale necesariamente a toda la lista nominal.'],
    ['tiempo', '#tiempo .overline', 'Comparar elecciones',
      'Aquí observas cómo cambia la participación nacional entre dos años. La diferencia entre tasas se expresa en puntos porcentuales (pp).',
      ['Elige el tipo de elección y los años de origen y destino.', 'Revisa las barras, la diferencia y la explicación de lo que la comparación permite decir.'],
      'Compara procesos del mismo tipo. Una diferencia describe un cambio; por sí sola no explica su causa.'],
    ['territorio', '#territorio .overline', 'Explorar entidades y edades',
      'Esta sección permite mirar la participación de 2024 por entidad o por grupo de edad, en dos vistas separadas.',
      ['En «Por entidad», elige o busca una de las 32 entidades; también puedes pulsar su barra.', 'Compara su tasa con la nacional. Cambia a «Por edad» para explorar los grupos nacionales o crea una tarjeta de tu selección.'],
      'La vista por edad corresponde a todo México, no a la entidad elegida. Las diferencias no califican a sus habitantes.'],
    ['edades', '#ageView .overline', 'Leer la participación por edad',
      'Las barras muestran la tasa nacional de participación de cada uno de los 18 grupos de edad en 2024.',
      ['Elige un grupo en el selector o pulsa una barra.', 'Lee su tasa y la comparación con el total nacional; «Crear tarjeta de este grupo» lleva el dato a Compartir.'],
      'Una barra más alta significa mayor tasa de participación, no más personas. Estos datos no describen las edades de una entidad concreta.'],
    ['aprender', '#aprender .overline', 'Practicar la lectura de datos',
      'Siete preguntas te ayudan a distinguir cifras, interpretaciones y conclusiones que los datos no permiten.',
      ['Selecciona una respuesta y lee la explicación antes de avanzar.', 'Al terminar, revisa los conceptos recomendados y los casos opcionales. Puedes reiniciar para practicar de nuevo.'],
      'El resultado es una orientación para repasar; no es una certificación de conocimientos.'],
    ['escenarios', '#escenarios .overline', 'Probar escenarios A y B',
      'Este laboratorio permite comparar dos tasas que tú imaginas con el dato nacional observado en 2024.',
      ['Mueve los controles A y B; con teclado usa las flechas sobre cada control.', 'Observa las barras y sus diferencias. «Igualar al observado» devuelve ambos al dato de referencia.'],
      'A y B son supuestos, no pronósticos. Mover un control no demuestra el efecto de una campaña o una política.'],
    ['compartir', '#compartir .overline', 'Crear una tarjeta con fuente',
      'Convierte un dato en una imagen que puedes descargar para una clase, conversación o publicación.',
      ['Elige año y tipo de información; selecciona entidad o edad cuando corresponda.', 'Elige público, mensaje y formato. Revisa la vista previa y pulsa «Descargar imagen PNG». Copia también la descripción accesible.'],
      'La tarjeta incluye contexto y fuente. Descargarla no la publica automáticamente en redes sociales.'],
    ['en-vivo', '#en-vivo .overline', 'Participar en una sala en vivo',
      'Un grupo estima una tasa antes de descubrir el dato publicado. El gráfico reúne las estimaciones de quienes participan en la sala.',
      ['Si facilitas, crea una sala, comparte su código o QR y espera las respuestas; después revela el dato y avanza de ronda.', 'Si participas, introduce el código y envía tu estimación. Para conocer los controles sin reunir a un grupo, usa «Probar demostración local».'],
      'Las respuestas del grupo no son datos electorales. Las salas compartidas necesitan conexión y acceso al sitio; la demostración usa respuestas ficticias.'],
    ['lente', '#lente .overline', 'Contrastar una cifra con Lente',
      'Lente compara una cifra de una afirmación con los datos disponibles en 100 VOCES y explica si coincide con el contexto que confirmes.',
      ['Pega un texto, usa un ejemplo o carga una captura. Pulsa «Identificar la cifra» y elige cuál revisar si hay varias.', 'Revisa ámbito, año, indicador y unidad; confirma el contexto y ejecuta el contraste. Después puedes copiar la explicación o descargar la ficha.'],
      'La lectura de imágenes puede equivocarse: revisa el texto. Lente no verifica toda una noticia, las causas ni la autenticidad de una imagen.'],
    ['metodo', '#metodo .overline', 'Usar la actividad en el aula',
      'Esta propuesta organiza una sesión de 15 minutos para observar, comparar y formular una pregunta respaldada por datos.',
      ['Sigue las tres etapas de cinco minutos, individualmente o en equipos.', 'Abre «Guía docente y evaluación» para consultar las orientaciones e imprimir la actividad. El kit ampliado está en Materiales.'],
      'El objetivo es explicar un dato y reconocer sus límites. Una actividad completada no demuestra por sí sola aprendizaje duradero.'],
    ['recorrido', '#journey summary', 'Consultar mi recorrido',
      'El registro señala seis acciones realizadas durante esta visita, como elegir un dato o generar una tarjeta.',
      ['Despliega «Mi recorrido por los datos» y sigue los enlaces de las actividades pendientes.', 'Descarga tu resumen cuando hayas realizado alguna acción o usa «Borrar mi registro» para empezar de nuevo.'],
      'Se conserva solo en esta página hasta recargar. No mide dominio de conceptos y no se envía al servidor.'],
    ['recursos', '#recursos .overline', 'Descargar los materiales',
      'Aquí están la guía docente, los archivos editables, el carrusel, la presentación y el video del proyecto.',
      ['Elige el material según tu objetivo: facilitar una sesión, compartir imágenes o presentar el proyecto.', 'Pulsa su enlace de descarga. Descomprime los archivos ZIP para acceder a su contenido; el video también tiene subtítulos y transcripción.'],
      'Los materiales acompañan la aplicación. Descargar el kit no crea una sala ni registra una actividad de grupo.'],
    ['fuentes', '#fuentes .overline', 'Revisar fuentes y metodología',
      'Esta sección explica de dónde salen las tasas, cómo se definen y cuáles son los límites del proyecto.',
      ['Abre el Manual CCPC o el Estudio 2024 para consultar los documentos oficiales y sus páginas citadas.', 'Lee la fórmula y la declaración de independencia antes de reutilizar una cifra.'],
      '100 VOCES transcribe tasas publicadas; no recalcula la base completa y no es una aplicación oficial del INE.'],
    ['descargas', '.data-download h3', 'Descargar los datos',
      'Puedes consultar fuera de la aplicación las tasas que alimentan sus gráficos.',
      ['Descarga CSV para abrir la tabla en una hoja de cálculo.', 'Descarga JSON si necesitas los datos junto con sus metadatos y referencias. Conserva año, ámbito, unidad y fuente al reutilizarlos.'],
      'Incluyen seis elecciones nacionales, 32 entidades y 18 grupos de edad de 2024. No contienen datos personales ni cruces entre edad y entidad.']
  ];
  const panel = document.createElement('div');
  panel.id = 'section-help-panel';
  panel.className = 'section-help-panel';
  panel.hidden = true;
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-labelledby', 'section-help-title');
  panel.innerHTML = '<button type="button" class="help-close" aria-label="Cerrar ayuda">×</button><span class="help-kicker">GUÍA DE ESTA SECCIÓN</span><h2 id="section-help-title"></h2><div id="section-help-content" tabindex="0" role="region" aria-label="Instrucciones de uso"><p class="help-purpose"></p><h3>Cómo usarla</h3><ol></ol><p class="help-limit"></p></div><p class="help-scroll-hint">Desplázate dentro para leer la guía completa.</p>';
  document.body.append(panel);
  let active = null, pinned = false, timer, restoreFocus = false;
  function position() {
    if (!active || panel.hidden) return;
    const rect = active.getBoundingClientRect(), gap = 8, edge = 12;
    panel.style.maxHeight = 'calc(100dvh - 24px)';
    const below = innerHeight - rect.bottom - edge - gap, above = rect.top - edge - gap;
    const useBelow = below >= panel.offsetHeight || below >= above;
    panel.style.maxHeight = Math.max(80, useBelow ? below : above) + 'px';
    const width = panel.offsetWidth, height = panel.offsetHeight;
    const top = useBelow ? rect.bottom + gap : rect.top - height - gap;
    panel.style.left = Math.max(edge, Math.min(rect.left, innerWidth - width - edge)) + 'px';
    panel.style.top = Math.max(edge, Math.min(top, innerHeight - height - edge)) + 'px';
  }
  function close(returnFocus = false) {
    clearTimeout(timer);
    const previous = active;
    if (previous) { previous.setAttribute('aria-expanded', 'false'); previous.removeAttribute('aria-describedby'); }
    panel.hidden = true; active = null; pinned = false;
    if (returnFocus && previous) { restoreFocus = true; previous.focus({preventScroll:true}); restoreFocus = false; }
  }
  function open(button, guide) {
    clearTimeout(timer);
    if (active !== button) { close(); active = button; panel.querySelector('#section-help-content').scrollTop = 0; }
    panel.querySelector('h2').textContent = guide[2];
    panel.querySelector('.help-purpose').textContent = guide[3];
    const steps = panel.querySelector('ol'); steps.replaceChildren();
    for (const text of guide[4]) { const li = document.createElement('li'); li.textContent = text; steps.append(li); }
    panel.querySelector('.help-limit').textContent = 'Ten en cuenta: ' + guide[5];
    panel.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    button.setAttribute('aria-describedby', 'section-help-content');
    position();
  }
  function scheduleClose() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (!pinned && !panel.matches(':hover') && !active?.matches(':hover') && !panel.contains(document.activeElement) && active !== document.activeElement) close();
    }, 250);
  }
  for (const guide of guides) {
    const target = document.querySelector(guide[1]);
    if (!target) continue;
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'section-help-trigger'; button.dataset.help = guide[0]; button.textContent = '?';
    button.setAttribute('aria-label', 'Ayuda: ' + guide[2]);
    button.setAttribute('aria-expanded', 'false'); button.setAttribute('aria-controls', panel.id); button.setAttribute('aria-haspopup', 'dialog');
    // Keep the disclosure summary free of nested interactive controls.
    if (target.tagName === 'SUMMARY') target.after(button); else target.append(button);
    button.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse' && (!pinned || active === button)) open(button, guide); });
    button.addEventListener('pointerleave', scheduleClose);
    button.addEventListener('focus', () => { if (!restoreFocus) open(button, guide); });
    button.addEventListener('blur', scheduleClose);
    button.addEventListener('click', e => {
      if (active === button && pinned) { close(); return; }
      open(button, guide); pinned = true;
      if (e.detail === 0) panel.querySelector('.help-close').focus();
    });
    button.addEventListener('keydown', e => { if (e.key === 'ArrowDown') { e.preventDefault(); open(button, guide); pinned = true; panel.querySelector('.help-close').focus(); } });
  }
  panel.querySelector('.help-close').addEventListener('click', () => close(true));
  panel.addEventListener('keydown', e => {
    if (e.key === 'Tab' && ((e.shiftKey && e.target.classList.contains('help-close')) || (!e.shiftKey && e.target.id === 'section-help-content'))) {
      close(true); if (e.shiftKey) e.preventDefault();
    }
  });
  panel.addEventListener('pointerenter', () => clearTimeout(timer));
  panel.addEventListener('pointerleave', scheduleClose);
  document.addEventListener('pointerdown', e => { if (active && !panel.contains(e.target) && !active.contains(e.target)) close(); });
  document.addEventListener('focusin', e => { if (active && e.target !== active && !panel.contains(e.target)) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && active) { e.preventDefault(); close(panel.contains(document.activeElement)); } });
  window.addEventListener('resize', position);
  document.addEventListener('scroll', e => {
    if (!active || panel.contains(e.target)) return;
    const rect = active.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > innerHeight) close(panel.contains(document.activeElement));
    else position();
  }, true);
})();
