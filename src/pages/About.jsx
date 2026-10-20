import React from 'react';
import { businessInfo } from '../data/info';

const About = () => {
  return (
    <div className="bg-background min-h-screen pt-10 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-textPrimary mb-6">
            About GR & Company Stationery
          </h1>
          <div className="h-1 w-20 bg-accent mx-auto rounded"></div>
        </div>

        <div className="relative aspect-[21/9] mb-12 rounded-lg overflow-hidden border border-border shadow-lg">
          <img 
            src="https://images.unsplash.com/photo-1497005367839-6e852de72767?auto=format&fit=crop&q=80&w=1600" 
            alt="Stationery desk arrangement" 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="prose prose-invert prose-lg max-w-none text-textSecondary">
          <p className="lead text-xl text-textPrimary font-medium mb-8">
            Rooted in the vibrant Pink City of Jaipur, {businessInfo.name} is your trusted local destination for everyday stationery and office essentials.
          </p>
          
          <p className="mb-6">
            We provide a comprehensive range of stationery and related supplies designed to meet the everyday needs of students, parents, artists, institutions, offices, and bulk buyers. Whether you are stocking up for the new school year or sourcing essential supplies for your business operations, we aim to offer quality products with reliable service.
          </p>

          <h2 className="text-2xl font-serif font-bold text-textPrimary mt-12 mb-4">Our Focus</h2>
          <ul className="space-y-4 mb-8 list-none pl-0">
            <li className="flex items-start gap-3">
              <span className="text-accent mt-1">●</span>
              <span><strong>Product Variety:</strong> A wide selection spanning from basic writing instruments to specialized art materials and office organization tools.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent mt-1">●</span>
              <span><strong>Retail & Bulk:</strong> Catering equally to individual retail customers and wholesale or bulk institutional requirements.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent mt-1">●</span>
              <span><strong>Customer Convenience:</strong> Streamlining the enquiry process through direct WhatsApp communication to save your time.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent mt-1">●</span>
              <span><strong>Local Presence:</strong> Conveniently accessible in Jaipur, serving our local community with dedication and product knowledge.</span>
            </li>
          </ul>

          <h2 className="text-2xl font-serif font-bold text-textPrimary mt-12 mb-4">A Modern Digital Catalogue</h2>
          <p className="mb-6">
            While we are not an e-commerce platform, this website is built to serve as our comprehensive digital catalogue. We want you to easily browse our categories, discover trusted brands, and reach out to us effortlessly via WhatsApp for orders, pricing, and availability. 
          </p>
        </div>
        
      </div>
    </div>
  );
};

export default About;
