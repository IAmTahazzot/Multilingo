'use client'

import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

export const Network = () => {
  const [isOnline, setIsOnline] = useState(true)
  const [visible, setVisible] = useState(false)
  const [addFadeOut, setAddFadeOut] = useState(false)

  useEffect(() => {
    window.addEventListener('offline', () => {
      setIsOnline(false)
      setVisible(true)
    })

    window.addEventListener('online', () => {
      setIsOnline(true)
      setVisible(true)

      setTimeout(() => {
        setAddFadeOut(true)
      }, 4100)

      setTimeout(() => {
        setVisible(false)
        setAddFadeOut(false)
      }, 5000)
    })
  }, [])

  if (!visible) return null

  return (
    <div className={
      cn(
        'fixed top-0 left-0 flex items-center justify-center w-full h-8 text-xs text-white bg-black z-[1000] font-mono anim-fadeIn',
        isOnline ? 'bg-green-500' : 'bg-red-500',
        addFadeOut && 'anim-fadeOut'
      )
    }>
      {isOnline ? 'Connected to the internet' : 'You are offline'}
    </div>
  )
}
