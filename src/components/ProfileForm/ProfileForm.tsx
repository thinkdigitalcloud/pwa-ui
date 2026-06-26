import { useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { Page, type PageProps } from '../Page';
import { Button } from '../Button';
import { Spinner } from '../Spinner';
import { FormField } from '../FormField';
import { SelectModal } from '../SelectModal';

/** A text input field. */
export interface ProfileTextField {
  type: 'text';
  key: string;
  label: string;
  /** HTML input type (e.g. `text`, `tel`, `number`). */
  inputType?: string;
  placeholder?: string;
}

/** A select field backed by a modal picker. */
export interface ProfileSelectField {
  type: 'select';
  key: string;
  label: string;
  options: string[];
  /** Modal title (e.g. "Select an Estate"). */
  selectTitle?: string;
  placeholder?: string;
}

export type ProfileFormFieldDef = ProfileTextField | ProfileSelectField;

export interface ProfileFormProps {
  /** Field schema, in display order. */
  fields: ProfileFormFieldDef[];
  /** Current field values, keyed by field `key`. */
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  onSave: () => void;
  saveLabel?: string;

  loading?: boolean;
  title?: string;
  header?: PageProps['header'];
  bottomNav?: PageProps['bottomNav'];
  backgroundColor?: string;
}

/**
 * Schema-driven profile form (the apps' Add/Edit Address / Account / Vehicle
 * screens, which were the same form with different fields). Renders labelled
 * text inputs and modal-backed selects, with a header save action and a green
 * Save button. Values + handlers come from the parent.
 */
export function ProfileForm({
  fields,
  values,
  onChange,
  onSave,
  saveLabel = 'Save',
  loading = false,
  title = '',
  header,
  bottomNav,
  backgroundColor = '#ffffff',
}: ProfileFormProps) {
  const theme = useTheme();
  const [openSelect, setOpenSelect] = useState<string | null>(null);

  const resolvedHeader =
    header ?? { title, save: true, onSave, removeShadow: true, noBackButton: false };

  return (
    <Page header={resolvedHeader} bottomNav={bottomNav} backgroundColor={backgroundColor}>
      {loading && (
        <Overlay>
          <Spinner size={30} color={theme.colors.success} text="Loading" />
        </Overlay>
      )}
      <Form>
        {fields.map((field) => (
          <FormField key={field.key} label={field.label}>
            {field.type === 'text' ? (
              <TextInput
                type={field.inputType || 'text'}
                value={values[field.key] || ''}
                placeholder={field.placeholder}
                onChange={(e) => onChange(field.key, e.target.value)}
              />
            ) : (
              <SelectTrigger
                type="button"
                $muted={!values[field.key]}
                $color={theme.colors.text}
                onClick={() => setOpenSelect(field.key)}
              >
                {values[field.key] || field.placeholder || 'Select'}
              </SelectTrigger>
            )}
          </FormField>
        ))}

        <SaveWrap>
          <Button text={saveLabel} variant="success" block uppercase={false} onClick={onSave} />
        </SaveWrap>
      </Form>

      {fields.map((field) =>
        field.type === 'select' ? (
          <SelectModal
            key={field.key}
            open={openSelect === field.key}
            onClose={() => setOpenSelect(null)}
            title={field.selectTitle || `Select ${field.label}`}
            value={values[field.key]}
            options={field.options.map((o) => ({ label: o, value: o }))}
            onSelect={(val) => {
              onChange(field.key, String(val));
              setOpenSelect(null);
            }}
          />
        ) : null,
      )}
    </Page>
  );
}

const Form = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  padding-bottom: 60px;
`;

const TextInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 4px 0;
  background: transparent;
  border: none;
  outline: none;
  font-size: 14px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  color: ${({ theme }) => theme.colors.text};
`;

const SelectTrigger = styled.button<{ $muted: boolean; $color: string }>`
  width: 100%;
  text-align: left;
  padding: 4px 0;
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  font-size: 14px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  color: ${({ $muted, $color, theme }) => ($muted ? theme.colors.textMuted : $color)};
`;

const SaveWrap = styled.div`
  margin: 25px 0 50px;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: #343a4066;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
