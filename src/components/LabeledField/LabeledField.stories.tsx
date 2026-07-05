import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { LabeledField } from './LabeledField';

const meta: Meta<typeof LabeledField> = {
  title: 'Components/LabeledField',
  component: LabeledField,
  parameters: { layout: 'padded' },
  args: {
    label: 'Street Name',
    value: '',
    onChange: fn(),
  },
};
export default meta;

type Story = StoryObj<typeof LabeledField>;

/** Free-text field (no options) — a borderless underline input. */
export const Text: Story = {
  args: { label: 'Street Name', value: 'Embassy Cres' },
};

/** Read-only text field. */
export const ReadOnly: Story = {
  args: { label: 'Email', value: 'resident@example.com', readOnly: true },
};

/** Select field — passing `options` turns it into a picker (opens a SelectModal). */
export const Select: Story = {
  args: {
    label: 'Address Type',
    value: 'Residential',
    selectTitle: 'Address Type',
    options: [
      { label: 'Residential', value: 'Residential' },
      { label: 'Work', value: 'Work' },
    ],
    onSelect: fn(),
  },
};

/** Select with a logo-per-row picker (estate-style). */
export const SelectWithLogos: Story = {
  args: {
    label: 'Estate',
    placeholder: 'Select an estate',
    selectTitle: 'Estate',
    options: [
      { label: 'Anch', value: 'Anch', image: 'https://picsum.photos/seed/anch/220/56' },
      { label: 'Fort Isabella', value: 'Fort Isabella', image: 'https://picsum.photos/seed/fort/220/56' },
    ],
    onSelect: fn(),
  },
};
