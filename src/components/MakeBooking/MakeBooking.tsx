import styled from 'styled-components';
import { Page, type PageProps } from '../Page';
import { NoData } from '../NoData';
import { FacilityCard } from '../FacilityCard';
import { Brand, BrandScope } from '../../theme/brands';

export interface BookingFacilityItem {
  id?: string;
  name: string;
  image?: string;
}

export interface MakeBookingProps {
  /** Facilities available to book at the current estate. */
  facilities: BookingFacilityItem[];
  /** Open a facility's resource/booking flow. */
  onSelect: (facility: BookingFacilityItem) => void;
  emptyText?: string;
  title?: string;
  header?: PageProps['header'];
  bottomNav?: PageProps['bottomNav'];
  backgroundColor?: string;
  /** Render with a specific brand's theme, overriding the ambient BrandProvider. */
  brand?: Brand;
}

function MakeBookingContent({
  facilities,
  onSelect,
  emptyText = 'No Facilities Found.',
  title = 'Facilities',
  header,
  bottomNav,
  backgroundColor,
}: MakeBookingProps) {
  return (
    <Page
      header={header ?? { title, noBackButton: false }}
      bottomNav={bottomNav}
      backgroundColor={backgroundColor}
    >
      {facilities.length > 0 ? (
        <List>
          {facilities.map((facility, i) => (
            <CardSlot key={facility.id || String(i)}>
              <FacilityCard
                title={facility.name}
                image={facility.image}
                onClick={() => onSelect(facility)}
              />
            </CardSlot>
          ))}
        </List>
      ) : (
        <EmptyWrap>
          <NoData text={emptyText} />
        </EmptyWrap>
      )}
    </Page>
  );
}

/**
 * The `/MakeBooking` "Facilities" page: a list of bookable facilities as image
 * cards, or an empty state. Data + selection handler come from the parent.
 */
export function MakeBooking({ brand, ...props }: MakeBookingProps) {
  return (
    <BrandScope brand={brand}>
      <MakeBookingContent {...props} />
    </BrandScope>
  );
}

const List = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 24px;
  padding-bottom: 30px;
`;

const CardSlot = styled.div`
  width: 100%;
`;

const EmptyWrap = styled.div`
  margin-top: 60px;
`;
