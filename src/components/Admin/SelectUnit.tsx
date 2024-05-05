import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LessonStateProps } from '@/lib/types'
import { getLessons } from '@/actions/lesson'

export const SelectUnit = ({ state, setState }: LessonStateProps) => {
  const onUnitSelect = async (value: string) => {
    if (value === 'no-value') {
      return false
    }

    const lessons = await getLessons(value)

    setState(prev => {
      return {
        ...prev,
        unit: {
          selectedUnitId: value,
          list: prev.unit.list
        },
        lesson: {
          selectedLessonId: null,
          list: lessons || []
        },
        activeTab: 'lesson'
      }
    })
  }

  return (
    <div>
      <Select
        value={state.unit.selectedUnitId || ''}
        onValueChange={(value: string) => {
          onUnitSelect(value)
        }}>
        <SelectTrigger className='w-full'>
          <SelectValue placeholder='Select an unit' />
        </SelectTrigger>
        <SelectContent>
          {state.unit.list.map(unit => (
            <SelectItem value={unit.id} key={unit.id} className='cursor-pointer'>
              <div className='flex items-center gap-x-2 py-3'>
                <span>{unit.title}</span>
              </div>
            </SelectItem>
          ))}
          {state.unit.list.length === 0 && (
            <SelectItem value='no-value' className='cursor-pointer'>
              <div className='flex items-center gap-x-2 py-3'>
                <span>No units created yet</span>
              </div>
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  )
}
