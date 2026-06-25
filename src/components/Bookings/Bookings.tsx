import { useMemo, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { Page, type PageProps } from '../Page';
import { Button } from '../Button';
import { StatusNav } from '../StatusNav';
import { FacilityCard } from '../FacilityCard';
import { Text } from '../Text';

export type BookingCategory = 'requested' | 'upcoming' | 'past';

/** A booking as needed by the list (kept loose — extra fields pass through). */
export interface BookingItem {
  id?: string;
  status?: string;
  /** Resource/facility display name + image for the card. */
  resourceName?: string;
  resourceImage?: string;
  [key: string]: unknown;
}

export interface BookingsProps {
  /** Bookings already grouped into requested / upcoming / past. */
  grouped: Record<BookingCategory, BookingItem[]>;
  /** Open a booking's detail. */
  onOpenBooking: (booking: BookingItem) => void;
  /** "Make a booking" CTA. */
  onMakeBooking: () => void;
  /** Initially-selected tab. */
  initialCategory?: BookingCategory;

  /** Empty-state copy per category. */
  emptyText?: Record<BookingCategory, string>;
  makeBookingLabel?: string;
  title?: string;
  header?: PageProps['header'];
  bottomNav?: PageProps['bottomNav'];
  backgroundColor?: string;
}

const DEFAULT_EMPTY: Record<BookingCategory, string> = {
  requested: 'No requested bookings!',
  upcoming: 'No upcoming bookings, would you like to book something?',
  past: 'No past bookings!',
};

const CATEGORIES: { label: string; value: BookingCategory }[] = [
  { label: 'requested', value: 'requested' },
  { label: 'upcoming', value: 'upcoming' },
  { label: 'past', value: 'past' },
];

/** Map a booking status to a badge label + theme colour key. */
function badgeFor(theme: ReturnType<typeof useTheme>, status?: string) {
  const s = (status || '').toUpperCase();
  if (s === 'REJECTED' || s === 'CANCELED')
    return { label: s === 'REJECTED' ? 'Rejected' : 'Canceled', color: theme.colors.danger };
  if (s === 'REQUESTED') return { label: 'Requested', color: theme.colors.warning };
  if (s === 'BOOKED') return { label: 'Booked', color: theme.colors.secondary };
  return s ? { label: s.charAt(0) + s.slice(1).toLowerCase(), color: theme.colors.secondary } : undefined;
}

/**
 * The `/bookings` landing: a "Make a booking" CTA, a requested/upcoming/past
 * segmented filter, and the matching booking cards (or an empty message).
 * Grouping/navigation are the parent's job — pass pre-grouped data + handlers.
 */
export function Bookings({
  grouped,
  onOpenBooking,
  onMakeBooking,
  initialCategory = 'requested',
  emptyText = DEFAULT_EMPTY,
  makeBookingLabel = 'Make a booking',
  title = 'Bookings',
  header,
  bottomNav,
  backgroundColor,
}: BookingsProps) {
  const theme = useTheme();
  const [category, setCategory] = useState<BookingCategory>(initialCategory);
  const current = useMemo(() => grouped[category] || [], [grouped, category]);

  return (
    <Page
      header={header ?? { title, noBackButton: false }}
      bottomNav={bottomNav}
      backgroundColor={backgroundColor}
    >
      <Column>
        <Button
          text={makeBookingLabel}
          variant="success"
          block
          uppercase={false}
          onClick={onMakeBooking}
          style={{ borderRadius: 8, minHeight: 52, fontWeight: 'bold' }}
        />
        <StatusNav
          items={CATEGORIES}
          value={category}
          width="100%"
          onChange={(v) => setCategory(v as BookingCategory)}
        />
        <List>
          {current.length > 0 ? (
            current.map((booking, i) => (
              <CardSlot key={booking.id || String(i)}>
                <FacilityCard
                  title={booking.resourceName || ''}
                  image={booking.resourceImage}
                  badge={badgeFor(theme, booking.status)}
                  onClick={() => onOpenBooking(booking)}
                />
              </CardSlot>
            ))
          ) : (
            <Empty color={theme.colors.text}>{emptyText[category]}</Empty>
          )}
        </List>
      </Column>
    </Page>
  );
}

const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 22px;
  margin-top: 22px;
`;

const CardSlot = styled.div`
  width: 100%;
`;

const Empty = styled(Text)`
  text-align: center;
  padding-top: 10%;
`;
