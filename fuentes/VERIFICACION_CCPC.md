# Verificación de fuentes CCPC — 100 VOCES

Consulta: 20 de octubre de 2026. Se contrastó el JSON del prototipo con documentos publicados por el INE. Esta revisión no equivale a recalcular las tasas desde microdatos.

## Resultado

Las seis tasas nacionales y las ocho tasas estatales del prototipo coinciden a un decimal con las gráficas del **Estudio de la participación ciudadana en el Proceso Electoral Federal 2023–2024** (INE, 2025).

| Año | Participación nacional | Tipo |
|---|---:|---|
| 2009 | 44.1% | Intermedia |
| 2012 | 62.1% | Presidencial |
| 2015 | 47.1% | Intermedia |
| 2018 | 62.4% | Presidencial |
| 2021 | 51.8% | Intermedia |
| 2024 | 59.7% | Presidencial |

Fuente: [Estudio, página 16, gráfica 2](https://repositoriodocumental.ine.mx/xmlui/bitstream/handle/123456789/186643/Deceyec-Estudio-Participaci%C3%B3n-ciudadada-2024.pdf#page=16).

| Entidad, 2024 | Participación |
|---|---:|
| Aguascalientes | 58.7% |
| Baja California | 47.0% |
| Chiapas | 61.8% |
| Ciudad de México | 69.3% |
| Sonora | 49.6% |
| Tlaxcala | 70.1% |
| Veracruz | 58.4% |
| Yucatán | 71.4% |

Fuente: [Estudio, página 25, gráfica 13](https://repositoriodocumental.ine.mx/xmlui/bitstream/handle/123456789/186643/Deceyec-Estudio-Participaci%C3%B3n-ciudadada-2024.pdf#page=25).

También se verificaron visualmente en el PDF descargado las fuentes exactas citadas por el JSON: [Manual, página 16](https://ine.mx/wp-content/uploads/2025/06/Manual-Conteos-Censales-2009-2024.pdf#page=16), tabla de entidades, y [página 21](https://ine.mx/wp-content/uploads/2025/06/Manual-Conteos-Censales-2009-2024.pdf#page=21), círculos de participación nacional. Las catorce cifras coinciden.

## Definición y comparación

El [Manual CCPC, página 17](https://ine.mx/wp-content/uploads/2025/06/Manual-Conteos-Censales-2009-2024.pdf#page=17) define la proporción como `Sí votaron / (Sí votaron + No votaron)`; para expresarla en porcentaje se multiplica por 100. Los no especificados quedan fuera de ese denominador. La página 18 distingue registros sin información clara por cuadernillos sin marcas, no disponibles, solicitados por autoridad jurisdiccional o páginas faltantes.

La página 30 del mismo manual separa comparaciones entre intermedias (2009, 2015, 2021) y presidenciales (2012, 2018, 2024). La [página oficial del conjunto](https://www.ine.mx/transparencia/datos-abiertos/visualizacion-datos/conteos-censales-participacion/) informa que la cartografía de la serie 2009–2024 tiene corte a mayo de 2023.

El [Informe final de integración, página 16, nota 6](https://repositoriodocumental.ine.mx/xmlui/bitstream/handle/123456789/183892/cceyec-2so-25-06-25-p4-vf.pdf#page=16) explica que conteos censales, estudios muestrales y cómputos distritales emplean metodologías de recolección distintas; sus porcentajes pueden diferir. También confirma las seis tasas nacionales.

## Alcance de esta validación

- Datos reales publicados por INE; las ocho entidades son una selección demostrativa, no una muestra estadística.
- Precisión verificada: un decimal. No se han obtenido más decimales ni se han recalculado cifras desde las bases oficiales.
- Las diferencias calculadas con estas tasas son diferencias entre valores publicados redondeados; se expresan en puntos porcentuales.
- La ilustración de cien personas requiere redondeo adicional: 59.7% se representa aproximadamente con 60 figuras; no es una observación de cien personas reales.
- La fórmula no permite interpretar los no especificados como abstención. Tampoco permite atribuir causas, preferencias partidistas o calidad cívica a las diferencias.
- No se validaron desgloses municipales, seccionales ni series estatales de otros años porque el prototipo no los contiene.
- Fuentes primarias consultadas en línea y dos PDF descargados. Se inspeccionaron visualmente las páginas 16, 17 y 21 del manual, y 16 y 25 del estudio; los PNG están en esta carpeta. No se descargaron ni recalcularon las bases ZIP.

## Integridad de las copias locales

SHA-256 de archivos descargados del INE:

```text
90BD0E45E28A4F231AD468E3C797EB262F5C1363E53FC089BD69D6D764E5C4CD  INE_Manual_CCPC_2009_2024.pdf
AB24A5B12F28760D70C01B8E0D52C9B9D38953689491C9D566D8B3D733C23828  INE_Estudio_Participacion_2024.pdf
```
