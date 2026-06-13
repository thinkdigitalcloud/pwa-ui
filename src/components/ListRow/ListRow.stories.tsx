import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { FiBell, FiCalendar, FiLock, FiUser } from 'react-icons/fi';
import { ListRow } from './ListRow';

const meta: Meta<typeof ListRow> = {
  title: 'Layout/ListRow',
  component: ListRow,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    title: 'Bookings',
    description: 'Reserve facilities and amenities at your estate',
    icon: <FiCalendar />,
    hasArrow: true,
    onClick: fn(),
  },
};
export default meta;

type Story = StoryObj<typeof ListRow>;

export const Default: Story = {};
export const New: Story = { args: { isNew: true } };
export const NoDescription: Story = {
  args: { description: undefined, title: 'Profile', icon: <FiUser /> },
};

export const List: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <ListRow title="Bookings" description="Reserve facilities" icon={<FiCalendar />} hasArrow />
      <ListRow title="Access" description="Manage visitor access" icon={<FiLock />} hasArrow isNew />
      <ListRow title="Notifications" description="Estate updates and alerts" icon={<FiBell />} hasArrow />
      <ListRow title="Profile" icon={<FiUser />} hasArrow />
    </div>
  ),
};
