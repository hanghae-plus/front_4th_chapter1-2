import { addEvent } from "./eventManager";

export function createElement(vNode) {
  //1. 기본값 처리 (null, undefined, boolean)
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  //2. 문자열이나 숫자 처리
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(vNode);
  }

  //3. 배열 처리
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((child) => {
      fragment.appendChild(createElement(child));
    });

    return fragment;
  }

  //4. 객체 처리(Babel이 JSX를 변환한 결과로 객체가 들어오기 때문에)
  const $el = document.createElement(vNode.type);
  //5. props 처리. 여기 아직 이해 다 못함
  if (vNode.props) {
    Object.entries(vNode.props).forEach(([key, value]) => {
      if (key === "className") {
        $el.setAttribute("class", value);
      } else if (key.startsWith("on")) {
        addEvent($el, key.toLowerCase().slice(2), value);
      } else {
        $el.setAttribute(key, value);
      }
    });
  }
  // 2. 자식 요소들을 순회하면서 재귀적으로 처리
  vNode.children.forEach((child) => {
    // 각 자식 요소도 createElement를 통해 실제 DOM 요소로 변환
    // 변환된 자식 요소를 부모 요소에 추가
    $el.appendChild(createElement(child));
  });
  return $el;
}

// function updateAttributes($el, props) {}
