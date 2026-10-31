# Auditoría final de implementación · 1.3.0

Corte: 26 de octubre de 2026. Se conserva el proyecto existente, su identidad visual y sus fuentes. Este documento distingue implementación, pruebas de software y validación humana. No certifica ausencia de defectos ni aprobación institucional.

## Revisión técnica final · 31 de octubre de 2026

Se reejecutaron con éxito la construcción, TypeScript, las trece suites predeterminadas, Firefox/WebKit y la integración del Worker construido con D1 local. Los reportes actualizados reúnen 62 grupos funcionales; la API también pasó sus pruebas de aislamiento, permisos, caducidad, concurrencia y cupo local. `npm audit` no informó vulnerabilidades conocidas.

Se comprobaron 67 referencias locales, la integridad de los ZIP de materiales y la huella del video contra su verificación existente. Se inspeccionaron capturas actuales de portada móvil/escritorio, Sala en vivo móvil y Lente en escritorio. La evidencia fechada está en `evidencia/verificacion-entrega.json`, `evidencia/integracion-worker.json` y [PRUEBAS.md](PRUEBAS.md).

GitHub Actions ahora incluye comprobación de tipos, los tres motores y la integración Worker/D1. Se corrigieron las instrucciones de despliegue y el recuento antiguo de suites. La publicación del código en GitHub no modifica el acceso privado del sitio ni acredita el acceso del jurado; permanecen los pendientes humanos y de producción enumerados en este documento.

## Cumplimiento del prompt maestro: no equivale a un cierre del 100 %

El adjunto revisado en esta continuación tiene el mismo SHA-256 que el prompt anterior: `0db62682e60747909fccc51e0948e973caa5e0153ae9df3cd439107694625474`. La versión 1.3 implementa el núcleo técnico y contiene materiales, pruebas y documentación; siguen existiendo validaciones pendientes y propuestas opcionales sin implementar. No debe presentarse como cumplimiento literal de todos los pasos.

| Fases del prompt | Evidencia existente | Estado y límite |
|---|---|---|
| 0: auditoría | Esta matriz, `AUDITORIA_Y_ARQUITECTURA.md`, reportes en `evidencia/` | Realizada con hallazgos y límites documentados |
| 1: acceso y estabilidad | `DESPLIEGUE_Y_ENTREGA.md`, integración Worker/D1, GitHub Actions | Publicación verificada; acceso externo del jurado pendiente |
| 2–3: diseño y portada | `public/styles.css`, `public/features.css`, navegación y recorridos | Implementado y probado; comprensión con público pendiente |
| 4: cien puntos | Visualización y denominador interactivo | La explicación ya está visible: no hay una pregunta previa que oculte la respuesta; tampoco doble nube de puntos opcional |
| 5: comparador | Selector de años, barras y diferencias | Funcional; tarjeta específica de comparación histórica opcional pendiente |
| 6–9: territorios, aprendizaje, escenarios y tarjetas | 32 entidades, 18 edades nacionales, quiz, A/B, PNG | Implementados; mensajes de tarjeta mediante opciones, sin edición libre |
| 10–12: En vivo, Lente y recorrido | `EN_VIVO_Y_LENTE.md`, pruebas API y navegadores | Implementados; prueba de capacidad del alojamiento con usuarios reales pendiente |
| 13: datos | `DATOS_Y_METODOLOGIA.md`, `fuentes/` y pruebas territoriales | Cotejo de tasas publicadas; no recálculo de microdatos |
| 14: accesibilidad | `ACCESIBILIDAD.md`, axe, teclado, anchos y movimiento reducido | Verificación automática y visual; lector de pantalla y teléfonos físicos pendientes |
| 15–16: seguridad y autonomía | `SEGURIDAD_PRIVACIDAD.md`, auditoría de dependencias, HTML autónomo | Revisados; purga sin tráfico y carga de producción pendientes |
| 17: validación educativa | `VALIDACION_EDUCATIVA.md`, protocolo y CSV de piloto | Protocolo preparado; piloto sin ejecutar, sin resultados inventados |
| 18–21: materiales y entrega | Kit, presentación, guion, MP4, índice y ZIP | Archivos generados y revisados; alojamiento externo del video, firmas y envío pendientes |
| 22–23: pruebas y revisión visual | `PRUEBAS.md`, capturas y reportes | Pruebas ejecutadas con su alcance; no garantía de ausencia de defectos |
| 24–25: criterios y difusión | `entregables/editoriales/100_VOCES_Matriz_Criterios_y_Demo.md`, `100_VOCES_Propuesta_Difusion.md` | Documentos existentes equivalentes; no es necesario duplicarlos con otros nombres |
| 26: prioridades | Prioridades al final de esta auditoría y `PENDIENTES_HUMANOS.md` | Cierre externo aún pendiente |

