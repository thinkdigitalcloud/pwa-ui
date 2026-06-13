/**
 * Theme contract shared by every TDD PWA estate app.
 *
 * The legacy apps stored a flat-ish theme object in Redux (`store.theme.data`)
 * with ~180 loosely-typed keys. This library distils that into a strongly typed,
 * grouped contract consumed via styled-components' ThemeProvider.
 */

export interface ThemeGradient {
  /** Colour stops used when the app/feature is "online" / enabled. */
  online: string[];
  /** Colour stops used when the app/feature is "offline" / disabled. */
  offline: string[];
  /** Gradient angle in degrees. */
  angle: number;
}

export interface ThemeColors {
  primary: string;
  primaryDisabled: string;
  secondary: string;
  secondaryDisabled: string;

  /** Page background. */
  background: string;
  /** Slightly recessed surface (cards on top of background). */
  backgroundSecondary: string;
  /** Surface colour for raised elements (tiles, cards, modals). */
  surface: string;

  /** Default body text colour. */
  text: string;
  /** Muted / secondary text. */
  textMuted: string;
  /** Text rendered on top of primary/dark surfaces. */
  textInverse: string;

  lightGrey: string;
  grey: string;
  darkGrey: string;
  border: string;

  success: string;
  danger: string;
  warning: string;
}

export interface ThemeButton {
  background: string;
  text: string;
  borderRadius: string;
}

export interface ThemeHeader {
  background: string;
  text: string;
  icon: string;
}

export interface ThemeBottomBar {
  background: string;
  active: string;
  inactive: string;
  badge: string;
  badgeText: string;
  border: string;
}

export interface ThemeTile {
  background: string;
  heading: string;
  description: string;
  iconColor: string;
  iconBackground: string;
  shadow: string;
}

export interface ThemeTypography {
  fontFamily: string;
  fontFamilyHeading: string;
  weightBody: number;
  weightLabel: number;
  weightBold: number;
}

export interface ThemeRadii {
  sm: string;
  md: string;
  lg: string;
  pill: string;
}

export interface AppTheme {
  /** Machine name, e.g. "balwin". */
  name: string;
  colors: ThemeColors;
  button: ThemeButton;
  header: ThemeHeader;
  bottomBar: ThemeBottomBar;
  tile: ThemeTile;
  typography: ThemeTypography;
  radii: ThemeRadii;
  gradient: ThemeGradient;
  /** Base spacing unit in px; multiply for consistent rhythm. */
  spacingUnit: number;
}
