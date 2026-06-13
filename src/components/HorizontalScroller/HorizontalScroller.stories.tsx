import type { Meta, StoryObj } from '@storybook/react';
import { HorizontalScroller } from './HorizontalScroller';

const meta: Meta<typeof HorizontalScroller> = {
  title: 'Layout/HorizontalScroller',
  component: HorizontalScroller,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof HorizontalScroller>;

const Box = ({ i }: { i: number }) => (
  <div
    style={{
      width: 120,
      height: 80,
      borderRadius: 8,
      background: '#133C63',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    Tile {i}
  </div>
);

export const Default: Story = {
  render: () => (
    <HorizontalScroller>
      {Array.from({ length: 8 }, (_, i) => (
        <Box key={i} i={i + 1} />
      ))}
    </HorizontalScroller>
  ),
};
