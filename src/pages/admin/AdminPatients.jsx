import { Search, Trash2, UserRound } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { listDocs, removeDocument, updateDocument } from '../../services/firestore.js';
import { sanitizePayload } from '../../lib/validation.js';

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
  visitHistory: []
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
    visitHistory: Array.isArray(patient.visitHistory) ? patient.visitHistory : []
  };
}

export default function AdminPatients() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialPatient);
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
      visitHistory: form.visitHistory
    });
    await updateDocument('patients', editing.id, payload);
    setMessage('Patient profile updated.');
    setEditing(null);
    setForm(initialPatient);
    await refresh();
  }

  async function deletePatient(id) {
    await removeDocument('patients', id);
    setPatients((items) => items.filter((item) => item.id !== id));
    if (editing?.id === id) {
      setEditing(null);
      setForm(initialPatient);
    }
    setMessage('Patient deleted.');
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
      </div>
    </section>
  );
}