La observación de un compañero, transmitida por el autor, indica dificultad para entender la utilidad de las secciones. Es una señal de usabilidad, no un piloto formal ni una medida de aprendizaje. Motiva las ayudas contextuales de esta revisión.

### Mejora de comprensión por sección

**Estado:** implementación y verificación registradas en `evidencia/pruebas-ayuda.json` tras su ejecución.

**Archivos:** `public/js/help.js`, `public/features.css`, `public/index.html`, `tests/help.cjs` y HTML autónomo regenerado.

**Problema:** nombres narrativos y múltiples herramientas no siempre explican al visitante para qué sirve cada sección.

**Implementación:** 16 botones «?» para capítulos, portada, denominador, edades, recorrido y descargas. Cada panel explica propósito, dos pasos y límites. Apertura con mouse, foco, clic o toque; cierre con Escape, botón, clic exterior o salida por teclado. También se corrige la etiqueta antigua de ocho entidades y el enlace de portada hacia las fuentes.

**Verificación:** suite dedicada con contenido, persistencia al pasar el mouse al panel, teclado, toque emulado, ocho anchos, axe y apertura del HTML autónomo. Los resultados ejecutados se registran en el informe de pruebas.

**Impacto:** el visitante puede entender una herramienta antes de interactuar y consultar instrucciones sin abandonar el capítulo.

**Limitaciones:** necesita volver a probarse con el compañero y con participantes; no se afirma haber resuelto toda dificultad de comprensión.

## Matriz de la versión implementada

### Revisión visual y efectos

**Fase realizada:** refinamiento visual solicitado el 28 de octubre de 2026.

**Estado:** implementada; resultados de ejecución en `evidencia/pruebas-visuales.json` y `PRUEBAS.md`.

**Archivos modificados:** `public/features.css`, `public/js/polish.js`, `tests/visual.cjs`, ejecutor e informe de pruebas; HTML autónomo regenerado.

**Problema solucionado:** falta de profundidad y coherencia entre superficies, transiciones discretas y ayuda desalineada en cabeceras móviles largas.

**Implementación:** portada con iluminación y detalle orbital, tarjetas y botones refinados, cabeceras con acentos, indicador de desplazamiento y animaciones finitas de entrada y respuesta. Cifras y escala no se animan mediante valores inventados.

**Verificación:** pruebas de efectos, cancelación, precisión, 96 combinaciones de sección/ancho y capturas; suite funcional y accesibilidad. Se corrigió durante la revisión un contraste insuficiente de una etiqueta expandida sobre fondo oscuro.

**Impacto:** mayor jerarquía y respuesta visual sin añadir pasos al uso de las herramientas.

**Limitaciones:** no certifica ausencia de errores; quedan las pruebas humanas y con dispositivos físicos señaladas en este informe. Los materiales audiovisuales previos explican las mismas funciones con el acabado visual anterior.

| Función | Revisión y cambio | Evidencia o límite |
|---|---|---|
| 1. Portada y narrativa | Pregunta 59,7 %, accesos a rutas y funciones | Capturas y suite release; no estudio de comprensión |
| 2. Navegación | Menú móvil, anclas, foco y recorrido reiniciable | browser, improvements, release |
| 3. Cien puntos | Redondeo visual separado de tasa publicada | browser; 59,7 % no se convierte en 60 % exacto |
| 4. Denominador | Sí + No votaron; excluye no especificados | learning, browser y datos locales cotejados |
| 5. Historia | Seis elecciones y filtro de tipo | browser; no nuevas tasas inventadas |
| 6. Comparador | Origen, destino y año de contexto visibles | education; pp distintos de variación relativa |
| 7. Territorio | Búsqueda, vacío explícito y transferencia a tarjeta | education; 32 entidades cotejadas |
| 8. Edades | 18 grupos nacionales, separados de entidad | browser/release; no cruce territorial disponible |
| 9. Escenarios | A/B y referencia observada | improvements; no predicción ni efecto causal |
| 10. Aprender | Siete preguntas, recomendaciones por error, tres casos extra | education; sin afirmar aprendizaje duradero |
| 11. Tarjetas | Tres formatos, fuente y pregunta o conclusión prudente | browser/education; descargas PNG reales |
| 12. Recursos | Kit, carrusel, PDF, video y formatos editables | release y verificaciones editoriales |
| 13. Sala en vivo | Recuperación, red, sesión, histogramas, controles y cupos | features/resilience/hardening; 500 identificadores locales, no 500 personas reales |
| 14. Lente | Contexto confirmado, varias cifras, años ausentes, límites causales | features/resilience/education; no verificador universal |
| 15. OCR | Archivo válido, 8 MB, 24 MP, cancelación, progreso y baja confianza | imágenes de prueba; capturas arbitrarias pueden fallar |
| 16. Mi recorrido | Seis acciones reales, resumen y borrado en memoria | education; desplazarse o ejecutar demo no suma |
| 17. Respaldo y adaptación | HTML autónomo, ocho anchos, motores y movimiento reducido | pruebas automatizadas; OCR y salas necesitan HTTP/servidor según su función |

