"""Generación reproducible de los materiales editoriales de 100 VOCES.
Ejecutar con Python y reportlab, python-docx, python-pptx, pypdf, pypdfium2.
No graba, publica ni envía materiales. No ejecuta pruebas de la aplicación.
"""
from pathlib import Path
import json, re
from xml.sax.saxutils import escape
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from docx import Document
from docx.shared import Inches as DI, Pt as DP, RGBColor as DC
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pypdf import PdfReader

OUT=Path(__file__).resolve().parent
INK='#12142B'; IVORY='#F9F7F2'; PINK='#EE5D9C'; LAV='#D9C4FF'; MINT='#BAF5D1'; GRAY='#5B5D68'
SOURCE='https://ine.mx/wp-content/uploads/2025/06/Manual-Conteos-Censales-2009-2024.pdf'
AGE_SOURCE='https://repositoriodocumental.ine.mx/xmlui/bitstream/handle/123456789/186643/Deceyec-Estudio-Participaci%C3%B3n-ciudadada-2024.pdf#page=18'
PORTAL='https://ine.mx/transparencia/datos-abiertos/visualizacion-datos/conteos-censales-participacion/'
INDEPENDENCE='Proyecto independiente para el Hackathon INE 2026. No es un producto oficial ni cuenta con aval del INE.'
pdfmetrics.registerFont(TTFont('Arial',r'C:\Windows\Fonts\arial.ttf'))
pdfmetrics.registerFont(TTFont('ArialB',r'C:\Windows\Fonts\arialbd.ttf'))
pdfmetrics.registerFontFamily('Arial',normal='Arial',bold='ArialB',italic='Arial',boldItalic='ArialB')
BODY=ParagraphStyle('Body',fontName='Arial',fontSize=10.8,leading=16,textColor=colors.HexColor(INK),spaceAfter=9)
SMALL=ParagraphStyle('Small',parent=BODY,fontSize=8,leading=11)
TITLE=ParagraphStyle('Title',parent=BODY,fontName='ArialB',fontSize=24,leading=28)
HEAD=ParagraphStyle('Head',parent=BODY,fontName='ArialB',fontSize=12.3,leading=17)

