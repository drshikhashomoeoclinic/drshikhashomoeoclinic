export function slugify(value = '') {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function normalizeService(item = {}) {
  const title = item.title || item.name || 'Treatment';
  return {
    ...item,
    title,
    slug: item.slug || slugify(title),
    description: item.description || item.excerpt || item.text || '',
    category: item.category || 'Treatment',
    icon: item.icon || 'Leaf'
  };
}

export function normalizePost(item = {}) {
  const title = item.title || item.name || 'Blog post';
  return {
    ...item,
    title,
    slug: item.slug || slugify(title),
    date: item.date || item.createdAt?.toDate?.()?.toISOString?.() || new Date().toISOString(),
    excerpt: item.excerpt || item.description || item.text || '',
    description: item.description || item.excerpt || item.text || '',
    category: item.category || 'Health Notes',
    tags: Array.isArray(item.tags) ? item.tags : []
  };
}

export function normalizeReview(item = {}) {
  return {
    ...item,
    name: item.name || item.title || 'Patient',
    text: item.text || item.description || '',
    rating: Number(item.rating || 5)
  };
}

export function normalizeGalleryItem(item = {}) {
  return {
    ...item,
    title: item.title || item.name || 'Clinic photo',
    image: item.image || item.url || '',
    category: item.category || 'Clinic'
  };
}

export function sortByFreshness(items = []) {
  return [...items].sort((a, b) => {
    const aTime = a.createdAt?.toMillis?.() || Date.parse(a.date || '') || 0;
    const bTime = b.createdAt?.toMillis?.() || Date.parse(b.date || '') || 0;
    return bTime - aTime;
  });
}
