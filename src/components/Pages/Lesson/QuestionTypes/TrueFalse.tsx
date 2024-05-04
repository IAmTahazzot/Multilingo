import { Card } from '@/components/Card/Card'
import { Question, Option } from '@prisma/client'
import { useMemo } from 'react'

type TrueFalseOptionsProps = {
  question: Question & { Option: Option[] }
  setAnswer: React.Dispatch<React.SetStateAction<string>>
  setSelectedDOM: React.Dispatch<React.SetStateAction<HTMLElement | null>>
  isChcked: boolean
}

export const TrueFalseOptions = ({ question, setAnswer, setSelectedDOM, isChcked }: TrueFalseOptionsProps) => {
  const IS_TRUE = question.Option[0].isCorrect
  const ID = question.Option[0].id
  const ID_ONE = useMemo(() => Math.random().toString(36).substring(7), [question])
  const ID_TWO = useMemo(() => Math.random().toString(36).substring(7), [question])

  const options = [
    {
      id: IS_TRUE ? ID : '1' + ID_ONE,
      title: 'True'
    },
    {
      id: !IS_TRUE ? ID : '2' + ID_TWO,
      title: 'False'
    }
  ]

  return (
    <div className='flex gap-4'>
      {options.map(option => (
        <Card
          key={option.id}
          theme='smallCard'
          className='flex-1'
          data-card={true}
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
          }}>
          <h3 className='text-center mt-4 text-lg'>{option.title}</h3>
        </Card>
      ))}
    </div>
  )
}
