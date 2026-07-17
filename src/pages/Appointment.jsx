import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import Breadcrumbs from '../components/seo/Breadcrumbs.jsx';
import SEO from '../components/seo/SEO.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import { useClinic } from '../context/ClinicContext.jsx';
import { whatsappHref } from '../lib/contact.js';
import { db, firebaseEnabled } from '../lib/firebase.js';
import { canSubmit, isEmail, isPhone, required, sanitizePayload } from '../lib/validation.js';
import { sendAppointmentNotification } from '../services/notifications.js';

const initialForm = {
  name: '',
  phone: '',
  email: '',
  age: '',
  gender: '',
  address: '',
  complaint: '',
  date: '',
  timeSlot: '',
  notes: ''
};

const timeSlots = [
  '10:00 AM - 12:00 PM',
  '12:00 PM - 2:00 PM',
  '2:00 PM - 5:00 PM',
  '5:00 PM - 7:00 PM',
  '7:00 PM - 9:00 PM'
];

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function validateForm(form) {
  if (!required(form.name)) return 'Please enter the patient full name.';
  if (!isPhone(form.phone)) return 'Please enter a valid mobile number.';
  if (form.email && !isEmail(form.email)) return 'Please enter a valid email address.';
  const age = Number(form.age);
  if (!Number.isInteger(age) || age < 1 || age > 120) return 'Please enter a valid age.';
  if (!required(form.gender)) return 'Please select gender.';
  if (!required(form.address)) return 'Please enter the patient address.';
  if (!required(form.complaint)) return 'Please enter the chief complaint.';
  if (!required(form.date)) return 'Please choose a preferred date.';
  if (form.date < todayKey()) return 'Please choose today or a future date.';
  if (!required(form.timeSlot)) return 'Please choose a preferred time slot.';
  return '';
}

