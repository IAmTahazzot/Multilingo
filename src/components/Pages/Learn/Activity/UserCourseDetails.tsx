'use client'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Card } from '@/components/Card/Card'
import { Button } from '@/components/ui/button'
import { useGlobalState } from '@/hooks/useGlobalState'
import { ICONS } from '@/lib/Icons'

export const UserCourseDetails = () => {
  const { user, course } = useGlobalState()

  if (!user || !course) {
    return null
  }

  return (
    <div>
      <div className='flex justify-between items-center'>
        <div>
          <Button variant={'ghost'} className='w-14 relative group duration-0 cursor-default'>
            <div className='w-10 h-8'>
              <svg pointerEvents={'none'}>
                <use xlinkHref={'/svg/flags.svg#' + course.language} className='scale-[50%]' />
              </svg>
            </div>
            <Card
              theme={'default'}
              className='hidden z-10 group-hover:block absolute left-[50%] -translate-x-1/2 top-full w-[200px] bg-white'>
              <h1 className='font-display '>My Courses</h1>
            </Card>
          </Button>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div>
                <svg width='25px' height='30px' viewBox='0 0 25 30' version='1.1' xmlns='http://www.w3.org/2000/svg'>
                  <g id='Page-1' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
                    <g id='streak' transform='translate(1.000000, 1.000000)' fillRule='nonzero'>
                      <g id='Group' fill='#FF9600' stroke='#FFFFFF' strokeWidth='2'>
                        <path
                          d='M0.068,15.675 L0.044,7.216 C0.039,5.334 1.25,3.942 3.056,4.246 C3.413,4.306 3.998,4.491 4.306,4.656 L5.997,5.561 L9.247,1.464 C9.79255754,0.776391272 10.6222536,0.37555895 11.5,0.37555895 C12.3777464,0.37555895 13.2074425,0.776391272 13.753,1.464 L20.523,10 C22.1231469,11.939276 22.9988566,14.3747884 23,16.889 C23,23.034 17.843,28 11.5,28 C5.157,28 0,23.034 0,16.889 C0,16.481 0.023,16.076 0.068,15.675 Z'
                          id='Path'
                        />
                      </g>
                      <g id='Group' transform='translate(7.000000, 11.000000)' fill='#FFC800'>
                        <path
                          d='M1.012,5.077 C1.02645313,5.04002851 1.04561094,5.00507392 1.069,4.973 L3.719,1.364 C3.89306825,1.12674185 4.1697362,0.986581193 4.464,0.986581193 C4.7582638,0.986581193 5.03493175,1.12674185 5.209,1.364 L7.732,4.8 C8.54117469,5.59477404 8.99791508,6.68079318 9,7.815 C9,10.208 6.985,12.148 4.5,12.148 C2.015,12.148 0,10.208 0,7.815 C0,6.776 0.38,5.823 1.012,5.077 L1.012,5.077 Z'
                          id='Path'
                        />
                      </g>
                    </g>
                  </g>
                </svg>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Streak feature is not implmented yet.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className='flex gap-2 items-center'>
          <svg width='24' height='30' viewBox='0 0 24 30' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M3.12035 6.45972C1.80438 7.25391 1 8.67887 1 10.2159V19.8822C1 21.4192 1.80438 22.8442 3.12035 23.6384L9.59501 27.5458C10.9891 28.3872 12.7345 28.3872 14.1287 27.5459L20.6037 23.6384C21.9197 22.8442 22.7241 21.4192 22.7241 19.8821V10.216C22.7241 8.67889 21.9197 7.2539 20.6037 6.45972L14.1287 2.55221C12.7345 1.71089 10.9891 1.71091 9.59501 2.55226L3.12035 6.45972Z'
              fill='#1CB0F6'
              stroke='white'
              strokeWidth='2'
            />
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M10.2449 5.45314C10.9645 5.01112 11.8902 5.52889 11.8902 6.37339V9.53852C11.8902 9.91649 11.6926 10.267 11.3692 10.4626L8.42194 12.2455C8.05585 12.4669 7.59354 12.4514 7.24315 12.2058L4.85711 10.5338C4.22068 10.0878 4.24944 9.13584 4.91163 8.7291L10.2449 5.45314Z'
              fill='#DDF4FF'
            />
          </svg>
          <span className='text-sky-500 font-display text-[17px] leading-[18px]'>{user.dimond}</span>
        </div>
        <div className='flex gap-2 items-center'>
          {user.tier === 'FREE' ? (
            <>
              <svg width='34' height='34' viewBox='0 0 34 34' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M2.65625 13.4717C2.65625 16.2267 4.05262 18.6627 6.19106 20.1401L15.3112 28.0973C16.3946 29.0426 18.0133 29.03 19.0819 28.0679L28.254 19.8104C30.1391 18.3144 31.3438 16.0307 31.3438 13.4717C31.3438 8.96552 27.6079 5.3125 22.9993 5.3125C20.6443 5.3125 18.5172 6.26635 17 7.80049C15.4828 6.26635 13.3557 5.3125 11.0008 5.3125C6.39223 5.3125 2.65625 8.96552 2.65625 13.4717Z'
                  fill='#FF4B4B'
                  stroke='white'
                  strokeWidth='2'
                />
                <path
                  opacity='0.3'
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M10.6619 16.9888C12.5042 16.9888 13.9977 15.4513 13.9977 13.5546C13.9977 11.6579 12.5042 10.1204 10.6619 10.1204C8.81964 10.1204 7.32617 11.6579 7.32617 13.5546C7.32617 15.4513 8.81964 16.9888 10.6619 16.9888Z'
                  fill='white'
                />
              </svg>
              <span className='text-rose-500 font-display text-[17px] leading-[18px]'>{user.hearts}</span>
            </>
          ) : (
            <div className='w-10 h-10'>{ICONS.infiniteHeartSmall}</div>
          )}
        </div>
      </div>
    </div>
  )
}
