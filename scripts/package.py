from pathlib import Path
import zipfile,hashlib,json
root=Path(__file__).resolve().parents[1]
target=root.parent/'100_VOCES_RETO3_ENTREGA.zip'
skip_dirs={'.git','.tools','node_modules','__pycache__','.sites-runtime','trabajo','capturas','audio','frames','.qa','dist','.wrangler','.vinext','outputs','.next'}
files=[]
for p in root.rglob('*'):
 if not p.is_file() or any(x in skip_dirs for x in p.relative_to(root).parts):continue
 rel=p.relative_to(root)
 if p.name=='MANIFIESTO_SHA256.json' or p.name.startswith(('.env','.dev.vars')) or p.suffix in ['.pyc','.wav','.log','.tsbuildinfo']:continue
 if p.suffix=='.zip' and not ('recursos' in rel.parts or 'kit' in rel.parts):continue
 if 'evidencia' in rel.parts and p.suffix=='.png':continue
 if 'video' in rel.parts and (p.name.startswith('frame_') or p.name.startswith('revision_') or p.suffix=='.mp4' or p.name=='frames.txt'):continue
 files.append(p)
# Normalize text before hashing so Git checkouts and delivery files agree.
text_extensions={'.md','.txt','.json','.html','.css','.js','.cjs','.py','.ps1','.csv','.srt','.vtt','.yml','.yaml','.sha256'}
for p in files:
 if p.suffix in text_extensions or p.name in {'.gitignore','.gitattributes'}:
  raw=p.read_bytes().replace(b'\r\n',b'\n')
  p.write_bytes(raw)
digest=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
manifest={p.relative_to(root).as_posix():{'bytes':p.stat().st_size,'sha256':digest(p)} for p in sorted(files)}
mp=root/'MANIFIESTO_SHA256.json';mp.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');files.append(mp)
with zipfile.ZipFile(target,'w',zipfile.ZIP_DEFLATED,compresslevel=6,strict_timestamps=False) as z:
 for p in files:z.write(p,'100_VOCES_RETO3/'+p.relative_to(root).as_posix())
with zipfile.ZipFile(target) as z:
 assert z.testzip() is None
 for name,info in manifest.items():assert hashlib.sha256(z.read('100_VOCES_RETO3/'+name)).hexdigest()==info['sha256'],name
 data=json.loads(z.read('100_VOCES_RETO3/public/data/ccpc_resumen.json'))
 assert len(data['age_2024'])==18
 assert len(data['states_2024'])==32
 assert b'scenarioSliderA' in z.read('100_VOCES_RETO3/public/index.html')
 for name in ['public/js/navigation.js','public/recursos/100_VOCES_Kit_Docente.zip','public/recursos/100_VOCES_Carrusel.zip','public/recursos/100_VOCES_Pitch_1080p_2m50.mp4','LEEME_ENTREGA.md']:assert '100_VOCES_RETO3/'+name in z.namelist()
sha=digest(target)
target.with_suffix('.sha256.txt').write_text(sha+'  '+target.name+'\n',encoding='ascii')
print(json.dumps({'archivo':str(target),'archivos':len(files),'bytes':target.stat().st_size,'sha256':sha,'version':json.loads((root/'version.json').read_text())['version'],'integridad':'VERIFICADA'},ensure_ascii=False))
