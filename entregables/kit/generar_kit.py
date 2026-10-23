from pathlib import Path
from xml.sax.saxutils import escape
import csv, re, zipfile, hashlib, json
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

ROOT = Path(__file__).resolve().parent
documents = {
'guia_facilitacion.md': '''# Guía de facilitación · 100 VOCES
Jóvenes sin formación estadística y docentes · 15 minutos · Edición 21/10/2026

## Objetivo y preparación
Al terminar, cada persona podrá leer una tasa, comparar elecciones del mismo tipo y explicar una limitación del dato. La actividad enseña interpretación; no evalúa preferencias políticas ni calidad ciudadana.

Materiales: un equipo por pareja, archivo 100_VOCES_ABRIR.html o aplicación local, lápiz y esta guía. El archivo autónomo funciona sin conexión; abrir fuentes externas requiere internet. Para una sesión accesible, ofrecer teclado, zoom, lectura en voz alta y respuestas orales. No obligar a usar un teléfono propio.

Antes de iniciar, comprobar apertura, navegación, datos por edad y descarga de tarjeta en el dispositivo disponible. No anunciar un enlace público mientras el sitio siga privado. Es una experiencia independiente, sin aval institucional del INE.

## Recorrido de 15 minutos
- Minutos 0–2 · Preguntar: «Si vemos 60 figuras de 100, ¿la tasa publicada tiene que ser exactamente 60 %?». Escuchar sin calificar. Mostrar 59.7 % nacional en 2024 y el redondeo visual.
- Minutos 2–5 · Explorar el denominador. Pedir que expliquen quién entra: sí votaron y no votaron con registro definido. Los no especificados se excluyen; no se cuentan como abstención.
- Minutos 5–8 · Comparar 2018 con 2024: 62.4 % a 59.7 %, cambio de −2.7 puntos porcentuales. Ambas elecciones son presidenciales. Repetir con intermedias 2015–2021: +4.7 puntos.
- Minutos 8–10 · Abrir entidades y después edades. Identificar año, ámbito y fuente. Localizar 25–29 años: 47.3 % nacional en 2024. No cruzar ese dato con una entidad.
- Minutos 10–12 · Probar escenarios A/B con 50 % y 60 %. Entre A y B hay +10 puntos porcentuales. Calcular aparte 10/50 × 100 = +20 % relativo sobre A; la pantalla muestra el cambio relativo de cada escenario frente al observado 59.7 %. Son ejemplos hipotéticos, no pronósticos.
- Minutos 12–14 · Resolver uno o dos reactivos y leer su retroalimentación con calma. Priorizar el razonamiento sobre la puntuación. Completar los restantes después de la sesión. Alternativa sin dispositivo: elegir uno o dos de los siete conceptos de la página siguiente.
- Minuto 14–15 · Crear una tarjeta y decir: «Este dato muestra…, su fuente es…, no permite concluir…». Verificar que conserve año, ámbito y fuente.

## Cierre y adaptación
Pedir una duda que siga abierta. Si falta tiempo, hacer una sola comparación y terminar el cuestionario después. El piloto formal del archivo PILOTO.md usa su propio protocolo de 15 minutos; no debe sumarse a esta sesión ni presentarse como investigación representativa.

---

# Siete conceptos · respuestas para facilitar
Usar estas preguntas como conversación. Aceptar explicaciones equivalentes; mostrar las respuestas después del intento.

## 1. Redondeo
Pregunta: ¿Por qué 59.7 % se representa aproximadamente con 60 figuras? Respuesta: una figura completa equivale a un punto en una ilustración de cien; se redondea la imagen. El dato publicado sigue siendo 59.7 %, no una observación de cien personas reales.

## 2. Puntos porcentuales y cambio relativo
Pregunta: de 62.4 % en 2018 a 59.7 % en 2024, ¿cuánto cambia? Respuesta: 59.7 − 62.4 = −2.7 puntos porcentuales. La variación relativa es (−2.7 / 62.4) × 100, aproximadamente −4.3 %. No son la misma medida. De 47.1 % en 2015 a 51.8 % en 2021: +4.7 puntos porcentuales. Las diferencias usan tasas publicadas redondeadas.

## 3. Tipo de elección
Pregunta: ¿Qué comparación mantiene el tipo de elección de 2024? Respuesta: 2018–2024, ambas presidenciales. También lo es 2012; 2009, 2015 y 2021 son intermedias. Mantener el tipo facilita la lectura, pero no demuestra causas.

## 4. Dato agregado
Pregunta: ¿Una tasa de un grupo revela quién votó o por qué? Respuesta: no. Resume registros del grupo; no identifica conductas individuales, preferencias partidistas ni motivos. Tampoco permite juzgar a sus integrantes.

## 5. Escala
Pregunta: ¿Una barra recortada puede exagerar una diferencia? Respuesta: sí. Comparar etiquetas, unidad y eje común de 0 a 100 %. Una gráfica no cambia el dato por alargar visualmente una barra. Una media simple de tasas estatales tampoco equivale a la tasa nacional.

## 6. No especificados
Pregunta: ¿Cómo entran los registros no especificados en la tasa CCPC? Respuesta: quedan fuera del denominador. Tasa = sí votaron / (sí votaron + no votaron) × 100. No tener información suficiente no equivale a no votar.

## 7. Edades nacionales
Pregunta: ¿47.3 % de 25–29 años permite describir ese grupo en Yucatán? Respuesta: no. Es la tasa nacional de ese grupo en 2024; el proyecto no contiene el cruce edad por entidad. Una fotografía de grupos en un año tampoco sigue a las mismas personas a lo largo de su vida.

Fuentes: Manual CCPC 2009–2024, pp. 17–18, 21 y 30; Estudio de participación 2024, pp. 16, 18 y 25. Enlaces y copias locales en FUENTES.md.
''',
'PILOTO.md': '''# Piloto de comprensión · protocolo sin resultados
Plan para 5–8 personas · Sesión individual de 15 minutos · Edición 21/10/2026

## Estado y propósito
Este documento es un protocolo listo para aplicar. No acredita que se hayan realizado sesiones. El CSV adjunto contiene únicamente encabezados. El piloto busca errores de comprensión y dificultades de uso; no demuestra eficacia causal ni representa a toda la población.

## Participantes y cuidado de la información
Invitar voluntariamente a 5–8 personas del público objetivo con distinta familiaridad con datos. Buscar diversidad de dispositivos y necesidades de acceso cuando sea posible, sin prometer representatividad. Para menores de edad, coordinar los permisos de la institución y responsables antes de la sesión.

Explicar: «Probamos la herramienta, no a ti. Puedes omitir preguntas o terminar cuando quieras. No necesitamos saber por quién votas ni si votaste». Solicitar permiso para tomar notas anónimas. Usar identificadores P01, P02…; no registrar nombres, contactos, intención de voto, dirección ni fecha de nacimiento. No grabar por defecto. Acordar responsable, acceso y fecha de eliminación antes de recoger información.

## Secuencia exacta de 15 minutos
- 0:00–1:00 · Explicar propósito y voluntariedad; obtener permiso para notas y asignar ID.
- 1:00–3:00 · Aplicar sólo los reactivos 2 y 6 de la forma A o B, sin ayuda ni retroalimentación. Alternar el orden A→B y B→A entre participantes para reducir el efecto de una forma.
- 3:00–10:00 · Pedir las cuatro tareas de abajo. Observar y anotar ayuda requerida; intervenir sólo si la persona se atasca, registrándolo. No usar el cuestionario de la aplicación antes del post, pues adelanta respuestas.
- 10:00–12:00 · Aplicar sólo los reactivos 2 y 6 de la otra forma, sin volver a la primera ni consultar la app.
- 12:00–15:00 · Preguntar qué confundió, qué cambiaría y si pudo leer y navegar cómodamente. Explicar respuestas, agradecer y cerrar.

El piloto breve observa dos conceptos: puntos porcentuales y no especificados. Ofrecer los demás reactivos como práctica después del cierre; esas respuestas no forman parte del pre/post. Para aplicar las siete preguntas antes y después, reservar una sesión ampliada de al menos 25 minutos y ajustar tiempos tras una prueba de lectura. No anunciar cobertura de siete conceptos a partir de sólo dos reactivos.

## Cuatro tareas observables
T1. Encontrar la tasa nacional de 2024 y explicar quién entra en el denominador.
T2. Comparar 2018 con 2024 y decir el cambio con su unidad.
T3. Encontrar 25–29 años y explicar ámbito, año y una inferencia que no permite.
T4. Encontrar la fuente y descargar una tarjeta con año, ámbito y fuente visibles.

Registrar cada tarea como independiente, con_ayuda o no_completada. Si se agota el tiempo, registrar no_completada y el motivo; no adivinar respuestas. Anotar navegador/dispositivo sin identificadores personales. Si una fuente no abre sin conexión, distinguir ese límite de un problema de comprensión.

---

# Forma A · lectura inicial o final
ID anónimo: __________   Momento: pre / post   Fecha: __________
Marca una opción por pregunta. «No sé» también es válido. En el piloto breve responde sólo A2 y A6 en dos minutos. Los demás reactivos quedan para práctica posterior; no es una calificación escolar.

## A1 · Redondeo
Una tasa de 59.7 % aparece con 60 figuras de cien. ¿Qué significa?
a) La tasa exacta es 60 %.  b) Las figuras son una aproximación de 59.7 %.  c) Se entrevistó a cien personas.  d) No sé.

## A2 · Cambio
Una tasa pasa de 50 % a 60 %. ¿Cuál es su aumento en puntos porcentuales?
a) 20 puntos.  b) 60 puntos.  c) 10 puntos.  d) No sé.

## A3 · Elección comparable
Para comparar 2024 con otra elección presidencial, ¿qué año eliges?
a) 2018.  b) 2021.  c) 2015.  d) No sé.

## A4 · Agregados
Una entidad tiene una participación de 70 %. ¿Qué se puede afirmar?
a) Cada persona vota siete de diez veces.  b) Se conocen los motivos de quienes no votaron.  c) La tasa resume al conjunto y no identifica conductas individuales.  d) No sé.

## A5 · Escala
Dos gráficas muestran 50 % y 60 %, pero una empieza su eje en 45. ¿Qué debes revisar?
a) Sólo el color.  b) La escala, etiquetas y valores antes de comparar.  c) La barra más alta siempre significa el doble.  d) No sé.

## A6 · No especificados
En la tasa CCPC, los registros no especificados:
a) Se cuentan como no votaron.  b) Se cuentan como sí votaron.  c) Se excluyen del denominador.  d) No sé.

## A7 · Edades
La tasa nacional 2024 de 25–29 años es 47.3 %. ¿Permite afirmar lo mismo para ese grupo en una entidad?
a) No; falta el dato de edad por entidad.  b) Sí, todos los estados tienen esa tasa.  c) Sí, si la entidad tiene mucha población.  d) No sé.

---

# Forma B · lectura inicial o final
ID anónimo: __________   Momento: pre / post   Fecha: __________
Marca una opción por pregunta. «No sé» también es válido. En el piloto breve responde sólo B2 y B6 en dos minutos. Los demás reactivos quedan para práctica posterior; no es una calificación escolar.

## B1 · Redondeo
Una tasa de 47.3 % aparece con 47 figuras de cien. ¿Qué significa?
a) Se observó directamente a cien personas.  b) La tasa es exactamente 47 %.  c) Las figuras aproximan la tasa publicada de 47.3 %.  d) No sé.

## B2 · Cambio
Una tasa pasa de 40 % a 50 %. ¿Cuál es su aumento en puntos porcentuales?
a) 10 puntos.  b) 25 puntos.  c) 50 puntos.  d) No sé.

## B3 · Elección comparable
Para comparar 2021 con otra elección intermedia, ¿qué año eliges?
a) 2018.  b) 2015.  c) 2024.  d) No sé.

## B4 · Agregados
La tasa de un grupo de edad es 60 %. ¿Qué permite concluir?
a) Se conoce cómo actuó cada persona.  b) Resume al grupo, sin revelar sus decisiones individuales.  c) Se sabe por qué participó el grupo.  d) No sé.

## B5 · Escala
Dos gráficas muestran 40 % y 50 %, pero una empieza su eje en 35. ¿Cómo las interpretas?
a) Comparo escalas, etiquetas y valores.  b) Uso sólo la longitud aparente.  c) El color explica la diferencia.  d) No sé.

## B6 · No especificados
No hay información suficiente para clasificar unos registros. En la tasa CCPC:
a) Quedan fuera de sí votaron + no votaron.  b) Se suman automáticamente a no votaron.  c) Se reparten por mitades.  d) No sé.

## B7 · Edades
La tasa nacional 2024 de 20–24 años es 48.4 %. ¿Describe necesariamente a ese grupo en tu estado?
a) Sí, por ser del mismo año.  b) Sí, por ser la misma edad.  c) No; el dato nacional no es un cruce por entidad.  d) No sé.

---

# Registro y análisis del piloto
## Clave y reglas de puntuación
Forma A: 1 b · 2 c · 3 a · 4 c · 5 b · 6 c · 7 a.
Forma B: 1 c · 2 a · 3 b · 4 b · 5 a · 6 a · 7 c.
Cada respuesta correcta vale 1; respuesta incorrecta o «no sé» vale 0. Una pregunta no aplicada u omitida queda vacía. En el piloto breve registrar sólo q2 y q6, con pre_total y post_total vacíos; comparar cada concepto por separado. No completar un total de siete si faltan respuestas: registrar cuántas se respondieron. Las formas son equivalentes por concepto y dificultad prevista; su equivalencia no ha sido validada psicométricamente.

## Cómo llenar registro_piloto.csv
Una fila por participante. Las columnas pre_q1…pre_q7 y post_q1…post_q7 guardan la letra elegida (a, b, c o d); dejar vacío si se omitió. forma_pre y forma_post indican A o B. pre_total y post_total van de 0 a 7 sólo con siete respuestas; en otro caso quedan vacíos. respondidas_pre y respondidas_post van de 0 a 7.

orden_formas: AB o BA. permiso_notas: si (sin permiso, no crear fila). t1…t4: independiente, con_ayuda o no_completada. tiempo_tareas_seg: duración observada, sin estimarla después. barreras, comentario_anonimo y ajuste_propuesto: texto breve sin datos personales. La fecha puede registrarse como AAAA-MM-DD. Abrir como CSV UTF-8 separado por comas.

## Revisar después de las sesiones
- Informar cuántas personas participaron y cuántas respondieron los reactivos previstos en ambos momentos. Indicar si fue la versión breve de dos o la ampliada de siete. Mostrar recuentos por concepto y tarea con denominadores explícitos; con 5–8 personas los porcentajes aislados pueden engañar.
- En versión breve, comparar aciertos pre/post de q2 y q6 por separado. Sólo en pares de siete respuestas completas, calcular post_total menos pre_total y presentar cambios anónimos. No convertir diferencias descriptivas en causalidad: práctica, ayuda y selección de participantes pueden influir.
- Separar problemas de comprensión, navegación, acceso y dispositivo. Registrar citas sólo si son anónimas y se autorizó tomar notas.
- Priorizar cualquier barrera que impida completar una tarea; revisar un concepto si se repite un error o si requiere ayuda. Estas reglas orientan mejoras, no certifican accesibilidad ni aprendizaje.
- Aplicar ajustes y repetir las tareas afectadas con nuevas personas cuando sea posible. Documentar versión, fecha y límites de la revisión.

## Entregable del piloto
Producir una página con versión probada, participantes agregados, tareas, recuentos pre/post, tres hallazgos, cambios realizados y límites. Mantener el registro original protegido según lo acordado. Hasta ejecutar el protocolo, el estado correcto es «piloto pendiente», sin cifras de éxito.
''',
'MANTENIMIENTO.md': '''# Mantenimiento · responsables y flujo
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
''',
'ENTREGA.md': '''# Lista de cierre · evidencia antes de enviar
Edición 21/10/2026 · Todas las casillas parten sin marcar. Son comprobaciones por ejecutar sobre la versión final, no una declaración de cumplimiento.

## Paquete y coherencia
- [ ] Identificar la versión final y retirar del paquete versiones obsoletas que puedan confundirse con ella.
- [ ] Confirmar seis capítulos, edades nacionales, escenarios A/B y las siete preguntas en código, guía, pitch y demostración.
- [ ] Abrir 100_VOCES_ABRIR.html sin conexión desde el ZIP extraído; comprobar navegación, exportación y fuentes locales.
- [ ] Abrir PDF, presentación, carrusel y video; comprobar legibilidad, audio/subtítulos y correspondencia con la aplicación final.
- [ ] Revisar teclado, foco, navegación móvil y controles; registrar navegadores y dispositivos realmente probados.
- [ ] Generar manifiesto SHA-256 y checksum del ZIP final; verificar ambos después de copiarlo.

## Accesos y envío
- [ ] Verificar el acceso requerido por los destinatarios desde una sesión ajena. El sitio sigue documentado como privado hasta un cambio explícito confirmado; un enlace existente no acredita acceso público.
- [ ] Confirmar alojamiento y permisos del video si se exige enlace externo. Un MP4 local no acredita que esté alojado.
- [ ] Revisar requisitos y fechas en la convocatoria oficial vigente; guardar evidencia de la consulta y usar su canal de envío.
- [ ] Adjuntar evidencia real del registro y cartas requeridas con firmas de sus responsables. Este kit no genera firmas ni acredita inscripción.
- [ ] Confirmar equipo, autoría, licencias y cualquier cesión exigida con quienes corresponda.
- [ ] Guardar acuse o confirmación real del envío. Este checklist no implica que se haya enviado nada.

## Evaluación y límites
- [ ] Aplicar el piloto si el calendario lo permite y reportar resultados reales. Si no se realiza, mantener «pendiente» y entregar el protocolo como tal.
- [ ] Declarar el alcance de revisión con lectores de pantalla, teléfonos físicos y navegadores. No convertir resultados automáticos en certificación de accesibilidad.
- [ ] Conservar la nota de selección ilustrativa de ocho entidades, el ámbito nacional de edades y la exclusión de no especificados.
- [ ] Identificar el proyecto como experiencia independiente, sin afirmar aval institucional.

## Evidencia por casilla
Al completar una comprobación, añadir fecha, responsable y ruta o enlace de la prueba. No marcar una casilla sólo porque existe un archivo con ese nombre. Fuentes de datos y copias locales: FUENTES.md.
''',
'seleccion_entidades.md': '''# Por qué aparecen ocho entidades
Edición 21/10/2026 · Nota de alcance para la aplicación y sus materiales.

## Lo que sí sabemos
La selección se heredó del prototipo recibido. Incluye Aguascalientes (58.7 %), Baja California (47.0 %), Chiapas (61.8 %), Ciudad de México (69.3 %), Sonora (49.6 %), Tlaxcala (70.1 %), Veracruz (58.4 %) y Yucatán (71.4 %), con tasas de participación de 2024 publicadas por el INE.

Los valores se cotejaron con el Manual CCPC, página 16, y el Estudio de participación 2024, página 25. No hay en el registro revisado una justificación documentada del proceso original para elegir esas ocho entidades. No atribuimos al equipo criterios que no estén acreditados.

## Cómo debe interpretarse
Es una selección ilustrativa, no probabilística. Permite practicar lectura y comparación de tasas. No representa por sí sola la diversidad de México ni constituye un ranking de las 32 entidades. No se debe calcular la tasa nacional como promedio simple de estas ocho tasas ni inferir causas de las diferencias.

Las cifras por edad pertenecen al ámbito nacional. No se combinan con estas entidades: el proyecto no contiene el cruce edad por entidad. La tasa de un territorio no describe la decisión o el motivo de una persona.

## Criterios propuestos para ampliar
1. Priorizar cobertura completa de las 32 entidades si se dispone de valores comparables del mismo año, tipo de elección y definición de tasa.
2. Usar una fuente primaria y cotejar etiqueta, valor, precisión y página por entidad; conservar evidencia y fecha de revisión.
3. Distinguir ausencia de datos de cero. No interpolar ni estimar tasas para completar una lista.
4. Si se requiere otra selección, definir y publicar antes sus criterios educativos, cobertura y límites. No llamarla representativa sin un diseño que lo sustente.
5. Mantener escala común, navegación por teclado y alternativa textual. Ordenar de forma explícita; no convertir diferencias en juicios sobre comunidades.
6. Para agregaciones futuras, usar conteos o ponderadores compatibles y explicar el cálculo. Una media simple de porcentajes con poblaciones distintas puede inducir a error.

Texto breve reutilizable: «Mostramos ocho entidades heredadas del prototipo como ejemplos. La selección no es probabilística ni representa a todo México. Consulta fuente, año y ámbito antes de interpretar las diferencias».
''',
'FUENTES.md': '''# Fuentes y uso del kit
Edición 21/10/2026 · Kit educativo de 100 VOCES · Experiencia independiente, sin aval del INE.

## Fuentes primarias utilizadas
- INE, Manual de Conteos Censales de Participación Ciudadana 2009–2024. Entidades: p. 16. Denominador y no especificados: pp. 17–18. Serie nacional: p. 21. Comparaciones por tipo: p. 30.
https://ine.mx/wp-content/uploads/2025/06/Manual-Conteos-Censales-2009-2024.pdf
- INE, Estudio de la participación ciudadana en el Proceso Electoral Federal 2023–2024. Serie nacional: p. 16, gráfica 2. Edades nacionales: p. 18, gráfica 5. Entidades: p. 25, gráfica 13.
https://repositoriodocumental.ine.mx/xmlui/bitstream/handle/123456789/186643/Deceyec-Estudio-Participaci%C3%B3n-ciudadada-2024.pdf

## Trazabilidad local
En el paquete principal: fuentes/INE_Manual_CCPC_2009_2024.pdf y fuentes/INE_Estudio_Participacion_2024.pdf contienen las copias consultadas. fuentes/VERIFICACION_CCPC.md y fuentes/EDADES_2024.md registran cotejos y límites. dist/data/ccpc_resumen.json conserva indicadores y metadatos. El ZIP del kit no duplica los PDF oficiales; usa los enlaces o el paquete principal.

## Archivos de este kit
- guia_facilitacion.md: actividad de 15 minutos y respuestas de siete conceptos.
- PILOTO.md: protocolo de 15 minutos, formas A/B y reglas de registro; no contiene resultados.
- registro_piloto.csv: plantilla vacía para notas anónimas autorizadas.
- seleccion_entidades.md: origen documentado, alcance y criterios futuros.
- MANTENIMIENTO.md y ENTREGA.md: flujo propuesto y lista de comprobación sin acreditaciones ficticias.
- 100_VOCES_Kit_Docente.pdf: edición legible e imprimible de estos documentos.
- generar_kit.py: fuente reproducible para documentos, PDF, ZIP e integridad.

## Interpretación de los datos
Las tasas están publicadas a un decimal; las diferencias usan esos valores redondeados. La ilustración de cien figuras redondea de nuevo sólo para representarlas. Los ejemplos A/B del piloto son ejercicios, salvo las tasas nacionales por edad indicadas. No se han calculado indicadores desde microdatos ni realizado un piloto para producir este kit.
'''
}

