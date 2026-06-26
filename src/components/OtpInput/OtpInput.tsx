import { useRef } from 'react';
import styled from 'styled-components';

export interface OtpInputProps {
  /** Current OTP value (controlled). */
  value: string;
  onChange: (value: string) => void;
  /** Number of digit boxes. */
  length?: number;
  autoFocus?: boolean;
}

/**
 * Segmented numeric OTP entry — `length` single-digit boxes with auto-advance
 * and backspace-to-previous. Controlled via a single `value` string.
 */
export function OtpInput({ value, onChange, length = 6, autoFocus = false }: OtpInputProps) {
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? '');

  const setDigit = (index: number, d: string) => {
    if (!/^\d?$/.test(d)) return;
    const next = digits.slice();
    next[index] = d;
    onChange(next.join('').slice(0, length));
    if (d && index < length - 1) inputs.current[index + 1]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <Row>
      {digits.map((digit, i) => (
        <Box
          key={i}
          ref={(el) => {
            inputs.current[i] = el;
          }}
          inputMode="numeric"
          type="text"
          maxLength={1}
          value={digit}
          autoFocus={autoFocus && i === 0}
          onChange={(e) => setDigit(i, e.target.value)}
          onKeyDown={(e) => onKeyDown(e, i)}
        />
      ))}
    </Row>
  );
}

const Row = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 6px;
`;

const Box = styled.input`
  width: 35px;
  height: 40px;
  border: 1px solid #cdd5dd;
  border-radius: 8px;
  font-size: 18px;
  text-align: center;
  box-sizing: border-box;
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.secondary};
    outline-offset: 1px;
  }
`;
