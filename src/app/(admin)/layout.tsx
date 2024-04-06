'use client'

import { getUser } from '@/actions/get-user'
import { Button } from '@/components/Button/Button'
import { Card } from '@/components/Card/Card'
import { Loading } from '@/components/Loading/Loading'
import { BaseNavigation } from '@/components/Navigation/BaseNavigation'
import { useUser } from '@clerk/nextjs'
import { User } from '@prisma/client'
import { Languages, Plus } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Toaster } from 'sonner'

const Navigation = [
  {
    name: 'Courses',
    href: '/dashboard',
    icon: Languages
  },
  {
    name: 'Add Lessons',
    href: '/dashboard/create-course',
    icon: Plus
  }
]

// admin security can be improved by switching to a server-side check/ component
// but for now, this is good enough for the demo
export default function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const path = usePathname()

  useEffect(() => {
    const getUserData = async () => {
      const response = await getUser()

      if (response) {
        setUser(response)
      }
    }

    try {
      getUserData()
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoaded(true)
    }

    console.log('fetching user data... ONCE ONLY')
  }, [])

  if (!isLoaded || !user) {
    return <Loading />
  }

  if (user && user.role !== 'ADMIN') {
    return (
      <div className='max-w-[700px] mx-auto my-10'>
        <Card theme={'danger'}>
          <h1 className='text-xl font-medium font-display'>Access Denied</h1>
          <p className='text-lg font-body'>
            You are not authorized to view this page, by the way it&apos;s a
            cool dashboard :)
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className='pl-64'>
      <BaseNavigation className='w-64'>
        <div className='flex flex-col space-y-2'>
          {Navigation.map((item, index) => (
            <Button
              key={index}
              icon={<item.icon size={28} />}
              type='link'
              href={item.href}
              theme={path === item.href ? 'outline' : 'ghost'}
              text={item.name}
              className='w-full'></Button>
          ))}
        </div>
      </BaseNavigation>

      <main className='max-w-[1056px] mx-auto p-6'>{children}</main>
      <Toaster position='bottom-right' />
    </div>
  )
}
