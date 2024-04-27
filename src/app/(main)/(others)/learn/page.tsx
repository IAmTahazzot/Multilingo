'use client'

import { getGlobalState } from '@/actions/get-global-state'
import { setupUser } from '@/actions/setup-user'
import { Button } from '@/components/Button/Button'
import { Loading } from '@/components/Loading/Loading'
import { ProgressBoard } from '@/components/Pages/Learn/ProgressBoard'
import { UserActivity } from '@/components/Pages/Learn/UserActivity'
import { useGlobalState } from '@/hooks/useGlobalState'
import { ModalType, useModal } from '@/hooks/useModal'
import { useUser } from '@clerk/nextjs'
import { useEffect } from 'react'
import { toast } from 'sonner'

export default function LearnPage() {
  const { isLoaded } = useUser()

  if (!isLoaded) {
    return (
      <div className='h-screen flex items-center justify-center'>
        <Loading />
      </div>
    )
  }

  return (
    <div className='grid grid-cols-[1fr_370px] gap-10'>
      <ProgressBoard />
      <UserActivity />
    </div>
  )
}
