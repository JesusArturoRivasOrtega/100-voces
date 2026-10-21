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
('Tercera escena: territorio','El explorador conserva una selección demostrativa de ocho entidades en 2024: Aguascalientes, Baja California, Chiapas, Ciudad de México, Sonora, Tlaxcala, Veracruz y Yucatán. No representa una muestra probabilística ni un ranking de las treinta y dos entidades. Por ejemplo, Veracruz registra 58,4%, frente a 59,7% nacional: una diferencia de −1,3 pp. Esta comparación no justifica etiquetar a una comunidad como apática o inferir causas individuales.'),
('Lo que mide la tasa','La participación CCPC se expresa como Sí votaron / (Sí votaron + No votaron) × 100. Los registros no especificados no forman parte de este denominador. Por eso no debe tratarse como una tasa calculada sin más sobre toda la lista nominal ni mezclarse automáticamente con indicadores de otros productos electorales. El complemento 100 − tasa usa la misma base definida, con el mismo redondeo de publicación.'),
('Procedencia y límite de cobertura','El manual oficial CCPC es la referencia documental: la serie nacional se presenta en la página 21; la visualización territorial de 2024 en la 16; el contexto metodológico se consulta en las páginas 17 y 30. El registro de fuentes y la evidencia de cotejo acompañan a los datos del proyecto. La ampliación territorial requiere verificar la base completa; la selección actual no se rellena con estimaciones ni cifras inventadas.')
]),
('03 / El giro educativo','Aprender, imaginar y explicar',[
('Cuarta escena: cinco decisiones','El mini-reto propone cinco preguntas sobre porcentajes, puntos porcentuales y cambio relativo, comparación entre elecciones, límites de los datos y lectura crítica de gráficas. Cada respuesta conduce a una explicación, incluso cuando es incorrecta. El avance, el cierre con lo aprendido y el reinicio convierten el error en una oportunidad de revisión. Los aciertos no son una medición validada de competencia cívica ni se vinculan a una identidad personal.'),
('Quinta escena: una hipótesis visible','El laboratorio mueve una tasa absoluta entre 0% y 100% y mantiene visible la referencia observada de 59,7% en 2024. Para un escenario de 64,7%, el cambio es +5,0 pp y aproximadamente +8,4% relativo a la referencia. Los cien puntos cambian como ilustración. La etiqueta «escenario hipotético» acompaña al resultado: es una operación aritmética, no una predicción ni la estimación del efecto de una política pública.'),
('Qué exigiría una predicción','Predecir responsablemente requeriría, como mínimo, definir el fenómeno y la unidad de análisis, disponer de series comparables, separar datos de entrenamiento y evaluación, medir errores fuera de muestra y comunicar incertidumbre. Atribuir efectos a una intervención requeriría además un diseño que permita identificarlos. 100 VOCES no sustituye esas tareas con un deslizador; emplea el ejercicio para enseñar la diferencia entre observar e imaginar.'),
('Sexta escena: una explicación que viaja','El generador permite preparar una pieza nacional, su complemento o una entidad de 2024, y elegir aula, comunidad o redes como contexto. Las salidas previstas en el producto son PNG horizontal de 1200 × 630, publicación de 1080 × 1350 e historia de 1080 × 1920 píxeles, acompañadas de texto accesible. El valor, el año, el alcance y la referencia deben viajar dentro de la imagen; la descripción escrita permite explicar la misma información sin depender de la gráfica.'),
('Un cierre sin exageraciones','La persona termina con una afirmación verificable y una pregunta mejor formulada. Por ejemplo: «La participación nacional CCPC de 2024 fue 59,7%; ¿qué fuente y denominador sustentan esa cifra?». El recurso local funciona como respaldo para conectividad limitada y la demostración manual organiza seis escenas en tres minutos. La grabación, la publicación y los resultados de pruebas se documentan por separado cuando existan; este guion no los da por realizados.')
]),
('04 / Llevar la historia al público','Difundir con la fuente a la vista',[
('Plan de canales y formatos','La puerta de entrada es una pieza breve que conduce a la experiencia completa. En Instagram, un carrusel de cinco láminas presenta la pregunta inicial, 59,7%, los cien puntos redondeados, una comparación en pp y la fuente. En Reels, TikTok o Shorts, un video de veinte a cuarenta segundos explica la diferencia entre tasa y representación. La invitación es explorar y comprobar, sin mensajes partidistas ni segmentación política.'),
('Aula y comunidad','La ficha de aula propone quince minutos: cuatro para observar el 59,7% y sus puntos; seis para comparar 2018–2024 y 2015–2021; cinco para discutir una afirmación válida y otra no sustentada. En comunidad, una lámina descargada permite conversar sin conexión. La persona facilitadora lee el texto equivalente en voz alta y describe las barras. Un enlace o QR se incorpora únicamente cuando exista una dirección pública comprobada.'),
('Cadena editorial propuesta','Antes de difundir, una persona revisa cifras, unidades y alcance; otra comprueba que la pieza conserve contexto y fuente, incluso fuera del sitio. La revisión incluye legibilidad del PNG, contraste, descripción accesible, permisos de cualquier recurso incorporado y acceso al destino desde un dispositivo ajeno. La publicación queda a cargo del equipo. No se presenta una pauta como campaña ejecutada ni se atribuye al INE la aprobación de los materiales.'),
('Cómo evaluar sin inventar impacto','Un piloto propuesto observa tareas concretas: explicar el 59,7%, distinguir pp de cambio relativo, comparar procesos del mismo tipo, localizar una entidad y exportar una imagen con fuente. Se documentarán número de participantes, fecha, respuestas, dificultades y correcciones, sin identificadores personales. Antes y después pueden utilizar preguntas equivalentes. Las metas orientan el diseño; solo los resultados registrados podrán describirse como evidencia de aprendizaje.'),
('Adaptación institucional y cierre','El código estático, los datos agregados, el guion editable y la ficha docente favorecen la revisión y adaptación. La posible incorporación a actividades del INE requeriría validación metodológica, editorial, de accesibilidad y operativa. Actualizar cifras, atender incidencias y mantener materiales requiere responsables. La presentación ejecutiva expone esta viabilidad en diez diapositivas y el pitch reserva dos minutos cincuenta segundos. Frase de cierre: «Los datos ya hablan. Hagamos que se entiendan».')
])]

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
        para(c,'Fuente: INE, Manual CCPC 2009–2024, pp. 16, 17, 21 y 30. Abrir documento oficial.',44,64,524,SMALL)
        c.linkURL(SOURCE,(44,52,568,65),relative=0)

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
    d.add_paragraph('Referencia documental: '+SOURCE,style='Caption')
    c.save(); d.save(str(OUT/'100_VOCES_Guion_Narrativo_Editable.docx'))
    plain='# 100 VOCES · Guion narrativo y propuesta de difusión\n\n'+INDEPENDENCE+'\n\n'
    for eyebrow,title,blocks in pages:
        plain+='## '+title+'\n\n'
        for h,t in blocks:plain+='### '+h+'\n\n'+t+'\n\n'
    (OUT/'100_VOCES_Guion_Narrativo_Texto.md').write_text(plain+'Fuente documental: '+SOURCE+'\n',encoding='utf-8')

