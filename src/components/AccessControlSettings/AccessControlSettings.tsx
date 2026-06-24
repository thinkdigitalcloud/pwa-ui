import { useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { Page, type PageProps } from '../Page';
import { Spinner } from '../Spinner';
import { Text } from '../Text';
import { PreferenceToggleRow } from '../PreferenceToggleRow';
import { VirtualNumericKeyboard } from '../VirtualNumericKeyboard';

const DEFAULT_FACE_IMAGE =
  'https://storage.googleapis.com/tdglobal-dev/public/defaultProfile.png';

/** Face-enrolment slot returned by the access profile. */
export interface AccessFaceProfile {
  faceFront?: string;
  faceLeft?: string;
  faceRight?: string;
  mediaId?: string;
  personId?: string;
}

export interface AccessDiagnostics {
  beaconId?: string;
  allowed?: boolean;
  advertising?: boolean;
}

export interface AccessControlSettingsProps {
  /** True → authenticate against an existing PIN; false → create + confirm a new one. */
  hasPin: boolean;
  /**
   * Parametrized PIN check. Receives the entered PIN and returns (sync or async)
   * whether it is correct. Used in the authenticate flow (`hasPin` true).
   */
  verifyPin: (pin: string) => boolean | Promise<boolean>;
  /** Persist a newly created PIN (create flow, `hasPin` false). */
  onSetPin?: (pin: string) => void | Promise<void>;
  /** Number of digits in the PIN. */
  pinLength?: number;
  /** Render already past the PIN gate. */
  initialAuthenticated?: boolean;

  /** Blocking spinner (initial load / while saving). */
  loading?: boolean;

  /* ---- Settings (shown once authenticated) ---- */
  bluetooth?: boolean;
  location?: boolean;
  onBluetoothChange?: (value: boolean) => void;
  onLocationChange?: (value: boolean) => void;
  accessLocations?: Array<string | { name?: string }>;
  faceProfile?: AccessFaceProfile | null;
  diagnostics?: AccessDiagnostics;

  /* ---- Copy ---- */
  supportEmail?: string;
  emptyProfileText?: string;
  defaultFaceImage?: string;

  title?: string;
  header?: PageProps['header'];
  bottomNav?: PageProps['bottomNav'];
  backgroundColor?: string;
}

/**
 * The `/access` "Access Control Settings" screen. A PIN gate (create+confirm a
 * new PIN, or authenticate an existing one via the parametrized `verifyPin`)
 * protects the settings sections (permissions, access locations, face profile,
 * gallagher) and a diagnostics modal. All data and the PIN check come from the
 * parent; entry/auth state is managed internally.
 */
export function AccessControlSettings({
  hasPin,
  verifyPin,
  onSetPin,
  pinLength = 4,
  initialAuthenticated = false,
  loading = false,
  bluetooth = false,
  location = false,
  onBluetoothChange,
  onLocationChange,
  accessLocations = [],
  faceProfile = null,
  diagnostics,
  supportEmail = 'support@thinkdigital.co.za',
  emptyProfileText = 'No section profile available. Access Control will not work if not setup correctly. Please contact your Estate Manager for assistance',
  defaultFaceImage = DEFAULT_FACE_IMAGE,
  title = 'Access Control Settings',
  header,
  bottomNav,
  backgroundColor,
}: AccessControlSettingsProps) {
  const theme = useTheme();
  const [authenticated, setAuthenticated] = useState(initialAuthenticated);
  const [pin, setPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState(false);
  const [newPinSecondTime, setNewPinSecondTime] = useState('');
  const [pinIncorrect, setPinIncorrect] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  const resetCreate = () => {
    setNewPin('');
    setNewPinSecondTime('');
    setConfirmNewPin(false);
    setPinIncorrect(true);
  };

  // Authenticate flow: verify once the PIN is fully entered.
  useEffect(() => {
    if (!hasPin || pin.length !== pinLength) return;
    let cancelled = false;
    const entered = pin;
    setPin('');
    Promise.resolve(verifyPin(entered)).then((ok) => {
      if (cancelled) return;
      if (ok) setAuthenticated(true);
      else setPinIncorrect(true);
    });
    return () => {
      cancelled = true;
    };
  }, [pin, hasPin, pinLength, verifyPin]);

  // Create flow: first entry → ask to confirm.
  useEffect(() => {
    if (!hasPin) setConfirmNewPin(newPin.length === pinLength);
  }, [newPin, hasPin, pinLength]);

  // Create flow: confirm entry → save if it matches.
  useEffect(() => {
    if (hasPin || newPinSecondTime.length !== pinLength) return;
    if (newPinSecondTime === newPin) {
      Promise.resolve(onSetPin?.(newPinSecondTime))
        .then(() => setAuthenticated(true))
        .catch(resetCreate);
    } else {
      resetCreate();
    }
  }, [newPinSecondTime, newPin, hasPin, pinLength, onSetPin]);

  const renderPinGate = () => {
    const creating = !hasPin;
    const onConfirmStage = creating && confirmNewPin;
    const value = creating ? (onConfirmStage ? newPinSecondTime : newPin) : pin;
    const setValue = creating
      ? onConfirmStage
        ? setNewPinSecondTime
        : setNewPin
      : setPin;

    let heading = 'Authentication Required';
    let prompt = `Please Enter ${pinLength}-Digit Pin:`;
    if (creating) {
      heading = onConfirmStage ? "You're Almost Set" : 'Access Control Authentication';
      prompt = onConfirmStage
        ? `Please re-enter your ${pinLength}-digit pin below to confirm:`
        : `Please create a ${pinLength}-digit pin:`;
    }

    return (
      <PinWrap>
        <Heading color={theme.colors.text}>{heading}</Heading>
        <Prompt color={theme.colors.text}>{prompt}</Prompt>
        {pinIncorrect && (
          <Text variant="small" color={theme.colors.danger}>
            Pin Incorrect. Please try again
          </Text>
        )}
        <Dots aria-hidden>
          {Array.from({ length: pinLength }).map((_, i) => (
            <Dot key={i} $filled={i < value.length} $color={theme.colors.text} />
          ))}
        </Dots>
        <VirtualNumericKeyboard
          onKeyPress={(d) => {
            setPinIncorrect(false);
            setValue((v) => (v.length < pinLength ? v + d : v));
          }}
          onDelete={() => setValue((v) => v.slice(0, -1))}
        />
        {!creating && (
          <Support color={theme.colors.text}>
            {`Forgot pin? Please contact ${supportEmail} for assistance.`}
          </Support>
        )}
      </PinWrap>
    );
  };

  const renderEmpty = () => (
    <Text variant="small" color={theme.colors.text} style={{ marginTop: 5 }}>
      {emptyProfileText}
    </Text>
  );

  const renderSettings = () => (
    <>
      <Section>
        <SectionHeading color={theme.colors.text}>Permissions</SectionHeading>
        <FullBleed>
          <PreferenceToggleRow
            label="Bluetooth"
            value={bluetooth}
            onChange={(v) => onBluetoothChange?.(v)}
            thumbColor="#fff"
            trackColor={{ true: theme.colors.danger, false: '#d3d3d3' }}
            indent={20}
            noDivider
          />
          <PreferenceToggleRow
            label="Location"
            value={location}
            onChange={(v) => onLocationChange?.(v)}
            thumbColor="#fff"
            trackColor={{ true: theme.colors.danger, false: '#d3d3d3' }}
            indent={20}
            noDivider
          />
        </FullBleed>
      </Section>

      <Section>
        <SectionHeading color={theme.colors.text}>Access Locations</SectionHeading>
        {accessLocations.length > 0
          ? accessLocations.map((loc, i) => (
              <Text
                key={`loc_${i}`}
                variant="small"
                color={theme.colors.text}
                style={{ marginTop: 5 }}
              >
                {typeof loc === 'string' ? loc : loc?.name || ''}
              </Text>
            ))
          : renderEmpty()}
      </Section>

      <Section>
        <SectionHeading color={theme.colors.text}>Face Profile</SectionHeading>
        {faceProfile ? (
          <>
            <FaceRow>
              {(['faceFront', 'faceLeft', 'faceRight'] as const).map((slot, i) => (
                <FaceCol key={slot}>
                  <Text variant="small" color={theme.colors.text}>
                    {['Front', 'Left', 'Right'][i]}
                  </Text>
                  <FaceImg src={faceProfile[slot] || defaultFaceImage} alt={slot} />
                </FaceCol>
              ))}
            </FaceRow>
            <Row>
              <Text color={theme.colors.text}>Media ID</Text>
              <Text variant="small" color={theme.colors.text} style={{ width: '50%', textAlign: 'right' }}>
                {faceProfile.mediaId || ''}
              </Text>
            </Row>
            <Row>
              <Text color={theme.colors.text}>Person ID</Text>
              <Text variant="small" color={theme.colors.text} style={{ width: '50%', textAlign: 'right' }}>
                {faceProfile.personId || ''}
              </Text>
            </Row>
          </>
        ) : (
          renderEmpty()
        )}
      </Section>

      <Section>
        <SectionHeading color={theme.colors.text}>Gallagher Profile</SectionHeading>
        {renderEmpty()}
      </Section>

      <DiagnosticsButton type="button" onClick={() => setShowDiagnostics(true)}>
        Diagnostics
      </DiagnosticsButton>
    </>
  );

  return (
    <Page
      header={header ?? { title, noBackButton: false }}
      bottomNav={bottomNav}
      backgroundColor={backgroundColor}
      padded={false}
    >
      <Container>
        {loading ? (
          <LoadingWrap>
            <Spinner size={30} color={theme.colors.primary} text="Loading" />
          </LoadingWrap>
        ) : authenticated ? (
          renderSettings()
        ) : (
          renderPinGate()
        )}
      </Container>

      {showDiagnostics && (
        <Backdrop onClick={() => setShowDiagnostics(false)}>
          <DiagSheet onClick={(e) => e.stopPropagation()}>
            <DiagTitle color={theme.colors.text}>User Bluetooth Config</DiagTitle>
            <DiagRow>
              <Text color={theme.colors.text}>Beacon ID:</Text>
              <Text color={theme.colors.text}>{diagnostics?.beaconId || '-'}</Text>
            </DiagRow>
            <DiagRow>
              <Text color={theme.colors.text}>Allowed:</Text>
              <Text color={theme.colors.text}>{(diagnostics?.allowed ?? bluetooth) ? 'true' : 'false'}</Text>
            </DiagRow>
            <DiagRow>
              <Text color={theme.colors.text}>Bluetooth Advertising:</Text>
              <Text color={theme.colors.text}>{diagnostics?.advertising ? 'true' : 'false'}</Text>
            </DiagRow>
            <CloseButton type="button" $bg={theme.colors.primary} onClick={() => setShowDiagnostics(false)}>
              Close
            </CloseButton>
          </DiagSheet>
        </Backdrop>
      )}
    </Page>
  );
}

const Container = styled.div`
  width: 100%;
  min-height: 100%;
  box-sizing: border-box;
  padding: 20px;
`;

const LoadingWrap = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const PinWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 16px;
`;

const Heading = styled(Text)`
  font-size: 16px;
  line-height: 22px;
  font-weight: ${({ theme }) => theme.typography.weightBold};
  text-align: center;
  width: 100%;
  margin-top: 4px;
`;

const Prompt = styled(Text)`
  text-align: center;
`;

const Dots = styled.div`
  display: flex;
  gap: 14px;
  min-height: 16px;
  align-items: center;
`;

const Dot = styled.span<{ $filled: boolean; $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1.5px solid ${({ $color }) => $color};
  background: ${({ $filled, $color }) => ($filled ? $color : 'transparent')};
`;

const Support = styled(Text)`
  text-align: center;
  font-size: 12px;
  margin-top: 6px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px 0;
  border-bottom: 1px solid #eee;
`;

/* Let the permission tiles span to the page edges (cancelling the Container's
   20px padding) so they read identically to the Notification Preferences tile —
   full-width divider with 20px internal padding. */
const FullBleed = styled.div`
  margin: 0 -20px;
`;

const SectionHeading = styled(Text)`
  font-size: 16px;
  font-weight: ${({ theme }) => theme.typography.weightBold};
  margin-bottom: 10px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 5px;
`;

const FaceRow = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-top: 5px;
`;

const FaceCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FaceImg = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 10px;
  object-fit: cover;
  margin-top: 5px;
`;

const DiagnosticsButton = styled.button`
  width: 100%;
  margin: 20px 0;
  border: none;
  border-radius: 10px;
  padding: 12px;
  background: green;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
`;

const DiagSheet = styled.div`
  width: 90%;
  max-width: 480px;
  background: #fff;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  padding: 0 16px;
`;

const DiagTitle = styled(Text)`
  text-align: center;
  margin: 20px 0;
`;

const DiagRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
`;

const CloseButton = styled.button<{ $bg: string }>`
  width: 90%;
  align-self: center;
  border: none;
  border-radius: 10px;
  padding: 12px;
  margin: 30px 0;
  background: ${({ $bg }) => $bg};
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
`;
