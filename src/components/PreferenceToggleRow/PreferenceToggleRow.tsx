import styled, { useTheme } from 'styled-components';
import { Text } from '../Text';
import { Toggle } from '../Toggle';
import { Brand, BrandScope } from '../../theme/brands';

export interface PreferenceToggleRowProps {
  label: string;
  value: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  /** Toggle knob colour (defaults to the theme secondary — the estate-app look). */
  thumbColor?: string;
  /** Per-state track colours. */
  trackColor?: { true?: string; false?: string };
  /** @deprecated The row no longer renders a divider; accepted for back-compat. */
  noDivider?: boolean;
  /** Extra left padding (px) added to the base inset — indents the label. */
  indent?: number;
  /** When set, the label becomes tappable (e.g. to open an edit modal). */
  onLabelClick?: () => void;
  /** Render with a specific brand's theme, overriding the ambient BrandProvider. */
  brand?: Brand;
}

function PreferenceToggleRowContent({
  label,
  value,
  onChange,
  disabled = false,
  thumbColor,
  trackColor,
  indent = 0,
  onLabelClick,
}: PreferenceToggleRowProps) {
  const theme = useTheme();
  return (
    <Row $indent={indent}>
      <Text
        color={theme.colors.text}
        onClick={onLabelClick}
        style={{ fontWeight: 500, ...(onLabelClick ? { cursor: 'pointer' } : {}) }}
      >
        {label}
      </Text>
      <Toggle
        value={value}
        disabled={disabled}
        aria-label={`Toggle ${label}`}
        thumbColor={thumbColor ?? theme.colors.secondary}
        trackColor={trackColor ?? { true: theme.colors.lightGrey, false: '#a9a9a9' }}
        onChange={onChange}
      />
    </Row>
  );
}

/**
 * A label + switch tile — the row used by Notification Preferences ("Access
 * Alert") and the Access Control "Permissions" section. Full-width, padded,
 * medium-weight (500) label + the estate-app themed `Toggle`. No divider.
 */
export function PreferenceToggleRow({ brand, ...props }: PreferenceToggleRowProps) {
  return (
    <BrandScope brand={brand}>
      <PreferenceToggleRowContent {...props} />
    </BrandScope>
  );
}

const Row = styled.div<{ $indent: number }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
  padding-left: ${({ $indent }) => 20 + $indent}px;
`;
