'use client'

import { useGlobalState } from '@/hooks/useGlobalState'
import { PremiumAdsCard } from './Activity/PremiumAdsCard'
import { UserCourseDetails } from './Activity/UserCourseDetails'
import { LeaderBoardCard } from './Activity/LeaderboardCard'
import { useEffect, useState } from 'react'
import { User } from '@prisma/client'
import { Loading } from '@/components/Loading/Loading'
import { usePathname } from 'next/navigation'
import { Footer } from '@/components/Footer/Footer'

export const UserActivity = () => {
  const [user, setUser] = useState<User>()
  const { user: userData } = useGlobalState()
  const pathName = usePathname()

  useEffect(() => {
    if (!userData) return

    setUser(userData)
  }, [userData])

  if (!user) {
    return <p className='text-xs my-4 text-neutral-400'>If takes longer than expected, please refresh the page.</p>
  }

  return (
    <aside className='hidden md:block'>
      <div className='sticky top-0 z-10'>
        <div className='bg-white h-4'></div>
        <UserCourseDetails />

        <div className='mt-6 space-y-6'>
          {user.tier === 'FREE' && pathName !== '/shop' && <PremiumAdsCard />}
          <LeaderBoardCard />
          <Footer />
        </div>
      </div>
    </aside>
  )
}
