import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { PiBroadcast, PiLock, PiHouseSimple, PiUser, PiEnvelope } from 'react-icons/pi';
import { PersonalInformation, type OtpResult } from './PersonalInformation';

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

const meta: Meta<typeof PersonalInformation> = {
  title: 'Pages/PersonalInformation',
  component: PersonalInformation,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => frame(Story)],
  args: {
    onSelect: fn(),
    email: 'g.gumburashvili@broccoli.agency',
    onSendOtp: async () => true,
    // Parametrized OTP check — "123456" verifies, anything else is incorrect.
    onVerifyOtp: async (code: string): Promise<OtpResult> =>
      code === '123456' ? 'VERIFIED' : 'INCORRECT',
    onDeleteConfirmed: fn(),
    bottomNav,
  },
};
export default meta;

type Story = StoryObj<typeof PersonalInformation>;

/** Menu + Delete Account. Tap Delete → Warning → OTP (enter 123456 to verify). */
export const Default: Story = {};
