import React from 'react';
import styled from 'styled-components';

export interface CardProps {
  children?: React.ReactNode;
  /** Shadow depth. `0` renders a flat, outlined card; `>0` a raised card
   * (MUI-like default elevation). */
  elevation?: number;
  onClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Generic surface container — the framework-agnostic replacement for MUI's
 * `<Card>`. A plain rounded box on `theme.colors.surface`; forwards `className`
 * so it composes with `styled(Card)` for per-call-site layout.
 */
const Surface = styled.div<{ $elevation: number; $clickable: boolean }>`
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  border-radius: ${({ theme }) => theme.radii.md};
  border: ${({ $elevation, theme }) =>
    $elevation <= 0 ? `1px solid ${theme.colors.border}` : 'none'};
  box-shadow: ${({ $elevation }) =>
    $elevation <= 0
      ? 'none'
      : '0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 3px 0 rgba(0, 0, 0, 0.12)'};
  overflow: hidden;
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
`;

export function Card({
  children,
  elevation = 1,
  onClick,
  style,
  className,
}: CardProps) {
  return (
    <Surface
      $elevation={elevation}
      $clickable={!!onClick}
      onClick={onClick}
      style={style}
      className={className}
    >
      {children}
    </Surface>
  );
}
