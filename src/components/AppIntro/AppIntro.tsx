import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import styled, { useTheme } from 'styled-components';
import { PiUserCirclePlus } from 'react-icons/pi';
import { Text } from '../Text';
import { Page } from '../Page';
import { Toggle } from '../Toggle';
import { SelectModal, type SelectOption } from '../SelectModal';
import { Spinner } from '../Spinner';
import { balwinTheme } from '../../theme/themes';
import type { AppTheme } from '../../theme/types';

/** Free-text identity fields (slide 2). */
export interface AppIntroInformation {
  firstName: string;
  lastName: string;
  idNumber: string;
}

/** Contact numbers (slide 3). */
export interface AppIntroContacts {
  home?: string;
  work?: string;
  cell?: string;
  emergencyContactName?: string;
  emergencyContactNumber?: string;
}

/** Address fields (slide 4). */
export interface AppIntroAddress {
  standNo?: string;
  streetNoOrUnitNo?: string;
  streetName?: string;
  suburbName?: string;
  localityOrCity?: string;
  addressPostalCode?: string;
  context?: string;
  addressType?: string;
}

/** Vehicle fields (slide 5). */
export interface AppIntroVehicle {
  make?: string;
  model?: string;
  colour?: string;
  year?: string;
  registrationNumber?: string;
  vinNumber?: string;
  licenseDiscPhotoURL?: string;
  carPhotoURL?: string;
}

/**
 * Estate option for the address slide. `estateName` is shown in the picker;
 * the optional locality fields auto-fill the address when the estate is chosen.
 */
export interface AppIntroEstate {
  estateName: string;
  suburb?: string;
  city?: string;
  code?: string;
}

/** Terms & Privacy content for the final slide (typically CMS-provided HTML). */
export interface AppIntroPolicyConfig {
  termsHeading?: string;
  termsContent?: string;
  privacyHeading?: string;
  privacyContent?: string;
  acceptButtonText?: string;
}

/** Auto-filled values applied when the user picks the "Work" address type. */
export interface AppIntroWorkDefaults {
  estate?: string;
  suburb?: string;
  city?: string;
  code?: string;
}

/** One wizard step. `form` selects which field group renders. */
export interface AppIntroSlide {
  title: string;
  text: string;
  form: 'welcome' | 'information' | 'contact' | 'address' | 'vehicle' | 'policy';
}

/**
 * Colour overrides. Anything omitted falls back to the active styled-components
 * theme, and if the component is used with no ThemeProvider, to the balwin theme.
 */
export interface AppIntroColors {
  /** Next/Done label, error banner, and vehicle toggle "on" track. */
  accent?: string;
  /** Policy-accept toggle "on" track. */
  success?: string;
  /** Body/heading/input text. */
  text?: string;
  /** Field label text. */
  labelText?: string;
  /** Page background. */
  background?: string;
  /** Active step dot. */
  activeDot?: string;
  /** Inactive step dots. */
  inactiveDot?: string;
}

/** The complete payload emitted by `onComplete`. */
export interface AppIntroData {
  information: AppIntroInformation;
  contacts: AppIntroContacts;
  address: AppIntroAddress;
  hasVehicle: boolean;
  vehicle: AppIntroVehicle | null;
  acceptedPrivacyPolicy: boolean;
}

export interface AppIntroProps {
  /** Estate options for the address picker. */
  estates?: AppIntroEstate[];
  /** Address-type options. Defaults to Residential / Work. */
  addressTypes?: { label: string; value: string }[];
  /** Terms & Privacy content shown on the final slide. */
  policyConfig?: AppIntroPolicyConfig;
  /** Values applied when the "Work" address type is selected. */
  workDefaults?: AppIntroWorkDefaults;

  /** Seed values (e.g. from the user's registration / existing profile). */
  initialInformation?: Partial<AppIntroInformation>;
  initialContacts?: Partial<AppIntroContacts>;
  initialAddress?: Partial<AppIntroAddress>;
  initialVehicle?: Partial<AppIntroVehicle> | null;
  initialAcceptedPolicy?: boolean;

