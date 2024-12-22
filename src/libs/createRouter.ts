import { Routes, RouterObject } from "../router";
import { createObserver } from "./createObserver";

export const createRouter = (routes: Routes): RouterObject => {
  const { subscribe, notify } = createObserver();

  const getPath = () => window.location.pathname;

  const getTarget = () => routes[getPath()];

  const push = (path: string) => {
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
