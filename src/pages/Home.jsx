import { motion } from 'framer-motion';
import { ArrowRight, Award, CalendarDays, CheckCircle2, ClipboardCheck, Clock, Gift, HelpCircle, Images, ListChecks, MapPin, MessageCircle, Phone, Quote, ShieldCheck, Sparkles, Star, Stethoscope } from 'lucide-react';
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
    <div className="absolute inset-0 hidden overflow-hidden sm:block">
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
  const { site, doctor, home, services, posts, reviews, gallery } = useClinic();
  const homeData = home;
  const [heroImageFailed, setHeroImageFailed] = useState(false);
  const highlights = Array.isArray(homeData.highlights)
    ? homeData.highlights
    : String(homeData.highlights || '').split(',').map((item) => item.trim()).filter(Boolean);
  const featureIcons = [ShieldCheck, Sparkles, Stethoscope];
  const shouldShowHeroImage = Boolean(homeData.heroImage) && !heroImageFailed;
  const heroStats = [
    ['Visit Us', site.location],
    ['Open Hours', site.hours],
    ['Call / WhatsApp', site.phone]
  ];
  const faqs = [
    ['How can I book an appointment?', 'Tap Book Appointment, call the clinic, or send a WhatsApp message. The clinic will confirm the final time.'],
    ['What details should I share?', 'Share your main problem, age, mobile number, preferred date, and any old reports or prescriptions if available.'],
    ['Where is the clinic?', site.address || 'Hindmotor, Uttarpara'],
    ['Can I see patient reviews?', 'Yes. Open the Reviews section to read patient experiences and visit the official Google review page.']
  ];
  const patientProblems = [
    ['Not sure what to do?', 'If acidity, hair fall, allergy, headache, or hormonal symptoms keep coming back, a consultation can help you understand the next step.'],
    ['Easy first visit', 'You only need to share your problem, preferred time, and any old reports or prescriptions if you have them.'],
    ['Clear follow-up', 'After consultation, the clinic helps you understand what to do next and when to follow up.']
  ];
  const journeySteps = [
    [MessageCircle, 'Tell us your problem', 'Share your main symptom, how long it has been happening, and your preferred appointment time.'],
    [ClipboardCheck, 'Your case is reviewed', 'Symptoms, health history, triggers, and reports are checked carefully.'],
    [Stethoscope, 'Meet the doctor', 'Get personalised homoeopathic guidance based on your individual case.'],
    [ListChecks, 'Follow up clearly', 'Know what to do after the visit and when to contact the clinic again.']
  ];
  const trustStats = [
    [doctor.experience || site.experience || '5+', 'Years Experience'],
    [doctor.patients || site.patients || '1000+', 'Happy Patients'],
    ['BHMS', 'Qualified Doctor'],
    [site.location || 'Hindmotor', 'Local Clinic']
  ];

  useEffect(() => {
    setHeroImageFailed(false);
  }, [homeData.heroImage]);

  const campaignUrl = homeData.campaignButtonUrl || '/book-appointment';
  const campaignButton = (
    <span className="btn-primary w-full px-6 py-3.5 sm:w-auto">
      <CalendarDays size={19} /> {homeData.campaignButtonLabel || 'Book Appointment'}
    </span>
  );
  const campaignCta = campaignUrl.startsWith('http') ? (
    <a href={campaignUrl} target="_blank" rel="noreferrer">{campaignButton}</a>
  ) : (
    <Link to={campaignUrl}>{campaignButton}</Link>
  );

  return (
    <main className="lux-bg overflow-hidden">
      <SEO />
      <section id="home-hero" className="relative overflow-hidden">
        <FloatingBubbles />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/70 to-transparent" />
        <div className="container-lux relative grid min-h-[auto] items-center gap-8 py-8 sm:py-10 lg:min-h-[640px] lg:grid-cols-[1.02fr_.98fr] lg:gap-10 lg:py-14">
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.62 }}>
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/70 bg-white/60 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.13em] text-clinic-emerald shadow-glass backdrop-blur-2xl sm:px-4 sm:text-xs"><Award size={15} className="shrink-0 text-clinic-gold" /> <span className="truncate">{homeData.eyebrow}</span></div>
            <h1 className="mt-4 max-w-3xl font-display text-[2.35rem] font-bold leading-[1.02] tracking-normal text-clinic-ink sm:mt-5 sm:text-6xl lg:text-[4.35rem] lg:leading-[0.96]">{homeData.heroTitle}</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:mt-5 sm:text-[17px] sm:leading-8">{homeData.heroSubtitle || `Tell us your health concern, choose a preferred time, and get careful homoeopathic consultation from ${doctor.doctorName || site.doctorName}.`}</p>
            <div className="mt-6 grid gap-3 sm:flex sm:flex-wrap">
              <Link className="btn-primary w-full px-6 py-3.5 sm:w-auto" to="/book-appointment"><CalendarDays size={19} /> Book Appointment</Link>
              <a className="btn-secondary w-full px-6 py-3.5 sm:w-auto" href={site.mapLink} target="_blank" rel="noreferrer"><MapPin size={19} /> Get Directions</a>
            </div>
            <div className="mt-6 grid overflow-hidden rounded-[1.25rem] border border-white/70 bg-white/55 shadow-glass backdrop-blur-2xl sm:mt-7 sm:grid-cols-3">
              {heroStats.map(([label, value]) => (
                <div className="border-b border-white/55 p-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0" key={label}>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-clinic-gold">{label}</p>
                  <p className="mt-1 text-sm font-semibold leading-5 text-clinic-ink">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 grid gap-3 sm:mt-7 sm:grid-cols-3">
              {(highlights.length ? highlights : ['Personalised care', 'Online consults', 'Follow-up support']).map((item, index) => (
                <motion.div {...fadeUp(index * 0.06)} className="glass rounded-[1.25rem] px-4 py-4 text-sm font-semibold text-slate-700 ring-1 ring-white/35" key={item}>{item}</motion.div>
              ))}
            </div>
            <div className="mt-7 hidden gap-3 text-sm font-semibold text-slate-700 sm:grid-cols-3">
              <div className="glass flex items-center gap-2 rounded-full px-4 py-3"><MapPin size={17} className="text-clinic-emerald" /> {site.location}</div>
              <div className="glass flex items-center gap-2 rounded-full px-4 py-3"><Clock size={17} className="text-clinic-emerald" /> {site.hours}</div>
              <div className="glass flex items-center gap-2 rounded-full px-4 py-3"><Phone size={17} className="text-clinic-emerald" /> {site.phone}</div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.08 }} className="relative mx-auto w-full max-w-[540px] lg:max-w-none">
            <motion.span aria-hidden="true" className="absolute -right-1 top-10 h-56 w-56 rounded-full border border-clinic-gold/45 shadow-glow sm:-right-4 sm:h-72 sm:w-72 md:h-96 md:w-96" animate={{ rotate: 360 }} transition={{ duration: 42, repeat: Infinity, ease: 'linear' }} />
            <span className="floating-bubble -left-5 top-16 hidden size-16 sm:block" />
            <span className="floating-bubble bottom-24 right-2 hidden size-12 sm:block" />
            <div className="absolute -left-4 top-28 z-10 hidden rounded-2xl border border-white/70 bg-white/65 px-4 py-3 text-sm font-bold text-clinic-emerald shadow-glass backdrop-blur-2xl md:block">BHMS Consultant</div>
            <div className="absolute -right-2 bottom-40 z-10 hidden rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm font-bold text-clinic-ink shadow-glass backdrop-blur-2xl md:block">Personalised care</div>
            <div className="premium-panel relative mx-auto max-w-[540px] p-3">
              <div className="relative min-h-[300px] overflow-hidden rounded-[1.35rem] bg-gradient-to-br from-white/80 via-clinic-cream to-emerald-50 sm:min-h-[380px] md:min-h-[460px]">
                {shouldShowHeroImage ? (
                  <img
                    src={homeData.heroImage}
                    alt="Hero"
                    className="block h-full min-h-[300px] w-full object-cover object-center sm:min-h-[380px] md:min-h-[460px]"
                    loading="eager"
                    referrerPolicy="no-referrer"
                    onError={() => setHeroImageFailed(true)}
                  />
                ) : (
                  <div className="grid min-h-[300px] place-items-center p-8 text-center sm:min-h-[380px] md:min-h-[460px]">
                    <Stethoscope className="mx-auto text-clinic-emerald" size={68} />
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-clinic-ink/30 via-transparent to-white/5" />
              </div>
              <div className="relative mt-3 rounded-[1.5rem] border border-white/70 bg-white/75 p-4 shadow-glass backdrop-blur-2xl sm:absolute sm:inset-x-6 sm:bottom-6 sm:mt-0">
                <h2 className="font-display text-2xl font-bold leading-tight sm:text-3xl">{doctor.doctorName || site.doctorName}</h2>
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

      <section id="patient-journey" className="section-pad relative scroll-mt-28 bg-white/35">
        <div className="container-lux">
          <div className="grid gap-6 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
            <motion.div {...fadeUp()} className="premium-panel p-5 sm:p-6">
              <p className="eyebrow">For Patients</p>
              <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-clinic-ink md:text-5xl">Simple steps before your visit.</h2>
              <p className="mt-4 text-base leading-7 text-slate-600">If you are not sure where to start, this section explains what to share, how booking works, and what happens after consultation.</p>
              <div className="mt-5 grid gap-3">
                {patientProblems.map(([title, text]) => (
                  <div className="rounded-2xl border border-white/70 bg-white/65 p-4 shadow-sm" key={title}>
                    <strong className="block font-display text-xl text-clinic-ink">{title}</strong>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {journeySteps.map(([Icon, title, text], index) => (
                  <motion.article {...fadeUp(index * 0.06)} className="glass-card glass-card-hover p-5" key={title}>
                    <div className="flex items-start gap-3">
                      <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-clinic-emerald text-white shadow-sm"><Icon size={20} /></span>
                      <span className="rounded-full bg-clinic-gold/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-clinic-gold">Step {index + 1}</span>
                    </div>
                    <h3 className="mt-4 font-display text-2xl font-bold leading-tight text-clinic-ink">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
                  </motion.article>
                ))}
              </div>
              <motion.div {...fadeUp(0.12)} className="grid overflow-hidden rounded-[1.35rem] border border-white/70 bg-white/70 shadow-glass backdrop-blur-xl sm:grid-cols-4">
                {trustStats.map(([value, label]) => (
                  <div className="border-b border-white/60 p-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0" key={label}>
                    <strong className="block font-display text-3xl leading-none text-clinic-emerald">{value}</strong>
                    <span className="mt-1 block text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{label}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="section-pad relative scroll-mt-28">
        <div className="container-lux grid gap-8 lg:grid-cols-[.78fr_1.22fr] lg:items-center">
          <motion.div {...fadeUp()} className="premium-panel p-5 sm:p-6">
            <p className="eyebrow">Meet Your Doctor</p>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-clinic-ink sm:text-4xl">{doctor.profileTitle || 'Experienced Homoeopathic Physician & Family Health Consultant'}</h2>
            <p className="mt-5 text-base leading-8 text-slate-700">{doctor.about || `${doctor.doctorName || site.doctorName} listens to your symptoms, understands your history, and guides you with gentle homoeopathic care and follow-up support.`}</p>
            <Link className="btn-secondary mt-6" to="/about-doctor">Read Doctor Profile <ArrowRight size={17} /></Link>
          </motion.div>
          <motion.div {...fadeUp(0.08)} className="grid gap-4 sm:grid-cols-2">
            {[
              ['Doctor', doctor.doctorName || site.doctorName],
              ['Qualification', doctor.qualification || site.qualification],
              ['Experience', doctor.experience || site.experience],
              ['Patients', doctor.patients || site.patients]
            ].map(([label, value]) => (
              <article className="glass-card p-5" key={label}>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-clinic-gold">{label}</p>
                <p className="mt-2 font-display text-2xl font-bold leading-tight text-clinic-ink">{value}</p>
              </article>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="services" className="relative scroll-mt-28 py-8 md:py-12">
        <div className="container-lux mb-6 h-px gold-hairline md:mb-8" />
        <div className="container-lux">
          <SectionHeader eyebrow="How We Help" title="Simple care, from first call to follow-up" text="You share your concern, the doctor understands your case, and the clinic helps you continue care clearly." />
        </div>
        <div className="container-lux grid auto-rows-fr gap-5 md:grid-cols-3">
          {homeData.featureCards.map((card, index) => {
            const Icon = featureIcons[index] || ShieldCheck;
            return (
              <motion.div {...fadeUp(index * 0.08)} whileHover={{ y: -6, scale: 1.01 }} className="glass-card glass-card-hover h-full p-5" key={card.title}>
                <span className="grid size-10 place-items-center rounded-2xl border border-white/70 bg-white/65 text-clinic-emerald shadow-sm"><Icon size={21} /></span>
                <h3 className="mt-4 font-display text-2xl font-bold leading-tight">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{card.text}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section id="why-choose-us" className="section-pad relative scroll-mt-28">
        <div className="container-lux">
          <SectionHeader eyebrow="Why Patients Choose Us" title="Care that feels clear and comfortable" text="No confusing process. Just careful listening, simple guidance, and support after your consultation." />
          <div className="grid gap-4 md:grid-cols-3">
            {(highlights.length ? highlights : ['Personalised care', 'Online consults', 'Follow-up support']).map((item, index) => (
              <motion.article {...fadeUp(index * 0.06)} className="glass-card glass-card-hover p-5 sm:p-6" key={item}>
                <CheckCircle2 className="text-clinic-gold" size={26} />
                <h3 className="mt-3 font-display text-xl font-bold text-clinic-ink">{item}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">Helpful support so you know what to do before, during, and after your visit.</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="treatments" className="section-pad relative scroll-mt-28 bg-white/35">
        <div className="container-lux">
          <SectionHeader eyebrow="Treatment Areas" title={homeData.treatmentsTitle} text={homeData.treatmentsText || 'Choose your health concern and open the card to understand how consultation can help.'} />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{services.slice(0, 6).map((service) => <TreatmentCard key={service.id || service.slug || service.title} service={service} />)}</div>
          <Link className="btn-secondary mt-8" to="/treatments">See All Health Concerns <ArrowRight size={17} /></Link>
        </div>
      </section>

      <section id="campaign" className="section-pad relative scroll-mt-28">
        <div className="container-lux">
          <motion.div {...fadeUp()} className="premium-panel overflow-hidden bg-clinic-ink/95 p-5 text-white shadow-luxury sm:p-6">
            <div className="absolute -right-20 -top-24 size-72 rounded-full border border-clinic-gold/20 bg-clinic-gold/15 blur-sm" />
            <div className="absolute -bottom-24 left-10 size-64 rounded-full border border-white/10 bg-white/5 blur-sm" />
            <div className="relative grid gap-6 lg:grid-cols-[1.08fr_.92fr] lg:items-center">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-clinic-gold/30 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-clinic-gold backdrop-blur-xl">
                  <Gift size={15} /> {homeData.campaignBadge || 'Patient Care Campaign'}
                </p>
                <h2 className="mt-4 max-w-3xl font-display text-3xl font-bold leading-tight md:text-5xl">{homeData.campaignTitle || 'Book a personalised homoeopathic consultation'}</h2>
                <p className="mt-4 max-w-2xl text-base leading-8 text-white/75">{homeData.campaignText || 'Share your main health concern and the clinic will guide you with appointment confirmation and follow-up support.'}</p>
                <div className="mt-7 grid gap-3 sm:flex sm:flex-wrap">
                  {campaignCta}
                  <a className="btn-secondary w-full bg-white/85 text-clinic-emerald sm:w-auto" href={`tel:${site.phone}`}><Phone size={18} /> Call Clinic</a>
                </div>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-3 shadow-glass backdrop-blur-xl">
                <div className="grid min-h-[220px] place-items-center overflow-hidden rounded-[1.25rem] bg-gradient-to-br from-white/10 via-clinic-gold/10 to-emerald-400/10 md:min-h-[280px]">
                  {homeData.campaignImage ? (
                    <img className="h-full min-h-[220px] w-full object-cover md:min-h-[280px]" src={homeData.campaignImage} alt={homeData.campaignTitle || 'Clinic campaign'} loading="lazy" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="p-8 text-center">
                      <Stethoscope className="mx-auto text-clinic-gold" size={58} />
                      <p className="mt-4 font-display text-3xl font-bold">Patient-first care</p>
                      <p className="mt-2 text-sm leading-6 text-white/60">Campaign image can be added from admin.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="reviews" className="section-pad relative scroll-mt-28">
        <div className="absolute inset-x-0 top-0 h-px gold-hairline" />
        <div className="container-lux grid gap-8 lg:grid-cols-[.78fr_1.22fr]">
          <SectionHeader eyebrow="Patient Stories" title={homeData.reviewsTitle} text={homeData.reviewsText || 'Read what patients have shared about their consultation experience.'} />
          <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:gap-5 sm:px-0">
            {reviews.slice(0, 6).map((review, index) => (
              <motion.article {...fadeUp(index * 0.06)} whileHover={{ y: -5 }} className="glass-card min-w-[250px] snap-start p-5 sm:min-w-[320px]" key={review.id || review.name}>
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

      <section id="gallery" className="section-pad relative scroll-mt-28 bg-white/35">
        <div className="container-lux">
          <SectionHeader eyebrow="Clinic Photos" title="See the clinic before you visit" text="A quick look at the clinic space so you know what to expect." />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.slice(0, 6).map((item, index) => (
              <motion.article {...fadeUp(index * 0.05)} className="glass-card overflow-hidden p-3" key={item.id || item.title || index}>
                <div className="grid aspect-[4/3] place-items-center rounded-[1.25rem] bg-gradient-to-br from-white/80 via-clinic-cream to-emerald-50 bg-cover bg-center" style={item.image ? { backgroundImage: `url(${item.image})` } : undefined}>
                  {!item.image && <Images className="text-clinic-emerald/45" size={34} />}
                </div>
                <h3 className="px-2 pb-2 pt-4 font-display text-2xl font-bold text-clinic-ink">{item.title || `Clinic photo ${index + 1}`}</h3>
              </motion.article>
            ))}
          </div>
          <Link className="btn-secondary mt-8" to="/gallery">View More Photos <ArrowRight size={17} /></Link>
        </div>
      </section>

      <section id="blog" className="section-pad relative scroll-mt-28">
        <div className="container-lux">
          <SectionHeader eyebrow="Health Tips" title={homeData.blogTitle} text="Short, easy-to-read notes that help patients understand common health concerns." />
          <div className="grid gap-6 md:grid-cols-3">{posts.slice(0, 3).map((post) => <BlogCard key={post.id || post.slug || post.title} post={post} />)}</div>
        </div>
      </section>

      <section id="faq" className="section-pad relative scroll-mt-28 bg-white/35">
        <div className="container-lux">
          <SectionHeader eyebrow="Questions" title="Before you book" text="Simple answers for patients visiting or booking for the first time." />
          <div className="grid gap-4 md:grid-cols-2">
            {faqs.map(([question, answer], index) => (
              <motion.article {...fadeUp(index * 0.05)} className="glass-card p-5" key={question}>
                <HelpCircle className="text-clinic-gold" size={25} />
                <h3 className="mt-4 font-display text-2xl font-bold text-clinic-ink">{question}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{answer}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="section-pad relative scroll-mt-28">
        <div className="container-lux premium-panel bg-clinic-ink/95 p-5 text-white shadow-luxury sm:p-6 md:p-8">
          <div className="absolute -right-24 -top-24 size-64 rounded-full border border-clinic-gold/20 bg-clinic-gold/10 blur-sm" />
          <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-clinic-gold">Need Help?</p>
              <h2 className="mt-3 font-display text-3xl font-bold leading-tight md:text-4xl">{homeData.contactTitle}</h2>
              <p className="mt-3 max-w-3xl leading-7 text-white/75">{homeData.contactText || 'Call, WhatsApp, or book an appointment online. The clinic will guide you with the next step.'}</p>
            </div>
            <div className="grid gap-3 sm:flex sm:flex-wrap">
              <Link className="btn-primary w-full sm:w-auto" to="/book-appointment"><CalendarDays size={19} /> Book Appointment</Link>
              <a className="btn-secondary w-full bg-white/80 text-clinic-emerald sm:w-auto" href={`tel:${site.phone}`}><Phone size={18} /> Call Clinic</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
