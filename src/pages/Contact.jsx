import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import { businessInfo, getWhatsAppLink } from '../data/info';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    alert("Thank you for your enquiry. We will get back to you soon!");
    setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="bg-background min-h-screen pt-10 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-textPrimary mb-6">
            Contact Us
          </h1>
          <p className="text-textSecondary text-lg max-w-2xl mx-auto">
            Get in touch for product enquiries, bulk orders, or any other assistance. We're here to help.
          </p>
          <div className="h-1 w-20 bg-accent mx-auto rounded mt-6"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Details & Map */}
          <div>
            <h2 className="text-2xl font-serif font-bold text-textPrimary mb-8">Visit Our Store</h2>
            
            <div className="space-y-6 mb-10">
              <div className="flex items-start gap-4">
                <div className="bg-surface p-3 rounded-full border border-border text-accent">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="text-textPrimary font-semibold mb-1">Location</h3>
                  <p className="text-textSecondary">{businessInfo.address}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-surface p-3 rounded-full border border-border text-accent">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="text-textPrimary font-semibold mb-1">Business Hours</h3>
                  <p className="text-textSecondary">{businessInfo.hours}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-surface p-3 rounded-full border border-border text-accent">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="text-textPrimary font-semibold mb-1">Phone & WhatsApp</h3>
                  <p className="text-textSecondary mb-2">{businessInfo.phone}</p>
                  <a href={getWhatsAppLink('Hi, I am looking to contact you.')} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[#25D366] hover:underline font-medium text-sm">
                    <MessageCircle size={16} /> Chat on WhatsApp
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-surface p-3 rounded-full border border-border text-accent">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="text-textPrimary font-semibold mb-1">Email</h3>
                  <p className="text-textSecondary">{businessInfo.email}</p>
                </div>
              </div>
            </div>

            {/* Google Maps Embed Placeholder */}
            <div className="w-full h-64 bg-surface border border-border rounded-lg overflow-hidden flex items-center justify-center">
               <p className="text-textSecondary text-sm">[Google Maps Embed Here - Requires Verified Location]</p>
            </div>
            <button className="mt-4 text-accent hover:underline font-medium text-sm inline-flex items-center gap-1">
              Get Directions <ArrowRight size={14} />
            </button>
          </div>

          {/* Contact Form */}
          <div className="bg-surface border border-border rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-serif font-bold text-textPrimary mb-8">Send an Enquiry</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-2">Name *</label>
                  <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-background border border-border rounded px-4 py-2.5 text-textPrimary focus:outline-none focus:border-accent transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-2">Phone Number *</label>
                  <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-background border border-border rounded px-4 py-2.5 text-textPrimary focus:outline-none focus:border-accent transition-colors" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-textSecondary mb-2">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-background border border-border rounded px-4 py-2.5 text-textPrimary focus:outline-none focus:border-accent transition-colors" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-textSecondary mb-2">What are you looking for?</label>
                <select name="subject" value={formData.subject} onChange={handleChange} className="w-full bg-background border border-border rounded px-4 py-2.5 text-textPrimary focus:outline-none focus:border-accent transition-colors">
                  <option value="">Select an option</option>
                  <option value="General Enquiry">General Enquiry</option>
                  <option value="School Stationery">School Stationery</option>
                  <option value="Office & Bulk Supply">Office & Bulk Supply</option>
                  <option value="Art & Craft Materials">Art & Craft Materials</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-textSecondary mb-2">Message *</label>
                <textarea required rows="4" name="message" value={formData.message} onChange={handleChange} className="w-full bg-background border border-border rounded px-4 py-2.5 text-textPrimary focus:outline-none focus:border-accent transition-colors"></textarea>
              </div>
              
              <button type="submit" className="w-full btn-primary mt-2">
                Send Enquiry
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

// Import needed for Get Directions icon
import { ArrowRight } from 'lucide-react';

export default Contact;
