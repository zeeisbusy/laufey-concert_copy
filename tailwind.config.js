/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Cormorant Garamond', 'serif'],
        'mono': ['DM Mono', 'monospace'],
      },
      colors: {
        'cream': '#F5F0E8',
        'parchment': '#EDE5D0',
        'gold': '#C9A84C',
        'gold-light': '#E8C97A',
        'ink': '#1A1208',
        'rose': '#B85C6E',
        'sage': '#6B7C6E',
        'vvip': '#C9A84C',
        'vip': '#9B7EC8',
        'festival': '#5B9BD5',
        'regular': '#6BA896',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'fade-up': 'fadeUp 0.6s ease forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(30px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}