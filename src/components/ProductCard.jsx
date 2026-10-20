import React from 'react';
import { MessageCircle } from 'lucide-react';
import { getWhatsAppLink } from '../data/info';
import { getAssetUrl } from '../utils/assetUrl';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-surface rounded-lg border border-border overflow-hidden hover:border-accent/50 transition-colors group flex flex-col h-full shadow-sm">
      <div className="relative aspect-square overflow-hidden bg-white p-4">
        <img
          src={getAssetUrl(product.image)}
          alt={product.name}
          className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          loading="lazy"
        />
        {product.brand && (
          <div className="absolute top-3 left-3 bg-background/80 backdrop-blur text-textSecondary text-xs px-2 py-1 rounded border border-border">
            {product.brand}
          </div>
        )}
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="text-xs text-accent font-medium mb-2 uppercase tracking-wider">
          {product.category}
        </div>
        <h3 className="text-textPrimary font-semibold text-lg mb-2 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-textSecondary text-sm mb-6 flex-grow line-clamp-3">
          {product.description}
        </p>
        
        <a
          href={getWhatsAppLink(`Hi, I would like to enquire about ${product.name} by ${product.brand}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-background border border-border rounded text-textPrimary hover:bg-border transition-colors text-sm font-medium mt-auto"
        >
          <MessageCircle size={16} className="text-[#25D366]" />
          Enquire on WhatsApp
        </a>
      </div>
    </div>
  );
};

export default ProductCard;
