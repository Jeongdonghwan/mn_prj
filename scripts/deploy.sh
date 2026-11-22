#!/usr/bin/env bash
# 빌드 결과(out/)만 deploy 브랜치로 올린다. 서버는 deploy 브랜치를 받아 nginx로 서빙.
#   bash scripts/deploy.sh <묶음 1~33> <https://도메인>
# 서버 갱신: cd /var/www/<폴더> && git fetch -q origin deploy && git reset -q --hard origin/deploy
set -euo pipefail
WAVE=${1:?묶음(1~33)}; URL=${2:?https://도메인}
cd "$(dirname "$0")/.."
OPEN_WAVE=$WAVE python -I scripts/make_og.py  # og 이미지(public/og, git 제외) 열린 묶음까지 없는 것만 생성
rm -rf out
OPEN_WAVE=$WAVE SITE_URL=$URL npx next build
rm -rf out/blog/_none out/qna/_none  # 글·Q&A 0편일 때 빌드용 자리표시
grep -q "$URL" out/sitemap.xml || { echo "sitemap에 도메인이 없음"; exit 1; }
python -I scripts/postbuild.py out   # lastmod·sitemap split·llms.txt
# 열린 페이지가 쓰는 og 이미지만 남긴다 (안 열린 키워드 파일명 노출·용량 방지)
python -I - <<'PY'
import json, os, urllib.parse
from pathlib import Path
out = Path('out')
keep = {'home', 'area', 'cases', 'service', 'qna'} | {f'area-{d.name}' for d in (out / 'area').iterdir() if d.is_dir()}
keep |= {f'service-{d.name}' for d in (out / 'service').iterdir() if d.is_dir()}
keep |= {f'qna-{d.name}' for d in (out / 'qna').iterdir() if d.is_dir()} if (out / 'qna').is_dir() else set()
keep |= {'blog'} | ({f'blog-{d.name}' for d in (out / 'blog').iterdir() if d.is_dir()} if (out / 'blog').is_dir() else set())
keep |= {p['slug'] for p in json.load(open('data/site-pages.json', encoding='utf-8'))['pages'] if (out / p['slug'] / 'index.html').exists()}
n = 0
for f in (out / 'og').glob('*.jpg'):
    if f.stem not in keep:
        f.unlink(); n += 1
print('og 정리: 지운 파일', n)
PY
REMOTE=$(git remote get-url origin)
# 바뀐 파일만 올린다 — deploy 브랜치 기록을 .deploy.git 에 남겨 두고 그 위에 커밋 (매번 새로 만들어 강제 푸시하면
# og 이미지(압축 안 됨, 1쪽 약 56KB)까지 매일 통째로 올라가 4만 쪽 무렵 GitHub 한 번 푸시 한도 2GB 를 넘는다 — 오픈일 실측 498MB)
GD="$PWD/.deploy.git"
if [ ! -d "$GD" ]; then
  git --git-dir="$GD" init -q -b deploy
  git --git-dir="$GD" fetch -q "$REMOTE" deploy 2>/dev/null && git --git-dir="$GD" reset -q --soft FETCH_HEAD || true
fi
git --git-dir="$GD" --work-tree=out add -A
git --git-dir="$GD" --work-tree=out -c user.name="$(git config user.name)" -c user.email="$(git config user.email)" \
  commit -q -m "deploy: ${WAVE}단계 $(date +%F)" || echo "바뀐 파일 없음"
git --git-dir="$GD" push -q "$REMOTE" deploy
echo "deploy 브랜치 갱신 완료: ${WAVE}단계, $(find out -name '*.html' | wc -l) html"
