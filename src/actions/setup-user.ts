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

  const makeName = `${user?.firstName || `user-${v4()}`} ${user?.lastName || ''}`.trim()

  // If user does not exist, create user
  const newUser = await db.user.create({
    data: {
      id: user.id,
      email: user.emailAddresses[0].emailAddress,
      name: makeName,
      imageUrl: user.imageUrl,
      dimond: 500
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
