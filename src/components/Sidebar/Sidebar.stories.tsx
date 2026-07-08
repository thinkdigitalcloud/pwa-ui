import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Sidebar } from './Sidebar';
import { Button } from '../Button';
import { ListRow } from '../ListRow';

const meta: Meta<typeof Sidebar> = {
  title: 'Overlays/Sidebar',
  component: Sidebar,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof Sidebar>;

export const Drawer: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ padding: 24 }}>
        <Button text="Open menu" onClick={() => setOpen(true)} />
        <Sidebar
          {...args}
          open={open}
          onSetOpen={setOpen}
          styles={{ sidebar: { width: '70%', maxWidth: 320 } }}
          sidebar={
            <div style={{ padding: 16, height: '100%' }}>
              <ListRow title="Help" onClick={() => setOpen(false)} />
              <ListRow title="Refresh" onClick={() => setOpen(false)} />
            </div>
          }
        />
      </div>
    );
  },
};

export const FromRight: Story = {
  ...Drawer,
  args: { pullRight: true },
};
