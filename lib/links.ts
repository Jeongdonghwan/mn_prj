// 본문 속 내부 링크가 지금 열린 주소인지 — 나눠 공개 중 아직 안 열린 Q&A·글·키워드 페이지로 가는 링크는 글자만 남긴다(404 방지)
import { getPosts } from './blog';
import { getQnas } from './qna';
import { OPEN_PAGES } from './data';
import { SVC } from './compose';

let live: Set<string> | null = null;
export function isLive(href: string): boolean {
  if (!live) {
    live = new Set<string>(['/', '/qna/', '/blog/', '/cases/', '/area/', '/service/', '/about/']);
    for (const p of getPosts()) live.add(`/blog/${p.slug}/`);
    for (const x of getQnas()) live.add(`/qna/${x.slug}/`);
    for (const p of OPEN_PAGES) { live.add(`/${p.slug}/`); live.add(`/area/${p.city}/`); }
    for (const k of Object.keys(SVC)) live.add(`/service/${k}/`);
  }
  let h = href.split('#')[0];
  try { h = decodeURIComponent(h); } catch {}
  if (!h.endsWith('/')) h += '/';
  return live.has(h);
}
