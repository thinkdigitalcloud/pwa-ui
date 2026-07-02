import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { AppIntro } from './AppIntro';

const frame = (Story: () => JSX.Element) => (
  <div style={{ width: '100%', height: 760, maxHeight: '92vh', overflow: 'hidden', boxShadow: '0 0 0 1px #e5e5e5' }}>
    <Story />
  </div>
);

const POLICY_HTML =
  '<p>These Terms &amp; Conditions govern your use of the app. By continuing you agree to abide by the estate rules and the access-control policy.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>';
const PRIVACY_HTML =
  '<p>We process your personal information to provide access control and community services. Your data is stored securely and never sold.</p><p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>';

const estates = [
  { estateName: 'Fort Isabella', suburb: 'La Montagne', city: 'Pretoria', code: '0184' },
  { estateName: 'The Whisken', suburb: 'Kyalami', city: 'Midrand', code: '1684' },
  { estateName: 'Ballito Hills', suburb: 'Ballito', city: 'KwaDukuza', code: '4420' },
];

const meta: Meta<typeof AppIntro> = {
  title: 'Pages/AppIntro',
  component: AppIntro,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => frame(Story)],
  args: {
    estates,
    policyConfig: {
      termsHeading: 'TERMS & CONDITIONS',
      termsContent: POLICY_HTML,
      privacyHeading: 'PRIVACY POLICY',
      privacyContent: PRIVACY_HTML,
      acceptButtonText: 'Accept Terms & Conditions and Privacy Policy',
    },
    vehicleImage: 'https://picsum.photos/seed/car/320/320',
    noVehicleImage: 'https://picsum.photos/seed/warning/320/320',
    onComplete: fn(),
  },
};
export default meta;

type Story = StoryObj<typeof AppIntro>;

/** Full wizard on the default (balwin) theme — switch the toolbar theme to preview others. */
export const Default: Story = {};

/** Seeded from an existing registration / profile. */
export const Prefilled: Story = {
  args: {
    initialInformation: { firstName: 'Giorgi', lastName: 'Gumburashvili', idNumber: '9001015800080' },
    initialContacts: { cell: '+27821234567' },
    initialAddress: { addressType: 'Residential', context: 'Fort Isabella', suburbName: 'La Montagne', localityOrCity: 'Pretoria', addressPostalCode: '0184' },
    initialAcceptedPolicy: false,
  },
};

/** Custom brand accents passed in explicitly (independent of the active theme). */
export const CustomColors: Story = {
  args: {
    colors: { accent: '#C00018', success: '#2E7D32', activeDot: '#C00018' },
  },
};
