import type { Metadata } from 'next';
import Link from 'next/link';
import { CITIES, OPEN_PAGES, PLACES, openCities, cityPages, cityPath, cityEncodedPath, pagePath, pageEncodedPath, inSitemap } from '../../lib/data';
import { breadcrumbJsonLd, itemListJsonLd } from '../../lib/jsonld';
import { Actions, IconArrow, JsonLd, PhotoTop, pickPhoto } from '../../components/Common';
import { BRAND, shareMeta } from '../../lib/site';

const TITLE = `지역별 난방·온수기·누수·집수리 안내 | ${BRAND}`;
const DESC = '안성·평택·천안·아산·진천·음성·용인·오산·이천·여주 지역별 건식난방, 전기온수기, 누수탐지, 집수리 안내.';
export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/area/' },
  ...shareMeta('area', '지역별 설비 안내', { title: TITLE, description: DESC, url: '/area/' }),
};

// 시·군 허브와 장소 목록 — 각 장소의 키워드 페이지 전체는 시·군 허브(/area/<시군>/)에 있다
export default function AreaIndex() {
  const cities = openCities();
  const top = OPEN_PAGES.filter((p) => inSitemap(p) && p.unit === '시·군');
  return (
    <main>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '지역', path: '/area/' }]),
        itemListJsonLd([
          ...cities.map((c) => ({ name: `${c} 지역 안내`, path: cityEncodedPath(c) })),
          ...top.map((p) => ({ name: p.kw, path: pageEncodedPath(p) })),
        ]),
      ]} />
      <PhotoTop photo={pickPhoto('area')} className="page-hero">
        <nav className="crumbs" aria-label="경로"><Link href="/">홈</Link><span>/</span><span>지역</span></nav>
        <h1 className="page-title">지역별 난방·온수기·누수·집수리 안내</h1>
        <p className="page-lead">업체가 영업지역으로 적어 둔 10개 시·군입니다. 그 밖의 지역은 통화로 협의합니다.</p>
        <Actions />
      </PhotoTop>
      <div className="wrap content">
        <section className="sec">
          <h2 className="area-h">시·군</h2>
          <div className="cities">
            {cities.map((city) => (
              <Link key={city} href={cityPath(city)} className="city-row">
                <div><b>{city}</b><span>{CITIES[city].full}</span></div>
                <IconArrow />
              </Link>
            ))}
          </div>
        </section>
        {cities.map((city) => {
          const keys = Array.from(new Set(cityPages(city).map((p) => p.place)));
          return (
            <section key={city} className="sec">
              <h2 className="area-h"><Link href={cityPath(city)}>{city} <IconArrow /></Link></h2>
              <ul className="area-list">
                {keys.map((key) => <li key={key}><Link href={`${cityPath(city)}#${encodeURIComponent(key)}`}>{PLACES[key].name}</Link></li>)}
              </ul>
              <ul className="linklist">
                {top.filter((p) => p.city === city).slice(0, 6).map((p) => <li key={p.slug}><Link href={pagePath(p)}>{p.kw}<IconArrow /></Link></li>)}
              </ul>
            </section>
          );
        })}
      </div>
    </main>
  );
}
