'use client'

import { getCourses } from '@/actions/course'
import { useEffect, useState } from 'react'
import { SelectCourse } from './SelectCourse'
import { State } from '@/lib/types'
import { SectionTable } from './DataTable/SectionTable'
import { getSectionsById } from '@/actions/section'
import { SelectSection } from './SelectSection'
import { UnitTable } from './DataTable/UnitTable'
import { SelectUnit } from './SelectUnit'
import { LessonTable } from './DataTable/LessonTable'
import { QuestionTable } from './DataTable/QuestionTable'
import { SelectLesson } from './SelectLesson'

export const CreateLesson = () => {
  const [state, setState] = useState<State>({
    course: {
      selectedCourseId: null,
      list: []
    },
    section: {
      selectedSectionId: null,
      list: []
    },
    unit: {
      selectedUnitId: null,
      list: []
    },
    lesson: {
      selectedLessonId: null,
      list: []
    },
    question: [],
    activeTab: 'section'
  })
  const [prevCourseId, setPrevCourseId] = useState<string>('')

  useEffect(() => {
    // load courses
    const getCoursesRequest = async () => {
      try {
        const response = await getCourses()
        setState({
          ...state,
          course: {
            list: response || [],
            selectedCourseId: response[0]?.id || ''
          }
        })
      } catch (error) {
        console.error(error)
      }
    }
    getCoursesRequest()
  }, [])

  useEffect(() => {
    const getSections = async () => {
      if (!state.course.selectedCourseId || prevCourseId === state.course.selectedCourseId) {
        return false
      }

      try {
        const response = await getSectionsById(state.course.selectedCourseId)
        setState({
          ...state,
          section: {
            ...state.section,
            list: response || []
          }
        })
      } catch (error) {
        console.error(error)
      }

      setPrevCourseId(state.course.selectedCourseId)
    }

    getSections()
  }, [state])

  return (
    <div className='mt-8 space-y-8'>
      <div className='grid grid-cols-4 gap-4'>
        <SelectCourse state={state} setState={setState} />
        <SelectSection state={state} setState={setState} />
        <SelectUnit state={state} setState={setState} />
        <SelectLesson state={state} setState={setState} />
      </div>

      {state.activeTab === 'section' && <SectionTable state={state} setState={setState} />}
      {state.activeTab === 'unit' && <UnitTable state={state} setState={setState} />}
      {state.activeTab === 'lesson' && <LessonTable state={state} setState={setState} />}
      {state.activeTab === 'question' && <QuestionTable state={state} setState={setState} />}
    </div>
  )
}