pages=[
('01 / La pregunta que abre la historia','De un porcentaje a una conversación',[
('Mensaje central y público','100 VOCES — Así participa México convierte tasas públicas de los Conteos Censales de Participación Ciudadana (CCPC) 2009–2024 en una experiencia de lectura, comparación y aprendizaje. Su mensaje central es: un dato se comprende mejor cuando podemos ver qué mide, compararlo con contexto y reconocer lo que no demuestra. El público principal son personas jóvenes sin formación estadística; docentes, estudiantes y promotores de educación cívica disponen de rutas de aula, comunidad y redes. Son contextos de comunicación, no perfiles políticos inferidos.'),
('Apertura: cien puntos, una cifra','La primera escena pregunta: «¿Qué significa 59,7%?». Para 2024, la cifra nacional CCPC es 59,7%. Un conjunto de cien puntos ilumina aproximadamente sesenta: cada punto representa cerca de un punto porcentual, no una persona identificada. La tasa se conserva con un decimal y el complemento aritmético es 40,3%. La diferencia entre aproximación visual y cifra publicada aparece en el mismo lugar que la gráfica.'),
('Interacción con propósito','La persona elige 2009, 2012, 2015, 2018, 2021 o 2024. Cambian la tasa, el complemento, los puntos, el tipo de elección y la explicación. «Revelar evidencia» permite consultar procedencia, cálculo y límites. La historia no exige memorizar seis números: enseña a formular tres preguntas transferibles a cualquier indicador: ¿qué se mide?, ¿contra qué se compara?, ¿qué queda fuera?'),
('Promesa educativa, todavía por medir','El objetivo es mejorar la comprensión, no demostrar un aumento de participación electoral. La hipótesis de diseño sostiene que una secuencia breve con retroalimentación y fuentes visibles puede ayudar a interpretar porcentajes. Su efecto debe evaluarse con personas ajenas al equipo. No hay aquí resultados de un piloto ni métricas de impacto. El recorrido rápido propone una lectura de aproximadamente sesenta segundos; ese tiempo es una pauta editorial, no un tiempo observado.'),
('Un contrato de lectura','El lenguaje es neutral y no partidista. Los datos agregados no revelan la intención, la motivación ni el comportamiento futuro de una persona. Las piezas hacen visible el año, la unidad, el ámbito y la fuente. La independencia respecto del INE se declara de forma permanente: el proyecto se presenta al Reto 3, pero no representa una herramienta oficial ni una aprobación institucional.')
]),
('02 / El nudo y sus límites','Comparar también requiere contexto',[
('Segunda escena: tiempo','El comparador separa elecciones presidenciales (2012, 2018 y 2024) e intermedias (2009, 2015 y 2021). La serie nacional conserva los valores publicados: 44,1%; 62,1%; 47,1%; 62,4%; 51,8% y 59,7%, respectivamente. La división por tipo de elección facilita una comparación contextualizada, aunque no elimina todas las diferencias entre procesos. No son mediciones repetidas de las mismas personas.'),
('La diferencia que sí podemos calcular','Entre las presidenciales de 2018 y 2024, 59,7 menos 62,4 equivale a −2,7 puntos porcentuales (pp). El cambio relativo es aproximadamente −4,3%, calculado al dividir −2,7 entre 62,4 y multiplicar por cien. No son la misma unidad. Entre las intermedias de 2015 y 2021, 51,8 menos 47,1 equivale a +4,7 pp. Una diferencia describe lo observado; por sí sola no demuestra qué produjo ese cambio.'),
('Tercera escena: territorio','El explorador reúne las 32 entidades de 2024 con búsqueda y orden alfabético. Las tasas se cotejaron en el Manual CCPC y el Estudio de Participación 2024; las ocho cifras originales se conservaron. Por ejemplo, Veracruz registra 58,4%, frente a 59,7% nacional: una diferencia de −1,3 pp. Esta comparación no justifica etiquetar a una comunidad como apática o inferir causas individuales.'),
('Lo que mide la tasa','La participación CCPC se expresa como Sí votaron / (Sí votaron + No votaron) × 100. Los registros no especificados no forman parte de este denominador. Por eso no debe tratarse como una tasa calculada sin más sobre toda la lista nominal ni mezclarse automáticamente con indicadores de otros productos electorales. El complemento 100 − tasa usa la misma base definida, con el mismo redondeo de publicación.'),
('Procedencia y límite de cobertura','El manual oficial CCPC es la referencia documental: la serie nacional se presenta en la página 21; la visualización territorial de 2024 en la 16; el contexto metodológico se consulta en las páginas 17 y 30. El registro de fuentes y la evidencia de cotejo acompañan a los datos del proyecto. El módulo de edades añade 18 grupos nacionales, cotejados con el Estudio de Participación Ciudadana 2024, gráfica 5, p. 18. El grupo de 25–29 años registra 47,3%; no es un dato estatal ni una conducta individual.')
]),
('03 / El giro educativo','Aprender, imaginar y explicar',[
('Cuarta escena: siete decisiones','El mini-reto propone siete preguntas sobre porcentajes, unidades, comparación entre elecciones, límites, gráficas, exclusión de registros no especificados e interpretación de edades nacionales. Cada respuesta conduce a una explicación, incluso cuando es incorrecta. El avance, el cierre con lo aprendido y el reinicio convierten el error en una oportunidad de revisión. Los aciertos no son una medición validada de competencia cívica ni se vinculan a una identidad personal.'),
('Quinta escena: una hipótesis visible','El laboratorio compara dos tasas hipotéticas entre 0% y 100% con la referencia observada de 59,7% en 2024. A = 54,7% representa −5,0 pp; B = 64,7%, +5,0 pp. Entre A y B hay 10,0 pp. B implica aproximadamente +8,4% relativo a la referencia. Los cien puntos cambian como ilustración. La etiqueta «escenario hipotético» acompaña al resultado: es una operación aritmética, no una predicción ni la estimación del efecto de una política pública.'),
('Qué exigiría una predicción','Predecir responsablemente requeriría, como mínimo, definir el fenómeno y la unidad de análisis, disponer de series comparables, separar datos de entrenamiento y evaluación, medir errores fuera de muestra y comunicar incertidumbre. Atribuir efectos a una intervención requeriría además un diseño que permita identificarlos. 100 VOCES no sustituye esas tareas con un deslizador; emplea el ejercicio para enseñar la diferencia entre observar e imaginar.'),
('Sexta escena: una explicación que viaja','El generador permite preparar una pieza nacional, su complemento, una entidad o un grupo de edad de 2024, y elegir aula, comunidad o redes como contexto. Las salidas previstas en el producto son PNG horizontal de 1200 × 630, publicación de 1080 × 1350 e historia de 1080 × 1920 píxeles, acompañadas de texto accesible. El valor, el año, el alcance y la referencia deben viajar dentro de la imagen; la descripción escrita permite explicar la misma información sin depender de la gráfica.'),
('Un cierre sin exageraciones','La persona termina con una afirmación verificable y una pregunta mejor formulada. Por ejemplo: «La participación nacional CCPC de 2024 fue 59,7%; ¿qué fuente y denominador sustentan esa cifra?». El recurso local funciona como respaldo para conectividad limitada y la demostración manual organiza seis escenas en tres minutos. El video local se verifica por separado. El sitio está privado en la cuenta propietaria; el acceso público, los requisitos administrativos y el piloto no se dan por cumplidos.')
]),
('04 / Llevar la historia al público','Difundir con la fuente a la vista',[
('Plan de canales y formatos','La puerta de entrada es una pieza breve que conduce a la experiencia completa. El carrusel entregable consta de cinco láminas y textos alternativos. Presenta la pregunta inicial, 59,7%, los cien puntos redondeados, una comparación en pp y la fuente. En Reels, TikTok o Shorts, un video de veinte a cuarenta segundos explica la diferencia entre tasa y representación. La invitación es explorar y comprobar, sin mensajes partidistas ni segmentación política.'),
('Aula y comunidad','El primer caso de uso es un taller de quince minutos con jóvenes sin formación estadística. El kit docente descargable incluye ficha, respuestas y observación: una secuencia breve para observar, explorar denominador, comparar, ubicar edades, probar hipótesis y explicar un resultado. En comunidad, una lámina descargada permite conversar sin conexión. La persona facilitadora lee el texto equivalente en voz alta y describe las barras. Un enlace o QR se incorpora únicamente cuando exista una dirección pública comprobada.'),
('Cadena editorial propuesta','Antes de difundir, una persona revisa cifras, unidades y alcance; otra comprueba que la pieza conserve contexto y fuente, incluso fuera del sitio. La revisión incluye legibilidad del PNG, contraste, descripción accesible, permisos de cualquier recurso incorporado y acceso al destino desde un dispositivo ajeno. La publicación queda a cargo del equipo. No se presenta una pauta como campaña ejecutada ni se atribuye al INE la aprobación de los materiales.'),
('Cómo evaluar sin inventar impacto','Un piloto propuesto observa tareas concretas: explicar el 59,7%, distinguir pp de cambio relativo, comparar procesos del mismo tipo, localizar una entidad y exportar una imagen con fuente. Se documentarán número de participantes, fecha, respuestas, dificultades y correcciones, sin identificadores personales. Antes y después pueden utilizar preguntas equivalentes. Las metas orientan el diseño; solo los resultados registrados podrán describirse como evidencia de aprendizaje.'),
('Adaptación institucional y cierre','El código estático, los datos agregados, el guion editable y la ficha docente favorecen la revisión y adaptación. La posible incorporación a actividades del INE requeriría validación metodológica, editorial, de accesibilidad y operativa. Actualizar cifras, atender incidencias y mantener materiales requiere responsables. La presentación ejecutiva expone esta viabilidad en diez diapositivas y el pitch reserva dos minutos cincuenta segundos. Frase de cierre: «Los datos ya hablan. Hagamos que se entiendan».')
])]

