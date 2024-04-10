import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LessonStateProps } from '@/lib/types'
import { getQuestions } from '@/actions/question'
import { toast } from 'sonner'

export const SelectLesson = ({ state, setState }: LessonStateProps) => {
  const onLessonSelect = async (value: number) => {
    if (value === -1) {
      toast.error('Lesson is required')
      return
    }

    const getQuestionsAll = await getQuestions(value)

    setState(prev => {
      return {
        ...prev,
        lesson: {
          ...prev.lesson,
          selectedLessonId: value
        },
        question: getQuestionsAll,
        activeTab: 'question'
      }
    })
  }

  return (
    <Select
      value={state.lesson.selectedLessonId?.toString()}
      onValueChange={(value: string) => {
        const lessonId = isNaN(Number(value)) ? -1 : Number(value)
        onLessonSelect(lessonId)
      }}>
      <SelectTrigger className='w-full'>
        <SelectValue placeholder='Select a lesson' />
      </SelectTrigger>
      <SelectContent>
        {state.lesson.list.map(lesson => (
          <SelectItem value={lesson.id.toString()} key={lesson.id} className='cursor-pointer'>
            <div className='flex items-center gap-x-2 py-3'>
              <span>{lesson.id}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
