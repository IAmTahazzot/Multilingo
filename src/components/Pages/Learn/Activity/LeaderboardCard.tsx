import { Card } from '@/components/Card/Card'
import { NavIcons } from '@/lib/nav'
import Link from 'next/link'

export const LeaderBoardCard = () => {
  return (
    <Card theme='default' className='p-8'>
      <div className='flex items-center justify-between text-[17px] font-display'>
        <span className='text-neutral-700'>Your league</span>
        <Link href='/leaderboard' className='text-secondary-default uppercase font-bold'>
          View League
        </Link>
      </div>

      <div className='grid grid-cols-[60px_1fr] mt-5'>
        <div className=''>{NavIcons.get('leaderboard')}</div>
        <div>
          <h3 className='font-display text-[18px] text-neutral-700'>You&apos;r ranked #30</h3>
          <p className='text-neutral-500'>You can do better than this</p>
        </div>
      </div>
    </Card>
  )
}
