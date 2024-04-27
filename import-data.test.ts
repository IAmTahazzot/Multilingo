'use server'

import { db } from '@/lib/db'
import { questionSchema } from '@/components/Admin/Form/QuestionForm'
import { Question, Option } from '@prisma/client'
import { z } from 'zod'

const createQuestion = async (
  data: z.infer<typeof questionSchema> & {
    lessonId: number
    type: 'MULTIPLE_CHOICE' | 'MULTIPLE_CHOICE_IMAGE' | 'TRUE_FALSE' | 'REARRANGE'
  }
) => {
  try {
    switch (data.type) {
      case 'MULTIPLE_CHOICE':
        if (!data.option1 || !data.option2 || !data.option3) {
          throw new Error('All options are required')
        }

        // Create multiple-choice question
        const multipleChoiceQuestion = await db.question.create({
          data: {
            type: data.type,
            title: data.question,
            lessonId: data.lessonId,
            Option: {
              createMany: {
                data: [
                  { title: data.option1, isCorrect: data.answer === '1' },
                  { title: data.option2, isCorrect: data.answer === '2' },
                  // Add the third option if applicable
                  ...(data.option3 ? [{ title: data.option3, isCorrect: data.answer === '3' }] : [])
                ]
              }
            }
          },
          include: { Option: true }
        })
        console.log('Multiple-choice question created:', multipleChoiceQuestion)
        break

      case 'TRUE_FALSE':
        // Validate answer for true/false questions
        if (!/^(true|false)$/i.test(data.answer)) {
          throw new Error('Answer must be either true or false')
        }

        // Create true/false question
        const trueFalseQuestion = await db.question.create({
          data: {
            type: data.type,
            title: data.question,
            lessonId: data.lessonId,
            Option: {
              create: {
                title: data.answer.toUpperCase(), // Title is the answer for true/false questions
                isCorrect: true // Since there's only one option, it's always correct
              }
            }
          },
          include: { Option: true }
        })
        console.log('True/false question created:', trueFalseQuestion)
        break

      default:
        throw new Error('Invalid question type')
    }
  } catch (error) {
    console.error('Error creating question:', error)
  }
}

const q = [
  // Lesson 8 Questions
  {
    type: 'MULTIPLE_CHOICE',
    question: "What is the Spanish word for 'school'?",
    lessonId: 8,
    option1: "Casa",
    option2: "Escuela",
    option3: "Parque",
    answer: '2'
  },
  {
    type: 'MULTIPLE_CHOICE',
    question: "Which of the following is the Spanish word for 'teacher'?",
    lessonId: 8,
    option1: "Estudiante",
    option2: "Profesor",
    option3: "Director",
    answer: '2'
  },
  {
    type: 'MULTIPLE_CHOICE',
    question: "What is the Spanish word for 'friend'?",
    lessonId: 8,
    option1: "Hermano",
    option2: "Amigo",
    option3: "Padre",
    answer: '2'
  },
  {
    type: 'TRUE_FALSE',
    question: "The Spanish word for 'blue' is 'verde'.",
    lessonId: 8,
    answer: 'false'
  },
  {
    type: 'TRUE_FALSE',
    question: "Spanish is spoken in Italy.",
    lessonId: 8,
    answer: 'false'
  },
  {
    type: 'MULTIPLE_CHOICE',
    question: "Which of the following is the Spanish word for 'music'?",
    lessonId: 8,
    option1: "Libro",
    option2: "Música",
    option3: "Pintura",
    answer: '2'
  },
  {
    type: 'MULTIPLE_CHOICE',
    question: "What is the Spanish word for 'cat'?",
    lessonId: 8,
    option1: "Perro",
    option2: "Gato",
    option3: "Pájaro",
    answer: '2'
  },
  {
    type: 'TRUE_FALSE',
    question: "The capital of Spain is 'Barcelona'.",
    lessonId: 8,
    answer: 'false'
  },
  {
    type: 'MULTIPLE_CHOICE',
    question: "What is the Spanish word for 'hat'?",
    lessonId: 8,
    option1: "Camisa",
    option2: "Zapato",
    option3: "Sombrero",
    answer: '3'
  },
  {
    type: 'TRUE_FALSE',
    question: "The Spanish word for 'hello' is 'adiós'.",
    lessonId: 8,
    answer: 'false'
  },
  // Lesson 9 Questions
  {
    type: 'MULTIPLE_CHOICE',
    question: "What is the Spanish word for 'beach'?",
    lessonId: 9,
    option1: "Montaña",
    option2: "Playa",
    option3: "Río",
    answer: '2'
  },
  {
    type: 'MULTIPLE_CHOICE',
    question: "Which of the following is the Spanish word for 'sun'?",
    lessonId: 9,
    option1: "Sol",
    option2: "Luna",
    option3: "Estrella",
    answer: '1'
  },
  {
    type: 'MULTIPLE_CHOICE',
    question: "What is the Spanish word for 'waterfall'?",
    lessonId: 9,
    option1: "Lago",
    option2: "Cascada",
    option3: "Piscina",
    answer: '2'
  },
  {
    type: 'TRUE_FALSE',
    question: "The Spanish word for 'mother' is 'padre'.",
    lessonId: 9,
    answer: 'false'
  },
  {
    type: 'TRUE_FALSE',
    question: "Spanish is one of the official languages of Canada.",
    lessonId: 9,
    answer: 'false'
  },
  {
    type: 'MULTIPLE_CHOICE',
    question: "Which of the following is the Spanish word for 'rain'?",
    lessonId: 9,
    option1: "Nieve",
    option2: "Sol",
    option3: "Lluvia",
    answer: '3'
  },
  {
    type: 'MULTIPLE_CHOICE',
    question: "What is the Spanish word for 'mountain'?",
    lessonId: 9,
    option1: "Playa",
    option2: "Montaña",
    option3: "Desierto",
    answer: '2'
  },
  {
    type: 'TRUE_FALSE',
    question: "The capital of France is 'Paris'.",
    lessonId: 9,
    answer: 'true'
  },
  {
    type: 'MULTIPLE_CHOICE',
    question: "What is the Spanish word for 'bicycle'?",
    lessonId: 9,
    option1: "Carro",
    option2: "Bicicleta",
    option3: "Avión",
    answer: '2'
  },
  {
    type: 'TRUE_FALSE',
    question: "The Spanish word for 'dog' is 'gato'.",
    lessonId: 9,
    answer: 'false'
  }
];



export default async function importData() {
  q.forEach(data => createQuestion(data))
}