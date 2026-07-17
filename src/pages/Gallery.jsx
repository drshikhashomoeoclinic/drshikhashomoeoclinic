import { Images, X } from 'lucide-react';
import { useState } from 'react';
import Breadcrumbs from '../components/seo/Breadcrumbs.jsx';
import SEO from '../components/seo/SEO.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import { useClinic } from '../context/ClinicContext.jsx';

export default function Gallery() {
  const { gallery } = useClinic();
  const [active, setActive] = useState(null);

  return (
    <main>
      <SEO title="Gallery" description="Clinic photos and facility gallery." />
      <Breadcrumbs items={[{ label: 'Gallery' }]} />
      <section className="section-pad bg-clinic-soft">
        <div className="container-lux">
          <SectionHeader eyebrow="Gallery" title="A calm, clean clinic experience" text="See clinic photos before you visit." />
          {gallery.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((item, index) => (
                <button
                  onClick={() => setActive(item)}
                  className="group block w-full rounded-[2rem] border border-white/70 bg-white p-4 text-left shadow-glass transition hover:-translate-y-1 hover:shadow-luxury"
                  key={item.id || item.title || index}
                  type="button"
                  aria-label={`Open ${item.title || `clinic photo ${index + 1}`}`}
                >
                  <div className="grid aspect-[4/3] place-items-center overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-white via-clinic-cream to-emerald-50">
                    {item.image ? (
                      <img
                        className="h-full w-full object-contain p-2 transition duration-500 group-hover:scale-[1.02]"
                        src={item.image}
                        alt={item.title || `Clinic photo ${index + 1}`}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <Images className="text-clinic-emerald/45" size={38} />
                    )}
                  </div>
                  <strong className="mt-4 block font-display text-2xl text-clinic-ink">{item.title || `Clinic photo ${index + 1}`}</strong>
                </button>
              ))}
            </div>
          ) : (
            <p className="rounded-2xl bg-white p-6 text-center font-semibold text-slate-600 shadow-glass">No gallery photos yet.</p>
          )}
        </div>
      </section>

      {active && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-black/85 p-4" role="dialog" aria-modal="true" onClick={() => setActive(null)}>
          <button
            className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-white text-clinic-ink shadow-luxury"
            type="button"
            onClick={() => setActive(null)}
            aria-label="Close gallery image"
          >
            <X size={22} />
          </button>
          <div className="w-full max-w-5xl rounded-[2rem] bg-white p-3 shadow-luxury sm:p-5" onClick={(event) => event.stopPropagation()}>
            {active.image ? (
              <img
                className="max-h-[82vh] w-full rounded-[1.5rem] object-contain"
                src={active.image}
                alt={active.title || 'Clinic photo'}
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="grid min-h-[280px] place-items-center rounded-[1.5rem] bg-clinic-soft"><Images className="text-clinic-emerald/45" size={48} /></div>
            )}
            <h2 className="mt-4 px-2 font-display text-3xl font-bold text-clinic-ink">{active.title || 'Clinic photo'}</h2>
          </div>
        </div>
      )}
    </main>
  );
}
