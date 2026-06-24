import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import {
  SwitchEstate,
  type SwitchEstateEstate,
  type SwitchEstateRole,
  type SwitchEstateSelection,
} from './SwitchEstate';

// Self-contained, transparent typographic logos (data-URI SVGs — no network,
// no background fill) so the story mirrors real estate-brand marks.
const logo = (
  name: string,
  opts: { sub?: string; color?: string; italic?: boolean; spacing?: number } = {},
) => {
  const { sub = '', color = '#222', italic = false, spacing = 4 } = opts;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="80">
    <text x="50%" y="${sub ? '44%' : '54%'}" text-anchor="middle" dominant-baseline="middle"
      font-family="Georgia, 'Times New Roman', serif" font-size="26"
      font-style="${italic ? 'italic' : 'normal'}" letter-spacing="${spacing}" fill="${color}">${name}</text>
    ${
      sub
        ? `<text x="50%" y="74%" text-anchor="middle" dominant-baseline="middle"
        font-family="Georgia, serif" font-size="9" letter-spacing="2" fill="#999">${sub}</text>`
        : ''
    }
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const estates: SwitchEstateEstate[] = [
  { id: 1, name: 'Balboa Head Office', imageUrl: logo('Balboa', { sub: 'HEAD OFFICE JHB', color: '#C0202E', italic: true }) },
  { id: 2, name: 'Balboa Park', imageUrl: logo('BALBOA PARK', { sub: 'OAKDENE PARK DRIVE', spacing: 5 }) },
  { id: 3, name: 'Ballito Hills', imageUrl: logo('BALLITO HILLS', { spacing: 4 }) },
  { id: 4, name: 'De Aan-Zicht', imageUrl: logo('DE AAN-ZICHT', { sub: 'CAPE TOWN', spacing: 5 }) },
  { id: 5, name: 'De Kuile', imageUrl: logo('De Kuile', { sub: 'ZEVENWACHT · CAPE TOWN', italic: true }) },
  { id: 6, name: 'Hilltop Manor' }, // no image -> building fallback
];

const roles: SwitchEstateRole[] = [
  { estateName: 'Balboa Head Office', roleName: 'admin', roleDisplayName: 'Administrator' },
  { estateName: 'Balboa Park', roleName: 'owner', roleDisplayName: 'Owner' },
  { estateName: 'Balboa Park', roleName: 'tenant', roleDisplayName: 'Tenant' },
  { estateName: 'Ballito Hills', roleName: 'owner', roleDisplayName: 'Owner' },
  { estateName: 'De Aan-Zicht', roleName: 'owner', roleDisplayName: 'Owner' },
  { estateName: 'De Kuile', roleName: 'owner', roleDisplayName: 'Owner' },
  { estateName: 'Hilltop Manor', roleName: 'guard', roleDisplayName: 'Security' },
];

const meta: Meta<typeof SwitchEstate> = {
  title: 'Pages/SwitchEstate',
  component: SwitchEstate,
  parameters: { layout: 'fullscreen' },
  args: {
    estates,
    roles,
    currentEstateName: 'Ballito Hills',
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
