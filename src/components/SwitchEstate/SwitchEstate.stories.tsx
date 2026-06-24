import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import {
  SwitchEstate,
  type SwitchEstateEstate,
  type SwitchEstateRole,
  type SwitchEstateSelection,
} from './SwitchEstate';

// Self-contained logo placeholders (data-URI SVGs — no network needed).
const logo = (label: string, bg: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="195" height="80"><rect width="195" height="80" rx="8" fill="${bg}"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="20" fill="#fff">${label}</text></svg>`,
  )}`;

const estates: SwitchEstateEstate[] = [
  { id: 1, name: 'Oakwood Estate', imageUrl: logo('Oakwood', '#1B578C') },
  { id: 2, name: 'Riverside Park', imageUrl: logo('Riverside', '#4C8B2B') },
  { id: 3, name: 'Hilltop Manor' }, // no image -> building fallback
];

const roles: SwitchEstateRole[] = [
  { estateName: 'Oakwood Estate', roleName: 'owner', roleDisplayName: 'Owner' },
  { estateName: 'Oakwood Estate', roleName: 'tenant', roleDisplayName: 'Tenant' },
  { estateName: 'Riverside Park', roleName: 'owner', roleDisplayName: 'Owner' },
  { estateName: 'Hilltop Manor', roleName: 'guard', roleDisplayName: 'Security' },
];

const meta: Meta<typeof SwitchEstate> = {
  title: 'Pages/SwitchEstate',
  component: SwitchEstate,
  parameters: { layout: 'fullscreen' },
  args: {
    estates,
    roles,
    currentEstateName: 'Oakwood Estate',
    currentRoleName: 'Owner',
    onSwitch: fn(),
  },
};
export default meta;

type Story = StoryObj<typeof SwitchEstate>;

export const Default: Story = {};

export const Loading: Story = { args: { loading: true } };

export const CustomLabels: Story = {
  args: {
    title: 'Switch Property',
    subtitle: 'Choose a property to manage',
    roleSheetTitle: 'Pick your role',
    cancelLabel: 'Dismiss',
  },
};

/** Interactive: selecting a role updates the active estate/role and logs it. */
export const Interactive: Story = {
  render: (args) => {
    const [estateName, setEstateName] = useState(args.currentEstateName);
    const [roleName, setRoleName] = useState(args.currentRoleName);
    return (
      <SwitchEstate
        {...args}
        currentEstateName={estateName}
        currentRoleName={roleName}
        onSwitch={(sel: SwitchEstateSelection) => {
          setEstateName(sel.estate.name);
          setRoleName(sel.role.roleDisplayName);
          args.onSwitch?.(sel);
        }}
      />
    );
  },
};
