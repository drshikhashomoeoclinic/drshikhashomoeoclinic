import { useEffect, useState } from 'react';
import { listDocs, updateDocument } from '../../services/firestore.js';

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  useEffect(() => { listDocs('appointments', []).then(setAppointments); }, []);

  async function mark(id, status) {
    await updateDocument('appointments', id, { status });
    setAppointments((items) => items.map((item) => item.id === id ? { ...item, status } : item));
  }

  return (
    <section>
      <h1 className="font-display text-4xl font-bold">Appointment Management</h1>
      <div className="mt-6 grid gap-4">
        {appointments.length === 0 && <p className="rounded-3xl bg-white p-6 shadow-glass">No Firebase appointments yet. Public form stores requests here once Firebase is configured.</p>}
        {appointments.map((item) => <article className="rounded-3xl bg-white p-6 shadow-glass" key={item.id}><div className="flex flex-wrap justify-between gap-4"><div><strong>{item.name}</strong><p className="text-slate-600">{item.phone} · {item.type} · {item.date}</p><p className="mt-2 text-sm">{item.concern}</p></div><div className="flex gap-2"><button className="btn-secondary px-4 py-2" onClick={() => mark(item.id, 'confirmed')}>Confirm</button><button className="btn-secondary px-4 py-2" onClick={() => mark(item.id, 'completed')}>Complete</button></div></div></article>)}
      </div>
    </section>
  );
}
