import React from 'react';
import styled from 'styled-components';
import { FiSearch, FiX } from 'react-icons/fi';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  /** Called when the clear (✕) button is pressed. */
  onClear?: () => void;
  autoFocus?: boolean;
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 12px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const Input = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textMuted};
`;

/** Themed search input with a leading icon and a clear button. */
export function SearchBar({
  value,
  onChange,
  placeholder = 'Search…',
  onFocus,
  onClear,
  autoFocus,
}: SearchBarProps) {
  const clear = () => {
    onChange('');
    onClear?.();
  };
  return (
    <Wrapper>
      <FiSearch size={20} aria-hidden />
      <Input
        value={value}
        placeholder={placeholder}
        onFocus={onFocus}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        aria-label={placeholder}
      />
      {value.length > 0 && (
        <IconButton type="button" onClick={clear} aria-label="Clear search">
          <FiX size={20} />
        </IconButton>
      )}
    </Wrapper>
  );
}
