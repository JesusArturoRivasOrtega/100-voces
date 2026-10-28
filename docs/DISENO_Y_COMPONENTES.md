# Sistema de diseño y componentes

## Lenguaje visual

Azul noche `#12142B`, marfil `#F9F7F2`, magenta `#EE5D9C`, lavanda `#D9C4FF`, menta `#BAF5D1`, texto `#16172C`, secundario `#5B5D68`. Magenta identifica participación y menta acompaña fuentes/acciones; ninguna respuesta depende solo del color. Títulos Manrope, texto DM Sans, Georgia en frases editoriales. Ambas fuentes principales se sirven localmente con licencia OFL.

El contenedor tiene máximo 1240 px; márgenes móviles de 18 px; paneles de 14–26 px de radio; botones de al menos 44 px; foco visible de 3 px. La composición alterna marfil, lavanda suave y azul noche. Se oscurecieron los acentos textuales sobre marfil y se aclararon sobre azul para preservar legibilidad. Las gráficas tienen etiquetas numéricas, explicación textual y escala común desde cero. El movimiento de entrada se desactiva con `prefers-reduced-motion`.

## Contratos de módulos

### Refinamiento visual de octubre de 2026

`public/features.css` mantiene las mejoras de superficies y estados sobre los estilos existentes: acentos de capítulo, sombras compartidas, relieve de los puntos, cabeceras, tarjetas y botones. `public/js/polish.js` controla únicamente decoración: SVG orbital oculto a lectores, luz de mouse limitada a puntero fino, entrada de capítulos, aparición de resultados y una línea de desplazamiento en la navegación. La línea mide posición en la página, no aprendizaje ni actividades completadas.

Los efectos duran entre 220 y 800 ms, sin bucles ni imágenes externas. Las entradas no ocultan contenido antes de ejecutarse. No hay interpolación de porcentajes: la cifra oficial aparece inmediatamente. La opción de movimiento reducido cancela las animaciones que este módulo inició; no termina animaciones ajenas. Al ocultar la pestaña, los efectos pendientes finalizan. La iluminación usa como máximo un `requestAnimationFrame` por actualización y se restablece al salir.

La suite `tests/visual.cjs` verifica movimiento normal/reducido, precisión, ausencia de animaciones permanentes, desplazamiento y desbordamientos en doce secciones a ocho anchos. Genera 24 capturas para revisión visual. Esto complementa pruebas funcionales y axe; no sustituye dispositivos físicos ni un piloto.

| Módulo | Responsabilidad / entradas | Salidas / estados |
|---|---|---|
| `data.js` | Copia generada del JSON | `window.VOCES_DATA`; nunca editar a mano |
| `core.js` | Validar indicadores; tasas numéricas | `validate`, `year`, `fmt`, `delta`, `pp`, `relative`, `complement`; lanza error si el conjunto no es válido |
| `narrative.js` | Indicador validado o par de años | Evidencia HTML y narración descriptiva; contextos aula/comunidad/redes |
| `visualization.js` | Conjunto validado | Selector de años, 100 puntos, comparación por tipo y territorio; `aria-pressed` en selecciones |
| `learning.js` | Siete reactivos locales y tres casos opcionales | Pregunta, respuesta bloqueada, feedback, progreso, resultado, reinicio; nada se persiste |
| `scenarios.js` | Base nacional 2024 y slider 0–100 | Tasa hipotética, pp, variación relativa, puntos, reinicio |
| `export.js` | Año, indicador, contexto, formato | Canvas, PNG real, descripción, estado de preparación/éxito/error; entidad obliga año 2024 |
| `app.js` | Coordinación de módulos | Arranque, fallo de datos, recorridos manuales, impresión docente |

## Interacciones accesibles

Enlace inicial para saltar al contenido, navegación semántica, etiquetas de formularios, controles nativos, foco tras responder/avanzar, progreso del cuestionario, resumen de resultados y regiones `aria-live` para cambios relevantes. Escape cierra el recorrido y devuelve foco al botón de apertura. Los cien puntos no crean cien paradas de teclado: su contenedor aporta la descripción completa. Las barras incluyen tasa y año en su nombre accesible.

La impresión se limita a la actividad docente. No hay modal que atrape el foco. Los botones deshabilitados solo corresponden a acciones aún no disponibles, como avanzar antes de responder o cambiar de año mientras se exporta una entidad disponible solo en 2024.

## Exportación

Canvas nativo: horizontal 1200×630, publicación 1080×1350, historia 1080×1920. Texto envuelto por medición real, márgenes internos, fuente y denominador. Se espera a que las fuentes carguen antes de exportar. Se utiliza `toBlob` y un enlace de descarga temporal; el estado confirma generación, no presupone que el usuario guardó el archivo. El formato y el indicador seleccionados forman parte del nombre de archivo. El texto accesible permanece visible si la API de portapapeles falla.
