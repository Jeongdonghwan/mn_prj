import type { Metadata } from 'next';
import Link from 'next/link';
import { CASES, OPEN_PAGES, inSitemap, pagePath, pageEncodedPath } from '../../lib/data';
import { breadcrumbJsonLd, itemListJsonLd } from '../../lib/jsonld';
import { Actions, IconArrow, JsonLd, PhotoTop, pickPhoto } from '../../components/Common';
import { BRAND, SITE_URL, shareMeta } from '../../lib/site';

const posts = Array.from(new Set(CASES.map((c) => c.logNo))).map((log) => CASES.filter((c) => c.logNo === log));
const TITLE = `시공 사례 | ${BRAND} 난방·온수기·누수·집수리 현장`;
const DESC = `${BRAND} 네이버 블로그 시공 글 ${posts.length}편의 현장 사진 ${CASES.length}장. 난방·온수기·누수·욕실·집수리 현장.`;
export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/cases/' },
  ...shareMeta('cases', `${BRAND} 시공 사례`, { title: TITLE, description: DESC, url: '/cases/' }),
};

const fmt = (d: string) => d.replace(/-/g, '.');
// 사진의 장소·서비스로 이어지는 열린 대표 페이지 하나
const linkFor = (place: string | null, tag: string, city: string | null) =>
  (place && OPEN_PAGES.find((p) => inSitemap(p) && p.place === place && p.service === tag))
  || OPEN_PAGES.find((p) => inSitemap(p) && p.city === (city || '안성') && p.service === tag && p.unit === '시·군');

export default function Cases() {
  return (
    <main>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '시공 사례', path: '/cases/' }]),
        {
          '@context': 'https://schema.org', '@type': 'ItemList',
          itemListElement: CASES.map((k, i) => ({ '@type': 'ListItem', position: i + 1, item: { '@type': 'ImageObject', contentUrl: `${SITE_URL}/img/${k.id}.webp`, name: `${k.where} ${k.space}`, description: k.scene, uploadDate: k.date } })),
        },
        itemListJsonLd(OPEN_PAGES.filter((p) => inSitemap(p) && p.unit === '시·군' && !p.mod).slice(0, 20).map((p) => ({ name: p.kw, path: pageEncodedPath(p) }))),
      ]} />
      <PhotoTop photo={pickPhoto('cases')} className="page-hero">
        <nav className="crumbs" aria-label="경로"><Link href="/">홈</Link><span>/</span><span>시공 사례</span><span>·</span><span className="crumbs-where">네이버 블로그 jin3652</span></nav>
        <h1 className="page-title">시공 사례</h1>
        <p className="page-lead">{fmt(posts[posts.length - 1][0].date)}부터 {fmt(posts[0][0].date)}까지 블로그에 올린 현장 사진입니다.</p>
      </PhotoTop>
      <div className="wrap content">
        <ol className="case-list">
          {posts.map((g, i) => {
            const k = g[0];
            const lk = linkFor(k.place, g[0].tags.find((t) => t !== 'top') || '집수리', k.city);
            return (
              <li key={k.logNo} data-reveal>
                <div className="case-photos">
                  {g.slice(0, 3).map((c, j) => <figure key={c.id}><img src={`/img/${c.id}.webp`} alt={`${k.where} ${c.space} - ${BRAND} 시공 사진`} loading={i < 2 ? 'eager' : 'lazy'} width={c.w} height={c.h} /><figcaption>{c.space}</figcaption></figure>)}
                </div>
                <div>
                  <p className="meta">{String(i + 1).padStart(2, '0')} · {fmt(k.date)} · {k.where}</p>
                  <h2>{k.post}</h2>
                  <ul className="case-scenes">{g.map((c) => <li key={c.id}>{c.scene}</li>)}</ul>
                  <p className="meta">관련 작업: {Array.from(new Set(g.flatMap((c) => c.tags))).filter((t) => t !== 'top').join(' · ')}</p>
                  <p>
                    <a href={k.url} className="more" target="_blank" rel="noopener noreferrer">블로그 원문 <IconArrow /></a>
                    {lk && <> &nbsp; <Link href={pagePath(lk)} className="more">{lk.kw} 안내 <IconArrow /></Link></>}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
        <section className="sec">
          <h2 className="area-h">문제 부위 사진을 보내 주시면</h2>
          <p className="prose-p">물이 새는 곳, 언 배관, 보일러·분배기 주변을 찍어 문자로 보내 주시면 통화 때 바로 이어서 설명드립니다.</p>
          <Actions />
        </section>
      </div>
    </main>
  );
}
