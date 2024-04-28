'use client'

import { getLeaderboard } from '@/actions/leaderboard'
import { Loading } from '@/components/Loading/Loading'
import { UserPositionCard } from '@/components/Pages/Leaderboard/UserPositionCard'
import { ICONS } from '@/lib/Icons'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useWindowSize } from 'react-use'

export default function LeaderboardPage() {
  const [mount, setMount] = useState(false)
  const [leaderboardUsers, setLeaderboardUsers] = useState<
    {
      id: string
      imageUrl: string | null
      name: string | null
      xp: number
    }[]
  >([])
  const { width } = useWindowSize()

  useEffect(() => {
    const fetchLeaderboardUsers = async () => {
      const data = await getLeaderboard()

      if (data) {
        setLeaderboardUsers(data)
        setMount(true)
      }
    }

    // just to show loading state :)
    fetchLeaderboardUsers()
  }, [])

  if (!mount) {
    return <Loading />
  }

  if (leaderboardUsers.length < 3) {
    return (
      <div className='my-10'>
        <h1 className='text-3xl font-display'>Leaderboard</h1>
        <p className='my-2 text-muted-foreground'>Platform require more users to display leaderboard</p>
      </div>
    )
  }

  const champions = leaderboardUsers.slice(0, 3)
  const otherUsers = leaderboardUsers.slice(3)

  const loadImage = (imageUrl: string | null, name: string) => {
    if (imageUrl) {
      return <Image src={imageUrl} alt='user' width={40} height={40} className='rounded-full' priority={false} />
    }

    return (
      <div className='flex items-center justify-center h-10 w-10 rounded-full bg-black text-white font-display'>
        {name
          .split(' ')
          .map(n => n[0].toUpperCase())
          .join('')}
      </div>
    )
  }

  return (
    <div className='my-10'>
      <h1 className='text-3xl font-display'>Leaderboard</h1>

      {width >= 768 && (
        <div className='my-20' title='champions'>
          <div className='grid grid-cols-3'>
            <div>
              <div className='w-fit mx-auto scale-[2.5]'>{ICONS.secondPlace}</div>
              <Link href={`/profile/${champions[1].id}`}>
                <div className='relative top-[50px] flex flex-col items-center gap-2'>
                  {loadImage(champions[1].imageUrl, champions[1].name || 'Unknown User')}
                  <span className='font-display text-lg'>{champions[1].name || 'Unknown User'} </span>
                </div>
              </Link>
            </div>
            <div>
              <div className='w-fit mx-auto scale-[1.7]'>{ICONS.trophy}</div>
              <Link href={`/profile/${champions[0].id}`}>
                <div className='relative top-[40px] flex flex-col items-center gap-2'>
                  {loadImage(champions[0].imageUrl, champions[0].name || 'Unknown User')}
                  <span className='font-display text-2xl premium-cta'>{champions[0].name}</span>
                </div>
              </Link>
            </div>
            <div>
              <div className='w-fit mx-auto scale-[2.5]'>{ICONS.thirdPlace}</div>
              <Link href={`/profile/${champions[2].id}`}>
                <div className='relative top-[50px] flex flex-col items-center gap-2'>
                  {loadImage(champions[2].imageUrl, champions[2].name || 'Unknown User')}
                  <span className='font-display text-lg'>{champions[2].name || 'Unknown User'}</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}

      {width >= 768 && otherUsers.length > 0 && (
        <div className='border-b-2 pb-4 mt-7'>
          <h1 className='text-xl font-display'>Others</h1>
        </div>
      )}

      <div>
        {width < 768 && (
          <>
            {champions.map((user, index) => (
              <UserPositionCard
                key={index}
                position={index + 1}
                imageUrl={user.imageUrl || ''}
                name={user.name || 'Unknown User'}
                xp={user.xp}
                id={user.id}
              />
            ))}
          </>
        )}

        {otherUsers.map((user, index) => (
          <UserPositionCard
            key={index}
            position={index + 4}
            imageUrl={user.imageUrl || ''}
            name={user.name || 'Unknown User'}
            xp={user.xp}
            id={user.id}
          />
        ))}
      </div>
    </div>
  )
}
