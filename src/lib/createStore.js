import { createObserver } from "./createObserver.js";

export const createStore = (initialState, initialActions) => {
  const { subscribe, notify } = createObserver();

  let state = { ...initialState };

  const setState = (newState) => {
    const setter = newState;
    const result = typeof newState === "function" ? setter(state) : newState;

    state = { ...state, ...result };
    notify(state);
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
