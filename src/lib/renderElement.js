import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

// WeakMap을 사용하여 각 컨테이너의 초기 렌더링 상태를 관리
const containerRenderState = new WeakMap();

export function renderElement(vNode, container) {
  const normalizedVNode = normalizeVNode(vNode);

  const isInitialRender = !containerRenderState.has(container);

  // 최초 렌더링시에는 createElement로 DOM을 생성하고
  if (isInitialRender) {
    const $el = createElement(normalizedVNode);
    container.append($el);
    containerRenderState.set(container, normalizedVNode);

    // 이후에는 updateElement로 기존 DOM을 업데이트한다.
    setupEventListeners(container);
  } else {
    const previousVNode = containerRenderState.get(container);
    updateElement(previousVNode, normalizedVNode, container);

    // 업데이트된 VNode를 저장
    containerRenderState.set(container, normalizedVNode);
  }

  // 렌더링이 완료되면 container에 이벤트를 등록한다.
}
