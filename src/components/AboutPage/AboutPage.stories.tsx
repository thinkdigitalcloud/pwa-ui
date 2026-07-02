import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { AboutPage } from './AboutPage';

const frame = (Story: () => JSX.Element) => (
  <div style={{ width: '100%', height: 640, maxHeight: '92vh', overflow: 'hidden', boxShadow: '0 0 0 1px #e5e5e5' }}>
    <Story />
  </div>
);

const meta: Meta<typeof AboutPage> = {
  title: 'Pages/AboutPage',
  component: AboutPage,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => frame(Story)],
  args: { onBack: fn() },
};
export default meta;

type Story = StoryObj<typeof AboutPage>;

/** Minimal — a single App Version row (the apps' actual About screen). */
export const Minimal: Story = {
  args: {
    rows: [{ label: 'App Version', value: '2.0.1' }],
  },
};

/** Richer About with logo, description, info rows and legal links. */
export const Rich: Story = {
  args: {
    appName: 'GoCity',
    description: 'Estate access control and community services.',
    logo: 'https://picsum.photos/seed/logo/200/200',
    rows: [
      { label: 'App Version', value: '2.0.1' },
      { label: 'Build', value: '2026.07.02' },
    ],
    links: [
      { label: 'Terms & Conditions', onClick: fn() },
      { label: 'Privacy Policy', onClick: fn() },
      { label: 'Visit our website', onClick: fn() },
    ],
  },
};
