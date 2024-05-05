'use client'

import Link from 'next/link'

import { useEffect, useState } from 'react'
import { useGlobalState } from '@/hooks/useGlobalState'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/Button/Button'
import { ArrowLeft } from 'lucide-react'
import { sectionBirds } from '@/lib/sectionBirds'
import { cn } from '@/lib/utils'

export default function SectionsListPage() {
  const { course, enrollmentDetails, setRequestedLesson } = useGlobalState()
  const [activeSectionIndex, setActiveSectionIndex] = useState(0)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!course || !enrollmentDetails) return
    const sectionIndex = course.Section.findIndex(section => section.id === enrollmentDetails.sectionId)
    if (sectionIndex === -1) return

    setActiveSectionIndex(sectionIndex)

    setMounted(true)
  }, [course, enrollmentDetails])

  if (!mounted) {
    return null
  }

  // TODO: Implement for completed sections
  return (
    <div className='grid grid-cols-1 gap-6 my-10'>
      <div>
        <Link href='/learn' className='flex gap-3 font-display text-xl text-neutral-400'>
          <span>
            <ArrowLeft size='20' />
          </span>
          <span>Back</span>
        </Link>

        <div className='border-b-2 my-4'></div>
      </div>

      {course?.Section.map((section, index) => {
        const isActive = index === activeSectionIndex
        const isCompleted = index < activeSectionIndex
        const totalUnits = section.Unit.length
        const activeUnitIndex = section.Unit.findIndex(unit => unit.id === enrollmentDetails.unitId) + 1
        const lessonProgressPercentage = (activeUnitIndex / totalUnits) * 100

        return (
          <div
            key={section.id}
            className={cn(
              'grid grid-cols-2 gap-6 p-6 rounded-2xl',
              isActive || isCompleted ? 'bg-sky-100' : 'bg-neutral-100'
            )}>
            <div className='grid grid-cols-1 grid-rows-[32px_1fr]'>
              <h1
                className={cn(
                  'font-display text-[25px]',
                  !isActive && !isCompleted ? 'text-neutral-500' : 'text-neutral-900'
                )}>
                Section {index + 1}
              </h1>
              {!isActive && !isCompleted && (
                <div className='flex gap-2 items-center self-start'>
                  <span>
                    <svg width='13' height='16' viewBox='0 0 13 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
                      <rect x='0.849609' y='6.18652' width='11.4073' height='9.40015' rx='1.81676' fill='#AFAFAF' />
                      <path
                        d='M3.75 6.05652L3.75 4.75777C3.75 3.20996 5.00475 1.95521 6.55257 1.95521V1.95521C8.10039 1.95521 9.35514 3.20996 9.35514 4.75778V9.12953'
                        stroke='#AFAFAF'
                        strokeWidth='2.09735'
                        strokeLinecap='round'
                      />
                    </svg>
                  </span>
                  <span className='relative top-[2px] text-[#AFAFAF]'>{totalUnits} Units</span>
                </div>
              )}

              {isActive && (
                <div className='flex flex-col justify-between'>
                  <div className='mt-3'>
                    <div className='flex-1 h-6 rounded-full bg-white relative'>
                      <div
                        className='h-full rounded-full bg-[var(--color-primary)] transition-[width] duration-500'
                        style={{
                          width: `${lessonProgressPercentage}%`
                        }}></div>
                      <div
                        className='absolute top-[4px] h-[4.8px] translate-x-2 rounded-full bg-white opacity-30 transition-[width] duration-500'
                        style={{
                          width: `${lessonProgressPercentage - 2}%`
                        }}></div>
                      <div className='absolute left-0 top-0 w-full h-full flex items-center justify-center'>
                        <span
                          className='text-white font-display'
                          style={{
                            textShadow: '0px 0px 2px rgb(0 125 10)'
                          }}>
                          1 / {totalUnits}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className='pt-[78px]'>
                    <Button
                      theme='secondary'
                      className='mt-auto w-full border-b-1'
                      onClick={() => {
                        setRequestedLesson({
                          sectionId: section.id,
                          unitId: '',
                          lessonId: 1
                        })

                        router.push('/learn')
                      }}>
                      Continue
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <div className='grid gap-4 justify-items-center'>
              <div className='relative bg-white rounded-2xl text-xl justify-self-stretch p-4'>
                <span>{section.sectionIntro}</span>
                <svg
                  width='23'
                  height='24'
                  viewBox='0 0 23 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                  className='absolute top-full left-8'>
                  <g id='Nub' clipPath='url(#clip0_10702_29288)'>
                    <path
                      id='Rectangle 40'
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M4.35706 0.142807C2.76785 -1.97616 4.27979 -5 6.92848 -5L19.7855 -5C21.5607 -5 22.9997 -3.56092 22.9997 -1.78573L22.9997 15.3571C22.9997 18.4461 19.0674 19.7568 17.214 17.2857L4.35706 0.142807Z'
                      fill='white'
                    />
                  </g>
                  <defs>
                    <clipPath id='clip0_10702_29288'>
                      <rect width='23' height='24' fill='white' />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <div className='py-6'>{sectionBirds[index]}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
