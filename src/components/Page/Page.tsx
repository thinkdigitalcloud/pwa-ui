import React from 'react';
import styled, { css } from 'styled-components';
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

/** Fixed height of the floating (absolutely-positioned) Header. */
const HEADER_HEIGHT = 60;

const Shell = styled.div<{ $bg?: string }>`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 100%;
  overflow: hidden;
  background: ${({ $bg, theme }) => $bg ?? theme.colors.background};
`;

const Content = styled.main<{ $padded: boolean; $hasHeader: boolean }>`
  flex: 1;
  /* allow this flex child to shrink so it becomes the scroll container */
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  padding: ${({ $padded }) => ($padded ? '16px 5%' : '0')};
  /* The Header floats over the Shell, so offset content below it. */
  ${({ $hasHeader, $padded }) =>
    $hasHeader &&
    css`
      padding-top: ${$padded ? HEADER_HEIGHT + 16 : HEADER_HEIGHT}px;
    `}
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
      <Content $padded={padded} $hasHeader={!!header}>
        {children}
      </Content>
      {bottomNav && <BottomNavigation {...bottomNav} />}
    </Shell>
  );
}
