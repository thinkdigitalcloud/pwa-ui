import type { Meta, StoryObj } from '@storybook/react';
import { SectionTitle } from './SectionTitle';

const meta: Meta<typeof SectionTitle> = {
  title: 'Layout/SectionTitle',
  component: SectionTitle,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { text: 'Your upcoming bookings' },
  argTypes: {
    color: { control: 'color' },
    align: { control: 'inline-radio', options: ['left', 'center', 'right'] },
  },
};
export default meta;

type Story = StoryObj<typeof SectionTitle>;

export const Default: Story = {};
export const LeftAligned: Story = { args: { align: 'left' } };
export const Branded: Story = { args: { color: '#133C63' } };
