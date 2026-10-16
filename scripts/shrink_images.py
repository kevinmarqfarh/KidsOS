#!/usr/bin/env python3
"""Krymper de inbäddade fotona i assets/img till de storlekar som faktiskt visas (se docs/PRESTANDA.md).

- Gruppen "objects" (emoji-ersättare, miniatyrer): max 240 px, WebP q60
- Övriga motivbilder: max 480 px, WebP q62
- Bilder som redan är högst så stora rörs inte (ingen omkomprimering).
- Månfaserna (400 px) rörs inte.

Samma mål används av scripts/fetch_images.py för nya bilder. Skriptet är idempotent:
assets/img-optimized.json minns kontrollsumman för varje fil det har skrivit, så att en
bild aldrig komprimeras om (och tappar kvalitet) vid nästa körning.

Kör: python3 scripts/shrink_images.py [--dry-run]
"""
import hashlib, json, sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
IMG = ROOT / 'assets' / 'img'
CREDITS = json.loads((ROOT / 'assets' / 'credits.json').read_text())
MANIFEST = ROOT / 'assets' / 'img-optimized.json'
TARGET = {'objects': (240, 60), 'lifecycle': (240, 60), 'moon': None}
DEFAULT = (480, 62)

def sha(p):
    return hashlib.sha1(p.read_bytes()).hexdigest()

def main(dry):
    done = json.loads(MANIFEST.read_text()) if MANIFEST.exists() else {}
    before = after = changed = 0
    for path in sorted(IMG.glob('*.webp')):
        key = path.stem
        size0 = path.stat().st_size
        before += size0
        group = (CREDITS.get(key) or {}).get('group')
        target = TARGET.get(group, DEFAULT)
        if target is None or done.get(key) == sha(path):
            after += size0
            continue
        size, q = target
        im = Image.open(path)
        im.load()
        if max(im.size) <= size:
            after += size0  # redan liten nog: komprimera inte om
            continue
        im = im.convert('RGB')
        im.thumbnail((size, size), Image.LANCZOS)
        if not dry:
            im.save(path, 'WEBP', quality=q, method=6)
            done[key] = sha(path)
            after += path.stat().st_size
        changed += 1
    if not dry:
        MANIFEST.write_text(json.dumps(done, indent=0, sort_keys=True) + '\n')
    print(f'{changed} bilder krympta: {before // 1024} kB → {after // 1024} kB')

if __name__ == '__main__':
    main('--dry-run' in sys.argv)
