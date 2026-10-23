# 100 VOCES — Así participa México

Experiencia educativa independiente para comprender la participación ciudadana con datos publicados por el INE. **Versión 1.1.0** · Reto 3 · Sin aval institucional.

[Repositorio](https://github.com/JesusArturoRivasOrtega/100-voces) · [Índice de entrega](LEEME_ENTREGA.md) · [Pruebas ejecutadas](docs/PRUEBAS.md) · [Cambios](CHANGELOG.md)

## Abrir y explorar

Abre **100_VOCES_ABRIR.html** con doble clic. La aplicación incluye código, datos y tipografías: sus interacciones funcionan sin conexión. Para abrir el kit, carrusel y video, conserva también la carpeta `dist/recursos/`. Consultar fuentes oficiales en línea requiere internet.

Para servir la versión modular desde la raíz:

```sh
python -m http.server 8765 --bind 127.0.0.1
```

Visita http://127.0.0.1:8765/dist/ . No se necesita instalar paquetes para usar el sitio.

El sitio en https://cien-voces-mexico.arthojust.chatgpt.site conserva acceso privado del propietario. El repositorio y el sitio tienen permisos independientes. No se presenta ese enlace como acceso ya comprobado para el jurado.

## Qué incluye

- Seis capítulos, seis elecciones nacionales, ocho entidades y 18 grupos de edad nacionales de 2024.
- Denominador interactivo: sí votaron, no votaron y exclusión de no especificados.
- Comparador por tipo electoral y escenarios A/B con tasas, puntos porcentuales y referencia observada.
- Siete preguntas con retroalimentación, resultado y reinicio; ninguna respuesta se almacena.
- Tarjetas PNG horizontal, vertical e historia, con descripción accesible y fuente.
- Menú móvil, indicador de capítulo y recorridos breve/jurado con ejemplos reproducibles.
- Kit docente PDF y editable, protocolo de piloto y registro vacío.
- Carrusel de cinco láminas con textos alternativos, guion narrativo de cuatro páginas y presentación de diez diapositivas.
- Pitch MP4 1080p de 170 segundos: montaje de capturas actuales, voz sintética Sabina declarada, subtítulos y transcripción.

## Materiales

| Archivo | Uso |
|---|---|
| [Kit docente PDF](dist/recursos/100_VOCES_Kit_Docente.pdf) | Actividad de 15 minutos, respuestas y piloto |
| [Kit editable ZIP](dist/recursos/100_VOCES_Kit_Docente.zip) | Documentos y plantilla sin resultados |
| [Carrusel ZIP](dist/recursos/100_VOCES_Carrusel.zip) | Cinco imágenes y descripciones |
| [Video MP4](dist/recursos/100_VOCES_Pitch_1080p_2m50.mp4) | Pitch actualizado |
| [Presentación PDF](dist/recursos/100_VOCES_Presentacion_Ejecutiva_10.pdf) | Diez diapositivas |
| [Guion PDF](entregables/editoriales/100_VOCES_Guion_Narrativo_4_paginas.pdf) | Historia y difusión |
| [Datos JSON](dist/data/ccpc_resumen.json) | Indicadores y fuentes por registro |

## Desarrollo y pruebas

Node.js 20+ y Python 3 son suficientes para las pruebas y la construcción de la aplicación. Instalar las dependencias fijadas:

```sh
npm ci
python scripts/build.py
npm test
```

Por defecto las pruebas usan Microsoft Edge instalado. En otro entorno, ejecutar `npx playwright install chromium` y establecer `VOCES_BROWSER=chromium` antes de `npm test`. En PowerShell: `$env:VOCES_BROWSER='chromium'`; en bash: `VOCES_BROWSER=chromium npm test`. El flujo de GitHub Actions hace esa preparación en Linux; su resultado se comprueba en Actions después del envío.

`npm test` inicia su propio servidor en un puerto disponible y ejecuta cuatro suites. Se verificaron localmente **30 grupos funcionales y seis estados de axe sin infracciones**. No es certificación WCAG ni prueba con usuarios.

El código mantenido está en `dist/js/`, `dist/index.html` y `dist/styles.css`; en este proyecto estático, `dist/` contiene las fuentes publicables. Los datos se editan únicamente en `dist/data/ccpc_resumen.json`. `scripts/build.py` sincroniza JS, CSV, materiales y HTML autónomo. `scripts/prepare.py` es un registro histórico y no se debe ejecutar como build.

Para regenerar el carrusel, mantener el servidor local en 8765 y ejecutar `npm run resources`, después `npm run build`. Los generadores editoriales requieren las bibliotecas de `requirements-editoriales.txt`; el video necesita además FFmpeg, Windows y voz Sabina para síntesis.

## Empaque

```sh
python scripts/report.py
python scripts/package.py
```

El paquete, `100_VOCES_RETO3_ENTREGA.zip`, se crea en la carpeta superior junto a su SHA-256. Incluye manifiesto interno; verifica datos de edades, escenarios A/B y materiales. El nombre administrativo definitivo depende del equipo y su inscripción.

## Alcance y pendientes

Las tasas son transcripciones de publicaciones oficiales, no cálculos desde la base completa. El denominador excluye no especificados. Las ocho entidades son ilustrativas y heredadas del prototipo, no una muestra probabilística. Las edades son nacionales y no se cruzan con la selección de entidad. Los escenarios no son predicciones.

Pendientes reales: realizar el piloto, probar lectores de pantalla y teléfonos físicos, revisar Safari/Firefox, comprobar acceso para evaluadores y completar registro/cartas con evidencias del equipo. No se firmaron documentos ni se envió la postulación.

Manrope y DM Sans incluyen sus licencias SIL OFL. No se usa identidad institucional ni se solicitan datos personales. El equipo debe verificar autoría y permisos antes de cualquier cesión.
