import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Stepper } from './Stepper';

const meta: Meta<typeof Stepper> = {
  title: 'Inputs/Stepper',
  component: Stepper,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Stepper>;

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState(1);
    return <Stepper value={value} onChange={setValue} min={1} max={10} />;
  },
};
