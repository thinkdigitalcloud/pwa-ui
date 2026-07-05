import React, { useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { Text } from '../Text';
import { SelectModal, type SelectOption } from '../SelectModal';
import { CancelButtonSize } from '../../utils/cancelButtonSize';
import { Brand, BrandScope } from '../../theme/brands';

/** Style passthrough for the option picker (when the field is a select). */
export interface LabeledFieldSelectModalStyle {
  borderRadius?: string;
  cancelBorderRadius?: string;
  optionSelectedBackground?: string;
  optionSelectedColor?: string;
  optionSelectedFontWeight?: number | string;
  cancelButtonSize?: CancelButtonSize;
}

export interface LabeledFieldProps {
  /** Field label, shown above the control. */
  label: string;
  /** Current value (text value, or the selected option's value). */
  value?: string;

  /**
   * Options for the picker. When provided (non-empty) the field renders as a
   * select that opens a SelectModal; otherwise it renders a free-text input.
   */
  options?: SelectOption[];
  /** Called with the chosen option value (select mode). */
  onSelect?: (value: string) => void;
  /** Modal title (select mode). Defaults to the label. */
  selectTitle?: string;
  /** Placeholder shown when no value is selected (select mode). */
  placeholder?: string;
  /** Cancel button label in the picker (select mode). Default 'Cancel'. */
  cancelLabel?: string;
  /** Style overrides for the picker modal (select mode). */
  selectModal?: LabeledFieldSelectModalStyle;

  /** Called on each keystroke (text mode). */
  onChange?: (value: string) => void;
  /** Read-only text input (still shows the value). */
  readOnly?: boolean;
  /** Max length (text mode). */
  maxLength?: number;
  /** Input type, e.g. 'text' | 'tel' | 'email' | 'number' (text mode). */
  inputType?: string;
  /** Called when Enter is pressed (text mode). */
  onSubmit?: () => void;
  /** Ref forwarded to the underlying <input> (text mode). */
  inputRef?: React.Ref<HTMLInputElement>;

  /** Disable the control (greys it out; blocks the picker/typing). */
  disabled?: boolean;
  /** Hide the bottom divider. */
  noDivider?: boolean;
  /** Bottom divider colour (defaults to the theme's lightGrey). */
  dividerColor?: string;
  /** Label colour (defaults to the theme's darkGrey). */
  labelColor?: string;
  /** Value/input text colour (defaults to the theme's text colour). */
  textColor?: string;
  /** Font family (defaults to the theme font). */
  font?: string;
  /** Extra style merged onto the label. */
  labelStyle?: React.CSSProperties;
  /** Extra style merged onto the input / select trigger. */
  valueStyle?: React.CSSProperties;

  /** Render with a specific brand's theme, overriding the ambient BrandProvider. */
  brand?: Brand;
}

function LabeledFieldContent({
  label,
  value,
  options,
  onSelect,
  selectTitle,
  placeholder,
  cancelLabel = 'Cancel',
  selectModal,
  onChange,
  readOnly,
  maxLength,
  inputType = 'text',
  onSubmit,
  inputRef,
  disabled,
  noDivider,
  dividerColor,
  labelColor,
  textColor,
  font,
  labelStyle,
  valueStyle,
}: LabeledFieldProps) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const resolvedLabelColor = labelColor ?? theme.colors.darkGrey;
  const resolvedTextColor = textColor ?? theme.colors.text;
  const resolvedFont = font ?? theme.typography.fontFamily;
  const isSelect = Array.isArray(options) && options.length > 0;
  // Show the selected option's label (values can differ from labels, e.g. a
  // language code vs its display name); fall back to the raw value.
  const selectedLabel = isSelect
    ? options!.find((o) => String(o.value) === String(value))?.label ?? value
    : value;

  return (
    <FieldContainer $noDivider={!!noDivider} $divider={dividerColor ?? theme.colors.lightGrey}>
      <Text variant="body" color={resolvedLabelColor} style={{ fontSize: 14, fontWeight: 400, ...labelStyle }}>
        {label}
      </Text>

      {isSelect ? (
        <>
          <SelectTrigger
            type="button"
            disabled={disabled}
            $placeholder={!value}
            style={{ color: resolvedTextColor, fontFamily: resolvedFont, ...valueStyle }}
            onClick={() => setOpen(true)}
          >
            {selectedLabel || placeholder || ''}
          </SelectTrigger>
          <SelectModal
            open={open}
            onClose={() => setOpen(false)}
            title={selectTitle || label}
            options={options as SelectOption[]}
            value={value}
            onSelect={(v) => onSelect && onSelect(String(v))}
            cancelLabel={cancelLabel}
            borderRadius={selectModal?.borderRadius}
            cancelBorderRadius={selectModal?.cancelBorderRadius}
            optionSelectedBackground={selectModal?.optionSelectedBackground}
            optionSelectedColor={selectModal?.optionSelectedColor}
            optionSelectedFontWeight={selectModal?.optionSelectedFontWeight}
            cancelButtonSize={selectModal?.cancelButtonSize}
          />
        </>
      ) : (
        <StyledInput
          ref={inputRef}
          value={value || ''}
          type={inputType}
          readOnly={readOnly}
          disabled={disabled}
          maxLength={maxLength}
          placeholder={placeholder}
          onChange={(e) => onChange && onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && onSubmit) onSubmit();
          }}
          style={{ color: resolvedTextColor, fontFamily: resolvedFont, ...valueStyle }}
        />
      )}
    </FieldContainer>
  );
}

/**
 * Labelled form field (underline / profile style): a small label above a
 * borderless, transparent control with a bottom divider. Renders a free-text
 * input by default, or an option picker (SelectModal) when `options` are passed
 * — "an input with dynamic options". Colours/typography fall back to the theme
 * and can be overridden per brand. Consolidates the estate apps' profile /
 * address / onboarding field rows.
 */
export function LabeledField({ brand, ...props }: LabeledFieldProps) {
  return (
    <BrandScope brand={brand}>
      <LabeledFieldContent {...props} />
    </BrandScope>
  );
}

const FieldContainer = styled.div<{ $noDivider: boolean; $divider: string }>`
  display: flex;
  flex-direction: column;
  padding-top: 12px;
  padding-bottom: 6px;
  border-bottom: ${({ $noDivider, $divider }) => ($noDivider ? 'none' : `1px solid ${$divider}`)};
`;

const StyledInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  background: transparent;
  border: none;
  outline: none;
  padding: 4px 0;
  font-size: 16px;
  font-weight: 400;

  &:disabled {
    opacity: 0.6;
  }
`;

const SelectTrigger = styled.button<{ $placeholder: boolean }>`
  width: 100%;
  box-sizing: border-box;
  background: transparent;
  border: none;
  outline: none;
  padding: 4px 0;
  font-size: 16px;
  font-weight: 400;
  text-align: left;
  cursor: pointer;
  opacity: ${({ $placeholder }) => ($placeholder ? 0.55 : 1)};

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;
