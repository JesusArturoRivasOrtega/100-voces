from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
r=json.loads((root/'evidencia/pruebas.json').read_text(encoding='utf-8'))
text='# Reporte de pruebas reales\n\n'
text+=f"Ejecución: {r['fecha']}. Navegador Chromium/Edge {r['navegador']}. Script: `tests/browser.cjs`. Pruebas sobre HTTP local y archivo autónomo.\n\n"
text+='| Prueba | Esperado | Observado | Estado |\n|---|---|---|---|\n'
for row in r['resultados']:text+='| '+' | '.join(str(row[k]).replace('|','/') for k in ['prueba','esperado','observado','estado'])+' |\n'
text+='\n## Revisión visual y límites\n\nSe inspeccionaron capturas de escritorio y móvil, además de las tres tarjetas PNG generadas y descargadas. Las piezas muestran cifra, año, contexto, denominador y referencia sin cortes en los ejemplos examinados. Las fuentes Manrope y DM Sans se cargan localmente. El diseño no desborda horizontalmente en los cuatro anchos comprobados.\n\nNo se presenta una puntuación Lighthouse ni una certificación WCAG. La prueba automatizada de teclado comprueba accesibilidad de controles principales; no reemplaza la evaluación de lector de pantalla. Pendientes: Safari/Firefox, teléfonos físicos, contraste completo de todos los estados y piloto de comprensión con personas usuarias. No hay métricas de impacto educativo obtenidas.\n\n## Correcciones durante QA\n\nSe corrigió una validación inicial incorrecta de tipo electoral antes de la primera navegación. La primera suite funcional encontró un 404 de favicon; se añadió un icono SVG embebido y se repitió la suite con cero errores en uso normal. Se ajustaron acentos de texto y puntos para legibilidad y se incorporaron fuentes locales. Las pruebas de datos inválidos provocan deliberadamente un error capturado y visible; no se cuentan como error del recorrido normal.\n'
(root/'docs/PRUEBAS.md').write_text(text,encoding='utf-8')
print('Reporte de pruebas generado desde resultados reales.')
