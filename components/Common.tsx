// 공통 UI — 이모지 없이 선 아이콘, 모서리 10px 버튼, 가운데 정렬 섹션 머리(번호 없음).
import Link from 'next/link';
import { BRAND, CONTACT, BUSINESS, BLOG, INSTAGRAM, SHOP, OLD_HOME, UPDATED, tel, smsHref } from '../lib/site';
import { CASES, Case } from '../lib/data';

export const JsonLd = ({ data }: { data: object | object[] }) => (
  <>{(Array.isArray(data) ? data : [data]).map((d, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d).replace(/</g, '\\u003c') }} />)}</>
);

export const Svg = ({ d, size = 18 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);
export const IconPhone = () => <Svg d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />;
export const IconMsg = () => <Svg d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />;
export const IconArrow = () => <Svg d="M5 12h14M13 6l6 6-6 6" size={16} />;
export const IconImage = () => <Svg d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM8.5 10.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4M21 15l-5-5L5 21" />;
export const IconFaucet = () => <Svg d="M3 8h10a4 4 0 0 1 4 4v1M3 5v6M9 8V4M6 4h6M17 16.5c0 1-.6 1.8-1.4 1.8s-1.4-.8-1.4-1.8c0-.9 1.4-2.6 1.4-2.6s1.4 1.7 1.4 2.6z" size={26} />;
// 홈 히어로 버튼 두 개 (전화 상담 · 사진 문자) — 2026-11-19 업체 요청 화면
export const HeroCta = ({ smsLabel = '사진 문자' }: { smsLabel?: string }) => (
  <div className="hero-cta">
    <a className="hc-call" href={tel}><span className="hc-ico"><IconPhone /></span><span><small>전화 상담</small><b>{CONTACT.phone}</b></span></a>
    <a className="hc-sms" href={smsHref}><span className="hc-ico"><IconImage /></span><b>{smsLabel}</b></a>
  </div>
);
export const IconDoc = () => <Svg d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM14 3v6h6M8 13h8M8 17h5" size={17} />;

// 본문 버튼 묶음 — 주 행동(전화) 슬랩 1개 + 보조 텍스트 링크
export const Actions = ({ sms = true, blog = false, smsLabel = '사진 문자', children }: { sms?: boolean; blog?: boolean; smsLabel?: string; children?: React.ReactNode }) => (
  <div className="actions">
    {sms ? <HeroCta smsLabel={smsLabel} /> : <a className="btn-primary" href={tel}><IconPhone /><span>{CONTACT.phone}</span></a>}
    {children}
    {blog && <a className="btn-text" href={BLOG} target="_blank" rel="noopener noreferrer"><IconDoc /><span>블로그 시공 글 보기</span></a>}
  </div>
);

// 사진 한 장 — 모두 업체 블로그(jin3652) 시공 사진(data/cases.json). 스톡·AI 사진은 쓰지 않는다
export const CaseImg = ({ id, className, lazy = true }: { id: string; className?: string; lazy?: boolean }) => {
  const k = CASES.find((x) => x.id === id);
  if (!k) return null;
  return <img src={`/img/${id}.webp`} className={className} alt={`${BRAND} 시공 사진 - ${k.where} ${k.space}`} width={k.w} height={k.h} loading={lazy ? 'lazy' : undefined} />;
};
// 장비 카드 그림 — 실제 사진(w###)이면 시공 사진, 아니면 사진이 없는 장비의 그래픽 카드(public/img/tool-*.webp)
export const ToolImg = ({ ph, name }: { ph: string; name: string }) => ph.startsWith('w')
  ? <CaseImg id={ph} className="tools-ph" />
  : ph ? <img src={`/img/${ph}.webp`} className="tools-ph" alt={`${BRAND} 보유 장비 - ${name}`} width={1200} height={900} loading="lazy" /> : null;
// 태그로 사진 고르기 (tags = 서비스 키 또는 'top'·'tool')
export const casesByTag = (tag: string, n = 99): Case[] => CASES.filter((c) => c.tags.includes(tag)).slice(0, n);

// 페이지 최상단 오른쪽 사진 — 'top' 태그 사진 가운데 슬러그 해시로
export const pickPhoto = (seed: string) => {
  const tops = casesByTag('top');
  const pool = tops.length ? tops : CASES;
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0;
  return pool.length ? pool[h % pool.length].id : '';
};
export const PhotoTop = ({ photo, children, className = '' }: { photo: string; children: React.ReactNode; className?: string }) => (
  <section className={`ptop ${className}`}>
    <div className="ptop-bg"><CaseImg id={photo} lazy={false} /></div>
    <div className="wrap ptop-in">{children}</div>
  </section>
);

export const SectionHead = ({ title, sub, left }: { title: string; sub?: string; left?: boolean }) => (
  <header className={left ? 'sh sh-left' : 'sh'} data-reveal>
    <h2>{title}</h2>
    {sub && <p>{sub}</p>}
  </header>
);

export const LogoMark = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true" className="logo-img">
    <rect width="40" height="40" rx="9" fill="#1b3a47" />
    <path d="M9 20.5 20 11l11 9.5M12.5 18v11h15V18" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
    <path d="M20 21.5c-1.9 2.4-2.8 3.9-2.8 5a2.8 2.8 0 0 0 5.6 0c0-1.1-.9-2.6-2.8-5z" fill="#f2762e" />
  </svg>
);

