/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#121212', // Near Black
        surface: '#1E1E1E', // Deep Charcoal
        primary: '#6B2D30', // Deep Muted Burgundy
        primaryDark: '#501F22',
        secondary: '#4A3728', // Dark Coffee Brown
        accent: '#8C4535', // Dark Terracotta
        textPrimary: '#F5F2EB', // Warm Cream
        textSecondary: '#D9CFC1', // Sandstone Beige
        border: '#2A2A2A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Lora', 'serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(to bottom, rgba(18, 18, 18, 0.2), rgba(18, 18, 18, 0.9))',
      },
      borderRadius: {
        'jaipur': '2rem',
      }
    },
  },
  plugins: [],
}
