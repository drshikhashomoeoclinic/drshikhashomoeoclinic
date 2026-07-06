import { CalendarDays, CheckCircle2, Clock3, Search, Trash2, XCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { createDocument, listDocs, removeDocument, updateDocument } from '../../services/firestore.js';
import { sanitizePayload } from '../../lib/validation.js';
import { sendAppointmentNotification } from '../../services/notifications.js';

const statuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'Follow-up'];
const initialEdit = {
  name: '',
  phone: '',
  email: '',
  age: '',
  gender: '',
  address: '',
  complaint: '',
  date: '',
  timeSlot: '',
  notes: '',
  status: 'Pending'
};

function appointmentTime(item) {
  return item.createdAt?.toMillis?.() || Date.parse(item.createdAt || '') || 0;
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function normalizeStatus(status) {
  const normalized = String(status || 'Pending').toLowerCase();
  if (normalized === 'new') return 'Pending';
  return statuses.find((item) => item.toLowerCase() === normalized) || 'Pending';
}

function searchableText(item) {
  return [
    item.name,
    item.phone,
    item.mobile,
    item.email,
    item.complaint,
    item.address,
    item.date,
    item.timeSlot,
    item.status
  ].filter(Boolean).join(' ').toLowerCase();
}

function editFormFrom(item) {
  return {
    name: item.name || '',
    phone: item.phone || item.mobile || '',
    email: item.email || '',
    age: item.age || '',
    gender: item.gender || '',
    address: item.address || '',
    complaint: item.complaint || item.concern || '',
    date: item.date || '',
    timeSlot: item.timeSlot || '',
    notes: item.notes || '',
    status: normalizeStatus(item.status)
  };
}

function patientIdFor(appointment) {
  const source = appointment.id || `${appointment.name || 'patient'}-${Date.now()}`;
  return `PT-${String(source).slice(0, 8).toUpperCase()}`;
}

function patientFromAppointment(appointment) {
  const visit = {
    appointmentId: appointment.id,
    date: appointment.date || '',
    timeSlot: appointment.timeSlot || '',
    complaint: appointment.complaint || appointment.concern || '',
    notes: appointment.notes || '',
    status: normalizeStatus(appointment.status)
  };

  return sanitizePayload({
    patientId: patientIdFor(appointment),
    name: appointment.name || '',
    mobile: appointment.phone || appointment.mobile || '',
    email: appointment.email || '',
    dob: appointment.dob || '',
    gender: appointment.gender || '',
    address: appointment.address || '',
    medicalHistory: appointment.medicalHistory || '',
    allergies: appointment.allergies || '',
    chronicDiseases: appointment.chronicDiseases || '',
    sourceAppointmentId: appointment.id,
    visitHistory: [visit]
  });
}

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState(initialEdit);
  const [message, setMessage] = useState('');

  async function refresh() {
    const docs = await listDocs('appointments', []);
    setAppointments(docs.map((item) => ({ ...item, status: normalizeStatus(item.status) })));
  }

  useEffect(() => { refresh(); }, []);

  const filteredAppointments = useMemo(() => {
    const query = search.trim().toLowerCase();
    return appointments
      .filter((item) => statusFilter === 'All' || normalizeStatus(item.status) === statusFilter)
      .filter((item) => !dateFilter || item.date === dateFilter)
      .filter((item) => !query || searchableText(item).includes(query))
      .sort((a, b) => appointmentTime(b) - appointmentTime(a));
  }, [appointments, dateFilter, search, statusFilter]);

  const cards = useMemo(() => {
    const today = todayKey();
    return [
      ["Today's appointments", appointments.filter((item) => item.date === today).length, CalendarDays],
      ['Pending', appointments.filter((item) => normalizeStatus(item.status) === 'Pending').length, Clock3],
      ['Completed', appointments.filter((item) => normalizeStatus(item.status) === 'Completed').length, CheckCircle2],
      ['Cancelled', appointments.filter((item) => normalizeStatus(item.status) === 'Cancelled').length, XCircle]
    ];
  }, [appointments]);

  async function mark(id, status) {
    await updateDocument('appointments', id, { status });
    setAppointments((items) => items.map((item) => item.id === id ? { ...item, status } : item));
    setMessage(`Appointment marked ${status}.`);
  }

  async function confirmAppointment(item) {
    await updateDocument('appointments', item.id, { status: 'Confirmed' });
    const confirmed = { ...item, status: 'Confirmed' };
    setAppointments((items) => items.map((appointment) => appointment.id === item.id ? confirmed : appointment));
    const result = await sendAppointmentNotification('appointment-confirmed', confirmed);

    if (!result.ok) {
      setMessage('Appointment confirmed, but notification sending failed.');
      return;
    }

    if (!result.whatsapp?.providerConfigured) {
      if (result.whatsapp?.patientLink) window.open(result.whatsapp.patientLink, '_blank', 'noopener,noreferrer');
      if (result.whatsapp?.doctorLink) window.open(result.whatsapp.doctorLink, '_blank', 'noopener,noreferrer');
    }

    if (result.emailSkipped) {
      setMessage(result.functionUnavailable
        ? 'Appointment confirmed. Notification service unavailable, so WhatsApp Web links opened as fallback.'
        : 'Appointment confirmed. WhatsApp links opened; email provider environment variables are missing or failed.');
      return;
    }

    if (!confirmed.email) {
      setMessage('Appointment confirmed. Patient email missing, so WhatsApp confirmation opened instead.');
      return;
    }

    if (result.whatsappSkipped) {
      setMessage('Appointment confirmed. Emails sent; WhatsApp Web links are ready because WhatsApp provider variables are incomplete.');
      return;
    }

    setMessage(result.whatsapp?.providerConfigured ? 'Appointment confirmed and notifications sent.' : 'Appointment confirmed. Emails sent and WhatsApp Web links opened.');
  }

  async function deleteAppointment(id) {
    await removeDocument('appointments', id);
    setAppointments((items) => items.filter((item) => item.id !== id));
    if (editing?.id === id) setEditing(null);
    setMessage('Appointment deleted.');
  }

  async function createPatient(item) {
    if (item.patientId) {
      setMessage('Patient profile already exists for this appointment.');
      return;
    }
    const patientRef = await createDocument('patients', patientFromAppointment(item));
    await updateDocument('appointments', item.id, { patientId: patientRef.id });
    setAppointments((items) => items.map((appointment) => appointment.id === item.id ? { ...appointment, patientId: patientRef.id } : appointment));
    setMessage('Patient profile created from appointment.');
  }

  async function sendReminder(item, action) {
    const result = await sendAppointmentNotification(action, item);
    const label = action === 'follow-up-reminder' ? 'Follow-up' : 'Appointment';
    if (!result.ok || result.emailSkipped) {
      setMessage(`${label} reminder template is ready, but email service is not configured.`);
      return;
    }
    setMessage(`${label} reminder sent.`);
  }

  function startEditing(item) {
    setEditing(item);
    setEditForm(editFormFrom(item));
    setMessage('');
  }

  function updateEditField(event) {
    const { name, value } = event.target;
    setEditForm((current) => ({ ...current, [name]: value }));
  }

  async function saveEdit(event) {
    event.preventDefault();
    if (!editing?.id) return;
    const payload = sanitizePayload({ ...editForm, age: editForm.age ? Number(editForm.age) : '', mobile: editForm.phone });
    await updateDocument('appointments', editing.id, payload);
    setEditing(null);
    setEditForm(initialEdit);
    setMessage('Appointment updated.');
    await refresh();
  }

  return (
    <section>
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Clinic Admin</p>
          <h1 className="font-display text-4xl font-bold">Appointment Dashboard</h1>
        </div>
        {message && <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-clinic-emerald" role="status">{message}</p>}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value, Icon]) => (
          <div className="rounded-[2rem] bg-white p-5 shadow-glass" key={label}>
            <Icon className="text-clinic-emerald" />
            <strong className="mt-4 block text-3xl">{value}</strong>
            <span className="text-sm font-semibold text-slate-500">{label}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-3 rounded-[2rem] bg-white p-4 shadow-glass lg:grid-cols-[1fr_.45fr_.45fr]">
        <label className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input className="admin-input pl-11" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name, mobile, email, complaint" />
        </label>
        <select className="admin-input" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          <option>All</option>
          {statuses.map((status) => <option key={status}>{status}</option>)}
        </select>
        <input className="admin-input" type="date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_.72fr]">
        <div className="grid gap-4">
          {filteredAppointments.length === 0 && <p className="rounded-3xl bg-white p-6 shadow-glass">No appointments found.</p>}
          {filteredAppointments.map((item) => (
            <article className="rounded-3xl bg-white p-6 shadow-glass" key={item.id}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <strong className="text-lg">{item.name}</strong>
                    <span className="rounded-full bg-clinic-soft px-3 py-1 text-xs font-bold text-clinic-emerald">{normalizeStatus(item.status)}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{item.phone || item.mobile} | {item.email} | Age {item.age || '-'}</p>
                  <p className="mt-1 text-sm text-slate-600">{item.date || 'No date'} | {item.timeSlot || 'No time slot'}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-700">{item.complaint || item.concern}</p>
                  {item.notes && <p className="mt-2 text-sm text-slate-500">Notes: {item.notes}</p>}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button className="btn-secondary px-4 py-2" onClick={() => startEditing(item)}>Edit</button>
                  <button className="btn-secondary px-4 py-2" onClick={() => createPatient(item)}>{item.patientId ? 'Patient Created' : 'Create Patient'}</button>
                  <button className="btn-secondary px-4 py-2" onClick={() => confirmAppointment(item)}>Confirm</button>
                  <button className="btn-secondary px-4 py-2" onClick={() => mark(item.id, 'Cancelled')}>Cancel</button>
                  <button className="btn-secondary px-4 py-2" onClick={() => sendReminder(item, 'appointment-reminder')}>Reminder</button>
                  <button className="btn-secondary px-4 py-2" onClick={() => sendReminder(item, 'follow-up-reminder')}>Follow-up</button>
                  <button className="rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-600" onClick={() => deleteAppointment(item.id)}><Trash2 size={16} /></button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <form className="rounded-[2rem] bg-white p-6 shadow-glass" onSubmit={saveEdit}>
          <h2 className="font-display text-2xl font-bold">{editing ? 'Edit Appointment' : 'Select an appointment'}</h2>
          <div className="mt-5 grid gap-3">
            <input className="admin-input" name="name" value={editForm.name} onChange={updateEditField} placeholder="Full Name" disabled={!editing} />
            <input className="admin-input" name="phone" value={editForm.phone} onChange={updateEditField} placeholder="Mobile Number" disabled={!editing} />
            <input className="admin-input" name="email" value={editForm.email} onChange={updateEditField} placeholder="Email" disabled={!editing} />
            <div className="grid gap-3 sm:grid-cols-2">
              <input className="admin-input" type="number" name="age" value={editForm.age} onChange={updateEditField} placeholder="Age" disabled={!editing} />
              <select className="admin-input" name="gender" value={editForm.gender} onChange={updateEditField} disabled={!editing}><option value="">Gender</option><option>Female</option><option>Male</option><option>Other</option></select>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <input className="admin-input" type="date" name="date" value={editForm.date} onChange={updateEditField} disabled={!editing} />
              <input className="admin-input" name="timeSlot" value={editForm.timeSlot} onChange={updateEditField} placeholder="Time Slot" disabled={!editing} />
            </div>
            <select className="admin-input" name="status" value={editForm.status} onChange={updateEditField} disabled={!editing}>{statuses.map((status) => <option key={status}>{status}</option>)}</select>
            <textarea className="admin-input min-h-20" name="address" value={editForm.address} onChange={updateEditField} placeholder="Address" disabled={!editing} />
            <textarea className="admin-input min-h-24" name="complaint" value={editForm.complaint} onChange={updateEditField} placeholder="Chief Complaint" disabled={!editing} />
            <textarea className="admin-input min-h-20" name="notes" value={editForm.notes} onChange={updateEditField} placeholder="Additional Notes" disabled={!editing} />
            <div className="grid gap-2 sm:grid-cols-2">
              <button className="btn-primary" type="submit" disabled={!editing}>Save Changes</button>
              <button className="btn-secondary" type="button" disabled={!editing} onClick={() => { setEditing(null); setEditForm(initialEdit); }}>Clear</button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
