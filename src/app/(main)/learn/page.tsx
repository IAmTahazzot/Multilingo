'use client'

import { setupUser } from '@/actions/setup-user'
import { Button } from '@/components/Button/Button'
import { Loading } from '@/components/Loading/Loading'
import { ModalType, useModal } from '@/hooks/useModal'
import { useUser } from '@clerk/nextjs'
import { useEffect } from 'react'

export default function LearnPage() {
  const { isLoaded } = useUser()
  const { openModal } = useModal()

  useEffect(() => {
    const getUser = async () => {
      // Create new user if user does not exist in the database
      await setupUser()
    }

    getUser()
  }, [])

  if (!isLoaded) {
    return (
      <div className='h-screen flex items-center justify-center'>
        <Loading />
      </div>
    )
  }

  return (
    <div>
      Course will be loaded here...
      <Button
        theme={'primary'}
        onClick={() => {
          openModal(ModalType.COURSE_SETUP)
        }}>
        Select a course
      </Button>
    </div>
  )
}
