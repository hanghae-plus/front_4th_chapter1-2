type Listener = (...args: unknown[]) => void;

type Observer = {
  subscribe: (fn: Listener) => Set<Listener>;
  notify: () => void;
};

export const createObserver = (): Observer => {
  const listeners = new Set<Listener>();
  const subscribe = (fn: Listener) => listeners.add(fn);
  const notify = () => listeners.forEach((listener) => listener());

  return { subscribe, notify };
};