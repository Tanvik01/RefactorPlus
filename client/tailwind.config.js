/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          bg: '#1E1F26',
          surface: '#26272F',
          surfaceElevated: '#2D2F38',
          border: '#333540',
          borderSubtle: '#2C2E38',
          text: '#E8E6E1',
          textMuted: '#9A9C9B',
          textDim: '#6C6E75',
        },
        diff: {
          add: '#8FBC8F',
          addBg: 'rgba(143, 188, 143, 0.12)',
          remove: '#C77B72',
          removeBg: 'rgba(199, 123, 114, 0.12)'
        },
        /* RESERVED ONLY FOR REVIEW ANNOTATIONS/COMMENTS */
        reviewer: {
          accent: '#E8B563',
          bg: 'rgba(232, 181, 99, 0.08)',
          border: 'rgba(232, 181, 99, 0.35)'
        }
      },
      fontFamily: {
        sans: ['Public Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      }
    },
  },
  plugins: [],
}
