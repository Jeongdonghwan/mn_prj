# 만능설비박사 SEO 사이트 — 기획·운영

만능설비박사.kr (`xn--9h1bq9kg0b45cb8drua.kr`) — 안성의 주택설비·난방 업체(상호 만능하우징설비 · 만능다수리보수, 대표 박영진) 지역 SEO 사이트.
Next.js 14 정적 export. 우리배관설비(woori_prj) 코드·레이아웃을 복사해 색·글·데이터만 바꿨다 (사용자: "우리배관설비 디자인 비슷하게", 2026-11-22).

## 사용자 결정 (2026-11-22)
- 사이트 이름 **만능설비박사**. 전화는 대표 010-8742-6322 하나만(긴급·사무실·팩스 안 넣음). 메일·계좌번호 안 넣음
- 집수리 관련 키워드 포함. 키워드 39,678개(`keywords/만능설비박사_키워드.xlsx`, region_kw_prj/scripts/gen_mnhousing.py)
- **오픈일 8,000페이지 → 다음 날부터 하루 1,000페이지** (33묶음, 32일째 끝) — `scripts/build_pages.py`, `data/drip.json` (everyDays 1, maxWave 33, maxDays 32)
- **블로그 하루 5편 × 30일 = 150편** (`content/blog`, 프런트매터 date 로 예약 공개, postsPerDay 5)
- **FAQ·Q&A 메뉴 필수** — `/qna/` + 질문 페이지 90개(`content/qna`), 오픈일 30개 → 하루 2개 나눠 공개. 스킬(site-launch·post-launch)에도 필수로 넣음
- 쇼핑몰 따스몰.com, 인스타 youngjin2475, 블로그 jin3652, 기존 홈페이지 mnhousing.waplus.kr 링크

## 구조
| 경로 | 내용 |
|---|---|
| `/` | 히어로(두 버튼), 원인 설명, 전문 4분야, 장비, 시공 사례, 상담 상자, 작업 절차(사진 카드), 지역, FAQ+Q&A, 블로그, 쇼핑몰·SNS |
| `/service/`, `/service/<키>/` | 서비스 12묶음(난방·온수기·분배기·보일러·누수·해빙·하수구·배관·위생기구·욕실·집수리·단열지붕) 허브 |
| `/qna/`, `/qna/<slug>/` | 자주 묻는 질문 — 첫 문단 직접 답, FAQPage JSON-LD. 아직 안 열린 글·Q&A로 가는 본문 링크는 글자만(lib/links.ts) |
| `/area/`, `/area/<시군>/` | 10개 시·군 허브 |
| `/<키워드>/` | 키워드 페이지 (lib/compose.ts 조합기) |
| `/cases/` | 블로그 시공 사진 (`source/cases_src.json` → `scripts/prepare_images.py`) |
| `/blog/` | 설비 궁금증 블로그 |

## 사실 근거
`source/FACTS.md` — 업체 카톡·명함, 기존 홈페이지(영업안내 이미지, 푸터의 사업자번호·주소), 블로그 jin3652 95편(`source/blog/*.json`).
가격·경력 연수·보증 기간·건수 숫자, 24시간·당일 출동 약속은 쓰지 않는다. 기존 홈페이지 사람 사진은 스톡, 제품 사진은 제조사 것이라 쓰지 않는다.
지역 데이터 `data/places.json`(174곳, 생성 스크립트 `scripts/places_src.py`) — 확인 못 한 학교·우체국 장소는 행정복지센터·소재지 마을로 바꿨다(다시 생성하면 되살아나므로 주의).

## 명령
```bash
python -I scripts/build_pages.py       # 엑셀 → data/site-pages.json + 묶음
python -I scripts/prepare_images.py    # source/cases_src.json → public/img/w###.webp + data/cases.json
OPEN_WAVE=1 python -I scripts/make_og.py
bash scripts/deploy.sh <묶음> https://xn--9h1bq9kg0b45cb8drua.kr
python -I scripts/drip/drip_status.py data/drip.json   # 오늘 묶음·글 수
```

## 디자인
woori 레이아웃 그대로, 색만 기존 만능하우징설비 로고에서: 짙은 청회색 #1b3a47(주) + 주황 #f2762e(강조) + 옅은 청회색 #e7f0f2. 파비콘 = 청회색 둥근 사각 + 흰 집 + 주황 물방울.
모바일은 상단 메뉴 아래 한 줄(시공 분야·시공 사례·Q&A·지역).

## h1 수식어·레이 구조 적용(2026-11-24)
키워드 페이지(열린 묶음 2 기준 9,000쪽, 전체 39,678쪽 같은 조합기): h1 = 키워드 + 수식어(`.hero-sub`, 수식어 묶음별 3~4벌 해시, 키워드 속 지역명 반복 없음), 분류 줄 → 설명 → "{키워드} 핵심 요약"(결론 + 정보 칸 4) → 번호 절 6개(한 문단, 4개 h2에 키워드 전체) → 블로그 사진 3 → "{키워드} 자주 묻는 질문" → 관련 링크. description 45~80자(키워드 — 관련 링크에 있는 다른 시공 2~3개 · 페이지 사실 · 상담 010-8742-6322). 조합기 `lib/compose.ts` 의 `ray()`·`desc80()`, 점검 `python -I scripts/ray_check.py out --group word,mod`.
측정(빌드 결과, 묶음 2): h1 중복 0 · description 60~80자 중복 0 · 키워드 든 h2 평균 7.0 · 절 문단 평균 231자(공백 제외) · 본문 평균 2,270자 · 내부링크 11~15 · 같은 주제(단어·수식어) 같은 문장 평균 12.8% 최대 26.5% · 같은 동네 평균 34.1% · 조사 의심 0. check_all 전 항목 통과. 기존 조합기 view 문장의 조사 오류(`${wl}은`)도 같이 고침.

키워드 페이지 title(2026-11-24): `{키워드} {h1 수식어} | {상호}` — h1 과 같은 글자, og·twitter title 도 같은 값. "키워드+수식어" 40자를 넘으면 더 짧은 수식어 벌로(`fitSub`). 점검 `OPEN_WAVE=<묶음> node scripts/title_check.js`(빌드 없이 조합기) · ray_check.py 에도 추가. 측정: title 길이 31~49자 · 중복 0 · h1 과 다른 것 0 · 길이 초과(전체 60·앞 40) 0.
