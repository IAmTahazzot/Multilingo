'use client'

import { useGlobalState } from '@/hooks/useGlobalState'
import { PremiumAdsCard } from './Activity/PremiumAdsCard'
import { UserCourseDetails } from './Activity/UserCourseDetails'
import { LeaderBoardCard } from './Activity/LeaderboardCard'

export const UserActivity = () => {
  const { user } = useGlobalState()

  if (!user) {
    return null
  }

  return (
    <aside>
      <div className='sticky top-0 z-10'>
        <div className='bg-white h-4'></div>
        <UserCourseDetails />

        <div className='mt-6 space-y-6'>
          {user.tier === 'FREE' && <PremiumAdsCard />}
          <LeaderBoardCard />
        </div>
      </div>
    </aside>
  )
}
