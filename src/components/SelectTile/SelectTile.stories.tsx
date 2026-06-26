import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { PiHouse } from 'react-icons/pi';
import { SelectTile } from './SelectTile';

const meta: Meta<typeof SelectTile> = {
  title: 'Primitives/SelectTile',
  component: SelectTile,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { label: 'Unit: 101', icon: <PiHouse size={28} color="#D01E2D" />, onClick: fn() },
};
export default meta;

type Story = StoryObj<typeof SelectTile>;

export const Default: Story = {};
export const NoIcon: Story = { args: { icon: undefined, label: 'Option A' } };

export const Grid: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 18, width: 360 }}>
      {['101', '102', '204', '309'].map((u) => (
        <div key={u} style={{ width: '47%' }}>
          <SelectTile {...args} label={`Unit: ${u}`} />
        </div>
      ))}
    </div>
  ),
};
