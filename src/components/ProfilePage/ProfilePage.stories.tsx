import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { PiBroadcast, PiLock, PiHouseSimple, PiUser, PiEnvelope, PiUserCircle, PiBook, PiArrowsLeftRight, PiKey, PiBellRinging, PiInfo } from 'react-icons/pi';
import { ProfilePage } from './ProfilePage';

const frame = (Story: () => JSX.Element) => (
  <div style={{ width: '100%', height: 760, maxHeight: '92vh', overflow: 'hidden', boxShadow: '0 0 0 1px #e5e5e5' }}>
    <Story />
  </div>
);

const bottomNav = {
  active: 'profile',
  onSelect: () => {},
  items: [
    { key: 'emergency', icon: <PiBroadcast size={22} /> },
    { key: 'access', icon: <PiLock size={22} /> },
    { key: 'home', icon: <PiHouseSimple size={22} /> },
    { key: 'profile', icon: <PiUser size={22} /> },
    { key: 'notifications', icon: <PiEnvelope size={22} />, badge: 3 },
  ],
};

const meta: Meta<typeof ProfilePage> = {
  title: 'Pages/ProfilePage',
  component: ProfilePage,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => frame(Story)],
  args: {
    name: 'Giorgi Gumburashvili',
    email: 'g.gumburashvili@example.com',
    photoUrl: 'https://i.pravatar.cc/220?img=12',
    bannerImage: 'https://picsum.photos/seed/banner/800/500',
    onEditPhoto: fn(),
    onLogout: fn(),
    bottomNav,
    menuItems: [
      { key: 'details', label: 'Profile Details', icon: <PiUserCircle size={20} color="#fff" />, onClick: fn() },
      { key: 'personal', label: 'Personal Information', icon: <PiBook size={20} color="#fff" />, onClick: fn() },
      { key: 'switch', label: 'Switch Estate', icon: <PiArrowsLeftRight size={20} color="#fff" />, onClick: fn() },
      { key: 'access', label: 'Access Control', icon: <PiKey size={20} color="#fff" />, onClick: fn() },
      { key: 'notifs', label: 'Notification Preferences', icon: <PiBellRinging size={20} color="#fff" />, onClick: fn() },
      { key: 'about', label: 'About', icon: <PiInfo size={20} color="#fff" />, onClick: fn() },
    ],
  },
};
export default meta;

type Story = StoryObj<typeof ProfilePage>;

/** Default on the gocity theme — switch the toolbar theme to preview others. */
export const Default: Story = {};

/** No photo yet — avatar falls back to initials. */
export const NoPhoto: Story = {
  args: { photoUrl: undefined },
};
