import type { Meta, StoryObj } from '@storybook/react';
import { Text } from './Text';

const meta: Meta<typeof Text> = {
  title: 'Primitives/Text',
  component: Text,
  tags: ['autodocs'],
  args: {
    children: 'The quick brown fox',
    variant: 'body',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['body', 'bodyBold', 'label', 'small', 'heading', 'title'],
    },
    color: { control: 'color' },
  },
};
export default meta;

type Story = StoryObj<typeof Text>;

export const Body: Story = {};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Text variant="title">Title — 22/30</Text>
      <Text variant="heading">Heading — 18/24</Text>
      <Text variant="label">Label — 13/18</Text>
      <Text variant="body">Body — 14/20</Text>
      <Text variant="bodyBold">Body bold — 14/20</Text>
      <Text variant="small">Small — 11/16</Text>
    </div>
  ),
};
