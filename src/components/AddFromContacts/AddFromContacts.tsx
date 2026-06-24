import React from 'react';
import { PiAddressBook } from 'react-icons/pi';
import { Button, type ButtonProps, type ButtonVariant } from '../Button';
import {
  useContactPicker,
  type PickedContact,
} from '../../hooks/useContactPicker';

export interface AddFromContactsProps
  extends Omit<ButtonProps, 'onClick' | 'children' | 'text' | 'leftIcon'> {
  /** Called with the chosen contact after the native picker resolves. */
  onPick: (contact: PickedContact) => void;
  /** Button label. */
  label?: string;
  /** Icon rendered before the label; pass `null` to omit. */
  icon?: React.ReactNode;
  /** Themed button variant. Defaults to the filled `primary` style. */
  variant?: ButtonVariant;
  /** Stretch to fill the parent width (defaults to `true`). */
  block?: boolean;
  /**
   * When the Contact Picker API is unavailable the component renders nothing
   * by default. Set `false` to render a disabled button instead.
   */
  hideWhenUnsupported?: boolean;
}

/**
 * Theme-aware "Add from Contacts" button backed by the web Contact Picker API.
 *
 * Unifies the per-app implementations (e.g. balwin/anch visitor capture) behind
 * one parametrised, theme-driven component. Honours the active styled-components
 * theme via the shared `Button`, so it brands itself per app automatically —
 * no Redux/theme plumbing required at the call site.
 */
export function AddFromContacts({
  onPick,
  label = 'Add from Contacts',
  icon = <PiAddressBook size={18} aria-hidden />,
  variant = 'primary',
  block = true,
  hideWhenUnsupported = true,
  ...rest
}: AddFromContactsProps) {
  const { isSupported, pickContact } = useContactPicker();

  if (!isSupported && hideWhenUnsupported) {
    return null;
  }

  const handleClick = async () => {
    const contact = await pickContact();
    if (contact) onPick(contact);
  };

  return (
    <Button
      type="button"
      variant={variant}
      block={block}
      leftIcon={icon ?? undefined}
      text={label}
      disabled={!isSupported}
      onClick={handleClick}
      {...rest}
    />
  );
}
