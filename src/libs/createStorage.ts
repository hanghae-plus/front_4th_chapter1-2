type Storage<T> = {
  get: () => T;
  set: (value: T) => void;
  reset: () => void;
};

export const createStorage = <T>(
  key: string,
  defaultValue: T,
  storage = window.localStorage,
): Storage<T> => {
  const get = (): T => {
    const value = storage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  };

  const set = (value: T) => storage.setItem(key, JSON.stringify(value));
  const reset = () => storage.removeItem(key);

  return { get, set, reset };
};
