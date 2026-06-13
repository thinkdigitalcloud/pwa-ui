import type { Meta, StoryObj } from '@storybook/react';
import { InformationCard } from './InformationCard';

const meta: Meta<typeof InformationCard> = {
  title: 'Cards/InformationCard',
  component: InformationCard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof InformationCard>;

export const Estate: Story = {
  args: {
    title: 'Fort Isabella',
    lines: ['12 Marina Drive', 'Cape Town, 8001'],
    image: 'https://picsum.photos/seed/estate/120/120',
  },
};

export const Vehicle: Story = {
  args: {
    title: 'Toyota',
    lines: ['Corolla', 'CA 123-456'],
    image: 'https://picsum.photos/seed/car/120/120',
  },
};
