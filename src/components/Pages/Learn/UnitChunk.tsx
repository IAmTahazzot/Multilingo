'use client'

import { LessonButton } from '@/components/Button/LessonButton'
import { useGlobalState } from '@/hooks/useGlobalState'
import { Lesson, Unit } from '@prisma/client'
import { CARD_THEMES, Theme } from './ProgressBoard'
import { useEffect } from 'react'

type LessonCardPosition = {
  direction: 'x' | "x'"
  position: number
}

type UnitChunkProps = {
  unit: Unit & { Lesson: Lesson[] }
  defaultUnitLessonProgressDirection: 'x' | "x'"
  index: number
  activeUnit: {
    title: string
    id: number
    theme: Theme
  }
}

export const UnitChunk = ({ unit, defaultUnitLessonProgressDirection, index, activeUnit }: UnitChunkProps) => {
  const { user, course, enrollmentDetails } = useGlobalState()

  useEffect(() => {
    const activeLessonDOM = document.querySelector('[data-active-lesson="true"]')

    if (activeLessonDOM) {
      // activeLessonDOM.scrollIntoView({
      //   behavior: 'smooth',
      //   block: 'center',
      //   inline: 'center'
      // })
      const yOffSet = -180
      const y = activeLessonDOM.getBoundingClientRect().top + window.scrollY + yOffSet
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }, [])

  if (!user || !course || !enrollmentDetails) {
    return null
  }

  const unitIndex = course.Section.flatMap(section => section.Unit).findIndex(mapUnit => mapUnit.id === unit.id)

  const LessonCardPosition: LessonCardPosition = {
    direction: defaultUnitLessonProgressDirection,
    position: 0
  }

  const positionMap = new Map<number, number>([
    [0, 0],
    [-1, -44],
    [-2, -70],
    [1, 44],
    [2, 70]
  ])

  const updateLessonCardPosition: (
    direction: 'x' | "x'",
    position: number
  ) => {
    direction: 'x' | "x'"
    position: number
  } = (direction, position) => {
    if (direction === "x'" && position === -2) {
      return { direction: 'x', position: -1 }
    } else if (direction === 'x' && position === 2) {
      return { direction: "x'", position: 1 }
    }

    return {
      direction,
      position: direction === "x'" ? position - 1 : position + 1
    }
  }

  return (
    <div>
      <div className='space-y-6 mt-6 flex flex-col items-center'>
        {index !== 0 && (
          <div className='flex items-center justify-center gap-6 my-12 self-stretch'>
            <div className='h-[1px] bg-neutral-300 flex-1'></div>
            <span className='font-display text-neutral-400 text-xl'> {unit.title} </span>
            <div className='h-[1px] bg-neutral-300 flex-1'></div>
          </div>
        )}

        {unit.Lesson.map(lesson => {
          const isCompleted = enrollmentDetails.lessonId > lesson.id
          const isCurrent = enrollmentDetails.lessonId === lesson.id
          const lessonQuestionsCount = course.Section.flatMap(section => section.Unit)
            .flatMap(unit => unit.Lesson)
            .find(lesson => lesson.id === lesson.id)?.Question.length
          const lessonProgressPercentage = (enrollmentDetails.questionCount / (lessonQuestionsCount || 1)) * 100
          let variant: Theme | 'disabled' = 'disabled'

          if (lesson.id < enrollmentDetails.lessonId + 1) {
            variant = CARD_THEMES[unitIndex]
          }

          const DOM = (
            <LessonButton
              icon={isCompleted ? 'check' : 'star'}
              key={lesson.id}
              style={{
                position: 'relative',
                left: `${positionMap.get(LessonCardPosition.position)}px`
              }}
              disabled={variant === 'disabled'}
              variant={variant}
              id={'lesson-' + lesson.id}
              data-active-lesson={isCurrent}
              isActive={isCurrent}
              activeFillPercentage={lessonProgressPercentage}
              lessonBeginDescription={
                <div>
                  <span>
                    Unit: {unitIndex + 1}, Lesson: {lesson.id}
                  </span>
                  <br />
                  <span>You&apos;ll get 20 XP</span>
                </div>
              }
              // requestedLesson= {{
              //   unitId: unit.id,
              //   lessonId: lesson.id
              // }}
            />
          )

          const { direction, position } = updateLessonCardPosition(
            LessonCardPosition.direction,
            LessonCardPosition.position
          )
          LessonCardPosition.direction = direction
          LessonCardPosition.position = position

          return DOM
        })}
      </div>
    </div>
  )
}
