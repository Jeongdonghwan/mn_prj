import type { Metadata } from 'next';
import Link from 'next/link';
import { CASES, CITIES, OPEN_PAGES, openCities, cityPath, pagePath, pageEncodedPath, inSitemap } from '../lib/data';
import { SVC, SVC_ORDER, TOOLS } from '../lib/compose';
import { getPosts, postPath } from '../lib/blog';
import { getQnas, qnaPath } from '../lib/qna';
import { BRAND, CONTACT, BLOG, SHOP, INSTAGRAM, shareMeta, tel } from '../lib/site';
import { faqJsonLd, itemListJsonLd, businessJsonLd } from '../lib/jsonld';
import { Actions, CaseImg, HeroCta, ToolImg, IconArrow, IconDoc, IconFaucet, IconPhone, JsonLd, PhotoTop, SectionHead, casesByTag, pickPhoto } from '../components/Common';

const HOME_TITLE = `${BRAND} | 건식난방·전기온수기·누수탐지·집수리`;
const HOME_DESC = '안성·평택·천안·아산·진천·음성 건식 온수난방, 중대형 전기온수기, 분배기·보일러, 누수탐지, 집수리. 직접 시공.';
export const metadata: Metadata = {
  title: HOME_TITLE,
  description: HOME_DESC,
  alternates: { canonical: '/', types: { 'application/rss+xml': '/rss.xml' } },
  ...shareMeta('home', `${BRAND} 주택설비·난방`, { title: HOME_TITLE, description: HOME_DESC, url: '/' }),
};

// 업체가 '전문'이라고 적은 네 가지(카톡 2026-11-22) + 나머지 서비스
const MAIN4 = [
  { k: '온수기', t: '중대형 전기온수기 설치', d: '가정집·상가·농장·공장. 30리터 저장식부터 130~420리터 중형, 업소용 가스온수기까지 용도에 맞춰 설치합니다.' },
  { k: '난방', t: '건식 온수난방 시공', d: '쭌난방 안성대리점. 바닥을 크게 깨지 않고 패널 위에 온수관을 깔아 전용 마루로 마감합니다.' },
  { k: '분배기', t: '분배기 교체 · 보일러 설치', d: '압력검사로 새는 곳부터 보고 분배기·각방밸브를 바꿉니다. 가스·기름보일러 설치와 순환펌프 교체.' },
  { k: '누수', t: '누수탐지 공사', d: '청음식·가스식 누수탐지기와 열화상 카메라로 새는 자리를 찾아 그 부분만 열고 고칩니다.' },
];

const FAQ = [
  { q: '어느 지역까지 오나요?', a: '안성, 평택, 천안, 아산, 진천, 음성, 용인, 오산, 이천, 여주를 영업지역으로 다닙니다. 그 밖의 지역은 통화로 협의합니다.' },
  { q: '비용은 언제 알 수 있나요?', a: '정해진 단가표는 없습니다. 현장에서 원인과 작업 범위(구간·자재·마감)를 확인한 뒤 작업 전에 말씀드립니다.' },
  { q: '자격이 있는 업체인가요?', a: '전문기능사 자격을 가진 전문면허 사업체입니다. 가스보일러는 시공 자격이 있는 한국열관리시공협회 회원으로 시공합니다.' },
  { q: '여러 가지를 한 번에 맡길 수 있나요?', a: '네. 난방·온수기·누수·하수구·욕실·단열·집수리를 함께 합니다. 고칠 곳을 한 번에 둘러보고 순서를 정해 외주 없이 직접 시공합니다.' },
  { q: '다른 곳에서 못 고친다고 했어요.', a: '여러 업자가 다녀가도 못 찾은 누수, 날이 풀릴 때까지 기다리라던 언 오수관, 벽이 석고라 어렵다던 온수기 설치를 해결한 기록이 블로그에 있습니다. 사진을 보내 주시면 가능한지 먼저 말씀드립니다.' },
];

