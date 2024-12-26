/** @jsx createVNode */
import { createHooks, hooks } from "@core";
import { createHashRouter, createVNode } from "@lib";
import { HomePage, LoginPage, ProfilePage } from "@pages";
import { globalStore } from "@stores";
import { ForbiddenError, UnauthorizedError } from "@errors";
import { router } from "./router";
import { render } from "./render";

router.set(
  createHashRouter({
    "/": HomePage,
    "/login": () => {
      const { loggedIn } = globalStore.getState();
      if (loggedIn) {
        throw new ForbiddenError();
      }
      return <LoginPage />;
    },
    "/profile": () => {
      const { loggedIn } = globalStore.getState();
      if (!loggedIn) {
        throw new UnauthorizedError();
      }
      return <ProfilePage />;
    },
  }),
);
hooks.set(createHooks());

function main() {
  router.get().subscribe(render);
  hooks.get().subscribe(render);
  globalStore.subscribe(render);

  render();
}

main();
