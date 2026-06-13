import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { StatusNav, type StatusNavItem } from './StatusNav';

const meta: Meta<typeof StatusNav> = {
  title: 'Navigation/StatusNav',
  component: StatusNav,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;

const items: StatusNavItem[] = [
  { label: 'Pending', value: 'pending' },
  { label: 'Open', value: 'open' },
  { label: 'Past', value: 'past' },
];

type Story = StoryObj<typeof StatusNav>;

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState('open');
    return <StatusNav items={items} value={value} onChange={setValue} />;
  },
};

export const FullWidth: Story = {
  render: () => {
    const [value, setValue] = useState('pending');
    return (
      <StatusNav items={items} value={value} onChange={setValue} fullWidth />
    );
  },
};

export const TwoSegments: Story = {
  render: () => {
    const [value, setValue] = useState('upcoming');
    return (
      <StatusNav
        items={[
          { label: 'Upcoming', value: 'upcoming' },
          { label: 'History', value: 'history' },
        ]}
        value={value}
        onChange={setValue}
        fullWidth
      />
    );
  },
};
