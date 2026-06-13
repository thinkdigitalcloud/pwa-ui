# @thinkdigitalcloud/pwa-ui

A shared **React 18 + TypeScript** component library with **Storybook**, extracted from the four TDD estate PWAs — 
`anch-pwa`, `balwin-app-pwa`, `gocity-app-pwa`, and `redefine-app-pwa`.

Those apps are forks of a common template: each ships its own near-identical copy of `Button`, `Header`, `Page`, `Tile`, `NoData`, `Loading`, `BottomNavigator`, `CategoryCard`, `Checkbox`, `Toggle`, `SearchBar`, select/confirmation modals, plus a Redux-driven `styled-components` theme. This package consolidates those into one typed, themeable source of truth.

## What changed vs. the originals

| Original apps | This library |
| --- | --- |
| React 17, JavaScript, PropTypes | **React 18, TypeScript** |
| Theme in Redux (`store.theme.data`), ~180 flat keys | Strongly-typed `AppTheme` via styled-components `ThemeProvider` |
| `react-spinners` `ClipLoader` | Dependency-free CSS `Spinner` |
| Hard-coded 5-tab bottom bar | Data-driven `BottomNavigation` |
| Per-app divergent `Button` APIs | One `variant`/`size` API |
| No component docs | Storybook stories + autodocs for every component |

## Install (from GitHub Packages)

This package is published to **GitHub Packages** under the `@thinkdigitalcloud`
scope. GitHub Packages requires authentication even for reads, so each consuming
project needs an `.npmrc` that routes the scope to GitHub and supplies a token
with the `read:packages` permission:

```ini
# .npmrc (in the consuming project)
@thinkdigitalcloud:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

```bash
export NODE_AUTH_TOKEN=<github-pat-with-read:packages>
npm install @thinkdigitalcloud/pwa-ui
```

Peer dependencies (`react`, `react-dom`, `styled-components`) are provided by the
consuming app.

## Publish (maintainers)

Publishing happens automatically via `.github/workflows/publish.yml` when a
GitHub Release is published (uses the repo's `GITHUB_TOKEN`). To publish manually:

```bash
export NODE_AUTH_TOKEN=<github-pat-with-write:packages>
npm publish          # prepublishOnly runs typecheck + build first
```

## Develop

```bash
npm install

```bash
npm run storybook       # interactive component explorer at http://localhost:6006
npm run build-storybook # static docs site -> storybook-static/
npm run build           # bundle the library (ESM + CJS + .d.ts) -> dist/
npm run typecheck       # tsc --noEmit
```

## Usage

```tsx
import {
  ThemeProvider,
  balwinTheme,
  Page,
  Tile,
  Button,
  useToggle,
} from '@thinkdigitalcloud/pwa-ui';
import { FiHome, FiLock } from 'react-icons/fi';

export function App() {
  return (
    <ThemeProvider theme={balwinTheme}>
      <Page
        header={{ title: 'Home', noBackButton: true }}
        bottomNav={{
          items: [
            { key: 'home', icon: <FiHome />, label: 'Home' },
            { key: 'access', icon: <FiLock />, label: 'Access', badge: 3 },
          ],
          active: 'home',
          onSelect: (key) => console.log(key),
        }}
      >
        <Tile heading="Bookings" description="Reserve facilities" icon={<FiHome />} />
        <Button text="Make booking" block />
      </Page>
    </ThemeProvider>
  );
}
```

### Theming

Five ready-made themes ship with the library — one per source app plus a neutral
default: `lightTheme`, `anchTheme`, `balwinTheme`, `gocityTheme`, `redefineTheme`
(also exported as the `themes` map). Build your own with the same `AppTheme`
contract. The Storybook toolbar has a theme switcher to preview any component
under every brand.

## Components

- **Primitives** — `Text`, `Button`, `Spinner`
- **Inputs** — `Checkbox`, `Toggle`, `SearchBar`, `Stepper`
- **Cards** — `Tile`, `CategoryCard`, `InformationCard`
- **Layout** — `Page`, `HorizontalScroller`
- **Navigation** — `Header`, `BottomNavigation`
- **Overlays** — `Modal`, `SelectModal`
- **Feedback** — `NoData`, `Spinner`

## Hooks

`useToggle`, `useDebounce`, `useMediaQuery` / `useIsStandalone`, `useLocalStorage`,
`usePosition` — the generic, app-agnostic hooks distilled from the PWAs (the
Firebase/Redux-bound domain hooks were intentionally left in the apps).

## Utilities

`scale`, `ms`, `msPx` — the responsive sizing helpers (375px baseline, mirrors
`react-native-size-matters`) used across the apps.
