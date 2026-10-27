# Accesibilidad · alcance comprobado

La aplicación ofrece HTML semántico, enlaces al contenido, controles con nombre, foco visible, navegación por teclado, textos equivalentes a los gráficos y mensajes de estado. Las animaciones nuevas usan desplazamientos cortos y se omiten con `prefers-reduced-motion`. Las barras conservan sus nodos al actualizarse para evitar parpadeos y pérdida de foco.

Las suites examinan navegación, foco territorial, menú móvil, cierre del recorrido, controles del cuestionario, contraste y estados expandidos. `education.cjs` comprueba 320, 375, 390, 430, 768, 1024, 1366 y 1440 px sin desbordamiento horizontal y ejecuta las reglas disponibles de axe WCAG A/AA hasta 2.2. `release.cjs` aumenta texto base a 200 % en 640 px; esto no equivale a todas las combinaciones de zoom del navegador.

Consultar resultados y fecha en `PRUEBAS.md` y `evidencia/`. Cero infracciones detectadas por axe no significa conformidad total. Firefox y WebKit automatizados se comprueban adicionalmente; WebKit no sustituye Safari en un iPhone.

Pendiente: sesión con lector de pantalla (NVDA o VoiceOver), navegación táctil en teléfonos reales, zoom del navegador, prueba del orden de lectura de PDF y evaluación con personas con discapacidad. El video tiene subtítulos integrados, SRT/VTT y transcripción; la voz sintética está declarada.
