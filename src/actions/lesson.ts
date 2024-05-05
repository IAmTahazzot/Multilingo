'use server'

import { db } from '@/lib/db'

export const getLessons = async (unitId: string) => {
  const lessons = await db.lesson.findMany({
    where: {
      unitId: unitId
    },
    orderBy: {
      id: 'asc'
    }
  })

  return lessons
}

export const getLessonById = async (lessonId: number) => {
  const lesson = await db.lesson.findUnique({
    where: {
      id: lessonId
    }
  })

  return lesson
}

export const deleteLesson = async (lessonId: number) => {
  const deletedLesson = await db.lesson.delete({
    where: {
      id: lessonId
    }
  })

  return deletedLesson
}

export const createLesson = async (unitId: string) => {
  const newLesson = await db.lesson.create({
    data: {
      unitId: unitId
    }
  })

  return newLesson
}
