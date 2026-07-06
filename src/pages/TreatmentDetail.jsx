import { Link, useParams } from 'react-router-dom';
import { CalendarDays } from 'lucide-react';
import Breadcrumbs from '../components/seo/Breadcrumbs.jsx';
import SEO from '../components/seo/SEO.jsx';
import { useClinic } from '../context/ClinicContext.jsx';

export default function TreatmentDetail() {
  const { slug } = useParams();
  const { services } = useClinic();
  const service = services.find((item) => item.slug === slug) || services[0];
  return (
    <main>
      <SEO title={service.title} description={service.description} />
      <Breadcrumbs items={[{ label: 'Treatments', href: '/treatments' }, { label: service.title }]} />
      <section className="section-pad">
        <div className="container-lux grid gap-10 lg:grid-cols-[1.1fr_.9fr]">
          <article>
            <p className="eyebrow">{service.category}</p>
            <h1 className="mt-4 font-display text-5xl font-bold md:text-7xl">{service.title}</h1>
            <p className="mt-6 text-xl leading-8 text-slate-600">{service.description}</p>
            <div className="mt-8 rounded-[2rem] bg-clinic-soft p-6 text-slate-700">Treatment plans are individualised after detailed case-taking, medical history review, and follow-up response. For emergency symptoms, seek urgent medical care.</div>
          </article>
          <aside className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-luxury">
            <h2 className="font-display text-3xl font-bold">Book consultation</h2>
            <p className="mt-3 text-slate-600">Discuss symptoms, triggers, and follow-up needs with the clinic.</p>
            <Link to="/book-appointment" className="btn-primary mt-6 w-full"><CalendarDays /> Book Appointment</Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
