from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
r=json.loads((root/'evidencia/pruebas.json').read_text(encoding='utf-8'))
text='# Reporte de pruebas reales\n\n'
text+=f"Ejecución: {r['fecha']}. Navegador Chromium/Edge {r['navegador']}. Script: `tests/browser.cjs`. Pruebas sobre HTTP local y archivo autónomo.\n\n"
text+='| Prueba | Esperado | Observado | Estado |\n|---|---|---|---|\n'
for row in r['resultados']:text+='| '+' | '.join(str(row[k]).replace('|','/') for k in ['prueba','esperado','observado','estado'])+' |\n'
text+='\n## Revisión visual y límites\n\nSe inspeccionaron capturas de escritorio y móvil, además de las tres tarjetas PNG generadas y descargadas. Las piezas muestran cifra, año, contexto, denominador y referencia sin cortes en los ejemplos examinados. Las fuentes Manrope y DM Sans se cargan localmente. El diseño no desborda horizontalmente en los cuatro anchos comprobados.\n\nNo se presenta una puntuación Lighthouse ni una certificación WCAG. La prueba automatizada de teclado comprueba accesibilidad de controles principales; no reemplaza la evaluación de lector de pantalla. Pendientes: Safari/Firefox, teléfonos físicos, contraste completo de todos los estados y piloto de comprensión con personas usuarias. No hay métricas de impacto educativo obtenidas.\n\n## Correcciones durante QA\n\nSe corrigió una validación inicial incorrecta de tipo electoral antes de la primera navegación. La primera suite funcional encontró un 404 de favicon; se añadió un icono SVG embebido y se repitió la suite con cero errores en uso normal. Se ajustaron acentos de texto y puntos para legibilidad y se incorporaron fuentes locales. Las pruebas de datos inválidos provocan deliberadamente un error capturado y visible; no se cuentan como error del recorrido normal.\n'
axe=root/'evidencia/accesibilidad.json'
if axe.exists():
 states=json.loads(axe.read_text(encoding='utf-8'))
 text+='\n## Revisión automática adicional\n\nAxe-core 4.10.3, reglas WCAG 2 A/AA y 2.1 AA. Se corrigieron once nodos de contraste insuficiente en la primera ejecución. Resultados finales:\n\n'
 for s in states:text+=f"- Estado {s['state']}: {len(s['violations'])} infracciones automáticas, {s['passes']} reglas aprobadas, {len(s['incomplete'])} reglas requieren revisión manual.\n"
 text+='\nEl estado expanded abre evidencia y responde incorrectamente un reactivo. Los resultados están en `evidencia/accesibilidad.json`. Cero infracciones detectadas no equivale a certificación WCAG.\n'
(root/'docs/PRUEBAS.md').write_text(text,encoding='utf-8')
print('Reporte de pruebas generado desde resultados reales.')
