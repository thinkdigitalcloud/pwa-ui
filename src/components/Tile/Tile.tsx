import React from 'react';
import styled from 'styled-components';
import { Text } from '../Text';

export interface TileProps {
  heading: string;
  description?: string;
  /** Icon node (e.g. a react-icons glyph or <img />). */
  icon?: React.ReactNode;
  /** Show a "NEW" badge in the top-right. */
  isNew?: boolean;
  /** Badge label (defaults to "NEW"). */
  badgeText?: string;
  disabled?: boolean;
  onClick?: () => void;
}

const Card = styled.button<{ $disabled: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  text-align: left;
  padding: 14px 16px;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.tile.background};
  box-shadow: ${({ theme }) => theme.tile.shadow};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  transition: transform 0.12s ease, box-shadow 0.12s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }
  &:disabled {
    opacity: 0.55;
  }
`;

const IconWrap = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  flex: 0 0 auto;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.tile.iconBackground};
  color: ${({ theme }) => theme.tile.iconColor};
  font-size: 22px;
`;

const Info = styled.span`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const Badge = styled.span`
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.colors.textInverse};
  background: ${({ theme }) => theme.colors.warning};
`;

/**
 * Primary navigation tile (icon + heading + description) used on home/menu
 * screens across all four apps. Estate/Phosphor-specific icon resolution from
 * the originals is left to the consumer by accepting an arbitrary `icon` node.
 */
export function Tile({
  heading,
  description,
  icon,
  isNew = false,
  badgeText = 'NEW',
  disabled = false,
  onClick,
}: TileProps) {
  return (
    <Card
      type="button"
      $disabled={disabled}
      disabled={disabled}
      onClick={onClick}
    >
      {isNew && <Badge>{badgeText}</Badge>}
      {icon && <IconWrap aria-hidden>{icon}</IconWrap>}
      <Info>
        <Text variant="bodyBold" color="inherit">
          {heading}
        </Text>
        {description && (
          <Text variant="small" color="#7B7B7B">
            {description}
          </Text>
        )}
      </Info>
    </Card>
  );
}
