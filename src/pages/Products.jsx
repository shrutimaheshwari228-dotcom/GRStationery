import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { brands } from '../data/products';
import { getAssetUrl } from '../utils/assetUrl';

const Products = () => {
  return (
    <div className="bg-background min-h-screen pt-10 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-textPrimary mb-6">
            Shop by Brand
          </h1>
          <p className="text-textSecondary text-lg max-w-2xl mx-auto">
            Browse stationery from popular brands and explore products by category.
          </p>
          <div className="h-1 w-20 bg-accent mx-auto rounded mt-6"></div>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {brands.map((brand) => (
            <Link 
              to={`/products/${brand.name.toLowerCase()}`}
              key={brand.id}
              className="bg-surface border border-border rounded-lg p-8 flex flex-col items-center justify-between text-center hover:border-accent hover:bg-border/30 transition-all group shadow-sm h-full"
            >
              <div className="flex-grow flex flex-col items-center justify-center w-full">
                <div className="w-full h-32 flex items-center justify-center mb-6 bg-white rounded p-4">
                  <img 
                    src={getAssetUrl(brand.logo)} 
                    alt={`${brand.name} logo`} 
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '';
                      e.target.alt = brand.name;
                      e.target.parentElement.innerHTML = `<span class="text-xl font-bold text-black">${brand.name}</span>`;
                    }}
                  />
                </div>
                <h3 className="text-xl font-bold text-textPrimary group-hover:text-accent transition-colors mb-2">
                  {brand.name}
                </h3>
                <p className="text-sm text-textSecondary mb-6">
                  {brand.description}
                </p>
              </div>
              <div className="w-full">
                <span className="btn-secondary w-full flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-textPrimary group-hover:border-primary">
                  View Products <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Products;
