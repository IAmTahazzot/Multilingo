'use client'

import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { LessonStateProps } from '@/lib/types'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { QuestionForm } from '../Form/QuestionForm'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { deleteQuestion } from '@/actions/question'

type questionProps = {} & LessonStateProps

export const QuestionTable = ({ state, setState }: questionProps) => {
  const delQuestion = async (id: string) => {
    try {
      const res = await deleteQuestion(id)

      if (!res) {
        toast.error('Error', {
          description: 'Could not delete question'
        })
        return
      }

      setState(prev => {
        return {
          ...prev,
          question: prev.question.filter(question => question.id !== res.id)
        }
      })

      toast.success('Success', {
        description: 'Question deleted successfully'
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={'default'} size={'sm'}>
            New Question
          </Button>
        </DialogTrigger>
        <DialogContent className='max-w-[800px]'>
          <QuestionForm state={state} setState={setState} />
        </DialogContent>
      </Dialog>

      <div className='mt-6'>
        {state.question.length === 0 && (
          <div className='h-[50vh] flex items-center justify-center'>
            <p className='mt-10 text-sm'>No questions created yet</p>
          </div>
        )}

        {state.question.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.question.map(q => (
                <TableRow key={q.id}>
                  <TableCell>{q.title}</TableCell>
                  <TableCell>{q.type}</TableCell>
                  <TableCell className='flex item-center gap-x-1'>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant={'ghost'} size={'sm'}>
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className='max-w-[800px]'>
                        <QuestionForm state={state} setState={setState} question={q} />
                      </DialogContent>
                    </Dialog>
                    <Button
                      onClick={() => {
                        toast.warning('Caution', {
                          description: 'Are you sure you want to delete this question?',
                          action: {
                            label: 'Yes',
                            onClick: () => {
                              delQuestion(q.id)
                            }
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
