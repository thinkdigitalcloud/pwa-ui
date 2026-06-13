import styled from 'styled-components';
import { FiCheck, FiChevronRight } from 'react-icons/fi';
import { Modal } from '../Modal';
import { Text } from '../Text';
import { Button } from '../Button';

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

const Row = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  padding: 14px 8px;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ $selected, theme }) =>
    $selected ? theme.colors.backgroundSecondary : 'transparent'};
  cursor: pointer;
  text-align: left;

  &:last-child {
    border-bottom: none;
  }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

/**
 * Bottom/centred option picker — unifies the apps' `SelectModal`,
 * `SelectionModal` and `ModalList` into one generic, typed component.
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
      footer={
        cancelLabel ? (
          <Button variant="ghost" text={cancelLabel} block onClick={onClose} />
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
              $selected={selected}
              onClick={() => {
                onSelect(option.value);
                onClose();
              }}
            >
              <Text variant="body" color="inherit">
                {option.label}
              </Text>
              {selected ? (
                <FiCheck size={20} />
              ) : (
                <FiChevronRight size={20} color="#CBCACF" />
              )}
            </Row>
          );
        })}
      </List>
    </Modal>
  );
}
