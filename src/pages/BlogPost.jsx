import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  Check,
  MessageCircle,
  Tag,
  BookOpen,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { getBlogBySlug, getRelatedBlogs } from '../data/blogs';
import { getAssetUrl } from '../utils/assetUrl';
import { getWhatsAppLink } from '../data/info';

const BlogPost = () => {
  const { slug } = useParams();
  const blog = getBlogBySlug(slug);
  const [copied, setCopied] = useState(false);

  if (!blog) {
    return (
      <div className="min-h-[70vh] bg-background text-textPrimary flex flex-col items-center justify-center px-4 py-20 text-center">
        <BookOpen size={48} className="text-accent mb-4 opacity-80" />
        <h1 className="text-3xl font-serif font-bold mb-3">Article Not Found</h1>
        <p className="text-textSecondary text-sm max-w-md mb-8">
          The stationery guide you are looking for may have been moved or updated.
        </p>
        <Link
          to="/blog"
          className="btn-primary inline-flex items-center gap-2 text-sm py-2.5 px-5"
        >
          <ArrowLeft size={16} /> Back to All Articles
        </Link>
      </div>
    );
  }

  const relatedPosts = getRelatedBlogs(blog.slug, 3);

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt,
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  return (
    <article className="bg-background min-h-screen pt-8 pb-24 text-textPrimary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Back Link */}
        <div className="flex items-center justify-between mb-8 text-sm">
          <div className="flex items-center gap-2 text-textSecondary overflow-hidden text-ellipsis whitespace-nowrap">
            <Link to="/" className="hover:text-textPrimary transition-colors">
              Home
            </Link>
            <span>→</span>
            <Link to="/blog" className="hover:text-textPrimary transition-colors">
              Blog
            </Link>
            <span>→</span>
            <span className="text-accent font-medium truncate max-w-[220px] sm:max-w-none">
              {blog.category}
            </span>
          </div>

          <Link
            to="/blog"
            className="text-textSecondary hover:text-textPrimary inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium transition-colors flex-shrink-0 ml-4"
          >
            <ArrowLeft size={15} /> Back to Blog
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-10 space-y-5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-primary/90 text-textPrimary text-xs px-3 py-1 rounded-full border border-accent/40 font-medium">
              {blog.category}
            </span>
            <span className="text-textSecondary text-xs">•</span>
            <span className="text-xs text-textSecondary flex items-center gap-1.5">
              <Calendar size={13} className="text-accent" />
              {blog.date}
            </span>
            <span className="text-textSecondary text-xs">•</span>
            <span className="text-xs text-textSecondary flex items-center gap-1.5">
              <Clock size={13} className="text-accent" />
              {blog.readTime}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-textPrimary leading-[1.2] tracking-tight">
            {blog.title}
          </h1>

          <p className="text-base sm:text-lg text-textSecondary/90 leading-relaxed font-sans italic border-l-2 border-accent pl-4">
            {blog.excerpt}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-border/60">
            <div className="text-xs text-textSecondary">
              Published by <span className="text-textPrimary font-medium">{blog.author}</span>
            </div>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-border bg-surface text-textSecondary hover:text-textPrimary hover:border-accent transition-all cursor-pointer"
              title="Share article or copy link"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 size={14} />
                  <span>Share Article</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* Featured Image */}
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-border shadow-xl mb-12 bg-surface">
          <img
            src={getAssetUrl(blog.image)}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Key Takeaways Box */}
        {blog.keyTakeaways && blog.keyTakeaways.length > 0 && (
          <div className="bg-surface border border-border rounded-xl p-6 sm:p-8 mb-12 shadow-sm">
            <div className="flex items-center gap-2 text-accent font-serif font-bold text-lg mb-4">
              <Sparkles size={18} />
              <span>Key Takeaways &amp; Quick Summary</span>
            </div>
            <ul className="space-y-3">
              {blog.keyTakeaways.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-textSecondary leading-relaxed">
                  <CheckCircle2 size={16} className="text-accent flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Article Body Content */}
        <div className="space-y-10 text-textSecondary leading-relaxed font-sans">
          {blog.sections.map((section, idx) => (
            <section key={idx} className="space-y-4">
              {section.heading && (
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-textPrimary tracking-tight pt-2">
                  {section.heading}
                </h2>
              )}

              {section.paragraphs?.map((para, pIdx) => (
                <p key={pIdx} className="text-sm sm:text-base leading-relaxed text-textSecondary/95">
                  {para}
                </p>
              ))}

              {section.bulletList && section.bulletList.length > 0 && (
                <ul className="space-y-2.5 my-3 pl-2">
                  {section.bulletList.map((item, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2.5 text-sm sm:text-base">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2.5 flex-shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {section.tip && (
                <div className="my-6 bg-surface/80 border-l-4 border-accent rounded-r-lg p-4 sm:p-5 text-sm italic text-textPrimary">
                  <span className="font-semibold text-accent not-italic block mb-1">
                    Store Note &amp; Pro Tip:
                  </span>
                  {section.tip}
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Mentioned Brands Chips */}
        {blog.relatedBrands && blog.relatedBrands.length > 0 && (
          <div className="mt-14 pt-8 border-t border-border">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-textSecondary font-semibold mb-3">
              <Tag size={13} className="text-accent" />
              <span>Stationery Brands Mentioned in This Guide</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {blog.relatedBrands.map((brand) => (
                <Link
                  key={brand}
                  to={`/products/${brand.toLowerCase()}`}
                  className="px-3.5 py-1.5 rounded-lg bg-surface border border-border text-xs font-medium text-textPrimary hover:border-accent hover:text-accent transition-colors inline-flex items-center gap-1.5"
                >
                  <span>{brand} Catalogue</span>
                  <ArrowRight size={12} />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* WhatsApp Direct Product Enquiry Box */}
        <div className="mt-12 bg-surface border border-accent/40 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
          <div className="space-y-1.5 text-center sm:text-left">
            <h3 className="font-serif font-bold text-lg text-textPrimary">
              Need Help Selecting Products From This Article?
            </h3>
            <p className="text-xs sm:text-sm text-textSecondary max-w-lg">
              Send our Jaipur store a direct WhatsApp message. We verify product availability, recommend ideal grades, and offer bulk academic &amp; office rates.
            </p>
          </div>

          <a
            href={getWhatsAppLink(blog.whatsappPrompt)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2 text-sm py-3 px-6 whitespace-nowrap shadow-md flex-shrink-0"
          >
            <MessageCircle size={18} className="text-[#25D366]" />
            Enquire on WhatsApp
          </a>
        </div>

        {/* Author Bio Footer */}
        <div className="mt-12 p-6 rounded-xl bg-surface/50 border border-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-t-jaipur bg-primary flex items-center justify-center text-textPrimary font-serif font-bold text-lg flex-shrink-0 border border-border">
            GR
          </div>
          <div>
            <div className="font-serif font-bold text-textPrimary text-base">
              GR &amp; Company Stationery
            </div>
            <p className="text-xs text-textSecondary mt-0.5 leading-relaxed">
              Curating quality writing instruments, office filing, and student essentials in Tripolia Bazar, Jaipur. Visit our store or explore our catalogue online.
            </p>
          </div>
        </div>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-border">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-serif font-bold text-textPrimary">
                Related Stationery Guides
              </h2>
              <Link
                to="/blog"
                className="text-xs font-medium text-accent hover:text-textPrimary transition-colors inline-flex items-center gap-1"
              >
                View All <ArrowRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="bg-surface border border-border rounded-xl overflow-hidden hover:border-accent/60 transition-all group flex flex-col h-full"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-background">
                    <img
                      src={getAssetUrl(post.image)}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <span className="text-[11px] text-accent uppercase tracking-wider font-semibold mb-1">
                      {post.category}
                    </span>
                    <h3 className="font-serif font-bold text-sm text-textPrimary group-hover:text-accent transition-colors line-clamp-2 mb-2">
                      {post.title}
                    </h3>
                    <div className="text-[11px] text-textSecondary mt-auto">
                      {post.readTime}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default BlogPost;
