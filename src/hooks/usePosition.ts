import { useEffect, useState } from 'react';

export interface Position {
  latitude?: number;
  longitude?: number;
  error: string | null;
}

/**
 * Watches device geolocation via the Geolocation API.
 * Ported from the PWA apps' `usePosition` hook (used for POI / access maps).
 */
export function usePosition(): Position {
  const [position, setPosition] = useState<Omit<Position, 'error'>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const geo = typeof navigator !== 'undefined' ? navigator.geolocation : null;
    if (!geo) {
      setError('Geolocation is not supported');
      return;
    }
    const watcher = geo.watchPosition(
      ({ coords }) =>
        setPosition({ latitude: coords.latitude, longitude: coords.longitude }),
      (e) => setError(e.message),
    );
    return () => geo.clearWatch(watcher);
  }, []);

  return { ...position, error };
}
