'use client'

import { Button } from '@/components/Button/Button'
import Image from 'next/image'
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'

export const LessonReview = () => {
  const { width, height } = useWindowSize()

  return (
    <div
      className='grid grid-rows-[1fr_140px] h-full'
      style={{
        backgroundColor: '#fbfbfa'
      }}>
      <Confetti width={width} height={height} recycle={false} numberOfPieces={400} />
      <div className='grid place-content-center'>
        <div>
          <Image
            src={'/img/duolingo-hungboris.gif'}
            width={350}
            height={350}
            alt={'Duolingo Hungboris GIF'}
            className='mx-auto'
          />
          <h1 className='text-bee-default text-center mt-6 text-3xl font-display'>Lesson Complete!</h1>
          <div className='flex gap-4 mt-3'>
            <div className='relative w-[160px]'>
              <div className='absolute h-full w-full bg-bee-default rounded-2xl z-10'></div>
              <div className='relative text-white font-body uppercase p-1 text-xs font-bold text-center z-20'>
                total xp
              </div>
              <div className='relative flex justify-center items-center gap-2 h-[70px] bg-white border-[2px] border-bee-default rounded-2xl z-20'>
                <svg width='19' height='24' viewBox='0 0 19 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M12.193 1.61913C12.0256 -0.026945 9.91213 -0.593231 8.94412 0.748613L0.976934 11.7926C0.240086 12.814 0.753785 14.257 1.97032 14.5829L6.5026 15.7973L7.17212 22.3809C7.33952 24.0269 9.45295 24.5932 10.421 23.2514L18.3881 12.2074C19.125 11.186 18.6113 9.74304 17.3948 9.41707L12.8625 8.20265L12.193 1.61913Z'
                    fill='#FFD900'
                  />
                  <path
                    d='M2.54022 13.2535C2.12806 13.1423 2.08826 12.5732 2.48092 12.4056L5.63086 11.0616C5.91527 10.9403 6.23447 11.1355 6.25604 11.4439L6.41243 13.6805C6.434 13.9889 6.14507 14.2266 5.84655 14.1461L2.54022 13.2535Z'
                    fill='#F6C100'
                  />
                  <path
                    d='M16.9754 10.5263C17.3876 10.6375 17.4274 11.2066 17.0347 11.3742L13.8848 12.7182C13.6004 12.8395 13.2812 12.6443 13.2596 12.3358L13.1032 10.0993C13.0816 9.79087 13.3706 9.55315 13.6691 9.63373L16.9754 10.5263Z'
                    fill='#FFEF8F'
                  />
                </svg>
                <span className='text-bee-default font-display text-xl'>12</span>
              </div>
            </div>

            <div className='relative w-[160px]'>
              <div className='absolute h-full w-full bg-primary-default rounded-2xl z-10'></div>
              <div className='text-white font-body uppercase p-1 text-xs font-bold text-center z-20 relative'>Good</div>
              <div className='flex justify-center items-center gap-2 h-[70px] bg-white border-[2px] border-primary-default rounded-2xl z-20 relative'>
                <svg width='28' height='25' viewBox='0 0 28 25' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <circle cx='11.97' cy='13.1049' r='10.2515' fill='#ECFFDE' stroke='#58CC02' strokeWidth='2.56286' />
                  <circle cx='11.9698' cy='13.1051' r='5.12573' fill='#ECFFDE' stroke='#58CC02' strokeWidth='2.56286' />
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M22.9921 3.68332L18.3169 7.28868L17.6234 3.7791C17.6083 3.5661 17.6399 3.31705 17.8269 3.17283L21.4735 0.36065C21.754 0.144328 22.0859 0.187975 22.3032 0.469767C22.3757 0.563698 22.4119 0.610665 22.4014 0.693684L22.9921 3.68332Z'
                    fill='#58A700'
                  />
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M23.716 4.62254L19.0408 8.2279L22.2589 9.79058C22.461 9.85937 22.7099 9.89211 22.8969 9.74789L26.5436 6.93571C26.8241 6.71939 26.8662 6.38731 26.6489 6.10552C26.5765 6.01159 26.5403 5.96463 26.4573 5.95372L23.716 4.62254Z'
                    fill='#58A700'
                  />
                  <rect
                    x='10.9226'
                    y='12.8574'
                    width='15.4949'
                    height='1.70928'
                    rx='0.854642'
                    transform='rotate(-37.6382 10.9226 12.8574)'
                    fill='#478700'
                  />
                </svg>
                <span className='text-primary-default font-display text-xl'>84%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className='border-t border-neutral-200'>
        <div className='flex items-center justify-end max-w-[1024px] mx-auto w-full h-full px-6'>
          <Button theme={'primary'} width={150} type='link' href='/learn'>
            Continue
          </Button>
        </div>
      </footer>
    </div>
  )
}
