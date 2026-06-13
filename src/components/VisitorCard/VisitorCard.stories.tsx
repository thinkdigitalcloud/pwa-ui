import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { FiInfo, FiPlusSquare, FiTrash2, FiArrowRight } from 'react-icons/fi';
import { VisitorCard } from './VisitorCard';

const meta: Meta<typeof VisitorCard> = {
  title: 'Cards/VisitorCard',
  component: VisitorCard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof VisitorCard>;

export const Pending: Story = {
  args: {
    name: 'Jane Doe',
    lines: ['+27 82 123 4567'],
    onClick: fn(),
    actions: [{ key: 'info', icon: <FiInfo />, label: 'Info', onClick: fn() }],
  },
};

export const Verified: Story = {
  args: {
    name: 'Sipho Khumalo',
    lines: ['+27 71 555 0199'],
    avatarBorderColor: '#4C8B2B',
    actions: [
      { key: 'info', icon: <FiInfo />, label: 'Info', onClick: fn() },
      { key: 'add', icon: <FiPlusSquare />, label: 'Add', onClick: fn(), color: '#4C8B2B' },
    ],
  },
};

export const ShortTermLetter: Story = {
  args: {
    name: 'Maria Santos',
    lines: ['+27 60 222 3344', 'Unit 14B', 'Valid until 30 Jun'],
    avatarUrl: 'https://i.pravatar.cc/120?img=32',
    onClick: fn(),
    actions: [{ key: 'go', icon: <FiArrowRight />, label: 'Open', onClick: fn() }],
  },
};

export const AccessRecordNoAvatar: Story = {
  args: {
    name: 'Thabo Nkosi',
    hideAvatar: true,
    lines: ['+27 83 010 1010', '12 Jun 2026', '09:00 - 17:00'],
    actions: [{ key: 'revoke', icon: <FiTrash2 />, label: 'Revoke', onClick: fn() }],
  },
};

export const WithStatus: Story = {
  args: {
    name: 'Weekend Guest',
    lines: ['Invited by Unit 9'],
    status: { label: 'Active', color: '#4C8B2B' },
    onClick: fn(),
  },
};
