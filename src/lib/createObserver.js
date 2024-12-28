export const createObserver = () => {
  const listeners = new Set();
  const subscribe = (fn) => listeners.add(fn);
  const notify = (...args) => listeners.forEach((listener) => listener(args));

  return { subscribe, notify };
};
