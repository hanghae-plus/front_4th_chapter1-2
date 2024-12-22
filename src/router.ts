import { createObserver } from "./libs/createObserver";

export type Routes = Record<string, () => JSX.Element>;

export type RouterObject = {
  path: string;
  push: (path: string) => void;
  getTarget: () => (() => JSX.Element) | undefined;
} & Pick<ReturnType<typeof createObserver>, "subscribe">;

class Router {
  static createInstance() {
    return new Router();
  }
  private constructor(private value: null | RouterObject = null) {}

  public get(): RouterObject {
    if (!this.value) {
      throw new Error("Router is not initialized...");
    }

    return this.value;
  }

  public set(newValue: RouterObject) {
    this.value = newValue;
  }
}

export const router = Router.createInstance();
