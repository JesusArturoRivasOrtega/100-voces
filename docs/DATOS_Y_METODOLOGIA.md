# Diccionario de datos y método

Fuente de verdad: `dist/data/ccpc_resumen.json`. Serie nacional de seis elecciones y selección demostrativa de ocho entidades en 2024. No constituye una muestra probabilística ni un ranking completo de México. Son datos agregados, sin información individual.

| Campo | Tipo | Significado |
|---|---|---|
| `participation` | número 0–100 | Tasa publicada a un decimal; no inventar precisión adicional |
| `unit` | texto | `porcentaje` |
| `year` | entero | Año electoral; 2009, 2012, 2015, 2018, 2021, 2024 |
| `kind` | enumeración | `presidencial` o `intermedia` |
| `scope` | texto | Nacional o nombre de entidad |
| `name` | texto en entidades | Nombre de la entidad, sin inferir cobertura nacional |
| `source` | URL | Manual INE con número de página |
| `source_page` | entero | 21 nacional; 16 territorial |
| `reviewed_at` | fecha ISO | Revisión documental 2026-10-20 |
| `verification` | texto | Cotejo documental realizado; no recálculo desde ZIP |
| `metadata` | objeto | Procedencia general, precisión, alcance, portal y segunda fuente |

## Fórmulas

Participación CCPC = sí votaron / (sí votaron + no votaron) × 100. Los registros no especificados se excluyen del denominador; no se reclasifican como abstención. Esta definición no equivale a dividir votos entre toda la lista nominal. La fuente primaria es Manual CCPC p.17; p.18 explica no especificados.

No participación representada = 100 − participación publicada. El complemento se deriva del agregado redondeado; no se presenta como una nueva estimación independiente.

Diferencia en puntos porcentuales = tasa de destino − tasa de origen. Ejemplo presidencial: 59,7 − 62,4 = −2,7 pp. Ejemplo intermedio: 51,8 − 47,1 = +4,7 pp. Cambio relativo = (destino − origen) / origen × 100. Si origen es cero, no está definido. El motor devuelve `null`, no infinito ni una cifra inventada.

La visualización de puntos redondea la tasa al entero más cercano. 59,7 % produce 60 puntos activos; el dato junto al gráfico mantiene el decimal publicado. No son cien personas identificables ni una observación directa de una muestra de cien.

El escenario permite cualquier valor de 0 a 100 en pasos de 0,1. Es una simulación aritmética con base observada 2024; no pronostica ni mide efecto causal. Una predicción requeriría datos comparables, validación fuera de muestra, incertidumbre y evaluación de sesgos; inferir efecto de políticas requiere además un diseño causal apropiado.

## Comparabilidad

Presidenciales: 2012, 2018, 2024. Intermedias: 2009, 2015, 2021. Manual p.30 propone distinguirlas. Separar tipos reduce una confusión, pero no convierte dos elecciones en experimentos equivalentes ni elimina diferencias de contexto. No atribuir causalidad a las variaciones; no transferir propiedades del territorio a individuos. La selección territorial se compara solo con nacional 2024, en el mismo producto CCPC.

## Verificación y mantenimiento

Las 14 cifras coinciden visualmente con Manual pp.16/21 y Estudio INE 2024 pp.16/25. Se conservaron documentos, capturas y hashes en `fuentes/`. No se descargó/procesó el ZIP de bases completas; esa conciliación queda pendiente antes de ampliar cobertura. Los cálculos de pp parten de cifras ya redondeadas y no representan precisión superior.

Para incorporar una nueva base: conservar original y hash, verificar esquema y denominadores, agregar sin datos personales, conciliar totales por territorio/año, contrastar con publicación oficial, registrar fecha/estado y revisar todas las narrativas/exportaciones. La aprobación editorial no se sustituye por pasar una validación de tipo numérico. Mantener “dato no disponible” si falta evidencia.
