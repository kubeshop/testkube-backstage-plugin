import { useCallback } from 'react';

type Props<T> = {
  key: string;
  defaultState: T;
};

export const useLocalStorage = <T extends object>({
  key,
  defaultState,
}: Props<T>) => {
  const load = useCallback((): T => {
    try {
      const stored = localStorage.getItem(key);

      if (stored) {
        const parsed = JSON.parse(stored);

        return parsed;
      }
    } catch {
      // Ignore parse errors
    }

    return defaultState;
  }, [key, defaultState]);

  const save = useCallback(
    (state: T) => {
      try {
        localStorage.setItem(key, JSON.stringify(state));
      } catch {
        // Ignore storage errors
      }
    },
    [key],
  );

  return {
    load,
    save,
  };
};
