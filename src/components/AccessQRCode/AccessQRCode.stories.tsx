import type { Meta, StoryObj } from '@storybook/react';
import { AccessQRCode } from './AccessQRCode';

const meta: Meta<typeof AccessQRCode> = {
  title: 'Access/AccessQRCode',
  component: AccessQRCode,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    value: 'https://access.example.com/qr?uid=abc123&ts=1720000000&lat=-25.7&lng=28.2',
    size: 220,
  },
};
export default meta;

type Story = StoryObj<typeof AccessQRCode>;

export const Default: Story = {};

export const WithProfile: Story = {
  args: {
    showProfile: true,
    name: 'Giorgi Gumburashvili',
    roleLabel: 'Resident',
    estateLabel: 'Fort Isabella',
  },
};

export const Loading: Story = {
  args: { loading: true },
};

export const NotPermitted: Story = {
  args: { permitted: false },
};
