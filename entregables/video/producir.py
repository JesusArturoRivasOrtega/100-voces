from pathlib import Path
import json,runpy,subprocess,wave,struct,math,sys,re,hashlib,textwrap
from PIL import Image,ImageDraw,ImageFont,ImageOps

ROOT=Path(__file__).resolve().parent; PROJECT=ROOT.parent.parent
FFMPEG=PROJECT/'.tools/video/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe'
segments=runpy.run_path(str(ROOT.parent/'editoriales/generar_editoriales.py'))['captions']
voices=[]
spell={'59,7':'cincuenta y nueve coma siete','62,4':'sesenta y dos coma cuatro','64,7':'sesenta y cuatro coma siete','54,7':'cincuenta y cuatro coma siete','47,3':'cuarenta y siete coma tres','58,4':'cincuenta y ocho coma cuatro','2,7':'dos coma siete','4,3':'cuatro coma tres','1,3':'uno coma tres','8,4':'ocho coma cuatro','2024':'dos mil veinticuatro','2018':'dos mil dieciocho','CCPC':'Conteos Censales','100 VOCES':'Cien Voces'}
for i,(a,b,t) in enumerate(segments):
 v=t
 for old,new in spell.items():v=v.replace(old,new)
 voices.append({'index':i,'start':a,'end':b,'text':t,'voice':v})
(ROOT/'segmentos.json').write_text(json.dumps(voices,ensure_ascii=False,indent=2),encoding='utf-8')
FONT=r'C:\Windows\Fonts\arial.ttf';BOLD=r'C:\Windows\Fonts\arialbd.ttf'
def font(s,b=False):return ImageFont.truetype(BOLD if b else FONT,s)
def lines(text,f,width):
 result=[];cur='';draw=ImageDraw.Draw(Image.new('RGB',(1,1)))
 for word in text.split():
  candidate=(cur+' '+word).strip()
  if draw.textlength(candidate,font=f)>width and cur:result.append(cur);cur=word
  else:cur=candidate
 if cur:result.append(cur)
 return result
def block(draw,text,xy,width,size=40,color='#F9F7F2',bold=False,leading=None):
 x,y=xy;f=font(size,bold)
 for s in lines(text,f,width):draw.text((x,y),s,font=f,fill=color);y+=leading or int(size*1.28)
 return y
shots=[
 ('01_portada.png','Un dato. Una pregunta.','¿Qué significa 59,7%?'),
 ('01_portada.png','100 VOCES','Así participa México.'),
 ('02_nacional.png','Comprender con contexto','Ver · comparar · reconocer límites'),
 ('12_denominador.png','La base del cálculo','Sí votaron / (Sí votaron + No votaron) × 100'),
 ('02_nacional.png','La cifra observada','2024 · Nacional · 59,7%'),
 ('02_nacional.png','Una ilustración','Aproximadamente 60 puntos.'),
 ('02_nacional.png','Conservar la precisión','59,7% en la cifra; redondeo en los puntos.'),
 ('04_comparador.png','Comparar por tipo','Presidenciales e intermedias.'),
 ('04_comparador.png','2018 → 2024','62,4% → 59,7%'),
 ('04_comparador.png','Puntos porcentuales','59,7 − 62,4 = −2,7 pp'),
 ('04_comparador.png','Cambio relativo','−2,7 / 62,4 × 100 ≈ −4,3%'),
 ('05_territorio.png','Ocho miradas','Selección demostrativa · 2024'),
 ('13_edades.png','25–29 años','47,3% · Nacional · 2024'),
 ('13_edades.png','Reconocer el límite','18 grupos nacionales; no datos por estado.'),
 ('06_quiz.png','Aprender con el error','Siete preguntas y retroalimentación.'),
 ('07_escenario.png','Dos escenarios','Referencia: 59,7% · A: 54,7% · B: 64,7%'),
 ('07_escenario.png','Comparar en puntos','A: −5,0 pp · B: +5,0 pp · B−A: 10,0 pp'),
 ('07_escenario.png','No es una predicción','Hipótesis aritméticas para aprender.'),
 ('tarjeta_horizontal.png','Compartir con fuente','PNG generado por la aplicación.'),
 ('14_carrusel.png','Explicar y compartir','Tres formatos de tarjeta + carrusel de cinco piezas.'),
 ('09_aula.png','Primer taller: 15 min','Kit docente · jóvenes sin formación estadística'),
 ('11_offline.png','Respaldo sin conexión','Captura del HTML local con la red desactivada.'),
 ('10_fuentes.png','Estado transparente','Sitio privado. Acceso público y piloto por comprobar.'),
 ('01_portada.png','Los datos ya hablan.','Hagamos que se entiendan.')]