for name, body in documents.items():
    (ROOT / name).write_text(body, encoding='utf-8')

columns = ['id_anonimo','fecha','version','dispositivo_navegador','permiso_notas','orden_formas','forma_pre'] + [f'pre_q{i}' for i in range(1,8)] + ['respondidas_pre','pre_total','forma_post'] + [f'post_q{i}' for i in range(1,8)] + ['respondidas_post','post_total','t1','t2','t3','t4','tiempo_tareas_seg','barreras','comentario_anonimo','ajuste_propuesto']
csv_path = ROOT / 'registro_piloto.csv'
# Preserve any real observations if this generator is rerun after a pilot.
if not csv_path.exists():
    with csv_path.open('w', encoding='utf-8-sig', newline='') as f:
        csv.writer(f).writerow(columns)

pdfmetrics.registerFont(TTFont('Arial', 'C:/Windows/Fonts/arial.ttf'))
pdfmetrics.registerFont(TTFont('ArialBold', 'C:/Windows/Fonts/arialbd.ttf'))
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='KitTitle', fontName='ArialBold', fontSize=22, leading=26, textColor=HexColor('#113C48'), spaceAfter=16))
styles.add(ParagraphStyle(name='KitHeading', fontName='ArialBold', fontSize=11.5, leading=15, textColor=HexColor('#113C48'), spaceBefore=10, spaceAfter=5, keepWithNext=True))
styles.add(ParagraphStyle(name='KitBody', fontName='Arial', fontSize=10, leading=14, textColor=HexColor('#23333B'), spaceAfter=7, splitLongWords=True))
styles.add(ParagraphStyle(name='KitBullet', parent=styles['KitBody'], leftIndent=10, firstLineIndent=-8, spaceAfter=5))
styles.add(ParagraphStyle(name='KitLink', parent=styles['KitBody'], fontSize=8, leading=11, wordWrap='CJK'))

