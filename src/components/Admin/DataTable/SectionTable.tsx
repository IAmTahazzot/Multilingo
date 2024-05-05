import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { LessonStateProps } from '@/lib/types'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { createSection, deleteSection, getSectionsById, updateSection } from '@/actions/section'
import { toast } from 'sonner'
import { useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

type SectionProps = {} & LessonStateProps

const SectionFormSchema = z.object({
  sectionName: z.string().min(12, { message: 'Section name must be at least 12 characters' }),
  sectionDescription: z.string()
})

export const SectionTable = ({ state, setState }: SectionProps) => {
  const form = useForm({
    resolver: zodResolver(SectionFormSchema),
    defaultValues: {
      sectionName: '',
      sectionDescription: ''
    }
  })

  const handleSubmit = async (data: z.infer<typeof SectionFormSchema>) => {
    if (!state.course.selectedCourseId) {
      toast.error('Please select a course to create a section')
      return
    }

    try {
      const newSection = await createSection(data.sectionName, data.sectionDescription, state.course.selectedCourseId)

      if (!newSection) {
        toast.error('Failed to create new section')
      }

      form.reset()
      toast.success('New section created successfully')

      // Update the state with the new section - no need to fetch the data again
      setState(state => ({
        ...state,
        section: {
          ...state.section,
          list: [...state.section.list, newSection]
        }
      }))
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteSection = async (sectionId: string) => {
    try {
      const deletedSection = await deleteSection(sectionId)

      if (!deletedSection) {
        return toast.error('Failed to delete section')
      }

      toast.success('Section deleted successfully')

      // Update the state with the new section - no need to fetch the data again
      setState(state => ({
        ...state,
        section: {
          ...state.section,
          list: state.section.list.filter(section => section.id !== sectionId)
        }
      }))
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant={'default'} size={'sm'}>
            New Section
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className='min-h-[300px] w-[600px] mx-auto py-10'>
            <h1 className='text-lg font-medium mb-4 font-display'>
              Section for {state.course.list.find(course => course.id === state.course.selectedCourseId)?.name}
            </h1>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className='w-full space-y-6'>
                <FormItem>
                  <FormLabel htmlFor='sectionName' className='block'>
                    Section Name
                  </FormLabel>
                  <Input id='sectionName' {...form.register('sectionName')} />
                  <FormMessage>{form.formState.errors.sectionName?.message}</FormMessage>
                </FormItem>

                <FormItem>
                  <FormLabel htmlFor='sectionDescription' className='block'>
                    Section Description
                  </FormLabel>
                  <Textarea id='sectionDescription' {...form.register('sectionDescription')} />
                  <FormMessage>{form.formState.errors.sectionDescription?.message}</FormMessage>
                </FormItem>

                <Button variant={'default'} size={'lg'} type='submit'>
                  {form.formState.isSubmitting ? 'Saving...' : 'Save'}
                </Button>
              </form>
            </Form>
          </div>
        </DrawerContent>
      </Drawer>

      <div className='mt-6'>
        {state.section.list.length === 0 && (
          <div className='h-[50vh] flex items-center justify-center'>
            <p className='mt-10 text-sm'>No sections created yet</p>
          </div>
        )}

        {state.section.list.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Section name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.section.list.map(section => (
                <TableRow key={section.id}>
                  <TableCell>{section.title}</TableCell>
                  <TableCell>{section.description}</TableCell>
                  <TableCell className='flex item-center gap-x-1'>
                    <EditSection sectionId={section.id} state={state} setState={setState} />
                    <Button
                      onClick={() => {
                        toast.warning('Caution', {
                          description: 'Are you sure you want to delete this section?',
                          action: {
                            label: 'Yes',
                            onClick: () => handleDeleteSection(section.id)
                          }
                        })
                      }}
                      variant={'destructive'}
                      size='sm'
                      className='h-6 rounded'>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}

const EditSection = ({ sectionId, state, setState }: SectionProps & { sectionId: string }) => {
  let section = state.section.list.find(section => section.id === sectionId)

  if (!section) {
    section = {
      title: '',
      description: ''
    }
  }

  const form = useForm({
    resolver: zodResolver(SectionFormSchema),
    defaultValues: {
      sectionName: section.title || '',
      sectionDescription: section.description || ''
    }
  })

  const handleUpdate = async (data: z.infer<typeof SectionFormSchema>) => {
    try {
      const updatedSection = await updateSection(sectionId, data.sectionName, data.sectionDescription)

      if (!updatedSection) {
        return toast.error('Failed to update section')
      }

      toast.success('Section updated successfully')

      setState(state => ({
        ...state,
        section: {
          ...state.section,
          list: [
            ...state.section.list.map(sec => {
              return sec.id === sectionId
                ? {
                    ...sec,
                    title: data.sectionName,
                    description: data.sectionDescription
                  }
                : sec
            })
          ]
        }
      }))
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant={'ghost'} size='sm' className='h-6 rounded'>
          Edit
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className='min-h-[300px] w-[600px] mx-auto py-10'>
          <h1 className='text-lg font-medium mb-4 font-display'>
            Edit Section for {state.course.list.find(course => course.id === state.course.selectedCourseId)?.name}
          </h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdate)} className='w-full space-y-6'>
              <FormItem>
                <FormLabel htmlFor='sectionName' className='block'>
                  Section Name
                </FormLabel>
                <Input id='sectionName' {...form.register('sectionName')} />
                <FormMessage>{form.formState.errors.sectionName?.message}</FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel htmlFor='sectionDescription' className='block'>
                  Section Description
                </FormLabel>
                <Textarea id='sectionDescription' {...form.register('sectionDescription')} />
                <FormMessage>{form.formState.errors.sectionDescription?.message}</FormMessage>
              </FormItem>

              <Button variant={'default'} size={'lg'} type='submit'>
                {form.formState.isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
