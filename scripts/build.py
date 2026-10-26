from pathlib import Path
import json,csv,io,re,base64,shutil,zipfile,subprocess
subprocess.run(["node",str(Path(__file__).parent/"build-features.mjs")],check=True,cwd=Path(__file__).resolve().parents[1])
root=Path(__file__).resolve().parents[1]; dist=root/'public'
resources=dist/'recursos';resources.mkdir(exist_ok=True)
for folder,names in [('kit',['100_VOCES_Kit_Docente.pdf','100_VOCES_Kit_Docente.zip','seleccion_entidades.md']),('editoriales',['100_VOCES_Presentacion_Ejecutiva_10.pdf']),('video',['100_VOCES_Pitch_1080p_2m50.mp4'])]:
 for name in names:
  source=root/'entregables'/folder/name
  if source.exists():shutil.copyfile(source,resources/name)
carousel=resources/'carrusel'
if carousel.exists():
 with zipfile.ZipFile(resources/'100_VOCES_Carrusel.zip','w',zipfile.ZIP_DEFLATED) as z:
  for p in sorted(carousel.iterdir()):
   if p.is_file():z.write(p,p.name)
segments=root/'entregables/video/segmentos.json'
if segments.exists():
 parts=json.loads(segments.read_text(encoding='utf-8'))
 stamp=lambda n:f'{int(n)//3600:02}:{int(n)//60%60:02}:{int(n)%60:02}.000'
 (resources/'pitch.vtt').write_text('WEBVTT\n\n'+'\n\n'.join(f'{stamp(p["start"])} --> {stamp(p["end"])}\n{p["text"]}' for p in parts)+'\n',encoding='utf-8')
 (resources/'pitch-transcripcion.txt').write_text('100 VOCES · Pitch · Voz sintética Microsoft Sabina\n\n'+'\n\n'.join(p['text'] for p in parts),encoding='utf-8')
shutil.copyfile(root/'version.json',dist/'version.json')
data=json.loads((dist/'data/ccpc_resumen.json').read_text(encoding='utf-8-sig'))
for d in data['years']+data['states_2024']:
 d.setdefault('year',2024);d.setdefault('kind','presidencial');d.setdefault('scope',d.get('name','Nacional'));d.setdefault('unit','porcentaje')
 d.setdefault('source',data['metadata']['state_source' if 'name' in d else 'national_source']);d.setdefault('source_page',16 if 'name' in d else 21)
 d.setdefault('reviewed_at','2026-10-20');d.setdefault('verification','Pendiente de cotejo independiente')
(dist/'data/ccpc_resumen.json').write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
(dist/'js/data.js').write_text('window.VOCES_DATA = '+json.dumps(data,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
with (dist/'data/indicadores.csv').open('w',encoding='utf-8-sig',newline='') as f:
 fields=['age_group','source_title','year','scope','participation','unit','kind','source','source_page','reviewed_at','verification'];w=csv.DictWriter(f,fieldnames=fields,extrasaction='ignore');w.writeheader();w.writerows(data['years']+data['states_2024']+data['age_2024'])
h=(dist/'index.html').read_text(encoding='utf-8');css=(dist/'styles.css').read_text(encoding='utf-8')+'\n'+(dist/'features.css').read_text(encoding='utf-8')
for font in (dist/'fonts').glob('*'):
 if font.suffix not in ['.woff2','.ttf']:continue
 css=css.replace('fonts/'+font.name,'data:font/'+('ttf' if font.suffix=='.ttf' else 'woff2')+';base64,'+base64.b64encode(font.read_bytes()).decode())
h=h.replace('<link rel="stylesheet" href="features.css">','')
h=h.replace('<link rel="stylesheet" href="styles.css">','<style>'+css+'</style>')
for script in re.findall(r'<script src="([^"]+)" defer></script>',h):h=h.replace(f'<script src="{script}" defer></script>','<script defer>'+ (dist/script).read_text(encoding='utf-8').replace('</script',r'<\/script')+'</script>')
# Inline scripts run after the DOM is parsed, including local file:// use.
scripts=re.findall(r'<script defer>([\s\S]*?)</script>',h);h=re.sub(r'<script defer>[\s\S]*?</script>','',h)
h=h.replace('</body>', ''.join('<script>'+s+'</script>' for s in scripts)+'</body>')
licenses='\n\n'.join(p.read_text(encoding='utf-8') for p in sorted((dist/'fonts').glob('*-OFL.txt')))
h=h.replace('</head>','<script type="application/json" id="font-licenses">'+json.dumps({'license':'SIL OFL','text':licenses},ensure_ascii=False)+'</script>\n</head>')
for file,mime in [('data/ccpc_resumen.json','application/json'),('data/indicadores.csv','text/csv')]:
 h=h.replace('href="'+file+'"','href="data:'+mime+';base64,'+base64.b64encode((dist/file).read_bytes()).decode()+'"')
# The app itself is standalone; the optional PDFs, PNGs and video travel in public/recursos.
h=h.replace('href="recursos/','href="public/recursos/').replace('src="recursos/','src="public/recursos/')
(root/'100_VOCES_ABRIR.html').write_text(h.replace('\n  \n','\n\n'),encoding='utf-8')
print('JSON, JS y CSV sincronizados; HTML autónomo generado.')
