import React from 'react';
import { MessageCircle } from 'lucide-react';
import { getWhatsAppLink } from '../data/info';

const Offers = () => {
  // If there are verified offers, they can be added here.
  const activeOffers = [];

  return (
    <div className="bg-background min-h-screen pt-10 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-textPrimary mb-6">
            Current Offers
          </h1>
          <div className="h-1 w-20 bg-accent mx-auto rounded"></div>
        </div>

        {activeOffers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {activeOffers.map((offer, idx) => (
              <div key={idx} className="bg-surface border border-border rounded-lg p-8">
                <h3 className="text-2xl font-bold text-textPrimary mb-2">{offer.title}</h3>
                <p className="text-textSecondary mb-6">{offer.description}</p>
                <a
                  href={getWhatsAppLink(`Hi, I would like to know more about the offer: ${offer.title}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <MessageCircle size={18} /> Ask About This Offer
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-surface border border-border rounded-lg p-12 text-center shadow-sm">
            <h3 className="text-2xl font-serif text-textPrimary mb-4">Looking for bulk requirements or special offers?</h3>
            <p className="text-textSecondary text-lg mb-8 max-w-2xl mx-auto">
              Check with us for our latest stationery offers, seasonal discounts, and tailored pricing for bulk institutional requirements.
            </p>
            <a
              href={getWhatsAppLink('Hi, I would like to enquire about your current stationery offers and bulk pricing.')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2"
            >
              <MessageCircle size={18} /> Ask About Current Offers
            </a>
          </div>
        )}

      </div>
    </div>
  );
};

export default Offers;
