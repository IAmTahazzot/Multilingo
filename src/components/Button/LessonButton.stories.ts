import { Meta, StoryObj } from '@storybook/react'
import { LessonButton, Icons } from './LessonButton'

const meta: Meta<typeof LessonButton> = {
  component: LessonButton,
  tags: ['autodocs'],
  argTypes: {
    icon: {
      options: Object.keys(Icons),
      control: {
        type: 'select'
      }
    }
  }
}

export default meta

type Story = StoryObj<typeof LessonButton>

export const Primary: Story = {
  args: {
    icon: 'star',
    variant: 'primary',
    href: '/lessons'
  }
}
