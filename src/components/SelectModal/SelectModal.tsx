import styled from 'styled-components';
import { FiCheck, FiChevronRight } from 'react-icons/fi';
import { Modal } from '../Modal';

export interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
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
}

const List = styled.div`
  display: flex;
  flex-direction: column;
`;

// Reproduces the TDD estate apps' picker: the selected row is filled with the
// brand primary colour + light text and a check; unselected rows show a chevron.
const Row = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  padding: 14px 20px;
  border: none;
  border-bottom: 1px solid #eee;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 16px;
  font-weight: ${({ $selected, theme }) =>
    $selected ? theme.typography.weightBold : theme.typography.weightBody};
  background: ${({ $selected, theme }) => ($selected ? theme.colors.primary : 'transparent')};
  color: ${({ $selected, theme }) =>
    $selected ? theme.colors.textInverse : theme.colors.text};
  cursor: pointer;
  text-align: left;

  &:last-child {
    border-bottom: none;
  }
  &:hover:not(:disabled) {
    background: ${({ $selected, theme }) =>
      $selected ? theme.colors.primary : 'rgba(0, 0, 0, 0.04)'};
  }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const Label = styled.span`
  flex: 1;
  min-width: 0;
`;

// Cancel reads as a distinct branded action below the list.
const Cancel = styled.button`
  appearance: none;
  border: none;
  border-radius: 4px;
  width: 90%;
  align-self: center;
  margin: 8px auto 0;
  display: block;
  text-align: center;
  padding: 14px 10px;
  font-size: 16px;
  font-weight: 700;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textInverse};
  cursor: pointer;
`;

/**
 * Centred option picker. The selected row is filled with the brand primary
 * colour (matching the TDD estate apps' SelectModal / role picker); an optional
 * branded Cancel button sits below the list.
 */
export function SelectModal<T extends string | number = string>({
  open,
  onClose,
  title = 'Select',
  options,
  value,
  onSelect,
  cancelLabel,
}: SelectModalProps<T>) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={cancelLabel ? <Cancel type="button" onClick={onClose}>{cancelLabel}</Cancel> : undefined}
    >
      <List>
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <Row
              key={String(option.value)}
              type="button"
              disabled={option.disabled}
              $selected={selected}
              onClick={() => {
                onSelect(option.value);
                onClose();
              }}
            >
              <Label>{option.label}</Label>
              {selected ? (
                <FiCheck size={22} />
              ) : (
                <FiChevronRight size={22} color="#CBCACF" />
              )}
            </Row>
          );
        })}
      </List>
    </Modal>
  );
}
