'use server'

import { questionSchema } from '@/components/Admin/Form/QuestionForm'
import { db } from '@/lib/db'
import { Question, Option } from '@prisma/client'
import { z } from 'zod'

export const getQuestions = async (lessonId: number) => {
  const questions = await db.question.findMany({
    where: {
      lessonId: lessonId
    },
    include: {
      Option: true
    }
  })

  return questions
}

export const getQuestionById = async (questionId: string) => {
  const question = await db.question.findUnique({
    where: {
      id: questionId
    },
    include: {
      Option: true
    }
  })

  return question
}

export const updateQuestion = async (
  data: z.infer<typeof questionSchema> & {
    type: 'MULTIPLE_CHOICE' | 'MULTIPLE_CHOICE_IMAGE' | 'TRUE_FALSE' | 'REARRANGE'
    prevQuestion: Question & { Option: Option[] }
  }
) => {
  if (!data.type) {
    throw new Error('Question type is required')
  }

  try {
    switch (data.type) {
      case 'MULTIPLE_CHOICE':
        if (!data.option1 || !data.option2 || !data.option3) {
          throw new Error('All options are required')
        }

        // Assuming that the options are in the same order as they were created
        const options = [data.option1, data.option2, data.option3]
        const answers = [data.answer === '1', data.answer === '2', data.answer === '3']

        for (let i = 0; i < options.length; i++) {
          await db.option.update({
            where: {
              id: data.prevQuestion.Option[i].id
            },
            data: {
              title: options[i],
              isCorrect: answers[i]
            }
          })
        }

        const updatedMultipleChoiceQuestion = await db.question.update({
          where: {
            id: data.prevQuestion.id
          },
          data: {
            type: data.type,
            title: data.question,
            lessonId: data.prevQuestion.lessonId
          },
          include: {
            Option: true
          }
        })

        return updatedMultipleChoiceQuestion
      case 'MULTIPLE_CHOICE_IMAGE':
        if (
          !data.option4 ||
          !data.option5 ||
          !data.option6 ||
          !data.option1_image ||
          !data.option2_image ||
          !data.option3_image
        ) {
          throw new Error('Image and all options are required')
        }

        const updatedMultipleChoiceImageQuestion = await db.question.update({
          where: {
            id: data.prevQuestion.id
          },
          data: {
            type: data.type,
            title: data.question,
            lessonId: data.prevQuestion.lessonId,
            Option: {
              updateMany: {
                where: {
                  questionId: data.prevQuestion.id
                },
                data: [
                  {
                    title: data.option4,
                    isCorrect: data.answer === '4',
                    imageUrl: data.option1_image
                  },
                  {
                    title: data.option5,
                    isCorrect: data.answer === '5',
                    imageUrl: data.option2_image
                  },
                  {
                    title: data.option6,
                    isCorrect: data.answer === '6',
                    imageUrl: data.option3_image
                  }
                ]
              }
            }
          },
          include: {
            Option: true
          }
        })

        return updatedMultipleChoiceImageQuestion

      case 'REARRANGE':
        const updatedRearrangeQuestion = await db.question.update({
          where: {
            id: data.prevQuestion.id
          },
          data: {
            title: data.question
          },
          include: {
            Option: true
          }
        })

        return updatedRearrangeQuestion
      case 'TRUE_FALSE':
        if (!/^(true|false)$/i.test(data.answer)) {
          throw new Error('Answer is required')
        }

        const updatedTrueFalseQuestion = await db.question.update({
          where: {
            id: data.prevQuestion.id
          },
          data: {
            title: data.prevQuestion.title,
            Option: {
              update: {
                where: {
                  id: data.prevQuestion.Option[0].id
                },
                data: {
                  title: data.answer.toUpperCase(), // for true false question, we only need one option and the title is the answer
                  isCorrect: true // optional but we can set it to true since there's only one option
                }
              }
            }
          },
          include: {
            Option: true
          }
        })

        return updatedTrueFalseQuestion
      default:
        throw new Error('Invalid question type')
    }
  } catch (error) {
    throw new Error('Something is terribly wrong while updating!')
  }
}

export const deleteQuestion = async (questionId: string) => {
  const deletedQuestion = await db.question.delete({
    where: {
      id: questionId
    }
  })

  return deletedQuestion
}

export const createQuestion = async (
  data: z.infer<typeof questionSchema> & {
    lessonId: number
    type: 'MULTIPLE_CHOICE' | 'MULTIPLE_CHOICE_IMAGE' | 'TRUE_FALSE' | 'REARRANGE'
  }
) => {
  if (!data.type) {
    throw new Error('Question type is required')
  }

  try {
    switch (data.type) {
      case 'MULTIPLE_CHOICE':
        if (!data.option1 || !data.option2 || !data.option3) {
          throw new Error('All options are required')
        }

        const multipleChoiceQuestion = await db.question.create({
          data: {
            type: data.type,
            title: data.question,
            lessonId: data.lessonId,
            Option: {
              createMany: {
                data: [
                  {
                    title: data.option1,
                    isCorrect: data.answer === '1'
                  },
                  {
                    title: data.option2,
                    isCorrect: data.answer === '2'
                  },
                  {
                    title: data.option3,
                    isCorrect: data.answer === '3'
                  }
                ]
              }
            }
          },
          include: {
            Option: true
          }
        })

        return multipleChoiceQuestion
      case 'MULTIPLE_CHOICE_IMAGE':
        if (
          !data.option4 ||
          !data.option5 ||
          !data.option6 ||
          !data.option1_image ||
          !data.option2_image ||
          !data.option3_image
        ) {
          throw new Error('Image and all options are required')
        }

        const multipleChoiceImageQuestion = await db.question.create({
          data: {
            type: data.type,
            title: data.question,
            lessonId: data.lessonId,
            Option: {
              createMany: {
                data: [
                  {
                    title: data.option4,
                    isCorrect: data.answer === '4',
                    imageUrl: data.option3_image
                  },
                  {
                    title: data.option5,
                    isCorrect: data.answer === '5',
                    imageUrl: data.option1_image
                  },
                  {
                    title: data.option6,
                    isCorrect: data.answer === '6',
                    imageUrl: data.option2_image
                  }
                ]
              }
            }
          },
          include: {
            Option: true
          }
        })

        return multipleChoiceImageQuestion
      case 'REARRANGE':
        const rearrangeQuestion = await db.question.create({
          data: {
            type: data.type,
            title: data.question,
            lessonId: data.lessonId
          },
          include: {
            Option: true
          }
        })

        return rearrangeQuestion
      case 'TRUE_FALSE':
        if (!/^(true|false)$/i.test(data.answer)) {
          throw new Error('Answer is required')
        }

        const trueFalseQuestion = await db.question.create({
          data: {
            type: data.type,
            title: data.question,
            lessonId: data.lessonId,
            Option: {
              create: {
                title: data.answer.toUpperCase(), // for true false question, we only need one option and the title is the answer
                isCorrect: true // optional but we can set it to true since there's only one option
              }
            }
          },
          include: {
            Option: true
          }
        })

        return trueFalseQuestion
      default:
        throw new Error('Invalid question type')
    }
  } catch (error) {
    throw new Error('Something is terribly wrong!')
  }
}
