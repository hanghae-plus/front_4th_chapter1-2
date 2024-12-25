/** @jsx createVNode */
// 초기화 함수
import { router } from "./router";
import { ForbiddenError, UnauthorizedError } from "./errors";
import { renderElement, createVNode } from "./lib";
import { NotFoundPage } from "./pages";

export function render() {
  const Page = router.get().getTarget() ?? NotFoundPage;
  const $root = document.querySelector("#root");
  if ($root) {
    try {
      // <Page /> 자체가 vNode 입니다
      // $root가 진짜 컴포넌트
      // console.log("Page", typeof <Page />)
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
}
