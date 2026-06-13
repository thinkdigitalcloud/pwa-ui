import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './Spinner';

const meta: Meta<typeof Spinner> = {
  title: 'Feedback/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  args: { size: 36, text: 'Loading' },
};
export default meta;

type Story = StoryObj<typeof Spinner>;

export const Default: Story = {};
export const NoText: Story = { args: { text: undefined } };
export const Large: Story = { args: { size: 64, text: 'Fetching bookings…' } };
export const Fullscreen: Story = {
  args: { fullscreen: true },
  render: (args) => (
    <div style={{ position: 'relative', width: 320, height: 400, border: '1px solid #eee' }}>
      <Spinner {...args} />
    </div>
  ),
};
