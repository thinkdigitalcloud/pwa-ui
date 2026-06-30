# Booking + Lead Extraction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add four fully-parametrized components — `TimeSlotPicker`, `ResourceBooking`, `LeadList`, `LeadShareForm` — to `@thinkdigitalcloud/pwa-ui`, extracted from balwin-app-pwa's recent booking/lead work.

**Architecture:** Each component is presentation-only: all data is props, all actions are callbacks, no Redux / react-router / API / Swal / moment / lodash. They compose existing library primitives (`Page`, `Modal`, `Button`, `Avatar`, `Text`, `NoData`) and theme via styled-components `useTheme()`. A pure `convertBookingTime` helper is bundled into `utils/`.

**Tech Stack:** React 18, TypeScript, styled-components 6, Storybook 8, tsup. `react-icons` (already a dep).

## Global Constraints

- **No new runtime dependencies.** `react-icons` only (already present). No `react-bootstrap`, `react-datepicker`, `moment`, `lodash`, `sweetalert2`, `redux`, `react-router`.
- **No data fetching / side effects inside components.** Parent owns all I/O.
- **Sizing:** use `ms()` / `msPx()` from `../../utils/scale`.
- **Theme:** read grouped tokens `theme.colors.*` (`primary`, `secondary`, `text`, `textInverse`, `textMuted`, `lightGrey`, `background`, `surface`, `success`, `danger`, `warning`). Brand-green literal `#4C8B2B` is intentional (not a token) per source.
- **File layout per component:** `src/components/<Name>/<Name>.tsx`, `index.ts`, `<Name>.stories.tsx`.
- **Verification loop (no unit-test runner exists):** `npm run typecheck` must pass, `npm run build` must succeed, and the story must render in `npm run storybook`.
- **Conventions:** props-driven like `BookingFacility`/`MakeBooking`; loose pass-through data interfaces (`[key: string]: unknown`); `onX` callbacks; `header?: PageProps['header']` + `title?` convenience like existing Page components.
- **Story pattern:** inline SVG data-URI images, `fn()` for handlers, the shared `bottomNav` fixture, `layout: 'fullscreen'` + fixed-size `frame` decorator for Page components.

## File Structure

- Create `src/utils/bookingTime.ts` — pure `convertBookingTime(value)` + types.
- Create `src/components/TimeSlotPicker/{TimeSlotPicker.tsx,index.ts,TimeSlotPicker.stories.tsx}`.
- Create `src/components/ResourceBooking/{ResourceBooking.tsx,index.ts,ResourceBooking.stories.tsx}`.
- Create `src/components/LeadList/{LeadList.tsx,index.ts,LeadList.stories.tsx}`.
- Create `src/components/LeadShareForm/{LeadShareForm.tsx,index.ts,LeadShareForm.stories.tsx}`.
- Modify `src/components/index.ts` — add four exports.
- Modify `src/index.ts` — re-export `convertBookingTime`.
- Modify `package.json` — bump `0.1.16` → `0.1.17`.

Shared story fixture (referenced by Page stories): copy this `bottomNav` + `frame` from `src/components/BookingFacility/BookingFacility.stories.tsx` into each story file.

---

### Task 1: `convertBookingTime` util + `TimeSlotPicker`

**Files:**
- Create: `src/utils/bookingTime.ts`
- Create: `src/components/TimeSlotPicker/TimeSlotPicker.tsx`
- Create: `src/components/TimeSlotPicker/index.ts`
- Create: `src/components/TimeSlotPicker/TimeSlotPicker.stories.tsx`

**Interfaces:**
- Produces: `convertBookingTime(value: number): string`; types `TimeSlot`, `TimeSlotAvailability`, `ResourceTimes`; component `TimeSlotPicker(props: TimeSlotPickerProps)`.
- Consumes: library `Modal`, `ms` from `../../utils/scale`.

- [ ] **Step 1: Create the pure time util**

`src/utils/bookingTime.ts`:

```ts
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
```

- [ ] **Step 2: Write the component**

`src/components/TimeSlotPicker/TimeSlotPicker.tsx` — port of `BookingTimeSlotsModal`. Keep the start/end selection algorithm verbatim (de-lodashed, typed); render inside the library `Modal`.

