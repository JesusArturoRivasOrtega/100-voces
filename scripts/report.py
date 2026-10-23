from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
reports=[('Base','pruebas.json'),('Ampliaciones','pruebas-mejoras.json'),('Versión 1.1','pruebas-version-1.1.json')]
lines=['# Pruebas de 100 VOCES · v1.1.0','', 'Ejecución reproducible: npm ci y npm test. El ejecutor inicia y detiene su servidor local. Los resultados siguientes proceden de los reportes guardados; no se infieren de la presencia del código.','']
total=0
for label,file in reports:
 data=json.loads((root/'evidencia'/file).read_text(encoding='utf-8'))
 rows=data['resultados'];total+=len(rows)
 assert all(r['estado']=='VERIFICADO' for r in rows),file
 lines+=['## '+label,'','Fecha UTC: '+data['fecha'],'','| Prueba | Resultado observado |','|---|---|']
 for r in rows:lines+=['| '+r['prueba']+' | '+r.get('detalle',r.get('observado',''))+' |']
 lines+=['']
a=json.loads((root/'evidencia/accesibilidad.json').read_text(encoding='utf-8'))
b=json.loads((root/'evidencia/accesibilidad-mejoras.json').read_text(encoding='utf-8'))
states=a['states']+b
assert all(not s['violations'] for s in states)
lines+=['## Accesibilidad automática','',str(len(states))+' estados examinados con axe-core: '+', '.join(s['state'] for s in states)+'. Cero infracciones detectadas. La suite devuelve salida de error si aparecen infracciones.','', '## Alcance y límites','',str(total)+' grupos de comprobaciones funcionales aprobados. El piloto sigue sin ejecutarse. Las pruebas no certifican WCAG ni sustituyen lector de pantalla, Safari/Firefox o teléfonos físicos. La ampliación de texto se comprobó como tamaño base 200% a 640px; no equivale a una auditoría completa de zoom. Las tasas se comparan con referencias locales ya cotejadas, no se vuelven a extraer del PDF oficial en cada ejecución.','', 'Se revisaron capturas móviles/escritorio y PNG del carrusel. Los archivos generados se conservan en evidencia/. El informe de video está en entregables/video/verificacion_video.json.']
(root/'docs/PRUEBAS.md').write_text('\n'.join(lines)+'\n',encoding='utf-8')
print(str(total)+' comprobaciones funcionales y '+str(len(states))+' estados axe documentados.')
