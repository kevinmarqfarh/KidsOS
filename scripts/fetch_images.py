#!/usr/bin/env python3
"""Hämtar riktiga bilder till KidsOS från Wikipedia/Wikimedia Commons (inkl. NASA:s public domain-bilder).

- Läser assets/image-catalog.json  (nyckel → "sv:Artikel", "en:Article" eller "File:Filnamn")
- Tar artikelns huvudbild, kontrollerar att licensen är fri (public domain / CC0 / CC BY / CC BY-SA)
- Sparar som WebP (max 480 px q62, gruppen "objects" max 240 px q60) i assets/img/<nyckel>.webp
- Skriver upphovsperson och licens till assets/credits.json

Kör: python3 scripts/fetch_images.py [--force] [nyckel ...]
"""
import io, json, os, re, sys, time, html, random, urllib.parse, urllib.request
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
CATALOG = ROOT / 'assets' / 'image-catalog.json'
OUT = ROOT / 'assets' / 'img'
CREDITS = ROOT / 'assets' / 'credits.json'
UA = 'KidsOS/1.0 (family learning app; contact: kevin.marqfarh@gmail.com)'
MAX = 480  # motivbilder (prestanda: se docs/PRESTANDA.md och scripts/shrink_images.py)
# Storlek och kvalitet per grupp: föremål och livscykelsteg visas som små miniatyrer.
SIZES = {'objects': (240, 60), 'lifecycle': (240, 60), 'moon': (400, 70)}
THUMB_W = {'objects': 500, 'lifecycle': 500, 'moon': 1280}  # standardbredder hos Wikimedia (250/330/500/960 …)
MIN_GAP = 1.2  # sekunder mellan anrop (Wikimedia delar gränser per IP)
_last = [0.0]
FREE = re.compile(r'public domain|^pd|cc0|cc[ -]by|^no restrictions$|^attribution$', re.I)

def get(url, binary=False, tries=8):
    """GET med User-Agent. Respekterar 429/Retry-After med backoff (Wikimedia delar IP-gränser)."""
    for i in range(tries):
        gap = time.time() - _last[0]
        if gap < MIN_GAP:
            time.sleep(MIN_GAP - gap)
        _last[0] = time.time()
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA})
            with urllib.request.urlopen(req, timeout=40) as r:
                data = r.read()
                return data if binary else json.loads(data)
        except urllib.error.HTTPError as e:
            if e.code == 429 or e.code >= 500:
                wait = int(e.headers.get('Retry-After') or 0) or (5 + i * 8)
                print(f'  … {e.code}, väntar {wait} s', flush=True)
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

# Valfri cache (KIDSOS_IMG_CACHE=katalog): sparar bildinfo och originalbytes så att bilder kan
# beskäras/komprimeras om utan nya anrop till Wikimedia.
CACHE = os.environ.get('KIDSOS_IMG_CACHE')

def _cache_path(name, ext):
    return Path(CACHE) / (re.sub(r'[^A-Za-z0-9._-]+', '_', name)[:150] + ext)

_PREFETCHED = {}

def prefetch_infos(titles_by_width):
    """Hämtar bildinfo för många filer i samma anrop (40 åt gången) – sparar på Wikimedias anropsgräns."""
    for width, titles in titles_by_width.items():
        todo = sorted({t for t in titles if (t, width) not in _PREFETCHED})
        for i in range(0, len(todo), 40):
            chunk = todo[i:i + 40]
            q = urllib.parse.urlencode({'action': 'query', 'titles': '|'.join(chunk), 'prop': 'imageinfo', 'iiprop': 'url|extmetadata|size', 'iiurlwidth': width, 'format': 'json'})
            d = get(f'https://commons.wikimedia.org/w/api.php?{q}')['query']
            names = {x['to']: x['from'] for x in d.get('normalized', [])}
            for p in d['pages'].values():
                if 'imageinfo' in p:
                    _PREFETCHED[(names.get(p['title'], p['title']), width)] = p['imageinfo'][0]
                    _PREFETCHED[(p['title'], width)] = p['imageinfo'][0]

def image_info(file_title, width=700):
    if (file_title, width) in _PREFETCHED:
        return _PREFETCHED[(file_title, width)]
    if CACHE and _cache_path(f'{file_title}-{width}', '.json').exists():
        return json.loads(_cache_path(f'{file_title}-{width}', '.json').read_text())
    info = _image_info(file_title, width)
    if CACHE and info:
        Path(CACHE).mkdir(parents=True, exist_ok=True)
        _cache_path(f'{file_title}-{width}', '.json').write_text(json.dumps(info))
    return info

