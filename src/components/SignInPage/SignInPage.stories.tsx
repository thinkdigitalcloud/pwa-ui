import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { SignInPage } from './SignInPage';

const frame = (Story: () => JSX.Element) => (
  <div style={{ width: '100%', height: 720, maxHeight: '92vh', overflow: 'hidden', boxShadow: '0 0 0 1px #e5e5e5' }}>
    <Story />
  </div>
);

const meta: Meta<typeof SignInPage> = {
  title: 'Auth/SignInPage',
  component: SignInPage,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => frame(Story)],
  args: {
    logo: 'https://picsum.photos/seed/logo/300/120',
    version: 'v2.0.1',
    onSubmit: fn(),
    onSignUp: fn(),
    onForgotPassword: fn(),
    onHelp: fn(),
  },
};
export default meta;

type Story = StoryObj<typeof SignInPage>;

export const Default: Story = {
  render: (args) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    return <SignInPage {...args} email={email} onEmailChange={setEmail} password={password} onPasswordChange={setPassword} />;
  },
};

export const WithError: Story = {
  ...Default,
  args: { error: 'Login failed. Please check your email and password.' },
};
