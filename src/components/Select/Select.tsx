import { useMemo, useState } from 'react';
import styled, { css } from 'styled-components';
import { SelectModal, type SelectOption } from '../SelectModal';

export type SelectSize = 'sm' | 'md' | 'lg';

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
  disabled?: boolean;
  invalid?: boolean;
  fullWidth?: boolean;
  cancelLabel?: string;
  name?: string;
  id?: string;
}

const sizeStyles: Record<SelectSize, ReturnType<typeof css>> = {
  sm: css`
    height: 36px;
    padding: 0 12px;
    font-size: 13px;
  `,
  md: css`
    height: 44px;
    padding: 0 14px;
    font-size: 15px;
  `,
  lg: css`
    height: 54px;
    padding: 0 16px;
    font-size: 16px;
  `,
};

const Field = styled.button<{
  $size: SelectSize;
  $invalid: boolean;
  $fullWidth: boolean;
  $placeholder: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid
    ${({ $invalid, theme }) =>
      $invalid ? theme.colors.danger : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  color: ${({ $placeholder, theme }) =>
    $placeholder ? theme.colors.textMuted : theme.colors.text};
  cursor: pointer;
  text-align: left;
  ${({ $size }) => sizeStyles[$size]};

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.secondary};
    outline-offset: 2px;
  }
  &:disabled {
    background: ${({ theme }) => theme.colors.lightGrey};
    opacity: 0.7;
    cursor: not-allowed;
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

/**
 * Tappable picker field that opens a `SelectModal` of options — ported from
 * anch-pwa's `ReactNative/Select`. Looks like an input with a caret rather than
 * a native `<select>` dropdown. Controlled (`value`) or uncontrolled
 * (`defaultValue`); reports selection via `onChange`.
 */
export function Select<T extends string | number = string>({
  options,
  value,
  defaultValue,
  onChange,
  placeholder = '',
  title,
  size = 'md',
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
