import { Button } from '@/components/ui/button'
import { LessonStateProps } from '@/lib/types'
import { createLesson, deleteLesson } from '@/actions/lesson'
import { toast } from 'sonner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

type LessonProps = {} & LessonStateProps

export const LessonTable = ({ state, setState }: LessonProps) => {
  const newLesson = async () => {
    if (!state.unit.selectedUnitId) {
      toast.error('Error', {
        description: 'Please select a unit first'
      })
      return
    }

    try {
      const response = await createLesson(state.unit.selectedUnitId)

      if (!response) {
        throw new Error('An error occurred while creating a new lesson')
      }

      toast.success('A lesson is added successfully, you may now add questions to this lesson.')
      // update state
      setState(prevState => ({
        ...prevState,
        lesson: {
          selectedLessonId: null,
          list: [...prevState.lesson.list, response]
        }
      }))
    } catch (error) {
      const errorMessage = (error as Error).message || 'An error occurred while creating a new lesson'
      toast.error('Error', {
        description: errorMessage
      })
    }
  }

  const handleDeleteLesson = async (lessonId: number) => {
    try {
      await deleteLesson(lessonId)

      setState(prevState => ({
        ...prevState,
        lesson: {
          selectedLessonId: prevState.lesson.selectedLessonId,
          list: prevState.lesson.list.filter(lesson => lesson.id !== lessonId)
        }
      }))
    } catch (error) {
      const errorMessage = (error as Error).message || 'An error occurred while deleting the lesson'
      toast.error('Error', {
        description: errorMessage
      })
    }
  }

  return (
    <div>
      <Button variant={'default'} size={'sm'} onClick={newLesson}>
        New Lesson
      </Button>

      <div className='mt-6'>
        {state.lesson.list.length === 0 && (
          <div className='h-[50vh] flex items-center justify-center'>
            <p className='mt-10 text-sm'>No lessons created yet</p>
          </div>
        )}

        {state.lesson.list.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lesson ID</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.lesson.list.map(Lesson => (
                <TableRow key={Lesson.id}>
                  <TableCell>#{Lesson.id}</TableCell>
                  <TableCell className='flex item-center gap-x-1'>
                    <Button
                      onClick={() => {
                        toast.warning('Caution', {
                          description: 'Are you sure you want to delete this Lesson?',
                          action: {
                            label: 'Yes',
                            onClick: () => handleDeleteLesson(Lesson.id)
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
