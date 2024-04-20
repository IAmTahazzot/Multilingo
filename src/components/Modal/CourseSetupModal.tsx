'use client'

import { ModalType, useModal } from '@/hooks/useModal'
import { Course } from '@prisma/client'
import { Card } from '../Card/Card'
import Image from 'next/image'
import { Button } from '../Button/Button'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { enrollUser } from '@/actions/course'
import { toast } from 'sonner'

export const CourseSetupModal = () => {
  const { isOpen, closeModal, data, type } = useModal()
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [enrolling, setEnrolling] = useState(false)

  if (!isOpen || type !== ModalType.COURSE_SETUP) {
    return null
  }

  const enroll = async () => {
    setEnrolling(true)

    try {
      if (data && (data as { user: any }).user) {
        await enrollUser((data as { user: any }).user.id, selectedCourse as string)
      } else {
        throw new Error('Unable to enroll user, please try again later.')
      }
    } catch (error) {
      const errorMessage = (error as Error).message || 'An error occured while enrolling user.'
      toast.error(errorMessage, { duration: 5000 })
      console.error(error)
    } finally {
      setEnrolling(false)
      closeModal()
    }
  }

  return (
    <div className='z-[1000] fixed top-0 left-0 h-screen w-full bg-white'>
      <div className='max-w-[800px] mx-auto h-full my-10 md:my-[100px]'>
        <div className='grid grid-cols-4 grid-rows-[200px] justify-center gap-4'>
          {(data as { courses: Course[] }).courses.map((course: Course) => (
            <Card
              key={course.id}
              theme={selectedCourse === course.id ? 'secondary' : 'default'}
              className={cn('flex flex-col items-center gap-4 cursor-pointer')}
              onClick={e => {
                setSelectedCourse(course.id)
              }}>
              <svg className='h-20 w-20'>
                <use xlinkHref={'/svg/flags.svg#' + course.language} className='' />
              </svg>
              <p>{course.name}</p>
            </Card>
          ))}
        </div>
        <div>
          <p className='text-muted-foreground text-sm mt-6'>
            More courses will be available soon. Stay tuned! 
          </p>
        </div>
        <div className='my-6 flex justify-center'>
          <Button theme='secondary' onClick={enroll} className='md:w-[300px]' disabled={selectedCourse === null}>
            {enrolling ? 'Enrolling...' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  )
}
