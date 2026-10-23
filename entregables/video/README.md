# 100 VOCES · Video actualizado

Archivo final: **100_VOCES_Pitch_1080p_2m50.mp4**. Duración prevista y verificada por el productor: **170 segundos (2:50)**, resolución 1920 × 1080, 24 fps, H.264/yuv420p y audio AAC mono de 44.100 Hz.

Es un montaje de capturas actuales del prototipo local, tarjetas descargadas desde su generador y el carrusel final. Incluye rótulos, subtítulos integrados y narración sintética local **Microsoft Sabina Desktop (es-MX)**. El aviso de síntesis y la independencia institucional permanecen visibles. No es una grabación continua de pantalla.

El guion cubre el denominador con exclusión de no especificados, siete preguntas, 18 grupos nacionales de edad (ejemplo 25–29: 47,3%), los escenarios A=54,7% y B=64,7% frente a 59,7% observado, el kit docente de 15 minutos, las tarjetas y el carrusel de cinco láminas. El sitio está privado en la cuenta propietaria; el material no afirma acceso público ni resultados de un piloto.

## Comprobación

`verificacion_video.json` registra tamaño, duración, formato, volumen medio, huella SHA-256, huellas de producción y amplitud de audio por cada uno de los 24 segmentos. `verificacion_ffmpeg.log` conserva la decodificación completa. Doce fotogramas del MP4 se reúnen en `revision_fotogramas.jpg` para revisión visual. `capturas/registro_capturas.json` identifica imágenes y descargas, incluida la versión local con la red desactivada.

El pitch editorial y el productor usan exactamente los mismos textos y tiempos. `ajuste_voz.json` registra duración y velocidad por bloque: las frases se ajustan a su intervalo sin cortar su final. El SRT final usa un máximo de 48 caracteres por línea y acompaña a los subtítulos visibles.

## Reproducción del proceso

1. Ejecutar `../editoriales/generar_editoriales.py` si cambia el contenido.
2. Servir el proyecto en `http://127.0.0.1:8765/dist/` y ejecutar `capturar.cjs` con Node y Playwright/Edge instalados.
3. Ejecutar `producir.py all` con Python, Pillow y FFmpeg disponibles. `voz.ps1` usa System.Speech y la voz Sabina instalada.
4. Revisar la hoja de fotogramas y la verificación antes de distribuir el MP4.

El modo `encode` siempre codifica desde los fotogramas actuales. No reutiliza un montaje base antiguo. `montaje_sin_audio.mp4`, si existe, es solo un archivo auxiliar y no se incorpora al resultado final. Los WAV, fotogramas y scripts son archivos de producción; pueden excluirse del paquete de distribución, conservando MP4, SRT, README y verificaciones.

No se subió ni envió el video a terceros mediante estos scripts. Los permisos del enlace y su reproducción desde una sesión ajena deben comprobarse al publicarlo. La verificación de archivos no sustituye pruebas con personas ni implica aval institucional.
