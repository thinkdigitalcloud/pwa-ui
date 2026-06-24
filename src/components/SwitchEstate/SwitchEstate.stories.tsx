import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import {
  SwitchEstate,
  type SwitchEstateEstate,
  type SwitchEstateRole,
  type SwitchEstateSelection,
} from './SwitchEstate';

// Self-contained, transparent, centred text logo (data-URI SVG — no network,
// no background fill). Used for a few estates so the others exercise the
// building-icon fallback.
const logo = (name: string, color = '#222') => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="80">
    <text x="50%" y="50%" text-anchor="middle" dominant-baseline="central"
      font-family="Georgia, 'Times New Roman', serif" font-size="24"
      letter-spacing="3" fill="${color}">${name}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const estates: SwitchEstateEstate[] = [
  { id: 1, name: 'Test Estate One', imageUrl: logo('TEST ESTATE ONE', '#C0202E') },
  { id: 2, name: 'Test Estate Two', imageUrl: logo('TEST ESTATE TWO') },
  { id: 3, name: 'Test Estate Three' }, // no logo -> building fallback
  { id: 4, name: 'Test Estate Four', imageUrl: logo('TEST ESTATE FOUR', '#1B578C') },
  { id: 5, name: 'Test Estate Five' }, // no logo -> building fallback
];

const roles: SwitchEstateRole[] = [
  { estateName: 'Test Estate One', roleName: 'admin', roleDisplayName: 'Administrator' },
  { estateName: 'Test Estate Two', roleName: 'owner', roleDisplayName: 'Owner' },
  { estateName: 'Test Estate Two', roleName: 'tenant', roleDisplayName: 'Tenant' },
  { estateName: 'Test Estate Three', roleName: 'owner', roleDisplayName: 'Owner' },
  { estateName: 'Test Estate Four', roleName: 'owner', roleDisplayName: 'Owner' },
  { estateName: 'Test Estate Five', roleName: 'guard', roleDisplayName: 'Security' },
];

const meta: Meta<typeof SwitchEstate> = {
  title: 'Pages/SwitchEstate',
  component: SwitchEstate,
  parameters: { layout: 'fullscreen' },
  args: {
    estates,
    roles,
    currentEstateName: 'Test Estate Two',
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
