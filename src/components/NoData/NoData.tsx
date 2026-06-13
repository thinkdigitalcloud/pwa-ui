import React from 'react';
import styled from 'styled-components';
import { MdOutlineSearchOff } from 'react-icons/md';
import { Text } from '../Text';
import { Button } from '../Button';

export interface NoDataProps {
  /** Message shown beneath the icon. */
  text: string;
  /** Optional bold title above the message. */
  title?: string;
  /** Custom illustration; defaults to a "search off" glyph. */
  icon?: React.ReactNode;
  /** Renders a call-to-action button when provided. */
  onAction?: () => void;
  actionLabel?: string;
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

/** Empty-state placeholder (the apps' `NoData`). */
export function NoData({
  text,
  title,
  icon,
  onAction,
  actionLabel = 'Okay',
}: NoDataProps) {
  return (
    <Container>
      {icon ?? <MdOutlineSearchOff size={120} color="#B8BBC0" aria-hidden />}
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
