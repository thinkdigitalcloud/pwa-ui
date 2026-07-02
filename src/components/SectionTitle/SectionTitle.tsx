import React from 'react';
import styled from 'styled-components';
import { Brand, BrandScope } from '../../theme/brands';

export interface SectionTitleProps {
  /** Title text (alternatively pass `children`). */
  text?: string;
  children?: React.ReactNode;
  /** Text colour; defaults to a muted grey (the apps' `#b7bbbf`). */
  color?: string;
  align?: 'left' | 'center' | 'right';
  /** Render with a specific brand's theme, overriding the ambient BrandProvider. */
  brand?: Brand;
}

const Container = styled.div<{ $align: 'left' | 'center' | 'right' }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ $align }) =>
    $align === 'center' ? 'center' : `flex-${$align === 'right' ? 'end' : 'start'}`};
  justify-content: center;
  width: 100%;
`;

const Label = styled.span<{ $color: string; $align: 'left' | 'center' | 'right' }>`
  /* Responsive size matching the apps' SecondaryTitle. */
  font-size: min(max(15px, 4vw), 18px);
  font-weight: 700;
  text-align: ${({ $align }) => $align};
  margin: 5%;
  color: ${({ $color }) => $color};
  font-family: ${({ theme }) => theme.typography.fontFamilyHeading};
`;

function SectionTitleContent({
  text,
  children,
  color = '#b7bbbf',
  align = 'center',
}: SectionTitleProps) {
  return (
    <Container $align={align}>
      <Label $color={color} $align={align}>
        {children ?? text}
      </Label>
    </Container>
  );
}

/** Centred, muted section heading — balwin's `SecondaryTitle`. */
export function SectionTitle({ brand, ...props }: SectionTitleProps) {
  return (
    <BrandScope brand={brand}>
      <SectionTitleContent {...props} />
    </BrandScope>
  );
}
