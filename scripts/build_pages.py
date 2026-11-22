"""키워드 엑셀 → data/site-pages.json (사이트 라우트의 단일 출처) + keywords/만능설비박사_페이지.xlsx

  python -I scripts/build_pages.py

원본: keywords/만능설비박사_키워드.xlsx (region_kw_prj/scripts/gen_mnhousing.py 가 만든 것, 키워드 시트 39,678행, 우선순위 순)
오픈 묶음(wave) — 사용자 결정 2026-11-22: 오픈일 8,000 → 다음 날부터 하루 1,000 (엑셀 위에서부터 순서 그대로)
  wave 1 = 1~8,000행, wave 2 = 8,001~9,000, … (data/drip.json everyDays=1, maxWave 와 같게)
표기 변형은 엑셀에서 이미 행이 아니라 '표기변형(alt)' 열로 빠져 있어 variantOf 는 없다.
"""
import json, math, sys
from collections import Counter
from pathlib import Path
from openpyxl import Workbook, load_workbook
from openpyxl.styles import Font, PatternFill, Alignment

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'keywords' / '만능설비박사_키워드.xlsx'
OUT_XLSX = ROOT / 'keywords' / '만능설비박사_페이지.xlsx'
SITE_URL = 'https://xn--9h1bq9kg0b45cb8drua.kr'  # lib/site.ts 와 같게
FIRST, DAILY = 8000, 1000

# 엑셀 '단어' → 서비스 묶음 (lib/compose.ts SVC 키 = /service/<키>/)
GROUPS = {
    '난방': ['건식난방', '건식온수난방', '건식난방시공', '쭌난방', '습식난방', '바닥난방공사', '마루시공'],
    '분배기': ['분배기교체', '난방분배기교체', '각방밸브', '난방배관청소', '보일러배관청소'],
    '보일러': ['보일러설치', '보일러교체', '보일러수리', '보일러누수'],
    '온수기': ['전기온수기설치', '온수기설치', '온수기교체', '대형전기온수기', '중대형 전기온수기', '상가 전기온수기', '공장 전기온수기', '농장 전기온수기'],
    '누수': ['누수탐지', '누수공사', '수도누수', '상가 누수탐지', '공장 누수탐지'],
    '해빙': ['수도해빙', '수도동파', '하수구해빙', '오배수관해빙', '동파방지공사'],
    '하수구': ['하수구고압세척', '고압세척', '하수구막힘', '하수구공사', '하수관공사', '오배수관역류', '맨홀공사', '정화조설치', '상가 하수구막힘'],
    '배관': ['배관공사', '배관수리', '노후배관교체'],
    '위생기구': ['양변기교체', '세면기교체', '소변기교체'],
    '욕실': ['화장실공사', '화장실리모델링', '욕실리모델링', '욕실공사', '방수공사'],
    '집수리': ['집수리', '주택수리', '집보수', '주택보수', '칸막이공사', '원룸리모델링', '상가리모델링'],
    '단열지붕': ['단열공사', '단열시공', '창호공사', '지붕공사', '지붕개량'],
}
SERVICE = {w: g for g, ws in GROUPS.items() for w in ws}
UNIT = {'시·군': '시·군', '구': '시·군·구', '생활권': '생활권', '동·읍면': '동·읍면'}

places = json.load(open(ROOT / 'data' / 'places.json', encoding='utf-8'))['places']
rows = list(load_workbook(SRC, read_only=True)['키워드'].iter_rows(values_only=True))[1:]
pages = []
for i, r in enumerate(rows, 1):
    no, kw, prio, _, _, label, up, unit, word, mod, alt, slug = r[:12]
    assert label in places, f'지역 데이터 없음: {label} ({kw})'
    assert word in SERVICE, word
    pages.append(dict(n=no, no=i, kw=kw, slug=slug, label=label, place=label, city=places[label]['city'], word=word,
                      service=SERVICE[word], mod=mod or '', unit=UNIT[unit], prio=prio,
                      wave=1 if i <= FIRST else 2 + (i - FIRST - 1) // DAILY))
assert all(v == 1 for v in Counter(p['slug'] for p in pages).values())
json.dump({'pages': pages}, open(ROOT / 'data' / 'site-pages.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)

wb = Workbook()
ws = wb.active
ws.title = '키워드'
ws.append(['No', '키워드', '우선순위', '시·군', '지역 표기', '지역 단위', '단어', '서비스', '수식어', 'URL', '오픈 묶음'])
for p in pages:
    ws.append([p['no'], p['kw'], p['prio'], p['city'], p['label'], p['unit'], p['word'], p['service'], p['mod'],
               f"{SITE_URL}/{p['slug']}/", p['wave']])
for c in ws[1]:
    c.font = Font(bold=True, color='FFFFFF')
    c.fill = PatternFill('solid', fgColor='1B2B6B')
    c.alignment = Alignment(horizontal='center')
for col, w in zip('ABCDEFGHIJK', [7, 32, 8, 8, 16, 10, 16, 9, 9, 60, 9]):
    ws.column_dimensions[col].width = w
ws.freeze_panes = 'A2'
wb.save(OUT_XLSX)

sys.stdout.reconfigure(encoding='utf-8')
c = Counter(p['wave'] for p in pages)
print(f"페이지 {len(pages)} / 묶음 {len(c)}개 (1번 {c[1]}, 2번 {c[2]}, 마지막 {max(c)}번 {c[max(c)]})")
print('서비스:', dict(Counter(p['service'] for p in pages)))
assert c[1] == FIRST and math.ceil((len(pages) - FIRST) / DAILY) + 1 == max(c)
