"""Recupera las fuentes oficiales ya incluidas; no se necesita para usar el sitio."""
from pathlib import Path
from urllib.request import urlopen
from urllib.parse import quote
root=Path(__file__).resolve().parents[1]
fonts=root/'dist/fonts';fonts.mkdir(exist_ok=True)
for slug,filename in [('manrope','Manrope[wght].ttf'),('dmsans','DMSans[opsz,wght].ttf')]:
 base='https://raw.githubusercontent.com/google/fonts/main/ofl/'+slug+'/'
 (fonts/(slug+'.ttf')).write_bytes(urlopen(base+quote(filename),timeout=30).read())
 (fonts/(slug+'-OFL.txt')).write_bytes(urlopen(base+'OFL.txt',timeout=30).read())
print('Fuentes oficiales y licencias locales actualizadas. Ejecuta build.py para actualizar el HTML autónomo.')
