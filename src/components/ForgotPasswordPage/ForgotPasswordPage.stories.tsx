import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ForgotPasswordPage } from './ForgotPasswordPage';

const frame = (Story: () => JSX.Element) => (
  <div style={{ width: '100%', height: 640, maxHeight: '92vh', overflow: 'hidden', boxShadow: '0 0 0 1px #e5e5e5' }}>
    <Story />
  </div>
);

const meta: Meta<typeof ForgotPasswordPage> = {
  title: 'Auth/ForgotPasswordPage',
  component: ForgotPasswordPage,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => frame(Story)],
  args: { onSubmit: fn(), onBack: fn() },
};
export default meta;

type Story = StoryObj<typeof ForgotPasswordPage>;

export const Default: Story = {
  render: (args) => {
    const [email, setEmail] = useState('');
    return <ForgotPasswordPage {...args} email={email} onEmailChange={setEmail} />;
  },
};

export const WithError: Story = {
  ...Default,
  args: { error: 'Please enter a valid email address' },
};
