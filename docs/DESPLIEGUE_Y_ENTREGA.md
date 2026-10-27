# Despliegue y entrega · v1.3.0

## Dos formas de ejecutar

**Estática:** servir `public/` por HTTP, o abrir `100_VOCES_ABRIR.html`. Incluye exploración, contraste de texto y sala de demostración. El OCR necesita HTTP(S) y sus archivos `public/vendor/ocr/`. Para descargas junto al archivo autónomo conservar `public/recursos/`.

**Con salas compartidas:** construir y desplegar el Worker Vinext/Cloudflare con D1 `DB`. `dist/` es salida generada, nunca la fuente editable. `.openai/hosting.json` conserva identidad y binding. No crear otro sitio para esta actualización.

## Construcción reproducible

1. Node 22.13+ y Python 3; `npm ci` instala versiones fijadas.
2. `npm run build` sincroniza contenido y construye Worker; `npx tsc --noEmit` comprueba tipos.
3. `npm test` inicia un servidor efímero y ejecuta diez suites. La API probada es el mismo controlador, con SQLite local.
4. Para Firefox/WebKit: `npx playwright install firefox webkit`, después `npm run test:engines`. Por defecto las otras suites usan Edge; CI establece `VOCES_BROWSER=chromium` e instala Chromium.
5. Para Worker local, aplicar `drizzle/0000_cheerful_shen.sql` a D1 local antes de `npm start`. No aplicar migraciones remotas a ciegas; el esquema de 1.3 no cambia respecto de 1.2. En Windows detener Wrangler antes de reconstruir.
6. `python scripts/report.py` actualiza el reporte desde evidencia ejecutada; `python scripts/package.py` genera ZIP y checksum en la carpeta superior.

El empaquetador excluye secretos `.env*`/`.dev.vars*`, `.git`, dependencias, caches, bases locales y salidas intermedias. Conserva configuración no secreta necesaria para reconstruir. El MP4 se incluye una vez en `public/recursos/`. Verifica cada archivo contra el manifiesto dentro del ZIP.

## Publicación y acceso

El sitio asociado es https://cien-voces-mexico.arthojust.chatgpt.site y conserva acceso privado del propietario. GitHub y el sitio tienen permisos independientes. La evidencia de despliegue anterior conserva fecha y commit; no demuestra que cambios locales posteriores estén publicados.

El flujo Sites prepara y empuja el commit exacto, empaqueta su build y publica esa versión conservando audiencia. En GitHub se envía el mismo código. Tras publicar, comprobar estado terminal y `/api/live/health` con acceso autorizado. No guardar tokens en archivos ni manifiestos.

Para revertir, publicar el último commit verificado con sus dependencias y build; preservar D1. No se necesita revertir el esquema para 1.3. Validar recursos, OCR y sala después de revertir.

## Entrega externa

Extraer ZIP, verificar hashes y abrir HTML con recursos. Comprobar video desde una sesión ajena en alojamiento permitido por convocatoria. Completar `LEEME_ENTREGA.md` y `docs/PENDIENTES_HUMANOS.md`; paquete técnico no significa postulación enviada.
