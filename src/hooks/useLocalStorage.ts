import { useEffect, useState } from "react";

export function useLocalStorage<T>({
  key,
  initialValue,
  validate,
}: {
  key: string;
  initialValue: T;
  validate: (value: unknown) => value is T;
}) {
  const [state, setState] = useState<T>(() => {
    try {
      const rawData = window.localStorage.getItem(key);
      if (rawData === null) return initialValue;

      const parsed: unknown = JSON.parse(rawData);
      if (validate(parsed)) return parsed;

      console.warn(`Ignoring invalid localStorage data for "${key}"`);
    } catch (error) {
      console.error(`Could not load "${key}" from localStorage`, error);
    }

    return initialValue;
  });

  useEffect(() => {
    try {
      const serialized = JSON.stringify(state);
      if (serialized === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, serialized);
      }
    } catch (error) {
      console.error(`Could not save "${key}" to localStorage`, error);
    }
  }, [key, state]);

  return [state, setState] as const;
}
