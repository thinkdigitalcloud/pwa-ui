/* eslint-disable react/no-danger */
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled, { useTheme } from 'styled-components';
import { Text } from '../Text';
import { balwinTheme } from '../../theme/themes';
import type { AppTheme } from '../../theme/types';

/**
 * Colour overrides. Anything omitted falls back to the active styled-components
 * theme, and if the component is used with no ThemeProvider, to the balwin theme.
 */
export interface DataUsageColors {
  /** Accept button background. */
  accept?: string;
  /** Decline button background + warning text. */
  decline?: string;
  /** Heading + body content text. */
  text?: string;
}

export interface DataUsageProps {
  /** Controls visibility. */
  open: boolean;
  /** Modal heading. */
  heading?: string;
  /** Body content — an HTML string (rendered via dangerouslySetInnerHTML). */
  content?: string;
  /** Warning line shown above the buttons. */
  warning?: string;
  /** Accept button label. */
  acceptLabel?: string;
  /** Decline button label. */
  declineLabel?: string;
  /** Called when the user accepts. */
  onAccept: () => void;
  /** Called when the user declines. */
  onDecline: () => void;
  /** Colour overrides; unset values fall back to the theme (balwin by default). */
  colors?: DataUsageColors;
}

/** Resolve the styled-components theme, falling back to balwin when absent. */
function useResolvedTheme(): AppTheme {
  const raw = useTheme() as Partial<AppTheme>;
  return raw && raw.colors ? (raw as AppTheme) : balwinTheme;
}

/**
 * Data-use consent modal. A full-screen dialog with a scrollable HTML body, a
 * warning line, and Accept / Decline actions. Fully presentational and
 * controlled: content comes in as props and the choice is reported via
 * `onAccept` / `onDecline` — the host app owns gating, logout and persistence.
 */
export function DataUsage({
  open,
  heading = 'Data Use',
  content = '',
  warning = 'Please note: Declining will unfortunately result in you being logged out of the app.',
  acceptLabel = 'ACCEPT',
  declineLabel = 'DECLINE',
  onAccept,
  onDecline,
  colors,
}: DataUsageProps) {
  const t = useResolvedTheme();
  const accept = colors?.accept ?? t.colors.success;
  const decline = colors?.decline ?? t.colors.danger;
  const textColor = colors?.text ?? t.colors.text;
  const fontFamily = t.typography.fontFamily;

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDecline();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onDecline]);

  if (!open || typeof document === 'undefined') return null;

  // Portal to <body> so the modal escapes any ancestor stacking/transform context.
  return createPortal(
    <Backdrop>
      <Modal style={{ fontFamily }}>
        <Title color={textColor}>{heading}</Title>
        <Content style={{ color: textColor }} dangerouslySetInnerHTML={{ __html: content }} />
        <Text
          variant="bodyBold"
          color={decline}
          style={{ textAlign: 'center', marginTop: 10, fontSize: 13, lineHeight: '18px' }}
        >
          {warning}
        </Text>
        <Buttons>
          <ActionButton type="button" onClick={onDecline} style={{ backgroundColor: decline, marginRight: 15, fontFamily }}>
            {declineLabel}
          </ActionButton>
          <ActionButton type="button" onClick={onAccept} style={{ backgroundColor: accept, fontFamily }}>
            {acceptLabel}
          </ActionButton>
        </Buttons>
      </Modal>
    </Backdrop>,
    document.body,
  );
}

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2147483647;
  padding: 16px;
`;

const Modal = styled.div`
  width: 90%;
  max-width: 480px;
  height: 80%;
  background: #fff;
  border-radius: 15px;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const Title = styled(Text)`
  text-align: center;
  font-size: 18px;
  margin-bottom: 10px;
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  word-break: break-word;
  overflow-wrap: anywhere;

  * {
    max-width: 100%;
    box-sizing: border-box;
    font-size: 12px !important;
    line-height: 16px !important;
  }

  p {
    margin: 3px 0;
  }
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 20px;
`;

const ActionButton = styled.button`
  flex: 1;
  max-width: 130px;
  height: 50px;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
`;
