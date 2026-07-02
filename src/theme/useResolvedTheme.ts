import { useTheme } from 'styled-components';
import { gocityTheme } from './themes';
import type { AppTheme } from './types';

/**
 * The active styled-components theme, falling back to the gocity theme when the
 * component is used without a ThemeProvider (or with a theme that lacks the
 * grouped `colors`). gocity is the library's primary default brand.
 */
export function useResolvedTheme(): AppTheme {
  const raw = useTheme() as Partial<AppTheme>;
  return raw && raw.colors ? (raw as AppTheme) : gocityTheme;
}
