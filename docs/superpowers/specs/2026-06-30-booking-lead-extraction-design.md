# Extract recent balwin booking + lead surfaces into pwa-ui

**Date:** 2026-06-30
**Status:** Approved (design)
**Target repo:** `pwa-storybook` (`@thinkdigitalcloud/pwa-ui`)
**Source repo:** `balwin-app-pwa`

## Background

Over the last two weeks balwin-app-pwa gained a Lagoon booking flow and a lead
(sales-agent visitor) flow. Several of those screens/components are reusable
across the TDD estate apps and belong in the shared `pwa-ui` library, fully
parametrized so data, button handlers, and navigation are passed by the parent.

### Already covered (do NOT re-port)

Audit of the existing library shows the booking *tiles* were already isolated:

- balwin `ResourceTile` / `ServiceTile` / `BookingStatusTile` → library
  **`FacilityCard`** (`titleStyle: 'overlay' | 'bar'`, `action`, `badge`).
- balwin `UserAvatar` → library **`Avatar`** (initials fallback, `size`, `round`).

The spec documents these mappings with usage notes but adds no new components for
them (decision: *skip duplicates*).

### Genuinely new, reusable surfaces (in scope)

| balwin source | New library component | Kind |
|---|---|---|
| `components/BookingModals/BookingTimeSlotsModal.js` | `TimeSlotPicker` | Modal |
| `views/Bookings/BookingCalendarView.js` | `ResourceBooking` | Page |
| `views/LeadExitScreen/LeadExitScreen.js` | `LeadList` | Page |
| `views/LeadSharePinScreen/LeadSharePinScreen.js` | `LeadShareForm` | Page |

## Scope

- **In:** add the four components + `.stories.tsx` to `pwa-storybook`, export from
  `src/components/index.ts`, bump the package version.
- **Out:** rewiring balwin-app-pwa to consume the library (decision:
  *storybook only*). No Redux, react-router, `apiRequest`, `config`, `Swal`,
  `moment`, or `lodash` inside the library — those stay in the consuming app.

## Conventions (match the existing library exactly)

- TypeScript + `styled-components`; theme via `useTheme()` reading grouped
  `theme.colors.*` with flat-brand-key fallbacks where the existing components do.
- Reuse library primitives: `Page`, `Modal`, `Button`, `Avatar`, `Text`, `NoData`.
- Sizing via `ms()` / `msPx()` from `utils/scale`.
- Loose, pass-through data interfaces (`[key: string]: unknown`) like `BookingItem`.
- One folder per component: `Component.tsx`, `index.ts`, `Component.stories.tsx`.
- All actions are callbacks (`onX`); all data is props. No data fetching inside.

## Component designs

### 1. `TimeSlotPicker` (wraps `Modal`)

Generalises `BookingTimeSlotsModal`. Builds selectable time slots from a
resource's open/close window, marks booked slots disabled, and lets the user pick
a start then end slot, emitting the pair.

```ts
export interface TimeSlot { time: string; value: number; disabled: boolean; selected: boolean; }
export interface TimeSlotAvailability { time: string; remaining: number; }
export interface ResourceTimes { start: number; end: number; }

export interface TimeSlotPickerProps {
  open: boolean;
  onClose: () => void;
  availability?: TimeSlotAvailability[];
  /** 30 or 60 — slot granularity. */
  interval?: number;
  resourceTimes?: ResourceTimes;
  onTimeSelected: (sel: { start: TimeSlot; end: TimeSlot }) => void;
  /** Injectable formatter; defaults to a bundled convertBookingTime. */
  convertTime?: (value: number) => string;
  title?: string;
  emptyText?: string;
}
```

- Internal state: `slots`, `selectedStart`, `selectedEnd` (same algorithm as the
  source — preserved verbatim, only de-lodashed and typed).
- `convertBookingTime` is bundled into `utils/` (it is pure: `value -> "HH:MM"`),
  exported so the app can share one implementation.
- Renders inside the library `Modal` (`centerTitle`, theme close button) instead
  of `react-bootstrap`.
- Slot grid: 3-column centred wrap, theme `primary` for selected, `lightGrey` for
  disabled — matching source.

### 2. `ResourceBooking` (Page)

The presentational shell of `BookingCalendarView`: image banner, a "Book Now"
button, Description / Facilities / Images info cards, and the three-modal
scheduling flow (schedule → date picker → confirm), with `TimeSlotPicker` for
times. **Owns the modal step state internally**; the parent supplies only data
and the real side-effecting actions.

