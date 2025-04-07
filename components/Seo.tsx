import Head from 'next/head';
import { useRouter } from 'next/router';

interface Props {
  pageTitles?: string;
  pageTitle?: string;
  pageDescription?: string;
  pageImg?: string;
  pageTwt?: string;
  pageImgWidth?: number;
  pageImgHeight?: number;
  pageOgType?: string;
}

export const originTitle = 'Accessible colors - 안전색깔론 서비스';

const Seo = ({
  pageTitles,
  pageTitle,
  pageDescription,
  pageImg,
  pageImgWidth,
  pageImgHeight,
  pageOgType,
  pageTwt,
}: Props) => {
  const router = useRouter();
  const pagePath = router.asPath;
  const domain = 'https://a11y.dev1stud.io';
  const defaultTitle = `${originTitle}`;
  const defaultDescription =
    'WCAG 2.2에 맞게 색깔을 선택하는데 도움을 드리며,  WCAG 2.2 및 WAI-ARIA 1.2의 가이드라인을 가이드라인을 알려드려요.';
  const title = pageTitles || defaultTitle;
  const description = pageDescription || defaultDescription;
  const url = `${domain}${pagePath}`;
  const imgUrl = `${pageImg}`;
  const imgTwt = pageTwt || pageImg;
  const imgWidth = pageImgWidth || 1280;
  const imgHeight = pageImgHeight || 630;
  const ogType = pageOgType || 'website';

  return (
    <Head>
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="description" content={description} />
      <meta property="og:locale" content="ko_KR" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:site_name" content={defaultTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={imgUrl} />
      <meta property="og:image:width" content={String(imgWidth)} />
      <meta property="og:image:height" content={String(imgHeight)} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:site" content={defaultTitle} />
      <meta name="twitter:image" content={imgTwt} />
      <meta name="twitter:description" content={description} />
      <link rel="canonical" href={url} />
      <link rel="alternate" href={url} hrefLang="ko-KR" />
    </Head>
  );
};

export default Seo;
