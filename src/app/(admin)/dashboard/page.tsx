'use client'

import { getCourses, SaveCourse, deleteCourse } from '@/actions/course'
import { Button } from '@/components/Button/Button'
import { Card } from '@/components/Card/Card'
import { languages } from '@/lib/countries'
import { cn } from '@/lib/utils'
import { useUser } from '@clerk/nextjs'
import { Course } from '@prisma/client'
import { Plus } from 'lucide-react'
import { useRouter, usePathname, redirect } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function Page() {
  const [isCreating, setIsCreating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState<
    keyof typeof languages | null
  >(null)
  const [fetchingCourses, setFetchingCourses] = useState(true)
  const [courses, setCourses] = useState<Course[]>()
  const { user, isLoaded, isSignedIn } = useUser()
  const router = useRouter()
  const path = usePathname()

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getCourses()
        setCourses(response)
      } catch (error) {
        toast.error('Unable to fetch courses')
      } finally {
        setFetchingCourses(false)
      }
    }

    fetchCourses()
  }, [saving, deleting])

  const saveCourse = async () => {
    if (!selectedLanguage) return alert('No language selected')

    try {
      setSaving(true)
      const response = await SaveCourse(selectedLanguage)

      if (!response) {
        return toast.error('Course already exists')
      }

      toast.success('Course created')
    } catch (error) {
      toast.error('Something went wrong, try again later')
    } finally {
      setSaving(false)
      setIsCreating(false)
    }
  }

  const handleDeleteCourse = async (id: string) => {
    try {
      setDeleting(true)
      const response = await deleteCourse(id)

      if (!response) {
        return toast.error('Unable to delete course')
      }

      toast.success('Course deleted')
    } catch (error) {
      console.log(error)
      toast.error('Something went wrong, try again later')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <h1 className='text-xl font-medium font-display text-neutral-600'>
        {isCreating ? 'Create a course' : 'Dashboard'}
      </h1>

      <div className='mt-8'>
        {isCreating ? (
          <div>
            <div>
              <Button
                onClick={() => setIsCreating(false)}
                theme='secondary'
                className='mb-4'>
                Back
              </Button>
            </div>
            <div className='flex flex-col justify-center gap-4 max-w-[200px] mx-auto'>
              <SelectCourse
                setSelectedLanguage={setSelectedLanguage}
                selectedLang={selectedLanguage}
              />
              <Button
                onClick={saveCourse}
                theme={'secondary'}
                className='w-full'
                text={saving ? 'Saving...' : 'Save'}></Button>
            </div>
          </div>
        ) : (
          <div className='grid grid-cols-5 grid-rows-[repeat(auto-fill,200px)] gap-6'>
            <Card
              onClick={() => setIsCreating(true)}
              theme={'default'}
              className='flex justify-center items-center cursor-pointer py-8 select-none'>
              <div className='space-y-2'>
                <Plus
                  size={40}
                  className='mx-auto'
                />
                <h3 className='text-lg font-display text-neutral-600'>
                  Add course
                </h3>
              </div>
            </Card>
            {courses &&
              courses.map(course => (
                <Card
                  key={course.id}
                  theme={'default'}
                  className='relative flex flex-col items-center group cursor-pointer py-8 select-none'>
                  <svg className='h-20 w-20'>
                    <use xlinkHref={'/svg/flags.svg#' + course.language} />
                  </svg>
                  <h3 className='text-lg font-display text-neutral-600'>
                    {course.name}
                  </h3>
                  <div className='absolute bottom-0 h-32 hidden items-end justify-center p-2 w-full group-hover:flex'>
                    <Button
                      onClick={() => {
                        toast.custom(t => {
                          return (
                            <div className='p-4 border border-slate-200 rounded-lg bg-white shadow-[0_6px_20px_1px_rgba(0,0,0,.1)]'>
                              <h3 className='font-semibold mb-1'>Caution</h3>
                              <p className='text-sm mb-3'>
                                All the data associated with this course will be
                                deleted including sections, units, lessons and
                                user progress.
                              </p>
                              <div className='flex items-center justify-end gap-2'>
                                <button
                                  className='bg-red-500 text-white px-2 py-[2px] text-sm rounded'
                                  onClick={() => {
                                    handleDeleteCourse(course.id)
                                    toast.dismiss(t)
                                  }}>
                                  {deleting ? 'Deleting...' : 'Delete'}
                                </button>
                                <button
                                  className='bg-black text-white px-2 py-[2px] text-sm rounded'
                                  onClick={() => toast.dismiss(t)}>
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )
                        }, {
                          position: 'top-center'
                        })
                      }}
                      theme={'danger'}
                      className='w-full h-[40px]'>
                      {deleting ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                </Card>
              ))}
            {fetchingCourses && (
              <>
                <Card
                  className='animate-pulse flex items-center flex-col py-8 space-y-4'
                  theme='default'>
                  <div className='h-16 w-20 bg-neutral-100 rounded-xl'></div>
                  <div className='h-4 w-20 bg-neutral-100 rounded-lg'></div>
                </Card>
                <Card
                  className='animate-pulse flex items-center flex-col py-8 space-y-4'
                  theme='default'>
                  <div className='h-16 w-20 bg-neutral-100 rounded-xl'></div>
                  <div className='h-4 w-20 bg-neutral-100 rounded-lg'></div>
                </Card>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const SelectCourse = ({
  setSelectedLanguage,
  selectedLang
}: {
  setSelectedLanguage: React.Dispatch<
    React.SetStateAction<keyof typeof languages | null>
  >
  selectedLang: keyof typeof languages | null
}) => {
  const [showOptions, setShowOptions] = useState(false)

  return (
    <div>
      <div className='relative'>
        <Card
          onClick={() => setShowOptions(!showOptions)}
          theme={'default'}
          className='flex flex-col items-center cursor-pointer py-8 select-none'>
          <svg className='h-20 w-20'>
            <use
              xlinkHref={`/svg/flags.svg#${(selectedLang as string) || 'fr'}`}
              className={cn(selectedLang ? ' saturate-100' : 'saturate-0')}
            />
          </svg>
          <h3 className='text-lg font-display text-neutral-600'>
            {selectedLang
              ? languages.get(selectedLang as string)
              : 'Select language'}
          </h3>
        </Card>

        {showOptions && (
          <div
            className='z-10 absolute top-[105%] w-[300px] h-[250px] overflow-y-scroll bg-white border-2 border-slate-200 rounded-lg p-3 -translate-x-[50px]'
            style={{
              scrollbarWidth: 'none'
            }}>
            <ul>
              {Array.from(languages).map(([key, value]) => (
                <li
                  key={key}
                  onClick={() => {
                    setSelectedLanguage(key as keyof typeof languages)
                    setShowOptions(false)
                  }}
                  className='flex gap-3 items-center cursor-pointer hover:bg-neutral-100 p-2 rounded-lg'>
                  <svg className='h-[35px] w-[45px]'>
                    <use
                      xlinkHref={`/svg/flags.svg#${key}`}
                      className='scale-[.58]'
                    />
                  </svg>
                  <span>{value}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
