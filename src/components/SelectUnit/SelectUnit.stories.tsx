import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { PiBroadcast, PiLock, PiHouseSimple, PiUser, PiEnvelope } from 'react-icons/pi';
import { SelectUnit } from './SelectUnit';

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

const meta: Meta<typeof SelectUnit> = {
  title: 'Pages/SelectUnit',
  component: SelectUnit,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => frame(Story)],
  args: { onSelectUnit: fn(), bottomNav },
};
export default meta;

type Story = StoryObj<typeof SelectUnit>;

export const Units: Story = {
  args: {
    units: [
      { unitNo: '101', estate: 'Ballito Hills' },
      { unitNo: '102', estate: 'Ballito Hills' },
      { unitNo: '204', estate: 'Balboa Park' },
      { unitNo: '309', estate: 'De Kuile' },
    ],
  },
};

export const Empty: Story = { args: { units: [] } };
export const Loading: Story = { args: { units: [], loading: true } };
