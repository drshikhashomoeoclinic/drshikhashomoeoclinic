import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useClinic } from '../../context/ClinicContext.jsx';

export default function SEO({ title, description, image = '/og-image.jpg', type = 'website', schema }) {
  const { site, seo } = useClinic();
  const { pathname } = useLocation();
  const siteUrl = (seo?.canonicalBase || seo?.siteUrl || import.meta.env.VITE_SITE_URL || 'https://www.drshikhahomoeoclinic.com').replace(/\/$/, '');
  const canonical = `${siteUrl}${pathname}`;
  const pageKey = pathname === '/' ? 'home' : pathname.split('/').filter(Boolean)[0]?.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
  const configuredTitle = seo?.[`${pageKey}Title`] || seo?.pages?.[pathname]?.title;
  const configuredDescription = seo?.[`${pageKey}Description`] || seo?.pages?.[pathname]?.description;
  const configuredImage = seo?.[`${pageKey}Image`] || seo?.pages?.[pathname]?.image || seo?.image;
  const pageTitle = configuredTitle || (title ? `${title} | ${site.clinicName}` : (seo?.title || `${site.clinicName} | Hindmotor, Uttarpara`));
  const metaDescription = configuredDescription || description || seo?.description || 'Premium homoeopathic consultation in Hindmotor, Uttarpara with appointment booking and online consultation requests.';
  const keywords = seo?.keywords || `${site.clinicName}, homoeopathic clinic, Hindmotor, Uttarpara`;
  const ogImage = configuredImage || image || '/og-image.jpg';
  const googleAnalyticsId = seo?.googleAnalyticsId || import.meta.env.VITE_GA_MEASUREMENT_ID || '';
  const searchConsoleToken = seo?.searchConsoleVerification || import.meta.env.VITE_SEARCH_CONSOLE_TOKEN || '';
  const medicalSchema = schema || {
    '@context': 'https://schema.org',
    '@type': seo?.schemaType || 'MedicalClinic',
    name: site.clinicName,
    description: metaDescription,
    medicalSpecialty: seo?.medicalSpecialty || 'Homeopathy',
    address: site.address,
    telephone: site.phone,
    email: site.email,
    openingHours: site.hours,
    priceRange: seo?.priceRange || '$$',
    areaServed: seo?.areaServed || site.location,
    image: ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`,
    url: siteUrl,
    physician: { '@type': 'Physician', name: site.doctorName, medicalSpecialty: seo?.medicalSpecialty || 'Homeopathy' }
  };

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`} />
      {searchConsoleToken && <meta name="google-site-verification" content={searchConsoleToken} />}
      {googleAnalyticsId && <script async src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`} />}
      {googleAnalyticsId && <script>{`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', ${JSON.stringify(googleAnalyticsId)});`}</script>}
      <script type="application/ld+json">{JSON.stringify(medicalSchema)}</script>
    </Helmet>
  );
}
