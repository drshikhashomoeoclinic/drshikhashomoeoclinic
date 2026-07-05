import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useClinic } from '../../context/ClinicContext.jsx';

export default function SEO({ title, description, image = '/og-image.jpg', type = 'website', schema }) {
  const { site } = useClinic();
  const { pathname } = useLocation();
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://www.drshikhahomoeoclinic.com';
  const canonical = `${siteUrl}${pathname}`;
  const pageTitle = title ? `${title} | ${site.clinicName}` : `${site.clinicName} | Hindmotor, Uttarpara`;
  const metaDescription = description || 'Premium homoeopathic consultation in Hindmotor, Uttarpara with appointment booking and online consultation requests.';
  const medicalSchema = schema || {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    name: site.clinicName,
    medicalSpecialty: 'Homeopathy',
    address: site.address,
    telephone: site.phone,
    url: siteUrl,
    physician: { '@type': 'Physician', name: site.doctorName, medicalSpecialty: 'Homeopathy' }
  };

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={`${siteUrl}${image}`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="google-site-verification" content={import.meta.env.VITE_SEARCH_CONSOLE_TOKEN || ''} />
      <script type="application/ld+json">{JSON.stringify(medicalSchema)}</script>
    </Helmet>
  );
}
