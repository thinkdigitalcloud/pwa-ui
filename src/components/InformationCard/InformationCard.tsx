import styled from 'styled-components';
import { Text } from '../Text';
import { useResolvedTheme } from '../../theme/useResolvedTheme';

export interface InformationCardProps {
  /** Primary highlighted line (e.g. estate / vehicle make). */
  title: string;
  /** Secondary lines rendered in muted text. */
  lines?: string[];
  image?: string;
  onClick?: () => void;
  /** Title colour; defaults to the theme danger colour. */
  titleColor?: string;
  /** Detail-line colour; defaults to the theme dark grey. */
  lineColor?: string;
  /** Render flat — no shadow and a zero-width border. */
  flat?: boolean;
}

const Card = styled.div<{ $clickable: boolean; $flat: boolean }>`
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 12px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) =>
    theme.buttonBackgroundColor || theme.button.background || theme.colors.surface};
  border: ${({ $flat }) => ($flat ? '0 solid transparent' : 'none')};
  box-shadow: ${({ $flat, theme }) => ($flat ? 'none' : theme.tile.shadow)};
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
 * (decoupled from Redux estate lookups — pass data in directly). Title and line
 * colours are theme-aware (overridable), and `flat` renders it borderless.
 */
export function InformationCard({
  title,
  lines = [],
  image,
  onClick,
  titleColor,
  lineColor,
  flat = false,
}: InformationCardProps) {
  const theme = useResolvedTheme();
  const resolvedTitle = titleColor ?? theme.colors.danger;
  const resolvedLine = lineColor ?? theme.colors.darkGrey;
  return (
    <Card $clickable={Boolean(onClick)} $flat={flat} onClick={onClick}>
      {image && <Image src={image} alt="" />}
      <Lines>
        <Text variant="bodyBold" color={resolvedTitle}>
          {title}
        </Text>
        {lines.map((line, i) => (
          <Text key={i} variant="small" color={resolvedLine}>
            {line}
          </Text>
        ))}
      </Lines>
    </Card>
  );
}
