import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { FiCalendar, FiLock } from 'react-icons/fi';
import { Tile } from './Tile';

const meta: Meta<typeof Tile> = {
  title: 'Cards/Tile',
  component: Tile,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    heading: 'Bookings',
    description: 'Reserve facilities & amenities',
    icon: <FiCalendar />,
    onClick: fn(),
  },
};
export default meta;

type Story = StoryObj<typeof Tile>;

export const Default: Story = {};
export const New: Story = { args: { isNew: true } };
export const Disabled: Story = { args: { disabled: true } };
export const NoDescription: Story = {
  args: { description: undefined, heading: 'Access control', icon: <FiLock /> },
};

export const Stack: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Tile heading="Bookings" description="Reserve facilities" icon={<FiCalendar />} />
      <Tile heading="Access" description="Visitor access" icon={<FiLock />} isNew />
      <Tile heading="Disabled" description="Coming soon" icon={<FiCalendar />} disabled />
    </div>
  ),
};
