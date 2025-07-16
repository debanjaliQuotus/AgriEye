import tailwindScrollbar from 'tailwind-scrollbar';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        'xs': '475px',      // Extra small devices (large phones)
        'sm': '640px',      // Small tablets and portrait tablets
        'md': '768px',      // Landscape tablets
        'lg': '1024px',     // Small laptops
        'xl': '1280px',     // Desktops
        '2xl': '1536px',    // Large desktops
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in-left': 'slideInLeft 0.3s ease-in-out',
        'slide-out-left': 'slideOutLeft 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideOutLeft: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      width: {
        'sidebar-expanded': '16rem',    // 256px
        'sidebar-collapsed': '4rem',     // 64px
      },
      zIndex: {
        'sidebar': '40',
        'sidebar-overlay': '30',
        'header': '20',
      },
    },
  },
  plugins: [
    tailwindScrollbar
  ],
} as const;