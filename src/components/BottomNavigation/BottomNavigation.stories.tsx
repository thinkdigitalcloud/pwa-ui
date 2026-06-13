import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FiBell, FiHome, FiLock, FiUser } from 'react-icons/fi';
import { PiBroadcast } from 'react-icons/pi';
import { BottomNavigation, type BottomNavItem } from './BottomNavigation';

const meta: Meta<typeof BottomNavigation> = {
  title: 'Navigation/BottomNavigation',
  component: BottomNavigation,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;

const items: BottomNavItem[] = [
  { key: 'emergency', icon: <PiBroadcast />, label: 'SOS' },
  { key: 'access', icon: <FiLock />, label: 'Access' },
  { key: 'home', icon: <FiHome />, label: 'Home' },
  { key: 'profile', icon: <FiUser />, label: 'Profile' },
  { key: 'notifications', icon: <FiBell />, label: 'Alerts', badge: 4 },
];

type Story = StoryObj<typeof BottomNavigation>;

export const Default: Story = {
  render: () => {
    const [active, setActive] = useState('home');
    return <BottomNavigation items={items} active={active} onSelect={setActive} />;
  },
};

export const WithLabels: Story = {
  render: () => {
    const [active, setActive] = useState('home');
    return (
      <BottomNavigation
        items={items}
        active={active}
        onSelect={setActive}
        showLabels
      />
    );
  },
};
