'use client'

import { LessonButton } from '@/components/Button/LessonButton'
import { useGlobalState } from '@/hooks/useGlobalState'
import { Lesson, Unit } from '@prisma/client'

type LessonCardPosition = {
  direction: 'x' | "x'"
  position: number
}

type UnitChunkProps = {
  unit: Unit & { Lesson: Lesson[] }
  defaultUnitLessonProgressDirection: 'x' | "x'"
  index: number
}

export const UnitChunk = ({ unit, defaultUnitLessonProgressDirection, index }: UnitChunkProps) => {
  const { user, course, enrollmentDetails } = useGlobalState()

  if (!user || !course || !enrollmentDetails) {
    return null
  }

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
          const DOM = (
            <LessonButton
              href='/'
              icon='star'
              key={lesson.id}
              style={{
                position: 'relative',
                left: `${positionMap.get(LessonCardPosition.position)}px`
              }}
              disabled={lesson.id !== 1}
              variant={lesson.id === 1 ? 'primary' : 'disabled'}
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
