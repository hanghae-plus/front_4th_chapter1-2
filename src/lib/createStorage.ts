export const createStorage = (key, storage = window.localStorage) => {
  const get = () => JSON.parse(storage.getItem(key));
  const set = (value) => storage.setItem(key, JSON.stringify(value));
  const reset = () => storage.removeItem(key);

  return { get, set, reset };
};