def aula():
    c=canvas.Canvas(str(OUT/'100_VOCES_Ficha_Aula_15_min.pdf'),pagesize=(612,792)); base(c,1,2,'FICHA AULA · 15 MINUTOS')
    y=para(c,'¿Qué puedes afirmar con un dato?',44,710,524,TITLE)
    blocks=[('Propósito','Interpretar una tasa, distinguir puntos porcentuales y evitar explicaciones causales sin evidencia. Material: aplicación local o esta ficha; lápiz. Trabajo individual o en parejas. No se solicita información personal.'),('00:00–04:00 / Observar','Presenta 2024: 59,7% de participación CCPC y aproximadamente 60 de 100 puntos. Pregunta: ¿por qué ambas cifras son diferentes? Escribe una frase que distinga dato y representación. El complemento es 40,3% sobre la misma base de registros con voto/no voto definido.'),('04:00–10:00 / Comparar','Calcula 2024 menos 2018: 59,7 − 62,4. Calcula 2021 menos 2015: 51,8 − 47,1. Escribe la unidad e identifica el tipo de elección de cada par. Explica por qué decir «bajó 2,7%» resulta ambiguo. Reto opcional: divide −2,7 entre 62,4 y multiplica por cien.'),('10:00–15:00 / Conversar','Lee: «Veracruz registra 58,4% en 2024 y el nacional 59,7%». ¿Cuántos pp los separan? ¿Prueba este dato que alguien no quiso participar? Redacta una afirmación sustentada y una pregunta que requiera información adicional. Comparte voluntariamente la explicación, no una decisión de voto.'),('Salida / Evidencia de aprendizaje','Marca si lograste: 1) distinguir 59,7% de 60 puntos; 2) obtener ambas diferencias con unidad; 3) reconocer el límite causal. Si falta una idea, regresa a la explicación correspondiente. Los resultados de esta actividad solo se reportan si efectivamente se aplica.'),('Opciones de accesibilidad','Lee las cifras y las diferencias en voz alta. Presenta texto junto a cualquier gráfica y permite responder oralmente o por escrito. Sin internet, utiliza las tasas de esta ficha. No dependas del color para identificar la respuesta.')]
    for h,t in blocks: y=para(c,h,44,y-5,524,HEAD); y=para(c,t,44,y+3,524)
    if y<55:raise RuntimeError('Overflow aula')
    c.showPage();base(c,2,2,'GUÍA PARA FACILITAR')
    y=para(c,'Respuestas y criterios de revisión',44,710,524,TITLE)
    for h,t in [('Observar','59,7% es la tasa con un decimal. Los 60 puntos son una ilustración redondeada. Cada punto aproxima un punto porcentual y no identifica a una persona. El denominador incluye Sí votaron + No votaron y excluye no especificados.'),('Comparar','Presidenciales 2018→2024: −2,7 pp. Intermedias 2015→2021: +4,7 pp. El cambio relativo de 2018 a 2024 es (59,7 − 62,4) / 62,4 × 100 ≈ −4,3%. Separar tipos de elección aporta contexto, pero no prueba causas.'),('Conversar','Veracruz menos nacional: 58,4 − 59,7 = −1,3 pp. Afirmación válida: «En 2024 la tasa CCPC de Veracruz es 1,3 pp menor que la nacional». Afirmación no sustentada: «La diferencia se debe a desinterés». Haría falta evidencia adicional y un método apropiado para estudiar explicaciones.'),('Cotejo formativo','Un punto por cada aprendizaje demostrado: aproximación frente a tasa; ambas diferencias y su unidad; distinción entre descripción y causa. Total orientativo: 0 a 3. No es una escala validada. Utiliza el resultado para retroalimentación y registra las dificultades de manera anónima si se realiza un piloto.'),('Fuente y alcance','INE, Manual de los Conteos Censales de Participación Ciudadana 2009–2024, pp. 16, 17, 21 y 30. Serie nacional de seis elecciones y selección demostrativa de ocho entidades en la aplicación. No equivale a una muestra probabilística ni a un mapa nacional completo.')]:
        y=para(c,h,44,y-5,524,HEAD);y=para(c,t,44,y+3,524)
    y=para(c,SOURCE,44,y-8,524,SMALL);c.linkURL(SOURCE,(44,y,568,y+30),relative=0)
    c.showPage();c.save()

