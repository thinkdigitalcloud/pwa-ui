import React from 'react';
import styled from 'styled-components';
import { Header, type HeaderProps } from '../Header';
import {
  BottomNavigation,
  type BottomNavigationProps,
} from '../BottomNavigation';

export interface PageProps {
  /** Props forwarded to the top Header. Omit to render no header. */
  header?: HeaderProps;
  /** Props forwarded to the BottomNavigation. Omit to render no nav. */
  bottomNav?: BottomNavigationProps;
  /** Page background override. */
  backgroundColor?: string;
  /** Add horizontal/vertical padding to the content area. */
  padded?: boolean;
  children: React.ReactNode;
}

const Shell = styled.div<{ $bg?: string }>`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 100%;
  background: ${({ $bg, theme }) => $bg ?? theme.colors.background};
`;

const Content = styled.main<{ $padded: boolean }>`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  padding: ${({ $padded }) => ($padded ? '16px 5%' : '0')};
`;

/**
 * Screen scaffold combining an optional Header, a scrollable content region,
 * and an optional BottomNavigation — the apps' `Page` / `ScreenLayout`.
 */
export function Page({
  header,
  bottomNav,
  backgroundColor,
  padded = true,
  children,
}: PageProps) {
  return (
    <Shell $bg={backgroundColor}>
      {header && <Header {...header} />}
      <Content $padded={padded}>{children}</Content>
      {bottomNav && <BottomNavigation {...bottomNav} />}
    </Shell>
  );
}
