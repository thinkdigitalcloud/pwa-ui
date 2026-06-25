import React from 'react';
import styled, { css, type DefaultTheme } from 'styled-components';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'outline'
  | 'ghost';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Convenience label; alternatively pass `children`. */
  text?: string;
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Stretch to fill the parent width. */
  block?: boolean;
  /** Fully rounded (pill) corners. */
  rounded?: boolean;
  /** Uppercase the label (default true — the estate apps' button style). */
  uppercase?: boolean;
  /** Show a spinner and disable interaction. */
  loading?: boolean;
  /** Icon rendered before the label. */
  leftIcon?: React.ReactNode;
  /** Icon rendered after the label. */
  rightIcon?: React.ReactNode;
}

function backgroundFor(theme: DefaultTheme, variant: ButtonVariant): string {
  switch (variant) {
    case 'secondary':
      return theme.colors.secondary;
    case 'success':
      return theme.colors.success;
    case 'danger':
      return theme.colors.danger;
    case 'outline':
    case 'ghost':
      return 'transparent';
    case 'primary':
    default:
      return theme.button.background;
  }
}

function foregroundFor(theme: DefaultTheme, variant: ButtonVariant): string {
  switch (variant) {
    case 'outline':
    case 'ghost':
      return theme.colors.primary;
    default:
      return theme.button.text;
  }
}

const sizeStyles: Record<ButtonSize, ReturnType<typeof css>> = {
  sm: css`
    min-height: 36px;
    padding: 6px 14px;
    font-size: 13px;
  `,
  md: css`
    min-height: 44px;
    padding: 10px 18px;
    font-size: 14px;
  `,
  lg: css`
    min-height: 54px;
    padding: 14px 22px;
    font-size: 16px;
  `,
};

const StyledButton = styled.button<{
  $variant: ButtonVariant;
  $size: ButtonSize;
  $block: boolean;
  $rounded: boolean;
  $uppercase: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: ${({ theme, $variant }) =>
    $variant === 'outline' ? `1px solid ${theme.colors.primary}` : 'none'};
  background-color: ${({ theme, $variant }) => backgroundFor(theme, $variant)};
  color: ${({ theme, $variant }) => foregroundFor(theme, $variant)};
  border-radius: ${({ theme, $rounded }) =>
    $rounded ? theme.radii.pill : theme.button.borderRadius};
  width: ${({ $block }) => ($block ? '100%' : 'auto')};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-weight: ${({ theme }) => theme.typography.weightLabel};
  text-transform: ${({ $uppercase }) => ($uppercase ? 'uppercase' : 'none')};
  letter-spacing: ${({ $uppercase }) => ($uppercase ? '0.02em' : 'normal')};
  cursor: pointer;
  transition: opacity 0.15s ease, transform 0.05s ease;
  ${({ $size }) => sizeStyles[$size]};

  &:active {
    transform: translateY(1px);
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.secondary};
    outline-offset: 2px;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Spinner = styled.span`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid currentColor;
  border-top-color: transparent;
  animation: pwa-btn-spin 0.7s linear infinite;
  @keyframes pwa-btn-spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

/**
 * Theme-aware button. Unifies the divergent per-app Button components
 * (anch/balwin/gocity/redefine) behind one variant/size API.
 */
export function Button({
  text,
  children,
  variant = 'primary',
  size = 'md',
  block = false,
  rounded = false,
  uppercase = true,
  loading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <StyledButton
      type="button"
      $variant={variant}
      $size={size}
      $block={block}
      $rounded={rounded}
      $uppercase={uppercase}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <Spinner aria-hidden />}
      {!loading && leftIcon}
      {children ?? text}
      {!loading && rightIcon}
    </StyledButton>
  );
}
