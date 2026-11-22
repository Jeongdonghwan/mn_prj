import type { Metadata } from 'next';
import Link from 'next/link';
import { getQnas, qnaPath, qnaEncodedPath } from '../../lib/qna';
import { SVC, SVC_ORDER } from '../../lib/compose';
import { breadcrumbJsonLd, faqJsonLd, itemListJsonLd } from '../../lib/jsonld';
import { Actions, IconArrow, JsonLd, PhotoTop, pickPhoto } from '../../components/Common';
import { BRAND, shareMeta } from '../../lib/site';

const T = `자주 묻는 질문 | 난방·온수기·누수·집수리 Q&A - ${BRAND}`;
const D = '건식난방, 전기온수기, 분배기, 보일러, 누수탐지, 동파 해빙, 하수구, 욕실, 집수리에 대해 자주 받는 질문과 답.';
export const metadata: Metadata = {
  title: T, description: D, alternates: { canonical: '/qna/' },
  ...shareMeta('qna', `${BRAND} 자주 묻는 질문`, { title: T, description: D, url: '/qna/' }),
};

export default function QnaHub() {
  const xs = getQnas();
  const groups = SVC_ORDER.map((k) => ({ k, items: xs.filter((x) => x.service === k) })).filter((g) => g.items.length);
  return (
    <main>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '자주 묻는 질문', path: '/qna/' }]),
        itemListJsonLd(xs.map((x) => ({ name: x.q, path: qnaEncodedPath(x) }))),
        faqJsonLd(xs.slice(0, 10).map((x) => ({ q: x.q, a: x.answer.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') }))),
      ]} />
      <PhotoTop photo={pickPhoto('qna')} className="page-hero">
        <nav className="crumbs" aria-label="경로"><Link href="/">홈</Link><span>/</span><span>자주 묻는 질문</span></nav>
        <h1 className="page-title">자주 묻는 질문</h1>
        <p className="page-lead">상담 때 자주 받는 질문을 분야별로 모았습니다. 질문을 누르면 답부터 보입니다.</p>
      </PhotoTop>
      <div className="wrap content qna-groups">
        {groups.length === 0 && <p className="prose-p">질문을 정리하고 있습니다.</p>}
        {groups.map((g) => (
          <section key={g.k} id={g.k}>
            <h2>{SVC[g.k].name}</h2>
            <ul className="qna-list">{g.items.map((x) => <li key={x.slug}><Link href={qnaPath(x)}><span>{x.q}<small>{x.description}</small></span><IconArrow /></Link></li>)}</ul>
          </section>
        ))}
        <section className="sec">
          <h2 className="area-h">찾는 질문이 없나요?</h2>
          <p className="prose-p">전화나 문자로 물어보세요. 사진을 함께 보내 주시면 더 정확히 답해 드립니다.</p>
          <Actions />
        </section>
      </div>
    </main>
  );
}
