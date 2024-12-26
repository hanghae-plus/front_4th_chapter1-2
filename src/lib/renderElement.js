import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

/* 
  vNode를 정규화 한 다음,
  createElement로 노드를 만들고,
  container에 삽입한 후,
  이벤트를 등록합니다.
*/

let prevVNode = new WeakMap();

export function renderElement(vNode, container) {
  const newNode = normalizeVNode(vNode);

  if (prevVNode.has(container)) {
    // 이미 존재하는 경우에는 replaceWith로 기존 DOM을 교체.
    updateElement(container, newNode, prevVNode.get(container));
  } else {
    // 최초 렌더링시에는 createElement로 DOM을 생성.
    container.append(createElement(newNode));
  }
  // 렌더링이 완료되면 container에 이벤트를 등록.
  setupEventListeners(container);
  prevVNode.set(container, newNode);
}
