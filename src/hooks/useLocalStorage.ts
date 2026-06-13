import { useCallback, useState } from 'react';

/**
 * `useState` backed by `localStorage`. Reads lazily on mount and writes on set.
 * Fails quietly (in-memory only) when storage is unavailable (private mode/SSR).
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [stored, setStored] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStored((prev) => {
        const next =
          value instanceof Function ? (value as (p: T) => T)(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch {
          /* ignore write failures */
        }
        return next;
      });
    },
    [key],
  );

  return [stored, setValue];
}
