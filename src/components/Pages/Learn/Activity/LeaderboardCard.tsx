'use client'

import { getUserPosition } from '@/actions/leaderboard'
import { Card } from '@/components/Card/Card'
import { NavIcons } from '@/lib/nav'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export const LeaderBoardCard = () => {
  const { user } = useUser()
  const [position, setPosition] = useState<number | null>(null)

  useEffect(() => {
    const fetchPosition = async () => {
      if (!user) {
        return null
      }
      const position = await getUserPosition(user.id)

      if (position) {
        setPosition(position)
      }
    }

    fetchPosition()
  }, [user])

  return (
    <Card theme='default' className='p-8'>
      <div className='flex items-center justify-between text-[17px] font-display'>
        <span className='text-neutral-700'>Your league</span>
        <Link href='/leaderboard' className='text-secondary-default uppercase font-bold'>
          View League
        </Link>
      </div>

      <div className='grid grid-cols-[60px_1fr] mt-5'>
        <div>{NavIcons.get('leaderboard')}</div>
        <div>
          {position && (
            <>
              <h3 className='font-display text-[18px] text-neutral-700'>You&apos;re ranked #{position}</h3>
              <p className='text-neutral-500'>
                {position < 11
                  ? 'You are in the top 10% of the league'
                  : position < 51
                    ? 'You are in the top 50% of the league'
                    : 'you can do better!'}
              </p>
            </>
          )}
        </div>
      </div>
    </Card>
  )
}
