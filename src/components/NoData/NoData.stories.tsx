import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { NoData } from './NoData';

const meta: Meta<typeof NoData> = {
  title: 'Feedback/NoData',
  component: NoData,
  tags: ['autodocs'],
  args: { text: 'No bookings found for this period.' },
};
export default meta;

type Story = StoryObj<typeof NoData>;

export const Default: Story = {};
export const WithTitle: Story = {
  args: { title: 'Nothing here yet', text: 'Your notifications will appear here.' },
};
export const WithAction: Story = {
  args: {
    title: 'No visitors',
    text: 'Add a visitor to grant estate access.',
    actionLabel: 'Add visitor',
    onAction: fn(),
  },
};
