import { CalendarDays, CheckCircle2, Clock, HelpCircle, MapPin, MessageCircle, ShieldCheck, Sparkles, Stethoscope } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Breadcrumbs from '../components/seo/Breadcrumbs.jsx';
import SEO from '../components/seo/SEO.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import { useClinic } from '../context/ClinicContext.jsx';
import { whatsappHref } from '../lib/contact.js';

const detailContent = {
  'pcos-hormonal-imbalance': {
    symptoms: ['Irregular periods', 'Acne or oily skin', 'Hair fall or facial hair', 'Weight changes', 'Mood changes'],
    focus: ['Cycle pattern and history', 'Hormonal symptoms', 'Lifestyle and sleep routine', 'Existing reports or medicines'],
    faqs: [
      ['Can I consult for irregular periods?', 'Yes. Share your cycle pattern, age, symptoms, and any reports during consultation.'],
      ['Should I bring reports?', 'If you have thyroid, hormone, ultrasound, or blood reports, bring them for review.']
    ]
  },
  'thyroid-disorders': {
    symptoms: ['Tiredness', 'Weight changes', 'Hair fall', 'Constipation', 'Heat or cold sensitivity'],
    focus: ['TSH/T3/T4 report review', 'Energy and sleep pattern', 'Weight and appetite changes', 'Long-term follow-up needs'],
    faqs: [
      ['Can I share thyroid reports?', 'Yes. Recent reports help the doctor understand your current status.'],
      ['Do I stop existing medicine?', 'Do not stop prescribed medicine without medical advice. Discuss it during consultation.']
    ]
  },
  'hair-fall-dandruff': {
    symptoms: ['Hair shedding', 'Dandruff', 'Scalp itching', 'Patchy hair loss', 'Hair thinning'],
    focus: ['Hair fall timeline', 'Scalp condition', 'Stress, sleep, diet', 'Skin or hormonal history'],
    faqs: [
      ['When should I consult for hair fall?', 'Consult if hair fall is sudden, persistent, patchy, or associated with itching/dandruff.'],
      ['Can I show scalp photos?', 'Yes. Photos and old reports can help during online or clinic consultation.']
    ]
  },
  'skin-allergy-disease': {
    symptoms: ['Itching', 'Rashes', 'Urticaria', 'Recurring allergy', 'Dry or irritated skin'],
    focus: ['Triggers and flare-ups', 'Food/product exposure', 'Climate and stress pattern', 'Previous treatment history'],
    faqs: [
      ['Should I share skin photos?', 'Yes. Clear photos help the doctor understand the current flare-up.'],
      ['What details should I note?', 'Note when itching starts, food triggers, products used, and recurrence pattern.']
    ]
  },
  'migraine-headache': {
    symptoms: ['Recurring headache', 'Light sensitivity', 'Nausea', 'Sleep-related headache', 'Stress-triggered headache'],
    focus: ['Headache pattern', 'Triggers', 'Sleep and screen time', 'Associated symptoms'],
    faqs: [
      ['When is headache urgent?', 'Seek urgent care for sudden severe headache, weakness, confusion, injury, or vision changes.'],
      ['Should I track triggers?', 'Yes. Food, sleep, stress, screen time, and weather triggers are useful.']
    ]
  },
  'arthritis-joint-pain': {
    symptoms: ['Joint stiffness', 'Back pain', 'Body ache', 'Swelling', 'Morning pain'],
    focus: ['Pain location and duration', 'Movement limitation', 'Reports if available', 'Daily routine and triggers'],
    faqs: [
      ['Can chronic joint pain be discussed?', 'Yes. Share duration, affected joints, stiffness timing, and previous reports.'],
      ['Should I bring X-ray or blood reports?', 'Bring any available reports for better case understanding.']
    ]
  },
  'sinus-allergy-treatment': {
    symptoms: ['Sneezing', 'Blocked nose', 'Runny nose', 'Sinus heaviness', 'Seasonal allergy'],
    focus: ['Seasonal pattern', 'Dust or weather triggers', 'Breathing symptoms', 'Recurring cold history'],
    faqs: [
      ['Can I consult for repeated sneezing?', 'Yes. Mention triggers like dust, weather, perfume, or cold exposure.'],
      ['When should I seek urgent care?', 'Seek urgent care for breathing difficulty, high fever, or severe facial pain.']
    ]
  },
  'acidity-gastric-issues': {
    symptoms: ['Acidity', 'Bloating', 'Gas', 'Indigestion', 'Burning sensation'],
    focus: ['Meal timing', 'Food triggers', 'Stress pattern', 'Bowel habits'],
    faqs: [
      ['What should I share for acidity?', 'Share food triggers, timing, burning pattern, sleep, and any current medicines.'],
      ['Is severe abdominal pain urgent?', 'Yes. Severe pain, vomiting blood, black stool, or chest pain needs urgent care.']
    ]
  },
  'piles-treatment': {
    symptoms: ['Pain during stool', 'Bleeding', 'Itching', 'Constipation', 'Swelling'],
    focus: ['Bowel pattern', 'Bleeding history', 'Pain and swelling', 'Diet and water intake'],
    faqs: [
      ['Can I consult privately for piles?', 'Yes. Your details are handled respectfully and used only for consultation.'],
      ['When should I seek urgent care?', 'Heavy bleeding, severe pain, fever, or weakness should be checked urgently.']
    ]
  }
};

