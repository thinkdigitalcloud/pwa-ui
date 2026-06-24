import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { PiBroadcast, PiLock, PiHouseSimple, PiUser, PiEnvelope } from 'react-icons/pi';
import { NotificationCategories } from './NotificationCategories';

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

const categories = [
  { name: 'All', icon: 'notifications-outline', count: 12 },
  { name: 'Estate Manager', icon: 'mail-outline', count: 3 },
  { name: 'Visitor Access', icon: 'lock-closed-outline', count: 5 },
  { name: 'Resident Access', icon: 'people-outline', count: 1 },
  { name: 'Payments', icon: 'wallet-outline', count: 2 },
  { name: 'Events', icon: 'calendar-outline', count: 0 },
  { name: 'Newsletter', icon: 'newspaper-outline', count: 1 },
  { name: 'HOA', icon: 'home-outline', count: null },
];

const frame = (Story: () => JSX.Element) => (
  <div style={{ width: '100%', height: 720, maxHeight: '90vh', overflow: 'hidden', boxShadow: '0 0 0 1px #e5e5e5' }}>
    <Story />
  </div>
);

const meta: Meta<typeof NotificationCategories> = {
  title: 'Notifications/NotificationCategories',
  component: NotificationCategories,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => frame(Story)],
  args: {
    categories,
    onSelectCategory: fn(),
    onHelp: fn(),
    bottomNav,
  },
};
export default meta;

type Story = StoryObj<typeof NotificationCategories>;

export const Default: Story = {};
export const NoHelp: Story = { args: { helpText: null } };
