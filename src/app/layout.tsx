import type { Metadata } from 'next'
import './globals.css'
import { displayFont, bodyFont } from '@/lib/fonts'
import { ClerkProvider } from '@clerk/nextjs'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Multilingo: Language Learning Platform',
  description: 'Learn a new language with MultiLingo! 🌍📚🎉'
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
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
    </ClerkProvider>
  )
}
