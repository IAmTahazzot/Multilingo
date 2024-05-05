'use server'

import { db } from '@/lib/db'
import { languages } from '@/lib/countries'

export const getCourses = async () => {
  const courses = await db.course.findMany()
  return courses
}

export const SaveCourse = async (courseCode: keyof typeof languages) => {
  // check if the course is existing in the database
  const isExisting = await db.course.findUnique({
    where: {
      language: courseCode.toString()
    }
  })

  if (isExisting) {
    return false
  }

  // create the course
  const newCourse = await db.course.create({
    data: {
      language: courseCode.toString(),
      name: languages.get(courseCode.toString()) as string
    }
  })

  return newCourse
}

export const deleteCourse = async (courseId: string) => {
  const deletedCourse = await db.course.delete({
    where: {
      id: courseId
    }
  })

  return deletedCourse
}

export const checkUserEnrollment = async (userId: string) => {
  const enrollment = await db.courseEnrollment.findMany({
    where: {
      userId
    },
    include: {
      course: true
    }
  })

  return enrollment
}

export const enrollUser = async (userId: string, courseId: string) => {
  try {
    const enrollment = await db.courseEnrollment.create({
      data: {
        userId,
        courseId
      }
    })

    return enrollment
  } catch (error) {
    throw new Error('An error occured while enrolling user.')
  }
}

export const getUserEnrolledCourses = async (userId: string, onlyCourse?: boolean) => {
  if (onlyCourse) {
    const courses = await db.courseEnrollment.findMany({
      where: {
        userId
      },
      include: {
        course: true
      }
    })

    return courses
  }

  const courses = await db.courseEnrollment.findMany({
    where: {
      userId
    },
    include: {
      course: {
        include: {
          Section: {
            include: {
              Unit: {
                include: {
                  Lesson: {
                    include: {
                      Question: {
                        include: {
                          Option: true
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  })

  return courses
}
