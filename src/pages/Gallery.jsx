import React from 'react';
import { getAssetUrl } from '../utils/assetUrl';

const Gallery = () => {
  const images = [
    {
      url: "/assets/stationery_hero_v3.png",
      caption: "Vibrant School & Office Stationery"
    },
    {
      url: "/assets/gallery_art.jpg",
      caption: "Art and craft supplies"
    },
    {
      url: "/assets/gallery_office.jpg",
      caption: "Office desk essentials"
    },
    {
      url: "/assets/gallery_notebooks.jpg",
      caption: "Notebooks and paper products"
    },
    {
      url: "/assets/gallery_writing.jpg",
      caption: "Writing instruments"
    },
    {
      url: "/assets/jaipur_market.jpg",
      caption: "Old Jaipur architectural details"
    }
  ];

  return (
    <div className="bg-background min-h-screen pt-10 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-textPrimary mb-6">
            Gallery
          </h1>
          <p className="text-textSecondary text-lg max-w-2xl mx-auto mb-6">
            A glimpse into our product range and the aesthetic of GR & Company Stationery.
          </p>
          <div className="h-1 w-20 bg-accent mx-auto rounded"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img, idx) => (
            <div key={idx} className="group relative rounded-lg overflow-hidden border border-border bg-surface aspect-square">
              <img 
                src={getAssetUrl(img.url)} 
                alt={img.caption} 
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <p className="p-6 text-textPrimary font-medium">{img.caption}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Gallery;
