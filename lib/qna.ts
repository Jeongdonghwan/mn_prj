// Q&A 로더 — content/qna/*.md (프런트매터 q·title·description·service·date + 첫 문단 = 직접 답 + '##' 섹션).
// 나눠 공개: date 가 빌드일(BUILD_DATE)보다 미래면 목록·페이지·sitemap·rss·og 전부에서 빠진다 (블로그와 같은 규칙).
import fs from 'node:fs';
import path from 'node:path';
import { parse, toSections, Section, BUILD_DATE } from './blog';

export interface Qna { slug: string; q: string; title: string; description: string; service: string; date: string; answer: string; sections: Section[] }

const DIR = path.join(process.cwd(), 'content', 'qna');
let cache: Qna[] | null = null;
export function getQnas(): Qna[] {
  if (cache) return cache;
  let files: string[] = [];
  try { files = fs.readdirSync(DIR).filter((f) => f.endsWith('.md') && !f.startsWith('_')); } catch {}
  const out = files.flatMap((f) => {
    const r = parse(fs.readFileSync(path.join(DIR, f), 'utf-8'));
    if (!r || !r.meta.slug || !r.meta.q) return [];
    const m = r.meta;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(m.date || '') || m.date > BUILD_DATE) return [];
    const [head, ...rest] = r.body.split(/\r?\n(?=##\s)/);
    return [{ slug: m.slug, q: m.q, title: m.title || m.q, description: m.description || '', service: m.service || '', date: m.date,
      answer: head.trim().replace(/\r?\n+/g, ' '), sections: toSections(rest.join('\n')) }];
  });
  out.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
  return (cache = out);
}
export function getQna(slug: string) {
  let key = slug;
  try { key = decodeURIComponent(slug); } catch {}
  return getQnas().find((x) => x.slug === key);
}
export const qnaPath = (x: Qna) => `/qna/${x.slug}/`;
export const qnaEncodedPath = (x: Qna) => `/qna/${encodeURIComponent(x.slug)}/`;
export const qnaOgKey = (x: Qna) => `qna-${x.slug}`;
