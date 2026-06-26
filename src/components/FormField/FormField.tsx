import React from 'react';
import styled, { useTheme } from 'styled-components';
import { Text } from '../Text';

export interface FormFieldProps {
  /** Field label (semibold, above the control). */
  label: string;
  children: React.ReactNode;
  /** Hide the bottom divider. */
  noDivider?: boolean;
}

/**
 * A labelled form field — a semibold label above its control, with a full-width
 * bottom divider. The control (text input, select trigger, etc.) is passed as
 * children. Matches the estate apps' profile/address/account form rows.
 */
export function FormField({ label, children, noDivider = false }: FormFieldProps) {
  const theme = useTheme();
  return (
    <Container $divider={theme.colors.lightGrey} $noDivider={noDivider}>
      <Label variant="label" color={theme.colors.text}>
        {label}
      </Label>
      {children}
    </Container>
  );
}

const Container = styled.div<{ $divider: string; $noDivider: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 12px 0 6px;
  border-bottom: ${({ $noDivider, $divider }) =>
    $noDivider ? 'none' : `1px solid ${$divider}`};
`;

const Label = styled(Text)`
  text-align: left;
  font-size: 16px;
  margin-bottom: 6px;
  font-weight: ${({ theme }) => theme.typography.weightBold};
`;