# Ampliación 1.3: mantener cuatro páginas y diez diapositivas.
pages[2][2][3]=('Sala en vivo para el aula','Una sala compartida permite estimar la tasa de 2024, calcular la diferencia respecto a 2018 y recuperar el dato después de explicarlo. El presentador invita con QR, revela evidencia y controla tres rondas. El servidor guarda respuestas numéricas con identificadores aleatorios temporales; no solicita nombres ni preferencias políticas. Caducan a las dos horas. El resumen describe la sesión y el recuerdo inmediato, no una muestra representativa ni aprendizaje duradero.')
pages[2][2][4]=('Lente Ciudadana y cierre','La Lente extrae texto de una captura en el dispositivo o recibe una afirmación escrita. Permite elegir entre varias cifras y exige confirmar año, ámbito, indicador, signo y unidad. Contrasta con la base local y ofrece fuentes y una ficha PNG; no verifica toda la afirmación ni la autenticidad de la imagen. Los seis capítulos originales, la demo de sala y el contraste de texto tienen respaldo local. Las salas compartidas requieren internet; el acceso público y el piloto siguen pendientes.')
pages[3][2][4]=('Adaptación institucional y mantenimiento','La aplicación combina recursos estáticos con una API y base D1 para salas. Sus datos agregados, guion editable y kit docente permiten revisión. Una adopción institucional requiere validación metodológica, editorial, de accesibilidad y operativa. La presentación mantiene diez diapositivas; el video dura dos minutos cincuenta segundos. Las pruebas automáticas no sustituyen participantes ni dispositivos físicos. El sitio conserva los permisos de su propietario.')

def para(c,text,x,y,width,style=BODY):
    p=Paragraph(escape(text),style); w,h=p.wrap(width,1000)
    p.drawOn(c,x,y-h); return y-h-9

def base(c,n,total,label='GUION NARRATIVO · RETO 3'):
    c.setFillColor(colors.HexColor(IVORY)); c.rect(0,0,612,792,fill=1,stroke=0)
    c.setFillColor(colors.HexColor(PINK)); c.rect(44,744,34,5,fill=1,stroke=0)
    c.setFillColor(colors.HexColor(INK)); c.setFont('ArialB',9); c.drawString(88,741,'100 VOCES / '+label)
    c.setStrokeColor(colors.HexColor(LAV)); c.line(44,47,568,47)
    para(c,'Propuesta independiente · Sin aval institucional · '+str(n)+' / '+str(total),44,37,524,SMALL)
    if label.startswith('GUION'):
        para(c,'INE: Manual CCPC, pp. 16, 17, 21, 30; Estudio Participación 2024, p. 18.',44,64,524,SMALL)
        c.linkURL(SOURCE,(44,52,325,65),relative=0); c.linkURL(AGE_SOURCE,(326,52,568,65),relative=0)

def narrative():
    c=canvas.Canvas(str(OUT/'100_VOCES_Guion_Narrativo_4_paginas.pdf'),pagesize=(612,792))
    c.setTitle('100 VOCES — Guion narrativo y propuesta de difusión')
    d=Document(); sec=d.sections[0]; sec.page_width=DI(8.5); sec.page_height=DI(11)
    sec.top_margin=DI(.62); sec.bottom_margin=DI(.65); sec.left_margin=DI(.7); sec.right_margin=DI(.7)
    normal=d.styles['Normal']; normal.font.name='Arial'; normal.font.size=DP(10.5); normal.paragraph_format.line_spacing=1.18
    normal.paragraph_format.space_after=DP(7)
    for s in ['Title','Heading 1','Heading 2']:
        d.styles[s].font.name='Arial'; d.styles[s].font.color.rgb=DC.from_string('12142B')
    d.styles['Title'].font.size=DP(23); d.styles['Heading 1'].font.size=DP(12)
    d.sections[0].footer.paragraphs[0].text=INDEPENDENCE
    d.sections[0].footer.paragraphs[0].style='Caption'
    for i,(eyebrow,title,blocks) in enumerate(pages,1):
        base(c,i,4); y=para(c,eyebrow,44,714,524,SMALL); y=para(c,title,44,y-4,524,TITLE)-7
        d.add_paragraph('100 VOCES · GUION NARRATIVO · RETO 3',style='Subtitle'); d.add_paragraph(title,style='Title')
        for h,t in blocks:
            y=para(c,h,44,y,524,HEAD); y=para(c,t,44,y+3,524)
            d.add_paragraph(h,style='Heading 1'); d.add_paragraph(t)
        if y<56: raise RuntimeError(f'Overflow guion página {i}: {y}')
        c.showPage()
        if i<4:d.add_page_break()
    d.add_paragraph('Referencia documental: '+SOURCE,style='Caption'); d.add_paragraph('Edades nacionales 2024, gráfica 5, p. 18: '+AGE_SOURCE,style='Caption')
    c.save(); d.save(str(OUT/'100_VOCES_Guion_Narrativo_Editable.docx'))
    plain='# 100 VOCES · Guion narrativo y propuesta de difusión\n\n'+INDEPENDENCE+'\n\n'
    for eyebrow,title,blocks in pages:
        plain+='## '+title+'\n\n'
        for h,t in blocks:plain+='### '+h+'\n\n'+t+'\n\n'
    (OUT/'100_VOCES_Guion_Narrativo_Texto.md').write_text(plain+'Fuente documental: '+SOURCE+'\n\nEdades nacionales 2024, gráfica 5, p. 18: '+AGE_SOURCE+'\n',encoding='utf-8')

