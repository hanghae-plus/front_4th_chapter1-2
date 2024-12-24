import { addEvent } from "./eventManager";

// 속성 업데이트 함수
function updateAttributes($el, props) {
  if (!props) return;

  Object.entries(props).forEach(([key, value]) => {
    // 이벤트 리스너 처리 (onClick 등)
    if (key.startsWith("on") && typeof value === "function") {
      const eventType = key.slice(2).toLowerCase();
      addEvent($el, eventType, value);
    }
    // className 처리
    else if (key === "className") {
      $el.className = value;
    }
    // 일반 속성 처리
    else {
      $el.setAttribute(key, value);
    }
  });
}

// vNode를 실제 DOM으로 변환하는 함수
export function createElement(vNode) {
  // null, undefined, boolean -> 빈 텍스트 노드
  if (vNode == null || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  // 문자열, 숫자 -> 텍스트 노드
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(String(vNode));
  }

  // 배열 -> DocumentFragment
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((child) => {
      const childElement = createElement(child);
      fragment.appendChild(childElement);
    });
    return fragment;
  }

  // DOM 요소 생성
  const $el = document.createElement(vNode.type);

  // 속성 적용
  updateAttributes($el, vNode.props);

  // 자식 요소 추가
  if (vNode.children) {
    vNode.children.forEach((child) => {
      const childElement = createElement(child);
      $el.appendChild(childElement);
    });
  }

  return $el;
}
