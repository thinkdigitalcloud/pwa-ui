import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from './Modal';
import { Button } from '../Button';
import { Text } from '../Text';

const meta: Meta<typeof Modal> = {
  title: 'Overlays/Modal',
  component: Modal,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof Modal>;

export const Confirmation: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ padding: 24 }}>
        <Button text="Delete visitor" variant="danger" onClick={() => setOpen(true)} />
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Remove visitor?"
          footer={
            <>
              <Button variant="ghost" text="Cancel" onClick={() => setOpen(false)} />
              <Button variant="danger" text="Remove" onClick={() => setOpen(false)} />
            </>
          }
        >
          <Text variant="body">
            This will revoke the visitor's access code. This action cannot be undone.
          </Text>
        </Modal>
      </div>
    );
  },
};
