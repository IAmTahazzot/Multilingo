'use client'

import { Card } from '@/components/Card/Card'
import { useGlobalState } from '@/hooks/useGlobalState'
import { useState, useEffect, useMemo } from 'react'
import { UnitChunk } from './UnitChunk'
import { Loading } from '@/components/Loading/Loading'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const CARD_THEMES = ['primary', 'secondary', 'tertiary', 'success', 'premium', 'danger'] as const
export type Theme = (typeof CARD_THEMES)[number]

export const ProgressBoard = () => {
  const { course, user, enrollmentDetails, requestedLesson, setRequestedLesson } = useGlobalState()
  const [activeUnit, setActiveUnit] = useState<{
    title: string
    id: number
    theme: Theme
  }>({
    title: '',
    id: -1,
    theme: 'primary'
  })
  let defaultUnitLessonProgressDirection: 'x' | "x'" = 'x'
  const section = useMemo(() => {
    if (!course?.Section) {
      return null
    }

    if (requestedLesson.sectionId) {
      const validate = course.Section.find(section => section.id === requestedLesson.sectionId)

      if (validate) {
        setActiveUnit(prev => {
          return {
            ...prev,
            title: validate.Unit[0].title || '',
            id: 1
          }
        })
        return validate
      }

      console.log('again...')
    }

    const section = course.Section.find(section => section.id === enrollmentDetails.sectionId)

    setActiveUnit(prev => {
      return {
        ...prev,
        title: section?.Unit[0].title || '',
        id: 1
      }
    })

    return section
  }, [course, enrollmentDetails, requestedLesson])

  const sectionIndex = useMemo(() => {
    if (requestedLesson.sectionId) {
      const validate = course?.Section.findIndex(section => section.id === requestedLesson.sectionId)

      if (validate && validate !== -1) {
        return validate + 1
      }
    }

    const sectionIndex = course?.Section.findIndex(section => section.id === enrollmentDetails.sectionId)

    if (sectionIndex === undefined) {
      return 0
    }

    return sectionIndex + 1
  }, [course, enrollmentDetails.sectionId, requestedLesson])

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
              theme: (CARD_THEMES[unitIndex - 1] || 'primary') as Theme
            }))
          }
        }
      } catch (error) {
        console.error('Error in ProgressBoard ObserverCallback:', error)
      }
    })
  }
  const ObserverOption: IntersectionObserverInit = {
    rootMargin: '0px 0px -90% 0px',
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
  }, [course, requestedLesson])

  if (!course || !user) {
    return <Loading />
  }

  if (!section) {
    return <div>No section found, please contact support</div>
  }
  return (
    <section>
      <div className='p-2'></div>
      <div className='sticky top-0 z-20'>
        <div className='bg-white h-4'></div>
        <Card theme={activeUnit.theme}>
          <h2 className='flex items-center gap-2 font-display text-[rgba(255,255,255,.7)] uppercase'>
            <span>
              <Link href='/sections'>
                <ArrowLeft size='20' />
              </Link>
            </span>
            <span>{sectionIndex && `Section: ${sectionIndex}`},</span>
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
              activeUnit={activeUnit}
            />
          </section>
        )
      })}

      <div className='space h-32'></div>
    </section>
  )
}
