import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { PiBroadcast, PiLock, PiHouseSimple, PiUser, PiEnvelope } from 'react-icons/pi';
import { LeadShareForm } from './LeadShareForm';

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

const meta: Meta<typeof LeadShareForm> = {
  title: 'Pages/LeadShareForm',
  component: LeadShareForm,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => frame(Story)],
  args: {
    onSubmit: fn(),
    bottomNav,
    initialValues: {
      name: 'Thabo Nkosi',
      number: '082 555 1234',
      email: 'thabo@example.com',
      license: 'CA 123-456',
    },
  },
};
export default meta;

type Story = StoryObj<typeof LeadShareForm>;

export const Default: Story = {};
export const Loading: Story = { args: { loading: true } };
export const Empty: Story = { args: { initialValues: undefined } };
