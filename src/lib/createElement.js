import { addEvent } from "./eventManager";

export function createElement(vNode) {
  // 예외처리 로직
  if (vNode === null || vNode === undefined || typeof vNode === "boolean")
    return document.createTextNode("");
  if (typeof vNode === "string" || typeof vNode === "number")
    return document.createTextNode(vNode.toString());

  // 요소가 배열로 들어올 때,
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((child) => {
      const childElement = createElement(child);
      fragment.appendChild(childElement);
    });

    return fragment;
  }

  const { type, props, children } = vNode;
  const $el = document.createElement(type);

  Object.entries(props || {}).forEach(([k, v]) => {
    k.startsWith("on")
      ? addEvent($el, k, v) // 이벤트를 저장한다
      : k === "className" // setAttribute : 속성을 설정하는 메서드, k : 속성 이름, v : 속성 값
        ? $el.setAttribute("class", v)
        : $el.setAttribute(k, v); // 일반 속성 처리
  });

  // children 처리
  if (Array.isArray(children)) {
    children
      .filter(
        (child) =>
          child !== undefined &&
          child !== null &&
          child !== false &&
          child !== true,
      )
      .map(createElement)
      .forEach((child) => $el.appendChild(child)); // 자식 노드를 부모 노드에 추가
  }

  return $el;
}

// function updateAttributes($el, props) {
//   console.log($el, props)
// }
