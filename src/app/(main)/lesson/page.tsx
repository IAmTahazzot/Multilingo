'use client'

import { LessonContent } from '@/components/Pages/Lesson/LessonContent'
import { useGlobalState } from '@/hooks/useGlobalState'
import Link from 'next/link'
import { useState } from 'react'

export default function LessonPage() {
  const { user, enrollmentDetails } = useGlobalState()

  if (!user || !enrollmentDetails) {
    return null
  }

  return <LessonContent />
}
