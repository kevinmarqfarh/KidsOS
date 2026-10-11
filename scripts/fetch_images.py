#!/usr/bin/env python3
"""Hämtar riktiga bilder till KidsOS från Wikipedia/Wikimedia Commons (inkl. NASA:s public domain-bilder).

- Läser assets/image-catalog.json  (nyckel → "sv:Artikel", "en:Article" eller "File:Filnamn")
- Tar artikelns huvudbild, kontrollerar att licensen är fri (public domain / CC0 / CC BY / CC BY-SA)
- Sparar som WebP (max 480 px, gruppen "objects" max 320 px) i assets/img/<nyckel>.webp
- Skriver upphovsperson och licens till assets/credits.json

Kör: python3 scripts/fetch_images.py [--force] [nyckel ...]
"""
import io, json, re, sys, time, html, random, urllib.parse, urllib.request
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
CATALOG = ROOT / 'assets' / 'image-catalog.json'
OUT = ROOT / 'assets' / 'img'
CREDITS = ROOT / 'assets' / 'credits.json'
UA = 'KidsOS/1.0 (family learning app; contact: kevin.marqfarh@gmail.com)'
MAX = 480  # ger en rimlig storlek på den fristående HTML-filen (mål < 6 MB)
# Storlek och kvalitet per grupp: föremål visas som små miniatyrer.
SIZES = {'objects': (320, 65)}
THUMB_W = {'objects': 500}  # standardbredder hos Wikimedia (250/330/500/960 …)
FREE = re.compile(r'public domain|^pd|cc0|cc[ -]by', re.I)

def get(url, binary=False, tries=8):
    """GET med User-Agent. Respekterar 429/Retry-After med backoff (Wikimedia delar IP-gränser)."""
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA})
            with urllib.request.urlopen(req, timeout=40) as r:
                data = r.read()
                return data if binary else json.loads(data)
        except urllib.error.HTTPError as e:
            if e.code == 429 or e.code >= 500:
                wait = int(e.headers.get('Retry-After') or 0) or (5 + i * 8)
                time.sleep(min(wait, 120) + random.uniform(0.5, 3))
                continue
            raise
        except (urllib.error.URLError, TimeoutError, ConnectionError):
            time.sleep(5 + i * 5)
    raise RuntimeError(f'gav upp: {url}')

def page_image(lang, title):
    q = urllib.parse.urlencode({'action': 'query', 'titles': title, 'prop': 'pageimages', 'piprop': 'name', 'redirects': 1, 'format': 'json'})
    d = get(f'https://{lang}.wikipedia.org/w/api.php?{q}')
    for p in d['query']['pages'].values():
        if 'pageimage' in p:
            return 'File:' + p['pageimage']
    return None

def image_info(file_title, width=700):
    q = urllib.parse.urlencode({'action': 'query', 'titles': file_title, 'prop': 'imageinfo', 'iiprop': 'url|extmetadata', 'iiurlwidth': width, 'format': 'json'})
    for host in ('commons.wikimedia.org', 'en.wikipedia.org'):
        d = get(f'https://{host}/w/api.php?{q}')
        for p in d['query']['pages'].values():
            if 'imageinfo' in p:
                return p['imageinfo'][0]
    return None

def clean(s):
    s = re.sub(r'<[^>]+>', '', html.unescape(s or ''))
    return re.sub(r'\s+', ' ', s).strip()[:160]

def license_of(info):
    return clean(info.get('extmetadata', {}).get('LicenseShortName', {}).get('value', ''))

def save_image(key, group, file_title, info, credits, data=None):
    """Konverterar en hämtad bild till WebP och skriver krediten. `data` kan vara redan hämtade bytes."""
    meta = info.get('extmetadata', {})
    lic = license_of(info)
    if not FREE.search(lic):
        raise RuntimeError(f'icke-fri licens: {lic}')
    if data is None:
        data = get(info['thumburl'], binary=True)
    size, quality = SIZES.get(group, (MAX, 64))
    im = Image.open(io.BytesIO(data))
    if im.mode in ('P', 'LA', 'RGBA', 'PA'):
        bg = Image.new('RGB', im.size, (255, 255, 255))
        im = im.convert('RGBA')
        bg.paste(im, mask=im.split()[-1])
        im = bg
    im = im.convert('RGB')
    im.thumbnail((size, size), Image.LANCZOS)
    target = OUT / f'{key}.webp'
    im.save(target, 'WEBP', quality=quality, method=6)
    credits[key] = {
        'group': group,
        'file': file_title,
        'source': info.get('descriptionurl'),
        'author': clean(meta.get('Artist', {}).get('value', '')) or 'okänd',
        'license': lic,
        'licenseUrl': clean(meta.get('LicenseUrl', {}).get('value', '')),
        'credit': clean(meta.get('Credit', {}).get('value', '')),
    }
    return target, lic

def load_credits():
    return json.loads(CREDITS.read_text()) if CREDITS.exists() else {}

def write_credits(credits):
    """Slår ihop med filen på disk så att två samtidiga körningar inte skriver över varandras krediter."""
    credits.update({k: v for k, v in load_credits().items() if k not in credits})
    CREDITS.write_text(json.dumps(credits, ensure_ascii=False, indent=1, sort_keys=True))

def main():
    force = '--force' in sys.argv
    only = [a for a in sys.argv[1:] if not a.startswith('--')]
    groups = [a.split('=', 1)[1] for a in sys.argv[1:] if a.startswith('--group=')]
    catalog = json.loads(CATALOG.read_text())
    credits = load_credits()
    OUT.mkdir(parents=True, exist_ok=True)
    failed = []
    for group, items in catalog.items():
        if groups and group not in groups:
            continue
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
                info = image_info(file_title, THUMB_W.get(group, 700))
                if not info:
                    raise RuntimeError(f'ingen bildinfo för {file_title}')
                target, lic = save_image(key, group, file_title, info, credits)
                write_credits(credits)
                print(f'✓ {key:16} {target.stat().st_size // 1024:3d} kB  {lic:18} {file_title[:60]}', flush=True)
                time.sleep(1.2)
            except Exception as e:
                failed.append((key, src, str(e)))
                print(f'✗ {key:16} {src}: {e}', flush=True)
                time.sleep(3)
    write_credits(credits)
    print(f'\n{len(credits)} bilder med licens. {len(failed)} misslyckades.')
    for f in failed:
        print('  ', *f)

if __name__ == '__main__':
    main()
