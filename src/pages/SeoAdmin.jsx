import React, { useState, useMemo, useRef } from 'react';
import {
  ShieldCheck,
  Search,
  Globe,
  FileCode2,
  MapPin,
  Settings,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Save,
  RotateCcw,
  Download,
  Upload,
  Copy,
  Check,
  Lock,
  Unlock,
  Monitor,
  Smartphone,
  Share2,
  ExternalLink,
  Sparkles,
  Tag,
} from 'lucide-react';
import { brands } from '../data/products';
import { getAssetUrl } from '../utils/assetUrl';
import {
  loadSeoConfig,
  saveSeoConfig,
  resetSeoConfig,
  hasUnsavedLocalOverrides,
  resolvePageSeo,
  buildLocalBusinessJsonLd,
  generateSitemapXml,
  generateRobotsTxt,
  generateSeoConfigFileContent,
  generateIndexHeadSnippet,
  runSeoAudit,
} from '../utils/seoStorage';

const AUTH_SESSION_KEY = 'gr_seo_admin_unlocked';

const TABS = [
  { id: 'audit', label: 'SEO Audit', icon: ShieldCheck },
  { id: 'pages', label: 'Pages & SERP', icon: Search },
  { id: 'schema', label: 'Local Schema', icon: MapPin },
  { id: 'sitemap', label: 'Sitemap & Robots', icon: FileCode2 },
  { id: 'settings', label: 'Settings & Publish', icon: Settings },
];

const ROBOTS_OPTIONS = [
  'index, follow',
  'noindex, follow',
  'index, nofollow',
  'noindex, nofollow',
];

const CHANGEFREQ_OPTIONS = ['daily', 'weekly', 'monthly', 'yearly'];
const PRIORITY_OPTIONS = ['1.0', '0.9', '0.8', '0.7', '0.6', '0.5'];

