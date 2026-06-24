import styled, { useTheme } from 'styled-components';
import { Page, type PageProps } from '../Page';
import { Spinner } from '../Spinner';
import { PreferenceToggleRow } from '../PreferenceToggleRow';

/** A single on/off notification preference row. */
export interface NotificationPreferenceItem {
  /** Stable key passed back to `onChange`. */
  key: string;
  label: string;
  value: boolean;
  /** Disable this row's toggle independently of the page loading state. */
  disabled?: boolean;
}

export interface NotificationPreferencesProps {
  preferences: NotificationPreferenceItem[];
  /** Fired when a row is toggled. The parent performs the subscribe/unsubscribe
   *  call (and any success/error feedback) and reflects the new `value`. */
  onChange: (key: string, next: boolean) => void;

  /** Blocking initial-load state; toggles are disabled and a spinner shows. */
  loading?: boolean;

  /** Header title. Ignored if `header` is provided. */
  title?: string;
  /** Toggle knob colour (defaults to the theme secondary, the estate-app look). */
  thumbColor?: string;
  /** Per-state track colours. */
  trackColor?: { true?: string; false?: string };

  header?: PageProps['header'];
  bottomNav?: PageProps['bottomNav'];
  backgroundColor?: string;
}

/**
 * The `/NotificationPreferences` screen: a list of subscribe/unsubscribe
 * toggles (e.g. "Access Alert"). Data-agnostic — the parent supplies the
 * preferences and handles the side-effects in `onChange`; while `loading` the
 * rows are disabled behind a spinner (RN parity).
 */
export function NotificationPreferences({
  preferences,
  onChange,
  loading = false,
  title = 'Notification Preferences',
  thumbColor,
  trackColor,
  header,
  bottomNav,
  backgroundColor,
}: NotificationPreferencesProps) {
  const theme = useTheme();
  return (
    <Page
      header={header ?? { title, noBackButton: false }}
      bottomNav={bottomNav}
      backgroundColor={backgroundColor}
      padded={false}
    >
      {loading ? (
        <SpinnerWrap>
          <Spinner size={30} color={theme.colors.primary} />
        </SpinnerWrap>
      ) : (
        <List>
          {preferences.map((pref) => (
            <PreferenceToggleRow
              key={pref.key}
              label={pref.label}
              value={pref.value}
              disabled={pref.disabled}
              thumbColor={thumbColor}
              trackColor={trackColor}
              onChange={(next) => onChange(pref.key, next)}
            />
          ))}
        </List>
      )}
    </Page>
  );
}

const SpinnerWrap = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 30px;
`;

const List = styled.div`
  width: 100%;
`;
