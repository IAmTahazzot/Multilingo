/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useEffect, useRef, useState } from 'react'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Form, FormDescription, FormItem, FormLabel } from '@/components/ui/form'
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/Card/Card'
import { toast } from 'sonner'

import { z } from 'zod'
import { Option, Question, QuestionType } from '@prisma/client'
import { createQuestion, updateQuestion } from '@/actions/question'
import { cn } from '@/lib/utils'
import { LessonStateProps } from '@/lib/types'
import * as LR from '@uploadcare/blocks'

LR.registerBlocks(LR)

export const questionSchema = z.object({
  question: z.string().min(2, { message: 'Question is too short' }),
  option1: z.string().optional(),
  option2: z.string().optional(),
  option3: z.string().optional(),
  option4: z.string().optional(),
  option5: z.string().optional(),
  option6: z.string().optional(),
  option1_image: z.string().optional(),
  option2_image: z.string().optional(),
  option3_image: z.string().optional(),
  answer: z.string()
})

export const QuestionForm = ({
  state,
  setState,
  question
}: LessonStateProps & { question?: Question & { Option: Option[] } }) => {
  const [type, setType] = useState<'MULTIPLE_CHOICE_IMAGE' | 'MULTIPLE_CHOICE' | 'REARRANGE' | 'TRUE_FALSE'>(
    question?.type || QuestionType.MULTIPLE_CHOICE
  )
  const optionImage1Ref = useRef<typeof LR.UploadCtxProvider.prototype & LR.UploadCtxProvider>(null)
  const optionImage2Ref = useRef<typeof LR.UploadCtxProvider.prototype & LR.UploadCtxProvider>(null)
  const optionImage3Ref = useRef<typeof LR.UploadCtxProvider.prototype & LR.UploadCtxProvider>(null)

  const form = useForm({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      question: question?.title || '',
      type: question?.type || QuestionType.MULTIPLE_CHOICE,
      option1: question?.Option[0]?.title || '',
      option2: question?.Option[1]?.title || '',
      option3: question?.Option[2]?.title || '',
      option4: question?.Option[0]?.title || '',
      option5: question?.Option[1]?.title || '',
      option6: question?.Option[2]?.title || '',
      option1_image: question?.Option[0]?.imageUrl || '',
      option2_image: question?.Option[1]?.imageUrl || '',
      option3_image: question?.Option[2]?.imageUrl || '',
      answer: '-1'
    }
  })

  useEffect(() => {
    form.reset()
  }, [type])

  useEffect(() => {
    if (!optionImage1Ref.current) return
    const handleUpload = async (e: any) => {
      const imageUrl = e.detail.fileInfo.cdnUrl + e.detail.fileInfo.name
      form.setValue('option1_image', imageUrl)
    }
    optionImage1Ref.current.addEventListener('file-upload-success', handleUpload)
  }, [])

  useEffect(() => {
    if (!optionImage2Ref.current) return
    const handleUpload = async (e: any) => {
      const imageUrl = e.detail.fileInfo.cdnUrl + e.detail.fileInfo.name
      form.setValue('option2_image', imageUrl)
    }
    optionImage2Ref.current.addEventListener('file-upload-success', handleUpload)
  }, [])

  useEffect(() => {
    if (!optionImage3Ref.current) return
    const handleUpload = async (e: any) => {
      const imageUrl = e.detail.fileInfo.cdnUrl + e.detail.fileInfo.name
      form.setValue('option3_image', imageUrl)
    }
    optionImage3Ref.current.addEventListener('file-upload-success', handleUpload)
  }, [])

  const saveQuestion = async (data: z.infer<typeof questionSchema>) => {
    if (!state.lesson.selectedLessonId) {
      return toast.warning('Please select a lesson to add a question')
    }

    switch (type) {
      case 'MULTIPLE_CHOICE':
        if (!data.option1 || !data.option2 || !data.option3 || !/^[1-3]$/.test(data.answer)) {
          return toast.warning('All options are required for multiple choice question')
        }
        break
      case 'MULTIPLE_CHOICE_IMAGE':
        if (
          !data.option4 ||
          !data.option5 ||
          !data.option6 ||
          !data.option1_image ||
          !data.option2_image ||
          !data.option3_image ||
          !/^[4-6]$/.test(data.answer)
        ) {
          return toast.warning('Image and all options are required for multiple choice image question')
        }
        break

      case 'TRUE_FALSE':
        if (!/^(true|false)$/i.test(data.answer)) {
          return toast.warning('Please select an answer for true/false question')
        }
        break
      default:
        break
    }

    try {
      let res: Question & { Option: Option[] }

      if (question) {
        res = await updateQuestion({
          ...data,
          type,
          prevQuestion: question
        })

        setState(prev => {
          return {
            ...prev,
            question: prev.question.map(q => (q.id === res.id ? res : q))
          }
        })
      } else {
        res = await createQuestion({
          ...data,
          type,
          lessonId: state.lesson.selectedLessonId
        })

        setState(prev => {
          return {
            ...prev,
            question: [...prev.question, res]
          }
        })
      }

      if (!res) {
        throw new Error('Failed to save question')
      }

      toast.success('Question saved successfully')

      if (!question) {
        form.reset()
      }
    } catch (error) {
      const errorMessage = (error as Error).message || 'Failed to save question'
      toast.error(errorMessage)
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(saveQuestion)} className='space-y-6'>
          <div className='grid grid-cols-[250px_1fr] gap-6'>
            <FormItem>
              <FormLabel htmlFor='q_type'>Question Type</FormLabel>
              {question ? (
                <div>
                  <Button variant={'outline'} type='button' disabled id='q_type'>
                    {type}
                  </Button>
                </div>
              ) : (
                <Select
                  // id='q_type'
                  defaultValue={type}
                  onValueChange={(value: 'MULTIPLE_CHOICE_IMAGE' | 'MULTIPLE_CHOICE' | 'REARRANGE' | 'TRUE_FALSE') => {
                    setType(QuestionType[value])
                  }}>
                  <SelectTrigger>
                    <SelectValue placeholder='Choose a question type'></SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(QuestionType).map((key, index) => {
                      return (
                        <SelectItem key={index} value={key}>
                          {key}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              )}
              <FormDescription>
                Select the type of question you want to create. The options will appear based on the selected type.
              </FormDescription>
            </FormItem>
            <FormItem>
              <FormLabel htmlFor='q'>Question</FormLabel>
              <Input type='text' {...form.register('question')} autoComplete='off' spellCheck='false' id='q' />
              <FormDescription className='text-red-500'>{form.formState.errors?.question?.message}</FormDescription>
            </FormItem>
          </div>

          {/* -------------------------------- [BEGIN] Dynamic Form Fields -------------------------------- */}
          <div className={cn('hidden grid-cols-3 gap-6', type === QuestionType.MULTIPLE_CHOICE && 'grid')}>
            <Card theme='default' className='p-6 text-center'>
              <FormItem>
                <FormLabel htmlFor='q_option_1'>Option 1</FormLabel>
                <Input type='text' {...form.register('option1')} id='q_option_1' />
                <Input type='radio' value='1' {...form.register('answer')} />
              </FormItem>
            </Card>
            <Card theme='default' className='p-6 text-center'>
              <FormItem>
                <FormLabel htmlFor='q_option_2'>Option 2</FormLabel>
                <Input type='text' {...form.register('option2')} id='q_option_2' />
                <Input type='radio' value='2' {...form.register('answer')} />
              </FormItem>
            </Card>
            <Card theme='default' className='p-6 text-center'>
              <FormItem>
                <FormLabel htmlFor='q_option_3'>Option 3</FormLabel>
                <Input type='text' {...form.register('option3')} id='q_option_3' />
                <Input type='radio' value='3' {...form.register('answer')} />
              </FormItem>
            </Card>
          </div>

          <div className={cn('hidden grid-cols-3 gap-6', type === QuestionType.MULTIPLE_CHOICE_IMAGE && 'grid')}>
            <Card theme='default' className='p-6 text-center'>
              <FormItem className='space-y-2'>
                <FormLabel htmlFor='q_option_4'>Option</FormLabel>
                <div className='space-y-2'>
                  {form.watch('option1_image') && (
                    <div className='relative rounded-lg overflow-hidden aspect-square'>
                      <img
                        src={form.getValues('option1_image')}
                        className='object-cover h-full w-full'
                        alt='option 1 image'
                      />
                    </div>
                  )}
                  <div>
                    <lr-config
                      ctx-name='optionImage1'
                      pubkey='50d83aa24c3b01e5023e'
                      image-only='true'
                      multiple='false'
                    />
                    <lr-file-uploader-regular
                      ctx-name='optionImage1'
                      css-src={`https://cdn.jsdelivr.net/npm/@uploadcare/blocks@0.35.2/web/lr-file-uploader-regular.min.css`}
                    />
                    <lr-upload-ctx-provider ctx-name='optionImage1' ref={optionImage1Ref} />
                  </div>
                </div>
                <Input type='text' {...form.register('option4')} id='q_option_4' />
                <Input type='radio' value='4' {...form.register('answer')} />
              </FormItem>
            </Card>
            <Card theme='default' className='p-6 text-center'>
              <FormItem className='space-y-2'>
                <FormLabel htmlFor='q_option_5'>Option</FormLabel>
                <div className='space-y-2'>
                  {form.watch('option2_image') && (
                    <div className='relative rounded-lg overflow-hidden aspect-square'>
                      <img
                        src={form.getValues('option2_image')}
                        className='object-cover h-full w-full'
                        alt='option 2 image'
                      />
                    </div>
                  )}
                  <div>
                    <lr-config
                      ctx-name='optionImage2'
                      pubkey='50d83aa24c3b01e5023e'
                      image-only='true'
                      multiple='false'
                    />
                    <lr-file-uploader-regular
                      ctx-name='optionImage2'
                      css-src={`https://cdn.jsdelivr.net/npm/@uploadcare/blocks@0.35.2/web/lr-file-uploader-regular.min.css`}
                    />
                    <lr-upload-ctx-provider ctx-name='optionImage2' ref={optionImage2Ref} />
                  </div>
                </div>
                <Input type='text' {...form.register('option5')} id='q_option_5' />
                <Input type='radio' value='5' {...form.register('answer')} />
              </FormItem>
            </Card>

            <Card theme='default' className='p-6 text-center'>
              <FormItem className='space-y-2'>
                <FormLabel htmlFor='q_option_6'>Option</FormLabel>
                <div className='space-y-2'>
                  {form.watch('option3_image') && (
                    <div className='relative rounded-lg overflow-hidden aspect-square'>
                      <img
                        src={form.getValues('option3_image')}
                        className='object-cover h-full w-full'
                        alt='option 3 image'
                      />
                    </div>
                  )}
                  <div>
                    <lr-config
                      ctx-name='optionImage3'
                      pubkey='50d83aa24c3b01e5023e'
                      image-only='true'
                      multiple='false'
                    />
                    <lr-file-uploader-regular
                      ctx-name='optionImage3'
                      css-src={`https://cdn.jsdelivr.net/npm/@uploadcare/blocks@0.35.2/web/lr-file-uploader-regular.min.css`}
                    />
                    <lr-upload-ctx-provider ctx-name='optionImage3' ref={optionImage3Ref} />
                  </div>
                </div>
                <Input type='text' {...form.register('option6')} id='q_option_6' />
                <Input type='radio' value='6' {...form.register('answer')} />
              </FormItem>
            </Card>

            <FormDescription className='col-span-4'>
              Fill the correct answer by selecting the radio button of the correct option.
            </FormDescription>
          </div>

          <div className={cn('hidden grid-cols-1 gap-6', type === QuestionType.TRUE_FALSE && 'grid')}>
            <FormItem>
              <FormLabel htmlFor='q_boolean'>Declare weather the question is truth or false.</FormLabel>
              <div className='flex items-center gap-4'>
                <Card theme='default' className='space-y-2'>
                  <Input type='radio' value='true' {...form.register('answer')} id='q_boolean' />
                  <span>Truth</span>
                </Card>
                <Card theme='default' className='space-y-2'>
                  <Input type='radio' value='false' {...form.register('answer')} />
                  <span>False</span>
                </Card>
              </div>
            </FormItem>
          </div>

          {/* -------------------------------- [END] Dynamic Form Fields -------------------------------- */}

          <Button type='submit' variant={'default'} size={'lg'}>
            {form.formState.isSubmitting ? 'Saving...' : 'Save Question'}
          </Button>
        </form>
      </Form>
    </div>
  )
}
