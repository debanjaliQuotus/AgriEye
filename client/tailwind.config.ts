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
        'gradient': 'gradient 8s linear infinite',
        'float': 'float 8s ease-in-out infinite',
        'shine': 'shine 4s linear infinite',
        'flip': 'flip 0.6s ease-in-out',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        float: {
          '0%, 100%': { 
            transform: 'translateY(0) rotate(0deg)' 
          },
          '50%': { 
            transform: 'translateY(-15px) rotate(5deg)' 
          },
        },
        shine: {
          '0%': {
            'background-position': '-100% 0'
          },
          '100%': {
            'background-position': '200% 0'
          }
        },
        flip: {
          '0%': {
            transform: 'rotateY(0deg)'
          },
          '100%': {
            transform: 'rotateY(180deg)'
          }
        }
      },
      extend: {
        transformStyle: {
          'preserve-3d': 'preserve-3d',
        },
        perspective: {
          '1000': '1000px',
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
    tailwindScrollbar,
    function({ addUtilities }) {
      const newUtilities = {
        '.transform-style-preserve-3d': {
          'transform-style': 'preserve-3d',
        },
        '.perspective-1000': {
          perspective: '1000px',
        },
      }
      addUtilities(newUtilities)
    }
  ],
} as const;
