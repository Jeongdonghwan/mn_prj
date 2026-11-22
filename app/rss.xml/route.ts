// out/rss.xml — 네이버 서치어드바이저 제출용. 블로그 글·Q&A(최신순) + 열린 묶음(OPEN_WAVE)의 대표 페이지
import { SITE_URL, SITE_NAME, BRAND } from '../../lib/site';
import { OPEN_PAGES, pageEncodedPath, inSitemap } from '../../lib/data';
import { compose } from '../../lib/compose';
import { getPosts, postEncodedPath } from '../../lib/blog';
import { getQnas, qnaEncodedPath } from '../../lib/qna';

export const dynamic = 'force-static';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const item = (title: string, link: string, desc: string, date?: string) =>
  `<item><title>${esc(title)}</title><link>${link}</link><description>${esc(desc)}</description>${date ? `<pubDate>${new Date(date).toUTCString()}</pubDate>` : ''}<guid isPermaLink="true">${link}</guid></item>`;

export function GET() {
  const date = new Date().toUTCString();
  const posts = getPosts().map((p) => item(p.title, `${SITE_URL}${postEncodedPath(p)}`, p.description, p.publishedAt));
  const qnas = getQnas().map((x) => item(x.title, `${SITE_URL}${qnaEncodedPath(x)}`, x.description, x.date));
  const items = OPEN_PAGES.filter(inSitemap).map((p) => {
    const c = compose(p);
    return item(c.title, `${SITE_URL}${pageEncodedPath(p)}`, c.description);
  });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel><title>${esc(SITE_NAME)}</title><link>${SITE_URL}/</link><description>${esc(`안성·평택·천안·아산·진천·음성·용인·오산·이천·여주 건식난방, 전기온수기, 누수탐지, 집수리 ${BRAND}. 지역별 안내, 자주 묻는 질문, 설비 궁금증 글.`)}</description><language>ko</language><lastBuildDate>${date}</lastBuildDate>
${[...posts, ...qnas, ...items].join('\n')}
</channel></rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
