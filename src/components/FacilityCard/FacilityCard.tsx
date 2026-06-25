import styled, { useTheme } from 'styled-components';
import { Text } from '../Text';

/** Coloured status badge shown bottom-right (e.g. Requested / Booked). */
export interface FacilityCardBadge {
  label: string;
  /** Badge background (defaults to theme secondary). */
  color?: string;
}

export interface FacilityCardProps {
  title: string;
  image?: string;
  /**
   * `bar` — translucent white header bar with dark title (Service/Booking tiles).
   * `overlay` — white, shadowed title at the top-left (Resource tile).
   */
  titleStyle?: 'bar' | 'overlay';
  /** Coloured status badge in the footer (bottom-right). */
  badge?: FacilityCardBadge;
  /** White action chip in the footer (bottom-right), e.g. "Book Now". */
  action?: string;
  /** Card height in px. */
  height?: number;
  /** Fallback image when `image` is empty/broken. */
  placeholder?: string;
  onClick?: () => void;
}

const PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="150"><rect width="400" height="150" fill="#c8ccd2"/></svg>`,
  );

/**
 * Image card used across the booking flow — a full-bleed photo with the
 * facility name (as a translucent header bar or an overlaid caption) and an
 * optional footer holding a status badge or an action chip. Isolated from
 * balwin's ServiceTile / BookingStatusTile / ResourceTile, which were the same
 * card with different slots.
 */
export function FacilityCard({
  title,
  image,
  titleStyle = 'bar',
  badge,
  action,
  height = 150,
  placeholder = PLACEHOLDER,
  onClick,
}: FacilityCardProps) {
  const theme = useTheme();
  const showFooter = !!badge || !!action;
  return (
    <Card $height={height} onClick={onClick}>
      <Background
        src={image || placeholder}
        alt={title}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = placeholder;
        }}
      />
      {titleStyle === 'bar' ? (
        <HeaderBar>
          <Text variant="label" color={theme.colors.text}>
            {title}
          </Text>
        </HeaderBar>
      ) : (
        <OverlayTitle>
          <Text variant="label" color="#fff">
            {title}
          </Text>
        </OverlayTitle>
      )}
      {showFooter && (
        <Footer>
          {badge && (
            <Badge style={{ backgroundColor: badge.color ?? theme.colors.secondary }}>
              <Text variant="small" color="#fff">
                {badge.label}
              </Text>
            </Badge>
          )}
          {action && (
            <ActionChip>
              <Text variant="label" color={theme.colors.text}>
                {action}
              </Text>
            </ActionChip>
          )}
        </Footer>
      )}
    </Card>
  );
}

const Card = styled.div<{ $height: number }>`
  position: relative;
  width: 100%;
  height: ${({ $height }) => $height}px;
  overflow: hidden;
  cursor: pointer;
`;

const Background = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const HeaderBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.7);
  padding: 8px 15px;
`;

const OverlayTitle = styled.div`
  position: absolute;
  top: 12px;
  left: 15px;
  right: 15px;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.8);
`;

const Footer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 12px;
  background: rgba(255, 255, 255, 0.6);
`;

const Badge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  min-width: 96px;
  padding: 0 10px;
`;

const ActionChip = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  padding: 0 15px;
  background: #fff;
`;
