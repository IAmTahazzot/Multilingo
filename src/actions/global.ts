'use server'

import { db } from '@/lib/db'
import { User } from '@prisma/client'

/**
 * This function deducts a heart from a user's total heart count.
 *
 * @param {string} userId - The unique identifier of the user.
 *
 * @returns {Promise<object>} The updated user object if the operation is successful.
 * If the user does not exist, it throws an error.
 * If the user's heart count is already 0 or less, it returns -1.
 *
 * @throws {Error} If the user is not found in the database.
 */
export const deductHeart = async (userId: string): Promise<User | number> => {
  const user = await db.user.findUnique({
    where: {
      id: userId
    }
  })

  if (!user) {
    throw new Error('User not found')
  }

  if (user.hearts <= 0) {
    return -1
  }

  const updatedUser = await db.user.update({
    where: {
      id: userId
    },
    data: {
      hearts: user.hearts - 1
    }
  })

  return updatedUser
}




/**
 * This function fills a user's heart count to the maximum of 5 hearts.
 *
 * @param {string} userId - The unique identifier of the user.
 *
 * @returns {Promise<object>} The updated user object if the operation is successful.
 *
 * @throws {Error} If the user is not found in the database.
 * If the user does not have enough dimonds to fill the hearts, it throws an error.
 */
export const fillHearts = async (userId: string): Promise<User> => {
  const user = await db.user.findUnique({
    where: {
      id: userId
    }
  })

  if (!user) {
    throw new Error('User not found')
  }

  const userHearts = user.hearts
  const heartsToFill = 5 - userHearts
  const dimondCost = 100 * heartsToFill
  const userDimonds = user.dimond

  if (userDimonds < dimondCost) {
    throw new Error('Insufficient dimonds')
  }

  const updatedUser = await db.user.update({
    where: {
      id: userId
    },
    data: {
      hearts: 5,
      dimond: userDimonds - dimondCost
    }
  })

  return updatedUser
}
