import { ValidVNode } from "@/types/VNode";
import { createElement } from "@/lib/createElement";
import { updateElement } from "@/lib/updateElement";
import { setupEventListeners } from "@/lib/eventManager";
import { normalizeVNode } from "@/lib/normalizeVNode";

const oldDomStore = new WeakMap();

export function renderElement(vNode: ValidVNode, container: HTMLElement) {
  // Test 안티 패턴 => 좋은 방법 아님
  // 스코프를 클리어 하는 함수
  // 애초에 공유하는게 있으면 안된다
  // 클리어 함수가 필요해 보인다
  // 최초 렌더링시에는 createElement로 DOM을 생성하고
  const newVDom = normalizeVNode(vNode);

  if (!oldDomStore.has(container)) {
    const newDOM = createElement(newVDom);
    container.appendChild(newDOM);

    setupEventListeners(container);

    oldDomStore.set(container, newVDom);
    return;
  }

  const oldVDom = oldDomStore.get(container);

  // TODO: 모든 이벤트를 제거하기 보단, 변경된 요소에 한해서 이벤트 제거 추가 처리를 updateElement 함수에서 해줘야함

  // 이후에는 updateElement로 기존 DOM을 업데이트한다.
  updateElement(container, newVDom, oldVDom);

  // 렌더링이 완료되면 container에 이벤트를 등록한다.
  setupEventListeners(container);

  oldDomStore.set(container, newVDom);
}
