import { Meta, StoryObj } from '@storybook/react'
import { Input } from './Input'

const meta: Meta<typeof Input> = {
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      description: 'The placeholder of the input element',
      control: {
        type: 'text'
      }
    }
  }
}

export default meta

type Story = StoryObj<typeof Input>

export const Primary: Story = {
  args: {
    placeholder: 'Type something here'
  }
}
