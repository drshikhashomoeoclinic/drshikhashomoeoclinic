import { Download, FileText, Printer, Search, Trash2, Upload, UserRound } from 'lucide-react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useEffect, useMemo, useState } from 'react';
import { listDocs, removeDocument, updateDocument } from '../../services/firestore.js';
import { sanitizePayload } from '../../lib/validation.js';
import { storage } from '../../lib/firebase.js';

const initialPatient = {
  patientId: '',
  name: '',
  mobile: '',
  email: '',
  dob: '',
  gender: '',
  address: '',
  medicalHistory: '',
  allergies: '',
  chronicDiseases: '',
  visitHistory: [],
  prescriptions: []
};

const initialPrescription = {
  date: new Date().toISOString().slice(0, 10),
  diagnosis: '',
  medicines: '',
  advice: '',
  followUpDate: ''
};

function patientSearchText(patient) {
  return [
    patient.patientId,
    patient.name,
    patient.mobile,
    patient.email,
    patient.gender,
    patient.address,
    patient.medicalHistory,
    patient.allergies,
    patient.chronicDiseases
  ].filter(Boolean).join(' ').toLowerCase();
}

function toForm(patient = {}) {
  return {
    ...initialPatient,
    ...patient,
    visitHistory: Array.isArray(patient.visitHistory) ? patient.visitHistory : [],
    prescriptions: Array.isArray(patient.prescriptions) ? patient.prescriptions : []
  };
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function prescriptionHtml(patient, prescription) {
  const safePatient = {
    name: escapeHtml(patient.name),
    patientId: escapeHtml(patient.patientId || patient.id),
    mobile: escapeHtml(patient.mobile)
  };
  const safePrescription = {
    date: escapeHtml(prescription.date),
    diagnosis: escapeHtml(prescription.diagnosis),
    medicines: escapeHtml(prescription.medicines),
    advice: escapeHtml(prescription.advice),
    followUpDate: escapeHtml(prescription.followUpDate || 'As advised')
  };

  return `<!doctype html>
<html>
  <head>
    <title>Prescription - ${safePatient.name || 'Patient'}</title>
    <style>
      body { font-family: Arial, sans-serif; color: #0f172a; margin: 40px; }
      .header { border-bottom: 2px solid #047857; padding-bottom: 16px; margin-bottom: 24px; }
      h1 { margin: 0; color: #047857; }
      .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
      .box { border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; margin-top: 14px; }
      .label { font-size: 12px; font-weight: 700; text-transform: uppercase; color: #64748b; }
      pre { white-space: pre-wrap; font-family: inherit; margin: 8px 0 0; }
    </style>
  </head>
  <body>
    <div class="header">
      <h1>Dr. Shikha's Homoeo Clinic</h1>
      <p>Prescription</p>
    </div>
    <div class="grid">
      <div><span class="label">Patient</span><br />${safePatient.name || ''}</div>
      <div><span class="label">Patient ID</span><br />${safePatient.patientId || ''}</div>
      <div><span class="label">Mobile</span><br />${safePatient.mobile || ''}</div>
      <div><span class="label">Date</span><br />${safePrescription.date || ''}</div>
    </div>
    <div class="box"><span class="label">Diagnosis</span><pre>${safePrescription.diagnosis || ''}</pre></div>
    <div class="box"><span class="label">Medicines</span><pre>${safePrescription.medicines || ''}</pre></div>
    <div class="box"><span class="label">Advice</span><pre>${safePrescription.advice || ''}</pre></div>
    <div class="box"><span class="label">Follow-up Date</span><pre>${safePrescription.followUpDate}</pre></div>
  </body>
</html>`;
}

export default function AdminPatients() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialPatient);
  const [prescriptionForm, setPrescriptionForm] = useState(initialPrescription);
  const [prescriptionPdf, setPrescriptionPdf] = useState(null);
  const [labReports, setLabReports] = useState([]);
  const [savingPrescription, setSavingPrescription] = useState(false);
  const [message, setMessage] = useState('');

  async function refresh() {
    setPatients(await listDocs('patients', []));
  }

  useEffect(() => { refresh(); }, []);

  const filteredPatients = useMemo(() => {
    const query = search.trim().toLowerCase();
    return patients
      .filter((patient) => !query || patientSearchText(patient).includes(query))
      .sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
  }, [patients, search]);

  function startEditing(patient) {
    setEditing(patient);
    setForm(toForm(patient));
    setPrescriptionForm(initialPrescription);
    setPrescriptionPdf(null);
    setLabReports([]);
    setMessage('');
  }

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function savePatient(event) {
    event.preventDefault();
    if (!editing?.id) return;
    const payload = sanitizePayload({
      patientId: form.patientId,
      name: form.name,
      mobile: form.mobile,
      email: form.email,
      dob: form.dob,
      gender: form.gender,
      address: form.address,
      medicalHistory: form.medicalHistory,
      allergies: form.allergies,
      chronicDiseases: form.chronicDiseases,
      visitHistory: form.visitHistory,
      prescriptions: form.prescriptions
    });
    await updateDocument('patients', editing.id, payload);
    setMessage('Patient profile updated.');
    setEditing(null);
    setForm(initialPatient);
    await refresh();
  }

  async function deletePatient(id) {
    if (!window.confirm('Delete this patient permanently? This cannot be undone.')) return;
    await removeDocument('patients', id);
    setPatients((items) => items.filter((item) => item.id !== id));
    if (editing?.id === id) {
      setEditing(null);
      setForm(initialPatient);
    }
    setMessage('Patient deleted.');
  }

  function updatePrescriptionField(event) {
    const { name, value } = event.target;
    setPrescriptionForm((current) => ({ ...current, [name]: value }));
  }

  async function uploadFile(file, patientId, folder) {
    if (!file) return null;
    if (!storage) throw new Error('Firebase Storage is not configured.');
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
    const path = `patients/${patientId}/${folder}/${Date.now()}-${safeName}`;
    const fileRef = ref(storage, path);
    await uploadBytes(fileRef, file);
    return getDownloadURL(fileRef);
  }

  async function savePrescription(event) {
    event.preventDefault();
    if (!editing?.id) {
      setMessage('Select a patient before creating a prescription.');
      return;
    }
    setSavingPrescription(true);
    try {
      const patientKey = form.patientId || editing.id;
      const pdfUrl = await uploadFile(prescriptionPdf, patientKey, 'prescriptions');
      const reportUrls = await Promise.all(labReports.map((file) => uploadFile(file, patientKey, 'lab-reports')));
      const nextPrescription = sanitizePayload({
        id: `RX-${Date.now()}`,
        ...prescriptionForm,
        prescriptionPdfUrl: pdfUrl || '',
        labReports: reportUrls.filter(Boolean).map((url, index) => ({ name: labReports[index]?.name || `Lab Report ${index + 1}`, url }))
      });
      const nextPrescriptions = [...(form.prescriptions || []), nextPrescription];
      await updateDocument('patients', editing.id, { prescriptions: nextPrescriptions });
      setForm((current) => ({ ...current, prescriptions: nextPrescriptions }));
      setPatients((items) => items.map((item) => item.id === editing.id ? { ...item, prescriptions: nextPrescriptions } : item));
      setPrescriptionForm({ ...initialPrescription, date: new Date().toISOString().slice(0, 10) });
      setPrescriptionPdf(null);
      setLabReports([]);
      setMessage('Prescription saved under patient profile.');
    } catch (error) {
      setMessage(error.message || 'Unable to save prescription.');
    } finally {
      setSavingPrescription(false);
    }
  }

  function printPrescription(patient, prescription) {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(prescriptionHtml(patient, prescription));
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  return (
    <section>
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Clinic Admin</p>
          <h1 className="font-display text-4xl font-bold">Patient Dashboard</h1>
        </div>
        {message && <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-clinic-emerald" role="status">{message}</p>}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-[2rem] bg-white p-5 shadow-glass"><UserRound className="text-clinic-emerald" /><strong className="mt-4 block text-3xl">{patients.length}</strong><span className="text-sm font-semibold text-slate-500">Total Patients</span></div>
        <div className="rounded-[2rem] bg-white p-5 shadow-glass"><strong className="block text-3xl text-clinic-emerald">{patients.filter((patient) => patient.visitHistory?.length).length}</strong><span className="text-sm font-semibold text-slate-500">With Visit History</span></div>
        <div className="rounded-[2rem] bg-white p-5 shadow-glass"><strong className="block text-3xl text-clinic-emerald">{filteredPatients.length}</strong><span className="text-sm font-semibold text-slate-500">Search Results</span></div>
      </div>

      <label className="relative mt-6 block rounded-[2rem] bg-white p-4 shadow-glass">
        <Search className="pointer-events-none absolute left-8 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input className="admin-input pl-11" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search patients by ID, name, mobile, email, history" />
      </label>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_.78fr]">
        <div className="grid gap-4">
          {filteredPatients.length === 0 && <p className="rounded-3xl bg-white p-6 shadow-glass">No patients found.</p>}
          {filteredPatients.map((patient) => (
            <article className="rounded-3xl bg-white p-6 shadow-glass" key={patient.id}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <strong className="text-lg">{patient.name}</strong>
                    <span className="rounded-full bg-clinic-soft px-3 py-1 text-xs font-bold text-clinic-emerald">{patient.patientId || patient.id}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{patient.mobile} | {patient.email || 'No email'} | {patient.gender || 'No gender'}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-700">{patient.address}</p>
                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <p className="rounded-2xl bg-clinic-soft p-3 text-sm"><strong className="block">Medical History</strong>{patient.medicalHistory || 'None added'}</p>
                    <p className="rounded-2xl bg-clinic-soft p-3 text-sm"><strong className="block">Allergies</strong>{patient.allergies || 'None added'}</p>
                    <p className="rounded-2xl bg-clinic-soft p-3 text-sm"><strong className="block">Chronic Diseases</strong>{patient.chronicDiseases || 'None added'}</p>
                  </div>
                  {patient.visitHistory?.length > 0 && (
                    <div className="mt-4 rounded-2xl border border-slate-100 p-4">
                      <strong className="text-sm">Visit History</strong>
                      <div className="mt-3 grid gap-2">
                        {patient.visitHistory.map((visit, index) => (
                          <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600" key={`${visit.appointmentId || visit.date}-${index}`}>
                            {visit.date || 'No date'} | {visit.timeSlot || 'No time'} | {visit.complaint || 'No complaint'}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                  {patient.prescriptions?.length > 0 && (
                    <div className="mt-4 rounded-2xl border border-slate-100 p-4">
                      <strong className="text-sm">Prescriptions</strong>
                      <div className="mt-3 grid gap-2">
                        {patient.prescriptions.map((prescription) => (
                          <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600" key={prescription.id || prescription.date}>
                            <p><strong>{prescription.date || 'No date'}</strong> | {prescription.diagnosis || 'Prescription'}</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <button className="btn-secondary px-3 py-2" onClick={() => printPrescription(patient, prescription)}><Printer size={15} /> Print</button>
                              {prescription.prescriptionPdfUrl && <a className="btn-secondary px-3 py-2" href={prescription.prescriptionPdfUrl} target="_blank" rel="noreferrer"><Download size={15} /> PDF</a>}
                              {prescription.labReports?.map((report) => <a className="btn-secondary px-3 py-2" href={report.url} target="_blank" rel="noreferrer" key={report.url}><FileText size={15} /> {report.name}</a>)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button className="btn-secondary px-4 py-2" onClick={() => startEditing(patient)}>Edit</button>
                  <button className="rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-600" onClick={() => deletePatient(patient.id)}><Trash2 size={16} /></button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <form className="rounded-[2rem] bg-white p-6 shadow-glass" onSubmit={savePatient}>
          <h2 className="font-display text-2xl font-bold">{editing ? 'Edit Patient Profile' : 'Select a patient'}</h2>
          <div className="mt-5 grid gap-3">
            <input className="admin-input" name="patientId" value={form.patientId} onChange={updateField} placeholder="Patient ID" disabled={!editing} />
            <input className="admin-input" name="name" value={form.name} onChange={updateField} placeholder="Name" disabled={!editing} />
            <input className="admin-input" name="mobile" value={form.mobile} onChange={updateField} placeholder="Mobile" disabled={!editing} />
            <input className="admin-input" name="email" value={form.email} onChange={updateField} placeholder="Email" disabled={!editing} />
            <div className="grid gap-3 sm:grid-cols-2">
              <input className="admin-input" type="date" name="dob" value={form.dob} onChange={updateField} disabled={!editing} />
              <select className="admin-input" name="gender" value={form.gender} onChange={updateField} disabled={!editing}><option value="">Gender</option><option>Female</option><option>Male</option><option>Other</option></select>
            </div>
            <textarea className="admin-input min-h-20" name="address" value={form.address} onChange={updateField} placeholder="Address" disabled={!editing} />
            <textarea className="admin-input min-h-24" name="medicalHistory" value={form.medicalHistory} onChange={updateField} placeholder="Medical History" disabled={!editing} />
            <textarea className="admin-input min-h-20" name="allergies" value={form.allergies} onChange={updateField} placeholder="Allergies" disabled={!editing} />
            <textarea className="admin-input min-h-20" name="chronicDiseases" value={form.chronicDiseases} onChange={updateField} placeholder="Chronic Diseases" disabled={!editing} />
            <button className="btn-primary" type="submit" disabled={!editing}>Save Patient</button>
          </div>
        </form>

        <form className="rounded-[2rem] bg-white p-6 shadow-glass xl:col-start-2" onSubmit={savePrescription}>
          <h2 className="font-display text-2xl font-bold">Prescription Management</h2>
          <p className="mt-2 text-sm text-slate-500">{editing ? `Create prescription for ${form.name}` : 'Select a patient to create prescriptions, upload PDFs, and attach lab reports.'}</p>
          <div className="mt-5 grid gap-3">
            <input className="admin-input" type="date" name="date" value={prescriptionForm.date} onChange={updatePrescriptionField} disabled={!editing} />
            <textarea className="admin-input min-h-20" name="diagnosis" value={prescriptionForm.diagnosis} onChange={updatePrescriptionField} placeholder="Diagnosis" disabled={!editing} />
            <textarea className="admin-input min-h-28" name="medicines" value={prescriptionForm.medicines} onChange={updatePrescriptionField} placeholder="Medicines and dosage" disabled={!editing} />
            <textarea className="admin-input min-h-24" name="advice" value={prescriptionForm.advice} onChange={updatePrescriptionField} placeholder="Advice" disabled={!editing} />
            <input className="admin-input" type="date" name="followUpDate" value={prescriptionForm.followUpDate} onChange={updatePrescriptionField} disabled={!editing} />
            <label className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm font-semibold text-slate-600">
              <span className="mb-2 flex items-center gap-2"><Upload size={17} /> Upload Prescription PDF</span>
              <input className="block w-full text-sm" type="file" accept="application/pdf" disabled={!editing} onChange={(event) => setPrescriptionPdf(event.target.files?.[0] || null)} />
            </label>
            <label className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm font-semibold text-slate-600">
              <span className="mb-2 flex items-center gap-2"><Upload size={17} /> Upload Lab Reports</span>
              <input className="block w-full text-sm" type="file" accept="application/pdf,image/*" multiple disabled={!editing} onChange={(event) => setLabReports(Array.from(event.target.files || []))} />
            </label>
            <div className="grid gap-2 sm:grid-cols-2">
              <button className="btn-primary" type="submit" disabled={!editing || savingPrescription}>{savingPrescription ? 'Saving...' : 'Save Prescription'}</button>
              <button className="btn-secondary" type="button" disabled={!editing} onClick={() => printPrescription(form, prescriptionForm)}><Printer size={17} /> Print Draft</button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
