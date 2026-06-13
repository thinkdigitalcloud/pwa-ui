import React from 'react';
import styled from 'styled-components';
import {
  FiArrowLeft,
  FiEdit2,
  FiSave,
  FiShare2,
  FiTrash2,
  FiRefreshCw,
} from 'react-icons/fi';

export interface HeaderAction {
  key: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export interface HeaderProps {
  title: string;
  /** Hide the back button (shown by default). */
  noBackButton?: boolean;
  onBack?: () => void;
  removeShadow?: boolean;
  /** Convenience flags that map to standard right-aligned actions. */
  share?: boolean;
  onShare?: () => void;
  edit?: boolean;
  onEdit?: () => void;
  save?: boolean;
  saveDisabled?: boolean;
  onSave?: () => void;
  remove?: boolean;
  onRemove?: () => void;
  refresh?: boolean;
  onRefresh?: () => void;
  /** Fully custom actions appended after the convenience ones. */
  actions?: HeaderAction[];
}

const Bar = styled.header<{ $shadow: boolean }>`
  position: relative;
  display: grid;
  grid-template-columns: 44px 1fr 44px;
  align-items: center;
  height: 60px;
  padding: 0 8px;
  background: ${({ theme }) => theme.header.background};
  color: ${({ theme }) => theme.header.text};
  box-shadow: ${({ $shadow }) =>
    $shadow ? 'rgba(102, 102, 102, 0.42) 0px 1px 7px -1px' : 'none'};
  z-index: 100;
`;

const Title = styled.h1`
  margin: 0;
  text-align: center;
  font-size: 17px;
  font-weight: 700;
  font-family: ${({ theme }) => theme.typography.fontFamilyHeading};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Side = styled.div<{ $align: 'start' | 'end' }>`
  display: flex;
  align-items: center;
  justify-content: ${({ $align }) =>
    $align === 'end' ? 'flex-end' : 'flex-start'};
  gap: 4px;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  border-radius: 50%;
  color: ${({ theme }) => theme.header.icon};
  cursor: pointer;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

/**
 * Top app bar with a back button, centred title, and configurable right-side
 * actions. Consolidates the near-identical `Header` from all four apps.
 */
export function Header({
  title,
  noBackButton = false,
  onBack,
  removeShadow = false,
  share,
  onShare,
  edit,
  onEdit,
  save,
  saveDisabled,
  onSave,
  remove,
  onRemove,
  refresh,
  onRefresh,
  actions = [],
}: HeaderProps) {
  const rightActions: HeaderAction[] = [
    refresh && { key: 'refresh', icon: <FiRefreshCw size={20} />, label: 'Refresh', onClick: onRefresh ?? (() => {}) },
    edit && { key: 'edit', icon: <FiEdit2 size={20} />, label: 'Edit', onClick: onEdit ?? (() => {}) },
    save && { key: 'save', icon: <FiSave size={20} />, label: 'Save', onClick: onSave ?? (() => {}), disabled: saveDisabled },
    remove && { key: 'remove', icon: <FiTrash2 size={20} />, label: 'Delete', onClick: onRemove ?? (() => {}) },
    share && { key: 'share', icon: <FiShare2 size={20} />, label: 'Share', onClick: onShare ?? (() => {}) },
    ...actions,
  ].filter(Boolean) as HeaderAction[];

  return (
    <Bar $shadow={!removeShadow}>
      <Side $align="start">
        {!noBackButton && (
          <IconButton type="button" aria-label="Back" onClick={onBack}>
            <FiArrowLeft size={22} />
          </IconButton>
        )}
      </Side>
      <Title>{title}</Title>
      <Side $align="end">
        {rightActions.map((action) => (
          <IconButton
            key={action.key}
            type="button"
            aria-label={action.label}
            disabled={action.disabled}
            onClick={action.onClick}
          >
            {action.icon}
          </IconButton>
        ))}
      </Side>
    </Bar>
  );
}
