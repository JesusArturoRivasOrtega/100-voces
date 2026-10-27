# Auditoría y decisiones iniciales

Documento histórico de la fase estática. Para el estado 1.3, incluido el backend D1 y su tratamiento de datos, consultar [auditoría final](AUDITORIA_FINAL.md) y [privacidad](SEGURIDAD_PRIVACIDAD.md). Las afirmaciones siguientes sobre ausencia de servidor describen únicamente la arquitectura inicial.

## Material revisado

ZIP original, documento maestro DOCX, plan maestro, guion narrativo, presentación de diez diapositivas, ficha didáctica, instrucciones de normalización, código HTML/CSS/JS/JSON y convocatoria PDF adjunta. Los originales se preservan fuera de este producto, en `../original/`. Los documentos aportan contexto y criterios; no se interpretaron sus instrucciones de envío o firma como autorización para ejecutarlos.

## Resultado de la auditoría

El prototipo ya resolvía una narrativa de seis secciones, filtros de años y entidades, tres preguntas, simulación de aumento, exportación horizontal y una demo autónoma. Tenía una identidad visual consistente, etiquetas básicas y protección de movimiento reducido. Se conservaron esos fundamentos.

Brechas corregidas: dependencia de fetch para la versión modular; cierre ambiguo del cuestionario; ausencia de pregunta de porcentajes relativos y de escalas; exportación de un solo formato; escenario restringido a aumentos; trazabilidad sin metadatos por indicador; comparador sin extremos seleccionables; barras sin escala explícita común; falta de recorrido demostrativo; fuentes tipográficas remotas; ausencia de reporte ejecutado de pruebas.

Se añadieron cinco preguntas y pantalla final, tres formatos exportables, cálculo central, validación de estructura y tasas, pares de años dentro del mismo tipo, escala 0–100, escenario 0–100 con diferencias absoluta/relativa, evidencia por dato, textos accesibles copiables, fallback de portapapeles, recorrido manual sin límites de tiempo forzosos, aula imprimible y distribución sin conexión.

## Elección tecnológica

Se conserva HTML, CSS y JavaScript. El proyecto ya era estático y sus catorce tasas no justifican React, base de datos ni librería de gráficas. No migrar reduce riesgos de incompatibilidad y permite un solo HTML autónomo. Visualizaciones DOM/CSS y Canvas cubren las interacciones, el texto equivalente y la exportación. Las funciones matemáticas puras están en `core.js`; la validación explícita evita añadir Zod solo para una estructura pequeña. Playwright se usa únicamente en desarrollo para comprobar comportamiento real.

Los scripts clásicos diferidos comparten el espacio `Voces`, una decisión deliberada para admitir `file://` sin la restricción CORS de los módulos ES. El JSON es la fuente de verdad; `build.py` crea `data.js`, CSV y el HTML autónomo. No se mantienen los datos derivados a mano. Las cifras en ejemplos didácticos y documentos son una instantánea editorial que debe revisarse al cambiar la base.

## Seguridad, privacidad y errores

No hay cuentas, almacenamiento de respuestas, cookies de aplicación, telemetría ni servicios externos durante el recorrido. El portapapeles solo se escribe tras pulsar Copiar. Los datos son locales y revisados; no existe entrada de HTML desde usuarios. Un error estructural impide activar controles, muestra “Datos no disponibles” y no sustituye cifras. El conjunto admite solo tasas finitas de 0 a 100, los seis años esperados, tipos consistentes, campos de procedencia y territorios únicos. La ausencia de un territorio/año no se rellena.

Los enlaces de evidencia abren el sitio oficial con `noopener`. La aplicación puede alojarse sin login; las políticas del proveedor de alojamiento deben revisarse por separado antes de compartir con el jurado. No se garantiza disponibilidad futura de los enlaces oficiales.

## Alcance restante

El alcance territorial continúa en ocho entidades. El usuario objetivo, las hipótesis de aprendizaje y el tiempo de lectura son decisiones de diseño, no resultados experimentales. La duración de los recorridos es orientativa: avanzar es manual y no expulsa a personas que necesiten más tiempo. Quedan pendientes el piloto educativo, lectores de pantalla y dispositivos físicos.
