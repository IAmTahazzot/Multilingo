'use client'

import { getGlobalState } from '@/actions/get-global-state'
import { setupUser } from '@/actions/setup-user'
import { useGlobalState } from '@/hooks/useGlobalState'
import React, { useEffect } from 'react'
import { toast } from 'sonner'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { course, setUser, setCourse, setAllCourses, setEnrollmentDetails, setUserPreferences } = useGlobalState()

  useEffect(() => {
    const gettingUser = async () => {
      // Create new user if user does not exist in the database
      // NOTE: webhook would be a better solution for this (but it's not implemented yet)
      try {
        await setupUser()
      } catch (error) {
        toast.error('Unable to setup user account!')
      }
    }

    const gettingGlobalState = async () => {
      if (!course) {
        try {
          const data = await getGlobalState()

          if (!data.user || !data.course) {
            return toast.error('User or course not found, please try again later')
          }

          setUser(data.user)
          setCourse(data.course)
          setAllCourses(data.allCourses)
          setEnrollmentDetails(data.enrollmentDetails)
          setUserPreferences(data.userPreferences);
        } catch (error) {
          toast.error('An error occured while fetching global state')
        }
      }
    }

    gettingUser()
    gettingGlobalState()
  }, [])

  return children
}