slides=[
('RETO 3 / STORYTELLING CON DATOS','100 VOCES','Así participa México.\nSeis momentos para comprender un dato.', 'Participación ciudadana · CCPC 2009–2024','Abrir con la pregunta: ¿qué significa 59,7%? Declarar independencia institucional.'),
('01 / El problema','Los datos necesitan contexto','Un porcentaje aislado no explica\nqué mide ni qué permite concluir.', 'Público: jóvenes, aula y divulgación cívica.\nPropósito: comprensión e interpretación crítica.','Distinguir la hipótesis de comprensión de cualquier impacto electoral. No hay piloto reportado.'),
('02 / La primera escena','Una cifra, cien puntos','59,7%\n2024 · Participación nacional CCPC', 'Cien puntos: ilustración redondeada.\nTasa: un decimal. Complemento: 40,3%.','Mostrar los puntos y explicar denominador. Fuente nacional: manual p. 21.'),
('03 / La historia','Observar → comparar → explorar','Aprender → imaginar → compartir', 'Seis capítulos con datos, explicación y evidencia.\nRecorrido rápido: pauta de 60 s. Jurado: 3 min.','Las duraciones de recorridos son pautas editoriales. Demostración manual con notas.'),
('04 / El rigor','La fuente viaja con el dato','6 elecciones nacionales\n8 entidades, selección demostrativa', 'Sí votaron / (Sí votaron + No votaron) × 100.\nSin no especificados en el denominador.','Mostrar revelar evidencia: valor, ámbito, fuente, revisión y límites. Consultar registro de fuentes para estado de verificación.'),
('05 / Comparar bien','−2,7 pp ≠ −2,7%','2018 62,4% → 2024 59,7%', 'Presidenciales: −2,7 pp (≈ −4,3% relativo).\nIntermedias 2015→2021: +4,7 pp.','No atribuir cambios a motivaciones o intervenciones. Separar tipo de elección conserva contexto.'),
('06 / La práctica','Cinco preguntas, cinco explicaciones','Retroalimentación + cierre + reinicio', 'Tasas · unidades · contexto · límites · gráficas.\nActividad de aula de 15 minutos.','Mostrar una respuesta incorrecta y explicar por qué aprender no es solo acertar. No presentar puntuación como escala validada.'),
('07 / Imaginar y compartir','Un escenario no es una predicción','59,7% observado → 64,7% hipotético', '+5,0 pp · ≈ +8,4% relativo.\nTarjetas PNG en tres tamaños + texto accesible.','El control absoluto va de 0 a 100. Exportación nacional, complemento o entidad 2024. Incluir fuente dentro de la imagen.'),
('08 / Viabilidad','Una herramienta que puede adaptarse','Web estática y versión local\nDatos agregados, sin registro de personas', 'Aula · comunidad · redes.\nAdopción institucional sujeta a revisión.','Distinguir construcción de verificación. La publicación, video final, firmas y piloto tienen controles separados. Mantener requiere responsables.'),
('09 / La invitación','Los datos ya hablan.','Hagamos que se entiendan.', 'Observar una cifra. Reconocer sus límites.\nCompartir una explicación con fuente.','Cerrar a los 2:50. No afirmar publicación, aval institucional ni impacto medido. Consultar el reporte real de pruebas.')
]

