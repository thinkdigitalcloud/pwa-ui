import { InformationCard } from '../InformationCard';
import { Brand, BrandScope } from '../../theme/brands';

export interface VehicleTileProps {
  make?: string;
  model?: string;
  reg?: string;
  /** Vehicle / logo photo URL. */
  photo?: string;
  onClick?: () => void;
  /** Render with a specific brand's theme, overriding the ambient BrandProvider. */
  brand?: Brand;
}

function VehicleTileContent({ make, model, reg, photo, onClick }: VehicleTileProps) {
  const lines = [model, reg].filter((v): v is string => Boolean(v));
  return (
    <InformationCard
      title={make ?? ''}
      lines={lines}
      image={photo || undefined}
      onClick={onClick}
    />
  );
}

/**
 * Vehicle summary tile (the apps' `VehicleTile`) — a thin preset over
 * `InformationCard`: make as the highlighted title, model + registration as the
 * muted detail lines, and an optional photo thumbnail.
 */
export function VehicleTile({ brand, ...props }: VehicleTileProps) {
  return (
    <BrandScope brand={brand}>
      <VehicleTileContent {...props} />
    </BrandScope>
  );
}
