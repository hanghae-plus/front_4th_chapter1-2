/** @jsx createVNode */
import { ForbiddenError, UnauthorizedError } from "./errors";
import { createRouter, createVNode } from "./lib";
import { HomePage, LoginPage, ProfilePage } from "./pages";
import { render } from "./render";
import { router } from "./router";
import { globalStore } from "./stores";

// 라우터 설정
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
  }),
);

function main() {
  // 라우터 구독
  router.get().subscribe(render);

  // 전역 상태 구독
  globalStore.subscribe(render);

  // 초기 렌더링
  render();
}

main();