function downloadTextFile(filename, content, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const LengthMeter = ({ value = '', min, max, label }) => {
  const len = value.trim().length;
  const pct = Math.min(100, Math.round((len / (max + 15)) * 100));
  let statusColor = 'bg-emerald-500';
  let textColor = 'text-emerald-400';
  let hint = 'Optimal';

  if (len === 0) {
    statusColor = 'bg-red-500';
    textColor = 'text-red-400';
    hint = 'Missing';
  } else if (len < min) {
    statusColor = 'bg-amber-500';
    textColor = 'text-amber-400';
    hint = `Short (aim for ${min}–${max})`;
  } else if (len > max) {
    statusColor = 'bg-red-500';
    textColor = 'text-red-400';
    hint = `Too long (may truncate > ${max})`;
  }

  return (
    <div className="mt-1.5">
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-textSecondary/70">{label}</span>
        <span className={`${textColor} font-medium`}>
          {len} chars · {hint}
        </span>
      </div>
      <div className="w-full h-1.5 bg-background rounded-full overflow-hidden border border-border">
        <div
          className={`h-full transition-all duration-300 ${statusColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

const SeoAdmin = () => {
  const [config, setConfig] = useState(() => loadSeoConfig());
  const [isUnlocked, setIsUnlocked] = useState(
    () => sessionStorage.getItem(AUTH_SESSION_KEY) === 'true'
  );
  const [passcodeInput, setPasscodeInput] = useState('');
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState('audit');
  const [selectedTarget, setSelectedTarget] = useState({ type: 'page', key: '/' });
  const [serpMode, setSerpMode] = useState('desktop');
  const [toast, setToast] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [hasOverrides, setHasOverrides] = useState(() => hasUnsavedLocalOverrides());
  const [newSocialUrl, setNewSocialUrl] = useState('');
  const [newDisallowPath, setNewDisallowPath] = useState('');
  const importInputRef = useRef(null);

  const showToast = (message, tone = 'success') => {
    setToast({ message, tone });
    setTimeout(() => setToast(null), 3500);
  };

  const handleCopy = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
      showToast('Copied to clipboard');
    } catch {
      showToast('Could not access clipboard', 'error');
    }
  };

  const handleUnlock = (e) => {
    e.preventDefault();
    const expected = config.global.adminPasscode || 'gr1234';
    if (passcodeInput.trim() === expected) {
      sessionStorage.setItem(AUTH_SESSION_KEY, 'true');
      setIsUnlocked(true);
      setAuthError('');
      setPasscodeInput('');
    } else {
      setAuthError('Incorrect passcode. Please try again.');
    }
  };

  const handleLock = () => {
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    setIsUnlocked(false);
  };

  const updateConfig = (updater) => {
    setConfig((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      return next;
    });
    setIsDirty(true);
  };

  const handleSave = () => {
    saveSeoConfig(config);
    setIsDirty(false);
    setHasOverrides(true);
    showToast('SEO settings saved & applied live!');
  };

  const handleReset = () => {
    if (
      window.confirm(
        'Reset all SEO settings back to the project defaults? Any unsaved local edits will be cleared.'
      )
    ) {
      const fresh = resetSeoConfig();
      setConfig(fresh);
      setIsDirty(false);
      setHasOverrides(false);
      showToast('SEO settings reset to defaults');
    }
  };

  const handleImportJson = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (!parsed.global || !parsed.pages) {
          throw new Error('Invalid SEO config structure');
        }
        saveSeoConfig(parsed);
        setConfig(loadSeoConfig());
        setIsDirty(false);
        setHasOverrides(true);
        showToast('SEO configuration imported successfully!');
      } catch {
        showToast('Invalid JSON file. Please select a valid SEO backup.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const audit = useMemo(() => runSeoAudit(config), [config]);
  const jsonLdPreview = useMemo(
    () => JSON.stringify(buildLocalBusinessJsonLd(config), null, 2),
    [config]
  );
  const sitemapPreview = useMemo(() => generateSitemapXml(config), [config]);
  const robotsPreview = useMemo(() => generateRobotsTxt(config), [config]);
  const headSnippet = useMemo(() => generateIndexHeadSnippet(config), [config]);

  // Resolve current SERP preview data
  const currentPreviewSeo = useMemo(() => {
    if (selectedTarget.type === 'page') {
      return resolvePageSeo(selectedTarget.key, config);
    }
    if (selectedTarget.type === 'brand') {
      return resolvePageSeo(`/products/${selectedTarget.key}`, config);
    }
    // brand-template preview using first brand
    return resolvePageSeo('/products/nataraj', config);
  }, [selectedTarget, config]);

  // Lock screen
  if (!isUnlocked) {
    return (
      <div className="min-h-[80vh] bg-background flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-surface border border-border rounded-xl p-8 shadow-2xl">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 rounded-t-jaipur bg-primary/90 border border-accent/40 flex items-center justify-center text-textPrimary mb-4">
              <Lock size={24} />
            </div>
            <h1 className="text-2xl font-serif font-bold text-textPrimary mb-2">
              SEO Admin Panel
            </h1>
            <p className="text-sm text-textSecondary">
              Enter your admin passcode to manage meta tags, schema, sitemaps, and SEO audits for{' '}
              <span className="text-textPrimary font-medium">GR & Company Stationery</span>.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-textSecondary mb-2">
                Admin Passcode
              </label>
              <input
                type="password"
                value={passcodeInput}
                onChange={(e) => setPasscodeInput(e.target.value)}
                placeholder="Enter passcode (default: gr1234)"
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-textPrimary focus:outline-none focus:border-accent"
                autoFocus
              />
              {authError && (
                <p className="text-red-400 text-xs mt-2">{authError}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full btn-primary flex items-center justify-center gap-2 py-3"
            >
              <Unlock size={16} /> Unlock SEO Dashboard
            </button>
          </form>

          <p className="text-[11px] text-textSecondary/60 text-center mt-6">
            You can change your passcode anytime inside Settings & Publish.
          </p>
        </div>
      </div>
    );
  }

  // Helper to edit page or brand override fields
  const getPageFormValues = () => {
    if (selectedTarget.type === 'page') {
      return config.pages[selectedTarget.key] || {};
    }
    if (selectedTarget.type === 'brand') {
      return config.brandOverrides?.[selectedTarget.key] || {};
    }
    return config.brandTemplate;
  };

  const updateTargetField = (field, value) => {
    if (selectedTarget.type === 'page') {
      updateConfig((prev) => ({
        ...prev,
        pages: {
          ...prev.pages,
          [selectedTarget.key]: {
            ...prev.pages[selectedTarget.key],
            [field]: value,
          },
        },
      }));
    } else if (selectedTarget.type === 'brand') {
      updateConfig((prev) => ({
        ...prev,
        brandOverrides: {
          ...prev.brandOverrides,
          [selectedTarget.key]: {
            ...(prev.brandOverrides?.[selectedTarget.key] || {}),
            [field]: value,
          },
        },
      }));
    } else if (selectedTarget.type === 'brandTemplate') {
      updateConfig((prev) => ({
        ...prev,
        brandTemplate: {
          ...prev.brandTemplate,
          [field]: value,
        },
      }));
    }
  };

  const clearBrandOverride = (slug) => {
    updateConfig((prev) => {
      const nextOverrides = { ...(prev.brandOverrides || {}) };
      delete nextOverrides[slug];
      return { ...prev, brandOverrides: nextOverrides };
    });
    showToast('Brand override cleared — using dynamic template');
  };

  const formValues = getPageFormValues();

  return (
    <div className="min-h-screen bg-background text-textPrimary pb-20">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-20 right-4 z-50 px-5 py-3 rounded-lg border shadow-xl flex items-center gap-2.5 text-sm font-medium transition-all ${
            toast.tone === 'error'
              ? 'bg-red-950/95 border-red-700 text-red-200'
              : 'bg-surface border-accent text-textPrimary'
          }`}
        >
          <CheckCircle2
            size={16}
            className={toast.tone === 'error' ? 'text-red-400' : 'text-emerald-400'}
          />
          {toast.message}
        </div>
      )}

      {/* Top Admin Bar */}
      <div className="bg-surface border-b border-border sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-t-jaipur bg-primary border border-accent/40 flex items-center justify-center text-textPrimary">
              <Globe size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl font-serif font-bold text-textPrimary">
                  SEO Admin Panel
                </h1>
                {isDirty ? (
                  <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    Unsaved Changes
                  </span>
                ) : hasOverrides ? (
                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    Live Custom SEO Active
                  </span>
                ) : (
                  <span className="text-[11px] px-2 py-0.5 rounded bg-background text-textSecondary border border-border">
                    Default Config
                  </span>
                )}
              </div>
              <p className="text-xs text-textSecondary">
                Manage meta tags, SERP previews, Jaipur Local Schema, sitemaps, and search indexing.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleSave}
              className="btn-primary flex items-center gap-2 text-sm py-2 px-4"
            >
              <Save size={15} /> Save & Apply Live
            </button>
            <button
              onClick={handleReset}
              className="btn-secondary flex items-center gap-2 text-sm py-2 px-3"
              title="Reset to defaults"
            >
              <RotateCcw size={15} /> Reset
            </button>
            <button
              onClick={handleLock}
              className="px-3 py-2 rounded border border-border text-textSecondary hover:text-textPrimary hover:border-accent/50 text-sm flex items-center gap-1.5 transition-colors"
              title="Lock Admin Panel"
            >
              <Lock size={14} /> Lock
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  active
                    ? 'border-accent text-textPrimary'
                    : 'border-transparent text-textSecondary hover:text-textPrimary'
                }`}
              >
                <Icon size={16} className={active ? 'text-accent' : ''} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* ================= TAB 1: AUDIT DASHBOARD ================= */}
        {activeTab === 'audit' && (
          <div className="space-y-8">
            {/* Top Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              {/* Score Card */}
              <div className="bg-surface border border-border rounded-xl p-6 flex items-center gap-5">
                <div className="relative w-20 h-20 flex-shrink-0">
                  <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#2A2A2A"
                      strokeWidth="3.2"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={
                        audit.score >= 85
                          ? '#10b981'
                          : audit.score >= 65
                          ? '#f59e0b'
                          : '#ef4444'
                      }
                      strokeWidth="3.2"
                      strokeDasharray={`${audit.score}, 100`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-serif font-bold text-xl">
                    {audit.score}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-textSecondary">
                    SEO Health
                  </div>
                  <div className="text-lg font-semibold text-textPrimary mt-0.5">
                    {audit.score >= 85
                      ? 'Strong'
                      : audit.score >= 65
                      ? 'Good'
                      : 'Needs Work'}
                  </div>
                  <div className="text-xs text-textSecondary mt-1">
                    {audit.passCount} passed · {audit.warnCount} warnings
                  </div>
                </div>
              </div>

              <div className="bg-surface border border-border rounded-xl p-6">
                <div className="text-xs uppercase tracking-wider text-textSecondary mb-2">
                  Managed URLs
                </div>
                <div className="text-3xl font-serif font-bold text-textPrimary">
                  {audit.totalPages}
                </div>
                <p className="text-xs text-textSecondary mt-2">
                  {Object.keys(config.pages).length} core pages + {brands.length} brand pages
                </p>
              </div>

              <div className="bg-surface border border-border rounded-xl p-6">
                <div className="text-xs uppercase tracking-wider text-textSecondary mb-2">
                  Local Schema
                </div>
                <div className="text-2xl font-serif font-bold text-textPrimary flex items-center gap-2">
                  {config.schema.enabled ? (
                    <>
                      <CheckCircle2 className="text-emerald-400" size={22} /> Active
                    </>
                  ) : (
                    <>
                      <XCircle className="text-red-400" size={22} /> Off
                    </>
                  )}
                </div>
                <p className="text-xs text-textSecondary mt-2">
                  Schema.org {config.schema.type} (Jaipur)
                </p>
              </div>

              <div className="bg-surface border border-border rounded-xl p-6">
                <div className="text-xs uppercase tracking-wider text-textSecondary mb-2">
                  Tag Manager
                </div>
                <div className="text-lg font-mono font-semibold text-emerald-400">
                  {config.global.gtmId}
                </div>
                <p className="text-xs text-textSecondary mt-2">
                  Installed + SPA route tracking active
                </p>
              </div>
            </div>

            {/* Detailed Audit Checklist */}
            <div className="bg-surface border border-border rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h2 className="font-serif text-lg font-semibold text-textPrimary">
                  Live SEO Audit Checklist
                </h2>
                <span className="text-xs text-textSecondary">
                  Updates automatically as you edit settings
                </span>
              </div>
              <div className="divide-y divide-border">
                {audit.checks.map((item) => (
                  <div
                    key={item.id}
                    className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-background/40 transition-colors"
                  >
                    <div className="flex items-start gap-3.5">
                      {item.status === 'pass' && (
                        <CheckCircle2
                          size={20}
                          className="text-emerald-400 flex-shrink-0 mt-0.5"
                        />
                      )}
                      {item.status === 'warning' && (
                        <AlertTriangle
                          size={20}
                          className="text-amber-400 flex-shrink-0 mt-0.5"
                        />
                      )}
                      {item.status === 'error' && (
                        <XCircle
                          size={20}
                          className="text-red-400 flex-shrink-0 mt-0.5"
                        />
                      )}
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-textPrimary">
                            {item.title}
                          </span>
                          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-background border border-border text-textSecondary">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-xs text-textSecondary mt-1">{item.detail}</p>
                      </div>
                    </div>

                    {item.status !== 'pass' && (
                      <button
                        onClick={() => {
                          if (item.category === 'Structured Data') setActiveTab('schema');
                          else if (item.category === 'Technical SEO') setActiveTab('settings');
                          else setActiveTab('pages');
                        }}
                        className="text-xs px-3 py-1.5 rounded border border-accent/50 text-accent hover:bg-accent hover:text-textPrimary transition-colors self-start sm:self-center flex-shrink-0"
                      >
                        Fix Now
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: PAGES & SERP PREVIEW ================= */}
        {activeTab === 'pages' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Route Selector */}
            <div className="lg:col-span-4 space-y-5">
              <div className="bg-surface border border-border rounded-xl p-4">
                <h3 className="text-xs uppercase tracking-wider text-textSecondary font-semibold px-2 mb-3">
                  Core Website Pages
                </h3>
                <div className="space-y-1">
                  {Object.entries(config.pages).map(([route, page]) => {
                    const isSelected =
                      selectedTarget.type === 'page' && selectedTarget.key === route;
                    return (
                      <button
                        key={route}
                        onClick={() => setSelectedTarget({ type: 'page', key: route })}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-primary text-textPrimary'
                            : 'text-textSecondary hover:bg-background hover:text-textPrimary'
                        }`}
                      >
                        <span className="font-medium">{page.label}</span>
                        <span className="text-xs opacity-70 font-mono">{route}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-surface border border-border rounded-xl p-4">
                <h3 className="text-xs uppercase tracking-wider text-textSecondary font-semibold px-2 mb-3">
                  Brand Catalogue SEO ({brands.length})
                </h3>
                <button
                  onClick={() =>
                    setSelectedTarget({ type: 'brandTemplate', key: 'template' })
                  }
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center gap-2 mb-3 transition-colors ${
                    selectedTarget.type === 'brandTemplate'
                      ? 'bg-primary text-textPrimary'
                      : 'bg-background border border-border text-textSecondary hover:text-textPrimary'
                  }`}
                >
                  <Sparkles size={15} className="text-accent" />
                  <span className="font-medium">Default Brand SEO Template</span>
                </button>

                <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                  {brands.map((b) => {
                    const slug = b.name.toLowerCase();
                    const isSelected =
                      selectedTarget.type === 'brand' && selectedTarget.key === slug;
                    const hasCustom = Boolean(
                      config.brandOverrides?.[slug]?.title ||
                        config.brandOverrides?.[slug]?.description
                    );
                    return (
                      <button
                        key={b.id}
                        onClick={() => setSelectedTarget({ type: 'brand', key: slug })}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-primary text-textPrimary'
                            : 'text-textSecondary hover:bg-background hover:text-textPrimary'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Tag size={13} className="opacity-70" />
                          {b.name}
                        </span>
                        {hasCustom && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/25 text-textPrimary">
                            Custom
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Editor & Live Previews */}
            <div className="lg:col-span-8 space-y-6">
              {/* Live Google SERP Preview */}
              <div className="bg-surface border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Search size={16} className="text-accent" />
                    <h3 className="font-serif font-semibold text-base">
                      Live Google Search Preview
                    </h3>
                  </div>
                  <div className="flex items-center bg-background rounded-lg p-1 border border-border">
                    <button
                      onClick={() => setSerpMode('desktop')}
                      className={`px-2.5 py-1 rounded text-xs flex items-center gap-1.5 ${
                        serpMode === 'desktop'
                          ? 'bg-primary text-textPrimary'
                          : 'text-textSecondary'
                      }`}
                    >
                      <Monitor size={13} /> Desktop
                    </button>
                    <button
                      onClick={() => setSerpMode('mobile')}
                      className={`px-2.5 py-1 rounded text-xs flex items-center gap-1.5 ${
                        serpMode === 'mobile'
                          ? 'bg-primary text-textPrimary'
                          : 'text-textSecondary'
                      }`}
                    >
                      <Smartphone size={13} /> Mobile
                    </button>
                  </div>
                </div>

                {/* Google Card Mockup */}
                <div
                  className={`bg-white text-[#202124] rounded-lg p-5 font-sans transition-all ${
                    serpMode === 'mobile' ? 'max-w-[380px] mx-auto shadow-lg' : 'w-full'
                  }`}
                >
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <div className="w-7 h-7 rounded-full bg-[#6B2D30] text-[#F5F2EB] flex items-center justify-center text-[11px] font-serif font-bold">
                      GR
                    </div>
                    <div className="leading-tight overflow-hidden">
                      <div className="text-[13px] font-medium text-[#202124]">
                        {config.global.siteName}
                      </div>
                      <div className="text-[11px] text-[#4d5156] truncate">
                        {currentPreviewSeo.canonical}
                      </div>
                    </div>
                  </div>
                  <div className="text-[#1a0dab] text-[19px] leading-snug font-normal hover:underline cursor-pointer line-clamp-1">
                    {currentPreviewSeo.title}
                  </div>
                  <div className="text-[#4d5156] text-[13px] leading-relaxed mt-1 line-clamp-2">
                    {currentPreviewSeo.description}
                  </div>
                </div>
              </div>

              {/* Meta Tag Form */}
              <div className="bg-surface border border-border rounded-xl p-6 space-y-5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-textPrimary">
                      {selectedTarget.type === 'page' &&
                        `Editing: ${config.pages[selectedTarget.key]?.label}`}
                      {selectedTarget.type === 'brandTemplate' &&
                        'Dynamic Brand Pages Template'}
                      {selectedTarget.type === 'brand' &&
                        `Custom Brand Override: ${
                          brands.find((b) => b.name.toLowerCase() === selectedTarget.key)
                            ?.name
                        }`}
                    </h3>
                    {selectedTarget.type === 'brandTemplate' && (
                      <p className="text-xs text-textSecondary mt-1">
                        Use <code className="text-accent">{'{brand}'}</code> and{' '}
                        <code className="text-accent">{'{categories}'}</code> tokens —
                        applied automatically to all {brands.length} brand pages.
                      </p>
                    )}
                    {selectedTarget.type === 'brand' && (
                      <p className="text-xs text-textSecondary mt-1">
                        Leave fields empty to inherit from the Default Brand SEO Template.
                      </p>
                    )}
                  </div>
                  {selectedTarget.type === 'brand' &&
                    config.brandOverrides?.[selectedTarget.key] && (
                      <button
                        onClick={() => clearBrandOverride(selectedTarget.key)}
                        className="text-xs px-3 py-1.5 rounded border border-red-500/40 text-red-300 hover:bg-red-500/10"
                      >
                        Reset to Template
                      </button>
                    )}
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-textSecondary mb-1.5">
                    {selectedTarget.type === 'brandTemplate'
                      ? 'Title Template'
                      : 'Meta Title'}
                  </label>
                  <input
                    type="text"
                    value={
                      selectedTarget.type === 'brandTemplate'
                        ? formValues.titleTemplate || ''
                        : formValues.title || ''
                    }
                    onChange={(e) =>
                      updateTargetField(
                        selectedTarget.type === 'brandTemplate'
                          ? 'titleTemplate'
                          : 'title',
                        e.target.value
                      )
                    }
                    placeholder={
                      selectedTarget.type === 'brand'
                        ? currentPreviewSeo.title
                        : 'Enter SEO meta title...'
                    }
                    className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-textPrimary focus:outline-none focus:border-accent"
                  />
                  {selectedTarget.type !== 'brandTemplate' && (
                    <LengthMeter
                      value={formValues.title || currentPreviewSeo.title}
                      min={35}
                      max={60}
                      label="Recommended length: 50–60 characters"
                    />
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-textSecondary mb-1.5">
                    {selectedTarget.type === 'brandTemplate'
                      ? 'Description Template'
                      : 'Meta Description'}
                  </label>
                  <textarea
                    rows={3}
                    value={
                      selectedTarget.type === 'brandTemplate'
                        ? formValues.descriptionTemplate || ''
                        : formValues.description || ''
                    }
                    onChange={(e) =>
                      updateTargetField(
                        selectedTarget.type === 'brandTemplate'
                          ? 'descriptionTemplate'
                          : 'description',
                        e.target.value
                      )
                    }
                    placeholder={
                      selectedTarget.type === 'brand'
                        ? currentPreviewSeo.description
                        : 'Enter compelling meta description...'
                    }
                    className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-textPrimary focus:outline-none focus:border-accent"
                  />
                  {selectedTarget.type !== 'brandTemplate' && (
                    <LengthMeter
                      value={formValues.description || currentPreviewSeo.description}
                      min={110}
                      max={160}
                      label="Recommended length: 120–160 characters"
                    />
                  )}
                </div>

                {/* Keywords */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-textSecondary mb-1.5">
                    {selectedTarget.type === 'brandTemplate'
                      ? 'Keywords Template'
                      : 'Focus Keywords (comma-separated)'}
                  </label>
                  <input
                    type="text"
                    value={
                      selectedTarget.type === 'brandTemplate'
                        ? formValues.keywordsTemplate || ''
                        : formValues.keywords || ''
                    }
                    onChange={(e) =>
                      updateTargetField(
                        selectedTarget.type === 'brandTemplate'
                          ? 'keywordsTemplate'
                          : 'keywords',
                        e.target.value
                      )
                    }
                    placeholder="stationery shop Jaipur, school supplies, notebooks..."
                    className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-textPrimary focus:outline-none focus:border-accent"
                  />
                </div>

                {/* Robots + Priority + Changefreq */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-textSecondary mb-1.5">
                      Robots Directive
                    </label>
                    <select
                      value={formValues.robots || 'index, follow'}
                      onChange={(e) => updateTargetField('robots', e.target.value)}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-textPrimary focus:outline-none focus:border-accent"
                    >
                      {ROBOTS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-textSecondary mb-1.5">
                      Sitemap Priority
                    </label>
                    <select
                      value={formValues.priority || '0.8'}
                      onChange={(e) => updateTargetField('priority', e.target.value)}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-textPrimary focus:outline-none focus:border-accent"
                    >
                      {PRIORITY_OPTIONS.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-textSecondary mb-1.5">
                      Change Frequency
                    </label>
                    <select
                      value={formValues.changefreq || 'weekly'}
                      onChange={(e) => updateTargetField('changefreq', e.target.value)}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-textPrimary focus:outline-none focus:border-accent"
                    >
                      {CHANGEFREQ_OPTIONS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Open Graph / Social Sharing Fields */}
                {selectedTarget.type !== 'brandTemplate' && (
                  <div className="pt-4 border-t border-border space-y-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-textPrimary">
                      <Share2 size={15} className="text-accent" />
                      Open Graph & WhatsApp Share Preview
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-textSecondary mb-1">
                          OG Title (optional override)
                        </label>
                        <input
                          type="text"
                          value={formValues.ogTitle || ''}
                          onChange={(e) => updateTargetField('ogTitle', e.target.value)}
                          placeholder="Defaults to Meta Title"
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-textPrimary focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-textSecondary mb-1">
                          OG Image Path or URL
                        </label>
                        <input
                          type="text"
                          value={formValues.ogImage || ''}
                          onChange={(e) => updateTargetField('ogImage', e.target.value)}
                          placeholder="/assets/stationery_hero_v3.png"
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-textPrimary focus:outline-none focus:border-accent"
                        />
                      </div>
                    </div>

                    {/* Social Card Mockup */}
                    <div className="rounded-lg overflow-hidden border border-border bg-background flex flex-col sm:flex-row">
                      <div className="sm:w-44 h-32 bg-surface flex-shrink-0 overflow-hidden">
                        <img
                          src={getAssetUrl(
                            formValues.ogImage || config.global.defaultOgImage
                          )}
                          alt="OG Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3.5 flex flex-col justify-center">
                        <div className="text-[11px] uppercase tracking-wider text-textSecondary/70">
                          {config.global.siteName}
                        </div>
                        <div className="text-sm font-semibold text-textPrimary line-clamp-1 mt-0.5">
                          {currentPreviewSeo.ogTitle}
                        </div>
                        <div className="text-xs text-textSecondary line-clamp-2 mt-1">
                          {currentPreviewSeo.ogDescription}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: LOCAL BUSINESS SCHEMA ================= */}
        {activeTab === 'schema' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-surface border border-border rounded-xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-lg font-semibold text-textPrimary">
                    Local Business Structured Data (JSON-LD)
                  </h2>
                  <p className="text-xs text-textSecondary mt-1">
                    Helps Google Maps and Search display rich store info for Jaipur shoppers.
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(config.schema.enabled)}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        schema: { ...prev.schema, enabled: e.target.checked },
                      }))
                    }
                    className="w-4 h-4 accent-[#8C4535]"
                  />
                  <span className="text-sm text-textPrimary font-medium">Enabled</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-textSecondary mb-1">
                    Schema Type
                  </label>
                  <select
                    value={config.schema.type}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        schema: { ...prev.schema, type: e.target.value },
                      }))
                    }
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-textPrimary"
                  >
                    <option value="Store">Store</option>
                    <option value="LocalBusiness">LocalBusiness</option>
                    <option value="OfficeEquipmentStore">OfficeEquipmentStore</option>
                    <option value="BookStore">BookStore</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-textSecondary mb-1">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={config.schema.name}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        schema: { ...prev.schema, name: e.target.value },
                      }))
                    }
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-textPrimary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-textSecondary mb-1">
                  Business Description
                </label>
                <textarea
                  rows={2}
                  value={config.schema.description}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      schema: { ...prev.schema, description: e.target.value },
                    }))
                  }
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-textPrimary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-textSecondary mb-1">
                    Telephone
                  </label>
                  <input
                    type="text"
                    value={config.schema.telephone}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        schema: { ...prev.schema, telephone: e.target.value },
                      }))
                    }
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-textPrimary"
                  />
                </div>
                <div>
                  <label className="block text-xs text-textSecondary mb-1">Email</label>
                  <input
                    type="email"
                    value={config.schema.email}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        schema: { ...prev.schema, email: e.target.value },
                      }))
                    }
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-textPrimary"
                  />
                </div>
                <div>
                  <label className="block text-xs text-textSecondary mb-1">
                    Opening Hours
                  </label>
                  <input
                    type="text"
                    value={config.schema.openingHours}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        schema: { ...prev.schema, openingHours: e.target.value },
                      }))
                    }
                    placeholder="Mo-Sa 10:00-20:00"
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-textPrimary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-textSecondary mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={config.schema.streetAddress}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        schema: { ...prev.schema, streetAddress: e.target.value },
                      }))
                    }
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-textPrimary"
                  />
                </div>
                <div>
                  <label className="block text-xs text-textSecondary mb-1">
                    City / Locality
                  </label>
                  <input
                    type="text"
                    value={config.schema.addressLocality}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        schema: { ...prev.schema, addressLocality: e.target.value },
                      }))
                    }
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-textPrimary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs text-textSecondary mb-1">State</label>
                  <input
                    type="text"
                    value={config.schema.addressRegion}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        schema: { ...prev.schema, addressRegion: e.target.value },
                      }))
                    }
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-textPrimary"
                  />
                </div>
                <div>
                  <label className="block text-xs text-textSecondary mb-1">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    value={config.schema.postalCode}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        schema: { ...prev.schema, postalCode: e.target.value },
                      }))
                    }
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-textPrimary"
                  />
                </div>
                <div>
                  <label className="block text-xs text-textSecondary mb-1">
                    Latitude
                  </label>
                  <input
                    type="text"
                    value={config.schema.latitude}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        schema: { ...prev.schema, latitude: e.target.value },
                      }))
                    }
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-textPrimary"
                  />
                </div>
                <div>
                  <label className="block text-xs text-textSecondary mb-1">
                    Longitude
                  </label>
                  <input
                    type="text"
                    value={config.schema.longitude}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        schema: { ...prev.schema, longitude: e.target.value },
                      }))
                    }
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-textPrimary"
                  />
                </div>
              </div>

              {/* Social Profiles (sameAs) */}
              <div>
                <label className="block text-xs text-textSecondary mb-1.5">
                  Social Profiles / Google Business Profile URLs (sameAs)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={newSocialUrl}
                    onChange={(e) => setNewSocialUrl(e.target.value)}
                    placeholder="https://instagram.com/yourpage or Google Maps link"
                    className="flex-grow bg-background border border-border rounded-lg px-3 py-2 text-sm text-textPrimary"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newSocialUrl.trim()) return;
                      updateConfig((prev) => ({
                        ...prev,
                        schema: {
                          ...prev.schema,
                          sameAs: [...(prev.schema.sameAs || []), newSocialUrl.trim()],
                        },
                      }));
                      setNewSocialUrl('');
                    }}
                    className="btn-secondary text-xs px-4"
                  >
                    Add
                  </button>
                </div>
                {(config.schema.sameAs || []).length > 0 && (
                  <div className="space-y-1.5">
                    {config.schema.sameAs.map((url, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-background border border-border rounded px-3 py-1.5 text-xs"
                      >
                        <span className="truncate text-textSecondary">{url}</span>
                        <button
                          onClick={() =>
                            updateConfig((prev) => ({
                              ...prev,
                              schema: {
                                ...prev.schema,
                                sameAs: prev.schema.sameAs.filter((_, i) => i !== idx),
                              },
                            }))
                          }
                          className="text-red-400 hover:text-red-300 ml-3"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Live JSON-LD Preview */}
            <div className="lg:col-span-5 bg-surface border border-border rounded-xl p-6 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-serif font-semibold text-base">
                  Live JSON-LD Output
                </h3>
                <button
                  onClick={() => handleCopy(jsonLdPreview, 'jsonld')}
                  className="text-xs px-3 py-1.5 rounded border border-border hover:border-accent text-textSecondary hover:text-textPrimary flex items-center gap-1.5"
                >
                  {copiedId === 'jsonld' ? <Check size={13} /> : <Copy size={13} />}
                  Copy JSON-LD
                </button>
              </div>
              <pre className="bg-background border border-border rounded-lg p-4 text-xs font-mono text-emerald-300 overflow-x-auto flex-grow max-h-[460px]">
                {jsonLdPreview}
              </pre>
              <a
                href="https://search.google.com/test/rich-results"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 text-xs text-accent hover:underline flex items-center gap-1.5"
              >
                Test your schema on Google Rich Results Test <ExternalLink size={12} />
              </a>
            </div>
          </div>
        )}

        {/* ================= TAB 4: SITEMAP & ROBOTS ================= */}
        {activeTab === 'sitemap' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sitemap Generator */}
            <div className="bg-surface border border-border rounded-xl p-6 flex flex-col">
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <div>
                  <h2 className="font-serif text-lg font-semibold">sitemap.xml</h2>
                  <p className="text-xs text-textSecondary">
                    Auto-includes all indexable core pages + {brands.length} brand pages.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(sitemapPreview, 'sitemap')}
                    className="text-xs px-3 py-1.5 rounded border border-border hover:border-accent text-textSecondary hover:text-textPrimary flex items-center gap-1.5"
                  >
                    {copiedId === 'sitemap' ? <Check size={13} /> : <Copy size={13} />}
                    Copy
                  </button>
                  <button
                    onClick={() =>
                      downloadTextFile('sitemap.xml', sitemapPreview, 'application/xml')
                    }
                    className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
                  >
                    <Download size={13} /> Download
                  </button>
                </div>
              </div>
              <pre className="bg-background border border-border rounded-lg p-4 text-xs font-mono text-textSecondary overflow-auto max-h-[450px] flex-grow">
                {sitemapPreview}
              </pre>
            </div>

            {/* Robots.txt Generator */}
            <div className="bg-surface border border-border rounded-xl p-6 flex flex-col space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h2 className="font-serif text-lg font-semibold">robots.txt</h2>
                  <p className="text-xs text-textSecondary">
                    Control how Googlebot and crawlers access your site.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(robotsPreview, 'robots')}
                    className="text-xs px-3 py-1.5 rounded border border-border hover:border-accent text-textSecondary hover:text-textPrimary flex items-center gap-1.5"
                  >
                    {copiedId === 'robots' ? <Check size={13} /> : <Copy size={13} />}
                    Copy
                  </button>
                  <button
                    onClick={() => downloadTextFile('robots.txt', robotsPreview)}
                    className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
                  >
                    <Download size={13} /> Download
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-2.5 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.robotsTxt.allowAll}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      robotsTxt: { ...prev.robotsTxt, allowAll: e.target.checked },
                    }))
                  }
                  className="w-4 h-4 accent-[#8C4535]"
                />
                <span>Allow all search engines to crawl site (recommended)</span>
              </label>

              <div>
                <label className="block text-xs text-textSecondary mb-1.5">
                  Disallowed Paths
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newDisallowPath}
                    onChange={(e) => setNewDisallowPath(e.target.value)}
                    placeholder="/private-path"
                    className="flex-grow bg-background border border-border rounded-lg px-3 py-1.5 text-sm text-textPrimary"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newDisallowPath.trim()) return;
                      updateConfig((prev) => ({
                        ...prev,
                        robotsTxt: {
                          ...prev.robotsTxt,
                          disallowPaths: [
                            ...(prev.robotsTxt.disallowPaths || []),
                            newDisallowPath.trim(),
                          ],
                        },
                      }));
                      setNewDisallowPath('');
                    }}
                    className="btn-secondary text-xs px-3"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(config.robotsTxt.disallowPaths || []).map((p, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 bg-background border border-border rounded px-2.5 py-1 text-xs font-mono"
                    >
                      {p}
                      <button
                        onClick={() =>
                          updateConfig((prev) => ({
                            ...prev,
                            robotsTxt: {
                              ...prev.robotsTxt,
                              disallowPaths: prev.robotsTxt.disallowPaths.filter(
                                (_, i) => i !== idx
                              ),
                            },
                          }))
                        }
                        className="text-red-400 hover:text-red-300"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-textSecondary mb-1">
                  Live Preview
                </label>
                <pre className="bg-background border border-border rounded-lg p-4 text-xs font-mono text-emerald-300 overflow-x-auto">
                  {robotsPreview}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 5: SETTINGS & PUBLISH ================= */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Global SEO & Verification Settings */}
            <div className="lg:col-span-7 bg-surface border border-border rounded-xl p-6 space-y-5">
              <h2 className="font-serif text-lg font-semibold text-textPrimary">
                Global SEO & Webmaster Verification
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-textSecondary mb-1">
                    Site Name
                  </label>
                  <input
                    type="text"
                    value={config.global.siteName}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        global: { ...prev.global, siteName: e.target.value },
                      }))
                    }
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-textPrimary"
                  />
                </div>
                <div>
                  <label className="block text-xs text-textSecondary mb-1">
                    Website Base URL
                  </label>
                  <input
                    type="url"
                    value={config.global.baseUrl}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        global: { ...prev.global, baseUrl: e.target.value },
                      }))
                    }
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-textPrimary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-textSecondary mb-1">
                    Google Search Console Verification Code
                  </label>
                  <input
                    type="text"
                    value={config.global.googleSiteVerification}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        global: {
                          ...prev.global,
                          googleSiteVerification: e.target.value,
                        },
                      }))
                    }
                    placeholder="Paste content value from Google HTML tag"
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-textPrimary"
                  />
                </div>
                <div>
                  <label className="block text-xs text-textSecondary mb-1">
                    Bing Webmaster Verification Code
                  </label>
                  <input
                    type="text"
                    value={config.global.bingSiteVerification}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        global: { ...prev.global, bingSiteVerification: e.target.value },
                      }))
                    }
                    placeholder="Optional msvalidate.01 code"
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-textPrimary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-textSecondary mb-1">
                    Default Social Share Image
                  </label>
                  <input
                    type="text"
                    value={config.global.defaultOgImage}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        global: { ...prev.global, defaultOgImage: e.target.value },
                      }))
                    }
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-textPrimary"
                  />
                </div>
                <div>
                  <label className="block text-xs text-textSecondary mb-1">
                    Admin Panel Passcode
                  </label>
                  <input
                    type="text"
                    value={config.global.adminPasscode}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        global: { ...prev.global, adminPasscode: e.target.value },
                      }))
                    }
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-textPrimary font-mono"
                  />
                </div>
              </div>

              {/* Protected GTM Status */}
              <div className="bg-background border border-border rounded-lg p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wider text-textSecondary">
                    Google Tag Manager (Protected in index.html)
                  </div>
                  <div className="text-sm font-mono text-emerald-400 mt-1">
                    {config.global.gtmId} · Active
                  </div>
                </div>
                <CheckCircle2 className="text-emerald-400" size={20} />
              </div>
            </div>

            {/* Export & Publish to GitHub Pages */}
            <div className="lg:col-span-5 bg-surface border border-border rounded-xl p-6 space-y-5">
              <div>
                <h2 className="font-serif text-lg font-semibold text-textPrimary">
                  Publish & Backup Center
                </h2>
                <p className="text-xs text-textSecondary mt-1">
                  Clicking <strong>Save & Apply Live</strong> updates SEO immediately in
                  your browser. To publish your edits permanently for all Google crawlers on
                  GitHub Pages, export the updated files below and run{' '}
                  <code className="text-accent">npm run deploy</code>.
                </p>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={() =>
                    downloadTextFile(
                      'seoConfig.js',
                      generateSeoConfigFileContent(config),
                      'application/javascript'
                    )
                  }
                  className="w-full btn-primary text-sm py-2.5 px-4 flex items-center justify-center gap-2"
                >
                  <Download size={16} /> Download src/data/seoConfig.js
                </button>

                <button
                  onClick={() => handleCopy(headSnippet, 'headSnippet')}
                  className="w-full btn-secondary text-sm py-2.5 px-4 flex items-center justify-center gap-2"
                >
                  {copiedId === 'headSnippet' ? (
                    <Check size={16} />
                  ) : (
                    <Copy size={16} />
                  )}
                  Copy Home &lt;head&gt; Tags for index.html
                </button>

                <div className="grid grid-cols-2 gap-2.5 pt-2">
                  <button
                    onClick={() =>
                      downloadTextFile(
                        'gr-seo-backup.json',
                        JSON.stringify(config, null, 2),
                        'application/json'
                      )
                    }
                    className="px-3 py-2 rounded border border-border hover:border-accent text-xs text-textSecondary hover:text-textPrimary flex items-center justify-center gap-1.5"
                  >
                    <Download size={14} /> Backup JSON
                  </button>
                  <button
                    onClick={() => importInputRef.current?.click()}
                    className="px-3 py-2 rounded border border-border hover:border-accent text-xs text-textSecondary hover:text-textPrimary flex items-center justify-center gap-1.5"
                  >
                    <Upload size={14} /> Restore JSON
                  </button>
                  <input
                    ref={importInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleImportJson}
                    className="hidden"
                  />
                </div>
              </div>

              <div>
                <div className="text-xs text-textSecondary mb-1.5">
                  Static Home &lt;head&gt; Meta Tags Preview:
                </div>
                <pre className="bg-background border border-border rounded-lg p-3 text-[11px] font-mono text-textSecondary overflow-x-auto max-h-44">
                  {headSnippet}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeoAdmin;
