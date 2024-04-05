'use client'

import { SignUpButton, useUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

export default function Home() {
  const user = useUser()

  if (user) {
    redirect('/learn')
  }

  return (
    <div>
      <SignUpButton />
    </div>
  )
}
