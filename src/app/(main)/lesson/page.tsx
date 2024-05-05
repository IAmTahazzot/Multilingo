'use client'

import { LessonContent } from '@/components/Pages/Lesson/LessonContent'
import { useGlobalState } from '@/hooks/useGlobalState'

export default function LessonPage() {
  const { user, enrollmentDetails } = useGlobalState()

  if (!user || !enrollmentDetails) {
    return null
  }

  return <LessonContent />
}
