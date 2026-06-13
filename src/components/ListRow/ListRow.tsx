import React from 'react';
import styled from 'styled-components';
import { FiChevronRight } from 'react-icons/fi';
import { Text } from '../Text';

export interface ListRowProps {
  title: string;
  description?: string;
  /** Leading icon node (react-icons glyph, <img />, etc.). */
  icon?: React.ReactNode;
  /** Show a trailing chevron. */
  hasArrow?: boolean;
  /** Show a "NEW" banner in the top-right corner. */
  isNew?: boolean;
  newLabel?: string;
  onClick?: () => void;
}

const Container = styled.button`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  min-height: 65px;
  padding: 8px 25px;
  gap: 16px;
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.lightGrey};
  background: transparent;
  text-align: left;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.backgroundSecondary};
  }
`;

const IconSlot = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  font-size: 26px;
  color: ${({ theme }) => theme.colors.secondary};
`;

const Body = styled.span`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
`;

const Clamp = styled(Text)`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const NewBanner = styled.span`
  position: absolute;
  top: 6px;
  right: 8px;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textInverse};
  background: ${({ theme }) => theme.colors.warning};
`;

/**
 * Full-width tappable list row — icon, title, optional clamped description,
 * optional trailing chevron and "NEW" banner. Ported from balwin's
 * `GoListItem/DrawerListItem` (the CMS icon-resolution wrappers `TileRow`/
 * `Tiles` are left to the app; pass a rendered `icon` node here instead).
 */
export function ListRow({
  title,
  description,
  icon,
  hasArrow = false,
  isNew = false,
  newLabel = 'New',
  onClick,
}: ListRowProps) {
  return (
    <Container type="button" onClick={onClick}>
      {icon && <IconSlot aria-hidden>{icon}</IconSlot>}
      <Body>
        <Text variant="label">{title}</Text>
        {description != null && description !== '' && (
          <Clamp variant="small" color="#7B7B7B">
            {description}
          </Clamp>
        )}
      </Body>
      {hasArrow && <FiChevronRight size={22} aria-hidden />}
      {isNew && <NewBanner>{newLabel}</NewBanner>}
    </Container>
  );
}
