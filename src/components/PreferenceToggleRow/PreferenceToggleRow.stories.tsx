import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PreferenceToggleRow } from './PreferenceToggleRow';

const meta: Meta<typeof PreferenceToggleRow> = {
  title: 'Notifications/PreferenceToggleRow',
  component: PreferenceToggleRow,
  tags: ['autodocs'],
  args: { label: 'Access Alert', value: true },
};
export default meta;

type Story = StoryObj<typeof PreferenceToggleRow>;

export const On: Story = {
  render: (args) => {
    const [v, setV] = useState(true);
    return <PreferenceToggleRow {...args} value={v} onChange={setV} />;
  },
};

export const Off: Story = {
  render: (args) => {
    const [v, setV] = useState(false);
    return <PreferenceToggleRow {...args} value={v} onChange={setV} />;
  },
};

export const Disabled: Story = {
  args: { value: true, disabled: true, onChange: () => {} },
};

export const Group: Story = {
  render: () => {
    const [bt, setBt] = useState(true);
    const [loc, setLoc] = useState(false);
    return (
      <div>
        <PreferenceToggleRow label="Bluetooth" value={bt} onChange={setBt} />
        <PreferenceToggleRow label="Location" value={loc} onChange={setLoc} noDivider />
      </div>
    );
  },
};
