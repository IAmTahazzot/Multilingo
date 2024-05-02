import { Card } from '@/components/Card/Card'
import { Option, Question } from '@prisma/client'
import Image from 'next/image'
import React from 'react'

type MultipleChoiceImageProps = {
  question: Question & { Option: Option[] }
  setAnswer: React.Dispatch<React.SetStateAction<string>>
  setSelectedDOM: React.Dispatch<React.SetStateAction<HTMLElement | null>>
  isChcked: boolean
}

export const MultipleChoiceImage = ({ question, setAnswer, setSelectedDOM, isChcked }: MultipleChoiceImageProps) => {
  return (
    <div className='flex gap-4 flex-wrap'>
      {question.Option.map(option => (
        <Card
          key={option.id}
          theme='smallCard'
          className='flex-1 min-w-[200px]'
          onClick={e => {
            if (isChcked) return

            setAnswer(option.id)

            try {
              // @ts-ignore
              const elm = e.target.closest('[data-card]')
              document.querySelectorAll('[data-card]').forEach(el => {
                el.classList.remove('border-sky-500', 'bg-sky-100', 'hover:bg-sky-200')
              })

              if (elm) {
                setSelectedDOM(elm)
                elm.classList.add('border-sky-500', 'bg-sky-100', 'hover:bg-sky-200')
              }
            } catch (e) {
              console.warn('Failed to select option card for question', e)
            }
          }}
          data-card='true'>
          <div className='relative w-full h-[150px] overflow-hidden'>
            <Image src={option.imageUrl!} fill className='object-cover' alt={question.title} priority={true} />
          </div>
          <h3 className='text-center mt-4 text-lg'>{option.title}</h3>
        </Card>
      ))}
    </div>
  )
}
