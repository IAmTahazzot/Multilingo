import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { Form, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { LessonStateProps } from '@/lib/types'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { createUnit, updateUnit, deleteUnit } from '@/actions/unit'
import { toast } from 'sonner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

type unitProps = {} & LessonStateProps

const unitFormSchema = z.object({
  unitName: z.string().min(12, { message: 'unit name must be at least 12 characters' }),
  unitDescription: z.string()
})

export const UnitTable = ({ state, setState }: unitProps) => {
  const form = useForm({
    resolver: zodResolver(unitFormSchema),
    defaultValues: {
      unitName: '',
      unitDescription: ''
    }
  })

  const handleSubmit = async (data: z.infer<typeof unitFormSchema>) => {
    if (!state.section.selectedSectionId) {
      toast.error('Please select a course to create a unit')
      return
    }

    try {
      const newunit = await createUnit(data.unitName, data.unitDescription, state.section.selectedSectionId)

      if (!newunit) {
        toast.error('Failed to create new unit')
      }

      form.reset()
      toast.success('New unit created successfully')

      // Update the state with the new unit - no need to fetch the data again
      setState(state => ({
        ...state,
        unit: {
          ...state.unit,
          list: [...state.unit.list, newunit]
        }
      }))
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteunit = async (unitId: string) => {
    try {
      const deletedunit = await deleteUnit(unitId)

      if (!deletedunit) {
        return toast.error('Failed to delete unit')
      }

      toast.success('unit deleted successfully')

      // Update the state with the new unit - no need to fetch the data again
      setState(state => ({
        ...state,
        unit: {
          ...state.unit,
          list: state.unit.list.filter(unit => unit.id !== unitId)
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
            New unit
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className='min-h-[300px] w-[600px] mx-auto py-10'>
            <h1 className='text-lg font-medium mb-4 font-display'>
              Unit for {state.section.list.find(section => section.id === state.section.selectedSectionId)?.title}
            </h1>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className='w-full space-y-6'>
                <FormItem>
                  <FormLabel htmlFor='unitName' className='block'>
                    Unit name
                  </FormLabel>
                  <Input id='unitName' {...form.register('unitName')} />
                  <FormMessage>{form.formState.errors.unitName?.message}</FormMessage>
                </FormItem>

                <FormItem>
                  <FormLabel htmlFor='unitDescription' className='block'>
                    Description
                  </FormLabel>
                  <Textarea id='unitDescription' {...form.register('unitDescription')} />
                  <FormMessage>{form.formState.errors.unitDescription?.message}</FormMessage>
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
        {state.unit.list.length === 0 && (
          <div className='h-[50vh] flex items-center justify-center'>
            <p className='mt-10 text-sm'>No units created yet</p>
          </div>
        )}

        {state.unit.list.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>unit name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.unit.list.map(unit => (
                <TableRow key={unit.id}>
                  <TableCell>{unit.title}</TableCell>
                  <TableCell>{unit.description}</TableCell>
                  <TableCell className='flex item-center gap-x-1'>
                    <Editunit unitId={unit.id} state={state} setState={setState} />
                    <Button
                      onClick={() => {
                        toast.warning('Caution', {
                          description: 'Are you sure you want to delete this unit?',
                          action: {
                            label: 'Yes',
                            onClick: () => handleDeleteunit(unit.id)
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

const Editunit = ({ unitId, state, setState }: unitProps & { unitId: string }) => {
  let unit = state.unit.list.find(unit => unit.id === unitId)

  if (!unit) {
    unit = {
      title: '',
      description: ''
    }
  }

  const form = useForm({
    resolver: zodResolver(unitFormSchema),
    defaultValues: {
      unitName: unit.title || '',
      unitDescription: unit.description || ''
    }
  })

  const handleUpdate = async (data: z.infer<typeof unitFormSchema>) => {
    try {
      const updatedunit = await updateUnit(unitId, data.unitName, data.unitDescription)

      if (!updatedunit) {
        return toast.error('Failed to update unit')
      }

      toast.success('unit updated successfully')

      setState(state => ({
        ...state,
        unit: {
          ...state.unit,
          list: [
            ...state.unit.list.map(sec => {
              return sec.id === unitId
                ? {
                    ...sec,
                    title: data.unitName,
                    description: data.unitDescription
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
            Edit unit for {state.course.list.find(course => course.id === state.course.selectedCourseId)?.name}
          </h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdate)} className='w-full space-y-6'>
              <FormItem>
                <FormLabel htmlFor='unitName' className='block'>
                  unit Name
                </FormLabel>
                <Input id='unitName' {...form.register('unitName')} />
                <FormMessage>{form.formState.errors.unitName?.message}</FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel htmlFor='unitDescription' className='block'>
                  unit Description
                </FormLabel>
                <Textarea id='unitDescription' {...form.register('unitDescription')} />
                <FormMessage>{form.formState.errors.unitDescription?.message}</FormMessage>
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
