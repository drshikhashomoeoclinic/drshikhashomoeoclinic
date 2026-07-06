import { useEffect, useState } from 'react';
import { createDocument, listDocs, removeDocument, updateDocument } from '../../services/firestore.js';
import { sanitizePayload } from '../../lib/validation.js';

const extraFields = {
  services: ['icon'],
  posts: ['date', 'excerpt:textarea', 'tags'],
  gallery: [],
  reviews: ['rating']
};

function fieldsFor(collectionName, richText) {
  return [
    'title',
    'slug',
    'category',
    'description',
    ...(extraFields[collectionName] || []).map((rawField) => rawField.split(':')[0]),
    ...(richText ? ['body'] : []),
    'image'
  ];
}

function emptyForm(collectionName, richText) {
  return fieldsFor(collectionName, richText).reduce((values, field) => ({ ...values, [field]: '' }), {});
}

function formFromItem(item, collectionName, richText) {
  const values = emptyForm(collectionName, richText);
  for (const field of fieldsFor(collectionName, richText)) {
    values[field] = item?.[field] || '';
  }
  values.title = item?.title || item?.name || '';
  values.description = item?.description || item?.text || '';
  return values;
}

function labelFor(field) {
  return field.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase());
}

export default function AdminCrud({ collectionName, title, richText = false }) {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState(() => emptyForm(collectionName, richText));
  const [status, setStatus] = useState('');

  async function refresh() {
    setItems(await listDocs(collectionName, []));
  }

  useEffect(() => {
    setEditing(null);
    setFormData(emptyForm(collectionName, richText));
    setStatus('');
    refresh();
  }, [collectionName, richText]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  function startEditing(item) {
    setEditing(item);
    setFormData(formFromItem(item, collectionName, richText));
    setStatus('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const payload = sanitizePayload(formData);
    try {
      if (editing?.id) await updateDocument(collectionName, editing.id, payload);
      else await createDocument(collectionName, payload);
      setEditing(null);
      setFormData(emptyForm(collectionName, richText));
      setStatus('Saved successfully.');
      await refresh();
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
            <label className="font-semibold">Title / Name<input className="admin-input mt-2" name="title" value={formData.title || ''} onChange={handleChange} required /></label>
            <label className="font-semibold">Slug<input className="admin-input mt-2" name="slug" value={formData.slug || ''} onChange={handleChange} /></label>
            <label className="font-semibold">Category<input className="admin-input mt-2" name="category" value={formData.category || ''} onChange={handleChange} /></label>
            <label className="font-semibold">Description<textarea className="admin-input mt-2 min-h-24" name="description" value={formData.description || ''} onChange={handleChange} /></label>
            {(extraFields[collectionName] || []).map((rawField) => {
              const [field, type] = rawField.split(':');
              return (
                <label className="font-semibold" key={field}>
                  {labelFor(field)}
                  {type === 'textarea'
                    ? <textarea className="admin-input mt-2 min-h-24" name={field} value={formData[field] || ''} onChange={handleChange} />
                    : <input className="admin-input mt-2" name={field} value={formData[field] || ''} onChange={handleChange} />}
                </label>
              );
            })}
            {richText && <label className="font-semibold">Rich Text Body<textarea className="admin-input mt-2 min-h-44" name="body" value={formData.body || ''} onChange={handleChange} /></label>}
            <label className="font-semibold">Image URL<input className="admin-input mt-2" name="image" value={formData.image || ''} onChange={handleChange} placeholder="Paste Cloudinary, GitHub, or public image URL" /></label>
            <button className="btn-primary" type="submit">Save</button>
            {status && <p className="text-sm font-semibold text-clinic-emerald" role="status">{status}</p>}
          </div>
        </form>
        <div className="grid gap-3">
          {items.map((item) => <article className="rounded-3xl bg-white p-5 shadow-glass" key={item.id}><strong>{item.title || item.name || item.slug || item.id}</strong><p className="mt-2 text-sm text-slate-600">{item.description || item.text}</p><div className="mt-4 flex gap-2"><button className="btn-secondary px-4 py-2" onClick={() => startEditing(item)}>Edit</button><button className="rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-600" onClick={() => handleDelete(item.id)}>Delete</button></div></article>)}
        </div>
      </div>
    </section>
  );
}
