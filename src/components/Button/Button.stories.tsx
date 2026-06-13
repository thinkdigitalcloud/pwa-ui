import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { FiArrowRight } from 'react-icons/fi';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Primitives/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    text: 'Make booking',
    variant: 'primary',
    size: 'md',
    onClick: fn(),
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'danger', 'outline', 'ghost'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {};
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Danger: Story = { args: { variant: 'danger', text: 'Delete' } };
export const Outline: Story = { args: { variant: 'outline' } };
export const Block: Story = { args: { block: true } };
export const Rounded: Story = { args: { rounded: true } };
export const Loading: Story = { args: { loading: true } };
export const Disabled: Story = { args: { disabled: true } };
export const WithIcon: Story = {
  args: { rightIcon: <FiArrowRight />, text: 'Continue' },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Button variant="primary" text="Primary" block />
      <Button variant="secondary" text="Secondary" block />
      <Button variant="success" text="Success" block />
      <Button variant="danger" text="Danger" block />
      <Button variant="outline" text="Outline" block />
      <Button variant="ghost" text="Ghost" block />
    </div>
  ),
};
