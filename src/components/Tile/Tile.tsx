import React from 'react';
import styled from 'styled-components';

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
  style?: React.CSSProperties;
  className?: string;
}

// Reproduces the TDD estate apps' home Tile: a gradient card (theme.tileGradient
// + gradient angle) with a transparent icon area on the left and heading +
// description. Falls back to the grouped theme.tile fields when the flat brand
// keys aren't supplied.
const Card = styled.button<{ $disabled: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 90%;
  max-width: 1200px;
  margin: 10px auto;
  padding: 10px;
  min-height: 80px;
  border: none;
  align-self: center;
  text-align: left;
  border-radius: 20px;
  background-image: linear-gradient(
    ${({ theme }) => (theme.gradient && theme.gradient.angle) || 120}deg,
    ${({ theme }) => (theme.tileGradient && theme.tileGradient[0]) || theme.tile.background},
    ${({ theme }) => (theme.tileGradient && theme.tileGradient[1]) || theme.tile.background}
  );
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
`;

const Row = styled.span`
  display: flex;
  align-items: center;
`;

const IconWrap = styled.span`
  display: flex;
  align-self: center;
  justify-content: center;
  align-items: center;
  margin: 10px 10px 10px 0;
  height: 50px;
  width: 50px;
  flex: 0 0 auto;
  font-size: 28px;
`;

const Info = styled.span`
  display: flex;
  flex-direction: column;
  flex: 10;
  min-width: 0;
`;

const Heading = styled.span`
  width: 100%;
  text-align: left;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-weight: ${({ theme }) => theme.typography.weightLabel};
  font-size: 14px;
  color: ${({ theme }) => theme.tileHeadingColor || theme.tile.heading};
`;

const Description = styled.span`
  width: 100%;
  text-align: left;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-weight: ${({ theme }) => theme.typography.weightBody};
  font-size: 11px;
  color: ${({ theme }) => theme.tileTextColour || theme.tile.description};
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

const Backdrop = styled.span`
  position: absolute;
  inset: 0;
  border-radius: 20px;
  background-color: rgba(0, 0, 0, 0.2);
`;

export function Tile({
  heading,
  description,
  icon,
  isNew = false,
  badgeText = 'NEW',
  disabled = false,
  onClick,
  style,
  className,
}: TileProps) {
  return (
    <Card
      type="button"
      $disabled={disabled}
      disabled={disabled}
      onClick={onClick}
      style={style}
      className={className}
    >
      {isNew && <Badge>{badgeText}</Badge>}
      <Row>
        {icon && <IconWrap aria-hidden>{icon}</IconWrap>}
        <Info>
          <Heading>{heading}</Heading>
          {description && <Description>{description}</Description>}
        </Info>
      </Row>
      {disabled && <Backdrop aria-hidden />}
    </Card>
  );
}
