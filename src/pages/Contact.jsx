import { Mail, MapPin, Navigation, Phone } from 'lucide-react';
import Breadcrumbs from '../components/seo/Breadcrumbs.jsx';
import SEO from '../components/seo/SEO.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import { useClinic } from '../context/ClinicContext.jsx';
import { phoneHref } from '../lib/contact.js';

export default function Contact() {
  const { site, home } = useClinic();
  return (
    <main>
      <SEO title="Contact" description={`Contact ${site.clinicName} at ${site.address}.`} />
      <Breadcrumbs items={[{ label: 'Contact' }]} />
      <section className="section-pad">
        <div className="container-lux grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <SectionHeader eyebrow="Contact" title={home.contactTitle || 'Visit or reach us'} text={home.contactText || site.address} />
            <div className="grid gap-3">
              <a className="btn-primary" href={phoneHref(site.phone)}><Phone /> Call {site.phone}</a>
              <a className="btn-secondary" href={`mailto:${site.email}`}><Mail /> {site.email}</a>
              <a className="btn-secondary" href={site.mapLink} target="_blank" rel="noreferrer"><Navigation /> One Click Navigation</a>
              <p className="rounded-3xl bg-clinic-soft p-5 text-slate-700"><MapPin className="mb-3 text-clinic-emerald" /> {site.address}<br /><span className="mt-2 inline-block font-semibold">{site.hours}</span></p>
            </div>
          </div>
          <iframe className="min-h-[420px] w-full rounded-[2rem] border-0 shadow-luxury" title="Clinic map" src={site.mapEmbed} loading="lazy" />
        </div>
      </section>
    </main>
  );
}
