'use client'

import { Button } from '@/components/Button/Button'
import { UserNavigationList } from '@/lib/nav'
import { cn } from '@/lib/utils'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export const UserNavigation = () => {
  const { isLoaded, isSignedIn, user } = useUser()
  const path = usePathname()

  return (
    <div className='flex flex-col gap-2'>
      {UserNavigationList.map(link => (
        <Button
          key={link.href}
          theme={path === link.href ? 'outline' : 'ghost'}
          href={link.href}
          type='link'
          className={cn(path !== link.href ? 'text-neutral-500' : '', 'justify-center lg:justify-start')}>
          <div className='w-8 h-8 lg:mr-3 flex items-center'>{link.icon}</div>
          <div className='hidden lg:block h-5'>{link.name}</div>
        </Button>
      ))}

      {isLoaded && isSignedIn && user && (
        <Button
          theme={path === '/profile' ? 'outline' : 'ghost'}
          href={'/profile'}
          type='link'
          className={cn(path !== '/profile' ? 'text-neutral-500' : '', 'justify-center lg:justify-start')}>
          <div className='w-8 h-8 lg:mr-3 flex items-center'>
            {<Image src={user.imageUrl} alt='user profile image' height={32} width={32} className='rounded-full' />}
          </div>
          <div className='hidden lg:block h-5'>Profile</div>
        </Button>
      )}
    </div>
  )
}