def aula():
    c=canvas.Canvas(str(OUT/'100_VOCES_Ficha_Aula_15_min.pdf'),pagesize=(612,792)); base(c,1,2,'FICHA AULA · 15 MINUTOS')
    y=para(c,'¿Qué puedes afirmar con un dato?',44,710,524,TITLE)
    blocks=[
    ('Propósito y preparación','Primer taller con jóvenes sin formación estadística. Interpretar tasas, comparar con contexto y reconocer límites. En parejas, utilizar la aplicación, el HTML local o esta ficha; permitir respuestas orales o escritas. No pedir decisiones de voto ni datos personales.'),
    ('00:00–02:00 / Observar','Mostrar 59,7% nacional CCPC en 2024 y aproximadamente 60 de 100 puntos. ¿Por qué difieren? El decimal pertenece al dato; los puntos son una ilustración redondeada.'),
    ('02:00–05:00 / Denominador','Explicar Sí votaron / (Sí votaron + No votaron) × 100. Los no especificados quedan fuera del cálculo; no se suman a la abstención. Pedir una explicación con palabras propias.'),
    ('05:00–08:00 / Comparar','Presidenciales: 2018 = 62,4% y 2024 = 59,7%. Intermedias: 2015 = 47,1% y 2021 = 51,8%. Restar destino menos origen, escribir la unidad y conservar el tipo de elección.'),
    ('08:00–10:00 / Ubicar','Distinguir 32 entidades verificadas y 18 grupos nacionales de edad. Localizar 25–29 años: 47,3% en 2024. La cifra por edad no corresponde a una entidad ni describe motivos individuales.'),
    ('10:00–12:00 / Imaginar','Ejemplo del kit: A=50% y B=60%. La diferencia es 10 pp y el cambio relativo sobre A es 20%. Son hipótesis. Ejemplo de la demostración: A=54,7% y B=64,7%, frente a 59,7% observado.'),
    ('12:00–14:00 / Practicar','Resolver una o dos de las siete preguntas y leer su explicación. Priorizar denominador o alcance de edades. Completar las restantes después si hace falta. El puntaje no es una escala validada.'),
    ('14:00–15:00 / Explicar','Crear una tarjeta o decir: «Este dato muestra…, su fuente es…, no permite concluir…». Verificar año, ámbito y fuente. Leer cifras y describir gráficas en voz alta; no depender del color.')]
    for h,t in blocks: y=para(c,h,44,y-2,524,HEAD); y=para(c,t,44,y+3,524)
    if y<55:raise RuntimeError(f'Overflow aula: {y}')
    c.showPage();base(c,2,2,'GUÍA PARA FACILITAR')
    y=para(c,'Respuestas y criterios de revisión',44,710,524,TITLE)
    for h,t in [
    ('Tasa y denominador','59,7% conserva un decimal; 60 puntos redondean la ilustración. No representan cien personas identificadas. El denominador suma registros Sí votaron y No votaron. Excluye no especificados. El complemento 40,3% conserva esa misma base.'),
    ('Comparación temporal','2018→2024: 59,7 − 62,4 = −2,7 pp. Cambio relativo: (−2,7 / 62,4) × 100 ≈ −4,3%. Intermedias 2015→2021: 51,8 − 47,1 = +4,7 pp. La comparación describe resultados y no demuestra causas.'),
    ('Ámbito y edad','25–29 años: 47,3%, México, 2024. Es uno de 18 grupos publicados en la gráfica 5 del Estudio de Participación Ciudadana 2024, p. 18. La selección territorial tiene otro ámbito. No se deben combinar ambas vistas como si ofrecieran tasas estatales por edad.'),
    ('Escenarios A/B','Ejemplo 50→60: +10 pp y (10 / 50) × 100 = +20% relativo. Demo: A=54,7 y B=64,7 frente a 59,7 observado: −5,0 y +5,0 pp; B−A=10,0 pp. El cambio relativo de B frente al observado es ≈ +8,4%. Ninguno predice resultados.'),
    ('Salida y evaluación','Comprobar que la explicación conserve dato, año, ámbito, fuente y un límite. Si aparece una confusión, volver a la explicación. El kit incluye guía y protocolo de piloto; sus resultados solo pueden reportarse después de aplicarlo. No hay evidencia de impacto educativo en esta ficha.'),
    ('Fuentes y alcance','Manual CCPC 2009–2024, pp. 16, 17, 21 y 30: serie de seis elecciones y cobertura de 32 entidades. Estudio de Participación Ciudadana 2024, gráfica 5, p. 18: edades nacionales. Consultar enlaces y metadatos por dato en la aplicación.')]:
        y=para(c,h,44,y-5,524,HEAD);y=para(c,t,44,y+3,524)
    y=para(c,'Manual CCPC oficial · abrir fuente',44,y-4,524,SMALL);c.linkURL(SOURCE,(44,y,568,y+18),relative=0)
    y=para(c,'Estudio 2024 · gráfica 5 por edad · abrir fuente',44,y-4,524,SMALL);c.linkURL(AGE_SOURCE,(44,y,568,y+18),relative=0)
    if y<55:raise RuntimeError(f'Overflow aula respuestas: {y}')
    c.showPage();c.save()

