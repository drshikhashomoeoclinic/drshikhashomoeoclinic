import { Eye, RotateCcw, Save, Sparkles, Undo2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { homeSettings, seoSettings, siteSettings } from '../../data/fallback.js';
import { getDocument, saveDocument } from '../../services/firestore.js';
import { askAiAssistant } from '../../services/aiAssistant.js';

const fieldSets = {
  'settings/site': [
    'clinicName', 'doctorName', 'qualification', 'phone', 'whatsapp', 'email', 'location', 'hours', 'mapLink', 'mapEmbed', 'googleReviews',
    'address:textarea', 'footerDescription:textarea', 'emergencyText:textarea'
  ],
  'settings/doctor': [
    'doctorName', 'qualification', 'experience', 'patients', 'doctorPhoto', 'profileTitle',
    'about:textarea', 'certificates:textarea', 'achievements:textarea'
  ],
  'pages/home': [
    'eyebrow', 'heroTitle', 'heroSubtitle:textarea', 'heroImage',
    'highlights:textarea', 'feature1Title', 'feature1Text:textarea',
    'feature2Title', 'feature2Text:textarea', 'feature3Title', 'feature3Text:textarea',
    'treatmentsTitle', 'treatmentsText:textarea',
    'campaignBadge', 'campaignTitle', 'campaignText:textarea', 'campaignButtonLabel', 'campaignButtonUrl', 'campaignImage',
    'reviewsTitle', 'reviewsText:textarea',
    'blogTitle', 'contactTitle', 'contactText:textarea'
  ],
  'seo/settings': [
    'siteUrl', 'canonicalBase', 'title', 'description:textarea', 'keywords:textarea', 'image',
    'googleAnalyticsId', 'searchConsoleVerification', 'schemaType', 'medicalSpecialty',
    'priceRange', 'areaServed:textarea', 'robotsTxt:textarea', 'sitemapXml:textarea',
    'homeTitle', 'homeDescription:textarea', 'aboutTitle', 'aboutDescription:textarea',
    'treatmentsTitle', 'treatmentsDescription:textarea', 'blogTitle', 'blogDescription:textarea',
    'contactTitle', 'contactDescription:textarea', 'bookAppointmentTitle', 'bookAppointmentDescription:textarea'
  ]
};

function fieldConfig(collectionName, documentId) {
  return fieldSets[`${collectionName}/${documentId}`] || ['title', 'description:textarea', 'image'];
}

function labelFor(field) {
  return field.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase());
}

function homeDefaults() {
  const [feature1, feature2, feature3] = homeSettings.featureCards;
  return {
    ...homeSettings,
    highlights: homeSettings.highlights.join('\n'),
    feature1Title: feature1?.title || '',
    feature1Text: feature1?.text || '',
    feature2Title: feature2?.title || '',
    feature2Text: feature2?.text || '',
    feature3Title: feature3?.title || '',
    feature3Text: feature3?.text || '',
    footerDescription: siteSettings.footerDescription || '',
    emergencyText: siteSettings.emergencyText || ''
  };
}

function defaultData(collectionName, documentId) {
  const key = `${collectionName}/${documentId}`;
  if (key === 'settings/site') return siteSettings;
  if (key === 'settings/doctor') return siteSettings;
  if (key === 'pages/home') return homeDefaults();
  if (key === 'seo/settings') return seoSettings;
  return {};
}

