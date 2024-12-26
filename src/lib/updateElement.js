import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, originNewProps, originOldProps) {}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  // 노드 제거 (newNode가 없고 oldNode가 있는 경우)
  // 새 노드 추가 (newNode가 있고 oldNode가 없는 경우)
  // 텍스트 노드 업데이트
  // 노드 교체 (newNode와 oldNode의 타입이 다른 경우)
  // 같은 타입의 노드 업데이트
  parentElement.replaceChildren(createElement(newNode));
}
