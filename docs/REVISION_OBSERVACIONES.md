# Revisión de observaciones · 28 de octubre de 2026

- **Capítulo 01:** la columna de puntos se alinea arriba; abrir evidencia no altera su posición vertical.
- **Capítulo 02:** los extremos se ordenan cronológicamente, también al pulsar una barra. El texto explica el intercambio y define pp. Seleccionar el mismo año mantiene el aviso de diferencia cero.
- **Capítulo 05:** A y B son porcentajes hipotéticos editables; se explican 54,7 %, 64,7 % y la referencia 59,7 %, sin atribuir efectos a acciones o campañas.
- **Capítulos 07 y 08:** numeración completa. Las salas comprueban la disponibilidad de su API. Se explica por qué Python solo ofrece la demostración local y cómo iniciar el servidor completo. La audiencia del sitio sigue privada; una sala no concede acceso al sitio.
- **Ensayo:** seis respuestas aleatorias por clic dentro del rango de la pregunta; permite practicar añadir, revelar y avanzar. Reiniciar el ensayo borra sus respuestas ficticias. La distribución no representa un grupo real.
- **Lente:** cruza cifra/unidad, años, ámbito explícito e indicador con el texto antes de comparar; rechaza cronología inversa y múltiples tasas/años ambiguos. El resultado muestra contexto, valor introducido, referencia y cálculo. La detección de lenguaje es heurística; la coincidencia numérica no certifica el texto completo, causas o imágenes.
- **Materiales:** el ZIP se identifica como selección editorial fija. Un enlace conduce al generador para elegir otros datos disponibles.
- **Glosario:** porcentaje, pp, cambio relativo, denominador/CCPC, complemento, ámbito, escenarios, media/error y evidencia/causalidad.

## Comprobaciones reproducibles

`npm test` incluye regresiones para posición de puntos, intervalo invertido, contradicciones de Lente, ausencia de API, lotes simulados con aleatoriedad controlada, salas con dos participantes, OCR, exportaciones y adaptación móvil. `node tests/worker.cjs` comprueba por separado la aplicación compilada con Worker y D1 local. Los resultados fechados están en `evidencia/` y `docs/PRUEBAS.md`.

Estas pruebas no sustituyen una sesión con usuarios reales ni garantizan ausencia absoluta de errores. Los pendientes humanos de publicación, acceso del jurado y entrega formal siguen en `docs/PENDIENTES_HUMANOS.md`.
