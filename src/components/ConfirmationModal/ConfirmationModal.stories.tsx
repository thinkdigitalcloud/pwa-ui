import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ConfirmationModal } from './ConfirmationModal';

const meta: Meta<typeof ConfirmationModal> = {
  title: 'Modals/ConfirmationModal',
  component: ConfirmationModal,
  parameters: { layout: 'fullscreen' },
  args: {
    open: true,
    text: 'Are you sure you want to continue?',
    onConfirm: fn(),
    onCancel: fn(),
  },
};
export default meta;

type Story = StoryObj<typeof ConfirmationModal>;

/** Default question prompt. */
export const Question: Story = {};

/** Destructive variant with the trash icon. */
export const Delete: Story = {
  args: {
    text: 'Are you sure you want to remove this visitor?',
    icon: 'trash',
    confirmLabel: 'Remove',
  },
};

/** No icon, custom labels. */
export const NoIcon: Story = {
  args: {
    icon: 'none',
    text: 'Discard your changes?',
    confirmLabel: 'Discard',
    cancelLabel: 'Keep editing',
  },
};
