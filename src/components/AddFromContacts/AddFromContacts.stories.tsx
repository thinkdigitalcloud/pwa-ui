import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { PiUserPlus } from 'react-icons/pi';
import { AddFromContacts } from './AddFromContacts';

/**
 * The Contact Picker API is Android/secure-context only, so in the Storybook
 * preview (desktop) the component normally renders nothing. These stories set
 * `hideWhenUnsupported={false}` so the (disabled) button is visible for design
 * review; on a supported device it renders enabled.
 */
const meta: Meta<typeof AddFromContacts> = {
  title: 'Patterns/AddFromContacts',
  component: AddFromContacts,
  tags: ['autodocs'],
  args: {
    onPick: fn(),
    label: 'Add from Contacts',
    variant: 'primary',
    block: true,
    hideWhenUnsupported: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'danger', 'outline', 'ghost'],
    },
  },
};
export default meta;

type Story = StoryObj<typeof AddFromContacts>;

export const Default: Story = {};
export const Outline: Story = { args: { variant: 'outline' } };
export const CustomLabel: Story = {
  args: { label: 'Import contact', icon: <PiUserPlus size={18} /> },
};
export const Inline: Story = { args: { block: false } };
export const HiddenWhenUnsupported: Story = {
  args: { hideWhenUnsupported: true },
};
