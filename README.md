# 100 VOCES — Así participa México

Experiencia educativa independiente para el Reto 3 del Hackathon INE 2026. Seis capítulos funcionales, datos CCPC rastreables, cinco preguntas con retroalimentación y tarjetas PNG reutilizables. No es una herramienta oficial ni cuenta con aval del INE.

## Abrir ahora

Abre **100_VOCES_ABRIR.html** con doble clic. Incluye código, datos y fuentes tipográficas; funciona sin conexión ni servidor. Los enlaces a documentos del INE requieren conexión. Las descargas funcionan; si el navegador impide el portapapeles, queda disponible un campo de texto seleccionable.

Para ejecutar la versión modular desde esta carpeta:

```sh
python -m http.server 8765 --bind 127.0.0.1
```

Visita `http://127.0.0.1:8765/dist/`. No hay instalación de paquetes para usar la aplicación. `dist/` es directamente publicable en cualquier alojamiento estático con HTTPS. El código de la aplicación no necesita autenticación, API ni base de datos.

## Qué incluye

- **IMPLEMENTADO:** seis capítulos; comparador por tipo de elección; selección de ocho entidades; cuestionario de cinco preguntas con resultado y reinicio; escenario de 0 a 100 %; exportación horizontal, publicación vertical e historia; descripciones accesibles; evidencia contextual; recorridos rápido y jurado; aula imprimible; archivo autónomo.
- **VERIFICADO:** 14 tasas cotejadas con Manual CCPC y Estudio INE; pruebas reales en Edge/Chromium, cuatro anchos desde 320 px, archivos PNG descargados, portapapeles, modo sin conexión y rechazo de datos inválidos. Consulta `evidencia/pruebas.json` y `docs/PRUEBAS.md` para el alcance exacto.
- **PENDIENTE DE VALIDAR:** piloto con personas usuarias, auditoría completa con lectores de pantalla, prueba en teléfonos físicos y Safari/Firefox; revisión del equipo, registro y cartas firmadas; permisos de acceso a entregables antes del envío. Ninguno se presenta como ya realizado.
- **MEJORA FUTURA:** incorporar las 32 entidades después de validar las bases completas, mapa accesible y PWA. No se han inventado datos faltantes.

## Archivos

| Carpeta / archivo | Contenido |
|---|---|
| `dist/` | Aplicación y código fuente publicable |
| `dist/data/ccpc_resumen.json` | Fuente única de indicadores y metadatos |
| `dist/js/` | Datos, cálculo, visualización, narrativa, aprendizaje, escenarios, exportación y arranque |
| `100_VOCES_ABRIR.html` | Distribución autónoma generada |
| `docs/` | Auditoría, diseño, componentes, datos, metodología, pruebas y despliegue |
| `fuentes/` | Registro de verificación y documentos oficiales consultados |
| `entregables/editoriales/` | Guion PDF de 4 páginas, presentación de 10 diapositivas, aula, difusión y pitch |
| `entregables/redes/` | Tarjetas reales exportadas por la aplicación |
| `entregables/video/` | Video y notas de producción, cuando finalice su generación |
| `evidencia/` | Reporte automático, capturas y exportaciones revisadas |
| `tests/` | Pruebas funcionales reproducibles |
| `scripts/build.py` | Genera JS de datos, CSV y HTML autónomo desde fuentes locales |

## Mantener y verificar

Modifica módulos en `dist/js/`, estructura en `dist/index.html`, estilos en `dist/styles.css` e indicadores únicamente en el JSON. Después ejecuta:

```sh
python scripts/build.py
```

Para las pruebas de navegador se necesita Node.js, Playwright y Microsoft Edge. El script usa el paquete instalado en el entorno de trabajo; en otro equipo instala Playwright como dependencia de desarrollo (`npm install --no-save playwright`) o adapta su ruta. Con el servidor anterior activo:

```sh
node tests/browser.cjs
```

El reporte guarda resultados observados y límites. La ejecución revisa tanto HTTP como el HTML autónomo. `scripts/prepare.py` documenta la transformación inicial del prototipo y **no debe ejecutarse como build**: restauraría la base inicial anterior a los ajustes finales. `scripts/fonts.py` describe la descarga inicial; las fuentes y licencias ya están incluidas y no hace falta descargar nada.

## Fuentes y derechos

Las tasas son publicadas a un decimal. Denominador: registros con sí votaron o no votaron; no incluye los no especificados. No se recalcularon desde la base ZIP nacional. Las diferencias se derivan de valores publicados redondeados. Véase `docs/DATOS_Y_METODOLOGIA.md` y `fuentes/VERIFICACION_CCPC.md`.

Diseño y código continúan el prototipo proporcionado. Manrope y DM Sans se distribuyen con sus licencias SIL OFL en `dist/fonts/`. No se utilizan logotipos institucionales, imágenes de terceros ni datos personales. El equipo debe revisar su autoría y las condiciones de cesión de la convocatoria antes de firmar. Este paquete no incluye firmas ni prueba de inscripción y no se ha enviado al INE.
