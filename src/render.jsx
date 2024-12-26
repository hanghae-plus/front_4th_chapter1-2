/** @jsx createVNode */
// 초기화 함수
import { ForbiddenError, UnauthorizedError } from "./errors";
import { createVNode, renderElement } from "./lib";
import { NotFoundPage } from "./pages";
import { router } from "./router";

export function render() {
  // 현재 경로에 매칭되는 컴포넌트 가져오기
  const Page = router.get().getTarget() ?? NotFoundPage;

  // 루트 요소 가져오기
  const $root = document.querySelector("#root");

  try {
    renderElement(<Page />, $root);
  } catch (error) {
    if (error instanceof ForbiddenError) {
      router.get().push("/");
      return;
    }
    if (error instanceof UnauthorizedError) {
      router.get().push("/login");
      return;
    }
    console.error(error);
  }
}
