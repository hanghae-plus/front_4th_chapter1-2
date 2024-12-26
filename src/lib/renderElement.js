import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

const oldContainerMap = new WeakMap();

export function renderElement(vNode, container) {
  // 최초 렌더링시에는 createElement로 DOM을 생성하고
  const normalizedVNode = normalizeVNode(vNode);

  // 이후에는 updateElement로 기존 DOM을 업데이트한다.
  if (oldContainerMap.has(container)) {
    const oldNode = oldContainerMap.get(container);
    //update
    updateElement(container, normalizedVNode, oldNode);
  } else {
    const element = createElement(normalizedVNode);
    //신규 등록
    container.appendChild(element);
  }

  // 렌더링이 완료되면 container에 이벤트를 등록한다.
  setupEventListeners(container);
  oldContainerMap.set(container, normalizedVNode);
}
