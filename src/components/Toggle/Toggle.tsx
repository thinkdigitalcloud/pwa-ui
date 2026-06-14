import styled from 'styled-components';

export interface ToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  'aria-label'?: string;
  /** Knob colour override (the estate apps' `thumbColor`). */
  thumbColor?: string;
  /** Track colour overrides per state (the estate apps' `trackColor`). */
  trackColor?: { true?: string; false?: string };
}

const Track = styled.button<{
  $on: boolean;
  $disabled: boolean;
  $trackOn?: string;
  $trackOff?: string;
}>`
  position: relative;
  width: 44px;
  height: 24px;
  border: none;
  border-radius: 999px;
  padding: 0;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  background: ${({ $on, $trackOn, $trackOff, theme }) =>
    $on ? $trackOn || theme.colors.success : $trackOff || theme.colors.grey};
  transition: background 0.2s ease;
`;

const Knob = styled.span<{ $on: boolean; $color?: string }>`
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${({ $color }) => $color || '#fff'};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease;
  transform: translateX(${({ $on }) => ($on ? '20px' : '0')});
`;

/** iOS-style on/off switch (the apps' `Toggle`/`Switch`). Honours per-state
 * track colours and a knob colour when supplied, else uses the theme. */
export function Toggle({
  value,
  onChange,
  disabled = false,
  'aria-label': ariaLabel,
  thumbColor,
  trackColor,
}: ToggleProps) {
  return (
    <Track
      type="button"
      role="switch"
      aria-checked={value}
      aria-label={ariaLabel}
      $on={value}
      $disabled={disabled}
      $trackOn={trackColor?.true}
      $trackOff={trackColor?.false}
      disabled={disabled}
      onClick={() => onChange(!value)}
    >
      <Knob $on={value} $color={thumbColor} />
    </Track>
  );
}
