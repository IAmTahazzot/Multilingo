'use client'

import { Button } from '@/components/Button/Button'
import { BaseNavigation } from '@/components/Navigation/BaseNavigation'
import { useUser } from '@clerk/nextjs'
import { LayoutDashboard } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'


export default function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  const { user, isLoaded, isSignedIn } = useUser()
  const path = usePathname()

  return (
    <div className='pl-64'>
      <BaseNavigation className='w-64'>
        <div className='flex flex-col space-y-2'>
          <Button
            icon={<LayoutDashboard size={28} />}
            type='link'
            href='/dashboard'
            theme={path === '/dashboard' ? 'outline' : 'ghost'}
            text='Overview'
            className='w-full'></Button>

          <Button
            type='link'
            href='/dashboard/create-course'
            theme={path === '/dashboard/create-course' ? 'outline' : 'ghost'}
            text='Create Course'
            className='w-full'></Button>
        </div>
      </BaseNavigation>

      <main className='max-w-[1056px] mx-auto p-6'>{children}</main>
    </div>
  )
}
