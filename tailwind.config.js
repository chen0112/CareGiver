module.exports = {
  content: [
    "./src/**/*.html",
    "./src/**/*.js",
    "./src/**/*.jsx", // if you're using JSX
    "./src/**/*.ts",  // if you're using TypeScript
    "./src/**/*.tsx", // if you're using TypeScript with JSX
    // etc.
  ],
  theme: {
    extend: { fontSize: {
      'customFontSize': '0.55rem'},
      maxHeight: {
        '128': '32rem',
      },
      colors: {
        'regal-blue': '#243c5a',
        'warm-beige': '#F5F5DC',
        'soft-peach': '#FED4B6',
        'light-coral': '#F88379',
        'rusty-red': '#DA2C43',
        'dark-gray': '#333333',
        'light-gray': '#D3D3D3',
    }},
  },
  variants: {},
  plugins: [
    require('@tailwindcss/aspect-ratio')
  ],
};
