'use client'

import { Card } from '@/components/Card/Card'
import { useGlobalState } from '@/hooks/useGlobalState'
import { useState, useRef } from 'react'
import { UnitChunk } from './UnitChunk'

export const ProgressBoard = () => {
  const cardThemes = ['primary', 'secondary', 'tertiary', 'success', 'premium', 'danger']
  const { course, user, enrollmentDetails } = useGlobalState()
  const [activeUnit, setActiveUnit] = useState<{
    title: string
    id: number
    theme: 'primary' | 'secondary' | 'tertiary' | 'success' | 'premium' | 'danger'
  }>({
    title: '',
    id: -1,
    theme: 'primary'
  })
  const unitRefs = useRef<HTMLDivElement[]>([])
  const defaultUnitLessonProgressDirection: 'x' | "x'" = "x'"

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id
          const index = parseInt(id.replace('u', ''))

          if (activeUnit.id == index) return

          setActiveUnit({
            title: entry.target.getAttribute('title') || 'Unknown unit',
            id: index,
            theme: cardThemes[index] as 'primary' | 'secondary' | 'tertiary' | 'success' | 'premium' | 'danger'
          })
        }
      })
    },
    {
      threshold: 0.5
    }
  )

  const setRef = (el: HTMLDivElement | null, index: number) => {
    if (el) {
      unitRefs.current[index] = el
      observer.observe(el)
    }
  }

  if (!course || !user) {
    return <div>Loading...</div>
  }

  const section = course.Section.find(section => section.id === enrollmentDetails.sectionId)

  if (!section) {
    return <div>No section found, please contact support</div>
  }

  return (
    <section>
      <div className='bg-transparent p-4 z-10'></div>
      <div className='sticky top-0 z-10'>
        <div className='bg-white h-4'></div>
        <Card theme={activeUnit.theme}>
          <h2 className='font-display text-[rgba(255,255,255,.7)] uppercase'>Unit: {activeUnit.id}</h2>
          <h1 className='font-display text-[22px]'>{activeUnit.title}</h1>
        </Card>
      </div>

      {section.Unit.map((unit, index) => {
        defaultUnitLessonProgressDirection === "x'" ? 'x' : "x'"

        return (
          <div key={unit.id} title={unit.title} id={'u' + ++index} ref={el => setRef(el, index)}>
            <h1>{unit.title}</h1>
            <UnitChunk unit={unit} defaultUnitLessonProgressDirection={defaultUnitLessonProgressDirection} />
            <div className='h-screen'></div>
          </div>
        )
      })}
    </section>
  )
}
