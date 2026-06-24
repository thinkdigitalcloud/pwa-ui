import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { PiBroadcast, PiLock, PiHouseSimple, PiUser, PiEnvelope } from 'react-icons/pi';
import {
  NotificationPreferences,
  type NotificationPreferenceItem,
} from './NotificationPreferences';

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

const frame = (Story: () => JSX.Element) => (
  <div style={{ width: '100%', height: 720, maxHeight: '90vh', overflow: 'hidden', boxShadow: '0 0 0 1px #e5e5e5' }}>
    <Story />
  </div>
);

const meta: Meta<typeof NotificationPreferences> = {
  title: 'Notifications/NotificationPreferences',
  component: NotificationPreferences,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => frame(Story)],
  args: {
    preferences: [{ key: 'accessAlert', label: 'Access Alert', value: true }],
    onChange: fn(),
    bottomNav,
  },
};
export default meta;

type Story = StoryObj<typeof NotificationPreferences>;

/** Matches balwin: a single "Access Alert" subscribe/unsubscribe toggle. */
export const AccessAlert: Story = {};

export const Loading: Story = { args: { loading: true } };

/** The page generalises to any number of preference rows. */
export const MultiplePreferences: Story = {
  args: {
    preferences: [
      { key: 'accessAlert', label: 'Access Alert', value: true },
      { key: 'newsletter', label: 'Newsletter', value: false },
      { key: 'events', label: 'Events', value: true },
      { key: 'payments', label: 'Payments', value: false, disabled: true },
    ],
  },
};

/** Toggling reflects state and logs the change (parent owns the side-effect). */
export const Interactive: Story = {
  render: (args) => {
    const [prefs, setPrefs] = useState<NotificationPreferenceItem[]>(args.preferences);
    return (
      <NotificationPreferences
        {...args}
        preferences={prefs}
        onChange={(key, next) => {
          setPrefs((p) => p.map((x) => (x.key === key ? { ...x, value: next } : x)));
          args.onChange?.(key, next);
        }}
      />
    );
  },
};
