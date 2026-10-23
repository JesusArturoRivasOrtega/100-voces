# Despliegue y entrega · v1.1.0

Publicar el contenido de dist/ como raíz estática HTTPS, incluyendo recursos/, data/, js/ y fonts/. La aplicación no requiere backend, API, variables de entorno ni autenticación propia.

El sitio asociado es https://cien-voces-mexico.arthojust.chatgpt.site . Mantiene acceso privado del propietario. El último resultado de publicación verificable se conserva en evidencia/publicacion.json; no confundir el permiso del repositorio con el del sitio.

Antes de enviar al jurado: probar página, MP4, fuentes y descargas desde una sesión ajena con el acceso que se vaya a conceder. No basta con que funcione para el propietario.

## Construcción y entrega

1. Ejecutar python scripts/build.py.
2. Ejecutar npm test. No necesita un servidor iniciado manualmente.
3. Ejecutar python scripts/report.py.
4. Ejecutar python scripts/package.py.
5. Extraer el ZIP y abrir 100_VOCES_ABRIR.html conservando dist/recursos. Verificar edades, A/B, siete preguntas y archivos descargables.
6. Consultar LEEME_ENTREGA.md y completar la documentación administrativa real.

El empaquetador excluye configuración de Sites, herramientas locales, node_modules y archivos intermedios; actualiza manifiesto y checksum externo. El MP4 final aparece una sola vez en dist/recursos. El kit incluye un registro vacío y el protocolo para un piloto futuro.

Los requisitos, plazos, cartas y alojamiento del video deben cotejarse con la convocatoria vigente. No hay envío automatizado ni firmas en este proyecto.