const homepageSections = [
  {
    id: 'hero',
    title: 'Hero Section',
    liveHash: 'home-hero',
    placeholder: 'Top banner preview',
    description: 'This is the first section patients see when they open the website.',
    fields: [
      ['eyebrow', 'Small Label', 'Appears above the main heading on the homepage hero.'],
      ['heroTitle', 'Main Heading', 'Appears as the large main heading at the top of the homepage.'],
      ['heroSubtitle:textarea', 'Short Description', 'Appears below the main heading in the hero section.'],
      ['heroImage', 'Doctor Image URL', 'Controls the main doctor or clinic image shown beside the hero text.'],
      ['highlights:textarea', 'Highlight Points', 'Appears as small highlight boxes under the hero buttons. Add one point per line.']
    ]
  },
  {
    id: 'features',
    title: 'Features Section',
    liveHash: 'services',
    placeholder: 'Three feature cards',
    description: 'These cards explain why patients should choose the clinic.',
    fields: [
      ['feature1Title', 'First Feature Title', 'Appears on the first feature card below the hero.'],
      ['feature1Text:textarea', 'First Feature Description', 'Appears inside the first feature card.'],
      ['feature2Title', 'Second Feature Title', 'Appears on the second feature card below the hero.'],
      ['feature2Text:textarea', 'Second Feature Description', 'Appears inside the second feature card.'],
      ['feature3Title', 'Third Feature Title', 'Appears on the third feature card below the hero.'],
      ['feature3Text:textarea', 'Third Feature Description', 'Appears inside the third feature card.']
    ]
  },
  {
    id: 'treatments',
    title: 'Treatments Section',
    liveHash: 'treatments',
    placeholder: 'Treatment list header',
    description: 'This heading sits above the treatment cards on the homepage.',
    fields: [
      ['treatmentsTitle', 'Section Heading', 'Appears above the treatment cards on the homepage.'],
      ['treatmentsText:textarea', 'Section Description', 'Appears below the treatment heading.']
    ]
  },
  {
    id: 'campaign',
    title: 'Campaign Section',
    liveHash: 'campaign',
    placeholder: 'Offer or awareness campaign',
    description: 'Use this for appointment campaigns, seasonal awareness, or special patient guidance.',
    fields: [
      ['campaignBadge', 'Small Campaign Label', 'Appears as the small label above the campaign heading.'],
      ['campaignTitle', 'Campaign Heading', 'Appears as the main campaign message on the homepage.'],
      ['campaignText:textarea', 'Campaign Description', 'Explains the campaign or appointment offer in simple patient language.'],
      ['campaignButtonLabel', 'Button Text', 'Appears on the campaign call-to-action button.'],
      ['campaignButtonUrl', 'Button Link', 'Use /book-appointment for appointment page, or paste a full external link.'],
      ['campaignImage', 'Campaign Image URL', 'Optional image shown on the right side of the campaign section.']
    ]
  },
  {
    id: 'reviews',
    title: 'Reviews Section',
    liveHash: 'reviews',
    placeholder: 'Patient review intro',
    description: 'This introduces patient feedback on the homepage.',
    fields: [
      ['reviewsTitle', 'Section Heading', 'Appears beside the homepage review previews.'],
      ['reviewsText:textarea', 'Section Description', 'Appears below the reviews heading.']
    ]
  },
  {
    id: 'blog',
    title: 'Blog Section',
    liveHash: 'blog',
    placeholder: 'Health notes heading',
    description: 'This title appears above the latest health notes on the homepage.',
    fields: [
      ['blogTitle', 'Section Heading', 'Appears above the latest blog posts on the homepage.']
    ]
  },
  {
    id: 'contact',
    title: 'Contact CTA',
    liveHash: 'contact',
    placeholder: 'Booking call-to-action',
    description: 'This call-to-action encourages patients to book or contact the clinic.',
    fields: [
      ['contactTitle', 'CTA Heading', 'Appears in the contact call-to-action near the bottom of the homepage.'],
      ['contactText:textarea', 'CTA Description', 'Appears below the contact call-to-action heading.']
    ]
  },
  {
    id: 'footer',
    title: 'Footer',
    liveHash: 'site-footer',
    placeholder: 'Website footer text',
    description: 'These fields affect the footer shown at the bottom of the public website.',
    fields: [
      ['footerDescription:textarea', 'Footer Description', 'Appears under the clinic name in the website footer.'],
      ['emergencyText:textarea', 'Emergency Note', 'Appears in the footer under opening hours and address.']
    ]
  }
];

