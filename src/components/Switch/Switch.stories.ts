import { Meta, StoryObj } from '@storybook/react'
import { Switch } from './Switch'

const meta: Meta<typeof Switch> = {
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    htmlFor: {
      description: 'The id of the input element',
      control: {
        type: 'text'
      }
    }
  }
}

export default meta

type Story = StoryObj<typeof Switch>

export const Primary: Story = {
  args: {
    htmlFor: 'for-animation'
  }
}
