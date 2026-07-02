import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { DevelopmentCard } from './DevelopmentCard';

const meta: Meta<typeof DevelopmentCard> = {
  title: 'Cards/DevelopmentCard',
  component: DevelopmentCard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    developments: [
      { name: 'Fort Isabella', coverImage: 'https://picsum.photos/seed/est1/600/320', priceText: 'from R1 200 000', subtitle: 'La Montagne, Pretoria' },
      { name: 'The Whisken', coverImage: 'https://picsum.photos/seed/est2/600/320', priceText: 'from R2 450 000', subtitle: 'Kyalami, Midrand' },
    ],
    onSelect: fn(),
  },
};
export default meta;

type Story = StoryObj<typeof DevelopmentCard>;

export const Default: Story = {};

export const Empty: Story = {
  args: { developments: [] },
};
