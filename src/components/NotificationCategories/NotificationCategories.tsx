import React from 'react';
import styled, { useTheme } from 'styled-components';
import { FaRegBell, FaRegEnvelope } from 'react-icons/fa';
import { FiLock, FiUsers } from 'react-icons/fi';
import {
  IoCalendarOutline,
  IoHammerOutline,
  IoHomeOutline,
  IoNewspaperOutline,
  IoWalletOutline,
} from 'react-icons/io5';
import { Page, type PageProps } from '../Page';
import { Text } from '../Text';

const ICON_BY_KEY: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  'mail-outline': FaRegEnvelope,
  'notifications-outline': FaRegBell,
  'hammer-outline': IoHammerOutline,
  'calendar-outline': IoCalendarOutline,
  'newspaper-outline': IoNewspaperOutline,
  'home-outline': IoHomeOutline,
  'lock-closed-outline': FiLock,
  'people-outline': FiUsers,
  'wallet-outline': IoWalletOutline,
};

/** A message category/filter row. */
export interface NotificationCategory {
  name: string;
  /** Either a known icon key (e.g. `mail-outline`) or a custom node. */
  icon?: keyof typeof ICON_BY_KEY | string | React.ReactNode;
  /** Unread count shown in brackets; `null`/`undefined` hides it. */
  count?: number | null;
}

export interface NotificationCategoriesProps {
  categories: NotificationCategory[];
  /** Called with the tapped category. */
  onSelectCategory: (category: NotificationCategory) => void;

  /** Intro/help sentence above the list. Pass `null` to hide. */
  helpText?: string | null;
  /** Inline help link label (rendered after `helpText`). */
  helpLinkLabel?: string;
  /** Called when the help link is pressed. */
  onHelp?: () => void;

  /** Header title. Ignored if `header` is provided. */
  title?: string;
  header?: PageProps['header'];
  bottomNav?: PageProps['bottomNav'];
  backgroundColor?: string;
}

function renderIcon(
  icon: NotificationCategory['icon'],
  color: string,
): React.ReactNode {
  if (icon == null) return null;
  if (typeof icon === 'string') {
    const Cmp = ICON_BY_KEY[icon];
    return Cmp ? <Cmp size={22} color={color} /> : null;
  }
  return icon;
}

/**
 * The `/notifications` "Messages" landing: an intro line with an optional help
 * link, then a bordered list of message categories each showing its unread
 * count. Data-agnostic — categories, counts and handlers come from the parent.
 */
export function NotificationCategories({
  categories,
  onSelectCategory,
  helpText = "Find what you're looking for quickly by filtering your messages.",
  helpLinkLabel = 'Need help?',
  onHelp,
  title = 'Messages',
  header,
  bottomNav,
  backgroundColor,
}: NotificationCategoriesProps) {
  const theme = useTheme();
  return (
    <Page
      header={header ?? { title, noBackButton: true }}
      bottomNav={bottomNav}
      backgroundColor={backgroundColor}
      padded={false}
    >
      <Container>
        {helpText != null && (
          <HelpContainer>
            <Text as="div" color={theme.colors.text}>
              {helpText}&nbsp;
              {onHelp && (
                <HelpLink type="button" $color={theme.colors.primary} onClick={onHelp}>
                  {helpLinkLabel}
                </HelpLink>
              )}
            </Text>
          </HelpContainer>
        )}
        <List $border={theme.colors.border}>
          {categories.map((item, index) => (
            <Row
              key={item.name}
              type="button"
              $divider={theme.colors.border}
              $last={index === categories.length - 1}
              onClick={() => onSelectCategory(item)}
            >
              <RowTitle>
                {renderIcon(item.icon, theme.colors.primary)}
                <Text color={theme.colors.text}>{item.name}</Text>
              </RowTitle>
              {item.count != null && (
                <Count $color={theme.colors.primary}>{`(${item.count})`}</Count>
              )}
            </Row>
          ))}
        </List>
      </Container>
    </Page>
  );
}

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 40px;
`;

const HelpContainer = styled.div`
  width: 90%;
  box-sizing: border-box;
  padding: 20px;
  margin-top: 10px;
`;

const HelpLink = styled.button<{ $color: string }>`
  color: ${({ $color }) => $color};
  cursor: pointer;
  border: 0;
  background: none;
  padding: 0;
  font: inherit;
  display: inline;
`;

const List = styled.div<{ $border: string }>`
  margin-top: 20px;
  width: 90%;
  align-self: center;
  border: 1px solid ${({ $border }) => $border};
`;

const Row = styled.button<{ $divider: string; $last: boolean }>`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 15px 20px;
  border: none;
  background: none;
  & + button {
    border-top: 1px solid ${({ $divider }) => $divider};
  }
  &:hover {
    background-color: #f5f5f5;
  }
`;

const RowTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Count = styled.span<{ $color: string }>`
  font-size: 12px;
  font-weight: 500;
  color: ${({ $color }) => $color};
`;
