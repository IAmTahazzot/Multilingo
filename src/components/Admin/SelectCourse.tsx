import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LessonStateProps } from '@/lib/types'

export const SelectCourse = ({ state, setState }: LessonStateProps) => {
  return (
    <Select
      value={state.course.selectedCourseId || ''}
      onValueChange={(value: string) => {
        setState(prev => {
          return {
            ...prev,
            section: {
              ...prev.section,
              selectedSectionId: null
            },
            unit: {
              selectedUnitId: null,
              list: []
            },
            lesson: {
              selectedLessonId: null,
              list: []
            },
            course: {
              ...prev.course,
              selectedCourseId: value
            },
            activeTab: 'section'
          }
        })
      }}>
      <SelectTrigger className='w-full'>
        <SelectValue placeholder='Select a course' />
      </SelectTrigger>
      <SelectContent>
        {state.course.list.map(course => (
          <SelectItem value={course.id} key={course.id} className='cursor-pointer'>
            <div className='flex items-center gap-x-2 py-3'>
              <svg className='h-8 w-10'>
                <use xlinkHref={'/svg/flags.svg#' + course.language} className='scale-[.5]' />
              </svg>
              <span>{course.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
