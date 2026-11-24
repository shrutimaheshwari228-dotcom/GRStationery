export const blogCategories = [
  "All",
  "School & College",
  "Office Stationery",
  "Buying Guides",
  "Art & Craft",
  "Jaipur Heritage"
];

export const blogs = [];

export function getBlogBySlug(slug) {
  if (!slug) return null;
  const clean = String(slug).toLowerCase().trim();
  return blogs.find((b) => b.slug.toLowerCase() === clean) || null;
}

export function getRelatedBlogs(currentSlug, limit = 3) {
  const current = getBlogBySlug(currentSlug);
  if (!current) return blogs.slice(0, limit);
  return blogs
    .filter((b) => b.slug !== current.slug)
    .sort((a, b) => {
      if (a.category === current.category && b.category !== current.category) return -1;
      if (b.category === current.category && a.category !== current.category) return 1;
      return 0;
    })
    .slice(0, limit);
}
