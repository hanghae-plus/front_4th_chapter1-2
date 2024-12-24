import { addEvent } from "./eventManager";

import { isString } from "../utils/isString";
import { isValid } from "../utils/isValid";

/**
 * 가상 노드(vNode)를 실제 DOM 노드로 생성하는 함수
 * @description
 * 1. 가상 노드에 대한 유효성 검사 후 유효하지 않을 경우 빈 텍스트 노드 생성
 * 2. 가상 노드가 문자열 또는 숫자인 경우 텍스트 노드로 생성
 * 3. 가상 노드가 배열인 경우 fragment로 감싸서 생성
 * 4. 그 외의 경우 createElement 함수를 통해 DOM 노드 생성
 * 4-1. 속성 업데이트
 * 4-2. 자식 노드 생성
 * @param {*} vNode 가상 노드
 * @returns {HTMLElement|Text|DocumentFragment} DOM 노드
 */
export function createElement(vNode) {
  if (!isValid(vNode)) {
    return document.createTextNode("");
  }
  if (isString(vNode)) {
    return document.createTextNode(vNode);
  }

  if (Array.isArray(vNode) && vNode.length > 1) {
    return createFragmentWithArray(vNode);
  }

  const $el = document.createElement(vNode.type);

  if (vNode.props && Object.keys(vNode.props).length > 0) {
    updateAttributes($el, vNode.props);
  }

  if (vNode.children) {
    vNode.children.forEach((child) => {
      const $child = createElement(child);
      $el.appendChild($child);
    });
  }

  return $el;
}

/**
 * DOM 엘리먼트의 속성을 업데이트하는 함수
 * @description 업데이트할 속성을 반복문을 통해 순회하며 업데이트
 * 1. className 속성은 class로 변경
 * 2. on으로 시작하는 속성은 이벤트 핸들러로 등록
 * 3. 그 외의 속성은 setAttribute로 업데이트
 * @param {*} $el DOM 엘리먼트
 * @param {*} props 업데이트할 속성
 */
function updateAttributes($el, props) {
  Object.entries(props).forEach(([key, value]) => {
    if (key === "className") {
      $el.setAttribute("class", value);
      return;
    }
    if (key.startsWith("on")) {
      const event = key.slice(2).toLowerCase();
      addEvent($el, event, value);
      return;
    }
    $el.setAttribute(key, value);
  });
}

/**
 * 배열 형태의 vNode를 받을 경우 fragment로 감싸서 반환
 * @param {*} vNode
 * @returns {DocumentFragment} fragment
 */
function createFragmentWithArray(vNode) {
  const fragment = document.createDocumentFragment();
  vNode.forEach((node) => {
    const $el = createElement(node);
    fragment.appendChild($el);
  });
  return fragment;
}
