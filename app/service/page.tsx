import type { Metadata } from 'next';
import Link from 'next/link';
import { SVC, SVC_ORDER } from '../../lib/compose';
import { breadcrumbJsonLd, itemListJsonLd } from '../../lib/jsonld';
import { Actions, CaseImg, IconArrow, JsonLd, PhotoTop, casesByTag, pickPhoto } from '../../components/Common';
import { BRAND, shareMeta } from '../../lib/site';

const T = `시공 분야 | 난방·온수기·누수·하수구·욕실·집수리 - ${BRAND}`;
const D = '건식 온수난방, 전기온수기, 분배기·보일러, 누수탐지, 동파 해빙, 하수구 고압세척, 배관, 욕실, 집수리, 단열·지붕.';
export const metadata: Metadata = {
  title: T, description: D, alternates: { canonical: '/service/' },
  ...shareMeta('service', `${BRAND} 시공 분야`, { title: T, description: D, url: '/service/' }),
};

export default function ServiceHub() {
  return (
    <main>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '시공 분야', path: '/service/' }]),
        itemListJsonLd(SVC_ORDER.map((k) => ({ name: SVC[k].name, path: `/service/${encodeURIComponent(k)}/` }))),
      ]} />
      <PhotoTop photo={pickPhoto('service')} className="page-hero">
        <nav className="crumbs" aria-label="경로"><Link href="/">홈</Link><span>/</span><span>시공 분야</span></nav>
        <h1 className="page-title">시공 분야</h1>
        <p className="page-lead">난방부터 집수리까지 외주 없이 직접 시공합니다. 분야를 고르면 작업 방식과 지역별 안내, 자주 묻는 질문으로 이어집니다.</p>
      </PhotoTop>
      <div className="wrap content">
        <ul className="svc-grid">
          {SVC_ORDER.map((k) => {
            const ph = casesByTag(k, 1)[0];
            return (
              <li key={k} data-reveal>
                {ph && <CaseImg id={ph.id} />}
                <div className="svc-tx">
                  <h3>{SVC[k].name}</h3>
                  <p>{SVC[k].short}</p>
                  <Link href={`/service/${k}/`} className="more">{SVC[k].name} 안내 <IconArrow /></Link>
                </div>
              </li>
            );
          })}
        </ul>
        <section className="sec"><Actions blog /></section>
      </div>
    </main>
  );
}