const PRINCIPLES = [
  { t: '대표 직접 방문', d: '상담부터 현장 점검과 마무리까지 외주 없이 직접 합니다.', id: 'w029' },
  { t: '장비로 원인 확인', d: '누수탐지기·열화상 카메라·내시경으로 원인 자리를 먼저 찾습니다.', id: 'w055' },
  { t: '필요한 곳만 작업', d: '여러 곳을 깨지 않고 원인 구간만 열어 고칩니다.', id: 'w089' },
  { t: '보이지 않는 곳까지', d: '배관·방수처럼 속에 들어가는 일을 먼저 바로잡고 마감합니다.', id: 'w194' },
  { t: '작업 후 다시 확인', d: '물을 돌리고 보일러를 켜서 새는 곳과 온도를 다시 확인합니다.', id: 'w148' },
];

export default function Home() {
  const cities = openCities();
  const posts = getPosts().slice(0, 5);
  const qnas = getQnas().slice(0, 6);
  const hubs = OPEN_PAGES.filter((p) => inSitemap(p) && p.unit === '시·군' && !p.mod);
  const carousel = hubs.slice(0, 30);
  const svcLink = (svc: string) => OPEN_PAGES.find((p) => inSitemap(p) && p.city === '안성' && p.service === svc && !p.mod)
    || OPEN_PAGES.find((p) => inSitemap(p) && p.service === svc);
  // 한 화면에 같은 사진이 두 번 나오지 않게 — 쓴 사진은 건너뛴다
  const used = new Set<string>();
  const ph = (tag: string) => {
    const c = casesByTag(tag).find((x) => !used.has(x.id)) || CASES.find((x) => !used.has(x.id));
    if (c) used.add(c.id);
    return c?.id;
  };
  // 화면 자리마다 맞는 사진을 고정(사진 내용과 글이 어긋나지 않게) — 보정본은 scripts/enhance_photos.py
  ['w003', 'w201', 'w063', 'w202', ...PRINCIPLES.map((x) => x.id)].forEach((id) => used.add(id));
  const heroPh = 'w003';
  const heroPh2 = 'w003'; // 모바일 상단 사진(데스크톱은 배경)
  const whyId = ph('누수');
  const whyPh = CASES.find((c) => c.id === whyId);
  const memoId = ph('top');
  const memoPh = CASES.find((c) => c.id === memoId);
  const mainPh = Object.fromEntries(MAIN4.map((w) => [w.k, ph(w.k)]));
  const prPh = PRINCIPLES.map((x) => x.id);

  const gallery = CASES.filter((c) => !used.has(c.id) && c.logNo).filter((c, i, a) => a.findIndex((y) => y.logNo === c.logNo) === i).slice(0, 9);

  return (
    <main>
      <JsonLd data={[businessJsonLd(), faqJsonLd(FAQ), itemListJsonLd(carousel.map((p) => ({ name: p.kw, path: pageEncodedPath(p) })))]} />
      <PhotoTop photo={heroPh || pickPhoto('home')} className="hero hero-home">
        <div className="hero-text">
          <h1><span><i>집수리부터 난방까지</i></span><span><i>직접 시공하는 {BRAND}</i></span></h1>
          <p className="hero-lead">안성에서 가정집·상가·농장·공장의 건식 온수난방, 중대형 전기온수기, 분배기 교체·보일러 설치, 누수탐지를 합니다. 외주 없이 대표가 직접 시공합니다.</p>
          <HeroCta />
          {heroPh2 && <CaseImg id={heroPh2} className="hero-ph" lazy={false} />}
          <p className="hero-blog"><a className="btn-text" href={BLOG} target="_blank" rel="noopener noreferrer"><IconDoc /><span>블로그 시공 글 보기</span></a></p>
        </div>
        <dl className="hero-specs">
          {[['전문', '건식난방 · 전기온수기 · 분배기 · 누수탐지', '난방'], ['장비', '누수탐지기 · 열화상 · 내시경 · 고압세척', '누수'], ['지역', '안성 · 평택 · 천안 · 아산 · 진천 · 음성', '온수기']].map(([k, v, tag]) => {
            const id = ph(tag);
            return <div key={k}>{id && <CaseImg id={id} className="spec-ph" lazy={false} />}<dt>{k}</dt><dd>{v}</dd></div>;
          })}
        </dl>
      </PhotoTop>

      <div className="wrap content">
        <section className="sec">
          <SectionHead title="고쳐도 그대로라면, 원인이 남아 있습니다" />
          <div className="cols">
            <div className="prose" data-reveal>
              {whyPh && (
                <figure className="why-ph">
                  <CaseImg id={whyPh.id} />
                  <figcaption>{whyPh.where} · {whyPh.space}</figcaption>
                </figure>
              )}
              <p className="first">방이 안 따뜻하면 보일러를, 물이 새면 보이는 곳을 먼저 고치기 쉽습니다. 하지만 원인이 순환펌프·분배기·바닥 속 배관에 있으면 같은 문제가 다시 생깁니다.</p>
              <p>{BRAND}는 누수 원인이 여러 가지라 한 가지 기계로 찾을 수 없다고 보고, 청음식·가스식 누수탐지기와 열화상 카메라, 하수관 내시경을 번갈아 씁니다. 원인 자리를 찾으면 그 부분만 열어 고치고, 물과 난방을 다시 돌려 확인합니다.</p>
              <ol className="why-steps">
                <li><b>원인 찾기</b><span>장비로 새는 곳·막힌 곳·얼어붙은 곳을 먼저 찾습니다</span></li>
                <li><b>필요한 곳만</b><span>여러 곳을 깨지 않고 원인 구간만 작업합니다</span></li>
                <li><b>다시 확인</b><span>물을 돌리고 보일러를 켜서 새는 곳과 온도를 확인합니다</span></li>
              </ol>
            </div>
            {memoPh && (
              <figure className="memo-photo mask" data-reveal>
                <CaseImg id={memoPh.id} />
                <figcaption>{memoPh.where} · {memoPh.space}</figcaption>
              </figure>
            )}
          </div>
        </section>

        <section className="sec mist">
          <SectionHead title="전문 분야" />
          <ol className="works">
            {MAIN4.map((w, i) => {
              const lk = svcLink(w.k);
              const id = mainPh[w.k];
              return (
                <li key={w.t} data-reveal style={{ transitionDelay: `${(i % 4) * 70}ms` }}>
                  {id && <CaseImg id={id} className="works-ph" />}
                  <h3>{w.t}</h3>
                  <p>{w.d}</p>
                  <Link href={`/service/${w.k}/`} className="more">{SVC[w.k].name} 안내 <IconArrow /></Link>
                  {lk && <Link href={pagePath(lk)} className="more">{lk.kw} <IconArrow /></Link>}
                </li>
              );
            })}
          </ol>
          <h3 className="h3-sub" data-reveal>그 밖에 하는 일</h3>
          <ul className="linklist cols2">
            {SVC_ORDER.filter((k) => !MAIN4.some((m) => m.k === k) && k !== '보일러').map((k) => <li key={k}><Link href={`/service/${k}/`}>{SVC[k].name} — {SVC[k].short}<IconArrow /></Link></li>)}
          </ul>
        </section>
      </div>

      <section className="band">
        <div className="wrap">
          <SectionHead title="보유 장비" sub="최신형 고압세척 장비와 누수탐지 장비, 내시경 카메라, 배관 관로 탐지기, 열화상 카메라를 갖추고 있습니다." />
          <ol className="tools reveal-group">{TOOLS.map((t, i) => <li key={t.name}><ToolImg ph={t.ph} name={t.name} /><h3>{t.name}</h3><p>{t.d[i % 3]('안성', '작업')}</p></li>)}</ol>
        </div>
      </section>

      <div className="wrap content">
        {gallery.length > 0 && (
          <section className="sec">
            <SectionHead title="시공 사례" sub="업체 블로그에 올린 실제 현장 사진입니다." />
            <div className="gallery">
              {gallery.map((k, i) => (
                <figure key={k.id} data-reveal style={{ transitionDelay: `${(i % 4) * 70}ms` }}>
                  <CaseImg id={k.id} />
                  <figcaption><b>{k.where}</b>{k.space}</figcaption>
                </figure>
              ))}
            </div>
            <p className="center" data-reveal><Link href="/cases/" className="more">시공 사례 전체 보기 <IconArrow /></Link></p>
          </section>
        )}
      </div>

      <section className="cta-band" data-reveal>
        <div className="wrap"><div className="cta-card">
          <h2><span className="cc-ico"><IconFaucet /></span>방이 차갑거나 물이 새나요?</h2>
          <p>문제 부위 사진을 문자로 보내 주시면 통화 때 바로 이어서 설명드립니다.</p>
          <ul className="cc-tags"><li>난방</li><li>온수</li><li>누수</li><li>동파</li></ul>
          <a className="cc-call" href={tel}><IconPhone /><span>{CONTACT.phone}</span></a>
        </div></div>
      </section>

      <div className="wrap content">
        <section className="sec mist">
          <SectionHead title="점검 및 작업 절차" />
          <ol className="principles reveal-group">
            {PRINCIPLES.map((x, i) => {
              const id = prPh[i];
              return <li key={x.t}><b className="pr-no">{String(i + 1).padStart(2, '0')}</b><div className="pr-tx"><strong>{x.t}</strong><p>{x.d}</p></div>{id && <div className="pr-ph"><CaseImg id={id} /></div>}</li>;
            })}
          </ol>
        </section>

        <section className="sec">
          <SectionHead title="지역" sub="지역을 고르면 동네별 난방·온수기·누수·집수리 안내로 이어집니다." />
          <div className="cities">
            {cities.map((city) => (
              <Link key={city} href={cityPath(city)} className="city-row" data-reveal>
                <div><b>{city}</b><span>{CITIES[city].full}</span></div>
                <IconArrow />
              </Link>
            ))}
          </div>
          <ul className="linklist cols2">
            {hubs.slice(0, 10).map((p) => <li key={p.slug}><Link href={pagePath(p)}>{p.kw}<IconArrow /></Link></li>)}
          </ul>
          <p className="center" data-reveal><Link href="/area/" className="more">전체 지역 페이지 <IconArrow /></Link></p>
        </section>

        <section className="sec mist" id="faq">
          <SectionHead title="자주 묻는 질문" />
          <div className="faq">{FAQ.map((f) => <details key={f.q} data-reveal><summary>{f.q}<i /></summary><p>{f.a}</p></details>)}</div>
          {qnas.length > 0 && <ul className="qna-list">{qnas.map((x) => <li key={x.slug}><Link href={qnaPath(x)}><span>{x.q}</span><IconArrow /></Link></li>)}</ul>}
          <p className="center" data-reveal><Link href="/qna/" className="more">질문 전체 보기 <IconArrow /></Link></p>
        </section>

        <section className="sec">
          <SectionHead title="설비 궁금증 블로그" sub="상담 때 자주 받는 질문을 한 편에 하나씩 정리합니다." />
          {posts.length > 0
            ? <ul className="linklist narrow">{posts.map((p) => <li key={p.slug}><Link href={postPath(p)}>{p.title}<IconArrow /></Link></li>)}</ul>
            : <p className="prose-p center">첫 글을 준비하고 있습니다. 그동안 <a href={BLOG} target="_blank" rel="noopener noreferrer">네이버 블로그 시공 글</a>을 참고해 주세요.</p>}
          <p className="center" data-reveal><Link href="/blog/" className="more">블로그 글 전체 보기 <IconArrow /></Link></p>
        </section>

        <section className="sec">
          <SectionHead title="쇼핑몰 · SNS" />
          <ul className="linklist cols2">
            <li><a href={SHOP.url} target="_blank" rel="noopener noreferrer">쇼핑몰 {SHOP.name}.com<IconArrow /></a></li>
            <li><a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">인스타그램 youngjin2475<IconArrow /></a></li>
            <li><a href={BLOG} target="_blank" rel="noopener noreferrer">네이버 블로그<IconArrow /></a></li>
          </ul>
        </section>
      </div>

      <section className="closing">
        <div className="wrap" data-reveal>
          <h2>고칠 곳이 있나요?</h2>
          <p>지역과 증상을 알려주시면<br />방문 일정을 안내해 드립니다.</p>
          <Actions />
        </div>
      </section>
    </main>
  );
}