export default function Appointment() {
  const { site } = useClinic();
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState('success');
  const [lastSubmitAt, setLastSubmitAt] = useState(0);
  const [saving, setSaving] = useState(false);
  const minDate = todayKey();

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationError = validateForm(form);
    if (validationError) {
      setStatusType('error');
      setStatus(validationError);
      return;
    }
    if (!canSubmit(lastSubmitAt)) {
      setStatusType('error');
      setStatus('Please wait a moment before submitting again.');
      return;
    }
    if (!firebaseEnabled) {
      setStatusType('error');
      setStatus('Appointment booking is temporarily unavailable. Please call or WhatsApp the clinic.');
      return;
    }

    setSaving(true);
    try {
      const payload = sanitizePayload({
        ...form,
        age: Number(form.age),
        mobile: form.phone,
        status: 'Pending',
        source: 'website'
      });
      const appointmentRef = await addDoc(collection(db, 'appointments'), { ...payload, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
      sendAppointmentNotification('appointment-created', { ...payload, id: appointmentRef.id });
      setLastSubmitAt(Date.now());
      setForm(initialForm);
      setStatusType('success');
      setStatus('Appointment request received. The clinic will confirm by phone or WhatsApp.');
    } catch (error) {
      setStatusType('error');
      setStatus(error.message || 'Unable to save appointment. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <main>
      <SEO title="Book Appointment" description={`Book an appointment with ${site.doctorName || 'Dr. Shikha Kumari Shukla'} at ${site.clinicName}.`} />
      <Breadcrumbs items={[{ label: 'Book Appointment' }]} />
      <section className="section-pad bg-clinic-soft">
        <div className="container-lux grid gap-10 lg:grid-cols-[.78fr_1.22fr]">
          <div>
            <SectionHeader eyebrow="Appointment" title="Book your consultation" text={`Visit ${site.location || 'Hindmotor, Uttarpara'} during ${site.hours}. Share your details and the clinic will confirm your appointment.`} />
            <div className="rounded-[2rem] bg-white p-6 shadow-glass">
              <p className="font-semibold text-clinic-ink">{site.clinicName}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{site.address}</p>
              <a className="btn-secondary mt-5 w-full" href={whatsappHref(site.whatsapp)}>WhatsApp Booking</a>
            </div>
          </div>

          <form className="rounded-[2rem] bg-white p-5 shadow-luxury sm:p-6" onSubmit={handleSubmit}>
            <div className="mb-5 rounded-2xl bg-emerald-50 p-4 text-sm leading-6 text-clinic-emerald">
              Fill the details once. The clinic will call or WhatsApp you to confirm the final appointment time.
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="font-semibold">Patient Full Name<input className="admin-input mt-2" name="name" value={form.name} onChange={updateField} required /><span className="mt-1 block text-xs font-medium text-slate-500">Write the name of the patient who needs consultation.</span></label>
              <label className="font-semibold">Mobile / WhatsApp Number<input className="admin-input mt-2" name="phone" value={form.phone} onChange={updateField} inputMode="tel" required /><span className="mt-1 block text-xs font-medium text-slate-500">Clinic will use this number to confirm your booking.</span></label>
              <label className="font-semibold">Email <span className="text-xs text-slate-400">(optional)</span><input className="admin-input mt-2" type="email" name="email" value={form.email} onChange={updateField} /><span className="mt-1 block text-xs font-medium text-slate-500">If added, confirmation details can also be sent by email.</span></label>
              <label className="font-semibold">Age<input className="admin-input mt-2" type="number" min="1" max="120" name="age" value={form.age} onChange={updateField} required /><span className="mt-1 block text-xs font-medium text-slate-500">Enter age in years.</span></label>
              <label className="font-semibold">Gender<select className="admin-input mt-2" name="gender" value={form.gender} onChange={updateField} required><option value="">Select gender</option><option>Female</option><option>Male</option><option>Other</option></select><span className="mt-1 block text-xs font-medium text-slate-500">This helps the doctor understand the case better.</span></label>
              <label className="font-semibold">Preferred Date<input className="admin-input mt-2" type="date" name="date" min={minDate} value={form.date} onChange={updateField} required /><span className="mt-1 block text-xs font-medium text-slate-500">Choose today or any upcoming date.</span></label>
              <label className="font-semibold sm:col-span-2">Preferred Time Slot<select className="admin-input mt-2" name="timeSlot" value={form.timeSlot} onChange={updateField} required><option value="">Select time slot</option>{timeSlots.map((slot) => <option key={slot}>{slot}</option>)}</select><span className="mt-1 block text-xs font-medium text-slate-500">This is your preferred time. Clinic will confirm availability.</span></label>
            </div>
            <label className="mt-4 block font-semibold">Address<textarea className="admin-input mt-2 min-h-24" name="address" value={form.address} onChange={updateField} required /><span className="mt-1 block text-xs font-medium text-slate-500">Area/city is enough if you do not want to write full address.</span></label>
            <label className="mt-4 block font-semibold">Main Health Problem<textarea className="admin-input mt-2 min-h-32" name="complaint" value={form.complaint} onChange={updateField} required placeholder="Example: acidity for 2 months, hair fall, skin allergy, migraine..." /><span className="mt-1 block text-xs font-medium text-slate-500">Write your main problem, since when it started, and any important symptoms.</span></label>
            <label className="mt-4 block font-semibold">Additional Notes <span className="text-xs text-slate-400">(optional)</span><textarea className="admin-input mt-2 min-h-28" name="notes" value={form.notes} onChange={updateField} placeholder="Existing medicines, reports, pregnancy, allergies, or special request" /><span className="mt-1 block text-xs font-medium text-slate-500">Share anything the doctor should know before the visit.</span></label>
            <button className="btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-70" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Request Appointment'}</button>
            {status && <p className={`mt-4 rounded-2xl p-4 text-sm font-semibold ${statusType === 'success' ? 'bg-emerald-50 text-clinic-emerald' : 'bg-red-50 text-red-600'}`} role="status">{status}</p>}
          </form>
        </div>
      </section>
    </main>
  );
}
