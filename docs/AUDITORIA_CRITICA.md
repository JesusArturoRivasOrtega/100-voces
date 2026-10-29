# Auditoría crítica de 100 VOCES

Revisión del 29 de octubre de 2026. Alcance: código de capítulos y navegación, cálculo y contratos de datos, generador PNG, cuestionario, Lente/OCR, cliente y API de salas, compilación, pruebas, dependencias y documentación de entrega. No equivale a una auditoría externa, un piloto ni una nueva extracción de todas las fuentes oficiales.

## Diagnóstico

La base es una experiencia educativa funcional, pero la calidad visual y la cantidad de secciones no demuestran comprensión. El riesgo principal es transmitir certeza excesiva: una coincidencia numérica puede referirse a otra población o a una afirmación negada. El segundo es operativo: una sala técnicamente disponible sigue siendo inutilizable por un invitado sin permiso de acceso. El tercero es de validación: pruebas automatizadas no sustituyen observar personas intentando usar la app.

No hay fundamento para prometer una mejora “exponencial” ni ausencia absoluta de fallos. La prioridad es reducir errores de interpretación y situaciones en que la persona no sabe cómo continuar.

## Hallazgos, acciones y límites

| Área | Crítica concreta | Acción / estado |
|---|---|---|
| Lente: población | Cambiar manualmente el ámbito podía eludir una detección de municipio o poblaciones mezcladas. “25 a 29 años” se interpretaba como nacional. | Se rechazan ámbitos no cubiertos; se reconocen rangos con “a”, “al” y guion. Jóvenes sin rango, sexo y ruralidad no se sustituyen por el total nacional. |
| Lente: afirmación | “No fue 59,7 %” o “más de 59,7 %” podía obtener coincidencia por contener el número correcto. | Se rechazan negaciones y límites detectados. No es un analizador semántico general; doble negación, ironía y expresiones no reconocidas requieren revisión humana. |
| Lente: indicador | Aprobación, votos nulos y otros indicadores podían compararse con participación. | Se rechazan indicadores explícitos ajenos a la base. Se exige una cifra con unidad cuando hay texto; una consulta sin texto se declara manual. |
| Lente: cambio | “Bajó a 59,7 %” no expresa una diferencia de 59,7 pp. | Se distingue la tasa destino de la magnitud del cambio. Se conservan signos y comparación cronológica. |
| Comparador | Una conclusión correcta sin mostrar la cuenta obliga a confiar en la app. | Nuevo desglose de resta, variación relativa y enlaces por año. Mismo año produce cero y una fuente. |
| Escenarios | A/B es una cuenta hipotética, no un modelo causal ni una propuesta de política. | Se conserva su explicación concreta y la referencia observada; no se añaden pronósticos inventados. |
| Salas: orientación | El código y los controles no explicaban suficientemente el papel de facilitador y participante. | Guía inicial, instrucciones por fase y hora local de caducidad. |
| Salas: concurrencia | Una respuesta tardía tras salir podía actualizar mensajes de una vista abandonada. | Se invalida la operación al salir y se ignoran sus resultados tardíos. Se prueba con una respuesta retenida y liberada después de salir. |
| Salas: recuperación | El aviso de servicio no ofrecía reintento explícito. | Botón para comprobar conexión, estados de disponibilidad y aviso sin conexión. |
| Ensayo | Añadir indefinidamente respuestas hacía crecer memoria y cálculos, y no reflejaba el cupo real. | Máximo de 500 por ronda, lotes de hasta seis y reinicio al avanzar. Sigue siendo simulación, no evidencia de aprendizaje. |
| Gráfico grupal | Intervalos contiguos podían parecer incluir el mismo extremo. | Etiquetas “a menos de”, con el último límite incluido; resumen accesible por intervalo. |
| Educación | El recorrido registra acciones; el quiz mide respuestas de esa sesión. | Se mantienen límites visibles. Pendiente medir comprensión sin ayuda y retención diferida con personas reales. |
| Accesibilidad y navegación | Había glosario al final, pero el indicador de capítulo seguía diciendo Fuentes. | Glosario integrado en menú e indicador. Nuevos estados incluidos en axe y revisión de anchos. Pendiente lector de pantalla y teléfonos físicos. |
| Exportaciones y materiales | El ZIP editorial no es dinámico y el video no sigue automáticamente cada ajuste de interfaz. | Se mantienen alcance fijo y acceso al generador; revisar visual del video antes de entrega, sin afirmar actualización automática. |
| Construcción | ZIP de carrusel cambiaba solo por las fechas de los archivos de una copia del repositorio. | Fechas y permisos deterministas al empaquetar el carrusel; no se alteran sus datos. |
| Pruebas | Pedir una suite con nombre incorrecto podía terminar con éxito sin ejecutar ninguna. | El ejecutor rechaza nombres desconocidos. Se añade suite adversa, además de las comprobaciones existentes. |
| Dependencias | Un informe antiguo no acredita el estado actual. | Nueva consulta npm audit registrada. Ausencia de avisos conocidos no equivale a seguridad certificada. |
| Rendimiento | Se servían 404.864 bytes de tipografías TTF. | WOFF2 reduce esos archivos a 142.432 bytes (64,8 % menos), verificando glifos y ejes variables idénticos. Se conservan originales y licencias; no implica que toda la página cargue 64,8 % más rápido. |
| Operación | Persistencia, acceso, limpieza sin tráfico y capacidad de alojamiento son problemas distintos a que el botón funcione. | Se conservan autenticación de Sites, cuotas y retención documentada. Pendientes: acceso deliberado del público objetivo, mantenimiento sin tráfico y carga real del alojamiento. |

## Criterios de aceptación del siguiente piloto

Con 5–8 personas que no hayan recibido una explicación previa, observar: identificar el denominador, explicar −2,7 pp frente a −4,3 %, distinguir un escenario de una predicción, crear/entrar en sala con permisos correctos, reconocer un texto no comprobable y descargar una tarjeta con fuente. Registrar errores, solicitudes de ayuda y tiempo por tarea; no registrar nombres ni inventar resultados. El protocolo y las plantillas existentes están en el kit docente.

## Prioridad después de esta revisión

1. Dar acceso al grupo destinatario y verificarlo desde una sesión ajena; el código de sala no resuelve permisos del sitio.
2. Ejecutar el piloto y corregir los problemas observados antes de aumentar funcionalidades.
3. Comprobar teléfonos físicos, teclado y lector de pantalla, además de las pruebas automatizadas.
4. Para eventos grandes, dimensionar lecturas/escrituras y acordar mantenimiento de registros caducados; las pruebas locales no acreditan capacidad de producción.
5. Incorporar nuevas fuentes o cruces solo después de cotejar denominadores y metodología; no generar datos para rellenar cobertura.

Los resultados ejecutados y fechados se consolidan en PRUEBAS.md. Los pendientes administrativos y del equipo permanecen en PENDIENTES_HUMANOS.md.
