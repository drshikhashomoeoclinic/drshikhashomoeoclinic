import { motion } from 'framer-motion';
import { ArrowRight, CalendarDays, Clock, MapPin, Phone, ShieldCheck, Sparkles, Stethoscope } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BlogCard from '../components/cards/BlogCard.jsx';
import TreatmentCard from '../components/cards/TreatmentCard.jsx';
import SEO from '../components/seo/SEO.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import { useClinic } from '../context/ClinicContext.jsx';

export default function Home() {
  const { site, doctor, home, services, posts, reviews } = useClinic();
  const homeData = home;
  const [heroImageFailed, setHeroImageFailed] = useState(false);
  const highlights = Array.isArray(homeData.highlights)
    ? homeData.highlights
    : String(homeData.highlights || '').split(',').map((item) => item.trim()).filter(Boolean);
  const featureIcons = [ShieldCheck, Sparkles, Stethoscope];
  const shouldShowHeroImage = Boolean(homeData.heroImage) && !heroImageFailed;

  useEffect(() => {
    setHeroImageFailed(false);
  }, [homeData.heroImage]);

  return (
    <main className="bg-white">
      <SEO />
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#fffdf8_0%,#f6fbfc_52%,#edf7f4_100%)]">
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-teal-50/80 to-transparent" />
        <div className="container-lux relative grid min-h-[680px] items-center gap-10 py-12 lg:grid-cols-[1.02fr_.98fr] lg:py-14">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <p className="eyebrow">{homeData.eyebrow}</p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-extrabold tracking-tight text-clinic-ink sm:text-5xl lg:text-[4.25rem] lg:leading-[0.98]">{homeData.heroTitle}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{homeData.heroSubtitle || `${doctor.doctorName || site.doctorName} offers detailed case-taking, gentle medicines, and structured follow-up for acute and chronic health concerns.`}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link className="btn-primary" to="/book-appointment"><CalendarDays size={19} /> Book Appointment</Link>
              <a className="btn-secondary" href={site.mapLink} target="_blank" rel="noreferrer"><MapPin size={19} /> Get Directions</a>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {(highlights.length ? highlights : ['Personalised care', 'Online consults', 'Follow-up support']).map((item) => (
                <div className="glass rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-teal-100 hover:bg-white" key={item}>{item}</div>
              ))}
            </div>
            <div className="mt-6 grid gap-3 text-sm font-semibold text-slate-700 sm:grid-cols-3">
              <div className="flex items-center gap-2"><MapPin size={17} className="text-clinic-emerald" /> {site.location}</div>
              <div className="flex items-center gap-2"><Clock size={17} className="text-clinic-emerald" /> {site.hours}</div>
              <div className="flex items-center gap-2"><Phone size={17} className="text-clinic-emerald" /> {site.phone}</div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: .98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.08 }} className="relative">
            <div className="relative mx-auto max-w-[500px] overflow-hidden rounded-[2rem] border border-white bg-white p-3 shadow-luxury">
              <div className="relative min-h-[430px] overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-teal-50 via-white to-sky-100 md:min-h-[500px]">
                {shouldShowHeroImage ? (
                  <img
                    src={homeData.heroImage}
                    alt="Hero"
                    className="block h-full min-h-[430px] w-full object-cover object-center md:min-h-[500px]"
                    loading="eager"
                    referrerPolicy="no-referrer"
                    onError={() => setHeroImageFailed(true)}
                  />
                ) : (
                  <div className="grid min-h-[430px] place-items-center p-8 text-center md:min-h-[500px]">
                    <Stethoscope className="mx-auto text-clinic-emerald" size={64} />
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-clinic-ink/28 via-transparent to-transparent" />
              </div>
              <div className="absolute inset-x-6 bottom-6 rounded-3xl border border-white/80 bg-white/90 p-4 shadow-glass backdrop-blur-xl">
                <h2 className="font-display text-2xl font-bold leading-tight">{doctor.doctorName || site.doctorName}</h2>
                <p className="mt-1 text-sm font-semibold text-clinic-emerald">{doctor.qualification || site.qualification}</p>
                <div className="mt-4 grid w-full grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-teal-50/80 p-3"><strong className="block text-xl text-clinic-emerald">{doctor.experience || site.experience}</strong><span className="text-xs font-medium text-slate-500">Years</span></div>
                  <div className="rounded-2xl bg-sky-50 p-3"><strong className="block text-xl text-clinic-blue">{doctor.patients || site.patients}</strong><span className="text-xs font-medium text-slate-500">Patients</span></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container-lux grid gap-5 md:grid-cols-3">
          {homeData.featureCards.map((card, index) => {
            const Icon = featureIcons[index] || ShieldCheck;
            return (
              <motion.div whileHover={{ y: -5 }} className="rounded-[1.5rem] border border-slate-100 bg-white p-6 shadow-glass transition hover:border-teal-100" key={card.title}>
                <span className="grid size-11 place-items-center rounded-2xl bg-teal-50 text-clinic-emerald"><Icon size={22} /></span>
                <h3 className="mt-5 font-display text-xl font-bold">{card.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{card.text}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="section-pad bg-clinic-soft">
        <div className="container-lux">
          <SectionHeader eyebrow="Treatments" title={homeData.treatmentsTitle} text={homeData.treatmentsText} />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{services.slice(0, 6).map((service) => <TreatmentCard key={service.id || service.slug || service.title} service={service} />)}</div>
          <Link className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-clinic-emerald shadow-glass transition hover:-translate-y-0.5" to="/treatments">View all treatments <ArrowRight size={17} /></Link>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-lux grid gap-8 lg:grid-cols-[.82fr_1.18fr]">
          <SectionHeader eyebrow="Patient reviews" title={homeData.reviewsTitle} text={homeData.reviewsText} />
          <div className="grid gap-4">{reviews.slice(0, 3).map((review) => <motion.div whileHover={{ y: -3 }} className="rounded-[1.5rem] border border-slate-100 bg-white p-6 shadow-glass" key={review.id || review.name}><p className="text-sm tracking-[0.18em] text-amber-500">{'★'.repeat(review.rating || 5)}</p><p className="mt-3 text-base leading-7 text-slate-700">"{review.text}"</p><strong className="mt-4 block text-sm text-clinic-ink">{review.name}</strong></motion.div>)}</div>
        </div>
      </section>

      <section className="section-pad bg-clinic-soft">
        <div className="container-lux">
          <SectionHeader eyebrow="Health notes" title={homeData.blogTitle} />
          <div className="grid gap-6 md:grid-cols-3">{posts.slice(0, 3).map((post) => <BlogCard key={post.id || post.slug || post.title} post={post} />)}</div>
        </div>
      </section>
    </main>
  );
}
