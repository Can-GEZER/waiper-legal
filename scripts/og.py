"""Share image (1200x630) for every blog post and tool page that does not have one yet.

Usage, from the repo root: start `python -m http.server 8765`, then `python scripts/og.py`.
Needs Microsoft Edge and Pillow. Pages that already point at their own image are skipped.
"""
import io
import os
import re
import subprocess
import urllib.parse

from PIL import Image

EDGE = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
TMP = os.path.join(os.environ['TEMP'], 'waiper-og.png')
os.makedirs('assets/img/og', exist_ok=True)

pages = []
for section, kind in (('blog', 'Blog'), ('araclar', 'Hesaplama aracı')):
    for slug in sorted(os.listdir(section)):
        p = f'{section}/{slug}/index.html'
        if os.path.isfile(p):
            pages.append((section, kind, slug, p))

for section, kind, slug, p in pages:
    s = io.open(p, encoding='utf-8', newline='').read()
    if f'assets/img/og/{slug}.jpg' in s:
        continue
    title = re.search(r'<h1>(.*?)</h1>', s).group(1)
    q = urllib.parse.urlencode({'k': kind, 't': title, 'f': f'waiper.app/{section}'})
    if os.path.exists(TMP):
        os.remove(TMP)
    subprocess.run([EDGE, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--window-size=1200,630',
                    '--virtual-time-budget=3000', f'--screenshot={TMP}', f'http://localhost:8765/scripts/og-template.html?{q}'],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=60)
    out = f'assets/img/og/{slug}.jpg'
    Image.open(TMP).convert('RGB').resize((1200, 630)).save(out, 'JPEG', quality=86, optimize=True)

    img = f'https://waiper.app/{out}'
    old_meta = '<meta property="og:image" content="https://waiper.app/assets/img/og.png">'
    assert s.count(old_meta) == 1, p
    s = s.replace(old_meta, f'<meta property="og:image" content="{img}">\n'
                            '<meta property="og:image:width" content="1200">\n'
                            '<meta property="og:image:height" content="630">')
    s = s.replace('"image": "https://waiper.app/assets/img/og.png"', f'"image": "{img}"')
    io.open(p, 'w', encoding='utf-8', newline='').write(s)
    print(out, os.path.getsize(out) // 1024, 'KB', '|', title)
