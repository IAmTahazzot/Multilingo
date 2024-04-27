import { Course, Lesson, Option, Question, Section, Unit, User } from '@prisma/client'
import { create } from 'zustand'

export type CourseState = Course & {
  Section: (Section & {
    Unit: (Unit & {
      Lesson: (Lesson & {
        Question: (Question & { Option: Option[] })[]
      })[]
    })[]
  })[]
}

type GlobalState = {
  user: User | null
  course: CourseState | null
  allCourses: CourseState[]
  enrollmentDetails: {
    sectionId: string
    unitId: string
    lessonId: number
    questionCount: number
  }
  requestedLesson: {
    sectionId: string
    unitId: string
    lessonId: number
  }
  setCourse: (course: CourseState) => void
  setAllCourses: (courses: CourseState[]) => void
  setUser: (user: User) => void
  setEnrollmentDetails: (details: GlobalState['enrollmentDetails']) => void
  setRequestedLesson: (details: GlobalState['requestedLesson']) => void
}

export const useGlobalState = create<GlobalState>(set => ({
  user: null,
  course: null,
  allCourses: [],
  enrollmentDetails: {
    sectionId: '',
    unitId: '',
    lessonId: 0,
    questionCount: 0
  },
  requestedLesson: {
    sectionId: '',
    unitId: '',
    lessonId: 0
  },
  setCourse: course => set({ course }),
  setAllCourses: courses => set({ allCourses: courses }),
  setUser: user => set({ user }),
  setEnrollmentDetails: details => set({ enrollmentDetails: details }),
  setRequestedLesson: details => set({ requestedLesson: details })
}))
