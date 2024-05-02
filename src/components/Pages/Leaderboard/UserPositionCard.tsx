import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

type UserPositionCardProps = {
  id: string
  position: number
  imageUrl?: string
  name: string
  xp: number
}

export const UserPositionCard: React.FC<UserPositionCardProps> = ({ id, position, imageUrl, name, xp }) => {
  const USER_POSITION = position === 1 ? '🥇' : position === 2 ? '🥈' : position === 3 ? '🥉' : position

  return (
    <Link href={`/profile/${id}`}>
      <div className='flex items-center py-3 px-1 md:px-4 gap-4 hover:bg-neutral-100 rounded-xl user-select-none'>
        <p className='font-body text-lg text-primary-default w-5 md:w-8 text-center select-none'>{USER_POSITION}</p>

        {imageUrl && (
          <Image src={imageUrl} alt={name} width={40} height={40} className='rounded-full' priority={false} />
        )}
        {!imageUrl && (
          <div className='flex items-center justify-center h-10 w-10 rounded-full bg-black text-white font-display'>
            <span>
              {name
                .split(' ')
                .map(n => n[0].toUpperCase())
                .join('')
                .slice(0, 3)}
            </span>
          </div>
        )}

        <p className={cn('text-[17px] md:text-lg flex-1 font-display select-none', position === 1 && 'premium-cta')}>
          {name.slice(0, 26)}
        </p>
        <p className='font-body text-lg text-neutral-500 select-none'>{xp} XP</p>
      </div>
    </Link>
  )
}
