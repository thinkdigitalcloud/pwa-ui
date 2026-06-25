import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { FacilityCard } from './FacilityCard';

const img = (label: string, bg: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="150"><rect width="400" height="150" fill="${bg}"/><text x="50%" y="50%" fill="#fff" font-family="sans-serif" font-size="22" text-anchor="middle" dominant-baseline="middle">${label}</text></svg>`,
  )}`;

const meta: Meta<typeof FacilityCard> = {
  title: 'Bookings/FacilityCard',
  component: FacilityCard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { title: 'Clubhouse', image: img('Clubhouse', '#4C8B2B'), onClick: fn() },
};
export default meta;

type Story = StoryObj<typeof FacilityCard>;

/** Service tile — translucent header bar. */
export const HeaderBar: Story = {};

/** Booking tile — header bar + status badge. */
export const WithBadge: Story = {
  args: { badge: { label: 'Requested', color: '#D01E2D' } },
};

/** Resource tile — overlay caption + "Book Now" chip. */
export const Resource: Story = {
  args: { title: 'Tennis Court', image: img('Tennis Court', '#1B578C'), titleStyle: 'overlay', action: 'Book Now' },
};

export const Placeholder: Story = { args: { image: undefined, title: 'No image' } };
