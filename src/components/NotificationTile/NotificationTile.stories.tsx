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
export const BadgeText: Story = {
  args: {
    notification: {
      ...base,
      title: 'You have new messages',
      description: '3 unread notifications from the estate.',
      badgeText: '3',
    },
  },
};

// RN parity: the category pill is coloured by `type`. These mirror the mobile
// Notifications screen (arrivals = navy, booking alerts = info-blue, etc.).
export const ArrivalBadge: Story = {
  args: {
    notification: {
      ...base,
      title: 'Client Access',
      description: 'Stijn Hendriks has entered the building.',
      type: 'clientEntered',
      badgeText: 'ARRIVAL',
      status: 'READ',
    },
  },
};
export const BookingAlertBadge: Story = {
  args: {
    notification: {
      ...base,
      title: 'Booking Alert',
      description: 'Giorgi Gumburashvili has made a booking',
      type: 'bookingAlert',
      badgeText: 'BOOKING',
    },
  },
};

// Consumer-supplied style overrides + hiding the absolute date, keeping only the
// relative "x ago" stamp.
export const StyleOverrides: Story = {
  args: {
    notification: {
      ...base,
      title: 'Client Access',
      description: 'Stijn Hendriks has entered the building.',
      type: 'clientEntered',
      badgeText: 'ARRIVAL',
      status: 'READ',
    },
    hideDate: true,
    titleStyle: { fontSize: 18, fontWeight: 700 },
    descriptionStyle: { fontSize: 15, color: '#444' },
    timeAgoStyle: { fontSize: 12, fontStyle: 'italic', color: '#888' },
    badgeStyle: { backgroundColor: '#111' },
    badgeTextStyle: { fontSize: 11, letterSpacing: 0.5 },
  },
};

// A broken image URL falls back to `defaultImage` via onError, so the circle is
// never empty (previously the CSS background failed silently, leaving the badge
// floating over blank space).
export const BrokenImageFallsBack: Story = {
  args: {
    defaultImage:
      'data:image/svg+xml;utf8,' +
      encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56"><rect width="56" height="56" fill="#32435B"/></svg>',
      ),
    notification: {
      ...base,
      title: 'Booking Alert',
      description: 'This tile has a broken image URL.',
      type: 'bookingAlert',
      badgeText: 'BOOKING',
      image: 'https://example.invalid/does-not-exist.png',
    },
  },
};
