import { useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { Page, type PageProps } from '../Page';
import { Button } from '../Button';

export interface LeadShareValues {
  name: string;
  number: string;
  email: string;
  license: string;
}

export interface LeadShareFormProps {
  initialValues?: Partial<LeadShareValues>;
  loading?: boolean;
  onSubmit: (values: LeadShareValues) => void;
  submitLabel?: string;
  emailReadOnly?: boolean;
  title?: string;
  header?: PageProps['header'];
  bottomNav?: PageProps['bottomNav'];
  backgroundColor?: string;
}

/**
 * Editable lead/visitor form for the share-PIN step: name, phone, email
 * (read-only by default) and license plate, plus a confirm button that emits the
 * current values. Port of balwin's `LeadSharePinScreen` with the share/toast/
 * navigation side effects lifted to the parent's `onSubmit`.
 */
export function LeadShareForm({
  initialValues,
  loading = false,
  onSubmit,
  submitLabel = 'Confirm & Share Exit Pin',
  emailReadOnly = true,
  title = 'Lead Exit',
  header,
  bottomNav,
  backgroundColor,
}: LeadShareFormProps) {
  const theme = useTheme();
  const [name, setName] = useState(initialValues?.name ?? '');
  const [number, setNumber] = useState(initialValues?.number ?? '');
  const [email, setEmail] = useState(initialValues?.email ?? '');
  const [license, setLicense] = useState(initialValues?.license ?? '');

  const handleSubmit = () => onSubmit({ name, number, email, license });

  return (
    <Page
      header={header ?? { title, noBackButton: false }}
      bottomNav={bottomNav}
      backgroundColor={backgroundColor}
    >
      <Form>
        <Input
          style={{ borderColor: theme.colors.lightGrey, color: theme.colors.text }}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <Input
          style={{ borderColor: theme.colors.lightGrey, color: theme.colors.text }}
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="Phone Number"
          type="tel"
        />
        <Input
          style={{ borderColor: theme.colors.lightGrey, color: theme.colors.textMuted }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          readOnly={emailReadOnly}
          disabled={emailReadOnly}
        />
        <Input
          style={{ borderColor: theme.colors.lightGrey, color: theme.colors.text }}
          value={license}
          onChange={(e) => setLicense(e.target.value)}
          placeholder="License Plate No"
        />
        <Button
          variant="success"
          block
          text={submitLabel}
          onClick={handleSubmit}
          loading={loading}
          disabled={loading}
          style={{ marginTop: 30 }}
        />
      </Form>
    </Page>
  );
}

const Form = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding-top: 40px;
`;
const Input = styled.input`
  height: 40px;
  margin: 12px 0;
  padding: 10px;
  width: 90%;
  border: none;
  border-bottom: 1px solid;
  background: transparent;
  font-size: 14px;
  outline: none;
`;
