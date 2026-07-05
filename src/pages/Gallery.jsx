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
          <SectionHeader eyebrow="Gallery" title="A calm, clean clinic experience" />
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
            {gallery.map((item, index) => <button onClick={() => setActive(item)} className="mb-5 block w-full break-inside-avoid rounded-[2rem] border border-slate-100 bg-white p-4 text-left shadow-glass" key={item.title || index}><div className="aspect-[4/3] rounded-[1.5rem] bg-gradient-to-br from-emerald-100 to-blue-100" /><strong className="mt-4 block">{item.title || `Clinic photo ${index + 1}`}</strong></button>)}
          </div>
        </div>
      </section>
      {active && <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" onClick={() => setActive(null)}><div className="max-w-3xl rounded-[2rem] bg-white p-5"><div className="aspect-video rounded-[1.5rem] bg-gradient-to-br from-emerald-100 to-blue-100" /><h2 className="mt-4 font-display text-3xl font-bold">{active.title}</h2></div></div>}
    </main>
  );
}
