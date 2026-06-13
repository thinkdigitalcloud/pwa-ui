import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SearchBar } from './SearchBar';

const meta: Meta<typeof SearchBar> = {
  title: 'Inputs/SearchBar',
  component: SearchBar,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof SearchBar>;

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <SearchBar value={value} onChange={setValue} placeholder="Search directory…" />
    );
  },
};

export const WithValue: Story = {
  args: { value: 'Fort Isabella', onChange: () => {} },
};
