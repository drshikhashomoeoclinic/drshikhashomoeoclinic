import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { homeSettings, seoSettings, siteSettings } from '../src/data/fallback.js';

function loadEnvFile(fileName) {
  const path = resolve(process.cwd(), fileName);
  if (!existsSync(path)) return;

  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (!match || match[1].startsWith('#')) continue;
    const [, key, rawValue = ''] = match;
    if (process.env[key]) continue;
    process.env[key] = rawValue.replace(/^['"]|['"]$/g, '');
  }
}

loadEnvFile('.env.local');
loadEnvFile('.env');

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  throw new Error('Missing Firebase environment values. Add VITE_FIREBASE_API_KEY and VITE_FIREBASE_PROJECT_ID before seeding.');
}

const [feature1, feature2, feature3] = homeSettings.featureCards;
const homeAdminSettings = {
  ...homeSettings,
  highlights: homeSettings.highlights.join('\n'),
  feature1Title: feature1?.title || '',
  feature1Text: feature1?.text || '',
  feature2Title: feature2?.title || '',
  feature2Text: feature2?.text || '',
  feature3Title: feature3?.title || '',
  feature3Text: feature3?.text || ''
};
delete homeAdminSettings.featureCards;

const doctorSettings = {
  doctorName: siteSettings.doctorName,
  qualification: siteSettings.qualification,
  experience: siteSettings.experience,
  patients: siteSettings.patients,
  profileTitle: 'Care built on listening, follow-up, and trust.',
  about: `${siteSettings.doctorName} is a ${siteSettings.qualification} at ${siteSettings.clinicName}, ${siteSettings.location}.`
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const updatedAt = serverTimestamp();

await Promise.all([
  setDoc(doc(db, 'settings', 'site'), { ...siteSettings, updatedAt }, { merge: true }),
  setDoc(doc(db, 'settings', 'doctor'), { ...doctorSettings, updatedAt }, { merge: true }),
  setDoc(doc(db, 'pages', 'home'), { ...homeAdminSettings, updatedAt }, { merge: true }),
  setDoc(doc(db, 'seo', 'settings'), { ...seoSettings, updatedAt }, { merge: true })
]);

console.log('Seeded clinic settings, doctor profile, homepage, and SEO documents.');
