import SEO from '../components/seo/SEO.jsx';
import Breadcrumbs from '../components/seo/Breadcrumbs.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import { useClinic } from '../context/ClinicContext.jsx';

export default function AboutDoctor() {
  const { site, doctor } = useClinic();
  const doctorName = doctor.doctorName || site.doctorName;
  const qualification = doctor.qualification || site.qualification;
  const experience = doctor.experience || site.experience;
  const about = doctor.about || site.about;
  return (
    <main>
      <SEO title="About Doctor" description={`Meet ${doctorName}, homoeopathic consultant at ${site.clinicName}.`} />
      <Breadcrumbs items={[{ label: 'About Doctor' }]} />
      <section className="section-pad">
        <div className="container-lux grid gap-12 lg:grid-cols-[.9fr_1.1fr]">
          <div className="rounded-[3rem] bg-gradient-to-br from-emerald-100 to-blue-100 p-8 shadow-luxury"><div className="grid aspect-[4/5] place-items-center rounded-[2.2rem] bg-white/70 bg-cover bg-center p-8 text-center" style={(doctor.doctorPhoto || doctor.image) ? { backgroundImage: `linear-gradient(rgba(255,255,255,.72), rgba(255,255,255,.72)), url(${doctor.doctorPhoto || doctor.image})` } : undefined}><h1 className="font-display text-5xl font-bold">{doctorName}</h1><p className="mt-4 font-semibold text-clinic-emerald">{qualification}</p></div></div>
          <div>
            <SectionHeader eyebrow="Doctor Profile" title={doctor.profileTitle || 'Care built on listening, follow-up, and trust.'} text={about} />
            <div className="grid gap-4 sm:grid-cols-2">
              {[`Qualification: ${qualification}`, `${experience} years experience`, doctor.certificates || 'Certificates and achievements ready in admin', `${site.clinicName}, ${site.location || site.address}`].map((item) => <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-glass" key={item}>{item}</div>)}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
