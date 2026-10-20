import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, MessageCircle } from 'lucide-react';
import { businessInfo, getWhatsAppLink } from '../data/info';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Products', path: '/products' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Offers', path: '/offers' },
    { name: 'Help', path: '/help' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-t-jaipur bg-primary flex items-center justify-center text-textPrimary font-serif font-bold text-xl border border-border group-hover:bg-primaryDark transition-colors">
              GR
            </div>
            <div className="hidden sm:flex flex-col justify-center items-center">
              <span className="font-serif text-xl font-semibold tracking-wide text-textPrimary leading-none mb-1 w-full text-center">
                GR & Company
              </span>
              <div className="w-full flex justify-between font-sans text-[12.5px] font-medium text-textSecondary uppercase leading-none px-[1px]">
                {'STATIONERY'.split('').map((char, i) => (
                  <span key={i}>{char}</span>
                ))}
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-6 lg:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-accent ${
                  location.pathname === link.path ? 'text-accent border-b-2 border-accent' : 'text-textSecondary'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-surface text-textPrimary border border-border rounded-full pl-4 pr-10 py-2 focus:outline-none focus:ring-1 focus:ring-accent text-sm"
              />
              <button type="submit" className="absolute right-3 top-2.5 text-textSecondary hover:text-accent">
                <Search size={18} />
              </button>
            </form>
            <a
              href={getWhatsAppLink('Hi, I would like to make an enquiry.')}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#1DA851] text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium transition-colors"
            >
              <MessageCircle size={18} />
              WhatsApp
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-textSecondary hover:text-textPrimary focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-surface border-b border-border">
          <div className="px-4 pt-2 pb-4 space-y-1">
            <form onSubmit={handleSearch} className="relative mb-4">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background text-textPrimary border border-border rounded-full pl-4 pr-10 py-2 focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <button type="submit" className="absolute right-3 top-2.5 text-textSecondary">
                <Search size={18} />
              </button>
            </form>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === link.path ? 'bg-primary/20 text-accent' : 'text-textSecondary hover:bg-border hover:text-textPrimary'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <a
              href={getWhatsAppLink('Hi, I would like to make an enquiry.')}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="mt-4 w-full bg-[#25D366] text-white px-4 py-3 rounded-md flex justify-center items-center gap-2 text-base font-medium"
            >
              <MessageCircle size={20} />
              Enquire on WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
