# 100 VOCES — Así participa México

Experiencia educativa independiente para comprender la participación ciudadana con datos publicados por el INE. **Versión 1.3.0** · Reto 3 · Sin aval institucional.

[Repositorio](https://github.com/JesusArturoRivasOrtega/100-voces) · [Índice de entrega](LEEME_ENTREGA.md) · [Pruebas ejecutadas](docs/PRUEBAS.md) · [Cambios](CHANGELOG.md)

## Abrir y explorar

Abre **100_VOCES_ABRIR.html** con doble clic. La aplicación incluye código, datos y tipografías: sus interacciones funcionan sin conexión. Para abrir el kit, carrusel y video, conserva también la carpeta `public/recursos/`. Consultar fuentes oficiales en línea requiere internet.

Para servir la versión modular desde la raíz:

```sh
python -m http.server 8765 --bind 127.0.0.1
```

Visita http://127.0.0.1:8765/public/ . No se necesita instalar paquetes para usar el sitio.

El sitio en https://cien-voces-mexico.arthojust.chatgpt.site conserva acceso privado del propietario. El repositorio y el sitio tienen permisos independientes. No se presenta ese enlace como acceso ya comprobado para el jurado.

## Qué incluye

**Nuevo en 1.3:** recuperación de salas, límites de concurrencia, selección de cifras ambiguas, cancelación OCR, búsqueda territorial, tarjetas con conclusión, recorrido basado en acciones reales y animaciones que respetan movimiento reducido.


**Salas y contraste de cifras:** [100 VOCES EN VIVO y Lente Ciudadana](docs/EN_VIVO_Y_LENTE.md). Salas compartidas con QR, tres rondas, controles del presentador y resumen; contraste numérico de texto o capturas, con fuentes y ficha PNG. La demo de sala y el contraste de texto funcionan sin conexión. Las salas compartidas requieren el servidor D1; el OCR requiere HTTP(S).

- Seis capítulos, seis elecciones nacionales, 32 entidades y 18 grupos de edad nacionales de 2024.
- Denominador interactivo: sí votaron, no votaron y exclusión de no especificados.
- Comparador por tipo electoral y escenarios A/B con tasas, puntos porcentuales y referencia observada.
- Siete preguntas con recomendaciones por error y tres casos opcionales; sus respuestas permanecen en memoria, sin enviarse al servidor.
- Tarjetas PNG horizontal, vertical e historia, con descripción accesible y fuente.
- Menú móvil, indicador de capítulo y recorridos breve/jurado con ejemplos reproducibles.
- Kit docente PDF y editable, protocolo de piloto y registro vacío.
- Carrusel de cinco láminas con textos alternativos, guion narrativo de cuatro páginas y presentación de diez diapositivas.
- Pitch MP4 1080p de 170 segundos: montaje de capturas actuales, voz sintética Sabina declarada, subtítulos y transcripción.

## Materiales

| Archivo | Uso |
|---|---|
| [Kit docente PDF](public/recursos/100_VOCES_Kit_Docente.pdf) | Actividad de 15 minutos, respuestas y piloto |
| [Kit editable ZIP](public/recursos/100_VOCES_Kit_Docente.zip) | Documentos y plantilla sin resultados |
| [Carrusel ZIP](public/recursos/100_VOCES_Carrusel.zip) | Cinco imágenes y descripciones |
| [Video MP4](public/recursos/100_VOCES_Pitch_1080p_2m50.mp4) | Pitch actualizado |
| [Presentación PDF](public/recursos/100_VOCES_Presentacion_Ejecutiva_10.pdf) | Diez diapositivas |
| [Guion PDF](entregables/editoriales/100_VOCES_Guion_Narrativo_4_paginas.pdf) | Historia y difusión |
| [Datos JSON](public/data/ccpc_resumen.json) | Indicadores y fuentes por registro |

## Desarrollo y pruebas

Node.js 22.13+ y Python 3 son suficientes para las pruebas y la construcción de la aplicación. Instalar las dependencias fijadas:

```sh
npm ci
python scripts/build.py
npm test
```

Por defecto las pruebas usan Microsoft Edge instalado. En otro entorno, ejecutar `npx playwright install chromium` y establecer `VOCES_BROWSER=chromium` antes de `npm test`. En PowerShell: `$env:VOCES_BROWSER='chromium'`; en bash: `VOCES_BROWSER=chromium npm test`. Para la comprobación adicional con Firefox y WebKit: `npx playwright install firefox webkit` y `npm run test:engines`. WebKit automatizado no equivale a Safari físico.

El flujo de GitHub Actions hace esa preparación en Linux; su resultado se comprueba en Actions después del envío.

`npm test` inicia su propio servidor en un puerto disponible y ejecuta diez suites. El alcance y los resultados actuales están en [PRUEBAS](docs/PRUEBAS.md), [auditoría final](docs/AUDITORIA_FINAL.md) y `evidencia/`. No es certificación WCAG ni prueba con usuarios.

El contenido mantenido está en `public/`; los módulos nuevos se editan en `lib/client/`. La API está en `lib/live-service.mjs`. `dist/` contiene exclusivamente el Worker generado. Los datos se editan en `public/data/ccpc_resumen.json`. `scripts/build.py` sincroniza bundles, CSV, materiales y HTML autónomo; `npm run build` también construye el servidor. `scripts/prepare.py` es histórico y no se debe ejecutar como build.

Para regenerar el carrusel, mantener el servidor local en 8765 y ejecutar `npm run resources`, después `npm run build`. Los generadores editoriales requieren las bibliotecas de `requirements-editoriales.txt`; el video necesita además FFmpeg, Windows y voz Sabina para síntesis.

## Empaque

```sh
python scripts/report.py
python scripts/package.py
```

El paquete, `100_VOCES_RETO3_ENTREGA.zip`, se crea en la carpeta superior junto a su SHA-256. Incluye manifiesto interno; verifica datos de edades, escenarios A/B y materiales. El nombre administrativo definitivo depende del equipo y su inscripción.

## Alcance y pendientes

Las tasas son transcripciones de publicaciones oficiales, no cálculos desde la base completa. El denominador excluye no especificados. Las 32 entidades cubren el territorio nacional para 2024 y fueron cotejadas en dos publicaciones; las ocho originales conservan sus tasas. Las edades son nacionales y no se cruzan con la selección de entidad. Los escenarios no son predicciones.

Pendientes reales: realizar el piloto, probar lectores de pantalla y teléfonos físicos, validar Safari en dispositivos reales, comprobar acceso para evaluadores y completar registro/cartas con evidencias del equipo. No se firmaron documentos ni se envió la postulación.

Manrope y DM Sans incluyen sus licencias SIL OFL. No se usa identidad institucional. Las salas utilizan identificadores temporales y hashes para control de abuso; consulta [privacidad](docs/SEGURIDAD_PRIVACIDAD.md). El equipo debe verificar autoría y permisos antes de cualquier cesión.
