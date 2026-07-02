import styled from 'styled-components';
import { NoData } from '../NoData';
import { Text } from '../Text';
import { useResolvedTheme } from '../../theme/useResolvedTheme';

/** A single development/estate entry (unified across the brands' shapes). */
export interface DevelopmentItem {
  name: string;
  coverImage?: string;
  /** Price text overlaid on the cover, e.g. "from R1 200 000". */
  priceText?: string;
  /** Secondary line below the cover, e.g. suburb/city or owner. */
  subtitle?: string;
}

export interface DevelopmentCardProps {
  developments?: DevelopmentItem[];
  onSelect?: (item: DevelopmentItem, index: number) => void;
  /** Message shown when there are no developments. */
  emptyText?: string;
  /** Fallback cover image when an item has none. */
  fallbackImage?: string;
}

/**
 * List of development/estate promo cards (the apps' `DevelopmentCard`). Unifies
 * anch's `estates`+`priceRange` and balwin's `sales[]` shapes behind a single
 * `DevelopmentItem`; navigation is a parametrised `onSelect` callback.
 */
export function DevelopmentCard({
  developments = [],
  onSelect,
  emptyText = 'No developments available',
  fallbackImage,
}: DevelopmentCardProps) {
  const theme = useResolvedTheme();

  if (developments.length === 0) {
    return <NoData text={emptyText} />;
  }

  return (
    <List>
      {developments.map((item, index) => {
        const image = item.coverImage || fallbackImage;
        return (
          <Card
            key={`${item.name}_${index}`}
            type="button"
            onClick={onSelect ? () => onSelect(item, index) : undefined}
            $clickable={Boolean(onSelect)}
          >
            <Cover style={image ? { backgroundImage: `url("${image}")` } : undefined}>
              {item.priceText && <Price>{item.priceText}</Price>}
              <NameOverlay>
                <Text variant="bodyBold" color="#FFFFFF">{item.name}</Text>
              </NameOverlay>
            </Cover>
            {item.subtitle && (
              <Info>
                <Text variant="small" color={theme.colors.textMuted}>{item.subtitle}</Text>
              </Info>
            )}
          </Card>
        );
      })}
    </List>
  );
}

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
`;

const Card = styled.button<{ $clickable: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.tile.shadow};
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
  text-align: left;
`;

const Cover = styled.div`
  position: relative;
  width: 100%;
  height: 160px;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  background-size: cover;
  background-position: center;
`;

const Price = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  background: rgba(0, 0, 0, 0.55);
`;

const NameOverlay = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 10px 12px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0));
`;

const Info = styled.div`
  padding: 10px 12px;
`;
