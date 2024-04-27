'use client'

import { Loading } from '@/components/Loading/Loading'
import { ProgressBoard } from '@/components/Pages/Learn/ProgressBoard'
import { useUser } from '@clerk/nextjs'

export default function LearnPage() {
  const { isLoaded } = useUser()

  if (!isLoaded) {
    return (
      <div className='h-screen flex items-center justify-center'>
        <Loading />
      </div>
    )
  }

  return <ProgressBoard /> 
}
