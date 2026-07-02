import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { SignUpPage, type SignUpValues } from './SignUpPage';

const frame = (Story: () => JSX.Element) => (
  <div style={{ width: '100%', height: 780, maxHeight: '92vh', overflow: 'hidden', boxShadow: '0 0 0 1px #e5e5e5' }}>
    <Story />
  </div>
);

const EMPTY: SignUpValues = {
  firstName: '',
  lastName: '',
  mobileNumber: '',
  email: '',
  userType: '',
  estate: '',
  password: '',
  confirmPassword: '',
};

const meta: Meta<typeof SignUpPage> = {
  title: 'Auth/SignUpPage',
  component: SignUpPage,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => frame(Story)],
  args: {
    estateOptions: ['Fort Isabella', 'The Whisken', 'Ballito Hills'],
    onSubmit: fn(),
    onBack: fn(),
    onViewTerms: fn(),
    onViewPrivacy: fn(),
  },
};
export default meta;

type Story = StoryObj<typeof SignUpPage>;

export const Default: Story = {
  render: (args) => {
    const [values, setValues] = useState<SignUpValues>(EMPTY);
    const [privacy, setPrivacy] = useState(false);
    return (
      <SignUpPage
        {...args}
        values={values}
        onChange={(field, value) => setValues((v) => ({ ...v, [field]: value }))}
        privacyAccepted={privacy}
        onPrivacyToggle={setPrivacy}
      />
    );
  },
};

/** Select "Residential" as the user type to reveal the Estate picker. */
export const WithErrors: Story = {
  ...Default,
  args: {
    errors: {
      firstName: 'Please enter your name',
      email: 'Please enter a valid email address',
      password: 'Password must be at least 7 characters',
      privacy: 'You must accept the terms to continue',
    },
  },
};