```ts
export interface ResourceBookingResource {
  name: string;
  image?: string;
  description?: string;
  facilityInfo?: string;
  images?: string[];
}

export interface ResourceBookingProps {
  resource: ResourceBookingResource;
  /** Currently chosen date (YYYY-MM-DD) — controlled by parent. */
  date: string;
  /** Human time label, e.g. "08:00 - 09:00" (empty when none chosen). */
  timeLabel?: string;
  loading?: boolean;

  /** Time-slot data for the embedded TimeSlotPicker. */
  availability?: TimeSlotAvailability[];
  interval?: number;
  resourceTimes?: ResourceTimes;

  /** Parent fetches availability for the date; library opens the schedule UI. */
  onBookNow: () => void;
  /** Date chosen in the picker (Date) — parent reformats + refetches. */
  onSelectDate: (date: Date) => void;
  /** Slot pair chosen in TimeSlotPicker. */
  onTimeSelected: (sel: { start: TimeSlot; end: TimeSlot }) => void;
  /** "Next" in the schedule modal — parent submits the booking. */
  onConfirm: () => void;
  /** "Done" in the confirmed modal — parent navigates away. */
  onDone: () => void;
  onCancel?: () => void;

  /** Drive the success modal from the parent after a successful submit. */
  showConfirmed?: boolean;

  /**
   * Date-picker render slot. Avoids a hard react-datepicker dependency: the app
   * passes its own picker; if omitted, a minimal native <input type="date">.
   */
  renderDatePicker?: (args: {
    date: string;
    onSelect: (d: Date) => void;
  }) => React.ReactNode;

  title?: string;
  header?: PageProps['header'];
  bottomNav?: PageProps['bottomNav'];
  backgroundColor?: string;
}
```

- Internal step state: `schedule` | `calendar` | `time` | none. Transitions are
  driven by the buttons; `showConfirmed` is parent-controlled (it follows a real
  network result the library can't see).
- "Next" button stays brand green `#4C8B2B` (per source comment, not a theme
  token); Cancel uses `theme.colors.warning`/`danger`.
- No `apiRequest`, `BookingRequest`, `config`, `moment`, or `Swal` — those remain
  in the balwin wrapper.

### 3. `LeadList` (Page)

Port of `LeadExitScreen` minus data fetching. A list of visitor tiles
(`Avatar` + name / phone / plate / nominated-agent lines + chevron) or an empty
state.

```ts
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
  emptyText?: string;             // default "No Visitors"
  title?: string;                 // default "Lead Exit"
  header?: PageProps['header'];
  bottomNav?: PageProps['bottomNav'];
}
```

- The balwin source reads snake_case keys (`vistor_firstname`, …). The library
  uses clean camelCase; mapping snake→camel is the wrapper's job. (Documented.)
- Uses `Avatar` for the leading glyph and a trailing arrow (react-icons `FiArrowRight`
  to match `ListRow`).

### 4. `LeadShareForm` (Page)

Port of `LeadSharePinScreen` minus the share/`Swal` side effects. A small
controlled form (name, phone, email [read-only], license) and a confirm button
that emits the current values.

```ts
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
  submitLabel?: string;           // default "Confirm & Share Exit Pin"
  emailReadOnly?: boolean;        // default true (matches source)
  title?: string;                 // default "Lead Exit"
  header?: PageProps['header'];
  bottomNav?: PageProps['bottomNav'];
}
```

- Inputs are controlled by internal state seeded from `initialValues`.
- `onSubmit` receives the edited values; the parent performs `updateAgentVisitor`,
  `sharePinMessage`, toasts, and navigation.

## Stories

Each component gets a `.stories.tsx` following the existing pattern (inline SVG
data-URI images, `fn()` handlers, the `bottomNav` fixture, a fixed-size `frame`
decorator for Pages, `layout: 'fullscreen'`). Cover: default, empty/no-data, and
loading states where applicable; for `TimeSlotPicker` a story with some slots
disabled; for `ResourceBooking` an open-schedule and a confirmed state.

## Exports & versioning

- Add `export * from './TimeSlotPicker'` etc. to `src/components/index.ts`.
- Export `convertBookingTime` from `utils` (and re-export via `src/index.ts` if
  utils are surfaced there).
- Bump `package.json` version `0.1.16 → 0.1.17`.

## Out of scope / follow-ups

- Adopting these components inside balwin-app-pwa (separate effort).
- Re-porting the booking tiles or `UserAvatar` (already covered).
- A generic `BookingRequest` builder (app-specific; stays in the app).

## Risks

- **`ResourceBooking` modal orchestration**: the source mixes presentation with
  network timing (confirmed modal only after a successful POST). Resolved by
  keeping step state internal but `showConfirmed` parent-controlled.
- **`react-datepicker` dependency**: avoided via the `renderDatePicker` slot so
  the library keeps zero new runtime deps.
- **Slot-building algorithm parity**: must be ported verbatim (interval 30 vs 60
  edge cases, `viewSlots.pop()` for interval 60). The library has no test runner,
  so parity is verified via dedicated `TimeSlotPicker` stories (interval 30, interval
  60, some slots disabled, empty) reviewed against the source behaviour.
