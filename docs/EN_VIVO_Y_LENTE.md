# 100 VOCES 1.3 — salas y contraste de cifras

## En vivo

El presentador crea una sala, comparte QR/código y controla tres rondas: estimación de la tasa nacional de 2024, diferencia 2018–2024 en puntos porcentuales y recuperación del dato de 2024 tras la explicación. Las respuestas se sincronizan cada tres segundos. El presentador puede revelar, avanzar, cerrar y descargar el resumen. Recargar la misma pestaña permite retomar la sesión.

Los participantes no crean cuentas de la aplicación. La audiencia de Sites se configura por separado: un sitio privado exige los permisos de acceso de la plataforma antes de entrar a una sala.

Cada sala caduca a las dos horas y admite hasta 500 respuestas por ronda. Los controles requieren un secreto aleatorio conservado solo en sessionStorage; el servidor guarda su hash. El enlace para invitados nunca contiene ese secreto. Los participantes usan identificadores aleatorios por sala y sus respuestas se actualizan, no se duplican, mientras la ronda esté abierta. No es un sistema de voto ni garantiza una persona por dispositivo.

Los registros vencidos no son accesibles y se purgan durante la actividad posterior de la API, como máximo una vez por minuto por instancia, y al crear una sala. No hay una tarea programada: sin actividad pueden permanecer físicamente almacenados. No se solicita nombre, correo, preferencia partidista ni conducta electoral individual. La protección contra abuso usa hashes de IP y ventanas temporales; no guarda la IP en las tablas de aplicación. La infraestructura de alojamiento puede mantener sus propios registros técnicos.

La demostración local funciona sin servidor y muestra claramente que sus respuestas son ficticias. Los resúmenes no son encuestas representativas ni prueban aprendizaje duradero. La última ronda mide recuerdo inmediato y el número de personas puede cambiar entre rondas.

## Lente Ciudadana

La entrada puede ser texto o imagen PNG/JPG/WebP de hasta 8 MB. Tesseract procesa la imagen en el navegador con un modelo de español servido desde el propio sitio. No sube la imagen ni el texto a un servicio de IA. La lectura OCR requiere HTTP(S); en el HTML abierto mediante file:// se conserva el pegado y contraste de texto.

La detección sugiere cifra, signo, unidad, año y ámbito. El usuario confirma esos campos antes de comparar. Los resultados son **coincide**, **revisa** o **no comprobable**. Solo se contrasta la cifra confirmada; nunca se presenta como verificación completa de la afirmación ni de la autenticidad de una imagen.

Las comparaciones cubren seis tasas nacionales, 32 entidades y 18 grupos nacionales de edad; no cruza edades con entidades. Los desgloses solo están disponibles para 2024. Los cambios nacionales admiten puntos porcentuales o variación relativa, con advertencia al comparar tipos electorales distintos. Las operaciones usan cifras publicadas a un decimal. Se puede copiar una explicación con fuentes o descargar una ficha PNG.

## Arquitectura y desarrollo

- `public/`: fuentes HTML/CSS/JS, datos, OCR y recursos del sitio. Sustituye al antiguo directorio de fuentes `dist/`.
- `lib/client/`: fuentes de las interfaces nuevas, empaquetadas por `scripts/build-features.mjs`.
- `lib/lens-domain.cjs`: contraste numérico determinista, sin un modelo generativo.
- `lib/live-service.mjs`: API con validación, control del presentador, límites y estados de ronda.
- `app/api/live/[[...path]]/route.ts`: entrada Vinext/Cloudflare para la API.
- `db/schema.ts` y `drizzle/`: esquema y migraciones D1.
- `.openai/hosting.json`: identidad conservada del sitio y binding D1 `DB`.
- `dist/`: salida generada del Worker; no editar ni versionar.

Instalar con `npm ci`. `npm run build` genera HTML autónomo, bundles y Worker. `npm test` verifica las interacciones originales y nuevas; la integración usa el mismo controlador de API con SQLite en memoria y navegadores aislados. Para desarrollo: `npm run dev`; para probar el Worker construido: `npm start`, después de aplicar las migraciones D1 locales.

El HTML autónomo conserva la exploración, el contraste numérico y la demo local. Las salas entre dispositivos necesitan el despliegue con D1. El guion, la presentación, el video y el kit de 1.3 incluyen Sala en vivo y Lente. La versión autónoma no promete sincronización entre dispositivos.
