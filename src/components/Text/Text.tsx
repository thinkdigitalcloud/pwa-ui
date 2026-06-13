import React from 'react';
import styled, { css } from 'styled-components';

export type TextVariant =
  | 'body'
  | 'bodyBold'
  | 'label'
  | 'small'
  | 'heading'
  | 'title';

export interface TextProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  /** Typographic role. */
  variant?: TextVariant;
  /** Override colour; defaults to the theme's body text colour. */
  color?: string;
  /** Render as a different element (e.g. `p`, `h1`, `label`). */
  as?: keyof JSX.IntrinsicElements;
  children?: React.ReactNode;
}

const variantStyles: Record<TextVariant, ReturnType<typeof css>> = {
  body: css`
    font-size: 14px;
    line-height: 20px;
    font-weight: ${({ theme }) => theme.typography.weightBody};
  `,
  bodyBold: css`
    font-size: 14px;
    line-height: 20px;
    font-weight: ${({ theme }) => theme.typography.weightBold};
  `,
  label: css`
    font-size: 13px;
    line-height: 18px;
    font-weight: ${({ theme }) => theme.typography.weightLabel};
  `,
  small: css`
    font-size: 11px;
    line-height: 16px;
    font-weight: ${({ theme }) => theme.typography.weightBody};
  `,
  heading: css`
    font-size: 18px;
    line-height: 24px;
    font-weight: ${({ theme }) => theme.typography.weightBold};
    font-family: ${({ theme }) => theme.typography.fontFamilyHeading};
  `,
  title: css`
    font-size: 22px;
    line-height: 30px;
    font-weight: ${({ theme }) => theme.typography.weightBold};
    font-family: ${({ theme }) => theme.typography.fontFamilyHeading};
  `,
};

const StyledText = styled.span<{ $variant: TextVariant; $color?: string }>`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  color: ${({ $color, theme }) => $color ?? theme.colors.text};
  ${({ $variant }) => variantStyles[$variant]};
`;

/** Typed typography primitive — the single source of truth for text styling. */
export function Text({
  variant = 'body',
  color,
  as,
  children,
  ...rest
}: TextProps) {
  return (
    <StyledText as={as} $variant={variant} $color={color} {...rest}>
      {children}
    </StyledText>
  );
}
