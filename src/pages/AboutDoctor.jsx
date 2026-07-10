import { Award, GraduationCap, MapPin, ShieldCheck, Sparkles, Stethoscope } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../components/seo/SEO.jsx';
import Breadcrumbs from '../components/seo/Breadcrumbs.jsx';
import { useClinic } from '../context/ClinicContext.jsx';

function splitList(value = '') {
  return String(value || '')
    .split(/\r?\n|\*/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function AboutDoctor() {
  const { site, doctor } = useClinic();
  const doctorName = doctor.doctorName || site.doctorName;
  const qualification = doctor.qualification || site.qualification;
  const experience = doctor.experience || site.experience;
  const about = doctor.about || site.about || `${doctorName} offers attentive homoeopathic consultation with careful case-taking, gentle medicines, and structured follow-up for families in ${site.location || 'Hindmotor, Uttarpara'}.`;
  const doctorPhoto = doctor.doctorPhoto || doctor.image || '';
  const certificates = splitList(doctor.certificates || 'Bachelor of Homoeopathic Medicine & Surgery (BHMS) * Registered Homoeopathic Practitioner * Chronic disease consultation * Continued medical learning');
  const achievements = splitList(doctor.achievements || `${site.clinicName}, ${site.location || site.address}`);

  const profileCards = [
    { icon: GraduationCap, label: 'Qualification', value: qualification },
    { icon: Award, label: 'Experience', value: `${experience} years experience` },
    { icon: ShieldCheck, label: 'Approach', value: 'Personalised case-taking and follow-up care' },
    { icon: MapPin, label: 'Clinic', value: `${site.clinicName}, ${site.location || site.address}` }
  ];

  return (
    <main className="lux-bg overflow-hidden">
      <SEO title="About Doctor" description={`Meet ${doctorName}, homoeopathic consultant at ${site.clinicName}.`} />
      <Breadcrumbs items={[{ label: 'About Doctor' }]} />

      <section className="section-pad pt-8 md:pt-14">
        <div className="container-lux grid gap-8 lg:grid-cols-[.88fr_1.12fr] lg:items-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="relative mx-auto w-full max-w-[520px]">
            <span className="absolute -right-2 top-8 h-52 w-52 rounded-full border border-clinic-gold/40 shadow-glow md:h-80 md:w-80" aria-hidden="true" />
            <div className="premium-panel p-3">
              <div className="relative overflow-hidden rounded-[1.4rem] bg-gradient-to-br from-white/80 via-clinic-cream to-emerald-50">
                {doctorPhoto ? (
                  <img className="aspect-[4/5] w-full object-cover object-center" src={doctorPhoto} alt={doctorName} loading="lazy" referrerPolicy="no-referrer" />
                ) : (
                  <div className="grid aspect-[4/5] place-items-center">
                    <Stethoscope className="text-clinic-emerald" size={72} />
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-clinic-ink/18 via-transparent to-white/5" />
              </div>
              <div className="mt-3 rounded-[1.25rem] border border-white/70 bg-white/78 p-4 shadow-glass backdrop-blur-2xl">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-clinic-gold">Doctor Profile</p>
                <h1 className="mt-2 font-display text-4xl font-bold leading-none text-clinic-ink sm:text-5xl">{doctorName}</h1>
                <p className="mt-3 text-sm font-semibold leading-6 text-clinic-emerald">{qualification}</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.08 }}>
            <p className="eyebrow">Doctor Profile</p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight text-clinic-ink sm:text-5xl lg:text-6xl">{doctor.profileTitle || 'Experienced Homoeopathic Physician & Family Health Consultant'}</h2>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">{about}</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {profileCards.map(({ icon: Icon, label, value }) => (
                <article className="glass-card p-4 sm:p-5" key={label}>
                  <div className="flex items-start gap-3">
                    <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-white/70 bg-white/70 text-clinic-emerald"><Icon size={21} /></span>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-clinic-gold">{label}</p>
                      <p className="mt-1 text-sm font-semibold leading-6 text-clinic-ink">{value}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="pb-20 md:pb-24">
        <div className="container-lux grid gap-6 lg:grid-cols-[1fr_.8fr]">
          <motion.article initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card p-5 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-2xl border border-white/70 bg-white/70 text-clinic-emerald"><Sparkles size={23} /></span>
              <div>
                <p className="eyebrow">Training & Credentials</p>
                <h3 className="font-display text-3xl font-bold text-clinic-ink">Professional foundation</h3>
              </div>
            </div>
            <div className="mt-6 grid gap-3">
              {certificates.map((item) => (
                <p className="rounded-2xl border border-white/70 bg-white/62 p-4 text-base leading-7 text-slate-700" key={item}>{item}</p>
              ))}
            </div>
          </motion.article>

          <motion.article initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 }} className="glass-card p-5 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-2xl border border-white/70 bg-white/70 text-clinic-emerald"><MapPin size={23} /></span>
              <div>
                <p className="eyebrow">Clinic Location</p>
                <h3 className="font-display text-3xl font-bold text-clinic-ink">Consultation address</h3>
              </div>
            </div>
            <div className="mt-6 grid gap-3">
              {achievements.map((item) => (
                <p className="rounded-2xl border border-white/70 bg-white/62 p-4 text-base leading-7 text-slate-700" key={item}>{item}</p>
              ))}
              <p className="rounded-2xl border border-white/70 bg-white/62 p-4 text-base leading-7 text-slate-700">{site.address}</p>
            </div>
          </motion.article>
        </div>
      </section>
    </main>
  );
}
