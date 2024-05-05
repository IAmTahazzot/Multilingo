'use server'

import { db } from '@/lib/db'
import { User, UserPreferences } from '@prisma/client'

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

/**
 * This function subscribes a user to the Super tier.
 * It changes the user's tier to 'PREMIUM'.
 *
 * @param {string} userId - The unique identifier of the user.
 *
 * @returns {Promise<object>} The updated user object if the operation is successful.
 *
 * @throws {Error} If the user is not found in the database.
 */
export const subscribeToSuperTier = async (userId: string): Promise<User> => {
  const user = await db.user.findUnique({
    where: {
      id: userId
    }
  })

  if (!user) {
    throw new Error('User not found')
  }

  const updatedUser = await db.user.update({
    where: {
      id: userId
    },
    data: {
      tier: 'PREMIUM'
    }
  })

  return updatedUser
}

/**
 * This function updates a user's profile information.
 *
 * @param {string} userId - The unique identifier of the user.
 * @param {object} profile - The profile information to update.
 *
 * @returns {Promise<object>} The updated user object if the operation is successful.
 *
 * @throws {Error} If the user is not found in the database.
 */
export const updateProgress = async (progress: {
  sectionId: string
  unitId: string
  lessonId: number
  questionCount: number
  lessonProgressId: string
}) => {
  const newProgress = await db.lessonProgress.update({
    where: {
      id: progress.lessonProgressId
    },
    data: {
      unitId: progress.unitId,
      lessonId: progress.lessonId,
      questionCount: progress.questionCount
    }
  })

  return newProgress
}

/**
 * This function updates a user's profile information.
 *
 * @param {string} userId - The unique identifier of the user.
 * @param {object} profile - The profile information to update.
 *
 * @returns {Promise<object>} The updated user object if the operation is successful.
 *
 * @throws {Error} If the user is not found in the database.
 */
export const updateQuestionCount = async (lessonProgressId: string, questionCount: number) => {
  const newProgress = await db.lessonProgress.update({
    where: {
      id: lessonProgressId
    },
    data: {
      questionCount
    }
  })

  return newProgress
}

/**
 * This function updates a user's profile information.
 *
 * @param {string} userId - The unique identifier of the user.
 * @param {object} profile - The profile information to update.
 *
 * @returns {Promise<object>} The updated user object if the operation is successful.
 *
 * @throws {Error} If the user is not found in the database.
 */
export const updateUserPreferences = async (
  userId: string,
  preferences: {
    sound?: boolean
  }
): Promise<UserPreferences> => {
  const previousPreferences = await db.userPreferences.findUnique({
    where: {
      userId
    }
  })

  if (!previousPreferences) {
    throw new Error('User preferences not found')
  }

  const updatedPreferences = await db.userPreferences.update({
    where: {
      userId
    },
    data: {
      ...previousPreferences,
      sound: preferences.sound ?? previousPreferences.sound
    }
  })

  return updatedPreferences
}

export const updateUserXp = async (userId: string, xp: number) => {
  const user = await db.user.findUnique({
    where: {
      id: userId
    }
  })

  if (!user) {
    throw new Error('User not found')
  }

  const updatedUser = await db.user.update({
    where: {
      id: userId
    },
    data: {
      xp: user.xp + xp
    }
  })

  return updatedUser
}