```tsx
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

  const title = 'Select Times';
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
    <Modal open={open} onClose={onClose} title={title} centerTitle>
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
```

- [ ] **Step 3: Create the barrel**

`src/components/TimeSlotPicker/index.ts`:

```ts
export * from './TimeSlotPicker';
```

- [ ] **Step 4: Write the story**

`src/components/TimeSlotPicker/TimeSlotPicker.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { TimeSlotPicker } from './TimeSlotPicker';

// 08:00–11:00 every 30 min; 09:00 & 09:30 fully booked.
const availability = [
  { time: '08:00', remaining: 2 },
  { time: '08:30', remaining: 2 },
  { time: '09:00', remaining: 0 },
  { time: '09:30', remaining: 0 },
  { time: '10:00', remaining: 3 },
  { time: '10:30', remaining: 3 },
  { time: '11:00', remaining: 1 },
];

const meta: Meta<typeof TimeSlotPicker> = {
  title: 'Components/TimeSlotPicker',
  component: TimeSlotPicker,
  args: {
    open: true,
    onClose: fn(),
    onTimeSelected: fn(),
    availability,
    interval: 30,
    resourceTimes: { start: 800, end: 1100 },
  },
};
export default meta;

type Story = StoryObj<typeof TimeSlotPicker>;

export const Default: Story = {};
export const HourInterval: Story = { args: { interval: 60 } };
export const Empty: Story = { args: { availability: [], resourceTimes: { start: 800, end: 1100 } } };
```

- [ ] **Step 5: Typecheck**

Run: `cd /Users/giorgigumburashvili/tdd/pwa-storybook && npm run typecheck`
Expected: exits 0, no errors referencing `TimeSlotPicker` or `bookingTime`. (Other pre-existing errors, if any, are out of scope — but the baseline is currently clean.)

- [ ] **Step 6: Commit**

```bash
cd /Users/giorgigumburashvili/tdd/pwa-storybook
git add src/utils/bookingTime.ts src/components/TimeSlotPicker
git commit -m "feat: TimeSlotPicker + convertBookingTime util"
```

---

### Task 2: `LeadList`

**Files:**
- Create: `src/components/LeadList/LeadList.tsx`
- Create: `src/components/LeadList/index.ts`
- Create: `src/components/LeadList/LeadList.stories.tsx`

**Interfaces:**
- Produces: `LeadVisitor`, `LeadList(props: LeadListProps)`.
- Consumes: library `Page`, `Avatar`, `Text`, `Spinner` (for loading); `PageProps`.

- [ ] **Step 1: Write the component**

`src/components/LeadList/LeadList.tsx`:

```tsx
import styled, { useTheme } from 'styled-components';
import { FiChevronRight } from 'react-icons/fi';
import { Page, type PageProps } from '../Page';
import { Avatar } from '../Avatar';
import { Text } from '../Text';
import { Spinner } from '../Spinner';

export interface LeadVisitor {
  firstName?: string;
  surname?: string;
  phone?: string;
  plate?: string;
  agentName?: string;
  [key: string]: unknown;
}

export interface LeadListProps {
  visitors: LeadVisitor[];
  loading?: boolean;
  onSelect: (visitor: LeadVisitor) => void;
  emptyText?: string;
  title?: string;
  header?: PageProps['header'];
  bottomNav?: PageProps['bottomNav'];
  backgroundColor?: string;
}

export function LeadList({
  visitors,
  loading = false,
  onSelect,
  emptyText = 'No Visitors',
  title = 'Lead Exit',
  header,
  bottomNav,
  backgroundColor,
}: LeadListProps) {
  const theme = useTheme();
  return (
    <Page
      header={header ?? { title, noBackButton: false }}
      bottomNav={bottomNav}
      backgroundColor={backgroundColor}
    >
      {loading ? (
        <Center>
          <Spinner />
        </Center>
      ) : visitors.length > 0 ? (
        <List>
          {visitors.map((item, i) => {
            const name = `${item.firstName ?? ''} ${item.surname ?? ''}`.trim();
            return (
              <Tile
                key={(item.id as string) || String(i)}
                style={{ borderTopColor: theme.colors.lightGrey }}
                onClick={() => onSelect(item)}
              >
                <Avatar name={item.firstName || 'user'} size={50} />
                <TileText>
                  {!!name && (
                    <Text variant="label" color={theme.colors.text} style={{ marginBottom: 2 }}>
                      {name}
                    </Text>
                  )}
                  {!!item.phone && (
                    <Text variant="label" color={theme.colors.text} style={{ marginBottom: 2 }}>
                      {item.phone}
                    </Text>
                  )}
                  {!!item.plate && (
                    <Text variant="label" color={theme.colors.text} style={{ marginBottom: 2 }}>
                      {item.plate}
                    </Text>
                  )}
                  {!!item.agentName && (
                    <Text variant="label" color={theme.colors.text}>
                      {`Nominated: ${item.agentName}`}
                    </Text>
                  )}
                </TileText>
                <FiChevronRight size={25} color={theme.colors.text} />
              </Tile>
            );
          })}
        </List>
      ) : (
        <ScreenTitle style={{ color: theme.colors.text }}>{emptyText}</ScreenTitle>
      )}
    </Page>
  );
}

const List = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 24px;
`;
const Tile = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 15px;
  flex-direction: row;
  justify-content: space-between;
  border-top: 1px solid;
  cursor: pointer;
