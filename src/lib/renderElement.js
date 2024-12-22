import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

// vNode를 정규화 한 다음에
// createElement로 노드를 만들고
// container에 삽입하고
// 이벤트를 등록합니다.
// renderElement는 앞에서 작성된 함수들을 조합하여 vNode를 container에 렌더링하는 작업을 수행합니다.
export function renderElement(vNode, container) {
  // 최초 렌더링시에는 createElement로 DOM을 생성하고
  // 이후에는 updateElement로 기존 DOM을 업데이트한다.
  // 렌더링이 완료되면 container에 이벤트를 등록한다.
  container.appendChild(createElement(normalizeVNode(vNode)));
  setupEventListeners(container);
  updateElement();
}