def deck():
    prs=Presentation();prs.slide_width=Inches(13.333333);prs.slide_height=Inches(7.5)
    c=canvas.Canvas(str(OUT/'100_VOCES_Presentacion_Ejecutiva_10.pdf'),pagesize=(960,540));c.setTitle('100 VOCES — Presentación ejecutiva')
    def box(slide,text,x,y,w,h,size=20,color=IVORY,bold=False):
        tf=slide.shapes.add_textbox(Inches(x/72),Inches(y/72),Inches(w/72),Inches(h/72)).text_frame;tf.word_wrap=True
        tf.margin_left=0;tf.margin_right=0;tf.margin_top=0;tf.margin_bottom=0
        for j,line in enumerate(text.split('\n')):
            p=tf.paragraphs[0] if j==0 else tf.add_paragraph();p.text=line;p.font.name='Arial';p.font.size=Pt(size);p.font.bold=bold;p.font.color.rgb=RGBColor.from_string(color[1:]);p.space_after=Pt(9)
        st=ParagraphStyle('Slide',fontName='ArialB' if bold else 'Arial',fontSize=size,leading=size*1.17,textColor=colors.HexColor(color))
        p=Paragraph('<br/>'.join(escape(q) for q in text.split('\n')),st);_,hh=p.wrap(w,h);p.drawOn(c,x,540-y-hh)
    for i,(eyebrow,title,hero,detail,notes) in enumerate(slides,1):
        sl=prs.slides.add_slide(prs.slide_layouts[6]);sl.background.fill.solid();sl.background.fill.fore_color.rgb=RGBColor.from_string(INK[1:])
        c.setFillColor(colors.HexColor(INK));c.rect(0,0,960,540,fill=1,stroke=0)
        sh=sl.shapes.add_shape(MSO_SHAPE.RECTANGLE,Inches(.6),Inches(.52),Inches(.5),Inches(.06));sh.fill.solid();sh.fill.fore_color.rgb=RGBColor.from_string(PINK[1:]);sh.line.fill.background()
        c.setFillColor(colors.HexColor(PINK));c.rect(43.2,498.2,36,4.32,fill=1,stroke=0)
        box(sl,eyebrow.upper(),43,59,865,35,13,LAV,True)
        box(sl,title,43,120,855,100,39,IVORY,True)
        if i==3:
            for n in range(100):
                x=50+(n%20)*22;y=270+(n//20)*22;col=PINK if n<60 else '#45465A'
                sh=sl.shapes.add_shape(MSO_SHAPE.OVAL,Inches(x/72),Inches(y/72),Inches(12/72),Inches(12/72));sh.fill.solid();sh.fill.fore_color.rgb=RGBColor.from_string(col[1:]);sh.line.fill.background();c.setFillColor(colors.HexColor(col));c.circle(x+6,540-y-6,6,fill=1,stroke=0)
            box(sl,hero,515,276,385,85,21,MINT)
        else:box(sl,hero,43,260,855,116,28,MINT)
        box(sl,detail,43,399,860,78,19,LAV)
        box(sl,'Fuente de datos: INE, Manual CCPC 2009–2024 · pp. 16, 17, 21 y 30',43,481,860,17,9,'#C2C3CC')
        c.linkURL(SOURCE,(43,42,903,60),relative=0)
        box(sl,'Proyecto independiente · Sin aval del INE',43,508,800,16,9,'#C2C3CC')
        box(sl,f'{i:02} / 10',857,508,70,16,9,'#C2C3CC')
        sl.notes_slide.notes_text_frame.text=notes+'\nFuente: '+SOURCE+' (pp. 16, 17, 21 y 30 según el dato).\n'+INDEPENDENCE
        c.showPage()
    prs.save(str(OUT/'100_VOCES_Presentacion_Ejecutiva_10.pptx'));c.save()

# Subtítulos por bloques cortos; la voz debe grabarse siguiendo estos tiempos.
captions=[
(0,7,'¿Qué significa que la participación sea 59,7 por ciento?'),
(7,14,'100 VOCES convierte datos públicos en una historia que podemos explorar.'),
(14,21,'El reto es comprender una cifra, compararla y reconocer sus límites.'),
(21,28,'Usamos los Conteos Censales de Participación Ciudadana del INE.'),
(28,35,'En 2024, la tasa nacional fue 59,7 por ciento.'),
(35,42,'Cien puntos la ilustran: se iluminan aproximadamente sesenta.'),
(42,49,'El redondeo está en los puntos. La cifra conserva un decimal.'),
(49,56,'Después comparamos elecciones presidenciales por separado de las intermedias.'),
(56,63,'En 2018 la tasa fue 62,4; en 2024, 59,7.'),
(63,70,'La diferencia es menos 2,7 puntos porcentuales.'),
(70,77,'El cambio relativo es aproximadamente menos 4,3 por ciento. Son unidades distintas.'),
(77,84,'El explorador conserva ocho entidades como selección demostrativa de 2024.'),
(84,91,'Veracruz registra 58,4 por ciento: 1,3 puntos menos que la tasa nacional.'),
(91,98,'La comparación describe una diferencia. No demuestra sus causas.'),
(98,105,'Cinco preguntas con retroalimentación convierten esa lectura crítica en práctica.'),
(105,112,'El laboratorio distingue el valor observado de un escenario hipotético.'),
(112,119,'Pasar de 59,7 a 64,7 suma cinco puntos porcentuales.'),
(119,126,'Es un cambio relativo de aproximadamente 8,4 por ciento. No es una predicción.'),
(126,133,'Al compartir, la imagen conserva dato, año, contexto y fuente.'),
(133,140,'Tres tamaños y una descripción accesible permiten reutilizar la explicación.'),
(140,147,'La experiencia incluye una ruta rápida, un modo jurado y una ficha de aula.'),
(147,154,'La versión local permite demostrarla sin conexión, con los archivos disponibles.'),
(154,161,'Su adopción requiere revisión institucional. El impacto educativo está por evaluar.'),
(161,170,'Somos un proyecto independiente. Los datos ya hablan. Hagamos que se entiendan.')]

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
    visual=[(0,21,'Portada y pregunta; evitar logos institucionales.'),(21,49,'Capítulo 1, 2024. Señalar tasa y puntos; abrir evidencia.'),(49,77,'Comparador presidencial 2018→2024; mostrar pp y distinguir cambio relativo.'),(77,98,'Explorador: elegir Veracruz. Leer selección demostrativa.'),(98,105,'Quiz: responder un reactivo y mostrar explicación.'),(105,126,'Escenario: establecer 64,7% y mantener visible la advertencia.'),(126,140,'Generador: elegir dato/contexto/formato, descargar PNG y mostrar descripción.'),(140,154,'Mostrar rutas rápida/jurado y ficha aula; usar respaldo local.'),(154,170,'Cierre y aviso independiente.')]
    md='# 100 VOCES · Guion de pitch (pauta 2:50)\n\nEstado: contenido de grabación preparado; no acredita un video final ni duración real de una voz grabada. El montaje debe terminar en 02:50; el máximo de convocatoria es 03:00. Exportar el video final a MP4 1080p y comprobar duración, audio, subtítulos y acceso antes de considerarlo listo.\n\n'
    md+='## Plan visual\n\n| Tiempo | Acción visible |\n|---|---|\n'
    for a,b,t in visual:md+=f'| {timestamp(a)[:8]}–{timestamp(b)[:8]} | {t} |\n'
    md+='\n## Voz y subtítulos\n\n'
    for a,b,t in captions:md+=f'**{timestamp(a)[:8]}–{timestamp(b)[:8]}** {t}\n\n'
    md+='## Preparación\n\n- Ensayar con la versión final y disponer del HTML local. Mantener acciones en orden; no esperar respuestas del público durante la grabación.\n- El SRT está temporizado como guía; ajustar sus cortes a la voz definitiva si cambia la dicción. No afirmar que está sincronizado con un video aún no grabado.\n- Antes de capturar, comprobar que evidencia y exportación funcionan en ese equipo. Las pruebas reales se documentan en el reporte de QA.\n- Publicación y permisos de lectura son verificaciones posteriores y no se dan por realizados.\n\n'+INDEPENDENCE+'\n'
    (OUT/'100_VOCES_Pitch_2m50.md').write_text(md,encoding='utf-8')
    (OUT/'100_VOCES_Pitch_Voz.txt').write_text('\n\n'.join(t for a,b,t in captions),encoding='utf-8')

def diffusion():
    md='''# 100 VOCES · Propuesta de difusión

Estado: propuesta editorial preparada. No hay campaña publicada ni resultados de alcance reportados. Público: personas jóvenes, docentes, estudiantes y promotores de educación cívica. Los contextos aula/comunidad/redes ajustan formato y explicación; no segmentan personas por preferencias políticas.

| Canal | Pieza y público | Mensaje | Acción propuesta | Control previo |
|---|---|---|---|---|
| Micrositio | Historia de seis capítulos; público general | Entiende, compara y verifica | Explorar evidencia | Probar enlace cuando exista publicación |
| Instagram | Carrusel de cinco láminas; jóvenes | 59,7% y aproximadamente 60 puntos | Abrir historia completa | Tasa, año, fuente y texto alternativo |
| Reels/TikTok/Shorts | Video de 20–40 s; público general | Una cifra no demuestra causas | Formular una pregunta | Subtítulos y sin recortes de fuente |
| Aula | Ficha de 15 min; docentes y estudiantes | Diferenciar tasa, pp y cambio relativo | Resolver y explicar | Ofrecer versión impresa/oral |
| Comunidad | Lámina PNG; facilitadores | Comparar con contexto | Discutir evidencia y límites | Llevar archivo local |
| Evaluación institucional | Kit, código y metodología; revisores | Reutilización sujeta a revisión | Evaluar adaptación | No usar identidad ni aval del INE |

## Carrusel propuesto: cinco láminas

1. Pregunta: «¿Qué significa 59,7%?». Subtítulo: participación nacional CCPC, 2024.
2. «La cifra es 59,7%; los puntos ilustran aproximadamente 60 de 100». Cada punto aproxima un punto porcentual, no una persona identificada.
3. «Compara con contexto». Presidenciales: 2018 62,4% y 2024 59,7%; diferencia −2,7 pp. No confundir con el cambio relativo ≈ −4,3%.
4. «El dato describe una diferencia; no demuestra su causa». Preguntas: qué mide, con qué se compara y qué no permite concluir.
5. «Los datos ya hablan. Hagamos que se entiendan». Fuente: INE, Manual CCPC 2009–2024, p. 21. Consultar fuente y proyecto cuando exista una URL comprobada; no inventar un destino ni un QR.

## Textos listos para revisión editorial

**Nacional.** En 2024, la participación nacional CCPC fue 59,7%. Cien puntos ayudan a visualizarla: aproximadamente sesenta se iluminan. El dato conserva un decimal; el dibujo se redondea. Fuente: INE, Manual CCPC 2009–2024, p. 21. Los datos agregados no explican motivos individuales.

**Comparación.** En elecciones presidenciales, la tasa CCPC pasó de 62,4% en 2018 a 59,7% en 2024: −2,7 puntos porcentuales. El cambio relativo es aproximadamente −4,3%. Distinguir las unidades evita contar otra historia. Fuente: INE, Manual CCPC, p. 21.

**Territorio.** Veracruz registró 58,4% de participación CCPC en 2024, frente a 59,7% nacional: −1,3 pp. La aplicación presenta una selección demostrativa de ocho entidades; no un ranking nacional completo. Fuente: INE, Manual CCPC, pp. 16 y 21. La diferencia no prueba causas.

**Escenario educativo.** ¿Cómo se vería una tasa de 64,7%? Respecto a 59,7%, serían +5,0 pp y aproximadamente +8,4% relativo. Es un escenario aritmético hipotético, no una predicción ni el efecto estimado de una intervención.

**Descripción accesible de la pieza nacional.** Tarjeta de 100 VOCES sobre participación nacional CCPC, elección presidencial 2024. Muestra la tasa de 59,7% y cien puntos, de los cuales aproximadamente sesenta aparecen resaltados. El complemento es 40,3%. Los puntos son una aproximación. Fuente: INE, Manual CCPC 2009–2024, página 21. Proyecto independiente, sin aval institucional.

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
| Originalidad y creatividad | Quiz; escenario; generador | Responder, recibir explicación, mover escenario y crear pieza con fuente | El escenario es aritmético; creatividad no equivale a eficacia demostrada |
| Viabilidad para aprovechamiento institucional | Versión local; código estático; ficha aula | Abrir respaldo local y explicar actividad de quince minutos | Requiere revisión editorial, técnica y de accesibilidad; mantenimiento tiene responsables |
| Potencial de aplicación institucional | Generador, difusión, guion y presentación editables | Cambiar contexto aula/comunidad/redes y describir transferencia | Adopción institucional y aprendizaje efectivo aún deben evaluarse |

## Ruta manual para jurado: pauta de tres minutos

| Tiempo | Acción | Nota del presentador |
|---|---|---|
| 00:00–00:30 | Cap. 1, 2024; abrir evidencia | 59,7%, puntos redondeados y denominador |
| 00:30–01:00 | Comparador presidencial | −2,7 pp no es −2,7%; no explica causas |
| 01:00–01:25 | Veracruz, 2024 | −1,3 pp frente al nacional; ocho entidades demostrativas |
| 01:25–01:50 | Una pregunta del quiz | Mostrar explicación; cierre y reinicio disponibles |
| 01:50–02:15 | Escenario 64,7% | +5,0 pp; ≈ +8,4% relativo; no predicción |
| 02:15–02:45 | Generador, PNG y texto accesible | Dato, año, contexto y fuente viajan juntos |
| 02:45–03:00 | Aula, respaldo local y cierre | Reutilización sujeta a revisión; no impacto inventado |

La ruta es manual: los tiempos son una pauta de exposición, no un avance automático ni una medición. El pitch de grabación separado dura 2:50 en su planificación. Antes de exponer, verificar el comportamiento actual en el reporte real de pruebas.

## Estados de los materiales

- IMPLEMENTADO: archivos editoriales PDF, DOCX, PPTX, Markdown y SRT generados localmente.
- VERIFICADO: conteos y texto de los PDF, número de diapositivas, estructura del DOCX y cronología SRT según `verificacion_editorial.json`.
- PENDIENTE DE VALIDAR: piloto con público, reproducción del PPTX/DOCX en el equipo de exposición, voz y sincronización final de video, publicación, permisos de enlaces y requisitos administrativos del equipo.
- MEJORA FUTURA: cobertura de 32 entidades tras validar base completa; traducciones revisadas y evaluación de aprendizaje.
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
    results.update({'pptx':{'diapositivas':len(prs.slides),'notas_presentador':True},'docx':{'secciones_narrativas':4,'saltos_pagina_explicitos':3,'paginacion_en_Word':'Pendiente de validar en aplicación de destino'},'srt':{'bloques':len(captions),'inicio_segundos':0,'fin_segundos':170,'sin_huecos_ni_solapamientos':True,'sincronizacion_voz':'Pendiente: requiere voz final'},'limitaciones':['No acredita pruebas de la aplicación','No acredita publicación ni envío','No acredita impacto con usuarios','PDF de presentación generado desde el mismo contenido; no es exportación de PowerPoint']})
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
