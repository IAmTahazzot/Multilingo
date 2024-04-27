'use server'

import { db } from '@/lib/db'

export const getLeaderboard = async () => {
  const users = await db.user.findMany({
    select: {
      id: true,
      name: true,
      imageUrl: true,
      xp: true
    },
    orderBy: {
      xp: 'desc'
    }
  })

  return users
}

export const getUserPosition = async (userId: string) => {
  const users = await db.user.findMany({
    select: {
      id: true,
      xp: true
    },
    orderBy: {
      xp: 'desc'
    }
  })

  const userIndex = users.findIndex(user => user.id === userId)
  return userIndex + 1
}
