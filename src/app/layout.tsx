import type { Metadata } from 'next'
import './globals.css'
import { cn } from '@/lib/utils'
import { displayFont, bodyFont } from '@/lib/fonts'

export const metadata: Metadata = {
  title: 'Multilingo: Language Learning Platform',
  description: 'Learn a new language with MultiLingo! 🌍📚🎉'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body
        className={cn(
          displayFont.variable,
          bodyFont.variable,
          bodyFont.className
        )}>
        {children}
      </body>
    </html>
  )
}
