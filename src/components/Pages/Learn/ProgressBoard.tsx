'use client'

import { useGlobalState } from "@/hooks/useGlobalState"

export const ProgressBoard = () => {

  const { course, user, enrollmentDetails } = useGlobalState()

  return (
    <div>
      <h1>Hello {user?.name || 'You'}</h1>
    </div>
  )
}