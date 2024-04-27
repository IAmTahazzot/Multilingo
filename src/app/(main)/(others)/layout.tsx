'use client'

import { checkUserEnrollment, getCourses } from '@/actions/course'
import { Loading } from '@/components/Loading/Loading'
import { BaseNavigation } from '@/components/Navigation/BaseNavigation'
import { UserNavigation } from '@/components/Navigation/UserNavigation'
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
      <div className='pl-64'>
        <BaseNavigation>
          <UserNavigation />
        </BaseNavigation>
        <div className='mx-6'>{children}</div>
      </div>
    </ModalProvider>
  )
}
