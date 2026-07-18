import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useSearchParams } from 'react-router-dom';
import Breadcrumbs from '../components/seo/Breadcrumbs.jsx';
import SEO from '../components/seo/SEO.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import { useClinic } from '../context/ClinicContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
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

const commonConcerns = [
  'PCOS / irregular periods',
  'Thyroid symptoms',
  'Hair fall / dandruff',
  'Skin allergy / itching',
  'Migraine / headache',
  'Joint pain / arthritis',
  'Sinus / allergy',
  'Acidity / gastric issue',
  'Piles symptoms'
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
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const initialConcern = searchParams.get('concern') || '';
  const [form, setForm] = useState(() => ({ ...initialForm, complaint: initialConcern }));
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState('success');
  const [lastSubmitAt, setLastSubmitAt] = useState(0);
  const [saving, setSaving] = useState(false);
  const minDate = todayKey();

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function selectConcern(concern) {
    setForm((current) => ({
      ...current,
      complaint: current.complaint && current.complaint !== initialConcern
        ? `${concern} - ${current.complaint}`
        : concern
    }));
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
            <SectionHeader eyebrow={t('Appointment')} title={t('Book your consultation')} text={`Visit ${site.location || 'Hindmotor, Uttarpara'} during ${site.hours}. Share your details and the clinic will confirm your appointment.`} />
            <div className="rounded-[2rem] bg-white p-6 shadow-glass">
              <p className="font-semibold text-clinic-ink">{site.clinicName}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{site.address}</p>
              <a className="btn-secondary mt-5 w-full" href={whatsappHref(site.whatsapp)}>{t('WhatsApp Booking')}</a>
            </div>
          </div>

          <form className="rounded-[2rem] bg-white p-5 shadow-luxury sm:p-6" onSubmit={handleSubmit}>
            <div className="mb-5 rounded-2xl bg-emerald-50 p-4 text-sm leading-6 text-clinic-emerald">
              {t('Fill the details once. The clinic will call or WhatsApp you to confirm the final appointment time.')}
            </div>
            <div className="mb-5 rounded-[1.5rem] border border-slate-100 bg-clinic-soft p-4">
              <p className="text-sm font-bold text-clinic-ink">{t('Choose your main health concern')}</p>
              <p className="mt-1 text-xs font-medium text-slate-500">{t('Tap one option to fill the complaint box faster. You can edit it anytime.')}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {commonConcerns.map((concern) => (
                  <button
                    className={`rounded-full border px-3 py-2 text-xs font-bold transition ${form.complaint.includes(concern) ? 'border-clinic-emerald bg-white text-clinic-emerald shadow-sm' : 'border-white bg-white/70 text-slate-600 hover:border-clinic-emerald hover:text-clinic-emerald'}`}
                    key={concern}
                    type="button"
                    onClick={() => selectConcern(concern)}
                  >
                    {concern}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="font-semibold">{t('Patient Full Name')}<input className="admin-input mt-2" name="name" value={form.name} onChange={updateField} required /><span className="mt-1 block text-xs font-medium text-slate-500">Write the name of the patient who needs consultation.</span></label>
              <label className="font-semibold">{t('Mobile / WhatsApp Number')}<input className="admin-input mt-2" name="phone" value={form.phone} onChange={updateField} inputMode="tel" required /><span className="mt-1 block text-xs font-medium text-slate-500">Clinic will use this number to confirm your booking.</span></label>
              <label className="font-semibold">{t('Email')} <span className="text-xs text-slate-400">({t('optional')})</span><input className="admin-input mt-2" type="email" name="email" value={form.email} onChange={updateField} /><span className="mt-1 block text-xs font-medium text-slate-500">If added, confirmation details can also be sent by email.</span></label>
              <label className="font-semibold">{t('Age')}<input className="admin-input mt-2" type="number" min="1" max="120" name="age" value={form.age} onChange={updateField} required /><span className="mt-1 block text-xs font-medium text-slate-500">Enter age in years.</span></label>
              <label className="font-semibold">{t('Gender')}<select className="admin-input mt-2" name="gender" value={form.gender} onChange={updateField} required><option value="">{t('Select gender')}</option><option value="Female">{t('Female')}</option><option value="Male">{t('Male')}</option><option value="Other">{t('Other')}</option></select><span className="mt-1 block text-xs font-medium text-slate-500">This helps the doctor understand the case better.</span></label>
              <label className="font-semibold">{t('Preferred Date')}<input className="admin-input mt-2" type="date" name="date" min={minDate} value={form.date} onChange={updateField} required /><span className="mt-1 block text-xs font-medium text-slate-500">Choose today or any upcoming date.</span></label>
              <label className="font-semibold sm:col-span-2">{t('Preferred Time Slot')}<select className="admin-input mt-2" name="timeSlot" value={form.timeSlot} onChange={updateField} required><option value="">{t('Select time slot')}</option>{timeSlots.map((slot) => <option key={slot}>{slot}</option>)}</select><span className="mt-1 block text-xs font-medium text-slate-500">This is your preferred time. Clinic will confirm availability.</span></label>
            </div>
            <label className="mt-4 block font-semibold">{t('Address')}<textarea className="admin-input mt-2 min-h-24" name="address" value={form.address} onChange={updateField} required /><span className="mt-1 block text-xs font-medium text-slate-500">Area/city is enough if you do not want to write full address.</span></label>
            <label className="mt-4 block font-semibold">{t('Main Health Problem')}<textarea className="admin-input mt-2 min-h-32" name="complaint" value={form.complaint} onChange={updateField} required placeholder="Example: acidity for 2 months, hair fall, skin allergy, migraine..." /><span className="mt-1 block text-xs font-medium text-slate-500">Write your main problem, since when it started, and any important symptoms.</span></label>
            <label className="mt-4 block font-semibold">{t('Additional Notes')} <span className="text-xs text-slate-400">({t('optional')})</span><textarea className="admin-input mt-2 min-h-28" name="notes" value={form.notes} onChange={updateField} placeholder="Existing medicines, reports, pregnancy, allergies, or special request" /><span className="mt-1 block text-xs font-medium text-slate-500">Share anything the doctor should know before the visit.</span></label>
            <button className="btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-70" type="submit" disabled={saving}>{saving ? t('Saving') : t('Request Appointment')}</button>
            {status && <p className={`mt-4 rounded-2xl p-4 text-sm font-semibold ${statusType === 'success' ? 'bg-emerald-50 text-clinic-emerald' : 'bg-red-50 text-red-600'}`} role="status">{status}</p>}
            {status && statusType === 'success' && (
              <div className="mt-4 rounded-[1.5rem] border border-emerald-100 bg-white p-4 shadow-sm">
                <p className="text-sm font-bold text-clinic-ink">{t('What happens next?')}</p>
                <div className="mt-3 grid gap-2 text-sm text-slate-600">
                  <p>{t('1. Clinic will review your request.')}</p>
                  <p>{t('2. You will receive confirmation by call or WhatsApp.')}</p>
                  <p>{t('3. Bring any old reports or prescriptions if available.')}</p>
                </div>
                <div className="mt-4 grid gap-2 sm:flex sm:flex-wrap">
                  <a className="btn-secondary w-full px-4 py-2 sm:w-auto" href={whatsappHref(site.whatsapp, 'Hi, I submitted an appointment request on the website.')} target="_blank" rel="noreferrer">{t('Message on WhatsApp')}</a>
                  <a className="btn-secondary w-full px-4 py-2 sm:w-auto" href={site.mapLink} target="_blank" rel="noreferrer">{t('Get Directions')}</a>
                </div>
              </div>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}
