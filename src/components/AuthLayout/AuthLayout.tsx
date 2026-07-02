import React, { useState } from 'react';
import styled from 'styled-components';
import { FiArrowLeft, FiEye, FiEyeOff } from 'react-icons/fi';
import { Text } from '../Text';
import { Spinner } from '../Spinner';
import { useResolvedTheme } from '../../theme/useResolvedTheme';

export interface AuthLayoutProps {
  /** Brand logo shown at the top. */
  logo?: string;
  title?: string;
  subtitle?: string;
  /** Error banner shown above the form. */
  error?: string;
  /** Centred loading overlay. */
  loading?: boolean;
  /** Back arrow (top-left); omit to hide. */
  onBack?: () => void;
  /** Footer content (links, version). */
  footer?: React.ReactNode;
  backgroundColor?: string;
  backgroundImage?: string;
  children: React.ReactNode;
}

/**
 * Presentational shell for the auth screens (Sign In / Sign Up / Forgot
 * Password): a scrollable, centred column with an optional logo, title/subtitle,
 * error banner, loading overlay, form body and footer. No auth logic — the
 * concrete pages compose this and report actions via callbacks.
 */
export function AuthLayout({
  logo,
  title,
  subtitle,
  error,
  loading = false,
  onBack,
  footer,
  backgroundColor,
  backgroundImage,
  children,
}: AuthLayoutProps) {
  const theme = useResolvedTheme();
  const bg = backgroundColor ?? theme.colors.background;

  return (
    <Shell style={{ background: bg, backgroundImage: backgroundImage ? `url("${backgroundImage}")` : undefined }}>
      {loading && <Spinner fullscreen size={30} color={theme.colors.danger} text="Loading" />}
      {onBack && (
        <BackButton type="button" aria-label="Back" onClick={onBack} style={{ color: theme.colors.text }}>
          <FiArrowLeft size={24} />
        </BackButton>
      )}
      <Body>
        {logo && <Logo src={logo} alt="logo" />}
        {title && (
          <Text variant="title" color={theme.colors.text} style={{ textAlign: 'center' }}>
            {title}
          </Text>
        )}
        {subtitle && (
          <Text variant="body" color={theme.colors.textMuted} style={{ textAlign: 'center', marginTop: 6 }}>
            {subtitle}
          </Text>
        )}
        {error && (
          <ErrorBanner style={{ background: `${theme.colors.danger}1A`, color: theme.colors.danger }}>
            {error}
          </ErrorBanner>
        )}
        <Form>{children}</Form>
      </Body>
      {footer && <Footer>{footer}</Footer>}
    </Shell>
  );
}

/** Labelled underline text input with an optional inline error (auth forms). */
export interface AuthTextFieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'tel';
  placeholder?: string;
  autoComplete?: string;
  error?: string;
  maxLength?: number;
  disabled?: boolean;
  onEnter?: () => void;
}

export function AuthTextField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  autoComplete,
  error,
  maxLength,
  disabled,
  onEnter,
}: AuthTextFieldProps) {
  const theme = useResolvedTheme();
  return (
    <FieldWrap>
      {label && <Text variant="label" color={theme.colors.darkGrey}>{label}</Text>}
      <Input
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        maxLength={maxLength}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' && onEnter) onEnter(); }}
        style={{ color: theme.colors.text, borderBottomColor: error ? theme.colors.danger : theme.colors.border, fontFamily: theme.typography.fontFamily }}
      />
      {error && <Text variant="small" color={theme.colors.danger}>{error}</Text>}
    </FieldWrap>
  );
}

/** Labelled password input with a show/hide eye toggle + inline error. */
export interface AuthPasswordFieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
  maxLength?: number;
  onEnter?: () => void;
}

export function AuthPasswordField({
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
  error,
  maxLength,
  onEnter,
}: AuthPasswordFieldProps) {
  const theme = useResolvedTheme();
  const [hidden, setHidden] = useState(true);
  return (
    <FieldWrap>
      {label && <Text variant="label" color={theme.colors.darkGrey}>{label}</Text>}
      <PasswordRow style={{ borderBottomColor: error ? theme.colors.danger : theme.colors.border }}>
        <BareInput
          type={hidden ? 'password' : 'text'}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          maxLength={maxLength}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && onEnter) onEnter(); }}
          style={{ color: theme.colors.text, fontFamily: theme.typography.fontFamily }}
        />
        <EyeButton type="button" aria-label={hidden ? 'Show password' : 'Hide password'} onClick={() => setHidden((h) => !h)} style={{ color: theme.colors.textMuted }}>
          {hidden ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </EyeButton>
      </PasswordRow>
      {error && <Text variant="small" color={theme.colors.danger}>{error}</Text>}
    </FieldWrap>
  );
}

const Shell = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  height: 100%;
  overflow-y: auto;
  background-size: cover;
  background-position: center;
  padding: 24px 8%;
  box-sizing: border-box;
`;

const BackButton = styled.button`
  position: absolute;
  top: 16px;
  left: 12px;
  border: none;
  background: transparent;
  display: flex;
  cursor: pointer;
  padding: 8px;
`;

const Body = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  gap: 8px;
`;

const Logo = styled.img`
  max-width: 60%;
  max-height: 120px;
  object-fit: contain;
  margin-bottom: 12px;
`;

const ErrorBanner = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 13px;
  text-align: center;
  margin-top: 8px;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  margin-top: 16px;
`;

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
  max-width: 420px;
  margin: 16px auto 0;
`;

const FieldWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  background: transparent;
  border: none;
  border-bottom: 1px solid;
  outline: none;
  padding: 6px 0;
  font-size: 15px;
`;

const PasswordRow = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid;
`;

const BareInput = styled.input`
  flex: 1;
  min-width: 0;
  background: transparent;
  border: none;
  outline: none;
  padding: 6px 0;
  font-size: 15px;
`;

const EyeButton = styled.button`
  border: none;
  background: transparent;
  display: flex;
  cursor: pointer;
  padding: 4px;
`;
