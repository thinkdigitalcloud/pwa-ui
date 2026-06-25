import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { PiBroadcast, PiLock, PiHouseSimple, PiUser, PiEnvelope } from 'react-icons/pi';
import { MakeBooking } from './MakeBooking';

const bottomNav = {
  active: 'home',
  onSelect: () => {},
  items: [
    { key: 'emergency', icon: <PiBroadcast size={22} /> },
    { key: 'access', icon: <PiLock size={22} /> },
    { key: 'home', icon: <PiHouseSimple size={22} /> },
    { key: 'profile', icon: <PiUser size={22} /> },
    { key: 'notifications', icon: <PiEnvelope size={22} />, badge: 38 },
  ],
};

const img = (label: string, bg: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="150"><rect width="400" height="150" fill="${bg}"/><text x="50%" y="50%" fill="#fff" font-family="sans-serif" font-size="22" text-anchor="middle" dominant-baseline="middle">${label}</text></svg>`,
  )}`;

const facilities = [
  { id: '1', name: 'Clubhouse', image: img('Clubhouse', '#4C8B2B') },
  { id: '2', name: 'Tennis Court', image: img('Tennis Court', '#1B578C') },
  { id: '3', name: 'Pool Deck', image: img('Pool Deck', '#275A89') },
];

const frame = (Story: () => JSX.Element) => (
  <div style={{ width: '100%', height: 760, maxHeight: '92vh', overflow: 'hidden', boxShadow: '0 0 0 1px #e5e5e5' }}>
    <Story />
  </div>
);

const meta: Meta<typeof MakeBooking> = {
  title: 'Pages/MakeBooking',
  component: MakeBooking,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => frame(Story)],
  args: { facilities, onSelect: fn(), bottomNav },
};
export default meta;

type Story = StoryObj<typeof MakeBooking>;

export const Facilities: Story = {};
export const Empty: Story = { args: { facilities: [] } };
