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
    extend: {},
  },
  variants: {},
  plugins: [
    require('@tailwindcss/aspect-ratio')
  ],
};