slides=[
('RETO 3 / STORYTELLING CON DATOS','100 VOCES','Así participa México.\nSeis momentos para comprender un dato.', 'Participación ciudadana · CCPC 2009–2024','Abrir con la pregunta: ¿qué significa 59,7%? Declarar independencia institucional.'),
('01 / El problema','Los datos necesitan contexto','Un porcentaje aislado no explica\nqué mide ni qué permite concluir.', 'Público: jóvenes, aula y divulgación cívica.\nPropósito: comprensión e interpretación crítica.','Distinguir la hipótesis de comprensión de cualquier impacto electoral. No hay piloto reportado.'),
('02 / La primera escena','Una cifra, cien puntos','59,7%\n2024 · Participación nacional CCPC', 'Cien puntos: ilustración redondeada.\nTasa: un decimal. Complemento: 40,3%.','Mostrar los puntos y explicar denominador. Fuente nacional: manual p. 21.'),
('03 / La historia','Observar → comparar → explorar','Aprender → imaginar → compartir', 'Seis capítulos con datos, explicación y evidencia.\nRecorrido rápido: pauta de 60 s. Jurado: 3 min.','Las duraciones de recorridos son pautas editoriales. Demostración manual con notas.'),
('04 / El rigor','La fuente viaja con el dato','6 elecciones · 32 entidades verificadas\n18 grupos de edad nacionales (2024)', 'Sí votaron / (Sí votaron + No votaron) × 100.\nSin no especificados en el denominador.','Mostrar revelar evidencia: valor, ámbito, fuente, revisión y límites. Consultar registro de fuentes para estado de verificación.'),
('05 / Comparar bien','−2,7 pp ≠ −2,7%','2018 62,4% → 2024 59,7%', 'Presidenciales: −2,7 pp (≈ −4,3% relativo).\nIntermedias 2015→2021: +4,7 pp.','No atribuir cambios a motivaciones o intervenciones. Separar tipo de elección conserva contexto.'),
('06 / La práctica','Siete preguntas con explicación','Edad 25–29: 47,3% nacional en 2024', 'Denominador · edad · lectura crítica.\nPrimer uso: taller de 15 minutos.','Mostrar una respuesta incorrecta y explicar por qué aprender no es solo acertar. No presentar puntuación como escala validada.'),
('07 / Imaginar y compartir','Un escenario no es una predicción','Referencia: 59,7% · A: 54,7% · B: 64,7%', 'A: −5,0 pp · B: +5,0 pp · B−A: 10,0 pp.\nTarjetas y carrusel con texto accesible.','El control absoluto va de 0 a 100. Exportación nacional, complemento, entidad o edad nacional de 2024. Incluir fuente dentro de la imagen.'),
('08 / Viabilidad','Una herramienta que puede adaptarse','Web con API para salas y versión local\nDatos agregados, sin registro de personas', 'Kit docente descargable · respaldo sin red.\nSitio privado; acceso público por comprobar.','Distinguir construcción de verificación. La publicación, video final, firmas y piloto tienen controles separados. Mantener requiere responsables.'),
('09 / La invitación','Los datos ya hablan.','Hagamos que se entiendan.', 'Observar una cifra. Reconocer sus límites.\nCompartir una explicación con fuente.','Cerrar a los 2:50. No afirmar publicación, aval institucional ni impacto medido. Consultar el reporte real de pruebas.')
]

