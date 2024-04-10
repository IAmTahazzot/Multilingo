import { Meta, StoryObj } from "@storybook/react";

import { QuestionForm } from "./QuestionForm";

const meta: Meta<typeof QuestionForm> = {
  component: QuestionForm,
  title: "Form/QuestionForm",
}

export default meta;

type Story = StoryObj<typeof QuestionForm>;

export const Default: Story = {}