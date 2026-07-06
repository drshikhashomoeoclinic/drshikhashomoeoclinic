import { useEffect, useMemo, useState } from 'react';
import { homeSettings, seoSettings, siteSettings } from '../../data/fallback.js';
import { getDocument, saveDocument } from '../../services/firestore.js';

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
    'treatmentsTitle', 'treatmentsText:textarea', 'reviewsTitle', 'reviewsText:textarea',
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
    feature3Text: feature3?.text || ''
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

export default function AdminSettings({ collectionName, documentId, title }) {
  const [data, setData] = useState({});
  const [status, setStatus] = useState('');
  const fields = useMemo(() => fieldConfig(collectionName, documentId), [collectionName, documentId]);

  useEffect(() => {
    const fallback = defaultData(collectionName, documentId);
    getDocument(collectionName, documentId, fallback).then((document) => setData({ ...fallback, ...document }));
  }, [collectionName, documentId]);

  async function handleSubmit(event) {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget));
    try {
      await saveDocument(collectionName, documentId, payload);
      setData(payload);
      setStatus('Settings saved.');
    } catch (error) {
      setStatus(error.message);
    }
  }

  return (
    <section>
      <h1 className="font-display text-4xl font-bold">{title}</h1>
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