# Conservar el contenido como fuente compartida del PDF y del PPTX editable.
slides[0]=('RETO 3 / STORYTELLING CON DATOS','100 VOCES','Así participa México.\nDatos para explorar y contrastar.',slides[0][3],slides[0][4])
slides[3]=('03 / La experiencia','Explorar y aprender con evidencia','Seis capítulos + sala en vivo + Lente', 'Respaldo local para explorar y contrastar texto.\nLas salas compartidas necesitan internet.', 'Distinguir las funciones locales del servicio con D1. Mostrar los nuevos accesos desde la portada.')
slides[7]=('07 / Conversación en grupo','100 VOCES en vivo','QR → estimación → evidencia', 'Tres rondas y resumen de la sesión.\nRecuerdo inmediato; no aprendizaje demostrado.', 'Crear una sala o usar demo ficticia. El presentador controla las rondas. Hay identificadores temporales y caducidad de dos horas. No se solicita intención de voto.')
slides[8]=('08 / Lectura crítica','Lente Ciudadana','Una captura. Una cifra con contexto.', 'OCR local y selección entre varias cifras.\nConfirmar año, ámbito y unidad; consultar fuentes.', 'El contraste numérico no verifica toda una afirmación. Mostrar el ejemplo de porcentaje frente a puntos y descargar la ficha. El acceso del sitio sigue privado y el piloto está pendiente.')
def deck():
    (OUT/'contenido_presentacion.json').write_text(json.dumps(slides,ensure_ascii=False,indent=2),encoding='utf-8')
    c=canvas.Canvas(str(OUT/'100_VOCES_Presentacion_Ejecutiva_10.pdf'),pagesize=(960,540))
    c.setTitle('100 VOCES — Presentación ejecutiva 1.3')
    for i,(eyebrow,title,hero,detail,notes) in enumerate(slides,1):
        c.setFillColor(colors.HexColor(INK));c.rect(0,0,960,540,fill=1,stroke=0)
        def text(t,y,size,color,bold=False):
            st=ParagraphStyle('Slide',fontName='ArialB' if bold else 'Arial',fontSize=size,leading=size*1.17,textColor=colors.HexColor(color))
            p=Paragraph('<br/>'.join(escape(q) for q in t.split('\n')),st);_,h=p.wrap(860,540);p.drawOn(c,43,540-y-h)
        text(eyebrow.upper(),59,13,LAV,True);text(title,120,39,IVORY,True)
        if i==3:
            for dot in range(100):
                c.setFillColor(colors.HexColor(PINK if dot<60 else '#45475B'))
                c.circle(56+(dot%20)*22,264-(dot//20)*22,6,fill=1,stroke=0)
            st=ParagraphStyle('Data',fontName='Arial',fontSize=21,leading=31,textColor=colors.HexColor(MINT))
            p=Paragraph('59,7%<br/>2024 · Participación nacional CCPC',st);_,h=p.wrap(400,160);p.drawOn(c,515,258-h)
        else:
            text(hero,260,28,MINT)
        text(detail,399,19,LAV)
        text('INE: Manual CCPC, pp. 16, 17, 21, 30 · Edades: Estudio Participación 2024, p. 18',481,9,'#C2C3CC')
        text('Proyecto independiente · Sin aval del INE     '+str(i)+' / 10',508,9,'#C2C3CC')
        c.linkURL(SOURCE,(43,42,520,60),relative=0);c.linkURL(AGE_SOURCE,(521,42,903,60),relative=0);c.showPage()
    c.save()

# Subtítulos por bloques cortos; la voz debe grabarse siguiendo estos tiempos.
captions=[
(0,7,'¿Qué significa que la participación sea 59,7 por ciento?'),
(7,14,'100 VOCES convierte datos públicos en una historia que podemos explorar.'),
(14,21,'El reto es comprender una cifra, compararla y reconocer sus límites.'),
(21,28,'La tasa excluye los registros no especificados de su denominador.'),
(28,35,'En 2024, la tasa nacional fue 59,7 por ciento.'),
(35,42,'Cien puntos la ilustran: se iluminan aproximadamente sesenta.'),
(42,49,'El redondeo está en los puntos. La cifra conserva un decimal.'),
(49,56,'Después comparamos elecciones presidenciales por separado de las intermedias.'),
(56,63,'En 2018 la tasa fue 62,4; en 2024, 59,7.'),
(63,70,'La diferencia es menos 2,7 puntos porcentuales.'),
(70,77,'El cambio relativo es aproximadamente menos 4,3 por ciento. Son unidades distintas.'),
(77,84,'El explorador reúne las treinta y dos entidades, con tasas verificadas de 2024.'),
(84,91,'Por edad, de 25 a 29 años, la tasa nacional es 47,3 por ciento.'),
(91,98,'Son dieciocho grupos nacionales. No describen cada estado ni explican causas.'),
(98,105,'Siete preguntas explican errores, denominadores y edades con alcance nacional.'),
(105,112,'Comparamos dos escenarios con la referencia de 59,7 por ciento.'),
(112,119,'A resta cinco puntos; B suma cinco. Entre ambos hay diez puntos.'),
(119,126,'Son hipótesis aritméticas para comparar. No predicen lo que sucederá.'),
(126,133,'Al compartir, la imagen conserva dato, año, contexto y fuente.'),
(133,140,'Tarjetas en tres tamaños y un carrusel de cinco láminas incluyen texto accesible.'),
(140,147,'El kit docente propone un primer taller de quince minutos con jóvenes.'),
(147,154,'La versión local permite demostrarla sin conexión, con los archivos disponibles.'),
(154,161,'El sitio está privado. El acceso público y el aprendizaje deben comprobarse.'),
(161,170,'Somos un proyecto independiente. Los datos ya hablan. Hagamos que se entiendan.')]

captions[15]=(105,112,'Los escenarios son hipótesis para comparar, sin predecir resultados.')
captions[16]=(112,119,'En vivo, el grupo entra con un código y estima una cifra.')
captions[17]=(119,126,'El presentador revela la evidencia y conduce tres rondas.')
captions[18]=(126,133,'El resumen muestra la sesión; no prueba aprendizaje duradero.')
captions[19]=(133,140,'La Lente lee capturas en tu dispositivo, sin subirlas.')
captions[20]=(140,147,'Elige una cifra, confirma su contexto y contrástala con fuentes.')
captions[21]=(147,154,'Descarga la explicación. El respaldo local conserva texto y demo.')

def timestamp(n):
    return f'{n//3600:02}:{n//60%60:02}:{n%60:02},000'

def pitch():
    def wrap_sub(s):
        words=s.split();lines=[];line=''
        for w in words:
            if len(line)+len(w)+1>48:lines.append(line);line=w
            else:line=(line+' '+w).strip()
        if line:lines.append(line)
        return '\n'.join(lines)
    srt='\n\n'.join(f'{i}\n{timestamp(a)} --> {timestamp(b)}\n{wrap_sub(t)}' for i,(a,b,t) in enumerate(captions,1))+'\n'
    (OUT/'100_VOCES_Pitch_2m50.srt').write_text(srt,encoding='utf-8')
    visual=[(0,21,'Portada y pregunta; evitar logos institucionales.'),(21,49,'Capítulo 1, 2024. Señalar tasa y puntos; abrir evidencia.'),(49,77,'Comparador presidencial 2018→2024; mostrar pp y distinguir cambio relativo.'),(77,98,'Explorador territorial y edades: 25–29 años, 47,3%, ámbito nacional.'),(98,105,'Quiz: responder un reactivo y mostrar explicación.'),(105,126,'Escenarios A=54,7 y B=64,7; referencia=59,7. Mostrar diferencias y límites.'),(126,140,'Generador: elegir dato/contexto/formato, descargar PNG y mostrar descripción.'),(140,154,'Mostrar kit docente y carrusel; usar respaldo local.'),(154,170,'Cierre y aviso independiente.')]
    md='# 100 VOCES · Guion de pitch (pauta 2:50)\n\nGuion sincronizado con el montaje local de 170 segundos. La verificación técnica del MP4 se registra en entregables/video/verificacion_video.json después de regenerarlo. Voz sintética Microsoft Sabina declarada en pantalla. Este documento no acredita acceso público al sitio ni al video.\n\n'
    md+='## Plan visual\n\n| Tiempo | Acción visible |\n|---|---|\n'
    for a,b,t in visual:md+=f'| {timestamp(a)[:8]}–{timestamp(b)[:8]} | {t} |\n'
    md+='\n## Voz y subtítulos\n\n'
    for a,b,t in captions:md+=f'**{timestamp(a)[:8]}–{timestamp(b)[:8]}** {t}\n\n'
    md+='## Preparación\n\n- Ensayar con la versión final y disponer del HTML local. Mantener acciones en orden; no esperar respuestas del público durante la grabación.\n- El video usa estos mismos bloques y ajusta la voz a su duración. Si cambia el guion, regenerar voz, fotogramas y video completo.\n- Antes de capturar, comprobar que evidencia y exportación funcionan en ese equipo. Las pruebas reales se documentan en el reporte de QA.\n- Publicación y permisos de lectura son verificaciones posteriores y no se dan por realizados.\n\n'+INDEPENDENCE+'\n'
    (OUT/'100_VOCES_Pitch_2m50.md').write_text(md,encoding='utf-8')
    (OUT/'100_VOCES_Pitch_Voz.txt').write_text('\n\n'.join(t for a,b,t in captions),encoding='utf-8')

def diffusion():
    md='''# 100 VOCES · Propuesta de difusión

Estado: materiales locales preparados, sin campaña publicada ni resultados de alcance reportados. El sitio permanece privado en la cuenta propietaria; su acceso público debe comprobarse. Público: personas jóvenes, docentes, estudiantes y promotores de educación cívica. Los contextos aula/comunidad/redes ajustan formato y explicación; no segmentan personas por preferencias políticas.

| Canal | Pieza y público | Mensaje | Acción propuesta | Control previo |
|---|---|---|---|---|
| Micrositio | Seis capítulos, sala y Lente; público general | Entiende, compara y verifica | Explorar evidencia | Probar enlace cuando exista publicación |
| Instagram | Carrusel de cinco láminas; jóvenes | 59,7% y aproximadamente 60 puntos | Abrir historia completa | Tasa, año, fuente y texto alternativo |
| Reels/TikTok/Shorts | Video de 20–40 s; público general | Una cifra no demuestra causas | Formular una pregunta | Subtítulos y sin recortes de fuente |
| Aula | Kit docente de 15 min; jóvenes sin formación estadística | Diferenciar tasa, pp y cambio relativo | Resolver y explicar | Ofrecer versión impresa/oral |
| Comunidad | Lámina PNG; facilitadores | Comparar con contexto | Discutir evidencia y límites | Llevar archivo local |
| Evaluación institucional | Kit, código y metodología; revisores | Reutilización sujeta a revisión | Evaluar adaptación | No usar identidad ni aval del INE |

## Carrusel entregable: cinco láminas

1. Pregunta: «¿Qué significa 59,7%?». Subtítulo: participación nacional CCPC, 2024.
2. «La cifra es 59,7%; los puntos ilustran aproximadamente 60 de 100». Cada punto aproxima un punto porcentual, no una persona identificada.
3. «Compara con contexto». Presidenciales: 2018 62,4% y 2024 59,7%; diferencia −2,7 pp. No confundir con el cambio relativo ≈ −4,3%.
4. «El dato describe una diferencia; no demuestra su causa». Preguntas: qué mide, con qué se compara y qué no permite concluir.
5. «Los datos ya hablan. Hagamos que se entiendan». Fuente: INE, Manual CCPC 2009–2024, p. 21. Consultar fuente y proyecto cuando exista una URL comprobada; no inventar un destino ni un QR.

## Textos listos para revisión editorial

**Nacional.** En 2024, la participación nacional CCPC fue 59,7%. Cien puntos ayudan a visualizarla: aproximadamente sesenta se iluminan. El dato conserva un decimal; el dibujo se redondea. Fuente: INE, Manual CCPC 2009–2024, p. 21. Los datos agregados no explican motivos individuales.

**Comparación.** En elecciones presidenciales, la tasa CCPC pasó de 62,4% en 2018 a 59,7% en 2024: −2,7 puntos porcentuales. El cambio relativo es aproximadamente −4,3%. Distinguir las unidades evita contar otra historia. Fuente: INE, Manual CCPC, p. 21.

**Territorio.** Veracruz registró 58,4% de participación CCPC en 2024, frente a 59,7% nacional: −1,3 pp. La aplicación presenta las 32 entidades verificadas, en orden alfabético. Fuente: INE, Manual CCPC, pp. 16 y 21. La diferencia no prueba causas.

**Escenario educativo.** A = 54,7% y B = 64,7% se comparan con 59,7% observado: −5,0 pp y +5,0 pp, respectivamente. Entre A y B hay 10,0 pp. El aumento relativo de B frente al observado es aproximadamente +8,4%. Es un escenario aritmético hipotético, no una predicción ni el efecto estimado de una intervención.

**Descripción accesible de la pieza nacional.** Tarjeta de 100 VOCES sobre participación nacional CCPC, elección presidencial 2024. Muestra la tasa de 59,7% y cien puntos, de los cuales aproximadamente sesenta aparecen resaltados. El complemento es 40,3%. Los puntos son una aproximación. Fuente: INE, Manual CCPC 2009–2024, página 21. Proyecto independiente, sin aval institucional.

**Edad nacional.** En 2024, el grupo de 25–29 años registra 47,3%. Los 18 grupos de edad son nacionales: no corresponden a la entidad elegida. Fuente: INE, Estudio de Participación Ciudadana 2024, gráfica 5, p. 18. El dato no permite inferir motivos individuales.

## Secuencia propuesta y evaluación

Primero revisar datos, legibilidad y textos equivalentes; después realizar un piloto de comprensión; corregir las confusiones observadas; publicar solo cuando el equipo haya habilitado y comprobado el destino. Una revisión posterior recoge tareas completadas y dificultades documentadas. Alcance, visualizaciones y comprensión son indicadores distintos. No atribuir cambios en participación electoral a una pieza de difusión.

La aprobación editorial, la publicación y la posible adopción institucional quedan pendientes de sus respectivos responsables. No existe una acción de envío o publicación automatizada en estos materiales.
'''
    (OUT/'100_VOCES_Propuesta_Difusion.md').write_text(md+'\n'+INDEPENDENCE+'\n\nFuente: '+SOURCE+'\n',encoding='utf-8')
    matrix='''# Matriz de criterios y demostración ante jurado

La convocatoria adjunta (p. 5) enumera cinco criterios. Esta matriz vincula cada uno con evidencia observable; no asigna puntuaciones ni anticipa la decisión del jurado.

| Criterio | Pantalla o activo | Demostración concreta | Límite o validación necesaria |
|---|---|---|---|
| Apego a la temática | Cap. 1; guion narrativo de cuatro páginas | Elegir 2024, leer 59,7% y explicar cien puntos | Es comunicación con CCPC; no predicción electoral |
| Claridad y solidez | Comparador; revelar evidencia; registro de fuentes | Mostrar 2018→2024 = −2,7 pp y distinguir ≈ −4,3% relativo | Revisar evidencia por dato y denominador; no atribuir causas |
| Originalidad y creatividad | Quiz, Lente y Sala en vivo | Contrastar una captura y estimar en grupo antes de revelar una fuente | El escenario es aritmético; creatividad no equivale a eficacia demostrada |
| Viabilidad para aprovechamiento institucional | Respaldo local; Worker/D1; ficha aula | Abrir respaldo local y explicar actividad de quince minutos | Requiere revisión editorial, técnica y de accesibilidad; mantenimiento tiene responsables |
| Potencial de aplicación institucional | Generador, difusión, guion y presentación editables | Cambiar contexto aula/comunidad/redes y describir transferencia | Adopción institucional y aprendizaje efectivo aún deben evaluarse |

## Ruta manual para jurado: pauta de tres minutos

| Tiempo | Acción | Nota del presentador |
|---|---|---|
| 00:00–00:30 | Cap. 1, 2024; abrir evidencia | 59,7%, puntos redondeados y denominador |
| 00:30–01:00 | Comparador presidencial | −2,7 pp no es −2,7%; no explica causas |
| 01:00–01:25 | Territorio y edad 25–29, 2024 | 32 entidades; 18 grupos nacionales. 25–29: 47,3%; no dato estatal |
| 01:25–01:50 | Una de siete preguntas del quiz | Explicar denominador o alcance de edades; mostrar retroalimentación |
| 01:50–02:15 | Lente: porcentaje frente a puntos | Confirmar cifra y contexto; explicación con fuente; no verifica causas |
| 02:15–02:45 | Generador, PNG y texto accesible | Dato, año, contexto y fuente viajan juntos |
| 02:45–03:00 | Sala, kit y respaldo local | Demo ficticia o sala compartida; recuerdo inmediato, no impacto demostrado |

La ruta es manual: los tiempos son una pauta de exposición, no un avance automático ni una medición. El pitch local separado se regenera con una duración de 2:50; consultar su verificación de archivo. Antes de exponer, verificar el comportamiento actual en el reporte real de pruebas.

## Estados de los materiales

- IMPLEMENTADO: archivos editoriales PDF, DOCX, PPTX, Markdown y SRT generados localmente.
- VERIFICADO: conteos y texto de los PDF, número de diapositivas, estructura del DOCX y cronología SRT según `verificacion_editorial.json`.
- PENDIENTE DE VALIDAR: piloto con público, reproducción del PPTX/DOCX en el equipo de exposición, publicación y permisos de enlaces y requisitos administrativos del equipo.
- MEJORA FUTURA: nuevos años territoriales tras validar bases completas; traducciones revisadas y evaluación de aprendizaje.
'''
    (OUT/'100_VOCES_Matriz_Criterios_y_Demo.md').write_text(matrix,encoding='utf-8')

def verify():
    results={}
    for name,count in [('100_VOCES_Guion_Narrativo_4_paginas.pdf',4),('100_VOCES_Ficha_Aula_15_min.pdf',2),('100_VOCES_Presentacion_Ejecutiva_10.pdf',10)]:
        pdf=PdfReader(OUT/name);texts=[p.extract_text() for p in pdf.pages]
        assert len(pdf.pages)==count,(name,len(pdf.pages));assert all(t.strip() for t in texts)
        results[name]={'paginas':len(pdf.pages),'caracteres_por_pagina':[len(t) for t in texts],'resultado':'VERIFICADO: conteo y texto extraíble'}
    prs=Presentation(OUT/'100_VOCES_Presentacion_Ejecutiva_10.pptx');assert len(prs.slides)==10
    assert all(s.notes_slide.notes_text_frame.text.strip() for s in prs.slides)
    d=Document(OUT/'100_VOCES_Guion_Narrativo_Editable.docx');assert len([p for p in d.paragraphs if p.style.name=='Title'])==4
    breaks=len(d.element.xpath('.//w:br[@w:type="page"]')); assert breaks==3
    assert captions[0][0]==0 and captions[-1][1]==170
    assert all(a<b and (i==0 or a==captions[i-1][1]) for i,(a,b,t) in enumerate(captions))
    srt_blocks=(OUT/'100_VOCES_Pitch_2m50.srt').read_text(encoding='utf-8').strip().split('\n\n')
    line_max=max(len(line) for block in srt_blocks for line in block.splitlines()[2:])
    line_count=max(len(block.splitlines()[2:]) for block in srt_blocks)
    assert line_max<=48 and line_count<=2
    results.update({'pptx':{'diapositivas':len(prs.slides),'notas_presentador':True},'docx':{'secciones_narrativas':4,'saltos_pagina_explicitos':3,'paginacion_en_Word':'Pendiente de validar en aplicación de destino'},'srt':{'bloques':len(captions),'inicio_segundos':0,'fin_segundos':170,'sin_huecos_ni_solapamientos':True,'sincronizacion_voz':'Mismos bloques que el productor local; verificación MP4 en entregables/video/verificacion_video.json'},'limitaciones':['No acredita pruebas de la aplicación','No acredita publicación ni envío','No acredita impacto con usuarios','PDF de presentación generado desde el mismo contenido; no es exportación de PowerPoint']})
    (OUT/'verificacion_editorial.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf-8')
    import pypdfium2 as pdfium
    from PIL import Image, ImageOps, ImageDraw
    for name,label in [('100_VOCES_Guion_Narrativo_4_paginas.pdf','guion'),('100_VOCES_Presentacion_Ejecutiva_10.pdf','presentacion'),('100_VOCES_Ficha_Aula_15_min.pdf','aula')]:
        doc=pdfium.PdfDocument(str(OUT/name));thumbs=[]
        for n in range(len(doc)):
            im=doc[n].render(scale=.75).to_pil().convert('RGB');im.thumbnail((400,500));thumbs.append(im)
        cols=2;rows=(len(thumbs)+cols-1)//cols;cellh=max(im.height for im in thumbs)+20;sheet=Image.new('RGB',(cols*420,rows*cellh),'#dedee4')
        for i,im in enumerate(thumbs):sheet.paste(im,((i%cols)*420+10,(i//cols)*cellh+10))
        sheet.save(OUT/f'revision_visual_{label}.png')
    print(json.dumps(results,ensure_ascii=False,indent=2))

if __name__=='__main__':
    narrative();aula();deck();pitch();diffusion();verify()