def frames():
 assert len(voices)==len(shots)==24
 for i,(seg,shot) in enumerate(zip(voices,shots)):
  im=Image.new('RGB',(1920,1080),'#12142B');d=ImageDraw.Draw(im)
  d.rectangle((54,46,104,53),fill='#EE5D9C');d.text((124,34),'100 VOCES / ASÍ PARTICIPA MÉXICO',font=font(28,True),fill='#F9F7F2')
  d.text((1450,40),f'RETO 3  ·  {i+1:02} / 24',font=font(23),fill='#D9C4FF')
  y=block(d,shot[1],(54,175),380,48,bold=True);block(d,shot[2],(54,y+30),380,31,'#BAF5D1')
  block(d,'Montaje de capturas reales de la aplicación.',(54,704),360,21,'#D9C4FF')
  pic=Image.open(ROOT/'capturas'/shot[0]).convert('RGB');pic.thumbnail((1370,742),Image.Resampling.LANCZOS)
  px=475+(1370-pic.width)//2;py=128+(742-pic.height)//2
  d.rounded_rectangle((px-3,py-3,px+pic.width+3,py+pic.height+3),radius=4,fill='#D9C4FF');im.paste(pic,(px,py))
  d.rectangle((0,900,1920,1080),fill='#090B18')
  sublines=lines(seg['text'],font(39),1750);assert len(sublines)<=2,seg['text'];sy=922 if len(sublines)==2 else 945
  for line in sublines:
   x=(1920-d.textlength(line,font=font(39)))/2;d.text((x,sy),line,font=font(39),fill='#FFFFFF');sy+=49
  d.text((54,1044),'Voz sintética local: Microsoft Sabina · Proyecto independiente, sin aval del INE',font=font(17),fill='#C9CBD8')
  d.rectangle((0,1074,int(1920*seg['end']/170),1080),fill='#EE5D9C')
  im.save(ROOT/f'frame_{i:02}.png')
 print('24 fotogramas con subtítulos creados.',flush=True)

def cmd(args):
 r=subprocess.run([str(FFMPEG),'-hide_banner','-y',*args],capture_output=True,text=True,encoding='utf-8',errors='replace')
 if r.returncode:raise RuntimeError(r.stderr[-4000:])
 return r.stderr

