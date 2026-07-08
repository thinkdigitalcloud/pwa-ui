import React from 'react';
import styled from 'styled-components';
import { Brand, BrandScope } from '../../theme/brands';

/**
 * Per-slot style overrides, mirroring the API of the (unmaintained)
 * `react-sidebar` package this component replaces so host apps can migrate with
 * a bare import swap.
 */
export interface SidebarStyles {
  /** The outer wrapper that holds the content + overlay + panel. */
  root?: React.CSSProperties;
  /** The main app content rendered beneath the drawer. */
  content?: React.CSSProperties;
  /** The dimmed backdrop shown while the drawer is open. */
  overlay?: React.CSSProperties;
  /** The sliding drawer panel itself (width, background, z-index, …). */
  sidebar?: React.CSSProperties;
}

export interface SidebarProps {
  /** Whether the drawer is shown. */
  open: boolean;
  /** The drawer panel content. */
  sidebar: React.ReactNode;
  /** Called with `false` when the backdrop is tapped (request to close). */
  onSetOpen?: (open: boolean) => void;
  /** Slide the drawer in from the right instead of the left. */
  pullRight?: boolean;
  /** Per-slot style overrides. */
  styles?: SidebarStyles;
  /** Main app content rendered beneath the drawer. */
  children?: React.ReactNode;
  /** Render with a specific brand's theme, overriding the ambient BrandProvider. */
  brand?: Brand;
}

const Root = styled.div``;

const Overlay = styled.div<{ $open: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  visibility: ${({ $open }) => ($open ? 'visible' : 'hidden')};
  transition: opacity 0.3s ease, visibility 0.3s ease;
`;

const Panel = styled.div<{ $open: boolean; $pullRight: boolean }>`
  position: fixed;
  top: 0;
  bottom: 0;
  ${({ $pullRight }) => ($pullRight ? 'right: 0;' : 'left: 0;')}
  overflow-y: auto;
  background: ${({ theme }) => theme.colors.surface};
  transform: ${({ $open, $pullRight }) =>
    $open
      ? 'translateX(0)'
      : `translateX(${$pullRight ? '100%' : '-100%'})`};
  transition: transform 0.3s ease;
  will-change: transform;
`;

function SidebarContent({
  open,
  sidebar,
  onSetOpen,
  pullRight = false,
  styles = {},
  children,
}: SidebarProps) {
  return (
    <Root style={styles.root}>
      <div style={styles.content}>{children}</div>

      <Overlay
        $open={open}
        role="presentation"
        onClick={() => onSetOpen && onSetOpen(false)}
        style={styles.overlay}
      />

      <Panel $open={open} $pullRight={pullRight} style={styles.sidebar}>
        {sidebar}
      </Panel>
    </Root>
  );
}

/**
 * Sliding drawer with a dimmed, tap-to-close backdrop. A dependency-free,
 * theme-aware replacement for `react-sidebar`, keeping the same prop surface
 * (`open` / `sidebar` / `onSetOpen` / `styles`) for drop-in migration.
 */
export function Sidebar({ brand, ...props }: SidebarProps) {
  return (
    <BrandScope brand={brand}>
      <SidebarContent {...props} />
    </BrandScope>
  );
}