`;
const TileText = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-left: 20px;
`;
const ScreenTitle = styled.p`
  padding: 15px 30px;
  margin-top: 100px;
  text-align: center;
`;
const Center = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 80px;
`;
```

- [ ] **Step 2: Barrel**

`src/components/LeadList/index.ts`:

```ts
export * from './LeadList';
```

- [ ] **Step 3: Story**

`src/components/LeadList/LeadList.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { PiBroadcast, PiLock, PiHouseSimple, PiUser, PiEnvelope } from 'react-icons/pi';
import { LeadList } from './LeadList';

const bottomNav = {
  active: 'home',
  onSelect: () => {},
  items: [
    { key: 'emergency', icon: <PiBroadcast size={22} /> },
    { key: 'access', icon: <PiLock size={22} /> },
    { key: 'home', icon: <PiHouseSimple size={22} /> },
    { key: 'profile', icon: <PiUser size={22} /> },
    { key: 'notifications', icon: <PiEnvelope size={22} />, badge: 38 },
  ],
};

const frame = (Story: () => JSX.Element) => (
  <div style={{ width: '100%', height: 760, maxHeight: '92vh', overflow: 'hidden', boxShadow: '0 0 0 1px #e5e5e5' }}>
    <Story />
  </div>
);

const visitors = [
  { id: '1', firstName: 'Thabo', surname: 'Nkosi', phone: '082 555 1234', plate: 'CA 123-456', agentName: 'Lerato M.' },
  { id: '2', firstName: 'Sarah', surname: 'Botha', phone: '071 222 9988', plate: 'ND 998-877', agentName: 'Pieter V.' },
];

const meta: Meta<typeof LeadList> = {
  title: 'Pages/LeadList',
  component: LeadList,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => frame(Story)],
  args: { visitors, onSelect: fn(), bottomNav },
};
export default meta;

type Story = StoryObj<typeof LeadList>;

export const Default: Story = {};
export const Loading: Story = { args: { loading: true } };
export const Empty: Story = { args: { visitors: [] } };
```

- [ ] **Step 4: Typecheck**

Run: `cd /Users/giorgigumburashvili/tdd/pwa-storybook && npm run typecheck`
Expected: exits 0.

- [ ] **Step 5: Commit**

```bash
cd /Users/giorgigumburashvili/tdd/pwa-storybook
git add src/components/LeadList
git commit -m "feat: LeadList page component"
```

---

### Task 3: `LeadShareForm`

**Files:**
- Create: `src/components/LeadShareForm/LeadShareForm.tsx`
- Create: `src/components/LeadShareForm/index.ts`
- Create: `src/components/LeadShareForm/LeadShareForm.stories.tsx`

**Interfaces:**
- Produces: `LeadShareValues`, `LeadShareForm(props: LeadShareFormProps)`.
- Consumes: library `Page`, `Button`, `Spinner`; `PageProps`.

- [ ] **Step 1: Write the component**

`src/components/LeadShareForm/LeadShareForm.tsx`:

