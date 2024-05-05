'use client'

import { checkUserEnrollment, getCourses } from '@/actions/course'
import { BaseNavigation } from '@/components/Navigation/BaseNavigation'
import { SmallDeviceNavigation } from '@/components/Navigation/SmallDeviceNavigation'
import { UserNavigation } from '@/components/Navigation/UserNavigation'
import { UserActivity } from '@/components/Pages/Learn/UserActivity'
import { ModalType, useModal } from '@/hooks/useModal'
import { ModalProvider } from '@/providers/ModalProvider'
import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

export default function OtherLayout({ children }: { children: React.ReactNode }) {
  const [mount, setMount] = useState(false)
  const { user, isLoaded, isSignedIn } = useUser()
  const { openModal } = useModal()

  // Checking if user have enrolled in any course:
  // If not, open the course setup modal
  useEffect(() => {
    if (!isSignedIn) {
      return
    }

    const didUserEnrolled = async () => {
      const res = await checkUserEnrollment(user.id)
      const courses = await getCourses()

      if (res.length < 1) {
        openModal(ModalType.COURSE_SETUP, { courses, user })
      }

      setMount(true)
    }

    didUserEnrolled()
  }, [isSignedIn, user, openModal])

  if (!isLoaded || !mount) {
    return null
  }

  return (
    <ModalProvider>
      <div className='md:pl-[72px] lg:pl-64'>
        <BaseNavigation className='hidden md:block'>
          <UserNavigation />
        </BaseNavigation>
        <SmallDeviceNavigation />
        <div className='mx-2 lg:mx-6'>
          <div className='grid grid-cols-1 md:grid-cols-[1fr_290px] xl:grid-cols-[1fr_370px] gap-10 lg:max-w-[1050px] mx-auto'>
            <div className='px-2 md:px-6'>{children}</div>
            <UserActivity />
          </div>
        </div>
      </div>
    </ModalProvider>
  )
}
