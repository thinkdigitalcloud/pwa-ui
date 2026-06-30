import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { TimeSlotPicker } from './TimeSlotPicker';

// 08:00–11:00 every 30 min; 09:00 & 09:30 fully booked.
const availability = [
  { time: '08:00', remaining: 2 },
  { time: '08:30', remaining: 2 },
  { time: '09:00', remaining: 0 },
  { time: '09:30', remaining: 0 },
  { time: '10:00', remaining: 3 },
  { time: '10:30', remaining: 3 },
  { time: '11:00', remaining: 1 },
];

const meta: Meta<typeof TimeSlotPicker> = {
  title: 'Components/TimeSlotPicker',
  component: TimeSlotPicker,
  args: {
    open: true,
    onClose: fn(),
    onTimeSelected: fn(),
    availability,
    interval: 30,
    resourceTimes: { start: 800, end: 1100 },
  },
};
export default meta;

type Story = StoryObj<typeof TimeSlotPicker>;

export const Default: Story = {};
export const HourInterval: Story = { args: { interval: 60 } };
export const Empty: Story = {
  args: { availability: [], resourceTimes: { start: 800, end: 1100 } },
};
