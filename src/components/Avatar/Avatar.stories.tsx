import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Primitives/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  args: { name: 'Jane Doe', size: 56 },
};
export default meta;

type Story = StoryObj<typeof Avatar>;

export const Initials: Story = {};
export const Image: Story = {
  args: { src: 'https://i.pravatar.cc/120?img=5' },
};
export const RoundedSquare: Story = {
  args: { round: false, borderColor: '#1B578C' },
};
export const BrokenImageFallsBack: Story = {
  args: { src: 'https://example.com/does-not-exist.jpg', name: 'Sipho Khumalo' },
};
