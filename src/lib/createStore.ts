import { deepEqual } from "../utils/deepEqual.ts";
import { createObserver } from "./createObserver.ts";

type State = { [key: string]: any };

export const createStore = <T extends State>(
  initialState: T,
  initialActions: { [key: string]: (prev: T) => T },
) => {
  const { subscribe, notify } = createObserver();

  let state: T = { ...initialState };

  const setState = (newState: Partial<T>) => {
    const stateToSet = { ...state, ...newState };

    // state가 동일한 경우 업데이트 방지
    if (deepEqual(stateToSet, state)) return;

    state = stateToSet;
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
