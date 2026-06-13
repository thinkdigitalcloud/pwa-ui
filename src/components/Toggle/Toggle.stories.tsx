import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Toggle } from './Toggle';

const meta: Meta<typeof Toggle> = {
  title: 'Inputs/Toggle',
  component: Toggle,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Toggle>;

export const Interactive: Story = {
  render: () => {
    const [on, setOn] = useState(true);
    return <Toggle value={on} onChange={setOn} aria-label="Push notifications" />;
  },
};

export const Off: Story = { args: { value: false, onChange: () => {} } };
export const Disabled: Story = {
  args: { value: true, disabled: true, onChange: () => {} },
};
