import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { PiBroadcast, PiLock, PiHouseSimple, PiUser, PiEnvelope } from 'react-icons/pi';
import { ProfileListPage, type ProfileListItemData } from './ProfileListPage';

const bottomNav = {
  active: 'profile',
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
  `<svg xmlns="http://www.w3.org/2000/svg" width="90" height="65"><rect width="90" height="65" rx="6" fill="#C0202E"/><text x="50%" y="55%" fill="#fff" font-family="serif" font-size="16" font-style="italic" text-anchor="middle">Balwin</text></svg>`,
)}`;

const frame = (Story: () => JSX.Element) => (
  <div style={{ width: '100%', height: 760, maxHeight: '92vh', overflow: 'hidden', boxShadow: '0 0 0 1px #e5e5e5' }}>
    <Story />
  </div>
);

const meta: Meta<typeof ProfileListPage> = {
  title: 'Pages/ProfileListPage',
  component: ProfileListPage,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => frame(Story)],
  args: { onItemClick: fn(), onItemDelete: fn(), onAdd: fn(), bottomNav },
};
export default meta;

type Story = StoryObj<typeof ProfileListPage>;

/** Addresses — the same page covers Accounts/Contacts/Vehicles via props. */
export const Addresses: Story = {
  args: {
    title: 'Addresses',
    addLabel: 'Add Address',
    emptyText: 'You do not have any addresses yet, would you like to add one?',
    items: [
      { id: 1, title: 'Ballito Hills', lines: ['Residential', 'Ballito'], image: logo },
      { id: 2, title: 'Balboa Park', lines: ['Work', 'Johannesburg'], image: logo },
    ],
  },
};

export const Accounts: Story = {
  args: {
    title: 'Accounts',
    addLabel: 'Add Account',
    emptyText: 'You do not have any accounts yet, would you like to add one?',
    items: [{ id: 1, title: 'Ballito Hills', lines: ['Levy', '100023948'], image: logo }],
  },
};

export const Empty: Story = {
  args: { title: 'Vehicles', addLabel: 'Add Vehicle', emptyText: 'No vehicles yet.', items: [] },
};

/** Delete reflects in local state. */
export const Interactive: Story = {
  render: (args) => {
    const [items, setItems] = useState<ProfileListItemData[]>([
      { id: 1, title: 'Ballito Hills', lines: ['Residential', 'Ballito'], image: logo },
      { id: 2, title: 'Balboa Park', lines: ['Work', 'Johannesburg'], image: logo },
    ]);
    return (
      <ProfileListPage
        {...args}
        title="Addresses"
        addLabel="Add Address"
        emptyText="No addresses yet."
        items={items}
        onItemDelete={(item) => setItems((p) => p.filter((x) => x.id !== item.id))}
      />
    );
  },
};
