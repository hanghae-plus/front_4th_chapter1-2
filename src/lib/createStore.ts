import { createObserver } from "./createObserver.ts";

type State = { [key: string]: any };

export const createStore = <T extends State>(
  initialState: T,
  initialActions: { [key: string]: (prev: T) => T },
) => {
  const { subscribe, notify } = createObserver();

  let state: T = { ...initialState };

  const setState = (newState: Partial<T>) => {
    state = { ...state, ...newState };
    notify();
  };

  const getState = () => ({ ...state });

  const actions = Object.fromEntries(
    Object.entries(initialActions).map(([key, value]) => [
      key,
      (...args) => setState(value(getState(), ...args)),
    ]),
  );

  return { getState, setState, subscribe, actions };
};
