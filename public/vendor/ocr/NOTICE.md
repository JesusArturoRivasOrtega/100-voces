# Reconocimiento local de texto

- Tesseract.js 6.0.1, licencia Apache-2.0: https://github.com/naptha/tesseract.js
- Tesseract.js-core, licencia Apache-2.0: https://github.com/naptha/tesseract.js-core
- Modelo de español distribuido en `@tesseract.js-data/spa@1.0.0`, variante `4.0.0_best_int`; paquete publicado con licencia MIT: https://github.com/naptha/tessdata
- El motor Tesseract y sus modelos se distribuyen bajo Apache-2.0: https://github.com/tesseract-ocr/tessdata

El modelo se obtuvo del archivo npm `spa-1.0.0.tgz`, SHA-1 de distribución `8cd3c04f10519916a6b85101001c4628a1a0a257`. Se sirve desde el mismo origen. No se transfieren imágenes a un servicio externo.

Los archivos de licencia del motor se copian desde las dependencias durante la construcción. El código de generación de QR usa `qrcode@1.5.4` (MIT).
