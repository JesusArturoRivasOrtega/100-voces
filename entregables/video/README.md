# 100 VOCES · Video actualizado

Archivo final: **100_VOCES_Pitch_1080p_2m50.mp4**.

Es un montaje de capturas reales del prototipo local y tarjetas descargadas desde su generador, acompañado de rótulos, subtítulos integrados y narración sintética local **Microsoft Sabina Desktop (es-MX)**. No es una grabación continua de pantalla. El aviso de síntesis y la independencia institucional permanecen visibles.

## Verificación del archivo final

- Resolución: **1920 × 1080**; duración: **170 segundos (2:50)**; 24 fps.
- Video H.264, formato de píxel yuv420p; audio AAC mono a 44.100 Hz.
- Tamaño: 9.201.686 bytes. FFmpeg detectó audio real con volumen medio de −21,2 dB.
- Subtítulos visibles integrados en imagen; archivo editable aparte `100_VOCES_Pitch_Final.srt`.
- Doce fotogramas extraídos del MP4 revisados para legibilidad y ausencia de cortes. Hoja de contacto: `revision_fotogramas.jpg`.
- Se explicita que la tasa utiliza registros con voto/no voto definido y excluye no especificados. No se presenta como tasa sobre toda la lista nominal.

`verificacion_video.json` y `verificacion_ffmpeg.log` conservan las comprobaciones. `capturas/registro_capturas.json` describe el origen de las imágenes; incluye una captura del HTML local con red desactivada. Las tarjetas fueron descargadas realmente desde los controles del sitio.

## Archivos a entregar

El MP4, el SRT, este README y el registro de verificación son suficientes para distribuir el video. Los fotogramas, WAV, capturas, listas de concatenación y scripts restantes son archivos de producción, no entregables obligatorios; pueden excluirse del ZIP público para reducir su tamaño.

La voz está ajustada a bloques de siete segundos (el último de nueve), sin recortar frases. `ajuste_voz.json` registra las duraciones originales y el factor de velocidad aplicado cuando hizo falta. Los subtítulos finales sustituyen un bloque del guion editorial para explicar expresamente el denominador.

El archivo se creó localmente; **no fue subido ni enviado a terceros** por este proceso. La URL de publicación y los permisos de lectura del video deberán comprobarse por separado. No demuestra impacto educativo ni representa aval del INE. Sustituir la voz sintética por narración humana es una mejora opcional.

## Reproducibilidad

`capturar.cjs` usa Playwright/Edge para capturas y descargas. `voz.ps1` usa System.Speech con Microsoft Sabina Desktop. `producir.py` compone fotogramas, ajusta voz, codifica con FFmpeg y verifica. Requiere las dependencias locales descritas en esos scripts. La síntesis SAPI puede requerir una sesión con acceso a las voces instaladas; aquí se ejecutó desde la sesión principal para resolver la restricción del proceso secundario.
