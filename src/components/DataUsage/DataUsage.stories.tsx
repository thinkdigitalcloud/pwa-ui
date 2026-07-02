import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { DataUsage } from './DataUsage';

const CONTENT_HTML =
  '<p>This app collects and processes your personal information (contact details, address, vehicle details and access events) to provide estate access control and community services.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p><p>By accepting you consent to this processing. You may withdraw consent at any time, which will log you out of the app.</p>';

const meta: Meta<typeof DataUsage> = {
  title: 'Pages/DataUsage',
  component: DataUsage,
  parameters: { layout: 'fullscreen' },
  args: {
    open: true,
    heading: 'Data Use',
    content: CONTENT_HTML,
    warning: 'Please note: Declining will unfortunately result in you being logged out of the app.',
    acceptLabel: 'ACCEPT',
    declineLabel: 'DECLINE',
    onAccept: fn(),
    onDecline: fn(),
  },
};
export default meta;

type Story = StoryObj<typeof DataUsage>;

/** Default (balwin) accents — green Accept, red Decline. Switch the toolbar theme to preview others. */
export const Default: Story = {};

/** Custom brand accents passed in explicitly (independent of the active theme). */
export const CustomColors: Story = {
  args: {
    colors: { accept: '#2E7D32', decline: '#C00018' },
  },
};
