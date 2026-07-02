import React from 'react';
import styled, { useTheme } from 'styled-components';
import { PiFolderOpen } from 'react-icons/pi';
import { Text } from '../Text';
import { Button } from '../Button';
import { Brand, BrandScope } from '../../theme/brands';

export interface NoDataProps {
  /** Message shown beneath the icon. */
  text: string;
  /** Optional bold title above the message. */
  title?: string;
  /** Custom illustration; defaults to an open-folder glyph in the theme primary. */
  icon?: React.ReactNode;
  /** Renders a call-to-action button when provided. */
  onAction?: () => void;
  actionLabel?: string;
  /** Render with a specific brand's theme, overriding the ambient BrandProvider. */
  brand?: Brand;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  width: 100%;
  padding: 32px 5%;
  text-align: center;
`;

function NoDataContent({
  text,
  title,
  icon,
  onAction,
  actionLabel = 'Okay',
}: NoDataProps) {
  const theme = useTheme();
  return (
    <Container>
      {icon ?? (
        <PiFolderOpen size={80} color={theme.colors.primary} aria-hidden />
      )}
      {title && <Text variant="heading">{title}</Text>}
      <Text variant="body" color="#7B7B7B">
        {text}
      </Text>
      {onAction && (
        <Button variant="secondary" text={actionLabel} onClick={onAction} />
      )}
    </Container>
  );
}

/** Empty-state placeholder (the apps' `NoData`). */
export function NoData({ brand, ...props }: NoDataProps) {
  return (
    <BrandScope brand={brand}>
      <NoDataContent {...props} />
    </BrandScope>
  );
}
