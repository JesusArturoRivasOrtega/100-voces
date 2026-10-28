# Pruebas de 100 VOCES · v1.3.0

Ejecución reproducible: npm ci y npm test. El ejecutor inicia y detiene su servidor local. Los resultados siguientes proceden de los reportes guardados; no se infieren de la presencia del código.

## Base

Fecha UTC: 2026-10-28T14:56:49.271Z

| Prueba | Resultado observado |
|---|---|
| Cálculos y validación | Coinciden; cuatro casos inválidos rechazados |
| Seis años | 6/6 años coinciden |
| Comparador | Tres diferencias coinciden y cada grupo tiene 3 años |
| Territorios | 32/32 coinciden; cobertura declarada |
| Aprendizaje | 7/7; pantalla final; reinicio a cero |
| Escenarios | 5 valores y extremos comprobados; cálculos coinciden |
| Descargas PNG | 3 PNG descargados; dimensiones verificadas en cabecera; revisión visual separada |
| Portapapeles | Lectura real del portapapeles coincide |
| Recorridos | Recorrido completado; modo jurado abierto/cerrado |
| Responsive | scrollWidth <= clientWidth en los cuatro anchos |
| Teclado | Enlaces, selectores, slider, descarga y copia alcanzables |
| Movimiento reducido | animation-name: none |
| Archivo autónomo sin red | Archivo abrió offline, dato actualizado y PNG descargado |
| Datos inválidos | Rechazo probado con serie vacía; sin datos sustitutos |
| Consola normal | 0 errores durante uso normal |

## Ampliaciones

Fecha UTC: 2026-10-28T14:57:09.394Z

| Prueba | Resultado observado |
|---|---|
| Serie por edad y errores | 18 valores cotejados con gráfica 5; seis variantes inválidas rechazadas |
| Denominador | Tres explicaciones y selección exclusivas |
| Contrastes por edad | 18 selecciones; cambio de vista; fuente del estudio y comparación −12,4 pp |
| Tarjetas por edad | Transferencia del grupo al generador, cita correcta y tres PNG reales |
| Escenarios A/B | Extremos, orden inverso, igualdad, reinicio y ejemplo ±5 pp |
| Adaptación de nuevas vistas | Sin desbordamiento en cuatro anchos; capturas móvil/escritorio |
| Accesibilidad automática | Cero infracciones en dos estados de las nuevas vistas; no es certificación WCAG |
| Archivo autónomo | Edades y escenarios A/B funcionan sin red |
| Consola | Sin errores JavaScript |

## Versión 1.1

Fecha UTC: 2026-10-28T14:57:38.592Z

| Prueba | Resultado observado |
|---|---|
| Foco territorial | Enter conserva el botón y la entidad seleccionada |
| Demostración repetible | Entidad, edad, A/B, quiz y tarjeta restablecidos |
| Navegación móvil | Menú, Escape, foco en destino; portada 890 px a 375×812 |
| Recursos y texto ampliado | Carrusel sin desborde en 4 anchos; texto base 200% a 640px |
| Recursos descargables | 14 destinos locales existen y responden con contenido |
| Distribución autónoma | Siete preguntas y rutas al kit local correctas sin red |

## En vivo y Lente

Fecha UTC: 2026-10-28T14:58:16.721Z

| Prueba | Resultado observado |
|---|---|
| Contraste numérico y ámbitos | Tasas, complementos, edad, unidades, signos y ámbitos no disponibles |
| Sala compartida | Presentador y dos contextos independientes; sincronización, recuperación y control de rondas |
| Demo y exportaciones | Tres rondas ficticias, resumen y ficha PNG descargados |
| OCR local | Captura sintética leída en español, sin subida ni solicitudes a otro origen |
| Accesibilidad y adaptación | Sin infracciones axe en el estado expandido; sin desbordamiento en 320,375,768,1440 px |

## Carga local

Fecha UTC: 2026-10-28T14:58:19.378Z

| Prueba | Resultado observado |
|---|---|
| Carga local 50 identificadores | Misma IP, lotes concurrentes de 50 y 50 lecturas concurrentes; sin respuestas perdidas. 111 ms en SQLite local; no mide capacidad de producción. |
| Carga local 100 identificadores | Misma IP, lotes concurrentes de 50 y 50 lecturas concurrentes; sin respuestas perdidas. 190 ms en SQLite local; no mide capacidad de producción. |
| Carga local 500 identificadores | Misma IP, lotes concurrentes de 50 y 50 lecturas concurrentes; sin respuestas perdidas. 818 ms en SQLite local; no mide capacidad de producción. |
| Abuso, concurrencia y limpieza | Límite individual sin bloquear otros participantes; 500 exactos, actualización a capacidad completa, control duplicado rechazado, límite por bytes y borrado de respuestas vencidas. |

## Resiliencia

Fecha UTC: 2026-10-28T14:58:37.830Z

