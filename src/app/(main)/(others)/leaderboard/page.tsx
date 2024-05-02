'use client'

import { getLeaderboard } from '@/actions/leaderboard'
import { Loading } from '@/components/Loading/Loading'
import { UserPositionCard } from '@/components/Pages/Leaderboard/UserPositionCard'
import { useEffect, useState } from 'react'

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

  useEffect(() => {
    const fetchLeaderboardUsers = async () => {
      const data = await getLeaderboard()

      if (data) {
        setLeaderboardUsers(data)
        setMount(true)
      }
    }

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

  return (
    <div>
      <div className='h-10'></div>
      <div className='sticky top-0 text-center py-10 border-b border-neutral-200'>
        <h1 className='text-3xl font-display text-neutral-700'>Leaderboard</h1>
        <p className='text-neutral-400 mt-2'>Earn more xp to get higher rank</p>
      </div>

      <div className='mt-1'>
        {leaderboardUsers.map((user, index) => (
          <UserPositionCard
            key={index}
            position={index + 1}
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
