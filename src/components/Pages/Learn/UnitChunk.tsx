'use client'

import { LessonButton } from '@/components/Button/LessonButton'
import { Lesson, Unit } from '@prisma/client'

type LessonCardPosition = {
  direction: 'x' | "x'"
  position: number
}

type UnitChunkProps = {
  unit: Unit & { Lesson: Lesson[] }
  defaultUnitLessonProgressDirection: 'x' | "x'"
}

export const UnitChunk = ({ unit, defaultUnitLessonProgressDirection }: UnitChunkProps) => {
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
      <div className='space-y-5 mt-6 flex flex-col items-center'>
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
