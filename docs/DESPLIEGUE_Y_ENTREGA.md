# Despliegue y entrega · v1.3.0

## Dos formas de ejecutar

**Estática:** servir `public/` por HTTP, o abrir `100_VOCES_ABRIR.html`. Incluye exploración, contraste de texto y sala de demostración. El OCR necesita HTTP(S) y sus archivos `public/vendor/ocr/`. Para descargas junto al archivo autónomo conservar `public/recursos/`.

**Con salas compartidas:** construir y desplegar el Worker directo de Cloudflare con D1 `DB`. `dist/` es salida generada, nunca la fuente editable. `wrangler.json` configura el Worker, los recursos estáticos y la base de datos. `worker/index.ts` dirige las solicitudes a la API y a los recursos.

## Construcción reproducible

1. Node 22.13+ y Python 3; `npm ci` instala versiones fijadas.
2. `npm run build` sincroniza contenido y construye Worker; `npx tsc --noEmit` comprueba tipos.
3. `npm test` inicia un servidor efímero y ejecuta trece suites. La API probada es el mismo controlador, con SQLite local.
4. Para Firefox/WebKit: `npx playwright install firefox webkit`, después `npm run test:engines`. Por defecto las otras suites usan Edge; CI establece `VOCES_BROWSER=chromium` e instala Chromium.
5. Para Worker local, ejecutar `npm run db:local` y después `npm start -- --port 8787`. La inicialización conserva las salas existentes. Con el servidor activo, `node tests/worker.cjs` verifica salud, participantes, recuperación y video. No aplicar migraciones remotas a ciegas; el esquema de 1.3 no cambia respecto de 1.2. En Windows detener Wrangler antes de reconstruir.
6. `python scripts/report.py` actualiza el reporte desde evidencia ejecutada; `python scripts/package.py` genera ZIP y checksum en la carpeta superior.

El empaquetador excluye secretos `.env*`/`.dev.vars*`, `.git`, dependencias, caches, bases locales y salidas intermedias. Conserva configuración no secreta necesaria para reconstruir. El MP4 se incluye una vez en `public/recursos/`. Verifica cada archivo contra el manifiesto dentro del ZIP.

GitHub Actions instala desde el lockfile, comprueba tipos, construye la aplicación, ejecuta las trece suites y Firefox/WebKit, y prueba el Worker construido con D1 local. El resultado de cada envío debe comprobarse en Actions; una ejecución anterior no acredita un commit posterior.

## Publicación y acceso

Worker desplegado: https://cien-voces-mexico.100-voces.workers.dev. Versión de Cloudflare: `202ad5ad-0c31-494f-b170-af9e1b59fb61`. La base D1 del proyecto está creada y su migración aplicada. La comprobación pública se registra por separado en `evidencia/publicacion.json`.

1. Ejecutar `npx wrangler login` y autorizar Cloudflare desde el navegador.
2. Crear una base con `npx wrangler d1 create cien-voces-mexico`. Si ya existe, consultar `npx wrangler d1 list` y reutilizarla.
3. Copiar el identificador devuelto a `d1_databases[0].database_id` en `wrangler.json`. El UUID de ceros es exclusivamente para desarrollo y el publicador lo rechaza.
4. Ejecutar `npm run build` y después `npm run deploy`. Se aplican las migraciones pendientes en D1 y se publica el Worker construido. No utilizar una base de otro proyecto.
5. Abrir la URL `workers.dev` que devuelve Cloudflare, comprobar `/api/live/health` y probar una sala desde dos sesiones independientes.

El despliegue usa `workers_dev: true` y no exige una cuenta de visitante. Los invitados entran con código; el token del presentador sigue siendo privado. Un dominio propio puede asociarse posteriormente en Cloudflare; no es necesario comprarlo para usar el sitio.

La nueva base comienza sin salas: las sesiones temporales del alojamiento anterior no se transfieren. El alojamiento anterior no se elimina automáticamente. Un despliegue aceptado no sustituye la comprobación de acceso HTTPS y de las salas. No guardar tokens de Cloudflare en Git; el identificador de base no es una credencial.

Referencias: [configuración de Wrangler](https://developers.cloudflare.com/workers/wrangler/configuration/) y [migraciones D1](https://developers.cloudflare.com/d1/reference/migrations/).

Para revertir, publicar el último commit verificado con sus dependencias y build; preservar D1. No se necesita revertir el esquema para 1.3. Validar recursos, OCR y sala después de revertir.

## Entrega externa

Extraer ZIP, verificar hashes y abrir HTML con recursos. Comprobar video desde una sesión ajena en alojamiento permitido por convocatoria. Completar `LEEME_ENTREGA.md` y `docs/PENDIENTES_HUMANOS.md`; paquete técnico no significa postulación enviada.
