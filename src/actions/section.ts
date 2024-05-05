'use server'

import { db } from '@/lib/db'
import { languages } from '@/lib/countries'

export const getSectionsById = async (sectionId: string) => {
  const sections = await db.section.findMany({
    where: {
      courseId: sectionId
    }
  })

  return sections
}

export const updateSection = async (sectionId: string, sectionName: string, sectionDescription: string, sectionIntro: string) => {
  if (!sectionId) {
    throw new Error('Section ID is required')
  }

  if (!sectionName) {
    throw new Error('Section name is required')
  }

  const updatedSection = await db.section.update({
    where: {
      id: sectionId
    },
    data: {
      title: sectionName,
      description: sectionDescription,
      sectionIntro: sectionIntro
    }
  })

  return updatedSection
}

export const deleteSection = async (sectionId: string) => {
  const deletedSection = await db.section.delete({
    where: {
      id: sectionId
    }
  })

  return deletedSection
}

export const createSection = async (
  sectionName: string,
  sectionDescription: string,
  sectionIntro: string,
  courseId: string
) => {
  const newSection = await db.section.create({
    data: {
      title: sectionName,
      description: sectionDescription,
      sectionIntro: sectionIntro,
      courseId: courseId
    }
  })

  return newSection
}
