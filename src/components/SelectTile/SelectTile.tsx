import React from 'react';
import styled, { useTheme } from 'styled-components';
import { Text } from '../Text';

export interface SelectTileProps {
  label: string;
  /** Leading icon node (react-icons glyph, <img />, …). */
  icon?: React.ReactNode;
  onClick?: () => void;
}

/**
 * A small bordered, shadowed selectable card — an icon above a label. Used in
 * responsive pick-one grids (e.g. the "Select Unit Number" tiles). The grid
 * layout is the parent's responsibility.
 */
export function SelectTile({ label, icon, onClick }: SelectTileProps) {
  const theme = useTheme();
  return (
    <Card type="button" onClick={onClick} $border={theme.colors.lightGrey} $bg={theme.colors.surface}>
      {icon}
      <Text variant="label" color={theme.colors.text}>
        {label}
      </Text>
    </Card>
  );
}

const Card = styled.button<{ $border: string; $bg: string }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  width: 100%;
  min-height: 90px;
  padding: 12px;
  text-align: left;
  border: 1px solid ${({ $border }) => $border};
  border-radius: 10px;
  background: ${({ $bg }) => $bg};
  box-shadow: 1px 1px 8px -5px rgba(0, 0, 0, 1);
  cursor: pointer;
`;
