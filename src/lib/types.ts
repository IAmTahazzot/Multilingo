import { Course, Lesson, Option, Question, Section, Unit } from '@prisma/client'

export type State = {
  course: {
    selectedCourseId: string | null
    list: Course[]
  }
  section: {
    selectedSectionId: string | null
    list: Section[]
  }
  unit: {
    selectedUnitId: string | null
    list: Unit[]
  }
  lesson: {
    selectedLessonId: number | null
    list: Lesson[]
  }
  question: (Question & { Option: Option[] })[]
  activeTab: 'section' | 'unit' | 'lesson' | 'question'
}

export type LessonStateProps = {
  state: State
  setState: React.Dispatch<React.SetStateAction<State>>
}
