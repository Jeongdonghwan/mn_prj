// 소개 — 사실만 평서문으로 (무엇을·어디서·어떻게 연락). site.ts 와 페이지 데이터에 있는 것만 쓴다. 없는 정보는 줄을 내지 않는다.
import type { Metadata } from 'next';
import Link from 'next/link';
import { openCities } from '../../lib/data';
import { BLOG, BRAND, BUSINESS, CONTACT, INSTAGRAM, SHOP, UPDATED, shareMeta, tel, smsHref } from '../../lib/site';
import { TOOL_LINE } from '../../lib/compose';
import { breadcrumbJsonLd, businessJsonLd } from '../../lib/jsonld';
import { JsonLd, PhotoTop, pickPhoto } from '../../components/Common';

const TITLE = `소개 | ${BRAND}`;
const DESC = `${BRAND}는 안성의 주택설비·난방 업체입니다. 하는 일, 장비, 다니는 지역, 연락 방법.`;
export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/about/' },
  ...shareMeta('home', `${BRAND} 소개`, { title: TITLE, description: DESC, url: '/about/' }),
};

export default function About() {
  const cities = openCities();
  return (
    <main>
      <JsonLd data={[businessJsonLd(), breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '소개', path: '/about/' }])]} />
      <PhotoTop photo={pickPhoto('about')} className="page-hero">
        <nav className="crumbs" aria-label="경로"><Link href="/">홈</Link><span>/</span><span>소개</span></nav>
        <h1 className="page-title">{BRAND} 소개</h1>
        <p className="page-lead">{BRAND}는 경기 안성의 주택설비·난방 업체입니다. 집수리부터 난방까지 외주 없이 직접 시공합니다.</p>
      </PhotoTop>
      <div className="wrap content">
        <section className="sec">
          <h2 className="area-h">하는 일</h2>
          <p className="prose-p">건식·습식 온수난방(쭌난방 안성대리점), 가정집·상가·농장·공장 중대형 전기온수기 설치, 분배기 교체·보일러 설치, 누수탐지 공사를 전문으로 합니다. 그 밖에 언 수도·하수구 해빙, 하수구 고압세척, 배관 공사, 양변기·세면기 교체, 욕실·화장실 공사와 방수, 단열·창호·지붕, 집수리를 합니다. 분야별 안내는 <Link href="/service/">시공 분야</Link>에, 작업한 현장 사진은 <Link href="/cases/">시공 사례</Link>에 있습니다.</p>
          <p className="prose-p">전문기능사 자격을 가진 전문면허 사업체이고, 가스보일러는 시공 자격이 있는 한국열관리시공협회 회원으로 시공합니다.</p>
        </section>
        <section className="sec">
          <h2 className="area-h">장비</h2>
          <p className="prose-p">{TOOL_LINE}.</p>
        </section>
        <section className="sec">
          <h2 className="area-h">다니는 지역</h2>
          <p className="prose-p">사업장은 {BUSINESS.region}에 있고, 영업지역은 {cities.join(', ')}입니다. 그 밖의 지역은 협의합니다. 지역별 안내는 <Link href="/area/">지역 안내</Link>에 있습니다.</p>
        </section>
        <section className="sec">
          <h2 className="area-h">연락 방법</h2>
          <p className="prose-p">전화 <a href={tel}>{CONTACT.phone}</a>, 문자 <a href={smsHref}>{CONTACT.sms}</a>{CONTACT.hours && ` (${CONTACT.hours})`}로 받습니다.</p>
          <p className="prose-p">상호는 {BUSINESS.name}입니다.</p>
          {BUSINESS.streetAddress && <p className="prose-p">주소는 {BUSINESS.region} {BUSINESS.streetAddress}입니다.</p>}
          {BUSINESS.bizNumber && <p className="prose-p">사업자등록번호는 {BUSINESS.bizNumber}입니다.</p>}
          <p className="prose-p"><a href={BLOG} target="_blank" rel="noopener noreferrer">네이버 블로그</a> · <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">인스타그램</a> · <a href={SHOP.url} target="_blank" rel="noopener noreferrer">쇼핑몰 {SHOP.name}.com</a></p>
          <p className="prose-p">이 페이지의 최종 수정일은 <time dateTime={UPDATED}>{UPDATED}</time>입니다.</p>
        </section>
      </div>
    </main>
  );
}
