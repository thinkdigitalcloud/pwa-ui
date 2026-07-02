import styled from 'styled-components';
import { Text } from '../Text';
import { useResolvedTheme } from '../../theme/useResolvedTheme';

export interface EventNotificationsCardProps {
  title: string;
  /** Pre-formatted date string (e.g. "12 Jul 2026"). */
  date?: string;
  image?: string;
  /** Called when the card is tapped (the apps navigated to the event view). */
  onOpen?: () => void;
  /** Header bar background; defaults to the theme success colour. */
  headerColor?: string;
  /** Header text colour; defaults to white. */
  headerTextColor?: string;
}

/**
 * Event notification card (the apps' `EventNotificationsCard`): a coloured
 * header bar with the title + date badge over a tappable cover image.
 */
export function EventNotificationsCard({
  title,
  date,
  image,
  onOpen,
  headerColor,
  headerTextColor = '#FFFFFF',
}: EventNotificationsCardProps) {
  const theme = useResolvedTheme();
  const bg = headerColor ?? theme.colors.success;

  return (
    <Card $clickable={Boolean(onOpen)} onClick={onOpen}>
      <HeaderBar style={{ background: bg }}>
        <Text variant="bodyBold" color={headerTextColor}>{title}</Text>
        {date && <DateBadge color={headerTextColor}>{date}</DateBadge>}
      </HeaderBar>
      {image && <Cover style={{ backgroundImage: `url("${image}")` }} />}
    </Card>
  );
}

const Card = styled.div<{ $clickable: boolean }>`
  width: 100%;
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.tile.shadow};
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
`;

const HeaderBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 12px;
`;

const DateBadge = styled.span<{ color: string }>`
  flex: 0 0 auto;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ color }) => color};
  border: 1px solid ${({ color }) => `${color}80`};
`;

const Cover = styled.div`
  width: 100%;
  height: 170px;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  background-size: cover;
  background-position: center;
`;
