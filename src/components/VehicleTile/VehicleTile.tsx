import { InformationCard } from '../InformationCard';

export interface VehicleTileProps {
  make?: string;
  model?: string;
  reg?: string;
  /** Vehicle / logo photo URL. */
  photo?: string;
  onClick?: () => void;
}

/**
 * Vehicle summary tile (the apps' `VehicleTile`) — a thin preset over
 * `InformationCard`: make as the highlighted title, model + registration as the
 * muted detail lines, and an optional photo thumbnail.
 */
export function VehicleTile({ make, model, reg, photo, onClick }: VehicleTileProps) {
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
