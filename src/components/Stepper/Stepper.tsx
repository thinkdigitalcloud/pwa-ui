import styled from 'styled-components';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { Text } from '../Text';

export interface StepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

const Row = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 16px;
`;

const RoundButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.danger};
  color: ${({ theme }) => theme.colors.textInverse};
  cursor: pointer;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

/**
 * Increment/decrement control with bounds — the apps' `AddSubtractByOne`,
 * generalised with min/max/step.
 */
export function Stepper({
  value,
  onChange,
  min = 0,
  max = Infinity,
  step = 1,
}: StepperProps) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  return (
    <Row>
      <RoundButton
        type="button"
        aria-label="Decrease"
        disabled={value <= min}
        onClick={() => onChange(clamp(value - step))}
      >
        <FiMinus size={16} />
      </RoundButton>
      <Text variant="bodyBold">{value}</Text>
      <RoundButton
        type="button"
        aria-label="Increase"
        disabled={value >= max}
        onClick={() => onChange(clamp(value + step))}
      >
        <FiPlus size={16} />
      </RoundButton>
    </Row>
  );
}
