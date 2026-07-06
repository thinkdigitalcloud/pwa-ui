import { useMemo, useState } from 'react';
import styled, { css } from 'styled-components';
import { SelectModal, type SelectOption } from '../SelectModal';
import { Brand, BrandScope } from '../../theme/brands';

export type SelectSize = 'sm' | 'md' | 'lg';

/**
 * Control style. `'underline'` (default) is borderless with a bottom divider;
 * `'box'` renders the bordered, rounded, surface-filled field.
 */
export type SelectVariant = 'underline' | 'box';

export interface SelectProps<T extends string | number = string> {
  options: SelectOption<T>[];
  /** Controlled value. Omit (with `defaultValue`) for uncontrolled use. */
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  /** Shown when nothing is selected; also the default modal title. */
  placeholder?: string;
  /** Modal title (defaults to `placeholder`). */
  title?: string;
  size?: SelectSize;
  /** Control style; defaults to `'underline'` (not boxed). */
  variant?: SelectVariant;
  disabled?: boolean;
  invalid?: boolean;
  fullWidth?: boolean;
  cancelLabel?: string;
  name?: string;
  id?: string;
  /** Render with a specific brand's theme, overriding the ambient BrandProvider. */
  brand?: Brand;
}

const sizeStyles: Record<SelectSize, ReturnType<typeof css>> = {
  sm: css`
    height: 36px;
    font-size: 13px;
  `,
  md: css`
    height: 44px;
    font-size: 15px;
  `,
  lg: css`
    height: 54px;
    font-size: 16px;
  `,
};

const boxPadding: Record<SelectSize, string> = {
  sm: '0 12px',
  md: '0 14px',
  lg: '0 16px',
};

const Field = styled.button<{
  $size: SelectSize;
  $variant: SelectVariant;
  $invalid: boolean;
  $fullWidth: boolean;
  $placeholder: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  color: ${({ $placeholder, theme }) =>
    $placeholder ? theme.colors.textMuted : theme.colors.text};
  cursor: pointer;
  text-align: left;
  ${({ $size }) => sizeStyles[$size]};

  ${({ $variant, $invalid, $size, theme }) =>
    $variant === 'box'
      ? css`
          background: ${theme.colors.surface};
          border: 1px solid
            ${$invalid ? theme.colors.danger : theme.colors.border};
          border-radius: ${theme.radii.md};
          padding: ${boxPadding[$size]};
        `
      : css`
          background: transparent;
          border: none;
          border-bottom: 1px solid
            ${$invalid ? theme.colors.danger : theme.colors.border};
          border-radius: 0;
          padding: 0;
        `}

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.secondary};
    outline-offset: 2px;
  }
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    ${({ $variant, theme }) =>
      $variant === 'box' &&
      css`
        background: ${theme.colors.lightGrey};
      `}
  }
`;

const FieldLabel = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Caret = styled.span`
  width: 0;
  height: 0;
  flex-shrink: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 6px solid currentColor;
`;

function SelectContent<T extends string | number = string>({
  options,
  value,
  defaultValue,
  onChange,
  placeholder = '',
  title,
  size = 'md',
  variant = 'underline',
  disabled = false,
  invalid = false,
  fullWidth = true,
  cancelLabel = 'Cancel',
  name,
  id,
}: SelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<T | undefined>(
    defaultValue,
  );

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const selectableOptions = useMemo(
    () =>
      options.filter(
        (o) =>
          !o.disabled &&
          o.value !== '' &&
          o.value !== undefined &&
          o.value !== null,
      ),
    [options],
  );

  const selectedOption = options.find((o) => o.value === currentValue);
  const hasSelection = selectedOption != null;
  const displayLabel = hasSelection ? selectedOption!.label : placeholder;

  const choose = (val: T) => {
    if (!isControlled) setInternalValue(val);
    onChange?.(val);
  };

  return (
    <>
      <Field
        type="button"
        id={id}
        name={name}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        $size={size}
        $variant={variant}
        $invalid={invalid}
        $fullWidth={fullWidth}
        $placeholder={!hasSelection}
        onClick={() => setOpen(true)}
      >
        <FieldLabel>{displayLabel}</FieldLabel>
        <Caret aria-hidden />
      </Field>
      <SelectModal<T>
        open={open}
        onClose={() => setOpen(false)}
        title={title || placeholder || 'Select'}
        options={selectableOptions}
        value={currentValue}
        onSelect={choose}
        cancelLabel={cancelLabel}
      />
    </>
  );
}

/**
 * Tappable picker field that opens a `SelectModal` of options — ported from
 * anch-pwa's `ReactNative/Select`. Looks like an input with a caret rather than
 * a native `<select>` dropdown. Controlled (`value`) or uncontrolled
 * (`defaultValue`); reports selection via `onChange`.
 */
export function Select<T extends string | number = string>({
  brand,
  ...props
}: SelectProps<T>) {
  return (
    <BrandScope brand={brand}>
      <SelectContent<T> {...props} />
    </BrandScope>
  );
}
