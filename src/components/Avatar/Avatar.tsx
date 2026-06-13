import { useState } from 'react';
import styled from 'styled-components';

export interface AvatarProps {
  /** Image URL; falls back to initials if absent or it fails to load. */
  src?: string;
  /** Name used to derive initials and the alt text. */
  name?: string;
  /** Edge length in px. */
  size?: number;
  /** Circular (default) vs rounded square. */
  round?: boolean;
  borderColor?: string;
  backgroundColor?: string;
}

function initials(name?: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

const Wrapper = styled.span<{
  $size: number;
  $round: boolean;
  $border?: string;
  $bg: string;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  overflow: hidden;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: ${({ $round, $size }) => ($round ? '50%' : `${Math.round($size * 0.2)}px`)};
  border: ${({ $border }) => ($border ? `2px solid ${$border}` : 'none')};
  background: ${({ $bg }) => $bg};
  color: ${({ theme }) => theme.colors.textInverse};
  font-weight: 700;
  font-family: ${({ theme }) => theme.typography.fontFamily};
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

/** Image avatar with an initials fallback (the tiles' `react-avatar` usage). */
export function Avatar({
  src,
  name,
  size = 48,
  round = true,
  borderColor,
  backgroundColor,
}: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;

  return (
    <Wrapper
      $size={size}
      $round={round}
      $border={borderColor}
      $bg={backgroundColor ?? '#0C2135'}
      style={{ fontSize: Math.round(size * 0.4) }}
      aria-label={name}
    >
      {showImage ? (
        <Img src={src} alt={name ?? ''} onError={() => setFailed(true)} />
      ) : (
        initials(name)
      )}
    </Wrapper>
  );
}
