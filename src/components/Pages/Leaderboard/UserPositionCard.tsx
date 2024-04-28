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
  return (
    <Link href={`/profile/${id}`}>
      <div className='flex items-center py-3 px-4 gap-4 hover:bg-neutral-100 rounded-xl user-select-none'>
        <p className='font-body text-lg text-primary-default w-8 text-center select-none'>{position}</p>

        {imageUrl && (
          <Image src={imageUrl} alt={name} width={40} height={40} className='rounded-full' priority={false} />
        )}
        {!imageUrl && (
          <div className='flex items-center justify-center h-10 w-10 rounded-full bg-black text-white font-display'>
            {name
              .split(' ')
              .map(n => n[0].toUpperCase())
              .join('')}
          </div>
        )}

        <p className='text-lg flex-1 font-display select-none'>{name}</p>
        <p className='font-body text-lg text-neutral-500 select-none'>{xp} XP</p>
      </div>
    </Link>
  )
}
