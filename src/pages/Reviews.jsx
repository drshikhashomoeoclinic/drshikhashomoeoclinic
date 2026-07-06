import { X } from 'lucide-react';
import { useState } from 'react';
import Breadcrumbs from '../components/seo/Breadcrumbs.jsx';
import SEO from '../components/seo/SEO.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import { useClinic } from '../context/ClinicContext.jsx';

export default function Reviews() {
  const { reviews, site } = useClinic();
  const [activeReview, setActiveReview] = useState(null);
  const reviewImages = reviews.filter((review) => review.image);

  return (
    <main>
      <SEO title="Reviews" description="Patient reviews for Dr. Shikha's Homoeo Clinic." />
      <Breadcrumbs items={[{ label: 'Reviews' }]} />
      <section className="section-pad">
        <div className="container-lux">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <SectionHeader eyebrow="Reviews" title="Patient experiences" text="Uploaded patient review images from the clinic." />
            <a className="btn-primary md:mb-3" href={site.googleReviews} target="_blank" rel="noreferrer">Write a Google Review</a>
          </div>

          {reviewImages.length ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {reviewImages.map((review) => (
                <button
                  className="block w-full overflow-hidden rounded-2xl bg-white p-0 text-left shadow-luxury transition hover:-translate-y-1"
                  key={review.id || review.image}
                  type="button"
                  onClick={() => setActiveReview(review)}
                  aria-label={`Open ${review.title || 'review image'}`}
                >
                  <img
                    className="h-auto w-full rounded-2xl object-contain"
                    src={review.image}
                    alt={review.title || 'Patient review'}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          ) : (
            <p className="mt-8 rounded-2xl bg-clinic-soft p-6 text-center font-semibold text-slate-600">No reviews yet.</p>
          )}
        </div>
      </section>

      {activeReview && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-black/85 p-4" role="dialog" aria-modal="true">
          <button
            className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-white text-clinic-ink shadow-luxury"
            type="button"
            onClick={() => setActiveReview(null)}
            aria-label="Close review image"
          >
            <X size={22} />
          </button>
          <img
            className="max-h-[90vh] w-full max-w-5xl rounded-2xl object-contain shadow-luxury"
            src={activeReview.image}
            alt={activeReview.title || 'Patient review'}
            referrerPolicy="no-referrer"
          />
        </div>
      )}
    </main>
  );
}
