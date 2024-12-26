import { addEvent } from "./eventManager";

/**
 * 주어진 속성(props)을 요소($el)에 적용하는 함수
 * @param {Element} $el - 속성을 적용할 DOM 요소
 * @param {Object} props - 적용할 속성들
 */
function updateAttributes($el, props) {
  for (const key in props) {
    const value = props[key];

    // 이벤트 리스너 처리 (onClick, onChange 등)
    if (key.startsWith("on") && typeof value === "function") {
      const event = key.slice(2).toLowerCase();
      addEvent($el, event, value);
    }
    // 클래스 처리
    else if (key === "className") {
      $el.setAttribute("class", value);
    }
    // 일반 속성 처리
    else if (value !== null) {
      $el.setAttribute(key, value);
    }
  }
}

/**
 * 주어진 가상 DOM 노드(vNode)를 실제 DOM 요소로 변환하는 함수
 * @param {VNode} vNode - 변환할 가상 DOM 노드
 * @returns {Element|Text} - 생성된 DOM 요소 또는 텍스트 노드
 */
export function createElement(vNode) {
  // null, undefined, boolean 처리 → 빈 텍스트 노드 반환
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  // 문자열 또는 숫자 → 텍스트 노드 생성
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(String(vNode));
  }

  // 배열 처리 → DocumentFragment로 래핑
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((child) => {
      fragment.appendChild(createElement(child));
    });

    return fragment;
  }

  // 객체 타입 처리 → 실제 DOM 요소 생성
  if (typeof vNode === "object" && vNode.type) {
    const $el = document.createElement(vNode.type);

    // 속성 적용
    updateAttributes($el, vNode.props);

    // 자식 재귀적으로 추가
    if (vNode.children) {
      const normalizedChildren = Array.isArray(vNode.children)
        ? vNode.children
        : [vNode.children];

      normalizedChildren.forEach((child) => {
        $el.appendChild(createElement(child));
      });
    }

    return $el;
  }

  // 잘못된 vNode 타입 처리
  throw new Error(`Invalid vNode type: ${typeof vNode}`);
}
