import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ArrowLeft } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products, brands } from '../data/products';
import { getAssetUrl } from '../utils/assetUrl';

const BrandCatalogue = () => {
  const { brandName } = useParams();
  
  // Find brand based on URL parameter
  const brand = brands.find(b => b.name.toLowerCase() === brandName.toLowerCase());
  
  // State for search and filters within this brand
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  if (!brand) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl font-serif text-textPrimary mb-4">Brand Not Found</h2>
        <Link to="/products" className="text-accent hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> Back to All Brands
        </Link>
      </div>
    );
  }

  // Filter products for this specific brand ONLY
  const brandProducts = products.filter(p => p.brand.toLowerCase() === brand.name.toLowerCase());
  
  // Apply user search and category filters on top of the brand filter
  const filteredProducts = brandProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-background min-h-screen pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs & Back Navigation */}
        <div className="flex items-center justify-between mb-8 text-sm">
          <div className="text-textSecondary flex items-center gap-2">
            <Link to="/" className="hover:text-textPrimary">Home</Link>
            <span>→</span>
            <Link to="/products" className="hover:text-textPrimary">Products</Link>
            <span>→</span>
            <span className="text-accent font-medium">{brand.name}</span>
          </div>
          <Link to="/products" className="text-textSecondary hover:text-textPrimary flex items-center gap-1 hidden sm:flex">
            <ArrowLeft size={16} /> Back to All Brands
          </Link>
        </div>

        {/* Brand Header */}
        <div className="bg-surface border border-border rounded-lg p-8 mb-10 flex flex-col md:flex-row items-center gap-8 shadow-sm">
          <div className="w-40 h-40 bg-white rounded flex items-center justify-center p-4 flex-shrink-0">
             <img 
                src={getAssetUrl(brand.logo)} 
                alt={`${brand.name} logo`} 
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `<span class="text-2xl font-bold text-black">${brand.name}</span>`;
                }}
              />
          </div>
          <div className="text-center md:text-left flex-grow">
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-textPrimary mb-4">
              {brand.name}
            </h1>
            <p className="text-textSecondary text-lg mb-4 max-w-2xl">
              Explore {brand.name} stationery products available through our catalogue.
            </p>
            <div className="inline-block bg-background border border-border px-4 py-2 rounded text-sm text-textPrimary">
              <span className="font-bold text-accent">{brandProducts.length}</span> Products
            </div>
            <p className="text-xs text-textSecondary mt-4 italic">Enquire for availability. Products shown do not guarantee current stock.</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className={`lg:w-1/4 ${isMobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-surface border border-border rounded-lg p-6 sticky top-24">
              <div className="flex justify-between items-center mb-6 lg:hidden">
                <h2 className="text-xl font-serif font-bold text-textPrimary">Filters</h2>
                <button onClick={() => setIsMobileFiltersOpen(false)} className="text-textSecondary hover:text-textPrimary">
                  <X size={24} />
                </button>
              </div>
              
              <h3 className="text-sm uppercase tracking-wider text-accent font-bold mb-4">Categories</h3>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => { setActiveCategory('All'); setIsMobileFiltersOpen(false); }}
                    className={`w-full text-left px-3 py-2 rounded transition-colors text-sm ${activeCategory === 'All' ? 'bg-primary/20 text-accent font-medium' : 'text-textSecondary hover:text-textPrimary hover:bg-background'}`}
                  >
                    All {brand.name}
                  </button>
                </li>
                {brand.categories.map(cat => (
                  <li key={cat}>
                    <button 
                      onClick={() => { setActiveCategory(cat); setIsMobileFiltersOpen(false); }}
                      className={`w-full text-left px-3 py-2 rounded transition-colors text-sm ${activeCategory === cat ? 'bg-primary/20 text-accent font-medium' : 'text-textSecondary hover:text-textPrimary hover:bg-background'}`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:w-3/4">
            
            {/* Search and Mobile Filter Toggle */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 text-textSecondary" size={20} />
                <input
                  type="text"
                  placeholder={`Search within ${brand.name}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-surface border border-border rounded-lg pl-10 pr-4 py-3 text-textPrimary focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
              <button 
                onClick={() => setIsMobileFiltersOpen(true)}
                className="lg:hidden flex items-center justify-center gap-2 bg-surface border border-border px-4 py-3 rounded-lg text-textPrimary hover:bg-border transition-colors"
              >
                <SlidersHorizontal size={20} /> Filters
              </button>
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-surface rounded-lg border border-border">
                <h3 className="text-xl font-serif text-textPrimary mb-2">No products found</h3>
                <p className="text-textSecondary">Try adjusting your search or category filters within {brand.name}.</p>
                <button 
                  onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                  className="mt-6 text-accent hover:underline font-medium"
                >
                  Clear filters
                </button>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandCatalogue;
