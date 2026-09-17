from pathlib import Path
import base64
import re

import pillow_avif  # registers AVIF support in Pillow
from PIL import Image
from io import BytesIO

ROOT = Path(__file__).resolve().parents[1]
HTML = ROOT / 'materials/riimid-preview/online/index.html'
OUT = ROOT / 'materials/riimid-preview/files'
OUT.mkdir(parents=True, exist_ok=True)

text = HTML.read_text(encoding='utf-8')
payloads = re.findall(r'data:image/avif;base64,([A-Za-z0-9+/=]+)', text)
if len(payloads) != 18:
    raise SystemExit(f'Expected 18 AVIF cards, found {len(payloads)}')

cards = []
for payload in payloads:
    with Image.open(BytesIO(base64.b64decode(payload))) as im:
        cards.append(im.convert('RGB').copy())

PAGE_W, PAGE_H = 2480, 3508  # A4 at 300 dpi


def make_pdf(per_page, cols, rows, card_w, gap_x, gap_y, filename):
    card_h = round(card_w * cards[0].height / cards[0].width)
    grid_w = cols * card_w + (cols - 1) * gap_x
    grid_h = rows * card_h + (rows - 1) * gap_y
    left = (PAGE_W - grid_w) // 2
    top = (PAGE_H - grid_h) // 2
    pages = []
    for start in range(0, len(cards), per_page):
        page = Image.new('RGB', (PAGE_W, PAGE_H), 'white')
        for slot, card in enumerate(cards[start:start + per_page]):
            row, col = divmod(slot, cols)
            resized = card.resize((card_w, card_h), Image.Resampling.LANCZOS)
            page.paste(resized, (left + col * (card_w + gap_x), top + row * (card_h + gap_y)))
        pages.append(page)
    target = OUT / filename
    pages[0].save(target, 'PDF', save_all=True, append_images=pages[1:], resolution=300.0, quality=92, subsampling=0)
    print(f'Built {target.relative_to(ROOT)} ({len(pages)} pages)')


make_pdf(6, 2, 3, 1060, 90, 65, 'EDUKASS_Riimikaardid_A4_6_kaarti.pdf')
make_pdf(9, 3, 3, 710, 70, 55, 'EDUKASS_Riimikaardid_A4_9_kaarti.pdf')
