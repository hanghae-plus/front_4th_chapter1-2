import { createObserver } from "@lib/createObserver.js";
import { hooks } from "@core";

const states = new Map();
let stateIndex = 0;

export const createHooks = () => {
  const { subscribe, notify } = createObserver();

  const resetIndex = () => {
    stateIndex = 0;
  };

  const resetStateAndIndex = () => {
    states.clear();
    resetIndex();
  };

  const useState = (initialValue) => {
    const currentIndex = stateIndex++;

    if (!states.has(currentIndex)) {
      states.set(currentIndex, initialValue);
    }

    const currentValue = states.get(currentIndex);
    const setState = (newValue) => {
      states.set(currentIndex, newValue);
      notify();
    };

    return [currentValue, setState];
  };

  return {
    subscribe,
    useState,
    resetIndex,
    resetStateAndIndex,
  };
};

export function useState(initialValue) {
  return hooks.get().useState(initialValue);
}
