import { AuthLayout, AuthTextField } from '../AuthLayout';
import { Button } from '../Button';

export interface ForgotPasswordPageProps {
  email: string;
  onEmailChange: (value: string) => void;
  onSubmit: () => void;
  onBack?: () => void;
  loading?: boolean;
  error?: string;
  title?: string;
  subtitle?: string;
  emailLabel?: string;
  emailPlaceholder?: string;
  submitLabel?: string;
  /** Disable the submit button (e.g. until the email is valid). */
  submitDisabled?: boolean;
}

/**
 * Forgot Password screen — title/subtitle + a single email field + submit.
 * Presentational; the email is controlled and submit is a callback.
 */
export function ForgotPasswordPage({
  email,
  onEmailChange,
  onSubmit,
  onBack,
  loading = false,
  error,
  title = 'Forgot your password?',
  subtitle = 'Enter your email address and we will send you instructions to reset your password.',
  emailLabel = 'Email',
  emailPlaceholder = 'Enter email',
  submitLabel = 'Send reset link',
  submitDisabled = false,
}: ForgotPasswordPageProps) {
  return (
    <AuthLayout title={title} subtitle={subtitle} loading={loading} onBack={onBack}>
      <AuthTextField
        label={emailLabel}
        type="email"
        autoComplete="email"
        placeholder={emailPlaceholder}
        value={email}
        error={error}
        onChange={onEmailChange}
        onEnter={onSubmit}
      />
      <Button text={submitLabel} block uppercase={false} disabled={loading || submitDisabled} onClick={onSubmit} style={{ marginTop: 16 }} />
    </AuthLayout>
  );
}
