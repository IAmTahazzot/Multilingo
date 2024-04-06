'use server'

import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

export const getUser = async () => {
  const user = await currentUser()

  if (!user) {
    redirect('/sign-in')
  }

  try {
    const userData = await db.user.findUnique({
      where: {
        id: user.id
      }
    })

    return userData
  } catch (error) {
    throw new Error('User not found')
  }
}
