import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        display: 'var(--display-font)',
        body: 'var(--body-font)'
      },
      colors: {
        primary: {
          default: 'var(--color-primary)',
          shadow: '#46a302'
        },
        premium: {
          default: 'var(--color-premium)',
          shadow: '#3f22ec'
        }
      }
    }
  },
  plugins: []
}
export default config
