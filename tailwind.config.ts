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
          shadow: 'var(--color-primary-deep)',
          deep: 'var(--color-primary-deep)',
        },
        secondary: {
          default: 'var(--color-secondary)',
          deep: 'var(--color-secondary-deep)'
        },
        tertiary: {
          default: 'var(--color-tertiary)',
          shadow: 'var(--color-tertiary-deep)',
          deep: 'var(--color-tertiary-deep)',
        },
        success: {
          default: 'var(--color-success)',
          shadow: 'var(--color-success-deep)',
          deep: 'var(--color-success-deep)',
        },
        premium: {
          default: 'var(--color-premium)',
          shadow: 'var(--color-premium-deep)',
          deep: 'var(--color-premium-deep)',
        },
      }
    }
  },
  plugins: []
}
export default config
