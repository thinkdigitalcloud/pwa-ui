import { useCallback, useMemo } from 'react';

/** A contact resolved from the device address book. */
export interface PickedContact {
  name: string;
  phoneNumber: string;
}

/**
 * Light normalisation: keep digits and a single leading `+`. Matches how
 * manually-typed numbers are submitted today (no locale-specific reformatting).
 */
export function normalizePhone(raw: unknown = ''): string {
  const str = String(raw == null ? '' : raw).trim();
  const hasPlus = str.startsWith('+');
  const digits = str.replace(/[^\d]/g, '');
  return hasPlus ? `+${digits}` : digits;
}

/**
 * The web Contact Picker API is Android-only (Chrome/Edge/Samsung/Opera),
 * requires a secure context, and must be invoked from a user gesture.
 */
export function isContactPickerSupported(): boolean {
  const nav = typeof navigator !== 'undefined' ? (navigator as any) : undefined;
  return (
    !!nav &&
    !!nav.contacts &&
    typeof nav.contacts.select === 'function' &&
    typeof window !== 'undefined' &&
    window.isSecureContext === true
  );
}

interface RawContactRecord {
  name?: string[];
  tel?: string[];
}

/** `navigator.contacts.select` resolves to an array (empty if cancelled). */
export function mapSelection(selected: unknown): PickedContact | null {
  if (!Array.isArray(selected) || selected.length === 0) return null;
  const record = (selected[0] || {}) as RawContactRecord;
  const name = Array.isArray(record.name) && record.name.length ? record.name[0] : '';
  const tel = Array.isArray(record.tel) && record.tel.length ? record.tel[0] : '';
  return { name: name || '', phoneNumber: normalizePhone(tel) };
}

export interface UseContactPickerReturn {
  /** Whether the Contact Picker API is available in this context. */
  isSupported: boolean;
  /** Opens the native picker; resolves to the chosen contact or `null`. */
  pickContact: () => Promise<PickedContact | null>;
}

/**
 * Wraps the web Contact Picker API for estate-app visitor/contact capture
 * flows. Theme-agnostic — pair with `<AddFromContacts />` for a ready button.
 */
export function useContactPicker(): UseContactPickerReturn {
  const isSupported = useMemo(() => isContactPickerSupported(), []);

  const pickContact = useCallback(async (): Promise<PickedContact | null> => {
    try {
      const selected = await (navigator as any).contacts.select(['name', 'tel'], {
        multiple: false,
      });
      return mapSelection(selected);
    } catch {
      return null;
    }
  }, []);

  return { isSupported, pickContact };
}
