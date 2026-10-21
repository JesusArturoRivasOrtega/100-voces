from pathlib import Path
import urllib.request,re
root=Path(__file__).resolve().parents[1];fonts=root/'dist/fonts';fonts.mkdir(exist_ok=True)
css_url='https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap'
req=urllib.request.Request(css_url,headers={'User-Agent':'Mozilla/5.0 Chrome/120.0.0.0 Safari/537.36'})
css=urllib.request.urlopen(req,timeout=30).read().decode()
# Both Latin and Latin-ext subsets, retain each unicode range.
parts=[]
for block in css.split('/* '):
 if not block.startswith(('latin */','latin-ext */')):continue
 rule=block.split('*/',1)[1].strip()
 for url in re.findall(r'url\((https://[^)]+)\)',rule):
  name=url.rsplit('/',1)[1];(fonts/name).write_bytes(urllib.request.urlopen(url,timeout=30).read());rule=rule.replace(url,'fonts/'+name)
 parts.append(rule)
if not parts:raise RuntimeError('No se encontraron fuentes WOFF2 latinas')
local='\n'.join(parts)+'\n'
(fonts/'fonts.css').write_text(local,encoding='utf-8')
p=root/'dist/styles.css';p.write_text(local+p.read_text(encoding='utf-8'),encoding='utf-8')
for family,path in [('Manrope','manrope'),('DM Sans','dmsans')]:
 url='https://raw.githubusercontent.com/google/fonts/main/ofl/'+path+'/OFL.txt'
 (fonts/(path+'-OFL.txt')).write_bytes(urllib.request.urlopen(url,timeout=30).read())
print('Fuentes latinas alojadas localmente y licencias OFL conservadas.')
