'use client'

import { Button } from '@/components/Button/Button'
import { Card } from '@/components/Card/Card'
import { useGlobalState } from '@/hooks/useGlobalState'
import Image from 'next/image'
import React, { useEffect, useMemo, useState } from 'react'
import { MultipleChoiceImage } from './QuestionTypes/MultipleChoiceImage'
import { MultipleChoice } from './QuestionTypes/MultipleChoice'
import { cn } from '@/lib/utils'
import { complimentMessages } from '@/lib/complimentMessages'
import { deductHeart } from '@/actions/global'
import { toast } from 'sonner'
import Link from 'next/link'
import { LessonReview } from './LessonReview'

export const LessonContent = () => {
  const { user, course, enrollmentDetails, setUser } = useGlobalState()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answer, setAnswer] = useState<string>('')
  const [isChecked, setIsChecked] = useState<boolean>(false)
  const [selectedDOM, setSelectedDOM] = useState<HTMLElement | null>(null)
  const [lessonProgressPercentage, setLessonProgressPercentage] = useState<number>(0)
  const [lessonCompleted, setLessonCompleted] = useState<boolean>(false)

  const questions = useMemo(() => {
    return course?.Section.find(section => section.id === enrollmentDetails?.sectionId)
      ?.Unit.find(unit => unit.id === enrollmentDetails?.unitId)
      ?.Lesson.find(lesson => lesson.id === enrollmentDetails?.lessonId)?.Question
  }, [course, enrollmentDetails])

  if (!user || !course || !enrollmentDetails) {
    return null
  }

  if (!questions) {
    return <div>No questions found</div>
  }

  const question = questions[currentQuestionIndex]
  const correctOption = question.Option.find(o => o.isCorrect)

  const checkAnswer = async () => {
    if (isChecked) {
      // check if there are more questions
      if (currentQuestionIndex + 1 === questions.length) {
        setLessonCompleted(true)
        return
      }

      setAnswer('')
      setIsChecked(false)
      setCurrentQuestionIndex(prev => prev + 1)
      return setSelectedDOM(null)
    }

    if (answer === correctOption?.id) {
      // correct
      selectedDOM?.classList.remove(
        'border-sky-500',
        'bg-sky-100',
        'hover:bg-sky-200',
        'border-neutral-200',
        'hover:bg-neutral-100'
      )
      selectedDOM?.classList.add('border-[#a5ed6e]', 'bg-[#d7ffb8]', 'hover:bg-[#d7ffb8]')
    } else {
      // wrong

      // update option card UI
      selectedDOM?.classList.remove('border-sky-500', 'bg-sky-100', 'hover:bg-sky-200')
      selectedDOM?.classList.add('border-rose-300', 'bg-rose-100', 'hover:bg-rose-100')

      // Deduct one from the total heart count
      try {
        const res = await deductHeart(user.id)

        if (res === -1) {
          return toast.error('You have no hearts left. Please try again later.')
        }

        if (typeof res === 'number') {
          return toast.error('Failed to update user data. Please try again.')
        }

        // sync global state
        setUser({
          ...user,
          hearts: res.hearts
        })
      } catch (error) {
        return toast.error('Failed to update user data. Please try again.')
      }
    }

    // update progress bar
    setLessonProgressPercentage(((currentQuestionIndex + 1) / questions.length) * 100)

    setIsChecked(true)
  }

  const MULTIPLE_CHOICE_IMAGE_OPTIONS = question.type === 'MULTIPLE_CHOICE_IMAGE' && (
    <MultipleChoiceImage
      question={question}
      setAnswer={setAnswer}
      isChcked={isChecked}
      setSelectedDOM={setSelectedDOM}
    />
  )

  const MULTIPLE_CHOICE_OPTIONS = question.type === 'MULTIPLE_CHOICE' && (
    <MultipleChoice question={question} setAnswer={setAnswer} isChcked={isChecked} setSelectedDOM={setSelectedDOM} />
  )

  const CHECKED_REVIEW = (
    <div>
      {answer === correctOption?.id ? (
        <div className='flex gap-6 items-center'>
          <div className='flex items-center justify-center h-20 w-20 rounded-full bg-white'>
            <svg width='41' height='29' viewBox='0 0 41 29' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M5 13.6043L14.5303 23.0583C15.2284 23.7509 16.3544 23.7509 17.0525 23.0583L35.2565 5'
                stroke='#58A700'
                strokeWidth='10'
                strokeLinecap='round'
              />
            </svg>
          </div>

          <div className='space-y-2'>
            <h1 className='text-[var(--color-primary)] font-display text-2xl'>
              {complimentMessages[Math.floor(Math.random() * complimentMessages.length)]}
            </h1>
          </div>
        </div>
      ) : (
        <div className='flex gap-6 items-center'>
          <div className='flex items-center justify-center h-20 w-20 rounded-full bg-white'>
            <svg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M28.5355 8.53553C30.4882 6.58291 30.4882 3.41709 28.5355 1.46447C26.5829 -0.488155 23.4171 -0.488155 21.4645 1.46447L14.9995 7.92942L8.53602 1.46593C6.5834 -0.486691 3.41758 -0.486691 1.46495 1.46593C-0.487667 3.41855 -0.487667 6.58438 1.46495 8.537L7.92844 15.0005L1.46447 21.4645C-0.488155 23.4171 -0.488155 26.5829 1.46447 28.5355C3.41709 30.4882 6.58291 30.4882 8.53553 28.5355L14.9995 22.0716L21.465 28.537C23.4176 30.4896 26.5834 30.4896 28.536 28.537C30.4886 26.5844 30.4886 23.4186 28.536 21.4659L22.0706 15.0005L28.5355 8.53553Z'
                fill='#EA2B2B'
              />
            </svg>
          </div>

          <div className='space-y-2'>
            <h1 className='text-rose-600 font-display text-2xl'>Correct solution:</h1>
            <p className='text-rose-600'>
              {question.Option.find(o => o.isCorrect)?.title || 'No correct answer found'}
            </p>
          </div>
        </div>
      )}
    </div>
  )

  const ACTION_BUTTON_THEME = !answer
    ? 'disabled'
    : !isChecked
      ? 'primary'
      : answer === correctOption?.id
        ? 'primary'
        : 'danger'

  if (lessonCompleted) {
    return <LessonReview />
  }

  return (
    <div className='grid grid-rows-[100px_1fr_140px] grid-cols-[100%] min-h-[690px] h-full'>
      <header className='w-full self-center'>
        <LessonContentContainer className='flex items-center justify-between gap-6'>
          <Link href='/learn'>
            <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M2.62126 0.792893C2.23074 0.402369 1.59757 0.402369 1.20705 0.792893C0.816525 1.18342 0.816525 1.81658 1.20705 2.20711L8.58588 9.58594L0.793137 17.3787C0.402613 17.7692 0.402613 18.4024 0.793137 18.7929C1.18366 19.1834 1.81683 19.1834 2.20735 18.7929L10.0001 11.0002L17.7928 18.7929C18.1834 19.1834 18.8165 19.1834 19.207 18.7929C19.5976 18.4024 19.5976 17.7692 19.207 17.3787L11.4143 9.58594L18.7931 2.20711C19.1837 1.81658 19.1837 1.18342 18.7931 0.792893C18.4026 0.402369 17.7694 0.402369 17.3789 0.792893L10.0001 8.17172L2.62126 0.792893Z'
                fill='#AFAFAF'
              />
            </svg>
          </Link>

          <div className='flex-1 h-4 rounded-full bg-neutral-200 relative'>
            <div
              className='h-full rounded-full bg-[var(--color-primary)] transition-[width] duration-500'
              style={{
                width: `${lessonProgressPercentage}%`
              }}></div>
            <div
              className='absolute top-[4px] h-[4.8px] translate-x-2 rounded-full bg-white opacity-30 transition-[width] duration-500'
              style={{
                width: `${lessonProgressPercentage - 2}%`
              }}></div>
          </div>

          <div className='flex items-center gap-2'>
            <svg width='33' height='32' viewBox='0 0 33 32' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M3 12.6798C3 15.2727 4.31423 17.5654 6.32688 18.9559L14.9105 26.445C15.9302 27.3347 17.4537 27.3228 18.4595 26.4174L27.092 18.6456C28.8662 17.2376 30.0001 15.0882 30.0001 12.6798C30.0001 8.43862 26.4839 5.00049 22.1464 5.00049C19.93 5.00049 17.928 5.89823 16.5 7.34212C15.0721 5.89823 13.0701 5.00049 10.8537 5.00049C6.51622 5.00049 3 8.43862 3 12.6798Z'
                fill='#FF4B4B'
              />
              <path
                opacity='0.3'
                fillRule='evenodd'
                clipRule='evenodd'
                d='M10.5348 15.9898C12.2687 15.9898 13.6743 14.5427 13.6743 12.7576C13.6743 10.9725 12.2687 9.52539 10.5348 9.52539C8.80088 9.52539 7.39526 10.9725 7.39526 12.7576C7.39526 14.5427 8.80088 15.9898 10.5348 15.9898Z'
                fill='white'
              />
            </svg>
            <span className='font-display text-rose-500'>{user.hearts}</span>
          </div>
        </LessonContentContainer>
      </header>

      <main className='w-full self-center'>
        <LessonContentContainer className='max-w-[700px]'>
          <h1 className='font-display text-[36px] pl-1 mb-14'>{question.title}</h1>

          {/* BEGIN: QUESTION OPTIONS USING THEIR OWN TYPE */}
          {MULTIPLE_CHOICE_IMAGE_OPTIONS}
          {MULTIPLE_CHOICE_OPTIONS}
          {/* END: QUESTION OPTIONS */}
        </LessonContentContainer>
      </main>

      <footer
        className={cn(
          'border-t flex items-center',
          isChecked ? 'border-transparent' : 'border-neutral-200',
          isChecked && (answer === correctOption?.id ? 'bg-[#d7ffb8]' : 'bg-[#ffedf0]')
        )}>
        <div className='flex items-center justify-between max-w-[1024px] mx-auto w-full'>
          <div>
            {isChecked ? (
              CHECKED_REVIEW
            ) : (
              <Button theme='default' className='w-[150px]'>
                Skip
              </Button>
            )}
          </div>
          <Button theme={ACTION_BUTTON_THEME} className='w-[150px]' disabled={!answer} onClick={checkAnswer}>
            {!answer || !isChecked ? 'Check' : 'Continue'}
          </Button>
        </div>
      </footer>
    </div>
  )
}

const LessonContentContainer = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={cn('max-w-[1024px] mx-auto', className)}>{children}</div>
}
