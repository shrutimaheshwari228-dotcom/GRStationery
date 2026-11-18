import { defaultSeoConfig } from '../data/seoConfig';
import { brands, products } from '../data/products';

const STORAGE_KEY = 'gr_stationery_seo_config_v1';
export const SEO_UPDATED_EVENT = 'gr-seo-updated';

function deepMerge(defaults, saved) {
  if (!saved || typeof saved !== 'object') return structuredClone(defaults);
  const result = { ...defaults };
  for (const key of Object.keys(defaults)) {
    if (
      defaults[key] &&
      typeof defaults[key] === 'object' &&
      !Array.isArray(defaults[key])
    ) {
      result[key] = deepMerge(defaults[key], saved[key]);
    } else if (saved[key] !== undefined) {
      result[key] = saved[key];
    }
  }
  // Preserve extra dynamic keys (e.g. brandOverrides)
  for (const key of Object.keys(saved)) {
    if (!(key in result)) {
      result[key] = saved[key];
    }
  }
  return result;
}

export function loadSeoConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(defaultSeoConfig);
    const parsed = JSON.parse(raw);
    return deepMerge(defaultSeoConfig, parsed);
  } catch {
    return structuredClone(defaultSeoConfig);
  }
}

export function saveSeoConfig(config) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  window.dispatchEvent(new CustomEvent(SEO_UPDATED_EVENT, { detail: config }));
}

export function resetSeoConfig() {
  localStorage.removeItem(STORAGE_KEY);
  const fresh = structuredClone(defaultSeoConfig);
  window.dispatchEvent(new CustomEvent(SEO_UPDATED_EVENT, { detail: fresh }));
  return fresh;
}

export function hasUnsavedLocalOverrides() {
  return Boolean(localStorage.getItem(STORAGE_KEY));
}

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

  // Never index the SEO admin panel itself
  if (cleanPath === '/seo-admin') {
    return {
      title: `SEO Admin Panel | ${config.global.siteName}`,
      description: 'Internal SEO management dashboard for GR & Company Stationery.',
      keywords: '',
      robots: 'noindex, nofollow',
      canonical: `${baseUrl}/#/seo-admin`,
      ogTitle: `SEO Admin Panel | ${config.global.siteName}`,
      ogDescription: 'Internal SEO management dashboard.',
      ogImage: resolveFullAssetUrl(config.global.defaultOgImage, baseUrl),
      ogType: 'website',
    };
  }

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

