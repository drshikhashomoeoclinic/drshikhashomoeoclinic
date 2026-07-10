import { motion } from 'framer-motion';
import { ArrowRight, CalendarDays, Clock, MapPin, Phone, Quote, ShieldCheck, Sparkles, Star, Stethoscope } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BlogCard from '../components/cards/BlogCard.jsx';
import TreatmentCard from '../components/cards/TreatmentCard.jsx';
import SEO from '../components/seo/SEO.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import { useClinic } from '../context/ClinicContext.jsx';

const bubbles = [
  ['left-[5%] top-[12%] size-20', 0],
  ['left-[18%] top-[68%] size-12', 0.4],
  ['left-[38%] top-[10%] size-10', 0.2],
  ['right-[7%] top-[16%] size-24', 0.6],
  ['right-[19%] top-[56%] size-14', 0.1],
  ['right-[42%] bottom-[10%] size-9', 0.7],
  ['left-[8%] bottom-[12%] size-16', 0.3],
  ['right-[4%] bottom-[18%] size-11', 0.5],
  ['left-[52%] top-[22%] size-7', 0.8],
  ['left-[28%] bottom-[26%] size-8', 0.2],
  ['right-[31%] top-[8%] size-6', 0.4],
  ['left-[46%] bottom-[4%] size-14', 0.6]
];

