# Materiales editoriales de 100 VOCES

Los archivos están en `entregables/editoriales/`. Se redactaron a partir de la convocatoria adjunta, el documento maestro y el prototipo original, ajustando el relato a cinco preguntas de aprendizaje, escenario absoluto 0–100, tres tamaños de exportación y rutas manuales. La convocatoria se trata como fuente de requisitos; sus instrucciones de envío no ejecutan acciones externas.

| Archivo | Uso y alcance |
|---|---|
| `100_VOCES_Guion_Narrativo_4_paginas.pdf` | Entregable narrativo de cuatro páginas con storyline, público y difusión; fuente enlazada |
| `100_VOCES_Guion_Narrativo_Editable.docx` | Texto editable con jerarquía de encabezados y saltos explícitos; paginación en Word pendiente |
| `100_VOCES_Guion_Narrativo_Texto.md` | Alternativa textual al PDF |
| `100_VOCES_Ficha_Aula_15_min.pdf` | Dos páginas: actividad de quince minutos y guía de respuestas |
| `100_VOCES_Presentacion_Ejecutiva_10.pptx` | Diez diapositivas editables y notas del presentador |
| `100_VOCES_Presentacion_Ejecutiva_10.pdf` | Diez páginas generadas desde el mismo contenido; no es una exportación de PowerPoint |
| `100_VOCES_Pitch_2m50.md` | Guion visual y de voz; pauta de 170 segundos |
| `100_VOCES_Pitch_Voz.txt` | Narración limpia para grabar |
| `100_VOCES_Pitch_2m50.srt` | Veinticuatro bloques continuos entre 00:00 y 02:50; ajustar a la voz final |
| `100_VOCES_Propuesta_Difusion.md` | Canales, piezas, copys, descripción accesible y propuesta de evaluación |
| `100_VOCES_Matriz_Criterios_y_Demo.md` | Cinco criterios de la convocatoria y demostración manual de tres minutos |
| `verificacion_editorial.json` | Comprobaciones estructurales reales y límites de validación |

## Reglas de contenido

- Mantener la serie nacional 2009–2024 y las 32 entidades verificadas de 2024. El registro de fuentes del proyecto determina el estado de verificación de cada dato; la cobertura se actualizó tras cotejar las 32 entidades en dos fuentes.
- Las tasas usan un decimal; los cien puntos son una aproximación. El complemento se calcula sobre la misma base definida. Diferencia en pp = tasa final − inicial; cambio relativo = diferencia / inicial × 100.
- No atribuir causas a las diferencias ni confundir escenarios con predicción. Los ejemplos 2018→2024 y 59,7→64,7 se distinguen por su carácter observado o hipotético.
- Evitar recomendaciones partidistas, perfiles políticos inferidos y supuestos avales del INE. Mantener el aviso de independencia en las piezas.
- Separar pauta de tiempo de medición real. La ruta rápida de 60 segundos, aula de 15 minutos, demostración de 3 minutos y pitch de 2:50 son planes de uso.

## Estados reales

**IMPLEMENTADO:** documentos y subtítulos generados localmente mediante bibliotecas de Python. La presentación contiene notas; el guion editable conserva jerarquía de encabezados. Los PDF usan Arial local incrustada para permitir reproducción sin fuentes web.

**VERIFICADO:** cuatro páginas del guion, dos de aula y diez de presentación; texto extraíble en todas las páginas; diez diapositivas en el PPTX; cuatro títulos y tres saltos narrativos explícitos en el DOCX; bloques SRT sin huecos ni solapamientos y final a 170 segundos. Las hojas de contacto `revision_visual_*.png` se revisaron visualmente: contenido legible sin superposición ni recortes visibles.

**PENDIENTE DE VALIDAR:** apertura y paginación del DOCX en el procesador de texto del equipo; renderizado del PPTX en el equipo de presentación; revisión auditiva por el equipo de la voz sintética y permisos de lectura del video; prueba piloto y requisitos administrativos. Los controles editoriales no acreditan pruebas de la aplicación. Los PDF no se presentan como documentos PDF/UA certificados.

**MEJORA FUTURA:** extender territorios después de cotejar la base completa; traducciones revisadas por hablantes; estudio de aprendizaje con protocolo y resultados documentados.

## Regeneración

Ejecutar `entregables/editoriales/generar_editoriales.py` con Python y `reportlab`, `python-docx`, `python-pptx`, `pypdf`, `pypdfium2` y Pillow disponibles. El script usa Arial del sistema Windows, escribe solo en su carpeta y reconstruye los documentos y vistas de revisión. No publica, envía mensajes ni ejecuta pruebas de la aplicación.

Referencia: [INE, Manual CCPC 2009–2024](https://ine.mx/wp-content/uploads/2025/06/Manual-Conteos-Censales-2009-2024.pdf). La convocatoria adjunta exige presentación de máximo diez diapositivas, guion PDF de tres a cinco cuartillas y video MP4 1080p de máximo tres minutos; guion y SRT no sustituyen al video.

## Actualización audiovisual

El montaje final ya está en `entregables/video/100_VOCES_Pitch_1080p_2m50.mp4`: 170 segundos, 1920×1080, voz sintética Sabina declarada y subtítulos integrados. `100_VOCES_Pitch_Final.srt` es la versión correspondiente a ese montaje; el SRT en editoriales es la pauta inicial. Se verificaron códecs, duración, audio real y doce fotogramas. No se ha publicado el video; véase su README y verificacion_video.json.