```tsx
import { useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { Page, type PageProps } from '../Page';
import { Button } from '../Button';
import { Spinner } from '../Spinner';

export interface LeadShareValues {
  name: string;
  number: string;
  email: string;
  license: string;
}

export interface LeadShareFormProps {
  initialValues?: Partial<LeadShareValues>;
  loading?: boolean;
  onSubmit: (values: LeadShareValues) => void;
  submitLabel?: string;
  emailReadOnly?: boolean;
  title?: string;
  header?: PageProps['header'];
  bottomNav?: PageProps['bottomNav'];
  backgroundColor?: string;
}

export function LeadShareForm({
  initialValues,
  loading = false,
  onSubmit,
  submitLabel = 'Confirm & Share Exit Pin',
  emailReadOnly = true,
  title = 'Lead Exit',
  header,
  bottomNav,
  backgroundColor,
}: LeadShareFormProps) {
  const theme = useTheme();
  const [name, setName] = useState(initialValues?.name ?? '');
  const [number, setNumber] = useState(initialValues?.number ?? '');
  const [email, setEmail] = useState(initialValues?.email ?? '');
  const [license, setLicense] = useState(initialValues?.license ?? '');

  const handleSubmit = () => onSubmit({ name, number, email, license });

  return (
    <Page
      header={header ?? { title, noBackButton: false }}
      bottomNav={bottomNav}
      backgroundColor={backgroundColor}
    >
      <Form>
        <Input
          style={{ borderColor: theme.colors.lightGrey, color: theme.colors.text }}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <Input
          style={{ borderColor: theme.colors.lightGrey, color: theme.colors.text }}
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="Phone Number"
          type="tel"
        />
        <Input
          style={{ borderColor: theme.colors.lightGrey, color: theme.colors.textMuted }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          readOnly={emailReadOnly}
          disabled={emailReadOnly}
        />
        <Input
          style={{ borderColor: theme.colors.lightGrey, color: theme.colors.text }}
          value={license}
          onChange={(e) => setLicense(e.target.value)}
          placeholder="License Plate No"
        />
        <Button
          variant="success"
          block
          text={submitLabel}
          onClick={handleSubmit}
          loading={loading}
          disabled={loading}
          style={{ marginTop: 30 }}
        />
      </Form>
    </Page>
  );
}

const Form = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding-top: 40px;
`;
const Input = styled.input`
  height: 40px;
  margin: 12px 0;
  padding: 10px;
  width: 90%;
  border: none;
  border-bottom: 1px solid;
  background: transparent;
  font-size: 14px;
  outline: none;
`;
```

- [ ] **Step 2: Barrel**

`src/components/LeadShareForm/index.ts`:

```ts
export * from './LeadShareForm';
```

- [ ] **Step 3: Story**

`src/components/LeadShareForm/LeadShareForm.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { PiBroadcast, PiLock, PiHouseSimple, PiUser, PiEnvelope } from 'react-icons/pi';
import { LeadShareForm } from './LeadShareForm';

const bottomNav = {
  active: 'home',
  onSelect: () => {},
  items: [
    { key: 'emergency', icon: <PiBroadcast size={22} /> },
    { key: 'access', icon: <PiLock size={22} /> },
    { key: 'home', icon: <PiHouseSimple size={22} /> },
    { key: 'profile', icon: <PiUser size={22} /> },
    { key: 'notifications', icon: <PiEnvelope size={22} />, badge: 38 },
  ],
};

const frame = (Story: () => JSX.Element) => (
  <div style={{ width: '100%', height: 760, maxHeight: '92vh', overflow: 'hidden', boxShadow: '0 0 0 1px #e5e5e5' }}>
    <Story />
  </div>
);

const meta: Meta<typeof LeadShareForm> = {
  title: 'Pages/LeadShareForm',
  component: LeadShareForm,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => frame(Story)],
  args: {
    onSubmit: fn(),
    bottomNav,
    initialValues: {
      name: 'Thabo Nkosi',
      number: '082 555 1234',
      email: 'thabo@example.com',
      license: 'CA 123-456',
    },
  },
};
export default meta;

type Story = StoryObj<typeof LeadShareForm>;

