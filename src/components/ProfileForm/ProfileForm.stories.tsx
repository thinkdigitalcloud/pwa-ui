import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { PiBroadcast, PiLock, PiHouseSimple, PiUser, PiEnvelope } from 'react-icons/pi';
import { ProfileForm, type ProfileFormFieldDef } from './ProfileForm';

const bottomNav = {
  active: 'profile',
  onSelect: () => {},
  items: [
    { key: 'emergency', icon: <PiBroadcast size={22} /> },
    { key: 'access', icon: <PiLock size={22} /> },
    { key: 'home', icon: <PiHouseSimple size={22} /> },
    { key: 'profile', icon: <PiUser size={22} /> },
    { key: 'notifications', icon: <PiEnvelope size={22} />, badge: 38 },
  ],
};

const frame = (Story: () => JSX.Element) => (
  <div style={{ width: '100%', height: 760, maxHeight: '92vh', overflow: 'hidden', boxShadow: '0 0 0 1px #e5e5e5' }}>
    <Story />
  </div>
);

const addressFields: ProfileFormFieldDef[] = [
  { type: 'select', key: 'addressType', label: 'Address Type', options: ['Residential', 'Work'], selectTitle: 'Select Address Type' },
  { type: 'text', key: 'standNo', label: 'Stand No' },
  { type: 'select', key: 'estate', label: 'Estate', options: ['Ballito Hills', 'Balboa Park', 'De Kuile'], selectTitle: 'Select an Estate' },
  { type: 'text', key: 'streetNoOrUnitNo', label: 'Unit/Street No' },
  { type: 'text', key: 'streetName', label: 'Street Name' },
  { type: 'text', key: 'suburbName', label: 'Suburb' },
  { type: 'text', key: 'localityOrCity', label: 'City' },
  { type: 'text', key: 'addressPostalCode', label: 'Code' },
];

const vehicleFields: ProfileFormFieldDef[] = [
  { type: 'text', key: 'make', label: 'Make' },
  { type: 'text', key: 'model', label: 'Model' },
  { type: 'text', key: 'colour', label: 'Colour' },
  { type: 'text', key: 'registrationNumber', label: 'Registration Number' },
];

const meta: Meta<typeof ProfileForm> = {
  title: 'Pages/ProfileForm',
  component: ProfileForm,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => frame(Story)],
  args: { onChange: fn(), onSave: fn(), bottomNav },
};
export default meta;

type Story = StoryObj<typeof ProfileForm>;

const Demo = (args: React.ComponentProps<typeof ProfileForm>) => {
  const [values, setValues] = useState<Record<string, string>>(args.values || {});
  return (
    <ProfileForm
      {...args}
      values={values}
      onChange={(k, v) => {
        setValues((p) => ({ ...p, [k]: v }));
        args.onChange?.(k, v);
      }}
    />
  );
};

/** Add Address — text + modal-select fields. Same component covers Edit. */
export const AddAddress: Story = {
  render: (args) => <Demo {...args} />,
  args: { title: 'Add Address', saveLabel: 'Save address', fields: addressFields, values: { addressType: 'Residential' } },
};

/** Add Vehicle — different field schema, same component. */
export const AddVehicle: Story = {
  render: (args) => <Demo {...args} />,
  args: { title: 'Add Vehicle', saveLabel: 'Save vehicle', fields: vehicleFields, values: {} },
};

/** Edit prefills values. */
export const EditAddress: Story = {
  render: (args) => <Demo {...args} />,
  args: {
    title: 'Edit Address',
    saveLabel: 'Update address',
    fields: addressFields,
    values: { addressType: 'Work', standNo: '12', estate: 'Ballito Hills', streetName: 'Main Rd', suburbName: 'Umhlanga', localityOrCity: 'Durban', addressPostalCode: '4319' },
  },
};

export const Loading: Story = {
  render: (args) => <Demo {...args} />,
  args: { title: 'Add Address', fields: addressFields, values: {}, loading: true },
};