story=[]
order=['guia_facilitacion.md','PILOTO.md','seleccion_entidades.md','MANTENIMIENTO.md','ENTREGA.md','FUENTES.md']
for doc_index, name in enumerate(order):
    if doc_index:
        story.append(PageBreak())
    normalized = re.sub(r'(?m)^(#{1,2} [^\n]+)\n(?!\n)', r'\1\n\n', documents[name].strip())
    for block in re.split(r'\n\s*\n', normalized):
        if block.strip() == '---':
            story.append(PageBreak())
            continue
        if block.startswith('# '):
            story.append(Paragraph(escape(block[2:]),styles['KitTitle']))
        elif block.startswith('## '):
            story.append(Paragraph(escape(block[3:]),styles['KitHeading']))
        elif block.startswith('- ') or re.match(r'^\d+\. ',block):
            for line in block.splitlines():
                text=line.replace('- [ ] ','□ ',1).replace('- ','• ',1)
                story.append(Paragraph(escape(text),styles['KitBullet']))
        else:
            lines=block.splitlines()
            for line in lines:
                if line.startswith('https://'):
                    safe=escape(line)
                    story.append(Paragraph(f'<link href="{safe}" color="#0E6671">{safe}</link>',styles['KitLink']))
                else:
                    story.append(Paragraph(escape(line),styles['KitBody']))

