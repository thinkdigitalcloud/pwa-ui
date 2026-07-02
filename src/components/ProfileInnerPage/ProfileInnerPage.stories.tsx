import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ProfileInnerPage } from './ProfileInnerPage';
import { FormField } from '../FormField';
import { Button } from '../Button';
import { ListRow } from '../ListRow';

const frame = (Story: () => JSX.Element) => (
  <div style={{ width: '100%', height: 700, maxHeight: '92vh', overflow: 'hidden', boxShadow: '0 0 0 1px #e5e5e5' }}>
    <Story />
  </div>
);

const meta: Meta<typeof ProfileInnerPage> = {
  title: 'Pages/ProfileInnerPage',
  component: ProfileInnerPage,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => frame(Story)],
  args: { onBack: fn() },
};
export default meta;

type Story = StoryObj<typeof ProfileInnerPage>;

/** Form page — the submit lives in the header (green tick). */
export const FormPage: Story = {
  args: {
    title: 'Add Address',
    onSave: fn(),
    children: (
      <>
        <FormField label="Unit / Street No"><input /></FormField>
        <FormField label="Street Name"><input /></FormField>
        <FormField label="Suburb"><input /></FormField>
        <FormField label="City"><input /></FormField>
      </>
    ),
  },
};

/** Hub/list page — a menu with the primary action in the sticky footer. */
export const ListPage: Story = {
  args: {
    title: 'Personal Information',
    onRemove: fn(),
    children: (
      <>
        <ListRow title="Addresses" hasArrow onClick={fn()} />
        <ListRow title="Contacts" hasArrow onClick={fn()} />
        <ListRow title="Vehicles" hasArrow onClick={fn()} />
      </>
    ),
    footer: <Button text="Delete Account" block variant="danger" uppercase={false} onClick={fn()} />,
  },
};

/** Loading overlay. */
export const Loading: Story = {
  args: { title: 'Vehicles', loading: true, children: null },
};