function normalizeValue(value) {
  return String(value || '').trim();
}

function validateHomepage(draft) {
  const errors = {};
  if (!normalizeValue(draft.heroTitle)) errors.heroTitle = 'Main Heading is required.';
  if (!normalizeValue(draft.heroSubtitle)) errors.heroSubtitle = 'Short Description is required.';
  if (!normalizeValue(draft.highlights)) errors.highlights = 'Add at least one highlight point.';
  if (!normalizeValue(draft.treatmentsTitle)) errors.treatmentsTitle = 'Treatments heading is required.';
  if (!normalizeValue(draft.campaignTitle)) errors.campaignTitle = 'Campaign heading is required.';
  if (!normalizeValue(draft.campaignText)) errors.campaignText = 'Campaign description is required.';
  if (!normalizeValue(draft.reviewsTitle)) errors.reviewsTitle = 'Reviews heading is required.';
  if (!normalizeValue(draft.blogTitle)) errors.blogTitle = 'Blog heading is required.';
  if (!normalizeValue(draft.contactTitle)) errors.contactTitle = 'Contact CTA heading is required.';
  return errors;
}

function sectionHasError(section, errors) {
  return section.fields.some(([rawField]) => errors[rawField.split(':')[0]]);
}

function PreviewHeader({ title, text, fallback }) {
  return (
    <div>
      <p className="eyebrow">Section preview</p>
      <h3 className="mt-2 font-display text-3xl font-bold">{title || fallback}</h3>
      {text && <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>}
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {[1, 2, 3].map((item) => <span className="h-16 rounded-2xl bg-slate-100" key={item} />)}
      </div>
    </div>
  );
}