def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(HexColor('#D5E1E3'))
    canvas.line(42,43,553,43)
    canvas.setFillColor(HexColor('#50666D'))
    canvas.setFont('Arial',8)
    canvas.drawString(42,29,'100 VOCES · Kit educativo · 21/10/2026')
    canvas.drawRightString(553,29,f'{doc.page}')
    canvas.restoreState()

pdf=ROOT/'100_VOCES_Kit_Docente.pdf'
SimpleDocTemplate(str(pdf),pagesize=(595.28,841.89),rightMargin=42,leftMargin=42,topMargin=38,bottomMargin=58,title='100 VOCES · Kit docente',author='100 VOCES',pageCompression=1).build(story,onFirstPage=footer,onLaterPages=footer)

files=list(documents)+['registro_piloto.csv','100_VOCES_Kit_Docente.pdf','generar_kit.py']
for name in files:
    artifact=ROOT/name
    if artifact.suffix!='.pdf':artifact.write_bytes(artifact.read_bytes().replace(b'\r\n',b'\n'))
manifest={name:hashlib.sha256((ROOT/name).read_bytes()).hexdigest() for name in files}
(ROOT/'MANIFIESTO_KIT_SHA256.json').write_text(json.dumps(manifest,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
with zipfile.ZipFile(ROOT/'100_VOCES_Kit_Docente.zip','w',zipfile.ZIP_DEFLATED) as z:
    for name in files+['MANIFIESTO_KIT_SHA256.json']:
        z.write(ROOT/name,arcname='100_VOCES_Kit_Docente/'+name)
(ROOT/'100_VOCES_Kit_Docente.zip.sha256').write_text(hashlib.sha256((ROOT/'100_VOCES_Kit_Docente.zip').read_bytes()).hexdigest()+'  100_VOCES_Kit_Docente.zip\n',encoding='ascii')
print('Generated kit, PDF, ZIP and checksums in', ROOT)
