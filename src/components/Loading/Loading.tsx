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
      {slowResponse ? 'Slow connection, please wait...' : 'Loading..'}
    </div>
  )
}