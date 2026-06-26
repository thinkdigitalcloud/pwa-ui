import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { OtpInput } from './OtpInput';

const meta: Meta<typeof OtpInput> = {
  title: 'Primitives/OtpInput',
  component: OtpInput,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof OtpInput>;

export const SixDigit: Story = {
  render: () => {
    const [v, setV] = useState('');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <OtpInput value={v} onChange={setV} />
        <span style={{ fontSize: 13 }}>value: {v || '—'}</span>
      </div>
    );
  },
};

export const FourDigit: Story = {
  render: () => {
    const [v, setV] = useState('');
    return <OtpInput value={v} onChange={setV} length={4} />;
  },
};
