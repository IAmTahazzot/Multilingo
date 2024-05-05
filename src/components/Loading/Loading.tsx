'use client'

import { LoadingMessages } from '@/lib/loadingMessage'
import Image from 'next/image'

export const Loading = () => {
  return (
    <div className='h-screen flex items-center justify-center'>
      <div className='max-w-[400px] space-y-4'>
        <Image
          src='/img/duolingo-whistling.gif'
          width={170}
          height={170}
          alt='Loading'
          className='mx-auto aspect-square'
          priority={true}
        />
        <h3 className='text-neutral-300 uppercase font-display text-center text-[18px]'>Loading...</h3>
        <span className='block text-center text-[17px] leading-6 mt-1'>
          {LoadingMessages[Math.floor(Math.random() * LoadingMessages.length)]}
        </span>
      </div>
    </div>
  )
}
