import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

export function renderElement(vNode, container) {
  // 컨테이너 초기화
  container.innerHTML = "";

  // vNode를 정규화
  const normalizedVNode = normalizeVNode(vNode);

  // 최초 렌더링시에는 createElement로 DOM을 생성하고
  const newElement = createElement(normalizedVNode);
  // 렌더링이 완료되면 container에 이벤트를 등록한다.
  container.appendChild(newElement);
  setupEventListeners(container);
  // 이후에는 updateElement로 기존 DOM을 업데이트한다.
  updateElement();
}
