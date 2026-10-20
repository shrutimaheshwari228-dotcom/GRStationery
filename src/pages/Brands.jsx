import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Brands = () => {
  const brandsList = [
    "Nataraj",
    "Apsara",
    "Faber-Castell",
    "DOMS",
    "Classmate",
    "Camlin",
    "Luxor",
    "Flair",
    "Kangaroo",
    "Post-it"
  ];

  return (
    <div className="bg-background min-h-screen pt-10 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-textPrimary mb-6">
            Popular Stationery Brands
          </h1>
          <p className="text-textSecondary text-lg max-w-2xl mx-auto mb-6">
            We feature products from trusted and recognizable stationery brands to ensure quality and reliability for your everyday needs.
          </p>
          <div className="h-1 w-20 bg-accent mx-auto rounded"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {brandsList.map((brand, idx) => (
            <Link 
              to={`/products?search=${brand}`} 
              key={idx}
              className="bg-surface border border-border rounded-lg p-8 flex flex-col items-center justify-center text-center hover:border-accent hover:bg-border/30 transition-all group aspect-square shadow-sm"
            >
              <h3 className="text-xl font-bold text-textPrimary group-hover:text-accent transition-colors">
                {brand}
              </h3>
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-sm text-textSecondary">
                View Products <ArrowRight size={14}/>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Brands;
