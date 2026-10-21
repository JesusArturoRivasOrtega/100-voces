from pathlib import Path
import zipfile,hashlib,json
root=Path(__file__).resolve().parents[1]
target=root.parent/'100_VOCES_RETO3_ENTREGA.zip'
skip_dirs={'.git','.tools','node_modules','__pycache__','.sites-runtime','trabajo'}
files=[]
for p in root.rglob('*'):
 if not p.is_file() or any(x in skip_dirs for x in p.relative_to(root).parts):continue
 if p.suffix in ['.zip','.pyc'] or p.name=='MANIFIESTO_SHA256.json':continue
 if p.suffix=='.wav' or any(x in ['audio','frames'] for x in p.relative_to(root).parts):continue
 if 'video' in p.relative_to(root).parts and (p.name.startswith('frame_') or (p.name.startswith('revision_') and p.suffix=='.png')):continue
 if p.suffix=='.mp4' and not p.name.startswith('100_VOCES'):continue
 files.append(p)
manifest={str(p.relative_to(root)).replace('\\','/'):{'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in sorted(files)}
mp=root/'MANIFIESTO_SHA256.json';mp.write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8');files.append(mp)
with zipfile.ZipFile(target,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
 for p in files:z.write(p,'100_VOCES_RETO3/'+str(p.relative_to(root)).replace('\\','/'))
with zipfile.ZipFile(target) as z:
 assert z.testzip() is None
 for name,info in manifest.items():assert hashlib.sha256(z.read('100_VOCES_RETO3/'+name)).hexdigest()==info['sha256']
print(json.dumps({'archivo':str(target),'archivos':len(files),'bytes':target.stat().st_size,'sha256':hashlib.sha256(target.read_bytes()).hexdigest(),'integridad':'VERIFICADA'},ensure_ascii=False))
