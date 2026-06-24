import styled, { useTheme } from 'styled-components';
import { Text } from '../Text';
import { Toggle } from '../Toggle';

export interface PreferenceToggleRowProps {
  label: string;
  value: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  /** Toggle knob colour (defaults to the theme secondary — the estate-app look). */
  thumbColor?: string;
  /** Per-state track colours. */
  trackColor?: { true?: string; false?: string };
  /** Hide the bottom divider (e.g. for the last row in a group). */
  noDivider?: boolean;
  /** Extra left padding (px) added to the base inset — indents the label. */
  indent?: number;
}

/**
 * A label + switch tile — the row used by Notification Preferences ("Access
 * Alert") and the Access Control "Permissions" section. Full-width, padded,
 * with a bottom divider and the estate-app themed `Toggle`.
 */
export function PreferenceToggleRow({
  label,
  value,
  onChange,
  disabled = false,
  thumbColor,
  trackColor,
  noDivider = false,
  indent = 0,
}: PreferenceToggleRowProps) {
  const theme = useTheme();
  return (
    <Row $divider={theme.colors.lightGrey} $noDivider={noDivider} $indent={indent}>
      <Text color={theme.colors.text}>{label}</Text>
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

const Row = styled.div<{ $divider: string; $noDivider: boolean; $indent: number }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
  padding-left: ${({ $indent }) => 20 + $indent}px;
  border-bottom: ${({ $noDivider, $divider }) =>
    $noDivider ? 'none' : `1px solid ${$divider}`};
`;
