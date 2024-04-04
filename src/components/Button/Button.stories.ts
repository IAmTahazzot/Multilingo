import { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  tags: ['autodocs'],
  component: Button,
  argTypes: {
    theme: {
      description: 'The theme of the button',
      options: ['primary', 'premium', 'white'],
      control: {
        type: 'radio'
      }
    }
  }
}

export default meta

type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: {
    theme: 'primary',
    text: 'Just a button',
    width: 300
  }
}

export const Premium: Story = {
  args: {
    theme: 'premium',
    text: 'Try 2 weeks free',
    width: 300
  }
}
