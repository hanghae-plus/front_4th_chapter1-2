type Storage<T> = {
  get: () => T;
  set: (value: T) => void;
  reset: () => void;
};

export const createStorage = <T>(
  key: string,
  storage = window.localStorage,
): Storage<T> => {
  const get = (): T => {
    return JSON.parse(storage.getItem(key) ?? "");
  };
  const set = (value: T) => storage.setItem(key, JSON.stringify(value));
  const reset = () => storage.removeItem(key);

  return { get, set, reset };
};
