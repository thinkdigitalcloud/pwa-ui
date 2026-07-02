import React, { createContext, useContext } from 'react';
import { ThemeProvider as SCThemeProvider } from 'styled-components';
import type { AppTheme } from './types';
import {
  anchTheme,
  balwinTheme,
  gocityAlphaTheme,
  goWaterfallTheme,
  redefineTheme,
  renpropTheme,
} from './themes';

/**
 * Estate brands the library is consumed by. Every component accepts an
 * optional `brand` prop (and reads the ambient one from `BrandProvider`), so
 * a component can render differently per brand where the designs diverge.
 */
export enum Brand {
  GoCityAlpha = 'gocityalpha',
  Balwin = 'balwin',
  GoWaterfall = 'gowaterfall',
  Anch = 'anch',
  Redefine = 'redefine',
  Renprop = 'renprop',
}

/** All brands, in a stable order — handy for Storybook controls and pickers. */
export const BRANDS: Brand[] = Object.values(Brand);

/** The theme each brand renders with. */
export const brandThemes: Record<Brand, AppTheme> = {
  [Brand.GoCityAlpha]: gocityAlphaTheme,
  [Brand.Balwin]: balwinTheme,
  [Brand.GoWaterfall]: goWaterfallTheme,
  [Brand.Anch]: anchTheme,
  [Brand.Redefine]: redefineTheme,
  [Brand.Renprop]: renpropTheme,
};

const BrandContext = createContext<Brand>(Brand.GoCityAlpha);

/**
 * The active brand — from the nearest `BrandProvider` or a component-level
 * `brand` prop. Defaults to GoCityAlpha, matching the library's default theme.
 * Use inside components to branch markup/behaviour per brand.
 */
export function useBrand(): Brand {
  return useContext(BrandContext);
}

export interface BrandProviderProps {
  brand: Brand;
  /** Override the brand's bundled theme (e.g. a CMS-built AppTheme). */
  theme?: AppTheme;
  children: React.ReactNode;
}

/**
 * App-level provider: sets the active brand and applies its theme via
 * styled-components. Wrap your app in this instead of `ThemeProvider` when
 * building one of the estate brands.
 */
export function BrandProvider({ brand, theme, children }: BrandProviderProps) {
  return (
    <BrandContext.Provider value={brand}>
      <SCThemeProvider theme={theme ?? brandThemes[brand]}>{children}</SCThemeProvider>
    </BrandContext.Provider>
  );
}

export interface BrandScopeProps {
  brand?: Brand;
  children: React.ReactNode;
}

/**
 * Backs each component's `brand` prop: when set, re-brands the subtree
 * (context + theme); when unset, renders children untouched so the ambient
 * `BrandProvider`/`ThemeProvider` stays in charge.
 */
export function BrandScope({ brand, children }: BrandScopeProps) {
  if (!brand) return <>{children}</>;
  return <BrandProvider brand={brand}>{children}</BrandProvider>;
}
