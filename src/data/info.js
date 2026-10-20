export const businessInfo = {
  name: "GR & Company Stationery",
  shortName: "GR & Company Stationery",
  location: "Jaipur, Rajasthan",
  address: "[UPDATE WITH VERIFIED ADDRESS], Tripolia Bazar Area, Jaipur, Rajasthan, India",
  phone: "[UPDATE WITH VERIFIED PHONE]",
  whatsappNumber: "919999999999", // Placeholder, requires country code
  email: "contact@grcompanystationery.com", // Placeholder
  hours: "Monday - Saturday: 10:00 AM - 8:00 PM (Sunday Closed)",
  description: "A modern, premium stationery destination rooted in the heart of Jaipur. From everyday school stationery to office essentials, art supplies, and bulk requirements.",
};

export const getWhatsAppLink = (message) => {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${businessInfo.whatsappNumber}?text=${encodedMessage}`;
};
