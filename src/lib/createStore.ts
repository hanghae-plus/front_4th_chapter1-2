import { createObserver } from "./createObserver.js";

type ActionWithState<State, Actions> = {
  [K in keyof Actions]: Actions[K] extends (...args: infer P) => any
    ? (state: State, ...args: P) => State | void
    : never;
};

export const createStore = <State, Actions>(
  initialState: State,
  initialActions: ActionWithState<State, Actions>,
) => {
  const { subscribe, notify } = createObserver();

  let state = { ...initialState };

  const setState = (newState: State) => {
    state = { ...state, ...newState };
    notify();
  };

  const getState = () => ({ ...state });

  const actions = Object.fromEntries(
    Object.entries(initialActions).map(([key, value]) => [
      key,
      (...args: any[]) => {
        const typedValue = value as (state: State, ...args: any[]) => State;
        return setState(typedValue(getState(), ...args));
      },
    ]),
  ) as Actions;

  return { getState, setState, subscribe, actions };
};
