/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7f0',
          100: '#fdecd8',
          200: '#fbd5b0',
          300: '#f8b87d',
          400: '#f49447',
          500: '#f17a2a',
          600: '#e25f1f',
          700: '#bc471c',
          800: '#963a1e',
          900: '#7a321c',
        },
        accent: {
          50: '#f6f7f6',
          100: '#e3e7e3',
          200: '#c7d0c7',
          300: '#a3b1a3',
          400: '#7a8c7a',
          500: '#5f715f',
          600: '#4a5a4a',
          700: '#3d483d',
          800: '#333b33',
          900: '#2c322c',
        },
        warm: {
          50: '#fdf8f3',
          100: '#f9e8d8',
          200: '#f2d1b5',
          300: '#e9b388',
          400: '#dd8f5a',
          500: '#d4753a',
          600: '#c5622f',
          700: '#a44d28',
          800: '#833f28',
          900: '#6b3624',
        },
        cream: {
          50: '#fefefe',
          100: '#fdfcf9',
          200: '#faf7f2',
          300: '#f5efe6',
          400: '#ede2d1',
          500: '#e2d3bc',
          600: '#d4c1a3',
          700: '#c2ab87',
          800: '#a8926e',
          900: '#8f7a5c',
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Playfair Display", "serif"],
        craft: ["Crimson Text", "serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "float": "float 3s ease-in-out infinite",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
      },
      boxShadow: {
        'craft': '0 4px 20px rgba(244, 148, 71, 0.15)',
        'craft-lg': '0 10px 40px rgba(244, 148, 71, 0.2)',
        'warm': '0 4px 20px rgba(212, 117, 58, 0.12)',
        'warm-lg': '0 10px 40px rgba(212, 117, 58, 0.18)',
      },
    },
  },

  plugins: [],
};