def _image_info(file_title, width=700):
    q = urllib.parse.urlencode({'action': 'query', 'titles': file_title, 'prop': 'imageinfo', 'iiprop': 'url|extmetadata|size', 'iiurlwidth': width, 'format': 'json'})
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

def moon_crop(im, key):
    """Beskär ett månfoto så att hela måndisken (även den mörka delen) hamnar mitt i en kvadrat.
    Månens kant (limben) på den belysta sidan hittas rad för rad och en cirkel anpassas till punkterna
    (minsta kvadrat). Växande måne (norra halvklotet) är belyst till höger, avtagande till vänster."""
    import numpy as np
    g = np.asarray(im.convert('L'), dtype=np.float32)
    thr = max(28.0, float(np.percentile(g, 99.5)) * 0.22)
    mask = g > thr
    rows = np.where(mask.any(axis=1))[0]
    if len(rows) < 10:
        return im
    side_r = 'waxing' in key or 'first' in key
    side_l = 'waning' in key or 'last' in key
    pts = []
    for y in rows[:: max(1, len(rows) // 400)]:
        xs = np.where(mask[y])[0]
        if not side_l:
            pts.append((xs[-1], y))
        if not side_r:
            pts.append((xs[0], y))
    p = np.array(pts, dtype=np.float64)
    A = np.c_[p[:, 0], p[:, 1], np.ones(len(p))]
    bvec = -(p[:, 0] ** 2 + p[:, 1] ** 2)
    (D, E, F), *_ = np.linalg.lstsq(A, bvec, rcond=None)
    cx, cy = -D / 2, -E / 2
    rad = float(np.sqrt(max(cx * cx + cy * cy - F, 1)))
    side = rad * 2 * 1.18
    # Fyll utanför originalbilden med bakgrundens färg (medianen i hörnen) så att ingen kant syns.
    arr = np.asarray(im.convert('RGB'))
    k = max(4, min(arr.shape[:2]) // 40)
    corners = np.concatenate([arr[:k, :k].reshape(-1, 3), arr[:k, -k:].reshape(-1, 3), arr[-k:, :k].reshape(-1, 3), arr[-k:, -k:].reshape(-1, 3)])
    bg = tuple(int(v) for v in np.median(corners, axis=0))
    out = Image.new('RGB', (int(side), int(side)), bg)
    l, t = int(cx - side / 2), int(cy - side / 2)
    out.paste(im.convert('RGB'), (-l, -t))
    return out

def save_image(key, group, file_title, info, credits, data=None):
    """Konverterar en hämtad bild till WebP och skriver krediten. `data` kan vara redan hämtade bytes."""
    meta = info.get('extmetadata', {})
    lic = license_of(info)
    if not FREE.search(lic):
        raise RuntimeError(f'icke-fri licens: {lic}')
    if data is None:
        # Be aldrig om en miniatyr som är större än originalet (Wikimedia svarar då 429) – ta originalet.
        src_url = info['url'] if info.get('width') and info.get('thumbwidth', 0) >= info['width'] else info['thumburl']
        cp = _cache_path(src_url.rsplit('/', 1)[-1], '.bin') if CACHE else None
        if cp and cp.exists():
            data = cp.read_bytes()
        else:
            data = get(src_url, binary=True)
            if cp:
                cp.write_bytes(data)
    size, quality = SIZES.get(group, (MAX, 62))
    im = Image.open(io.BytesIO(data))
    if im.mode in ('P', 'LA', 'RGBA', 'PA'):
        bg = Image.new('RGB', im.size, (255, 255, 255))
        im = im.convert('RGBA')
        bg.paste(im, mask=im.split()[-1])
        im = bg
    im = im.convert('RGB')
    if group == 'moon':
        im = moon_crop(im, key)
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
    want = {}
    for group, items in catalog.items():
        if groups and group not in groups:
            continue
        for key, src in items.items():
            if src.startswith('File:') and (not only or key in only) and (force or not ((OUT / f'{key}.webp').exists() and key in credits)):
                want.setdefault(THUMB_W.get(group, 960), []).append(src)
    try:
        prefetch_infos(want)
    except Exception as e:  # faller tillbaka på ett anrop per bild
        print(f'  (förhämtning misslyckades: {e})', flush=True)
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
                info = image_info(file_title, THUMB_W.get(group, 960))
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
