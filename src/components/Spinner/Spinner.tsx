import styled from 'styled-components';
import { Text } from '../Text';

export interface SpinnerProps {
  /** Diameter in px. */
  size?: number;
  /** Ring colour; defaults to the theme primary. */
  color?: string;
  /** Optional caption beneath the spinner. */
  text?: string;
  /** Cover the whole parent with a centred overlay (the apps' `Loading`). */
  fullscreen?: boolean;
}

const Ring = styled.span<{ $size: number; $color?: string }>`
  display: inline-block;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 50%;
  border: ${({ $size }) => Math.max(2, Math.round($size / 10))}px solid
    ${({ theme, $color }) => $color ?? theme.colors.primary};
  border-top-color: transparent;
  animation: pwa-spin 0.7s linear infinite;
  @keyframes pwa-spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Centered = styled.div<{ $fullscreen: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  ${({ $fullscreen, theme }) =>
    $fullscreen
      ? `position: absolute; inset: 0; background: ${theme.colors.background}; z-index: 1;`
      : ''}
`;

/**
 * Loading spinner. Replaces the per-app `react-spinners/ClipLoader`-based
 * `Loading` component with a dependency-free CSS spinner.
 */
export function Spinner({ size = 30, color, text, fullscreen = false }: SpinnerProps) {
  return (
    <Centered $fullscreen={fullscreen} role="status" aria-live="polite">
      <Ring $size={size} $color={color} aria-hidden />
      {text && (
        <Text variant="bodyBold" color={color}>
          {text}
        </Text>
      )}
    </Centered>
  );
}
