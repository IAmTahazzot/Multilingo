'use server';

import { db } from "@/lib/db";
import { languages } from '@/lib/countries'

export const getCourses = async () => {
  const courses = await db.course.findMany();
  return courses;
}

export const SaveCourse = async (courseCode: keyof typeof languages) => {
  // check if the course is existing in the database
  const isExisting = await db.course.findUnique({
    where: {
      language: courseCode.toString()
    }
  })

  if (isExisting) {
    return false
  }

  // create the course
  const newCourse = await db.course.create({
    data: {
      language: courseCode.toString(),
      name: languages.get(courseCode.toString()) as string
    }
  })

  return newCourse
}

export const deleteCourse = async (courseId: string) => {
  console.log(courseId);
  console.log('---------')
  const deletedCourse = await db.course.delete({
    where: {
      id: courseId
    }
  })

  return deletedCourse
}