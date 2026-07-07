import React from 'react';
import styled, { CSSObject } from 'styled-components';
import { FiSearch, FiX } from 'react-icons/fi';
import { Brand, BrandScope } from '../../theme/brands';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  /** Called when the clear (✕) button is pressed. */
  onClear?: () => void;
  autoFocus?: boolean;
  /** Render with a specific brand's theme, overriding the ambient BrandProvider. */
  brand?: Brand;
  /** Style overrides for the outer container — e.g. border, background, radius. */
  containerStyle?: React.CSSProperties;
  /** Style overrides for the text input — e.g. color, fontSize, fontFamily. */
  inputStyle?: React.CSSProperties;
  /** Style overrides applied to the placeholder (::placeholder) pseudo-element. */
  placeholderStyle?: React.CSSProperties;
  /** Style overrides for the clear (✕) icon button. `color` also tints the icon. */
  closeIconStyle?: React.CSSProperties;
  /** Size of the clear (✕) icon in px. Defaults to 20. */
  closeIconSize?: number;
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

const Input = styled.input<{ $placeholderStyle?: React.CSSProperties }>`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
    ${({ $placeholderStyle }) => $placeholderStyle as CSSObject | undefined}
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

function SearchBarContent({
  value,
  onChange,
  placeholder = 'Search…',
  onFocus,
  onClear,
  autoFocus,
  containerStyle,
  inputStyle,
  placeholderStyle,
  closeIconStyle,
  closeIconSize = 20,
}: SearchBarProps) {
  const clear = () => {
    onChange('');
    onClear?.();
  };
  return (
    <Wrapper style={containerStyle}>
      <FiSearch size={20} aria-hidden />
      <Input
        value={value}
        placeholder={placeholder}
        onFocus={onFocus}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        aria-label={placeholder}
        style={inputStyle}
        $placeholderStyle={placeholderStyle}
      />
      {value.length > 0 && (
        <IconButton type="button" onClick={clear} aria-label="Clear search" style={closeIconStyle}>
          <FiX size={closeIconSize} />
        </IconButton>
      )}
    </Wrapper>
  );
}

/** Themed search input with a leading icon and a clear button. */
export function SearchBar({ brand, ...props }: SearchBarProps) {
  return (
    <BrandScope brand={brand}>
      <SearchBarContent {...props} />
    </BrandScope>
  );
}
