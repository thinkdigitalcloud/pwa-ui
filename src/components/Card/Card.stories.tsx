import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Surfaces/Card',
  component: Card,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card style={{ padding: 16, maxWidth: 320 }}>
      <strong>Card title</strong>
      <p style={{ margin: '4px 0 0' }}>Supporting content inside the card.</p>
    </Card>
  ),
};

export const Outlined: Story = {
  render: () => (
    <Card elevation={0} style={{ padding: 16, maxWidth: 320 }}>
      Flat / outlined variant (elevation 0).
    </Card>
  ),
};
