import { createObserver } from "./createObserver";
import { Component } from "./type";

export const createRouter = (routes: { [key: string]: Component }) => {
  const { subscribe, notify } = createObserver();

  const getPath = () => window.location.pathname;

  const getTarget = () => routes[getPath()];

  const push = (path) => {
    window.history.pushState(null, "", path);
    notify();
  };

  window.addEventListener("popstate", () => notify());

  return {
    get path() {
      return getPath();
    },
    push,
    subscribe,
    getTarget,
  };
};
