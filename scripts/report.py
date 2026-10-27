from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
reports=[('Base','pruebas.json'),('Ampliaciones','pruebas-mejoras.json'),('Versión 1.1','pruebas-version-1.1.json'),('En vivo y Lente','pruebas-version-1.2.json'),('Carga local','pruebas-carga-local.json'),('Resiliencia','pruebas-resiliencia.json'),('Educación','pruebas-educacion.json'),('Cobertura territorial','pruebas-territorio.json'),('Motores adicionales','pruebas-motores.json')]
lines=['# Pruebas de 100 VOCES · v1.3.0','', 'Ejecución reproducible: npm ci y npm test. El ejecutor inicia y detiene su servidor local. Los resultados siguientes proceden de los reportes guardados; no se infieren de la presencia del código.','']
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
lines+=['## Accesibilidad automática','',str(len(states))+' estados examinados con axe-core: '+', '.join(s['state'] for s in states)+'. Cero infracciones detectadas. La suite devuelve salida de error si aparecen infracciones.','', '## Alcance y límites','',str(total)+' grupos de comprobaciones funcionales aprobados. Las diez suites predeterminadas incluyen comprobaciones API además de estos grupos; la suite engines se ejecuta por separado. El piloto sigue sin ejecutarse. Las pruebas no certifican WCAG ni sustituyen lector de pantalla, Safari en dispositivos físicos ni teléfonos reales. La ampliación de texto se comprobó como tamaño base 200% a 640px; no equivale a una auditoría completa de zoom. Las tasas se comparan con referencias locales ya cotejadas, no se vuelven a extraer del PDF oficial en cada ejecución.','', 'Se revisaron capturas móviles/escritorio, PNG, PDF, DOCX exportado por Word y presentación renderizada. Los archivos generados se conservan en evidencia/. El informe de video está en entregables/video/verificacion_video.json.']
(root/'docs/PRUEBAS.md').write_text('\n'.join(lines)+'\n',encoding='utf-8')
print(str(total)+' comprobaciones funcionales y '+str(len(states))+' estados axe documentados.')
