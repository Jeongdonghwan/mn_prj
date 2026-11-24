// 사이트 설정 — 연락처·도메인은 이 파일만 고치면 전 페이지에 반영된다.
// 근거: source/FACTS.md — 업체 카톡(2026-11-22)·명함, 기존 홈페이지 mnhousing.waplus.kr 푸터, 네이버 블로그 jin3652(95편).
// 사이트 이름 '만능설비박사'(사용자 결정). 상호는 만능하우징설비 · 만능다수리보수. 전화는 대표번호 하나만(사용자 결정).

// 만능설비박사.kr (퓨니코드). 배포: bash scripts/deploy.sh <묶음> <URL>
export const SITE_URL = process.env.SITE_URL || 'https://xn--9h1bq9kg0b45cb8drua.kr';
export const BRAND = '만능설비박사';
export const SITE_NAME = `${BRAND} | 건식난방·전기온수기·누수탐지·집수리`;

export const BLOG = 'https://blog.naver.com/jin3652';
export const INSTAGRAM = 'https://www.instagram.com/youngjin2475/';
export const SHOP = { name: '따스몰', url: 'http://xn--v01b97hruh.com/' }; // 따스몰.com
export const OLD_HOME = 'http://mnhousing.waplus.kr/';

export const CONTACT = {
  phone: '010-8742-6322', // 명함 '대표 M.' 번호, 기존 홈페이지 휴대폰번호
  sms: '010-8742-6322',
  hours: '전화·문자 상담',
};

export const BUSINESS = {
  // 기존 홈페이지 푸터 기준. 계좌번호·메일은 싣지 않는다
  name: '만능하우징설비 · 만능다수리보수',
  ceo: '박영진',
  region: '경기도 안성시',
  streetAddress: '중앙로419번길 48 (숭인동)',
  bizNumber: '212-16-76540',
};

// 순차 오픈: 이 묶음 이하의 페이지만 빌드·사이트맵·내부링크에 포함된다.
//   오픈일 8,000 → 다음 날부터 하루 1,000 (사용자 결정 2026-11-22) — data/drip.json, scripts/build_pages.py
export const OPEN_WAVE = Number(process.env.OPEN_WAVE || 1);

export const UPDATED = '2026-11-22'; // content revision date - bump when page text changes
export const MERGE_VARIANTS = true;

export const tel = `tel:${CONTACT.phone.replace(/[^0-9]/g, '')}`;
export const smsHref = `sms:${CONTACT.sms.replace(/[^0-9]/g, '')}`;
export const absUrl = (path: string) => `${SITE_URL}${path}`;

// og·트위터 카드: public/og/<key>.jpg (scripts/make_og.py 로 생성)
export const shareMeta = (key: string, alt: string, o: { title?: string; description?: string; url?: string } = {}) => {
  const images = [{ url: `${SITE_URL}/og/${encodeURIComponent(key)}.jpg`, width: 1200, height: 630, alt }];
  return {
    openGraph: { type: 'website' as const, siteName: BRAND, locale: 'ko_KR', ...o, images },
    twitter: { card: 'summary_large_image' as const, title: o.title, description: o.description, images },
  };
};

// 서치어드바이저(네이버)·서치콘솔(구글) HTML 태그 소유확인 — content 값만 (도메인 등록 뒤 받기)
export const NAVER_VERIFY = '0505457f05be813c31f37854fb9c258ae828df1d';
export const GOOGLE_VERIFY = 'N9cl4tCn3hQdxm7a-RTdi-fEJM3z-41AwFxudYiBFNQ';
