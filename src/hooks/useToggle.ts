import { useCallback, useState } from 'react';

export type UseToggleReturn = [boolean, (next?: boolean) => void];

/**
 * Boolean state with a stable toggle/set helper.
 * `toggle()` flips; `toggle(true)` / `toggle(false)` sets explicitly.
 */
export function useToggle(initial = false): UseToggleReturn {
  const [value, setValue] = useState<boolean>(initial);
  const toggle = useCallback((next?: boolean) => {
    setValue((current) => (typeof next === 'boolean' ? next : !current));
  }, []);
  return [value, toggle];
}
