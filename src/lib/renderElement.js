import { createElement } from "./createElement";
import { setupEventListeners } from "./eventManager";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

const initializedContainers = new WeakSet();
const previousVNodes = new WeakMap();

export function renderElement(vNode, container) {
  // 최초 한 번만 이벤트 리스너 설정
  if (!initializedContainers.has(container)) {
    setupEventListeners(container);
    initializedContainers.add(container);
  }

  const normalizedNewVNode = normalizeVNode(vNode);
  const prevVNode = previousVNodes.get(container);

  if (!prevVNode) {
    // 최초 렌더링
    console.log("최초 렌더링");
    container.appendChild(createElement(normalizedNewVNode));
  } else {
    // diff 알고리즘을 통한 업데이트
    console.log("두번째부터는 업데이트");
    updateElement(container, normalizedNewVNode, prevVNode, 0);
  }

  // 현재 vNode를 저장
  previousVNodes.set(container, normalizedNewVNode);
}