export const Default: Story = {};
export const Loading: Story = { args: { loading: true } };
export const Empty: Story = { args: { initialValues: undefined } };
```

- [ ] **Step 4: Typecheck**

Run: `cd /Users/giorgigumburashvili/tdd/pwa-storybook && npm run typecheck`
Expected: exits 0.

- [ ] **Step 5: Commit**

```bash
cd /Users/giorgigumburashvili/tdd/pwa-storybook
git add src/components/LeadShareForm
git commit -m "feat: LeadShareForm page component"
```

---

### Task 4: `ResourceBooking`

**Files:**
- Create: `src/components/ResourceBooking/ResourceBooking.tsx`
- Create: `src/components/ResourceBooking/index.ts`
- Create: `src/components/ResourceBooking/ResourceBooking.stories.tsx`

**Interfaces:**
- Consumes: `Page`/`PageProps`, `Modal`, `Button`, `Text`, `Spinner`, `TimeSlotPicker`, types `TimeSlot`/`TimeSlotAvailability`/`ResourceTimes` from `../../utils/bookingTime`, `ms`.
- Produces: `ResourceBookingResource`, `ResourceBooking(props: ResourceBookingProps)`.

- [ ] **Step 1: Write the component**

`src/components/ResourceBooking/ResourceBooking.tsx`. Internal step state drives schedule/calendar visibility; `showConfirmed` is parent-controlled. Date picker is a render slot (`renderDatePicker`), falling back to a native `<input type="date">`.

```tsx
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
          <InfoCard
            icon={<PiUserCircle size={ms(22)} color={theme.colors.text} />}
            title="Description"
          >
            <Text variant="small" color={theme.colors.text}>{resource.description}</Text>
          </InfoCard>
          <InfoCard
            icon={<PiListChecks size={ms(22)} color={theme.colors.text} />}
            title="Facilities"
          >
            <Text variant="body" color={theme.colors.text}>{resource.facilityInfo}</Text>
          </InfoCard>
          <InfoCard
            icon={<PiImages size={ms(22)} color={theme.colors.text} />}
            title="Images"
          >
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
```

- [ ] **Step 2: Barrel**

`src/components/ResourceBooking/index.ts`:

```ts
export * from './ResourceBooking';
```

- [ ] **Step 3: Story**

`src/components/ResourceBooking/ResourceBooking.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { PiBroadcast, PiLock, PiHouseSimple, PiUser, PiEnvelope } from 'react-icons/pi';
import { ResourceBooking } from './ResourceBooking';

const bottomNav = {
  active: 'home',
  onSelect: () => {},
  items: [
    { key: 'emergency', icon: <PiBroadcast size={22} /> },
    { key: 'access', icon: <PiLock size={22} /> },
    { key: 'home', icon: <PiHouseSimple size={22} /> },
    { key: 'profile', icon: <PiUser size={22} /> },
    { key: 'notifications', icon: <PiEnvelope size={22} />, badge: 38 },
  ],
};

const frame = (Story: () => JSX.Element) => (
  <div style={{ width: '100%', height: 760, maxHeight: '92vh', overflow: 'hidden', boxShadow: '0 0 0 1px #e5e5e5' }}>
    <Story />
  </div>
);

const banner =
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><rect width="400" height="200" fill="#1B578C"/><text x="50%" y="50%" fill="#fff" font-family="sans-serif" font-size="22" text-anchor="middle" dominant-baseline="middle">Lagoon</text></svg>`,
  )}`;

const availability = [
  { time: '08:00', remaining: 2 },
  { time: '08:30', remaining: 2 },
  { time: '09:00', remaining: 0 },
  { time: '09:30', remaining: 3 },
  { time: '10:00', remaining: 3 },
];

const meta: Meta<typeof ResourceBooking> = {
  title: 'Pages/ResourceBooking',
  component: ResourceBooking,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => frame(Story)],
  args: {
    resource: {
      name: 'Lagoon',
      image: banner,
      description: 'Crystal-clear swimming lagoon with sandy beach edges.',
      facilityInfo: 'Lifeguard on duty • Showers • Kiosk',
      images: [banner, banner],
    },
    date: '2026-07-01',
    timeLabel: '',
    availability,
    interval: 30,
    resourceTimes: { start: 800, end: 1000 },
    onBookNow: fn(),
    onSelectDate: fn(),
    onTimeSelected: fn(),
    onConfirm: fn(),
    onDone: fn(),
    onCancel: fn(),
    bottomNav,
  },
};
export default meta;

type Story = StoryObj<typeof ResourceBooking>;

