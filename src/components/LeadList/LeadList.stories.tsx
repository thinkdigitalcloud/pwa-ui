import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { PiBroadcast, PiLock, PiHouseSimple, PiUser, PiEnvelope } from 'react-icons/pi';
import { LeadList } from './LeadList';

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

const visitors = [
  { id: '1', firstName: 'Thabo', surname: 'Nkosi', phone: '082 555 1234', plate: 'CA 123-456', agentName: 'Lerato M.' },
  { id: '2', firstName: 'Sarah', surname: 'Botha', phone: '071 222 9988', plate: 'ND 998-877', agentName: 'Pieter V.' },
];

const meta: Meta<typeof LeadList> = {
  title: 'Pages/LeadList',
  component: LeadList,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => frame(Story)],
  args: { visitors, onSelect: fn(), bottomNav },
};
export default meta;

type Story = StoryObj<typeof LeadList>;

export const Default: Story = {};
export const Loading: Story = { args: { loading: true } };
export const Empty: Story = { args: { visitors: [] } };