function fallbackDetails(service = {}) {
  return {
    symptoms: ['Recurring symptoms', 'Long-term discomfort', 'Repeated flare-ups', 'Lifestyle triggers', 'Follow-up needs'],
    focus: ['Detailed symptom history', 'Previous treatment review', 'Triggers and daily routine', 'Follow-up planning'],
    faqs: [
      [`Can I consult for ${service.title || 'this concern'}?`, 'Yes. Share your symptoms, duration, age, and any existing reports while booking.'],
      ['What happens after booking?', 'The clinic reviews your request and confirms the appointment by phone or WhatsApp.']
    ]
  };
}

export default function TreatmentDetail() {
  const { slug } = useParams();
  const { services, site, doctor } = useClinic();
  const service = services.find((item) => item.slug === slug) || services[0] || {};
  const details = detailContent[service.slug] || fallbackDetails(service);
  const appointmentLink = `/book-appointment?concern=${encodeURIComponent(service.title || '')}`;
  const whatsappMessage = `Hi, I want to book an appointment for ${service.title || 'a health concern'}.`;
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: details.faqs.map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer }
    }))
  };

  return (
    <main>
      <SEO title={service.title} description={service.description} schema={faqSchema} />
      <Breadcrumbs items={[{ label: 'Treatments', href: '/treatments' }, { label: service.title }]} />

      <section className="section-pad bg-clinic-soft">
        <div className="container-lux grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <article>
            <p className="eyebrow">{service.category || 'Treatment'}</p>
            <h1 className="mt-4 font-display text-5xl font-bold leading-tight text-clinic-ink md:text-7xl">{service.title}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">{service.description}</p>
            <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
              <Link to={appointmentLink} className="btn-primary w-full sm:w-auto"><CalendarDays size={19} /> Book for this concern</Link>
              <a className="btn-secondary w-full sm:w-auto" href={whatsappHref(site.whatsapp, whatsappMessage)} target="_blank" rel="noreferrer"><MessageCircle size={18} /> Ask on WhatsApp</a>
            </div>
          </article>

          <aside className="premium-panel p-5 sm:p-7">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                [Stethoscope, doctor.doctorName || site.doctorName, doctor.qualification || site.qualification],
                [Clock, site.hours, 'Clinic timing'],
                [MapPin, site.location, 'Clinic location'],
                [ShieldCheck, 'Follow-up care', 'Personalised guidance']
              ].map(([Icon, title, text]) => (
                <div className="rounded-2xl border border-white/70 bg-white/65 p-4 shadow-sm" key={title}>
                  <Icon className="text-clinic-emerald" size={23} />
                  <strong className="mt-3 block leading-tight text-clinic-ink">{title}</strong>
                  <span className="mt-1 block text-xs font-semibold text-slate-500">{text}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-lux grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
          <SectionHeader eyebrow="When to Consult" title="Symptoms patients commonly discuss" text="If these symptoms are recurring or affecting daily life, book a consultation and share your details clearly." />
          <div className="grid gap-4 sm:grid-cols-2">
            {details.symptoms.map((item, index) => (
              <article className="glass-card p-5" key={item}>
                <CheckCircle2 className="text-clinic-gold" size={25} />
                <h3 className="mt-4 font-display text-2xl font-bold text-clinic-ink">{item}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">Tell the doctor how long it has been happening and what makes it better or worse.</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-white/35">
        <div className="container-lux">
          <SectionHeader eyebrow="Consultation Process" title="What happens during your visit" text="The focus is on understanding your full case, not only one symptom." />
          <div className="grid gap-5 md:grid-cols-4">
            {[
              ['1', 'Share symptoms', 'Tell your concern, duration, triggers, and current medicines.'],
              ['2', 'Case understanding', 'Doctor reviews history, lifestyle, reports, and symptom pattern.'],
              ['3', 'Treatment plan', 'You receive guidance based on your individual case.'],
              ['4', 'Follow-up', 'Progress is reviewed and plan is adjusted when needed.']
            ].map(([step, title, text]) => (
              <article className="glass-card p-5" key={step}>
                <span className="grid size-11 place-items-center rounded-full bg-clinic-emerald text-sm font-bold text-white">{step}</span>
                <h3 className="mt-5 font-display text-2xl font-bold text-clinic-ink">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-lux grid gap-8 lg:grid-cols-[1fr_.9fr]">
          <div>
            <SectionHeader eyebrow="Doctor Focus" title="Helpful details to bring" text="These details help make the consultation clearer and more useful." />
            <div className="grid gap-3">
              {details.focus.map((item) => (
                <p className="rounded-2xl border border-white/70 bg-white/75 p-4 font-semibold text-slate-700 shadow-glass" key={item}><Sparkles className="mr-2 inline text-clinic-gold" size={18} />{item}</p>
              ))}
            </div>
          </div>

          <aside className="rounded-[2rem] bg-clinic-ink p-6 text-white shadow-luxury">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-clinic-gold">Book Confidently</p>
            <h2 className="mt-3 font-display text-4xl font-bold">Ready to discuss {service.title}?</h2>
            <p className="mt-4 leading-7 text-white/72">Book online or send a WhatsApp message. The clinic will confirm the appointment and guide you with the next step.</p>
            <div className="mt-6 grid gap-3">
              <Link className="btn-primary w-full" to={appointmentLink}><CalendarDays size={19} /> Book Appointment</Link>
              <a className="btn-secondary w-full bg-white/85 text-clinic-emerald" href={whatsappHref(site.whatsapp, whatsappMessage)} target="_blank" rel="noreferrer"><MessageCircle size={18} /> WhatsApp Clinic</a>
            </div>
          </aside>
        </div>
      </section>

      <section className="section-pad bg-clinic-soft">
        <div className="container-lux">
          <SectionHeader eyebrow="FAQ" title="Common patient questions" />
          <div className="grid gap-4 md:grid-cols-2">
            {details.faqs.map(([question, answer]) => (
              <article className="rounded-[2rem] bg-white p-5 shadow-glass" key={question}>
                <HelpCircle className="text-clinic-gold" size={25} />
                <h3 className="mt-4 font-display text-2xl font-bold text-clinic-ink">{question}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
