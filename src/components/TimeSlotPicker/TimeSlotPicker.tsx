import { useCallback, useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { Modal } from '../Modal';
import { ms } from '../../utils/scale';
import {
  convertBookingTime as defaultConvert,
  type TimeSlot,
  type TimeSlotAvailability,
  type ResourceTimes,
} from '../../utils/bookingTime';

export interface TimeSlotPickerProps {
  open: boolean;
  onClose: () => void;
  availability?: TimeSlotAvailability[];
  /** 30 or 60 — slot granularity. */
  interval?: number;
  resourceTimes?: ResourceTimes;
  onTimeSelected: (sel: { start: TimeSlot; end: TimeSlot }) => void;
  /** Injectable formatter; defaults to the bundled convertBookingTime. */
  convertTime?: (value: number) => string;
  emptyText?: string;
}

/**
 * Time-slot picker modal. Builds a resource's bookable slots from its open/close
 * window, marks already-booked slots disabled, and lets the user pick a start
 * then end slot — emitting the chosen pair. Generalises balwin's
 * `BookingTimeSlotsModal`; selection algorithm preserved verbatim.
 */
export function TimeSlotPicker({
  open,
  onClose,
  availability = [],
  interval = 30,
  resourceTimes = { start: 0, end: 0 },
  onTimeSelected,
  convertTime = defaultConvert,
  emptyText = 'No Time Slots Available',
}: TimeSlotPickerProps) {
  const theme = useTheme();
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedStart, setSelectedStart] = useState<TimeSlot | ''>('');
  const [selectedEnd, setSelectedEnd] = useState<TimeSlot | ''>('');

  const buildSlots = useCallback(
    (start: number, end: number) => {
      let current = start;
      const result: TimeSlot[] = [];
      const shouldCreateSlots = availability.length > 0;
      while (current <= end && shouldCreateSlots) {
        const slotTime = convertTime(current);
        const findTimeSlot = Array.isArray(availability)
          ? availability.map((info) => info.time).indexOf(slotTime)
          : -1;
        const disabled =
          (availability[findTimeSlot] && availability[findTimeSlot].remaining < 1) ||
          findTimeSlot === -1;
        result.push({ time: slotTime, selected: false, disabled, value: current });
        let intervalValue = current % 100 === 0 ? 30 : 70;
        if (interval === 60) intervalValue = 100;
        current += intervalValue;
      }
      setSlots(result);
    },
    [availability, interval, convertTime],
  );

  const selectSlots = (start: TimeSlot, end: TimeSlot) => {
    setSlots((prev) =>
      prev.map((slot) => ({
        ...slot,
        selected: slot.value >= start.value && slot.value <= end.value,
      })),
    );
  };

  const updateEnd = (start: TimeSlot, end: TimeSlot, disableCheck?: boolean) => {
    const startSlot = end.value < start.value ? end : start;
    const endSlot = end.value < start.value ? start : end;
    let isDisabled = true;
    if (disableCheck) {
      isDisabled = false;
    } else {
      const inRange = slots.filter(
        (slot) => slot.value >= startSlot.value && slot.value <= endSlot.value,
      );
      isDisabled = inRange.map((info) => info.disabled).indexOf(true) > -1;
    }
    if (!isDisabled || interval === 60) {
      selectSlots(startSlot, endSlot);
      setSelectedStart(startSlot);
      setSelectedEnd(endSlot);
    }
  };

  const onSlotSelect = (slot: TimeSlot, index: number) => {
    if (slot.disabled) return;
    const nextSlot = slots[index + 1];
    if (interval === 60 && nextSlot) {
      setSelectedStart(slot);
      updateEnd(slot, nextSlot);
      return;
    }
    if (!selectedStart || (selectedStart && selectedEnd)) {
      setSlots((prev) => prev.map((s, i) => ({ ...s, selected: i === index })));
      setSelectedStart(slot);
      if (nextSlot && nextSlot.disabled) {
        updateEnd(slot, nextSlot, true);
      } else {
        setSelectedEnd('');
      }
      return;
    }
    if (selectedStart && selectedStart.value === slot.value) {
      setSlots((prev) => prev.map((s) => ({ ...s, selected: false })));
      setSelectedStart('');
      return;
    }
    if (selectedStart && !selectedEnd) {
      updateEnd(selectedStart, slot);
    }
  };

  useEffect(() => {
    if (resourceTimes && resourceTimes.start && resourceTimes.end) {
      buildSlots(resourceTimes.start, resourceTimes.end);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availability, resourceTimes]);

  useEffect(() => {
    if (selectedStart && selectedEnd && typeof onTimeSelected === 'function') {
      onTimeSelected({ start: selectedStart, end: selectedEnd });
      setSelectedStart('');
      setSelectedEnd('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStart, selectedEnd]);

  const viewSlots = [...slots];
  if (interval === 60) viewSlots.pop();

  const slotStyle = (slot: TimeSlot): React.CSSProperties => {
    if (slot.disabled)
      return {
        backgroundColor: theme.colors.lightGrey,
        borderColor: theme.colors.lightGrey,
        color: theme.colors.primary,
      };
    if (slot.selected)
      return {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
        color: theme.colors.textInverse,
      };
    return { borderColor: theme.colors.lightGrey, color: theme.colors.text };
  };

  return (
    <Modal open={open} onClose={onClose} title="Select Times" centerTitle>
      <SlotGrid>
        {viewSlots.map((slot, index) => (
          <Slot
            key={`slot_${slot.time}`}
            style={slotStyle(slot)}
            onClick={() => onSlotSelect(slot, index)}
          >
            {slot.time.replace('24', '00')}
          </Slot>
        ))}
        {slots.length === 0 && (
          <NoSlots style={{ color: theme.colors.text }}>{emptyText}</NoSlots>
        )}
      </SlotGrid>
    </Modal>
  );
}

const SlotGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  max-width: calc(${ms(75)}px * 3 + ${ms(6)}px * 6 + 2px);
  margin: 0 auto;
  max-height: 55vh;
  overflow-y: auto;
`;
const Slot = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${ms(75)}px;
  height: ${ms(40)}px;
  margin: ${ms(6)}px;
  border: 1px solid;
  cursor: pointer;
  font-size: ${ms(13)}px;
`;
const NoSlots = styled.div`
  width: 100%;
  text-align: center;
  padding: ${ms(20)}px 0;
`;
