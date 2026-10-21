from pathlib import Path
import json,csv,io,re,base64
root=Path(__file__).resolve().parents[1]; dist=root/'dist'
data=json.loads((dist/'data/ccpc_resumen.json').read_text(encoding='utf-8-sig'))
for d in data['years']+data['states_2024']:
 d.setdefault('year',2024);d.setdefault('kind','presidencial');d.setdefault('scope',d.get('name','Nacional'));d.setdefault('unit','porcentaje')
 d.setdefault('source',data['metadata']['state_source' if 'name' in d else 'national_source']);d.setdefault('source_page',16 if 'name' in d else 21)
 d.setdefault('reviewed_at','2026-10-20');d.setdefault('verification','Pendiente de cotejo independiente')
(dist/'data/ccpc_resumen.json').write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
(dist/'js/data.js').write_text('window.VOCES_DATA = '+json.dumps(data,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
with (dist/'data/indicadores.csv').open('w',encoding='utf-8-sig',newline='') as f:
 fields=['year','scope','participation','unit','kind','source','source_page','reviewed_at','verification'];w=csv.DictWriter(f,fieldnames=fields,extrasaction='ignore');w.writeheader();w.writerows(data['years']+data['states_2024'])
h=(dist/'index.html').read_text(encoding='utf-8');css=(dist/'styles.css').read_text(encoding='utf-8')
for font in (dist/'fonts').glob('*'):
 if font.suffix not in ['.woff2','.ttf']:continue
 css=css.replace('fonts/'+font.name,'data:font/'+('ttf' if font.suffix=='.ttf' else 'woff2')+';base64,'+base64.b64encode(font.read_bytes()).decode())
h=h.replace('<link rel="stylesheet" href="styles.css">','<style>'+css+'</style>')
for script in re.findall(r'<script src="([^"]+)" defer></script>',h):h=h.replace(f'<script src="{script}" defer></script>','<script defer>'+ (dist/script).read_text(encoding='utf-8').replace('</script',r'<\/script')+'</script>')
# Inline scripts run after the DOM is parsed, including local file:// use.
scripts=re.findall(r'<script defer>([\s\S]*?)</script>',h);h=re.sub(r'<script defer>[\s\S]*?</script>','',h)
h=h.replace('</body>', ''.join('<script>'+s+'</script>' for s in scripts)+'</body>')
licenses='\n\n'.join(p.read_text(encoding='utf-8') for p in sorted((dist/'fonts').glob('*-OFL.txt')))
h=h.replace('</head>','<script type="application/json" id="font-licenses">'+json.dumps({'license':'SIL OFL','text':licenses},ensure_ascii=False)+'</script>\n</head>')
for file,mime in [('data/ccpc_resumen.json','application/json'),('data/indicadores.csv','text/csv')]:
 h=h.replace('href="'+file+'"','href="data:'+mime+';base64,'+base64.b64encode((dist/file).read_bytes()).decode()+'"')
(root/'100_VOCES_ABRIR.html').write_text(h,encoding='utf-8')
print('JSON, JS y CSV sincronizados; HTML autónomo generado.')
