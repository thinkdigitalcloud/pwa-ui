import { useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { Page, type PageProps } from '../Page';
import { ListRow } from '../ListRow';
import { Button } from '../Button';
import { Modal } from '../Modal';
import { Text } from '../Text';
import { OtpInput } from '../OtpInput';

/** Result of validating the delete-account OTP. */
export type OtpResult = 'VERIFIED' | 'INCORRECT' | 'EXPIRED' | 'INVALID';

export interface PersonalInfoMenuItem {
  key: string;
  label: string;
}

export interface PersonalInformationProps {
  /** Menu rows. Defaults to Addresses / Accounts / Contacts / Vehicles. */
  menuItems?: PersonalInfoMenuItem[];
  /** Navigate to a menu item. */
  onSelect: (key: string) => void;

  /** Email shown in the OTP message. */
  email?: string;
  /** Request a delete-account OTP. Resolve `true` on success. */
  onSendOtp?: () => boolean | Promise<boolean>;
  /** Validate the entered OTP — parametrized check. */
  onVerifyOtp?: (code: string) => OtpResult | Promise<OtpResult>;
  /** Called once the OTP is VERIFIED — perform the account deletion. */
  onDeleteConfirmed?: () => void | Promise<void>;

  otpLength?: number;
  deleteAccountLabel?: string;
  loading?: boolean;
  title?: string;
  header?: PageProps['header'];
  bottomNav?: PageProps['bottomNav'];
  backgroundColor?: string;
}

const DEFAULT_MENU: PersonalInfoMenuItem[] = [
  { key: 'Addresses', label: 'Addresses' },
  { key: 'Accounts', label: 'Accounts' },
  { key: 'Contacts', label: 'Contacts' },
  { key: 'Vehicles', label: 'Vehicles' },
];

type Stage = 'none' | 'warning' | 'otp' | 'error';

/**
 * The `/PersonalInformation` screen: a menu into the profile sub-lists plus a
 * Delete Account flow (warning → OTP verification → deletion). The OTP send /
 * verify / delete side-effects are parametrised callbacks; the modal state
 * machine is handled internally.
 */
export function PersonalInformation({
  menuItems = DEFAULT_MENU,
  onSelect,
  email = '',
  onSendOtp,
  onVerifyOtp,
  onDeleteConfirmed,
  otpLength = 6,
  deleteAccountLabel = 'Delete Account',
  loading = false,
  title = 'Personal Information',
  header,
  bottomNav,
  backgroundColor,
}: PersonalInformationProps) {
  const theme = useTheme();
  const danger = theme.colors.danger;
  const confirm = theme.colors.secondary;

  const [stage, setStage] = useState<Stage>('none');
  const [otp, setOtp] = useState('');
  const [otpMessage, setOtpMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const close = () => {
    setStage('none');
    setOtp('');
  };

  const onWarningConfirm = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const ok = (await onSendOtp?.()) ?? true;
      if (ok) {
        setOtp('');
        setOtpMessage(`We have sent an OTP code to ${email}`);
        setStage('otp');
      } else {
        setErrorMessage('Unable to send OTP. Please try again later.');
        setStage('error');
      }
    } finally {
      setBusy(false);
    }
  };

  const onOtpConfirm = async () => {
    if (busy || otp.length !== otpLength) return;
    setBusy(true);
    try {
      const result = (await onVerifyOtp?.(otp)) ?? 'VERIFIED';
      switch (result) {
        case 'VERIFIED':
          close();
          await onDeleteConfirmed?.();
          break;
        case 'INCORRECT':
          setOtp('');
          setOtpMessage('OTP is incorrect, please try again.');
          break;
        case 'EXPIRED':
          setErrorMessage('OTP has expired and is no longer valid. Request new OTP.');
          setStage('error');
          break;
        case 'INVALID':
        default:
          setErrorMessage("OTP recipients don't match. Request new OTP.");
          setStage('error');
          break;
      }
    } finally {
      setBusy(false);
    }
  };

  const twoButtons = (onCancel: () => void, onOk: () => void, okLabel = 'Confirm') => (
    <FooterRow>
      <Button text="Cancel" uppercase={false} onClick={onCancel} style={{ flex: 1, background: danger }} />
      <Button text={okLabel} uppercase={false} onClick={onOk} style={{ flex: 1, background: confirm }} />
    </FooterRow>
  );

  return (
    <Page
      header={header ?? { title, noBackButton: false }}
      bottomNav={bottomNav}
      backgroundColor={backgroundColor}
    >
      <Menu>
        {menuItems.map((item) => (
          <ListRow
            key={item.key}
            title={item.label}
            hasArrow
            arrowColor={theme.colors.text}
            onClick={() => onSelect(item.key)}
          />
        ))}
      </Menu>
      <DeleteWrap>
        <Button
          text={deleteAccountLabel}
          block
          uppercase={false}
          disabled={loading}
          onClick={() => setStage('warning')}
          style={{ background: danger, borderRadius: 10 }}
        />
      </DeleteWrap>

      {/* Warning */}
      <Modal open={stage === 'warning'} onClose={close} hideCloseButton borderRadius="24px">
        <Centered>
          <ModalTitle $color={danger}>Warning</ModalTitle>
          <Text color={theme.colors.text} style={{ textAlign: 'center' }}>
            Please note that deleting your account is irreversible. Once deleted you will no longer
            be able to log into the app.
          </Text>
          <Text color={theme.colors.text} style={{ textAlign: 'center', marginTop: 10 }}>
            Do you wish to continue?
          </Text>
        </Centered>
        {twoButtons(close, onWarningConfirm)}
      </Modal>

      {/* OTP */}
      <Modal open={stage === 'otp'} onClose={close} hideCloseButton borderRadius="24px">
        <Centered>
          <ModalTitle $color={danger}>OTP Verification</ModalTitle>
          <Text color={theme.colors.text} style={{ textAlign: 'center', marginBottom: 14 }}>
            {otpMessage}
          </Text>
          <OtpInput value={otp} onChange={setOtp} length={otpLength} autoFocus />
        </Centered>
        {twoButtons(close, onOtpConfirm)}
      </Modal>

      {/* Error */}
      <Modal open={stage === 'error'} onClose={close} hideCloseButton borderRadius="24px">
        <Centered>
          <Text color={theme.colors.text} style={{ textAlign: 'center' }}>
            {errorMessage}
          </Text>
        </Centered>
        <FooterRow>
          <Button text="Ok" uppercase={false} onClick={close} style={{ flex: 1, background: confirm }} />
        </FooterRow>
      </Modal>
    </Page>
  );
}

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
`;

const DeleteWrap = styled.div`
  width: 100%;
  padding: 0 15px;
  margin: 15px 0 50px;
  box-sizing: border-box;
`;

const Centered = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 8px 10px;
  gap: 4px;
`;

const ModalTitle = styled.span<{ $color: string }>`
  font-size: 20px;
  font-weight: 600;
  color: ${({ $color }) => $color};
  margin-bottom: 8px;
`;

const FooterRow = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
`;
