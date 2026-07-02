import styled from 'styled-components';
import { AuthLayout, AuthTextField, AuthPasswordField } from '../AuthLayout';
import { Button } from '../Button';
import { Text } from '../Text';
import { useResolvedTheme } from '../../theme/useResolvedTheme';
import { Brand, BrandScope } from '../../theme/brands';

export interface SignInPageProps {
  logo?: string;
  email: string;
  onEmailChange: (value: string) => void;
  password: string;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
  onSignUp?: () => void;
  onForgotPassword?: () => void;
  onHelp?: () => void;
  loading?: boolean;
  error?: string;
  /** App version string shown at the bottom. */
  version?: string;

  emailLabel?: string;
  passwordLabel?: string;
  signInLabel?: string;
  signUpLabel?: string;
  forgotLabel?: string;
  helpLabel?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  /** Render with a specific brand's theme, overriding the ambient BrandProvider. */
  brand?: Brand;
}

function SignInPageContent({
  logo,
  email,
  onEmailChange,
  password,
  onPasswordChange,
  onSubmit,
  onSignUp,
  onForgotPassword,
  onHelp,
  loading = false,
  error,
  version,
  emailLabel = 'Email',
  passwordLabel = 'Password',
  signInLabel = 'Login',
  signUpLabel = 'Sign Up',
  forgotLabel = 'Forgot Password?',
  helpLabel = 'Need Some Help?',
  backgroundColor,
  backgroundImage,
}: SignInPageProps) {
  const theme = useResolvedTheme();

  const footer = (
    <>
      <Links>
        {onForgotPassword && (
          <LinkButton type="button" onClick={onForgotPassword} style={{ color: theme.colors.secondary }}>
            {forgotLabel}
          </LinkButton>
        )}
        {onHelp && (
          <LinkButton type="button" onClick={onHelp} style={{ color: theme.colors.secondary }}>
            {helpLabel}
          </LinkButton>
        )}
      </Links>
      {version && <Text variant="small" color={theme.colors.textMuted}>{version}</Text>}
    </>
  );

  return (
    <AuthLayout
      logo={logo}
      error={error}
      loading={loading}
      footer={footer}
      backgroundColor={backgroundColor}
      backgroundImage={backgroundImage}
    >
      <AuthTextField label={emailLabel} type="email" autoComplete="email" value={email} onChange={onEmailChange} />
      <AuthPasswordField label={passwordLabel} autoComplete="current-password" value={password} onChange={onPasswordChange} onEnter={onSubmit} />
      <ButtonRow>
        {onSignUp && (
          <Half>
            <Button text={signUpLabel} block variant="success" uppercase={false} onClick={onSignUp} />
          </Half>
        )}
        <Half>
          <Button text={signInLabel} block variant="primary" uppercase={false} disabled={loading} onClick={onSubmit} />
        </Half>
      </ButtonRow>
    </AuthLayout>
  );
}

/**
 * Sign In screen (email + password) — presentational. Inputs are controlled via
 * props; submit / sign-up / forgot-password / help are callbacks. Composes
 * `AuthLayout`.
 */
export function SignInPage({ brand, ...props }: SignInPageProps) {
  return (
    <BrandScope brand={brand}>
      <SignInPageContent {...props} />
    </BrandScope>
  );
}

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
  margin-top: 8px;
`;

const Half = styled.div`
  flex: 1;
`;

const Links = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;

const LinkButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 13px;
  text-decoration: underline;
`;
