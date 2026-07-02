import React from 'react';
import styled, { useTheme } from 'styled-components';
import { FaQuestion, FaTrash } from 'react-icons/fa';
import { Modal } from '../Modal';
import { Button } from '../Button';
import { Text } from '../Text';

export interface ConfirmationModalProps {
  open: boolean;
  /** Prompt text. */
  text: string;
  /** Called on confirm. */
  onConfirm: () => void;
  /** Called on cancel / backdrop / Escape. */
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  /**
   * Icon above the text: a built-in `'question'` / `'trash'` glyph, a custom
   * node, or `'none'`. Defaults to `'question'`.
   */
  icon?: 'question' | 'trash' | 'none' | React.ReactNode;
  /** Confirm button colour; defaults to the theme secondary. */
  confirmColor?: string;
  /** Cancel button colour; defaults to the theme danger. */
  cancelColor?: string;
}

/**
 * Generic yes/no confirmation dialog (the apps' `ConfirmationModal`) built on the
 * library `Modal` + `Button`. Unifies the per-screen inline confirm/cancel
 * prompts; labels, colours and the icon are all parametrised.
 */
export function ConfirmationModal({
  open,
  text,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  icon = 'question',
  confirmColor,
  cancelColor,
}: ConfirmationModalProps) {
  const theme = useTheme();
  const confirm = confirmColor ?? theme.colors.secondary;
  const cancel = cancelColor ?? theme.colors.danger;

  let iconNode: React.ReactNode = null;
  if (icon === 'question') iconNode = <FaQuestion size={44} color={confirm} />;
  else if (icon === 'trash') iconNode = <FaTrash size={44} color={cancel} />;
  else if (icon !== 'none') iconNode = icon;

  return (
    <Modal open={open} onClose={onCancel} hideCloseButton borderRadius="16px">
      <Centered>
        {iconNode && <IconWrap>{iconNode}</IconWrap>}
        <Text color={theme.colors.text} style={{ textAlign: 'center' }}>
          {text}
        </Text>
      </Centered>
      <FooterRow>
        <Button text={cancelLabel} uppercase={false} onClick={onCancel} style={{ flex: 1, background: cancel }} />
        <Button text={confirmLabel} uppercase={false} onClick={onConfirm} style={{ flex: 1, background: confirm }} />
      </FooterRow>
    </Modal>
  );
}

const Centered = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 8px 10px;
  gap: 12px;
`;

const IconWrap = styled.div`
  display: flex;
`;

const FooterRow = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
`;
