import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { EventNotificationsCard } from './EventNotificationsCard';

const meta: Meta<typeof EventNotificationsCard> = {
  title: 'Cards/EventNotificationsCard',
  component: EventNotificationsCard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    title: 'Summer Market Day',
    date: '12 Jul 2026',
    image: 'https://picsum.photos/seed/event/600/340',
    onOpen: fn(),
  },
};
export default meta;

type Story = StoryObj<typeof EventNotificationsCard>;

export const Default: Story = {};

export const NoImage: Story = {
  args: { image: undefined },
};
