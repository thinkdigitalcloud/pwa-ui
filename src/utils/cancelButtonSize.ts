/** Shared padding scale for the kit's cancel buttons, so `small` / `medium` /
 *  `large` mean the same thing everywhere (SelectModal, ConfirmationModal,
 *  SwitchEstate, ImageUploadModal, PersonalInformation). Controls vertical
 *  padding only — each button keeps its own horizontal padding. */
export type CancelButtonSize = 'small' | 'medium' | 'large';

const V_PADDING: Record<CancelButtonSize, string> = {
  small: '8px',
  medium: '12px',
  large: '16px',
};

/** Vertical padding for a cancel button of the given size, or `undefined` to
 *  leave the component's own default untouched. Used by styled cancel buttons. */
export const cancelButtonVPadding = (size?: CancelButtonSize): string | undefined =>
  size ? V_PADDING[size] : undefined;

/** Inline padding style for Button-based cancels — overrides the Button's own
 *  vertical padding while keeping its horizontal padding. `undefined` = default. */
export const cancelButtonPaddingStyle = (
  size?: CancelButtonSize,
): { paddingTop: string; paddingBottom: string } | undefined =>
  size ? { paddingTop: V_PADDING[size], paddingBottom: V_PADDING[size] } : undefined;
