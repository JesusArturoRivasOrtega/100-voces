# Pruebas de 100 VOCES · v1.2.0

Ejecución reproducible: npm ci y npm test. El ejecutor inicia y detiene su servidor local. Los resultados siguientes proceden de los reportes guardados; no se infieren de la presencia del código.

## Base

Fecha UTC: 2026-10-25T23:57:39.570Z

| Prueba | Resultado observado |
|---|---|
| Cálculos y validación | Coinciden; cuatro casos inválidos rechazados |
| Seis años | 6/6 años coinciden |
| Comparador | Tres diferencias coinciden y cada grupo tiene 3 años |
| Territorios | 8/8 coinciden; selección declarada |
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

Fecha UTC: 2026-10-25T23:57:52.270Z

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

Fecha UTC: 2026-10-25T23:58:07.818Z

| Prueba | Resultado observado |
|---|---|
| Foco territorial | Enter conserva el botón y la entidad seleccionada |
| Demostración repetible | Entidad, edad, A/B, quiz y tarjeta restablecidos |
| Navegación móvil | Menú, Escape, foco en destino; portada 768 px a 375×812 |
| Recursos y texto ampliado | Carrusel sin desborde en 4 anchos; texto base 200% a 640px |
| Recursos descargables | 14 destinos locales existen y responden con contenido |
| Distribución autónoma | Siete preguntas y rutas al kit local correctas sin red |

## En vivo y Lente

Fecha UTC: 2026-10-25T23:58:30.541Z

| Prueba | Resultado observado |
|---|---|
| Contraste numérico y ámbitos | Tasas, complementos, edad, unidades, signos y ámbitos no disponibles |
| Sala compartida | Presentador y dos contextos independientes; sincronización, recuperación y control de rondas |
| Demo y exportaciones | Tres rondas ficticias, resumen y ficha PNG descargados |
| OCR local | Captura sintética leída en español, sin subida ni solicitudes a otro origen |
| Accesibilidad y adaptación | Sin infracciones axe en el estado expandido; sin desbordamiento en 320,375,768,1440 px |

## Accesibilidad automática

6 estados examinados con axe-core: initial, expanded, resources, mobile-menu, ages, evidence-and-cards. Cero infracciones detectadas. La suite devuelve salida de error si aparecen infracciones.

## Alcance y límites

35 grupos de comprobaciones funcionales aprobados. El piloto sigue sin ejecutarse. Las pruebas no certifican WCAG ni sustituyen lector de pantalla, Safari/Firefox o teléfonos físicos. La ampliación de texto se comprobó como tamaño base 200% a 640px; no equivale a una auditoría completa de zoom. Las tasas se comparan con referencias locales ya cotejadas, no se vuelven a extraer del PDF oficial en cada ejecución.

Se revisaron capturas móviles/escritorio y PNG del carrusel. Los archivos generados se conservan en evidencia/. El informe de video está en entregables/video/verificacion_video.json.
