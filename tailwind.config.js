/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'delaware-blue': '#002B5C',
        'delaware-gold': '#CB9C30',
        'delaware-gray': '#A8BDBE',
        'delaware-brown': '#6D5544',
        'delaware-tan': '#A4977D',
        'success': '#10B981',
        'warning': '#F59E0B',
        'error': '#EF4444',
      },
    },
  },
  plugins: [],
}
