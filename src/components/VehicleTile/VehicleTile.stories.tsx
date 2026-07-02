import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { VehicleTile } from './VehicleTile';

const meta: Meta<typeof VehicleTile> = {
  title: 'Cards/VehicleTile',
  component: VehicleTile,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    make: 'Toyota',
    model: 'Corolla',
    reg: 'CA 123-456',
    photo: 'https://picsum.photos/seed/car/160/120',
    onClick: fn(),
  },
};
export default meta;

type Story = StoryObj<typeof VehicleTile>;

export const Default: Story = {};

export const NoPhoto: Story = {
  args: { photo: '' },
};
