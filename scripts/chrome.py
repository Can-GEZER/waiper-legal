"""Writes the shared top bar (with the site menu) and footer into every page.

The site has no build step, so the header and footer are plain HTML repeated in each page.
Edit MENU below, then run from the repo root:  python scripts/chrome.py
Pages with a TR/EN toggle (they contain data-lang-btn) get bilingual labels.
r.html (invite page) is left alone on purpose: it only shows the brand.
"""
import io
import os
import re

PLAY = ('https://play.google.com/store/apps/details?id=com.cangzr.waiper'
        '&amp;referrer=utm_source%3Dwaiper.app%26utm_medium%3Dwebsite%26utm_campaign%3Dheader')

# (group title tr, en, [(href, tr, en), ...])
MENU = [
    ('İçerik', 'Content', [
        ('/blog/', 'Blog', 'Blog (Turkish)'),
        ('/araclar/', 'Hesaplama araçları', 'Calculators (Turkish)'),
        ('/araclar/harcanabilir-tutar-hesaplama/', 'Harcanabilir tutar hesaplama', 'Spendable amount calculator'),
        ('/araclar/taksit-yuku-hesaplama/', 'Taksit yükü hesaplama', 'Installment load calculator'),
    ]),
    ('Waiper', 'Waiper', [
        ('/about.html', 'Hakkında', 'About'),
        ('/privacy.html', 'Gizlilik Politikası', 'Privacy Policy'),
        ('/terms.html', 'Hizmet Şartları', 'Terms of Service'),
        ('/account-deletion.html', 'Hesap ve veri silme', 'Account and data deletion'),
    ]),
]

SKIP = {'r.html'}
SKIP_DIRS = {'.git', 'assets', 'scripts', '.well-known', 'node_modules'}


def label(tr, en, bilingual):
    if not bilingual:
        return tr
    return f'<span class="lang-block" data-lang="tr">{tr}</span><span class="lang-block" data-lang="en">{en}</span>'


def header(url_path, bilingual):
    groups = []
    for title_tr, title_en, links in MENU:
        items = []
        for href, tr, en in links:
            current = ' aria-current="page"' if href == url_path else ''
            items.append(f'          <a href="{href}"{current}>{label(tr, en, bilingual)}</a>')
        groups.append('        <div class="menu-group">\n'
                      f'          <p class="menu-title">{label(title_tr, title_en, bilingual)}</p>\n'
                      + '\n'.join(items) + '\n        </div>')
    toggle = ('''      <div class="lang-toggle">
        <button data-lang-btn="tr">TR</button>
        <button data-lang-btn="en">EN</button>
      </div>
''' if bilingual else '')
    return f'''<header class="site">
    <a class="brand" href="/">
      <img src="/assets/img/logo-96.png" alt="" width="32" height="32">
      <span>Waiper</span>
    </a>
    <div class="header-right">
{toggle}      <a class="header-cta" href="{PLAY}" target="_blank" rel="noopener">{label('Uygulamayı indir', 'Get the app', bilingual)}</a>
      <details class="menu">
        <summary aria-label="Menü"><span class="menu-icon" aria-hidden="true"></span><span class="menu-label">{label('Menü', 'Menu', bilingual)}</span></summary>
        <nav class="menu-panel" aria-label="Site">
{chr(10).join(groups)}
        </nav>
      </details>
    </div>
  </header>'''


def footer(bilingual):
    return f'''<footer class="site">
    <span>&copy; 2026 Waiper &middot; <a href="mailto:dcangezer@gmail.com">dcangezer@gmail.com</a></span>
    <span class="foot-links">
      <a href="/privacy.html">{label('Gizlilik Politikası', 'Privacy Policy', bilingual)}</a>
      <a href="/terms.html">{label('Hizmet Şartları', 'Terms of Service', bilingual)}</a>
    </span>
  </footer>'''


def pages():
    for root, dirs, files in os.walk('.'):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for f in files:
            if f.endswith('.html'):
                p = os.path.join(root, f).replace('\\', '/')[2:]
                if p not in SKIP:
                    yield p


def url_of(p):
    if p == 'index.html':
        return '/'
    if p.endswith('/index.html'):
        return '/' + p[:-len('index.html')]
    return '/' + p


count = 0
for p in pages():
    s = io.open(p, encoding='utf-8', newline='').read().replace('\r\n', '\n')
    bilingual = 'data-lang-btn' in s or p == 'index.html'
    if not re.search(r'<header class="site">.*?</header>', s, flags=re.S):
        print('no header, skipped:', p)
        continue
    s = re.sub(r'<header class="site">.*?</header>', lambda m: header(url_of(p), bilingual), s, count=1, flags=re.S)
    s = re.sub(r'<footer class="site">.*?</footer>', lambda m: footer(bilingual), s, count=1, flags=re.S)
    if '/site.js' not in s:
        s = s.replace('</body>', '<script src="/site.js" defer></script>\n</body>')
    io.open(p, 'w', encoding='utf-8', newline='').write(s)
    count += 1
print('updated', count, 'pages')
