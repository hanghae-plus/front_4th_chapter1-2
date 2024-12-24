import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
// import { updateElement } from "./updateElement";

export function renderElement(vNode, container) {
  const componentData = vNode.type; // 컴포넌트를 담아서
  const normalNode = normalizeVNode(componentData); // 정규화 한 다음에 : 발사
  const elCreated = createElement(normalNode); // createElement로 노드를 만들고
  container.appendChild(elCreated); // container에 삽입하며
  setupEventListeners(container); // 마지막으로 이벤트를 등록합니다
}