export default function AdminSettings({ collectionName, documentId, title }) {
  const [data, setData] = useState({});
  const [draft, setDraft] = useState({});
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState('success');
  const [aiBusy, setAiBusy] = useState('');
  const [aiDraft, setAiDraft] = useState('');
  const fields = useMemo(() => fieldConfig(collectionName, documentId), [collectionName, documentId]);
  const isHomepageEditor = collectionName === 'pages' && documentId === 'home';
  const isSeoEditor = collectionName === 'seo' && documentId === 'settings';

  useEffect(() => {
    const fallback = defaultData(collectionName, documentId);
    getDocument(collectionName, documentId, fallback).then((document) => {
      const nextData = { ...fallback, ...document };
      setData(nextData);
      setDraft(nextData);
      setPreview(null);
      setErrors({});
      setStatus('');
      setAiBusy('');
      setAiDraft('');
    });
  }, [collectionName, documentId]);

  function updateDraft(event) {
    const { name, value } = event.target;
    setDraft((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  }

  function resetHomepage() {
    setDraft(data);
    setPreview(null);
    setErrors({});
    setStatus('');
    setAiDraft('');
  }

  function previewHomepage() {
    const validationErrors = validateHomepage(draft);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) {
      setStatusType('error');
      setStatus('Please fix the highlighted fields before previewing.');
      return;
    }
    setPreview(draft);
    setStatusType('success');
    setStatus('Preview updated. Review the section previews before saving.');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const payload = isHomepageEditor ? draft : Object.fromEntries(new FormData(event.currentTarget));
    if (isHomepageEditor) {
      const validationErrors = validateHomepage(payload);
      setErrors(validationErrors);
      if (Object.keys(validationErrors).length) {
        setStatusType('error');
        setStatus('Please fix the highlighted fields before saving.');
        return;
      }
    }
    try {
      await saveDocument(collectionName, documentId, payload);
      setData(payload);
      setPreview(payload);
      setStatusType('success');
      setStatus(isHomepageEditor ? 'Homepage Hero Section updated successfully.' : 'Settings saved.');
      if (isHomepageEditor && event.nativeEvent?.submitter?.dataset?.view === 'website') {
        window.open('/', '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      setStatusType('error');
      setStatus(error.message);
    }
  }

  function lineValue(text, label) {
    const match = String(text || '').match(new RegExp(`${label}:\\s*(.+)`, 'i'));
    return match?.[1]?.trim() || '';
  }

  async function generateCampaignDraft() {
    setAiBusy('campaignCaption');
    const result = await askAiAssistant('campaignCaption', { homepage: draft, clinic: data });
    setAiDraft(result.text);
    setDraft((current) => ({
      ...current,
      campaignTitle: lineValue(result.text, 'Campaign Heading') || current.campaignTitle,
      campaignText: lineValue(result.text, 'Description') || current.campaignText,
      campaignButtonLabel: lineValue(result.text, 'Button Text') || current.campaignButtonLabel
    }));
    setStatusType('success');
    setStatus(result.fallback ? 'Campaign draft created using free fallback template. Add GEMINI_API_KEY for smarter output.' : 'AI campaign draft added. Review before saving.');
    setAiBusy('');
  }

  async function generateSeoDraft() {
    setAiBusy('seoMeta');
    const result = await askAiAssistant('seoMeta', { settings: data, fields });
    setAiDraft(result.text);
    setStatusType('success');
    setStatus(result.fallback ? 'SEO draft created using free fallback template. Add GEMINI_API_KEY for smarter output.' : 'AI SEO draft ready. Review before saving.');
    setAiBusy('');
  }

  if (isHomepageEditor) {
    const previewData = preview || draft;

    return (
      <section>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Clinic Admin</p>
            <h1 className="font-display text-4xl font-bold">{title}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Edit the homepage section by section. Each field explains where it appears on the live website.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="btn-secondary px-4 py-2" type="button" onClick={previewHomepage}><Eye size={17} /> Preview Changes</button>
            <button className="btn-secondary px-4 py-2" type="button" onClick={resetHomepage}><RotateCcw size={17} /> Reset</button>
          </div>
        </div>

        {status && <p className={`mt-5 rounded-2xl px-4 py-3 text-sm font-semibold ${statusType === 'success' ? 'bg-emerald-50 text-clinic-emerald' : 'bg-red-50 text-red-600'}`} role="status">{status}</p>}

        <form onSubmit={handleSubmit} className="mt-6 grid gap-6">
          {homepageSections.map((section) => (
            <article className={`rounded-[2rem] border bg-white p-5 shadow-glass ${sectionHasError(section, errors) ? 'border-red-200' : 'border-slate-100'}`} key={section.id}>
              <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="font-display text-2xl font-bold">{section.title}</h2>
                  <p className="mt-1 text-sm text-slate-500">{section.description}</p>
                </div>
                <a className="btn-secondary px-4 py-2" href={`/#${section.liveHash}`} target="_blank" rel="noreferrer">View Live Section</a>
              </div>

              <div className="mt-5 grid gap-6 xl:grid-cols-[1.05fr_.95fr]">
                <div className="grid gap-4 md:grid-cols-2">
                  {section.id === 'campaign' && (
                    <div className="rounded-[1.5rem] border border-emerald-100 bg-emerald-50/60 p-4 md:col-span-2">
                      <h3 className="flex items-center gap-2 font-display text-xl font-bold text-clinic-ink"><Sparkles className="text-clinic-emerald" size={20} /> AI Campaign Helper</h3>
                      <p className="mt-1 text-sm text-slate-600">Generate a patient-friendly campaign heading, description, button text, and social caption.</p>
                      <button className="btn-secondary mt-3 px-4 py-2" type="button" onClick={generateCampaignDraft} disabled={aiBusy === 'campaignCaption'}>{aiBusy === 'campaignCaption' ? 'Creating...' : 'Generate Campaign Text'}</button>
                      {aiDraft && <pre className="mt-3 max-h-56 overflow-auto whitespace-pre-wrap rounded-2xl bg-white p-3 text-sm leading-6 text-slate-700">{aiDraft}</pre>}
                    </div>
                  )}
                  {section.fields.map(([rawField, friendlyLabel, helper]) => {
                    const [field, type] = rawField.split(':');
                    const isTextarea = type === 'textarea';
                    return (
                      <label className={`font-semibold ${isTextarea ? 'md:col-span-2' : ''}`} key={field}>
                        {friendlyLabel}
                        {isTextarea ? (
                          <textarea className={`admin-input mt-2 min-h-28 ${errors[field] ? 'border-red-300 bg-red-50' : ''}`} name={field} value={draft[field] || ''} onChange={updateDraft} />
                        ) : (
                          <input className={`admin-input mt-2 ${errors[field] ? 'border-red-300 bg-red-50' : ''}`} name={field} value={draft[field] || ''} onChange={updateDraft} placeholder={field.toLowerCase().includes('image') ? 'Paste Cloudinary, GitHub, or public image URL' : ''} />
                        )}
                        <span className="mt-1 block text-xs font-medium leading-5 text-slate-500">{helper}</span>
                        {errors[field] && <span className="mt-1 block text-xs font-bold text-red-600">{errors[field]}</span>}
                      </label>
                    );
                  })}
                </div>

                <div className="rounded-[1.5rem] border border-slate-100 bg-clinic-soft p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-clinic-emerald">{section.placeholder}</p>
                  <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-glass">
                    <div className="border-b border-slate-100 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-500">Website preview</div>
                    <div className="p-5">
                      {section.id === 'hero' && (
                        <div className="grid gap-4 md:grid-cols-[1fr_.75fr]">
                          <div>
                            <p className="eyebrow">{previewData.eyebrow || 'Small label'}</p>
                            <h3 className="mt-2 font-display text-3xl font-bold">{previewData.heroTitle || 'Main Heading'}</h3>
                            <p className="mt-3 text-sm leading-6 text-slate-600">{previewData.heroSubtitle || 'Short description appears here.'}</p>
                            <div className="mt-4 flex flex-wrap gap-2">{String(previewData.highlights || '').split(/\r?\n|,/).filter(Boolean).slice(0, 3).map((item) => <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-clinic-emerald" key={item}>{item.trim()}</span>)}</div>
                          </div>
                          <div className="grid min-h-40 place-items-center rounded-2xl bg-slate-100 text-center text-xs font-semibold text-slate-500">{previewData.heroImage ? 'Doctor image will appear here' : 'Doctor image placeholder'}</div>
                        </div>
                      )}
                      {section.id === 'features' && (
                        <div className="grid gap-3 sm:grid-cols-3">{[1, 2, 3].map((index) => <div className="rounded-2xl border border-slate-100 p-3" key={index}><strong className="text-sm">{previewData[`feature${index}Title`] || `Feature ${index}`}</strong><p className="mt-2 text-xs leading-5 text-slate-500">{previewData[`feature${index}Text`] || 'Feature description appears here.'}</p></div>)}</div>
                      )}
                      {section.id === 'treatments' && <PreviewHeader title={previewData.treatmentsTitle} text={previewData.treatmentsText} fallback="Conditions We Treat" />}
                      {section.id === 'campaign' && (
                        <div className="rounded-2xl bg-clinic-ink p-4 text-white">
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-clinic-gold">{previewData.campaignBadge || 'Campaign label'}</p>
                          <h3 className="mt-3 font-display text-3xl font-bold">{previewData.campaignTitle || 'Campaign heading'}</h3>
                          <p className="mt-2 text-sm leading-6 text-white/70">{previewData.campaignText || 'Campaign description appears here.'}</p>
                          <span className="mt-4 inline-flex rounded-full bg-clinic-gold px-4 py-2 text-xs font-bold text-clinic-ink">{previewData.campaignButtonLabel || 'Button text'}</span>
                        </div>
                      )}
                      {section.id === 'reviews' && <PreviewHeader title={previewData.reviewsTitle} text={previewData.reviewsText} fallback="Patient experiences" />}
                      {section.id === 'blog' && <PreviewHeader title={previewData.blogTitle} fallback="Latest from the clinic" />}
                      {section.id === 'contact' && <PreviewHeader title={previewData.contactTitle} text={previewData.contactText} fallback="Visit or reach us" />}
                      {section.id === 'footer' && <div className="rounded-2xl bg-clinic-ink p-4 text-white"><strong>Clinic footer</strong><p className="mt-2 text-sm text-white/70">{previewData.footerDescription || 'Footer description appears here.'}</p><p className="mt-3 text-xs text-white/60">{previewData.emergencyText || 'Emergency note appears here.'}</p></div>}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}

          <div className="sticky bottom-4 z-30 flex flex-col gap-3 rounded-[2rem] border border-slate-100 bg-white/95 p-4 shadow-luxury backdrop-blur md:flex-row md:items-center md:justify-between">
            <p className="text-sm font-semibold text-slate-600">Preview changes first, then save when the homepage looks right.</p>
            <div className="flex flex-wrap gap-2">
              <button className="btn-secondary px-4 py-2" type="button" onClick={previewHomepage}><Eye size={17} /> Preview Changes</button>
              <button className="btn-secondary px-4 py-2" type="button" onClick={resetHomepage}><Undo2 size={17} /> Cancel</button>
              <button className="btn-primary px-4 py-2" type="submit" data-view="website"><Save size={17} /> Save & View Website</button>
            </div>
          </div>
        </form>
      </section>
    );
  }

  return (
    <section>
      <h1 className="font-display text-4xl font-bold">{title}</h1>
      {isSeoEditor && (
        <div className="mt-6 rounded-[2rem] border border-emerald-100 bg-emerald-50/60 p-5 shadow-glass">
          <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-clinic-ink"><Sparkles className="text-clinic-emerald" size={22} /> AI SEO Helper</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Generate meta title, description, keywords, and FAQ ideas for the SEO Manager. Review and place the text into the fields below.</p>
          <button className="btn-secondary mt-4 px-4 py-2" type="button" onClick={generateSeoDraft} disabled={aiBusy === 'seoMeta'}>{aiBusy === 'seoMeta' ? 'Creating...' : 'Generate SEO Draft'}</button>
          {aiDraft && <pre className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap rounded-2xl bg-white p-4 text-sm leading-6 text-slate-700">{aiDraft}</pre>}
        </div>
      )}
      <form key={`${collectionName}-${documentId}-${Object.keys(data).length}`} onSubmit={handleSubmit} className="mt-6 grid gap-4 rounded-[2rem] bg-white p-6 shadow-glass lg:grid-cols-2">
        {fields.map((rawField) => {
          const [field, type] = rawField.split(':');
          const isTextarea = type === 'textarea';
          return (
            <label className={`font-semibold ${isTextarea ? 'lg:col-span-2' : ''}`} key={field}>
              {labelFor(field)}
              {isTextarea ? (
                <textarea className="admin-input mt-2 min-h-28" name={field} defaultValue={data[field] || ''} />
              ) : (
                <input className="admin-input mt-2" name={field} defaultValue={data[field] || ''} placeholder={field.toLowerCase().includes('image') || field.toLowerCase().includes('photo') ? 'Paste Cloudinary, GitHub, or public image URL' : ''} />
              )}
            </label>
          );
        })}
        <button className="btn-primary lg:col-span-2" type="submit">Save Settings</button>
        {status && <p className="font-semibold text-clinic-emerald">{status}</p>}
      </form>
    </section>
  );
}
