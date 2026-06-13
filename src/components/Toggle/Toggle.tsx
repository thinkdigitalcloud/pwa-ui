import styled from 'styled-components';

export interface ToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  'aria-label'?: string;
}

const Track = styled.button<{ $on: boolean; $disabled: boolean }>`
  position: relative;
  width: 44px;
  height: 24px;
  border: none;
  border-radius: 999px;
  padding: 0;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  background: ${({ $on, theme }) =>
    $on ? theme.colors.success : theme.colors.grey};
  transition: background 0.2s ease;
`;

const Knob = styled.span<{ $on: boolean }>`
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease;
  transform: translateX(${({ $on }) => ($on ? '20px' : '0')});
`;

/** iOS-style on/off switch (the apps' `Toggle` component). */
export function Toggle({
  value,
  onChange,
  disabled = false,
  'aria-label': ariaLabel,
}: ToggleProps) {
  return (
    <Track
      type="button"
      role="switch"
      aria-checked={value}
      aria-label={ariaLabel}
      $on={value}
      $disabled={disabled}
      disabled={disabled}
      onClick={() => onChange(!value)}
    >
      <Knob $on={value} />
    </Track>
  );
}
