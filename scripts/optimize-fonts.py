"""Optional asset maintenance: pip install fonttools==4.68.0 brotli==1.2.1.
The ordinary build uses the committed WOFF2 files; no new runtime dependency.
"""
from pathlib import Path
import json
from fontTools.ttLib import TTFont

root = Path(__file__).resolve().parents[1]
rows = []
for name in ['manrope', 'dmsans']:
    source = root / 'public/fonts' / (name + '.ttf')
    target = source.with_suffix('.woff2')
    font = TTFont(source)
    font.flavor = 'woff2'
    font.save(target)
    compressed = TTFont(target)
    assert font.getBestCmap() == compressed.getBestCmap()
    assert font.getGlyphOrder() == compressed.getGlyphOrder()
    assert font['glyf'].compile(font) == compressed['glyf'].compile(compressed)
    assert font['fvar'].compile(font) == compressed['fvar'].compile(compressed)
    rows.append({'font': name, 'ttf_bytes': source.stat().st_size,
                 'woff2_bytes': target.stat().st_size, 'glyphs': len(font.getGlyphOrder()),
                 'glyphs_and_variable_axes_preserved': True})
print(json.dumps(rows, ensure_ascii=False, indent=2))
