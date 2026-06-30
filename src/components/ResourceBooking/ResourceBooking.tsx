import { useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { PiUserCircle, PiListChecks, PiImages, PiCalendar, PiClock } from 'react-icons/pi';
import { Page, type PageProps } from '../Page';
import { Modal } from '../Modal';
import { Button } from '../Button';
import { Text } from '../Text';
import { Spinner } from '../Spinner';
import { TimeSlotPicker } from '../TimeSlotPicker';
import { ms } from '../../utils/scale';
import type { TimeSlot, TimeSlotAvailability, ResourceTimes } from '../../utils/bookingTime';

export interface ResourceBookingResource {
  name: string;
  image?: string;
  description?: string;
  facilityInfo?: string;
  images?: string[];
}

export interface ResourceBookingProps {
  resource: ResourceBookingResource;
  /** Selected date label (YYYY-MM-DD), controlled by the parent. */
  date: string;
  /** Human time label, e.g. "08:00 - 09:00". Empty when none chosen. */
  timeLabel?: string;
  loading?: boolean;

  availability?: TimeSlotAvailability[];
  interval?: number;
  resourceTimes?: ResourceTimes;

  onBookNow: () => void;
  onSelectDate: (date: Date) => void;
  onTimeSelected: (sel: { start: TimeSlot; end: TimeSlot }) => void;
  onConfirm: () => void;
  onDone: () => void;
  onCancel?: () => void;

  /** Parent-controlled success modal (follows a real network result). */
  showConfirmed?: boolean;

  /** Date-picker render slot; falls back to a native date input. */
  renderDatePicker?: (args: { date: string; onSelect: (d: Date) => void }) => React.ReactNode;

  placeholder?: string;
  title?: string;
  header?: PageProps['header'];
  bottomNav?: PageProps['bottomNav'];
  backgroundColor?: string;
}

const PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><rect width="400" height="200" fill="#c8ccd2"/></svg>`,
  );

/**
 * Resource detail + scheduling page for the booking flow: image banner, a "Book
 * Now" action, Description / Facilities / Images cards, and the schedule → date
 * picker → time picker → confirm modal sequence. Port of balwin's
 * `BookingCalendarView`. The modal step is internal; the parent supplies data
 * and the real side-effecting actions (fetch availability, submit, navigate).
 * `showConfirmed` is parent-controlled because it follows a network result.
 */
export function ResourceBooking({
  resource,
  date,
  timeLabel = '',
  loading = false,
  availability = [],
  interval = 30,
  resourceTimes = { start: 0, end: 0 },
  onBookNow,
  onSelectDate,
  onTimeSelected,
  onConfirm,
  onDone,
  onCancel,
  showConfirmed = false,
  renderDatePicker,
  placeholder = PLACEHOLDER,
  title,
  header,
  bottomNav,
  backgroundColor,
}: ResourceBookingProps) {
  const theme = useTheme();
  const [step, setStep] = useState<'none' | 'schedule' | 'calendar' | 'time'>('none');

  const handleBookNow = () => {
    onBookNow();
    setStep('schedule');
  };
  const handleCancel = () => {
    setStep('none');
    onCancel?.();
  };
  const handleSelectDate = (d: Date) => {
    onSelectDate(d);
    setStep('schedule');
  };
  const handleTimeSelected = (sel: { start: TimeSlot; end: TimeSlot }) => {
    onTimeSelected(sel);
    setStep('schedule');
  };
  const handleConfirm = () => {
    setStep('none');
    onConfirm();
  };

  const nextDisabled = !timeLabel || !date;
  const images = resource.images ?? [];

  return (
    <Page
      header={header ?? { title: title ?? resource.name, noBackButton: false }}
      bottomNav={bottomNav}
      backgroundColor={backgroundColor}
      padded={false}
    >
      <MainContainer style={{ backgroundColor: theme.colors.background }}>
        {loading && (
          <LoadingContainer>
            <Spinner />
            <LoadingText style={{ color: theme.colors.text }}>Loading</LoadingText>
          </LoadingContainer>
        )}

        <ImageBanner src={resource.image || placeholder} alt={resource.name} />

        <BookNowButton style={{ backgroundColor: theme.colors.secondary }} onClick={handleBookNow}>
          Book Now
        </BookNowButton>

        <Content>
          <InfoCard icon={<PiUserCircle size={ms(22)} color={theme.colors.text} />} title="Description">
            <Text variant="small" color={theme.colors.text}>{resource.description}</Text>
          </InfoCard>
          <InfoCard icon={<PiListChecks size={ms(22)} color={theme.colors.text} />} title="Facilities">
            <Text variant="body" color={theme.colors.text}>{resource.facilityInfo}</Text>
          </InfoCard>
          <InfoCard icon={<PiImages size={ms(22)} color={theme.colors.text} />} title="Images">
            <ImageRow>
              {images.map((img) => (
                <Thumb key={img} src={img} alt="resource" />
              ))}
            </ImageRow>
          </InfoCard>
        </Content>

        {/* SCHEDULE MODAL */}
        <Modal open={step === 'schedule'} onClose={handleCancel} title="Select a date & time" centerTitle>
          <FieldLabel style={{ color: theme.colors.text }}>Select Date</FieldLabel>
          <FieldButton
            type="button"
            style={{ borderColor: theme.colors.lightGrey }}
            onClick={() => setStep('calendar')}
          >
            <span style={{ color: theme.colors.text }}>{date}</span>
            <PiCalendar size={ms(22)} color={theme.colors.text} />
          </FieldButton>

          <FieldLabel style={{ color: theme.colors.text, marginTop: ms(20) }}>Select Time</FieldLabel>
          <FieldButton
            type="button"
            style={{ borderColor: theme.colors.lightGrey }}
            onClick={() => setStep('time')}
          >
            <span style={{ color: theme.colors.text }}>{timeLabel}</span>
            <PiClock size={ms(22)} color={theme.colors.text} />
          </FieldButton>

          <ScheduleButtons>
            <Button
              text="Cancel"
              onClick={handleCancel}
              rounded={false}
              style={{ flex: 1, marginRight: ms(8), borderRadius: ms(8), backgroundColor: theme.colors.warning }}
            />
            <Button
              text="Next"
              onClick={handleConfirm}
              disabled={nextDisabled}
              rounded={false}
              style={{ flex: 1, marginLeft: ms(8), borderRadius: ms(8), backgroundColor: '#4C8B2B' }}
            />
          </ScheduleButtons>
        </Modal>

        {/* DATE PICKER MODAL */}
        <Modal open={step === 'calendar'} onClose={() => setStep('schedule')} hideCloseButton>
          <CalendarBody>
            {renderDatePicker ? (
              renderDatePicker({ date, onSelect: handleSelectDate })
            ) : (
              <input
                type="date"
                value={date}
                onChange={(e) => handleSelectDate(new Date(e.target.value))}
              />
            )}
          </CalendarBody>
        </Modal>

        {/* TIME SLOTS MODAL */}
        <TimeSlotPicker
          open={step === 'time'}
          onClose={() => setStep('schedule')}
          availability={availability}
          interval={interval}
          resourceTimes={resourceTimes}
          onTimeSelected={handleTimeSelected}
        />

        {/* CONFIRMED MODAL */}
        <Modal open={showConfirmed} onClose={onDone} hideCloseButton>
          <ConfirmBody>
            <Text variant="heading" color={theme.colors.text} style={{ marginBottom: ms(12) }}>
              Thank You
            </Text>
            <Text variant="body" color={theme.colors.text}>Your booking has been confirmed</Text>
            <ConfirmButtons>
              <Button text="Done" block style={{ backgroundColor: theme.colors.secondary }} onClick={onDone} />
            </ConfirmButtons>
          </ConfirmBody>
        </Modal>
      </MainContainer>
    </Page>
  );
}

function InfoCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  const theme = useTheme();
  return (
    <Card style={{ borderColor: theme.colors.lightGrey }}>
      <CardHeader style={{ borderBottomColor: theme.colors.lightGrey }}>
        {icon}
        <Text variant="body" color={theme.colors.text} style={{ marginLeft: ms(12) }}>{title}</Text>
      </CardHeader>
      <CardBody>{children}</CardBody>
    </Card>
  );
}

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
`;
const ImageBanner = styled.img`
  width: 100%;
  height: ${ms(200)}px;
  object-fit: cover;
  display: block;
`;
const BookNowButton = styled.button`
  border: none;
  color: #fff;
  font-weight: 600;
  font-size: ${ms(15)}px;
  height: ${ms(46)}px;
  margin: ${ms(15)}px;
  border-radius: ${ms(8)}px;
  cursor: pointer;
`;
const Content = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 ${ms(15)}px ${ms(90)}px;
`;
const Card = styled.div`
  border: 1px solid;
  border-radius: ${ms(8)}px;
  margin-bottom: ${ms(15)}px;
  overflow: hidden;
`;
const CardHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${ms(12)}px ${ms(15)}px;
  border-bottom: 1px solid;
`;
const CardBody = styled.div`
  padding: ${ms(12)}px ${ms(15)}px;
`;
const ImageRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${ms(8)}px;
`;
const Thumb = styled.img`
  width: ${ms(72)}px;
  height: ${ms(72)}px;
  object-fit: cover;
  border-radius: ${ms(4)}px;
`;
const FieldLabel = styled.div`
  font-size: ${ms(13)}px;
  margin-bottom: ${ms(8)}px;
`;
const FieldButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background: transparent;
  border: 1px solid;
  border-radius: ${ms(6)}px;
  padding: ${ms(12)}px ${ms(15)}px;
  cursor: pointer;
  font-size: ${ms(14)}px;
`;
const ScheduleButtons = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: ${ms(28)}px;
`;
const CalendarBody = styled.div`
  display: flex;
  justify-content: center;
  padding: ${ms(16)}px;
`;
const ConfirmBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: ${ms(12)}px;
`;
const ConfirmButtons = styled.div`
  width: 100%;
  margin-top: ${ms(20)}px;
`;
const LoadingContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  height: 100%;
  width: 100%;
  position: absolute;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  top: 0;
`;
const LoadingText = styled.span`
  font-weight: bold;
  font-size: 20px;
  margin-top: 12px;
`;
