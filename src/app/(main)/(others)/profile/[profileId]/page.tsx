'use client'

import { getUserEnrolledCourses } from '@/actions/course'
import { getUser } from '@/actions/get-user'
import { getUserPosition } from '@/actions/leaderboard'
import { Card } from '@/components/Card/Card'
import { ICONS } from '@/lib/Icons'
import { cn } from '@/lib/utils'
import { Course, User } from '@prisma/client'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ProfileView() {
  const [user, setUser] = useState<User | null>()
  const [allCourses, setAllCourses] = useState<Course[]>([])
  const [mount, setMount] = useState(false)
  const [leaderboardPosition, setLeaderboardPosition] = useState<number>(-1)

  const { profileId } = useParams() as { profileId: string }

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getUser(profileId)
      const courseData = await getUserEnrolledCourses(profileId, true)
      setUser(data)
      setAllCourses(courseData.map(course => course.course))

      setMount(true)
    }

    fetchUser()
  }, [])

  useEffect(() => {
    const getUserLeaderboardPosition = async () => {
      if (!user) return

      const data = await getUserPosition(user.id)
      setLeaderboardPosition(data)
    }

    getUserLeaderboardPosition()
  }, [user])

  if (!mount) {
    return null
  }

  if (!user || !allCourses) {
    return (
      <div>
        <p className='my-10'> Please try letter or contact support </p>
      </div>
    )
  }

  const joinedDate: string = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  })

  const imageUrl = user.imageUrl

  return (
    <div className='my-10'>
      {!imageUrl && (
        <div className='flex items-center justify-center h-20 w-20 rounded-full bg-black text-white font-display text-2xl'>
          {(user.name || 'Anonymous')
            .split(' ')
            .map(n => n[0].toUpperCase())
            .join('')}
        </div>
      )}

      {imageUrl && (
        <Image
          src={imageUrl}
          alt={user.name || 'profile picture'}
          width={100}
          height={100}
          className='rounded-full object-cover'
          priority={true}
        />
      )}

      <div className='grid grid-cols-2'>
        <h1
          className={cn(
            'col-span-2 text-3xl font-bold mt-6 font-display text-neutral-700',
            leaderboardPosition === 1 && 'premium-cta'
          )}>
          {user.name}
        </h1>
        <div className='self-end'>
          <p className='text-neutral-500'>Joined at {joinedDate}</p>
        </div>
        <div className='flex items-end justify-end gap-2'>
          {allCourses.map(course => {
            return (
              <div key={course.id}>
                <div className='w-10 h-8 overflow-hidden'>
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
          <Card
            theme={'default'}
            className='flex flex-col md:flex-row items-center md:items-stretch text-center md:text-left gap-4 py-3'>
            <div>{ICONS.lightningStrike}</div>
            <div>
              <h3 className='text-neutral-800 font-display mb-1 text-xl'>{user.xp}</h3>
              <p className='text-neutral-400'>Total XP</p>
            </div>
          </Card>
          <Card
            theme={'default'}
            className='flex flex-col md:flex-row items-center md:items-stretch text-center md:text-left gap-4 py-3'>
            <div>
              {leaderboardPosition === 1 ? <div className='w-10 h-10'>{ICONS.trophy}</div> : ICONS.lightningStrike}
            </div>
            <div>
              {user.xp < 1 ? (
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
