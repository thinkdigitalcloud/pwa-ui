import React from 'react';
import { ThemeProvider as SCThemeProvider } from 'styled-components';
import type { AppTheme } from './types';
import { lightTheme } from './themes';

export interface ThemeProviderProps {
  /** Theme object to apply. Defaults to the neutral light theme. */
  theme?: AppTheme;
  children: React.ReactNode;
}

/**
 * Drop-in provider wrapping styled-components' ThemeProvider with the library's
 * default theme. Replaces the legacy Redux `store.theme.data` plumbing.
 */
export function ThemeProvider({ theme = lightTheme, children }: ThemeProviderProps) {
  return <SCThemeProvider theme={theme}>{children}</SCThemeProvider>;
}
