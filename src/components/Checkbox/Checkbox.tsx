import React from 'react';
import styled from 'styled-components';
import { FiCheck } from 'react-icons/fi';
import { Text } from '../Text';

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Optional inline label. */
  label?: React.ReactNode;
  disabled?: boolean;
  /** Box edge length in px. */
  size?: number;
  id?: string;
}

const Wrapper = styled.label<{ $disabled: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  user-select: none;
`;

const Box = styled.span<{ $checked: boolean; $size: number }>`
  box-sizing: border-box;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  background: ${({ $checked, theme }) =>
    $checked ? theme.colors.primary : 'transparent'};
  color: ${({ theme }) => theme.colors.textInverse};
  transition: background 0.15s ease;
`;

const HiddenInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

/** Accessible, theme-aware checkbox with an optional label. */
export function Checkbox({
  checked,
  onChange,
  label,
  disabled = false,
  size = 22,
  id,
}: CheckboxProps) {
  return (
    <Wrapper $disabled={disabled} htmlFor={id}>
      <HiddenInput
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <Box $checked={checked} $size={size} aria-hidden>
        {checked && <FiCheck size={size * 0.7} />}
      </Box>
      {label != null && <Text variant="body">{label}</Text>}
    </Wrapper>
  );
}
