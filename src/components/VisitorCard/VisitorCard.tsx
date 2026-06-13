import React from 'react';
import styled from 'styled-components';
import { Avatar } from '../Avatar';
import { Text } from '../Text';

export interface VisitorCardAction {
  key: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  /** Icon colour; defaults to the theme danger colour. */
  color?: string;
}

export interface VisitorCardProps {
  name: string;
  /** Detail lines (phone, dates, notes) rendered in muted text. */
  lines?: string[];
  /** Status pill text + colour (e.g. Active/Pending). */
  status?: { label: string; color?: string };
  avatarUrl?: string;
  /** Hide the avatar entirely (e.g. the apps' VisitorAccessTile). */
  hideAvatar?: boolean;
  avatarBorderColor?: string;
  /** Trailing action icons (info, add, revoke, arrow…). */
  actions?: VisitorCardAction[];
  /** Click handler for the whole row. */
  onClick?: () => void;
}

const Container = styled.div<{ $clickable: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  box-sizing: border-box;
  padding: 10px 10px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGrey};
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 0 0 auto;
`;

const ActionButton = styled.button<{ $color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  padding: 4px;
  font-size: 24px;
  cursor: pointer;
  color: ${({ $color }) => $color};
`;

const StatusPill = styled.span<{ $color: string }>`
  align-self: flex-start;
  font-size: 11px;
  font-weight: 600;
  color: ${({ $color }) => $color};
`;

/**
 * Avatar + details + trailing-action list row. Generalises balwin's
 * `Tiles/*VisitorTile` family (Pending / Verified / ShortTermLetter /
 * VisitorAccess) into one data-driven component, decoupled from the Firebase
 * record shapes — pass `name`, `lines`, and the `actions` you want.
 */
export function VisitorCard({
  name,
  lines = [],
  status,
  avatarUrl,
  hideAvatar = false,
  avatarBorderColor,
  actions = [],
  onClick,
}: VisitorCardProps) {
  return (
    <Container $clickable={Boolean(onClick)} onClick={onClick}>
      {!hideAvatar && (
        <Avatar
          name={name}
          src={avatarUrl}
          size={50}
          round={false}
          borderColor={avatarBorderColor}
        />
      )}
      <Body>
        <Text variant="body">{name}</Text>
        {lines.map((line, i) => (
          <Text key={i} variant="small" color="#7B7B7B">
            {line}
          </Text>
        ))}
        {status && (
          <StatusPill $color={status.color ?? '#4C8B2B'}>
            {status.label}
          </StatusPill>
        )}
      </Body>
      {actions.length > 0 && (
        <Actions onClick={(e) => e.stopPropagation()}>
          {actions.map((action) => (
            <ActionButton
              key={action.key}
              type="button"
              aria-label={action.label}
              $color={action.color ?? '#D01E2D'}
              onClick={action.onClick}
            >
              {action.icon}
            </ActionButton>
          ))}
        </Actions>
      )}
    </Container>
  );
}
