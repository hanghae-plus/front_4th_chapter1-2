import { addEvent } from "./eventManager";

export function createElement(vNode) {
  //1. falsy값 처리
  if (vNode === undefined || vNode === null || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  // 2. 텍스트 노드 처리
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(String(vNode));
  }

  // 3. 배열이면 DocumentFragment로 생성하고 재귀 호출하여 추가
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((child) => {
      const childNode = createElement(child); // 재귀적으로 처리
      fragment.appendChild(childNode); // 유효한 노드만 추가
    });
    return fragment;
  }

  // 4. 함수형 컴포넌트 처리
  if (typeof vNode.type === "function") {
    const componentVNode = vNode.type({
      ...(vNode.props || {}),
      children: vNode.children,
    });
    return createElement(componentVNode); // 반환된 VNode를 재귀적으로 처리
    // throw new Error("Unsupported component type"); // 주석해제하면 chapter1-2 basic 테스트는 통과 chater1-1 basic 테스트는 실패
  }

  // 5. DOM 요소 처리
  // if (typeof vNode === "object" && vNode.type) {
  const { type, props = {}, children = [] } = vNode;
  const $el = document.createElement(type);

  // 5.1 속성 노드 처리
  updateAttributes($el, props);

  // 5.2 자식 노드 처리
  const childNodes = Array.isArray(children) ? children : [children];
  childNodes.forEach((child) => {
    const childNode = createElement(child);
    if (childNode) $el.appendChild(childNode);
  });

  return $el;
  // }
}

//
function updateAttributes($el, props) {
  // props가 없으면 아무것도 없다는 것을 고려하지 않아서 계속 오류가 났었음...
  if (!props) return $el;

  Object.entries(props).forEach(([key, value]) => {
    // 이벤트
    if (key.startsWith("on") && typeof value === "function") {
      const eventType = key.slice(2).toLowerCase(); // "onClick" -> "click"
      addEvent($el, eventType, value);
    } else if (key === "className") {
      $el.className = value; // className -> class
    } else if (key.startsWith("data-")) {
      $el.setAttribute(key, value); // data-* 속성 처리
    } else if (typeof value === "boolean") {
      // 불리언 속성 처리
      $el[key] = value; // DOM 속성으로 반영
    } else if (value === null || value === undefined) {
      // null 또는 undefined 속성은 제거
      $el.removeAttribute(key);
    } else {
      $el.setAttribute(key, value); // 일반 속성 처리
    }
  });
}
