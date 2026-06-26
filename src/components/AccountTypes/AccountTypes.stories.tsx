import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { PiBroadcast, PiLock, PiHouseSimple, PiUser, PiEnvelope } from 'react-icons/pi';
import { AccountTypes } from './AccountTypes';

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

const logo = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="90"><text x="50%" y="55%" fill="#C0202E" font-family="serif" font-size="34" font-style="italic" text-anchor="middle">Balwin</text></svg>`,
)}`;

const frame = (Story: () => JSX.Element) => (
  <div style={{ width: '100%', height: 760, maxHeight: '92vh', overflow: 'hidden', boxShadow: '0 0 0 1px #e5e5e5' }}>
    <Story />
  </div>
);

const meta: Meta<typeof AccountTypes> = {
  title: 'Pages/AccountTypes',
  component: AccountTypes,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => frame(Story)],
  args: { onSelectType: fn(), onAddAccount: fn(), onEmptyAction: fn(), bottomNav },
};
export default meta;

type Story = StoryObj<typeof AccountTypes>;

export const Levies: Story = {
  args: {
    sections: [{ title: 'Estate Levies', items: [{ name: 'Levies', value: 'Levies', image: logo }] }],
  },
};

export const Empty: Story = { args: { sections: [{ title: 'Estate Levies', items: [] }] } };
export const Loading: Story = { args: { sections: [], loading: true } };
