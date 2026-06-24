import styled from 'styled-components';

export interface StatusNavItem<T extends string = string> {
  label: string;
  value: T;
}

export interface StatusNavProps<T extends string = string> {
  items: StatusNavItem<T>[];
  /** Currently selected value. */
  value: T;
  onChange: (value: T) => void;
  /** Stretch to the full container width (default 80%, centred — the apps' look). */
  fullWidth?: boolean;
  /** Explicit width (any CSS length, e.g. "60%" / "320px"). Overrides `fullWidth`. */
  width?: string;
}

const Container = styled.div<{ $width: string }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: ${({ $width }) => $width};
  height: 40px;
  margin: 20px auto 0;
  background: ${({ theme }) => theme.colors.background};
  overflow: hidden;
`;

const Item = styled.button<{ $selected: boolean }>`
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px;
  line-height: 12px;
  background: ${({ $selected, theme }) =>
    $selected ? theme.colors.secondary : theme.colors.lightGrey};
  color: ${({ $selected, theme }) =>
    $selected ? theme.colors.textInverse : theme.colors.text};
  transition: background 0.15s ease;
`;

/**
 * Segmented status/tab bar. Generalises balwin's `StatusNav` (hard-coded
 * status1/2/3) to a data-driven items array. Selected segment uses the theme
 * secondary colour with inverse text; the rest use light grey.
 */
export function StatusNav<T extends string = string>({
  items,
  value,
  onChange,
  fullWidth = false,
  width,
}: StatusNavProps<T>) {
  const resolvedWidth = width ?? (fullWidth ? '100%' : '80%');
  return (
    <Container $width={resolvedWidth} role="tablist">
      {items.map((item) => (
        <Item
          key={item.value}
          type="button"
          role="tab"
          aria-selected={item.value === value}
          $selected={item.value === value}
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </Item>
      ))}
    </Container>
  );
}
