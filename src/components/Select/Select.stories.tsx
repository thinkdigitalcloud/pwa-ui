import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';
import type { SelectOption } from '../SelectModal';

const meta: Meta<typeof Select> = {
  title: 'Inputs/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'inline-radio', options: ['underline', 'box'] },
  },
};
export default meta;

const estates: SelectOption[] = [
  { label: 'Fort Isabella', value: 'fort-isabella' },
  { label: 'Domin', value: 'domin' },
  { label: 'Lagoon', value: 'lagoon' },
  { label: 'Coming soon', value: 'soon', disabled: true },
];

type Story = StoryObj<typeof Select>;

export const Interactive: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | undefined>(undefined);
    return (
      <Select<string>
        size={args.size}
        options={estates}
        value={value}
        onChange={setValue}
        placeholder="Select an estate"
        title="Choose estate"
      />
    );
  },
};

export const Preselected: Story = {
  render: () => {
    const [value, setValue] = useState<string>('domin');
    return (
      <Select
        options={estates}
        value={value}
        onChange={setValue}
        placeholder="Select an estate"
      />
    );
  },
};

export const Invalid: Story = {
  args: { options: estates, placeholder: 'Required field', invalid: true },
};

export const Disabled: Story = {
  args: { options: estates, placeholder: 'Select an estate', disabled: true },
};

export const Variants: Story = {
  render: () => {
    const [a, setA] = useState<string | undefined>('domin');
    const [b, setB] = useState<string | undefined>('domin');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Select options={estates} value={a} onChange={setA} placeholder="Underline (default)" />
        <Select options={estates} value={b} onChange={setB} variant="box" placeholder="Box" />
      </div>
    );
  },
};

export const Sizes: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>('lagoon');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Select options={estates} value={value} onChange={setValue} size="sm" placeholder="Small" />
        <Select options={estates} value={value} onChange={setValue} size="md" placeholder="Medium" />
        <Select options={estates} value={value} onChange={setValue} size="lg" placeholder="Large" />
      </div>
    );
  },
};
