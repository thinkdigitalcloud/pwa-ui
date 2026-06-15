import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { FiX } from 'react-icons/fi';
import { Text } from '../Text';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  /** Hide the ✕ close button in the header. */
  hideCloseButton?: boolean;
  /** Colour of the ✕ close button (defaults to theme.colors.textMuted). */
  closeButtonColor?: string;
  /** Override the sheet border radius (defaults to theme.radii.lg). */
  borderRadius?: string;
  /** Centre the title within the header (close button stays pinned right). */
  centerTitle?: boolean;
  /** Override the body padding (defaults to 16px). */
  bodyPadding?: string;
  /** Footer content (typically action buttons). */
  footer?: React.ReactNode;
  children?: React.ReactNode;
}

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.45);
  /* Maximum 32-bit z-index so modals sit above all app chrome
     (Header is 100, BottomNavigation lower) and any host-app screen. */
  z-index: 2147483647;
`;

const Sheet = styled.div<{ $radius?: string }>`
  width: 100%;
  max-width: 420px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ $radius, theme }) => $radius ?? theme.radii.lg};
  overflow: hidden;
`;

const HeaderRow = styled.div<{ $center?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: ${({ $center }) => ($center ? 'center' : 'space-between')};
  gap: 8px;
  padding: 16px;
`;

const Body = styled.div<{ $padding?: string }>`
  padding: ${({ $padding }) => $padding ?? '16px'};
  overflow-y: auto;
`;

const Footer = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  padding: 12px 16px;
`;

const CloseButton = styled.button<{ $center?: boolean; $color?: string }>`
  display: flex;
  border: none;
  background: transparent;
  cursor: pointer;
  color: ${({ $color, theme }) => $color ?? theme.colors.textMuted};
  ${({ $center }) =>
    $center
      ? `position: absolute; right: 16px; top: 50%; transform: translateY(-50%);`
      : ''}
`;

/** Accessible modal dialog with backdrop, Escape-to-close, and optional footer. */
export function Modal({
  open,
  onClose,
  title,
  hideCloseButton = false,
  closeButtonColor,
  borderRadius,
  centerTitle = false,
  bodyPadding,
  footer,
  children,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // SSR guard: no DOM to portal into.
  if (!open || typeof document === 'undefined') return null;

  // Portal to <body> so the modal escapes any ancestor stacking context
  // (a parent with transform/filter/opacity or its own z-index would
  // otherwise trap it, no matter how high our z-index is).
  return createPortal(
    <Backdrop onClick={onClose}>
      <Sheet
        role="dialog"
        aria-modal="true"
        aria-label={title}
        $radius={borderRadius}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || !hideCloseButton) && (
          <HeaderRow $center={centerTitle}>
            {title ? (
              <Text variant="heading" style={{ fontWeight: 'normal' }}>
                {title}
              </Text>
            ) : (
              !centerTitle && <span />
            )}
            {!hideCloseButton && (
              <CloseButton
                type="button"
                aria-label="Close"
                $center={centerTitle}
                $color={closeButtonColor}
                onClick={onClose}
              >
                <FiX size={22} />
              </CloseButton>
            )}
          </HeaderRow>
        )}
        {children && <Body $padding={bodyPadding}>{children}</Body>}
        {footer && <Footer>{footer}</Footer>}
      </Sheet>
    </Backdrop>,
    document.body,
  );
}
