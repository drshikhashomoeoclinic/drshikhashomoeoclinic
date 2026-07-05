import Breadcrumbs from '../components/seo/Breadcrumbs.jsx';
import SEO from '../components/seo/SEO.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import { useClinic } from '../context/ClinicContext.jsx';

export default function Reviews() {
  const { reviews, site } = useClinic();
  return (
    <main>
      <SEO title="Reviews" description="Patient reviews for Dr. Shikha's Homoeo Clinic." />
      <Breadcrumbs items={[{ label: 'Reviews' }]} />
      <section className="section-pad">
        <div className="container-lux">
          <SectionHeader eyebrow="Reviews" title="Patient experiences" text="Manage testimonials and Google review links from the admin dashboard." />
          <div className="grid gap-6 md:grid-cols-3">{reviews.map((review) => <article className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-glass" key={review.name}><p className="text-amber-500">{'★'.repeat(review.rating || 5)}</p><p className="mt-4 text-slate-700">"{review.text}"</p><strong className="mt-5 block">{review.name}</strong></article>)}</div>
          <a className="btn-primary mt-8" href={site.googleReviews} target="_blank" rel="noreferrer">Open Google Reviews</a>
        </div>
      </section>
    </main>
  );
}
