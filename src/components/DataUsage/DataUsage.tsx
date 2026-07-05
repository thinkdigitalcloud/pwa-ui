/* eslint-disable react/no-danger */
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { Text } from '../Text';
import { useResolvedTheme } from '../../theme/useResolvedTheme';
import { Brand, BrandScope } from '../../theme/brands';

/**
 * Colour overrides. Anything omitted falls back to the active styled-components
 * theme, and if the component is used with no ThemeProvider, to the gocity theme.
 */
export interface DataUsageColors {
  /** Accept button background. */
  accept?: string;
  /** Decline button background. */
  decline?: string;
  /** Heading + body content text. */
  text?: string;
  /** Warning line text (defaults to the decline colour). */
  warning?: string;
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
  /** Modal card corner radius (default '15px'; pass '0' for square-cornered brands). */
  borderRadius?: string;
  /** Button corner radius (default '8px'; pass '0' for square corners). */
  buttonBorderRadius?: string;
  /** Heading font size (default '18px'). */
  titleFontSize?: string;
  /** Body content font size (default '12px'). */
  bodyFontSize?: string;
  /** Warning line font size (default '13px'). */
  warningFontSize?: string;
  /** Warning line font weight (default 700). */
  warningFontWeight?: number | string;
  /** Button label font size (default '16px'). */
  buttonFontSize?: string;
  /** Max width of each button (default '130px'; pass 'none' for full-width split). */
  buttonMaxWidth?: string;
  /** When set, buttons size by vertical padding instead of the fixed 50px height. */
  buttonPaddingVertical?: string;
  /** Render with a specific brand's theme, overriding the ambient BrandProvider. */
  brand?: Brand;
}

function DataUsageContent({
  open,
  heading = 'Data Use',
  content = '',
  warning = 'Please note: Declining will unfortunately result in you being logged out of the app.',
  acceptLabel = 'ACCEPT',
  declineLabel = 'DECLINE',
  onAccept,
  onDecline,
  colors,
  borderRadius = '15px',
  buttonBorderRadius = '8px',
  titleFontSize = '18px',
  bodyFontSize = '12px',
  warningFontSize = '13px',
  warningFontWeight = 700,
  buttonFontSize = '16px',
  buttonMaxWidth = '130px',
  buttonPaddingVertical,
}: DataUsageProps) {
  const t = useResolvedTheme();
  const accept = colors?.accept ?? t.colors.success;
  const decline = colors?.decline ?? t.colors.danger;
  const textColor = colors?.text ?? t.colors.text;
  const warningColor = colors?.warning ?? decline;
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
      <Modal style={{ fontFamily }} $radius={borderRadius}>
        <Title color={textColor} style={{ fontSize: titleFontSize }}>
          {heading}
        </Title>
        <Content
          $bodyFontSize={bodyFontSize}
          style={{ color: textColor }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
        <Warning $color={warningColor} $fontSize={warningFontSize} $weight={warningFontWeight}>
          {warning}
        </Warning>
        <Buttons>
          <ActionButton
            type="button"
            onClick={onDecline}
            $radius={buttonBorderRadius}
            $maxWidth={buttonMaxWidth}
            $padV={buttonPaddingVertical}
            $fontSize={buttonFontSize}
            style={{ backgroundColor: decline, marginRight: 15, fontFamily }}
          >
            {declineLabel}
          </ActionButton>
          <ActionButton
            type="button"
            onClick={onAccept}
            $radius={buttonBorderRadius}
            $maxWidth={buttonMaxWidth}
            $padV={buttonPaddingVertical}
            $fontSize={buttonFontSize}
            style={{ backgroundColor: accept, fontFamily }}
          >
            {acceptLabel}
          </ActionButton>
        </Buttons>
      </Modal>
    </Backdrop>,
    document.body,
  );
}

/**
 * Data-use consent modal. A full-screen dialog with a scrollable HTML body, a
 * warning line, and Accept / Decline actions. Fully presentational and
 * controlled: content comes in as props and the choice is reported via
 * `onAccept` / `onDecline` — the host app owns gating, logout and persistence.
 */
export function DataUsage({ brand, ...props }: DataUsageProps) {
  return (
    <BrandScope brand={brand}>
      <DataUsageContent {...props} />
    </BrandScope>
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

const Modal = styled.div<{ $radius: string }>`
  width: 90%;
  max-width: 480px;
  height: 80%;
  background: #fff;
  border-radius: ${({ $radius }) => $radius};
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const Title = styled(Text)`
  text-align: center;
  font-size: 18px;
  margin-bottom: 10px;
`;

const Content = styled.div<{ $bodyFontSize: string }>`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  word-break: break-word;
  overflow-wrap: anywhere;

  * {
    max-width: 100%;
    box-sizing: border-box;
    font-size: ${({ $bodyFontSize }) => $bodyFontSize} !important;
    line-height: 1.4 !important;
  }

  p {
    margin: 3px 0;
  }
`;

const Warning = styled.div<{ $color: string; $fontSize: string; $weight: number | string }>`
  text-align: center;
  margin-top: 10px;
  font-size: ${({ $fontSize }) => $fontSize};
  line-height: 1.4;
  font-weight: ${({ $weight }) => $weight};
  color: ${({ $color }) => $color};
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 20px;
`;

const ActionButton = styled.button<{
  $radius: string;
  $maxWidth: string;
  $padV?: string;
  $fontSize: string;
}>`
  flex: 1;
  max-width: ${({ $maxWidth }) => $maxWidth};
  height: ${({ $padV }) => ($padV ? 'auto' : '50px')};
  padding: ${({ $padV }) => ($padV ? `${$padV} 0` : '0')};
  border: none;
  border-radius: ${({ $radius }) => $radius};
  color: #fff;
  font-size: ${({ $fontSize }) => $fontSize};
  font-weight: 600;
  cursor: pointer;
`;
