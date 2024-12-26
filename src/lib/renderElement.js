import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
// import { updateElement } from "./updateElement";

// let currentVNode = null;

export function renderElement(vNode, container) {
  // 최초 렌더링시에는 createElement로 DOM을 생성하고
  // 이후에는 updateElement로 기존 DOM을 업데이트한다.
  // 렌더링이 완료되면 container에 이벤트를 등록한다.
  const normalizedVNode = normalizeVNode(vNode);

  // 기존 DOM 제거
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  // 새로운 DOM 생성
  const $el = createElement(normalizedVNode);
  container.appendChild($el);

  // 이벤트 리스너 설정
  setupEventListeners(container);
}
