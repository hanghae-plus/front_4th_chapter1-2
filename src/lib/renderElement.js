import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
// import { updateElement } from "./updateElement";

export function renderElement(vNode, container) {
  // 최초 렌더링시에는 createElement로 DOM을 생성하고
  // 이후에는 updateElement로 기존 DOM을 업데이트한다.
  // 렌더링이 완료되면 container에 이벤트를 등록한다.
  // vNode를 정규화한 다음에 createElement로 노드를 만들고, container에 삽입하고, 이벤트를 등록합니다.
  const normalizedVNode = normalizeVNode(vNode);
  const element = createElement(normalizedVNode);
  container.appendChild(element);
  setupEventListeners(container);

  return element;
}