  /** Illustration shown on the vehicle slide when a vehicle IS provided. */
  vehicleImage?: string;
  /** Illustration shown on the vehicle slide when "no vehicle" is checked. */
  noVehicleImage?: string;

  /** Override the slide titles/subtitles (order & count must match the flow). */
  slides?: AppIntroSlide[];

  /** Force the saving overlay (in addition to the internal await of onComplete). */
  loading?: boolean;
  /** Colour overrides; unset values fall back to the theme (balwin by default). */
  colors?: AppIntroColors;

  /** Called with the collected data when the user finishes the wizard. */
  onComplete: (data: AppIntroData) => void | Promise<void>;
  /** Notified whenever the active step changes. */
  onStepChange?: (index: number) => void;
}

const DEFAULT_ADDRESS_TYPES = [
  { label: 'Residential', value: 'Residential' },
  { label: 'Work', value: 'Work' },
];

const DEFAULT_SLIDES: AppIntroSlide[] = [
  { title: 'Welcome', text: 'Please provide more information about yourself.', form: 'welcome' },
  { title: 'Information', text: 'Please provide more information about yourself.', form: 'information' },
  { title: 'Contact', text: 'Please provide more information about yourself.', form: 'contact' },
  { title: 'Address', text: 'Please provide more information about yourself.', form: 'address' },
  { title: 'Vehicle Details', text: 'Please provide more information about yourself.', form: 'vehicle' },
  { title: 'Privacy Policy', text: 'Please provide more information about yourself.', form: 'policy' },
];

const DEFAULT_POLICY: Required<AppIntroPolicyConfig> = {
  termsHeading: 'TERMS & CONDITIONS',
  termsContent: '',
  privacyHeading: 'PRIVACY POLICY',
  privacyContent: '',
  acceptButtonText: 'Accept Terms & Conditions and Privacy Policy',
};

// Mirrors tdg-one-app phoneNumberValidation.
const PHONE_REGEX = /^((\+)[1-9][1-9]|0)[1-9](\d{2}){4}$/;
const ALL_DIGITS = /^\d+$/;

const isEmpty = (v?: string) => !v || v.trim().length === 0;

/** Resolve the styled-components theme, falling back to balwin when absent. */
function useResolvedTheme(): AppTheme {
  const raw = useTheme() as Partial<AppTheme>;
  return raw && raw.colors ? (raw as AppTheme) : balwinTheme;
}

/**
 * Multi-step onboarding wizard (Welcome → Information → Contact → Address →
 * Vehicle → Privacy Policy). Fully presentational: seed values, estate options
 * and policy content come in as props, and the collected data is handed back via
 * `onComplete` — the host app owns all persistence (API / Firestore / storage).
 */
