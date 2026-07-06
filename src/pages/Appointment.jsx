import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import Breadcrumbs from '../components/seo/Breadcrumbs.jsx';
import SEO from '../components/seo/SEO.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import { useClinic } from '../context/ClinicContext.jsx';
import { db, firebaseEnabled } from '../lib/firebase.js';
import { canSubmit, isPhone, required, sanitizePayload } from '../lib/validation.js';

export default function Appointment() {
  const { site } = useClinic();
  const [status, setStatus] = useState('');
  const [lastSubmitAt, setLastSubmitAt] = useState(0);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = Object.fromEntries(new FormData(event.currentTarget));
    if (!required(form.name) || !isPhone(form.phone)) return setStatus('Please enter a valid name and phone number.');
    if (!canSubmit(lastSubmitAt)) return setStatus('Please wait a moment before submitting again.');
    const payload = sanitizePayload({ ...form, status: 'new', source: 'website' });
    if (firebaseEnabled) await addDoc(collection(db, 'appointments'), { ...payload, createdAt: serverTimestamp() });
    setLastSubmitAt(Date.now());
    setStatus('Appointment request received. The clinic will confirm by phone or WhatsApp.');
    event.currentTarget.reset();
  }

  return (
    <main>
      <SEO title="Book Appointment" description="Book an appointment or online consultation with Dr. Shikha's Homoeo Clinic." />
      <Breadcrumbs items={[{ label: 'Book Appointment' }]} />
      <section className="section-pad bg-clinic-soft">
        <div className="container-lux grid gap-10 lg:grid-cols-[.85fr_1.15fr]">
          <SectionHeader eyebrow="Appointment" title="Book your consultation" text="Choose in-clinic appointment or online consultation. Confirmation is sent manually by phone or WhatsApp." />
          <form className="rounded-[2rem] bg-white p-6 shadow-luxury" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="font-semibold">Full Name<input className="admin-input mt-2" name="name" required /></label>
              <label className="font-semibold">Phone / WhatsApp<input className="admin-input mt-2" name="phone" required /></label>
              <label className="font-semibold">Appointment Type<select className="admin-input mt-2" name="type"><option>Clinic Visit</option><option>Online Consultation</option></select></label>
              <label className="font-semibold">Preferred Date<input className="admin-input mt-2" type="date" name="date" /></label>
            </div>
            <label className="mt-4 block font-semibold">Health Concern<textarea className="admin-input mt-2 min-h-32" name="concern" /></label>
            <button className="btn-primary mt-6 w-full" type="submit">Request Appointment</button>
            {status && <p className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-clinic-emerald">{status}</p>}
            <a className="btn-secondary mt-4 w-full" href={`https://wa.me/${site.whatsapp}?text=Hi%2C%20I%20want%20to%20book%20an%20appointment`}>WhatsApp Booking</a>
          </form>
        </div>
      </section>
    </main>
  );
}
