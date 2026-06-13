import type { Meta, StoryObj } from '@storybook/react';
import { CategoryCard } from './CategoryCard';

const meta: Meta<typeof CategoryCard> = {
  title: 'Cards/CategoryCard',
  component: CategoryCard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    heading: 'Sunset Yoga',
    time: 'Sat 18:00 – 19:00',
    description: 'Rooftop deck, mats provided',
    price: 'R120',
    image: 'https://picsum.photos/seed/yoga/180/180',
  },
};
export default meta;

type Story = StoryObj<typeof CategoryCard>;

export const Default: Story = {};
export const NoImage: Story = { args: { image: undefined } };
