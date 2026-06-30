import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { PiBroadcast, PiLock, PiHouseSimple, PiUser, PiEnvelope } from 'react-icons/pi';
import { ResourceBooking } from './ResourceBooking';

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

const frame = (Story: () => JSX.Element) => (
  <div style={{ width: '100%', height: 760, maxHeight: '92vh', overflow: 'hidden', boxShadow: '0 0 0 1px #e5e5e5' }}>
    <Story />
  </div>
);

const banner =
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><rect width="400" height="200" fill="#1B578C"/><text x="50%" y="50%" fill="#fff" font-family="sans-serif" font-size="22" text-anchor="middle" dominant-baseline="middle">Lagoon</text></svg>`,
  )}`;

const availability = [
  { time: '08:00', remaining: 2 },
  { time: '08:30', remaining: 2 },
  { time: '09:00', remaining: 0 },
  { time: '09:30', remaining: 3 },
  { time: '10:00', remaining: 3 },
];

const meta: Meta<typeof ResourceBooking> = {
  title: 'Pages/ResourceBooking',
  component: ResourceBooking,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => frame(Story)],
  args: {
    resource: {
      name: 'Lagoon',
      image: banner,
      description: 'Crystal-clear swimming lagoon with sandy beach edges.',
      facilityInfo: 'Lifeguard on duty • Showers • Kiosk',
      images: [banner, banner],
    },
    date: '2026-07-01',
    timeLabel: '',
    availability,
    interval: 30,
    resourceTimes: { start: 800, end: 1000 },
    onBookNow: fn(),
    onSelectDate: fn(),
    onTimeSelected: fn(),
    onConfirm: fn(),
    onDone: fn(),
    onCancel: fn(),
    bottomNav,
  },
};
export default meta;

type Story = StoryObj<typeof ResourceBooking>;

export const Default: Story = {};
export const Loading: Story = { args: { loading: true } };
export const Confirmed: Story = { args: { showConfirmed: true } };
