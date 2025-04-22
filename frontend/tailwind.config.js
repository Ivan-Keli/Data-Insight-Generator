/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {
        typography: {
          DEFAULT: {
            css: {
              maxWidth: '100ch',
              code: {
                color: '#1a56db',
                backgroundColor: '#ebf5ff',
                fontWeight: '400',
                paddingLeft: '4px',
                paddingRight: '4px',
                paddingTop: '2px',
                paddingBottom: '2px',
                borderRadius: '0.25rem',
              },
              'code::before': {
                content: '""',
              },
              'code::after': {
                content: '""',
              },
              pre: {
                color: '#e5e7eb',
                backgroundColor: '#1f2937',
                borderRadius: '0.375rem',
                padding: '1rem',
              },
              'pre code': {
                backgroundColor: 'transparent',
                color: 'inherit',
                padding: '0',
                fontWeight: 'inherit',
              },
            },
          },
        },
      },
    },
    plugins: [
      require('@tailwindcss/typography'),
    ],
  };