function FloatingBubbles() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {bubbles.map(([className, delay], index) => (
        <motion.span
          aria-hidden="true"
          className={`floating-bubble ${className}`}
          key={`${className}-${index}`}
          animate={{ y: [0, -14, 0], opacity: [0.34, 0.58, 0.34] }}
          transition={{ duration: 6 + index * 0.25, repeat: Infinity, ease: 'easeInOut', delay }}
        />
      ))}
    </div>
  );
}

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.25 },
    transition: { duration: 0.55, delay }
  };
}

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
    <main className="lux-bg overflow-hidden">
      <SEO />
      <section id="home-hero" className="relative overflow-hidden">
        <FloatingBubbles />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/70 to-transparent" />
        <div className="container-lux relative grid min-h-[720px] items-center gap-12 py-14 lg:grid-cols-[1.02fr_.98fr] lg:py-16">
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.62 }}>
            <p className="eyebrow">{homeData.eyebrow}</p>
            <h1 className="mt-5 max-w-3xl font-display text-5xl font-extrabold tracking-tight text-clinic-ink sm:text-6xl lg:text-[4.8rem] lg:leading-[0.95]">{homeData.heroTitle}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">{homeData.heroSubtitle || `${doctor.doctorName || site.doctorName} offers detailed case-taking, gentle medicines, and structured follow-up for acute and chronic health concerns.`}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="btn-primary px-6 py-3.5" to="/book-appointment"><CalendarDays size={19} /> Book Appointment</Link>
              <a className="btn-secondary px-6 py-3.5" href={site.mapLink} target="_blank" rel="noreferrer"><MapPin size={19} /> Get Directions</a>
            </div>
            <div className="mt-9 grid gap-3 sm:grid-cols-3">
              {(highlights.length ? highlights : ['Personalised care', 'Online consults', 'Follow-up support']).map((item, index) => (
                <motion.div {...fadeUp(index * 0.06)} className="glass rounded-[1.25rem] px-4 py-4 text-sm font-semibold text-slate-700 ring-1 ring-white/35" key={item}>{item}</motion.div>
              ))}
            </div>
            <div className="mt-7 grid gap-3 text-sm font-semibold text-slate-700 sm:grid-cols-3">
              <div className="glass flex items-center gap-2 rounded-full px-4 py-3"><MapPin size={17} className="text-clinic-emerald" /> {site.location}</div>
              <div className="glass flex items-center gap-2 rounded-full px-4 py-3"><Clock size={17} className="text-clinic-emerald" /> {site.hours}</div>
              <div className="glass flex items-center gap-2 rounded-full px-4 py-3"><Phone size={17} className="text-clinic-emerald" /> {site.phone}</div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.08 }} className="relative">
            <motion.span aria-hidden="true" className="absolute -right-4 top-10 h-72 w-72 rounded-full border border-clinic-gold/45 shadow-glow md:h-96 md:w-96" animate={{ rotate: 360 }} transition={{ duration: 42, repeat: Infinity, ease: 'linear' }} />
            <span className="floating-bubble -left-5 top-16 size-16" />
            <span className="floating-bubble bottom-24 right-2 size-12" />
            <div className="glass-card relative mx-auto max-w-[520px] overflow-hidden rounded-[2rem] p-3 shadow-luxury">
              <div className="relative min-h-[440px] overflow-hidden rounded-[1.55rem] bg-gradient-to-br from-white/80 via-clinic-cream to-emerald-50 md:min-h-[540px]">
                {shouldShowHeroImage ? (
                  <img
                    src={homeData.heroImage}
                    alt="Hero"
                    className="block h-full min-h-[440px] w-full object-cover object-center md:min-h-[540px]"
                    loading="eager"
                    referrerPolicy="no-referrer"
                    onError={() => setHeroImageFailed(true)}
                  />
                ) : (
                  <div className="grid min-h-[440px] place-items-center p-8 text-center md:min-h-[540px]">
                    <Stethoscope className="mx-auto text-clinic-emerald" size={68} />
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-clinic-ink/30 via-transparent to-white/5" />
              </div>
              <div className="absolute inset-x-6 bottom-6 rounded-[1.5rem] border border-white/70 bg-white/72 p-4 shadow-glass backdrop-blur-2xl">
                <h2 className="font-display text-2xl font-bold leading-tight">{doctor.doctorName || site.doctorName}</h2>
                <p className="mt-1 text-sm font-semibold text-clinic-emerald">{doctor.qualification || site.qualification}</p>
                <div className="mt-4 grid w-full grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/70 bg-white/60 p-3"><strong className="block text-xl text-clinic-emerald">{doctor.experience || site.experience}</strong><span className="text-xs font-medium text-slate-500">Years</span></div>
                  <div className="rounded-2xl border border-white/70 bg-white/60 p-3"><strong className="block text-xl text-clinic-blue">{doctor.patients || site.patients}</strong><span className="text-xs font-medium text-slate-500">Patients</span></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="home-features" className="relative py-12 md:py-16">
        <div className="container-lux grid auto-rows-fr gap-5 md:grid-cols-3">
          {homeData.featureCards.map((card, index) => {
            const Icon = featureIcons[index] || ShieldCheck;
            return (
              <motion.div {...fadeUp(index * 0.08)} whileHover={{ y: -8, scale: 1.01 }} className="glass-card glass-card-hover h-full p-6" key={card.title}>
                <span className="grid size-12 place-items-center rounded-2xl border border-white/70 bg-white/65 text-clinic-emerald shadow-sm"><Icon size={24} /></span>
                <h3 className="mt-6 font-display text-xl font-bold">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{card.text}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section id="home-treatments" className="section-pad relative bg-white/30">
        <div className="container-lux">
          <SectionHeader eyebrow="Treatments" title={homeData.treatmentsTitle} text={homeData.treatmentsText} />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{services.slice(0, 6).map((service) => <TreatmentCard key={service.id || service.slug || service.title} service={service} />)}</div>
          <Link className="btn-secondary mt-8" to="/treatments">View all treatments <ArrowRight size={17} /></Link>
        </div>
      </section>

      <section id="home-reviews" className="section-pad relative">
        <div className="container-lux grid gap-8 lg:grid-cols-[.78fr_1.22fr]">
          <SectionHeader eyebrow="Patient reviews" title={homeData.reviewsTitle} text={homeData.reviewsText} />
          <div className="flex snap-x gap-5 overflow-x-auto pb-4">
            {reviews.slice(0, 6).map((review, index) => (
              <motion.article {...fadeUp(index * 0.06)} whileHover={{ y: -6 }} className="glass-card min-w-[280px] snap-start p-6 sm:min-w-[340px]" key={review.id || review.name}>
                <div className="flex items-center justify-between gap-4">
                  {review.image ? (
                    <img className="size-12 rounded-full object-cover" src={review.image} alt={review.name || 'Patient'} loading="lazy" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="grid size-12 place-items-center rounded-full bg-clinic-emerald/10 font-bold text-clinic-emerald">{String(review.name || 'P').slice(0, 1)}</span>
                  )}
                  <Quote className="text-clinic-gold" size={24} />
                </div>
                <div className="mt-5 flex gap-1 text-clinic-gold">{Array.from({ length: review.rating || 5 }).map((_, starIndex) => <Star fill="currentColor" size={16} key={starIndex} />)}</div>
                <p className="mt-4 text-base leading-7 text-slate-700">"{review.text}"</p>
                <strong className="mt-5 block text-sm text-clinic-ink">{review.name}</strong>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="home-blog" className="section-pad relative bg-white/30">
        <div className="container-lux">
          <SectionHeader eyebrow="Health notes" title={homeData.blogTitle} />
          <div className="grid gap-6 md:grid-cols-3">{posts.slice(0, 3).map((post) => <BlogCard key={post.id || post.slug || post.title} post={post} />)}</div>
        </div>
      </section>

      <section id="home-contact-cta" className="section-pad relative">
        <div className="container-lux glass-card overflow-hidden rounded-[2rem] bg-clinic-ink/95 p-6 text-white shadow-luxury md:p-10">
          <div className="absolute -right-24 -top-24 size-64 rounded-full border border-clinic-gold/20 bg-clinic-gold/10 blur-sm" />
          <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-clinic-gold">Contact</p>
              <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">{homeData.contactTitle}</h2>
              <p className="mt-3 max-w-3xl leading-7 text-white/75">{homeData.contactText}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link className="btn-primary" to="/book-appointment"><CalendarDays size={19} /> Book Appointment</Link>
              <a className="btn-secondary bg-white/80 text-clinic-emerald" href={`tel:${site.phone}`}><Phone size={18} /> Call Clinic</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
