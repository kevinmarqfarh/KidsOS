#!/usr/bin/env python3
"""Hämtar riktiga bilder till KidsOS från Wikipedia/Wikimedia Commons (inkl. NASA:s public domain-bilder).

- Läser assets/image-catalog.json  (nyckel → "sv:Artikel", "en:Article" eller "File:Filnamn")
- Tar artikelns huvudbild, kontrollerar att licensen är fri (public domain / CC0 / CC BY / CC BY-SA)
- Sparar som WebP (max 560 px) i assets/img/<nyckel>.webp
- Skriver upphovsperson och licens till assets/credits.json

Kör: python3 scripts/fetch_images.py [--force] [nyckel ...]
"""
import io, json, re, sys, time, html, urllib.parse, urllib.request
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
CATALOG = ROOT / 'assets' / 'image-catalog.json'
OUT = ROOT / 'assets' / 'img'
CREDITS = ROOT / 'assets' / 'credits.json'
UA = 'KidsOS/1.0 (family learning app; contact: kevin.marqfarh@gmail.com)'
MAX = 560
FREE = re.compile(r'public domain|^pd|cc0|cc[ -]by', re.I)

def get(url, binary=False, tries=4):
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA})
            with urllib.request.urlopen(req, timeout=40) as r:
                data = r.read()
                return data if binary else json.loads(data)
        except urllib.error.HTTPError as e:
            if e.code == 429 or e.code >= 500:
                time.sleep(5 + i * 8)
                continue
            raise
    raise RuntimeError(f'gav upp: {url}')

def page_image(lang, title):
    q = urllib.parse.urlencode({'action': 'query', 'titles': title, 'prop': 'pageimages', 'piprop': 'name', 'redirects': 1, 'format': 'json'})
    d = get(f'https://{lang}.wikipedia.org/w/api.php?{q}')
    for p in d['query']['pages'].values():
        if 'pageimage' in p:
            return 'File:' + p['pageimage']
    return None

def image_info(file_title):
    q = urllib.parse.urlencode({'action': 'query', 'titles': file_title, 'prop': 'imageinfo', 'iiprop': 'url|extmetadata', 'iiurlwidth': 700, 'format': 'json'})
    for host in ('commons.wikimedia.org', 'en.wikipedia.org'):
        d = get(f'https://{host}/w/api.php?{q}')
        for p in d['query']['pages'].values():
            if 'imageinfo' in p:
                return p['imageinfo'][0]
    return None

def clean(s):
    s = re.sub(r'<[^>]+>', '', html.unescape(s or ''))
    return re.sub(r'\s+', ' ', s).strip()[:160]

def main():
    force = '--force' in sys.argv
    only = [a for a in sys.argv[1:] if not a.startswith('--')]
    catalog = json.loads(CATALOG.read_text())
    credits = json.loads(CREDITS.read_text()) if CREDITS.exists() else {}
    OUT.mkdir(parents=True, exist_ok=True)
    failed = []
    for group, items in catalog.items():
        for key, src in items.items():
            if only and key not in only:
                continue
            target = OUT / f'{key}.webp'
            if target.exists() and key in credits and not force:
                continue
            try:
                if src.startswith('File:'):
                    file_title = src
                else:
                    lang, title = src.split(':', 1)
                    file_title = page_image(lang, title)
                    if not file_title:
                        raise RuntimeError('artikeln saknar huvudbild')
                info = image_info(file_title)
                if not info:
                    raise RuntimeError(f'ingen bildinfo för {file_title}')
                meta = info.get('extmetadata', {})
                lic = clean(meta.get('LicenseShortName', {}).get('value', ''))
                if not FREE.search(lic):
                    raise RuntimeError(f'icke-fri licens: {lic}')
                data = get(info['thumburl'], binary=True)
                im = Image.open(io.BytesIO(data))
                if im.mode in ('P', 'LA', 'RGBA'):
                    bg = Image.new('RGB', im.size, (255, 255, 255))
                    im = im.convert('RGBA')
                    bg.paste(im, mask=im.split()[-1])
                    im = bg
                im = im.convert('RGB')
                im.thumbnail((MAX, MAX), Image.LANCZOS)
                im.save(target, 'WEBP', quality=68, method=6)
                credits[key] = {
                    'group': group,
                    'file': file_title,
                    'source': info.get('descriptionurl'),
                    'author': clean(meta.get('Artist', {}).get('value', '')) or 'okänd',
                    'license': lic,
                    'licenseUrl': clean(meta.get('LicenseUrl', {}).get('value', '')),
                    'credit': clean(meta.get('Credit', {}).get('value', '')),
                }
                CREDITS.write_text(json.dumps(credits, ensure_ascii=False, indent=1, sort_keys=True))
                print(f'✓ {key:16} {target.stat().st_size // 1024:3d} kB  {lic:18} {file_title[:60]}', flush=True)
                time.sleep(1.2)
            except Exception as e:
                failed.append((key, src, str(e)))
                print(f'✗ {key:16} {src}: {e}', flush=True)
                time.sleep(3)
    CREDITS.write_text(json.dumps(credits, ensure_ascii=False, indent=1, sort_keys=True))
    print(f'\n{len(credits)} bilder med licens. {len(failed)} misslyckades.')
    for f in failed:
        print('  ', *f)

if __name__ == '__main__':
    main()
