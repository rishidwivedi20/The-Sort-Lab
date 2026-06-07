/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        border: 'var(--color-border)',
        text: 'var(--color-text)',
        textMuted: 'var(--color-text-muted)',
        accent: 'var(--color-accent)',
        
        // Sorting states
        state: {
          default: 'var(--color-state-default)',
          comparing: 'var(--color-state-comparing)',
          swapping: 'var(--color-state-swapping)',
          pivot: 'var(--color-state-pivot)',
          sorted: 'var(--color-state-sorted)',
        }
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      }
    },
  },
  plugins: [],
}
