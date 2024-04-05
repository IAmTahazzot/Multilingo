'use client'

import { setupUser } from '@/actions/setup-user'
import { Loading } from '@/components/Loading/Loading'
import { useUser } from '@clerk/nextjs'
import { useEffect } from 'react'

export default function LearnPage() {
  const { user, isLoaded, isSignedIn } = useUser()

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
    <h1>
      {isSignedIn ? `Welcome, ${user.fullName}` : 'Loading...'}
    </h1>
  )
}
