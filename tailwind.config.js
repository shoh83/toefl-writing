/* eslint-disable @typescript-eslint/no-require-imports */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',      // <— covers layout.tsx and page.tsx
    './src/components/**/*.{js,ts,jsx,tsx}',   // <— covers your ScoreCircle, etc.
    './src/hooks/**/*.{js,ts,jsx,tsx}',        // <— covers useDiffLoader
    './src/utils/**/*.{js,ts}',                // <— optional, if you ever use classes there
    './src/app/globals.css',                   // <— your tailwind directives
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
    // ...other plugins
  ],
};
