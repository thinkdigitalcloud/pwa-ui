import styled from 'styled-components';
import { AuthLayout, AuthTextField, AuthPasswordField } from '../AuthLayout';
import { Select } from '../Select';
import { Toggle } from '../Toggle';
import { Button } from '../Button';
import { Text } from '../Text';
import { useResolvedTheme } from '../../theme/useResolvedTheme';

export interface SignUpValues {
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email: string;
  userType: string;
  estate: string;
  password: string;
  confirmPassword: string;
}

export type SignUpErrors = Partial<Record<keyof SignUpValues | 'privacy', string>>;

export interface SignUpPageProps {
  values: SignUpValues;
  onChange: (field: keyof SignUpValues, value: string) => void;
  errors?: SignUpErrors;

  /** User-type options (e.g. Residential / Work). */
  userTypeOptions?: { label: string; value: string }[];
  /** Estate names for the estate picker. */
  estateOptions?: string[];
  /**
   * userType value that requires an estate. The estate field is shown only when
   * the selected userType matches. Defaults to the first userType option.
   */
  residentValue?: string;

  privacyAccepted: boolean;
  onPrivacyToggle: (value: boolean) => void;
  onViewTerms?: () => void;
  onViewPrivacy?: () => void;

  onSubmit: () => void;
  onBack?: () => void;
  loading?: boolean;

  title?: string;
  submitLabel?: string;
  labels?: Partial<Record<keyof SignUpValues, string>>;
  acceptText?: string;
}

const DEFAULT_USER_TYPES = [
  { label: 'Residential', value: 'Residential' },
  { label: 'Work', value: 'Work' },
];

const DEFAULT_LABELS: Record<keyof SignUpValues, string> = {
  firstName: 'First Name',
  lastName: 'Last Name',
  mobileNumber: 'Mobile Number',
  email: 'Email',
  userType: 'User Type',
  estate: 'Estate',
  password: 'Password',
  confirmPassword: 'Re-Type Password',
};

/**
 * Sign Up screen — the apps' 8-field registration form (name, surname, mobile,
 * email, user type, conditional estate, password, confirm) plus terms links and
 * an accept toggle. Presentational: values/errors and every action come from
 * props; the estate field shows when userType === `residentValue`.
 */
export function SignUpPage({
  values,
  onChange,
  errors = {},
  userTypeOptions = DEFAULT_USER_TYPES,
  estateOptions = [],
  residentValue,
  privacyAccepted,
  onPrivacyToggle,
  onViewTerms,
  onViewPrivacy,
  onSubmit,
  onBack,
  loading = false,
  title = 'Sign Up',
  submitLabel = 'Sign up',
  labels,
  acceptText = 'Accept Terms & Conditions and Privacy Policy',
}: SignUpPageProps) {
  const theme = useResolvedTheme();
  const l = { ...DEFAULT_LABELS, ...labels };
  const residentVal = residentValue ?? userTypeOptions[0]?.value;
  const showEstate = values.userType === residentVal;

  return (
    <AuthLayout title={title} loading={loading} onBack={onBack}>
      <AuthTextField label={l.firstName} value={values.firstName} maxLength={50} error={errors.firstName} onChange={(v) => onChange('firstName', v)} />
      <AuthTextField label={l.lastName} value={values.lastName} maxLength={50} error={errors.lastName} onChange={(v) => onChange('lastName', v)} />
      <AuthTextField label={l.mobileNumber} type="tel" value={values.mobileNumber} maxLength={15} error={errors.mobileNumber} onChange={(v) => onChange('mobileNumber', v)} />
      <AuthTextField label={l.email} type="email" autoComplete="email" value={values.email} error={errors.email} onChange={(v) => onChange('email', v)} />

      <Field>
        <Text variant="label" color={theme.colors.darkGrey}>{l.userType}</Text>
        <Select
          placeholder="Select user type"
          title="Select User Type"
          value={values.userType}
          options={userTypeOptions}
          invalid={Boolean(errors.userType)}
          onChange={(v) => onChange('userType', v)}
        />
        {errors.userType && <Text variant="small" color={theme.colors.danger}>{errors.userType}</Text>}
      </Field>

      {showEstate && (
        <Field>
          <Text variant="label" color={theme.colors.darkGrey}>{l.estate}</Text>
          <Select
            placeholder="Select an estate"
            title="Select an Estate"
            value={values.estate}
            options={estateOptions.map((name) => ({ label: name, value: name }))}
            invalid={Boolean(errors.estate)}
            onChange={(v) => onChange('estate', v)}
          />
          {errors.estate && <Text variant="small" color={theme.colors.danger}>{errors.estate}</Text>}
        </Field>
      )}

      <AuthPasswordField label={l.password} autoComplete="new-password" value={values.password} maxLength={20} error={errors.password} onChange={(v) => onChange('password', v)} />
      <AuthPasswordField label={l.confirmPassword} autoComplete="new-password" value={values.confirmPassword} maxLength={20} error={errors.confirmPassword} onChange={(v) => onChange('confirmPassword', v)} />

      <Policy>
        {onViewTerms && (
          <LinkButton type="button" onClick={onViewTerms} style={{ color: theme.colors.secondary }}>
            View Terms &amp; Conditions
          </LinkButton>
        )}
        {onViewPrivacy && (
          <LinkButton type="button" onClick={onViewPrivacy} style={{ color: theme.colors.secondary }}>
            View Privacy Policy
          </LinkButton>
        )}
        <AcceptRow>
          <Text variant="body" color={theme.colors.text} style={{ flex: 1, paddingRight: 10 }}>
            {acceptText}
          </Text>
          <Toggle value={privacyAccepted} onChange={onPrivacyToggle} trackColor={{ true: theme.colors.success }} aria-label={acceptText} />
        </AcceptRow>
        {errors.privacy && <Text variant="small" color={theme.colors.danger}>{errors.privacy}</Text>}
      </Policy>

      <Button text={submitLabel} block uppercase={false} disabled={loading} onClick={onSubmit} style={{ marginTop: 8 }} />
    </AuthLayout>
  );
}

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`;

const Policy = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  margin-top: 6px;
`;

const AcceptRow = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const LinkButton = styled.button`
  align-self: flex-start;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 13px;
  text-decoration: underline;
  padding: 0;
`;
