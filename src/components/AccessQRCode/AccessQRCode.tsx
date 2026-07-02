import QRCode from 'react-qr-code';
import styled from 'styled-components';
import { Avatar } from '../Avatar';
import { Text } from '../Text';
import { Spinner } from '../Spinner';
import { useResolvedTheme } from '../../theme/useResolvedTheme';

export interface AccessQRCodeProps {
  /**
   * The encoded value (access URL/token). The host app builds and periodically
   * refreshes this (timestamp, encryption, geo, etc.) — this component just
   * renders it.
   */
  value?: string;
  /** QR size in px. */
  size?: number;
  /** Show the loading spinner instead of the QR. */
  loading?: boolean;
  /** When false, the not-permitted message is shown instead of the QR. */
  permitted?: boolean;
  /** Message shown when not permitted (or when there is no value). */
  message?: string;
  /** Optional profile header above the QR. */
  showProfile?: boolean;
  name?: string;
  photoUrl?: string;
  roleLabel?: string;
  estateLabel?: string;
  /** QR foreground colour; defaults to the theme text colour. */
  fgColor?: string;
  /** QR background colour. */
  bgColor?: string;
}

/**
 * Access-control QR code (the apps' `AccessQRCode`) — presentational only. The
 * value string (with its timestamp/encryption/proximity logic) is built and
 * refreshed by the host app and passed in; this renders the QR with an optional
 * profile header and loading / not-permitted states.
 */
export function AccessQRCode({
  value,
  size = 220,
  loading = false,
  permitted = true,
  message = 'You are not permitted to access this estate.',
  showProfile = false,
  name,
  photoUrl,
  roleLabel,
  estateLabel,
  fgColor,
  bgColor = '#FFFFFF',
}: AccessQRCodeProps) {
  const theme = useResolvedTheme();
  const fg = fgColor ?? theme.colors.text;

  return (
    <Wrapper>
      {showProfile && (
        <Profile>
          <Avatar src={photoUrl} name={name} size={64} />
          <ProfileText>
            {name && <Text variant="bodyBold" color={theme.colors.text}>{name}</Text>}
            {roleLabel && <Text variant="small" color={theme.colors.textMuted}>{roleLabel}</Text>}
            {estateLabel && <Text variant="small" color={theme.colors.textMuted}>{estateLabel}</Text>}
          </ProfileText>
        </Profile>
      )}
      <QrBox $size={size}>
        {loading ? (
          <Spinner size={30} color={theme.colors.primary} />
        ) : permitted && value ? (
          <QRCode value={value} size={size} fgColor={fg} bgColor={bgColor} style={{ height: 'auto', maxWidth: '100%', width: '100%' }} />
        ) : (
          <Message color={theme.colors.text}>{message}</Message>
        )}
      </QrBox>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
`;

const ProfileText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const QrBox = styled.div<{ $size: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ $size }) => $size}px;
  max-width: 100%;
  min-height: ${({ $size }) => $size}px;
`;

const Message = styled.p<{ color: string }>`
  margin: 0;
  text-align: center;
  color: ${({ color }) => color};
`;
