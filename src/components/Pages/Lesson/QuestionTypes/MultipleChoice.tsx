import { Card } from '@/components/Card/Card'
import { Question, Option } from '@prisma/client'

type MultipleChoiceProps = {
  question: Question & { Option: Option[] }
  setAnswer: React.Dispatch<React.SetStateAction<string>>
  setSelectedDOM: React.Dispatch<React.SetStateAction<HTMLElement | null>>
  isChcked: boolean
}

export const MultipleChoice = ({ question, setAnswer, setSelectedDOM, isChcked }: MultipleChoiceProps) => {
  return (
    <div className='flex flex-wrap gap-4'>
      {question.Option.map(option => (
        <Card
          key={option.id}
          theme='smallCard'
          className='flex-1 min-w-[200px]'
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
