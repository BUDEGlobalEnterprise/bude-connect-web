/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "../shared/src/**/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/frappe-ui/src/**/*.{vue,js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // Royal Blue Primary Theme - BudeGlobal Brand
        primary: {
          50: '#eef4ff',
          100: '#e0eaff',
          200: '#c7d9fe',
          300: '#a5c1fc',
          400: '#819df8',
          500: '#6479f1',
          600: '#4169E1', // Royal Blue - brand color
          700: '#3a4fd4',
          800: '#3242ab',
          900: '#2e3c87',
        },
        accent: {
          50: '#eef4ff',
          100: '#e0eaff',
          200: '#c7d9fe',
          300: '#a5c1fc',
          400: '#819df8',
          500: '#5b7ceb',
          600: '#4169E1',
          700: '#3651c9',
          800: '#2d42a3',
          900: '#293c81',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 40px rgba(65, 105, 225, 0.4), 0 0 20px rgba(65, 105, 225, 0.3)',
        'card': '0 4px 6px -1px rgba(65, 105, 225, 0.1), 0 2px 4px -1px rgba(65, 105, 225, 0.06)',
        'card-hover': '0 20px 25px -5px rgba(65, 105, 225, 0.1), 0 10px 10px -5px rgba(65, 105, 225, 0.04)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.7s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
