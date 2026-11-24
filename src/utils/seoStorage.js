import { brands } from '../data/products';
import { blogs } from '../data/blogs';

export function resolveFullAssetUrl(path, baseUrl) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const cleanBase = (baseUrl || '').replace(/\/+$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}

export function resolvePageSeo(pathname, config) {
  const cleanPath = pathname === '' ? '/' : pathname;
  const baseUrl = (config.global.baseUrl || '').replace(/\/+$/, '');

  // Exact static page match
  if (config.pages[cleanPath]) {
    const page = config.pages[cleanPath];
    return {
      title: page.title || config.global.siteName,
      description: page.description || '',
      keywords: page.keywords || '',
      robots: page.robots || config.global.defaultRobots,
      canonical:
        page.canonical ||
        (cleanPath === '/' ? `${baseUrl}/` : `${baseUrl}/#${cleanPath}`),
      ogTitle: page.ogTitle || page.title || config.global.siteName,
      ogDescription: page.ogDescription || page.description || '',
      ogImage: resolveFullAssetUrl(
        page.ogImage || config.global.defaultOgImage,
        baseUrl
      ),
      ogType: page.ogType || 'website',
    };
  }

  // Dynamic Brand Catalogue page (/products/:brandName)
  if (cleanPath.startsWith('/products/')) {
    const slug = decodeURIComponent(cleanPath.replace('/products/', '')).toLowerCase();
    const matchedBrand = brands.find((b) => b.name.toLowerCase() === slug);
    const brandName = matchedBrand ? matchedBrand.name : slug;
    const categories = matchedBrand
      ? matchedBrand.categories.join(', ')
      : 'Stationery';
    const override = config.brandOverrides?.[slug] || {};
    const tpl = config.brandTemplate;

    const applyTokens = (str = '') =>
      str
        .replaceAll('{brand}', brandName)
        .replaceAll('{categories}', categories);

    const title = override.title || applyTokens(tpl.titleTemplate);
    const description =
      override.description || applyTokens(tpl.descriptionTemplate);
    const keywords = override.keywords || applyTokens(tpl.keywordsTemplate);
    const ogImage = resolveFullAssetUrl(
      override.ogImage ||
        (matchedBrand ? matchedBrand.logo : config.global.defaultOgImage),
      baseUrl
    );

    return {
      title,
      description,
      keywords,
      robots: override.robots || tpl.robots || config.global.defaultRobots,
      canonical:
        override.canonical || `${baseUrl}/#/products/${encodeURIComponent(slug)}`,
      ogTitle: override.ogTitle || title,
      ogDescription: override.ogDescription || description,
      ogImage,
      ogType: 'website',
    };
  }

  // Dynamic Blog Post page (/blog/:slug)
  if (cleanPath.startsWith('/blog/')) {
    const slug = decodeURIComponent(cleanPath.replace('/blog/', '')).toLowerCase();
    const matchedBlog = blogs.find((b) => b.slug.toLowerCase() === slug);
    if (matchedBlog) {
      const title = `${matchedBlog.title} | ${config.global.siteName}`;
      const description = matchedBlog.excerpt;
      const keywords = matchedBlog.tags ? matchedBlog.tags.join(', ') : '';
      const canonical = `${baseUrl}/#/blog/${matchedBlog.slug}`;
      const ogImage = resolveFullAssetUrl(matchedBlog.image || config.global.defaultOgImage, baseUrl);

      return {
        title,
        description,
        keywords,
        robots: config.global.defaultRobots || 'index, follow',
        canonical,
        ogTitle: matchedBlog.title,
        ogDescription: description,
        ogImage,
        ogType: 'article',
      };
    }
  }

  // Fallback to Home SEO
  const home = config.pages['/'];
  return {
    title: home.title,
    description: home.description,
    keywords: home.keywords,
    robots: home.robots || config.global.defaultRobots,
    canonical: `${baseUrl}/`,
    ogTitle: home.ogTitle || home.title,
    ogDescription: home.ogDescription || home.description,
    ogImage: resolveFullAssetUrl(home.ogImage || config.global.defaultOgImage, baseUrl),
    ogType: 'website',
  };
}

export function buildLocalBusinessJsonLd(config) {
  const s = config.schema;
  const baseUrl = (config.global.baseUrl || '').replace(/\/+$/, '');
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': s.type || 'Store',
    name: s.name,
    description: s.description,
    url: s.url || `${baseUrl}/`,
    image: resolveFullAssetUrl(s.image || config.global.defaultOgImage, baseUrl),
    telephone: s.telephone,
    email: s.email,
    priceRange: s.priceRange,
    openingHours: s.openingHours,
    address: {
      '@type': 'PostalAddress',
      streetAddress: s.streetAddress,
      addressLocality: s.addressLocality,
      addressRegion: s.addressRegion,
      postalCode: s.postalCode,
      addressCountry: s.addressCountry,
    },
  };

  if (s.latitude && s.longitude) {
    jsonLd.geo = {
      '@type': 'GeoCoordinates',
      latitude: Number(s.latitude),
      longitude: Number(s.longitude),
    };
  }

  const validSocials = (s.sameAs || []).map((u) => u.trim()).filter(Boolean);
  if (validSocials.length > 0) {
    jsonLd.sameAs = validSocials;
  }

  return jsonLd;
}
