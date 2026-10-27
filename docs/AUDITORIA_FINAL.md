# Auditoría final de implementación · 1.3.0

Corte: 26 de octubre de 2026. Se conserva el proyecto existente, su identidad visual y sus fuentes. Este documento distingue implementación, pruebas de software y validación humana. No certifica ausencia de defectos ni aprobación institucional.

## Matriz funcional

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
