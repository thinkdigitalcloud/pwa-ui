import styled from 'styled-components';
import { Page, type PageProps } from '../Page';
import { FacilityCard } from '../FacilityCard';

export interface BookingFacilityProps {
  /** Resource/facility name (also the default header title). */
  resourceName: string;
  resourceImage?: string;
  /** Proceed to scheduling for this resource. */
  onBook: () => void;
  bookNowLabel?: string;
  title?: string;
  header?: PageProps['header'];
  bottomNav?: PageProps['bottomNav'];
  backgroundColor?: string;
}

/**
 * The `/BookingFacility` page: the selected facility's resource shown as a
 * single image card with a "Book Now" chip that opens scheduling.
 */
export function BookingFacility({
  resourceName,
  resourceImage,
  onBook,
  bookNowLabel = 'Book Now',
  title,
  header,
  bottomNav,
  backgroundColor,
}: BookingFacilityProps) {
  return (
    <Page
      header={header ?? { title: title ?? resourceName, noBackButton: false }}
      bottomNav={bottomNav}
      backgroundColor={backgroundColor}
    >
      <Wrap>
        <FacilityCard
          title={resourceName}
          image={resourceImage}
          titleStyle="overlay"
          action={bookNowLabel}
          onClick={onBook}
        />
      </Wrap>
    </Page>
  );
}

const Wrap = styled.div`
  width: 100%;
  padding-top: 8px;
`;
