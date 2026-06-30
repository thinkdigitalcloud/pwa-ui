/**
 * Booking time helpers. Time-of-day is encoded as an integer in "hundreds":
 * 08:00 -> 800, 15:30 -> 1530. Ported verbatim from balwin's convertBookingTime
 * so the slot picker keeps RN parity.
 */
export function convertBookingTime(value: number): string {
  const safe = Number.isFinite(value) ? value : 0;
  const hours = Math.floor(safe / 100);
  const minutes = safe % 100;
  const hh = `${hours}`.padStart(2, '0');
  const mm = `${minutes}`.padStart(2, '0');
  return `${hh}:${mm}`;
}

export interface TimeSlot {
  time: string;
  value: number;
  disabled: boolean;
  selected: boolean;
}

export interface TimeSlotAvailability {
  time: string;
  remaining: number;
}

export interface ResourceTimes {
  start: number;
  end: number;
}
