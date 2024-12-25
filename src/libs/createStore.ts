import { createObserver } from "@libs";

export const createStore = <
  State extends object,
  Actions extends Record<string, (...args: unknown[]) => State>,
>(
  initialState: State,
  initialActions: Actions,
) => {
  const { subscribe, notify } = createObserver();

  let state = { ...initialState };

  const setState = (
    newStateOrUpdateFn: State | ((prevState: State) => State),
  ) => {
    state =
      typeof newStateOrUpdateFn === "function"
        ? { ...state, ...newStateOrUpdateFn(state) }
        : { ...state, ...newStateOrUpdateFn };
    notify();
  };

  const getState = () => ({ ...state });

  const actions = Object.fromEntries(
    Object.entries(initialActions).map(([key, value]) => [
      key,
      (...args: Parameters<typeof value>) =>
        setState(value(getState(), ...args)),
    ]),
  );

  return { getState, setState, subscribe, actions };
};
