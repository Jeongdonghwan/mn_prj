import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SVC, SVC_ORDER, TOOLS } from '../../../lib/compose';
import { OPEN_PAGES, CITIES, inSitemap, pagePath, pageEncodedPath, openCities } from '../../../lib/data';
import { getQnas, qnaPath } from '../../../lib/qna';
import { getPosts, postPath } from '../../../lib/blog';
import { breadcrumbJsonLd, faqJsonLd, itemListJsonLd, serviceJsonLd } from '../../../lib/jsonld';
import { Actions, CaseImg, IconArrow, JsonLd, PhotoTop, SectionHead, casesByTag, pickPhoto } from '../../../components/Common';
import { BRAND, shareMeta } from '../../../lib/site';

export const dynamicParams = false;
export function generateStaticParams() { return SVC_ORDER.map((svc) => ({ svc })); }

const key = (s: string) => { try { return decodeURIComponent(s); } catch { return s; } };

export function generateMetadata({ params }: { params: { svc: string } }): Metadata {
  const k = key(params.svc); const v = SVC[k];
  if (!v) return {};
  const title = `${v.name} | ${v.short} - ${BRAND}`;
  const d = `${v.short}. ${v.work}`;
  const description = d.length <= 80 ? d : d.slice(0, 78).replace(/[ ,·]+[^ ,·]*$/, '') + '…';
  const url = `/service/${encodeURIComponent(k)}/`;
  return { title, description, alternates: { canonical: url }, ...shareMeta(`service-${k}`, `${BRAND} ${v.name}`, { title, description, url }) };
}

export default function ServicePage({ params }: { params: { svc: string } }) {
  const k = key(params.svc); const v = SVC[k];
  if (!v) notFound();
  const path = `/service/${encodeURIComponent(k)}/`;
  const pages = OPEN_PAGES.filter((p) => inSitemap(p) && p.service === k);
  const cityTop = openCities().map((c) => ({ c, items: pages.filter((p) => p.city === c && (p.unit === '시·군' || p.unit === '시·군·구') && !p.mod).slice(0, 8) })).filter((x) => x.items.length);
  const qnas = getQnas().filter((x) => x.service === k);
  const posts = getPosts().filter((p) => p.industry === k).slice(0, 6);
  const photos = casesByTag(k, 6);
  const own = v.faq('', '현장');
  const faq = [{ q: own.q.replace(/^,\s*/, ''), a: own.a }, ...qnas.slice(0, 4).map((x) => ({ q: x.q, a: x.answer.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') }))];

  return (
    <main>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '시공 분야', path: '/service/' }, { name: v.name, path }]),
        serviceJsonLd({ name: v.name, type: v.short, description: v.aim, path, area: '안성·평택·천안·아산·진천·음성·용인·오산·이천·여주' }),
        faqJsonLd(faq),
        itemListJsonLd(pages.slice(0, 30).map((p) => ({ name: p.kw, path: pageEncodedPath(p) }))),
      ]} />
      <PhotoTop photo={photos[0]?.id || pickPhoto(k)} className="page-hero">
        <nav className="crumbs" aria-label="경로"><Link href="/">홈</Link><span>/</span><Link href="/service/">시공 분야</Link></nav>
        <h1 className="page-title">{v.name}</h1>
        <p className="page-lead">{v.aim}.</p>
        <Actions />
      </PhotoTop>
      <div className="wrap content">
        <section className="sec">
          <SectionHead title={`${v.name}, 이렇게 합니다`} />
          <div className="prose" data-reveal>
            <p className="first">{BRAND}는 {v.work}.</p>
            <p>블로그 시공 기록: {v.cases}.</p>
          </div>
          <ol className="flow reveal-group">{v.steps('현장', '건물').map((st) => <li key={st.title}><strong>{st.title}</strong><p>{st.text}</p></li>)}</ol>
        </section>
        <section className="sec mist">
          <SectionHead title="이럴 때 연락하세요" />
          <ul className="memo-list reveal-group">{v.symptoms.map((x) => <li key={x}>{x}</li>)}</ul>
        </section>
        <section className="sec">
          <SectionHead title="쓰는 장비" />
          <ol className="tools reveal-group">{v.tools.map((i) => <li key={i}><h3>{TOOLS[i].name}</h3><p>{TOOLS[i].d[0]('현장', v.name)}</p></li>)}</ol>
        </section>
        {photos.length > 0 && (
          <section className="sec">
            <SectionHead title={`${v.name} 시공 사진`} sub="업체 블로그에 올린 실제 현장 사진입니다." />
            <div className="gallery">{photos.map((c) => <figure key={c.id} data-reveal><CaseImg id={c.id} /><figcaption><b>{c.where}</b>{c.space}</figcaption></figure>)}</div>
          </section>
        )}
        <section className="sec mist" id="faq">
          <SectionHead title="자주 묻는 질문" />
          <div className="faq">{faq.slice(0, 1).map((f) => <details key={f.q} data-reveal><summary>{f.q}<i /></summary><p>{f.a}</p></details>)}</div>
          {qnas.length > 0 && <ul className="qna-list">{qnas.map((x) => <li key={x.slug}><Link href={qnaPath(x)}><span>{x.q}<small>{x.description}</small></span><IconArrow /></Link></li>)}</ul>}
        </section>
        <section className="sec">
          <SectionHead title="지역별 안내" />
          <div className="related">
            {cityTop.map(({ c, items }) => <div key={c}><h3>{CITIES[c].full}</h3><ul>{items.map((p) => <li key={p.slug}><Link href={pagePath(p)}>{p.kw}<IconArrow /></Link></li>)}</ul></div>)}
          </div>
        </section>
        {posts.length > 0 && (
          <section className="sec">
            <SectionHead title="관련 글" />
            <ul className="linklist">{posts.map((p) => <li key={p.slug}><Link href={postPath(p)}>{p.title}<IconArrow /></Link></li>)}</ul>
          </section>
        )}
      </div>
    </main>
  );
}
