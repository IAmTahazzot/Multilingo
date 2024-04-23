'use client'

import { Card } from '@/components/Card/Card'
import { useGlobalState } from '@/hooks/useGlobalState'
import { useState, useRef, useEffect } from 'react'
import { UnitChunk } from './UnitChunk'

export const ProgressBoard = () => {
  console.log('ProgressBoard is summoned!')
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
  const defaultUnitLessonProgressDirection: 'x' | "x'" = "x'"

  const Observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!course) {
            return
          }

          const unitId = entry.target.id
          const unitIndex = parseInt(entry.target.getAttribute('data-index') || '0')
          const unit = course.Section.flatMap(section => section.Unit).find(unit => unit.id === unitId)

          if (unit) {
            setActiveUnit(prev => ({
              ...prev,
              title: unit.title,
              id: unitIndex,
              theme: (cardThemes[unitIndex] || 'primary') as
                | 'primary'
                | 'secondary'
                | 'tertiary'
                | 'success'
                | 'premium'
                | 'danger'
            }))
          }
        }
      })
    },
    {
      rootMargin: '-100% 0px 0px 0px',
      threshold: 0
    }
  )

  useEffect(() => {
    const units = document.querySelectorAll('section[class^="unit-"]')

    if (units.length === 0) {
      return
    }

    units.forEach(unit => {
      Observer.observe(unit)
    })

    return () => {
      units.forEach(unit => {
        Observer.unobserve(unit)
      })
    }
  }, [course])

  if (!course || !user) {
    return <div>Loading...</div>
  }

  const section = course.Section.find(section => section.id === enrollmentDetails.sectionId)

  if (!section) {
    return <div>No section found, please contact support</div>
  }

  return (
    <section>
      <div className='p-2'></div>
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
          <section key={unit.id} title={unit.title} id={unit.id} className={'unit-' + unit.id} data-index={++index}>
            <UnitChunk unit={unit} defaultUnitLessonProgressDirection={defaultUnitLessonProgressDirection} />
            <div className='h-screen'></div>
          </section>
        )
      })}
    </section>
  )
}
