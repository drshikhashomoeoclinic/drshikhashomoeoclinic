import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { gallery, posts, reviews, services, siteSettings } from '../data/fallback.js';
import { getDocument, listDocs } from '../services/firestore.js';

const ClinicContext = createContext(null);

export function ClinicProvider({ children }) {
  const [state, setState] = useState({ site: siteSettings, services, posts, reviews, gallery, loading: true });

  useEffect(() => {
    let mounted = true;
    Promise.all([
      getDocument('settings', 'site', siteSettings),
      listDocs('services', services),
      listDocs('posts', posts),
      listDocs('reviews', reviews),
      listDocs('gallery', gallery)
    ]).then(([site, nextServices, nextPosts, nextReviews, nextGallery]) => {
      if (mounted) setState({ site: { ...siteSettings, ...site }, services: nextServices, posts: nextPosts, reviews: nextReviews, gallery: nextGallery, loading: false });
    }).catch(() => setState((current) => ({ ...current, loading: false })));
    return () => { mounted = false; };
  }, []);

  const value = useMemo(() => state, [state]);
  return <ClinicContext.Provider value={value}>{children}</ClinicContext.Provider>;
}

export function useClinic() {
  return useContext(ClinicContext);
}
