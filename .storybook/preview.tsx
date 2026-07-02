import React from 'react';
import type { Preview } from '@storybook/react';
import { BrandProvider, Brand, BRANDS } from '../src/theme/brands';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
  },
  // Every component accepts `brand`; give all stories a proper select control
  // so each component page can preview any brand.
  argTypes: {
    brand: {
      control: 'select',
      options: BRANDS,
      description: "Render with a specific brand's theme (overrides the toolbar brand)",
      table: { category: 'branding' },
    },
  },
  globalTypes: {
    brand: {
      description: 'Active brand',
      defaultValue: Brand.GoCityAlpha,
      toolbar: {
        title: 'Brand',
        icon: 'paintbrush',
        items: BRANDS.map((brand) => ({ value: brand, title: brand })),
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const brand = (context.globals.brand as Brand) || Brand.GoCityAlpha;
      // Full-page stories (layout: 'fullscreen') span the full width; component
      // stories sit in a 390px phone-width frame.
      const fullscreen = context.parameters?.layout === 'fullscreen';
      return (
        <BrandProvider brand={brand}>
          <div style={fullscreen ? { width: '100%' } : { width: 390, maxWidth: '100%' }}>
            <Story />
          </div>
        </BrandProvider>
      );
    },
  ],
};

export default preview;
