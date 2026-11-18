import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  loadSeoConfig,
  resolvePageSeo,
  buildLocalBusinessJsonLd,
  SEO_UPDATED_EVENT,
} from '../utils/seoStorage';

function upsertMeta(attrName, attrValue, content) {
  let tag = document.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!content) {
    if (tag && tag.dataset.seoManaged === 'true') {
      tag.remove();
    }
    return;
  }
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attrName, attrValue);
    tag.dataset.seoManaged = 'true';
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function upsertLink(rel, href) {
  let link = document.querySelector(`link[rel="${rel}"]`);
  if (!href) {
    if (link && link.dataset.seoManaged === 'true') {
      link.remove();
    }
    return;
  }
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    link.dataset.seoManaged = 'true';
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

function upsertJsonLd(id, data) {
  let script = document.getElementById(id);
  if (!data) {
    if (script) script.remove();
    return;
  }
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data, null, 2);
}

const SeoManager = () => {
  const location = useLocation();
  const [config, setConfig] = useState(() => loadSeoConfig());

  useEffect(() => {
    const handleUpdate = (event) => {
      setConfig(event.detail || loadSeoConfig());
    };
    window.addEventListener(SEO_UPDATED_EVENT, handleUpdate);
    return () => window.removeEventListener(SEO_UPDATED_EVENT, handleUpdate);
  }, []);

  // Apply SEO tags whenever route or config changes
  useEffect(() => {
    const pageSeo = resolvePageSeo(location.pathname, config);

    document.title = pageSeo.title;

    upsertMeta('name', 'description', pageSeo.description);
    upsertMeta('name', 'keywords', pageSeo.keywords);
    upsertMeta('name', 'robots', pageSeo.robots);
    upsertLink('canonical', pageSeo.canonical);

    // Open Graph
    upsertMeta('property', 'og:site_name', config.global.siteName);
    upsertMeta('property', 'og:title', pageSeo.ogTitle);
    upsertMeta('property', 'og:description', pageSeo.ogDescription);
    upsertMeta('property', 'og:type', pageSeo.ogType);
    upsertMeta('property', 'og:url', pageSeo.canonical);
    upsertMeta('property', 'og:image', pageSeo.ogImage);

    // Twitter Cards
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', pageSeo.ogTitle);
    upsertMeta('name', 'twitter:description', pageSeo.ogDescription);
    upsertMeta('name', 'twitter:image', pageSeo.ogImage);
    if (config.global.twitterHandle) {
      upsertMeta('name', 'twitter:site', config.global.twitterHandle);
    }

    // Site Verifications
    upsertMeta('name', 'google-site-verification', config.global.googleSiteVerification);
    upsertMeta('name', 'msvalidate.01', config.global.bingSiteVerification);

    // LocalBusiness JSON-LD Schema
    if (config.schema?.enabled && location.pathname !== '/seo-admin') {
      upsertJsonLd('gr-local-business-schema', buildLocalBusinessJsonLd(config));
    } else {
      upsertJsonLd('gr-local-business-schema', null);
    }
  }, [location.pathname, config]);

  // Scroll to top & push SPA page_view to existing GTM dataLayer on route change
  useEffect(() => {
    window.scrollTo(0, 0);
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'page_view',
      page_path: location.pathname + location.search + location.hash,
      page_title: document.title,
    });
  }, [location]);

  return null;
};

export default SeoManager;
