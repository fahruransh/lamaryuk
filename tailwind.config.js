/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:  { 50:'#fdf2f8',100:'#fce7f3',200:'#fbcfe8',300:'#f9a8d4',400:'#f472b6',500:'#ec4899',600:'#db2777',700:'#be185d' },
        peach:    { 50:'#fff8f1',100:'#feeee0',200:'#fddbb9',300:'#fcc18c',400:'#fa9d5b',500:'#f87c32' },
        lavender: { 50:'#f5f3ff',100:'#ede9fe',200:'#ddd6fe',300:'#c4b5fd',400:'#a78bfa',500:'#8b5cf6' },
        cream:    '#fffbf5',
        warm:     '#fff7ed',
      },
      fontFamily: { sans: ['Nunito', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
      borderRadius: { '3xl': '1.5rem', '4xl': '2rem' },
      boxShadow: {
        soft:  '0 2px 15px -3px rgba(249,168,212,0.25), 0 10px 20px -2px rgba(249,168,212,0.15)',
        card:  '0 4px 20px -2px rgba(236,72,153,0.1)',
        glow:  '0 0 20px rgba(249,168,212,0.5)',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        float:         'float 3s ease-in-out infinite',
        'slide-up':    'slideUp 0.3s ease-out',
        'fade-in':     'fadeIn 0.3s ease-out',
      },
      keyframes: {
        float:    { '0%,100%': { transform:'translateY(0)' }, '50%': { transform:'translateY(-8px)' } },
        slideUp:  { '0%': { opacity:'0', transform:'translateY(20px)' }, '100%': { opacity:'1', transform:'translateY(0)' } },
        fadeIn:   { '0%': { opacity:'0' }, '100%': { opacity:'1' } },
      },
    },
  },
  plugins: [],
};
