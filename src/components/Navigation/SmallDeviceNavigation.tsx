'use client'

import { UserNavigationList } from '@/lib/nav'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'

export const SmallDeviceNavigation = () => {
  const { isLoaded, isSignedIn, user } = useUser()

  return (
    <nav className='md:hidden fixed bottom-0 left-0 w-full bg-white px-2 py-4 z-10 border-t'>
      <div className='flex justify-around'>
        {UserNavigationList.map(link => (
          <Link key={link.href} href={link.href}>
            <div className='w-9 h-9 flex items-center'>{link.icon}</div>
          </Link>
        ))}

        {isSignedIn && isLoaded && (
          <Link href='/profile'>
            <div className='w-9 h-9 flex items-center'>
              <Image
                src={user.imageUrl}
                alt={user.fullName || 'profile image'}
                width={36}
                height={36}
                className='rounded-full'
              />
            </div>
          </Link>
        )}
      </div>
    </nav>
  )
}
