/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Enerjik yeşil paleti — fitness/sağlık teması
        brand: {
          DEFAULT: '#16A34A',
          light: '#22C55E',
          dark: '#15803D',
          soft: '#DCFCE7',
        },
        ink: '#0F172A',
        muted: '#64748B',
        surface: '#FFFFFF',
        canvas: '#F1F5F9',
        protein: '#3B82F6',
        carbs: '#F59E0B',
        fat: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(15,23,42,0.08), 0 1px 2px rgba(15,23,42,0.04)',
      },
    },
  },
  plugins: [],
};
