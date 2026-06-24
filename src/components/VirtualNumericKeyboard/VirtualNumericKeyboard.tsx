import React from 'react';
import styled from 'styled-components';

export interface VirtualNumericKeyboardProps {
  /** Called with the pressed digit ('0'–'9'). */
  onKeyPress: (digit: string) => void;
  /** Called when the delete/backspace key is pressed. */
  onDelete: () => void;
  /** Glyph/node for the delete key (defaults to "x"). */
  deleteLabel?: React.ReactNode;
  /** Disable all keys. */
  disabled?: boolean;
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

/**
 * On-screen numeric keypad (the apps' `VirtualNumericKeyboard`): three columns
 * of 1–9, then a blank, 0, and a delete key. Purely presentational — the parent
 * owns the entered value via `onKeyPress`/`onDelete`.
 */
export function VirtualNumericKeyboard({
  onKeyPress,
  onDelete,
  deleteLabel = 'x',
  disabled = false,
}: VirtualNumericKeyboardProps) {
  return (
    <Grid>
      {KEYS.map((k) => (
        <Key key={k} type="button" disabled={disabled} onClick={() => onKeyPress(k)}>
          {k}
        </Key>
      ))}
      <span />
      <Key type="button" disabled={disabled} onClick={() => onKeyPress('0')}>
        0
      </Key>
      <Key type="button" disabled={disabled} aria-label="Delete" onClick={onDelete}>
        {deleteLabel}
      </Key>
    </Grid>
  );
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 70%;
  max-width: 280px;
  margin: 0 auto;
`;

const Key = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50px;
  border: none;
  background: transparent;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 22px;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  user-select: none;
  &:disabled {
    cursor: default;
    opacity: 0.4;
  }
`;
