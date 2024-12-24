import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
// import { updateElement } from "./updateElement";

/* 
  vNode를 정규화 한 다음에
  createElement로 노드를 만들고
  container에 삽입하고
  이벤트를 등록합니다.
*/

let prevVNode = new WeakMap();

export function renderElement(vNode, container) {
  const newNode = normalizeVNode(vNode);

  if (prevVNode.has(container)) {
    // 이미 존재하는 경우에는 replaceWith로 기존 DOM을 교체한다.
    container.firstChild.replaceWith(createElement(newNode));
  } else {
    // 최초 렌더링시에는 createElement로 DOM을 생성한다.
    container.append(createElement(newNode));
  }
  // 렌더링이 완료되면 container에 이벤트를 등록한다.
  setupEventListeners(container);
  prevVNode.set(container, newNode);
}
