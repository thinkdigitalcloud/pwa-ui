import type { AppTheme } from './types';

const FONT_STACK =
  "'Gotham', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

/**
 * Builds an AppTheme from a small set of brand colours, filling in the shared
 * structural defaults that every estate app uses. This mirrors how the legacy
 * `mapThemeParams` collapsed a large CMS payload onto sensible fallbacks.
 */
function createTheme(
  name: string,
  brand: {
    primary: string;
    secondary: string;
    danger?: string;
    success?: string;
    warning?: string;
    headerBackground?: string;
    headerText?: string;
    bottomActive?: string;
    onlineGradient?: string[];
    offlineGradient?: string[];
  },
): AppTheme {
  const danger = brand.danger ?? '#D01E2D';
  const success = brand.success ?? '#4C8B2B';
  const warning = brand.warning ?? '#FBB019';

  return {
    name,
    colors: {
      primary: brand.primary,
      primaryDisabled: '#B8BBC0',
      secondary: brand.secondary,
      secondaryDisabled: '#58748C',
      background: '#FFFFFF',
      backgroundSecondary: '#F7F7F7',
      surface: '#FFFFFF',
      text: '#212121',
      textMuted: '#7B7B7B',
      textInverse: '#FFFFFF',
      lightGrey: '#EBECEE',
      grey: '#B8BBC0',
      darkGrey: '#414141',
      border: '#E0E0E0',
      success,
      danger,
      warning,
    },
    button: {
      background: brand.primary,
      text: '#FFFFFF',
      borderRadius: '8px',
    },
    header: {
      background: brand.headerBackground ?? '#FFFFFF',
      text: brand.headerText ?? '#212121',
      icon: brand.headerText ?? brand.primary,
    },
    bottomBar: {
      background: '#FFFFFF',
      active: brand.bottomActive ?? danger,
      inactive: '#9A9A9A',
      badge: danger,
      badgeText: '#FFFFFF',
      border: '#CFCFCF',
    },
    tile: {
      background: '#FFFFFF',
      heading: '#212121',
      description: '#7B7B7B',
      iconColor: '#FFFFFF',
      iconBackground: brand.secondary,
      shadow: 'rgba(102, 102, 102, 0.42) 0px 1px 7px -1px',
    },
    typography: {
      fontFamily: FONT_STACK,
      fontFamilyHeading: FONT_STACK,
      weightBody: 400,
      weightLabel: 600,
      weightBold: 700,
    },
    radii: {
      sm: '4px',
      md: '8px',
      lg: '16px',
      pill: '999px',
    },
    gradient: {
      online: brand.onlineGradient ?? [brand.secondary, brand.primary],
      offline: brand.offlineGradient ?? ['#E3E3E3', '#A19F9F'],
      angle: 120,
    },
    spacingUnit: 8,
  };
}

/** Neutral default — sensible blue/grey baseline. */
export const lightTheme = createTheme('light', {
  primary: '#133C63',
  secondary: '#1B578C',
  headerBackground: '#133C63',
  headerText: '#FFFFFF',
  bottomActive: '#133C63',
});

/** anch-pwa — warm taupe brand. */
export const anchTheme = createTheme('anch', {
  primary: '#7B7566',
  secondary: '#58748C',
  bottomActive: '#7B7566',
  onlineGradient: ['#7B7566', '#7B7566'],
});

/** balwin-app-pwa — navy + green/red accents. */
export const balwinTheme = createTheme('balwin', {
  primary: '#133C63',
  secondary: '#1B578C',
  success: '#4C8B2B',
  danger: '#D01E2D',
  headerBackground: '#4C8B2B',
  headerText: '#FFFFFF',
  bottomActive: '#D01E2D',
  onlineGradient: ['#275A89', '#133C63'],
});

/** gocity-app-pwa — blue civic brand. */
export const gocityTheme = createTheme('gocity', {
  primary: '#133C63',
  secondary: '#1B578C',
  headerBackground: '#133C63',
  headerText: '#FFFFFF',
  bottomActive: '#1B578C',
});

/** redefine-app-pwa — black + red brand. */
export const redefineTheme = createTheme('redefine', {
  primary: '#000000',
  secondary: '#414143',
  danger: '#D01E2D',
  headerBackground: '#FFFFFF',
  headerText: '#000000',
  bottomActive: '#C00018',
  onlineGradient: ['#000000', '#000000'],
});

export const themes = {
  light: lightTheme,
  anch: anchTheme,
  balwin: balwinTheme,
  gocity: gocityTheme,
  redefine: redefineTheme,
} as const;

export type ThemeName = keyof typeof themes;
