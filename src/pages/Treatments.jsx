import { CalendarDays, MapPin, MessageCircle, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import TreatmentCard from '../components/cards/TreatmentCard.jsx';
import Breadcrumbs from '../components/seo/Breadcrumbs.jsx';
import SEO from '../components/seo/SEO.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import { useClinic } from '../context/ClinicContext.jsx';
import { whatsappHref } from '../lib/contact.js';

export default function Treatments() {
  const { services, site } = useClinic();
  return (
    <main>
      <SEO title="Treatments" description="Homoeopathic treatment areas at Dr. Shikha's Homoeo Clinic." />
      <Breadcrumbs items={[{ label: 'Treatments' }]} />
      <section className="section-pad bg-clinic-soft">
        <div className="container-lux">
          <SectionHeader eyebrow="Treatments" title="Choose your health concern" text="Open a condition page to understand symptoms, consultation process, helpful details to bring, and booking options." />
          <div className="mb-8 grid gap-4 rounded-[2rem] bg-white p-4 shadow-glass md:grid-cols-3">
            {[
              [ShieldCheck, 'Personalised consultation', 'Care based on your full symptom history.'],
              [MapPin, site.location || 'Hindmotor, Uttarpara', 'Clinic and online booking support.'],
              [CalendarDays, site.hours || 'Mon-Sat', 'Choose a preferred date and time.']
            ].map(([Icon, title, text]) => (
              <div className="flex gap-3 rounded-2xl bg-clinic-soft p-4" key={title}>
                <Icon className="shrink-0 text-clinic-emerald" size={22} />
                <div>
                  <strong className="block text-clinic-ink">{title}</strong>
                  <span className="text-sm leading-5 text-slate-500">{text}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{services.map((service) => <TreatmentCard service={service} key={service.slug || service.title} />)}</div>
          <div className="mt-10 rounded-[2rem] bg-clinic-ink p-6 text-white shadow-luxury md:p-8">
            <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-clinic-gold">Not sure what to choose?</p>
                <h2 className="mt-3 font-display text-4xl font-bold">Tell us your symptoms. The clinic will guide you.</h2>
                <p className="mt-3 max-w-2xl leading-7 text-white/72">You can book a general consultation and write your main problem in simple words.</p>
              </div>
              <div className="grid gap-3 sm:flex sm:flex-wrap md:justify-end">
                <Link className="btn-primary" to="/book-appointment">Book Appointment</Link>
                <a className="btn-secondary bg-white/85" href={whatsappHref(site.whatsapp, 'Hi, I am not sure which treatment to select. I want appointment guidance.')} target="_blank" rel="noreferrer"><MessageCircle size={18} /> WhatsApp</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
