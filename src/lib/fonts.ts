import localFont from 'next/font/local'

export const displayFont = localFont({
  src: '../../public/fonts/display.woff2',
  variable: '--display-font'
})

export const bodyFont = localFont({
  src: '../../public/fonts/body.woff2',
  variable: '--body-font'
})
