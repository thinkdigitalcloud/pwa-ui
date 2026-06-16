import styled from 'styled-components';
import { Text } from '../Text';

export interface InformationCardProps {
  /** Primary highlighted line (e.g. estate / vehicle make). */
  title: string;
  /** Secondary lines rendered in muted text. */
  lines?: string[];
  image?: string;
  onClick?: () => void;
}

const Card = styled.div<{ $clickable: boolean }>`
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 12px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) =>
    theme.buttonBackgroundColor || theme.button.background || theme.colors.surface};
  box-shadow: ${({ theme }) => theme.tile.shadow};
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
`;

const Image = styled.img`
  width: 64px;
  height: 64px;
  border-radius: ${({ theme }) => theme.radii.md};
  object-fit: cover;
  flex: 0 0 auto;
`;

const Lines = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

/**
 * Generic info card with a highlighted title + muted detail lines and an
 * optional thumbnail. Generalises the apps' `InformationTile` / `VehicleTile`
 * (decoupled from Redux estate lookups — pass data in directly).
 */
export function InformationCard({
  title,
  lines = [],
  image,
  onClick,
}: InformationCardProps) {
  return (
    <Card $clickable={Boolean(onClick)} onClick={onClick}>
      {image && <Image src={image} alt="" />}
      <Lines>
        <Text variant="bodyBold" color="#D01E2D">
          {title}
        </Text>
        {lines.map((line, i) => (
          <Text key={i} variant="small" color="#414143">
            {line}
          </Text>
        ))}
      </Lines>
    </Card>
  );
}
