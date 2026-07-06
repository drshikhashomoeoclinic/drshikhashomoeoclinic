import Breadcrumbs from '../components/seo/Breadcrumbs.jsx';
import SEO from '../components/seo/SEO.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import { useClinic } from '../context/ClinicContext.jsx';

function DefaultAvatar({ name }) {
  const initial = String(name || 'Patient').trim().charAt(0).toUpperCase() || 'P';
  return (
    <div className="grid size-14 shrink-0 place-items-center rounded-full bg-clinic-soft font-display text-xl font-bold text-clinic-emerald">
      {initial}
    </div>
  );
}

export default function Reviews() {
  const { reviews, site } = useClinic();
  return (
    <main>
      <SEO title="Reviews" description="Patient reviews for Dr. Shikha's Homoeo Clinic." />
      <Breadcrumbs items={[{ label: 'Reviews' }]} />
      <section className="section-pad">
        <div className="container-lux">
          <SectionHeader eyebrow="Reviews" title="Patient experiences" text="Manage testimonials and Google review links from the admin dashboard." />
          <div className="grid gap-6 md:grid-cols-3">
            {reviews.map((review) => (
              <article className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-glass" key={review.id || review.name}>
                <div className="flex items-center gap-4">
                  {review.image ? (
                    <img
                      className="size-14 shrink-0 rounded-full object-cover"
                      src={review.image}
                      alt={review.name ? `${review.name} avatar` : 'Reviewer avatar'}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <DefaultAvatar name={review.name} />
                  )}
                  <div>
                    <strong className="block">{review.name}</strong>
                    <p className="text-amber-500">{'★'.repeat(review.rating || 5)}</p>
                  </div>
                </div>
                <p className="mt-4 text-slate-700">"{review.text}"</p>
              </article>
            ))}
          </div>
          <a className="btn-primary mt-8" href={site.googleReviews} target="_blank" rel="noreferrer">Open Google Reviews</a>
        </div>
      </section>
    </main>
  );
}
