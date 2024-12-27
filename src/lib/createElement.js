import { normalizeVNode } from "./normalizeVNode";
import { addEvent } from "./eventManager";

export function createElement(vNode) {
  // 컴포넌트 타입 체크 (정규화 전에 먼저 체크)
  if (vNode && typeof vNode === "object" && typeof vNode.type === "function") {
    throw new Error("Component should be normalized before createElement");
  }

  // vNode 정규화
  vNode = normalizeVNode(vNode);

  // 배열 처리
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((child) => {
      fragment.appendChild(createElement(child));
    });
    return fragment;
  }

  // 문자열이나 숫자인 경우 텍스트 노드 생성
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(vNode);
  }

  // HTML 요소 생성
  const $el = document.createElement(vNode.type);

  // 속성 업데이트
  updateAttributes($el, vNode.props);

  // 이벤트 속성 처리
  Object.entries(vNode.props || {}).forEach(([key, value]) => {
    if (key.startsWith("on")) {
      addEvent($el, key.toLowerCase().slice(2), value);
    }
  });

  // 자식 요소들을 재귀적으로 생성하고 추가
  vNode.children?.forEach((child) => {
    $el.appendChild(createElement(child));
  });

  return $el;
}

function updateAttributes($el, props = {}) {
  Object.entries(props || {}).forEach(([key, value]) => {
    if (key === "className") {
      $el.setAttribute("class", value);
    } else if (key === "htmlFor") {
      $el.setAttribute("for", value);
    } else if (!key.startsWith("on")) {
      $el.setAttribute(key, value);
    }
  });
}
