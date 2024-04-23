'use client'

import { Card } from '@/components/Card/Card'
import { useGlobalState } from '@/hooks/useGlobalState'
import { useState, useEffect, useMemo } from 'react'
import { UnitChunk } from './UnitChunk'

const CARD_THEMES = ['primary', 'secondary', 'tertiary', 'success', 'premium', 'danger'] as const
type Theme = (typeof CARD_THEMES)[number]

export const ProgressBoard = () => {
  const { course, user, enrollmentDetails } = useGlobalState()
  const [activeUnit, setActiveUnit] = useState<{
    title: string
    id: number
    theme: Theme
  }>({
    title: '',
    id: -1,
    theme: 'primary'
  })
  const sectionId = useMemo(() => {
    const currentSection = course?.Section.find(section => section.id === enrollmentDetails.sectionId)

    if (!currentSection) {
      return null
    }

    let ID = course?.Section.findIndex(section => section.id === currentSection.id)

    if (ID === undefined) {
      return 0
    }

    return ID + 1
  }, [course, enrollmentDetails.sectionId])

  let defaultUnitLessonProgressDirection: 'x' | "x'" = 'x'

  const ObserverCallback = (entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      try {
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
              theme: (CARD_THEMES[unitIndex] || 'primary') as Theme
            }))
          }
        }
      } catch (error) {
        console.error('Error in ProgressBoard ObserverCallback:', error)
      }
    })
  }

  const ObserverOption: IntersectionObserverInit = {
    rootMargin: '-100% 0px 0px 0px',
    threshold: 0
  }
  const Observer = new IntersectionObserver(ObserverCallback, ObserverOption)

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
          <h2 className='font-display text-[rgba(255,255,255,.7)] uppercase'>
            <span>{sectionId && `Section: ${sectionId}`}</span>
            <span>, </span>
            <span>Unit: {activeUnit.id}</span>
          </h2>
          <h1 className='font-display text-[22px]'>{activeUnit.title}</h1>
        </Card>
      </div>

      {section.Unit.map((unit, index) => {
        defaultUnitLessonProgressDirection = defaultUnitLessonProgressDirection === "x'" ? 'x' : "x'"

        return (
          <section key={unit.id} title={unit.title} id={unit.id} className={'unit-' + unit.id} data-index={index + 1}>
            <UnitChunk
              unit={unit}
              defaultUnitLessonProgressDirection={defaultUnitLessonProgressDirection}
              index={index}
            />
          </section>
        )
      })}
    </section>
  )
}
