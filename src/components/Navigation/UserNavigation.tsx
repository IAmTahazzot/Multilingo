'use client'

import { Button } from '@/components/Button/Button'
import { UserNavigationList } from '@/lib/nav'
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
          text={link.name}
          icon={link.icon}
          type='link'
          className={path !== link.href ? 'text-neutral-500' : ''}
        />
      ))}

      {isLoaded && isSignedIn && user && (
        <Button
          theme={path === '/profile' ? 'outline' : 'ghost'}
          href={'/profile'}
          text='Profile'
          icon={<Image src={user.imageUrl} alt='user profile image' height={32} width={32} className='rounded-full' />}
          type='link'
          className={path !== '/profile' ? 'text-neutral-500' : ''}
        />
      )}
    </div>
  )
}
