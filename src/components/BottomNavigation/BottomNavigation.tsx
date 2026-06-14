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

// Reproduces the TDD estate apps' tab bar: a fixed bottom bar where the active
// tab is a two-layer lifted circle (outer ring = bottomBar.active, inner =
// bottomBar.activeBackground), with themeable active/inactive icon colours and a
// notifications badge. Reads the flat bottomBar brand keys with grouped fallbacks.
const Bar = styled.nav`
  width: 100%;
  height: 60px;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 2;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  box-shadow: rgb(102 102 102 / 42%) 0px 1px 7px -1px;
  background: ${({ theme }) => (theme.bottomBar && theme.bottomBar.background) || theme.colors.surface};
`;

const Item = styled.button`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  background: transparent;
  border: none;
  cursor: pointer;
  height: 100%;
  padding: 0;
`;

const ActiveOuter = styled.span`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-top: -20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.3);
  background: ${({ theme }) => (theme.bottomBar && theme.bottomBar.active) || theme.colors.primary};
`;

const ActiveInner = styled.span`
  width: 55px;
  height: 55px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  background: ${({ theme }) =>
    (theme.bottomBar && theme.bottomBar.activeBackground) || theme.colors.surface};
  color: ${({ theme }) =>
    (theme.bottomBar && theme.bottomBar.activeIconColor) || theme.colors.primary};
`;

const Inactive = styled.span`
  width: 55px;
  height: 55px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  font-size: 22px;
  color: ${({ theme }) =>
    (theme.bottomBar && (theme.bottomBar.iconColor || theme.bottomBar.inactive)) || theme.colors.textMuted};
`;

const BadgeDot = styled.span`
  position: absolute;
  right: 8px;
  top: 8px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => (theme.bottomBar && theme.bottomBar.badge) || theme.colors.danger};
  color: ${({ theme }) => (theme.bottomBar && theme.bottomBar.badgeText) || theme.colors.textInverse};
  font-size: 10px;
`;

const Label = styled.span`
  font-size: 10px;
  margin-top: 2px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
`;

export function BottomNavigation({ items, active, onSelect, showLabels = false }: BottomNavigationProps) {
  return (
    <Bar>
      {items.map((item) => {
        const isActive = item.key === active;
        return (
          <Item key={item.key} type="button" onClick={() => onSelect(item.key)} aria-label={item.label || item.key}>
            {isActive ? (
              <ActiveOuter>
                <ActiveInner>{item.icon}</ActiveInner>
              </ActiveOuter>
            ) : (
              <Inactive>
                {item.icon}
                {item.badge ? <BadgeDot>{item.badge}</BadgeDot> : null}
              </Inactive>
            )}
            {showLabels && item.label && <Label>{item.label}</Label>}
          </Item>
        );
      })}
    </Bar>
  );
}