| Prueba | Resultado observado |
|---|---|
| Selección de cifras y contexto ambiguo | Dos cifras seleccionables, año ausente sin valor heredado y ámbitos mezclados sin inferencia automática. |
| Recuperación de sala y gráfico estable | Salir y retomar conserva control; error de red y recuperación; barras conservan sus nodos. |
| OCR cancelado y captura oscura | Cancelar y repetir el mismo archivo; dos cifras detectadas en captura sintética de fondo oscuro. |
| Interacciones nuevas accesibles | Cero infracciones axe; cinco anchos sin desbordamiento y sin animaciones activas con movimiento reducido. |

## Educación

Fecha UTC: 2026-10-28T14:58:51.110Z

| Prueba | Resultado observado |
|---|---|
| Repaso y exploración territorial | Siete preguntas conservadas, recomendaciones según errores, tres casos opcionales, búsqueda y transferencia territorial a tarjeta. |
| Lente y recorrido con acciones reales | Complemento 40,3 %, causa no comprobable, entidad ausente, archivo inválido, tarjeta con conclusión, seis acciones registradas y resumen; visita y demo guiada no suman actividad. |
| Accesibilidad y ocho anchos | Estado educativo expandido sin infracciones axe, incluidas reglas WCAG 2.2 disponibles; 320,375,390,430,768,1024,1366,1440 px sin desbordamiento. No certifica WCAG. |

## Cobertura territorial

Fecha UTC: 2026-10-28T14:59:00.739Z

| Prueba | Resultado observado |
|---|---|
| 32 entidades y contextos territoriales | 32 tasas comparadas contra CSV de doble cotejo; cada selección renderiza su valor y cada afirmación identifica ámbito y coincide. Nombres solapados, México nacional, acentos y búsqueda comprobados. |

## Motores adicionales

Fecha UTC: 2026-10-28T15:00:43.972Z

| Prueba | Resultado observado |
|---|---|
| Firefox de escritorio automatizado | Motor 153.0: datos, edades, escenarios, quiz, contraste, PNG, demo, sala real local y OCR. Cuatro anchos y cero infracciones axe. WebKit no equivale a Safari físico. |
| WebKit de escritorio automatizado | Motor 26.5: datos, edades, escenarios, quiz, contraste, PNG, demo, sala real local y OCR. Cuatro anchos y cero infracciones axe. WebKit no equivale a Safari físico. |

## Ayudas por sección

Fecha UTC: 2026-10-28T14:59:26.845Z

| Prueba | Resultado observado |
|---|---|
| Cobertura y ayuda con mouse | 16 ayudas con propósito, pasos y límites. Permanecen abiertas al mover el mouse al panel y cierran con Escape. |
| Teclado y cierre | Foco abre la ayuda, Enter permite acceder al cierre, Escape restaura el foco y Tab sale sin atraparlo. Clic exterior cierra. |
| Adaptación y accesibilidad | Panel dentro de ocho anchos de 320 a 1440 px; apertura y cierre por toque emulado; cero infracciones axe con ayuda abierta. No sustituye dispositivos físicos. |
| Respaldo autónomo | Ayuda disponible al abrir el HTML por file://, sin servidor ni consultas externas. |

## Refinamiento visual

Fecha UTC: 2026-10-28T14:59:43.220Z

| Prueba | Resultado observado |
|---|---|
| Movimiento y precisión | Luz decorativa responde al mouse y se restablece; la cifra exacta aparece inmediatamente; cambiar a movimiento reducido detiene los efectos y conserva los cien puntos. |
| Efectos finitos y progreso visual | Los efectos terminan; el indicador de desplazamiento no registra aprendizaje ni altera Mi recorrido. |
| Composición adaptable | Doce secciones en ocho anchos sin desbordamiento; 24 capturas de escritorio y móvil para revisión visual; sin errores JavaScript. |

## Accesibilidad automática

6 estados examinados con axe-core: initial, expanded, resources, mobile-menu, ages, evidence-and-cards. Cero infracciones detectadas. La suite devuelve salida de error si aparecen infracciones.

## Alcance y límites

56 grupos de comprobaciones funcionales aprobados. Las doce suites predeterminadas incluyen comprobaciones API además de estos grupos; la suite engines se ejecuta por separado. El piloto sigue sin ejecutarse. Las pruebas no certifican WCAG ni sustituyen lector de pantalla, Safari en dispositivos físicos ni teléfonos reales. La ampliación de texto se comprobó como tamaño base 200% a 640px; no equivale a una auditoría completa de zoom. Las tasas se comparan con referencias locales ya cotejadas, no se vuelven a extraer del PDF oficial en cada ejecución.

Se revisaron capturas móviles/escritorio, PNG, PDF, DOCX exportado por Word y presentación renderizada. Los archivos generados se conservan en evidencia/. El informe de video está en entregables/video/verificacion_video.json.
