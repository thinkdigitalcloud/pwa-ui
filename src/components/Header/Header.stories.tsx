import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Header } from './Header';

const meta: Meta<typeof Header> = {
  title: 'Navigation/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: { title: 'Bookings', onBack: fn() },
};
export default meta;

type Story = StoryObj<typeof Header>;

export const Default: Story = {};
export const NoBackButton: Story = { args: { noBackButton: true } };
export const WithShare: Story = { args: { share: true, onShare: fn() } };
export const EditSaveDelete: Story = {
  args: {
    title: 'Edit profile',
    edit: true,
    save: true,
    remove: true,
    onEdit: fn(),
    onSave: fn(),
    onRemove: fn(),
  },
};
export const SaveDisabled: Story = {
  args: { title: 'New visitor', save: true, saveDisabled: true, onSave: fn() },
};
