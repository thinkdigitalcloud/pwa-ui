import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { PiBroadcast, PiLock, PiHouseSimple, PiUser, PiEnvelope } from 'react-icons/pi';
import { BookingFacility } from './BookingFacility';

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

const img =
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="150"><rect width="400" height="150" fill="#1B578C"/><text x="50%" y="50%" fill="#fff" font-family="sans-serif" font-size="22" text-anchor="middle" dominant-baseline="middle">Tennis Court</text></svg>`,
  )}`;

const frame = (Story: () => JSX.Element) => (
  <div style={{ width: '100%', height: 760, maxHeight: '92vh', overflow: 'hidden', boxShadow: '0 0 0 1px #e5e5e5' }}>
    <Story />
  </div>
);

const meta: Meta<typeof BookingFacility> = {
  title: 'Pages/BookingFacility',
  component: BookingFacility,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => frame(Story)],
  args: { resourceName: 'Tennis Court', resourceImage: img, onBook: fn(), bottomNav },
};
export default meta;

type Story = StoryObj<typeof BookingFacility>;

export const Default: Story = {};
export const NoImage: Story = { args: { resourceName: 'Braai Area', resourceImage: undefined } };
