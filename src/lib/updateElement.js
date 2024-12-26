import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

/**
 * 요소의 속성을 업데이트하는 함수
 * @param {Element} target - 속성을 업데이트할 DOM 요소
 * @param {Object} originNewProps - 새로운 속성
 * @param {Object} originOldProps - 기존 속성
 */
function updateAttributes(target, originNewProps, originOldProps) {
  // 이전 속성의 이벤트 삭제
  if (originOldProps) {
    Object.keys(originOldProps).forEach((key) => {
      if (key.startsWith("on")) {
        const eventType = key.slice(2).toLowerCase();
        removeEvent(target, eventType);
      }
    });
  }

  // 새로운 속성 처리
  if (originNewProps) {
    Object.entries(originNewProps).forEach(([key, value]) => {
      const oldPropsValue = originOldProps ? originOldProps[key] : undefined;

      if (key === "className") {
        if (value !== oldPropsValue) {
          target.classList = value;
        }
      } else if (key.startsWith("on")) {
        const eventType = key.slice(2).toLowerCase();

        addEvent(target, eventType, value);
      } else {
        target.setAttribute(key, value);
      }
    });
  }
}

/**
 * 새로운 노드와 기존 노드를 비교하여 DOM을 업데이트하는 함수
 * @param {Element} parentElement - 업데이트할 부모 요소
 * @param {VNode} newNode - 새로운 가상 DOM 노드
 * @param {VNode} oldNode - 기존 가상 DOM 노드
 * @param {number} index - 현재 인덱스 (디폴트: 0)
 */
export function updateElement(parentElement, newNode, oldNode, index = 0) {
  // 새로운 노드가 없고, 이전 노드가 있으면 해당 요소를 삭제
  if (!newNode && oldNode) {
    parentElement.removeChild(parentElement.childNodes[index]);

    return;
  }

  // 이전 노드가 없고, 새로운 노드가 있으면 추가
  if (newNode && !oldNode) {
    const newElement = createElement(newNode);
    parentElement.append(newElement);

    return;
  }

  // 문자열이므로 내용이 달라졌을 때만 업데이트
  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (newNode !== oldNode) {
      parentElement.childNodes[index].textContent = newNode;
    }
    return;
  }

  // 노드 타입이 다르면 새 노드를 추가
  if (newNode.type !== oldNode.type) {
    const newElement = createElement(newNode);
    const oldElement = parentElement.childNodes[index];

    if (oldElement) {
      parentElement.replaceChild(newElement, oldElement);
    } else {
      parentElement.appendChild(newElement);
    }
    return;
  }

  // 기존 노드와 새로운 노드의 자식 업데이트
  const element = parentElement.childNodes[index];
  const newChildren = newNode.children || [];
  const oldChildren = oldNode.children || [];
  const maxLength = Math.max(newChildren.length, oldChildren.length);

  // 속성 업데이트
  updateAttributes(element, newNode.props, oldNode.props);

  // 자식 요소 재귀적으로 업데이트
  for (let i = 0; i < maxLength; i++) {
    updateElement(element, newChildren[i], oldChildren[i], i);
  }
}