export const Header = () => (
  <header className="site-header">
    <div className="wrap header-inner">
      <Link href="/" className="logo" aria-label={`${BRAND} 홈`}>
        <LogoMark />
        <span className="logo-text"><b>{BRAND}</b><small>건식난방 · 전기온수기 · 누수탐지 · 집수리</small></span>
      </Link>
      <nav className="nav" aria-label="주 메뉴">
        <Link href="/service/" className="hide-m">시공 분야</Link>
        <Link href="/cases/" className="hide-m">시공 사례</Link>
        <Link href="/qna/" className="hide-m">Q&amp;A</Link>
        <Link href="/area/" className="hide-m">지역</Link>
        <a href={tel} className="nav-call" aria-label={`전화 ${CONTACT.phone}`}><IconPhone /><span>{CONTACT.phone}</span></a>
      </nav>
    </div>
    <nav className="wrap nav-m" aria-label="모바일 메뉴">
      <Link href="/service/">시공 분야</Link><Link href="/cases/">시공 사례</Link><Link href="/qna/">Q&amp;A</Link><Link href="/area/">지역</Link>
    </nav>
  </header>
);

export const Footer = () => (
  <footer className="site-footer">
    <div className="wrap foot-grid">
      <div>
        <strong className="foot-brand">{BRAND}</strong>
        <p>건식 온수난방 · 전기온수기 · 분배기·보일러 · 누수탐지 · 동파 해빙 · 하수구 고압세척 · 욕실 · 집수리<br />안성 · 평택 · 천안 · 아산 · 진천 · 음성 · 용인 · 오산 · 이천 · 여주</p>
        <p><Link href="/about/">소개</Link> · <Link href="/service/">시공 분야</Link> · <Link href="/qna/">자주 묻는 질문</Link> · <Link href="/area/">지역 안내</Link> · <Link href="/cases/">시공 사례</Link> · <Link href="/blog/">블로그</Link> · <a href="/rss.xml">RSS</a></p>
        <p><a href={SHOP.url} target="_blank" rel="noopener noreferrer">쇼핑몰 {SHOP.name}.com</a> · <a href={BLOG} target="_blank" rel="noopener noreferrer">네이버 블로그</a> · <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">인스타그램</a> · <a href={OLD_HOME} target="_blank" rel="noopener noreferrer">기존 홈페이지</a></p>
      </div>
      <ul className="foot-info">
        <li><span>상호</span>{BUSINESS.name}</li>
        <li><span>대표</span>{BUSINESS.ceo}</li>
        <li><span>사업자</span>{BUSINESS.bizNumber}</li>
        <li><span>주소</span>{BUSINESS.region} {BUSINESS.streetAddress}</li>
        <li><span>전화</span><a href={tel}>{CONTACT.phone}</a></li>
      </ul>
    </div>
    <div className="wrap foot-bottom">© {new Date().getFullYear()} {BRAND} · 최종 수정 <time dateTime={UPDATED}>{UPDATED}</time> · 상담 때 받은 주소·연락처는 방문과 비용 안내에만 씁니다.</div>
  </footer>
);

// 하단 고정 바 — 맨 위와 같은 두 버튼(전화 상담 · 사진 문자) (2026-11-20 업체 요청)
export const StickyBar = () => (
  <div className="sticky-bar"><HeroCta /></div>
);
