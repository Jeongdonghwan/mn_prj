"""블로그 시공 사진 → data/cases.json + public/img/<id>.webp (긴 변 1200) + og 배경용 jpg 몇 장
   python -I scripts/prepare_images.py
원본: source/blog_img/<글번호>_<n>.jpg (scripts/fetch_blog_img.py), 고른 사진 목록: source/cases_src.json
  [{"src": "<글번호>_<n>", "space": "짧은 제목", "scene": "장면 한 문장", "where": "현장 표기(글에 나온 것)", "city": "시군 또는 null",
    "place": "places.json 키 또는 null", "tags": ["서비스 키", "top"]}]
뺀 사진: 사람 얼굴·전화번호·차량번호가 보이는 것, 제조사 홍보 이미지·글자 배너, 흐린 사진.
tags = lib/compose.ts SVC 키(난방·분배기·보일러·온수기·누수·해빙·하수구·배관·위생기구·욕실·집수리·단열지붕) + 'top'(페이지 상단에 쓸 만한 가로 사진)
"""
import json
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'source' / 'blog_img'
OUT = ROOT / 'public' / 'img'
shots = json.loads((ROOT / 'source' / 'cases_src.json').read_text(encoding='utf-8'))
posts = {}
for f in (ROOT / 'source' / 'blog').glob('2*.json'):
    d = json.loads(f.read_text(encoding='utf-8'))
    posts[d['logNo']] = d

cases = []
OUT.mkdir(parents=True, exist_ok=True)
for i, s in enumerate(shots, 1):
    log = s['src'].split('_')[0]
    cid = f'w{i:03d}'
    im = ImageOps.exif_transpose(Image.open(SRC / f"{s['src']}.jpg")).convert('RGB')
    im.thumbnail((1200, 1200), Image.LANCZOS)
    im.save(OUT / f'{cid}.webp', 'WEBP', quality=78)
    if 'top' in s['tags'] and not (OUT / f'{cid}.jpg').exists():  # og 배경용
        im.save(OUT / f'{cid}.jpg', 'JPEG', quality=80, optimize=True, progressive=True)
    p = posts[log]
    cases.append(dict(id=cid, logNo=log, date=p['date'], where=s['where'], city=s.get('city'), place=s.get('place'),
                      post=p['title'][:60], space=s['space'], scene=s['scene'], tags=s['tags'], w=im.width, h=im.height,
                      url=f'https://blog.naver.com/jin3652/{log}'))
(ROOT / 'data' / 'cases.json').write_text(json.dumps({'cases': cases}, ensure_ascii=False, indent=1), encoding='utf-8')
print('사진', len(cases), '글', len({c['logNo'] for c in cases}))
