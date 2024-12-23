/** @jsx createVNode */
import { createRouter, createVNode } from "./lib";
import { HomePage, LoginPage, ProfilePage, TestPage } from "./pages";
import { globalStore } from "./stores";
import { ForbiddenError, UnauthorizedError } from "./errors";
import { router } from "./router";
import { render } from "./render";

router.set(
  createRouter({
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
    "/test": () => {
      return <TestPage />;
    },
  }),
);

function main() {
  router.get().subscribe(render); // 경로가 변경될 때마다 render함수를 실행하라고 등록
  globalStore.subscribe(render); // 전역상태(globalState)가 변경될 때마다 render함수를 실행하라고 등록

  render();
}

main();