## Fases realizadas

### Datos y metodología

**Estado:** completada, incluida ampliación a 32 entidades.

**Archivos:** `public/data/ccpc_resumen.json`, `docs/DATOS_Y_METODOLOGIA.md`, `fuentes/VERIFICACION_CCPC.md`, `fuentes/EDADES_2024.md`.

**Problema:** confundir puntos dibujados con tasa exacta, ámbitos y causalidad.

**Implementación:** se conservan las cifras cotejadas y se refuerza su contexto en comparación, edades, Lente y materiales.

**Verificación:** validaciones y referencias de las suites; las 32 tasas territoriales se cotejaron visualmente en Manual p.16 y Estudio p.25; registro en fuentes/ENTIDADES_2024_COTEJO.csv.

**Impacto:** evita conclusiones que la base no sustenta.

**Limitaciones:** no se recalcularon microdatos; nuevos años y cruces edad por entidad requieren otra base y cotejo.

### Estabilidad, seguridad y privacidad

**Estado:** implementada; resultados ejecutados en `PRUEBAS.md` y `SEGURIDAD_PRIVACIDAD.md`.

**Archivos:** `lib/live-service.mjs`, `lib/client/live-entry.js`, `lib/client/lens-entry.js`, `lib/lens-domain.cjs`, dependencias fijadas y `tests/`.

**Problema:** límite compartido por IP demasiado pequeño para un aula, cupos con carreras, respuesta grande, pérdida de vista y OCR con cancelación incompleta.

**Implementación:** escrituras condicionadas atómicas, límite por participante, lectura de cuerpos por bytes, recuperación de sala, limpieza al haber actividad y OCR cancelable.

**Verificación:** API real compartida con SQLite local, navegadores participantes aislados y pruebas de concurrencia. El informe de seguridad conserva el resultado de auditoría de dependencias.

**Impacto:** un grupo en la misma red puede participar y corregir respuestas dentro del cupo.

**Limitaciones:** no hay purga programada sin tráfico; no se midió carga del alojamiento con 500 dispositivos ni se realizó pentest externo.

### Experiencia, educación y diseño

**Estado:** completada para los cambios descritos.

**Archivos:** `public/index.html`, `public/features.css`, `public/js/{app,learning,contrasts,visualization,export,journey,polish}.js`.

**Problema:** falta de orientación al equivocarse, búsqueda territorial y recorrido demostrativo que registraba una actividad no realizada.

**Implementación:** repaso dirigido, casos extra, buscador, tarjeta contextual, historial de acciones en memoria y animaciones breves respetando movimiento reducido. El modo guiado se marca antes de reiniciar sus ejemplos.

**Verificación:** suite education, teclado/foco, axe y tamaños de pantalla; captura visual de resultados y descargas.

**Impacto:** el usuario identifica qué repasar y comparte una explicación con límites.

**Limitaciones:** estas comprobaciones no miden comprensión humana ni constituyen certificación WCAG.

### Materiales y entrega

**Estado:** materiales técnicos actualizados; entrega administrativa pendiente.

**Archivos:** `entregables/editoriales/`, `entregables/kit/`, `entregables/video/`, `LEEME_ENTREGA.md`, `scripts/package.py`.

**Problema:** los materiales anteriores no explicaban las dos funciones nuevas.

**Implementación:** guion de cuatro páginas, presentación de diez, video de 170 s con voz sintética declarada y guía de sala/Lente en kit de once páginas.

**Verificación:** renderizados inspeccionados, DOCX exportado con Word a cuatro páginas, diez diapositivas renderizadas con artifact-tool, MP4 decodificado y audio presente por segmento. Los archivos de verificación acompañan cada entregable.

**Impacto:** una demostración reproducible y coherente con el producto actual.

**Limitaciones:** falta reproducción en el equipo final, acceso externo al video, piloto y documentos firmados. Ver `PENDIENTES_HUMANOS.md`.

## Prioridades pendientes

1. **P0 de entrega:** validar inscripción, elegibilidad, cartas, permisos del sitio/video y acceso del jurado. Requiere al equipo.
2. **P1 de validación:** piloto de 5–8 personas, lector de pantalla, teléfonos físicos y prueba con conectividad irregular. Registrar observaciones, no inventarlas.
3. **P2 de operación:** programar purga independiente del tráfico y medir capacidad del alojamiento antes de escalar a eventos grandes.
4. **P3 de cobertura:** incorporar nuevos años territoriales; traducciones y evaluación diferida solo con revisión responsable.

Los documentos existentes de metodología y despliegue se actualizan en su ruta; no se crean copias con nombres distintos.
