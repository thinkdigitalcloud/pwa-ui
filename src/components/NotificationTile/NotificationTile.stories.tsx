import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { NotificationTile, type NotificationItem } from './NotificationTile';

const base: NotificationItem = {
  id: '1',
  notificationId: 'n1',
  title: 'Visitor at the gate',
  description: 'John Doe is requesting access at the main gate.',
  type: 'visitor',
  status: 'SENT',
  createdSeconds: Math.floor(Date.now() / 1000) - 60 * 90, // ~1.5h ago
};

const meta: Meta<typeof NotificationTile> = {
  title: 'Notifications/NotificationTile',
  component: NotificationTile,
  tags: ['autodocs'],
  args: { notification: base, onClick: fn(), onLongPress: fn() },
};
export default meta;

type Story = StoryObj<typeof NotificationTile>;

export const Unread: Story = {};
export const Read: Story = {
  args: { notification: { ...base, status: 'READ' } },
};
export const Selected: Story = { args: { selected: true } };
export const Payment: Story = {
  args: {
    notification: {
      ...base,
      title: 'Payment received',
      description: 'Your levy payment of R1 200 was successful.',
      type: 'payments',
    },
  },
};
export const Newsletter: Story = {
  args: {
    notification: {
      ...base,
      title: 'June Newsletter',
      description: 'Read the latest estate news and updates.',
      type: 'newsletter',
      status: 'READ',
    },
  },
};
