'use server'

import { CourseState } from '@/hooks/useGlobalState'
import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs'
import { User } from '@prisma/client'
import { getUserEnrolledCourses } from './course'
import fs from 'fs'

type GlobalState = {
  course: CourseState | null
  allCourses: CourseState[]
  user: User | null
  enrollmentDetails: {
    lessonProgressId: string
    sectionId: string
    unitId: string
    lessonId: number
    questionCount: number
  }
  userPreferences: {
    sound: boolean
  }
}

export const getGlobalState: (courseId?: string) => Promise<GlobalState> = async (courseId?: string) => {
  const user = await currentUser()

  if (!user) {
    throw new Error('User not found, you may need to sign in!')
  }

  // 1. Get user
  const getUser = await db.user.findUnique({
    where: {
      id: user.id
    }
  })

  if (!getUser) {
    throw new Error('User not found, you may need to sign in!')
  }

  // 2. Get the course
  let course = null
  let checkEnrollment = null

  if (courseId) {
    checkEnrollment = await db.courseEnrollment.findFirst({
      where: {
        courseId,
        userId: getUser.id
      }
    })
  }

  if (courseId && checkEnrollment) {
    // check if user is enrolled in a course

    // check if user is enrolled in the course
    course = await db.course.findUnique({
      where: {
        id: courseId
      },

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
                      },
                      orderBy: {
                        createdAt: 'asc'
                      }
                    }
                  },
                  orderBy: {
                    id: 'asc'
                  }
                }
              },
              orderBy: {
                createdAt: 'asc'
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    })
  } else {
    let userCourseId = null

    // if no enrollment, find the first course
    if (!checkEnrollment) {
      const getAnyFirstCourse = await db.courseEnrollment.findFirst({
        where: {
          userId: getUser.id
        }
      })

      userCourseId = getAnyFirstCourse?.courseId
    }

    if (!userCourseId) {
      throw new Error('User is not enrolled in any course')
    }

    course = await db.course.findFirst({
      where: {
        id: userCourseId
      },

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
                      },
                      orderBy: {
                        createdAt: 'asc'
                      }
                    }
                  },
                  orderBy: {
                    id: 'asc'
                  }
                }
              },
              orderBy: {
                createdAt: 'asc'
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    })
  }

  if (!course) {
    throw new Error('Course not found')
  }

  // 3. Get course progress
  const getCourseProgress = await db.lessonProgress.findFirst({
    where: {
      userId: getUser.id,
      courseId: course.id
    }
  })

  // 4. Create course progress if not exists
  if (!getCourseProgress) {
    await db.lessonProgress.create({
      data: {
        userId: getUser.id,
        courseId: course.id,
        sectionId: course.Section[0].id,
        unitId: course.Section[0].Unit[0].id,
        lessonId: course.Section[0].Unit[0].Lesson[0].id,
        questionCount: 0
      }
    })
  }

  // 5. get All courses
  const userCourses = await getUserEnrolledCourses(getUser.id)

  // 6. user preferences
  const preferences = await db.userPreferences.findUnique({
    where: {
      userId: getUser.id
    }
  })

  const data: GlobalState = {
    user: getUser,
    course,
    userPreferences: {
      sound: preferences?.sound || true
    },
    allCourses: userCourses.map(enrollment => enrollment.course as CourseState),
    enrollmentDetails: {
      lessonProgressId: getCourseProgress?.id || '',
      sectionId: getCourseProgress?.sectionId || course.Section[0].id,
      unitId: getCourseProgress?.unitId || course.Section[0].Unit[0].id,
      lessonId: getCourseProgress?.lessonId || 0,
      questionCount: getCourseProgress?.questionCount || 0
    }
  }

  return data
}