export function AppIntro({
  estates = [],
  addressTypes = DEFAULT_ADDRESS_TYPES,
  policyConfig,
  workDefaults,
  initialInformation,
  initialContacts,
  initialAddress,
  initialVehicle,
  initialAcceptedPolicy = false,
  vehicleImage,
  noVehicleImage,
  slides = DEFAULT_SLIDES,
  loading = false,
  colors,
  onComplete,
  onStepChange,
}: AppIntroProps) {
  const t = useResolvedTheme();
  const accent = colors?.accent ?? t.colors.danger;
  const success = colors?.success ?? t.colors.success;
  const textColor = colors?.text ?? t.colors.text;
  const labelColor = colors?.labelText ?? t.colors.darkGrey;
  const background = colors?.background ?? t.colors.background;
  const activeDot = colors?.activeDot ?? t.colors.secondary;
  const inactiveDot = colors?.inactiveDot ?? t.colors.lightGrey;
  const fontFamily = t.typography.fontFamily;

  const policy = { ...DEFAULT_POLICY, ...policyConfig };

  const [information, setInformation] = useState<AppIntroInformation>({
    firstName: '',
    lastName: '',
    idNumber: '',
    ...initialInformation,
  });
  const [contactsInfo, setContactsInfo] = useState<AppIntroContacts>({
    home: '',
    work: '',
    cell: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    ...initialContacts,
  });
  const [addressInfo, setAddressInfo] = useState<AppIntroAddress>({
    standNo: '',
    streetNoOrUnitNo: '',
    streetName: '',
    suburbName: '',
    localityOrCity: '',
    addressPostalCode: '',
    context: '',
    addressType: '',
    ...initialAddress,
  });
  const [vehicle, setVehicle] = useState<AppIntroVehicle>({
    make: '',
    model: '',
    colour: '',
    registrationNumber: '',
    ...(initialVehicle ?? {}),
  });
  const [noVehicleChecked, setNoVehicleChecked] = useState(
    !initialVehicle || Object.keys(initialVehicle).length === 0,
  );
  const [acceptedPolicy, setAcceptedPolicy] = useState(initialAcceptedPolicy);
  const [activeIndex, setActiveIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const [stepError, setStepError] = useState('');

  useEffect(() => {
    onStepChange?.(activeIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  const onChangeDetails = (prop: keyof AppIntroInformation, value: string) =>
    setInformation((prev) => ({ ...prev, [prop]: value }));
  const onChangeContacts = (prop: keyof AppIntroContacts, value: string) =>
    setContactsInfo((prev) => ({ ...prev, [prop]: value }));
  const onChangeVehicle = (prop: keyof AppIntroVehicle, value: string) =>
    setVehicle((prev) => ({ ...prev, [prop]: value }));
  const patchAddress = (updates: Partial<AppIntroAddress>) =>
    setAddressInfo((prev) => ({ ...prev, ...updates }));
  const onChangeAddress = (prop: keyof AppIntroAddress, value: string) => {
    const numberList: (keyof AppIntroAddress)[] = ['standNo', 'addressPostalCode'];
    const next = numberList.includes(prop) ? value.replace(/[^0-9.]+/g, '') : value;
    patchAddress({ [prop]: next });
  };

  // RN parity: validateContactInfo
  const validateContacts = () => {
    const msg = 'may only start with a 0 or +, and must be more than 10 numbers. i.e. +278212345678';
    const { cell, home, work, emergencyContactNumber } = contactsInfo;
    if (isEmpty(cell)) return 'Please enter your cell';
    if (cell && !PHONE_REGEX.test(cell)) return `Cell number ${msg}`;
    if (!isEmpty(home) && !PHONE_REGEX.test(home!)) return `Home number ${msg}`;
    if (!isEmpty(work) && !PHONE_REGEX.test(work!)) return `Work number ${msg}`;
    if (!isEmpty(emergencyContactNumber) && !PHONE_REGEX.test(emergencyContactNumber!)) return `Emergency number ${msg}`;
    return '';
  };

  // RN parity: AppIntroScreen onNextPress per-step validation. Returns error string or ''.
  const validateStep = () => {
    if (activeIndex === 1) {
      if (isEmpty(information.firstName.replace(/\s/g, ''))) return 'Please enter your name';
      if (information.firstName.length < 2) return 'Your name should contain at least 2 characters';
      if (ALL_DIGITS.test(information.firstName.replace(/\s/gi, ''))) return 'Your name should include at least 1 alphabetical letter';
      if (isEmpty(information.lastName.replace(/\s/g, ''))) return 'Please enter your surname';
      if (information.lastName.length < 2) return 'Your surname should contain at least 2 characters';
      if (ALL_DIGITS.test(information.lastName.replace(/\s/gi, ''))) return 'Your surname should include at least 1 alphabetical letter';
      if (isEmpty(information.idNumber.replace(/\s/g, ''))) return 'Please enter your ID/Passport Number';
      if (information.idNumber.length < 6) return 'ID/Passport Number must be at least 6 characters';
    }
    if (activeIndex === 2) return validateContacts();
    if (activeIndex === 3) {
      const isResident = (addressInfo.addressType || 'residential').toLowerCase() === 'residential';
      if (isResident && isEmpty(addressInfo.standNo)) return 'Please enter your stand number';
      if (isResident && Number.isNaN(parseInt(addressInfo.standNo || '', 10))) return 'stand number must be a number';
      if (isEmpty(addressInfo.context)) return 'Please enter your estate';
      if (isEmpty((addressInfo.streetNoOrUnitNo || '').replace(/\s/g, ''))) return 'Please enter your unit/street number';
      if (Number.isNaN(parseInt(addressInfo.streetNoOrUnitNo || '', 10))) return 'Unit/Street number must start with a number';
      if (isEmpty((addressInfo.streetName || '').replace(/\s/g, ''))) return 'Please enter your street name';
      if (isEmpty((addressInfo.suburbName || '').replace(/\s/g, ''))) return 'Please enter your suburb';
      if (isEmpty((addressInfo.localityOrCity || '').replace(/\s/g, ''))) return 'Please enter your city';
      if (isEmpty((addressInfo.addressPostalCode || '').replace(/\s/g, ''))) return 'Please enter your postal code';
    }
    if (activeIndex === 4 && !noVehicleChecked) {
      if (isEmpty(vehicle.make)) return 'Please enter your vehicle make';
      if (isEmpty(vehicle.model)) return 'Please enter your vehicle model';
      if (isEmpty(vehicle.colour)) return 'Please enter your vehicle color';
      if (isEmpty(vehicle.registrationNumber)) return 'Please enter your vehicle registration number';
    }
    if (activeIndex === 5 && !acceptedPolicy) return 'Terms and conditions not accepted';
    return '';
  };

  const finish = async () => {
    setBusy(true);
    try {
      await onComplete({
        information,
        contacts: contactsInfo,
        address: {
          ...addressInfo,
          addressType: addressInfo.addressType || 'Residential',
        },
        hasVehicle: !noVehicleChecked,
        vehicle: noVehicleChecked ? null : vehicle,
        acceptedPrivacyPolicy: acceptedPolicy,
      });
    } finally {
      setBusy(false);
    }
  };

  const onNext = () => {
    const error = validateStep();
    if (error) {
      setStepError(error);
      return;
    }
    setStepError('');
    if (activeIndex === slides.length - 1) {
      finish();
      return;
    }
    setActiveIndex((i) => i + 1);
  };

  const onBack = () => {
    if (activeIndex === 0) return;
    setStepError('');
    setActiveIndex((i) => i - 1);
  };

  const slide = slides[activeIndex];
  const estateOptions: SelectOption[] = useMemo(
    () => estates.map((e) => ({ label: e.estateName, value: e.estateName })),
    [estates],
  );
  const showOverlay = loading || busy;

  return (
    <Page backgroundColor={background} padded={false}>
      {showOverlay &&
        createPortal(
          <Overlay>
            <Spinner size={30} color={accent} text="Saving" />
          </Overlay>,
          document.body,
        )}
      <Container>
        <Title variant="heading" color={textColor}>
          {slide.title}
        </Title>

        {!!stepError && (
          <Text variant="small" color={accent} style={{ marginTop: 8, textAlign: 'center' }}>
            {stepError}
          </Text>
        )}

        <StepBody>
          {slide.form === 'welcome' && (
            <Welcome>
              <PiUserCirclePlus size={120} color={textColor} />
              <Text color={textColor} style={{ textAlign: 'center', marginTop: 80 }}>
                {slide.text}
              </Text>
            </Welcome>
          )}

          {slide.form === 'information' && (
            <Form>
              <FieldInput label="Name" value={information.firstName} onChange={(v) => onChangeDetails('firstName', v)} labelColor={labelColor} textColor={textColor} font={fontFamily} />
              <FieldInput label="Surname" value={information.lastName} onChange={(v) => onChangeDetails('lastName', v)} labelColor={labelColor} textColor={textColor} font={fontFamily} />
              <FieldInput label="ID/Passport Number" value={information.idNumber} maxLength={15} onChange={(v) => onChangeDetails('idNumber', v.replace(/\s/g, ''))} labelColor={labelColor} textColor={textColor} font={fontFamily} />
            </Form>
          )}

          {slide.form === 'contact' && (
            <Form>
              <FieldInput label="Home" value={contactsInfo.home} onChange={(v) => onChangeContacts('home', v)} labelColor={labelColor} textColor={textColor} font={fontFamily} />
              <FieldInput label="Work" value={contactsInfo.work} onChange={(v) => onChangeContacts('work', v)} labelColor={labelColor} textColor={textColor} font={fontFamily} />
              <FieldInput label="Cell" value={contactsInfo.cell} onChange={(v) => onChangeContacts('cell', v)} labelColor={labelColor} textColor={textColor} font={fontFamily} />
              <FieldInput label="Emergency Contact Name" value={contactsInfo.emergencyContactName} onChange={(v) => onChangeContacts('emergencyContactName', v)} labelColor={labelColor} textColor={textColor} font={fontFamily} />
              <FieldInput label="Emergency Contact Number" value={contactsInfo.emergencyContactNumber} onChange={(v) => onChangeContacts('emergencyContactNumber', v)} labelColor={labelColor} textColor={textColor} font={fontFamily} />
            </Form>
          )}

          {slide.form === 'address' && (
            <Form>
              <FieldSelect
                label="Address Type"
                title="Select Address Type"
                placeholder="Select address type"
                value={addressInfo.addressType}
                options={addressTypes}
                labelColor={labelColor}
                textColor={textColor}
                font={fontFamily}
                onSelect={(val) => {
                  if (val === addressTypes[1]?.value) {
                    patchAddress({
                      addressType: 'Work',
                      context: workDefaults?.estate || '',
                      suburbName: workDefaults?.suburb || '',
                      localityOrCity: workDefaults?.city || '',
                      addressPostalCode: workDefaults?.code || '',
                    });
                  } else {
                    patchAddress({
                      addressType: 'Residential',
                      context: '',
                      suburbName: '',
                      localityOrCity: '',
                      addressPostalCode: '',
                    });
                  }
                }}
              />
              <FieldInput label="Stand No" value={addressInfo.standNo} onChange={(v) => onChangeAddress('standNo', v)} labelColor={labelColor} textColor={textColor} font={fontFamily} />
              <FieldSelect
                label="Estate"
                title="Select an Estate"
                placeholder="Select an estate"
                value={addressInfo.context}
                options={estateOptions}
                disabled={addressInfo.addressType === 'Work'}
                labelColor={labelColor}
                textColor={textColor}
                font={fontFamily}
                onSelect={(val) => {
                  const match = estates.find((e) => e.estateName === val);
                  patchAddress({
                    context: val,
                    suburbName: match?.suburb || addressInfo.suburbName || '',
                    localityOrCity: match?.city || addressInfo.localityOrCity || '',
                    addressPostalCode: match?.code || addressInfo.addressPostalCode || '',
                  });
                }}
              />
              <FieldInput label="Unit/Street No" value={addressInfo.streetNoOrUnitNo} onChange={(v) => onChangeAddress('streetNoOrUnitNo', v)} labelColor={labelColor} textColor={textColor} font={fontFamily} />
              <FieldInput label="Street Name" value={addressInfo.streetName} onChange={(v) => onChangeAddress('streetName', v)} labelColor={labelColor} textColor={textColor} font={fontFamily} />
              <FieldInput label="Suburb" value={addressInfo.suburbName} onChange={(v) => onChangeAddress('suburbName', v)} labelColor={labelColor} textColor={textColor} font={fontFamily} />
              <FieldInput label="City" value={addressInfo.localityOrCity} onChange={(v) => onChangeAddress('localityOrCity', v)} labelColor={labelColor} textColor={textColor} font={fontFamily} />
              <FieldInput label="Code" value={addressInfo.addressPostalCode} onChange={(v) => onChangeAddress('addressPostalCode', v)} labelColor={labelColor} textColor={textColor} font={fontFamily} />
            </Form>
          )}

          {slide.form === 'vehicle' && (
            <Form>
              {(noVehicleChecked ? noVehicleImage : vehicleImage) && (
                <VehicleImage
                  src={noVehicleChecked ? noVehicleImage : vehicleImage}
                  alt={noVehicleChecked ? 'No vehicle' : 'Vehicle'}
                  $small={noVehicleChecked}
                />
              )}
              <SwitchRow>
                <Text color={textColor} style={{ flex: 1, paddingRight: 10 }}>
                  I don&apos;t have a motorcycle or motor vehicle
                </Text>
                <Toggle value={noVehicleChecked} onChange={setNoVehicleChecked} trackColor={{ true: accent }} aria-label="No vehicle" />
              </SwitchRow>
              {noVehicleChecked ? (
                <NoteContainer>
                  <Text color={textColor} as="div" style={{ textAlign: 'center' }}>
                    Please note: To enter your development using the boom gates access control feature, we ask that you please provide your vehicle details.
                  </Text>
                  <Text color={textColor} as="div" style={{ textAlign: 'center', marginTop: 15 }}>
                    Residents who have no vehicle access will still be able to utilise pedestrian access through the turnstiles only.
                  </Text>
                </NoteContainer>
              ) : (
                <>
                  <FieldInput label="Make" value={vehicle.make} onChange={(v) => onChangeVehicle('make', v)} labelColor={labelColor} textColor={textColor} font={fontFamily} />
                  <FieldInput label="Model" value={vehicle.model} onChange={(v) => onChangeVehicle('model', v)} labelColor={labelColor} textColor={textColor} font={fontFamily} />
                  <FieldInput label="Color" value={vehicle.colour} onChange={(v) => onChangeVehicle('colour', v)} labelColor={labelColor} textColor={textColor} font={fontFamily} />
                  <FieldInput label="Registration" value={vehicle.registrationNumber} onChange={(v) => onChangeVehicle('registrationNumber', v)} labelColor={labelColor} textColor={textColor} font={fontFamily} />
                </>
              )}
            </Form>
          )}

          {slide.form === 'policy' && (
            <Form>
              <PolicyCard>
                <Text variant="bodyBold" color={textColor} style={{ fontSize: 12 }}>
                  {policy.termsHeading}
                </Text>
                <CardScroll style={{ color: textColor }} dangerouslySetInnerHTML={{ __html: policy.termsContent }} />
              </PolicyCard>
              <PolicyCard>
                <Text variant="bodyBold" color={textColor} style={{ fontSize: 12 }}>
                  {policy.privacyHeading}
                </Text>
                <CardScroll style={{ color: textColor }} dangerouslySetInnerHTML={{ __html: policy.privacyContent }} />
              </PolicyCard>
              <AcceptCard>
                <Text color={textColor} style={{ flex: 1, paddingRight: 10 }}>
                  {policy.acceptButtonText}
                </Text>
                <Toggle value={acceptedPolicy} onChange={setAcceptedPolicy} trackColor={{ true: success }} aria-label="Accept terms and privacy policy" />
              </AcceptCard>
            </Form>
          )}
        </StepBody>

        <Footer>
          <FooterButton onClick={onBack} style={{ textAlign: 'left' }}>
            {activeIndex !== 0 && <Text color={textColor}>Back</Text>}
          </FooterButton>
          <Dots>
            {slides.map((s, i) => (
              <Dot key={s.title} $color={i === activeIndex ? activeDot : inactiveDot}>
                •
              </Dot>
            ))}
          </Dots>
          <FooterButton onClick={onNext} style={{ textAlign: 'right', justifyContent: 'flex-end' }}>
            <Text variant="bodyBold" color={accent}>
              {activeIndex === slides.length - 1 ? 'Done' : 'Next'}
            </Text>
          </FooterButton>
        </Footer>
      </Container>
    </Page>
  );
}

// ---------------------------------------------------------------------------
// Internal field components (shared underlined field style)
// ---------------------------------------------------------------------------

interface FieldInputProps {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  labelColor: string;
  textColor: string;
  font: string;
  maxLength?: number;
}

function FieldInput({ label, value, onChange, labelColor, textColor, font, maxLength }: FieldInputProps) {
  return (
    <FieldContainer>
      <FieldLabelText color={labelColor}>{label}</FieldLabelText>
      <StyledInput
        value={value || ''}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        style={{ color: textColor, fontFamily: font }}
      />
    </FieldContainer>
  );
}

interface FieldSelectProps {
  label: string;
  title: string;
  placeholder: string;
  value?: string;
  options: { label: string; value: string }[];
  onSelect: (value: string) => void;
  labelColor: string;
  textColor: string;
  font: string;
  disabled?: boolean;
}

function FieldSelect({ label, title, placeholder, value, options, onSelect, labelColor, textColor, font, disabled }: FieldSelectProps) {
  const [open, setOpen] = useState(false);
  return (
    <FieldContainer>
      <FieldLabelText color={labelColor}>{label}</FieldLabelText>
      <SelectTrigger
        type="button"
        disabled={disabled}
        $placeholder={!value}
        style={{ color: textColor, fontFamily: font }}
        onClick={() => setOpen(true)}
      >
        {value || placeholder}
      </SelectTrigger>
      <SelectModal
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        options={options}
        value={value}
        onSelect={onSelect}
        cancelLabel="Cancel"
      />
    </FieldContainer>
  );
}

function FieldLabelText({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <Text variant="bodyBold" color={color} style={{ fontSize: 12 }}>
      {children}
    </Text>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  height: 100%;
  padding: 30px 10% 0;
`;

const Title = styled(Text)`
  text-align: center;
  margin-top: 10px;
  font-weight: normal;
`;

const StepBody = styled.div`
  flex: 1;
  width: 100%;
  padding-bottom: 20px;
`;

const Welcome = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 60px;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 15px;
`;

const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 12px;
  padding-bottom: 6px;
  border-bottom: 1px solid #eee;
`;

const StyledInput = styled.input`
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  padding: 4px 0;
  font-size: 14px;
`;

const SelectTrigger = styled.button<{ $placeholder: boolean }>`
  width: 100%;
  box-sizing: border-box;
  background: transparent;
  border: none;
  outline: none;
  padding: 4px 0;
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  opacity: ${({ $placeholder }) => ($placeholder ? 0.55 : 1)};

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const NoteContainer = styled.div`
  margin-top: 40px;
  padding: 0 10px;
`;

const VehicleImage = styled.img<{ $small: boolean }>`
  display: block;
  align-self: center;
  object-fit: contain;
  height: ${({ $small }) => ($small ? 140 : 160)}px;
  width: ${({ $small }) => ($small ? 140 : 160)}px;
  margin: 15px auto;
`;

const SwitchRow = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: 10px;
`;

const PolicyCard = styled.div`
  width: 100%;
  box-sizing: border-box;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
  padding: 15px;
  margin-top: 15px;
`;

const CardScroll = styled.div`
  max-height: 120px;
  overflow-y: auto;
  overflow-x: hidden;
  margin-top: 8px;
  font-size: 10px;
  line-height: 14px;
  word-break: break-word;
  overflow-wrap: anywhere;

  /* Normalize CMS HTML that carries divergent inline font styles. */
  * {
    max-width: 100%;
    box-sizing: border-box;
    font-size: 10px !important;
    line-height: 14px !important;
  }

  p {
    margin: 2px 0;
  }

  img {
    height: auto;
  }

  table {
    width: 100%;
    table-layout: fixed;
  }
`;

const AcceptCard = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
  padding: 10px 15px;
  margin-top: 15px;
`;

const Footer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 60px;
  margin: 10px 0 30px;
`;

const FooterButton = styled.div`
  flex: 1;
  cursor: pointer;
  min-height: 40px;
  display: flex;
  align-items: center;
`;

const Dots = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Dot = styled.span<{ $color: string }>`
  font-size: 28px;
  line-height: 28px;
  padding: 0 2px;
  color: ${({ $color }) => $color};
`;

const Overlay = styled.div`
  background-color: #343a4066;
  height: 100%;
  width: 100%;
  position: fixed;
  z-index: 2147483647;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  top: 0;
  bottom: 0;
`;
