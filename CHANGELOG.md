# Cambios

### Revisión final · 31 de octubre de 2026

- Reejecución de las pruebas funcionales, accesibilidad, Firefox/WebKit e integración del Worker con D1 local; informes y manifiesto de entrega actualizados con sus resultados.
- GitHub Actions comprueba también tipos, Firefox/WebKit y salas en el Worker construido, además de las trece suites existentes.
- Documentación de despliegue corregida para reflejar las trece suites y el comando de inicialización local que conserva las salas.
- El empaquetador normaliza también TypeScript, módulos ESM, SQL y shell a LF antes de calcular las huellas; el manifiesto coincide con los archivos versionados en GitHub desde Windows.

### Refinamiento visual · 28 de octubre de 2026

- Portada con iluminación suave, relieve y detalle orbital decorativo; navegación con indicador de desplazamiento.
- Superficies, bordes, sombras, estados de botones, cabeceras y ayudas alineadas en móvil; controles y gráficos mantienen sus datos y escalas.
- Entradas escalonadas breves, transiciones de barras y confirmaciones visuales de cifras/resultados. Sin animaciones continuas ni contadores que muestren cifras intermedias.
- Efectos cancelados al activar movimiento reducido o esconder la página; pruebas de movimiento, precisión y composición en doce secciones y ocho anchos.

### Revisión de comprensión sobre 1.3.0

- Ayuda «?» en 16 capítulos y apartados: explica propósito, instrucciones y límites; admite mouse, teclado y toque sin depender de conexión.
- Corrección del enlace de fuentes en portada y de la etiqueta antigua de ocho entidades en el generador.
- Pruebas dedicadas de ayudas; trazabilidad del prompt maestro con pendientes técnicos opcionales y validaciones humanas explícitos.

## 1.3.0 · 27 de octubre de 2026

- Sala: recuperación tras salir, recargar o perder red; histogramas estables; cupos atómicos y límites por participante que permiten grupos en una misma red.
- Lente: selección de varias cifras, años sin heredar contexto anterior, ámbitos ausentes explícitos, OCR cancelable con validación del archivo, límites de tamaño/píxeles y avisos de legibilidad.
- Datos: cobertura de 32 entidades cotejada en dos documentos INE, conservando las ocho cifras originales; pruebas de las 32 tasas y ámbitos.
- Educación: diagnóstico de errores, tres casos opcionales, búsqueda de entidades, transferencia a tarjeta, conclusiones prudentes y registro de seis acciones en memoria.
- Comparador: origen, destino y contexto explícitos; recorrido del jurado ampliado; animaciones suaves con movimiento reducido.
- Seguridad: actualización de dependencias y revisión documentada en SEGURIDAD_PRIVACIDAD.
- Nuevas pruebas de concurrencia, resiliencia, educación y motores Firefox/WebKit; sin atribuirles validación humana.
- Guion, presentación, kit y pitch actualizados; índice de entrega y auditoría por funcionalidades.

## 1.2.0 · 25 de octubre de 2026

- 100 VOCES EN VIVO: salas por código/QR, tres rondas, controles del presentador, resumen y demostración local.
- API Vinext y almacenamiento D1 con caducidad, validación y controles de acceso por sala.
- Lente Ciudadana: lectura local de capturas, contraste numérico confirmado, explicación con fuentes y ficha PNG.
- Estados de carga, reconexión y caducidad; accesibilidad y diseño adaptable.
- Fuentes estáticas trasladadas a `public/`; `dist/` ahora contiene la compilación del Worker.
- Pruebas de navegadores independientes, OCR, seguridad de la API y regresión de los capítulos originales.
- Los materiales narrativos de 1.1 se conservan; el alcance nuevo está documentado en `docs/EN_VIVO_Y_LENTE.md`.

## 1.1.0 · 22 de octubre de 2026

- Menú de capítulos en móvil, indicador de ubicación y portada compacta.
- Seleccionar una barra territorial con teclado conserva el foco.
- Siete preguntas: se incorporan denominador y ámbito nacional de los grupos de edad.
- Recorrido breve y modo jurado actualizados; entidad, edad, cuestionario, escenarios y tarjeta parten de ejemplos consistentes.
- Sección de recursos con kit docente de diez páginas, editables y protocolo de piloto sin resultados ficticios.
- Carrusel de cinco PNG con fuentes y descripciones accesibles.
- Guion de cuatro páginas, presentación de diez diapositivas y pitch de 170 segundos actualizados.
- Dependencias de pruebas declaradas y fijadas; `npm test` inicia su propio servidor. Axe falla ante infracciones.
- Pruebas de regresión de foco, menú, demo, recursos y distribución autónoma; flujo de CI preparado para Chromium.
- Paquete y manifiesto sincronizados; el checksum externo se regenera automáticamente.

El piloto, pruebas manuales con lectores de pantalla/dispositivos físicos y requisitos administrativos siguen pendientes. Publicar código no acredita inscripción ni envío al concurso.

## Revisión de observaciones · 2026-10-28

Anclaje de puntos, comparación cronológica, explicación de escenarios, diagnóstico de salas, simulación variable, coherencia entre texto y contexto en Lente, materiales fijos identificados y glosario. Regresiones ampliadas y ajuste de espera de movimiento reducido en Chromium. Véase docs/REVISION_OBSERVACIONES.md.

## Auditoría crítica · 2026-10-29

Lente rechaza contextos no cubiertos, negaciones, límites e indicadores ajenos, y reconoce rangos de edad escritos con palabras. Comparador con cuenta y fuentes desplegables. Salas con guía por fase, caducidad, reintento y protección frente a resultados tardíos; ensayo limitado a 500 respuestas. Glosario integrado en navegación, carrusel reproducible y pruebas adversas con rechazo de suites inexistentes. Alcance y pendientes en docs/AUDITORIA_CRITICA.md.
