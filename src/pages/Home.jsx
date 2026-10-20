import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';
import { getWhatsAppLink } from '../data/info';
import { getAssetUrl } from '../utils/assetUrl';

const Home = () => {
  const featuredProducts = products.filter(p => p.featured).slice(0, 6);

  const features = [
    { title: "Wide Range", desc: "Everyday school, office, paper, writing and art requirements." },
    { title: "Retail & Bulk Requirements", desc: "Designed to serve individual customers as well as institutions and businesses." },
    { title: "Convenient Enquiries", desc: "Quick product enquiries through WhatsApp and contact options." },
    { title: "Local Jaipur Presence", desc: "Conveniently located in the heart of Jaipur." },
    { title: "Multiple Categories", desc: "From basic stationery to specialized office and art supplies." },
    { title: "Trusted Everyday Products", desc: "Focus on recognized stationery brands and practical products." }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center pt-20 pb-32 overflow-hidden bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-textPrimary leading-tight mb-6">
                A Little Paper. <br/><span className="text-accent italic">A Lot of Possibilities.</span>
              </h1>
              <p className="text-lg md:text-xl text-textSecondary mb-10 leading-relaxed max-w-2xl">
                From everyday school stationery to office essentials, art supplies and bulk requirements — discover a wide range of stationery at GR & Company Stationery, Jaipur.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/products" className="btn-primary flex items-center justify-center gap-2">
                  Explore Products <ArrowRight size={18} />
                </Link>
                <a href={getWhatsAppLink('Hi, I am looking for some stationery supplies.')} target="_blank" rel="noopener noreferrer" className="btn-secondary flex items-center justify-center gap-2">
                  <MessageCircle size={18} className="text-[#25D366]" />
                  Enquire on WhatsApp
                </a>
              </div>
            </div>

            {/* Right Image */}
            <div className="hidden lg:block relative">
              <div className="aspect-[4/3] rounded-lg overflow-hidden border border-border shadow-xl">
                <img 
                  src={getAssetUrl('/assets/stationery_hero_v3.png')} 
                  alt="Premium stationery collection flatlay" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary rounded-full blur-3xl opacity-20 z-0"></div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-textPrimary mb-4">Popular Stationery Picks</h2>
              <p className="text-textSecondary max-w-2xl">Explore our most requested products for school, office, and art requirements.</p>
            </div>
            <Link to="/products" className="text-accent hover:text-textPrimary transition-colors flex items-center gap-2 font-medium mt-4 md:mt-0">
              View All Products <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-textPrimary mb-4">Why Choose GR & Company Stationery?</h2>
            <div className="h-1 w-20 bg-accent mx-auto rounded"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="p-6 bg-background rounded-lg border border-border flex items-start gap-4">
                <CheckCircle2 className="text-accent flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="text-lg font-semibold text-textPrimary mb-2">{feature.title}</h3>
                  <p className="text-textSecondary text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Jaipur Heritage Section */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-[4/5] rounded-t-full rounded-b-lg overflow-hidden border border-border p-2 bg-surface">
                <img 
                  src={getAssetUrl('/assets/jaipur_market.jpg')} 
                  alt="Tripolia Bazar, old Jaipur city market architecture" 
                  className="w-full h-full object-cover rounded-t-full rounded-b opacity-90"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary rounded-full blur-3xl opacity-20 z-0"></div>
            </div>
            
            <div className="z-10 relative">
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-textPrimary mb-6 leading-tight">
                Rooted in the <br/><span className="text-accent">Heart of Jaipur.</span>
              </h2>
              <p className="text-lg text-textSecondary mb-8 leading-relaxed">
                Located in Jaipur, GR & Company Stationery brings everyday stationery needs together with the convenience of a local, trusted business. 
              </p>
              <p className="text-textSecondary mb-10 leading-relaxed">
                Whether you're a student looking for school supplies, an artist seeking quality materials, or a business requiring bulk office essentials, we provide a seamless experience to discover and enquire about the products you need.
              </p>
              <Link to="/about" className="btn-secondary inline-block">
                Learn More About Us
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
