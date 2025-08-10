const purgecssModule = require('@fullhuman/postcss-purgecss');
const purgecss = purgecssModule.default || purgecssModule;

module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    // Purge unused CSS in production builds only
    ...(process.env.NODE_ENV === 'production'
      ? [
          purgecss({
            content: [
              './index.html',
              './src/**/*.{js,jsx,ts,tsx}',
              './components/**/*.{js,jsx,ts,tsx}',
              './pages/**/*.{js,jsx,ts,tsx}',
              './node_modules/daisyui/dist/**/*.js',
            ],
            defaultExtractor: (content) => content.match(/[^\r\n\t\f\s\"'`<>!=:;(){}\[\],]+/g) || [],
            safelist: {
              standard: [
                /^(from|to|via)-/, // gradients
                /^(bg|text|border|shadow|ring|fill|stroke|animate|transition|duration|ease|delay|opacity|scale|translate|rotate|skew|backdrop|blur)-/,
                /data-theme/,
                /daisyui/,
                // dynamic classes used by app
                /(w|h|max-w|max-h)-\d+/,
                /(mx|my|px|py|m|p)-\d+/,
                /rounded(-[a-z]+)?/,
              ],
              deep: [/^swiper-/, /^react-toast/],
              greedy: [/^btn/, /^dropdown/, /^menu/, /^avatar/, /^modal/, /^toast/, /^tooltip/],
            },
          }),
        ]
      : []),
  ],
}