export const Default: Story = {};
export const Loading: Story = { args: { loading: true } };
export const Confirmed: Story = { args: { showConfirmed: true } };
```

- [ ] **Step 4: Typecheck**

Run: `cd /Users/giorgigumburashvili/tdd/pwa-storybook && npm run typecheck`
Expected: exits 0.

- [ ] **Step 5: Commit**

```bash
cd /Users/giorgigumburashvili/tdd/pwa-storybook
git add src/components/ResourceBooking
git commit -m "feat: ResourceBooking page component"
```

---

### Task 5: Wire exports, bump version, build

**Files:**
- Modify: `src/components/index.ts`
- Modify: `src/index.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: all four component barrels + `convertBookingTime`.
- Produces: public exports of `TimeSlotPicker`, `ResourceBooking`, `LeadList`, `LeadShareForm`, `convertBookingTime`, and their types.

- [ ] **Step 1: Add component exports**

Append to `src/components/index.ts`:

```ts
export * from './TimeSlotPicker';
export * from './ResourceBooking';
export * from './LeadList';
export * from './LeadShareForm';
```

- [ ] **Step 2: Export the util from the package root**

In `src/index.ts`, add after the `scale` re-export line:

```ts
export { convertBookingTime } from './utils/bookingTime';
export type { TimeSlot, TimeSlotAvailability, ResourceTimes } from './utils/bookingTime';
```

- [ ] **Step 3: Bump version**

In `package.json`, change `"version": "0.1.16"` to `"version": "0.1.17"`.

- [ ] **Step 4: Typecheck + build**

Run: `cd /Users/giorgigumburashvili/tdd/pwa-storybook && npm run typecheck && npm run build`
Expected: typecheck exits 0; tsup build emits `dist/index.js`, `dist/index.cjs`, `dist/index.d.ts` with no errors.

- [ ] **Step 5: Verify the four new exports are in the build types**

Run: `cd /Users/giorgigumburashvili/tdd/pwa-storybook && grep -E "TimeSlotPicker|ResourceBooking|LeadList|LeadShareForm|convertBookingTime" dist/index.d.ts | head`
Expected: matches for all four components + the util.

- [ ] **Step 6: Commit**

```bash
cd /Users/giorgigumburashvili/tdd/pwa-storybook
git add src/components/index.ts src/index.ts package.json
git commit -m "feat: export booking + lead components; bump to 0.1.17"
```

---

### Task 6: Storybook visual validation (user gate)

- [ ] **Step 1: Launch Storybook**

Run: `cd /Users/giorgigumburashvili/tdd/pwa-storybook && npm run storybook`
Expected: dev server on http://localhost:6006.

- [ ] **Step 2: User validates the new stories**

Confirm each renders correctly:
- `Components/TimeSlotPicker` — Default (30-min grid, 09:00/09:30 disabled), HourInterval, Empty.
- `Pages/LeadList` — Default, Loading, Empty.
- `Pages/LeadShareForm` — Default (email disabled), Loading, Empty.
- `Pages/ResourceBooking` — Default (banner, Book Now, three cards; Book Now opens the schedule modal → date + time pickers), Loading, Confirmed.

- [ ] **Step 3: Address any visual feedback, then proceed to merge/deploy** (handled outside this plan: PR on `pwa-storybook`, then publish per repo's release process).

## Self-Review notes

- **Spec coverage:** TimeSlotPicker (Task 1), LeadList (Task 2), LeadShareForm (Task 3), ResourceBooking (Task 4), exports + version bump (Task 5), stories (in each task), visual validation (Task 6). Skipped duplicates (FacilityCard/Avatar) are documented in the spec, no task — intentional.
- **No new deps:** date picker via `renderDatePicker` slot with native fallback; modal via library `Modal`; icons via `react-icons/pi` (already used across stories). ✓
- **Type consistency:** `TimeSlot`/`TimeSlotAvailability`/`ResourceTimes` defined in Task 1's `bookingTime.ts`, consumed unchanged in Task 4. `onTimeSelected` signature `(sel: { start: TimeSlot; end: TimeSlot }) => void` identical in both. ✓
- **Theme tokens used** (`warning`, `secondary`, `surface`, `textMuted`, `textInverse`, `lightGrey`, `primary`, `text`, `background`) all exist in `ThemeColors`. ✓
