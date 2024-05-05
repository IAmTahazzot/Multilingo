import './globals.css'
import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from 'sonner'
import { NetworkProvider } from '@/providers/NetworkProvider'
import { displayFont, bodyFont } from '@/lib/fonts'
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
        <body className={cn(displayFont.variable, bodyFont.variable, bodyFont.className)}>
          {children}
          <Toaster position='bottom-right' />
          <NetworkProvider />
        </body>
      </html>
    </ClerkProvider>
  )
}
