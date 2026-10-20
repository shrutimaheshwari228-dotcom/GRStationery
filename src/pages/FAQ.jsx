import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const faqs = [
    {
      q: "Do you provide stationery for schools?",
      a: "Yes, we provide a complete range of school stationery including notebooks, writing instruments, geometry boxes, and art supplies for students of all ages."
    },
    {
      q: "Can I enquire about bulk quantities?",
      a: "Absolutely. We cater to wholesale and bulk buyers including schools, colleges, institutions, and businesses. You can send us your bulk requirements directly via WhatsApp."
    },
    {
      q: "Can I place an enquiry through WhatsApp?",
      a: "Yes, WhatsApp is our primary and most convenient method for enquiries. Every product on our website has a direct WhatsApp link to help you easily ask about availability."
    },
    {
      q: "Do you provide office stationery?",
      a: "Yes, we stock a wide variety of office essentials such as files, folders, staplers, paper products, desk organizers, and packaging materials."
    },
    {
      q: "Do you stock art and craft supplies?",
      a: "Yes, we have a dedicated selection of art and craft materials including paints, brushes, canvases, colour pencils, and craft paper from leading brands."
    },
    {
      q: "How can I check product availability?",
      a: "The quickest way to check if a specific product is in stock is to click the 'Enquire on WhatsApp' button on the product page or send us a direct message."
    },
    {
      q: "Where is GR & Company Stationery located?",
      a: "We are located in the heart of Jaipur, near the Tripolia Bazar area. Please check our Contact page for the exact address."
    }
  ];

  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-background min-h-screen pt-10 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-textPrimary mb-6">
            Help & FAQs
          </h1>
          <p className="text-textSecondary text-lg">
            Common questions about our products and services.
          </p>
          <div className="h-1 w-20 bg-accent mx-auto rounded mt-6"></div>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`border ${openIndex === index ? 'border-accent' : 'border-border'} rounded-lg bg-surface overflow-hidden transition-colors`}
            >
              <button 
                className="w-full px-6 py-4 flex justify-between items-center text-left focus:outline-none"
                onClick={() => toggleFaq(index)}
              >
                <span className="font-semibold text-textPrimary pr-4">{faq.q}</span>
                {openIndex === index ? (
                  <ChevronUp className="text-accent flex-shrink-0" size={20} />
                ) : (
                  <ChevronDown className="text-textSecondary flex-shrink-0" size={20} />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-5 text-textSecondary text-sm leading-relaxed border-t border-border/50 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default FAQ;
