'use client'

import { getUserPosition } from '@/actions/leaderboard'
import { Card } from '@/components/Card/Card'
import { Loading } from '@/components/Loading/Loading'
import { useGlobalState } from '@/hooks/useGlobalState'
import { useUser } from '@clerk/nextjs'
import { User } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Profile() {
  const [userData, setUserData] = useState<User>()
  const [leaderboardPosition, setLeaderboardPosition] = useState<number>(-1)
  const { user, isLoaded } = useUser()
  const { user: userDataFromDatabase, allCourses } = useGlobalState()

  console.log(allCourses)
  useEffect(() => {
    if (!userDataFromDatabase) return

    setUserData(userDataFromDatabase)
  }, [userDataFromDatabase])

  useEffect(() => {
    const getUserLeaderboardPosition = async () => {
      if (!userData) return

      const data = await getUserPosition(userData.id)
      setLeaderboardPosition(data)
    }

    getUserLeaderboardPosition()
  }, [userData])

  if (!isLoaded) {
    return <Loading />
  }

  if (!user) {
    return (
      <div className='my-10'>
        <p>
          Please <Link href='/sign-in'>sign in</Link> to view your profile.
        </p>
      </div>
    )
  }

  if (!userData || !allCourses) {
    return <Loading />
  }

  const joinedDate: string = new Date(userData.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  })

  return (
    <div className='my-10'>
      <Image
        src={user.imageUrl}
        alt={user.fullName || 'profile picture'}
        width={100}
        height={100}
        className='rounded-full object-cover'
        priority={true}
      />

      <div className='grid grid-cols-2 gap-4'>
        <div className='justify-self-start'>
          <h1 className='text-3xl font-bold mt-6 font-display text-neutral-700'>{user.fullName}</h1>
          <p className='text-neutral-500'>Joined at {joinedDate}</p>
        </div>
        <div className='flex gap-2 justify-self-end self-end'>
          {allCourses.map(course => {
            return (
              <div key={course.id}>
                <div className='w-10 h-8'>
                  <svg pointerEvents={'none'}>
                    <use xlinkHref={'/svg/flags.svg#' + course.language} className='scale-[50%]' />
                  </svg>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className='border-b-2 my-10'></div>

      {/* BEGIN: STATISTICS */}
      <div>
        <h1 className='text-3xl font-bold mt-6 font-display text-neutral-700'>Statistics</h1>

        <div className='grid grid-cols-2 gap-6 mt-4'>
          <Card theme={'default'} className='flex gap-4 py-3'>
            <div>
              <svg width='22' height='30' viewBox='0 0 22 30' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M14.0367 2.67272C13.8379 0.718003 11.3282 0.0455378 10.1787 1.63898L0.717665 14.7538C-0.157342 15.9667 0.452676 17.6801 1.89732 18.0672L7.2794 19.5093L8.07445 27.3273C8.27323 29.282 10.7829 29.9545 11.9324 28.361L21.3935 15.2462C22.2685 14.0333 21.6585 12.3199 20.2138 11.9328L14.8317 10.4907L14.0367 2.67272Z'
                  fill='#FFD900'
                />
                <path
                  d='M2.574 16.4882C2.08457 16.3561 2.03731 15.6803 2.50359 15.4813L6.24415 13.8853C6.58188 13.7412 6.96093 13.973 6.98654 14.3393L7.17226 16.9952C7.19787 17.3615 6.85477 17.6438 6.50027 17.5481L2.574 16.4882Z'
                  fill='#F7C100'
                />
                <path
                  d='M19.717 13.2505C20.2064 13.3826 20.2537 14.0584 19.7874 14.2573L16.0469 15.8533C15.7091 15.9974 15.3301 15.7656 15.3045 15.3993L15.1188 12.7435C15.0931 12.3772 15.4362 12.0949 15.7907 12.1906L19.717 13.2505Z'
                  fill='#FFEF8F'
                />
              </svg>
            </div>
            <div>
              <h3 className='text-neutral-800 font-display mb-1 text-xl'>{userData.xp}</h3>
              <p className='text-neutral-400'>Total XP</p>
            </div>
          </Card>
          <Card theme={'default'} className='flex gap-4 py-3'>
            <div>
              <svg width='19' height='23' viewBox='0 0 19 23' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M1.82666 9.00208H16.6593V21.34C16.6593 22.3484 15.6622 23.0538 14.7113 22.718L9.24298 20.787L3.77461 22.718C2.82378 23.0538 1.82666 22.3484 1.82666 21.34V9.00208Z'
                  fill='#CE9969'
                />
                <path
                  d='M16.6094 14.679C13.6924 18.7474 8.02951 19.6808 3.96106 16.7638C-0.107377 13.8468 -1.04078 8.18393 1.87625 4.11548C4.79328 0.0470419 10.4561 -0.886362 14.5246 2.03067C18.593 4.9477 19.5264 10.6105 16.6094 14.679Z'
                  fill='#FFD900'
                />
                <path
                  d='M3.96106 16.7639C8.02951 19.6809 13.6924 18.7475 16.6094 14.6791L1.87625 4.1156C-1.04078 8.18404 -0.107377 13.8469 3.96106 16.7639Z'
                  fill='#FFE346'
                />
                <path
                  d='M14.9153 9.39721C14.9153 12.5301 12.3756 15.0699 9.24267 15.0699C6.10976 15.0699 3.57003 12.5301 3.57003 9.39721C3.57003 6.2643 6.10976 3.72457 9.24267 3.72457C12.3756 3.72457 14.9153 6.2643 14.9153 9.39721Z'
                  stroke='#FFC700'
                  strokeWidth='1.83928'
                />
                <path
                  d='M11.4074 6.47638C11.122 6.19103 11.122 5.72839 11.4074 5.44304L12.7048 4.14565C12.9901 3.8603 13.4527 3.8603 13.7381 4.14565L15.0355 5.44304C15.3208 5.72839 15.3208 6.19103 15.0355 6.47638L13.7381 7.77376C13.4527 8.05911 12.9901 8.05911 12.7048 7.77376L11.4074 6.47638Z'
                  fill='white'
                />
              </svg>
            </div>
            <div>
              {userData.xp < 1 ? (
                <div className='text-neutral-500'>Start learning to compete in the leaderboard</div>
              ) : (
                <>
                  <h3 className='text-neutral-800 font-display mb-1 text-xl'>
                    {leaderboardPosition === -1 ? 'loading...' : leaderboardPosition}
                  </h3>
                  <p className='text-neutral-400'>Leaderboard position</p>
                </>
              )}
            </div>
          </Card>
        </div>
      </div>
      {/* END: STATISTICS */}
    </div>
  )
}
