import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { CreditCard } from './CreditCard';

const meta: Meta<typeof CreditCard> = {
  title: 'Cards/CreditCard',
  component: CreditCard,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    number: '4111111111111111',
    name: 'G Gumburashvili',
    expiry: '12/28',
    cvc: '123',
    onBrandChange: fn(),
  },
};
export default meta;

type Story = StoryObj<typeof CreditCard>;

/** Visa (detected from the leading 4). */
export const Visa: Story = {};

/** Mastercard, mid-entry with the number field focused. */
export const Mastercard: Story = {
  args: { number: '5500005555', focused: 'number' },
};

/** Amex uses 4-6-5 grouping and a 15-digit layout. */
export const Amex: Story = {
  args: { number: '378282246310005' },
};

/** Focusing the CVC flips the card to the back face. */
export const BackFace: Story = {
  args: { focused: 'cvc' },
};

/** Empty state with masked placeholders. */
export const Empty: Story = {
  args: { number: '', name: '', expiry: '', cvc: '' },
};
