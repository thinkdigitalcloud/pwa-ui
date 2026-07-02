import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { VisitorAccessTile } from './VisitorAccessTile';

const meta: Meta<typeof VisitorAccessTile> = {
  title: 'Cards/VisitorAccessTile',
  component: VisitorAccessTile,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    name: 'Jane Visitor',
    mobile: '+27 82 123 4567',
    date: '12 Jul 2026',
    from: '09:00',
    to: '17:00',
    onShare: fn(),
    onRemove: fn(),
  },
};
export default meta;

type Story = StoryObj<typeof VisitorAccessTile>;

export const Default: Story = {};

/** With an avatar shown. */
export const WithAvatar: Story = {
  args: { showAvatar: true },
};

/** Read-only (no actions). */
export const NoActions: Story = {
  args: { onShare: undefined, onRemove: undefined },
};
