import { motion } from 'framer-motion';
import { ArrowRight, CalendarDays, MapPin, ShieldCheck, Sparkles, Stethoscope } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import BlogCard from '../components/cards/BlogCard.jsx';
import TreatmentCard from '../components/cards/TreatmentCard.jsx';
import SEO from '../components/seo/SEO.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import { useClinic } from '../context/ClinicContext.jsx';

export default function Home() {
  const { site, doctor, home, services, posts, reviews } = useClinic();
  const [heroImageFailed, setHeroImageFailed] = useState(false);
  const highlights = Array.isArray(home.highlights)
    ? home.highlights
    : String(home.highlights || '').split(',').map((item) => item.trim()).filter(Boolean);
  const featureIcons = [ShieldCheck, Sparkles, Stethoscope];
  const heroImage = home.heroImage || home.heroImageUrl || home.imageUrl || home.image || doctor.doctorPhoto || doctor.image || '';
  const shouldShowHeroImage = Boolean(heroImage) && !heroImageFailed;

  return (
    <main>
      <SEO />
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_80%_20%,rgba(4,120,87,.16),transparent_32%),linear-gradient(135deg,#fff,#f6f8fb)]">
        <div className="container-lux grid min-h-[760px] items-center gap-12 py-16 lg:grid-cols-[1.05fr_.95fr]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <p className="eyebrow">{home.eyebrow}</p>
            <h1 className="mt-5 font-display text-5xl font-extrabold tracking-tight text-clinic-ink md:text-7xl">{home.heroTitle}</h1>
            <p className="mt-6 max-w-2xl text-xl leading-8 text-slate-600">{home.heroSubtitle || `${doctor.doctorName || site.doctorName} offers detailed case-taking, gentle medicines, and structured follow-up for acute and chronic health concerns.`}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link className="btn-primary" to="/book-appointment"><CalendarDays size={20} /> Book Appointment</Link>
              <a className="btn-secondary" href={site.mapLink} target="_blank" rel="noreferrer"><MapPin size={20} /> Get Directions</a>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {(highlights.length ? highlights : ['Personalised care', 'Online consults', 'Follow-up support']).map((item) => <div className="glass rounded-3xl p-4 font-semibold" key={item}>{item}</div>)}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[3rem] bg-gradient-to-br from-emerald-100 via-white to-blue-100 p-6 shadow-luxury">
              {shouldShowHeroImage && (
                <img
                  src={heroImage}
                  alt={home.clinicName || site.clinicName || 'Clinic image'}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="eager"
                  referrerPolicy="no-referrer"
                  onError={() => setHeroImageFailed(true)}
                />
              )}
              {shouldShowHeroImage && <div className="absolute inset-0 bg-white/60" />}
              <div className="relative grid h-full place-items-center rounded-[2.3rem] border border-white/70 bg-white/70 p-8 text-center backdrop-blur-xl">
                <Stethoscope className="mx-auto text-clinic-emerald" size={72} />
                <h2 className="mt-8 font-display text-4xl font-bold">{doctor.doctorName || site.doctorName}</h2>
                <p className="mt-2 font-semibold text-clinic-emerald">{doctor.qualification || site.qualification}</p>
                <div className="mt-8 grid w-full grid-cols-2 gap-3">
                  <div className="rounded-3xl bg-white p-5 shadow-glass"><strong className="block text-3xl text-clinic-emerald">{doctor.experience || site.experience}</strong><span className="text-sm text-slate-500">Years</span></div>
                  <div className="rounded-3xl bg-white p-5 shadow-glass"><strong className="block text-3xl text-clinic-blue">{doctor.patients || site.patients}</strong><span className="text-sm text-slate-500">Patients</span></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      <section className="section-pad">
        <div className="container-lux grid gap-6 md:grid-cols-3">
          {home.featureCards.map((card, index) => {
            const Icon = featureIcons[index] || ShieldCheck;
            return <div className="rounded-[2rem] border border-slate-100 bg-white p-7 shadow-glass" key={card.title}><Icon className="text-clinic-emerald" /><h3 className="mt-5 font-display text-2xl font-bold">{card.title}</h3><p className="mt-3 text-slate-600">{card.text}</p></div>;
          })}
        </div>
      </section>
      <section className="section-pad bg-clinic-soft">
        <div className="container-lux">
          <SectionHeader eyebrow="Treatments" title={home.treatmentsTitle} text={home.treatmentsText} />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{services.slice(0, 6).map((service) => <TreatmentCard key={service.id || service.slug || service.title} service={service} />)}</div>
          <Link className="mt-8 inline-flex items-center gap-2 font-bold text-clinic-emerald" to="/treatments">View all treatments <ArrowRight size={18} /></Link>
        </div>
      </section>
      <section className="section-pad">
        <div className="container-lux grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <SectionHeader eyebrow="Patient reviews" title={home.reviewsTitle} text={home.reviewsText} />
          <div className="grid gap-4">{reviews.slice(0, 3).map((review) => <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-glass" key={review.id || review.name}><p className="text-amber-500">{'★'.repeat(review.rating || 5)}</p><p className="mt-3 text-lg text-slate-700">"{review.text}"</p><strong className="mt-4 block">{review.name}</strong></div>)}</div>
        </div>
      </section>
      <section className="section-pad bg-clinic-soft">
        <div className="container-lux">
          <SectionHeader eyebrow="Health notes" title={home.blogTitle} />
          <div className="grid gap-6 md:grid-cols-3">{posts.slice(0, 3).map((post) => <BlogCard key={post.id || post.slug || post.title} post={post} />)}</div>
        </div>
      </section>
    </main>
  );
}
