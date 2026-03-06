type Props<T> = {
  key: string;
  defaultState: T;
};

export const useLocalStorage = <T extends object>({
  key,
  defaultState,
}: Props<T>) => {
  const load = (): T => {
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
  };

  const save = (state: T) => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // Ignore storage errors
    }
  };

  return {
    load,
    save,
  };
};
