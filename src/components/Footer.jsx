import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, MessageCircle, Mail, Clock } from 'lucide-react';
import { businessInfo, getWhatsAppLink } from '../data/info';

const Footer = () => {
  return (
    <footer className="bg-surface pt-16 pb-8 border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-t-jaipur bg-primary flex items-center justify-center text-textPrimary font-serif font-bold border border-border">
                GR
              </div>
              <div className="flex flex-col justify-center items-center">
                <span className="font-serif text-xl font-semibold tracking-wide text-textPrimary leading-none mb-1 w-full text-center">
                  GR & Company
                </span>
                <div className="w-full flex justify-between font-sans text-[12.5px] font-medium text-textSecondary uppercase leading-none px-[1px]">
                  {'STATIONERY'.split('').map((char, i) => (
                    <span key={i}>{char}</span>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-textSecondary text-sm leading-relaxed">
              {businessInfo.description}
            </p>
          </div>

          {/* Links Col */}
          <div>
            <h3 className="text-textPrimary font-serif font-semibold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {['Home', 'About', 'Products', 'Gallery', 'Offers', 'Help', 'Contact'].map((item) => (
                <li key={item}>
                  <Link to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="text-textSecondary hover:text-accent transition-colors text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Col */}
          <div className="lg:col-span-2">
            <h3 className="text-textPrimary font-serif font-semibold text-lg mb-6">Contact Us</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3 text-textSecondary text-sm">
                  <MapPin size={18} className="text-accent flex-shrink-0 mt-0.5" />
                  <span>{businessInfo.address}</span>
                </div>
                <div className="flex items-center gap-3 text-textSecondary text-sm">
                  <Clock size={18} className="text-accent flex-shrink-0" />
                  <span>{businessInfo.hours}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-textSecondary text-sm">
                  <Phone size={18} className="text-accent flex-shrink-0" />
                  <span>{businessInfo.phone}</span>
                </div>
                <a href={getWhatsAppLink('Hi, I would like to make an enquiry.')} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-textSecondary text-sm hover:text-accent transition-colors">
                  <MessageCircle size={18} className="text-[#25D366] flex-shrink-0" />
                  <span>+{businessInfo.whatsappNumber}</span>
                </a>
                <div className="flex items-center gap-3 text-textSecondary text-sm">
                  <Mail size={18} className="text-accent flex-shrink-0" />
                  <span>{businessInfo.email}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-border/50 text-center text-textSecondary text-xs">
          <p>&copy; {new Date().getFullYear()} {businessInfo.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