def audio(synthesize=True):
 ps=r'C:\Users\ARTU2\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\powershell\pwsh.exe'
 if synthesize:
  r=subprocess.run([ps,'-NoProfile','-ExecutionPolicy','Bypass','-File',str(ROOT/'voz.ps1'),'-Folder',str(ROOT)],capture_output=True,text=True,encoding='utf-8',errors='replace')
  if r.returncode:raise RuntimeError(r.stdout+r.stderr)
  print(r.stdout,flush=True)
 chunks=[];details=[]
 for seg in voices:
  file=ROOT/f"voz_{seg['index']:02}.wav"
  with wave.open(str(file),'rb') as w:dur=w.getnframes()/w.getframerate()
  speed=max(1,dur/(seg['end']-seg['start']-.35))
  normalized=ROOT/f"audio_{seg['index']:02}.wav"
  cmd(['-i',str(file),'-af',f'atempo={speed:.6f},apad','-t',str(seg['end']-seg['start']),'-ar','44100','-ac','1','-c:a','pcm_s16le',str(normalized)])
  with wave.open(str(normalized),'rb') as w:chunks.append(w.readframes(w.getnframes()))
  details.append({'segmento':seg['index']+1,'voz_original_s':dur,'velocidad':speed,'salida_s':seg['end']-seg['start']})
 with wave.open(str(ROOT/'narracion_170s.wav'),'wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(44100);w.writeframes(b''.join(chunks))
 (ROOT/'ajuste_voz.json').write_text(json.dumps(details,indent=2),encoding='utf-8');print('Narración de 170 s completada.',flush=True)

def stamp(n):return f'{n//3600:02}:{n//60%60:02}:{n%60:02},000'
def encode(video_only=False):
 concat=''
 for seg in voices:concat+=f"file 'frame_{seg['index']:02}.png'\nduration {seg['end']-seg['start']}\n"
 concat+="file 'frame_23.png'\n";(ROOT/'frames.txt').write_text(concat,encoding='utf-8')
 srt='\n\n'.join(f"{i+1}\n{stamp(s['start'])} --> {stamp(s['end'])}\n{textwrap.fill(s['text'],width=48,break_long_words=False)}" for i,s in enumerate(voices))+'\n'
 (ROOT/'100_VOCES_Pitch_Final.srt').write_text(srt,encoding='utf-8')
 if video_only:
  log=cmd(['-f','concat','-safe','0','-i',str(ROOT/'frames.txt'),'-t','170','-r','24','-c:v','libx264','-preset','ultrafast','-crf','21','-pix_fmt','yuv420p','-an',str(ROOT/'montaje_sin_audio.mp4')])
 else:
  log=cmd(['-f','concat','-safe','0','-i',str(ROOT/'frames.txt'),'-i',str(ROOT/'narracion_170s.wav'),'-t','170','-r','24','-c:v','libx264','-preset','ultrafast','-crf','21','-pix_fmt','yuv420p','-c:a','aac','-b:a','160k','-movflags','+faststart',str(ROOT/'100_VOCES_Pitch_1080p_2m50.mp4')])
 (ROOT/'codificacion.log').write_text(log,encoding='utf-8');print('MP4 codificado.',flush=True)

def verify():
 mp4=ROOT/'100_VOCES_Pitch_1080p_2m50.mp4'
 log=cmd(['-i',str(mp4),'-map','0:a:0','-af','volumedetect','-f','null','NUL'])
 assert '1920x1080' in log and 'Video: h264' in log and 'Audio: aac' in log
 assert 'Duration: 00:02:50.00' in log
 volume=re.search(r'mean_volume: ([\-\d.]+) dB',log);assert volume and float(volume.group(1))>-50
 (ROOT/'verificacion_ffmpeg.log').write_text(log,encoding='utf-8')
 thumbs=[]
 for i,t in enumerate([2,24,38,66,88,101,117,130,144,150,157,166]):
  file=ROOT/f'revision_{i:02}.png';cmd(['-ss',str(t),'-i',str(mp4),'-frames:v','1',str(file)]);im=Image.open(file);im.thumbnail((640,360));thumbs.append(im.copy())
 sheet=Image.new('RGB',(1280,2160),'#FFFFFF')
 for i,im in enumerate(thumbs):sheet.paste(im,((i%2)*640,(i//2)*360))
 sheet.save(ROOT/'revision_fotogramas.jpg',quality=90)
 result={'archivo':mp4.name,'bytes':mp4.stat().st_size,'resolucion':'1920x1080','duracion_segundos':170,'fps':24,'video':'H.264 yuv420p','audio':'AAC, mono, 44100 Hz','volumen_medio_db':float(volume.group(1)),'subtitulos':'integrados en imagen + SRT aparte','origen_visual':'montaje de capturas actuales y PNG descargados del prototipo local; no grabación continua','voz':'síntesis local Microsoft Sabina Desktop, es-MX','denominador':'registros Sí votaron + No votaron; excluye no especificados','contenido':{'preguntas':7,'edades_nacionales':18,'edad_ejemplo':'25–29 años: 47,3%','referencia':59.7,'escenario_A':54.7,'escenario_B':64.7,'taller_minutos':15,'carrusel_piezas':5},'publicado':False,'revision_visual':'12 fotogramas extraídos para revisión','limitaciones':['No sustituye piloto con usuarios','No implica aval institucional','Voz sintética declarada; puede sustituirse por voz humana']}
 result['sha256']=hashlib.sha256(mp4.read_bytes()).hexdigest()
 result['huellas_produccion']={str(p.relative_to(ROOT)):hashlib.sha256(p.read_bytes()).hexdigest() for p in [ROOT/'segmentos.json',ROOT/'narracion_170s.wav',*[ROOT/f'frame_{i:02}.png' for i in range(24)]]}
 result['audio_por_segmento']=[]
 for seg in voices:
  with wave.open(str(ROOT/f"audio_{seg['index']:02}.wav"),'rb') as w:
   pcm=w.readframes(w.getnframes()); samples=struct.unpack('<'+'h'*(len(pcm)//2),pcm)
   peak=max(abs(n) for n in samples);rms=math.sqrt(sum(n*n for n in samples)/len(samples))
   assert peak>100 and rms>50,seg['index']
   result['audio_por_segmento'].append({'segmento':seg['index']+1,'pico_pcm':peak,'rms_pcm':round(rms,1)})
 (ROOT/'verificacion_video.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps(result,ensure_ascii=False),flush=True)

if __name__=='__main__':
 mode=sys.argv[1] if len(sys.argv)>1 else 'all'
 if mode in ['all','frames']:frames()
 if mode in ['all','audio']:audio()
 if mode=='normalize':audio(False)
 if mode=='video-only':encode(True)
 if mode in ['all','encode']:encode()
 if mode in ['all','verify']:verify()
