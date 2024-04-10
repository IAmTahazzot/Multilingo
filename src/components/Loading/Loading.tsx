'use client'

import { useEffect, useState } from 'react'

export const Loading = () => {
  const [slowResponse, setSlowResponse] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setSlowResponse(true)
    }, 5000)
  }, [])

  return (
    <div className='h-screen flex items-center justify-center'>
      {slowResponse ? ':( Sorry, the page took too long to load' : 'Loading..'}
    </div>
  )
}
