import styled from 'styled-components';
import { Modal } from '../Modal';
import { Brand, BrandScope } from '../../theme/brands';
import { CancelButtonSize, cancelButtonVPadding } from '../../utils/cancelButtonSize';

export interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
  /** Optional logo/image; when set the row renders the image instead of the label
   *  text (falling back to the label if the image is absent). Mirrors the estate
   *  apps' image picker. */
  image?: string;
}

export interface SelectModalProps<T = string> {
  open: boolean;
  onClose: () => void;
  title?: string;
  options: SelectOption<T>[];
  /** Currently selected value (renders a check next to it). */
  value?: T;
  onSelect: (value: T) => void;
  /** When set, renders a Cancel button below the list (the apps' picker). */
  cancelLabel?: string;
  /** Card corner radius (default '5px'). Pass '0' for square-cornered brands. */
  borderRadius?: string;
  /** Cancel button corner radius (default '4px'). Pass '0' for square corners. */
  cancelBorderRadius?: string;
  /** Cancel button padding size (small/medium/large → 8/12/16px vertical). */
  cancelButtonSize?: CancelButtonSize;
  /** Selected row background (default: theme primary). */
  optionSelectedBackground?: string;
  /** Selected row text colour (default: theme textInverse). */
  optionSelectedColor?: string;
  /** Selected row font weight (default: theme weightBold). Pass 400 for regular. */
  optionSelectedFontWeight?: number | string;
  /** Render with a specific brand's theme, overriding the ambient BrandProvider. */
  brand?: Brand;
}

const List = styled.div`
  display: flex;
  flex-direction: column;
`;

// Reproduces the TDD estate apps' picker: the selected row is filled with the
// brand primary colour + light text. The divider + vertical padding live on the
// inner Label (span), so the border is inset from the row's horizontal padding.
const Row = styled.button<{
  $selected: boolean;
  $selectedBg?: string;
  $selectedColor?: string;
  $selectedWeight?: number | string;
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  padding: 0 20px;
  border: none;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 16px;
  font-weight: ${({ $selected, $selectedWeight, theme }) =>
    $selected ? $selectedWeight ?? theme.typography.weightBold : theme.typography.weightBody};
  background: ${({ $selected, $selectedBg, theme }) =>
    $selected ? $selectedBg ?? theme.colors.primary : 'transparent'};
  color: ${({ $selected, $selectedColor, theme }) =>
    $selected ? $selectedColor ?? theme.colors.textInverse : theme.colors.text};
  cursor: pointer;
  text-align: left;

  &:last-child span {
    border-bottom: none;
  }
  ${({ $selected }) => ($selected ? 'span { border-bottom: none; }' : '')}
  &:hover:not(:disabled) {
    background: ${({ $selected, $selectedBg, theme }) =>
      $selected ? $selectedBg ?? theme.colors.primary : 'rgba(0, 0, 0, 0.04)'};
  }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const Label = styled.span`
  flex: 1;
  min-width: 0;
  padding-top: 14px;
  padding-bottom: 14px;
  border-bottom: 1px solid #eee;
`;

// Image-option variant (estate logo picker): centre the logo in the row.
const ImageLabel = styled(Label)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const OptionImage = styled.img`
  max-height: 56px;
  max-width: 100%;
  object-fit: contain;
`;

// Cancel reads as a distinct branded action below the list.
const Cancel = styled.button<{ $borderRadius?: string; $vpad?: string }>`
  appearance: none;
  border: none;
  border-radius: ${({ $borderRadius }) => $borderRadius ?? '4px'};
  width: 90%;
  align-self: center;
  margin: 8px auto 0;
  display: block;
  text-align: center;
  padding: ${({ $vpad }) => $vpad ?? '14px'} 10px;
  font-size: 16px;
  font-weight: 700;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textInverse};
  cursor: pointer;
`;

function SelectModalContent<T extends string | number = string>({
  open,
  onClose,
  title = 'Select',
  options,
  value,
  onSelect,
  cancelLabel,
  borderRadius,
  cancelBorderRadius,
  cancelButtonSize,
  optionSelectedBackground,
  optionSelectedColor,
  optionSelectedFontWeight,
}: SelectModalProps<T>) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      centerTitle
      closeButtonColor="#000"
      borderRadius={borderRadius ?? '5px'}
      bodyPadding="0"
      footer={
        cancelLabel ? (
          <Cancel
            type="button"
            $borderRadius={cancelBorderRadius}
            $vpad={cancelButtonVPadding(cancelButtonSize)}
            onClick={onClose}
          >
            {cancelLabel}
          </Cancel>
        ) : undefined
      }
    >
      <List>
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <Row
              key={String(option.value)}
              type="button"
              disabled={option.disabled}
              // Image rows keep the plain white background (like the estate apps'
              // logo list); only text rows get the selected fill/weight.
              $selected={selected && !option.image}
              $selectedBg={optionSelectedBackground}
              $selectedColor={optionSelectedColor}
              $selectedWeight={optionSelectedFontWeight}
              onClick={() => {
                onSelect(option.value);
                onClose();
              }}
            >
              {option.image ? (
                <ImageLabel>
                  <OptionImage src={option.image} alt={option.label} />
                </ImageLabel>
              ) : (
                <Label>{option.label}</Label>
              )}
            </Row>
          );
        })}
      </List>
    </Modal>
  );
}

/**
 * Centred option picker. The selected row is filled with the brand primary
 * colour (matching the TDD estate apps' SelectModal / role picker); an optional
 * branded Cancel button sits below the list.
 */
export function SelectModal<T extends string | number = string>({
  brand,
  ...props
}: SelectModalProps<T>) {
  return (
    <BrandScope brand={brand}>
      <SelectModalContent<T> {...props} />
    </BrandScope>
  );
}
