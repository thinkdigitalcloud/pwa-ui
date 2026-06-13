import React from 'react';
import type { Preview } from '@storybook/react';
import { ThemeProvider } from '../src/theme/ThemeProvider';
import { themes } from '../src/theme/themes';

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
  globalTypes: {
    theme: {
      description: 'Active app theme',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: Object.keys(themes).map((key) => ({ value: key, title: key })),
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const themeKey = (context.globals.theme as keyof typeof themes) || 'light';
      return (
        <ThemeProvider theme={themes[themeKey]}>
          <div style={{ width: 390, maxWidth: '100%' }}>
            <Story />
          </div>
        </ThemeProvider>
      );
    },
  ],
};

export default preview;
