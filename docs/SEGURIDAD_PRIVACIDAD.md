# Seguridad y privacidad · 1.3.0

## Datos tratados

| Componente | Tratamiento | Retención / límites |
|---|---|---|
| Exploración, cuestionario, recorrido | Datos públicos y respuestas en memoria del navegador | Se pierden al recargar; no se transmiten al servidor |
| Lente | Texto e imagen procesados en el dispositivo, OCR servido por el mismo sitio | Sin carga de imagen a IA; archivos de OCR pueden quedar en caché del navegador |
| Sala compartida | Código, rondas, respuesta numérica, hash de identificador aleatorio | Caducidad lógica de dos horas; borrado posterior durante actividad de API |
| Presentador | Secreto aleatorio en sessionStorage, hash en servidor | No se incluye en QR ni enlace de participante |
| Protección de abuso | Hash de IP y ventana temporal; hash del participante | No almacena IP en claro; plataforma puede tener logs propios |
| Publicación | Autorización de Sites separada de la aplicación | Sitio privado exige permisos de plataforma |

No se solicitan nombres, correos, afiliación o intención de voto. Esto no equivale a ausencia total de datos personales: identificadores temporales e información técnica requieren tratamiento responsable. No se garantiza anonimato frente al proveedor. No hay publicidad, analítica de terceros ni perfiles políticos.

## Controles implementados

El servidor valida método, ruta, origen en solicitudes con Origin, tipo JSON, estructura, cuerpo de 2048 bytes, rangos finitos, ronda y fase. SQL usa parámetros. Las respuestas nunca incluyen el secreto del presentador. Los controles requieren token y transición válida; acciones duplicadas no avanzan dos veces.

El cupo de 500 respuestas por ronda se comprueba dentro de la escritura; quien ya respondió puede corregir a capacidad completa. Hay límites por participante y por IP/sala para permitir aulas en la misma red. El cupo de salas también se condiciona dentro del INSERT. No garantiza una persona por dispositivo ni es un sistema electoral.

OCR admite PNG/JPEG/WebP, hasta 8 MB y 24 megapíxeles, comprueba firma y decodificación, permite cancelar y limita texto a 3000 caracteres. La interfaz inserta texto del usuario con textContent. Los resultados describen coincidencia numérica del contexto confirmado; no prueban autenticidad, causas ni veracidad completa.

## Retención y riesgo residual

Una sala vencida deja de ser accesible. La API elimina registros vencidos al crear salas y durante actividad posterior, con intervalo mínimo por instancia. **No existe purga programada sin tráfico.** Si no llegan solicitudes, registros vencidos pueden seguir físicamente en D1. La siguiente mejora operativa es una tarea de mantenimiento autorizada y supervisada.

Los límites son defensas básicas; no impiden ataques distribuidos, enumeración de códigos ni participantes que cambien de identificador. Una infraestructura institucional requiere dimensionamiento, política propia de logs y protección perimetral. La prueba local no es un pentest ni una prueba de carga de producción.

## Dependencias

Se actualizaron Next, React/RSC y herramientas compatibles de Vinext/Vite/Cloudflare ante avisos conocidos. Se fijan versiones y lockfile; no se utilizó `audit fix --force`. Los overrides de Undici, fflate y esbuild transitivo corrigen avisos que la resolución superior arrastraba. Resultado final en `evidencia/auditoria-dependencias.json`; volver a ejecutar `npm audit` durante mantenimiento porque los avisos cambian.

También se revisan dependencias de desarrollo: algunas intervienen en el bundle del servidor. Cero avisos en una consulta no certifica seguridad futura. Credenciales, tokens y bases locales se excluyen de Git y del paquete.
