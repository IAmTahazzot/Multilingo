/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useEffect, useRef, useState } from 'react'
import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { LessonStateProps } from '@/lib/types'
import { Option, Question, QuestionType } from '@prisma/client'
import { useForm } from 'react-hook-form'
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import * as LR from '@uploadcare/blocks'
import { Card } from '@/components/Card/Card'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { createQuestion, updateQuestion } from '@/actions/question'
import { toast } from 'sonner'

LR.registerBlocks(LR)

export const questionSchema = z.object({
  question: z.string().min(10, { message: 'Question is too short' }),
  option1: z.string().optional(),
  option2: z.string().optional(),
  option3: z.string().optional(),
  option4: z.string().optional(),
  option5: z.string().optional(),
  option6: z.string().optional(),
  option7: z.string().optional(),
  option8: z.string().optional(),
  option1_image: z.string().optional(),
  option2_image: z.string().optional(),
  option3_image: z.string().optional(),
  option4_image: z.string().optional(),
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
  const optionImage4Ref = useRef<typeof LR.UploadCtxProvider.prototype & LR.UploadCtxProvider>(null)

  const form = useForm({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      question: question?.title || '',
      type: question?.type || QuestionType.MULTIPLE_CHOICE,
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      option5: '',
      option6: '',
      option7: '',
      option8: '',
      option1_image: '',
      option2_image: '',
      option3_image: '',
      option4_image: '',
      answer: '-1'
    }
  })

  // SET DEFAULT VALUES FOR EDIT QUESTION
  if (question) {
    console.log('------- update question log -------')
    console.log(form)

    form.setValue('question', question.title)
    form.setValue('type', question.type)

    if (question.type === QuestionType.MULTIPLE_CHOICE && question.Option.length === 4) {
      form.setValue('option1', question.Option[0].title || 'fuck me')
      form.setValue('option2', question.Option[1].title || '')
      form.setValue('option3', question.Option[2].title || '')
      form.setValue('option4', question.Option[3].title || '')

      const correctOption = question.Option.findIndex(op => op.isCorrect)
      form.setValue('answer', (correctOption + 1).toString() || '-1')
    }

    if (question.type === QuestionType.MULTIPLE_CHOICE_IMAGE) {
      form.setValue('option5', question.Option[0]?.title || '')
      form.setValue('option6', question.Option[1]?.title || '')
      form.setValue('option7', question.Option[2]?.title || '')
      form.setValue('option8', question.Option[3]?.title || '')
      form.setValue('option1_image', question.Option[0]?.imageUrl || '')
      form.setValue('option2_image', question.Option[1]?.imageUrl || '')
      form.setValue('option3_image', question.Option[2]?.imageUrl || '')
      form.setValue('option4_image', question.Option[3]?.imageUrl || '')
    }

    if (question.type === QuestionType.TRUE_FALSE) {
      console.log('IT IS TRUE FALSE')
      form.setValue('answer', question.Option[0].title.toLowerCase() || 'false')
    }
  }

  useEffect(() => {
    console.log(`
      This motherfucker is the question type: ${type}
    `)
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

  useEffect(() => {
    if (!optionImage4Ref.current) return
    const handleUpload = async (e: any) => {
      const imageUrl = e.detail.fileInfo.cdnUrl + e.detail.fileInfo.name
      form.setValue('option4_image', imageUrl)
    }
    optionImage4Ref.current.addEventListener('file-upload-success', handleUpload)
  }, [])

  const saveQuestion = async (data: z.infer<typeof questionSchema>) => {
    if (!state.lesson.selectedLessonId) {
      return toast.warning('Please select a lesson to add a question')
    }

    switch (type) {
      case 'MULTIPLE_CHOICE':
        if (!data.option1 || !data.option2 || !data.option3 || !data.option4 || !/^[1-4]$/.test(data.answer)) {
          return toast.warning('All options are required for multiple choice question')
        }
        break
      case 'MULTIPLE_CHOICE_IMAGE':
        if (
          !data.option5 ||
          !data.option6 ||
          !data.option7 ||
          !data.option8 ||
          !data.option1_image ||
          !data.option2_image ||
          !data.option3_image ||
          !data.option4_image ||
          !/^[5-8]$/.test(data.answer)
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
          question
        })
      } else {
        res = await createQuestion({
          ...data,
          type,
          lessonId: state.lesson.selectedLessonId
        })
      }

      if (!res) {
        throw new Error('Failed to save question')
      }

      toast.success('Question saved successfully')

      // remote the prev question and add the new question
      setState(prev => {
        return {
          ...prev,
          question: prev.question.map(q => (q.id === res.id ? res : q))
        }
      })

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
                  <Button variant={'outline'} type='button' disabled id='q_type'>{type}</Button>
                </div>
              ) : (
                <Select
                  id='q_type'
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
          <div className={cn('hidden grid-cols-4 gap-6', type === QuestionType.MULTIPLE_CHOICE && 'grid')}>
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
            <Card theme='default' className='p-6 text-center'>
              <FormItem>
                <FormLabel htmlFor='q_option_4'>Option 4</FormLabel>
                <Input type='text' {...form.register('option4')} id='q_option_4' />
                <Input type='radio' value='4' {...form.register('answer')} />
              </FormItem>
            </Card>
          </div>

          <div className={cn('hidden grid-cols-4 gap-6', type === QuestionType.MULTIPLE_CHOICE_IMAGE && 'grid')}>
            <Card theme='default' className='p-6 text-center'>
              <FormItem className='space-y-2'>
                <FormLabel htmlFor='q_option_5'>Option</FormLabel>
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
                <Input type='text' {...form.register('option5')} id='q_option_5' />
                <Input type='radio' value='5' {...form.register('answer')} />
              </FormItem>
            </Card>
            <Card theme='default' className='p-6 text-center'>
              <FormItem className='space-y-2'>
                <FormLabel htmlFor='q_option_6'>Option</FormLabel>
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
                <Input type='text' {...form.register('option6')} id='q_option_6' />
                <Input type='radio' value='6' {...form.register('answer')} />
              </FormItem>
            </Card>
            <Card theme='default' className='p-6 text-center'>
              <FormItem className='space-y-2'>
                <FormLabel htmlFor='q_option_7'>Option</FormLabel>
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
                <Input type='text' {...form.register('option7')} id='q_option_7' />
                <Input type='radio' value='7' {...form.register('answer')} />
              </FormItem>
            </Card>
            <Card theme='default' className='p-6 text-center'>
              <FormItem className='space-y-2'>
                <FormLabel htmlFor='q_option_8'>Option</FormLabel>

                <div className='space-y-2'>
                  {form.watch('option4_image') && (
                    <div className='relative rounded-lg overflow-hidden aspect-square'>
                      <img
                        src={form.getValues('option4_image')}
                        className='object-cover h-full w-full'
                        alt='option 4 image'
                      />
                    </div>
                  )}

                  <div>
                    <lr-config
                      ctx-name='optionImage4'
                      pubkey='50d83aa24c3b01e5023e'
                      image-only='true'
                      multiple='false'
                    />
                    <lr-file-uploader-regular
                      ctx-name='optionImage4'
                      css-src={`https://cdn.jsdelivr.net/npm/@uploadcare/blocks@0.35.2/web/lr-file-uploader-regular.min.css`}
                    />
                    <lr-upload-ctx-provider ctx-name='optionImage4' ref={optionImage4Ref} />
                  </div>
                </div>
                <Input type='text' {...form.register('option8')} id='q_option_8' />
                <Input type='radio' value='8' {...form.register('answer')} />
              </FormItem>
            </Card>

            <FormDescription className='col-span-4'>
              Fill the correct answer by selecting the radio button of the correct option.
            </FormDescription>
          </div>

          <div className={cn('hidden grid-cols-1 gap-6', type === QuestionType.REARRANGE && 'grid')}>
            <FormDescription>
              [NOTE]: For user the question&apos;s words will be scrubmled as a re-arrange question.
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
