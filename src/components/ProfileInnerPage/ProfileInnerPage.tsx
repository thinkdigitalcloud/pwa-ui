import React from 'react';
import styled from 'styled-components';
import { Page, type PageProps } from '../Page';
import { type HeaderAction } from '../Header';
import { Spinner } from '../Spinner';
import { useResolvedTheme } from '../../theme/useResolvedTheme';
import { Brand, BrandScope } from '../../theme/brands';

export interface ProfileInnerPageProps {
  title: string;
  /** Back handler. Omit `noBackButton` to keep the back arrow. */
  onBack?: () => void;
  noBackButton?: boolean;
  removeHeaderShadow?: boolean;

  /** Header save action (green tick). */
  onSave?: () => void;
  saveDisabled?: boolean;
  /** Header edit action. */
  onEdit?: () => void;
  /** Header delete action (red trash). */
  onRemove?: () => void;
  /** Header share action. */
  onShare?: () => void;
  /** Header refresh action. */
  onRefresh?: () => void;
  /** Extra custom header actions. */
  headerActions?: HeaderAction[];

  /** Centred loading overlay. */
  loading?: boolean;
  loadingText?: string;
  /** Sticky footer content (e.g. a Submit / Delete Account button). */
  footer?: React.ReactNode;

  bottomNav?: PageProps['bottomNav'];
  backgroundColor?: string;
  padded?: boolean;
  children: React.ReactNode;
  /** Render with a specific brand's theme, overriding the ambient BrandProvider. */
  brand?: Brand;
}

function ProfileInnerPageContent({
  title,
  onBack,
  noBackButton = false,
  removeHeaderShadow = false,
  onSave,
  saveDisabled,
  onEdit,
  onRemove,
  onShare,
  onRefresh,
  headerActions,
  loading = false,
  loadingText = 'Loading',
  footer,
  bottomNav,
  backgroundColor,
  padded = true,
  children,
}: ProfileInnerPageProps) {
  const theme = useResolvedTheme();
  return (
    <Page
      header={{
        title,
        onBack,
        noBackButton,
        removeShadow: removeHeaderShadow,
        save: Boolean(onSave),
        onSave,
        saveDisabled,
        edit: Boolean(onEdit),
        onEdit,
        remove: Boolean(onRemove),
        onRemove,
        share: Boolean(onShare),
        onShare,
        refresh: Boolean(onRefresh),
        onRefresh,
        actions: headerActions,
      }}
      bottomNav={bottomNav}
      backgroundColor={backgroundColor}
      padded={padded}
    >
      {loading && (
        <Overlay>
          <Spinner size={30} color={theme.colors.danger} text={loadingText} />
        </Overlay>
      )}
      <Content>{children}</Content>
      {footer && <Footer>{footer}</Footer>}
    </Page>
  );
}

/**
 * Shared layout shell for the profile inner (sub) pages. Wraps `Page` with a
 * back-titled `Header` whose right-side actions (save / edit / delete / share /
 * refresh) are driven by which callbacks you pass, plus a loading overlay and an
 * optional sticky footer action. The submit action lives in the header — the
 * apps' form-page convention — while list pages keep their action in `footer`.
 */
export function ProfileInnerPage({ brand, ...props }: ProfileInnerPageProps) {
  return (
    <BrandScope brand={brand}>
      <ProfileInnerPageContent {...props} />
    </BrandScope>
  );
}

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Footer = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 16px 0 40px;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: #fff;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
