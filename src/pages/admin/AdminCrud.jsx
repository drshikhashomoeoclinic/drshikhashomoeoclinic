import { Eye, RotateCcw, Save, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { createDocument, listDocs, removeDocument, updateDocument } from '../../services/firestore.js';
import { sanitizePayload } from '../../lib/validation.js';
import { slugify } from '../../lib/content.js';
import { aiResultMessage, askAiAssistant } from '../../services/aiAssistant.js';

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

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function normalizeTags(value = '') {
  if (Array.isArray(value)) return value.join(', ');
  return String(value || '');
}

function blogFormFromItem(item) {
  return {
    ...formFromItem(item, 'posts', true),
    date: item?.date || todayKey(),
    excerpt: item?.excerpt || item?.description || '',
    tags: normalizeTags(item?.tags),
    body: item?.body || ''
  };
}

function preparePayload(collectionName, formData) {
  const payload = { ...formData };
  if (collectionName === 'posts') {
    payload.slug = payload.slug || slugify(payload.title);
    payload.description = payload.description || payload.excerpt;
    payload.tags = String(payload.tags || '').split(',').map((tag) => tag.trim()).filter(Boolean);
  }
  return sanitizePayload(payload);
}

function validateBlog(formData) {
  const errors = {};
  if (!String(formData.title || '').trim()) errors.title = 'Article title is required.';
  if (!String(formData.excerpt || formData.description || '').trim()) errors.excerpt = 'Short summary is required.';
  if (!String(formData.body || '').trim()) errors.body = 'Full article content is required.';
  if (!String(formData.date || '').trim()) errors.date = 'Publish date is required.';
  return errors;
}

export default function AdminCrud({ collectionName, title, richText = false }) {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState(() => emptyForm(collectionName, richText));
  const [preview, setPreview] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState('success');
  const [aiBusy, setAiBusy] = useState('');
  const [aiDraft, setAiDraft] = useState('');
  const isBlogEditor = collectionName === 'posts';
  const sortedItems = useMemo(() => (
    isBlogEditor
      ? [...items].sort((a, b) => Date.parse(b.date || '') - Date.parse(a.date || ''))
      : items
  ), [isBlogEditor, items]);

  async function refresh() {
    setItems(await listDocs(collectionName, []));
  }

  useEffect(() => {
    setEditing(null);
    setFormData(isBlogEditor ? { ...emptyForm(collectionName, richText), date: todayKey() } : emptyForm(collectionName, richText));
    setPreview(false);
    setErrors({});
    setStatus('');
    setAiBusy('');
    setAiDraft('');
    refresh();
  }, [collectionName, richText, isBlogEditor]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => {
      const next = { ...current, [name]: value };
      if (isBlogEditor && name === 'title' && !current.slug) next.slug = slugify(value);
      if (isBlogEditor && name === 'excerpt') next.description = value;
      return next;
    });
    setErrors((current) => ({ ...current, [name]: '' }));
  }

  function startEditing(item) {
    setEditing(item);
    setFormData(isBlogEditor ? blogFormFromItem(item) : formFromItem(item, collectionName, richText));
    setPreview(false);
    setErrors({});
    setStatus('');
    setAiDraft('');
  }

  function resetForm() {
    setEditing(null);
    setFormData(isBlogEditor ? { ...emptyForm(collectionName, richText), date: todayKey() } : emptyForm(collectionName, richText));
    setPreview(false);
    setErrors({});
    setStatus('');
    setAiDraft('');
  }

  async function runBlogAi(type) {
    setAiBusy(type);
    const result = await askAiAssistant(type, {
      topic: formData.title || formData.category || 'patient health education',
      formData
    });
    setAiDraft(result.text);
    setStatusType('success');
    setStatus(aiResultMessage(result, 'AI helper draft is ready. Review before using.'));
    if (type === 'blogDraft' && !formData.body) {
      setFormData((current) => ({
        ...current,
        body: result.text,
        excerpt: current.excerpt || result.text.split('\n').find((line) => line.toLowerCase().startsWith('excerpt:'))?.replace(/^excerpt:\s*/i, '') || ''
      }));
    }
    setAiBusy('');
  }

  function previewBlog() {
    const validationErrors = validateBlog(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) {
      setStatusType('error');
      setStatus('Please fix the highlighted blog fields before previewing.');
      return;
    }
    setPreview(true);
    setStatusType('success');
    setStatus('Preview updated. Review it before saving.');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (isBlogEditor) {
      const validationErrors = validateBlog(formData);
      setErrors(validationErrors);
      if (Object.keys(validationErrors).length) {
        setStatusType('error');
        setStatus('Please fix the highlighted blog fields before saving.');
        return;
      }
    }
    const payload = preparePayload(collectionName, formData);
    try {
      if (editing?.id) await updateDocument(collectionName, editing.id, payload);
      else await createDocument(collectionName, payload);
      setEditing(null);
      setFormData(isBlogEditor ? { ...emptyForm(collectionName, richText), date: todayKey() } : emptyForm(collectionName, richText));
      setPreview(false);
      setErrors({});
      setStatusType('success');
      setStatus(isBlogEditor ? 'Blog post saved successfully.' : 'Saved successfully.');
      await refresh();
    } catch (error) {
      setStatusType('error');
      setStatus(error.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this item permanently? This cannot be undone.')) return;
    await removeDocument(collectionName, id);
    refresh();
  }

  if (isBlogEditor) {
    return (
      <section>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Clinic Admin</p>
            <h1 className="font-display text-4xl font-bold">{title}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Create simple patient education articles. The preview shows how the blog will look before saving.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="btn-secondary px-4 py-2" type="button" onClick={previewBlog}><Eye size={17} /> Preview</button>
            <button className="btn-secondary px-4 py-2" type="button" onClick={resetForm}><RotateCcw size={17} /> New Post</button>
          </div>
        </div>

        {status && <p className={`mt-5 rounded-2xl px-4 py-3 text-sm font-semibold ${statusType === 'success' ? 'bg-emerald-50 text-clinic-emerald' : 'bg-red-50 text-red-600'}`} role="status">{status}</p>}

        <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_.86fr]">
          <form onSubmit={handleSubmit} className="rounded-[2rem] bg-white p-5 shadow-glass sm:p-6">
            <div className="mb-5 rounded-[1.5rem] border border-emerald-100 bg-emerald-50/60 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-clinic-ink"><Sparkles className="text-clinic-emerald" size={22} /> AI Blog Helper</h2>
                  <p className="mt-1 text-sm text-slate-600">Generate patient-friendly ideas, blog drafts, SEO text, and FAQs. Review everything before saving.</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button className="btn-secondary px-4 py-2" type="button" onClick={() => runBlogAi('blogIdeas')} disabled={Boolean(aiBusy)}>{aiBusy === 'blogIdeas' ? 'Creating...' : 'Topic Ideas'}</button>
                <button className="btn-secondary px-4 py-2" type="button" onClick={() => runBlogAi('blogDraft')} disabled={Boolean(aiBusy)}>{aiBusy === 'blogDraft' ? 'Writing...' : 'Blog Draft'}</button>
                <button className="btn-secondary px-4 py-2" type="button" onClick={() => runBlogAi('seoMeta')} disabled={Boolean(aiBusy)}>{aiBusy === 'seoMeta' ? 'Creating...' : 'SEO Meta'}</button>
                <button className="btn-secondary px-4 py-2" type="button" onClick={() => runBlogAi('faqGenerator')} disabled={Boolean(aiBusy)}>{aiBusy === 'faqGenerator' ? 'Creating...' : 'FAQ Draft'}</button>
              </div>
              {aiDraft && <pre className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap rounded-2xl bg-white p-4 text-sm leading-6 text-slate-700">{aiDraft}</pre>}
            </div>
            <div className="grid gap-4">
              <label className="font-semibold">
                Article Title
                <input className={`admin-input mt-2 ${errors.title ? 'border-red-300 bg-red-50' : ''}`} name="title" value={formData.title || ''} onChange={handleChange} placeholder="Example: Hair fall: when should you consult?" required />
                <span className="mt-1 block text-xs font-medium text-slate-500">Appears as the main blog heading on the website.</span>
                {errors.title && <span className="mt-1 block text-xs font-bold text-red-600">{errors.title}</span>}
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="font-semibold">
                  Publish Date
                  <input className={`admin-input mt-2 ${errors.date ? 'border-red-300 bg-red-50' : ''}`} type="date" name="date" value={formData.date || ''} onChange={handleChange} />
                  <span className="mt-1 block text-xs font-medium text-slate-500">Controls the date shown on the blog card.</span>
                </label>
                <label className="font-semibold">
                  Topic Category
                  <input className="admin-input mt-2" name="category" value={formData.category || ''} onChange={handleChange} placeholder="Skin, Hair, Women Health, Seasonal Care" />
                  <span className="mt-1 block text-xs font-medium text-slate-500">Helps patients understand the article topic.</span>
                </label>
              </div>

              <label className="font-semibold">
                Website Link Slug
                <input className="admin-input mt-2" name="slug" value={formData.slug || ''} onChange={handleChange} placeholder="auto-created-from-title" />
                <span className="mt-1 block text-xs font-medium text-slate-500">This becomes the blog URL. It is auto-filled from the title, but you can edit it.</span>
              </label>

              <label className="font-semibold">
                Short Summary
                <textarea className={`admin-input mt-2 min-h-24 ${errors.excerpt ? 'border-red-300 bg-red-50' : ''}`} name="excerpt" value={formData.excerpt || ''} onChange={handleChange} placeholder="Write 1-2 lines that appear on the blog card." />
                <span className="mt-1 block text-xs font-medium text-slate-500">Shown on the blog card and used as the page description.</span>
                {errors.excerpt && <span className="mt-1 block text-xs font-bold text-red-600">{errors.excerpt}</span>}
              </label>

              <label className="font-semibold">
                Full Article
                <textarea className={`admin-input mt-2 min-h-56 ${errors.body ? 'border-red-300 bg-red-50' : ''}`} name="body" value={formData.body || ''} onChange={handleChange} placeholder="Write the full patient-friendly article here. Keep language simple and helpful." />
                <span className="mt-1 block text-xs font-medium text-slate-500">This appears on the full blog page. Use short paragraphs for easier reading.</span>
                {errors.body && <span className="mt-1 block text-xs font-bold text-red-600">{errors.body}</span>}
              </label>

              <label className="font-semibold">
                Keywords / Tags
                <input className="admin-input mt-2" name="tags" value={formData.tags || ''} onChange={handleChange} placeholder="hair fall, dandruff, scalp itching" />
                <span className="mt-1 block text-xs font-medium text-slate-500">Optional. Separate tags with commas.</span>
              </label>

              <label className="font-semibold">
                Cover Image URL
                <input className="admin-input mt-2" name="image" value={formData.image || ''} onChange={handleChange} placeholder="Paste Cloudinary, GitHub, or public image URL" />
                <span className="mt-1 block text-xs font-medium text-slate-500">Appears on the blog card. Leave blank to show the default article icon.</span>
              </label>

              <div className="grid gap-2 sm:grid-cols-3">
                <button className="btn-secondary" type="button" onClick={previewBlog}><Eye size={17} /> Preview</button>
                <button className="btn-secondary" type="button" onClick={resetForm}><RotateCcw size={17} /> Cancel</button>
                <button className="btn-primary" type="submit"><Save size={17} /> {editing ? 'Update Blog' : 'Save Blog'}</button>
              </div>
            </div>
          </form>

          <div className="grid gap-6">
            <article className="rounded-[2rem] bg-white p-5 shadow-glass sm:p-6">
              <p className="eyebrow">Preview</p>
              <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-slate-100 bg-clinic-soft">
                <div className="grid aspect-[16/9] place-items-center bg-gradient-to-br from-white via-clinic-cream to-emerald-50 bg-cover bg-center" style={formData.image ? { backgroundImage: `url(${formData.image})` } : undefined}>
                  {!formData.image && <span className="text-sm font-bold text-clinic-emerald/60">Cover image preview</span>}
                </div>
                <div className="bg-white p-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-clinic-gold">{formData.date ? new Date(formData.date).toLocaleDateString('en-IN') : 'Publish date'}</p>
                  <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-clinic-ink">{formData.title || 'Article title will appear here'}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{formData.excerpt || 'Short summary will appear here.'}</p>
                  {preview && <p className="mt-5 whitespace-pre-line text-sm leading-7 text-slate-700">{formData.body}</p>}
                </div>
              </div>
            </article>

            <div className="rounded-[2rem] bg-white p-5 shadow-glass sm:p-6">
              <h2 className="font-display text-2xl font-bold">Published Blog Posts</h2>
              <div className="mt-4 grid gap-3">
                {sortedItems.map((item) => (
                  <article className="rounded-2xl border border-slate-100 p-4" key={item.id}>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <strong className="block text-clinic-ink">{item.title || item.slug || item.id}</strong>
                        <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-clinic-gold">{item.category || 'Blog'} | {item.date ? new Date(item.date).toLocaleDateString('en-IN') : 'No date'}</p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{item.excerpt || item.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="btn-secondary px-4 py-2" onClick={() => startEditing(item)}>Edit</button>
                        <button className="rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-600" onClick={() => handleDelete(item.id)}>Delete</button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
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
