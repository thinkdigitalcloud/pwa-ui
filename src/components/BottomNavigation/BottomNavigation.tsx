import React from 'react';
import styled from 'styled-components';

export interface BottomNavItem {
  key: string;
  icon: React.ReactNode;
  label?: string;
  /** Unread/notification count rendered as a badge. */
  badge?: number;
}

export interface BottomNavigationProps {
  items: BottomNavItem[];
  /** Key of the active item. */
  active: string;
  onSelect: (key: string) => void;
  /** Show text labels under icons. */
  showLabels?: boolean;
}

const Bar = styled.nav`
  display: flex;
  width: 100%;
  background: ${({ theme }) => theme.bottomBar.background};
  border-top: 1px solid ${({ theme }) => theme.bottomBar.border};
  padding: 8px 12px;
  padding-bottom: max(8px, env(safe-area-inset-bottom));
`;

const Item = styled.button<{ $active: boolean; $labelled: boolean }>`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  border: none;
  background: transparent;
  padding: 4px 0;
  cursor: pointer;
  font-size: 22px;
  color: ${({ $active, theme }) =>
    $active ? theme.bottomBar.active : theme.bottomBar.inactive};
`;

const Label = styled.span`
  font-size: 10px;
  font-weight: 600;
`;

const Badge = styled.span`
  position: absolute;
  top: -2px;
  right: 50%;
  transform: translateX(18px);
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
  line-height: 16px;
  text-align: center;
  color: ${({ theme }) => theme.bottomBar.badgeText};
  background: ${({ theme }) => theme.bottomBar.badge};
`;

/**
 * Fixed bottom tab bar. Data-driven (pass an `items` array) rather than the
 * apps' hard-coded five tabs, with theme-aware active colours and a badge.
 */
export function BottomNavigation({
  items,
  active,
  onSelect,
  showLabels = false,
}: BottomNavigationProps) {
  return (
    <Bar>
      {items.map((item) => (
        <Item
          key={item.key}
          type="button"
          aria-label={item.label ?? item.key}
          aria-current={item.key === active}
          $active={item.key === active}
          $labelled={showLabels}
          onClick={() => onSelect(item.key)}
        >
          {item.badge != null && item.badge > 0 && (
            <Badge>{item.badge > 99 ? '99+' : item.badge}</Badge>
          )}
          {item.icon}
          {showLabels && item.label && <Label>{item.label}</Label>}
        </Item>
      ))}
    </Bar>
  );
}
