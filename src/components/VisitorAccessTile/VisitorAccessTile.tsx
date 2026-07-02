import { FiShare, FiTrash2 } from 'react-icons/fi';
import { VisitorCard, type VisitorCardAction } from '../VisitorCard';
import { useResolvedTheme } from '../../theme/useResolvedTheme';
import { Brand, BrandScope } from '../../theme/brands';

export interface VisitorAccessTileProps {
  name: string;
  mobile?: string;
  /** Visit date line. */
  date?: string;
  /** Time-range start. */
  from?: string;
  /** Time-range end. */
  to?: string;
  onShare?: () => void;
  onRemove?: () => void;
  shareLabel?: string;
  removeLabel?: string;
  /** Share action colour; defaults to the theme success colour. */
  shareColor?: string;
  /** Remove action colour; defaults to the theme danger colour. */
  removeColor?: string;
  /** Show the avatar (the apps' VisitorAccessTile hid it). */
  showAvatar?: boolean;
  avatarUrl?: string;
  /** Render with a specific brand's theme, overriding the ambient BrandProvider. */
  brand?: Brand;
}

function VisitorAccessTileContent({
  name,
  mobile,
  date,
  from,
  to,
  onShare,
  onRemove,
  shareLabel = 'Share',
  removeLabel = 'Remove',
  shareColor,
  removeColor,
  showAvatar = false,
  avatarUrl,
}: VisitorAccessTileProps) {
  const theme = useResolvedTheme();
  const range = from || to ? `${from || ''} - ${to || ''}` : null;
  const lines = [mobile, date, range].filter((v): v is string => Boolean(v));

  const actions: VisitorCardAction[] = [];
  if (onShare) {
    actions.push({
      key: 'share',
      icon: <FiShare size={22} />,
      label: shareLabel,
      onClick: onShare,
      color: shareColor ?? theme.colors.success,
    });
  }
  if (onRemove) {
    actions.push({
      key: 'remove',
      icon: <FiTrash2 size={22} />,
      label: removeLabel,
      onClick: onRemove,
      color: removeColor ?? theme.colors.danger,
    });
  }

  return (
    <VisitorCard
      name={name || ''}
      lines={lines}
      hideAvatar={!showAvatar}
      avatarUrl={avatarUrl}
      actions={actions}
    />
  );
}

/**
 * Upcoming/visitor-access row (the apps' `VisitorAccessTile`) — a preset over
 * `VisitorCard`: mobile, date and the `from – to` range become the detail lines,
 * and Share / Remove become trailing actions.
 */
export function VisitorAccessTile({ brand, ...props }: VisitorAccessTileProps) {
  return (
    <BrandScope brand={brand}>
      <VisitorAccessTileContent {...props} />
    </BrandScope>
  );
}
