/** @jsx createVNode */
// 초기화 함수
import { router } from "./router";
import { ForbiddenError, UnauthorizedError } from "./errors";
import { renderElement, createVNode } from "./lib";
import { NotFoundPage } from "./pages";

export function render() {
  const Page = router.get().getTarget() ?? NotFoundPage; // 현재 페이지의 history target을 가져온다
  const $root = document.querySelector("#root"); // DOM 을 가진 변수여서 $ 붙인 것, 가독성 증가

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
