import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { gallery, posts, reviews, services, siteSettings } from '../data/fallback.js';
import { db, firebaseEnabled } from '../lib/firebase.js';
import { normalizeGalleryItem, normalizePost, normalizeReview, normalizeService, sortByFreshness } from '../lib/content.js';

const ClinicContext = createContext(null);
const fallbackHome = {
  eyebrow: 'Premium Homoeopathic Clinic',
  heroTitle: 'Healing naturally, caring personally.',
  heroSubtitle: '',
  heroImage: '',
  highlights: ['Personalised care', 'Online consults', 'Follow-up support'],
  featureCards: [
    { title: 'Detailed Case Taking', text: 'Designed for clarity, comfort, and responsible supportive care.' },
    { title: 'Gentle Family Care', text: 'Designed for clarity, comfort, and responsible supportive care.' },
    { title: 'Evidence-Aware Guidance', text: 'Designed for clarity, comfort, and responsible supportive care.' }
  ],
  treatmentsTitle: 'Conditions We Treat',
  treatmentsText: 'A focused set of common acute and chronic concerns with personalised consultation.',
  reviewsTitle: 'Trusted by local families',
  reviewsText: 'Real reviews can be managed from the admin dashboard and connected to Google Reviews.',
  blogTitle: 'Latest from the clinic'
};

const initialState = {
  site: siteSettings,
  doctor: siteSettings,
  home: fallbackHome,
  seo: {},
  services: services.map(normalizeService),
  posts: posts.map(normalizePost),
  reviews: reviews.map(normalizeReview),
  gallery: gallery.map(normalizeGalleryItem),
  loading: true
};

function docsFromSnapshot(snapshot) {
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

function normalizeHome(home = {}) {
  const heroImage = home.heroImage || home.heroImageUrl || home.imageUrl || home.image || '';
  const highlights = Array.isArray(home.highlights)
    ? home.highlights
    : String(home.highlights || '').split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean);
  const featureCards = [
    { title: home.feature1Title, text: home.feature1Text },
    { title: home.feature2Title, text: home.feature2Text },
    { title: home.feature3Title, text: home.feature3Text }
  ].filter((item) => item.title || item.text);

  return {
    ...fallbackHome,
    ...home,
    heroImage,
    highlights: highlights.length ? highlights : fallbackHome.highlights,
    featureCards: featureCards.length ? featureCards : fallbackHome.featureCards
  };
}

export function ClinicProvider({ children }) {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    if (!firebaseEnabled) {
      setState((current) => ({ ...current, loading: false }));
      return undefined;
    }

    const unsubscribers = [
      onSnapshot(doc(db, 'settings', 'site'), (snapshot) => {
        const site = snapshot.exists() ? snapshot.data() : {};
        setState((current) => ({ ...current, site: { ...siteSettings, ...site }, loading: false }));
      }, () => setState((current) => ({ ...current, loading: false }))),
      onSnapshot(doc(db, 'settings', 'doctor'), (snapshot) => {
        const doctor = snapshot.exists() ? snapshot.data() : {};
        setState((current) => ({ ...current, doctor: { ...siteSettings, ...current.site, ...doctor }, loading: false }));
      }, () => setState((current) => ({ ...current, loading: false }))),
      onSnapshot(doc(db, 'pages', 'home'), (snapshot) => {
        const home = snapshot.exists() ? snapshot.data() : {};
        setState((current) => ({ ...current, home: normalizeHome(home), loading: false }));
      }, () => setState((current) => ({ ...current, loading: false }))),
      onSnapshot(doc(db, 'seo', 'settings'), (snapshot) => {
        const seo = snapshot.exists() ? snapshot.data() : {};
        setState((current) => ({ ...current, seo: { ...current.seo, ...seo }, loading: false }));
      }, () => setState((current) => ({ ...current, loading: false }))),
      onSnapshot(doc(db, 'settings', 'seo'), (snapshot) => {
        const seo = snapshot.exists() ? snapshot.data() : {};
        setState((current) => ({ ...current, seo: { ...seo, ...current.seo }, loading: false }));
      }, () => setState((current) => ({ ...current, loading: false }))),
      onSnapshot(collection(db, 'services'), (snapshot) => {
        const nextServices = docsFromSnapshot(snapshot).map(normalizeService);
        setState((current) => ({ ...current, services: nextServices.length ? nextServices : services.map(normalizeService), loading: false }));
      }, () => setState((current) => ({ ...current, loading: false }))),
      onSnapshot(collection(db, 'posts'), (snapshot) => {
        const nextPosts = sortByFreshness(docsFromSnapshot(snapshot).map(normalizePost));
        setState((current) => ({ ...current, posts: nextPosts.length ? nextPosts : posts.map(normalizePost), loading: false }));
      }, () => setState((current) => ({ ...current, loading: false }))),
      onSnapshot(collection(db, 'gallery'), (snapshot) => {
        const nextGallery = docsFromSnapshot(snapshot).map(normalizeGalleryItem);
        setState((current) => ({ ...current, gallery: nextGallery.length ? nextGallery : gallery.map(normalizeGalleryItem), loading: false }));
      }, () => setState((current) => ({ ...current, loading: false }))),
      onSnapshot(collection(db, 'reviews'), (snapshot) => {
        const nextReviews = docsFromSnapshot(snapshot).map(normalizeReview);
        setState((current) => ({ ...current, reviews: nextReviews.length ? nextReviews : reviews.map(normalizeReview), loading: false }));
      }, () => setState((current) => ({ ...current, loading: false })))
    ];

    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }, []);

  const value = useMemo(() => state, [state]);
  return <ClinicContext.Provider value={value}>{children}</ClinicContext.Provider>;
}

export function useClinic() {
  return useContext(ClinicContext);
}
