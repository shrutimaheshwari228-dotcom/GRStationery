import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Calendar,
  Clock,
  ArrowRight,
  BookOpen,
  Sparkles,
  MessageCircle,
  X,
} from 'lucide-react';
import { blogs, blogCategories } from '../data/blogs';
import { getAssetUrl } from '../utils/assetUrl';
import { getWhatsAppLink } from '../data/info';

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filtered blogs
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesCategory =
        selectedCategory === 'All' || blog.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        blog.title.toLowerCase().includes(q) ||
        blog.excerpt.toLowerCase().includes(q) ||
        blog.tags.some((t) => t.toLowerCase().includes(q)) ||
        blog.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const featuredBlog = useMemo(() => {
    if (searchQuery.trim() || selectedCategory !== 'All') return null;
    return blogs.find((b) => b.featured) || blogs[0];
  }, [searchQuery, selectedCategory]);

  const regularBlogs = useMemo(() => {
    if (!featuredBlog) return filteredBlogs;
    return filteredBlogs.filter((b) => b.id !== featuredBlog.id);
  }, [filteredBlogs, featuredBlog]);

  return (
    <div className="bg-background min-h-screen pt-10 pb-24 text-textPrimary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-textSecondary mb-8">
          <Link to="/" className="hover:text-textPrimary transition-colors">
            Home
          </Link>
          <span>→</span>
          <span className="text-accent font-medium">Blog</span>
        </div>

        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border text-xs text-accent uppercase tracking-wider mb-4">
            <BookOpen size={14} />
            <span>Stationery Chronicles &amp; Guides</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-textPrimary mb-4 leading-tight">
            Knowledge for Every Pen, Pencil &amp; Page.
          </h1>
          <p className="text-base md:text-lg text-textSecondary leading-relaxed">
            Buying guides, lead grading breakdowns, office desk setups, and school checklists curated by the stationery specialists at GR &amp; Company, Jaipur.
          </p>
          <div className="h-1 w-20 bg-accent mx-auto rounded mt-6"></div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-surface border border-border rounded-xl p-4 md:p-6 mb-12 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textSecondary"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles, brands, guides..."
                className="w-full bg-background border border-border rounded-lg pl-10 pr-9 py-2.5 text-sm text-textPrimary placeholder:text-textSecondary/60 focus:outline-none focus:border-accent transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-textSecondary hover:text-textPrimary"
                  title="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Total Results Count */}
            <div className="text-xs text-textSecondary self-end md:self-center">
              Showing <span className="text-textPrimary font-semibold">{filteredBlogs.length}</span> {filteredBlogs.length === 1 ? 'article' : 'articles'}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 no-scrollbar">
            {blogCategories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? 'bg-primary text-textPrimary border border-accent/60 shadow-sm'
                      : 'bg-background border border-border text-textSecondary hover:text-textPrimary hover:border-accent/40'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured Post Hero (shown when on "All" and no search) */}
        {featuredBlog && (
          <div className="mb-14">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-accent font-semibold mb-3">
              <Sparkles size={14} />
              <span>Featured Article</span>
            </div>
            <div className="bg-surface border border-border rounded-2xl overflow-hidden hover:border-accent/50 transition-all duration-300 group grid grid-cols-1 lg:grid-cols-12 shadow-lg">
              <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto overflow-hidden bg-background">
                <img
                  src={getAssetUrl(featuredBlog.image)}
                  alt={featuredBlog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-primary/95 text-textPrimary text-xs px-3 py-1 rounded-full border border-accent/50 backdrop-blur-sm font-medium">
                    {featuredBlog.category}
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-xs text-textSecondary">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-accent" />
                      {featuredBlog.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} className="text-accent" />
                      {featuredBlog.readTime}
                    </span>
                  </div>

                  <Link to={`/blog/${featuredBlog.slug}`}>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-textPrimary group-hover:text-accent transition-colors leading-tight">
                      {featuredBlog.title}
                    </h2>
                  </Link>

                  <p className="text-textSecondary text-sm sm:text-base leading-relaxed line-clamp-4">
                    {featuredBlog.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {featuredBlog.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] px-2.5 py-0.5 rounded bg-background border border-border text-textSecondary"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-border flex items-center justify-between">
                  <span className="text-xs text-textSecondary italic">
                    By {featuredBlog.author}
                  </span>
                  <Link
                    to={`/blog/${featuredBlog.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-textPrimary transition-colors group-hover:translate-x-1 duration-200"
                  >
                    Read Full Article <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regular Articles Grid */}
        {regularBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularBlogs.map((post) => (
              <article
                key={post.id}
                className="bg-surface border border-border rounded-xl overflow-hidden hover:border-accent/60 transition-all duration-300 group flex flex-col h-full shadow-sm"
              >
                {/* Image */}
                <Link
                  to={`/blog/${post.slug}`}
                  className="relative aspect-[16/10] overflow-hidden bg-background block"
                >
                  <img
                    src={getAssetUrl(post.image)}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-background/90 text-textSecondary text-xs px-2.5 py-1 rounded-full border border-border backdrop-blur-sm">
                      {post.category}
                    </span>
                  </div>
                </Link>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* Meta date & time */}
                  <div className="flex items-center gap-3 text-xs text-textSecondary mb-3">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-accent" />
                      {post.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} className="text-accent" />
                      {post.readTime}
                    </span>
                  </div>

                  {/* Title */}
                  <Link to={`/blog/${post.slug}`} className="block mb-3">
                    <h3 className="text-xl font-serif font-bold text-textPrimary group-hover:text-accent transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </h3>
                  </Link>

                  {/* Excerpt */}
                  <p className="text-textSecondary text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] px-2 py-0.5 rounded bg-background border border-border text-textSecondary"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer link */}
                  <div className="pt-4 border-t border-border mt-auto flex items-center justify-between">
                    <span className="text-xs text-textSecondary">
                      {post.relatedBrands.length > 0
                        ? `Features ${post.relatedBrands.slice(0, 2).join(', ')}`
                        : post.author}
                    </span>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-textPrimary transition-colors group-hover:translate-x-1 duration-200"
                    >
                      Read Guide <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="bg-surface border border-border rounded-xl p-12 text-center max-w-md mx-auto my-12">
            <BookOpen size={36} className="text-accent mx-auto mb-4 opacity-75" />
            <h3 className="text-xl font-serif font-bold text-textPrimary mb-2">
              No Articles Found
            </h3>
            <p className="text-sm text-textSecondary mb-6">
              No blog posts match your search for "{searchQuery}". Try a different keyword or category.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="btn-primary text-xs py-2 px-4"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Bottom Enquiry Banner */}
        <div className="mt-20 bg-surface border border-border rounded-2xl p-8 md:p-12 relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-4">
            <span className="text-xs uppercase tracking-wider text-accent font-semibold">
              Looking for Personalized Stationery Advice?
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-textPrimary">
              Have Questions About School Kits or Office Supplies?
            </h2>
            <p className="text-textSecondary text-sm sm:text-base leading-relaxed">
              Our Jaipur team is on hand to answer questions on brand selections, bulk school lists, and GST billing. Send us your requirement list directly on WhatsApp.
            </p>
            <div className="pt-2">
              <a
                href={getWhatsAppLink('Hi GR & Company Stationery, I read your blog and would like stationery advice.')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2.5 text-sm py-3 px-6"
              >
                <MessageCircle size={18} className="text-[#25D366]" />
                Ask on WhatsApp
              </a>
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
