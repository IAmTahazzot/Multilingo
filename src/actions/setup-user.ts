'use server'

import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { v4 } from 'uuid'

export const setupUser = async () => {
  const user = await currentUser()

  if (!user) redirect('/sign-in')

  // Check if user exists in the database
  const existingUser = await db.user.findUnique({
    where: { id: user.id }
  })

  if (existingUser) {
    return false
  }

  // If user does not exist, create user
  const newUser = await db.user.create({
    data: {
      id: user.id,
      email: user.emailAddresses[0].emailAddress,
      username: user?.username || 'user-' + v4(),
      name: (user?.firstName || 'user-' + v4()) + ' ' + user?.lastName || ''
    }
  })

  await db.userPreferences.create({
    data: {
      userId: newUser.id,
      sound: true
    }
  })

  return newUser
}
