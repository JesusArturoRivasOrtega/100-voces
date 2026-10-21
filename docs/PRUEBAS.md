# Reporte de pruebas reales

Ejecución: 2026-10-21T14:03:18.926Z. Navegador Chromium/Edge 155.0.4283.62. Script: `tests/browser.cjs`. Pruebas sobre HTTP local y archivo autónomo.

| Prueba | Esperado | Observado | Estado |
|---|---|---|---|
| Cálculos y validación | −2.7 pp; complemento 40.3; relativo 20; rechazar tasas inválidas | Coinciden; cuatro casos inválidos rechazados | VERIFICADO |
| Seis años | Tasa, complemento, puntos y evidencia actualizados | 6/6 años coinciden | VERIFICADO |
| Comparador | Separar tipos; −2.7, +4.7 y +7.7 pp | Tres diferencias coinciden y cada grupo tiene 3 años | VERIFICADO |
| Territorios | 8 entidades; diferencias respecto a 2024 nacional | 8/8 coinciden; selección declarada | VERIFICADO |
| Aprendizaje | 5 respuestas, feedback, resultado y reinicio | 5/5; pantalla final; reinicio a cero | VERIFICADO |
| Escenarios | 0–100; subidas, bajadas, cambio nulo y reinicio | 5 valores y extremos comprobados; cálculos coinciden | VERIFICADO |
| Descargas PNG | Archivos reales 1200×630,1080×1350,1080×1920 | 3 PNG descargados; dimensiones verificadas en cabecera; revisión visual separada | VERIFICADO |
| Portapapeles | Texto accesible con tasa, año, denominador y fuente | Lectura real del portapapeles coincide | VERIFICADO |
| Recorridos | 6 pasos y salida por Escape | Recorrido completado; modo jurado abierto/cerrado | VERIFICADO |
| Responsive | Sin desbordamiento a 320,375,768,1440 px | scrollWidth <= clientWidth en los cuatro anchos | VERIFICADO |
| Teclado | Saltar al contenido y alcanzar controles principales por Tab | Enlaces, selectores, slider, descarga y copia alcanzables | VERIFICADO |
| Movimiento reducido | Sin animación de puntos | animation-name: none | VERIFICADO |
| Archivo autónomo sin red | file:// funcional; cambio de año y exportación | Archivo abrió offline, dato actualizado y PNG descargado | VERIFICADO |
| Datos inválidos | Mensaje explícito y controles desactivados | Rechazo probado con serie vacía; sin datos sustitutos | VERIFICADO |
| Consola normal | Sin errores JS ni de recursos | 0 errores durante uso normal | VERIFICADO |

## Revisión visual y límites

Se inspeccionaron capturas de escritorio y móvil, además de las tres tarjetas PNG generadas y descargadas. Las piezas muestran cifra, año, contexto, denominador y referencia sin cortes en los ejemplos examinados. Las fuentes Manrope y DM Sans se cargan localmente. El diseño no desborda horizontalmente en los cuatro anchos comprobados.

No se presenta una puntuación Lighthouse ni una certificación WCAG. La prueba automatizada de teclado comprueba accesibilidad de controles principales; no reemplaza la evaluación de lector de pantalla. Pendientes: Safari/Firefox, teléfonos físicos, contraste completo de todos los estados y piloto de comprensión con personas usuarias. No hay métricas de impacto educativo obtenidas.

## Correcciones durante QA

Se corrigió una validación inicial incorrecta de tipo electoral antes de la primera navegación. La primera suite funcional encontró un 404 de favicon; se añadió un icono SVG embebido y se repitió la suite con cero errores en uso normal. Se ajustaron acentos de texto y puntos para legibilidad y se incorporaron fuentes locales. Las pruebas de datos inválidos provocan deliberadamente un error capturado y visible; no se cuentan como error del recorrido normal.

## Revisión automática adicional

Axe-core 4.10.3, reglas WCAG 2 A/AA y 2.1 AA. Se corrigieron once nodos de contraste insuficiente en la primera ejecución. Resultados finales:

- Estado initial: 0 infracciones automáticas, 27 reglas aprobadas, 1 reglas requieren revisión manual.
- Estado expanded: 0 infracciones automáticas, 29 reglas aprobadas, 1 reglas requieren revisión manual.

El estado expanded abre evidencia y responde incorrectamente un reactivo. Los resultados están en `evidencia/accesibilidad.json`. Cero infracciones detectadas no equivale a certificación WCAG.
