import type { Metadata } from 'next';
import Link from 'next/link';
import { isLive } from '../../../lib/links';
import { notFound } from 'next/navigation';
import { getQnas, getQna, qnaPath, qnaEncodedPath, qnaOgKey } from '../../../lib/qna';
import { SVC } from '../../../lib/compose';
import { OPEN_PAGES, inSitemap, pagePath } from '../../../lib/data';
import { breadcrumbJsonLd, faqJsonLd } from '../../../lib/jsonld';
import { Actions, IconArrow, JsonLd, PhotoTop, pickPhoto } from '../../../components/Common';
import { BRAND, SITE_URL, shareMeta } from '../../../lib/site';

export const dynamicParams = false;

export function generateStaticParams() {
  const xs = getQnas();
  return xs.length ? xs.map((x) => ({ slug: x.slug })) : [{ slug: '_none' }];
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const x = getQna(params.slug);
  if (!x) return {};
  const url = qnaEncodedPath(x);
  const share = shareMeta(qnaOgKey(x), `${x.q} - ${BRAND}`, { title: x.title, description: x.description, url });
  return { title: `${x.title} | ${BRAND}`, description: x.description, alternates: { canonical: url }, ...share };
}

const Inline = ({ text }: { text: string }) => (
  <>{text.split(/(\[[^\]]+\]\([^)]+\))/g).map((t, i) => {
    const m = t.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (!m) return t;
    return m[2].startsWith('/') && isLive(m[2]) ? <Link key={i} href={m[2]}>{m[1]}</Link> : m[1];
  })}</>
);

export default function QnaPage({ params }: { params: { slug: string } }) {
  const x = getQna(params.slug);
  if (!x) notFound();
  const path = qnaEncodedPath(x);
  const svc = SVC[x.service];
  const same = getQnas().filter((y) => y.slug !== x.slug && y.service === x.service).slice(0, 6);
  const kws = OPEN_PAGES.filter((p) => inSitemap(p) && p.service === x.service && p.unit === '시·군' && !p.mod).slice(0, 6);
  const plain = (t: string) => t.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  return (
    <main>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '자주 묻는 질문', path: '/qna/' }, { name: x.q, path }]),
        faqJsonLd([{ q: x.q, a: plain([x.answer, ...x.sections.slice(0, 1).flatMap((s) => s.blocks.filter((b): b is string => typeof b === 'string'))].join(' ')) }]),
        { '@context': 'https://schema.org', '@type': 'WebPage', name: x.title, url: `${SITE_URL}${path}`, datePublished: x.date, inLanguage: 'ko', publisher: { '@id': `${SITE_URL}/#business` } },
      ]} />
      <PhotoTop photo={pickPhoto(x.slug)} className="page-hero">
        <nav className="crumbs" aria-label="경로"><Link href="/">홈</Link><span>/</span><Link href="/qna/">자주 묻는 질문</Link>{svc && <><span>/</span><Link href={`/service/${x.service}/`}>{svc.name}</Link></>}</nav>
        <h1 className="page-title">{x.q}</h1>
        <p className="page-lead">{BRAND} · {x.date.replace(/-/g, '.')}</p>
      </PhotoTop>
      <div className="wrap content">
        <article className="prose post">
          <p className="qna-answer first"><Inline text={x.answer} /></p>
          {x.sections.map((s) => (
            <section key={s.h} data-reveal>
              <h2>{s.h}</h2>
              {s.blocks.map((b, j) => {
                if (typeof b === 'string') return <p key={j}><Inline text={b} /></p>;
                const Tag = b.ol ? 'ol' : 'ul';
                return <Tag key={j}>{b.items.map((t, k) => <li key={k}><Inline text={t} /></li>)}</Tag>;
              })}
            </section>
          ))}
        </article>
        <section className="sec">
          <h2 className="area-h">직접 물어보세요</h2>
          <p className="prose-p">문제 부위 사진을 문자로 보내 주시면 통화 때 바로 이어서 설명드립니다.</p>
          <Actions />
        </section>
        {(same.length > 0 || kws.length > 0) && (
          <section className="sec">
            <div className="related">
              {same.length > 0 && <div><h3>{svc ? svc.name : '같은 분야'} 다른 질문</h3><ul>{same.map((y) => <li key={y.slug}><Link href={qnaPath(y)}>{y.q}<IconArrow /></Link></li>)}</ul></div>}
              {kws.length > 0 && <div><h3>지역 안내</h3><ul>{kws.map((p) => <li key={p.slug}><Link href={pagePath(p)}>{p.kw}<IconArrow /></Link></li>)}</ul></div>}
            </div>
          </section>
        )}
        <p><Link href="/qna/" className="more">자주 묻는 질문 전체 <IconArrow /></Link></p>
      </div>
    </main>
  );
}
