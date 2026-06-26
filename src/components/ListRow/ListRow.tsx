import React from 'react';
import styled from 'styled-components';
import { FiArrowRight } from 'react-icons/fi';
import { Text } from '../Text';

export interface ListRowProps {
  title: string;
  description?: string;
  /** Leading icon node (react-icons glyph, <img />, etc.). */
  icon?: React.ReactNode;
  /** Show a trailing arrow. */
  hasArrow?: boolean;
  /** Override the trailing arrow colour. */
  arrowColor?: string;
  /** Show a "NEW" banner in the top-right corner. */
  isNew?: boolean;
  newLabel?: string;
  onClick?: () => void;
}

// Reproduces the TDD estate apps' profile/menu row: a small rounded icon chip
// (profileIconBackground + shadow) followed by a bottom-bordered body with the
// label and a trailing arrow. Reads the flat brand keys with grouped fallbacks.
const Container = styled.button`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  padding: 0 20px;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
`;

const Chip = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 34px;
  height: 34px;
  margin: 2px;
  border-radius: 8px;
  background: ${({ theme }) => theme.profileIconBackground || theme.tile.iconBackground};
  box-shadow: rgba(0, 0, 0, 0.25) 0px 2px 3.84px;
  overflow: hidden;
`;

const Body = styled.span`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-left: 17px;
  padding: 14px 0;
  border-bottom: 1px solid ${({ theme }) => theme.profileListBorderColor || theme.colors.border};
`;

const Labels = styled.span`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
`;

// Profile/menu rows use a regular-weight title (the `label` variant's 600 made
// them read as bold). Keep the label sizing but drop to the body weight.
const RowText = styled(Text)`
  color: ${({ theme }) => theme.textColour || theme.colors.text};
  font-weight: ${({ theme }) => theme.typography.weightBody};
`;

const Arrow = styled(FiArrowRight)<{ $color?: string }>`
  flex: 0 0 auto;
  color: ${({ $color, theme }) =>
    $color || (theme.bottomBar && theme.bottomBar.background) || theme.colors.textMuted};
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

export function ListRow({
  title,
  description,
  icon,
  hasArrow = false,
  arrowColor,
  isNew = false,
  newLabel = 'New',
  onClick,
}: ListRowProps) {
  return (
    <Container type="button" onClick={onClick}>
      {icon && <Chip aria-hidden>{icon}</Chip>}
      <Body>
        <Labels>
          <RowText variant="label">{title}</RowText>
          {description != null && description !== '' && (
            <Text variant="small" color="#7B7B7B">
              {description}
            </Text>
          )}
        </Labels>
        {hasArrow && <Arrow size={20} $color={arrowColor} aria-hidden />}
      </Body>
      {isNew && <NewBanner>{newLabel}</NewBanner>}
    </Container>
  );
}
