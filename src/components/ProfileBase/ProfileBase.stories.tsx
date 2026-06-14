import type { Meta, StoryObj } from '@storybook/react';
import { ProfileBase } from './ProfileBase';

const meta: Meta<typeof ProfileBase> = {
  title: 'Layout/ProfileBase',
  component: ProfileBase,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof ProfileBase>;

export const WithPhoto: Story = {
  args: { photoURL: 'https://i.pravatar.cc/600?img=12' },
};

export const BannerFallback: Story = {
  args: {
    homeBanner:
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=900',
  },
};

export const Blurred: Story = {
  args: {
    blurRadius: 6,
    photoURL: 'https://i.pravatar.cc/600?img=12',
    tempImage: 'https://i.pravatar.cc/600?img=12',
  },
};

export const Loading: Story = {
  args: { loading: true, homeBanner: '' },
};

export const HiddenImage: Story = {
  args: { hideProfileImage: true },
};
