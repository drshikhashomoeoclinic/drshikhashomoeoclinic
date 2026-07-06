import { useEffect, useState } from 'react';
import { createDocument, listDocs, removeDocument, updateDocument } from '../../services/firestore.js';
import { sanitizePayload } from '../../lib/validation.js';

const extraFields = {
  services: ['icon'],
  posts: ['date', 'excerpt:textarea', 'tags'],
  gallery: [],
  reviews: ['rating']
};

function labelFor(field) {
  return field.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase());
}

export default function AdminCrud({ collectionName, title, richText = false }) {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [status, setStatus] = useState('');

  async function refresh() {
    setItems(await listDocs(collectionName, []));
  }

  useEffect(() => { refresh(); }, [collectionName]);

  async function handleSubmit(event) {
    event.preventDefault();
    const payload = sanitizePayload(Object.fromEntries(new FormData(event.currentTarget)));
    try {
      if (editing?.id) await updateDocument(collectionName, editing.id, payload);
      else await createDocument(collectionName, payload);
      setEditing(null);
      event.currentTarget.reset();
      setStatus('Saved.');
      refresh();
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function handleDelete(id) {
    await removeDocument(collectionName, id);
    refresh();
  }

  return (
    <section>
      <h1 className="font-display text-4xl font-bold">{title}</h1>
      <div className="mt-6 grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
        <form onSubmit={handleSubmit} className="rounded-[2rem] bg-white p-6 shadow-glass">
          <div className="grid gap-4">
            <label className="font-semibold">Title / Name<input className="admin-input mt-2" name="title" defaultValue={editing?.title || editing?.name || ''} required /></label>
            <label className="font-semibold">Slug<input className="admin-input mt-2" name="slug" defaultValue={editing?.slug || ''} /></label>
            <label className="font-semibold">Category<input className="admin-input mt-2" name="category" defaultValue={editing?.category || ''} /></label>
            <label className="font-semibold">Description<textarea className="admin-input mt-2 min-h-24" name="description" defaultValue={editing?.description || editing?.text || ''} /></label>
            {(extraFields[collectionName] || []).map((rawField) => {
              const [field, type] = rawField.split(':');
              return (
                <label className="font-semibold" key={field}>
                  {labelFor(field)}
                  {type === 'textarea'
                    ? <textarea className="admin-input mt-2 min-h-24" name={field} defaultValue={editing?.[field] || ''} />
                    : <input className="admin-input mt-2" name={field} defaultValue={editing?.[field] || ''} />}
                </label>
              );
            })}
            {richText && <label className="font-semibold">Rich Text Body<textarea className="admin-input mt-2 min-h-44" name="body" defaultValue={editing?.body || ''} /></label>}
            <label className="font-semibold">Image URL<input className="admin-input mt-2" name="image" defaultValue={editing?.image || ''} placeholder="Paste Cloudinary, GitHub, or public image URL" /></label>
            <button className="btn-primary" type="submit">Save</button>
            {status && <p className="text-sm font-semibold text-clinic-emerald">{status}</p>}
          </div>
        </form>
        <div className="grid gap-3">
          {items.map((item) => <article className="rounded-3xl bg-white p-5 shadow-glass" key={item.id}><strong>{item.title || item.name || item.slug || item.id}</strong><p className="mt-2 text-sm text-slate-600">{item.description || item.text}</p><div className="mt-4 flex gap-2"><button className="btn-secondary px-4 py-2" onClick={() => setEditing(item)}>Edit</button><button className="rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-600" onClick={() => handleDelete(item.id)}>Delete</button></div></article>)}
        </div>
      </div>
    </section>
  );
}
