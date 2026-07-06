import TreatmentCard from '../components/cards/TreatmentCard.jsx';
import Breadcrumbs from '../components/seo/Breadcrumbs.jsx';
import SEO from '../components/seo/SEO.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import { useClinic } from '../context/ClinicContext.jsx';

export default function Treatments() {
  const { services } = useClinic();
  return (
    <main>
      <SEO title="Treatments" description="Homoeopathic treatment areas at Dr. Shikha's Homoeo Clinic." />
      <Breadcrumbs items={[{ label: 'Treatments' }]} />
      <section className="section-pad bg-clinic-soft">
        <div className="container-lux">
          <SectionHeader eyebrow="Treatments" title="Specialised supportive care" text="Browse conditions and open each treatment page for more details." />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{services.map((service) => <TreatmentCard service={service} key={service.slug || service.title} />)}</div>
        </div>
      </section>
    </main>
  );
}
