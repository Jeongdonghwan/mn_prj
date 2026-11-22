import { SITE_URL, SITE_NAME, BRAND, CONTACT, BUSINESS, BLOG, INSTAGRAM, UPDATED } from './site';
import { existsSync } from 'fs';
import { join } from 'path';

// ListItem 썸네일(필수 — site-launch 체크리스트) — 그 페이지 og 카드: /<slug>/ → /og/<slug>.jpg, /blog/<slug>/ → /og/blog-<slug>.jpg.
// 파일이 실제로 있을 때만 붙인다(없는 이미지 주소는 넣지 않는다)
const withOg = (li: Record<string, unknown>) => {
  if (li.image || typeof li.url !== 'string') return li;
  const m = li.url.slice(SITE_URL.length).match(/^\/(?:(blog|qna|service)\/)?([^/]+)\/$/);
  if (!m) return li;
  const name = `${m[1] ? m[1] + '-' : ''}${m[2]}.jpg`;
  return existsSync(join(process.cwd(), 'public', 'og', decodeURIComponent(name))) ? { ...li, image: `${SITE_URL}/og/${name}` } : li;
};


// 업체 — 기존 홈페이지 푸터의 주소·대표·사업자번호(lib/site.ts BUSINESS). 영업 지역은 업체가 적은 10곳
export const businessJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'HomeAndConstructionBusiness',
  '@id': `${SITE_URL}/#business`,
  name: BRAND,
  alternateName: BUSINESS.name,
  url: `${SITE_URL}/`,
  image: `${SITE_URL}/og/home.jpg`,
  telephone: CONTACT.phone,
  founder: BUSINESS.ceo,
  taxID: BUSINESS.bizNumber,
  address: { '@type': 'PostalAddress', addressCountry: 'KR', addressRegion: '경기도', addressLocality: '안성시', streetAddress: BUSINESS.streetAddress },
  sameAs: [BLOG, INSTAGRAM],
  areaServed: ['안성시', '평택시', '천안시', '아산시', '진천군', '음성군', '용인시', '오산시', '이천시', '여주시'],
  knowsAbout: ['건식온수난방', '전기온수기 설치', '분배기 교체', '보일러 설치', '누수탐지', '수도 해빙', '하수구 고압세척', '배관공사', '욕실 리모델링', '집수리', '단열공사'],
});

export const webSiteJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  inLanguage: 'ko',
  publisher: { '@id': `${SITE_URL}/#business` },
});

export const breadcrumbJsonLd = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: i === 0 ? BRAND : it.name, item: `${SITE_URL}${it.path}` })),
});

export const faqJsonLd = (faqs: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

export const serviceJsonLd = (o: { name: string; type: string; description: string; path: string; area: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: o.name,
  serviceType: o.type,
  description: o.description,
  url: `${SITE_URL}${o.path}`,
  dateModified: UPDATED,
  areaServed: { '@type': 'Place', name: o.area },
  provider: { '@id': `${SITE_URL}/#business` },
});

// 캐러셀 ItemList — 같은 도메인 절대 URL, path 는 인코딩된 경로. image 는 실제 사진이 있을 때만. 개수는 호출하는 쪽에서(메인 30·허브 전체·상세 관련)
export const itemListJsonLd = (items: { name: string; path: string; image?: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem', position: i + 1, url: `${SITE_URL}${it.path}`, name: it.name,
    ...(it.image ? { image: `${SITE_URL}${it.image}` } : {}),
  })).map(withOg),
});
