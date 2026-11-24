"""화면 주요 자리(히어로·장비 카드·작업 절차)에 쓰는 실제 시공 사진을 보정해 다시 저장하고, 사진이 없는 장비는 그래픽 카드를 만든다.
   python -I scripts/enhance_photos.py
- 사진: 원본(source/blog_img) → 긴 변 1200px 로 LANCZOS 확대 + 약한 선명도·대비 보정 → public/img/<id>.webp (+ data/cases.json 의 w·h 갱신)
  원본 대부분이 480~800px 라 확대하면 흐려진다 — 선명도 보정으로 덜 흐려 보이게 할 뿐, 원본보다 정보가 늘지는 않는다.
- 그래픽 카드: 실제 사진이 없는 장비(열화상 카메라·배관 관로 탐지기)는 사진처럼 보이는 이미지를 만들지 않고 아이콘 카드로 둔다(남의 사진·AI 사진 금지).
"""
import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC, OUT = ROOT / 'source' / 'blog_img', ROOT / 'public' / 'img'
shots = json.loads((ROOT / 'source' / 'cases_src.json').read_text(encoding='utf-8'))
idx = {s['src']: f'w{i:03d}' for i, s in enumerate(shots, 1)}

# 화면 자리에 고정으로 쓰는 사진(원본 이름) — app/page.tsx·lib/compose.ts 와 같은 목록
PICK = ['221786304434_03',  # 히어로: 난방관 세척 작업
        '220948937558_00', '221250080747_02', '220948925998_00',  # 장비: 고압세척·청음식 누수탐지·하수관 내시경
        '221785103584_00', '221448417927_01', '221186860218_01', '220948986705_01', '220968338036_00']  # 작업 절차 1~5

cases_p = ROOT / 'data' / 'cases.json'
cases = json.loads(cases_p.read_text(encoding='utf-8'))
by_id = {c['id']: c for c in cases['cases']}
for src in PICK:
    cid = idx[src]
    im = ImageOps.exif_transpose(Image.open(SRC / f'{src}.jpg')).convert('RGB')
    s = 1200 / max(im.size)
    if s > 1: im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    im = im.filter(ImageFilter.UnsharpMask(radius=1.6, percent=70, threshold=2))
    im = ImageEnhance.Contrast(im).enhance(1.06)
    im = ImageEnhance.Color(im).enhance(1.05)
    im.save(OUT / f'{cid}.webp', 'WEBP', quality=84, method=6)
    if (OUT / f'{cid}.jpg').exists(): im.save(OUT / f'{cid}.jpg', 'JPEG', quality=84, optimize=True, progressive=True)
    by_id[cid].update(w=im.width, h=im.height)
    print(cid, src, im.size)
cases_p.write_text(json.dumps(cases, ensure_ascii=False, indent=1), encoding='utf-8')

# 그래픽 카드 (4:3) — 사이트 색: 남색 #1b3a47, 주황 #f2762e
FONT_B = 'C:/Windows/Fonts/malgunbd.ttf'
W, H = 1200, 900
NAVY, NAVY2, ORANGE, WHITE = (27, 58, 71), (17, 38, 47), (242, 118, 46), (255, 255, 255)


def tile(fname, label, draw_icon):
    im = Image.new('RGB', (W, H), NAVY)
    d = ImageDraw.Draw(im)
    for y in range(H):  # 위→아래 짙어지는 바탕
        t = y / H
        d.line([(0, y), (W, y)], fill=tuple(round(a + (b - a) * t) for a, b in zip(NAVY, NAVY2)))
    for x in range(0, W, 60):  # 옅은 격자
        d.line([(x, 0), (x, H)], fill=(36, 70, 84))
    for y in range(0, H, 60):
        d.line([(0, y), (W, y)], fill=(36, 70, 84))
    draw_icon(d, W // 2, 450)   # 이름은 카드 제목(h3)에 있으니 그림에는 넣지 않는다(두 번 나오지 않게)
    im.save(OUT / fname, 'WEBP', quality=88, method=6)
    print(fname)


def thermal(d, cx, cy):  # 열화상 카메라: 몸체·렌즈·손잡이 + 화면 속 온도 띠
    lw = 12
    d.rounded_rectangle([cx - 230, cy - 150, cx + 150, cy + 90], 28, outline=ORANGE, width=lw)
    d.ellipse([cx + 150 - 10, cy - 110, cx + 250, cy + 50], outline=ORANGE, width=lw)
    d.rounded_rectangle([cx - 120, cy + 90, cx - 40, cy + 230], 18, outline=ORANGE, width=lw)
    for i, c in enumerate([(70, 110, 200), (90, 170, 160), (230, 200, 80), (242, 118, 46), (220, 60, 50)]):
        d.rectangle([cx - 190 + i * 62, cy - 100, cx - 190 + i * 62 + 54, cy + 40], fill=c)


def locator(d, cx, cy):  # 배관 관로 탐지기: 탐지봉 + 땅속 관 + 신호 파동
    lw = 12
    d.line([(cx - 330, cy + 120), (cx + 330, cy + 120)], fill=ORANGE, width=lw)
    d.rounded_rectangle([cx - 300, cy + 170, cx + 300, cy + 230], 30, outline=ORANGE, width=lw)
    d.line([(cx, cy - 230), (cx, cy + 60)], fill=ORANGE, width=lw)
    d.rounded_rectangle([cx - 70, cy - 290, cx + 70, cy - 190], 18, outline=ORANGE, width=lw)
    d.rounded_rectangle([cx - 50, cy + 40, cx + 50, cy + 90], 12, outline=ORANGE, width=lw)
    for r in (90, 150, 210):
        d.arc([cx - r, cy + 200 - r, cx + r, cy + 200 + r], 200, 340, fill=WHITE, width=6)


tile('tool-thermal.webp', '열화상 카메라', thermal)
tile('tool-locator.webp', '배관 관로 탐지기', locator)
