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
  enrollmentDetails: {
    sectionId: string
    unitId: string
    lessonId: number
    questionCount: number
  }
  setCourse: (course: CourseState) => void
  setUser: (user: User) => void
  setEnrollmentDetails: (details: GlobalState['enrollmentDetails']) => void
}

export const useGlobalState = create<GlobalState>(set => ({
  user: null,
  course: null,
  enrollmentDetails: {
    sectionId: '',
    unitId: '',
    lessonId: 0,
    questionCount: 0
  },
  setCourse: course => set({ course }),
  setUser: user => set({ user }),
  setEnrollmentDetails: details => set({ enrollmentDetails: details })
}))