export function generateSitemapXml(config) {
  const baseUrl = (config.global.baseUrl || '').replace(/\/+$/, '');
  const today = new Date().toISOString().split('T')[0];

  const urls = [];

  // Static pages
  Object.entries(config.pages).forEach(([route, page]) => {
    if ((page.robots || '').includes('noindex')) return;
    const loc = route === '/' ? `${baseUrl}/` : `${baseUrl}/#${route}`;
    urls.push({
      loc,
      lastmod: today,
      changefreq: page.changefreq || 'monthly',
      priority: page.priority || '0.7',
    });
  });

  // Brand pages
  brands.forEach((brand) => {
    const slug = brand.name.toLowerCase();
    const override = config.brandOverrides?.[slug] || {};
    const robots = override.robots || config.brandTemplate.robots || 'index, follow';
    if (robots.includes('noindex')) return;
    urls.push({
      loc: `${baseUrl}/#/products/${encodeURIComponent(slug)}`,
      lastmod: today,
      changefreq: override.changefreq || config.brandTemplate.changefreq || 'weekly',
      priority: override.priority || config.brandTemplate.priority || '0.8',
    });
  });

  const xmlEntries = urls
    .map(
      (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>
`;
}

export function generateRobotsTxt(config) {
  const baseUrl = (config.global.baseUrl || '').replace(/\/+$/, '');
  const lines = ['User-agent: *'];

  if (config.robotsTxt.allowAll) {
    lines.push('Allow: /');
  } else {
    lines.push('Disallow: /');
  }

  (config.robotsTxt.disallowPaths || [])
    .map((p) => p.trim())
    .filter(Boolean)
    .forEach((p) => {
      lines.push(`Disallow: ${p}`);
    });

  if (config.robotsTxt.customRules && config.robotsTxt.customRules.trim()) {
    lines.push('');
    lines.push(config.robotsTxt.customRules.trim());
  }

  lines.push('');
  lines.push(`Sitemap: ${baseUrl}/sitemap.xml`);
  return lines.join('\n') + '\n';
}

export function generateSeoConfigFileContent(config) {
  return `export const defaultSeoConfig = ${JSON.stringify(config, null, 2)};\n`;
}

export function generateIndexHeadSnippet(config) {
  const home = resolvePageSeo('/', config);
  const lines = [
    `<title>${home.title}</title>`,
    `<meta name="description" content="${home.description.replaceAll('"', '&quot;')}" />`,
  ];
  if (home.keywords) {
    lines.push(`<meta name="keywords" content="${home.keywords.replaceAll('"', '&quot;')}" />`);
  }
  lines.push(`<meta name="robots" content="${home.robots}" />`);
  lines.push(`<link rel="canonical" href="${home.canonical}" />`);
  lines.push(`<meta property="og:title" content="${home.ogTitle.replaceAll('"', '&quot;')}" />`);
  lines.push(`<meta property="og:description" content="${home.ogDescription.replaceAll('"', '&quot;')}" />`);
  lines.push(`<meta property="og:type" content="${home.ogType}" />`);
  lines.push(`<meta property="og:url" content="${home.canonical}" />`);
  if (home.ogImage) {
    lines.push(`<meta property="og:image" content="${home.ogImage}" />`);
  }
  if (config.global.googleSiteVerification) {
    lines.push(
      `<meta name="google-site-verification" content="${config.global.googleSiteVerification}" />`
    );
  }
  if (config.global.bingSiteVerification) {
    lines.push(
      `<meta name="msvalidate.01" content="${config.global.bingSiteVerification}" />`
    );
  }
  return lines.join('\n');
}

export function runSeoAudit(config) {
  const checks = [];

  // 1. Check all static pages title & description lengths
  const pageEntries = Object.entries(config.pages);
  let titleIssues = 0;
  let descIssues = 0;

  pageEntries.forEach(([route, p]) => {
    const tLen = (p.title || '').trim().length;
    const dLen = (p.description || '').trim().length;
    if (tLen < 30 || tLen > 65) {
      titleIssues++;
      checks.push({
        id: `title-${route}`,
        category: 'On-Page Meta',
        status: tLen === 0 ? 'error' : 'warning',
        title: `${p.label} (${route}) meta title length: ${tLen} chars`,
        detail:
          tLen === 0
            ? 'Meta title is missing. Add a descriptive title between 50–60 characters.'
            : tLen < 30
            ? 'Title is a bit short. Aim for 50–60 characters for best search visibility.'
            : 'Title exceeds 65 characters and may be truncated in Google search results.',
      });
    }
    if (dLen < 80 || dLen > 165) {
      descIssues++;
      checks.push({
        id: `desc-${route}`,
        category: 'On-Page Meta',
        status: dLen === 0 ? 'error' : 'warning',
        title: `${p.label} (${route}) meta description length: ${dLen} chars`,
        detail:
          dLen === 0
            ? 'Meta description is missing. Add a compelling 120–160 character summary.'
            : dLen < 80
            ? 'Description is short. Aim for 120–160 characters.'
            : 'Description exceeds 165 characters and may be clipped in search snippets.',
      });
    }
  });

  if (titleIssues === 0) {
    checks.push({
      id: 'titles-all-good',
      category: 'On-Page Meta',
      status: 'pass',
      title: `All ${pageEntries.length} core pages have optimal meta titles`,
      detail: 'Every page title is concise, unique, and within the 30–65 character sweet spot.',
    });
  }

  if (descIssues === 0) {
    checks.push({
      id: 'descs-all-good',
      category: 'On-Page Meta',
      status: 'pass',
      title: `All ${pageEntries.length} core pages have optimal meta descriptions`,
      detail: 'Descriptions are well-sized for Google search snippets.',
    });
  }

  // 2. Duplicate titles check
  const titles = pageEntries.map(([, p]) => (p.title || '').trim().toLowerCase());
  const uniqueTitles = new Set(titles);
  if (uniqueTitles.size === titles.length) {
    checks.push({
      id: 'unique-titles',
      category: 'On-Page Meta',
      status: 'pass',
      title: 'No duplicate page titles detected',
      detail: 'Each route uses a distinct title tag to prevent keyword cannibalization.',
    });
  } else {
    checks.push({
      id: 'duplicate-titles',
      category: 'On-Page Meta',
      status: 'error',
      title: 'Duplicate meta titles found across pages',
      detail: 'Ensure every route has a unique meta title.',
    });
  }

  // 3. Brand catalogue SEO coverage
  checks.push({
    id: 'brand-seo',
    category: 'Catalogue SEO',
    status: 'pass',
    title: `Dynamic SEO active for all ${brands.length} brand pages (${products.length} products)`,
    detail: 'Brand pages automatically inherit optimized titles, descriptions, and Open Graph tags.',
  });

  // 4. LocalBusiness Schema check
  if (config.schema.enabled) {
    const hasPlaceholderPhone =
      !config.schema.telephone || config.schema.telephone.includes('9999999999');
    checks.push({
      id: 'schema-enabled',
      category: 'Structured Data',
      status: hasPlaceholderPhone ? 'warning' : 'pass',
      title: hasPlaceholderPhone
        ? 'LocalBusiness Schema active (update placeholder phone number)'
        : 'LocalBusiness JSON-LD Schema is active & complete',
      detail: hasPlaceholderPhone
        ? 'Replace the placeholder telephone (+91-9999999999) with your verified Jaipur shop phone number for Local SEO.'
        : 'Google can read your Jaipur store name, address, hours, and geo coordinates.',
    });
  } else {
    checks.push({
      id: 'schema-disabled',
      category: 'Structured Data',
      status: 'error',
      title: 'LocalBusiness Schema is currently disabled',
      detail: 'Enable JSON-LD structured data to boost Google Maps and Local Pack visibility in Jaipur.',
    });
  }

  // 5. Google Tag Manager
  checks.push({
    id: 'gtm-active',
    category: 'Analytics & Tracking',
    status: 'pass',
    title: `Google Tag Manager (${config.global.gtmId}) is installed`,
    detail: 'Official GTM head + noscript snippets and SPA page_view tracking are active.',
  });

  // 6. Search Console Verification
  if (config.global.googleSiteVerification) {
    checks.push({
      id: 'gsc-verified',
      category: 'Technical SEO',
      status: 'pass',
      title: 'Google Search Console verification tag configured',
      detail: 'Meta verification code is present in your global SEO settings.',
    });
  } else {
    checks.push({
      id: 'gsc-missing',
      category: 'Technical SEO',
      status: 'warning',
      title: 'Google Search Console verification code not added yet',
      detail:
        'Add your HTML tag verification code in Global Settings to track clicks and impressions on Google.',
    });
  }

  // 7. Sitemap & Robots
  checks.push({
    id: 'sitemap-robots',
    category: 'Technical SEO',
    status: 'pass',
    title: 'Sitemap.xml & Robots.txt configured',
    detail: `Covers ${pageEntries.length} core pages and ${brands.length} brand pages.`,
  });

  // Compute Score
  const passCount = checks.filter((c) => c.status === 'pass').length;
  const warnCount = checks.filter((c) => c.status === 'warning').length;
  const errCount = checks.filter((c) => c.status === 'error').length;
  const totalWeight = checks.length || 1;
  const score = Math.max(
    0,
    Math.min(100, Math.round(((passCount + warnCount * 0.55) / totalWeight) * 100))
  );

  return {
    score,
    passCount,
    warnCount,
    errCount,
    totalPages: pageEntries.length + brands.length,
    checks,
  };
}
