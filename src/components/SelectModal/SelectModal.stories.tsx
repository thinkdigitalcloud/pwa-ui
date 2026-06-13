import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SelectModal, type SelectOption } from './SelectModal';
import { Button } from '../Button';

const meta: Meta<typeof SelectModal> = {
  title: 'Overlays/SelectModal',
  component: SelectModal,
  parameters: { layout: 'fullscreen' },
};
export default meta;

const options: SelectOption[] = [
  { label: 'English', value: 'en' },
  { label: 'Afrikaans', value: 'af' },
  { label: 'Nederlands', value: 'nl' },
];

type Story = StoryObj<typeof SelectModal>;

export const Language: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('en');
    return (
      <div style={{ padding: 24 }}>
        <Button text={`Language: ${value}`} onClick={() => setOpen(true)} />
        <SelectModal
          open={open}
          onClose={() => setOpen(false)}
          title="Choose language"
          options={options}
          value={value}
          onSelect={setValue}
        />
      </div>
    );
  },
};
