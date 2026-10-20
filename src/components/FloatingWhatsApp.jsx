import React from 'react';
import { MessageCircle } from 'lucide-react';
import { getWhatsAppLink } from '../data/info';

const FloatingWhatsApp = () => {
  return (
    <a
      href={getWhatsAppLink('Hi, I found your website and would like to make an enquiry.')}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#1DA851] hover:scale-105 transition-all duration-300 flex items-center justify-center group"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle size={28} />
      <span className="absolute right-full mr-4 bg-surface text-textPrimary text-sm py-2 px-4 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-border hidden md:block">
        Enquire on WhatsApp
      </span>
    </a>
  );
};

export default FloatingWhatsApp;
