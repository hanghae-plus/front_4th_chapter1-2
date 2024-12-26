import { createObserver } from "./createObserver.js";

export const createStore = (initialState, initialActions) => {
  const { subscribe, notify } = createObserver();

  let state = { ...initialState };

  // 상태 추가함수
  const setState = (newState) => {
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
