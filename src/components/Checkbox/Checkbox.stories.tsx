import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Inputs/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: { label: 'I accept the rules & regulations' },
};
export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Interactive: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return <Checkbox {...args} checked={checked} onChange={setChecked} />;
  },
};

export const Checked: Story = { args: { checked: true, onChange: () => {} } };
export const Disabled: Story = {
  args: { checked: true, disabled: true, onChange: () => {} },
};
