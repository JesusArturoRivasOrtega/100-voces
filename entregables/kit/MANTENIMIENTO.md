# Mantenimiento · responsables y flujo
Edición 21/10/2026 · Asignar nombres reales antes de operar este plan.

## Roles propuestos, todavía sin asignar
- Responsable de datos: verifica fuente, año, ámbito, denominador, precisión y transcripción; conserva evidencia.
- Responsable técnico: modifica código fuente, genera artefactos y ejecuta pruebas funcionales y de accesibilidad automática.
- Responsable educativo: revisa lenguaje, preguntas, claves y retroalimentación; organiza el piloto y adapta materiales.
- Responsable de entrega: concilia versiones, enlaces, licencias y archivos; prepara el paquete y comprueba integridad.
Una persona puede cubrir varios roles. Procurar una segunda revisión de datos y materiales. No se atribuye ninguna tarea realizada a personas que no la hayan confirmado.

## Flujo por cambio
1. Registrar problema, alcance y criterio de aceptación. Anotar versión o fecha; guardar respaldo del estado anterior.
2. Para indicadores, editar sólo dist/data/ccpc_resumen.json después de cotejar la publicación primaria. No completar datos faltantes por inferencia ni promediar tasas sin sus denominadores.
3. Editar módulos de dist/js/, estructura de dist/index.html y estilos de dist/styles.css. Actualizar fuente, glosario, preguntas, materiales y descripción de alcance cuando corresponda.
4. Ejecutar scripts/build.py para regenerar datos derivados y HTML autónomo. scripts/prepare.py es una transformación inicial y no debe usarse para actualizar la versión final.
5. Ejecutar las comprobaciones documentadas en el proyecto: datos, cuestionario, escenarios, teclado, móvil, exportación y archivo sin conexión. Revisar visualmente PDF y tarjetas. Los resultados automáticos no certifican WCAG.
6. Registrar resultado real y límites. Si falla un criterio, corregir o marcarlo pendiente; no reciclar una captura anterior como evidencia nueva.
7. Regenerar ZIP y manifiesto SHA-256 tras cerrar cambios; extraer el ZIP en otra carpeta y comprobar apertura, enlaces internos y documentos.
8. La publicación y cambios de audiencia se gestionan explícitamente. El estado documentado sigue siendo privado mientras no exista un cambio confirmado.

## Cuándo revisar
Antes de cada entrega y al incorporar una fuente, función o corrección. Comprobar enlaces externos antes de compartir. Actualizar el video y el pitch cuando la interfaz o sus afirmaciones cambien. Este plan no instala tareas automáticas ni asegura que esas revisiones ya hayan ocurrido.

## Registro mínimo de cambios
Fecha · archivo o módulo · motivo · fuente si cambia un dato · responsable real · comprobación y resultado · limitaciones · versión entregada. Mantener resultados de piloto separados de pruebas de software.
