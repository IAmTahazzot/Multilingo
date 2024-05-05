import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LessonStateProps } from '@/lib/types'
import { getUnits } from '@/actions/unit'

export const SelectSection = ({ state, setState }: LessonStateProps) => {
  const onSectionSelect = async (value: string) => {
    const getSections = await getUnits(value)

    setState(prev => {
      return {
        ...prev,
        section: {
          list: prev.section.list,
          selectedSectionId: value
        },
        unit: {
          selectedUnitId: null,
          list: getSections || []
        },
        activeTab: 'unit'
      }
    })
  }

  return (
    <Select
      value={state.section.selectedSectionId || ''}
      onValueChange={(value: string) => {
        onSectionSelect(value)
      }}>
      <SelectTrigger
        className='w-full'
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
        <SelectValue placeholder='Select a section' />
      </SelectTrigger>
      <SelectContent>
        {state.section.list.map(section => (
          <SelectItem value={section.id} key={section.id} className='cursor-pointer'>
            <div className='flex items-center gap-x-2 py-3'>
              <span>{section.title}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
