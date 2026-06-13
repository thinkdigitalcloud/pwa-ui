import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { FiBell, FiHome, FiLock, FiUser } from 'react-icons/fi';
import { Page } from './Page';
import { Tile } from '../Tile';
import type { BottomNavItem } from '../BottomNavigation';

const meta: Meta<typeof Page> = {
  title: 'Layout/Page',
  component: Page,
  parameters: { layout: 'fullscreen' },
};
export default meta;

const navItems: BottomNavItem[] = [
  { key: 'home', icon: <FiHome />, label: 'Home' },
  { key: 'access', icon: <FiLock />, label: 'Access' },
  { key: 'profile', icon: <FiUser />, label: 'Profile' },
  { key: 'notifications', icon: <FiBell />, label: 'Alerts', badge: 2 },
];

type Story = StoryObj<typeof Page>;

export const HomeScreen: Story = {
  render: () => {
    const [active, setActive] = useState('home');
    return (
      <div style={{ height: 640, width: 390, border: '1px solid #ddd' }}>
        <Page
          header={{ title: 'Home', noBackButton: true, share: true, onShare: fn() }}
          bottomNav={{ items: navItems, active, onSelect: setActive }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Tile heading="Bookings" description="Reserve facilities" icon={<FiHome />} />
            <Tile heading="Access" description="Visitor access" icon={<FiLock />} isNew />
            <Tile heading="Notifications" description="Estate updates" icon={<FiBell />} />
          </div>
        </Page>
      </div>
    );
  },
};
