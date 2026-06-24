import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { PiBroadcast, PiLock, PiHouseSimple, PiUser, PiEnvelope } from 'react-icons/pi';
import { AccessControlSettings } from './AccessControlSettings';

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
  <div style={{ width: '100%', height: 760, maxHeight: '92vh', overflow: 'hidden', boxShadow: '0 0 0 1px #e5e5e5' }}>
    <Story />
  </div>
);

const meta: Meta<typeof AccessControlSettings> = {
  title: 'Pages/AccessControlSettings',
  component: AccessControlSettings,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => frame(Story)],
  args: {
    hasPin: true,
    // Parametrized PIN check — accept "1234".
    verifyPin: (pin: string) => pin === '1234',
    onSetPin: fn(),
    bottomNav,
  },
};
export default meta;

type Story = StoryObj<typeof AccessControlSettings>;

/** Existing PIN — authenticate. Enter 1234 to unlock the settings. */
export const AuthenticatePin: Story = {
  args: {
    hasPin: false,
  },
};

/** No PIN yet — create then confirm a 4-digit PIN. */
export const CreatePin: Story = { args: { hasPin: false } };

export const Loading: Story = { args: { loading: true } };

/** Past the gate: permissions, access locations, face profile, gallagher. */
export const Settings: Story = {
  args: {
    initialAuthenticated: true,
    accessLocations: ['Main Gate', 'Clubhouse', 'Pool Area'],
    faceProfile: { mediaId: 'MED-10293', personId: 'PSN-55821' },
    diagnostics: { beaconId: 'BC-001', allowed: true, advertising: false },
  },
  render: (args) => {
    const [bt, setBt] = useState(true);
    const [loc, setLoc] = useState(false);
    return (
      <AccessControlSettings
        {...args}
        bluetooth={bt}
        location={loc}
        onBluetoothChange={setBt}
        onLocationChange={setLoc}
      />
    );
  },
};

/** Empty access profile — every section shows the contact-manager message. */
export const SettingsEmpty: Story = {
  args: { initialAuthenticated: true, accessLocations: [], faceProfile: null },
};
