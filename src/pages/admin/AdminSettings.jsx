import { useEffect, useState } from 'react';
import ImageUploader from '../../components/admin/ImageUploader.jsx';
import { getDocument, saveDocument } from '../../services/firestore.js';

export default function AdminSettings({ collectionName, documentId, title }) {
  const [data, setData] = useState({});
  const [status, setStatus] = useState('');

  useEffect(() => { getDocument(collectionName, documentId, {}).then(setData); }, [collectionName, documentId]);

  async function handleSubmit(event) {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget));
    try {
      await saveDocument(collectionName, documentId, payload);
      setStatus('Settings saved.');
    } catch (error) {
      setStatus(error.message);
    }
  }

  return (
    <section>
      <h1 className="font-display text-4xl font-bold">{title}</h1>
      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 rounded-[2rem] bg-white p-6 shadow-glass lg:grid-cols-2">
        {['clinicName', 'doctorName', 'qualification', 'experience', 'patients', 'phone', 'whatsapp', 'email', 'hours', 'mapLink', 'mapEmbed', 'googleReviews'].map((field) => <label className="font-semibold" key={field}>{field}<input className="admin-input mt-2" name={field} defaultValue={data[field] || ''} /></label>)}
        <label className="font-semibold lg:col-span-2">Address<textarea className="admin-input mt-2" name="address" defaultValue={data.address || ''} /></label>
        <label className="font-semibold lg:col-span-2">About<textarea className="admin-input mt-2 min-h-32" name="about" defaultValue={data.about || ''} /></label>
        <div className="lg:col-span-2"><ImageUploader folder="settings" onUploaded={(url) => setData((current) => ({ ...current, doctorPhoto: url }))} /></div>
        <button className="btn-primary lg:col-span-2" type="submit">Save Settings</button>
        {status && <p className="font-semibold text-clinic-emerald">{status}</p>}
      </form>
    </section>
  );
}
