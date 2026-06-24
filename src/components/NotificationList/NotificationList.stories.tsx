import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { PiBroadcast, PiLock, PiHouseSimple, PiUser, PiEnvelope } from 'react-icons/pi';
import { NotificationList } from './NotificationList';
import type { NotificationItem } from '../NotificationTile';

const bottomNav = {
  active: 'notifications',
  onSelect: () => {},
  items: [
    { key: 'emergency', icon: <PiBroadcast size={22} /> },
    { key: 'access', icon: <PiLock size={22} /> },
    { key: 'home', icon: <PiHouseSimple size={22} /> },
    { key: 'profile', icon: <PiUser size={22} /> },
    { key: 'notifications', icon: <PiEnvelope size={22} />, badge: 38 },
  ],
};

const nowSec = Math.floor(Date.now() / 1000);

const notifications: NotificationItem[] = [
  {
    id: '1', notificationId: 'n1', type: 'visitor', status: 'SENT',
    title: 'Visitor at the gate',
    description: 'John Doe is requesting access at the main gate.',
    createdSeconds: nowSec - 60 * 30,
  },
  {
    id: '2', notificationId: 'n2', type: 'payments', status: 'SENT',
    title: 'Payment received',
    description: 'Your levy payment of R1 200 was successful.',
    createdSeconds: nowSec - 60 * 60 * 5,
  },
  {
    id: '3', notificationId: 'n3', type: 'newsletter', status: 'READ',
    title: 'June Newsletter',
    description: 'Read the latest estate news and updates.',
    createdSeconds: nowSec - 60 * 60 * 30,
  },
  {
    id: '4', notificationId: 'n4', type: 'estate manager', status: 'READ',
    title: 'Water maintenance notice',
    description: 'Water will be off between 09:00–12:00 on Tuesday.',
    createdSeconds: nowSec - 60 * 60 * 24 * 3,
  },
];

const frame = (Story: () => JSX.Element) => (
  <div style={{ width: '100%', height: 720, maxHeight: '90vh', overflow: 'hidden', boxShadow: '0 0 0 1px #e5e5e5' }}>
    <Story />
  </div>
);

const meta: Meta<typeof NotificationList> = {
  title: 'Notifications/NotificationList',
  component: NotificationList,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => frame(Story)],
  args: {
    notifications,
    title: 'Messages',
    categoryLabel: 'All Notifications',
    onOpen: fn(),
    onMarkRead: fn(),
    onMarkUnread: fn(),
    onDelete: fn(),
    bottomNav,
  },
};
export default meta;

type Story = StoryObj<typeof NotificationList>;

export const Default: Story = {};
export const FilteredCategory: Story = {
  args: { categoryLabel: 'From "Payments"', notifications: notifications.filter((n) => n.type === 'payments') },
};
export const Empty: Story = { args: { notifications: [] } };
